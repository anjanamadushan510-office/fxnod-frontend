import type { BotDefinition } from "./types";

/**
 * The bots offered in the picker.
 *
 * Temporary: the backend already exposes this shape via `auto_list_strategies`
 * (strategy_id, display_name, description, supported_contract_types plus a
 * JSON Schema for each bot's parameters). Once that endpoint is wired the list
 * comes from the server and this file goes away — which is the whole point of
 * the server declaring the schema, since 20 bots must not become 20 hand-
 * maintained frontend entries.
 */
export const BOTS: BotDefinition[] = [
  {
    id: "accumulator",
    name: "Accumulator",
    tagline: "Accumulate small gains",
    contractType: "accumulators",
  },
  {
    id: "multiplier",
    name: "Multiplier",
    tagline: "Multiply your profit",
    contractType: "multipliers",
  },
  {
    id: "coming_soon",
    name: "Coming Soon",
    tagline: "More bots on the way",
    contractType: "",
    comingSoon: true,
  },
];

/** Leverage steps offered for multiplier-style bots. */
export const MULTIPLIER_STEPS = [2, 5, 10, 20] as const;

/**
 * Markets the bot picker offers. A subset of the shared options catalog —
 * bots only run on the continuously-quoted synthetic indices, so listing the
 * closed-on-weekends markets here would just produce runs that cannot start.
 */
export const BOT_MARKET_IDS = [
  "vol_75_1s",
  "vol_100_1s",
  "vol_50_1s",
  "vol_25_1s",
] as const;
