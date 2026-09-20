import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetTradeHistory } from "@/services/api/endpoints/trading/trading";
import { findMarket } from "@/components/options/market/catalog";
import { getContractDisplay } from "./utils";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import type { DateRange } from "react-day-picker";

export function TradeTable() {
  const searchParams = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  // Default to all time (empty)
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data: trades, isLoading } = useGetTradeHistory({
    request: {
      params: {
        ...currentParams,
        trade_type: undefined,
        symbol: undefined,
        chart_type: undefined,
        interval: undefined,
        date_from: dateRange?.from ? Math.floor(dateRange.from.getTime() / 1000) : undefined,
        date_to: dateRange?.to ? Math.floor(dateRange.to.getTime() / 1000) : undefined,
      }
    }
  });

  const totalProfitLoss = trades?.reduce((acc, t) => {
    const stake = parseFloat(t.stake_amount);
    const payout = parseFloat(t.final_payout_amount || "0");
    return acc + (payout - stake);
  }, 0) ?? 0;

  return (
    <div className="flex h-full flex-col text-[14px]">
      {/* Top filters */}
      <div className="flex items-center border-b border-gray-800 p-4">
        <div className="flex items-center gap-2 ml-auto">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr_1.5fr_1fr_1.5fr] gap-4 border-b border-gray-800 bg-[#0e0e0e]/50 p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <div>Type</div>
        <div>Ref. ID</div>
        <div>Currency</div>
        <div>Buy time</div>
        <div className="text-right">Stake</div>
        <div>Sell time</div>
        <div className="text-right">Contract value</div>
        <div className="text-right">Total profit/loss</div>
      </div>

      {/* Table body */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-zinc-500">
             Loading trades...
          </div>
        ) : !trades || trades.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-zinc-500">
             No trades found for this period.
          </div>
        ) : (
          trades.map((trade) => {
            const stake = parseFloat(trade.stake_amount);
            const payout = parseFloat(trade.final_payout_amount || "0");
            const profitLoss = payout - stake;
            const isWin = profitLoss >= 0;
            const buyDate = new Date(trade.created_at);
            const buyDayStr = buyDate.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'GMT' });
            const buyTimeStr = buyDate.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'GMT' });
            
            let sellDayStr = "-";
            let sellTimeStr = "";
            if (trade.duration_seconds && trade.outcome) {
              const sellDate = new Date(buyDate.getTime() + trade.duration_seconds * 1000);
              sellDayStr = sellDate.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'GMT' });
              sellTimeStr = sellDate.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'GMT' });
            }

            const { label, icon, colorClass } = getContractDisplay(trade.contract_type);
            const marketName = findMarket(trade.symbol)?.name || trade.symbol;
            const plSign = profitLoss >= 0 ? "+" : "-";
            const plValue = Math.abs(profitLoss).toFixed(2);

            return (
              <div 
                key={trade.id} 
                className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr_1.5fr_1fr_1.5fr] gap-4 border-b border-gray-800/50 p-4 items-center hover:bg-gray-800/20 transition-colors"
              >
                <div className="flex items-center gap-2 text-white" title={marketName}>
                  <div className="h-6 w-6 rounded bg-gray-800 flex items-center justify-center text-xs">V</div>
                  <div className="flex flex-col">
                    <span className="font-medium text-xs truncate max-w-[150px]">{marketName}</span>
                    <span className={`flex items-center gap-1 ${colorClass} text-[11px]`}>
                      {icon}
                      {label}
                    </span>
                  </div>
                </div>
                <div className="text-zinc-300">{trade.deriv_contract_id}</div>
                <div>
                  <span className="bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded text-[11px] font-bold">
                    {trade.currency}
                  </span>
                </div>
                <div className="flex flex-col whitespace-nowrap">
                  <span>{buyDayStr}</span>
                  <span className="text-zinc-500">{buyTimeStr} GMT</span>
                </div>
                <div className="text-right text-zinc-300">{stake.toFixed(2)}</div>
                <div className="flex flex-col whitespace-nowrap">
                  <span>{sellDayStr}</span>
                  {sellTimeStr && <span className="text-zinc-500">{sellTimeStr} GMT</span>}
                </div>
                <div className="text-right text-zinc-300">{payout.toFixed(2)}</div>
                <div className={`text-right font-medium ${isWin ? "text-emerald-500" : "text-red-500"}`}>
                  {plSign}{plValue}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-800 p-4 font-medium">
        <div className="text-zinc-400">Profit/loss on the last 50 contracts</div>
        <div className={`text-[16px] ${totalProfitLoss >= 0 ? "text-emerald-500" : "text-red-500"}`}>
          {totalProfitLoss >= 0 ? "+" : "-"}{Math.abs(totalProfitLoss).toFixed(2)} USD
        </div>
      </div>
    </div>
  );
}
