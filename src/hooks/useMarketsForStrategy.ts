"use client";

/**
 * LOGIC-004: React hook for dynamic market resolution.
 *
 * Wraps the getMarketsForStrategy() service in React state so components
 * get a live { markets, loading, source } tuple that updates when the
 * strategy changes.
 *
 * - Never returns an empty list (fallback guarantees at least 4 markets).
 * - Deduplicates concurrent fetches (service-level in-flight guard).
 * - Refetches when strategyId changes; uses cached data immediately if fresh.
 */

import { useEffect, useRef, useState } from "react";
import { getMarketsForStrategy, getFallbackMarkets } from "@/services/deriv/activeSymbols";
import type { MarketResolutionResult } from "@/services/deriv/activeSymbols";

export interface UseMarketsResult {
  markets: string[];
  loading: boolean;
  source: MarketResolutionResult["source"] | "initial";
}

export function useMarketsForStrategy(strategyId: string): UseMarketsResult {
  const [state, setState] = useState<UseMarketsResult>(() => ({
    // Initialise synchronously from static fallback so the dropdown is never
    // empty even during the first async fetch.
    markets: getFallbackMarkets(strategyId),
    loading: true,
    source: "initial",
  }));

  // Track the current strategyId so stale async results are discarded.
  const currentStrategyRef = useRef(strategyId);

  useEffect(() => {
    currentStrategyRef.current = strategyId;
    let cancelled = false;

    // Show the fallback immediately while we fetch, preventing an empty dropdown.
    setState({
      markets: getFallbackMarkets(strategyId),
      loading: true,
      source: "initial",
    });

    getMarketsForStrategy(strategyId)
      .then((result) => {
        if (cancelled || currentStrategyRef.current !== strategyId) return;
        setState({ markets: result.markets, loading: false, source: result.source });
      })
      .catch(() => {
        if (cancelled || currentStrategyRef.current !== strategyId) return;
        // getMarketsForStrategy itself never rejects (catches internally),
        // but guard here just in case.
        setState((prev) => ({ ...prev, loading: false }));
      });

    return () => { cancelled = true; };
  }, [strategyId]);

  return state;
}
