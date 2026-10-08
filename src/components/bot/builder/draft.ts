import { compareDecimals, decimalPlaces } from "@/lib/decimal";
import type {
  BotIndicator,
  BotPreset,
  BotStrategy,
  CreateBotPresetRequest,
} from "@/services/api/model";
import { formShapeFor } from "../botMeta";
import {
  buildStartRequest,
  defaultFormState,
  fromPresetConfig,
  toPresetConfig,
  type BotFormState,
  type BuildResult,
} from "../formState";
import {
  ENTRY_RULES,
  findMethod,
  findMoneyOption,
  isDirectionalIndicator,
  isMethodAvailable,
  methodForStrategy,
  supportedEntryRules,
  type EntryRuleKey,
  type MethodKey,
  type MoneyKey,
} from "./catalog";
import { STAKE_PLACES } from "./ladder";

/**
 * A bot as the builder edits it.
 *
 * `form` is the same state the dBot workspace uses, so a bot saved here opens
 * there unchanged and both build their start request through one function —
 * there is exactly one place that turns a configuration into money at risk.
 * The builder only adds what the workspace has no words for: which method the
 * user picked, the entry rule, and the staking mode.
 */
export interface BotDraft {
  name: string;
  method: MethodKey;
  entryRule: EntryRuleKey;
  money: MoneyKey;
  form: BotFormState;
  /**
   * Sent as the run's indicators. They do something in exactly two places:
   * a directional bot whose side is "auto" follows their consensus, and an
   * accumulator waits for them to agree the market is calm. Digit bots ignore
   * them, so the builder never sends any for those.
   */
  indicators: BotIndicator[];
}

export const NAME_MAX_LENGTH = 100;

const DIGIT_METHODS: readonly MethodKey[] = ["even_odd", "over_under", "matches", "differs"];

export function isDigitMethod(method: MethodKey): boolean {
  return DIGIT_METHODS.includes(method);
}

/**
 * A contract whose length is a handful of ticks the engine bounds — Asians,
 * Only Ups / Downs, High / Low Tick. Like digit bots, its length is picked in
 * Setup from the allowed range rather than on the Duration step.
 */
export function tickRangeFor(method: MethodKey): [number, number] | undefined {
  const strategyId = findMethod(method)?.strategyId;
  return strategyId ? formShapeFor(strategyId).tickRange : undefined;
}

/**
 * Digit contracts settle on the next tick, bounded tick contracts start at
 * their shortest allowed length, and everything else starts at five.
 */
function defaultDuration(method: MethodKey): string {
  if (isDigitMethod(method)) return "1";
  const range = tickRangeFor(method);
  return String(range ? range[0] : 5);
}

export function newDraft(method: MethodKey = "even_odd"): BotDraft {
  return withMethod(
    {
      name: "",
      method,
      entryRule: "always",
      money: "same",
      form: { ...defaultFormState(), stake: "1", sessionStopLoss: "10", sessionTargetProfit: "5" },
      indicators: [],
    },
    method,
  );
}

/**
 * Switches method, keeping everything that still means the same thing — the
 * stake and the session caps — and resetting what does not: a digit bot's
 * one-tick duration is not a sensible default for Rise / Fall.
 */
export function withMethod(draft: BotDraft, method: MethodKey): BotDraft {
  const option = findMethod(method);
  return {
    ...draft,
    method,
    form: {
      ...draft.form,
      direction:
        option?.fixedDirection ??
        // "auto" means "follow the indicators", which digit bots cannot do.
        (draft.form.direction === "auto" && isDigitMethod(method) ? "up" : draft.form.direction),
      // Ends In / Out and vanillas are not sold in ticks.
      duration: method === "ends_in_out" ? "2" : method === "vanillas" ? "5" : defaultDuration(method),
      durationUnit: method === "ends_in_out" || method === "vanillas" ? "m" : "t",
      autoDigit: false,
    },
  };
}

export function strategyIdFor(draft: BotDraft): string | undefined {
  return findMethod(draft.method)?.strategyId;
}

// ─── Steps ──────────────────────────────────────────────────────────────────

export type StepKey =
  | "method"
  | "markets"
  | "duration"
  | "indicators"
  | "setup"
  | "entry"
  | "money"
  | "review";

/**
 * The steps a draft needs. Digit bots settle on ticks chosen in Setup and
 * ignore indicators, so they skip both steps; accumulators and multipliers
 * have no duration, so they skip that one.
 */
