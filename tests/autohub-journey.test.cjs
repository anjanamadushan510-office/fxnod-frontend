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
const runState = load("src/components/autohub/runState.ts", {
  "@/services/api/model": {
    BotStartConflictCode: {
      deriv_app_consent_required: "deriv_app_consent_required",
    },
  },
});
const {
  runNeedsUpdates,
  canRepeatRun,
  repeatValues,
  repeatRunHref,
  entriesNeedUpdates,
} = load("src/components/autohub/journey.ts", { "./runState": runState });
const bot = {
  bot_id: "example",
  presets: [],
  max_markets: 2,
  excluded_symbols: ["blocked"],
  allowed_symbols: ["R_100", "R_50"],
  default_stake: "1",
  default_stop_loss: "10",
  default_take_profit: "5",
  settings: [
    { key: "window", type: "integer", default: 20 },
    {
      key: "mode",
      type: "choice",
      default: "steady",
      choices: [{ value: "steady" }],
    },
    { key: "shadow", type: "boolean", default: true },
  ],
};
const run = {
  bot_id: "example",
  run_id: "run-1",
  status: "completed",
  trades_open: 0,
  currency: "USD",
  symbols: ["R_100", "retired", "blocked", "R_50"],
  stake: "2",
  stop_loss: "15",
  take_profit: "7",
  settings: { window: 30, mode: "old-choice", shadow: false },
};
test("repeat is unavailable until all trades have settled", () => {
  for (const status of ["pending", "running", "paused", "stopping"]) {
    assert.equal(canRepeatRun({ ...run, status }), false);
    assert.equal(runNeedsUpdates({ ...run, status }), true);
  }
  assert.equal(canRepeatRun(run), true);
  assert.equal(runNeedsUpdates(run), false);
  assert.equal(canRepeatRun({ ...run, trades_open: 1 }), false);
  assert.equal(
    runNeedsUpdates({ ...run, status: "failed", trades_open: 1 }),
    true,
  );
  assert.equal(canRepeatRun({ ...run, status: "unknown" }), false);
});
test("repeat copies current supported markets and settings without selecting a money plan", () => {
  const result = repeatValues(bot, run, "USD");
  assert.equal(result.symbols.join(","), "R_100,R_50");
  assert.equal(result.settings.window, "30");
  assert.equal(result.settings.mode, "steady");
  assert.equal(result.settings.shadow, false);
  assert.equal(result.stake, "2");
  assert.equal(result.stopLoss, "15");
  assert.equal(result.preset, "");
  assert.equal(repeatValues(bot, { ...run, bot_id: "other" }, "USD"), null);
  assert.equal(repeatValues(bot, { ...run, status: "running" }, "USD"), null);
});
test("account currency changes reset monetary values rather than convert old amounts", () => {
  const result = repeatValues(bot, run, "EUR");
  assert.equal(result.stake, "1");
  assert.equal(result.stopLoss, "10");
  assert.equal(result.takeProfit, "5");
});
test("run again leads to reviewable setup without a start command or risk consent", () => {
  assert.equal(repeatRunHref(run), "/autohub/bots/example?from_run=run-1");
  const result = repeatValues(bot, run, "USD");
  assert.equal("risk_acknowledged" in result, false);
});

test("late final entries keep refreshing until scored, including void shadows", () => {
  const { entriesNeedUpdates } = load("src/components/autohub/journey.ts", {
    "./runState": runState,
  });
  assert.equal(entriesNeedUpdates([{ outcome: "won" }, {}]), true);
  assert.equal(
    entriesNeedUpdates([
      { outcome: "won" },
      { outcome: "lost" },
      { outcome: "void" },
    ]),
    false,
  );
  assert.equal(entriesNeedUpdates(undefined), false);
});

