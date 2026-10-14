"use client";
import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import * as Dialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Clock3, Package, ReceiptText } from "lucide-react";
import { ToolMark } from "@/components/tools/ToolCard";
import { PlanDialog } from "@/components/tools/PlanDialog";
import { useCommerce, useToolActivation } from "@/hooks/useCommerce";
import {
  commerce,
  commerceError,
  money,
  type CommerceTool,
} from "@/services/commerce";
import { useAuthStore } from "@/stores/authStore";

export default function SubscriptionsPage() {
  const { data, isLoading, isError, refetch } = useCommerce();
  const activation = useToolActivation();
  const user = useAuthStore((s) => s.user);
  const [offset, setOffset] = useState(0);
  const orders = useQuery({
    queryKey: ["commerce-orders", user?.id, offset],
    queryFn: () => commerce.orders(offset),
    enabled: !!user,
  });
  const [plan, setPlan] = useState<string | null>(null);
  const [pending, setPending] = useState<CommerceTool | null>(null);
  const [error, setError] = useState("");
  if (isLoading)
    return (
      <div className="p-8" role="status">
        Loading your tools…
      </div>
    );
  if (isError || !data)
    return (
      <div className="p-8">
        <p>Unable to load your tools.</p>
        <button onClick={() => refetch()} className="mt-3 underline">
          Try again
        </button>
      </div>
    );
  const active = data.tools.filter((t) => t.access.active);
  const owned = data.tools.filter((t) => t.access.owned);
  return (
    <section className="mx-auto max-w-7xl space-y-8 p-4 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-ink-3">
            YOUR WORKSPACE
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Active tools & plans</h1>
          <p className="mt-2 text-sm text-ink-2">
            Your access, renewal dates and purchase history in one place.
          </p>
        </div>
        <Link
          href={"/tools" as Route}
          className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm"
        >
          Discover tools
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          ["Active tools", active.length],
          ["Paid plans", owned.length],
          [
            "Lifetime plans",
            owned.filter((t) => !t.access.renewal_due && !t.access.expires_at)
              .length,
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-line bg-surface p-4"
          >
            <p className="text-xs text-ink-3">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-sm text-negative">
          {error}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {data.tools
          .filter((t) => t.access.active || t.access.owned)
          .map((tool) => (
            <article
              key={tool.id}
              className="rounded-2xl border border-line bg-surface p-5"
            >
              <div className="flex items-center gap-3">
                <ToolMark id={tool.id} />
                <div className="flex-1">
                  <h2 className="font-semibold">{tool.name}</h2>
                  <p className="text-xs text-ink-3">
                    {tool.access.tier_name ?? "No active"} plan
                    {tool.access.renewal_due ? " · Access expired" : ""}
                  </p>
                </div>
                <span
                  className={
                    tool.access.active
                      ? "text-xs text-positive"
                      : "text-xs text-ink-3"
                  }
                >
                  {tool.access.active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-5 flex items-center gap-2 text-xs text-ink-2">
                <Clock3 className="h-4 w-4" />
                {tool.access.expires_at
                  ? `Access until ${new Date(tool.access.expires_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}`
                  : tool.access.source === "free"
                    ? "Plan activation required"
                    : tool.access.allowed
                      ? "Lifetime access"
                      : "Access expired"}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {tool.href && tool.access.allowed && (
                  <Link
                    href={tool.href as Route}
                    className="flex h-10 flex-1 items-center justify-center rounded-xl bg-action px-4 text-sm font-medium text-action-ink"
                  >
                    Open tool
                  </Link>
                )}
                <button
                  onClick={() => setPlan(tool.id)}
                  className="rounded-xl border border-line px-4 py-2 text-sm"
                >
                  Plans
                </button>
                <button
                  disabled={activation.isPending}
                  onClick={async () => {
                    if (tool.access.active) setPending(tool);
                    else {
                      try {
                        await activation.mutateAsync({
                          id: tool.id,
                          enabled: true,
                        });
                      } catch (e) {
                        setError(commerceError(e));
                      }
                    }
                  }}
                  className="rounded-xl border border-line px-4 py-2 text-sm text-ink-3"
                >
                  {tool.access.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </article>
          ))}
      </div>
      {!active.length && (
        <div className="rounded-2xl border border-dashed border-line p-8 text-center">
          <Package className="mx-auto mb-3 h-7 w-7 text-ink-3" />
          <p>No active tools yet.</p>
          <Link
            href={"/tools" as Route}
            className="mt-2 inline-block text-sm text-ink-2 underline"
          >
            Choose a tool in Discover
          </Link>
        </div>
      )}
      <div className="border-t border-line pt-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <ReceiptText className="h-5 w-5" />
          Purchase history
        </h2>
        {orders.isLoading ? (
          <p className="text-sm text-ink-3">Loading receipts…</p>
        ) : orders.isError ? (
          <button
            onClick={() => orders.refetch()}
            className="text-sm underline"
          >
            Unable to load receipts. Retry
          </button>
        ) : (
          <div className="divide-y divide-line rounded-xl border border-line bg-surface">
            {orders.data?.items.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div>
                  <p className="text-sm font-medium">
                    {order.snapshot.offer.name}
                  </p>
                  <p className="mt-1 text-xs text-ink-3">
                    {new Date(order.created_at).toLocaleDateString()} · Receipt{" "}
                    {order.id.slice(0, 8)}
                  </p>
                  {order.coupon_code && (
                    <p className="mt-1 text-xs text-positive">
                      {order.coupon_code} · saved{" "}
                      {money(order.discount, order.currency)}
                    </p>
                  )}
                </div>
                <span className="text-sm font-semibold">
                  {money(order.total, order.currency)}
                </span>
              </div>
            ))}
            {!orders.data?.items.length && (
              <p className="p-5 text-sm text-ink-3">
                No marketplace purchases yet. Existing subscriptions remain
                valid.
              </p>
            )}
          </div>
        )}
        <div className="mt-3 flex justify-end gap-4 text-sm">
          <button
            disabled={!offset}
            onClick={() => setOffset(Math.max(0, offset - 25))}
            className="disabled:opacity-30"
          >
            Previous
          </button>
          <button
            disabled={offset + 25 >= (orders.data?.total ?? 0)}
            onClick={() => setOffset(offset + 25)}
            className="disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
      {plan && (
        <PlanDialog
          catalog={data}
          toolId={plan}
          onClose={() => setPlan(null)}
        />
      )}
      <Dialog.Root
        open={!!pending}
        onOpenChange={(open) => {
          if (!open && !activation.isPending) setPending(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/60" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-surface p-6">
            <Dialog.Title className="text-lg font-semibold">
              Deactivate {pending?.name}?
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-ink-2">
              This hides the tool from your active workspace. It does not cancel
              your purchased access, pause its expiry or refund a payment.
              Running bots are not stopped.
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close
                disabled={activation.isPending}
                className="px-4 text-sm"
              >
                Keep active
              </Dialog.Close>
              <button
                disabled={activation.isPending}
                onClick={async () => {
                  if (!pending) return;
                  try {
                    await activation.mutateAsync({
                      id: pending.id,
                      enabled: false,
                    });
                    setPending(null);
                  } catch (e) {
                    setError(commerceError(e));
                    setPending(null);
                  }
                }}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {activation.isPending ? "Deactivating…" : "Deactivate"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
