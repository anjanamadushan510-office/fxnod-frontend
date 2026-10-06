"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AccountBadge, LaneChip, StatusBadge } from "@/components/autohub/pieces";
import { ENDED_POLL_MS, IDLE_POLL_MS, RUN_POLL_MS, stopReasonLabel } from "@/components/autohub/runState";
import { cn } from "@/lib/cn";
import { decimalSign, formatMoney, sumDecimals } from "@/lib/decimal";
import { parseApiError } from "@/lib/apiError";
import {
  getListAutoHubRunsQueryKey,
  useListAutoHubBots,
  useListAutoHubRuns,
  useStopAutoHubRun,
} from "@/services/api/endpoints/auto-hub/auto-hub";
import type { AutoHubBot, AutoHubRun } from "@/services/api/model";

// Two questions, each answered by the engine: what is running on this
// account, and what finished most recently. The page used to fetch the newest
// fifty runs and sort them itself, which loses a bot that has been running
// longer than fifty others took to finish.
const ACTIVE_RUNS_PARAMS = { state: "active", limit: 100 } as const;
const ENDED_RUNS_PARAMS = { state: "ended", limit: 8 } as const;

/**
 * /autohub — the bots FXNod built, and the ones this user has running.
 *
 * A user does not build anything here. They pick a bot, set their limits and
 * start it; the bot then runs on FXNod's servers whether or not this page is
 * open. Everything shown is read from the engine: the catalogue, the runs and
 * every figure on them.
 */
