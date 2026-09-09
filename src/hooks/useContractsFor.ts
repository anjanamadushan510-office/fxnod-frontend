"use client";

/**
 * LOGIC-002: React hook for market-specific contract parameters.
 *
 * When the user selects a market in the dBot configuration panel, this hook
 * fires a `contracts_for` fetch to the Deriv API and returns the live
 * multiplier values, growth rates, default stake and other parameters for
 * that specific market.
 *
 * - Returns loading=true + empty params while fetching.
 * - Never throws — falls back to EMPTY_PARAMS on any error.
 * - Deduplicates concurrent fetches for the same symbol.
 * - Cache TTL: 5 minutes.
 */

import { useEffect, useRef, useState } from "react";
import {
  getContractsFor,
  EMPTY_PARAMS,
  type MarketContractParams,
} from "@/services/deriv/contractsFor";
import { toDerivSymbol } from "@/services/deriv/derivSymbols";

export interface UseContractsForResult {
  params: MarketContractParams;
  loading: boolean;
}

export function useContractsFor(catalogMarketId: string): UseContractsForResult {
  const [state, setState] = useState<UseContractsForResult>({
    params: EMPTY_PARAMS,
    loading: Boolean(catalogMarketId),
  });

  // Track current marketId to discard stale responses
  const currentIdRef = useRef(catalogMarketId);

  useEffect(() => {
    currentIdRef.current = catalogMarketId;
    if (!catalogMarketId) {
      setState({ params: EMPTY_PARAMS, loading: false });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    // Convert catalog ID to Deriv symbol (e.g. "vol_100_1s" → "1HZ100V")
    const derivSymbol = toDerivSymbol(catalogMarketId) ?? catalogMarketId;

    let cancelled = false;

    getContractsFor(derivSymbol)
      .then((params) => {
        if (cancelled || currentIdRef.current !== catalogMarketId) return;
        setState({ params, loading: false });
      })
      .catch(() => {
        if (cancelled || currentIdRef.current !== catalogMarketId) return;
        setState({ params: EMPTY_PARAMS, loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, [catalogMarketId]);

  return state;
}
