import type { BotIndicatorKind } from "@/services/api/model";
import { getFallbackMarkets } from "@/services/deriv/activeSymbols";
import type { ContractForEntry } from "@/services/deriv/contractsFor";
import { TRADE_TYPE_CONFIG } from "@/services/deriv/contractTypes";

/**
 * Per-bot presentation metadata.
 *
 * Everything FUNCTIONAL comes from the backend — `GET /bots/strategies`
 * returns each bot's id, name, description, supported contract types and a
 * JSON Schema for its parameters. This file holds only what a schema cannot
 * express: which contract fields to render, and what to call the two sides.
 *
 * Keyed by the backend's strategy_id. A bot the backend adds but this file does
 * not know still appears in the picker and still starts — it just falls back to
 * generic labels, which is the right failure mode for a catalogue that is meant
 * to keep growing.
 */

/** Which contract-template controls a bot needs. */
export interface BotFormShape {
  /** "Up / Down", "Rise / Fall", "Matches / Differs", … */
  sideLabels?: [string, string];
  /** Leverage picker (multipliers). */
  multiplier?: boolean;
  /** Growth-rate picker 1–5% (accumulators). */
  growthRate?: boolean;
  /** Duration + unit inputs. */
  duration?: boolean;
  /** Digit 0–9 picker. */
  digit?: boolean;
  /** Barrier-digit picker 0–8 (over/under). */
  barrierDigit?: boolean;
  /** Relative/absolute barrier with an offset (touch/no touch, higher/lower). */
  barrierOffset?: boolean;
  /** Per-contract take profit is meaningful for this type. */
  takeProfit?: boolean;
  /** Per-contract stop loss is meaningful for this type. */
  perTradeStopLoss?: boolean;
  /**
   * A tick-only contract whose length Deriv bounds, as [min, max]. The engine
   * refuses anything outside it, so the picker offers only what is inside.
   */
  tickRange?: [number, number];
  /** Two barriers, above and below spot (Ends In / Ends Out). */
  twoBarriers?: boolean;
  /** Which tick is predicted to be the highest / lowest (High / Low Tick). */
  selectedTick?: boolean;
  /**
   * Turbos and vanillas: Deriv accepts only barriers from a list it computes
   * per market and duration, and the list moves with price. The bot stores a
   * position in that list; these are its labels, in Deriv's order.
   */
  barrierLevels?: readonly string[];
}

const TURBOS_LEVELS = [
  "1 · nearest", "2", "3", "4", "5", "6", "7", "8", "9", "10 · farthest",
] as const;
const VANILLAS_LEVELS = [
  "Highest strike", "Higher", "At the money", "Lower", "Lowest strike",
] as const;

export const BOT_FORMS: Record<string, BotFormShape> = {
  accumulator: { growthRate: true, takeProfit: true },
  multiplier: {
    sideLabels: ["Up", "Down"],
    multiplier: true,
    takeProfit: true,
    perTradeStopLoss: true,
  },
  rise_fall: { sideLabels: ["Rise", "Fall"], duration: true },
  higher_lower: { sideLabels: ["Higher", "Lower"], duration: true, barrierOffset: true },
  touch_no_touch: { sideLabels: ["Touch", "No Touch"], duration: true, barrierOffset: true },
  matches_differs: { sideLabels: ["Matches", "Differs"], duration: true, digit: true },
  even_odd: { sideLabels: ["Even", "Odd"], duration: true },
  over_under: { sideLabels: ["Over", "Under"], duration: true, barrierDigit: true },
  asians: { sideLabels: ["Up", "Down"], duration: true, tickRange: [5, 10] },
  reset_call_put: { sideLabels: ["Reset Call", "Reset Put"], duration: true },
  only_ups_downs: { sideLabels: ["Only Ups", "Only Downs"], duration: true, tickRange: [2, 5] },
  high_low_ticks: {
    sideLabels: ["High Tick", "Low Tick"],
    duration: true,
    tickRange: [5, 5],
    selectedTick: true,
  },
  ends_in_out: { sideLabels: ["Ends In", "Ends Out"], duration: true, twoBarriers: true },
  turbos: { sideLabels: ["Up", "Down"], duration: true, barrierLevels: TURBOS_LEVELS, takeProfit: true },
  vanillas: { sideLabels: ["Call", "Put"], duration: true, barrierLevels: VANILLAS_LEVELS },
};

