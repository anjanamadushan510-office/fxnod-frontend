"use client";

import { useState } from "react";
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

  return (
    <div className="flex min-h-screen bg-bg text-ink">
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
            showPhoneNav && "pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0",
          )}
        >
          {children}
        </main>
        {showPhoneNav && <MobileTabBar />}
      </div>
    </div>
  );
}
