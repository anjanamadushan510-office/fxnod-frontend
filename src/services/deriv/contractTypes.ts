/**
 * LOGIC-004: Contract-type configuration.
 *
 * Maps each application strategy (bot trade type) to the Deriv
 * market/submarket pairs that actually support it.
 *
 * Source of truth: Deriv's official documentation + the active_symbols
 * API response structure.  The `active_symbols` API does NOT accept a
 * contract_type filter parameter, so we filter the response client-side
 * using the `market` and `submarket` fields returned per symbol.
 *
 * Deriv market taxonomy (from active_symbols response):
 *   market           submarket
 *   ───────────────  ───────────────────────────────────────
 *   synthetic_index  volatility_indices   ← ACCU, MULT, DIGIT
 *   synthetic_index  crash_boom           ← boom/crash indices
 *   synthetic_index  jump_indices         ← jump indices
 *   synthetic_index  daily_reset_indices  ← bull/bear indices
 *   forex            smart_fx             ← major FX pairs
 *   forex            minor_pairs          ← minor FX pairs
 *   cryptocurrency   cryptocurrency        ← BTC, ETH, etc.
 *   commodities      metals               ← Gold, Silver
 *   indices          us_indices           ← S&P, NASDAQ
 */

/** Deriv submarket identifier as returned by active_symbols. */
export type DerivSubmarket =
  | "volatility_indices"
  | "crash_boom"
  | "jump_indices"
  | "daily_reset_indices"
  | "smart_fx"
  | "minor_pairs"
  | "cryptocurrency"
  | "metals"
  | "us_indices"
  | string; // allow unknown submarkets gracefully

/** Deriv market (top-level category) as returned by active_symbols. */
export type DerivMarket =
  | "synthetic_index"
  | "forex"
  | "cryptocurrency"
  | "commodities"
  | "indices"
  | string;

export interface MarketFilter {
  market: DerivMarket;
  /**
   * Optional submarket restriction.
   * When omitted, ALL submarkets under this market are included.
   */
  submarket?: DerivSubmarket;
}

export interface TradeTypeConfig {
  /** Human-readable label (for debugging / future UI). */
  label: string;
  /**
   * Which Deriv market/submarket combinations support this trade type.
   * The resolver applies these as an OR filter.
   */
  allowedMarkets: readonly MarketFilter[];
}

/**
 * Trade type → Deriv market filter mapping.
 *
 * Rules sourced from Deriv's official product documentation.
 * Do NOT add entries without verifying against the real API.
 *
 * Key rules:
 *   • Accumulators, Multipliers, Turbos, Digit contracts
 *     (Matches/Differs, Even/Odd, Over/Under) → volatility_indices only.
 *   • Vanillas → volatility_indices + all forex.
 *   • Rise/Fall → all synthetics + forex + crypto + commodities.
 *   • Higher/Lower, Touch/No Touch → synthetics + forex (+commodities for H/L).
 */
export const TRADE_TYPE_CONFIG: Record<string, TradeTypeConfig> = {
  accumulator: {
    label: "Accumulators",
    allowedMarkets: [
      { market: "synthetic_index", submarket: "volatility_indices" },
    ],
  },

  multiplier: {
    label: "Multipliers",
    allowedMarkets: [
      { market: "synthetic_index", submarket: "volatility_indices" },
    ],
  },

  turbos: {
    label: "Turbos",
    allowedMarkets: [
      { market: "synthetic_index", submarket: "volatility_indices" },
    ],
  },

  vanillas: {
    label: "Vanillas",
    allowedMarkets: [
      { market: "synthetic_index", submarket: "volatility_indices" },
      { market: "forex" }, // all forex submarkets
    ],
  },

  rise_fall: {
    label: "Rise/Fall",
    allowedMarkets: [
      { market: "synthetic_index" }, // all synthetics (vol + crash/boom + jump)
      { market: "forex" },
      { market: "cryptocurrency" },
      { market: "commodities" },
    ],
  },

  higher_lower: {
    label: "Higher/Lower",
    allowedMarkets: [
      { market: "synthetic_index" },
      { market: "forex" },
      { market: "commodities" },
    ],
  },

  touch_no_touch: {
    label: "Touch/No Touch",
    allowedMarkets: [
      { market: "synthetic_index" },
      { market: "forex" },
    ],
  },

  matches_differs: {
    label: "Matches/Differs",
    allowedMarkets: [
      { market: "synthetic_index", submarket: "volatility_indices" },
    ],
  },

  even_odd: {
    label: "Even/Odd",
    allowedMarkets: [
      { market: "synthetic_index", submarket: "volatility_indices" },
    ],
  },

  over_under: {
    label: "Over/Under",
    allowedMarkets: [
      { market: "synthetic_index", submarket: "volatility_indices" },
    ],
  },
};

/**
 * Whether a symbol (by its Deriv market/submarket) matches a given strategy.
 * Returns true if ANY of the strategy's allowed filters matches (OR logic).
 */
export function symbolMatchesStrategy(
  symbolMarket: string,
  symbolSubmarket: string,
  strategyId: string,
): boolean {
  const config = TRADE_TYPE_CONFIG[strategyId];
  if (!config) return true; // unknown strategy → show everything as safe fallback

  return config.allowedMarkets.some((f) => {
    if (f.market !== symbolMarket) return false;
    // No submarket restriction → any submarket under this market qualifies.
    if (f.submarket === undefined) return true;
    return f.submarket === symbolSubmarket;
  });
}
