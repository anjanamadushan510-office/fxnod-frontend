"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { BotJourney } from "@/components/autohub/BotJourney";
import { RunFeedback } from "@/components/autohub/RunFeedback";
import {
  runNeedsUpdates,
  entriesNeedUpdates,
} from "@/components/autohub/journey";
import { ShadowGauge } from "@/components/autohub/ShadowGauge";
import {
  AccountBadge,
  LaneChip,
  Meter,
  Stat,
  StatusBadge,
} from "@/components/autohub/pieces";
import {
  RUN_POLL_MS,
  isActiveRun,
  stopReasonLabel,
} from "@/components/autohub/runState";
import { EmergencyStopButton } from "@/components/bot/EmergencyStopButton";
import { useMarketStore } from "@/components/options/market/marketStore";
import { cn } from "@/lib/cn";
import { decimalSign, formatMoney } from "@/lib/decimal";
import { parseApiError } from "@/lib/apiError";
import {
  getGetAutoHubRunQueryKey,
  getListAutoHubRunsQueryKey,
  getListAutoHubRunEntriesQueryKey,
  useForceStopAutoHubRun,
  useGetAutoHubRun,
  useListAutoHubRunEntries,
  useStopAutoHubRun,
} from "@/services/api/endpoints/auto-hub/auto-hub";
import type { AutoHubEntry, AutoHubRun } from "@/services/api/model";

const ENTRIES_PARAMS = { limit: 100 } as const;

/**
 * /autohub/runs/[id] — one run of an Auto Hub bot.
 *
 * A run is server state. It keeps trading with this page closed and its stop
 * loss keeps applying either way; this page is a window onto it and a Stop
 * button. Nothing here decides anything about money.
 */