export function stepsFor(draft: BotDraft): Array<{ key: StepKey; label: string }> {
  const strategyId = strategyIdFor(draft) ?? "";
  const digit = isDigitMethod(draft.method);
  return [
    { key: "method", label: "Method" },
    { key: "markets", label: "Markets" },
    ...(!digit && formShapeFor(strategyId).duration && !tickRangeFor(draft.method)
      ? [{ key: "duration" as const, label: "Duration" }]
      : []),
    ...(!digit ? [{ key: "indicators" as const, label: "Indicators" }] : []),
    { key: "setup", label: "Setup" },
    { key: "entry", label: "When to buy" },
    { key: "money", label: "Money" },
    { key: "review", label: "Review" },
  ];
}

// ─── Presets ────────────────────────────────────────────────────────────────

/** Stored beside the workspace's keys; the workspace ignores it. */
interface BuilderMeta {
  method: MethodKey;
  entry_rule: EntryRuleKey;
  money: MoneyKey;
  indicators: BotIndicator[];
}

const INDICATOR_KINDS = ["sma", "ema", "rsi", "bb", "stoch", "macd", "atr"] as const;
const INDICATOR_NUMBERS = [
  "period", "std_devs", "fast", "slow", "signal", "k_period", "smooth", "d_period", "oversold", "overbought",
] as const;

/**
 * Indicators read back from a preset. A preset's config is whatever was saved,
 * possibly by an older build or an imported package, so only known kinds and
 * finite numeric fields survive; the engine validates the values themselves.
 */
function readIndicators(raw: unknown): BotIndicator[] {
  if (!Array.isArray(raw)) return [];
  const out: BotIndicator[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const source = item as Record<string, unknown>;
    const kind = INDICATOR_KINDS.find((k) => k === source.kind);
    if (!kind || out.some((i) => i.kind === kind)) continue;
    const indicator: BotIndicator = { kind };
    for (const field of INDICATOR_NUMBERS) {
      const value = source[field];
      if (typeof value === "number" && Number.isFinite(value)) indicator[field] = value;
    }
    out.push(indicator);
  }
  return out;
}

export function toPresetRequest(draft: BotDraft, strategyId: string): CreateBotPresetRequest {
  const builder: BuilderMeta = {
    method: draft.method,
    entry_rule: draft.entryRule,
    money: draft.money,
    indicators: draft.indicators,
  };
  return {
    name: draft.name.trim(),
    strategy_id: strategyId,
    config: {
      ...toPresetConfig({ ...draft.form, martingaleEnabled: draft.money === "martingale" }),
      builder,
    },
  };
}

/**
 * Restores a draft from any preset — including one saved from the workspace,
 * which carries no builder metadata. Those map back through the strategy, and
 * their staking mode is read from the martingale flag they do carry.
 */
export function draftFromPreset(preset: BotPreset): BotDraft | undefined {
  const form = fromPresetConfig(preset.config);
  const meta = (preset.config as { builder?: Partial<BuilderMeta> }).builder;

  const method =
    (meta?.method && findMethod(meta.method)?.strategyId === preset.strategy_id
      ? meta.method
      : undefined) ?? methodForStrategy(preset.strategy_id, form.direction);
  if (!method) return undefined;

  const entryRule = ENTRY_RULES.some((r) => r.key === meta?.entry_rule)
    ? (meta?.entry_rule as EntryRuleKey)
    : "always";
  const money = findMoneyOption(meta?.money ?? "")
    ? (meta?.money as MoneyKey)
    : form.martingaleEnabled
      ? "martingale"
      : "same";

  return { name: preset.name, method, entryRule, money, form, indicators: readIndicators(meta?.indicators) };
}

// ─── Validation and the start request ───────────────────────────────────────

const POSITIVE_DECIMAL = /^\d+(\.\d+)?$/;

function isPositiveDecimal(raw: string): boolean {
  const v = raw.trim();
  return POSITIVE_DECIMAL.test(v) && Number.parseFloat(v) > 0;
}

function isPositiveInt(raw: string): boolean {
  const v = raw.trim();
  return /^\d+$/.test(v) && Number.parseInt(v, 10) > 0;
}

/**
 * Problems that stop a draft from being saved or run. Client-side only, so the
 * user hears about an empty field without a round trip; the engine enforces
 * every one of these again, and that copy is the one that counts.
 */
