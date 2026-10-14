const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');
function load(file, dependencies) {
  const module = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, { module, exports: module.exports, crypto,
    require: (name) => { assert.ok(name in dependencies, name); return dependencies[name]; },
  });
  return module.exports;
}
function positionsStore() {
  return load('src/stores/useOpenPositions.ts', {
    zustand: require('zustand'),
    '@/stores/useTradeOverlays': { useTradeOverlays: { getState: () => ({ removeOverlay() {}, clearAll() {} }) } },
  }).useOpenPositions;
}
const frame = (status = 'open', extra = {}) => ({
  contract_id: '123', market_id: '1HZ100V', contract_type: 'CALL', stake: '10',
  profit: status === 'won' ? '9.01' : '-0.5', status, updated_at: 100,
  ...extra,
});
const buy = { contractId: '123', marketId: '1HZ100V', marketName: 'Volatility 100',
  contractType: 'rise_fall', side: 'rise', stake: 10, contractValue: 10, payout: 19.01 };

test('broker-first update then buy confirmation produces one position and preserves live data', () => {
  const store = positionsStore();
  store.getState().applyUpdate(frame('open', { bid_price: '9.5' }));
  store.getState().add(buy);
  store.getState().add(buy);
  assert.equal(store.getState().positions.length, 1);
  assert.equal(store.getState().positions[0].pnl, -0.5);
  assert.equal(store.getState().positions[0].contractValue, 9.5);
});

test('one-tick settlement before HTTP reply is retained, never reopened by late updates', () => {
  const store = positionsStore();
  store.getState().markClosed(frame('won', { bid_price: '19.01', updated_at: 102 }));
  store.getState().add(buy);
  store.getState().applyUpdate(frame('open', { updated_at: 103 }));
  store.getState().applySnapshot([frame('open')]);
  const result = store.getState().positions;
  assert.equal(result.length, 1);
  assert.equal(result[0].outcome, 'won');
  assert.equal(result[0].pnl, 9.01);
  assert.equal(result[0].contractValue, 19.01);
});

test('wire tick_stream and broker timestamps update immediately without stale P/L regression', () => {
  const store = positionsStore();
  store.getState().add(buy);
  store.getState().applyUpdate(frame('open', { updated_at: 102, start_time: 90, expiry_time: 110,
    tick_stream: [{ epoch: 100, tick: '1374.2' }], currency: 'EUR', is_valid_to_sell: true }));
  store.getState().applyUpdate(frame('open', { updated_at: 103, profit: '1.5',
    tick_stream: [{ epoch: 100, tick: '1374.3' }, { epoch: 101, tick: '1374.5' }] }));
  store.getState().applyUpdate(frame('open', { updated_at: 101, profit: '0' }));
  const position = store.getState().positions[0];
  assert.equal(position.pnl, 1.5);
  assert.equal(position.tickStream.length, 2);
  assert.equal(position.tickStream[0].tick, '1374.3');
  assert.equal(position.startTime, 90);
  assert.equal(position.expiryTime, 110);
  assert.equal(position.canSell, true);
  assert.equal(position.currency, 'EUR');
});

test('revisiting the same account preserves positions; switching accounts clears them', () => {
  const store = positionsStore();
  store.getState().setScope('user:demo');
  store.getState().add(buy);
  store.getState().setScope('user:demo');
  assert.equal(store.getState().positions.length, 1);
  store.getState().setScope('user:real');
  assert.equal(store.getState().positions.length, 0);
});

test('contract detail uses observed ticks and actual payout instead of fabricated prices', () => {
  const details = load('src/components/options/positions/contractDetail.ts', {
    '@/services/deriv/derivSymbols': { fromDerivSymbol: () => null },
    '@/components/options/market/catalog': { findMarket: () => null },
  });
  const p = { ...buy, id: 'position', pnl: 9.01, outcome: 'won', payout: 19.01,
    startTime: 100, tickStream: [{ epoch: 101, tick: '1374.2' }, { epoch: 102, tick: '1374.5' }] };
  const result = details.simPositionToDetail(p);
  assert.equal(result.payout, 19.01);
  assert.equal(result.ticks.length, 2);
  assert.equal(result.ticks[1].time, 102);
  assert.equal(result.ticks[1].value, 1374.5);
  assert.equal(result.buyTransactionId, 0);
  assert.equal(details.simPositionToDetail({ ...p, tickStream: [] }).ticks.length, 0);
});

