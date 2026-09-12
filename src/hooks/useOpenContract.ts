import { useOpenPositions } from "@/stores/useOpenPositions";

export function useOpenContract(contractId: string | undefined) {
  // Finds the specific active contract from the positions store.
  // We use this so that we don't duplicate WebSocket connections,
  // since the backend /ws/positions endpoint already streams this data.
  const contract = useOpenPositions((state) =>
    state.positions.find((p) => p.contractId === contractId)
  );

  return contract;
}
