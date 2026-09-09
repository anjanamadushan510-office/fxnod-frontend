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

import { derivWsUrl } from "./derivSymbols";
import { symbolMatchesStrategy } from "./contractTypes";
import { getCached, getStaleCached, setCached } from "./marketCache";
import { useMarketStore } from "@/components/options/market/marketStore";

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
  accumulator:    ["1HZ100V", "1HZ75V", "1HZ50V", "1HZ25V"],
  multiplier:     ["1HZ100V", "1HZ75V", "1HZ50V", "1HZ25V"],
  turbos:         ["1HZ100V", "1HZ75V", "1HZ50V", "1HZ25V"],
  vanillas:       ["1HZ100V", "1HZ75V", "1HZ50V", "1HZ25V", "frxEURUSD", "frxGBPUSD", "frxUSDJPY"],
  rise_fall: [
    "1HZ100V", "1HZ75V", "1HZ50V", "1HZ25V",
    "BOOM1000", "BOOM500", "CRASH1000", "CRASH500",
    "frxEURUSD", "frxGBPUSD", "frxUSDJPY", "cryBTCUSD", "cryETHUSD", "frxXAUUSD", "frxXAGUSD",
  ],
  higher_lower:    ["1HZ100V", "1HZ75V", "1HZ50V", "1HZ25V", "frxEURUSD", "frxGBPUSD", "frxUSDJPY", "frxXAUUSD", "frxXAGUSD"],
  touch_no_touch:  ["1HZ100V", "1HZ75V", "1HZ50V", "1HZ25V", "frxEURUSD", "frxGBPUSD", "frxUSDJPY"],
  matches_differs: ["1HZ100V", "1HZ75V", "1HZ50V", "1HZ25V"],
  even_odd:        ["1HZ100V", "1HZ75V", "1HZ50V", "1HZ25V"],
  over_under:      ["1HZ100V", "1HZ75V", "1HZ50V", "1HZ25V"],
};

export function getFallbackMarkets(strategyId: string): string[] {
  return FALLBACK_MARKETS[strategyId] ?? ["1HZ100V", "1HZ75V", "1HZ50V", "1HZ25V"];
}

// ─── One-shot WebSocket fetch ─────────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 10_000;

function fetchActiveSymbolsRaw(): Promise<DerivActiveSymbol[]> {
  return new Promise((resolve, reject) => {
    let settled = false;

    const timeout = setTimeout(() => {
      if (!settled) { settled = true; ws.close(); reject(new Error("active_symbols: timeout")); }
    }, FETCH_TIMEOUT_MS);

    const ws = new WebSocket(derivWsUrl());

    ws.onopen = () => {
      ws.send(JSON.stringify({ active_symbols: "brief" }));
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
          const mapped = msg.active_symbols.map((s: any) => ({
            symbol: s.underlying_symbol || s.symbol,
            display_name: s.underlying_symbol_name || s.display_name,
            market: s.market,
            submarket: s.submarket,
            exchange_is_open: s.exchange_is_open,
            is_trading_suspended: s.is_trading_suspended,
          }));
          resolve(mapped);
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
    const symbols = await getActiveSymbols();

    // Populate the global UI market store with raw symbols
    useMarketStore.getState().setMarketsFromDeriv(symbols as any);

    const matched: string[] = [];
    const seen = new Set<string>();

    for (const sym of symbols) {
      const suspended = sym.is_trading_suspended === 1 || sym.is_trading_suspended === true;
      if (suspended) continue;
      if (!symbolMatchesStrategy(sym.market, sym.submarket, strategyId)) continue;
      
      const catalogId = sym.symbol;
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