export default function AutoHubRunPage() {
  const { id: runId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  const runQuery = useGetAutoHubRun(runId, {
    query: {
      enabled: !!userId,
      queryKey: [...getGetAutoHubRunQueryKey(runId), userId],
      // Only a live run changes. A finished one is a record.
      refetchInterval: (query) =>
        runNeedsUpdates(query.state.data) ? RUN_POLL_MS : false,
      retry: false,
    },
  });
  const run = runQuery.data;
  const active = isActiveRun(run?.status);
  const updating = runNeedsUpdates(run);

  const entriesQuery = useListAutoHubRunEntries(runId, ENTRIES_PARAMS, {
    query: {
      enabled: !!run && !!userId,
      queryKey: [
        ...getListAutoHubRunEntriesQueryKey(runId, ENTRIES_PARAMS),
        userId,
      ],
      refetchInterval: (query) =>
        updating || entriesNeedUpdates(query.state.data?.entries)
          ? RUN_POLL_MS
          : false,
    },
  });
  const runStatus = run?.status;
  const tradesOpen = run?.trades_open;

  // Fetch settlement entries once more when the run stops or its last trade closes.
  useEffect(() => {
    if (runStatus && !isActiveRun(runStatus)) {
      void queryClient.invalidateQueries({
        queryKey: getListAutoHubRunEntriesQueryKey(runId),
      });
      void queryClient.invalidateQueries({
        queryKey: getListAutoHubRunsQueryKey(),
      });
    }
  }, [runId, runStatus, tradesOpen, queryClient]);

  const stop = useStopAutoHubRun();
  const forceStop = useForceStopAutoHubRun();

  const allMarkets = useMarketStore((s) => s.allMarkets);
  const marketName = useMemo(() => {
    const byId = new Map(allMarkets.map((m) => [m.id, m.name]));
    return (id: string) => byId.get(id) ?? id;
  }, [allMarkets]);

  async function refresh(run: AutoHubRun) {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getGetAutoHubRunQueryKey(run.run_id),
      }),
      queryClient.invalidateQueries({ queryKey: getListAutoHubRunsQueryKey() }),
      queryClient.invalidateQueries({
        queryKey: getListAutoHubRunEntriesQueryKey(run.run_id),
      }),
    ]);
  }

  async function handleStop(run: AutoHubRun) {
    try {
      await stop.mutateAsync({ id: run.run_id });
      await refresh(run);
      toast.success(
        "Stop requested. Open trades will finish before the final result.",
      );
    } catch (err) {
      toast.error(parseApiError(err, "Could not stop the bot.").message);
    }
  }

  async function handleEmergencyStop(run: AutoHubRun) {
    try {
      await forceStop.mutateAsync({ id: run.run_id });
      await refresh(run);
      toast.success("Emergency stop sent");
    } catch (err) {
      toast.error(parseApiError(err, "Could not stop the bot.").message);
    }
  }

  if (runQuery.isPending) {
    return (
      <Shell>
        <p className="text-sm text-ink-3">Loading run…</p>
      </Shell>
    );
  }

  if (!run) {
    return (
      <Shell>
        <div className="bg-panel border border-line rounded-2xl p-8 max-w-lg">
          <h2 className="font-display text-lg font-semibold mb-2">
            This run could not be opened
          </h2>
          <p className="text-sm text-ink-2">
            It may belong to another account, or the trading engine may be
            unavailable.
          </p>
          <button
            type="button"
            onClick={() => runQuery.refetch()}
            className="mt-4 h-10 rounded-xl bg-ink text-surface px-4 text-sm"
          >
            Try again
          </button>
        </div>
      </Shell>
    );
  }

  const entries = entriesQuery.data?.entries ?? [];
  const entriesUpdating = updating || entriesNeedUpdates(entries);
  const pnlNumber = Number.parseFloat(run.realized_pnl) || 0;
  const stopLossLimit = Number.parseFloat(run.stop_loss) || 0;
  const targetLimit = run.take_profit
    ? Number.parseFloat(run.take_profit) || 0
    : 0;
  const busy = stop.isPending || forceStop.isPending;
  const reason = stopReasonLabel(run.stop_reason);

  return (
    <Shell>
      <BotJourney stage={updating ? "run" : "results"} />
      {runQuery.isError && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-amber-500/30 p-4 text-sm text-ink-2"
        >
          Live updates are temporarily unavailable. The last received result is
          shown; the server may still be running.{" "}
          <button
            type="button"
            onClick={() => refresh(run)}
            className="underline underline-offset-4"
          >
            Retry updates
          </button>
        </div>
      )}
      <header className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold text-ink">{run.bot_name}</h1>
            <StatusBadge status={run.status} />
            <AccountBadge isVirtual={run.is_virtual} />
          </div>
          <p className="text-sm text-ink-3 mt-1">
            {run.symbols.map(marketName).join(", ")} · starting stake{" "}
            {formatMoney(run.stake)} · started{" "}
            {new Date(run.started_at ?? run.created_at).toLocaleString()}
            {reason ? ` · ${reason}` : ""}
          </p>
        </div>

        {active && (
          <button
            type="button"
            disabled={busy || run.status === "stopping"}
            onClick={() => handleStop(run)}
            className="h-10 w-full rounded-lg border border-red-500/50 px-5 text-sm text-negative-soft transition hover:bg-red-500/10 disabled:opacity-45 sm:w-auto"
          >
            {run.status === "stopping"
              ? "Finishing open trades…"
              : stop.isPending
                ? "Sending stop…"
                : "Stop run"}
          </button>
        )}
      </header>

      <RunFeedback run={run} />
      <div className="mb-4 flex flex-wrap justify-between gap-2 text-xs text-ink-3">
        <span>
          {updating ? "Auto-updates every 2 seconds" : "Final session result"} ·{" "}
          {run.currency}
        </span>
        <span>
          Updated {new Date(runQuery.dataUpdatedAt).toLocaleTimeString()} ·{" "}
          <button
            type="button"
            onClick={() => refresh(run)}
            className="underline underline-offset-2"
          >
            Refresh
          </button>
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat
          label={`Realised P/L · ${run.currency}`}
          value={formatMoney(run.realized_pnl)}
          tone={decimalSign(run.realized_pnl)}
        />
        <Stat label="Total staked" value={formatMoney(run.total_staked)} />
        <Stat
          label="Executed trades"
          value={`${run.trades_won}W / ${run.trades_lost}L`}
          hint={`${run.trades_open} open`}
        />
        {run.shadow ? (
          <Stat
            label="Shadow trades"
            value={`${run.shadow.entries_won}W / ${run.shadow.entries_lost}L`}
            hint="Not bought"
          />
        ) : (
          <Stat label="Total" value={String(run.trades_total)} />
        )}
      </div>

      {run.shadow && (
        <div className="mb-8">
          <ShadowGauge shadow={run.shadow} active={active} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {stopLossLimit > 0 && (
          <Meter
            label="Stop loss used"
            used={Math.max(0, -pnlNumber)}
            limit={stopLossLimit}
            tone="loss"
          />
        )}
        {targetLimit > 0 && (
          <Meter
            label="Progress to take profit"
            used={Math.max(0, pnlNumber)}
            limit={targetLimit}
            tone="profit"
          />
        )}
      </div>

      <div className="bg-surface border border-line rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
          <h2 className="text-sm font-medium text-ink">Entries</h2>
          <span className="text-xs text-ink-3">
            {entriesUpdating ? "Updating" : "Final"}
          </span>
        </div>

        {entriesQuery.isError && entriesQuery.data && (
          <p role="alert" className="px-5 py-3 text-xs text-amber-500">
            Entry updates are delayed. Your last received entries remain below.{" "}
            <button
              type="button"
              onClick={() => entriesQuery.refetch()}
              className="underline"
            >
              Retry
            </button>
          </p>
        )}
        {entriesQuery.isPending ? (
          <p className="px-5 py-8 text-center text-sm text-ink-3">
            Loading entries…
          </p>
        ) : entriesQuery.isError && !entriesQuery.data ? (
          <div className="px-5 py-8 text-center text-sm text-ink-3">
            Could not load the entries.{" "}
            <button
              type="button"
              onClick={() => entriesQuery.refetch()}
              className="underline"
            >
              Retry entries
            </button>
          </div>
        ) : entries.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-ink-3">
            {active
              ? "No entries yet. The bot is watching for its signal, which can take several minutes."
              : "This run took no entries."}
          </p>
        ) : (
          <>
            {/* Seven columns do not fit a phone, and scrolling sideways hid the
              result and the P&L. Below sm each entry is two short lines. */}
            <ul className="sm:hidden divide-y divide-line/60">
              {entries.map((entry) => (
                <EntryItem
                  key={`${entry.lane}-${entry.opened_at}-${entry.deriv_contract_id ?? ""}`}
                  entry={entry}
                  marketName={marketName}
                />
              ))}
            </ul>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-3">
                    <Th>Time</Th>
                    <Th>Market</Th>
                    <Th>Lane</Th>
                    <Th align="right">Digit</Th>
                    <Th>Result</Th>
                    <Th align="right">Stake</Th>
                    <Th align="right">P&amp;L</Th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <EntryRow
                      key={`${entry.lane}-${entry.opened_at}-${entry.deriv_contract_id ?? ""}`}
                      entry={entry}
                      marketName={marketName}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 max-w-2xl">
        <p className="text-xs leading-relaxed text-ink-3">
          This bot runs on the server. Closing this page does not stop it. You
          can return through Auto Hub → Running now to follow this session.
        </p>
        {active && (
          <EmergencyStopButton
            busy={forceStop.isPending}
            onConfirm={() => handleEmergencyStop(run)}
          />
        )}
      </div>
    </Shell>
  );
}

// ─── pieces ─────────────────────────────────────────────────────────────────

function resultLabel(entry: AutoHubEntry): string {
  const result = entry.outcome ?? "open";
  return result === "void" ? "not scored" : result;
}

function resultTone(entry: AutoHubEntry): string {
  return entry.outcome === "won"
    ? "text-positive"
    : entry.outcome === "lost"
      ? "text-negative"
      : "text-ink-3";
}

/** One entry on a phone: what and when on the left, how it ended on the right. */
function EntryItem({
  entry,
  marketName,
}: {
  entry: AutoHubEntry;
  marketName: (id: string) => string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm text-ink">
            {marketName(entry.symbol)}
          </span>
          <LaneChip lane={entry.lane} />
        </div>
        <p className="mt-0.5 text-xs tabular-nums text-ink-3">
          {new Date(entry.opened_at).toLocaleTimeString()}
          {entry.digit !== undefined ? ` · digit ${entry.digit}` : ""}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            resultTone(entry),
          )}
        >
          {resultLabel(entry)}
        </span>
        {/* Money only where there was some: a shadow entry shows no figure. */}
        {entry.profit_loss !== undefined && (
          <p
            className={cn(
              "text-xs tabular-nums",
              decimalSign(entry.profit_loss) < 0
                ? "text-negative"
                : "text-positive",
            )}
          >
            {formatMoney(entry.profit_loss)}
          </p>
        )}
      </div>
    </li>
  );
}

