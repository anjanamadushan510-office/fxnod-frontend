/**
 * LOGIC-004: Module-level TTL cache for resolved market lists.
 *
 * Survives React re-renders (lives outside the component tree), clears on
 * full page reload.  A Map keyed by strategyId stores the list of catalog
 * market IDs plus the timestamp of the last successful API fetch.
 *
 * TTL is 5 minutes — markets don't change faster than that in practice, and
 * Deriv's active_symbols response is itself cached server-side for minutes.
 */

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  /** Resolved catalog IDs, e.g. ["vol_100_1s", "vol_75_1s", …] */
  markets: string[];
  /** Source so callers can show a subtle indicator if desired. */
  source: "api" | "fallback";
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

/** Write a fresh API result into the cache. */
export function setCached(
  strategyId: string,
  markets: string[],
  source: "api" | "fallback",
): void {
  cache.set(strategyId, { markets, source, timestamp: Date.now() });
}

/** Read from cache. Returns undefined if absent or expired. */
export function getCached(strategyId: string): CacheEntry | undefined {
  const entry = cache.get(strategyId);
  if (!entry) return undefined;
  const age = Date.now() - entry.timestamp;
  if (age > CACHE_TTL_MS) {
    cache.delete(strategyId);
    return undefined;
  }
  return entry;
}

/**
 * Read from cache regardless of age (stale-while-revalidate fallback).
 * Used when the API call fails: stale data > empty dropdown.
 */
export function getStaleCached(strategyId: string): CacheEntry | undefined {
  return cache.get(strategyId);
}

/** Evict a single entry (used in tests / forced refresh). */
export function evict(strategyId: string): void {
  cache.delete(strategyId);
}

/** Evict ALL entries. */
export function evictAll(): void {
  cache.clear();
}
