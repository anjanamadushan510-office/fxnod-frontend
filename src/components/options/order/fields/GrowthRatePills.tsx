"use client";

import { cn } from "@/lib/cn";
import { Field } from "./Field";
import { InfoDot } from "./InfoDot";

interface GrowthRatePillsProps {
  /** Available rates (percent values). Default: 1, 2, 3, 4, 5. */
  options?: number[];
  value: number;
  loading?: boolean;
  onChange: (next: number) => void;
}

/**
 * Five-pill selector used by Accumulators for the growth rate. The selected
 * pill is outlined (inset ring) rather than filled, matching the design.
 */
export function GrowthRatePills({
  options = [1, 2, 3, 4, 5],
  value,
  loading = false,
  onChange,
}: GrowthRatePillsProps) {
  const isCustomOptions = options.length > 0 && (options.length !== 5 || options[0] !== 1);
  const showLive = !loading && isCustomOptions;

  return (
    <Field
      label={
        <div className="flex items-center gap-1.5">
          Growth rate
          {loading ? (
            <span className="font-normal text-opt-ink-3">(loading…)</span>
          ) : showLive || !loading ? (
            <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-400">
              LIVE
            </span>
          ) : null}
        </div>
      }
      trailing={<InfoDot label="Growth rate info" />}
    >
      <div className="grid w-full grid-cols-5 gap-1">
        {options.map((opt) => {
          const on = opt === value;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={cn(
                "rounded-lg border-0 px-1.5 py-2 text-[13px] font-semibold tabular-nums",
                "transition-colors duration-150",
                on
                  ? "bg-opt-bg-elev text-opt-ink shadow-[inset_0_0_0_1px_var(--opt-ink)]"
                  : "bg-opt-bg-sunk text-opt-ink-2 hover:text-opt-ink",
              )}
            >
              {opt}%
            </button>
          );
        })}
      </div>
    </Field>
  );
}