export default function AutoHubPage() {
  const queryClient = useQueryClient();
  const botsQuery = useListAutoHubBots();
  const runsQuery = useListAutoHubRuns(ACTIVE_RUNS_PARAMS, {
    query: {
      // Quickly while something is live; slowly otherwise, because a bot may
      // have been started on another device.
      refetchInterval: (query) =>
        (query.state.data?.runs ?? []).length > 0 ? RUN_POLL_MS : IDLE_POLL_MS,
    },
  });
  const activeRuns = useMemo(() => runsQuery.data?.runs ?? [], [runsQuery.data]);
  const endedQuery = useListAutoHubRuns(ENDED_RUNS_PARAMS, {
    // A finished run is a record; the list only changes when a live one ends.
    query: { refetchInterval: activeRuns.length > 0 ? ENDED_POLL_MS : false },
  });
  const stopRun = useStopAutoHubRun();

  const bots = useMemo(() => botsQuery.data?.bots ?? [], [botsQuery.data]);
  const finishedRuns = useMemo(() => endedQuery.data?.runs ?? [], [endedQuery.data]);

  // One currency across runs is the normal case. If it is not, a single total
  // would add dollars to something else, so none is shown.
  const currencies = new Set(activeRuns.map((run) => run.currency));
  const runningPnl =
    activeRuns.length > 0 && currencies.size === 1
      ? sumDecimals(activeRuns.map((run) => run.realized_pnl))
      : null;

  async function handleStop(run: AutoHubRun) {
    try {
      await stopRun.mutateAsync({ id: run.run_id });
      await queryClient.invalidateQueries({ queryKey: getListAutoHubRunsQueryKey() });
    } catch (err) {
      toast.error(parseApiError(err, "Could not stop the bot.").message);
    }
  }

  return (
    <section className="p-4 lg:p-8 space-y-10">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Auto Hub</h1>
        <p className="text-sm text-ink-2 mt-1 max-w-2xl leading-relaxed">
          Ready-made bots for your Deriv account. Pick one, set your stake and limits, and start
          it. It runs on FXNod&rsquo;s servers, so it keeps going when you close this page, and
          so do its limits.
        </p>
      </header>

      {activeRuns.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-bold text-ink tracking-wider uppercase">Running now</h2>
            {runningPnl !== null && (
              <span className="text-sm text-ink-2">
                Realised{" "}
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    decimalSign(runningPnl) < 0
                      ? "text-red-400"
                      : decimalSign(runningPnl) > 0
                        ? "text-emerald-400"
                        : "text-ink",
                  )}
                >
                  {formatMoney(runningPnl)}
                </span>
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
            {activeRuns.map((run) => (
              <RunCard
                key={run.run_id}
                run={run}
                stopping={stopRun.isPending}
                onStop={() => handleStop(run)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-ink tracking-wider uppercase">Bots</h2>
        {botsQuery.isPending ? (
          <p className="text-sm text-ink-3">Loading bots…</p>
        ) : botsQuery.isError ? (
          <div className="bg-surface border border-line rounded-2xl p-6 max-w-lg">
            <p className="text-sm text-ink-2">
              The bots could not be loaded. The trading engine may be unavailable.
            </p>
            <button
              type="button"
              onClick={() => botsQuery.refetch()}
              className="mt-4 h-9 px-4 rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-80"
            >
              Try again
            </button>
          </div>
        ) : bots.length === 0 ? (
          <p className="text-sm text-ink-2">No bots are available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 min-w-0">
            {bots.map((bot) => (
              <BotCard key={bot.bot_id} bot={bot} />
            ))}
          </div>
        )}
      </div>

      {finishedRuns.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-ink tracking-wider uppercase">Recent runs</h2>
          <div className="bg-surface border border-line rounded-2xl divide-y divide-line/60 overflow-hidden">
            {finishedRuns.map((run) => (
              <Link
                key={run.run_id}
                href={`/autohub/runs/${run.run_id}` as Route}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 sm:px-5 hover:bg-surface-2 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-ink">{run.bot_name}</span>
                    <AccountBadge isVirtual={run.is_virtual} />
                  </div>
                  <p className="text-xs text-ink-3 mt-0.5">
                    {new Date(run.ended_at ?? run.created_at).toLocaleString()}
                    {stopReasonLabel(run.stop_reason) ? ` · ${stopReasonLabel(run.stop_reason)}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      decimalSign(run.realized_pnl) < 0
                        ? "text-red-400"
                        : decimalSign(run.realized_pnl) > 0
                          ? "text-emerald-400"
                          : "text-ink",
                    )}
                  >
                    {formatMoney(run.realized_pnl)}
                  </span>
                  <p className="text-xs text-ink-3">
                    {run.trades_won}W / {run.trades_lost}L
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs leading-relaxed text-ink-3 max-w-2xl">
        Auto Hub has no subscription. FXNod earns a markup that Deriv takes from each real-money
        payout; each bot shows its rate. Demo trades carry none. No bot can guarantee a profit,
        and a bot can lose up to the stop loss you give it.
      </p>
    </section>
  );
}

// ─── pieces ─────────────────────────────────────────────────────────────────

function BotCard({ bot }: { bot: AutoHubBot }) {
  const facts = [
    bot.duration_unit === "t"
      ? `${bot.duration}-tick trades`
      : `${bot.duration}${bot.duration_unit} trades`,
    bot.max_markets === 1 ? "One market" : `Up to ${bot.max_markets} markets`,
    bot.has_shadow_lane ? "Shadow lane" : null,
    bot.markup_pct ? `${bot.markup_pct}% markup on payout` : null,
  ].filter((fact): fact is string => fact !== null);

  return (
    <article className="bg-surface border border-line rounded-2xl p-5 flex flex-col min-w-0 transition-colors hover:bg-surface-2">
      <h3 className="font-medium text-ink text-lg">{bot.name}</h3>
      <p className="text-xs text-ink-3 mt-0.5">{bot.tagline}</p>

      <p className="text-sm text-ink-2 leading-relaxed mt-4 flex-1">{bot.description}</p>

      <ul className="flex flex-wrap gap-1.5 mt-4">
        {facts.map((fact) => (
          <li
            key={fact}
            className="rounded-md border border-line px-2 py-0.5 text-[11px] text-ink-2"
          >
            {fact}
          </li>
        ))}
      </ul>

      <Link
        href={`/autohub/bots/${bot.bot_id}` as Route}
        className="mt-5 flex justify-center items-center h-10 rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-sm font-medium transition-colors"
      >
        Set up
      </Link>
    </article>
  );
}

function RunCard({
  run,
  stopping,
  onStop,
}: {
  run: AutoHubRun;
  stopping: boolean;
  onStop: () => void;
}) {
  const tone = decimalSign(run.realized_pnl);
  return (
    <article className="bg-surface border border-line rounded-2xl p-5 min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-ink">{run.bot_name}</h3>
            <StatusBadge status={run.status} />
            <AccountBadge isVirtual={run.is_virtual} />
            {run.shadow && <LaneChip lane={run.shadow.lane} />}
          </div>
          <p className="text-xs text-ink-3 mt-1">
            {run.symbols.length === 1 ? run.symbols[0] : `${run.symbols.length} markets`} · stake{" "}
            {formatMoney(run.stake)}
          </p>
        </div>
        <span
          className={cn(
            "text-lg font-semibold tabular-nums shrink-0",
            tone < 0 ? "text-red-400" : tone > 0 ? "text-emerald-400" : "text-ink",
          )}
        >
          {formatMoney(run.realized_pnl)}
        </span>
      </div>

      <p className="text-xs text-ink-2 mt-3">
        {run.trades_won}W / {run.trades_lost}L real
        {run.shadow
          ? ` · ${run.shadow.entries_won}W / ${run.shadow.entries_lost}L shadow`
          : ""}
      </p>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/autohub/runs/${run.run_id}` as Route}
          className="flex-1 flex justify-center items-center h-10 rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-sm font-medium transition-colors"
        >
          Open
        </Link>
        <button
          type="button"
          disabled={stopping || run.status === "stopping"}
          onClick={onStop}
          className="h-10 px-4 rounded-lg border border-red-500/50 text-sm text-red-300 transition hover:bg-red-500/10 disabled:opacity-45"
        >
          {run.status === "stopping" ? "Stopping…" : "Stop"}
        </button>
      </div>
    </article>
  );
}
