import { create } from "zustand";

interface BalanceEntry {
  balance: number;
  currency: string;
  updatedAt: number;
}
interface AccountBalanceState {
  balance: number | null;
  currency: string;
  id: string;
  ownerId: string | null;
  balances: Record<string, BalanceEntry>;
  setOwner: (ownerId: string | null) => void;
  selectAccount: (id: string, currency?: string) => void;
  setBalance: (balance: number | string, currency?: string, id?: string, updatedAt?: number) => void;
}

export const useAccountBalance = create<AccountBalanceState>((set) => ({
  balance: null,
  currency: "USD",
  id: "",
  ownerId: null,
  balances: {},
  setOwner: (ownerId) => set((state) => state.ownerId === ownerId ? state : {
    ownerId, id: "", balance: null, currency: "USD", balances: {},
  }),
  selectAccount: (id, currency) => set((state) => ({
    id,
    balance: state.balances[id]?.balance ?? null,
    currency: state.balances[id]?.currency ?? currency ?? "USD",
  })),
  setBalance: (raw, currency, id, updatedAt = Date.now()) => set((state) => {
    if (typeof raw !== "number" && typeof raw !== "string") return state;
    if (typeof raw === "string" && !raw.trim()) return state;
    const balance = Number(raw);
    const accountId = id ?? state.id;
    if (!accountId || !Number.isFinite(balance) || !Number.isFinite(updatedAt)) return state;
    const previous = state.balances[accountId];
    if (previous && previous.updatedAt > updatedAt) return state;
    const entry = { balance, currency: currency ?? previous?.currency ?? state.currency, updatedAt };
    return {
      balances: { ...state.balances, [accountId]: entry },
      ...(accountId === state.id ? { balance: entry.balance, currency: entry.currency } : {}),
    };
  }),
}));
