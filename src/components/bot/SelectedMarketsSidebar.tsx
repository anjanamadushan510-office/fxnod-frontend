import { useState } from "react";
import { LiveChart } from "@/components/options/chart/LiveChart";
import { findMarket } from "@/components/options/market/catalog";

interface SelectedMarketsSidebarProps {
  symbols: string[];
}

export function SelectedMarketsSidebar({ symbols }: SelectedMarketsSidebarProps) {
  const [selectedSymbolForChart, setSelectedSymbolForChart] = useState<string | null>(null);

  return (
    <div className="flex h-full w-72 flex-col border-l border-white/10 bg-opt-bg-elevated">
      <div className="border-b border-white/10 p-4">
        <h3 className="text-[14px] font-bold text-opt-ink">Selected Markets</h3>
      </div>
      
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
        {symbols.length === 0 ? (
          <div className="text-sm italic text-opt-ink-3">No markets selected</div>
        ) : (
          symbols.map((symbol) => {
            const market = findMarket(symbol);
            return (
              <button
                key={symbol}
                type="button"
                onClick={() => setSelectedSymbolForChart(symbol)}
                className="w-full rounded-md bg-opt-bg-sunk p-3 text-left transition-colors hover:bg-white/5"
              >
                <div className="text-sm font-medium text-opt-ink">
                  {market ? market.name : symbol}
                </div>
                <div className="mt-1 text-[11px] text-opt-ink-3">
                  Click to view chart & indicators
                </div>
              </button>
            );
          })
        )}
      </div>

      {selectedSymbolForChart && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4"
          role="dialog"
        >
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-opt-bg-elevated shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 bg-opt-bg-sunk px-6 py-4">
              <h2 className="text-lg font-bold text-opt-ink">
                {findMarket(selectedSymbolForChart)?.name || selectedSymbolForChart} — Live Chart
              </h2>
              <button
                type="button"
                onClick={() => setSelectedSymbolForChart(null)}
                className="text-[13px] font-semibold text-opt-ink-2 hover:text-opt-ink"
              >
                Close
              </button>
            </div>
            
            <div className="relative h-[500px] w-full p-4">
              <LiveChart 
                chartType="area" 
                interval="1t" 
                symbol={selectedSymbolForChart} 
              />
            </div>
            
            <div className="flex justify-end p-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setSelectedSymbolForChart(null)}
                className="rounded-md bg-opt-bg-sunk px-5 py-2.5 text-[13px] font-semibold text-opt-ink transition-colors hover:bg-white/10"
              >
                Close Chart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
