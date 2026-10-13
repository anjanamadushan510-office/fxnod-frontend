"use client";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function FavouriteButton({
  name,
  selected,
  disabled,
  onClick,
}: {
  name: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const label = `${selected ? "Remove" : "Add"} ${name} ${selected ? "from" : "to"} favourites`;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-11 w-11 shrink-0 rounded-xl border flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-40",
        selected
          ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
          : "border-line text-ink-3 hover:text-ink hover:bg-surface-2",
      )}
    >
      <Star size={18} fill={selected ? "currentColor" : "none"} />
    </button>
  );
}
