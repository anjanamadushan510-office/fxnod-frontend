"use client";

import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { HistoryTable } from "@/components/bot/HistoryTable";
import { toTradeRows } from "@/components/bot/tradeRows";
import {
  useListBotRunTrades,
  useListBotRuns,
  useListBotStrategies,
} from "@/services/api/endpoints/bots/bots";
import type { BotRun, BotRunTradeSummary } from "@/services/api/model";

/**
 * /options/dbot/history — every run this user has made.
 *
 * The workspace shows only ACTIVE runs, because its tabs are a view of what the
 * worker is doing right now. That left a real hole: the moment a run ended it
 * left the tab strip, and its trades became unreachable — the record of what a
 * bot did with someone's money disappeared the instant it mattered most.
 *
 * So this is a record, not a control surface. Nothing here starts, stops or
 * changes a run; it is deliberately read-only.
 */

const PAGE_SIZE = 25;

export default function DBotHistoryPage() {
  const [offset, setOffset] = useState(0);
  const [selectedId, setSelectedId] = useState<string>("");

  const strategiesQuery = useListBotStrategies();
  const runsQuery = useListBotRuns(
    { limit: PAGE_SIZE, offset },
    // A run in flight keeps moving. Slower than the workspace's 3s: this screen
    // is for reading a record, not for watching one.
    { query: { refetchInterval: 15_000 } },
  );

  const runs: BotRun[] = useMemo(
    () => runsQuery.data?.runs ?? [],
    [runsQuery.data],
  );

  const strategyNames = useMemo(() => {
    const names: Record<string, string> = {};
    for (const s of strategiesQuery.data?.strategies ?? []) {
      names[s.strategy_id] = s.display_name;
    }
    return names;
  }, [strategiesQuery.data]);

  // Follow the list: land on the newest run, and never leave the detail pane
  // pointing at a run that this page of results does not contain.
  useEffect(() => {
    if (runs.length === 0) return;
    if (!runs.some((r) => r.run_id === selectedId)) {
      setSelectedId(runs[0].run_id);
    }
  }, [runs, selectedId]);

  const selected = runs.find((r) => r.run_id === selectedId);

  const tradesQuery = useListBotRunTrades(
    selected?.run_id ?? "",
    { limit: 100 },
    {
      query: {
        enabled: Boolean(selected?.run_id),
        refetchInterval: selected && isActive(selected) ? 5_000 : false,
      },
    },
  );

  // A full page means there is probably another one. The API returns no total,
  // so this is the honest test rather than a page count we cannot compute.
  const hasNextPage = runs.length === PAGE_SIZE;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-3 border-b border-opt-line px-5 py-3">
        <Link
          href={"/options/dbot" as Route}
          className="text-[11px] font-semibold text-opt-ink-3 transition-colors hover:text-opt-ink"
        >
          ← Back to bots
        </Link>
        <h1 className="m-0 text-[14px] font-bold tracking-tight text-opt-ink">
          History
        </h1>
        <span className="text-[11px] text-opt-ink-3">
          Every run, including the ones that have finished
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[360px] shrink-0 flex-col overflow-hidden border-r border-opt-line">
          <div className="min-h-0 flex-1 overflow-y-auto">
            {runsQuery.isPending && <RunSkeletons />}

            {runsQuery.isError && (
              <Message>
                Could not load your runs. The trading engine may be unavailable.
              </Message>
            )}

            {!runsQuery.isPending && !runsQuery.isError && runs.length === 0 && (
              <Message>
                {offset === 0
                  ? "No runs yet. Start a bot and it will be recorded here."
                  : "Nothing further back than this."}
              </Message>
            )}

            {runs.map((run) => (
              <RunRow
                key={run.run_id}
                run={run}
                name={strategyNames[run.strategy_id] ?? run.strategy_id}
                selected={run.run_id === selectedId}
                onSelect={() => setSelectedId(run.run_id)}
              />
            ))}
          </div>

          {(offset > 0 || hasNextPage) && (
            <div className="flex shrink-0 items-center justify-between gap-2 border-t border-opt-line px-3 py-2">
              <PagerButton
                disabled={offset === 0}
                onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
              >
                ← Newer
              </PagerButton>
              <PagerButton
                disabled={!hasNextPage}
                onClick={() => setOffset((o) => o + PAGE_SIZE)}
              >
                Older →
              </PagerButton>
            </div>
          )}
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {selected ? (
            <RunDetail
              run={selected}
              name={strategyNames[selected.strategy_id] ?? selected.strategy_id}
              summary={tradesQuery.data?.summary}
              trades={toTradeRows(tradesQuery.data?.trades ?? [])}
              loading={tradesQuery.isPending}
              failed={tradesQuery.isError}
            />
          ) : (
            <Message>Select a run to see what it traded.</Message>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Run list ────────────────────────────────────────────────────────────────

function RunRow({
  run,
  name,
  selected,
  onSelect,
}: {
  run: BotRun;
  name: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const pnl = Number.parseFloat(run.realized_pnl) || 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "flex w-full flex-col gap-1 border-b border-opt-line px-4 py-3 text-left",
        "transition-colors",
        selected ? "bg-opt-bg-sunk" : "hover:bg-opt-bg-elev",
      )}
    >
      <span className="flex items-center gap-2">
        <StatusPill status={run.status} />
        <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-opt-ink">
          {name}
        </span>
        <PnlText value={pnl} />
      </span>
      <span className="flex items-center gap-2 text-[10.5px] text-opt-ink-3">
        <span className="truncate">{run.symbol}</span>
        {run.is_virtual && (
          <span className="shrink-0 rounded-full bg-opt-ink-4/20 px-1.5 py-px font-bold uppercase tracking-wide">
            Demo
          </span>
        )}
        <span className="ml-auto shrink-0 tabular-nums">
          {formatWhen(run.started_at ?? run.created_at)}
        </span>
      </span>
    </button>
  );
}

// ─── Run detail ──────────────────────────────────────────────────────────────

function RunDetail({
  run,
  name,
  summary,
  trades,
  loading,
  failed,
}: {
  run: BotRun;
  name: string;
  summary?: BotRunTradeSummary;
  trades: ReturnType<typeof toTradeRows>;
  loading: boolean;
  failed: boolean;
}) {
  // The summary wins when loaded: it is derived from the same rows the table
  // shows, so the headline and the list cannot disagree.
  const pnl = Number.parseFloat(summary?.realized_pnl ?? run.realized_pnl) || 0;
  const staked = Number.parseFloat(summary?.total_staked ?? run.total_staked) || 0;
  const total = summary?.total ?? run.trades_total;
  const won = summary?.won ?? run.trades_won;
  const lost = summary?.lost ?? run.trades_lost;

  return (
    <>
      <header className="shrink-0 border-b border-opt-line px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={run.status} />
          <h2 className="m-0 text-[14px] font-bold text-opt-ink">{name}</h2>
          <span className="text-[11px] text-opt-ink-3">{run.symbol}</span>
          {run.is_virtual && (
            <span className="rounded-full bg-opt-ink-4/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-opt-ink-2">
              Demo
            </span>
          )}
        </div>

        <p className="m-0 mt-1 text-[10.5px] text-opt-ink-3">
          Started {formatWhen(run.started_at ?? run.created_at)}
          {run.ended_at && ` · ended ${formatWhen(run.ended_at)}`}
          {run.stop_reason && ` · ${describeStopReason(run.stop_reason)}`}
        </p>
      </header>

      <div className="flex shrink-0 flex-wrap gap-6 border-b border-opt-line px-5 py-3">
        <Stat label="Trades" value={String(total)} />
        <Stat label="Won" value={String(won)} />
        <Stat label="Lost" value={String(lost)} />
        <Stat label={`Staked (${run.currency})`} value={staked.toFixed(2)} />
        <Stat
          label={`Realized P&L (${run.currency})`}
          value={<PnlText value={pnl} />}
        />
      </div>

      {failed ? (
        <Message>Could not load this run&apos;s trades.</Message>
      ) : loading ? (
        <Message>Loading trades…</Message>
      ) : (
        <HistoryTable
          trades={trades}
          emptyMessage="This run placed no trades."
        />
      )}
    </>
  );
}

// ─── Pieces ──────────────────────────────────────────────────────────────────

const ACTIVE_STATUSES = new Set(["pending", "running", "paused", "stopping"]);

function isActive(run: BotRun): boolean {
  return ACTIVE_STATUSES.has(run.status);
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "running" || status === "pending"
      ? "bg-opt-rise-soft text-opt-rise"
      : status === "failed"
        ? "bg-opt-fall-soft text-opt-fall"
        : "bg-opt-bg-sunk text-opt-ink-3";

  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide",
        tone,
      )}
    >
      {status}
    </span>
  );
}

