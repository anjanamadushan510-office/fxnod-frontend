"use client";
import { useState } from "react";
import {
  LayoutGrid,
  List,
  Search,
  Package,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/cn";
import {
  ToolCard,
  ActiveBadge,
  type ToolCardView,
} from "@/components/tools/ToolCard";
import { PlanDialog } from "@/components/tools/PlanDialog";
import { useCommerce, useToolActivation } from "@/hooks/useCommerce";
import {
  commerceError,
  money,
  term,
  type CommerceTool,
  type Catalog,
} from "@/services/commerce";
import type { FxnodTool } from "@/components/tools/catalog";

function cardTool(tool: CommerceTool, catalog: Catalog): FxnodTool {
  return {
    ...tool,
    href: tool.href ?? undefined,
    icon: "/assets/fxnod-mark.png",
    kind: "paid",
  };
}

export default function ToolsPage() {
  const { data, isLoading, isError, refetch } = useCommerce();
  const activation = useToolActivation();
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<ToolCardView>("grid");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<{
    toolId?: string;
    bundleId?: string;
  } | null>(null);
  const [error, setError] = useState("");
  async function activate(id: string) {
    setError("");
    try {
      await activation.mutateAsync({ id, enabled: true });
    } catch (e) {
      setError(commerceError(e));
    }
  }
  if (isLoading)
    return (
      <div className="p-8 text-sm text-ink-3" role="status">
        Loading tools and plans…
      </div>
    );
  if (isError || !data)
    return (
      <div className="p-8">
        <p>We could not load the tool catalog.</p>
        <button onClick={() => refetch()} className="mt-3 underline">
          Try again
        </button>
      </div>
    );
  const bundles = data.offers.filter((o) => o.tier_ids.length > 1);
  const tools = data.tools.filter((tool) => {
    const tiers = data.tiers.filter((t) => t.tool_id === tool.id);
    const zero = data.offers.some(
      (o) =>
        Number(o.price) === 0 &&
        o.tier_ids.some((id) => tiers.some((t) => t.id === id)),
    );
    const paid = data.offers.some((o) =>
      o.tier_ids.some((id) => tiers.some((t) => t.id === id)),
    );
    return (
      [tool.name, tool.subtitle, tool.description]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "all" ||
        (filter === "zero" && zero) ||
        (filter === "pro" && paid))
    );
  });
  return (
    <section className="mx-auto max-w-7xl space-y-7 p-4 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-ink-3">
            THE FXNOD TOOLKIT
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Find your trading edge.
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Compare packages, features and access periods for every tool.
          </p>
        </div>
        <Link
          href={"/subscriptions" as Route}
          className="flex items-center gap-2 text-sm text-ink-2"
        >
          Your active tools
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search tools</span>
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-ink-3" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, platforms, strategies…"
            className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm outline-none focus:border-ink-3"
          />
        </label>
        <div className="flex gap-3">
          <div className="flex flex-1 rounded-xl border border-line bg-surface p-1">
            {[
              ["all", "All tools"],
              ["zero", "$0 offers"],
              ["pro", "Available plans"],
              ["bundles", "Bundles"],
            ].map(([key, label]) => (
              <button
                key={key}
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium sm:text-sm",
                  filter === key ? "bg-ink text-bg" : "text-ink-3",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex rounded-xl border border-line bg-surface p-1">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                aria-label={`${v} view`}
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={cn(
                  "rounded-lg p-2",
                  view === v ? "bg-ink text-bg" : "text-ink-3",
                )}
              >
                {v === "grid" ? (
                  <LayoutGrid className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-400/10 p-3 text-sm text-negative"
        >
          {error}
        </p>
      )}
      {filter !== "bundles" && (
        <div className={cn("grid gap-4", view === "grid" && "md:grid-cols-2")}>
          {tools.map((tool) => {
            const tiers = data.tiers.filter((t) => t.tool_id === tool.id);
            const offers = data.offers.filter((o) =>
              o.tier_ids.some((id) => tiers.some((t) => t.id === id)),
            );
            const minimum = offers.reduce<string | null>(
              (min, o) =>
                min === null || Number(o.price) < Number(min) ? o.price : min,
              null,
            );
            const soon = tool.status === "coming_soon";
            return (
              <ToolCard
                key={tool.id}
                tool={cardTool(tool, data)}
                view={view}
                headerExtra={
                  tool.access.active ? (
                    <ActiveBadge />
                  ) : (
                    <span className="text-sm font-semibold">
                      {soon
                        ? "Coming soon"
                        : minimum !== null
                          ? `From ${money(minimum, data.currency)}`
                          : "Plans coming soon"}
                    </span>
                  )
                }
                badgeExtra={
                  offers.length > 0 ? (
                    <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-warning">
                      Plan checkout required
                    </span>
                  ) : null
                }
                actions={
                  <div className="space-y-3">
                    {tool.access.allowed && (
                      <p className="text-xs text-ink-3">
                        {tool.access.owned && !tool.access.renewal_due
                          ? `${tool.access.tier_name} plan active`
                          : `${tool.access.tier_name} · ${tool.access.expires_at ? `Access until ${new Date(tool.access.expires_at).toLocaleDateString()}` : "Lifetime access"}`}
                      </p>
                    )}
                    <div className="flex gap-2">
                      {tool.access.active && tool.href ? (
                        <Link
                          href={tool.href as Route}
                          className="flex h-10 flex-1 items-center justify-center rounded-xl bg-ink px-4 text-sm font-medium text-bg"
                        >
                          Open tool
                        </Link>
                      ) : tool.access.allowed ? (
                        <button
                          disabled={
                            soon || !tool.access.allowed || activation.isPending
                          }
                          onClick={() => activate(tool.id)}
                          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-medium text-bg disabled:opacity-40"
                        >
                          {activation.isPending &&
                            activation.variables?.id === tool.id && (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                          {soon
                            ? "Coming soon"
                            : tool.access.allowed
                              ? "Activate tool"
                              : "Plan required"}
                        </button>
                      ) : (
                        <button
                          disabled={soon || !offers.length}
                          onClick={() => setSelected({ toolId: tool.id })}
                          className="flex h-10 flex-1 items-center justify-center rounded-xl bg-ink px-4 text-sm font-medium text-bg disabled:opacity-40"
                        >
                          {soon
                            ? "Coming soon"
                            : offers.length
                              ? "Choose a plan"
                              : "Plans coming soon"}
                        </button>
                      )}
                      {!!offers.length && tool.access.allowed && (
                        <button
                          onClick={() => setSelected({ toolId: tool.id })}
                          className="h-10 flex-1 rounded-xl border border-line px-4 text-sm font-medium hover:bg-surface-2"
                        >
                          {tool.access.source === "purchase" ||
                          tool.access.source === "legacy"
                            ? "Manage plan"
                            : "View plans"}
                        </button>
                      )}
                    </div>
                  </div>
                }
              />
            );
          })}
        </div>
      )}
      {(filter === "all" || filter === "bundles") && (
        <div className="border-t border-line pt-6">
          <div className="mb-4 flex items-center gap-3">
            <Package className="h-5 w-5 text-ink-3" />
            <div>
              <h2 className="font-semibold">Better together</h2>
              <p className="text-sm text-ink-3">One offer. Multiple tools.</p>
            </div>
          </div>
          {bundles.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {bundles.map((offer) => (
                <article
                  key={offer.id}
                  className="rounded-2xl border border-line bg-surface p-5"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-warning">
                    Bundle offer
                  </span>
                  <h3 className="mt-2 text-lg font-semibold">{offer.name}</h3>
                  <p className="mt-2 text-sm text-ink-2">{offer.description}</p>
                  <div className="my-4 flex flex-wrap gap-2">
                    {offer.tier_ids.map((id) => {
                      const tier = data.tiers.find((t) => t.id === id);
                      return (
                        <span
                          key={id}
                          className="rounded-lg bg-bg px-2 py-1 text-xs"
                        >
                          {data.tools.find((t) => t.id === tier?.tool_id)?.name}{" "}
                          · {tier?.name}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      {offer.compare_at && (
                        <p className="text-xs text-ink-3 line-through">
                          {money(offer.compare_at, data.currency)}
                        </p>
                      )}
                      <p className="text-xl font-semibold">
                        {money(offer.price, data.currency)}
                      </p>
                      <p className="mt-1 text-xs text-ink-3">
                        {term(offer)} · one-time payment
                      </p>
                    </div>
                    <button
                      onClick={() => setSelected({ bundleId: offer.id })}
                      className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-bg"
                    >
                      View bundle
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-line p-6 text-sm text-ink-3">
              Bundle offers will appear here when available.
            </p>
          )}
        </div>
      )}
      {filter !== "bundles" && !tools.length && (
        <p className="py-10 text-center text-sm text-ink-3">
          No tools match your search.
        </p>
      )}
      {selected && (
        <PlanDialog
          catalog={data}
          {...selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
