"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { useGetMaintenanceStatus } from "@/services/api/endpoints/system/system";

export function MaintenanceBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const { data } = useGetMaintenanceStatus({
    query: {
      refetchInterval: 30_000,
      refetchOnWindowFocus: true,
      retry: false,
    },
  });

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--maintenance-banner-height",
        `${banner.getBoundingClientRect().height}px`,
      );
    };
    const observer = new ResizeObserver(updateHeight);
    observer.observe(banner);
    updateHeight();

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--maintenance-banner-height");
    };
  }, [data?.enabled]);

  if (!data?.enabled) return null;

  return (
    <div ref={bannerRef} role="status" aria-live="polite" className="border-b border-amber-400/40 bg-amber-400 px-4 py-3 text-center text-sm font-semibold text-slate-950">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-2">
        <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0" />
        <span>FXNOD maintenance is in progress. Some features may be temporarily unavailable.</span>
      </div>
    </div>
  );
}
