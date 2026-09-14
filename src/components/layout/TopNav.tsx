"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
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
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#24344F] bg-[#080C16] px-4 lg:px-8">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Menu"
          className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-zinc-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
        >
          <MenuIcon className="h-4 w-4" />
        </button>

        <div className="flex flex-col">
          <h1 className="font-display text-lg font-semibold text-white leading-tight">
            {title}
          </h1>
          <div className="text-xs text-zinc-400">
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
    <div className="hidden items-center gap-2 rounded-full border border-[#24344F] bg-[#101827] px-3 py-1.5 sm:flex">
      <div className="relative flex h-2 w-2 items-center justify-center">
        <span className="pulse-dot absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400"></span>
      </div>
      <span className="text-[11px] font-medium tracking-wide text-zinc-400">
        Live &bull; <span className="tabular-nums text-zinc-300">{timeStr}</span>
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
    },
    {
      id: "2",
      title: "dBot is live",
      message: "Running on Deriv - markup API",
      timestamp: "Today 09:14",
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
          "relative grid h-9 w-9 place-items-center rounded-lg border border-[#24344F] transition-colors",
          open ? "bg-white/5 text-white" : "bg-[#101827] text-zinc-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <BellIcon className="h-4 w-4" />
        {hasUnread && (
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_0_2px_var(--ink)]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#101827] border border-[#24344F] rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="px-5 py-4 border-b border-[#24344F] flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-sm font-semibold text-white">Notifications</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Account activity</p>
            </div>
            {hasUnread && (
              <button
                onClick={() => {
                  setNotifications([]);
                  toast.success("Marked as read");
                }}
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Mark read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto divide-y divide-[#24344F]">
            {!hasUnread ? (
              <div className="py-8 text-center text-sm text-zinc-500">No new notifications</div>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 px-5 py-3.5 hover:bg-zinc-800/20 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{item.message}</p>
                  </div>
                  <p className="text-[11px] text-zinc-500 shrink-0 whitespace-nowrap">{item.timestamp}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
