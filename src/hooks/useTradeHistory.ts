import { useEffect } from "react";
import { getGetTradeHistoryQueryKey, useGetTradeHistory } from "@/services/api/endpoints/trading/trading";
import { useAuthStore } from "@/stores/authStore";
import { useOpenPositions } from "@/stores/useOpenPositions";

export function useTradeHistory() {
  const userId = useAuthStore((state) => state.user?.id);
  const query = useGetTradeHistory({ query: {
    queryKey: [...getGetTradeHistoryQueryKey(), userId],
    enabled: !!userId,
    staleTime: 5000,
    refetchOnWindowFocus: true,
    // Settlement is persisted asynchronously. Briefly reconcile it while the
    // live closed result remains visible; never poll continuously for external trades.
    refetchInterval: (query) => useOpenPositions.getState().positions.some((position) =>
      position.outcome && position.updatedAt && Date.now() / 1000 - position.updatedAt < 15 &&
      !query.state.data?.some((row) => row.deriv_contract_id === position.contractId && row.outcome)
    ) ? 1000 : false,
  } });
  useEffect(() => {
    for (const row of query.data ?? []) {
      if (row.outcome !== "won" && row.outcome !== "lost") continue;
      const store = useOpenPositions.getState();
      if (!store.positions.some((position) => position.contractId === row.deriv_contract_id && !position.outcome)) continue;
      store.markClosed({
        contract_id: row.deriv_contract_id, status: row.outcome,
        profit: (Number(row.final_payout_amount ?? 0) - Number(row.stake_amount)).toFixed(8),
        bid_price: row.final_payout_amount ?? "0", stake: row.stake_amount,
        entry_spot: row.entry_spot ?? undefined, exit_spot: row.exit_spot ?? undefined,
        currency: row.currency, tick_stream: row.tick_stream ?? undefined,
        updated_at: Math.floor(Date.now() / 1000),
      });
    }
  }, [query.data]);
  return query;
}
