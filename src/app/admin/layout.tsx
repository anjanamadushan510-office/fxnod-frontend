"use client";

import type { Route } from "next";
import { useAuthStore } from "@/stores/authStore";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "anonymous" || (status === "authenticated" && user?.role !== "admin")) {
      router.push("/" as Route);
    }
  }, [user, status, router]);

  if (!mounted || status === "loading" || status === "idle") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return null; // Will redirect shortly
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href={"/admin/dashboard" as Route} className="flex items-center gap-2 hover:opacity-80">
            <ShieldAlert className="h-6 w-6 text-indigo-600" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              FXNOD <span className="font-medium text-gray-500">Admin Dashboard</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium">{user.email}</span>
          <Link 
            href={"/options" as Route} 
            className="rounded-full bg-gray-100 px-4 py-2 font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Exit Admin
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
