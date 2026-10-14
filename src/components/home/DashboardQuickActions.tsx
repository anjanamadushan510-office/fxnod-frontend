"use client";
import Link from "next/link";
import { Bot, ChartCandlestick, LayoutGrid, ArrowRight } from "lucide-react";
import { useCommerce } from "@/hooks/useCommerce";
import { useListAutoHubBots } from "@/services/api/endpoints/auto-hub/auto-hub";

const TOOLS = [
  {
    id: "dtrader",
    name: "Trade Pilot",
    href: "/options/dtrader" as const,
    icon: ChartCandlestick,
    heading: "Trade your way",
    description:
      "Live charts, contract types and manual trading on your selected Deriv account.",
  },
  {
    id: "dbot",
    name: "Bot Forge",
    href: "/dbot" as const,
    icon: Bot,
    heading: "Build a strategy",
    description:
      "Create your own bot, review its rules and follow each run from start to finish.",
  },
  {
    id: "autohub",
    name: "Auto Hub",
    href: "/autohub" as const,
    icon: LayoutGrid,
    heading: "Find your next bot",
    description:
      "Browse ready-made strategies, save favourites and review your settings before every run.",
  },
];
export function DashboardQuickActions() {
  const commerce = useCommerce();
  const bots = useListAutoHubBots({ query: { staleTime: 60000 } });
  return (
    <section className="space-y-3">
      <div className="flex justify-between gap-3 items-center">
        <h2 className="text-lg font-semibold text-ink">Your trading tools</h2>
        <Link href="/tools" className="text-xs text-ink-2 hover:underline">
          Packages & bundles →
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {TOOLS.map((item) => {
          const tool = commerce.data?.tools.find((tool) => tool.id === item.id);
          const ready = tool?.access.allowed && tool.access.active;
          return (
            <article
              key={item.id}
              className="flex flex-col rounded-xl border border-line bg-surface p-4 hover:border-ink-3 transition-colors"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="grid place-items-center tool-symbol h-9 w-9 bg-surface-2 rounded-lg text-ink-2">
                  <item.icon size={19} />
                </span>
                <span className="text-[10px] rounded-full bg-surface-2 px-2.5 py-1 text-ink-2">
                  {!commerce.isSuccess
                    ? "Checking access…"
                    : ready
                      ? (tool?.access.tier_name ?? "Ready")
                      : tool?.access.renewal_due
                        ? "Renewal needed"
                        : "Package required"}
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-ink">{item.name}</h3>
              <p className="mt-1 text-xs text-ink-2 leading-relaxed flex-1 line-clamp-2">
                {item.description}
              </p>
              {item.id === "autohub" && bots.data && (
                <p className="mt-3 text-xs text-ink-3">
                  {bots.data.bots.length} bots in the library
                </p>
              )}
              <Link
                href={item.href}
                className="mt-3 min-h-10 rounded-lg bg-action text-action-ink flex items-center justify-center gap-2 text-sm font-medium"
              >
                Open{" "}
                {item.id === "autohub"
                  ? "Auto Hub"
                  : item.id === "dbot"
                    ? "Bot Builder"
                    : "Trader"}{" "}
                <ArrowRight size={16} />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
