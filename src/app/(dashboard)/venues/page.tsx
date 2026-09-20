"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { type Route } from "next";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { parseApiError } from "@/lib/apiError";
import { derivStatusKey, useDerivStatus } from "@/hooks/useDerivStatus";
import { useStartDerivOAuth } from "@/hooks/useStartDerivOAuth";
import {
  getDerivListAccountsQueryKey,
  getDerivListConnectionsQueryKey,
  useDerivDisconnect,
  useDerivListApps,
  useDerivListConnections,
  useDerivSelectAccount,
} from "@/services/api/endpoints/trading/trading";
import type { DerivConnection, DerivLinkedAccount } from "@/services/api/model";

/**
 * /venues — the brokers FXNod trades through, and the accounts you have given
 * it access to.
 *
 * Deriv is the only live one. A user may authorise SEVERAL Deriv logins: each
 * is one grant covering that login's own demo and real accounts, and this is
 * where they are added, switched between and removed. Everything shown comes
 * from the engine; nothing here is a placeholder figure.
 *
 * The honest part of this screen is expiry. Deriv sign-ins last about an hour
 * and our apps are refused a refresh token, so a connection goes stale on its
 * own. The server decides that and says so — the page never compares a
 * timestamp against the browser clock.
 */
export default function VenuesPage() {
  const connectionsQuery = useDerivListConnections();
  const connections = connectionsQuery.data?.connections ?? [];

  return (
    <section className="p-4 lg:p-8 space-y-8">
      <p className="text-sm text-ink-2">
        The brokers FXNod trades through, and the accounts you have given it access to.
      </p>

      <DerivVenueCard connections={connections} isLoading={connectionsQuery.isPending} isError={connectionsQuery.isError} />

      <div>
        <h2 className="font-display text-sm font-semibold text-ink">Coming next</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <PlannedVenue name="Binance" detail="Spot · Futures" />
          <PlannedVenue name="Bybit" detail="Derivatives" />
        </div>
      </div>
    </section>
  );
}

function DerivVenueCard({
  connections,
  isLoading,
  isError,
}: {
  connections: DerivConnection[];
  isLoading: boolean;
  isError: boolean;
}) {
  const { start, redirecting } = useStartDerivOAuth();
  const hasAny = connections.length > 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-lg font-semibold text-ink">
            D
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Deriv</h2>
            <p className="mt-0.5 text-xs text-ink-2">
              Synthetics &middot; Options &middot; Bots
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={"/transfer" as Route}
            className="inline-flex h-10 items-center rounded-lg border border-line px-4 text-sm text-ink-2 transition hover:text-ink"
          >
            Deposit
          </Link>
          <Link
            href={"/tools" as Route}
            className="inline-flex h-10 items-center rounded-lg border border-line px-4 text-sm text-ink-2 transition hover:text-ink"
          >
            Tools
          </Link>
          <button
            type="button"
            onClick={start}
            disabled={redirecting}
            className="inline-flex h-10 items-center rounded-lg bg-ink px-4 text-sm font-medium text-surface transition hover:opacity-80 disabled:opacity-60"
          >
            {redirecting
              ? "Redirecting…"
              : hasAny
                ? "Add another Deriv account"
                : "Connect Deriv"}
          </button>
        </div>
      </header>

      <div className="p-6">
        {isLoading && <p className="text-sm text-ink-3">Loading your Deriv accounts…</p>}

        {isError && (
          <p className="text-sm text-red-400">
            Could not load your Deriv connections. Reload the page to try again.
          </p>
        )}

        {!isLoading && !isError && !hasAny && (
          <div className="rounded-xl border border-dashed border-line px-5 py-8 text-center">
            <p className="text-sm font-medium text-ink">No Deriv account connected</p>
            <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-ink-3">
              Sign in at Deriv and approve FXNod. One approval covers every account on
              that Deriv login — demo and real — so switching between them afterwards
              never sends you back. Trade on more than one Deriv login? Connect each,
              and they all stay.
            </p>
          </div>
        )}

        {!isLoading && !isError && hasAny && (
          <div className="space-y-4">
            {connections.map((connection, index) => (
              <DerivLoginRow key={connection.connection_id} connection={connection} index={index} />
            ))}
          </div>
        )}
      </div>

      <DerivAppApprovals />
    </article>
  );
}

