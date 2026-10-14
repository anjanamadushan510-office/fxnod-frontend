"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDerivAccounts } from "@/hooks/useDerivAccounts";
import { useDerivStatus } from "@/hooks/useDerivStatus";
import { useStartDerivOAuth } from "@/hooks/useStartDerivOAuth";
import { AccountBalance } from "./AccountBalance";
import { CaretDownIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

/** Read-only history scope. Never changes the engine's trading account. */
export function DerivHistoryFilter({ accountId, onChange }: {
  accountId: string | null;
  onChange: (id: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const deriv = useDerivStatus();
  const query = useDerivAccounts();
  const { start, redirecting } = useStartDerivOAuth();
  const accounts = query.data?.accounts ?? [];
  const selected = accounts.find((a) => a.deriv_account_id === accountId);
  useEffect(() => {
    if (!open) return;
    function pointer(e: PointerEvent) { if (!root.current?.contains(e.target as Node)) setOpen(false); }
    function key(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("pointerdown", pointer);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", pointer); document.removeEventListener("keydown", key); };
  }, [open]);
  return <div ref={root} className="relative w-full sm:w-auto">
    <button type="button" aria-label="Deriv balances and bot history filter" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}
      className="inline-flex min-h-11 w-full items-center justify-between gap-4 rounded-xl border border-line bg-surface px-3 py-2 text-left sm:w-auto">
      <span><span className="block text-[10px] uppercase tracking-wider text-ink-3">Bot history filter</span>
        <span className="block text-xs font-semibold text-ink">{accountId ? `${selected?.is_virtual === undefined ? "" : selected.is_virtual ? "Demo · " : "Real · "}${accountId}` : "All Deriv accounts"}</span></span>
      {selected && <AccountBalance account={selected} compact showUpdatedAt={false} />}
      <CaretDownIcon className="h-3 w-3 text-ink-3" />
    </button>
    {open && <div role="menu" aria-label="Filter bot history by Deriv account" className="absolute right-0 top-[calc(100%+6px)] z-50 w-[min(24rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
      <div className="border-b border-line px-4 py-3"><p className="text-sm font-semibold text-ink">Balances & bot history</p><p className="mt-1 text-xs leading-relaxed text-ink-3">Filter the runs shown here. Choose a trading account separately each time you run a bot.</p></div>
      <div className="max-h-80 overflow-y-auto">
        <button role="menuitemradio" aria-checked={!accountId} type="button" onClick={() => { onChange(null); setOpen(false); }} className={cn("w-full px-4 py-3 text-left text-xs text-ink", !accountId ? "bg-surface-2" : "hover:bg-surface-2")}>All Deriv accounts</button>
        {query.isPending && deriv.linked && <p className="px-4 py-3 text-xs text-ink-3">Loading balances…</p>}
        {query.isError && <p role="alert" className="px-4 py-3 text-xs text-negative-soft">Could not update balances. Displayed amounts are the last reported values.</p>}
        {accounts.map((account) => <button key={account.deriv_account_id} type="button" role="menuitemradio" aria-checked={accountId === account.deriv_account_id}
          onClick={() => { onChange(account.deriv_account_id); setOpen(false); }}
          className={cn("flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface-2", accountId === account.deriv_account_id && "bg-surface-2")}>
          <span><span className="block font-mono text-xs font-semibold text-ink">{account.deriv_account_id}</span><span className="text-[11px] text-ink-3">{account.is_virtual ? "Demo" : "Real"} · {account.currency}{account.needs_reconnect ? " · Reconnect required" : ""}</span></span>
          <AccountBalance account={account} compact showUpdatedAt={false} />
          {accountId === account.deriv_account_id && <span className="text-[10px] uppercase text-gold">Viewing</span>}
        </button>)}
        {!deriv.linked && !deriv.isLoading && <button type="button" role="menuitem" onClick={start} disabled={redirecting} className="w-full px-4 py-3 text-left text-xs text-ink">{redirecting ? "Connecting…" : "Connect Deriv to view balances"}</button>}
      </div>
      <Link href="/venues" onClick={() => setOpen(false)} className="block border-t border-line px-4 py-3 text-xs text-ink-3 hover:text-ink">Manage connections</Link>
    </div>}
  </div>;
}
