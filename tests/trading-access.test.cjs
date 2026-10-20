const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(path, dependencies) {
  const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    exports: module.exports,
    module,
    require(name) {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  }, { filename: path });
  return module.exports;
}

test('Deriv status waits for session restoration and starts after login', () => {
  let state = { status: 'loading', user: null };
  let options;
  const hook = load('src/hooks/useDerivStatus.ts', {
    '@tanstack/react-query': { useQuery: (input) => { options = input; return { isLoading: false }; } },
    '@/stores/authStore': { useAuthStore: (select) => select(state) },
    '@/services/api/endpoints/trading/trading': {
      derivAccountStatus: () => {}, getDerivAccountStatusQueryKey: () => ['/deriv/status'],
    },
  });
  assert.equal(hook.useDerivStatus().isLoading, true);
  assert.equal(options.enabled, false);
  state = { status: 'anonymous', user: null };
  hook.useDerivStatus();
  assert.equal(options.enabled, false);
  state = { status: 'authenticated', user: { id: 'user-a' } };
  hook.useDerivStatus();
  assert.equal(options.enabled, true);
  assert.equal(options.queryKey.at(-1), 'user-a');
  state.user = { id: 'user-b' };
  hook.useDerivStatus();
  assert.equal(options.queryKey.at(-1), 'user-b');
});

test('package access distinguishes demo, real, manual and expired access', () => {
  let catalog;
  const hook = load('src/hooks/useToolTradingAccess.ts', {
    './useCommerce': { useCommerce: () => catalog },
  });
  const access = (tool, capabilities, allowed = true) => {
    catalog = { isSuccess: true, data: { tools: [{ id: tool, access: { allowed, capabilities } }] } };
  };
  for (const tool of ['dbot', 'autohub']) {
    access(tool, ['bot_demo']);
    assert.equal(hook.useToolTradingAccess(tool, true).allowed, true);
    assert.equal(hook.useToolTradingAccess(tool, false).allowed, false);
    assert.match(hook.useToolTradingAccess(tool, false).message, /demo trading/);
    access(tool, ['bot_demo', 'bot_real']);
    assert.equal(hook.useToolTradingAccess(tool, false).allowed, true);
    access(tool, ['bot_demo', 'bot_real'], false);
    assert.equal(hook.useToolTradingAccess(tool, true).allowed, false);
  }
  access('dtrader', ['manual_trade']);
  assert.equal(hook.useToolTradingAccess('dtrader', true).allowed, true);
  assert.equal(hook.useToolTradingAccess('dtrader', false).allowed, true);
  catalog.isLoading = true;
  assert.equal(hook.useToolTradingAccess('dtrader', false).allowed, false);
  access('dtrader', ['bot_real']);
  assert.equal(hook.useToolTradingAccess('dtrader', false).allowed, false);
  catalog = { isLoading: true, isSuccess: false };
  assert.equal(hook.useToolTradingAccess('dtrader', true).allowed, false);
  catalog = { isError: true, isSuccess: false, data: { tools: [] } };
  assert.match(hook.useToolTradingAccess('dbot', true).message, /Unable to verify/);
});

test("team restrictions compare login UUIDs per capability and preserve independent access", () => {
  let grants = [
    {
      source: "team",
      capabilities: ["bot_real", "bot_demo"],
      deriv_client_id: "aabb-uuid",
    },
  ];
  const hook = load("src/hooks/useToolTradingAccess.ts", {
    "./useCommerce": {
      useCommerce: () => ({
        isSuccess: true,
        data: {
          tools: [
            {
              id: "autohub",
              access: {
                allowed: true,
                capabilities: ["bot_real", "bot_demo"],
                grants,
              },
            },
          ],
        },
      }),
    },
  });
  assert.equal(hook.useToolTradingAccess("autohub", false).allowed, false);
  assert.equal(
    hook.useToolTradingAccess("autohub", false, "other").allowed,
    false,
  );
  assert.match(
    hook.useToolTradingAccess("autohub", false, "other").message,
    /Team package requires/,
  );
  assert.equal(
    hook.useToolTradingAccess("autohub", false, "AABB-UUID").allowed,
    true,
  );
  grants.push({ source: "purchase", capabilities: ["bot_demo"] });
  assert.equal(
    hook.useToolTradingAccess("autohub", true, "other").allowed,
    true,
  );
  assert.equal(
    hook.useToolTradingAccess("autohub", false, "other").allowed,
    false,
  );
  grants = [
    {
      source: "team",
      capabilities: ["bot_real", "bot_demo"],
      deriv_client_id: null,
    },
  ];
  assert.equal(hook.useToolTradingAccess("autohub", false).allowed, true);
});
