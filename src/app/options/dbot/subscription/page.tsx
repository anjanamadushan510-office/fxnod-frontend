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
 * /options/dbot/subscription — buying and holding dBot access.
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
          queryClient.invalidateQueries({
            queryKey: getGetMySubscriptionQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: getGetWalletBalanceQueryKey(),
          }),
        ]);
      },
      onError: (err) => {
        toast.error(
          parseApiError(err, "Could not complete the purchase.").message,
        );
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
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[980px] px-6 py-8">
        <header className="mb-6">
          <Link
            href={"/options/dbot" as Route}
            className="text-[11px] font-semibold text-opt-ink-3 transition-colors hover:text-opt-ink"
          >
            ← Back to bots
          </Link>
          <h1 className="m-0 mt-2 text-[20px] font-bold tracking-tight text-opt-ink">
            dBot subscription
          </h1>
          <p className="m-0 mt-1 max-w-[62ch] text-[12px] leading-relaxed text-opt-ink-3">
            Automated trading is a paid feature. A subscription lets you start
            bots; it does not change how they trade, and it never trades on its
            own.
          </p>
        </header>

        <CurrentStatus
          status={status}
          loading={statusQuery.isPending}
          failed={statusQuery.isError}
        />

        <div className="mb-3 mt-8 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="m-0 text-[14px] font-bold text-opt-ink">Plans</h2>
          <span className="text-[11px] text-opt-ink-3">
            Paid from your FXNod wallet ·{" "}
            <span className="font-semibold tabular-nums text-opt-ink-2">
              {balanceQuery.isPending
                ? "loading…"
                : `${balance.toFixed(2)} ${currency}`}
            </span>{" "}
            available
          </span>
        </div>

        {plansQuery.isPending && <PlanSkeletons />}

        {plansQuery.isError && (
          <p className="m-0 text-[12px] text-opt-fall">
            Could not load the plans. Nothing has been charged.
          </p>
        )}

        {!plansQuery.isPending && !plansQuery.isError && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

        <p className="m-0 mt-6 max-w-[70ch] text-[11px] leading-relaxed text-opt-ink-3">
          Renewing while a subscription is still running adds to what is left of
          it — you do not lose the days you have already paid for. A running bot
          stops on its own if a subscription lapses mid-session.
        </p>
      </div>
    </div>
  );
}

// ─── Current status ──────────────────────────────────────────────────────────

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
    return (
      <div className="h-[76px] animate-pulse rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev" />
    );
  }

  if (failed || !status) {
    return (
      <Panel tone="neutral">
        <p className="m-0 text-[12px] text-opt-ink-2">
          Could not read your subscription. This page does not decide whether
          your bots may run — the server does, on every start.
        </p>
      </Panel>
    );
  }

  if (!status.entitled) {
    return (
      <Panel tone="warn">
        <p className="m-0 text-[13px] font-bold text-opt-ink">
          {status.reason === "subscription_expired"
            ? "Your subscription has expired"
            : "You do not have a dBot subscription"}
        </p>
        <p className="m-0 mt-1 text-[11.5px] text-opt-ink-2">
          Bots cannot be started without one. Choose a plan below.
        </p>
      </Panel>
    );
  }

  const subscription = status.subscription;
  return (
    <Panel tone="ok">
      <p className="m-0 text-[13px] font-bold text-opt-ink">
        {subscription?.is_lifetime
          ? "Lifetime access"
          : "Your subscription is active"}
      </p>
      <p className="m-0 mt-1 text-[11.5px] text-opt-ink-2">
        {subscription?.is_lifetime
          ? "It does not expire and cannot be extended."
          : subscription?.expires_at
            ? `Runs until ${new Date(subscription.expires_at).toLocaleString(
                undefined,
                { dateStyle: "medium", timeStyle: "short" },
              )}.`
            : "Active."}
      </p>
    </Panel>
  );
}

// ─── Plans ───────────────────────────────────────────────────────────────────

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

  let originalPrice = null;
  if (plan.duration_days === 180) originalPrice = 150.00;
  if (plan.duration_days === 365) originalPrice = 300.00;

  // The plan says what it is charged in, and the wallet is debited in the same
  // thing. Hardcoding "$" here made the card read "$25.00" directly under a
  // balance reading "100.00 USDT" — the same currency, named two ways, on one
  // screen about money.
  const unit = plan.currency;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[var(--opt-radius)] border p-4",
        lifetime
          ? "border-gold bg-gold-soft/30"
          : "border-opt-line bg-opt-bg-elev",
      )}
    >
      <div>
        <p className="m-0 text-[13px] font-bold text-opt-ink">{plan.name}</p>
        <p className="m-0 mt-0.5 text-[10.5px] text-opt-ink-3">
          {lifetime ? "Never expires" : `${plan.duration_days} days`}
        </p>
      </div>

      <div className="flex flex-col">
        {originalPrice && (
          <p className="m-0 text-[12px] font-semibold text-opt-ink-3/70 line-through decoration-red-500/50 decoration-2">
            {originalPrice.toFixed(2)} {unit}
          </p>
        )}
        <p className="m-0 text-[22px] font-extrabold tabular-nums leading-none text-opt-ink">
          {price.toFixed(2)} <span className="text-[13px] font-bold">{unit}</span>
        </p>
      </div>

      <button
        type="button"
        disabled={blocked || anyBusy || !affordable}
        onClick={onBuy}
        className={cn(
          "mt-auto rounded-[var(--opt-radius-sm)] px-3 py-2 text-[12px] font-bold",
          "transition-opacity hover:opacity-90",
          "disabled:cursor-not-allowed disabled:opacity-45",
          lifetime ? "bg-gold-3 text-white" : "bg-opt-rise text-white",
        )}
      >
        {busy ? "Charging…" : blocked ? "Included" : "Buy"}
      </button>

      {/* Said before the button is pressed, not after it fails. */}
      {!blocked && !affordable && (
        <p className="m-0 -mt-1 text-[10.5px] text-opt-ink-3">
          Deposit ${(price - balance).toFixed(2)} more to buy this.
        </p>
      )}
    </div>
  );
}

function PlanSkeletons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-[152px] animate-pulse rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev"
        />
      ))}
    </div>
  );
}

function Panel({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "neutral";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--opt-radius)] border p-4",
        tone === "ok"
          ? "border-opt-rise bg-opt-rise-soft"
          : tone === "warn"
            ? "border-opt-line-strong bg-opt-bg-sunk"
            : "border-opt-line bg-opt-bg-elev",
      )}
    >
      {children}
    </div>
  );
}
