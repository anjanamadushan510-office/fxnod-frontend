"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

export function ThemePicker({ theme, onChange }: {
  theme?: string;
  onChange: (theme: "light" | "dark" | "system") => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="Workspace appearance">
      {(["light", "dark", "system"] as const).map((value) => {
        const selected = theme === value;
        const Icon = value === "light" ? Sun : value === "dark" ? Moon : Monitor;
        return (
          <button key={value} type="button" aria-pressed={selected}
            onClick={() => onChange(value)}
            className={cn("min-h-20 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-line",
              selected ? "border-gold bg-gold-soft" : "border-line bg-surface hover:border-ink-3")}>
            <span className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Icon size={18} /> {value === "light" ? "Light" : value === "dark" ? "Dark" : "System"}
              {selected && <Check size={16} className="ml-auto text-gold-3 dark:text-gold-2" />}
            </span>
            <span className="mt-1 block text-xs leading-4 text-ink-2">
              {value === "light" ? "Soft, clear surfaces." : value === "dark" ? "Deep navy workspace." : "Match this device."}
            </span>
          </button>
        );
      })}
    </div>
  );
}
