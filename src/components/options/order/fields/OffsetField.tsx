"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { Field } from "./Field";
import { InfoDot } from "./InfoDot";
import { AnchoredPopover } from "./AnchoredPopover";
import { CaretDownIcon } from "@/components/ui/Icons";

interface OffsetFieldProps {
  label: string;
  /** Signed offset from spot (e.g. +0.41 barrier, +0.00 strike). */
  value: number;
  onChange: (next: number) => void;
  withInfo?: boolean;
  infoLabel?: string;
  decimals?: number;
  /** If provided, renders a dropdown of specific allowed barriers instead of a text input. */
  options?: number[];
}

/**
 * Signed numeric offset input — shared by "Strike price" (Vanillas) and
 * "Barrier" (Higher/Lower, Touch/No Touch). Displays a leading `+` for
 * non-negative values, Deriv-style.
 *
 * Keeps its own text state so partial edits ("+", "-", "1.") don't fight the
 * formatter; normalizes the display on blur.
 */
export function OffsetField({
  label,
  value,
  onChange,
  withInfo = false,
  infoLabel,
  decimals = 2,
  options,
}: OffsetFieldProps) {
  const fmt = (n: number) =>
    (n >= 0 && (options === undefined || options.some(o => o < 0)) ? "+" : "") + n.toFixed(decimals);

  const [text, setText] = useState(() => fmt(value));
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
    const n = Number(text);
    if (!Number.isFinite(n) || n !== value) {
      setText(fmt(value));
    }
  }, [value, decimals]);
  return (
    <Field
      label={label}
      trailing={withInfo ? <InfoDot label={infoLabel ?? label} /> : undefined}
    >
      {options && options.length > 0 ? (
        <>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex flex-1 items-center justify-between gap-2 bg-transparent text-left"
          >
            <span className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[14px] font-semibold tabular-nums text-opt-ink">
              {fmt(value)}
            </span>
            <CaretDownIcon className="h-3.5 w-3.5 text-opt-ink-3" />
          </button>
          {open && (
            <AnchoredPopover anchorRef={triggerRef} onClose={() => setOpen(false)} matchWidth>
              <div className="flex max-h-[250px] w-full flex-col overflow-y-auto overscroll-contain rounded-xl border border-opt-line bg-opt-bg-elev p-1 shadow-[0_20px_50px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.06)]">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex h-9 w-full items-center justify-center rounded px-3 text-[13px] font-semibold transition-colors tabular-nums",
                      opt === value
                        ? "bg-opt-ink text-opt-bg"
                        : "text-opt-ink hover:bg-opt-hover",
                    )}
                  >
                    {fmt(opt)}
                  </button>
                ))}
              </div>
            </AnchoredPopover>
          )}
        </>
      ) : (
        <input
          type="text"
          inputMode="decimal"
          value={text}
          onChange={(e) => {
            const raw = e.target.value;
            setText(raw);
            const n = Number(raw);
            if (Number.isFinite(n)) onChange(n);
          }}
          onBlur={() => setText(fmt(value))}
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent p-0 text-[14px] font-semibold tabular-nums text-opt-ink",
            "outline-none placeholder:text-opt-ink-4",
          )}
        />
      )}
    </Field>
  );
}
