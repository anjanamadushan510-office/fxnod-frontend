"use client";

import { useMemo, useState, type ReactNode } from "react";
import { LayoutGrid, List, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { FXNOD_TOOLS, type FxnodTool } from "@/components/tools/catalog";
import { ActiveBadge, ToolCard, type ToolCardView } from "@/components/tools/ToolCard";
import { useActiveTools } from "@/hooks/useActiveTools";

type Filter = "all" | "free" | "paid";
type View = ToolCardView;

export default function ToolsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("grid");
  const [query, setQuery] = useState("");
  const { isActive, setActive } = useActiveTools();

  const needle = query.trim().toLowerCase();
  const visible = useMemo(
    () => FXNOD_TOOLS.filter((tool) => matchesQuery(tool, needle)),
    [needle],
  );
  const freeTools = visible.filter((tool) => tool.kind === "free");
  const paidTools = visible.filter((tool) => tool.kind === "paid");
  const showFree = (filter === "all" || filter === "free") && freeTools.length > 0;
  const showPaid = (filter === "all" || filter === "paid") && paidTools.length > 0;

  return (
    <section className="space-y-6 p-4 lg:p-8">
      <label className="relative block">
        <span className="sr-only">Search tools</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools by name or keyword"
          className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-ink-3"
        />
      </label>

      <div className="flex items-center gap-2">
        <div className="grid min-w-0 flex-1 grid-cols-3 rounded-lg border border-line bg-surface-2 p-1 sm:inline-flex sm:w-auto sm:flex-none">
          <FilterButton on={filter === "all"} onClick={() => setFilter("all")}>All</FilterButton>
          <FilterButton on={filter === "free"} onClick={() => setFilter("free")}>Free</FilterButton>
          <FilterButton on={filter === "paid"} onClick={() => setFilter("paid")}>Paid</FilterButton>
        </div>
        <div className="ml-auto inline-flex shrink-0 rounded-lg border border-line bg-surface-2 p-1">
          <ViewButton label="Grid view" on={view === "grid"} onClick={() => setView("grid")}>
            <LayoutGrid className="h-4 w-4" />
          </ViewButton>
          <ViewButton label="List view" on={view === "list"} onClick={() => setView("list")}>
            <List className="h-4 w-4" />
          </ViewButton>
        </div>
      </div>

      {showFree && (
        <ToolSection
          title="Free"
          blurb="From FXNOD. No monthly fee — we earn a markup on the API."
          tools={freeTools}
          view={view}
          isActive={isActive}
          onAdd={(id) => setActive(id, true)}
        />
      )}

      {showPaid && (
        <ToolSection
          title="Subscriptions"
          blurb="Pay from the FXNOD Wallet. Your own venue keys, no API markup."
          tools={paidTools}
          view={view}
          divided={showFree}
          isActive={isActive}
          onAdd={(id) => setActive(id, true)}
        />
      )}

      {!showFree && !showPaid && (
        <p className="rounded-2xl border border-dashed border-line bg-surface px-5 py-10 text-center text-sm text-ink-3">
          No tools match that search.
        </p>
      )}
    </section>
  );
}

function matchesQuery(tool: FxnodTool, needle: string) {
  if (!needle) return true;
  const haystack = [tool.name, tool.subtitle, tool.description, tool.price ?? "", ...tool.badges]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

function ToolSection({
  title,
  blurb,
  tools,
  view,
  divided,
  isActive,
  onAdd,
}: {
  title: string;
  blurb: string;
  tools: FxnodTool[];
  view: View;
  divided?: boolean;
  isActive: (id: string) => boolean;
  onAdd: (id: string) => void;
}) {
  return (
    <div className={cn("space-y-4", divided && "mt-8 border-t border-line pt-6")}>
      <div>
        <h2 className="mb-1 text-sm font-bold uppercase tracking-wider text-ink">{title}</h2>
        <p className="text-sm text-ink-2">{blurb}</p>
      </div>
      <div className={cn(view === "grid" ? "grid grid-cols-1 gap-4 md:grid-cols-2" : "flex flex-col gap-3")}>
        {tools.map((tool) => (
          <MarketplaceCard
            key={tool.id}
            tool={tool}
            view={view}
            active={isActive(tool.id)}
            onAdd={() => onAdd(tool.id)}
          />
        ))}
      </div>
    </div>
  );
}

function MarketplaceCard({
  tool,
  view,
  active,
  onAdd,
}: {
  tool: FxnodTool;
  view: View;
  active: boolean;
  onAdd: () => void;
}) {
  const label = tool.kind === "free" ? "Add Tool" : "Subscribe";
  const list = view === "list";

  return (
    <ToolCard
      tool={tool}
      view={view}
      headerExtra={
        tool.kind === "paid" && tool.price ? (
          <p className="shrink-0 text-sm font-semibold text-ink">{tool.price}</p>
        ) : active ? (
          <ActiveBadge />
        ) : null
      }
      badgeExtra={tool.kind === "paid" && active ? <ActiveBadge /> : null}
      actions={
        <button
          type="button"
          onClick={onAdd}
          disabled={active}
          className={cn(
            "h-9 rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-default disabled:opacity-45 dark:bg-white dark:text-black dark:hover:bg-zinc-200",
            list ? "w-full sm:w-auto sm:min-w-[8.5rem]" : "w-full",
          )}
        >
          {label}
        </button>
      }
    />
  );
}

function FilterButton({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-1.5 text-center text-sm font-medium transition-colors",
        on ? "bg-black text-white shadow-sm dark:bg-white dark:text-black" : "text-ink-2 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function ViewButton({
  label,
  on,
  onClick,
  children,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-md transition-colors",
        on ? "bg-black text-white dark:bg-white dark:text-black" : "text-ink-2 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
