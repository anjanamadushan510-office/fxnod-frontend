"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * Phone navigation for the signed-in app.
 * Subscriptions is the list of tools the person has turned on.
 * Transfer, Partners, and Settings stay in the side menu.
 */
const TABS = [
  { href: "/home", label: "Home", icon: HomeIcon },
  { href: "/tools", label: "Tools", icon: ToolsIcon },
  { href: "/subscriptions", label: "Subscriptions", icon: SubscriptionsIcon },
  { href: "/venues", label: "Venues", icon: VenuesIcon },
  { href: "/wallet", label: "Wallet", icon: WalletIcon },
] as const;

export function MobileTabBar() {
  const pathname = usePathname() || "";

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid h-14 grid-cols-5">
        {TABS.map((tab) => {
          const on = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href as Route}
              aria-current={on ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 px-0.5 text-center text-[9px] font-medium leading-none tracking-tight min-[400px]:text-[10px]",
                on ? "text-ink" : "text-ink-3",
              )}
            >
              <Icon />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** Bot builder owns the bottom of the screen (Back / Continue). */
export function phoneNavHidden(pathname: string) {
  return pathname.startsWith("/dbot/build");
}

function HomeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5A1.5 1.5 0 014.5 6h4A1.5 1.5 0 0110 7.5v4A1.5 1.5 0 018.5 13h-4A1.5 1.5 0 013 11.5v-4zM14 7.5A1.5 1.5 0 0115.5 6h4A1.5 1.5 0 0121 7.5v1A1.5 1.5 0 0119.5 10h-4A1.5 1.5 0 0114 8.5v-1zM14 14.5a1.5 1.5 0 011.5-1.5h4a1.5 1.5 0 011.5 1.5v2a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-2zM3 16.5A1.5 1.5 0 014.5 15h4a1.5 1.5 0 011.5 1.5v1A1.5 1.5 0 018.5 19h-4A1.5 1.5 0 013 17.5v-1z" />
    </svg>
  );
}

function SubscriptionsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 8.75v10.5A2.25 2.25 0 006.75 21.5h10.5a2.25 2.25 0 002.25-2.25V8.75a2.25 2.25 0 00-1.5-2.122" />
    </svg>
  );
}

function ToolsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
    </svg>
  );
}

function VenuesIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.91a4 4 0 015.66 5.66l-3.54 3.54a4 4 0 01-5.66 0M10.81 15.09a4 4 0 01-5.66-5.66l3.54-3.54a4 4 0 015.66 0" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7.5A1.5 1.5 0 0019.5 6h-15A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18H12M21 12a3 3 0 00-3-3h-1.5a.75.75 0 000 1.5H18a1.5 1.5 0 010 3h-1.5a.75.75 0 000 1.5H18a3 3 0 003-3z" />
    </svg>
  );
}
