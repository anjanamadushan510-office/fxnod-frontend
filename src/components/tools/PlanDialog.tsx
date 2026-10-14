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
  const initialOffer = offers.find((offer) => offer.months === 1) ?? offers[0];
  const [period, setPeriod] = useState(initialOffer ? term(initialOffer) : "");
  const periods = [...new Set(offers.map(term))];
  const visibleOffers = offers.filter((offer) => term(offer) === period);
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
  async function review(offer = selected) {
    if (!offer || busy) return;
    setSelected(offer);
    setBusy(true);
    setError("");
    try {
      setQuote(await commerce.quote(offer.id, coupon.trim()));
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
        <Dialog.Content
          className={`fixed left-1/2 top-1/2 z-[71] max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] ${quote || success ? "max-w-2xl overflow-y-auto" : "max-w-5xl overflow-hidden flex flex-col"} -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-surface p-4 shadow-2xl sm:p-6`}
        >
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
              <ShieldCheck className="h-12 w-12 text-positive" />
              <Link
                href={"/subscriptions" as Route}
                onClick={onClose}
                className="flex h-11 items-center justify-center rounded-xl bg-action font-medium text-action-ink"
              >
                Go to Active Tools
              </Link>
            </div>
          ) : (
            <>
              {!quote ? (
                <div className="mt-4 flex min-h-0 flex-1 flex-col">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-3">Access period</p>
                  <div
                    className={cn(
                      "grid grid-cols-2 gap-2",
                      periods.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3",
                    )}
                    aria-label="Access period"
                  >
                    {periods.map((value) => (
                      <button
                        key={value}
                        disabled={busy}
                        aria-pressed={period === value}
                        onClick={() => {
                          setPeriod(value);
                          setSelected(
                            offers.find((offer) => term(offer) === value),
                          );
                          setError("");
                        }}
                        className={cn(
                          "min-h-12 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                          period === value
                            ? "border-action-line bg-action text-action-ink shadow-sm"
                            : "border-line bg-surface-2 text-ink-2 hover:border-ink-3 hover:text-ink",
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <label className="mt-4 block shrink-0 text-xs font-medium text-ink-2">
                    Coupon code (optional)
                    <div className="mt-2 flex items-center rounded-xl border border-line px-3 focus-within:border-ink-3">
                      <TicketPercent className="h-4 w-4 text-ink-3" />
                      <input
                        disabled={busy}
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                        maxLength={40}
                        placeholder="Enter code"
                        className="h-10 w-full bg-transparent px-3 text-sm text-ink outline-none"
                      />
                    </div>
                  </label>
                  <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
                  <div
                    className={cn(
                      "grid gap-3",
                      visibleOffers.length > 1 && "md:grid-cols-2",
                      visibleOffers.length > 2 && "xl:grid-cols-3",
                    )}
                  >
                    {visibleOffers.map((offer) => (
                      <article
                        key={offer.id}
                        className={cn(
                          "flex flex-col rounded-2xl border p-4 sm:p-5",
                          offer.featured
                            ? "plan-card-recommended border-emerald-400 bg-surface-2"
                            : "border-line bg-bg",
                        )}
                      >
                        <div className="mb-3 min-h-6">
                          {offer.featured && (
                            <span className="plan-recommendation rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-positive">
                              Recommended
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-ink">
                          {offer.name}
                        </h3>
                        <p className="mt-2 min-h-10 text-sm text-ink-3">
                          {offer.description}
                        </p>
                        <div className="mt-4">
                          <div className="min-h-5 text-sm text-ink-3">
                            {offer.compare_at &&
                              Number(offer.compare_at) >
                                Number(offer.price) && (
                                <span className="line-through">
                                  {money(offer.compare_at, catalog.currency)}
                                </span>
                              )}
                          </div>
                          <p className="text-3xl font-semibold text-ink">
                            {money(offer.price, catalog.currency)}
                          </p>
                          <p className="mt-1 text-xs text-ink-3">
                            {term(offer)} ·{" "}
                            {offer.months || offer.days
                              ? "One payment for the full period"
                              : "One-time payment"}
                          </p>
                          {Number(offer.price) === 0 && (
                            <p className="mt-2 text-xs text-positive">
                              Temporary access · one activation per account
                            </p>
                          )}
                        </div>
                        <button
                          disabled={busy}
                          onClick={() => void review(offer)}
                          className="mt-5 flex h-11 items-center justify-center gap-2 rounded-xl bg-action text-sm font-semibold text-action-ink disabled:opacity-50"
                        >
                          {busy && selected?.id === offer.id && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          {Number(offer.price) === 0
                            ? "Activate $0 package"
                            : "Get plan"}
                        </button>
                        <ul className="mt-5 space-y-3 border-t border-line pt-4 text-sm text-ink-2">
                          {offer.tier_ids.map((id) => {
                            const tier = catalog.tiers.find(
                              (item) => item.id === id,
                            );
                            return (
                              tier && (
                                <li key={id}>
                                  <p className="mb-2 font-semibold text-ink">
                                    {
                                      catalog.tools.find(
                                        (tool) => tool.id === tier.tool_id,
                                      )?.name
                                    }{" "}
                                    · {tier.name}
                                  </p>
                                  <ul className="space-y-2">
                                    {tier.features.map((feature) => (
                                      <li key={feature} className="flex gap-2">
                                        <Check className="h-4 w-4 shrink-0 text-positive" />
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              )
                            );
                          })}
                        </ul>
                      </article>
                    ))}
                  </div>
                  <p className="mt-4 text-xs leading-5 text-ink-3">
                    Renewals keep your remaining time. Upgrades start
                    immediately at the full offer price; unused time on another
                    tier is not credited. Bundle access applies to every
                    included tool.
                  </p>
                  {!offers.length && (
                    <p className="mt-3 text-sm text-ink-3">
                      No pricing packages are available for this tool yet.
                    </p>
                  )}
                  </div>
                </div>
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
                      <div className="flex justify-between text-positive">
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
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-action font-semibold text-action-ink disabled:opacity-50"
                  >
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                    {busy
                      ? "Processing…"
                      : `Confirm · ${money(quote.total, quote.currency)}`}
                  </button>
                  {Number(quote.total) > 0 && (
                    <Link
                      href={"/wallet" as Route}
                      className="block text-center text-sm text-ink-2 underline"
                    >
                      Add funds to wallet
                    </Link>
                  )}
                </div>
              )}
              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg bg-red-400/10 p-3 text-sm text-negative"
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
