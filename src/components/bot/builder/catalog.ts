import type { BotIndicator, BotIndicatorKind, BotStrategy } from "@/services/api/model";
import type { Direction } from "../formState";

/**
 * What the bot builder offers, and which of it the engine can actually run.
 *
 * The builder speaks the user's language ("Matches", "Flip after a loss"); the
 * engine speaks strategies and parameters. This file is the only place the two
 * meet. Everything listed here is shown, but only what the engine supports can
 * be chosen — an option that saves happily and then does nothing at run time
 * is worse than one that says "coming soon".
 */

export type MethodKey =
  | "rise_fall"
  | "higher_lower"
  | "touch_no_touch"
  | "ends_in_out"
  | "even_odd"
  | "over_under"
  | "matches"
  | "differs"
  | "accumulators"
  | "multipliers"
  | "asians"
  | "reset_call_put"
  | "only_ups_downs"
  | "high_low_tick"
  | "turbos"
  | "vanillas";

export interface MethodOption {
  key: MethodKey;
  name: string;
  description: string;
  /** The engine strategy that trades it. Absent: no bot exists for it yet. */
  strategyId?: string;
  /**
   * Set when the method IS a side: "Matches" and "Differs" are one strategy
   * with opposite predictions, but two distinct choices to a user.
   */
  fixedDirection?: Exclude<Direction, "auto">;
}

export interface MethodGroup {
  label: string;
  methods: MethodOption[];
}

export const METHOD_GROUPS: MethodGroup[] = [
  {
    label: "Price direction",
    methods: [
      { key: "rise_fall", name: "Rise / Fall", strategyId: "rise_fall", description: "Will the price finish higher or lower than it started?" },
      { key: "higher_lower", name: "Higher / Lower", strategyId: "higher_lower", description: "Will the price finish above or below a target you pick?" },
    ],
  },
  {
    label: "Barriers",
    methods: [
      { key: "touch_no_touch", name: "Touch / No Touch", strategyId: "touch_no_touch", description: "Will price touch a target at any moment before time is up?" },
      { key: "ends_in_out", name: "Ends In / Ends Out", description: "Will the price finish inside or outside two targets?" },
    ],
  },
  {
    label: "Last digit",
    methods: [
      { key: "even_odd", name: "Even / Odd", strategyId: "even_odd", description: "Will the last digit of the price be even (0, 2, 4, 6, 8) or odd (1, 3, 5, 7, 9)?" },
      { key: "over_under", name: "Over / Under", strategyId: "over_under", description: "Will the last digit be higher or lower than a number you pick?" },
      { key: "matches", name: "Matches", strategyId: "matches_differs", fixedDirection: "up", description: "Will the last digit be exactly the number you pick? Harder — larger payout." },
      { key: "differs", name: "Differs", strategyId: "matches_differs", fixedDirection: "down", description: "Will the last digit be anything except the number you pick? Easier — smaller payout." },
    ],
  },
  {
    label: "Grow / leverage",
    methods: [
      { key: "accumulators", name: "Accumulators", strategyId: "accumulator", description: "Payout grows every tick the price stays inside a band. Ends if it hits the edge." },
      { key: "multipliers", name: "Multipliers", strategyId: "multiplier", description: "Ride the price with a multiplier. You cannot lose more than your stake." },
    ],
  },
  {
    label: "More options",
    methods: [
      { key: "asians", name: "Asians", description: "Win if the average price over the contract is higher or lower than the start." },
      { key: "reset_call_put", name: "Reset Call / Put", description: "Like Rise / Fall, but if price hits a reset level the starting price is replaced." },
      { key: "only_ups_downs", name: "Only Ups / Only Downs", description: "Win if every tick in the contract moves only up, or only down." },
      { key: "high_low_tick", name: "High Tick / Low Tick", description: "Pick which tick in the series will be the highest or the lowest." },
      { key: "turbos", name: "Turbos", description: "Stay on your side of a barrier. Knocked out if price crosses it." },
      { key: "vanillas", name: "Vanillas", description: "Call or Put. Payout follows how far price finishes past the start." },
    ],
  },
];

const METHODS: MethodOption[] = METHOD_GROUPS.flatMap((g) => g.methods);

export function findMethod(key: string): MethodOption | undefined {
  return METHODS.find((m) => m.key === key);
}

/** The builder method a strategy maps back to, for presets saved elsewhere. */
export function methodForStrategy(
  strategyId: string,
  direction: Direction,
): MethodKey | undefined {
  if (strategyId === "matches_differs") {
    return direction === "down" ? "differs" : "matches";
  }
  return METHODS.find((m) => m.strategyId === strategyId)?.key;
}

/** A method can be chosen only when the engine currently offers its bot. */
export function isMethodAvailable(
  method: MethodOption,
  strategies: readonly BotStrategy[],
): boolean {
  return Boolean(
    method.strategyId && strategies.some((s) => s.strategy_id === method.strategyId),
  );
}

// ─── When to buy ────────────────────────────────────────────────────────────

export type EntryRuleKey =
  | "always"
  | "flip_after_loss"
  | "copy_last_tick"
  | "fade_last_tick"
  | "streak_fade";

export interface EntryRuleOption {
  key: EntryRuleKey;
  name: string;
  description: string;
}

