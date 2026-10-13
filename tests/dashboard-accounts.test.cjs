const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
function load(path, deps = {}) {
  const source = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2021,
    },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module,
    exports: module.exports,
    require: (name) => {
      assert.ok(name in deps, name);
      return deps[name];
    },
  });
  return module.exports;
}
const { accountBalanceText, balanceReportedAt } = load(
  "src/components/deriv/balancePresentation.ts",
);
test("account balances preserve small amounts and never invent an unknown zero", () => {
  assert.equal(
    accountBalanceText({ balance: "10.49000000", currency: "USD" }),
    "10.49 USD",
  );
  assert.equal(
    accountBalanceText({ balance: "0", currency: "USD" }),
    "0.00 USD",
  );
  assert.equal(
    accountBalanceText({ balance: "0.00000001", currency: "BTC" }),
    "0.00000001 BTC",
  );
  assert.equal(
    accountBalanceText({ balance: "9007199254740993.01", currency: "USD" }),
    "9,007,199,254,740,993.01 USD",
  );
  for (const balance of [undefined, "", "NaN", "1e-5"])
    assert.equal(
      accountBalanceText({ balance, currency: "USD" }),
      "Balance unavailable",
    );
  assert.equal(balanceReportedAt("invalid"), "Update time unavailable");
});
test("balance snapshots ask the server for fresh data and isolate accounts by user", () => {
  let state = { user: { id: "user-a" } };
  let linked = true;
  let options;
  let params;
  const hook = load("src/hooks/useDerivAccounts.ts", {
    "./useDerivStatus": { useDerivStatus: () => ({ linked }) },
    "@/stores/authStore": { useAuthStore: (selector) => selector(state) },
    "@/services/api/endpoints/trading/trading": {
      getDerivListAccountsQueryKey: (input) => ["accounts", input],
      useDerivListAccounts: (input, config) => {
        params = input;
        options = config.query;
        return {};
      },
    },
  });
  hook.useDerivAccounts();
  assert.equal(params.refresh, true);
  assert.equal(options.enabled, true);
  assert.equal(options.queryKey.at(-1), "user-a");
  assert.equal(options.refetchInterval, 15000);
  state = { user: { id: "user-b" } };
  hook.useDerivAccounts();
  assert.equal(options.queryKey.at(-1), "user-b");
  linked = false;
  hook.useDerivAccounts();
  assert.equal(options.enabled, false);
  linked = true;
  hook.useDerivAccounts(false);
  assert.equal(options.enabled, false);
  assert.equal(options.refetchInterval, false);
  state = { user: null };
  hook.useDerivAccounts();
  assert.equal(options.enabled, false);
});
