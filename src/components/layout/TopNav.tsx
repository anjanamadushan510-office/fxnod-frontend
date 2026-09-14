"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { BellIcon, MenuIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

// Helper for dynamic title
function getRouteTitle(pathname: string) {
  if (pathname.startsWith("/home")) return { title: "Dashboard", subtitle: "Overview" };
  if (pathname.startsWith("/tools")) return { title: "Terminal", subtitle: "Active Tools" };
  if (pathname.startsWith("/subscriptions")) return { title: "Terminal", subtitle: "Subscriptions" };
  if (pathname.startsWith("/venues")) return { title: "Terminal", subtitle: "Venues" };
  if (pathname.startsWith("/wallet")) return { title: "Account", subtitle: "Wallet & Funds" };
  if (pathname.startsWith("/transfer")) return { title: "Account", subtitle: "Transfer Funds" };
  if (pathname.startsWith("/partner")) return { title: "Account", subtitle: "Partner Program" };
  if (pathname.startsWith("/settings")) return { title: "Account", subtitle: "Settings" };
  return { title: "Dashboard", subtitle: "Overview" };
}

interface TopNavProps {
  onMenu?: () => void;
}

export function TopNav({ onMenu }: TopNavProps) {
  const pathname = usePathname();
  const { title, subtitle } = getRouteTitle(pathname || "/home");

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-line bg-ink px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Menu"
          className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-ink-3 transition-colors hover:bg-surface-2 lg:hidden"
        >
          <MenuIcon className="h-4 w-4" />
        </button>

        <div className="flex flex-col">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-gold">
            {title}
          </div>
          <h1 className="text-sm font-semibold text-white sm:text-base">
            {subtitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
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
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
      </div>
      <span className="text-xs font-medium text-ink-2">Live • {timeStr}</span>
    </div>
  );
}

function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [hasUnread, setHasUnread] = useState(true);

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
          open ? "bg-surface-2 text-white" : "bg-surface text-ink-3 hover:bg-surface-2"
        )}
      >
        <BellIcon className="h-4 w-4" />
        {hasUnread && (
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_0_2px_#080C16]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-72 overflow-hidden rounded-xl border border-line bg-ink shadow-2xl">
          <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-2">
              Recent Activity
            </span>
            {hasUnread && (
              <button
                onClick={() => {
                  setHasUnread(false);
                  toast.success("Marked as read");
                }}
                className="text-[11px] font-medium text-gold hover:underline"
              >
                Mark read
              </button>
            )}
          </div>
          <div className="flex flex-col p-2 max-h-60 overflow-y-auto">
            {!hasUnread ? (
              <div className="py-6 text-center text-xs text-ink-3">No new notifications</div>
            ) : (
              <div className="flex flex-col gap-1 rounded-lg bg-surface px-3 py-2">
                <span className="text-xs font-medium text-white">System Update</span>
                <span className="text-[11px] text-ink-3">Your trading account is fully verified and ready.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
