const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(path, dependencies, globals = {}) {
  const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    exports: module.exports, module,
    require(name) {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
      return dependencies[name];
    }, ...globals,
  }, { filename: path });
  return module.exports;
}
function createStore() {
  return load('src/stores/useAccountBalance.ts', { zustand: require('zustand') }).useAccountBalance;
}

test('multi-account snapshots and switches keep the selected balance isolated', () => {
  const store = createStore();
  const state = () => store.getState();
  state().setOwner('user-a');
  state().selectAccount('VRTC1', 'USD');
  state().setBalance('9914.69000000', 'USD', 'VRTC1', 10);
  state().setBalance('10.49000000', 'USD', 'CR1', 10);
  assert.equal(state().balance, 9914.69);
  state().selectAccount('CR1', 'USD');
  assert.equal(state().balance, 10.49);
  state().setBalance(9900, 'USD', 'VRTC1', 20);
  assert.equal(state().balance, 10.49);
  state().selectAccount('VRTC1');
  assert.equal(state().balance, 9900);
  state().selectAccount('CR2', 'EUR');
  assert.equal(state().balance, null);
  assert.equal(state().currency, 'EUR');
});

test('older REST snapshots and invalid values cannot overwrite live balances', () => {
  const store = createStore();
  store.getState().selectAccount('CR1');
  store.getState().setBalance('12.50', 'USD', 'CR1', 200);
  store.getState().setBalance('10.49', 'USD', 'CR1', 100);
  for (const value of ['', 'invalid', Infinity, null]) {
    store.getState().setBalance(value, 'USD', 'CR1', 300);
  }
  assert.equal(store.getState().balance, 12.5);
  store.getState().setBalance('0', 'USD', 'CR1', 300);
  assert.equal(store.getState().balance, 0);
});

test('balances survive page revisits but are cleared when the signed-in user changes', () => {
  const store = createStore();
  store.getState().setOwner('user-a');
  store.getState().selectAccount('CR1');
  store.getState().setBalance(10.49);
  store.getState().setOwner('user-a');
  store.getState().selectAccount('CR1');
  assert.equal(store.getState().balance, 10.49);
  store.getState().setOwner('user-b');
  assert.equal(store.getState().balance, null);
  assert.equal(Object.keys(store.getState().balances).length, 0);
});

test('account switching discards late socket frames and preserves the new keepalive', () => {
  const store = createStore();
  let account = { accountId: 'VRTC1', linked: true, isLoading: false, currency: 'USD' };
  let userId = 'user-a';
  const refs = [];
  let refIndex = 0, cleanup;
  const sockets = [], intervals = new Set();
  class Socket {
    static OPEN = 1;
    readyState = 1;
    constructor() { sockets.push(this); }
    send() {}
    close() {}
    balance(data) { this.onmessage({ data: JSON.stringify({ type: 'balance', data }) }); }
  }
  const hook = load('src/hooks/usePositionsWebSocket.ts', {
    react: {
      useRef: (initial) => refs[refIndex++] ?? (refs[refIndex - 1] = { current: initial }),
      useState: () => ['idle', () => {}],
      useEffect: (effect) => { if (cleanup) cleanup(); cleanup = effect(); },
    },
    '@/services/positionsStream': { parsePositionsMessage: JSON.parse },
    '@/services/ws': { buildWsUrl: () => 'ws://test.invalid' },
    '@/stores/useOpenPositions': { useOpenPositions: { getState: () => ({ setScope() {} }) } },
    '@/stores/useAccountBalance': { useAccountBalance: store },
    '@tanstack/react-query': { useQueryClient: () => ({ invalidateQueries() {} }) },
    '@/services/api/endpoints/trading/trading': { getGetTradeHistoryQueryKey: () => [] },
    '@/stores/authStore': { useAuthStore: (select) => select({ user: { id: userId } }) },
    '@/hooks/useDerivStatus': { useDerivStatus: () => account },
  }, {
    WebSocket: Socket,
    setInterval: () => { const id = {}; intervals.add(id); return id; },
    clearInterval: (id) => intervals.delete(id),
    setTimeout: () => { throw Error('Retired socket must not reconnect'); },
    clearTimeout() {},
  });
  const render = () => { refIndex = 0; hook.usePositionsWebSocket(); };
  render();
  const demo = sockets[0];
  demo.onopen();
  demo.balance([{ loginid: 'VRTC1', balance: 9914.69 }, { loginid: 'CR1', balance: 10.49 }]);
  assert.equal(store.getState().balance, 9914.69);
  account = { ...account, accountId: 'CR1' };
  render();
  const real = sockets[1];
  real.onopen();
  assert.equal(store.getState().balance, 10.49);
  demo.balance({ balance: 9999 });
  demo.onclose();
  assert.equal(store.getState().balance, 10.49);
  assert.equal(intervals.size, 1);
  real.balance({ balance: '9.49', loginid: 'CR1', currency: 'USD' });
  assert.equal(store.getState().balance, 9.49);
  userId = 'user-b';
  render();
  real.balance({ balance: 1000, loginid: 'CR1' });
  assert.equal(store.getState().balance, null);
  cleanup();
});


