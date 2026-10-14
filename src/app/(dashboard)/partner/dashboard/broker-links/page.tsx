"use client";

import { useEffect, useState } from "react";
import { Link2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useBrokerLinks, useSaveBrokerLink, type Broker, type BrokerLink } from "@/services/brokerAffiliates";
import { parseApiError } from "@/lib/apiError";

const BROKERS: { id: Broker; name: string; placeholder: string; future?: boolean }[] = [
  { id: "deriv", name: "Deriv", placeholder: "https://t.deriv.link?t=YOUR_CODE" },
  { id: "binance", name: "Binance", placeholder: "https://www.binance.com/…", future: true },
  { id: "bybit", name: "Bybit", placeholder: "https://www.bybit.com/…", future: true },
];
export default function BrokerLinksPage() {
  const query = useBrokerLinks();
  return <section className="space-y-6 p-4 lg:p-8">
    <header><h1 className="font-display text-2xl font-semibold text-ink">Broker affiliate links</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">Add your own broker signup links. People who joined FXNOD through your invite link will use these links when they need a new broker account.</p></header>
    <div className="rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed text-ink-2">Your links apply to your direct referrals. If you leave a link empty, FXNOD’s configured link is used. These settings do not change your FXNOD invite code or accounts already created with a broker.</div>
    {query.isPending && <p role="status" className="text-sm text-ink-3">Loading your links…</p>}
    {query.isError && <button onClick={() => void query.refetch()} className="rounded-lg border border-line px-4 py-3 text-sm text-ink">Could not load links · Retry</button>}
    {query.isSuccess && <div className="grid gap-5 xl:grid-cols-3">{BROKERS.map((broker) => <BrokerCard key={broker.id} broker={broker} saved={query.data.find((l) => l.broker === broker.id)} />)}</div>}
  </section>;
}
function BrokerCard({ broker, saved }: { broker: typeof BROKERS[number]; saved: BrokerLink | undefined }) {
  const [url, setUrl] = useState(saved?.url ?? "");
  const [error, setError] = useState("");
  const save = useSaveBrokerLink();
  useEffect(() => { setUrl(saved?.url ?? ""); }, [saved?.url]);
  const changed = url.trim() !== (saved?.url ?? "");
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    try { await save.mutateAsync({ broker: broker.id, url: url.trim() || null }); toast.success(`${broker.name} affiliate link saved`); }
    catch (err) { setError(parseApiError(err, "Could not save the link. Please try again.").message); }
  }
  return <form onSubmit={submit} className="flex flex-col rounded-2xl border border-line bg-surface p-5">
    <div className="flex items-center gap-3"><span className="rounded-xl bg-surface-2 p-2 text-gold"><Link2 size={20} /></span><h2 className="font-display text-lg font-semibold text-ink">{broker.name}</h2></div>
    <p className="mt-3 min-h-12 text-xs leading-relaxed text-ink-3">{broker.future ? "Save now for future tools. No signup buttons for this broker are shown in the trading tools yet." : "Used by your direct referrals when they create a Deriv account from FXNOD."}</p>
    <label className="mt-4 block text-xs text-ink-2">{broker.name} affiliate signup URL<input type="url" value={url} onChange={(e) => { setUrl(e.target.value); setError(""); }} maxLength={2048} placeholder={broker.placeholder} aria-invalid={Boolean(error)} className="mt-2 h-11 w-full rounded-lg border border-line bg-bg px-3 text-sm text-ink outline-none focus:border-action-line" /></label>
    <p className="mt-2 text-[11px] text-ink-3">Use your official HTTPS broker affiliate link.</p>
    {error && <p role="alert" className="mt-3 text-xs text-negative-soft">{error}</p>}
    <p className="my-4 flex items-center gap-2 text-xs text-ink-3">{saved?.url ? <><CheckCircle2 size={14} className="text-positive" />Your affiliate link is active</> : saved?.platform_fallback_available ? "Using FXNOD’s default link" : "No default link configured yet"}</p>
    <button disabled={!changed || save.isPending} className="mt-auto h-10 rounded-lg bg-action text-sm font-medium text-action-ink disabled:opacity-40">{save.isPending ? "Saving…" : "Save link"}</button>
    {url && <button type="button" onClick={() => setUrl("")} disabled={save.isPending} className="mt-3 text-xs text-ink-3 underline">Clear link · save to use default</button>}
  </form>;
}