export function formShapeFor(strategyId: string): BotFormShape {
  return BOT_FORMS[strategyId] ?? { sideLabels: ["Up", "Down"], duration: true };
}

/**
 * Leverage steps for multiplier contracts.
 *
 * These are Deriv's actual multiplier tiers. An earlier version of this file
 * guessed ×2–×20, which is off by two orders of magnitude — a user picking
 * "×2" would have been placing a trade the broker never offered.
 */
export const MULTIPLIER_STEPS = [100, 200, 300, 400, 500, 600, 1000] as const;

/** Accumulator growth rates, as Deriv offers them. */
export const GROWTH_RATES = [1, 2, 3, 4, 5] as const;

export interface DurationPreset {
  unit: string;
  name: string;
  description: string;
  values: string[];
}

const DURATION_PRESETS: DurationPreset[] = [
  { unit: "t", name: "Ticks", description: "Each new price print.", values: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
  { unit: "s", name: "Seconds", description: "Wall-clock seconds.", values: ["15", "30", "45", "60", "90", "120", "180", "300"] },
  { unit: "m", name: "Minutes", description: "Wall-clock minutes.", values: ["1", "2", "3", "5", "10", "15", "30", "60"] },
  { unit: "h", name: "Hours", description: "Wall-clock hours.", values: ["1", "2", "3", "4", "8", "12", "24"] },
];

/**
 * The lengths the Duration step offers a bot — only what Deriv sells for it.
 * Deriv refuses anything else at the first order, which the user would only
 * see as a bot that stopped.
 */
export function durationPresetsFor(
  strategyId: string,
  offered?: readonly ContractForEntry[],
): DurationPreset[] {
  return withinDerivLimits(staticPresetsFor(strategyId), strategyId, offered);
}

const UNIT_SECONDS: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };

/** "5t" -> {ticks: 5}; "15s" / "2m" / "1d" -> {seconds: ...}. */
function parseDuration(raw: string | undefined): { ticks?: number; seconds?: number } | undefined {
  const m = /^(\d+)([tsmhd])$/.exec(raw ?? "");
  if (!m) return undefined;
  const n = Number(m[1]);
  return m[2] === "t" ? { ticks: n } : { seconds: n * UNIT_SECONDS[m[2]] };
}

/**
 * Drops the lengths Deriv does not sell on the chosen market, from its own
 * contracts_for. A length must be sold for EVERY side the bot may take — a bot
 * that flips from Touch to No Touch needs both. Without the market's list (not
 * loaded yet, or Deriv unreachable) nothing is dropped; the engine checks again
 * at start.
 */
function withinDerivLimits(
  presets: DurationPreset[],
  strategyId: string,
  offered: readonly ContractForEntry[] | undefined,
): DurationPreset[] {
  const types = TRADE_TYPE_CONFIG[strategyId]?.contractTypes ?? [];
  if (!offered || offered.length === 0 || types.length === 0) return presets;

  const sold = (type: string, value: number, unit: string): boolean => {
    const entries = offered.filter((e) => e.contract_type === type);
    if (entries.length === 0) return true; // Deriv says nothing about it: do not guess
    return entries.some((e) => {
      const min = parseDuration(e.min_contract_duration);
      const max = parseDuration(e.max_contract_duration);
      if (unit === "t") {
        return min?.ticks !== undefined && max?.ticks !== undefined && value >= min.ticks && value <= max.ticks;
      }
      const seconds = value * UNIT_SECONDS[unit];
      return min?.seconds !== undefined && max?.seconds !== undefined && seconds >= min.seconds && seconds <= max.seconds;
    });
  };

  const filtered = presets
    .map((p) => ({ ...p, values: p.values.filter((v) => types.every((t) => sold(t, Number(v), p.unit))) }))
    .filter((p) => p.values.length > 0);
  // Nothing left means Deriv's list and ours disagree entirely; show ours and
  // let the start-time check give Deriv's reason, rather than an empty step.
  return filtered.length > 0 ? filtered : presets;
}