function PnlText({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "shrink-0 text-[12px] font-bold tabular-nums",
        positive ? "text-opt-rise" : "text-opt-fall",
      )}
    >
      {positive ? "+" : "-"}
      {Math.abs(value).toFixed(2)}
    </span>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <span className="flex flex-col leading-tight">
      <span className="text-[10px] uppercase tracking-wide text-opt-ink-3">
        {label}
      </span>
      <span className="text-[13px] font-bold tabular-nums text-opt-ink">
        {value}
      </span>
    </span>
  );
}

function Message({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid flex-1 place-items-center px-5 py-12 text-center">
      <p className="m-0 max-w-[34ch] text-[12px] leading-relaxed text-opt-ink-3">
        {children}
      </p>
    </div>
  );
}

function PagerButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-[var(--opt-radius-sm)] px-2.5 py-1 text-[11px] font-semibold",
        "text-opt-ink-2 transition-colors hover:bg-opt-bg-sunk hover:text-opt-ink",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
      )}
    >
      {children}
    </button>
  );
}

function RunSkeletons() {
  return (
    <div className="flex flex-col">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-[62px] animate-pulse border-b border-opt-line bg-opt-bg-elev"
        />
      ))}
    </div>
  );
}

// ─── Formatting ──────────────────────────────────────────────────────────────

/** The viewer's own clock — someone reconciling their trades reads their own. */
function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * Why a run ended, in the words of the person it happened to. The raw codes are
 * the worker's vocabulary and say nothing to the user whose bot stopped.
 */
function describeStopReason(reason: string): string {
  switch (reason) {
    case "session_stop_loss":
      return "stopped at its session stop loss";
    case "session_target_profit":
      return "stopped at its profit target";
    case "max_trades":
      return "reached its trade limit";
    case "max_duration":
      return "reached its time limit";
    case "user_requested":
      return "stopped by you";
    case "account_session_loss":
      return "stopped by the account-wide loss limit";
    case "martingale_steps_exhausted":
      return "ran out of martingale steps";
    case "entitlement_lapsed":
      return "stopped because the subscription lapsed";
    case "admin_halt":
      return "halted by FXNod";
    case "error":
      return "stopped after an error";
    default:
      return reason;
  }
}
