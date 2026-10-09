"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/partner/dashboard", label: "Overview" },
  { href: "/partner/dashboard/earnings", label: "Earnings" },
  { href: "/partner/dashboard/network", label: "Network" },
  { href: "/partner/dashboard/rules", label: "Rates & rules" },
] as const;

/** The sections of the Partner Hub. Each is its own route, so a link to one can be shared. */
export function PartnerTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Partner Hub sections" className="border-b border-line px-4 lg:px-8">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const on = pathname === tab.href;
          return (
            <li key={tab.href} className="shrink-0">
              <Link
                href={tab.href as Route}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center border-b-2 px-3 text-sm font-medium transition-colors",
                  on ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
