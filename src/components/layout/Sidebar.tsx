"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useGetWalletBalance } from "@/services/api/endpoints/wallet/wallet";
import { fmtUSD } from "@/lib/format";

interface NavItem {
  key: string;
  label: string;
  icon: (isActive: boolean) => React.ReactNode;
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
    { 
      key: "home", 
      label: "Home", 
      icon: (isActive) => (
        <svg className={cn("nav-icon w-4 h-4 transition-colors", isActive ? "text-white" : "text-zinc-500")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5A1.5 1.5 0 014.5 6h4A1.5 1.5 0 0110 7.5v4A1.5 1.5 0 018.5 13h-4A1.5 1.5 0 013 11.5v-4zM14 7.5A1.5 1.5 0 0115.5 6h4A1.5 1.5 0 0121 7.5v1A1.5 1.5 0 0119.5 10h-4A1.5 1.5 0 0114 8.5v-1zM14 14.5a1.5 1.5 0 011.5-1.5h4a1.5 1.5 0 011.5 1.5v2a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-2zM3 16.5A1.5 1.5 0 014.5 15h4a1.5 1.5 0 011.5 1.5v1A1.5 1.5 0 018.5 19h-4A1.5 1.5 0 013 17.5v-1z"/>
        </svg>
      ),
      href: "/home" 
    },
    { 
      key: "tools", 
      label: "Tools", 
      icon: (isActive) => (
        <svg className={cn("nav-icon w-4 h-4 transition-colors", isActive ? "text-white" : "text-zinc-500")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085"/>
        </svg>
      ),
      href: "/tools" 
    },
    { 
      key: "subscriptions", 
      label: "Subscriptions", 
      icon: (isActive) => (
        <svg className={cn("nav-icon w-4 h-4 transition-colors", isActive ? "text-white" : "text-zinc-500")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 8.75v10.5A2.25 2.25 0 006.75 21.5h10.5a2.25 2.25 0 002.25-2.25V8.75a2.25 2.25 0 00-1.5-2.122"/>
        </svg>
      ),
      href: "/subscriptions" 
    },
    { 
      key: "venues", 
      label: "Venues", 
      icon: (isActive) => (
        <svg className={cn("nav-icon w-4 h-4 transition-colors", isActive ? "text-white" : "text-zinc-500")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.91a4 4 0 015.66 5.66l-3.54 3.54a4 4 0 01-5.66 0M10.81 15.09a4 4 0 01-5.66-5.66l3.54-3.54a4 4 0 015.66 0"/>
        </svg>
      ),
      href: "/venues" 
    },
  ];

  const ACCOUNT_LINKS: NavItem[] = [
    { 
      key: "wallet", 
      label: "Wallet", 
      icon: (isActive) => (
        <svg className={cn("nav-icon w-4 h-4 transition-colors", isActive ? "text-white" : "text-zinc-500")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7.5A1.5 1.5 0 0019.5 6h-15A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18H12M21 12a3 3 0 00-3-3h-1.5a.75.75 0 000 1.5H18a1.5 1.5 0 010 3h-1.5a.75.75 0 000 1.5H18a3 3 0 003-3z"/>
        </svg>
      ),
      href: "/wallet" 
    },
    { 
      key: "transfer", 
      label: "Transfer", 
      icon: (isActive) => (
        <svg className={cn("nav-icon w-4 h-4 transition-colors", isActive ? "text-white" : "text-zinc-500")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
        </svg>
      ),
      href: "/transfer" 
    },
    { 
      key: "partners", 
      label: "Partners", 
      icon: (isActive) => (
        <svg className={cn("nav-icon w-4 h-4 transition-colors", isActive ? "text-white" : "text-zinc-500")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
        </svg>
      ),
      href: "/partner/dashboard" 
    },
    { 
      key: "settings", 
      label: "Settings", 
      icon: (isActive) => (
        <svg className={cn("nav-icon w-4 h-4 transition-colors", isActive ? "text-white" : "text-zinc-500")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      ),
      href: "/settings" 
    },
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
          "fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r border-[#24344F] bg-[#080C16] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-[100dvh]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#24344F] px-5">
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

        <nav className="flex-1 space-y-2 overflow-y-auto p-3">
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
                  "nav-link relative flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors",
                  isActive 
                    ? "is-active bg-white/[0.06] text-white" 
                    : "text-zinc-400 hover:bg-white/[0.06] hover:text-white group"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-white rounded-r" />
                )}
                {item.icon(isActive)}
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
                  "nav-link relative flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors",
                  isActive 
                    ? "is-active bg-white/[0.06] text-white" 
                    : "text-zinc-400 hover:bg-white/[0.06] hover:text-white group"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-white rounded-r" />
                )}
                {item.icon(isActive)}
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

        <div className="mt-auto border-t border-[#24344F] p-3">
          <Link href={"/settings" as Route} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.06] transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#24344F] bg-[#0d1322]">
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
