"use client";

import { AlertTriangle } from "lucide-react";
import { useGetMaintenanceStatus } from "@/services/api/endpoints/system/system";

export function MaintenanceBanner() {
  const { data } = useGetMaintenanceStatus({
    query: {
      refetchInterval: 30_000,
      refetchOnWindowFocus: true,
      retry: false,
    },
  });

  if (!data?.enabled) return null;

  return (
    <div role="status" aria-live="polite" className="border-b border-amber-400/40 bg-amber-400 px-4 py-3 text-center text-sm font-semibold text-slate-950">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-2">
        <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0" />
        <span>FXNOD maintenance is in progress. Some features may be temporarily unavailable.</span>
      </div>
    </div>
  );
}
