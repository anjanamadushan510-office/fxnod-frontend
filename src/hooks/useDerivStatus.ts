"use client";

import { useQuery } from "@tanstack/react-query";
import {
  derivAccountStatus,
  getDerivAccountStatusQueryKey,
} from "@/services/api/endpoints/trading/trading";

export interface DerivStatus {
  /** True once the user has a linked Deriv account. */
  linked: boolean;
  /** Linked loginid, e.g. CR123456 (undefined when unlinked). */
  accountId: string | undefined;
  /** Whether the linked account is virtual (Demo) */
  isVirtual: boolean;
  /** Currency of the linked account (undefined when unlinked). */
  currency: string | undefined;
  /** Which Deriv login the selected account belongs to. */
  connectionId: string | undefined;
  /**
   * The account is still linked, but the Deriv grant behind it has expired and
   * trading it needs a fresh authorisation.
   *
   * Decided by the SERVER, never here: Deriv's tokens last about an hour, our
   * clients get no refresh token, and a browser clock is not something to gate
   * real-money trading on. `linked` deliberately stays true — the account IS
   * linked. Treating the two as one thing is what used to leave a "Connected"
   * badge up for days after the token had died.
   */
  needsReconnect: boolean;
  /** Status query still in flight (avoid flashing the "not linked" gate). */
  isLoading: boolean;
}

/** React Query key shared by the status query + its invalidations. */
export const derivStatusKey = getDerivAccountStatusQueryKey();

/**
 * Single source of truth for "is a Deriv account linked?".
 *
 * Wraps the Orval-generated `derivAccountStatus` GET (→ shared axios, so it
 * honours NEXT_PUBLIC_API_URL + auth). Consumed by both the TopBar connect
 * control and the order panels' trade gate, so the cache is shared — linking
 * in the callback invalidates this one key and both update.
 */
export function useDerivStatus(): DerivStatus {
  const query = useQuery({
    queryKey: derivStatusKey,
    queryFn: () => derivAccountStatus(),
    staleTime: 60_000,
    // 401 (logged out) / unlinked both just mean "show Connect / gate trading".
    retry: false,
  });

  return {
    linked: query.data?.linked ?? false,
    accountId: query.data?.deriv_account_id,
    isVirtual: query.data?.is_virtual ?? false,
    currency: query.data?.currency,
    connectionId: query.data?.connection_id,
    needsReconnect: query.data?.needs_reconnect ?? false,
    isLoading: query.isLoading,
  };
}
