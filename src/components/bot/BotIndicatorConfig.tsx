import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useChartIndicators, type IndicatorType } from "@/stores/useChartIndicators";
import { INDICATOR_LIST } from "@/components/options/chart/IndicatorsModal";
import { cn } from "@/lib/cn";

interface BotIndicatorConfigProps {
  symbols: string[];
}

/**
 * DBot-specific Indicator Configuration.
 * 
 * Unlike DTrader (which binds an indicator to a single chart), DBot can trade 
 * multiple markets concurrently. This component ensures that when an indicator 
 * is added/removed, it is synchronized across ALL selected markets in the 
 * useChartIndicators global store.
 */
export function BotIndicatorConfig({ symbols }: BotIndicatorConfigProps) {
  const { addIndicator, clearIndicators } = useChartIndicators();
  
  // Strictly local state: DBot indicators start empty and only update explicitly.
  const [botIndicators, setBotIndicators] = useState<IndicatorType[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // Sync strictly One-Way (DBot Local -> Global) whenever symbols or botIndicators change.
  useEffect(() => {
    if (symbols.length === 0) return;
    
    symbols.forEach(symbol => {
      // Wipe any old DTrader indicators for this symbol
      clearIndicators(symbol);
      
      // Apply ONLY the bot-configured indicators
      botIndicators.forEach(type => {
        addIndicator(symbol, type);
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols, botIndicators]);

  const handleAdd = (type: IndicatorType) => {
    setBotIndicators(prev => {
      if (prev.length < 5 && !prev.includes(type)) {
        return [...prev, type];
      }
      return prev;
    });
    setIsAdding(false);
  };

  const handleRemove = (type: IndicatorType) => {
    setBotIndicators(prev => prev.filter(t => t !== type));
  };

  const isAtLimit = botIndicators.length >= 5;

  if (symbols.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-bold tracking-[-0.01em] text-opt-ink">
          Chart Indicators
        </label>
        <button 
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          disabled={isAtLimit}
          className={cn(
            "flex items-center gap-1 rounded bg-opt-bg-sunk px-2 py-1 text-[11px] font-semibold text-opt-ink transition-colors",
            isAtLimit ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10"
          )}
        >
          {isAdding ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />} 
          {isAdding ? "Cancel" : "Add Indicator"}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {botIndicators.length === 0 && !isAdding ? (
          <div className="rounded border border-opt-line border-dashed p-3 text-center text-[11px] text-opt-ink-3">
            No indicators configured for this bot.
          </div>
        ) : (
          botIndicators.map(type => {
            const meta = INDICATOR_LIST.find(i => i.id === type);
            return (
              <div key={type} className="flex items-center justify-between rounded border border-opt-line bg-opt-bg-elev p-2 transition-colors hover:bg-opt-bg-sunk">
                <div className="flex items-center gap-2">
                  {meta?.Icon && <meta.Icon className="h-4 w-4 opacity-80" />}
                  <span className="text-[12px] font-medium text-opt-ink">
                    {meta?.name || type}
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => handleRemove(type)}
                  className="rounded p-1 text-opt-ink-3 transition-colors hover:bg-white/10 hover:text-opt-ink"
                  title="Remove from all markets"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {isAdding && (
        <div className="mt-2 flex max-h-64 flex-col gap-1 overflow-y-auto rounded-lg border border-opt-line bg-opt-bg-sunk p-2 shadow-inner">
          {INDICATOR_LIST.map((ind) => {
            // Check if this type is already added
            const isAdded = botIndicators.includes(ind.id as IndicatorType);
            if (isAdded) return null; // Hide already added indicators

            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => handleAdd(ind.id as IndicatorType)}
                className="flex items-center gap-3 rounded p-2 text-left transition-colors hover:bg-white/5"
              >
                {ind.Icon && <ind.Icon className="h-4 w-4 opacity-70" />}
                <span className="text-[12px] font-medium text-opt-ink">
                  {ind.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
