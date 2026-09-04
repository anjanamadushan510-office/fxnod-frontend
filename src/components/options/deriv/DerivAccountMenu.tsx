"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CaretDownIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { derivStatusKey, useDerivStatus } from "@/hooks/useDerivStatus";
import {
  getDerivListAccountsQueryKey,
  useDerivListAccounts,
  useDerivSelectAccount,
  useDerivUnlink,
} from "@/services/api/endpoints/trading/trading";
import type { DerivLinkedAccount } from "@/services/api/model";

/**
 * The linked-account control: which Deriv account is being traded, how to
 * switch, and how to disconnect.
 *
 * All three were missing. A linked account rendered as a static label, so
 * there was no way to sign out of Deriv from inside FXNod at all — the only
 * exit was to clear the session somewhere else — and switching between demo
 * and real meant going through the whole OAuth flow again.
 *
 * Both are now the same thing. One Deriv grant covers a user's whole account
 * set, so the accounts are already linked; choosing between them is a request,
 * not a re-authorisation.
 *
 * The demo/real distinction is deliberately loud. Confusing the two is the
 * expensive mistake on this screen, so real money is labelled in the trigger,
 * in the list, and again in the confirmation when switching onto it.
 */
export function DerivAccountMenu() {
  const queryClient = useQueryClient();
  const { accountId, isVirtual } = useDerivStatus();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Only fetched once the menu is opened: most sessions never switch account,
  // and this is on the trading screen's critical path.
  const accountsQuery = useDerivListAccounts({ query: { enabled: open } });
  const selectMutation = useDerivSelectAccount();
  const unlinkMutation = useDerivUnlink();

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

  /** Everything that depends on which account is live has to re-read. */
  const refreshEverything = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: derivStatusKey });
    await queryClient.invalidateQueries({
      queryKey: getDerivListAccountsQueryKey(),
    });
    // Balance, positions and bot runs are all per-account. Rather than name
    // each one and miss the next, drop everything and let the screen re-read.
    await queryClient.invalidateQueries();
  }, [queryClient]);

  async function switchTo(account: DerivLinkedAccount) {
    if (account.is_selected) {
      setOpen(false);
      return;
    }
    // Moving ONTO real money is the one direction worth a confirmation. Going
    // the other way is always safe, so it is never interrupted.
    if (!account.is_virtual) {
      const ok = window.confirm(
        `Switch to ${account.deriv_account_id}? This is a real-money account — ` +
          `trades and bots will use real funds.`,
      );
      if (!ok) return;
    }
    try {
      await selectMutation.mutateAsync({
        data: { deriv_account_id: account.deriv_account_id },
      });
      await refreshEverything();
      setOpen(false);
      toast.success(
        account.is_virtual
          ? `Switched to demo (${account.deriv_account_id})`
          : `Switched to real money (${account.deriv_account_id})`,
      );
    } catch {
      toast.error("Could not switch account. Please try again.");
    }
  }

  async function disconnect() {
    const ok = window.confirm(
      "Disconnect Deriv? Running bots will stop, and you will need to " +
        "reconnect before trading again.",
    );
    if (!ok) return;
    try {
      await unlinkMutation.mutateAsync();
      await refreshEverything();
      setOpen(false);
      toast.success("Deriv disconnected");
    } catch {
      toast.error("Could not disconnect. Please try again.");
    }
  }

  const accounts = accountsQuery.data?.accounts ?? [];
  const busy = selectMutation.isPending || unlinkMutation.isPending;

  return (
    <div ref={rootRef} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-[10px] px-3 py-1.5 transition-colors",
          "hover:bg-opt-bg-sunk",
        )}
        title={`Deriv account ${accountId ?? ""}`}
      >
        <AccountBadge isVirtual={isVirtual} />
        <span className="font-mono text-[12px] font-semibold text-opt-ink-2">
          {accountId}
        </span>
        <CaretDownIcon className="h-3 w-3 text-opt-ink-3" />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 top-[calc(100%+6px)] z-50 w-72 overflow-hidden",
            "rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev shadow-lg",
          )}
        >
          <p className="m-0 border-b border-opt-line px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-opt-ink-3">
            Deriv accounts
          </p>

          {accountsQuery.isPending && (
            <p className="m-0 px-3 py-4 text-center text-[11px] text-opt-ink-3">
              Loading…
            </p>
          )}

          {accountsQuery.isError && (
            <p className="m-0 px-3 py-4 text-center text-[11px] text-opt-fall">
              Could not load your accounts.
            </p>
          )}

          {accounts.map((account) => (
            <button
              key={account.deriv_account_id}
              type="button"
              role="menuitem"
              disabled={busy}
              onClick={() => switchTo(account)}
              className={cn(
                "flex w-full items-center gap-2 border-b border-opt-line px-3 py-2.5 text-left",
                "transition-colors hover:bg-opt-bg-sunk disabled:opacity-50",
                account.is_selected && "bg-opt-bg-sunk",
              )}
            >
              <AccountBadge isVirtual={account.is_virtual} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-[12px] font-semibold text-opt-ink">
                  {account.deriv_account_id}
                </span>
                <span className="block text-[10px] text-opt-ink-3">
                  {account.currency}
                </span>
              </span>
              {account.is_selected && (
                <span className="text-[10px] font-bold text-opt-rise">
                  Active
                </span>
              )}
            </button>
          ))}

          <button
            type="button"
            role="menuitem"
            disabled={busy}
            onClick={disconnect}
            className={cn(
              "w-full px-3 py-2.5 text-left text-[12px] font-semibold",
              "text-opt-fall transition-colors hover:bg-opt-bg-sunk disabled:opacity-50",
            )}
          >
            Disconnect Deriv
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Demo and real are never told apart by colour alone — the word is there too,
 * because someone who cannot distinguish the two colours must not be one
 * glance away from trading real money.
 */
function AccountBadge({ isVirtual }: { isVirtual: boolean }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide",
        isVirtual
          ? "bg-opt-ink-4/20 text-opt-ink-2"
          : "bg-opt-rise-soft text-opt-rise",
      )}
    >
      {isVirtual ? "Demo" : "Real"}
    </span>
  );
}
