"use client";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  TicketPercent,
  X,
} from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import {
  commerce,
  commerceError,
  money,
  term,
  type Catalog,
  type Offer,
  type Quote,
} from "@/services/commerce";
import { getGetWalletBalanceQueryKey } from "@/services/api/endpoints/wallet/wallet";
import { cn } from "@/lib/cn";

export function PlanDialog({
  catalog,
  toolId,
  bundleId,
  onClose,
}: {
  catalog: Catalog;
  toolId?: string;
  bundleId?: string;
  onClose: () => void;
}) {
  const client = useQueryClient();
  const offers = catalog.offers.filter((o) =>
    bundleId
      ? o.id === bundleId
      : o.tier_ids.some(
          (id) => catalog.tiers.find((t) => t.id === id)?.tool_id === toolId,
        ),
  );
  const [selected, setSelected] = useState<Offer | undefined>(offers[0]);
  const [coupon, setCoupon] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    if (!quote) return;
    const update = () => setExpired(Date.now() >= Date.parse(quote.expires_at));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [quote]);
  async function review() {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      setQuote(await commerce.quote(selected.id, coupon.trim()));
    } catch (e) {
      setError(commerceError(e));
    } finally {
      setBusy(false);
    }
  }
  async function pay() {
    if (!quote || busy || expired) return;
    setBusy(true);
    setError("");
    try {
      await commerce.checkout(quote.id);
      setSuccess(true);
      await Promise.all([
        client.invalidateQueries({ queryKey: ["commerce"] }),
        client.invalidateQueries({ queryKey: ["commerce-orders"] }),
        client.invalidateQueries({ queryKey: getGetWalletBalanceQueryKey() }),
      ]);
    } catch (e) {
      setError(commerceError(e));
    } finally {
      setBusy(false);
    }
  }
  const title = bundleId
    ? selected?.name
    : `${catalog.tools.find((t) => t.id === toolId)?.name ?? "Tool"} plans`;
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-2xl sm:p-8">
          <Dialog.Close
            disabled={busy}
            aria-label="Close plans"
            className="absolute right-5 top-5 rounded-lg p-2 text-ink-3 hover:bg-surface-2"
          >
            <X className="h-5 w-5" />
          </Dialog.Close>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.2em] text-ink-3">
            FXNOD MEMBERSHIP
          </p>
          <Dialog.Title className="pr-8 text-2xl font-semibold text-ink">
            {success
              ? "Your tools are ready"
              : quote
                ? "Review your purchase"
                : title}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-6 text-ink-2">
            {success
              ? "Your plan has been activated on your account."
              : "One payment from your FXNOD Wallet. No automatic renewals."}
          </Dialog.Description>
          {success ? (
            <div className="mt-8 space-y-5">
              <ShieldCheck className="h-12 w-12 text-emerald-400" />
              <Link
                href={"/subscriptions" as Route}
                onClick={onClose}
                className="flex h-11 items-center justify-center rounded-xl bg-ink font-medium text-bg"
              >
                Go to Active Tools
              </Link>
            </div>
          ) : (
            <>
              {!quote ? (
                <>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {offers.map((offer) => (
                      <button
                        key={offer.id}
                        onClick={() => {
                          setSelected(offer);
                          setError("");
                        }}
                        className={cn(
                          "relative rounded-xl border p-4 text-left transition",
                          selected?.id === offer.id
                            ? "border-ink bg-surface-2 ring-1 ring-ink"
                            : "border-line hover:border-ink-3",
                        )}
                        aria-pressed={selected?.id === offer.id}
                      >
                        {offer.featured && (
                          <span className="mb-2 inline-flex rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                            RECOMMENDED
                          </span>
                        )}
                        <span className="block text-sm font-semibold text-ink">
                          {offer.name}
                        </span>
                        <span className="mt-1 block text-xs text-ink-3">
                          {term(offer)}
                        </span>
                        <span className="mt-4 block text-xl font-semibold text-ink">
                          {money(offer.price, catalog.currency)}
                        </span>
                        {offer.compare_at && (
                          <span className="text-xs text-ink-3 line-through">
                            {money(offer.compare_at, catalog.currency)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {selected && (
                    <div className="mt-5 rounded-xl bg-bg p-4">
                      <p className="text-sm text-ink-2">
                        {selected.description}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {selected.tier_ids.map((id) => {
                          const tier = catalog.tiers.find((t) => t.id === id);
                          return (
                            tier && (
                              <li key={id} className="text-sm text-ink">
                                <strong>
                                  {
                                    catalog.tools.find(
                                      (t) => t.id === tier.tool_id,
                                    )?.name
                                  }{" "}
                                  · {tier.name}
                                </strong>
                                <ul className="mt-2 space-y-1">
                                  {tier.features.map((f) => (
                                    <li
                                      key={f}
                                      className="flex gap-2 text-ink-2"
                                    >
                                      <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                                      {f}
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            )
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  <label className="mt-5 block text-xs font-medium text-ink-2">
                    Coupon code (optional)
                    <div className="mt-2 flex items-center rounded-xl border border-line px-3">
                      <TicketPercent className="h-4 w-4 text-ink-3" />
                      <input
                        value={coupon}
                        onChange={(e) =>
                          setCoupon(e.target.value.toUpperCase())
                        }
                        maxLength={40}
                        placeholder="Enter code"
                        className="h-11 w-full bg-transparent px-3 text-sm text-ink outline-none"
                      />
                    </div>
                  </label>
                  <p className="mt-4 text-xs leading-5 text-ink-3">
                    Renewals keep your remaining time. Upgrades start
                    immediately at the full offer price; unused time on another
                    tier is not credited. Bundle access applies to every
                    included tool.
                  </p>
                  <button
                    disabled={!selected || busy}
                    onClick={review}
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink font-medium text-bg disabled:opacity-50"
                  >
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}Review
                    purchase
                  </button>
                  {!offers.length && (
                    <p className="mt-3 text-sm text-ink-3">
                      No paid offers are available for this tool yet.
                    </p>
                  )}
                </>
              ) : (
                <div className="mt-6 space-y-4">
                  <button
                    disabled={busy}
                    onClick={() => {
                      setQuote(null);
                      setError("");
                    }}
                    className="flex items-center gap-1 text-sm text-ink-3"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Change plan
                  </button>
                  <div className="rounded-xl border border-line p-5">
                    <p className="font-semibold">{selected?.name}</p>
                    <p className="mt-1 text-sm text-ink-3">
                      {selected && term(selected)}
                    </p>
                    <dl className="mt-5 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <dt>Subtotal</dt>
                        <dd>{money(quote.subtotal, quote.currency)}</dd>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <dt>
                          Discount{" "}
                          {quote.coupon_code && `(${quote.coupon_code})`}
                        </dt>
                        <dd>−{money(quote.discount, quote.currency)}</dd>
                      </div>
                      <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold">
                        <dt>Total today</dt>
                        <dd>{money(quote.total, quote.currency)}</dd>
                      </div>
                    </dl>
                  </div>
                  <p className="text-xs text-ink-3">
                    {expired
                      ? "Quote expired. Go back to refresh the price."
                      : "This quote is valid for 10 minutes. Payment is taken only when you confirm."}
                  </p>
                  <button
                    disabled={busy || expired}
                    onClick={pay}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink font-semibold text-bg disabled:opacity-50"
                  >
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                    {busy
                      ? "Processing…"
                      : `Confirm · ${money(quote.total, quote.currency)}`}
                  </button>
                  <Link
                    href={"/wallet" as Route}
                    className="block text-center text-sm text-ink-2 underline"
                  >
                    Add funds to wallet
                  </Link>
                </div>
              )}
              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg bg-red-400/10 p-3 text-sm text-red-400"
                >
                  {error}
                </p>
              )}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
