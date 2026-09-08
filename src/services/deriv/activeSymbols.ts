/**
 * LOGIC-004: Active symbols resolver.
 *
 * Fetches Deriv active_symbols via a short-lived one-shot WebSocket,
 * filters for a given strategy, cross-references the catalog, caches,
 * and falls back gracefully on any failure.
 *
 * Priority:
 *   1. Fresh cache  (< 5 min)
 *   2. Deriv API   (one-shot WS, not the chart WS)
 *   3. Stale cache (any age)
 *   4. Static fallback
 */

import { derivV3Url } from "./derivSymbols";
import { symbolMatchesStrategy } from "./contractTypes";
import { getCached, getStaleCached, setCached } from "./marketCache";
import { MARKETS } from "@/components/options/market/catalog";

// ─── Deriv wire types ────────────────────────────────────────────────────────

interface DerivActiveSymbol {
  symbol: string;
  display_name: string;
  market: string;
  submarket: string;
  is_trading_suspended: number | boolean;
  exchange_is_open: number | boolean;
}

interface ActiveSymbolsResponse {
  active_symbols?: DerivActiveSymbol[];
  error?: { code: string; message: string };
}

// ─── Static fallback (demoted from botMeta.ts) ───────────────────────────────

export const FALLBACK_MARKETS: Record<string, string[]> = {
  accumulator:    ["vol_100_1s", "vol_75_1s", "vol_50_1s", "vol_25_1s"],
  multiplier:     ["vol_100_1s", "vol_75_1s", "vol_50_1s", "vol_25_1s"],
  turbos:         ["vol_100_1s", "vol_75_1s", "vol_50_1s", "vol_25_1s"],
  vanillas:       ["vol_100_1s", "vol_75_1s", "vol_50_1s", "vol_25_1s", "eur_usd", "gbp_usd", "usd_jpy"],
  rise_fall: [
    "vol_100_1s", "vol_75_1s", "vol_50_1s", "vol_25_1s",
    "boom_1000", "boom_500", "crash_1000", "crash_500",
    "eur_usd", "gbp_usd", "usd_jpy", "btc_usd", "eth_usd", "xau_usd", "xag_usd",
  ],
  higher_lower:    ["vol_100_1s", "vol_75_1s", "vol_50_1s", "vol_25_1s", "eur_usd", "gbp_usd", "usd_jpy", "xau_usd", "xag_usd"],
  touch_no_touch:  ["vol_100_1s", "vol_75_1s", "vol_50_1s", "vol_25_1s", "eur_usd", "gbp_usd", "usd_jpy"],
  matches_differs: ["vol_100_1s", "vol_75_1s", "vol_50_1s", "vol_25_1s"],
  even_odd:        ["vol_100_1s", "vol_75_1s", "vol_50_1s", "vol_25_1s"],
  over_under:      ["vol_100_1s", "vol_75_1s", "vol_50_1s", "vol_25_1s"],
};

export function getFallbackMarkets(strategyId: string): string[] {
  return FALLBACK_MARKETS[strategyId] ?? ["vol_100_1s", "vol_75_1s", "vol_50_1s", "vol_25_1s"];
}

// ─── Reverse lookup: Deriv symbol code → catalog ID ─────────────────────────

const derivToCatalog: Record<string, string> = {};
let reverseMapReady = false;

async function ensureReverseMap() {
  if (reverseMapReady) return;
  const { toDerivSymbol } = await import("./derivSymbols");
  for (const id of Object.keys(MARKETS)) {
    const code = toDerivSymbol(id);
    if (code) derivToCatalog[code] = id;
  }
  reverseMapReady = true;
}

// ─── One-shot WebSocket fetch ─────────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 10_000;

function fetchActiveSymbolsRaw(): Promise<DerivActiveSymbol[]> {
  return new Promise((resolve, reject) => {
    let settled = false;

    const timeout = setTimeout(() => {
      if (!settled) { settled = true; ws.close(); reject(new Error("active_symbols: timeout")); }
    }, FETCH_TIMEOUT_MS);

    const ws = new WebSocket(derivV3Url());

    ws.onopen = () => {
      ws.send(JSON.stringify({ active_symbols: "brief", product_type: "basic" }));
    };

    ws.onmessage = (event: MessageEvent) => {
      if (settled) return;
      try {
        const msg = JSON.parse(event.data as string) as ActiveSymbolsResponse;
        if (msg.error) {
          settled = true; clearTimeout(timeout); ws.close();
          reject(new Error(`active_symbols error: ${msg.error.message}`));
          return;
        }
        if (msg.active_symbols) {
          settled = true; clearTimeout(timeout); ws.close();
          resolve(msg.active_symbols);
        }
      } catch { /* malformed frame — wait */ }
    };

    ws.onerror = () => {
      if (!settled) { settled = true; clearTimeout(timeout); reject(new Error("active_symbols: WS error")); }
    };

    ws.onclose = () => {
      if (!settled) { settled = true; clearTimeout(timeout); reject(new Error("active_symbols: WS closed")); }
    };
  });
}

// In-flight deduplication: N concurrent callers share one WS connection.
let inFlightFetch: Promise<DerivActiveSymbol[]> | null = null;

async function getActiveSymbols(): Promise<DerivActiveSymbol[]> {
  if (inFlightFetch) return inFlightFetch;
  inFlightFetch = fetchActiveSymbolsRaw().finally(() => { inFlightFetch = null; });
  return inFlightFetch;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface MarketResolutionResult {
  markets: string[];
  source: "api" | "cache" | "stale_cache" | "fallback";
}

/**
 * Resolve catalog market IDs for a given strategy.
 *
 * Flow:
 *   1. Fresh cache                 → return immediately, no WS call
 *   2. Deriv active_symbols API    → filter, cross-ref catalog, cache
 *   3. Stale cache (any age)       → on API failure
 *   4. Static fallback             → last resort, never empty
 */
export async function getMarketsForStrategy(strategyId: string): Promise<MarketResolutionResult> {
  // 1. Fresh cache
  const fresh = getCached(strategyId);
  if (fresh) return { markets: fresh.markets, source: "cache" };

  // 2. API fetch
  try {
    await ensureReverseMap();
    const symbols = await getActiveSymbols();

    const matched: string[] = [];
    const seen = new Set<string>();

    for (const sym of symbols) {
      const suspended = sym.is_trading_suspended === 1 || sym.is_trading_suspended === true;
      if (suspended) continue;
      if (!symbolMatchesStrategy(sym.market, sym.submarket, strategyId)) continue;
      const catalogId = derivToCatalog[sym.symbol];
      if (!catalogId || seen.has(catalogId)) continue;
      seen.add(catalogId);
      matched.push(catalogId);
    }

    if (matched.length > 0) {
      setCached(strategyId, matched, "api");
      return { markets: matched, source: "api" };
    }
    throw new Error("No matching markets in API response");

  } catch (err) {
    // 3. Stale cache
    const stale = getStaleCached(strategyId);
    if (stale) {
      console.warn("[activeSymbols] API failed, using stale cache:", err);
      return { markets: stale.markets, source: "stale_cache" };
    }
    // 4. Static fallback
    console.warn("[activeSymbols] Using static fallback:", err);
    const fallback = getFallbackMarkets(strategyId);
    setCached(strategyId, fallback, "fallback");
    return { markets: fallback, source: "fallback" };
  }
}
