import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export function BotJourney({ stage }: { stage: "setup" | "run" | "results" }) {
  const current = stage === "setup" ? 1 : stage === "run" ? 2 : 3;
  return (
    <ol
      aria-label="Bot journey"
      className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6"
    >
      {["Choose bot", "Set up & review", "Live run", "Results & repeat"].map(
        (label, index) => (
          <li
            key={label}
            aria-current={index === current ? "step" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs",
              index === current
                ? "border-ink/30 bg-surface-2 text-ink"
                : "border-line text-ink-3",
            )}
          >
            <span className="h-5 w-5 rounded-full bg-surface-2 flex items-center justify-center shrink-0">
              {index < current ? <Check size={12} /> : index + 1}
            </span>
            {label}
          </li>
        ),
      )}
    </ol>
  );
}
