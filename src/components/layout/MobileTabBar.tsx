"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Bot, CandlestickChart, Home, Menu, Wallet } from "lucide-react";
import { cn } from "@/lib/cn";

interface Tab {
  key: string;
  label: string;
  icon: ReactNode;
  href: string;
}

// The four places a trader goes from a phone. Everything else — settings,
// partners, venues, transfer — is one tap further, behind "More".
const TABS: Tab[] = [
  { key: "home", label: "Home", icon: <Home className="h-5 w-5" />, href: "/home" },
  { key: "trade", label: "Trade", icon: <CandlestickChart className="h-5 w-5" />, href: "/options" },
  { key: "bots", label: "Bots", icon: <Bot className="h-5 w-5" />, href: "/dbot" },
  { key: "wallet", label: "Wallet", icon: <Wallet className="h-5 w-5" />, href: "/wallet" },
];

interface MobileTabBarProps {
  /** Opens the navigation drawer, which holds every other destination. */
  onMore: () => void;
  /** True while the drawer is open, so "More" reads as the active tab. */
  moreOpen?: boolean;
}

/**
 * Bottom tab bar for the dashboard, below lg only.
 *
 * Every tab is a real destination. A tab that does nothing teaches people the
 * bar is decoration, and they stop trusting the ones that work.
 */
export function MobileTabBar({ onMore, moreOpen = false }: MobileTabBarProps) {
  const pathname = usePathname() ?? "";

  const itemClass = (on: boolean) =>
    cn(
      "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 text-[10px] font-semibold tracking-[0.04em] transition-colors",
      on ? "text-ink" : "text-ink-3",
    );

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface px-safe pb-safe lg:hidden"
    >
      {TABS.map((tab) => {
        const on = !moreOpen && pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.key}
            href={tab.href as Route}
            aria-current={on ? "page" : undefined}
            className={itemClass(on)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={onMore}
        aria-haspopup="dialog"
        aria-expanded={moreOpen}
        className={cn(itemClass(moreOpen), "border-0 bg-transparent")}
      >
        <Menu className="h-5 w-5" />
        <span>More</span>
      </button>
    </nav>
  );
}
