"use client";

import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { CaretDownIcon } from "@/components/ui/Icons";
import { ConnectDerivButton } from "@/components/options/deriv/ConnectDerivButton";
import { DerivDisconnectButton } from "@/components/options/deriv/DerivDisconnectButton";
import { BotMenu, type BotMenuItem } from "./BotMenu";

/**
 * The header's overflow menu. Header, not picker: the picker only exists in an
 * empty tab, so anything put there is unreachable while a bot is running.
 *
 * This replaced a "Reports" button that had no onClick and had never done
 * anything.
 */
const MENU_ITEMS: BotMenuItem[] = [
  {
    label: "dBot subscription",
    hint: "Your plan, and what it costs to renew",
    href: "/options/dbot/subscription",
  },
  {
    label: "dBot history",
    hint: "Every run, including the ones that have finished",
    href: "/options/dbot/history",
  },
];

interface BotTopBarProps {
  balance: number;
  currency: string;
  /** Demo balances are labelled — mistaking one for real money is expensive. */
  isVirtual?: boolean;
}

export function BotTopBar({
  balance,
  currency,
  isVirtual = false,
}: BotTopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-opt-line bg-opt-bg-elev px-5">
      <Link
        href={"/options" as Route}
        className="flex items-center gap-2.5 text-opt-ink transition-opacity hover:opacity-80"
      >
        <span
          aria-hidden="true"
          className="grid h-8 w-8 place-items-center rounded-lg bg-[linear-gradient(180deg,var(--navy),var(--navy-3))] text-[13px] font-bold text-gold"
        >
          dB
        </span>
        <span className="text-[17px] font-bold tracking-[-0.01em]">dBot</span>
      </Link>

      <div className="ml-auto flex items-center gap-3 max-lg:gap-2">
        {/* dBot showed the login id as plain text, so it had neither the
            account switcher nor a way out of Deriv — dTrader had both. Same
            control on both screens now. */}
        <ConnectDerivButton />
        <DerivDisconnectButton />

        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-[var(--opt-radius-sm)] border border-opt-line",
            "bg-opt-bg-elev px-3 py-2 transition-colors hover:border-opt-line-strong",
          )}
        >
          {isVirtual && (
            <span className="rounded-full bg-opt-ink-4/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-opt-ink-2">
              Demo
            </span>
          )}
          <span className="text-[13px] font-bold tabular-nums text-opt-ink">
            {balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            {currency}
          </span>
          <CaretDownIcon className="h-3 w-3 text-opt-ink-3" />
        </button>

        <BotMenu items={MENU_ITEMS} />
      </div>
    </header>
  );
}
