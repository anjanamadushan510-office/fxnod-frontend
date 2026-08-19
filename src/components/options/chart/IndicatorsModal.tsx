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

type Category = "Active" | "Momentum" | "Trend" | "Volatility" | "Moving averages" | "Others";

const INDICATOR_LIST: { id: string; name: string; category: Category; disabled?: boolean }[] = [
  // Momentum
  { id: "awesome_oscillator", name: "Awesome Oscillator", category: "Momentum" },
  { id: "dpo", name: "Detrended Price Oscillator", category: "Momentum", disabled: true },
  { id: "MACD", name: "MACD", category: "Momentum" },
  { id: "roc", name: "Price Rate of Change", category: "Momentum" },
  { id: "RSI", name: "Relative Strength Index (RSI)", category: "Momentum" },
  { id: "stochastic", name: "Stochastic Oscillator", category: "Momentum" },
  { id: "smi", name: "Stochastic Momentum Index", category: "Momentum", disabled: true },
  { id: "wpr", name: "William's Percent Range", category: "Momentum" },
  // Trend
  { id: "aroon", name: "Aroon", category: "Trend", disabled: true },
  { id: "adx", name: "ADX/DMS", category: "Trend", disabled: true },
  { id: "cci", name: "Commodity Channel Index", category: "Trend" },
  { id: "ichimoku", name: "Ichimoku Clouds", category: "Trend", disabled: true },
  { id: "parabolic_sar", name: "Parabolic SAR", category: "Trend", disabled: true },
  { id: "zigzag", name: "Zig Zag", category: "Trend", disabled: true },
  // Volatility
  { id: "bollinger", name: "Bollinger Bands", category: "Volatility", disabled: true },
  { id: "donchian", name: "Donchian Channel", category: "Volatility", disabled: true },
  // Moving averages
  { id: "SMA", name: "SMA (Simple Moving Average)", category: "Moving averages" },
  { id: "EMA", name: "EMA (Exponential Moving Average)", category: "Moving averages" },
  { id: "wma", name: "WMA (Weighted Moving Average)", category: "Moving averages", disabled: true },
  // Others
  { id: "alligator", name: "Alligator", category: "Others", disabled: true },
  { id: "fractal", name: "Fractal Chaos Bands", category: "Others", disabled: true },
];

export function IndicatorsModal({ symbol, onClose }: IndicatorsModalProps) {
  const [tab, setTab] = useState<Category>("Active");

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

  const renderCategoryTab = (category: Category) => {
    const list = INDICATOR_LIST.filter((i) => i.category === category);
    
    return (
      <div className="flex flex-col gap-2 p-4">
        {list.map((ind) => {
          return (
            <div key={ind.id} className={cn("flex items-center justify-between rounded-lg border border-opt-line p-3 transition-colors", ind.disabled ? "opacity-50 grayscale" : "hover:bg-opt-bg-sunk")}>
              <span className="text-[13px] font-medium text-opt-ink">{ind.name}</span>
              <button
                type="button"
                disabled={ind.disabled}
                onClick={() => !ind.disabled && addIndicator(symbol, ind.id as IndicatorType)}
                className={cn("rounded px-3 py-1 text-[12px] font-semibold transition-colors", ind.disabled ? "bg-opt-bg-sunk text-opt-ink-4 cursor-not-allowed" : "bg-opt-line text-opt-ink hover:bg-opt-line-strong")}
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
            <TabButton label="Momentum" active={tab === "Momentum"} onClick={() => setTab("Momentum")} />
            <TabButton label="Trend" active={tab === "Trend"} onClick={() => setTab("Trend")} />
            <TabButton label="Volatility" active={tab === "Volatility"} onClick={() => setTab("Volatility")} />
            <TabButton label="Moving averages" active={tab === "Moving averages"} onClick={() => setTab("Moving averages")} />
            <TabButton label="Others" active={tab === "Others"} onClick={() => setTab("Others")} />
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col bg-opt-bg-elev">
          <div className="flex items-center justify-between border-b border-opt-line px-4 py-3 min-h-[57px]">
            <div className="flex items-center justify-between w-full">
              {/* Header space */}
              <div className="text-[14px] font-semibold text-opt-ink">
                {tab === "Active" ? "Active indicators" : tab}
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
            {tab === "Active" ? renderActiveTab() : renderCategoryTab(tab)}
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
