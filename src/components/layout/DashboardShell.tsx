"use client";

import { useState } from "react";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { useAuthStore } from "@/stores/authStore";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

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
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav onMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden bg-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
