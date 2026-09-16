"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { BellIcon, MenuIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

// Helper for dynamic title
function getRouteTitle(pathname: string) {
  if (pathname.startsWith("/home")) return { title: "Home", subtitle: "dTrader · dBot on Deriv" };
  if (pathname.startsWith("/tools")) return { title: "Tools", subtitle: "Active Tools" };
  if (pathname.startsWith("/subscriptions")) return { title: "Subscriptions", subtitle: "Manage Subscriptions" };
  if (pathname.startsWith("/venues")) return { title: "Venues", subtitle: "Live APIs" };
  if (pathname.startsWith("/wallet")) return { title: "Wallet", subtitle: "Wallet & Funds" };
  if (pathname.startsWith("/transfer")) return { title: "Transfer", subtitle: "Transfer Funds" };
  if (pathname.startsWith("/partner/dashboard")) return { title: "Partner", subtitle: "Partner Program" };
  if (pathname.startsWith("/settings")) return { title: "Settings", subtitle: "Account Settings" };
  return { title: "Home", subtitle: "dTrader · dBot on Deriv" };
}

interface TopNavProps {
  onMenu?: () => void;
}

export function TopNav({ onMenu }: TopNavProps) {
  const pathname = usePathname();
  const { title, subtitle } = getRouteTitle(pathname || "/home");

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-surface px-4 lg:px-8">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Menu"
          className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink lg:hidden"
        >
          <MenuIcon className="h-4 w-4" />
        </button>

        <div className="flex flex-col">
          <h1 className="font-display text-lg font-semibold text-ink leading-tight">
            {title}
          </h1>
          <div className="text-xs text-ink-2">
            {subtitle}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <LiveClock />
        <NotificationsDropdown />
      </div>
    </header>
  );
}

function LiveClock() {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTimeStr(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZoneName: "short",
        }).format(new Date())
      );
    };
    updateTime(); // Initial
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 sm:flex">
      <div className="relative flex h-2 w-2 items-center justify-center">
        <span className="pulse-dot absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400"></span>
      </div>
      <span className="text-[11px] font-medium tracking-wide text-ink-2">
        Live &bull; <span className="tabular-nums text-ink-2">{timeStr}</span>
      </span>
    </div>
  );
}

function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  // Mock state since there is no backend hook yet
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "System Update",
      message: "Your trading account is fully verified and ready.",
      timestamp: "Just now",
      url: "",
    },
    {
      id: "2",
      title: "dBot is live",
      message: "Running on Deriv · markup API",
      timestamp: "Today 09:14",
      url: "/tools",
    },
    {
      id: "3",
      title: "dTrader ready",
      message: "Volatility 75 · Deriv",
      timestamp: "Today 08:02",
      url: "/tools",
    },
    {
      id: "4",
      title: "Deriv connected",
      message: "Token synced · last check 8s ago",
      timestamp: "Today 08:02",
      url: "",
    },
    {
      id: "5",
      title: "Partner payout",
      message: "$42.10 settled to your wallet",
      timestamp: "2 Sep",
      url: "/partner/dashboard",
    },
  ]);

  const hasUnread = notifications.length > 0;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "relative grid h-9 w-9 place-items-center rounded-lg border border-line transition-colors",
          open ? "bg-surface-2 text-ink" : "bg-surface text-ink-2 hover:bg-surface-2 hover:text-ink"
        )}
      >
        <BellIcon className="h-4 w-4" />
        {hasUnread && (
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_0_2px_var(--ink)]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-surface border border-line rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-sm font-semibold text-ink">Notifications</h3>
              <p className="text-xs text-ink-3 mt-0.5">Account activity</p>
            </div>
            {hasUnread && (
              <button
                onClick={() => {
                  setNotifications([]);
                  toast.success("Marked as read");
                }}
                className="text-xs text-ink-2 hover:text-ink transition-colors"
              >
                Mark read
              </button>
            )}
          </div>
          
          <div className="max-h-[320px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] divide-y divide-[#24344F]">
            {!hasUnread ? (
              <div className="py-8 text-center text-sm text-ink-3">No new notifications</div>
            ) : (
              notifications.map((item) => {
                if (item.url) {
                  return (
                    <Link
                      key={item.id}
                      href={item.url as any}
                      onClick={() => setOpen(false)}
                      className="flex items-start justify-between gap-3 px-5 py-3 hover:bg-surface-2 transition-colors cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                        <p className="text-xs text-ink-3 mt-0.5 line-clamp-2">{item.message}</p>
                      </div>
                      <p className="text-[11px] text-ink-3 shrink-0 whitespace-nowrap">{item.timestamp}</p>
                    </Link>
                  );
                } else {
                  return (
                    <div
                      key={item.id}
                      onClick={() => setOpen(false)}
                      className="flex items-start justify-between gap-3 px-5 py-3 hover:bg-surface-2 transition-colors cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                        <p className="text-xs text-ink-3 mt-0.5 line-clamp-2">{item.message}</p>
                      </div>
                      <p className="text-[11px] text-ink-3 shrink-0 whitespace-nowrap">{item.timestamp}</p>
                    </div>
                  );
                }
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
