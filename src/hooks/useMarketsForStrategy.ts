"use client";

/**
 * LOGIC-004: React hook for dynamic market resolution.
 *
 * Wraps the getMarketsForStrategy() service in React state so components
 * get a live { markets, loading, source } tuple that updates when the
 * strategy changes.
 *
 * The list stays empty until Deriv answers. A static fallback is not shown:
 * a guessed market is one this method may not be able to trade right now.
 * Refetches when the strategy changes. `retry` asks Deriv again.
 */

import { useEffect, useRef, useState } from "react";
import { getMarketsForStrategy } from "@/services/deriv/activeSymbols";
import type { MarketResolutionResult } from "@/services/deriv/activeSymbols";

export interface UseMarketsResult {
  markets: string[];
  loading: boolean;
  source: MarketResolutionResult["source"] | "initial";
}

export function useMarketsForStrategy(strategyId: string): UseMarketsResult & { retry: () => void } {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<UseMarketsResult>({
    markets: [],
    loading: true,
    source: "initial",
  });

  // Track the current strategyId so stale async results are discarded.
  const currentStrategyRef = useRef(strategyId);

  useEffect(() => {
    currentStrategyRef.current = strategyId;
    let cancelled = false;

    // Nothing is listed until Deriv answers. A static guess would let someone
    // pick a market this method cannot trade right now.
    setState({ markets: [], loading: true, source: "initial" });

    getMarketsForStrategy(strategyId, { fresh: attempt > 0 })
      .then((result) => {
        if (cancelled || currentStrategyRef.current !== strategyId) return;
        if (result.source === "fallback") {
          setState({ markets: [], loading: false, source: "fallback" });
          return;
        }
        setState({ markets: result.markets, loading: false, source: result.source });
      })
      .catch(() => {
        if (cancelled || currentStrategyRef.current !== strategyId) return;
        setState({ markets: [], loading: false, source: "fallback" });
      });

    return () => { cancelled = true; };
  }, [strategyId, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
