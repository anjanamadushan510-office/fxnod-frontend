import { CalendarIcon } from "lucide-react";
import { useGetTradeHistory } from "@/services/api/endpoints/trading/trading";

export function TradeTable() {
  const { data: trades, isLoading } = useGetTradeHistory();

  const totalProfitLoss = trades?.reduce((acc, t) => {
    const stake = parseFloat(t.stake_amount);
    const payout = parseFloat(t.final_payout_amount || "0");
    return acc + (payout - stake);
  }, 0) ?? 0;

  return (
    <div className="flex h-full flex-col text-[14px]">
      {/* Top filters */}
      <div className="flex items-center gap-4 border-b border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Date from</span>
          <button className="flex items-center gap-2 rounded border border-gray-800 bg-panel px-3 py-1.5 text-white hover:bg-gray-800 transition-colors">
            <CalendarIcon className="h-4 w-4" />
            <span>Today</span>
          </button>
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
            const buyTimeStr = buyDate.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            let sellTimeStr = "-";
            if (trade.duration_seconds && trade.outcome) {
              const sellDate = new Date(buyDate.getTime() + trade.duration_seconds * 1000);
              sellTimeStr = sellDate.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
            }

            const side = trade.side.toLowerCase();

            return (
              <div 
                key={trade.id} 
                className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr_1.5fr_1fr_1.5fr] gap-4 border-b border-gray-800/50 p-4 items-center hover:bg-gray-800/20 transition-colors"
              >
                <div className="flex items-center gap-2 text-white">
                  <div className="h-6 w-6 rounded bg-gray-800 flex items-center justify-center text-xs">V</div>
                  <div className="flex flex-col">
                    <span className="font-medium text-xs truncate max-w-[150px]">{trade.frontend_contract_type}</span>
                    <span className={side === "rise" || side === "buy" || side === "up" ? "text-opt-rise text-[11px]" : "text-opt-fall text-[11px]"}>
                      {trade.side}
                    </span>
                  </div>
                </div>
                <div className="text-zinc-300">{trade.deriv_contract_id}</div>
                <div className="text-zinc-300">{trade.currency}</div>
                <div className="text-zinc-300 whitespace-nowrap">{buyTimeStr}</div>
                <div className="text-right text-zinc-300">{stake.toFixed(2)}</div>
                <div className="text-zinc-300 whitespace-nowrap">{sellTimeStr}</div>
                <div className="text-right text-zinc-300">{payout.toFixed(2)}</div>
                <div className={`text-right font-medium ${isWin ? "text-opt-rise" : "text-opt-fall"}`}>
                  {profitLoss > 0 ? "+" : ""}{profitLoss.toFixed(2)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-800 p-4 font-medium">
        <div className="text-zinc-400">Profit/loss on the last 50 contracts</div>
        <div className={`text-[16px] ${totalProfitLoss >= 0 ? "text-opt-rise" : "text-opt-fall"}`}>
          {totalProfitLoss > 0 ? "+" : ""}{totalProfitLoss.toFixed(2)} USD
        </div>
      </div>
    </div>
  );
}
