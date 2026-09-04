"use client";

import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Shown when someone tries to start a bot on a REAL account without a
 * subscription.
 *
 * The shape of the paywall is deliberate: demo is free, so this never blocks
 * anyone from finding out whether the bots work. It appears at the one moment
 * the answer changes — pressing Start on real money — rather than as a wall in
 * front of the whole product. Someone who has to pay before they can see
 * anything mostly just leaves.
 *
 * So it offers two ways out, and the free one is not hidden: buy a plan, or
 * switch back to demo and carry on.
 */
interface SubscriptionGateModalProps {
  open: boolean;
  onClose: () => void;
  /** What the server said, when it is more specific than "no subscription". */
  reason?: string;
}

export function SubscriptionGateModal({
  open,
  onClose,
  reason,
}: SubscriptionGateModalProps) {
  if (!open) return null;

  const expired = reason === "subscription_expired";

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-gate-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev p-6 shadow-2xl"
      >
        <h2
          id="subscription-gate-title"
          className="m-0 text-[17px] font-bold text-opt-ink"
        >
          {expired
            ? "Your dBot subscription has ended"
            : "Bots on real money need a subscription"}
        </h2>

        <p className="m-0 mt-2 text-[13px] leading-relaxed text-opt-ink-2">
          {expired
            ? "Renew to keep running bots on your real account. Demo stays free."
            : "Running a bot on a real Deriv account needs an active dBot subscription."}
        </p>

        <p className="m-0 mt-4 rounded-[var(--opt-radius-sm)] bg-opt-bg-sunk px-3 py-2.5 text-[12px] leading-relaxed text-opt-ink-2">
          {/* The free path, stated plainly rather than buried. Someone who
              cannot try the product does not buy it. */}
          <strong className="text-opt-ink">Demo is free.</strong> Switch to your
          demo account from the account menu and run the same bot on virtual
          money, with no subscription.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={"/options/dbot/subscription" as Route}
            className={cn(
              "inline-flex items-center rounded-[var(--opt-radius-sm)] px-5 py-2.5",
              "bg-opt-rise text-[13px] font-bold text-white",
              "transition-opacity hover:opacity-90",
            )}
          >
            {expired ? "Renew subscription" : "See plans"}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--opt-radius-sm)] px-4 py-2.5 text-[13px] font-semibold text-opt-ink-2 transition-colors hover:bg-opt-bg-sunk"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
