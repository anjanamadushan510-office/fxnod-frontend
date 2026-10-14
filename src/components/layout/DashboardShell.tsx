"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { MobileTabBar, phoneNavHidden } from "./MobileTabBar";
import { ScrollProgressButton } from "./ScrollProgressButton";
import { AuthGate } from "@/components/auth/AuthGate";
import { useAuthStore } from "@/stores/authStore";

/**
 * The signed-in frame: sidebar, top bar, phone tab bar. It is drawn only for
 * a signed-in user; see AuthGate. It used to draw for anyone, with a made-up
 * name and address in the sidebar and a sign-out button beside them.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <Shell>{children}</Shell>
    </AuthGate>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
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

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setSidebarOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <div className="workspace-shell flex min-h-[100dvh] bg-bg text-ink">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        user={{
          name: user?.full_name || user?.email || "",
          email: user?.email || "",
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <TopNav onMenu={() => setSidebarOpen(true)} />
        <main
          className={cn(
            "workspace-canvas min-w-0 flex-1 bg-bg",
            showPhoneNav && "pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0",
          )}
        >
          {children}
        </main>
        {!phoneNavHidden(pathname) && !["/wallet", "/transfer"].some((route) => pathname.startsWith(route)) && (
          <ScrollProgressButton pathname={pathname} />
        )}
        {showPhoneNav && <MobileTabBar onMenu={() => setSidebarOpen(true)} menuOpen={sidebarOpen} />}
      </div>
    </div>
  );
}
