"use client";

import type { Route } from "next";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/cn";

export function AdminTile() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);

  // Avoid hydration mismatch by waiting for auth status
  if (status === "loading" || status === "idle") return null;
  if (user?.role !== "admin") return null;

  return (
    <Link
      href={"/admin/dashboard" as Route}
      className={cn(
        "flex min-h-[230px] flex-col items-start gap-4 rounded-2xl border border-line",
        "bg-surface p-6 shadow-card",
        "transition-[transform,box-shadow,border-color] duration-150",
        "hover:-translate-y-0.5 hover:border-gold hover:shadow-nav",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      )}
    >
      <div
        className={cn(
          "grid h-14 w-14 place-items-center rounded-full",
          "bg-[linear-gradient(180deg,var(--navy),var(--navy-3))] text-gold",
          "shadow-[inset_0_0_0_2.5px_var(--gold),0_0_0_4px_rgba(201,162,78,0.15)]"
        )}
      >
        <ShieldAlert className="h-7 w-7" />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <h2 className="m-0 text-[19px] font-bold tracking-[-0.01em] text-ink">
            Admin
          </h2>
          <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-semibold text-gold-3">
            Management
          </span>
        </div>
        <p className="m-0 text-[13px] leading-relaxed text-ink-3">
          Manage registered users, view account status, and control platform access.
        </p>
      </div>

      <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold-3">
        Open Admin
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
