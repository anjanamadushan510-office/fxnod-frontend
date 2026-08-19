"use client";

import { useEffect, useState } from "react";
import { X, Settings, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useChartIndicators, type IndicatorType, DEFAULT_INDICATOR_PARAMS } from "@/stores/useChartIndicators";

interface IndicatorsModalProps {
  symbol: string;
  onClose: () => void;
}

const TEAL = "#00A79E";

const INDICATOR_LIST: { id: IndicatorType; name: string; category: "Moving averages" | "Oscillators" }[] = [
  { id: "SMA", name: "SMA (Simple Moving Average)", category: "Moving averages" },
  { id: "EMA", name: "EMA (Exponential Moving Average)", category: "Moving averages" },
  { id: "MACD", name: "MACD", category: "Oscillators" },
  { id: "RSI", name: "RSI (Relative Strength Index)", category: "Oscillators" },
];

export function IndicatorsModal({ symbol, onClose }: IndicatorsModalProps) {
  const [tab, setTab] = useState<"Active" | "Moving averages" | "Oscillators">("Active");

  const { indicators, addIndicator, removeIndicator, updateIndicator, clearIndicators } = useChartIndicators();
  const activeIndicators = indicators.filter((ind) => ind.symbol === symbol);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const renderActiveTab = () => {
    if (activeIndicators.length === 0) {
      return (
        <div className="flex h-[250px] flex-col items-center justify-center text-center text-opt-ink-3">
          <p className="text-[13px]">No active indicators.</p>
          <p className="text-[11px] mt-1">Select a category to add one.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2 p-4">
        {activeIndicators.map((ind) => (
          <div key={ind.id} className="flex items-center justify-between rounded-lg border border-opt-line p-3">
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-opt-ink">{ind.type}</span>
              <span className="text-[11px] text-opt-ink-3">
                ({Object.values(ind.params).join(",")})
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Remove"
                onClick={() => removeIndicator(ind.id)}
                className="grid h-8 w-8 place-items-center rounded bg-opt-bg-sunk text-opt-ink-3 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCategoryTab = (category: "Moving averages" | "Oscillators") => {
    const list = INDICATOR_LIST.filter((i) => i.category === category);
    
    return (
      <div className="flex flex-col gap-2 p-4">
        {list.map((ind) => {
          return (
            <div key={ind.id} className="flex items-center justify-between rounded-lg border border-opt-line p-3 hover:bg-opt-bg-sunk transition-colors">
              <span className="text-[13px] font-medium text-opt-ink">{ind.name}</span>
              <button
                type="button"
                onClick={() => addIndicator(symbol, ind.id)}
                className="rounded bg-opt-line px-3 py-1 text-[12px] font-semibold text-opt-ink transition-colors hover:bg-opt-line-strong"
              >
                Add
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Indicators"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex h-[480px] w-[min(560px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-opt-line bg-opt-bg-elev shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
        
        {/* Left Sidebar Tabs */}
        <div className="w-[180px] flex-shrink-0 border-r border-opt-line bg-opt-bg flex flex-col">
          <div className="p-4 border-b border-opt-line">
            <h2 className="text-[16px] font-bold text-opt-ink">Indicators</h2>
          </div>
          
          <div className="flex flex-col p-2 gap-1 flex-1">
            <TabButton 
              label={`Active ${activeIndicators.length > 0 ? `(${activeIndicators.length})` : ""}`}
              active={tab === "Active"}
              onClick={() => setTab("Active")}
            />
            <div className="my-2 h-px w-full bg-opt-line" />
            <TabButton label="Moving averages" active={tab === "Moving averages"} onClick={() => setTab("Moving averages")} />
            <TabButton label="Oscillators" active={tab === "Oscillators"} onClick={() => setTab("Oscillators")} />
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col bg-opt-bg-elev">
          <div className="flex items-center justify-between border-b border-opt-line px-4 py-3 min-h-[57px]">
            <div className="flex items-center justify-between w-full">
              {/* Header space */}
              <div className="text-[14px] font-semibold text-opt-ink">
                {tab === "Active" && "Active indicators"}
                {tab === "Moving averages" && "Moving averages"}
                {tab === "Oscillators" && "Oscillators"}
              </div>
              <div className="flex items-center gap-3">
                {tab === "Active" && activeIndicators.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearIndicators(symbol)}
                    className="text-[12px] font-semibold text-opt-ink-3 hover:text-opt-ink"
                  >
                    Clear all
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  className="grid h-8 w-8 place-items-center rounded-lg text-opt-ink-3 transition-colors hover:bg-opt-bg-sunk hover:text-opt-ink"
                >
                  <X className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {tab === "Active" && renderActiveTab()}
            {tab === "Moving averages" && renderCategoryTab("Moving averages")}
            {tab === "Oscillators" && renderCategoryTab("Oscillators")}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors",
        active ? "bg-opt-bg-sunk text-opt-ink" : "text-opt-ink-3 hover:bg-opt-bg-sunk hover:text-opt-ink"
      )}
      style={active ? { borderLeft: `3px solid ${TEAL}` } : { borderLeft: "3px solid transparent" }}
    >
      {label}
    </button>
  );
}
