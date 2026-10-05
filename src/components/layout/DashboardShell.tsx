"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { MobileTabBar, phoneNavHidden } from "./MobileTabBar";
import { useAuthStore } from "@/stores/authStore";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname() || "";
  const showPhoneNav = !phoneNavHidden(pathname);

  // While the drawer is open the page behind it must not scroll: on a phone
  // the drag otherwise moves the page, and the drawer appears to be stuck.
  useEffect(() => {
    if (!sidebarOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-[100dvh] bg-bg text-ink">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        user={{
          name: user?.full_name || "Trader Account",
          email: user?.email || "demo@fxnod.io"
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <TopNav onMenu={() => setSidebarOpen(true)} />
        <main
          className={cn(
            "min-w-0 flex-1 bg-bg",
            showPhoneNav && "pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0",
          )}
        >
          {children}
        </main>
        {showPhoneNav && <MobileTabBar />}
      </div>
    </div>
  );
}