test("run screen fetches final entries, scopes caches and continues settlement polling", () => {
  let userId = "user-a";
  let runOptions;
  let entryOptions;
  const invalidations = [];
  const elements = [];
  const currentRun = {
    ...run,
    bot_name: "Example",
    deriv_account_id: "VRTC123",
    is_virtual: true,
    realized_pnl: "0",
    total_staked: "1",
    trades_total: 1,
    trades_won: 0,
    trades_lost: 1,
    created_at: "2026-10-13T05:00:00Z",
  };
  const jsx = (type, props) => {
    const element = { type, props };
    elements.push(element);
    return element;
  };
  // Transpile TSX, retaining the actual page's query and settlement effects.
  const source = ts.transpileModule(
    fs.readFileSync("src/app/(dashboard)/autohub/runs/[id]/page.tsx", "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2021,
        jsx: ts.JsxEmit.ReactJSX,
      },
    },
  ).outputText;
  const feedback = () => null;
  const deps = {
    "react/jsx-runtime": { jsx, jsxs: jsx },
    react: { useMemo: (fn) => fn(), useEffect: (fn) => fn() },
    "next/link": () => null,
    "next/navigation": { useParams: () => ({ id: "run-1" }) },
    "@tanstack/react-query": {
      useQueryClient: () => ({
        invalidateQueries: (options) => {
          invalidations.push(options.queryKey);
          return Promise.resolve();
        },
      }),
    },
    sonner: { toast: { error: () => {}, success: () => {} } },
    "@/stores/authStore": {
      useAuthStore: (select) => select({ user: { id: userId } }),
    },
    "@/components/autohub/BotJourney": { BotJourney: () => null },
    "@/components/autohub/RunFeedback": { RunFeedback: feedback },
    "@/components/autohub/journey": {
      runNeedsUpdates,
      entriesNeedUpdates: (entries) => (entries ?? []).some((e) => !e.outcome),
    },
    "@/components/autohub/ShadowGauge": { ShadowGauge: () => null },
    "@/components/autohub/pieces": {
      AccountBadge: () => null,
      LaneChip: () => null,
      Meter: () => null,
      Stat: () => null,
      StatusBadge: () => null,
    },
    "@/components/autohub/runState": runState,
    "@/components/bot/EmergencyStopButton": { EmergencyStopButton: () => null },
    "@/components/options/market/marketStore": {
      useMarketStore: (select) => select({ allMarkets: [] }),
    },
    "@/lib/cn": { cn: (...parts) => parts.join(" ") },
    "@/lib/decimal": { decimalSign: () => 0, formatMoney: (x) => x },
    "@/lib/apiError": { parseApiError: () => ({ message: "Error" }) },
    "@/services/api/endpoints/auto-hub/auto-hub": {
      getGetAutoHubRunQueryKey: (id) => ["run", id],
      getListAutoHubRunsQueryKey: () => ["runs"],
      getListAutoHubRunEntriesQueryKey: (id, params) => [
        "entries",
        id,
        ...(params ? [params] : []),
      ],
      useGetAutoHubRun: (_, options) => {
        runOptions = options.query;
        return {
          data: currentRun,
          isPending: false,
          isError: true,
          dataUpdatedAt: 1,
        };
      },
      useListAutoHubRunEntries: (_, __, options) => {
        entryOptions = options.query;
        return { data: { entries: [] }, isPending: false, isError: false };
      },
      useStopAutoHubRun: () => ({ isPending: false }),
      useForceStopAutoHubRun: () => ({ isPending: false }),
    },
  };
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module,
    exports: module.exports,
    require: (name) => {
      assert.ok(name in deps, name);
      return deps[name];
    },
  });
  module.exports.default();
  assert.equal(runOptions.queryKey.at(-1), "user-a");
  assert.equal(entryOptions.queryKey.at(-1), "user-a");
  assert.ok(invalidations.some((key) => key[0] === "entries"));
  assert.equal(
    runOptions.refetchInterval({
      state: { data: { status: "failed", trades_open: 1 } },
    }),
    2000,
  );
  assert.equal(
    runOptions.refetchInterval({ state: { data: currentRun } }),
    false,
  );
  assert.equal(
    entryOptions.refetchInterval({ state: { data: { entries: [{}] } } }),
    2000,
  );
  assert.equal(
    entryOptions.refetchInterval({
      state: { data: { entries: [{ outcome: "won" }] } },
    }),
    false,
  );
  assert.ok(
    elements.some((element) => element.type === feedback),
    "stale data is retained when a background refresh fails",
  );
  userId = "user-b";
  module.exports.default();
  assert.equal(runOptions.queryKey.at(-1), "user-b");
});
