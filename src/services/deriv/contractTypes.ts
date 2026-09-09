/**
 * LOGIC-004: Contract-type configuration.
 *
 * Maps each application strategy (bot trade type) to the exact Deriv API
 * contract_type array needed to filter active_symbols directly.
 *
 * Note: dTrader uses plural strategy IDs ("accumulators", "multipliers")
 * while dBot uses singular strategy IDs ("accumulator", "multiplier").
 * Both are mapped here so the same activeSymbols service works for both.
 */

export interface TradeTypeConfig {
  /** Human-readable label (for debugging / future UI). */
  label: string;
  /**
   * The exact contract types to request from Deriv active_symbols API.
   * e.g., ["ACCU"] or ["CALL", "PUT"]
   */
  contractTypes: string[];
}

export const TRADE_TYPE_CONFIG: Record<string, TradeTypeConfig> = {
  // ── dTrader strategy IDs (plural form) ───────────────────────────────────
  accumulators: {
    label: "Accumulators",
    contractTypes: ["ACCU"],
  },
  multipliers: {
    label: "Multipliers",
    contractTypes: ["MULTUP", "MULTDOWN"],
  },
  turbos: {
    label: "Turbos",
    contractTypes: ["TURBOSLONG", "TURBOSSHORT"],
  },
  vanillas: {
    label: "Vanillas",
    contractTypes: ["VANILLALONGCALL", "VANILLALONGPUT"],
  },

  // ── Shared strategy IDs (used by both dTrader and dBot) ──────────────────
  rise_fall: {
    label: "Rise/Fall",
    contractTypes: ["CALL", "PUT"],
  },
  higher_lower: {
    label: "Higher/Lower",
    contractTypes: ["HIGHER", "LOWER"],
  },
  touch_no_touch: {
    label: "Touch/No Touch",
    contractTypes: ["ONETOUCH", "NOTOUCH"],
  },
  matches_differs: {
    label: "Matches/Differs",
    contractTypes: ["DIGITMATCH", "DIGITDIFF"],
  },
  even_odd: {
    label: "Even/Odd",
    contractTypes: ["DIGITEVEN", "DIGITODD"],
  },
  over_under: {
    label: "Over/Under",
    contractTypes: ["DIGITOVER", "DIGITUNDER"],
  },

  // ── dBot strategy IDs (singular form — backend uses singular) ─────────────
  accumulator: {
    label: "Accumulator",
    contractTypes: ["ACCU"],
  },
  multiplier: {
    label: "Multiplier",
    contractTypes: ["MULTUP", "MULTDOWN"],
  },
};