test('switch updates status and balance before background refresh finishes, despite a stale selected flag', async () => {
  const store = createStore();
  store.getState().setOwner('user-a');
  store.getState().selectAccount('CR1');
  store.getState().setBalance(10.49, 'USD', 'CR1');
  store.getState().setBalance(9914.69, 'USD', 'VRTC1');
  const demo = { deriv_account_id: 'VRTC1', currency: 'USD', is_virtual: true, is_selected: true };
  const options = [], invalidations = [], notifications = [];
  let status, selection, stateIndex = 0;
  const component = load('src/components/options/layout/AccountSelector.tsx', {
    'react/jsx-runtime': require('react/jsx-runtime'),
    react: {
      useEffect() {}, useRef: () => ({ current: null }),
      useState: () => [stateIndex++ === 0 ? true : null, () => {}],
    },
    '@tanstack/react-query': { useQueryClient: () => ({
      cancelQueries: async () => {},
      setQueryData: (key, update) => { status = update({ linked: true, deriv_account_id: 'CR1' }); },
      invalidateQueries: (input) => { invalidations.push(input); return new Promise(() => {}); },
    }) },
    sonner: { toast: { success: (message) => notifications.push(message), error: assert.fail } },
    '@/components/ui/Icons': { CaretDownIcon: () => null },
    '@/lib/cn': { cn: (...classes) => classes.join(' ') },
    '@/hooks/useDerivStatus': {
      derivStatusKey: ['/status'],
      useDerivStatus: () => ({ accountId: 'CR1', linked: true, currency: 'USD' }),
    },
    '@/services/api/endpoints/trading/trading': {
      getDerivListAccountsQueryKey: (params) => ['/accounts', ...(params ? [params] : [])],
      useDerivListAccounts: (params, input) => {
        options.push(input.query);
        return params ? { isPending: true } : { data: { accounts: [demo] }, isSuccess: true };
      },
      useDerivSelectAccount: () => ({ mutateAsync: async (input) => {
        selection = input.data.deriv_account_id;
        return { linked: true, deriv_account_id: selection, is_virtual: true, currency: 'USD' };
      } }),
    },
    '@/stores/authStore': { useAuthStore: (select) => select({ user: { id: 'user-a' } }) },
    '@/stores/useAccountBalance': { useAccountBalance: Object.assign((select) => select(store.getState()), { getState: store.getState }) },
  });
  const tree = component.AccountSelector({ mode: 'real', balance: 10.49 });
  function find(element) {
    if (!element || typeof element !== 'object') return;
    if (element.props?.role === 'menuitem') return element;
    const children = element.props?.children;
    for (const child of (Array.isArray(children) ? children.flat(Infinity) : [children])) {
      const found = find(child);
      if (found) return found;
    }
  }
  const item = find(tree);
  assert.ok(item, 'cached accounts are available while broker refresh is pending');
  assert.equal(options.every((query) => query.enabled && query.queryKey.at(-1) === 'user-a'), true);
  await item.props.onClick();
  assert.equal(selection, 'VRTC1');
  assert.equal(status.deriv_account_id, 'VRTC1');
  assert.equal(store.getState().balance, 9914.69);
  assert.equal(invalidations.every((input) => input.queryKey), true);
  assert.equal(notifications.length, 1);
});