function DerivLoginRow({ connection, index }: { connection: DerivConnection; index: number }) {
  const queryClient = useQueryClient();
  const { start, redirecting } = useStartDerivOAuth();
  const selectMutation = useDerivSelectAccount();
  const disconnectMutation = useDerivDisconnect();
  const [confirmReal, setConfirmReal] = useState<DerivLinkedAccount | null>(null);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  const refresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: derivStatusKey }),
      queryClient.invalidateQueries({ queryKey: getDerivListAccountsQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getDerivListConnectionsQueryKey() }),
    ]);
    // Balance, positions and the trade gate all follow the selected account.
    await queryClient.invalidateQueries();
  }, [queryClient]);

  async function chooseAccount(account: DerivLinkedAccount) {
    if (account.is_selected) return;
    if (!account.is_virtual) {
      setConfirmReal(account);
      return;
    }
    await applyUse(account);
  }

  async function applyUse(account: DerivLinkedAccount) {
    try {
      await selectMutation.mutateAsync({ data: { deriv_account_id: account.deriv_account_id } });
      await refresh();
      setConfirmReal(null);
      toast.success(`Now trading ${account.deriv_account_id}`);
    } catch (err) {
      toast.error(parseApiError(err, "Could not switch account.").message);
    }
  }

  async function disconnect() {
    try {
      await disconnectMutation.mutateAsync({ connectionId: connection.connection_id });
      await refresh();
      setConfirmDisconnect(false);
      toast.success("Deriv login disconnected");
    } catch (err) {
      toast.error(parseApiError(err, "Could not disconnect.").message);
    }
  }

  const busy = selectMutation.isPending || disconnectMutation.isPending;

  return (
    <div className="rounded-xl border border-line bg-surface-2/40">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-medium text-ink">Deriv login {index + 1}</span>
          {connection.needs_reconnect ? (
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 ring-1 ring-inset ring-amber-500/20">
              Session expired
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-400 ring-1 ring-inset ring-green-500/20">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {connection.needs_reconnect && (
            <button
              type="button"
              onClick={start}
              disabled={redirecting}
              className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-surface transition hover:opacity-80 disabled:opacity-60"
            >
              {redirecting ? "Redirecting…" : "Reconnect"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setConfirmDisconnect(true)}
            disabled={busy}
            className="rounded-lg border border-line px-3 py-1.5 text-xs text-ink-3 transition hover:text-ink disabled:opacity-50"
          >
            Disconnect
          </button>
        </div>
      </div>

      {connection.needs_reconnect && (
        <p className="border-b border-line px-4 py-2.5 text-[11px] leading-relaxed text-ink-3">
          Deriv sign-ins last about an hour and cannot be renewed in the background, so
          this one has to be approved again before it can trade. Your accounts and your
          choice of which to trade are kept.
        </p>
      )}

      <ul>
        {connection.accounts.map((account) => (
          <li
            key={account.deriv_account_id}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  account.is_virtual ? "bg-sky-400" : "bg-green-400",
                )}
              />
              <div className="leading-tight">
                <p className="font-mono text-sm font-semibold text-ink">
                  {account.deriv_account_id}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-3">
                  {account.is_virtual ? "Demo · virtual funds" : "Real money"} ·{" "}
                  {account.currency}
                </p>
              </div>
            </div>
            {account.is_selected ? (
              <span className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
                In use
              </span>
            ) : (
              <button
                type="button"
                onClick={() => chooseAccount(account)}
                disabled={busy}
                className="rounded-lg border border-line px-3 py-1.5 text-xs text-ink transition hover:bg-surface disabled:opacity-50"
              >
                Use this account
              </button>
            )}
          </li>
        ))}
      </ul>

      {confirmReal && (
        <ConfirmDialog
          title="Trade this real-money account?"
          body={
            <>
              <strong className="text-ink">{confirmReal.deriv_account_id}</strong> holds real
              funds. Manual trades and any bot you start will use them.
            </>
          }
          confirmLabel={busy ? "Switching…" : "Yes, use it"}
          busy={busy}
          onCancel={() => setConfirmReal(null)}
          onConfirm={() => applyUse(confirmReal)}
        />
      )}

      {confirmDisconnect && (
        <ConfirmDialog
          title="Disconnect this Deriv login?"
          body="FXNod will stop trading its accounts and any bot approval given for them is withdrawn. Running bots on this login will stop. Your other Deriv logins are untouched."
          confirmLabel={busy ? "Disconnecting…" : "Disconnect"}
          busy={busy}
          onCancel={() => setConfirmDisconnect(false)}
          onConfirm={disconnect}
        />
      )}
    </div>
  );
}

/**
 * Which Deriv apps the bots trade through, and whether this user has approved
 * each for the account they are on.
 *
 * Read-only on purpose. Approving an app is a Deriv round-trip that only means
 * something in context, so dBot asks for it at the moment a bot that needs it
 * is started. This is here so the answer to "why did it ask me again?" is
 * visible rather than guessed at.
 */
function DerivAppApprovals() {
  const { linked } = useDerivStatus();
  const appsQuery = useDerivListApps({ query: { enabled: linked } });
  const apps = appsQuery.data?.connections ?? [];

  if (!linked || appsQuery.isPending || appsQuery.isError || apps.length === 0) return null;

  return (
    <div className="border-t border-line px-6 py-5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-3">
        Bot approvals
      </h3>
      <p className="mt-1.5 max-w-2xl text-[12px] leading-relaxed text-ink-3">
        Each bot trades through its own registered Deriv app, so each is approved once,
        for the account you are trading. dBot asks when you start a bot that needs one —
        there is nothing to do here.
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {apps.map((app) => (
          <li
            key={app.app_key}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[11px]",
              app.connected
                ? "border-green-500/20 bg-green-500/10 text-green-400"
                : "border-line bg-surface-2 text-ink-3",
            )}
          >
            <span className="font-mono">{app.app_key}</span>
            <span>{app.connected ? "Approved" : "Not approved"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlannedVenue({ name, detail }: { name: string; detail: string }) {
  return (
    <article className="rounded-2xl border border-dashed border-line bg-surface/50 p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-ink-2">{name}</h3>
        <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-3">
          Planned
        </span>
      </div>
      <p className="mt-1.5 text-xs text-ink-3">{detail}</p>
    </article>
  );
}

function ConfirmDialog({
  title,
  body,
  confirmLabel,
  busy,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: React.ReactNode;
  confirmLabel: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-2xl">
        <h3 className="mb-2 font-display text-base font-semibold text-ink">{title}</h3>
        <p className="mb-6 text-[13px] leading-relaxed text-ink-2">{body}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-line px-4 py-2 text-[13px] font-medium text-ink transition hover:bg-surface-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-lg bg-red-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