export function draftProblems(
  draft: BotDraft,
  strategies: readonly BotStrategy[],
): string[] {
  const problems: string[] = [];
  const method = findMethod(draft.method);
  const strategy = strategies.find((s) => s.strategy_id === method?.strategyId);
  const { form } = draft;

  if (!draft.name.trim()) problems.push("Give the bot a name.");
  if (draft.name.trim().length > NAME_MAX_LENGTH) {
    problems.push(`Keep the name under ${NAME_MAX_LENGTH} characters.`);
  }
  if (!method || !isMethodAvailable(method, strategies)) {
    problems.push("This trading method is not available for bots yet.");
    return problems;
  }
  if (!supportedEntryRules(strategy).has(draft.entryRule)) {
    problems.push("This bot cannot use the chosen buy rule yet.");
  }
  if (!findMoneyOption(draft.money)?.available) {
    problems.push("The chosen money strategy is not available yet.");
  }
  if (form.symbols.length === 0) problems.push("Pick at least one market.");
  if (formShapeFor(strategy!.strategy_id).duration && !isPositiveInt(form.duration)) {
    problems.push("Contract duration must be a whole number.");
  }
  if (form.direction === "auto" && !draft.indicators.some(isDirectionalIndicator)) {
    problems.push("“Let indicators decide” needs at least one indicator other than ATR.");
  }
  const range = tickRangeFor(draft.method);
  if (range) {
    const ticks = Number.parseInt(form.duration, 10);
    if (!(ticks >= range[0] && ticks <= range[1])) {
      problems.push(
        range[0] === range[1]
          ? `This contract lasts exactly ${range[0]} ticks.`
          : `This contract lasts ${range[0]} to ${range[1]} ticks.`,
      );
    }
  }
  // Deriv caps a contract's own stop loss at its stake.
  if (
    formShapeFor(strategy!.strategy_id).perTradeStopLoss &&
    isPositiveDecimal(form.perTradeStopLoss) &&
    isPositiveDecimal(form.stake) &&
    Number.parseFloat(form.perTradeStopLoss) > Number.parseFloat(form.stake)
  ) {
    problems.push("A contract's stop loss cannot be more than its stake.");
  }
  problems.push(...Object.values(moneyProblems(draft)));
  return problems;
}

/**
 * The Money step's field labels.
 *
 * The step draws its fields from these and every message about a field quotes
 * them, so a message cannot name something the page does not show. It used to:
 * the field read "Never stake more than" and its error said "stake ceiling".
 * The step count is the one label not here; it changes with the money
 * strategy and lives on the option (MoneyOption.stepsLabel).
 */
export const MONEY_LABELS = {
  stake: "Starting stake",
  sessionStopLoss: "Stop when loss hits",
  sessionTargetProfit: "Stop when profit hits",
  maxTrades: "Max trades this run",
  maxStake: "Never stake more than",
  martingaleMultiplier: "Multiply the stake by",
} as const;

export type MoneyField = keyof typeof MONEY_LABELS | "martingaleMaxSteps";

const quoted = (label: string) => `“${label}”`;

/** Whether an amount has more decimal places than a stake may. */
const tooPrecise = (value: string) => (decimalPlaces(value) ?? 0) > STAKE_PLACES;

/**
 * What is wrong with the Money step, by field, in the order the fields appear.
 * The step shows each beside its own field as it is typed; the Review step
 * lists them all.
 */
