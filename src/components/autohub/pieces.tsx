import { cn } from "@/lib/cn";

/** Small building blocks the Auto Hub pages share. */

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        status === "running"
          ? "bg-emerald-500/15 text-emerald-400"
          : status === "failed"
            ? "bg-red-500/15 text-red-400"
            : "bg-surface-2 text-ink-2",
      )}
    >
      {status}
    </span>
  );
}

export function AccountBadge({ isVirtual }: { isVirtual: boolean }) {
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        isVirtual ? "bg-zinc-700 text-zinc-200" : "bg-amber-400 text-black",
      )}
    >
      {isVirtual ? "Demo" : "Real"}
    </span>
  );
}

/**
 * Which lane an entry was in, or a run's next entry will be in.
 *
 * Shadow is deliberately the quiet one: nothing was bought. Live is the one
 * that spends money, so it carries the colour.
 */
export function LaneChip({ lane }: { lane: "shadow" | "live" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        lane === "live" ? "bg-emerald-500/15 text-emerald-400" : "bg-surface-2 text-ink-2",
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", lane === "live" ? "bg-emerald-400" : "bg-ink-3")}
      />
      {lane}
    </span>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = 0,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: -1 | 0 | 1;
}) {
  return (
    <article className="bg-surface border border-line rounded-2xl p-4 min-w-0">
      <p className="text-xs text-ink-3">{label}</p>
      <p
        className={cn(
          "text-xl font-semibold mt-1 tabular-nums truncate",
          tone < 0 ? "text-red-400" : tone > 0 ? "text-emerald-400" : "text-ink",
        )}
      >
        {value}
      </p>
      {hint && <p className="text-xs text-ink-3 mt-0.5">{hint}</p>}
    </article>
  );
}

/**
 * How much of a limit a run has used. The bar is a picture of two numbers the
 * engine reported; nothing here decides when a run stops.
 */
export function Meter({
  label,
  used,
  limit,
  tone,
}: {
  label: string;
  used: number;
  limit: number;
  tone: "loss" | "profit";
}) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  return (
    <div className="bg-surface border border-line rounded-2xl p-4">
      <div className="flex justify-between items-baseline gap-3 mb-2">
        <span className="text-xs text-ink-3">{label}</span>
        <span className="text-xs tabular-nums text-ink-2">
          {used.toFixed(2)} / {limit.toFixed(2)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
        <div
          style={{ width: `${pct}%` }}
          className={cn("h-full rounded-full", tone === "loss" ? "bg-red-500" : "bg-emerald-500")}
        />
      </div>
    </div>
  );
}
