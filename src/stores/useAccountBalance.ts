import { create } from "zustand";

interface AccountBalanceState {
  balance: number;
  currency: string;
  id: string;
  setBalance: (balance: number, currency?: string, id?: string) => void;
}

export const useAccountBalance = create<AccountBalanceState>((set) => ({
  balance: 0,
  currency: "USD",
  id: "",
  setBalance: (balance, currency, id) =>
    set((state) => ({
      balance,
      currency: currency ?? state.currency,
      id: id ?? state.id,
    })),
}));
