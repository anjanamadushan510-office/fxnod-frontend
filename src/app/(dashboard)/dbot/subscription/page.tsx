"use client";

import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { parseApiError } from "@/lib/apiError";
import {
  getGetMySubscriptionQueryKey,
  useGetMySubscription,
  useListSubscriptionPlans,
  usePurchaseSubscription,
} from "@/services/api/endpoints/subscriptions/subscriptions";
import {
  getGetWalletBalanceQueryKey,
  useGetWalletBalance,
} from "@/services/api/endpoints/wallet/wallet";
import type {
  SubscriptionPlan,
  SubscriptionStatusResponse,
} from "@/services/api/model";

/**
 * /dbot/subscription — buying and holding dBot access.
 *
 * Every number on this page comes from the server. The plans and their prices
 * are the catalogue as the API reports it, not a list typed into the frontend:
 * a price shown here that disagrees with what the wallet is charged is the kind
 * of bug someone only finds after being billed.
 *
 * Purchases are paid from the FXNod wallet, so the page shows the balance
 * beside the price and says plainly when it is short, rather than letting
 * someone press a button that can only fail.
 */
export default function DBotSubscriptionPage() {
  const queryClient = useQueryClient();

  const plansQuery = useListSubscriptionPlans();
  const statusQuery = useGetMySubscription();
  const balanceQuery = useGetWalletBalance();

  const plans = plansQuery.data?.plans ?? [];
  const status = statusQuery.data;
  const balance = Number.parseFloat(balanceQuery.data?.balance ?? "0") || 0;
  const currency = balanceQuery.data?.currency ?? "USDT";

  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  const purchase = usePurchaseSubscription({
    mutation: {
      onSuccess: async () => {
        toast.success("Subscription active. Your bots can run.");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: getGetMySubscriptionQueryKey() }),
          queryClient.invalidateQueries({ queryKey: getGetWalletBalanceQueryKey() }),
        ]);
      },
      onError: (err) => {
        toast.error(parseApiError(err, "Could not complete the purchase.").message);
      },
      onSettled: () => setPendingPlanId(null),
    },
  });

  function buy(plan: SubscriptionPlan) {
    setPendingPlanId(plan.plan_id);
    purchase.mutate({
      data: {
        plan_id: plan.plan_id,
        // One key per ATTEMPT, generated here and sent with the request. If the
        // response is lost and the user presses again, they get a new key and a
        // second purchase — which is correct, because they meant to buy twice.
        // What this stops is the same attempt being charged twice.
        idempotency_key: crypto.randomUUID(),
      },
    });
  }

  return (
    <section className="p-4 lg:p-8 space-y-8">
      <div>
        <Link href={"/dbot" as Route} className="text-xs text-ink-3 hover:text-ink mb-3 block w-fit">
          &larr; Bots
        </Link>
        <h1 className="text-2xl font-semibold text-ink">dBot subscription</h1>
        <p className="text-sm text-ink-2 mt-1 max-w-2xl">
          Automated trading on a real account is a paid feature. A subscription lets you start
          bots; it does not change how they trade, and it never trades on its own. Demo is free.
        </p>
      </div>

      <CurrentStatus status={status} loading={statusQuery.isPending} failed={statusQuery.isError} />

      <div>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-medium text-ink">Plans</h2>
          <span className="text-xs text-ink-3">
            Paid from your FXNod wallet ·{" "}
            <span className="font-semibold tabular-nums text-ink-2">
              {balanceQuery.isPending ? "loading…" : `${balance.toFixed(2)} ${currency}`}
            </span>{" "}
            available
          </span>
        </div>

        {plansQuery.isPending && <PlanSkeletons />}

        {plansQuery.isError && (
          <p className="text-sm text-red-400">Could not load the plans. Nothing has been charged.</p>
        )}

        {!plansQuery.isPending && !plansQuery.isError && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.plan_id}
                plan={plan}
                balance={balance}
                // Lifetime supersedes everything, so nothing can be added to it.
                blocked={status?.subscription?.is_lifetime === true}
                busy={pendingPlanId === plan.plan_id}
                anyBusy={purchase.isPending}
                onBuy={() => buy(plan)}
              />
            ))}
          </div>
        )}

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-ink-3">
          Renewing while a subscription is still running adds to what is left of it — you do not
          lose the days you have already paid for. A running bot stops on its own if a
          subscription lapses mid-session.
        </p>
      </div>
    </section>
  );
}

