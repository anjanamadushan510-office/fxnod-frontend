import { useState } from "react";
import { X, Save } from "lucide-react";
import { useChartIndicators } from "@/stores/useChartIndicators";

export function IndicatorSettingsModal({ indicatorId, onClose }: { indicatorId: string; onClose: () => void }) {
  const { indicators, updateIndicator } = useChartIndicators();
  const indicator = indicators.find((ind) => ind.id === indicatorId);
  const [params, setParams] = useState<Record<string, any>>(indicator ? indicator.params : {});

  if (!indicator) return null;

  const handleSave = () => {
    updateIndicator(indicatorId, params);
    onClose();
  };

  const handleParamChange = (key: string, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-xl border border-opt-line bg-opt-bg-elev shadow-2xl">
        <div className="flex items-center justify-between border-b border-opt-line px-4 py-3">
          <h2 className="text-[14px] font-semibold text-opt-ink">Settings: {indicator.type.toUpperCase()}</h2>
          <button onClick={onClose} className="text-opt-ink-3 hover:text-opt-ink">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          {Object.entries(params).map(([key, value]) => {
            if (key === "maType") {
              return (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-[13px] font-medium text-opt-ink-2 capitalize">{key}</label>
                  <select
                    value={value}
                    onChange={(e) => handleParamChange(key, e.target.value)}
                    className="rounded border border-opt-line bg-opt-bg-sunk px-2 py-1 text-[13px] text-opt-ink outline-none focus:border-opt-ink"
                  >
                    <option value="SMA">Simple</option>
                    <option value="EMA">Exponential</option>
                    <option value="WMA">Weighted</option>
                  </select>
                </div>
              );
            }
            return (
              <div key={key} className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-opt-ink-2 capitalize">{key}</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                  className="w-20 rounded border border-opt-line bg-opt-bg-sunk px-2 py-1 text-[13px] text-opt-ink outline-none focus:border-opt-ink"
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-end border-t border-opt-line p-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded bg-[#00A79E] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#00928a]"
          >
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
