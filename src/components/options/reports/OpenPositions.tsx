import { Clock } from "lucide-react";

export function OpenPositions() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <Clock className="mb-4 h-16 w-16 text-zinc-500" strokeWidth={1.5} />
      <p className="text-[14px] font-medium text-zinc-400">
        You have no open positions yet.
      </p>
    </div>
  );
}
