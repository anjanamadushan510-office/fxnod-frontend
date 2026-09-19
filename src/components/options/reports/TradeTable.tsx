import { CalendarIcon, ChevronDownIcon, ClockIcon } from "lucide-react";

const MOCK_TRADES = [
  {
    id: "44728919293",
    type: "vol_100_1s",
    typeName: "Volatility 100 (1s) Index",
    action: "Rise",
    currency: "USD",
    buyTime: "19 Sep 2026, 10:15:00",
    stake: 10.00,
    sellTime: "19 Sep 2026, 10:16:00",
    contractValue: 10.88,
    profitLoss: 0.88,
  },
  {
    id: "44728919280",
    type: "vol_50_1s",
    typeName: "Volatility 50 (1s) Index",
    action: "Fall",
    currency: "USD",
    buyTime: "19 Sep 2026, 09:30:15",
    stake: 5.00,
    sellTime: "19 Sep 2026, 09:31:15",
    contractValue: 0.00,
    profitLoss: -5.00,
  }
];

export function TradeTable() {
  const totalProfitLoss = MOCK_TRADES.reduce((acc, t) => acc + t.profitLoss, 0);

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
        {MOCK_TRADES.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-zinc-500">
             No trades found for this period.
          </div>
        ) : (
          MOCK_TRADES.map((trade) => (
            <div 
              key={trade.id} 
              className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr_1.5fr_1fr_1.5fr] gap-4 border-b border-gray-800/50 p-4 items-center hover:bg-gray-800/20 transition-colors"
            >
              <div className="flex items-center gap-2 text-white">
                <div className="h-6 w-6 rounded bg-gray-800 flex items-center justify-center text-xs">V</div>
                <div className="flex flex-col">
                  <span className="font-medium text-xs truncate max-w-[150px]">{trade.typeName}</span>
                  <span className={trade.action === "Rise" ? "text-opt-rise text-[11px]" : "text-opt-fall text-[11px]"}>{trade.action}</span>
                </div>
              </div>
              <div className="text-zinc-300">{trade.id}</div>
              <div className="text-zinc-300">{trade.currency}</div>
              <div className="text-zinc-300 whitespace-nowrap">{trade.buyTime}</div>
              <div className="text-right text-zinc-300">{trade.stake.toFixed(2)}</div>
              <div className="text-zinc-300 whitespace-nowrap">{trade.sellTime}</div>
              <div className="text-right text-zinc-300">{trade.contractValue.toFixed(2)}</div>
              <div className={`text-right font-medium ${trade.profitLoss >= 0 ? "text-opt-rise" : "text-opt-fall"}`}>
                {trade.profitLoss > 0 ? "+" : ""}{trade.profitLoss.toFixed(2)}
              </div>
            </div>
          ))
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
