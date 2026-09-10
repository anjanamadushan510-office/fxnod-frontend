import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { Field } from "./Field";
import { InfoDot } from "./InfoDot";
import { AnchoredPopover } from "./AnchoredPopover";
import { CaretDownIcon } from "@/components/ui/Icons";
import { useLiveMarket } from "@/stores/useLiveMarket";

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

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Popover state for Higher/Lower style inputs (options === undefined)
  const isPositive = value >= 0;
  const [popoverSign, setPopoverSign] = useState<"+" | "-">(isPositive ? "+" : "-");
  const [popoverVal, setPopoverVal] = useState(Math.abs(value).toFixed(decimals));

  useEffect(() => {
    if (open) {
      setPopoverSign(value >= 0 ? "+" : "-");
      setPopoverVal(Math.abs(value).toFixed(decimals));
    }
  }, [open, value, decimals]);

  const livePrice = useLiveMarket((s) => s.price);

  const handleSave = () => {
    const raw = Number(popoverVal);
    if (!Number.isFinite(raw)) return;
    const finalVal = popoverSign === "+" ? Math.abs(raw) : -Math.abs(raw);
    onChange(finalVal);
    setOpen(false);
  };

  return (
    <Field
      label={label}
      active={open}
      trailing={withInfo ? <InfoDot label={infoLabel ?? label} /> : undefined}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex flex-1 items-center justify-between gap-2 bg-transparent text-left",
          !options && "w-full"
        )}
      >
        <span className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[14px] font-semibold tabular-nums text-opt-ink">
          {fmt(value)}
        </span>
        {options && options.length > 0 && <CaretDownIcon className="h-3.5 w-3.5 text-opt-ink-3" />}
      </button>

      {open && (
        options && options.length > 0 ? (
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
        ) : (
          <AnchoredPopover anchorRef={triggerRef} onClose={() => setOpen(false)}>
            <div className="flex w-[280px] overflow-hidden rounded-xl border border-opt-line bg-opt-bg-elev shadow-[0_20px_50px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.06)]">
              {/* Left Column: Sign Toggle */}
              <div className="flex w-[100px] flex-col border-r border-opt-line py-2">
                <button
                  onClick={() => setPopoverSign("+")}
                  className={cn(
                    "relative flex h-10 items-center px-4 text-[13px] font-medium transition-colors",
                    popoverSign === "+" ? "text-opt-ink" : "text-opt-ink-3 hover:text-opt-ink"
                  )}
                >
                  Above spot
                  {popoverSign === "+" && (
                    <div className="absolute right-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-l-full bg-[#FF4444]" />
                  )}
                </button>
                <button
                  onClick={() => setPopoverSign("-")}
                  className={cn(
                    "relative flex h-10 items-center px-4 text-[13px] font-medium transition-colors",
                    popoverSign === "-" ? "text-opt-ink" : "text-opt-ink-3 hover:text-opt-ink"
                  )}
                >
                  Below spot
                  {popoverSign === "-" && (
                    <div className="absolute right-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-l-full bg-[#FF4444]" />
                  )}
                </button>
              </div>

              {/* Right Column: Value & Save */}
              <div className="flex flex-1 flex-col p-3">
                <div className="mb-2 flex items-center justify-between text-[11px]">
                  <span className="text-opt-ink-3">Current spot</span>
                  <span className="font-semibold text-opt-ink tabular-nums">
                    {livePrice?.toFixed(decimals + 2) ?? "—"}
                  </span>
                </div>
                
                <div className="mb-3 flex items-center rounded-md border border-opt-line bg-opt-bg-sunk px-3 py-2 focus-within:border-[#00A79E]">
                  <span className="mr-2 text-[14px] font-semibold text-opt-ink">
                    {popoverSign}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    autoFocus
                    value={popoverVal}
                    onChange={(e) => setPopoverVal(e.target.value.replace(/[^0-9.]/g, ""))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSave();
                      }
                    }}
                    className="w-full min-w-0 border-none bg-transparent p-0 text-[14px] font-semibold tabular-nums text-opt-ink outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!popoverVal || isNaN(Number(popoverVal))}
                  className="rounded-full bg-opt-ink py-2 text-[13px] font-semibold text-opt-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </AnchoredPopover>
        )
      )}
    </Field>
  );
}
