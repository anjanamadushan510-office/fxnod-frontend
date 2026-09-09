"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { cn } from "@/lib/cn";
import { useMarketStore } from "@/components/options/market/marketStore";
import type { Market } from "@/components/options/market/catalog";
import { SearchIcon } from "@/components/ui/Icons";

interface BotMarketPickerProps {
  value: string;
  onChange: (marketId: string) => void;
  allowedMarkets: string[];
  disabled?: boolean;
  loading?: boolean;
}

const CATEGORY_ORDER = [
  { id: "derived", label: "Derived" },
  { id: "forex", label: "Forex" },
  { id: "cryptocurrencies", label: "Crypto" },
  { id: "commodities", label: "Commodities" },
] as const;

/**
 * A Deriv-style market picker for dBot.
 * Shows category tabs + grouped markets in a dropdown panel.
 */
export function BotMarketPicker({
  value,
  onChange,
  allowedMarkets,
  disabled = false,
  loading = false,
}: BotMarketPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("derived");
  const containerRef = useRef<HTMLDivElement>(null);

  const { allMarkets } = useMarketStore();

  // Filter to only the markets allowed for this strategy
  const allowedSet = useMemo(() => new Set(allowedMarkets), [allowedMarkets]);
  const filteredAll = useMemo(
    () => allMarkets.filter((m) => allowedSet.has(m.id)),
    [allMarkets, allowedSet]
  );

  // Determine available categories (only those with allowed markets)
  const availableCategories = useMemo(() => {
    const catIds = new Set(filteredAll.map((m) => m.category));
    return CATEGORY_ORDER.filter((c) => catIds.has(c.id as never));
  }, [filteredAll]);

  // Set default active category to first available
  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.find(c => c.id === activeCategory)) {
      setActiveCategory(availableCategories[0].id);
    }
  }, [availableCategories, activeCategory]);

  // Markets for the active category, filtered by search
  const displayMarkets = useMemo(() => {
    const inCategory = filteredAll.filter((m) => {
      if (search.trim()) {
        return m.name.toLowerCase().includes(search.toLowerCase());
      }
      return m.category === activeCategory;
    });

    // Group by submarket
    const groups = new Map<string, { label: string; markets: Market[] }>();
    for (const m of inCategory) {
      const groupKey = getGroupKey(m);
      if (!groups.has(groupKey)) {
        groups.set(groupKey, { label: getGroupLabel(groupKey), markets: [] });
      }
      groups.get(groupKey)!.markets.push(m);
    }
    return groups;
  }, [filteredAll, activeCategory, search]);

  // Selected market info
  const selectedMarket = allMarkets.find((m) => m.id === value);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleSelect(id: string) {
    onChange(id);
    setOpen(false);
    setSearch("");
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2",
          "rounded-[var(--opt-radius-sm)] border border-opt-line bg-opt-bg-elev",
          "px-2.5 text-[12px] text-opt-ink transition-colors",
          "hover:border-opt-line-strong disabled:opacity-55",
          open && "border-opt-line-strong"
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <MarketIcon market={selectedMarket} size="sm" />
          <span className="truncate">
            {loading
              ? "Loading markets…"
              : selectedMarket?.name ?? value ?? "Select market"}
          </span>
        </div>
        <svg
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-opt-ink-3 transition-transform duration-150",
            open && "rotate-180"
          )}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-1 w-[320px]",
            "rounded-[var(--opt-radius)] border border-opt-line",
            "bg-opt-bg-elev shadow-xl shadow-black/25",
            "flex flex-col overflow-hidden",
            "animate-in fade-in slide-in-from-top-1 duration-150"
          )}
        >
          {/* Search bar */}
          <div className="flex items-center gap-2 border-b border-opt-line px-3 py-2">
            <SearchIcon className="h-3.5 w-3.5 shrink-0 text-opt-ink-3" />
            <input
              autoFocus
              type="text"
              placeholder="Search by market name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[12px] text-opt-ink outline-none placeholder:text-opt-ink-4"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-[10px] text-opt-ink-3 hover:text-opt-ink"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category tabs — hidden when searching */}
          {!search && availableCategories.length > 1 && (
            <div className="flex shrink-0 border-b border-opt-line">
              {availableCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex-1 py-2 text-[11px] font-semibold transition-colors",
                    activeCategory === cat.id
                      ? "border-b-2 border-opt-rise text-opt-rise"
                      : "text-opt-ink-3 hover:text-opt-ink"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Market groups list */}
          <div className="max-h-[340px] overflow-y-auto">
            {displayMarkets.size === 0 ? (
              <p className="px-4 py-6 text-center text-[11px] text-opt-ink-3">
                No markets found
              </p>
            ) : (
              Array.from(displayMarkets.entries()).map(([groupKey, group]) => (
                <div key={groupKey}>
                  {/* Group header */}
                  <div className="sticky top-0 bg-opt-bg px-3 py-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-opt-ink-3">
                      {group.label}
                    </span>
                  </div>
                  {/* Market rows */}
                  {group.markets.map((market) => (
                    <button
                      key={market.id}
                      type="button"
                      onClick={() => handleSelect(market.id)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2.5",
                        "transition-colors hover:bg-opt-bg-elev-2",
                        market.id === value && "bg-opt-rise-soft"
                      )}
                    >
                      <MarketIcon market={market} size="md" />
                      <div className="flex flex-1 flex-col items-start gap-0.5 text-left">
                        <span
                          className={cn(
                            "text-[12px] font-medium leading-tight",
                            market.id === value ? "text-opt-rise" : "text-opt-ink"
                          )}
                        >
                          {market.name}
                        </span>
                        {market.closed && (
                          <span className="rounded bg-opt-fall-soft px-1 text-[9px] font-bold text-opt-fall">
                            CLOSED
                          </span>
                        )}
                      </div>
                      {market.id === value && (
                        <svg className="h-3.5 w-3.5 shrink-0 text-opt-rise" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-opt-line px-3 py-1.5 text-[10px] text-opt-ink-4">
            {allowedMarkets.length} markets available for this strategy
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGroupKey(m: Market): string {
  // Group by subCategory (synthetics/baskets) and then by name prefix
  if (m.subCategory === "baskets") return "baskets";
  
  const name = m.name.toLowerCase();
  if (name.includes("volatility") || name.includes("vol")) return "volatility";
  if (name.includes("crash") || name.includes("boom")) return "crash_boom";
  if (name.includes("jump")) return "jump";
  if (name.includes("step")) return "step";
  if (name.includes("range")) return "range";
  if (name.includes("bear") || name.includes("bull")) return "daily_reset";
  if (name.includes("btc") || name.includes("eth") || name.includes("crypto")) return "crypto";
  if (name.includes("gold") || name.includes("silver") || name.includes("xau") || name.includes("xag")) return "metals";
  if (name.includes("usd") || name.includes("eur") || name.includes("gbp") || name.includes("jpy")) return "forex_major";
  return "other";
}

function getGroupLabel(key: string): string {
  switch (key) {
    case "volatility":    return "Volatility Indices";
    case "crash_boom":   return "Crash/Boom Indices";
    case "jump":         return "Jump Indices";
    case "step":         return "Step Indices";
    case "range":        return "Range Break Indices";
    case "daily_reset":  return "Daily Reset Indices";
    case "baskets":      return "Basket Indices";
    case "crypto":       return "Cryptocurrencies";
    case "metals":       return "Metals";
    case "forex_major":  return "Major Pairs";
    default:             return "Other";
  }
}

function MarketIcon({ market, size }: { market?: Market; size: "sm" | "md" }) {
  if (!market) {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-opt-line font-bold text-opt-ink-3",
          size === "sm" ? "h-5 w-5 text-[8px]" : "h-7 w-7 text-[10px]"
        )}
      >
        ?
      </span>
    );
  }

  const name = market.name.toLowerCase();
  const { bg, text, label } = getMarketIconStyle(name);

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold",
        size === "sm" ? "h-5 w-5 text-[7px]" : "h-7 w-7 text-[9px]",
        bg, text
      )}
    >
      {label}
    </span>
  );
}

function getMarketIconStyle(name: string): { bg: string; text: string; label: string } {
  if (name.includes("boom"))   return { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "BM" };
  if (name.includes("crash"))  return { bg: "bg-red-500/20",     text: "text-red-400",     label: "CR" };
  if (name.includes("jump"))   return { bg: "bg-amber-500/20",   text: "text-amber-400",   label: "JD" };
  if (name.includes("vol") || name.includes("volatility"))
                                return { bg: "bg-blue-500/20",    text: "text-blue-400",    label: "VX" };
  if (name.includes("step"))   return { bg: "bg-purple-500/20",  text: "text-purple-400",  label: "ST" };
  if (name.includes("range"))  return { bg: "bg-cyan-500/20",    text: "text-cyan-400",    label: "RB" };
  if (name.includes("btc"))    return { bg: "bg-orange-500/20",  text: "text-orange-400",  label: "BT" };
  if (name.includes("eth"))    return { bg: "bg-violet-500/20",  text: "text-violet-400",  label: "ET" };
  if (name.includes("gold") || name.includes("xau"))
                                return { bg: "bg-yellow-500/20",  text: "text-yellow-400",  label: "AU" };
  if (name.includes("eur"))    return { bg: "bg-blue-500/20",    text: "text-blue-400",    label: "EU" };
  if (name.includes("gbp"))    return { bg: "bg-indigo-500/20",  text: "text-indigo-400",  label: "GB" };
  return                              { bg: "bg-opt-line",        text: "text-opt-ink-3",   label: "MK" };
}
