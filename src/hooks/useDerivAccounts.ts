"use client";
import { useDerivStatus } from "./useDerivStatus";
import { useAuthStore } from "@/stores/authStore";
import {
  getDerivListAccountsQueryKey,
  useDerivListAccounts,
} from "@/services/api/endpoints/trading/trading";

/** A current, account-owned balance snapshot shared by setup, menus and dashboard. */
export function useDerivAccounts(enabled = true) {
  const userId = useAuthStore((state) => state.user?.id);
  const deriv = useDerivStatus();
  const params = { refresh: true } as const;
  return useDerivListAccounts(params, {
    query: {
      queryKey: [...getDerivListAccountsQueryKey(params), userId],
      enabled: enabled && !!userId && deriv.linked,
      staleTime: 5000,
      refetchInterval: enabled ? 15_000 : false,
      refetchOnWindowFocus: true,
      retry: false,
    },
  });
}
