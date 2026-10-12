"use client";

import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { useCommerce } from "@/hooks/useCommerce";

/** Only checked-out plans grant access, including time-limited $0 offers. */
export function BotMembershipBanner({
  toolId,
}: {
  toolId: "dbot" | "autohub";
}) {
  const { data } = useCommerce();
  if (!data) return null;
  const real = data.tools
    .filter((tool) => tool.id === toolId)
    .some((tool) => tool.access.capabilities.includes("bot_real"));
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-ink-3" />
        <div>
          <p className="text-sm font-medium text-ink">
            {real
              ? "Real-account bot access is available"
              : "Choose a plan to run this tool"}
          </p>
          <p className="mt-1 text-xs text-ink-3">
            {real
              ? "View your membership and access period in Active Tools."
              : "Review packages, features and access periods in Discover."}
          </p>
        </div>
      </div>
      <Link
        href={(real ? "/subscriptions" : "/tools") as Route}
        className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm text-ink"
      >
        {real ? "Manage access" : "View plans"}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
