"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { type Route } from "next";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CaretDownIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { parseApiError } from "@/lib/apiError";
import { derivStatusKey, useDerivStatus } from "@/hooks/useDerivStatus";
import { useStartDerivOAuth } from "@/hooks/useStartDerivOAuth";
import {
  getDerivListAccountsQueryKey,
  getDerivListConnectionsQueryKey,
  useDerivDisconnect,
  useDerivListAccounts,
  useDerivSelectAccount,
} from "@/services/api/endpoints/trading/trading";
import type { DerivLinkedAccount } from "@/services/api/model";

/**
 * Top-right Deriv control: connect, switch account, add another Deriv login.
 *
 * dTrader has had one in its own top bar for a while; dBot had nothing, so
 * starting a bot was the first place anyone discovered their account was not
 * connected. This is the dashboard-palette version, self-contained so it can
 * sit on any page in the (dashboard) group.
 *
 * Everything it shows comes from the engine. In particular "needs reconnect"
 * is the server's answer, not a comparison against the browser clock: Deriv
 * grants last about an hour and our clients are issued no refresh token, so a
 * connected-looking badge that is an hour stale is the whole problem this
 * control exists to avoid.
 */
export function DerivConnectionMenu() {
  const { linked, accountId, isVirtual, needsReconnect, isLoading } = useDerivStatus();
  const { start, redirecting } = useStartDerivOAuth();

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const accountsQuery = useDerivListAccounts({ query: { enabled: open && linked } });
  const selectMutation = useDerivSelectAccount();
  const disconnectMutation = useDerivDisconnect();
  const [confirmReal, setConfirmReal] = useState<DerivLinkedAccount | null>(null);
  const [confirmDisconnect, setConfirmDisconnect] = useState<string | null>(null);

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

  const refresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: derivStatusKey }),
      queryClient.invalidateQueries({ queryKey: getDerivListAccountsQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getDerivListConnectionsQueryKey() }),
    ]);
  }, [queryClient]);

  const accounts = useMemo(() => accountsQuery.data?.accounts ?? [], [accountsQuery.data]);
  // The server returns accounts ordered by the grant they came from, so
  // grouping in encounter order numbers the logins the same way every render.
  const logins = useMemo(() => groupByConnection(accounts), [accounts]);

  async function switchTo(account: DerivLinkedAccount) {
    if (account.is_selected) {
      setOpen(false);
      return;
    }
    if (!account.is_virtual) {
      setConfirmReal(account);
      return;
    }
    await applySwitch(account);
  }

  async function applySwitch(account: DerivLinkedAccount) {
    try {
      await selectMutation.mutateAsync({ data: { deriv_account_id: account.deriv_account_id } });
      await refresh();
      // Balances, positions and the trade gate all follow the account.
      await queryClient.invalidateQueries();
      setOpen(false);
      setConfirmReal(null);
      toast.success(
        account.is_virtual
          ? `Switched to demo (${account.deriv_account_id})`
          : `Switched to real money (${account.deriv_account_id})`,
      );
    } catch (err) {
      toast.error(parseApiError(err, "Could not switch account.").message);
    }
  }

  async function disconnect(connectionId: string) {
    try {
      await disconnectMutation.mutateAsync({ connectionId });
      await refresh();
      await queryClient.invalidateQueries();
      setConfirmDisconnect(null);
      setOpen(false);
      toast.success("Deriv login disconnected");
    } catch (err) {
      toast.error(parseApiError(err, "Could not disconnect.").message);
    }
  }

  if (isLoading) {
    return <div aria-hidden className="h-10 w-36 animate-pulse rounded-lg bg-surface-2" />;
  }

  if (!linked) {
    return (
      <button
        type="button"
        onClick={start}
        disabled={redirecting}
        className="inline-flex h-10 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-medium text-surface transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {redirecting && (
          <span
            aria-hidden
            className="h-3 w-3 animate-spin rounded-full border-2 border-surface/40 border-t-surface"
          />
        )}
        {redirecting ? "Redirecting…" : "Connect Deriv"}
      </button>
    );
  }

  const busy = selectMutation.isPending || disconnectMutation.isPending;

  return (
    <>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm transition",
            needsReconnect
              ? "border-amber-500/40 bg-amber-500/10 text-ink hover:bg-amber-500/15"
              : "border-line bg-surface text-ink hover:bg-surface-2",
          )}
        >
          <AccountTypeDot isVirtual={isVirtual} needsReconnect={needsReconnect} />
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[10px] uppercase tracking-wide text-ink-3">
              {needsReconnect ? "Reconnect needed" : isVirtual ? "Demo" : "Real"}
            </span>
            <span className="font-mono text-xs font-semibold text-ink">{accountId}</span>
          </span>
          <CaretDownIcon className="h-3 w-3 text-ink-3" />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+6px)] z-50 w-80 overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
          >
            {needsReconnect && (
              <div className="border-b border-line bg-amber-500/10 px-4 py-3">
                <p className="text-xs font-semibold text-ink">This Deriv session has expired</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-ink-3">
                  Deriv sign-ins last about an hour and cannot be renewed in the
                  background. Reconnect to keep trading — your account choice is kept.
                </p>
                <button
                  type="button"
                  onClick={start}
                  disabled={redirecting}
                  className="mt-2 inline-flex h-8 items-center rounded-lg bg-ink px-3 text-xs font-medium text-surface transition hover:opacity-80 disabled:opacity-60"
                >
                  {redirecting ? "Redirecting…" : "Reconnect Deriv"}
                </button>
              </div>
            )}

            <div className="max-h-[320px] overflow-y-auto">
              {accountsQuery.isPending && (
                <p className="px-4 py-5 text-center text-[11px] text-ink-3">Loading…</p>
              )}
              {accountsQuery.isError && (
                <p className="px-4 py-5 text-center text-[11px] text-red-400">
                  Could not load your accounts.
                </p>
              )}

              {logins.map((login, index) => (
                <div key={login.connectionId} className="border-b border-line last:border-b-0">
                  <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-3">
                      Deriv login {index + 1}
                      {login.needsReconnect && " · expired"}
                    </span>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirmDisconnect(login.connectionId)}
                      className="text-[10px] text-ink-3 underline-offset-2 transition hover:text-ink hover:underline disabled:opacity-50"
                    >
                      Disconnect
                    </button>
                  </div>
                  {login.accounts.map((account) => (
                    <button
                      key={account.deriv_account_id}
                      type="button"
                      role="menuitem"
                      disabled={busy}
                      onClick={() => switchTo(account)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition disabled:opacity-50",
                        account.is_selected ? "bg-surface-2" : "hover:bg-surface-2",
                      )}
                    >
                      <span className="flex flex-col leading-tight">
                        <span className="font-mono text-xs font-semibold text-ink">
                          {account.deriv_account_id}
                        </span>
                        <span className="text-[11px] text-ink-3">
                          {account.is_virtual ? "Demo" : "Real"} · {account.currency}
                        </span>
                      </span>
                      {account.is_selected && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-3">
                          In use
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="border-t border-line p-2">
              <button
                type="button"
                onClick={start}
                disabled={redirecting}
                className="block w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-ink transition hover:bg-surface-2 disabled:opacity-60"
              >
                + Add another Deriv account
              </button>
              <Link
                href={"/venues" as Route}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-xs text-ink-3 transition hover:bg-surface-2 hover:text-ink"
              >
                Manage connections
              </Link>
            </div>
          </div>
        )}
      </div>

      {confirmReal && (
        <ConfirmDialog
          title="Switch to real money?"
          body={
            <>
              <strong className="text-ink">{confirmReal.deriv_account_id}</strong> is a
              real-money account. Manual trades and any bot you start will use real funds.
            </>
          }
          confirmLabel={busy ? "Switching…" : "Yes, switch to real"}
          tone="danger"
          busy={busy}
          onCancel={() => setConfirmReal(null)}
          onConfirm={() => applySwitch(confirmReal)}
        />
      )}

      {confirmDisconnect && (
        <ConfirmDialog
          title="Disconnect this Deriv login?"
          body="FXNod will stop trading its accounts and any bot approval given for them is withdrawn. Your other Deriv logins stay connected. Running bots on this login will stop."
          confirmLabel={busy ? "Disconnecting…" : "Disconnect"}
          tone="danger"
          busy={busy}
          onCancel={() => setConfirmDisconnect(null)}
          onConfirm={() => disconnect(confirmDisconnect)}
        />
      )}
    </>
  );
}

/** One Deriv login, with the accounts its grant reaches. */
interface DerivLogin {
  connectionId: string;
  needsReconnect: boolean;
  accounts: DerivLinkedAccount[];
}

function groupByConnection(accounts: DerivLinkedAccount[]): DerivLogin[] {
  const out: DerivLogin[] = [];
  const index = new Map<string, number>();
  for (const account of accounts) {
    const at = index.get(account.connection_id);
    if (at === undefined) {
      index.set(account.connection_id, out.length);
      out.push({
        connectionId: account.connection_id,
        needsReconnect: account.needs_reconnect,
        accounts: [account],
      });
      continue;
    }
    out[at].accounts.push(account);
  }
  return out;
}

function AccountTypeDot({
  isVirtual,
  needsReconnect,
}: {
  isVirtual: boolean;
  needsReconnect: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "h-2 w-2 shrink-0 rounded-full",
        needsReconnect ? "bg-amber-400" : isVirtual ? "bg-sky-400" : "bg-green-400",
      )}
    />
  );
}

function ConfirmDialog({
  title,
  body,
  confirmLabel,
  tone,
  busy,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: React.ReactNode;
  confirmLabel: string;
  tone: "danger" | "default";
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
            className={cn(
              "rounded-lg px-4 py-2 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50",
              tone === "danger" ? "bg-red-500" : "bg-ink",
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
