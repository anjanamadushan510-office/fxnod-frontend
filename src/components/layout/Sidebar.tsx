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
  rightElement?: React.ReactNode;
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
    { key: "home", label: "Home", icon: <HomeIcon className="h-4 w-4" />, href: "/home" },
    { key: "tools", label: "Tools", icon: <AppsGridIcon className="h-4 w-4" />, href: "/tools" },
    { key: "subscriptions", label: "Subscriptions", icon: <FolderIcon className="h-4 w-4" />, href: "/subscriptions" },
    { key: "venues", label: "Venues", icon: <InfoIcon className="h-4 w-4" />, href: "/venues" },
  ];

  const ACCOUNT_LINKS: NavItem[] = [
    { 
      key: "wallet", 
      label: "Wallet", 
      icon: <FolderIcon className="h-4 w-4" />, 
      href: "/wallet",
      rightElement: <span className="text-[11px] font-semibold text-white">{fmtUSD(balance)}</span>
    },
    { key: "transfer", label: "Transfer", icon: <OptionsIcon className="h-4 w-4" />, href: "/transfer" },
    { key: "partners", label: "Partners", icon: <UserIcon className="h-4 w-4" />, href: "/partners" },
    { key: "settings", label: "Settings", icon: <OptionsIcon className="h-4 w-4" />, href: "/settings" },
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
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-ink transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center border-b border-line px-6 lg:hidden">
          <span className="text-[15px] font-extrabold tracking-widest text-gold">FXNOD</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-6">
            <h3 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-ink-3">
              Terminal
            </h3>
            <NavList items={TERMINAL_LINKS} pathname={pathname} onClose={onClose} />
          </div>

          <div>
            <h3 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-ink-3">
              Account
            </h3>
            <NavList items={ACCOUNT_LINKS} pathname={pathname} onClose={onClose} />
          </div>
        </div>

        <div className="border-t border-line bg-surface px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-ink">
              <img src="/assets/fxnod-mark.png" alt="FXNOD" className="h-5 w-5 object-contain" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-semibold text-white">{user.name}</span>
              <span className="truncate text-[11px] text-ink-3">{user.email}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavList({
  items,
  pathname,
  onClose,
}: {
  items: NavItem[];
  pathname: string;
  onClose?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.key}
            href={item.href as Route}
            onClick={onClose}
            className={cn(
              "group relative flex items-center justify-between rounded-lg px-3 py-2 transition-colors",
              isActive ? "bg-surface-2" : "hover:bg-surface-2"
            )}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-sm bg-gold" />
            )}
            <div className="flex items-center gap-3">
              <span className={cn("transition-colors", isActive ? "text-gold" : "text-ink-3 group-hover:text-ink-2")}>
                {item.icon}
              </span>
              <span className={cn("text-sm font-medium transition-colors", isActive ? "text-white" : "text-ink-2 group-hover:text-white")}>
                {item.label}
              </span>
            </div>
            {item.rightElement && <div>{item.rightElement}</div>}
          </Link>
        );
      })}
    </nav>
  );
}
