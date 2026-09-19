/**
 * Every bot the dBot builder can produce, as the StartBotRunRequests it sends.
 *
 * Built with the builder's own functions (newDraft, withMethod,
 * buildDraftRunRequest), so a case here is byte-for-byte what pressing Start
 * sends. The backend's cmd/botsim then runs each one through the real engine.
 *
 * Coverage is one factor at a time: every method gets a base bot, then each
 * option the builder offers for that method is varied on its own — every side,
 * buy rule, money mode, duration unit and value, indicator, market, digit,
 * barrier, growth rate, multiplier and tick choice.
 *
 * Usage: npx tsx scripts/botMatrix.ts strategies.json > cases.json
 */
import { readFileSync } from "node:fs";
import type { BotStrategy } from "@/services/api/model";
import {
  ENTRY_RULES,
  INDICATOR_OPTIONS,
  METHOD_GROUPS,
  MONEY_OPTIONS,
  findMethod,
  supportedEntryRules,
  supportsAutoDirection,
  type MethodKey,
} from "@/components/bot/builder/catalog";
import {
  buildDraftRunRequest,
  isDigitMethod,
  newDraft,
  tickRangeFor,
  withMethod,
  type BotDraft,
} from "@/components/bot/builder/draft";
import { BARRIER_SCALES, GROWTH_RATES, MULTIPLIER_STEPS, durationPresetsFor, formShapeFor } from "@/components/bot/botMeta";
import { getMarketsForStrategy } from "@/services/deriv/activeSymbols";
import { useMarketStore } from "@/components/options/market/marketStore";
import { getContractsFor } from "@/services/deriv/contractsFor";

/** What the Setup step does when a market's lists arrive: snap to the nearest. */
async function withMarketLists(draft: BotDraft): Promise<BotDraft> {
  const shape = formShapeFor(findMethod(draft.method)!.strategyId!);
  if (!shape.multiplier && !shape.growthRate) return draft;
  const params = await getContractsFor(draft.form.symbols[0]);
  const nearest = (options: number[], v: number) =>
    options.length === 0 || options.includes(v)
      ? v
      : options.reduce((b, o) => (Math.abs(o - v) < Math.abs(b - v) ? o : b), options[0]);
  return patch(draft, {
    multiplier: nearest(params.multiplierRange, draft.form.multiplier),
    growthRate: nearest(params.growthRateRange, draft.form.growthRate),
  });
}

interface Case {
  name: string;
  account: "demo" | "real";
  expect?: "run" | "consent";
  request: unknown;
}

const strategies: BotStrategy[] = JSON.parse(readFileSync(process.argv[2], "utf8")).strategies;

const cases: Case[] = [];
const builderErrors: string[] = [];
const closedMarkets: string[] = [];

function add(name: string, draft: BotDraft, account: "demo" | "real" = "demo", expect?: "consent") {
  const { request, errors } = buildDraftRunRequest(draft, strategies, true);
  if (!request) {
    builderErrors.push(`${name}: ${errors.join("; ")}`);
    return;
  }
  cases.push({ name, account, expect, request });
}

function base(method: MethodKey, market: string): BotDraft {
  const draft = withMethod(newDraft(), method);
  return { ...draft, name: `sim ${method}`, form: { ...draft.form, symbols: [market] } };
}

function patch(draft: BotDraft, form: Partial<BotDraft["form"]>): BotDraft {
  return { ...draft, form: { ...draft.form, ...form } };
}

/** First, middle and last of what the Duration step offers for a unit. */
function sample(values: string[]): string[] {
  return [...new Set([values[0], values[Math.floor(values.length / 2)], values[values.length - 1]])];
}

