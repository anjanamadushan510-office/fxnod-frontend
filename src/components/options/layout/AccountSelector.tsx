"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CaretDownIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { derivStatusKey, useDerivStatus } from "@/hooks/useDerivStatus";
import {
  getDerivListAccountsQueryKey,
  useDerivListAccounts,
  useDerivSelectAccount,
} from "@/services/api/endpoints/trading/trading";
import type { DerivLinkedAccount } from "@/services/api/model";
import { useAuthStore } from "@/stores/authStore";
import { useAccountBalance } from "@/stores/useAccountBalance";

export type OptionsAccountMode = "real" | "demo";

interface AccountSelectorProps {
  mode: OptionsAccountMode;
  balance: number | null;
  currency?: string;
  onOpen?: () => void;
}

const DERIV_OPEN_REAL_ACCOUNT_URL = "https://app.deriv.com/";

export function AccountSelector({
  currency = "USD",
  onOpen,
}: AccountSelectorProps) {
  const queryClient = useQueryClient();
  const { accountId, isVirtual, linked, currency: selectedCurrency } = useDerivStatus();
  const userId = useAuthStore((state) => state.user?.id);
  
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Read the saved snapshot immediately, without waiting for broker refresh.
  const cachedAccountsQuery = useDerivListAccounts(undefined, { query: {
    enabled: linked && !!userId,
    queryKey: [...getDerivListAccountsQueryKey(), userId],
    staleTime: 0,
  } });
  const accountsQuery = useDerivListAccounts({ refresh: true }, { query: {
    enabled: linked && !!userId,
    queryKey: [...getDerivListAccountsQueryKey({ refresh: true }), userId],
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  } });
  const selectMutation = useDerivSelectAccount();
  const [pendingAccount, setPendingAccount] = useState<DerivLinkedAccount | null>(null);
  
  const balances = useAccountBalance((s) => s.balances);
  const ownerId = useAccountBalance((s) => s.ownerId);
  const selectedBalance = ownerId === userId && accountId ? balances[accountId]?.balance : null;

  useEffect(() => {
    const store = useAccountBalance.getState();
    store.setOwner(userId ?? null);
    store.selectAccount(accountId ?? "", selectedCurrency);
  }, [userId, accountId, selectedCurrency]);

  useEffect(() => {
    if (!userId) return;
    const store = useAccountBalance.getState();
    store.setOwner(userId);
    for (const account of [...(cachedAccountsQuery.data?.accounts ?? []), ...(accountsQuery.data?.accounts ?? [])]) {
      if (account.balance !== undefined) {
        store.setBalance(account.balance, account.currency, account.deriv_account_id,
          account.balance_updated_at ? Date.parse(account.balance_updated_at) : 0);
      }
    }
  }, [cachedAccountsQuery.data, accountsQuery.data, userId]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function executeSwitch(account: DerivLinkedAccount) {
    try {
      const selected = await selectMutation.mutateAsync({
        data: { deriv_account_id: account.deriv_account_id },
      });
      await queryClient.cancelQueries({ queryKey: [...derivStatusKey, userId] });
      // Update the selected account immediately; unrelated requests must not
      // delay the switch or leave the previous account's balance on screen.
      useAccountBalance.getState().selectAccount(account.deriv_account_id, account.currency);
      queryClient.setQueryData([...derivStatusKey, userId], (previous: object | undefined) => ({
        ...previous, ...selected,
      }));
      void queryClient.invalidateQueries({ queryKey: derivStatusKey });
      void queryClient.invalidateQueries({ queryKey: getDerivListAccountsQueryKey() });
      setOpen(false);
      setPendingAccount(null);
      toast.success(
        account.is_virtual
          ? `Switched to demo (${account.deriv_account_id})`
          : `Switched to real money (${account.deriv_account_id})`
      );
    } catch {
      toast.error("Could not switch account. Please try again.");
    }
  }

  async function switchTo(account: DerivLinkedAccount) {
    if (account.deriv_account_id === accountId) {
      setOpen(false);
      return;
    }
    if (!account.is_virtual) {
      setPendingAccount(account);
      return;
    }
    await executeSwitch(account);
  }

  const accounts = accountsQuery.data?.accounts ?? cachedAccountsQuery.data?.accounts ?? [];
  const busy = selectMutation.isPending;
  const hasRealAccount = accounts.some((a) => !a.is_virtual);
  const loaded = accountsQuery.isSuccess || cachedAccountsQuery.isSuccess;

  return (
    <>
      <div ref={rootRef} className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            if (onOpen) onOpen();
            if (linked) {
              if (!open) void accountsQuery.refetch();
              setOpen((v) => !v);
            }
          }}
          aria-haspopup="menu"
          aria-expanded={open}
          className={cn(
            "flex items-center gap-2.5 rounded-[10px] px-3 py-1.5",
            "text-left transition-colors hover:bg-opt-bg-sunk"
          )}
        >
          <div className="flex flex-col leading-tight">
            <span className="flex items-center gap-1 text-[11px] text-opt-ink-3">
              {isVirtual ? "Demo account" : "Real account"}
              <CaretDownIcon className="h-3 w-3" />
            </span>
            <span className="font-mono text-sm font-semibold tabular-nums text-opt-ink">
              {selectedBalance == null ? (linked ? "Updating…" : "—") : selectedBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {selectedCurrency ?? currency}
            </span>
          </div>
        </button>

        {open && linked && (
          <div
            role="menu"
            className={cn(
              "absolute right-0 top-[calc(100%+6px)] z-50 w-[min(18rem,calc(100vw-1rem))] overflow-hidden",
              "rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev shadow-lg"
            )}
          >
            {accountsQuery.isPending && cachedAccountsQuery.isPending && (
              <p className="m-0 px-3 py-4 text-center text-[11px] text-opt-ink-3">
                Loading…
              </p>
            )}

            {accountsQuery.isError && (
              <p className="m-0 px-3 py-4 text-center text-[11px] text-opt-fall">
                Could not load your accounts.
              </p>
            )}

            {accounts.map((account) => {
              const isSelected = account.deriv_account_id === accountId;
              const accountTypeLabel = account.is_virtual ? "Demo account" : "Real account";
              
              const storedBalance = balances[account.deriv_account_id]?.balance;
              const itemBalance = ownerId === userId ? storedBalance : undefined;
              
              const formattedBalance = itemBalance == null ? "Updating…" : itemBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });

              return (
                <button
                  key={account.deriv_account_id}
                  type="button"
                  role="menuitem"
                  disabled={busy}
                  onClick={() => switchTo(account)}
                  className={cn(
                    "flex w-full flex-col gap-0.5 border-b border-opt-line px-4 py-3 text-left transition-colors disabled:opacity-50",
                    isSelected ? "bg-opt-bg-sunk" : "hover:bg-opt-bg-sunk"
                  )}
                >
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {accountTypeLabel}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formattedBalance} {account.currency}
                  </span>
                </button>
              );
            })}

            {loaded && !hasRealAccount && (
              <a
                href={DERIV_OPEN_REAL_ACCOUNT_URL}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                className="block px-3 py-2.5 transition-colors hover:bg-opt-bg-sunk"
              >
                <span className="block text-[12px] font-semibold text-opt-ink">
                  Create a Real account
                </span>
                <span className="block text-[10.5px] leading-snug text-opt-ink-3">
                  You only have a demo account. Real accounts are opened at
                  Deriv — come back and reconnect once yours is ready.
                </span>
              </a>
            )}
          </div>
        )}
      </div>

      {pendingAccount && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-opt-bg-elev p-6 shadow-xl border border-opt-line animate-fade-in">
            <h3 className="mb-2 text-lg font-bold text-opt-ink">Switch to Real Money?</h3>
            <p className="mb-6 text-[13px] leading-relaxed text-opt-ink-2">
              You are switching to <strong className="text-opt-ink">{pendingAccount.deriv_account_id}</strong>.
              This is a real-money account — trades and bots will use real funds.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingAccount(null)}
                className="rounded-lg border border-opt-line px-4 py-2 text-[13px] font-semibold text-opt-ink transition-colors hover:bg-opt-bg-sunk"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeSwitch(pendingAccount)}
                disabled={busy}
                className="rounded-lg bg-opt-fall px-4 py-2 text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Switching..." : "Yes, switch to real"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
