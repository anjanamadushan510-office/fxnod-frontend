"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  FolderIcon,
  OptionsIcon,
  AppsGridIcon,
  InfoIcon,
  UserIcon,
} from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { useGetWalletBalance } from "@/services/api/endpoints/wallet/wallet";
import { fmtUSD } from "@/lib/format";

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  user?: { name: string; email: string };
}

export function Sidebar({
  isOpen = false,
  onClose,
  user = {
    name: "Trader Account",
    email: "demo@fxnod.io",
  },
}: SidebarProps) {
  const pathname = usePathname() || "";
  const { data: walletData } = useGetWalletBalance();
  const balance = Number(walletData?.balance || 0);

  const TERMINAL_LINKS: NavItem[] = [
    { key: "home", label: "Home", icon: <HomeIcon className="h-5 w-5" />, href: "/home" },
    { key: "tools", label: "Tools", icon: <AppsGridIcon className="h-5 w-5" />, href: "/tools" },
    { key: "subscriptions", label: "Subscriptions", icon: <FolderIcon className="h-5 w-5" />, href: "/mine" },
    { key: "venues", label: "Venues", icon: <InfoIcon className="h-5 w-5" />, href: "/venues" },
  ];

  const ACCOUNT_LINKS: NavItem[] = [
    { key: "wallet", label: "Wallet", icon: <FolderIcon className="h-5 w-5" />, href: "/wallet" },
    { key: "transfer", label: "Transfer", icon: <OptionsIcon className="h-5 w-5" />, href: "/transfer" },
    { key: "partners", label: "Partners", icon: <UserIcon className="h-5 w-5" />, href: "/partners" },
    { key: "settings", label: "Settings", icon: <OptionsIcon className="h-5 w-5" />, href: "/settings" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-ink transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <a href="/home" className="flex items-center">
            <img src="/assets/fxnod-logo.png" alt="FXNOD" className="h-8 w-auto" />
          </a>
          <button 
            className="text-zinc-400 hover:text-white lg:hidden" 
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="px-3 pb-2 pt-3 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
            Terminal
          </p>
          
          {TERMINAL_LINKS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href as Route}
                onClick={onClose}
                className={cn(
                  "nav-link flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  isActive 
                    ? "is-active bg-white/5 text-white shadow-[inset_3px_0_0_0_var(--gold)]" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}

          <p className="px-3 pb-2 pt-5 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
            Account
          </p>
          
          {ACCOUNT_LINKS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href as Route}
                onClick={onClose}
                className={cn(
                  "nav-link flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  isActive 
                    ? "is-active bg-white/5 text-white shadow-[inset_3px_0_0_0_var(--gold)]" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.key === "wallet" && (
                  <span className="text-[11px] tabular-nums text-zinc-500">
                    {fmtUSD(balance)}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line bg-ink px-4 py-4">
          <Link href="/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface">
              <img src="/assets/fxnod-mark.png" alt="FXNOD" className="h-6 w-6 object-contain" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-white">{user.name}</span>
              <span className="truncate text-[11px] text-zinc-500">{user.email}</span>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
