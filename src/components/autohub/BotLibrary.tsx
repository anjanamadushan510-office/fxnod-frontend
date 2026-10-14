"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Bot, Grid2X2, List, Search, Star, X } from "lucide-react";
import type { AutoHubBot } from "@/services/api/model";
import { useBotFavourites } from "@/hooks/useBotFavourites";
import { FavouriteButton } from "./FavouriteButton";
import { contractLabel, durationLabel, filterBots } from "./catalogue";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 12;
export function BotLibrary({
  bots,
  runningIds,
}: {
  bots: AutoHubBot[];
  runningIds: Set<string>;
}) {
  const favourites = useBotFavourites();
  const [search, setSearch] = useState("");
  const [contract, setContract] = useState("");
  const [markets, setMarkets] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [sort, setSort] = useState("catalogue");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const contracts = useMemo(
    () =>
      [...new Set(bots.map((bot) => bot.contract_type))].sort((a, b) =>
        contractLabel(a).localeCompare(contractLabel(b)),
      ),
    [bots],
  );
  const filtered = filterBots(bots, favourites.ids, {
    search,
    contract,
    markets,
    favouritesOnly: savedOnly,
    sort,
  });
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const savedCount = bots.filter((bot) =>
    favourites.ids.has(bot.bot_id),
  ).length;
  const hasFilters = !!search || !!contract || !!markets;
  function selectPage(next: number) {
    setPage(next);
    document.getElementById("bot-library")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }
  function reset() {
    setSearch("");
    setContract("");
    setMarkets("");
    setSavedOnly(false);
    setPage(1);
  }
  const fieldClass =
    "h-11 rounded-xl border border-line bg-surface text-ink text-sm px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink min-w-0";

  return (
    <div className="space-y-5" id="bot-library">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-ink">Bot library</h2>
          <p className="text-sm text-ink-3 mt-1">
            Find your strategy. Save your favourites for next time.
          </p>
        </div>
        <span className="text-xs text-ink-2 rounded-full border border-line bg-surface px-3 py-1.5">
          {bots.length} bots available
        </span>
      </div>
      <div className="workspace-card rounded-2xl border border-line bg-surface p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="inline-flex rounded-xl bg-surface-2 p-1 gap-1"
            role="group"
            aria-label="Bot collection"
          >
            {[false, true].map((saved) => (
              <button
                key={String(saved)}
                type="button"
                aria-pressed={savedOnly === saved}
                onClick={() => {
                  setSavedOnly(saved);
                  setPage(1);
                }}
                className={cn(
                  "min-h-10 px-3 sm:px-4 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                  savedOnly === saved
                    ? "bg-action text-action-ink"
                    : "text-ink-2 hover:text-ink",
                )}
              >
                {saved && <Star size={15} />}{" "}
                {saved ? "Favourites" : "All bots"}
                <span className="text-xs opacity-70">
                  {saved ? (favourites.ready ? savedCount : "…") : bots.length}
                </span>
              </button>
            ))}
          </div>
          <div
            className="flex rounded-lg border border-line p-1"
            role="group"
            aria-label="Library layout"
          >
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className={cn(
                "h-9 w-9 flex items-center justify-center rounded-md",
                view === "grid" ? "bg-surface-2 text-ink" : "text-ink-3",
              )}
            >
              <Grid2X2 size={17} />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className={cn(
                "h-9 w-9 flex items-center justify-center rounded-md",
                view === "list" ? "bg-surface-2 text-ink" : "text-ink-3",
              )}
            >
              <List size={18} />
            </button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,2fr)_1fr_1fr_1fr]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3.5 top-3.5 text-ink-3"
            />
            <input
              aria-label="Search bots"
              placeholder="Search bots, strategies or markets…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className={cn(fieldClass, "w-full pl-10 pr-10")}
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-1 top-1 h-9 w-9 flex items-center justify-center text-ink-3"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <select
            aria-label="Trade type"
            value={contract}
            onChange={(event) => {
              setContract(event.target.value);
              setPage(1);
            }}
            className={fieldClass}
          >
            <option value="">All trade types</option>
            {contracts.map((type) => (
              <option key={type} value={type}>
                {contractLabel(type)}
              </option>
            ))}
          </select>
          <select
            aria-label="Markets"
            value={markets}
            onChange={(event) => {
              setMarkets(event.target.value);
              setPage(1);
            }}
            className={fieldClass}
          >
            <option value="">All market modes</option>
            <option value="single">Single market</option>
            <option value="multi">Multiple markets</option>
          </select>
          <select
            aria-label="Sort bots"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
            className={fieldClass}
          >
            <option value="catalogue">Catalogue order</option>
            <option value="name">Name: A–Z</option>
            <option value="stake">Lowest minimum stake</option>
          </select>
        </div>
        <div className="flex items-center justify-between gap-3 text-xs text-ink-3">
          <p aria-live="polite">
            {filtered.length} {savedOnly ? "favourite" : "matching"}{" "}
            {filtered.length === 1 ? "bot" : "bots"}
            {hasFilters ? " found" : ""}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={reset}
              className="text-ink-2 underline underline-offset-4"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>
      {favourites.isError && (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-ink-2 flex flex-wrap gap-3 justify-between"
        >
          <span>
            Your favourites could not be loaded. The bot library is still
            available.
          </span>
          <button
            type="button"
            onClick={favourites.retry}
            className="underline underline-offset-4"
          >
            Retry favourites
          </button>
        </div>
      )}
      {savedOnly && !favourites.ready ? (
        <p role="status" className="p-8 text-center text-sm text-ink-3">
          {favourites.isError
            ? "Retry to load your saved bots."
            : "Loading your favourites…"}
        </p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line text-center py-12 px-5">
          {savedOnly ? (
            <Star className="mx-auto text-ink-3" size={28} />
          ) : (
            <Search className="mx-auto text-ink-3" size={28} />
          )}
          <h3 className="text-lg text-ink font-medium mt-4">
            {savedOnly && !hasFilters
              ? "Your favourites start here"
              : "No bots match these filters"}
          </h3>
          <p className="text-sm text-ink-3 mt-2">
            {savedOnly && !hasFilters
              ? "Tap the star on any bot to save it to your account."
              : "Try a different search or clear the filters to explore the library."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 px-5 h-10 rounded-xl bg-action text-action-ink text-sm font-medium"
          >
            Browse all bots
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-4 min-w-0",
            view === "grid"
              ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1",
          )}
        >
          {filtered.slice(start, start + PAGE_SIZE).map((bot) => (
            <article
              key={bot.bot_id}
              className={cn(
                "rounded-2xl border border-line bg-surface p-5 flex gap-5 min-w-0 hover:border-ink-3 transition-colors",
                view === "grid"
                  ? "flex-col"
                  : "flex-col sm:flex-row sm:items-center",
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3">
                  <span className="tool-symbol h-11 w-11 shrink-0 rounded-xl bg-surface-2 flex items-center justify-center text-ink-2">
                    <Bot size={22} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-ink">
                      {bot.name}
                    </h3>
                    <p className="text-xs text-ink-3 mt-1">{bot.tagline}</p>
                  </div>
                  <FavouriteButton
                    name={bot.name}
                    selected={favourites.ids.has(bot.bot_id)}
                    disabled={!favourites.ready || favourites.saving}
                    onClick={() => favourites.toggle(bot.bot_id)}
                  />
                </div>
                <p className="text-sm text-ink-2 mt-4 leading-relaxed line-clamp-3">
                  {bot.description}
                </p>
                <ul className="flex flex-wrap gap-2 mt-4 text-[11px] text-ink-2">
                  {[
                    contractLabel(bot.contract_type),
                    durationLabel(bot),
                    bot.max_markets === 1
                      ? "Single market"
                      : `Up to ${bot.max_markets} markets`,
                    ...(bot.has_shadow_lane ? ["Shadow lane"] : []),
                  ].map((fact) => (
                    <li
                      className="rounded-md bg-surface-2 px-2 py-1"
                      key={fact}
                    >
                      {fact}
                    </li>
                  ))}
                  {runningIds.has(bot.bot_id) && (
                    <li className="rounded-md bg-emerald-500/10 text-emerald-500 px-2 py-1">
                      Running
                    </li>
                  )}
                </ul>
              </div>
              <div className={cn("shrink-0", view === "list" && "sm:w-44")}>
                <div className="flex items-center justify-between text-xs text-ink-3 mb-3">
                  <span>Min. stake {bot.min_stake}</span>
                  {bot.markup_pct && <span>{bot.markup_pct}% markup</span>}
                </div>
                <Link
                  href={`/autohub/bots/${bot.bot_id}` as Route}
                  className="h-11 rounded-xl bg-action text-action-ink text-sm font-medium flex items-center justify-center gap-2 hover:opacity-85 transition-opacity"
                >
                  View & set up <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
      {filtered.length > PAGE_SIZE && (!savedOnly || favourites.ready) && (
        <nav
          aria-label="Bot library pages"
          className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-3"
        >
          <p>
            Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)}{" "}
            of {filtered.length}
          </p>
          <div className="flex gap-3 items-center">
            <button
              type="button"
              disabled={current === 1}
              onClick={() => selectPage(current - 1)}
              className="h-10 px-4 rounded-xl border border-line text-ink disabled:opacity-35"
            >
              Previous
            </button>
            <span>
              Page {current} of {pages}
            </span>
            <button
              type="button"
              disabled={current === pages}
              onClick={() => selectPage(current + 1)}
              className="h-10 px-4 rounded-xl border border-line text-ink disabled:opacity-35"
            >
              Next
            </button>
          </div>
        </nav>
      )}
      <p className="text-xs text-ink-3">
        Favourites are saved to your FXNOD account and available on your other
        devices.
      </p>
    </div>
  );
}
