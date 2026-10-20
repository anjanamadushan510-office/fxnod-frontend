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
  const tool = data.tools.find((item) => item.id === toolId);
  const real = !!tool?.access.capabilities.includes("bot_real");
  const demo = !!tool?.access.capabilities.includes("bot_demo");
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-line bg-surface p-3 sm:flex-wrap sm:gap-4 sm:p-4">
      <div className="flex min-w-0 items-start gap-3">
        <ShieldCheck className="mt-0.5 hidden h-5 w-5 shrink-0 text-ink-3 sm:block" />
        <div className="min-w-0">
          <p className="text-[13px] font-medium leading-5 text-ink sm:text-sm">
            {real
              ? "Real-account bot access is available"
              : demo
                ? "Demo-account bot access is available"
                : "Choose a plan to run this tool"}
          </p>
          <p
            className={`mt-1 text-xs text-ink-3 ${demo ? "" : "hidden sm:block"}`}
          >
            {real
              ? "View your membership and access period in Active Tools."
              : demo
                ? "Select a demo account to run this package. Upgrade in Discover for real-account trading."
                : "Review packages, features and access periods in Discover."}
          </p>
          {toolId === "autohub" &&
            tool?.access.grants?.some(
              (g) => g.source === "team" && g.deriv_client_id,
            ) && (
              <p className="mt-2 text-xs text-ink-2">
                Your team access is limited to the Deriv Client ID set by your
                team owner.{" "}
                <Link href={"/autohub/team" as Route} className="underline">
                  View team access
                </Link>
              </p>
            )}
        </div>
      </div>
      <Link
        href={(real ? "/subscriptions" : "/tools") as Route}
        className="flex min-h-11 shrink-0 items-center gap-1 rounded-lg border border-line px-2 text-xs text-ink sm:gap-2 sm:px-3 sm:text-sm"
      >
        {real ? "Manage access" : "View plans"}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