test('rapid clicks submit once and execution uses the submitted settings and market', () => {
  const store = positionsStore();
  store.getState().setScope('user:demo');
  const refs = [];
  let index = 0, options, live = { price: 100, marketName: 'Original market' };
  const submitted = [], overlays = [];
  const hook = load('src/hooks/usePanelBuy.ts', {
    react: { useState: () => [null, () => {}], useRef: (value) => refs[index++] ?? (refs[index - 1] = { current: value }) },
    sonner: { toast: { success() {}, error() {} } },
    '@/services/api/endpoints/trading/trading': { usePlaceTrade: (input) => {
      options = input.mutation;
      return { isPending: false, mutate: (input) => submitted.push(input), reset() {} };
    } },
    '@/components/options/market/catalog': { findMarket: () => null },
    '@/services/deriv/derivSymbols': { fromDerivSymbol: (symbol) => symbol },
    '@/stores/useLiveMarket': { useLiveMarket: { getState: () => live } },
    '@/stores/useOpenPositions': { useOpenPositions: store },
    '@/stores/usePositionsUI': { usePositionsUI: { getState: () => ({ setOpen() {}, setTab() {} }) } },
    '@/stores/useTradeOverlays': { useTradeOverlays: { getState: () => ({ addOverlay: (input) => overlays.push(input) }) } },
    './useDerivStatus': { useDerivStatus: () => ({ linked: true, isVirtual: true }) },
    './useToolTradingAccess': { useToolTradingAccess: () => ({ allowed: true, message: null }) },
    './useProposalStream': { useProposalStream: () => ({ proposal: null }) },
    '@/lib/analytics': { trackDtraderTrade() {} },
    '@/components/options/positions/contractDetail': { formatTradeTypeLabel: () => 'Rise' },
  });
  const original = { symbol: 'A', contract_type: 'rise_fall', side: 'rise', stake: '10', duration: 5, duration_unit: 't' };
  const render = (request) => { index = 0; return hook.usePanelBuy(request); };
  const first = render(original);
  first.handleBuy();
  first.handleBuy();
  assert.equal(submitted.length, 1);
  assert.equal(options.retry, false);
  live = { price: 300, marketName: 'Another market' };
  render({ ...original, symbol: 'B', stake: '20', duration: 99 });
  options.onSuccess({ deriv_contract_id: '123', buy_price: '10', payout_amount: '19.01' }, submitted[0]);
  const position = store.getState().positions[0];
  assert.equal(position.marketId, 'A');
  assert.equal(position.marketName, 'Original market');
  assert.equal(position.stake, 10);
  assert.equal(position.status, '5 ticks');
  assert.equal(position.entrySpot, 100);
  assert.equal(overlays[0].strikePrice, 100);
});

test('history reconciliation closes a position when the terminal WebSocket frame was missed', () => {
  const store = positionsStore();
  store.getState().add(buy);
  const hook = load('src/hooks/useTradeHistory.ts', {
    react: { useEffect: (effect) => effect() },
    '@/services/api/endpoints/trading/trading': {
      getGetTradeHistoryQueryKey: () => ['/history'],
      useGetTradeHistory: () => ({ data: [{ deriv_contract_id: '123', outcome: 'won',
        stake_amount: '10', final_payout_amount: '19.01', currency: 'USD' }] }),
    },
    '@/stores/authStore': { useAuthStore: (select) => select({ user: { id: 'user' } }) },
    '@/stores/useOpenPositions': { useOpenPositions: store },
  });
  hook.useTradeHistory();
  assert.equal(store.getState().positions[0].outcome, 'won');
  assert.equal(store.getState().positions[0].pnl, 9.01);
});

test('chart repaint stays bounded for a 100-year expiry and never inserts fake prices', () => {
  const { contractChartData } = load('src/components/options/positions/contractChartData.ts', {});
  const data = contractChartData({ ticks: [{ time: 100, value: 10, kind: 'normal' },
    { time: 100, value: 11, kind: 'normal' }], expiryTime: 100 + 100 * 365 * 86400, duration: 'Open' });
  assert.equal(data.length, 61);
  assert.equal(data[0].value, 11);
  assert.equal(data.slice(1).every((point) => point.value === undefined), true);
  assert.equal(data.at(-1).time, 160);
  assert.equal(contractChartData({ ticks: [], duration: 'Open' }).length, 0);
  assert.equal(contractChartData({ ticks: [{ time: 100, value: 10, kind: 'exit' }], duration: '5 ticks', expiryTime: 999999 }).length, 1);
});
