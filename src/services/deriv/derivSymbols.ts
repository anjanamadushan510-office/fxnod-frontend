/**
 * Mapping layer between the FXNod catalog and the Deriv WebSocket API.
 *
 * Our UI speaks catalog ids ("vol_100_1s") and interval ids ("1t", "5m");
 * Deriv speaks its own symbol codes ("1HZ100V") and candle granularities in
 * seconds. Everything that translates between the two lives here so the feed
 * hook and chart component stay protocol-agnostic.
 */

import queryString from "query-string";
import type { ChartTypeId, IntervalId } from "@/components/options/chart/chartSettings";

// ─── Connection config ───────────────────────────────────────────────────────
// Deriv's market-data streams (ticks / candles) are public — no OAuth/OTP. The
// app_id MUST come from the environment (.env.local: NEXT_PUBLIC_DERIV_APP_ID);
// 1089 is only a last-resort dev fallback so a missing var doesn't hard-crash.
const DERIV_WS_BASE =
  process.env.NEXT_PUBLIC_DERIV_WS_URL ?? "wss://ws.derivws.com/websockets/v3";

/** Full WS endpoint (no app_id needed for V2 public endpoint). */
export function derivWsUrl(): string {
  return `wss://api.derivws.com/trading/v1/options/ws/public?${queryString.stringify({
    l: "en",
    brand: "deriv",
  })}`;
}

/** V3 WS endpoint (requires app_id, used for active_symbols etc). */
export function derivV3Url(): string {
  const appId = process.env.NEXT_PUBLIC_DERIV_APP_ID ?? "1089";
  return `${DERIV_WS_BASE}?app_id=${appId}`;
}

// ─── Symbol mapping (legacy catalog id → Deriv symbol) ───────────────────────
// Maps old hardcoded catalog IDs to their true Deriv symbols to prevent saved
// user presets from breaking. For new markets, the catalog ID is the Deriv symbol.
const CATALOG_TO_DERIV: Record<string, string> = {
  // Derived → Synthetics
  vol_100_1s: "1HZ100V",
  vol_90_1s: "1HZ90V",
  vol_75_1s: "1HZ75V",
  vol_50_1s: "1HZ50V",
  vol_30_1s: "1HZ30V",
  vol_25_1s: "1HZ25V",
  vol_15_1s: "1HZ15V",
  vol_10_1s: "1HZ10V",

  vol_100: "R_100",
  vol_75: "R_75",
  vol_50: "R_50",
  vol_25: "R_25",
  vol_10: "R_10",

  step_100: "STEP100",
  step_200: "STEP200",
  step_300: "STEP300",
  step_400: "STEP400",
  step_500: "STEP500",

  boom_1000: "BOOM1000",
  boom_900: "BOOM900",
  boom_600: "BOOM600",
  boom_500: "BOOM500",
  boom_300: "BOOM300N",
  boom_150: "BOOM150",
  boom_50: "BOOM50",

  crash_1000: "CRASH1000",
  crash_900: "CRASH900",
  crash_600: "CRASH600",
  crash_500: "CRASH500",
  crash_300: "CRASH300N",
  crash_150: "CRASH150",
  crash_50: "CRASH50",

  jump_100: "JD100",
  jump_75: "JD75",
  jump_50: "JD50",
  jump_25: "JD25",
  jump_10: "JD10",

  range_break_100: "RANGEBREAK100",
  range_break_200: "RANGEBREAK200",

  bull_market: "RDBULL",
  bear_market: "RDBEAR",

  // Derived → Baskets
  basket_aud: "WLDAUD",
  basket_eur: "WLDEUR",
  basket_gbp: "WLDGBP",
  basket_usd: "WLDUSD",
  basket_xau: "WLDXAU",

  // Cryptocurrencies
  btc_usd: "cryBTCUSD",
  eth_usd: "cryETHUSD",

  // Forex
  eur_usd: "frxEURUSD",
  gbp_usd: "frxGBPUSD",
  usd_jpy: "frxUSDJPY",

  // Commodities
  xau_usd: "frxXAUUSD",
  xag_usd: "frxXAGUSD",

  // Stock indices
  spx: "OTC_SPC",
  ndx: "OTC_NDX",
};

/** Resolves a legacy catalog ID to a Deriv symbol, or returns the input if already a Deriv symbol. */
export function toDerivSymbol(catalogId: string): string | undefined {
  if (!catalogId) return undefined;
  return CATALOG_TO_DERIV[catalogId] || catalogId;
}

// Reverse index so the URL can carry Deriv-style codes (e.g. ?symbol=1HZ100V)
// while the rest of the app keeps speaking catalog ids.
const DERIV_TO_CATALOG: Record<string, string> = Object.fromEntries(
  Object.entries(CATALOG_TO_DERIV).map(([catalogId, deriv]) => [
    deriv,
    catalogId,
  ]),
);

/** 
 * Deriv symbol (e.g. "1HZ100V") → catalog id. 
 * Since catalog IDs are now exactly Deriv symbols, this is mostly an identity pass-through,
 * but resolves known ones back to legacy IDs if they were stored that way.
 */
export function fromDerivSymbol(
  code: string | null | undefined,
): string | undefined {
  if (!code) return undefined;
  // If we want to fully drop legacy IDs from memory, just return `code`.
  // Returning `code` directly preserves the API's name as the canonical ID.
  return code;
}

// ─── Interval → candle granularity (seconds) ─────────────────────────────────
// Only the granularities Deriv accepts for `ticks_history` candles.
const INTERVAL_GRANULARITY: Record<Exclude<IntervalId, "1t">, number> = {
  "1m": 60,
  "2m": 120,
  "3m": 180,
  "5m": 300,
  "10m": 600,
  "15m": 900,
  "30m": 1800,
  "1h": 3600,
  "2h": 7200,
  "4h": 14400,
  "8h": 28800,
  "1d": 86400,
};

export type FeedStyle = "ticks" | "candles";

export interface FeedPlan {
  /** Wire format requested from Deriv. */
  style: FeedStyle;
  /** Candle width in seconds (only when style === "candles"). */
  granularity?: number;
  /** Which lightweight-charts series the chartType maps to. */
  seriesKind: "area" | "candlestick";
}

/**
 * Resolve what to actually stream given the URL's chart type + interval.
 *
 *   - chartType "area" + interval "1t"  → raw tick stream, area series
 *   - chartType "area" + interval "5m"  → 5m candles, area series of closes
 *   - chartType candle/hollow/ohlc      → candles (1t falls back to 1-min,
 *                                          since Deriv has no sub-minute candle)
 */
export function feedPlan(chartType: ChartTypeId, interval: IntervalId): FeedPlan {
  const wantsCandles = chartType !== "area";
  const seriesKind = wantsCandles ? "candlestick" : "area";

  if (interval === "1t") {
    return wantsCandles
      ? { style: "candles", granularity: 60, seriesKind }
      : { style: "ticks", seriesKind };
  }

  return {
    style: "candles",
    granularity: INTERVAL_GRANULARITY[interval],
    seriesKind,
  };
}
