import { cn } from "@/lib/cn";
import type { AutoHubShadow } from "@/services/api/model";
import { LaneChip } from "./pieces";

/**
 * Where a Shadow Fade run stands between watching and trading.
 *
 * Every figure is the engine's: the lane, the sample it was decided from and
 * the threshold all come from the run. The page only draws them, so what the
 * user reads here is what the worker acted on, not a second calculation that
 * could disagree with it.
 */
export function ShadowGauge({ shadow, active }: { shadow: AutoHubShadow; active: boolean }) {
  const { sample_wins: wins, sample_count: count, sample_size: size, live_below_pct: threshold } = shadow;
  const collecting = count < size;
  // Whole percent, from two integers.
  const rate = count > 0 ? Math.round((wins * 100) / count) : 0;

  return (
    <div className="bg-surface border border-line rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-ink">Shadow gate</h2>
          <LaneChip lane={shadow.lane} />
        </div>
        <span className="text-xs text-ink-3">
          {shadow.entries_won}W / {shadow.entries_lost}L shadow
          {shadow.entries_open > 0 ? " · 1 open" : ""}
        </span>
      </div>

      {collecting ? (
        <>
          <p className="text-sm text-ink-2 leading-relaxed">
            {active ? "Collecting results before any real trade: " : "Collected "}
            <span className="tabular-nums text-ink">
              {count} of {size}
            </span>
            .
          </p>
          <div className="mt-3 h-2 rounded-full bg-surface-2 overflow-hidden">
            <div
              style={{ width: `${(count / size) * 100}%` }}
              className="h-full rounded-full bg-ink-3"
            />
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-ink-2 leading-relaxed">
            Last {size} results won{" "}
            <span className="tabular-nums text-ink">
              {wins} of {count} ({rate}%)
            </span>
            . {laneSentence(shadow, active)}
          </p>
          {/* The bar is the win rate; the tick is the threshold it is read against. */}
          <div className="relative mt-4 h-2 rounded-full bg-surface-2">
            <div
              style={{ width: `${rate}%` }}
              className={cn(
                "h-full rounded-full",
                shadow.lane === "live" ? "bg-emerald-500" : "bg-ink-3",
              )}
            />
            <div
              style={{ left: `${threshold}%` }}
              className="absolute -top-1 h-4 w-px bg-ink"
              aria-hidden="true"
            />
          </div>
          <div className="relative mt-1 h-4 text-[10px] text-ink-3">
            <span
              style={{ left: `${threshold}%` }}
              className="absolute -translate-x-1/2 whitespace-nowrap tabular-nums"
            >
              {threshold}%
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Says why the run is in its lane. The lane itself is the engine's; only the
 * wording is chosen here, from the same two integers the engine compared. A
 * win rate of exactly the threshold changes nothing, so that case names the
 * lane it stays in rather than claiming to be above or below.
 */
function laneSentence(shadow: AutoHubShadow, active: boolean): string {
  const { lane, live_below_pct: threshold } = shadow;
  if (!active) {
    return lane === "live" ? "It ended in the live lane." : "It ended in the shadow lane.";
  }
  const next = lane === "live" ? "a real trade" : "a shadow trade";
  const rate = shadow.sample_wins * 100;
  const mark = threshold * shadow.sample_count;
  if (rate === mark) {
    return `Exactly ${threshold}%, which keeps the lane it was in, so the next entry is ${next}.`;
  }
  return `${rate < mark ? "Below" : "Above"} ${threshold}%, so the next entry is ${next}.`;
}
