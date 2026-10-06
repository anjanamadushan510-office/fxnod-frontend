"use client";

import type { ReactNode } from "react";
import { Blocks, Bot, ChartCandlestick, Grid3x3, Workflow, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { FxnodTool } from "./catalog";

export type ToolCardView = "grid" | "list";

/** Purpose icons. A new tool falls back to a grid mark until it has its own. */
const TOOL_ICONS: Record<string, LucideIcon> = {
  dtrader: ChartCandlestick,
  dbot: Bot,
  autohub: Blocks,
  "bybit-flow": Workflow,
  "binance-grid": Grid3x3,
};

/**
 * Shared marketplace card. Discover and Active Tools pass their own actions
 * so a visual change lands on both pages without mixing their buttons.
 */
export function ToolCard({
  tool,
  view = "grid",
  headerExtra,
  badgeExtra,
  actions,
}: {
  tool: FxnodTool;
  view?: ToolCardView;
  headerExtra?: ReactNode;
  badgeExtra?: ReactNode;
  actions: ReactNode;
}) {
  const list = view === "list";

  return (
    <article
      className={cn(
        "min-w-0 rounded-2xl border border-line bg-surface p-5 transition-colors hover:bg-surface-2",
        list ? "flex flex-col gap-4 sm:flex-row sm:items-center" : "flex flex-col",
      )}
    >
      <div className={cn("min-w-0", list ? "flex-1" : "mb-4")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <ToolMark id={tool.id} />
            <div className="min-w-0">
              <h3 className="truncate font-medium text-ink">{tool.name}</h3>
              <p className="truncate text-xs text-ink-3">{tool.subtitle}</p>
            </div>
          </div>
          {headerExtra}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {tool.badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center rounded-full bg-black px-2 py-0.5 text-[10px] font-medium text-white ring-1 ring-white/15"
            >
              {badge}
            </span>
          ))}
          {badgeExtra}
        </div>

        <p className={cn("mt-3 text-sm leading-relaxed text-ink-2", list ? "line-clamp-2" : "mb-4")}>
          {tool.description}
        </p>
      </div>

      <div className={cn("shrink-0", list ? "" : "mt-auto")}>{actions}</div>
    </article>
  );
}

export function ToolMark({ id }: { id: string }) {
  const Icon = TOOL_ICONS[id] ?? Grid3x3;
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-bg text-ink">
      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
    </span>
  );
}

export function ActiveBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-green-400">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      Active
    </span>
  );
}