// ─── Current status ─────────────────────────────────────────────────────────

function CurrentStatus({
  status,
  loading,
  failed,
}: {
  status?: SubscriptionStatusResponse;
  loading: boolean;
  failed: boolean;
}) {
  if (loading) {
    return <div className="h-20 animate-pulse rounded-2xl border border-line bg-surface" />;
  }

  if (failed || !status) {
    return (
      <Panel tone="neutral">
        <p className="text-sm text-ink-2">
          Could not read your subscription. This page does not decide whether your bots may run —
          the server does, on every start.
        </p>
      </Panel>
    );
  }

  if (!status.entitled) {
    return (
      <Panel tone="warn">
        <p className="font-medium text-ink">
          {status.reason === "subscription_expired"
            ? "Your subscription has expired"
            : "You do not have a dBot subscription"}
        </p>
        <p className="mt-1 text-sm text-ink-2">
          Bots cannot run on a real account without one. Choose a plan below, or practise on demo
          for free.
        </p>
      </Panel>
    );
  }

  const subscription = status.subscription;
  return (
    <Panel tone="ok">
      <p className="font-medium text-ink">
        {subscription?.is_lifetime ? "Lifetime access" : "Your subscription is active"}
      </p>
      <p className="mt-1 text-sm text-ink-2">
        {subscription?.is_lifetime
          ? "It does not expire and cannot be extended."
          : subscription?.expires_at
            ? `Runs until ${new Date(subscription.expires_at).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}.`
            : "Active."}
      </p>
    </Panel>
  );
}

// ─── Plans ──────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  balance,
  blocked,
  busy,
  anyBusy,
  onBuy,
}: {
  plan: SubscriptionPlan;
  balance: number;
  blocked: boolean;
  busy: boolean;
  anyBusy: boolean;
  onBuy: () => void;
}) {
  const price = Number.parseFloat(plan.price_usd) || 0;
  const affordable = balance >= price;
  const lifetime = plan.duration_days === null;

  // The plan says what it is charged in, and the wallet is debited in the same
  // thing. Hardcoding "$" here made the card read "$25.00" directly under a
  // balance reading "100.00 USDT" — the same currency, named two ways, on one
  // screen about money.
  const unit = plan.currency;

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl border p-5",
        lifetime ? "border-gold bg-gold-soft/30" : "border-line bg-surface",
      )}
    >
      <div>
        <p className="font-medium text-ink">{plan.name}</p>
        <p className="mt-0.5 text-xs text-ink-3">
          {lifetime ? "Never expires" : `${plan.duration_days} days`}
        </p>
      </div>

      <p className="text-2xl font-semibold tabular-nums leading-none text-ink">
        {price.toFixed(2)} <span className="text-sm font-medium">{unit}</span>
      </p>

      <button
        type="button"
        disabled={blocked || anyBusy || !affordable}
        onClick={onBuy}
        className={cn(
          "mt-auto h-10 rounded-lg px-4 text-sm font-medium transition",
          "disabled:cursor-not-allowed disabled:opacity-45",
          lifetime ? "bg-gold-3 text-white hover:opacity-90" : "bg-ink text-surface hover:opacity-80",
        )}
      >
        {busy ? "Charging…" : blocked ? "Included" : "Buy"}
      </button>

      {/* Said before the button is pressed, not after it fails. */}
      {!blocked && !affordable && (
        <p className="-mt-2 text-xs text-ink-3">
          Deposit {(price - balance).toFixed(2)} {unit} more to buy this.
        </p>
      )}
    </article>
  );
}

function PlanSkeletons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-40 animate-pulse rounded-2xl border border-line bg-surface" />
      ))}
    </div>
  );
}

function Panel({ tone, children }: { tone: "ok" | "warn" | "neutral"; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        tone === "ok"
          ? "border-emerald-500/40 bg-emerald-500/10"
          : tone === "warn"
            ? "border-amber-500/40 bg-amber-500/10"
            : "border-line bg-surface",
      )}
    >
      {children}
    </div>
  );
}