export function moneyProblems(draft: BotDraft): Partial<Record<MoneyField, string>> {
  const { form } = draft;
  const money = findMoneyOption(draft.money);
  const problems: Partial<Record<MoneyField, string>> = {};

  if (!isPositiveDecimal(form.stake)) {
    problems.stake = `${quoted(MONEY_LABELS.stake)} must be an amount above 0.`;
  } else if (tooPrecise(form.stake)) {
    // Deriv refuses a stake with a third decimal place, and the engine
    // refuses the run for it. Said here, it is a field to correct.
    problems.stake = `${quoted(MONEY_LABELS.stake)} can have at most ${STAKE_PLACES} decimal places.`;
  }
  if (!isPositiveDecimal(form.sessionStopLoss)) {
    problems.sessionStopLoss = `${quoted(MONEY_LABELS.sessionStopLoss)} is required, and must be an amount above 0.`;
  }
  if (form.sessionTargetProfit.trim() && !isPositiveDecimal(form.sessionTargetProfit)) {
    problems.sessionTargetProfit = `${quoted(MONEY_LABELS.sessionTargetProfit)} must be an amount above 0, or left empty.`;
  }
  if (form.maxTrades.trim() && !isPositiveInt(form.maxTrades)) {
    problems.maxTrades = `${quoted(MONEY_LABELS.maxTrades)} must be a whole number above 0, or left empty.`;
  }
  if (form.maxStake.trim()) {
    if (!isPositiveDecimal(form.maxStake)) {
      problems.maxStake = `${quoted(MONEY_LABELS.maxStake)} must be an amount above 0, or left empty.`;
    } else if (tooPrecise(form.maxStake)) {
      problems.maxStake = `${quoted(MONEY_LABELS.maxStake)} can have at most ${STAKE_PLACES} decimal places.`;
    } else if (isPositiveDecimal(form.stake) && compareDecimals(form.maxStake, form.stake) === -1) {
      problems.maxStake = `Your ${quoted(MONEY_LABELS.maxStake)} amount cannot be less than your ${quoted(MONEY_LABELS.stake)}.`;
    }
  }
  if (money?.multiplies && compareDecimals(form.martingaleMultiplier, "1") !== 1) {
    problems.martingaleMultiplier = `${quoted(MONEY_LABELS.martingaleMultiplier)} must be more than 1.`;
  }
  if (money?.escalates && !isPositiveInt(form.martingaleMaxSteps)) {
    problems.martingaleMaxSteps = `${quoted(money.stepsLabel ?? "Steps")} must be a whole number above 0.`;
  }
  return problems;
}

/**
 * The start request for a draft.
 *
 * `riskAcknowledged` is sent as given and never defaulted to true: the engine
 * refuses a real-money run without it, and that refusal is the point. The
 * caller asks the user; this function only carries the answer.
 */
export function buildDraftRunRequest(
  draft: BotDraft,
  strategies: readonly BotStrategy[],
  riskAcknowledged: boolean,
): BuildResult {
  const problems = draftProblems(draft, strategies);
  if (problems.length > 0) return { errors: problems };

  const strategy = strategies.find((s) => s.strategy_id === strategyIdFor(draft))!;
  const result = buildStartRequest(
    strategy.strategy_id,
    strategy.supported_contract_types[0],
    { ...draft.form, martingaleEnabled: draft.money === "martingale" },
  );
  if (!result.request) return result;

  // The staking mode, and only the knobs it uses. The engine's risk layer is
  // what enforces all of it; nothing here sizes a trade.
  const money = findMoneyOption(draft.money)!;
  const limits = result.request.risk_limits;
  limits.stake_mode = money.stakeMode;
  limits.martingale_enabled = money.stakeMode === "martingale";
  limits.martingale_multiplier = money.multiplies ? draft.form.martingaleMultiplier.trim() : undefined;
  limits.martingale_max_steps = money.escalates
    ? Number.parseInt(draft.form.martingaleMaxSteps, 10)
    : undefined;
  limits.max_stake_per_trade = draft.form.maxStake.trim() || undefined;

  // The workspace's indicator ids are not used here; the builder keeps full
  // specs. Digit bots never act on indicators, so none are sent for them.
  result.request.indicators = isDigitMethod(draft.method) ? [] : draft.indicators;

  // Sent only when it is not the default, because every bot rejects parameters
  // its schema does not declare — and bots without entry rules declare none.
  if (draft.entryRule !== "always") {
    result.request.strategy_parameters = {
      ...result.request.strategy_parameters,
      entry_rule: draft.entryRule,
    };
  }
  result.request.risk_acknowledged = riskAcknowledged;
  return result;
}

// ─── Plain-language summary ─────────────────────────────────────────────────

export function sideLabel(draft: BotDraft): string | undefined {
  const strategyId = strategyIdFor(draft);
  if (!strategyId) return undefined;
  const method = findMethod(draft.method);
  if (method?.fixedDirection) return method.name;
  const labels = formShapeFor(strategyId).sideLabels;
  if (!labels) return undefined;
  if (draft.form.direction === "auto") return "Indicators decide";
  return draft.form.direction === "down" ? labels[1] : labels[0];
}

export function durationLabel(draft: BotDraft): string | undefined {
  const strategyId = strategyIdFor(draft);
  if (!strategyId || !formShapeFor(strategyId).duration) return undefined;
  const n = draft.form.duration.trim() || "?";
  const unit = {
    t: n === "1" ? "tick" : "ticks",
    s: "seconds",
    m: "minutes",
    h: "hours",
    d: "days",
  }[draft.form.durationUnit] ?? draft.form.durationUnit;
  return `${n} ${unit}`;
}
