import { CalendarIcon, ChevronDownIcon } from "lucide-react";

const MOCK_STATEMENT = [
  {
    id: "44728919293",
    type: "vol_100_1s",
    typeName: "Volatility 100 (1s) Index",
    action: "Sell",
    currency: "USD",
    time: "19 Sep 2026, 10:16:00",
    transactionType: "Sell",
    creditDebit: 10.88,
    balance: 7458.76,
  },
  {
    id: "44728919293",
    type: "vol_100_1s",
    typeName: "Volatility 100 (1s) Index",
    action: "Buy",
    currency: "USD",
    time: "19 Sep 2026, 10:15:00",
    transactionType: "Buy",
    creditDebit: -10.00,
    balance: 7447.88,
  },
  {
    id: "44728919280",
    type: "vol_50_1s",
    typeName: "Volatility 50 (1s) Index",
    action: "Buy",
    currency: "USD",
    time: "19 Sep 2026, 09:30:15",
    transactionType: "Buy",
    creditDebit: -5.00,
    balance: 7457.88,
  }
];

export function Statement() {
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
        {MOCK_STATEMENT.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-zinc-500">
             No transactions found for this period.
          </div>
        ) : (
          MOCK_STATEMENT.map((item, idx) => (
            <div 
              key={`${item.id}-${item.transactionType}-${idx}`}
              className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr_1.5fr_1.5fr] gap-4 border-b border-gray-800/50 p-4 items-center hover:bg-gray-800/20 transition-colors"
            >
              <div className="flex items-center gap-2 text-white">
                <div className="h-6 w-6 rounded bg-gray-800 flex items-center justify-center text-xs">V</div>
                <div className="flex flex-col">
                  <span className="font-medium text-xs truncate max-w-[150px]">{item.typeName}</span>
                  <span className={item.action === "Buy" ? "text-opt-fall text-[11px]" : "text-opt-rise text-[11px]"}>{item.action}</span>
                </div>
              </div>
              <div className="text-zinc-300">{item.id}</div>
              <div className="text-zinc-300">{item.currency}</div>
              <div className="text-zinc-300 whitespace-nowrap">{item.time}</div>
              <div className="font-medium">
                {item.transactionType === "Buy" ? (
                  <span className="text-opt-fall">Buy</span>
                ) : (
                  <span className="text-opt-rise">Sell</span>
                )}
              </div>
              <div className={`text-right font-medium ${item.creditDebit >= 0 ? "text-opt-rise" : "text-opt-fall"}`}>
                {item.creditDebit > 0 ? "+" : ""}{item.creditDebit.toFixed(2)}
              </div>
              <div className="text-right font-medium text-white">{item.balance.toFixed(2)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
