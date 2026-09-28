import { create } from "zustand";

interface AccountBalanceState {
  balance: number;
  currency: string;
  id: string;
  balances: Record<string, { balance: number; currency: string }>;
  setBalance: (balance: number, currency?: string, id?: string) => void;
}

export const useAccountBalance = create<AccountBalanceState>((set) => ({
  balance: 0,
  currency: "USD",
  id: "",
  balances: {},
  setBalance: (balance, currency, id) =>
    set((state) => {
      const newCurrency = currency ?? state.currency;
      const newId = id ?? state.id;
      const newBalances = { ...state.balances };
      if (newId) {
        newBalances[newId] = { balance, currency: newCurrency };
      }
      return {
        balance,
        currency: newCurrency,
        id: newId,
        balances: newBalances,
      };
    }),
}));
