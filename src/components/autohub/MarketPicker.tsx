"use client";

import { useEffect, useMemo, useRef } from "react";
import { ChoiceCard, GroupLabel } from "@/components/bot/builder/controls";
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
 * ones the bot excludes. Nothing is listed until Deriv has answered: a static
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
  suggested,
}: MarketPickerProps) {
  const { markets: offered, loading, source, retry } = useMarketsForStrategy(contractType);
  const allMarkets = useMarketStore((s) => s.allMarkets);
  const live = source === "api" || source === "cache" || source === "stale_cache";

  const allowed = useMemo(() => {
    const blocked = new Set(excluded);
    return offered.filter((id) => !blocked.has(id));
  }, [offered, excluded]);

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

  function toggle(id: string) {
    if (single) {
      onChange([id]);
    } else if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (!full) {
      onChange([...selected, id]);
    }
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
            className="mt-4 h-9 px-4 rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-80"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && live && groups.length === 0 && (
        <p className="text-sm text-ink-2">No markets are open for this bot right now.</p>
      )}

      {groups.map((group) => (
        <section key={group.label} className="mb-6 last:mb-0">
          <GroupLabel>{group.label}</GroupLabel>
          {/* Two across on a phone too: a bot offers twenty markets, and one
              per row put the Start button a dozen screens down. */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {group.markets.map((market) => {
              const active = selected.includes(market.id);
              return (
                <ChoiceCard
                  key={market.id}
                  size="sm"
                  title={market.name}
                  description={market.id}
                  active={active}
                  disabled={!single && !active && full}
                  onSelect={() => toggle(market.id)}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
