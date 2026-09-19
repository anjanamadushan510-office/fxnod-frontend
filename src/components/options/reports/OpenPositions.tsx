import { Clock } from "lucide-react";
import { useOpenPositions } from "@/stores/useOpenPositions";

export function OpenPositions() {
  const positions = useOpenPositions((s) => s.positions);

  if (positions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <Clock className="mb-4 h-16 w-16 text-zinc-500" strokeWidth={1.5} />
        <p className="text-[14px] font-medium text-zinc-400">
          You have no open positions yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col text-[14px]">
      {/* Table header */}
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr_1.5fr_1fr_1.5fr] gap-4 border-b border-gray-800 bg-[#0e0e0e]/50 p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <div>Type</div>
        <div>Ref. ID</div>
        <div>Currency</div>
        <div>Buy time</div>
        <div className="text-right">Stake</div>
        <div>Current Spot</div>
        <div className="text-right">Contract value</div>
        <div className="text-right">Total profit/loss</div>
      </div>

      {/* Table body */}
      <div className="flex-1 overflow-y-auto">
        {positions.map((pos) => (
          <div 
            key={pos.id} 
            className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr_1.5fr_1fr_1.5fr] gap-4 border-b border-gray-800/50 p-4 items-center hover:bg-gray-800/20 transition-colors"
          >
            <div className="flex items-center gap-2 text-white">
              <div className="h-6 w-6 rounded bg-gray-800 flex items-center justify-center text-xs">V</div>
              <div className="flex flex-col">
                <span className="font-medium text-xs truncate max-w-[150px]">{pos.marketName}</span>
                <span className={pos.side === "rise" || pos.side === "up" ? "text-opt-rise text-[11px]" : "text-opt-fall text-[11px]"}>
                  {pos.side.charAt(0).toUpperCase() + pos.side.slice(1)}
                </span>
              </div>
            </div>
            <div className="text-zinc-300">{pos.contractId ?? pos.id}</div>
            <div className="text-zinc-300">USD</div>
            <div className="text-zinc-300 whitespace-nowrap">
              {pos.startTime ? new Date(pos.startTime * 1000).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "-"}
            </div>
            <div className="text-right text-zinc-300">{pos.stake.toFixed(2)}</div>
            <div className="text-zinc-300 whitespace-nowrap">{pos.currentSpot?.toFixed(2) ?? "-"}</div>
            <div className="text-right text-zinc-300">
              {pos.contractValue > 0 ? pos.contractValue.toFixed(2) : "-"}
            </div>
            <div className={`text-right font-medium ${pos.pnl >= 0 ? "text-opt-rise" : "text-opt-fall"}`}>
              {pos.pnl > 0 ? "+" : ""}{pos.pnl.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
