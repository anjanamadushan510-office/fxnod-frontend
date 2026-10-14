"use client";
import { useDerivAccounts } from "@/hooks/useDerivAccounts";
import { DerivConnectPrompt } from "@/components/deriv/DerivConnectPrompt";
import { AccountBalance } from "@/components/deriv/AccountBalance";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { useDerivStatus, type DerivStatus } from "@/hooks/useDerivStatus";
import { RunSavedBotDialog } from "../RunSavedBotDialog";
import { useDerivSelectAccount } from "@/services/api/endpoints/trading/trading";
import type { DerivLinkedAccount } from "@/services/api/model";

interface RunPanelProps {
  /** False while the draft has problems; both actions wait for them. */
  ready: boolean;
  saving: boolean;
  starting: boolean;
  saved: boolean;
  onSave: () => void;
  onRun: (account: DerivLinkedAccount, riskAcknowledged: boolean) => void;
}

/** Each start opens a fresh account choice. History scope is never a run default.
 * The shared dialog shows current balances and requires explicit real-money consent.
 */
export function RunPanel({
  ready,
  saving,
  starting,
  saved,
  onSave,
  onRun,
}: RunPanelProps) {
  const [choosing, setChoosing] = useState(false);
  const busy = saving || starting;
  return (
    <div className="bg-panel border border-line rounded-2xl p-5 sm:p-6 space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-ink mb-2">Ready to run?</h3>
        <p className="text-xs text-ink-2 leading-relaxed">Choose a Deriv account and review its balance each time you start a run. The history filter never selects a trading account.</p>
      </div>
      <button type="button" disabled={!ready || busy} onClick={() => setChoosing(true)}
        className="w-full h-11 rounded-lg bg-action text-sm font-medium text-action-ink disabled:opacity-45 disabled:cursor-not-allowed">
        {busy ? "Starting…" : "Save & choose run account"}
      </button>
      <button type="button" disabled={!ready || busy} onClick={onSave}
        className="w-full h-11 rounded-lg border border-line text-sm text-ink-3 hover:text-ink disabled:opacity-45">
        {saving ? "Saving…" : saved ? "Save changes" : "Save only"}
      </button>
      {choosing && <RunSavedBotDialog botName="This bot" busy={busy} onClose={() => { if (!busy) setChoosing(false); }} onConfirm={onRun} />}
    </div>
  );
}

export function AccountSection() {
  const deriv = useDerivStatus();
  const queryClient = useQueryClient();
  const accountsQuery = useDerivAccounts();
  const selectMutation = useDerivSelectAccount();
  const [pending, setPending] = useState<DerivLinkedAccount | null>(null);

  if (deriv.isLoading) {
    return <p className="text-xs text-ink-3">Checking your Deriv account…</p>;
  }

  if (!deriv.linked) return <DerivConnectPrompt compact />;

  const accounts = accountsQuery.data?.accounts ?? [];

  async function select(account: DerivLinkedAccount) {
    try {
      await selectMutation.mutateAsync({
        data: { deriv_account_id: account.deriv_account_id },
      });
      setPending(null);
      // Balance, positions and runs are all per-account; re-read everything.
      await queryClient.invalidateQueries();
      toast.success(
        account.is_virtual ? "Switched to demo" : "Switched to real money",
      );
    } catch {
      toast.error("Could not switch account. Please try again.");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center gap-2 mb-2">
        <span className="text-xs text-ink-3">
          Choose the account this bot will trade
        </span>
      </div>
      {accountsQuery.isError && (
        <p role="alert" className="mb-2 text-xs text-amber-500">
          Balances could not be refreshed. Any figures below are the last
          reported values.
        </p>
      )}
      <div className="space-y-2">
        {(accounts.length > 0 ? accounts : fallbackAccounts(deriv)).map(
          (account) => (
            <button
              key={account.deriv_account_id}
              type="button"
              aria-pressed={account.is_selected}
              disabled={selectMutation.isPending}
              onClick={() => {
                if (account.is_selected) return;
                // Moving onto real money is the one switch worth a second step.
                if (account.is_virtual) void select(account);
                else setPending(account);
              }}
              className={cn(
                "account-choice w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs transition",
                account.is_selected
                  ? "border-ink text-ink"
                  : "border-line text-ink-2 hover:border-ink-3",
              )}
            >
              <span className="min-w-0">
                <span className="block font-mono">
                  {account.deriv_account_id}
                </span>
                <span className="text-[10px] text-ink-3">
                  {account.needs_reconnect
                    ? "Reconnect required"
                    : account.is_selected
                      ? "Selected account"
                      : "Available account"}
                </span>
              </span>
              <AccountBalance account={account} compact showUpdatedAt={false} />
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  account.is_virtual
                    ? "bg-surface-2 text-ink"
                    : "bg-amber-400 text-black",
                )}
              >
                {account.is_virtual ? "Demo" : "Real"}
              </span>
            </button>
          ),
        )}
      </div>

      {pending && (
        <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-100">
          <p className="mb-2">
            Switch to{" "}
            <span className="font-mono">{pending.deriv_account_id}</span>? Bots
            and trades will use real money.
          </p>
          <AccountBalance account={pending} showUpdatedAt={false} />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void select(pending)}
              disabled={selectMutation.isPending}
              className="h-8 px-3 rounded-md bg-amber-400 text-black font-medium disabled:opacity-50"
            >
              Switch to real
            </button>
            <button
              type="button"
              onClick={() => setPending(null)}
              className="h-8 px-3 rounded-md border border-line text-ink-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * What to show while the account list is still loading: the one account the
 * status endpoint has already named.
 *
 * Every field comes from that response — none is invented. An account with no
 * id means nothing is linked, and then there is nothing to offer.
 */
function fallbackAccounts(deriv: DerivStatus): DerivLinkedAccount[] {
  if (!deriv.accountId || !deriv.connectionId) return [];
  return [
    {
      deriv_account_id: deriv.accountId,
      // The status endpoint carries the currency; it is absent only when
      // nothing is linked, which the guard above already covers.
      currency: deriv.currency ?? "",
      is_virtual: deriv.isVirtual,
      is_selected: true,
      connection_id: deriv.connectionId,
      needs_reconnect: deriv.needsReconnect,
    },
  ];
}
