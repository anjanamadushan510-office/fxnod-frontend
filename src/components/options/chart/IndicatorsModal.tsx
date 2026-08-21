"use client";

import { useEffect, useState } from "react";
import { X, Settings, Trash2, Zap, Activity, TrendingUp, Waves, LineChart, Shapes } from "lucide-react";
import { cn } from "@/lib/cn";
import { IndicatorSettingsModal } from "./IndicatorSettingsModal";

import { useChartIndicators, type IndicatorType, DEFAULT_INDICATOR_PARAMS } from "@/stores/useChartIndicators";
import type { IntervalId } from "./chartSettings";
import {
  IconAwesomeOscillator,
  IconDPO,
  IconMACD,
  IconROC,
  IconRSI,
  IconStochastic,
  IconWPR,
  IconAroon,
  IconADX,
  IconCCI,
  IconIchimoku,
  IconParabolicSAR,
  IconZigZag,
  IconGenericTrend,
  IconGenericVolatility,
  IconGenericMA,
  IconGenericOther,
} from "@/components/ui/IndicatorIcons";

interface IndicatorsModalProps {
  symbol: string;
  interval?: IntervalId;
  onClose: () => void;
}

const TEAL = "#00A79E";

type Category = "Active" | "Momentum" | "Trend" | "Volatility" | "Moving averages" | "Others";

const INDICATOR_LIST: { id: string; name: string; category: Category; disabled?: boolean; requiresOHLC?: boolean; Icon?: React.FC<{ className?: string }> }[] = [
  // Momentum
  { id: "awesome_oscillator", name: "Awesome Oscillator", category: "Momentum", requiresOHLC: true, Icon: IconAwesomeOscillator },
  { id: "dpo", name: "Detrended Price Oscillator", category: "Momentum", disabled: true, Icon: IconDPO },
  { id: "MACD", name: "MACD", category: "Momentum", Icon: IconMACD },
  { id: "roc", name: "Price Rate of Change", category: "Momentum", Icon: IconROC },
  { id: "RSI", name: "Relative Strength Index (RSI)", category: "Momentum", Icon: IconRSI },
  { id: "stochastic", name: "Stochastic Oscillator", category: "Momentum", requiresOHLC: true, Icon: IconStochastic },
  { id: "smi", name: "Stochastic Momentum Index", category: "Momentum", disabled: true, requiresOHLC: true, Icon: IconStochastic },
  { id: "wpr", name: "William's Percent Range", category: "Momentum", requiresOHLC: true, Icon: IconWPR },
  // Trend
  { id: "aroon", name: "Aroon", category: "Trend", Icon: IconAroon },
  { id: "adx", name: "ADX/DMS", category: "Trend", Icon: IconADX },
  { id: "cci", name: "Commodity Channel Index", category: "Trend", requiresOHLC: true, Icon: IconCCI },
  { id: "ichimoku", name: "Ichimoku Clouds", category: "Trend", Icon: IconIchimoku },
  { id: "parabolic_sar", name: "Parabolic SAR", category: "Trend", Icon: IconParabolicSAR },
  { id: "zigzag", name: "Zig Zag", category: "Trend", Icon: IconZigZag },
  // Volatility
  { id: "bollinger", name: "Bollinger Bands", category: "Volatility", Icon: IconGenericVolatility },
  { id: "donchian", name: "Donchian Channel", category: "Volatility", Icon: IconGenericVolatility },
  // Moving averages
  { id: "ma", name: "Moving Average (MA)", category: "Moving averages", Icon: IconGenericMA },
  { id: "ma_envelope", name: "Moving Average Envelope", category: "Moving averages", Icon: IconGenericMA },
  { id: "rainbow_ma", name: "Rainbow Moving Average", category: "Moving averages", Icon: IconGenericMA },
  // Others
  { id: "alligator", name: "Alligator", category: "Others", Icon: IconGenericOther },
  { id: "fractal", name: "Fractal Chaos Bands", category: "Others", Icon: IconGenericOther },
];

