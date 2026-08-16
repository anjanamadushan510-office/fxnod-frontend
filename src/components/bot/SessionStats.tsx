"use client";

import { cn } from "@/lib/cn";
import { InfoIcon } from "@/components/ui/Icons";
import { winRate, type BotSession, type BotStatus } from "./types";

/** Formats an amount with a forced sign — a P&L of exactly 0 reads as "0.00". */
function signed(value: number): string {
  const body = Math.abs(value).toFixed(2);
  if (value > 0) return `+${body}`;
  if (value < 0) return `-${body}`;
  return body;
}

export function SessionStats({ session }: { session: BotSession }) {
  const positive = session.realizedPnl >= 0;

  return (
    <div className="grid grid-cols-[1.4fr_0.9fr_1fr_1fr] gap-3 max-xl:grid-cols-2 max-lg:grid-cols-1">
      <Card>
        <CardLabel label="Realized P&L" info />
        <div className="flex flex-wrap items-baseline gap-2">
          <span
            className={cn(
              "text-[30px] font-bold leading-none tracking-[-0.02em] tabular-nums",
              positive ? "text-opt-rise" : "text-opt-fall",
            )}
          >
            {signed(session.realizedPnl)}
          </span>
          <span className="text-[13px] font-semibold text-opt-ink-3">
            {session.currency}
          </span>
        </div>
        <span
          className={cn(
            "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
            positive
              ? "bg-opt-rise-soft text-opt-rise"
              : "bg-opt-fall-soft text-opt-fall",
          )}
        >
          {positive ? "▲" : "▼"} {signed(session.realizedPnlPct)}%
        </span>
      </Card>

      <Card>
        <CardLabel label="Bot Status" />
        <StatusPill status={session.status} />
      </Card>

      <MeterCard
        label="Session Target Profit"
        tone="rise"
        progress={session.targetProfitProgress}
        limit={session.targetProfitLimit}
        currency={session.currency}
      />

      <MeterCard
        label="Session Stop Loss"
        tone="fall"
        progress={session.stopLossProgress}
        limit={session.stopLossLimit}
        currency={session.currency}
      />
    </div>
  );
}

function MeterCard({
  label,
  tone,
  progress,
  limit,
  currency,
}: {
  label: string;
  tone: "rise" | "fall";
  progress: number;
  limit: number;
  currency: string;
}) {
  // Clamped so a backend that reports an overshoot cannot render a bar wider
  // than its track.
  const pct = limit > 0 ? Math.min(100, Math.max(0, (progress / limit) * 100)) : 0;

  return (
    <Card>
      <CardLabel label={label} />
      <span
        className={cn(
          "text-[26px] font-bold leading-none tabular-nums",
          tone === "rise" ? "text-opt-rise" : "text-opt-fall",
        )}
      >
        {pct.toFixed(0)}%
      </span>

      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 w-full overflow-hidden rounded-full bg-opt-bg-sunk"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300",
            tone === "rise" ? "bg-opt-rise" : "bg-opt-fall",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <span className="text-[11px] tabular-nums text-opt-ink-3">
        {progress.toFixed(2)} / {limit.toFixed(2)} {currency}
      </span>
    </Card>
  );
}

const STATUS_COPY: Record<BotStatus, { label: string; className: string; dot: string }> = {
  idle: {
    label: "Idle",
    className: "border-opt-line bg-opt-bg-sunk text-opt-ink-2",
    dot: "bg-opt-ink-4",
  },
  running: {
    label: "Running",
    className: "border-opt-rise/30 bg-opt-rise-soft text-opt-rise",
    dot: "bg-opt-rise",
  },
  paused: {
    label: "Paused",
    className: "border-opt-line-strong bg-opt-bg-sunk text-opt-ink-2",
    dot: "bg-opt-ink-3",
  },
  stopping: {
    label: "Stopping…",
    className: "border-opt-fall/30 bg-opt-fall-soft text-opt-fall",
    dot: "bg-opt-fall",
  },
};

export function StatusPill({ status }: { status: BotStatus }) {
  const copy = STATUS_COPY[status];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-semibold",
        copy.className,
      )}
    >
      <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", copy.dot)} />
      {copy.label}
    </span>
  );
}

/** Total / Won / Loss / Win % strip. */
export function CounterStrip({ session }: { session: BotSession }) {
  return (
    <div className="grid grid-cols-4 gap-3 rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev px-5 py-4 max-lg:grid-cols-2">
      <Counter label="Total Trades" value={String(session.tradesTotal)} />
      <Counter label="Won" value={String(session.tradesWon)} tone="rise" />
      <Counter label="Loss" value={String(session.tradesLost)} tone="fall" />
      <Counter label="Win %" value={`${winRate(session).toFixed(2)}%`} />
    </div>
  );
}

function Counter({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "rise" | "fall";
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-opt-ink-3">{label}</span>
      <span
        className={cn(
          "text-[22px] font-bold leading-none tabular-nums",
          tone === "rise" && "text-opt-rise",
          tone === "fall" && "text-opt-fall",
          !tone && "text-opt-ink",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center gap-2 rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev px-5 py-4">
      {children}
    </div>
  );
}

function CardLabel({ label, info }: { label: string; info?: boolean }) {
  return (
    <span className="flex items-center gap-1 text-[11px] font-semibold text-opt-ink-3">
      {label}
      {info && <InfoIcon className="h-3 w-3 text-opt-ink-4" />}
    </span>
  );
}
