"use client";

import { Check, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

export function ThemePicker({ theme, onChange }: {
  theme?: string;
  onChange: (theme: "light" | "dark") => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2" role="group" aria-label="Workspace appearance">
      {(["light", "dark"] as const).map((value) => {
        const light = value === "light";
        const selected = theme === value;
        const Icon = light ? Sun : Moon;
        return (
          <button key={value} type="button" aria-pressed={selected}
            onClick={() => onChange(value)}
            className={cn("overflow-hidden rounded-2xl border p-3 text-left transition-colors",
              selected ? "border-gold bg-gold-soft" : "border-line bg-surface hover:border-ink-3")}>
            <div aria-hidden className="flex h-28 overflow-hidden rounded-lg border"
              style={{ background: light ? "#edf3fb" : "#080c16", borderColor: light ? "#dce4ef" : "#24344f" }}>
              <div className="w-1/4 space-y-2 p-3" style={{ background: light ? "#fff" : "#101827" }}>
                <div className="mb-4 h-1.5 w-4 rounded bg-[#c49a45]" />
                {[0, 1, 2].map((row) => <div key={row} className="h-2 rounded"
                  style={{ background: row === 0 ? "#234b78" : light ? "#e3eaf4" : "#24344f" }} />)}
              </div>
              <div className="flex-1 p-3">
                <div className="mb-3 h-2 w-1/2 rounded" style={{ background: light ? "#234b78" : "#d1d5db" }} />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-14 rounded-md border-t-2 border-[#c49a45]" style={{ background: light ? "#173a63" : "#162238" }} />
                  <div className="h-14 rounded-md" style={{ background: light ? "#fff" : "#101827" }} />
                </div>
              </div>
            </div>
            <span className="mt-3 flex items-center gap-2 text-sm font-semibold text-ink">
              <Icon size={16} /> {light ? "Light" : "Dark"}
              {selected && <Check size={16} className="ml-auto text-gold-3 dark:text-gold-2" />}
            </span>
            <span className="mt-1 block text-xs leading-5 text-ink-2">
              {light ? "Crisp whites, navy details and warm gold." : "Deep navy surfaces for a quieter workspace."}
            </span>
          </button>
        );
      })}
    </div>
  );
}
