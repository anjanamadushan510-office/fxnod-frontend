"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getGroupKey, getGroupLabel } from "@/components/bot/marketGroups";
import type { Market } from "@/components/options/market/catalog";
import { useMarketStore } from "@/components/options/market/marketStore";
import { useMarketsForStrategy } from "@/hooks/useMarketsForStrategy";

interface MarketPickerProps {
  /** The bot's contract; Deriv is asked which markets offer it right now. */
  contractType: string;
  selected: string[];
  onChange: (symbols: string[]) => void;
  min: number;
  max: number;
  /** Markets the bot does not trade, from the catalogue. */
  excluded: string[];
  /** When not empty, the only markets the bot trades, from the catalogue. */
  only: string[];
  /** Where the selection starts when the user has not chosen yet. */
  suggested: string[];
}

const GROUP_ORDER = ["volatility", "jump", "step", "range", "crash_boom", "daily_reset", "baskets"];

function groupRank(key: string): number {
  const index = GROUP_ORDER.indexOf(key);
  return index === -1 ? GROUP_ORDER.length : index;
}

/**
 * The markets a bot will watch.
 *
 * Only markets Deriv is offering for the bot's contract are listed, minus the
 * ones the bot excludes and, for a bot that names its markets, only those. Nothing is listed until Deriv has answered: a static
 * list would offer markets the bot may not be able to trade. The server checks
 * the choice again at start, against Deriv, so this is a convenience and not
 * the rule.
 */
export function MarketPicker({
  contractType,
  selected,
  onChange,
  min,
  max,
  excluded,
  only,
  suggested,
}: MarketPickerProps) {
  const { markets: offered, loading, source, retry } = useMarketsForStrategy(contractType);
  const allMarkets = useMarketStore((s) => s.allMarkets);
  const live = source === "api" || source === "cache" || source === "stale_cache";

  const allowed = useMemo(() => {
    const blocked = new Set(excluded);
    const permitted = only.length > 0 ? new Set(only) : null;
    return offered.filter((id) => !blocked.has(id) && (permitted === null || permitted.has(id)));
  }, [offered, excluded, only]);

  // Start from the bot's suggestions, once, and only if nothing is chosen. A
  // selection restored from a draft, or made by the user, is left alone.
  const seeded = useRef(false);
  useEffect(() => {
    if (!live || seeded.current) return;
    seeded.current = true;
    if (selected.length > 0) {
      // Drop anything Deriv is not offering any more.
      const open = new Set(allowed);
      const kept = selected.filter((id) => open.has(id));
      if (kept.length !== selected.length) onChange(kept);
      return;
    }
    const open = new Set(allowed);
    const start = suggested.filter((id) => open.has(id)).slice(0, max);
    if (start.length > 0) onChange(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, allowed]);

  const groups = useMemo(() => {
    if (!live) return [];
    const byId = new Map(allMarkets.map((m) => [m.id, m]));
    const grouped = new Map<string, { label: string; markets: Market[] }>();
    for (const id of allowed) {
      const market: Market = byId.get(id) ?? { id, name: id, seedPrice: 0, category: "derived" };
      if (market.closed) continue;
      const key = getGroupKey(market);
      if (!grouped.has(key)) grouped.set(key, { label: getGroupLabel(key), markets: [] });
      grouped.get(key)!.markets.push(market);
    }
    // A fixed order, so the list does not rearrange itself between visits:
    // Deriv returns the markets in no particular one.
    return [...grouped.entries()]
      .sort(([a], [b]) => groupRank(a) - groupRank(b))
      .map(([, group]) => group);
  }, [allMarkets, allowed, live]);

  const single = max === 1;
  const full = selected.length >= max;
  const [selection, setSelection] = useState(single ? selected[0] ?? "" : "");

  useEffect(() => {
    if (single) setSelection(selected[0] ?? "");
  }, [selected, single]);

  function toggle(id: string) {
    if (single) {
      onChange([id]);
    } else if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (!full) {
      onChange([...selected, id]);
    }
  }

  function choose(id: string) {
    if (!id) return;
    toggle(id);
    setSelection(single ? id : "");
  }

  return (
    <div>
      <p className="text-xs text-ink-3 mb-4">
        {loading
          ? "Asking Deriv which markets this bot can trade right now…"
          : !live
            ? "Deriv did not return the markets for this bot."
            : single
              ? "Choose one market."
              : `${selected.length} selected · tap to add or remove · ${min === max ? max : `${min} to ${max}`}`}
      </p>

      {!loading && !live && (
        <div className="rounded-xl border border-line bg-surface-2 p-5">
          <p className="text-sm text-ink-2">
            The open markets could not be loaded. Nothing here is a guess: try again, and only
            markets Deriv is offering for this bot will be listed.
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 h-9 px-4 rounded-lg bg-action text-action-ink text-sm font-medium hover:opacity-80"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && live && groups.length === 0 && (
        <p className="text-sm text-ink-2">No markets are open for this bot right now.</p>
      )}

      {!loading && live && groups.length > 0 && (
        <div className="space-y-3">
          <label htmlFor="autohub-market-select" className="text-xs font-medium text-ink-2">
            {single ? "Select a market" : "Add markets"}
          </label>
          <select
            id="autohub-market-select"
            value={selection}
            onChange={(event) => choose(event.target.value)}
            disabled={!single && full}
            className="h-11 w-full rounded-xl border border-line bg-surface-2 px-3 text-sm text-ink outline-none transition focus:border-action focus:ring-2 focus:ring-action/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              {single ? "Choose a market…" : full ? "Maximum markets selected" : "Choose a market to add…"}
            </option>
            {groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.markets.map((market) => (
                  <option key={market.id} value={market.id} disabled={selected.includes(market.id)}>
                    {market.name} · {market.id}{selected.includes(market.id) ? " (selected)" : ""}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2" aria-label="Selected markets">
              {selected.map((id) => {
                const market = groups.flatMap((group) => group.markets).find((item) => item.id === id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggle(id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-action/30 bg-action/10 px-2.5 py-1.5 text-xs text-ink transition hover:bg-action/20"
                    aria-label={`Remove ${market?.name ?? id}`}
                  >
                    {market?.name ?? id}
                    <span aria-hidden="true" className="text-ink-3">×</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
