"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, X } from "lucide-react";
import { AccountBadge } from "./pieces";

export function StartReview({
  open,
  onClose,
  onStart,
  busy,
  allowed,
  name,
  accountId,
  balance,
  isVirtual,
  currency,
  markets,
  stake,
  stopLoss,
  takeProfit,
  preset,
  planNote,
  settings,
}: {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
  busy: boolean;
  allowed: boolean;
  name: string;
  accountId?: string;
  balance?: string;
  isVirtual: boolean;
  currency?: string;
  markets: string[];
  stake: string;
  stopLoss: string;
  takeProfit: string;
  preset?: string;
  planNote?: string;
  settings: { title: string; value: string }[];
}) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next && !busy) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%_-_2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-2xl max-h-[90dvh] overflow-y-auto">
          <div className="flex justify-between items-start gap-3">
            <div>
              <Dialog.Title className="text-xl font-semibold text-ink">
                Review your run
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-ink-3">
                Check {name}&rsquo;s account and limits before starting.
              </Dialog.Description>
            </div>
            <button
              type="button"
              aria-label="Close review"
              disabled={busy}
              onClick={onClose}
              className="h-9 w-9 shrink-0 flex items-center justify-center text-ink-3"
            >
              <X size={18} />
            </button>
          </div>
          <div className="rounded-xl border border-line bg-surface-2 p-4 mt-5">
            <div className="flex justify-between items-center gap-2">
              <span className="font-mono text-sm text-ink">
                {accountId ?? "No account selected"}
              </span>
              <AccountBadge isVirtual={isVirtual} />
            </div>
            {balance && (
              <p className="mt-3 text-sm font-semibold text-ink">
                {balance}
              </p>
            )}
            <p className="mt-2 text-xs text-ink-3">
              {isVirtual
                ? "Uses your demo balance."
                : "This run places trades with real money."}
            </p>
          </div>
          {planNote && (
            <p className="mt-4 text-xs text-ink-2 leading-relaxed">
              {planNote}
            </p>
          )}
          <dl className="grid grid-cols-2 gap-4 mt-5 text-sm">
            <div>
              <dt className="text-xs text-ink-3">
                {preset ? "Starting stake" : "Stake per trade"}
              </dt>
              <dd className="mt-1 font-semibold text-ink">
                {stake} {currency}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-3">Stop loss</dt>
              <dd className="mt-1 font-semibold text-ink">
                {stopLoss} {currency}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-3">Take profit</dt>
              <dd className="mt-1 font-semibold text-ink">
                {takeProfit ? `${takeProfit} ${currency ?? ""}` : "No target"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-3">Markets</dt>
              <dd className="mt-1 text-ink break-words">
                {markets.join(", ")}
              </dd>
            </div>
          </dl>
          {settings.length > 0 && (
            <details className="mt-4 text-xs text-ink-2">
              <summary className="cursor-pointer py-2">
                Review strategy settings
              </summary>
              <dl className="space-y-2 mt-2">
                {settings.map((setting) => (
                  <div
                    key={setting.title}
                    className="flex justify-between gap-3"
                  >
                    <dt>{setting.title}</dt>
                    <dd>{setting.value}</dd>
                  </div>
                ))}
              </dl>
            </details>
          )}
          <p className="mt-5 text-xs leading-relaxed text-ink-3">
            The bot keeps running when you leave this page. Stop prevents new
            entries; open trades must still settle. Each new run starts a fresh
            session with these limits.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={onClose}
              className="h-11 rounded-xl border border-line px-4 text-sm text-ink-2"
            >
              Edit setup
            </button>
            <button
              type="button"
              disabled={busy || !allowed}
              onClick={onStart}
              className="flex-1 h-11 rounded-xl bg-ink text-surface text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {busy && <Loader2 size={16} className="animate-spin" />}
              {busy
                ? "Starting your run…"
                : isVirtual
                  ? "Start demo run"
                  : "Start real-money run"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
