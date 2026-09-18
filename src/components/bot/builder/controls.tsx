"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The builder's visual vocabulary: large choice cards, small uppercase group
 * labels, and plain labelled inputs. Kept in one file so every step reads as
 * the same product.
 */

export function StepHeader({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <header className="mb-8">
      <h2 className="font-display text-xl font-semibold mb-1 text-ink">{title}</h2>
      {subtitle && <p className="text-sm text-ink-3">{subtitle}</p>}
    </header>
  );
}

export function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.18em] text-ink-3 font-medium mb-3">
      {children}
    </p>
  );
}

interface ChoiceCardProps {
  title: string;
  description?: ReactNode;
  badge?: string;
  active: boolean;
  disabled?: boolean;
  onSelect: () => void;
  size?: "md" | "sm";
}

/**
 * A selectable card. Rendered as a real button so it is reachable by keyboard
 * and announced as pressed — a clickable <article> is neither.
 */
export function ChoiceCard({
  title,
  description,
  badge,
  active,
  disabled = false,
  onSelect,
  size = "md",
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-xl border transition flex flex-col",
        size === "md" ? "p-5" : "p-4",
        active
          ? "bg-ink border-ink text-surface shadow-lg"
          : "bg-surface-2 border-line text-ink hover:border-ink-3",
        disabled && "cursor-not-allowed opacity-45 hover:border-line",
      )}
    >
      <span className="flex justify-between items-start gap-2 mb-1">
        <span className="font-display font-semibold">{title}</span>
        {badge && (
          <span
            className={cn(
              "text-[10px] uppercase tracking-wider shrink-0 mt-0.5",
              active ? "text-surface/80" : "text-ink-3",
            )}
          >
            {badge}
          </span>
        )}
      </span>
      {description && (
        <span
          className={cn(
            "text-sm leading-relaxed",
            active ? "text-surface/80" : "text-ink-2",
          )}
        >
          {description}
        </span>
      )}
    </button>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: ReactNode;
  placeholder?: string;
  /** Decimal amounts and whole counts both stay strings; only the keyboard differs. */
  kind?: "decimal" | "integer" | "text";
  maxLength?: number;
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  kind = "decimal",
  maxLength,
}: TextFieldProps) {
  return (
    <label className="block">
      <span className="text-xs text-ink-3 mb-1.5 block">{label}</span>
      <input
        type="text"
        inputMode={kind === "text" ? "text" : kind === "integer" ? "numeric" : "decimal"}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-4 rounded-lg bg-surface-2 border border-line text-sm text-ink placeholder:text-ink-3 focus:border-ink-3 outline-none transition-colors"
      />
      {hint && <span className="mt-1.5 block text-[11px] text-ink-3">{hint}</span>}
    </label>
  );
}

/** A row of small pill buttons for picking one value from a short list. */
export function PillPicker<T extends string | number>({
  label,
  options,
  value,
  onChange,
  format = (v) => String(v),
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  format?: (value: T) => string;
}) {
  return (
    <div>
      <span className="text-xs text-ink-3 mb-1.5 block">{label}</span>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={String(option)}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option)}
              className={cn(
                "h-10 min-w-10 px-3 rounded-lg border text-sm font-medium transition",
                active
                  ? "bg-ink border-ink text-surface"
                  : "bg-surface-2 border-line text-ink hover:border-ink-3",
              )}
            >
              {format(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function InfoPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6">
      <GroupLabel>{title}</GroupLabel>
      <div className="text-sm text-ink-2 leading-relaxed">{children}</div>
    </div>
  );
}