export const ENTRY_RULES: EntryRuleOption[] = [
  { key: "always", name: "Always this side", description: "Every contract uses the side you picked. The simplest rule." },
  { key: "flip_after_loss", name: "Flip after a loss", description: "If a trade loses, the next one takes the other side. Popular with digit bots." },
  { key: "copy_last_tick", name: "Copy the last tick", description: "If the last move was up / even, buy that same side again." },
  { key: "fade_last_tick", name: "Fade the last tick", description: "If the last move was up / even, buy the other side." },
  { key: "streak_fade", name: "Wait for a streak, then fade", description: "Wait until 3 ticks in a row match one side, then buy the other side." },
];

/**
 * The entry rules a strategy accepts, read from its own parameter schema.
 *
 * Deliberately server-driven: when the engine adds a rule to a bot's
 * `entry_rule` enum, it becomes selectable here with no frontend release, and
 * a rule the engine does not declare can never be sent — each bot rejects
 * parameters its schema does not list. "always" needs no parameter, so every
 * bot supports it.
 */
export function supportedEntryRules(strategy: BotStrategy | undefined): Set<EntryRuleKey> {
  const supported = new Set<EntryRuleKey>(["always"]);
  const properties = (strategy?.parameters as { properties?: Record<string, unknown> } | undefined)
    ?.properties;
  const entryRule = properties?.entry_rule as { enum?: unknown } | undefined;
  if (Array.isArray(entryRule?.enum)) {
    for (const value of entryRule.enum) {
      if (ENTRY_RULES.some((r) => r.key === value)) supported.add(value as EntryRuleKey);
    }
  }
  return supported;
}

// ─── Money ──────────────────────────────────────────────────────────────────

export type MoneyKey = "same" | "gentle_step" | "martingale" | "reverse_martingale";

export interface MoneyOption {
  key: MoneyKey;
  name: string;
  badge: string;
  description: string;
  /** False until the engine's risk layer can size stakes this way. */
  available: boolean;
}

/**
 * Staking modes. Unlike entry rules these are not a strategy's to declare:
 * stake sizing belongs to the risk layer, which no bot can widen. The engine
 * implements flat stakes and martingale today.
 */
export const MONEY_OPTIONS: MoneyOption[] = [
  { key: "same", name: "Same stake", badge: "Recommended", available: true, description: "Every trade uses the same amount. Safest way to start." },
  { key: "gentle_step", name: "Gentle step", badge: "Medium", available: false, description: "Add one unit after a loss, remove one after a win." },
  { key: "martingale", name: "Martingale", badge: "High risk", available: true, description: "Multiply the stake after a loss so one win recovers the streak. Can drain the account." },
  { key: "reverse_martingale", name: "Reverse Martingale", badge: "High risk", available: false, description: "Multiply the stake after a win. Reset after a loss. Rides streaks, gives them back fast." },
];

export function findMoneyOption(key: string): MoneyOption | undefined {
  return MONEY_OPTIONS.find((m) => m.key === key);
}

// ─── Indicators ─────────────────────────────────────────────────────────────

export interface IndicatorOption {
  kind: BotIndicatorKind;
  name: string;
  description: string;
  /** The spec added when the user picks it: the engine's own defaults. */
  defaults: BotIndicator;
  /** ATR measures how far price moves, not which way. */
  directional: boolean;
}

export const INDICATOR_OPTIONS: IndicatorOption[] = [
  { kind: "rsi", name: "RSI", directional: true, description: "How strongly price has been rising or falling.", defaults: { kind: "rsi", period: 14, oversold: 30, overbought: 70 } },
  { kind: "sma", name: "Simple MA", directional: true, description: "Average price over the last N candles.", defaults: { kind: "sma", period: 20 } },
  { kind: "ema", name: "Exponential MA", directional: true, description: "A faster average that follows recent prices.", defaults: { kind: "ema", period: 20 } },
  { kind: "macd", name: "MACD", directional: true, description: "Momentum from two averages and their signal line.", defaults: { kind: "macd", fast: 12, slow: 26, signal: 9 } },
  { kind: "bb", name: "Bollinger Bands", directional: true, description: "Price relative to a volatility band.", defaults: { kind: "bb", period: 20, std_devs: 2 } },
  { kind: "stoch", name: "Stochastic", directional: true, description: "Where price sits in its recent high–low range.", defaults: { kind: "stoch", k_period: 14, smooth: 3, d_period: 3, oversold: 20, overbought: 80 } },
  { kind: "atr", name: "ATR", directional: false, description: "How much price is moving. A calm-market filter; picks no side.", defaults: { kind: "atr", period: 14 } },
];

export function findIndicatorOption(kind: string): IndicatorOption | undefined {
  return INDICATOR_OPTIONS.find((i) => i.kind === kind);
}

export function isDirectionalIndicator(indicator: BotIndicator): boolean {
  return findIndicatorOption(indicator.kind)?.directional ?? false;
}

/**
 * Whether a bot can hand its side to the indicators — read from its schema's
 * `direction` enum rather than assumed, so it tracks the engine.
 */
export function supportsAutoDirection(strategy: BotStrategy | undefined): boolean {
  const properties = (strategy?.parameters as { properties?: Record<string, unknown> } | undefined)
    ?.properties;
  const direction = properties?.direction as { enum?: unknown } | undefined;
  return Array.isArray(direction?.enum) && direction.enum.includes("auto");
}