function EntryRow({
  entry,
  marketName,
}: {
  entry: AutoHubEntry;
  marketName: (id: string) => string;
}) {
  return (
    <tr className="border-b border-line/60 last:border-0">
      <Td className="tabular-nums text-ink-2 whitespace-nowrap">
        {new Date(entry.opened_at).toLocaleTimeString()}
      </Td>
      <Td className="text-ink-2 whitespace-nowrap">
        {marketName(entry.symbol)}
      </Td>
      <Td>
        <LaneChip lane={entry.lane} />
      </Td>
      <Td align="right" className="tabular-nums text-ink-2">
        {entry.digit ?? "—"}
      </Td>
      <Td>
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            resultTone(entry),
          )}
        >
          {resultLabel(entry)}
        </span>
      </Td>
      {/* A shadow entry has no stake and no profit. A dash, never a zero: a
          zero would read as a real trade that broke even. */}
      <Td align="right" className="tabular-nums text-ink-2">
        {entry.stake_amount ? formatMoney(entry.stake_amount) : "—"}
      </Td>
      <Td align="right" className="tabular-nums">
        <span
          className={cn(
            entry.profit_loss === undefined
              ? "text-ink-3"
              : decimalSign(entry.profit_loss) < 0
                ? "text-negative"
                : "text-positive",
          )}
        >
          {entry.profit_loss === undefined
            ? "—"
            : formatMoney(entry.profit_loss)}
        </span>
      </Td>
    </tr>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="p-4 lg:p-8">
      <Link
        href={"/autohub" as Route}
        className="-mt-2 mb-2 block w-fit py-2 text-xs text-ink-3 hover:text-ink"
      >
        &larr; Bot library
      </Link>
      {children}
    </section>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={cn(
        "px-4 py-2 font-medium sm:px-5",
        align === "right" && "text-right",
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <td
      className={cn(
        "px-4 py-2.5 sm:px-5",
        align === "right" && "text-right",
        className,
      )}
    >
      {children}
    </td>
  );
}