export function IndicatorsModal({ symbol, interval, onClose }: IndicatorsModalProps) {
  const [tab, setTab] = useState<Category>("Active");
  const [settingsIndicatorId, setSettingsIndicatorId] = useState<string | null>(null);

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
        {activeIndicators.map((ind) => {
          const meta = INDICATOR_LIST.find((i) => i.id === ind.type);
          return (
            <div key={ind.id} className="flex items-center justify-between rounded-lg border border-opt-line p-3">
              <div className="flex items-center gap-3">
                {meta?.Icon && <meta.Icon className="h-5 w-5 opacity-90" />}
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-opt-ink">{meta?.name || ind.type}</span>
                  <span className="text-[11px] text-opt-ink-3">
                    ({Object.values(ind.params).join(",")})
                  </span>
                </div>
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
              <button
                type="button"
                aria-label="Settings"
                onClick={() => setSettingsIndicatorId(ind.id)}
                className="grid h-8 w-8 place-items-center rounded bg-opt-bg-sunk text-opt-ink-3 hover:text-opt-ink transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCategoryTab = (category: Category) => {
    const list = INDICATOR_LIST.filter((i) => i.category === category);
    const isTick = interval === "1t";
    
    return (
      <div className="flex flex-col gap-2 p-4">
        {list.map((ind) => {
          const isDisabled = ind.disabled || (isTick && ind.requiresOHLC);
          return (
            <div key={ind.id} className={cn("flex items-center justify-between rounded-lg border border-opt-line p-3 transition-colors", isDisabled ? "opacity-50 grayscale" : "hover:bg-opt-bg-sunk")}>
              <div className="flex items-center gap-3">
                {ind.Icon && <ind.Icon className="h-5 w-5 opacity-90" />}
                <span className="text-[13px] font-medium text-opt-ink">{ind.name}</span>
              </div>
              <button
                type="button"
                disabled={isDisabled}
                title={isTick && ind.requiresOHLC ? "Not available on tick charts" : undefined}
                onClick={() => !isDisabled && addIndicator(symbol, ind.id as IndicatorType)}
                className={cn("rounded px-3 py-1 text-[12px] font-semibold transition-colors", isDisabled ? "bg-opt-bg-sunk text-opt-ink-4 cursor-not-allowed" : "bg-opt-line text-opt-ink hover:bg-opt-line-strong")}
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
              icon={Zap}
              active={tab === "Active"}
              onClick={() => setTab("Active")}
            />
            <div className="my-2 h-px w-full bg-opt-line" />
            <TabButton label="Momentum" icon={Activity} active={tab === "Momentum"} onClick={() => setTab("Momentum")} />
            <TabButton label="Trend" icon={TrendingUp} active={tab === "Trend"} onClick={() => setTab("Trend")} />
            <TabButton label="Volatility" icon={Waves} active={tab === "Volatility"} onClick={() => setTab("Volatility")} />
            <TabButton label="Moving averages" icon={LineChart} active={tab === "Moving averages"} onClick={() => setTab("Moving averages")} />
            <TabButton label="Others" icon={Shapes} active={tab === "Others"} onClick={() => setTab("Others")} />
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
      {settingsIndicatorId && (
        <IndicatorSettingsModal 
          indicatorId={settingsIndicatorId} 
          onClose={() => setSettingsIndicatorId(null)} 
        />
      )}
    </div>
  );
}

function TabButton({ label, icon: Icon, active, onClick }: { label: string; icon: React.ElementType; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors",
        active ? "bg-opt-bg-sunk text-opt-ink" : "text-opt-ink-3 hover:bg-opt-bg-sunk hover:text-opt-ink"
      )}
      style={active ? { borderLeft: `3px solid ${TEAL}` } : { borderLeft: "3px solid transparent" }}
    >
      <Icon className={cn("h-4 w-4", active ? "text-opt-ink" : "text-opt-ink-3")} />
      {label}
    </button>
  );
}
