import { CalendarIcon, ChevronDownIcon, TrendingUp, TrendingDown } from "lucide-react";
import { useGetTradeHistory } from "@/services/api/endpoints/trading/trading";
import { findMarket } from "@/components/options/market/catalog";
import { useMemo } from "react";

export function Statement() {
  const { data: trades, isLoading } = useGetTradeHistory();

  const statementItems = useMemo(() => {
    if (!trades) return [];

    const items: Array<{
      id: string;
      typeId: string;
      typeName: string;
      action: string;
      currency: string;
      time: Date;
      transactionType: "Buy" | "Sell";
      creditDebit: number;
      balance: string;
    }> = [];

    trades.forEach((trade) => {
      const stake = parseFloat(trade.stake_amount);
      const payout = parseFloat(trade.final_payout_amount || "0");
      const side = trade.side.toLowerCase();
      
      const buyDate = new Date(trade.created_at);

      // Buy transaction
      items.push({
        id: trade.deriv_contract_id,
        typeId: trade.symbol, // using symbol as type id
        typeName: trade.frontend_contract_type,
        action: trade.side,
        currency: trade.currency,
        time: buyDate,
        transactionType: "Buy",
        creditDebit: -stake,
        balance: "-",
      });

      // Sell transaction if settled with a payout
      if (trade.outcome && payout > 0 && trade.duration_seconds) {
        const sellDate = new Date(buyDate.getTime() + trade.duration_seconds * 1000);
        items.push({
          id: trade.deriv_contract_id,
          typeId: trade.symbol,
          typeName: trade.frontend_contract_type,
          action: "Sell",
          currency: trade.currency,
          time: sellDate,
          transactionType: "Sell",
          creditDebit: payout,
          balance: "-",
        });
      }
    });

    // Sort descending by time
    items.sort((a, b) => b.time.getTime() - a.time.getTime());
    return items;
  }, [trades]);

  return (
    <div className="flex h-full flex-col text-[14px]">
      {/* Top filters */}
      <div className="flex items-center gap-6 border-b border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Date from</span>
          <button className="flex items-center gap-2 rounded border border-gray-800 bg-panel px-3 py-1.5 text-white hover:bg-gray-800 transition-colors">
            <CalendarIcon className="h-4 w-4" />
            <span>Today</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Transaction type</span>
          <button className="flex items-center gap-2 rounded border border-gray-800 bg-panel px-3 py-1.5 text-white hover:bg-gray-800 transition-colors">
            <span>All transactions</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr_1.5fr_1.5fr] gap-4 border-b border-gray-800 bg-[#0e0e0e]/50 p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <div>Type</div>
        <div>Ref. ID</div>
        <div>Currency</div>
        <div>Transaction time</div>
        <div>Transaction</div>
        <div className="text-right">Credit/Debit</div>
        <div className="text-right">Balance</div>
      </div>

      {/* Table body */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
           <div className="flex h-full flex-col items-center justify-center p-8 text-center text-zinc-500">
             Loading statement...
           </div>
        ) : statementItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-zinc-500">
             No transactions found for this period.
          </div>
        ) : (
          statementItems.map((item, idx) => {
            const side = item.action.toLowerCase();
            const isRise = side === "rise" || side === "buy" || side === "up";
            const marketName = findMarket(item.typeId)?.name || item.typeId;
            
            const dayStr = item.time.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'GMT' });
            const timeStr = item.time.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'GMT' });
            
            const cdSign = item.creditDebit >= 0 ? "+" : "-";
            const cdValue = Math.abs(item.creditDebit).toFixed(2);

            return (
              <div 
                key={`${item.id}-${item.transactionType}-${idx}`}
                className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr_1.5fr_1.5fr] gap-4 border-b border-gray-800/50 p-4 items-center hover:bg-gray-800/20 transition-colors"
              >
                <div className="flex items-center gap-2 text-white" title={marketName}>
                  <div className="h-6 w-6 rounded bg-gray-800 flex items-center justify-center text-xs">V</div>
                  <div className="flex flex-col">
                    <span className="font-medium text-xs truncate max-w-[150px]">{marketName}</span>
                    <span className={`flex items-center gap-1 ${isRise ? "text-opt-rise text-[11px]" : "text-opt-fall text-[11px]"}`}>
                      {isRise ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {item.action}
                    </span>
                  </div>
                </div>
                <div className="text-zinc-300">{item.id}</div>
                <div>
                  <span className="bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded text-[11px] font-bold">
                    {item.currency}
                  </span>
                </div>
                <div className="flex flex-col whitespace-nowrap">
                  <span>{dayStr}</span>
                  <span className="text-zinc-500">{timeStr} GMT</span>
                </div>
                <div className="font-medium">
                  {item.transactionType === "Buy" ? (
                    <span className="text-opt-fall">Buy</span>
                  ) : (
                    <span className="text-opt-rise">Sell</span>
                  )}
                </div>
                <div className={`text-right font-medium ${item.creditDebit >= 0 ? "text-opt-rise" : "text-opt-fall"}`}>
                  {cdSign}{cdValue}
                </div>
                <div className="text-right font-medium text-white">{item.balance}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
