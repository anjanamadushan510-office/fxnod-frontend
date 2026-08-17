"use client";

import { cn } from "@/lib/cn";
import { InfoIcon } from "@/components/ui/Icons";
import type { BotDefinition } from "./types";

interface SelectBotProps {
  bots: BotDefinition[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** A run in progress locks the picker — switching bots mid-run is not a thing. */
  disabled?: boolean;
}

export function SelectBot({
  bots,
  selectedId,
  onSelect,
  disabled = false,
}: SelectBotProps) {
  return (
    <section className="flex flex-col gap-2.5">
      <SectionHeading label="Select Bot" />

      <div role="radiogroup" aria-label="Select Bot" className="flex flex-col gap-2">
        {bots.map((bot) => (
          <BotOption
            key={bot.id}
            bot={bot}
            selected={bot.id === selectedId}
            disabled={disabled || bot.comingSoon === true}
            onSelect={() => onSelect(bot.id)}
          />
        ))}
      </div>
    </section>
  );
}

function BotOption({
  bot,
  selected,
  disabled,
  onSelect,
}: {
  bot: BotDefinition;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-[var(--opt-radius)] border px-3 py-2.5 text-left",
        "transition-[background,border-color] duration-150",
        selected
          ? "border-opt-rise bg-opt-rise-soft"
          : "border-opt-line bg-opt-bg-elev hover:border-opt-line-strong",
        disabled && !selected && "cursor-not-allowed opacity-55 hover:border-opt-line",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-bold",
          selected ? "bg-opt-rise text-white" : "bg-opt-bg-sunk text-opt-ink-3",
        )}
      >
        {bot.comingSoon ? <LockGlyph /> : bot.name.charAt(0)}
      </span>

      <span className="flex min-w-0 flex-col">
        <span className="truncate text-[13px] font-semibold text-opt-ink">
          {bot.name}
        </span>
        <span className="truncate text-[11px] text-opt-ink-3">{bot.tagline}</span>
      </span>

      {selected && <CheckGlyph className="ml-auto shrink-0 text-opt-rise" />}
      {bot.comingSoon && (
        <LockGlyph className="ml-auto shrink-0 text-opt-ink-4" />
      )}
    </button>
  );
}

export function SectionHeading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <h2 className="m-0 text-[13px] font-bold tracking-[-0.01em] text-opt-ink">
        {label}
      </h2>
      <InfoIcon className="h-3.5 w-3.5 text-opt-ink-4" />
    </div>
  );
}

function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5 6.2 11.7 13 5" />
    </svg>
  );
}

function LockGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn("h-3.5 w-3.5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.6" />
      <path d="M5.75 7V5.25a2.25 2.25 0 0 1 4.5 0V7" />
    </svg>
  );
}
