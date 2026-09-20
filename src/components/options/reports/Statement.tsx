import { ChevronDownIcon, ListFilter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useGetTradeHistory } from "@/services/api/endpoints/trading/trading";
import { findMarket } from "@/components/options/market/catalog";
import { getContractDisplay } from "./utils";
import { useMemo, useState } from "react";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import type { DateRange } from "react-day-picker";
import type { TradeHistoryEntry } from "@/services/api/model/tradeHistoryEntry";
import * as Popover from "@radix-ui/react-popover";
import { useContractDetails } from "@/stores/useContractDetails";
import { historyToDetail } from "@/components/options/positions/contractDetail";

export function Statement() {
  const searchParams = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  // Default to all time (empty)
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [transactionType, setTransactionType] = useState("All transactions");
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const openDetail = useContractDetails((s) => s.open);

  const { data: trades, isLoading } = useGetTradeHistory({
    request: {
      params: {
        ...currentParams,
        trade_type: undefined,
        symbol: undefined,
        chart_type: undefined,
        interval: undefined,
        date_from: dateRange?.from ? Math.floor(dateRange.from.getTime() / 1000) : undefined,
        date_to: dateRange?.to ? Math.floor(new Date(dateRange.to).setHours(23, 59, 59, 999) / 1000) : undefined,
      }
    }
  });

  const statementItems = useMemo(() => {
    if (!trades) return [];

    let filteredTrades = trades;
    if (dateRange?.from || dateRange?.to) {
      filteredTrades = trades.filter((trade: TradeHistoryEntry) => {
        const tradeDate = new Date(trade.created_at).getTime();
        const fromTime = dateRange.from ? dateRange.from.getTime() : 0;
        const toTime = dateRange.to ? new Date(dateRange.to).setHours(23, 59, 59, 999) : Infinity;
        return tradeDate >= fromTime && tradeDate <= toTime;
      });
    }

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
      trade: TradeHistoryEntry;
    }> = [];

    filteredTrades.forEach((trade: TradeHistoryEntry) => {
      const stake = parseFloat(trade.stake_amount);
      const payout = parseFloat(trade.final_payout_amount || "0");

      const buyDate = new Date(trade.created_at);

      // Buy transaction
      items.push({
        id: trade.deriv_contract_id,
        typeId: trade.symbol,
        typeName: trade.frontend_contract_type,
        action: trade.contract_type,
        currency: trade.currency,
        time: buyDate,
        transactionType: "Buy",
        creditDebit: -stake,
        balance: "-",
        trade: trade,
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
          trade: trade,
        });
      }
    });

    // Sort descending by time
    items.sort((a, b) => b.time.getTime() - a.time.getTime());

    // Filter by transaction type
    if (transactionType !== "All transactions") {
      return items.filter(item => item.transactionType === transactionType || item.action === transactionType);
    }

    return items;
  }, [trades, dateRange, transactionType]);

  return (
    <div className="flex h-full flex-col text-[14px] text-gray-900 dark:text-gray-100">
      {/* Top filters */}
      <div className="flex items-center border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-4 ml-auto">
          <DateRangePicker value={dateRange} onChange={setDateRange} />

          <Popover.Root open={isTypeOpen} onOpenChange={setIsTypeOpen}>
            <Popover.Trigger asChild>
              <button className="flex items-center gap-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-1.5 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-[14px] outline-none">
                <ListFilter className="h-4 w-4 text-gray-400 dark:text-zinc-400" />
                <span>{transactionType}</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400 dark:text-zinc-400" />
              </button>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content
                className="z-[110] w-[200px] flex flex-col rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151a24] shadow-2xl overflow-hidden mt-2 text-[14px] text-gray-700 dark:text-zinc-300 outline-none"
                align="end"
                sideOffset={4}
              >
                {["All transactions", "Buy", "Sell", "Deposit", "Withdrawal"].map(type => (
                  <button
                    key={type}
                    onClick={() => { setTransactionType(type); setIsTypeOpen(false); }}
                    className="text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {type}
                  </button>
                ))}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr_1.5fr_1.5fr] gap-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0e0e0e]/50 p-4 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
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
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-gray-400 dark:text-zinc-500">
            Loading statement...
          </div>
        ) : statementItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-gray-400 dark:text-zinc-500">
            No transactions found for this period.
          </div>
        ) : (
          statementItems.map((item, idx) => {
            const { label, icon, colorClass } = getContractDisplay(item.action);
            const marketName = findMarket(item.typeId)?.name || item.typeId;

            const dayStr = item.time.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'GMT' });
            const timeStr = item.time.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'GMT' });

            const cdSign = item.creditDebit >= 0 ? "+" : "-";
            const cdValue = Math.abs(item.creditDebit).toFixed(2);

            return (
              <div
                key={`${item.id}-${item.transactionType}-${idx}`}
                className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr_1.5fr_1.5fr] gap-4 border-b border-gray-100 dark:border-gray-800/50 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors cursor-pointer"
                onClick={() => openDetail(historyToDetail(item.trade))}
              >
                <div className="flex items-center gap-2 text-gray-900 dark:text-white" title={marketName}>
                  <div className="h-6 w-6 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">V</div>
                  <div className="flex flex-col">
                    <span className="font-medium text-xs truncate max-w-[150px]">{marketName}</span>
                    <span className={`flex items-center gap-1 ${colorClass} text-[11px]`}>
                      {icon}
                      {item.transactionType === "Buy" ? label : "Sell"}
                    </span>
                  </div>
                </div>
                <div className="text-gray-600 dark:text-zinc-300">{item.id}</div>
                <div>
                  <span className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-[11px] font-bold">
                    {item.currency}
                  </span>
                </div>
                <div className="flex flex-col whitespace-nowrap text-gray-800 dark:text-gray-200">
                  <span>{dayStr}</span>
                  <span className="text-gray-400 dark:text-zinc-500">{timeStr} GMT</span>
                </div>
                <div className="font-medium">
                  {item.transactionType === "Buy" ? (
                    <span className="text-red-600 dark:text-red-400">Buy</span>
                  ) : (
                    <span className="text-green-700 dark:text-green-400">Sell</span>
                  )}
                </div>
                <div className={`text-right font-medium ${item.creditDebit >= 0 ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {cdSign}{cdValue}
                </div>
                <div className="text-right font-medium text-gray-900 dark:text-white">{item.balance}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