async function main() {
for (const method of METHOD_GROUPS.flatMap((g) => g.methods)) {
  const key = method.key;
  const strategyId = method.strategyId!;
  const strategy = strategies.find((s) => s.strategy_id === strategyId);
  if (!strategy) {
    builderErrors.push(`${key}: engine has no strategy ${strategyId}`);
    continue;
  }
  const shape = formShapeFor(strategyId);
  // The markets the builder offers for this bot, from Deriv — this also loads
  // the market store that buildDraftRunRequest validates symbols against.
  const { markets, source } = await getMarketsForStrategy(strategyId);
  process.stderr.write(`${key}: ${markets.length} markets (${source})\n`);
  const open = markets.filter((m) => !useMarketStore.getState().findMarket(m)?.closed);
  const b = await withMarketLists(
    base(key, open.includes("1HZ100V") ? "1HZ100V" : open.includes("R_100") ? "R_100" : open[0]),
  );
  const tag = (s: string) => `${key} | ${s}`;

  add(tag("base"), b);

  // Sides.
  if (!method.fixedDirection && shape.sideLabels) {
    add(tag("side down"), patch(b, { direction: "down" }));
  }
  if (supportsAutoDirection(strategy) && !isDigitMethod(key)) {
    add(tag("side auto (RSI)"), { ...patch(b, { direction: "auto" }), indicators: [INDICATOR_OPTIONS[0].defaults] });
  }

  // Buy rules the bot declares.
  const rules = supportedEntryRules(strategy);
  for (const rule of ENTRY_RULES) {
    if (rule.key !== "always" && rules.has(rule.key)) add(tag(`rule ${rule.key}`), { ...b, entryRule: rule.key });
  }

  // Money modes.
  for (const money of MONEY_OPTIONS) {
    if (money.key !== "same") {
      add(tag(`money ${money.key}`), { ...patch(b, { martingaleMultiplier: "2", martingaleMaxSteps: "3" }), money: money.key });
    }
  }

  // Durations.
  const range = tickRangeFor(key);
  if (isDigitMethod(key)) {
    for (const t of ["5", "10"]) add(tag(`ticks ${t}`), patch(b, { duration: t, durationUnit: "t" }));
  } else if (range) {
    for (let t = range[0]; t <= range[1]; t++) add(tag(`ticks ${t}`), patch(b, { duration: String(t), durationUnit: "t" }));
  } else if (shape.duration) {
    // What the Duration step offers for the base market.
    const offered = (await getContractsFor(b.form.symbols[0])).available;
    for (const preset of durationPresetsFor(strategyId, offered)) {
      for (const v of sample(preset.values)) {
        add(tag(`duration ${v}${preset.unit}`), patch(b, { duration: v, durationUnit: preset.unit }));
      }
    }
  }

  // Indicators, one at a time (the builder sends none for digit bots).
  if (!isDigitMethod(key)) {
    for (const ind of INDICATOR_OPTIONS) add(tag(`indicator ${ind.kind}`), { ...b, indicators: [ind.defaults] });
  }

  // Markets: every one the builder lists that is trading right now. A closed
  // market (weekend forex, say) cannot price anything; it is listed instead.
  for (const m of markets) {
    if (m === b.form.symbols[0]) continue;
    if (!open.includes(m)) {
      closedMarkets.push(`${key}: ${m}`);
      continue;
    }
    add(tag(`market ${m}`), await withMarketLists(patch(b, { symbols: [m] })));
  }
  if (open.length > 1) {
    const pair = [b.form.symbols[0], open.find((m) => m !== b.form.symbols[0])!];
    add(tag("scan LINEAR x2"), patch(b, { symbols: pair, scanType: "LINEAR" }));
    add(tag("scan PARALLEL x2"), patch(b, { symbols: pair, scanType: "PARALLEL" }));
  }

  // Method-specific setup.
  // The Setup step offers the market's own lists, falling back to the static ones.
  const lists = await getContractsFor(b.form.symbols[0]);
  const growthRates = lists.growthRateRange.length > 0 ? lists.growthRateRange : [...GROWTH_RATES];
  const multipliers = lists.multiplierRange.length > 0 ? lists.multiplierRange : [...MULTIPLIER_STEPS];
  if (shape.growthRate) for (const g of growthRates) add(tag(`growth ${g}%`), patch(b, { growthRate: g }));
  if (shape.multiplier) for (const m of multipliers) add(tag(`multiplier x${m}`), patch(b, { multiplier: m }));
  if (shape.takeProfit) add(tag("take profit 5"), patch(b, { takeProfit: "5" }));
  if (shape.perTradeStopLoss) {
    add(tag("per-trade stop loss 0.5"), patch(b, { perTradeStopLoss: "0.5" }));
    // Above the stake: the builder must refuse it, so this lands in builder errors.
    add(tag("per-trade stop loss 5 (above stake)"), patch(b, { perTradeStopLoss: "5" }));
  }
  if (shape.digit) {
    for (let d = 0; d <= 9; d++) add(tag(`digit ${d}`), patch(b, { digit: d, autoDigit: false }));
    add(tag("auto digit"), patch(b, { autoDigit: true }));
  }
  if (shape.barrierDigit) {
    for (let d = 0; d <= 8; d++) add(tag(`over ${d}`), patch(b, { direction: "up", barrierDigit: d }));
    for (let d = 1; d <= 8; d++) add(tag(`under ${d}`), patch(b, { direction: "down", barrierDigit: d }));
  }
  if (shape.barrierScale) {
    for (const { value, label } of BARRIER_SCALES) {
      add(tag(`distance ${label}`), patch(b, { barrierScale: value }));
      add(tag(`distance ${label}, side down`), patch(b, { barrierScale: value, direction: "down" }));
      if (shape.barrierScale === "above-below") {
        add(tag(`distance ${label}, below spot`), patch(b, { barrierScale: value, barrierAbove: false }));
      }
    }
  }
  if (shape.barrierLevels) {
    shape.barrierLevels.forEach((label, i) => {
      add(tag(`barrier level ${i + 1} (${label})`), patch(b, { barrierLevel: i + 1 }));
      add(tag(`barrier level ${i + 1} (${label}), side down`), patch(b, { barrierLevel: i + 1, direction: "down" }));
    });
  }
  if (shape.selectedTick) for (let t = 1; t <= 5; t++) add(tag(`selected tick ${t}`), patch(b, { selectedTick: t }));

  // Session limits.
  add(tag("limits max 3 trades, target 2, max stake 2"), patch(b, { maxTrades: "3", sessionTargetProfit: "2", maxStake: "2" }));

  // Real money: through the strategy's own Deriv app, and once without approval.
  add(tag("REAL account"), b, "real");
  add(tag("REAL account, app not approved"), b, "real", "consent");
}
}

main().then(() => {
  process.stderr.write(`${cases.length} cases, ${builderErrors.length} builder errors\n`);
  for (const e of builderErrors) process.stderr.write(`  BUILDER: ${e}\n`);
  process.stderr.write(`${closedMarkets.length} closed markets skipped\n`);
  for (const m of closedMarkets) process.stderr.write(`  CLOSED: ${m}\n`);
  process.stdout.write(JSON.stringify(cases, null, 1));
  process.exit(0);
});
