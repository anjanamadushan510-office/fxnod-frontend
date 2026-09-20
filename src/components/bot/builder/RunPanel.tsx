"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { useDerivStatus, type DerivStatus } from "@/hooks/useDerivStatus";
import {
  useDerivListAccounts,
  useDerivSelectAccount,
} from "@/services/api/endpoints/trading/trading";
import type { DerivLinkedAccount } from "@/services/api/model";

interface RunPanelProps {
  /** False while the draft has problems; both actions wait for them. */
  ready: boolean;
  saving: boolean;
  starting: boolean;
  saved: boolean;
  onSave: () => void;
  onRun: (riskAcknowledged: boolean) => void;
}

/**
 * Save and run.
 *
 * Which account a bot trades is decided by the server from the Deriv account
 * the user has selected — never by this page. So the panel shows that account,
 * lets the user switch it, and labels the run button by what will actually
 * happen: practice on demo, or real money.
 *
 * Real money needs a deliberate tick. The engine refuses a real-money run
 * without `risk_acknowledged`, and the box is the only thing that sets it — it
 * starts unticked and resets whenever the account changes.
 */
export function RunPanel({ ready, saving, starting, saved, onSave, onRun }: RunPanelProps) {
  const deriv = useDerivStatus();
  const [acknowledged, setAcknowledged] = useState(false);
  const [lastAccount, setLastAccount] = useState(deriv.accountId);
  if (lastAccount !== deriv.accountId) {
    setLastAccount(deriv.accountId);
    setAcknowledged(false);
  }

  const busy = saving || starting;
  const real = deriv.linked && !deriv.isVirtual;
  const canRun = ready && deriv.linked && !busy && (!real || acknowledged);

  return (
    <div className="bg-panel border border-line rounded-2xl p-5 sm:p-6 space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-ink mb-1 tracking-wide">NEXT</h3>
        <p className="text-xs text-ink-2 leading-relaxed">
          Save it to your account, then practise on demo or run it with real money.
          A running bot keeps going when you close this page.
        </p>
      </div>

      <AccountSection />

      {real && (
        <label className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-900 dark:text-amber-100">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-amber-400"
          />
          <span>
            I understand this bot trades <strong>real money</strong> on its own and can
            lose up to its loss cap, and that past results do not predict future ones.
          </span>
        </label>
      )}

      <div className="space-y-3">
        <button
          type="button"
          disabled={!canRun}
          onClick={() => onRun(real && acknowledged)}
          className={cn(
            "w-full h-11 rounded-lg text-sm font-medium transition disabled:opacity-45 disabled:cursor-not-allowed",
            real ? "bg-amber-400 text-black hover:bg-amber-300" : "bg-ink text-surface hover:opacity-80",
          )}
        >
          {starting
            ? "Starting…"
            : real
              ? "Save and run with real money"
              : "Save and practise on demo"}
        </button>
        <button
          type="button"
          disabled={!ready || busy}
          onClick={onSave}
          className="w-full h-11 rounded-lg border border-line text-sm text-ink-3 hover:text-ink transition disabled:opacity-45 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : saved ? "Save changes" : "Save only"}
        </button>
      </div>
    </div>
  );
}

function AccountSection() {
  const deriv = useDerivStatus();
  const queryClient = useQueryClient();
  const accountsQuery = useDerivListAccounts({ query: { enabled: deriv.linked } });
  const selectMutation = useDerivSelectAccount();
  const [pending, setPending] = useState<DerivLinkedAccount | null>(null);

  if (deriv.isLoading) {
    return <p className="text-xs text-ink-3">Checking your Deriv account…</p>;
  }

  if (!deriv.linked) {
    return (
      <div className="rounded-xl border border-line p-3 text-xs text-ink-2 leading-relaxed">
        You need an active Deriv connection to run this bot.
        <Link href={"/options/dtrader" as Route} className="text-ink underline underline-offset-2">
          connect one in dTrader
        </Link>
        , then come back.
      </div>
    );
  }

  const accounts = accountsQuery.data?.accounts ?? [];

  async function select(account: DerivLinkedAccount) {
    try {
      await selectMutation.mutateAsync({
        data: { deriv_account_id: account.deriv_account_id },
      });
      setPending(null);
      // Balance, positions and runs are all per-account; re-read everything.
      await queryClient.invalidateQueries();
      toast.success(account.is_virtual ? "Switched to demo" : "Switched to real money");
    } catch {
      toast.error("Could not switch account. Please try again.");
    }
  }

  return (
    <div>
      <span className="text-xs text-ink-3 mb-2 block">Trades on</span>
      <div className="space-y-2">
        {(accounts.length > 0 ? accounts : fallbackAccounts(deriv)).map((account) => (
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
              "w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs transition",
              account.is_selected ? "border-ink text-ink" : "border-line text-ink-2 hover:border-ink-3",
            )}
          >
            <span className="font-mono">{account.deriv_account_id}</span>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                account.is_virtual ? "bg-surface-2 text-ink" : "bg-amber-400 text-black",
              )}
            >
              {account.is_virtual ? "Demo" : "Real"}
            </span>
          </button>
        ))}
      </div>

      {pending && (
        <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-100">
          <p className="mb-2">
            Switch to <span className="font-mono">{pending.deriv_account_id}</span>? Bots and
            trades will use real money.
          </p>
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
