"use client";

import { useMemo } from "react";
import type { Route } from "next";
import Link from "next/link";
import { ENDED_POLL_MS, IDLE_POLL_MS } from "@/components/autohub/runState";
import { cn } from "@/lib/cn";
import { decimalSign, formatMoney } from "@/lib/decimal";
import { useListAutoHubRuns } from "@/services/api/endpoints/auto-hub/auto-hub";
import { useListBotRuns, useListBotStrategies } from "@/services/api/endpoints/bots/bots";

const ACTIVE_RUNS_PARAMS = { state: "active", limit: 100 } as const;

interface Row {
  key: string;
  product: "dBot" | "Auto Hub";
  name: string;
  status: string;
  isVirtual: boolean;
  pnl: string;
  currency: string;
  href: string;
  createdAt: string;
}

/** Asks often while something is live, and now and then otherwise: a bot may be started on another device. */
function pollEvery(count: number): number {
  return count > 0 ? ENDED_POLL_MS : IDLE_POLL_MS;
}

/**
 * Every bot running on this account, whichever tool and whichever device
 * started it.
 *
 * Each row is a run the engine reports as not ended. Nothing here is kept in
 * the browser, so a phone shows what a laptop started. This table used to
 * hold two fixed example rows that were the same for every account.
 */
export function RunningNow() {
  const dbot = useListBotRuns(ACTIVE_RUNS_PARAMS, {
    query: { refetchInterval: (q) => pollEvery(q.state.data?.runs?.length ?? 0) },
  });
  const autohub = useListAutoHubRuns(ACTIVE_RUNS_PARAMS, {
    query: { refetchInterval: (q) => pollEvery(q.state.data?.runs?.length ?? 0) },
  });
  const strategies = useListBotStrategies();

  const rows = useMemo<Row[]>(() => {
    const names = new Map(
      (strategies.data?.strategies ?? []).map((s) => [s.strategy_id, s.display_name]),
    );
    const fromDbot: Row[] = (dbot.data?.runs ?? []).map((run) => ({
      key: `dbot-${run.run_id}`,
      product: "dBot",
      name: names.get(run.strategy_id) ?? run.strategy_id,
      status: run.status,
      isVirtual: run.is_virtual,
      pnl: run.realized_pnl,
      currency: run.currency,
      href: `/dbot/runs/${run.run_id}`,
      createdAt: run.created_at,
    }));
    const fromHub: Row[] = (autohub.data?.runs ?? []).map((run) => ({
      key: `autohub-${run.run_id}`,
      product: "Auto Hub",
      name: run.bot_name,
      status: run.status,
      isVirtual: run.is_virtual,
      pnl: run.realized_pnl,
      currency: run.currency,
      href: `/autohub/runs/${run.run_id}`,
      createdAt: run.created_at,
    }));
    return [...fromDbot, ...fromHub].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [dbot.data, autohub.data, strategies.data]);

  const loading = dbot.isPending || autohub.isPending;
  // One product failing must not hide the other's runs, but it must be said:
  // an empty table would otherwise read as "nothing is running".
  const failed = [dbot.isError && "dBot", autohub.isError && "Auto Hub"].filter(Boolean) as string[];

  return (
    <article className="xl:col-span-2 bg-surface border border-line rounded-2xl overflow-hidden min-w-0 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-line gap-3">
        <h2 className="font-display text-sm font-semibold text-ink">Running on your account</h2>
        <Link href={"/subscriptions" as Route} className="text-xs text-ink-2 hover:text-ink transition-colors">
          Active Tools &rarr;
        </Link>
      </div>

      {failed.length > 0 && (
        <p className="border-b border-line px-5 py-3 text-xs text-red-400" role="alert">
          Could not load {failed.join(" or ")} bots. Anything running there is not shown below.
        </p>
      )}

      {loading ? (
        <p className="px-5 py-8 text-sm text-ink-3">Loading…</p>
      ) : rows.length === 0 ? (
        failed.length === 0 && (
          <div className="px-5 py-8">
            <p className="text-sm text-ink">No bots are running.</p>
            <p className="mt-1 text-sm text-ink-2">
              Start one from{" "}
              <Link href={"/dbot" as Route} className="text-ink underline underline-offset-2">dBot</Link> or{" "}
              <Link href={"/autohub" as Route} className="text-ink underline underline-offset-2">Auto Hub</Link>.
              It keeps running after you close the page, and shows here on any device.
            </p>
          </div>
        )
      ) : (
        <ul className="divide-y divide-line">
          {rows.map((row) => {
            const sign = decimalSign(row.pnl);
            return (
              <li key={row.key}>
                <Link
                  href={row.href as Route}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 transition-colors hover:bg-surface-2"
                >
                  <span className="min-w-0 flex-1 basis-40">
                    <span className="block truncate text-sm font-medium text-ink">{row.name}</span>
                    <span className="block text-xs text-ink-3">
                      {row.product} · {row.isVirtual ? "Demo" : "Real"}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-xs text-ink-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                    <span className="capitalize">{row.status}</span>
                  </span>
                  <span
                    className={cn(
                      "min-w-[5rem] text-right text-sm tabular-nums",
                      sign > 0 ? "text-green-400" : sign < 0 ? "text-red-400" : "text-ink-2",
                    )}
                  >
                    {row.currency === "USD" ? formatMoney(row.pnl) : `${formatMoney(row.pnl, "")} ${row.currency}`}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
