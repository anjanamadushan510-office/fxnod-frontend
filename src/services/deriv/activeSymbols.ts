/**
 * LOGIC-004: Active symbols resolver.
 *
 * Fetches Deriv active_symbols via a short-lived one-shot WebSocket,
 * filtered exactly by the required contract_type for the active strategy.
 */

import { derivWsUrl } from "./derivSymbols";
import { TRADE_TYPE_CONFIG } from "./contractTypes";
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

// ─── Static fallback ─────────────────────────────────────────────────────────

export const FALLBACK_MARKETS: Record<string, string[]> = {
  accumulators:    ["1HZ100V", "1HZ75V", "1HZ50V", "1HZ25V", "BOOM1000", "CRASH1000"],
  multipliers:     ["1HZ100V", "1HZ75V", "1HZ50V", "1HZ25V"],
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

function fetchActiveSymbolsRaw(contractTypes?: string[]): Promise<DerivActiveSymbol[]> {
  return new Promise((resolve, reject) => {
    let settled = false;

    const timeout = setTimeout(() => {
      if (!settled) { settled = true; ws.close(); reject(new Error("active_symbols: timeout")); }
    }, FETCH_TIMEOUT_MS);

    const ws = new WebSocket(derivWsUrl());

    ws.onopen = () => {
      const req: any = { active_symbols: "brief" };
      if (contractTypes && contractTypes.length > 0) {
        req.contract_type = contractTypes;
      }
      ws.send(JSON.stringify(req));
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

// In-flight deduplication: Keyed by strategyId so concurrent requests for different tabs don't clash
const inFlightFetches = new Map<string, Promise<DerivActiveSymbol[]>>();

async function getActiveSymbols(strategyId: string): Promise<DerivActiveSymbol[]> {
  if (inFlightFetches.has(strategyId)) {
    return inFlightFetches.get(strategyId)!;
  }
  
  const config = TRADE_TYPE_CONFIG[strategyId];
  const contractTypes = config?.contractTypes;
  
  const promise = fetchActiveSymbolsRaw(contractTypes).finally(() => {
    inFlightFetches.delete(strategyId);
  });
  
  inFlightFetches.set(strategyId, promise);
  return promise;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface MarketResolutionResult {
  markets: string[];
  source: "api" | "cache" | "stale_cache" | "fallback";
}

/**
 * Resolve catalog market IDs for a given strategy directly using Deriv's
 * contract_type filter.
 */
export async function getMarketsForStrategy(strategyId: string): Promise<MarketResolutionResult> {
  // 1. Fresh cache
  const fresh = getCached(strategyId);
  if (fresh) {
    // If we have it in cache, we MUST STILL populate the store because the store
    // gets overwritten when switching tabs. But wait, `fresh` only has `markets` array of IDs.
    // It doesn't have the full objects needed by `setMarketsFromDeriv`.
    // Oh no! We can't reconstruct the store just from IDs.
    // Solution: the store should cache the actual symbols, OR we just fetch every time, OR
    // we bypass caching of the API request here and let the `inFlightFetches` handle rapid switches.
  }

  // Actually, wait: `setMarketsFromDeriv` requires the full array of `DerivActiveSymbol`.
  // Our `marketCache` only stores the `string[]` of IDs.
  // If the user switches back and forth, they will hit the cache and get `["1HZ100V", ...]`, 
  // BUT `setMarketsFromDeriv` won't be called, so the store will remain stuck on the PREVIOUS tab's markets!
  // To fix this, we need to cache the full `DerivActiveSymbol[]` array in `marketCache` instead of just IDs!
  // Let's modify `marketCache.ts` or just store it in memory here.
  
  return fetchAndSetMarkets(strategyId);
}

// Memory cache for the full objects
const fullSymbolsCache = new Map<string, { timestamp: number, symbols: DerivActiveSymbol[] }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

async function fetchAndSetMarkets(strategyId: string): Promise<MarketResolutionResult> {
  try {
    const cached = fullSymbolsCache.get(strategyId);
    let symbols: DerivActiveSymbol[];
    let source: "api" | "cache" = "api";
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      symbols = cached.symbols;
      source = "cache";
    } else {
      symbols = await getActiveSymbols(strategyId);
      fullSymbolsCache.set(strategyId, { timestamp: Date.now(), symbols });
    }

    // Populate the global UI market store with raw symbols
    useMarketStore.getState().setMarketsFromDeriv(symbols as any);

    const matched: string[] = [];
    const seen = new Set<string>();

    for (const sym of symbols) {
      const suspended = sym.is_trading_suspended === 1 || sym.is_trading_suspended === true;
      if (suspended) continue;
      
      const catalogId = sym.symbol;
      if (!catalogId || seen.has(catalogId)) continue;
      seen.add(catalogId);
      matched.push(catalogId);
    }

    if (matched.length > 0) {
      return { markets: matched, source };
    }
    throw new Error("No matching markets in API response");

  } catch (err) {
    // Stale cache
    const stale = fullSymbolsCache.get(strategyId);
    if (stale) {
      console.warn("[activeSymbols] API failed, using stale cache:", err);
      useMarketStore.getState().setMarketsFromDeriv(stale.symbols as any);
      return { markets: stale.symbols.map(s => s.symbol), source: "stale_cache" };
    }
    
    // Static fallback
    console.warn("[activeSymbols] Using static fallback:", err);
    const fallback = getFallbackMarkets(strategyId);
    // Note: Fallback doesn't easily populate the store with names/categories, but `allMarkets` might have old data.
    // In a real failure, they won't be able to trade anyway.
    return { markets: fallback, source: "fallback" };
  }
}
