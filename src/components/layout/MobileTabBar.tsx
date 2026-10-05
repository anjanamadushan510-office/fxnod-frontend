"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Home, Layers, Link2, Wallet, Wrench } from "lucide-react";
import { cn } from "@/lib/cn";

interface Tab {
  key: string;
  label: string;
  icon: ReactNode;
  href: string;
}

// Subscriptions is the list of tools the person has turned on. Transfer,
// Partners and Settings stay in the side menu, behind the top-bar button.
const TABS: Tab[] = [
  { key: "home", label: "Home", icon: <Home className="h-5 w-5" />, href: "/home" },
  { key: "tools", label: "Tools", icon: <Wrench className="h-5 w-5" />, href: "/tools" },
  { key: "subscriptions", label: "Subscriptions", icon: <Layers className="h-5 w-5" />, href: "/subscriptions" },
  { key: "venues", label: "Venues", icon: <Link2 className="h-5 w-5" />, href: "/venues" },
  { key: "wallet", label: "Wallet", icon: <Wallet className="h-5 w-5" />, href: "/wallet" },
];

/**
 * Bottom tab bar for the dashboard, below lg only.
 *
 * Every tab is a real destination. A tab that does nothing teaches people the
 * bar is decoration, and they stop trusting the ones that work.
 */
export function MobileTabBar() {
  const pathname = usePathname() ?? "";

  const itemClass = (on: boolean) =>
    cn(
      "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 min-w-0 text-[9px] min-[400px]:text-[10px] font-semibold tracking-tight transition-colors",
      on ? "text-ink" : "text-ink-3",
    );

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface px-safe pb-safe lg:hidden"
    >
      {TABS.map((tab) => {
        const on = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
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
    </nav>
  );
}
