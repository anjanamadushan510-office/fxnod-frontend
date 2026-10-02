"use client";

import { useEffect, useMemo, useState } from "react";
import {
  durationBandsFor,
  durationFits,
  type DurationBand,
} from "@/components/bot/builder/durationLimits";
import { loadContractsFor } from "@/services/deriv/contractsFor";
import { toDerivSymbol } from "@/services/deriv/derivSymbols";

const RISE_FALL = ["CALL", "PUT"] as const;

export interface RiseFallDurationState {
  loading: boolean;
  failed: boolean;
  bands: DurationBand[];
  retry: () => void;
}

/**
 * Durations Deriv currently sells for Rise and Fall on every selected market.
 */
export function useRiseFallDurations(symbols: readonly string[]): RiseFallDurationState {
  const key = symbols.join("\0");
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ loading: boolean; failed: boolean; bands: DurationBand[] }>({
    loading: symbols.length > 0,
    failed: false,
    bands: [],
  });

  useEffect(() => {
    if (symbols.length === 0) {
      setState({ loading: false, failed: false, bands: [] });
      return;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, failed: false }));

    Promise.all(
      symbols.map((symbol) =>
        loadContractsFor(toDerivSymbol(symbol) ?? symbol, { fresh: attempt > 0 }),
      ),
    )
      .then((lists) => {
        if (cancelled) return;
        setState({
          loading: false,
          failed: false,
          bands: durationBandsFor(RISE_FALL, lists.map((list) => list.available)),
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ loading: false, failed: true, bands: [] });
      });

    return () => {
      cancelled = true;
    };
    // key is the symbol list; attempt retries the same list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  return useMemo(
    () => ({
      ...state,
      retry: () => setAttempt((n) => n + 1),
    }),
    [state],
  );
}

export function riseFallDurationIssue(
  method: string,
  duration: string,
  durationUnit: string,
  symbols: readonly string[],
  durations: Pick<RiseFallDurationState, "loading" | "failed" | "bands">,
): string | null {
  if (method !== "rise_fall") return null;
  if (symbols.length === 0) return null;
  if (durations.loading) return "Deriv has not confirmed the durations for these markets yet.";
  if (durations.failed) return "The valid durations could not be loaded from Deriv.";
  if (durations.bands.length === 0) {
    return "These markets do not share a Rise/Fall duration right now.";
  }
  const band = durations.bands.find((item) => item.unit === durationUnit);
  if (!durationFits(band, duration)) {
    return "Enter a duration Deriv sells on every selected market.";
  }
  return null;
}