function staticPresetsFor(strategyId: string): DurationPreset[] {
  switch (strategyId) {
    // Measured over wall-clock time: no ticks.
    case "ends_in_out":
      return DURATION_PRESETS.filter((p) => p.unit !== "t");
    // Intraday vanillas start at one minute.
    case "vanillas":
      return DURATION_PRESETS.filter((p) => p.unit === "m" || p.unit === "h");
    // Deriv sells these in 5 to 10 ticks only.
    case "turbos":
    case "higher_lower":
    case "touch_no_touch":
    case "reset_call_put":
      return DURATION_PRESETS.map((p) =>
        p.unit === "t" ? { ...p, values: p.values.filter((v) => Number(v) >= 5) } : p,
      );
    default:
      return DURATION_PRESETS;
  }
}

export const DURATION_UNITS = [
  { value: "t", label: "Ticks (t)" },
  { value: "s", label: "Seconds (s)" },
  { value: "m", label: "Minutes (m)" },
  { value: "h", label: "Hours (h)" },
  { value: "d", label: "Days (d)" },
] as const;

/**
 * Indicators the user can add.
 *
 * `directional` mirrors the engine: ATR measures how much price moves, not
 * which way, so it cannot unlock "auto" direction. The backend re-checks this —
 * the flag here only keeps the UI from offering Auto before it would work.
 */
export interface IndicatorMeta {
  kind: BotIndicatorKind;
  label: string;
  /** Rendered under the name to explain what adding it does. */
  hint: string | ((strategyId: string) => string);
  directional: boolean;
  /** Default period shown in the picker; the backend applies the same value. */
  defaultPeriod?: number;
  /** Whether this indicator supports configuring upper and lower bounds (e.g. RSI). */
  hasBounds?: boolean;
  defaultOversold?: number;
  defaultOverbought?: number;
}

export const INDICATORS: IndicatorMeta[] = [
  { 
    kind: "rsi", 
    label: "RSI", 
    hint: (strategyId) => strategyId === "accumulator" 
      ? "Trades only while RSI stays within the configured Min-Max range" 
      : "Oversold argues up, overbought argues down", 
    directional: true, 
    defaultPeriod: 14,
    hasBounds: true,
    defaultOversold: 30,
    defaultOverbought: 70
  },
  { kind: "bb", label: "Bollinger Bands", hint: "Below the lower band argues up, above the upper argues down", directional: true, defaultPeriod: 20 },
  { kind: "stoch", label: "Stochastic", hint: "Same read as RSI, over the recent high/low range", directional: true, defaultPeriod: 14 },
  { kind: "macd", label: "MACD", hint: "Histogram above zero argues up, below argues down", directional: true },
  { kind: "ema", label: "EMA", hint: "Price above the average argues up", directional: true, defaultPeriod: 20 },
  { kind: "sma", label: "SMA", hint: "Price above the average argues up", directional: true, defaultPeriod: 20 },
  { kind: "atr", label: "ATR", hint: "Volatility filter only — does not pick a direction", directional: false, defaultPeriod: 14 },
];

export function indicatorMeta(kind: BotIndicatorKind): IndicatorMeta {
  return INDICATORS.find((i) => i.kind === kind) ?? {
    kind,
    label: kind.toUpperCase(),
    hint: "",
    directional: kind !== "atr",
  };
}

/**
 * Returns the best default market ID for a given strategy.
 * Used when resetting the market picker after a strategy switch.
 */
export function defaultMarketForStrategy(strategyId: string): string {
  return getFallbackMarkets(strategyId)[0] ?? "1HZ100V";
}
