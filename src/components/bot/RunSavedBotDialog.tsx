"use client";

import { useDerivStatus } from "@/hooks/useDerivStatus";
import { useDerivAccounts } from "@/hooks/useDerivAccounts";
import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/cn";
import { AccountBalance } from "@/components/deriv/AccountBalance";
import type { DerivLinkedAccount } from "@/services/api/model";
import { useToolTradingAccess } from "@/hooks/useToolTradingAccess";

/**
 * The account a saved bot will trade, chosen before the run exists.
 *
 * The engine starts a bot on whichever Deriv account is selected at that
 * moment. This dialog is the confirmation of that choice: nothing starts
 * until the user picks an account and presses the button that names it.
 */
export function RunSavedBotDialog({
  botName,
  busy,
  onClose,
  onConfirm,
}: {
  botName: string;
  busy: boolean;
  onClose: () => void;
  onConfirm: (account: DerivLinkedAccount, riskAcknowledged: boolean) => void;
}) {
  // The balance is read to decide which account to risk, so it is asked of
  // Deriv each time the dialog opens and never kept between openings. The
  // page used to pass in the list it had loaded with the page, whose balances
  // were as old as the last visit to Connected Accounts.
  const deriv = useDerivStatus();
  const accountsQuery = useDerivAccounts();
  const accounts = deriv.linked ? accountsQuery.data?.accounts ?? [] : [];
  const loading = deriv.isLoading || (deriv.linked && accountsQuery.isPending);

  const [chosenId, setChosenId] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const chosen =
    accounts.find((account) => account.deriv_account_id === chosenId) ?? null;
  const real = Boolean(chosen && !chosen.is_virtual);
  const access = useToolTradingAccess("dbot", chosen?.is_virtual ?? true);
  const canConfirm =
    deriv.linked &&
    !loading &&
    !accountsQuery.isError &&
    Boolean(chosen) &&
    !chosen?.needs_reconnect &&
    access.allowed &&
    !busy &&
    (!real || acknowledged);

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="run-saved-bot-title"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl"
      >
        <h2 id="run-saved-bot-title" className="text-lg font-semibold text-ink">
          Run on which Deriv account?
        </h2>
        <p className="mt-2 text-sm text-ink-2 leading-relaxed">
          {botName} does not start until you confirm the account. Demo
          practises. Real uses money.
        </p>

        <div className="mt-5 space-y-2">
          {loading && (
            <p className="text-sm text-ink-3">
              Checking your Deriv accounts and balances…
            </p>
          )}
          {accountsQuery.isError && (
            <p className="text-sm text-ink-2">
              Could not load your Deriv accounts. Close this and try again.
            </p>
          )}
          {!loading && (!deriv.linked || (accountsQuery.isSuccess && accounts.length === 0)) && (
            <p className="text-sm text-ink-2">
              Connect a Deriv account on{" "}
              <Link
                href={"/venues" as Route}
                className="text-ink underline underline-offset-2"
              >
                Connected Accounts
              </Link>{" "}
              before running this bot.
            </p>
          )}
          {accounts.map((account) => {
            const active = account.deriv_account_id === chosenId;
            return (
              <button
                key={account.deriv_account_id}
                type="button"
                aria-pressed={active}
                disabled={busy || account.needs_reconnect}
                onClick={() => {
                  setChosenId(account.deriv_account_id);
                  setAcknowledged(false);
                }}
                className={cn(
                  "account-choice w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition",
                  active
                    ? "border-ink text-ink"
                    : "border-line text-ink-2 hover:border-ink-3",
                  account.needs_reconnect && "opacity-50",
                )}
              >
                <span className="min-w-0">
                  <span className="block font-mono text-sm">
                    {account.deriv_account_id}
                  </span>
                  <span className="block text-xs text-ink-3 mt-0.5">
                    {account.needs_reconnect
                      ? "Reconnect before trading"
                      : "Deriv account"}
                  </span>
                </span>
                <AccountBalance account={account} compact showUpdatedAt={false} />
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shrink-0",
                    account.is_virtual
                      ? "bg-surface-2 text-ink"
                      : "bg-amber-400 text-black",
                  )}
                >
                  {account.is_virtual ? "Demo" : "Real"}
                </span>
              </button>
            );
          })}
        </div>

        {real && (
          <label className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-100">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(event) => setAcknowledged(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-amber-400"
            />
            <span>
              I understand this bot trades real money on its own and can lose up
              to its loss cap.
            </span>
          </label>
        )}

        {chosen && access.message && (
          <p className="mt-4 text-sm text-ink-2" role="status">
            {access.message} <Link href="/tools">View packages</Link>
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!canConfirm}
            onClick={() => chosen && onConfirm(chosen, real && acknowledged)}
            className={cn(
              "h-10 px-5 rounded-lg text-sm font-medium transition disabled:opacity-45 disabled:cursor-not-allowed",
              real
                ? "bg-amber-400 text-black hover:bg-amber-300"
                : "bg-action text-action-ink hover:opacity-80",
            )}
          >
            {busy
              ? "Starting…"
              : chosen
                ? real
                  ? `Run on real ${chosen.deriv_account_id}`
                  : `Run on demo ${chosen.deriv_account_id}`
                : "Choose an account"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="h-10 px-4 rounded-lg text-sm text-ink-2 hover:text-ink disabled:opacity-45"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
