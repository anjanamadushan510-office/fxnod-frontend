"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DepositModal } from "@/components/home/DepositModal";
import { DashboardMetrics } from "@/components/home/DashboardMetrics";
import { DashboardQuickActions } from "@/components/home/DashboardQuickActions";
import Link from "next/link";
import { DashboardAccounts } from "@/components/home/DashboardAccounts";
import { DashboardFavourites } from "@/components/home/DashboardFavourites";
import { useAuthStore } from "@/stores/authStore";
import { DashboardActivity } from "@/components/home/DashboardActivity";
import { trackDashboardView } from "@/lib/analytics";

export default function HomePage() {
  const router = useRouter();
  const name = useAuthStore(
    (state) => state.user?.full_name?.trim().split(/\s+/)[0],
  );
  const [showDepositModal, setShowDepositModal] = useState(false);

  // This page is mounted only for a signed-in user (AuthGate), so this counts
  // people who reached their dashboard, not requests for its address.
  useEffect(() => {
    trackDashboardView();
  }, []);

  return (
    <>
      <section data-view="hub" className="space-y-4 p-4 lg:space-y-5 lg:p-6">
        <header className="workspace-hero flex items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink sm:text-2xl">
              {name ? `${name}’s workspace` : "Your trading workspace"}
            </h2>
            <p className="mt-1 hidden text-sm text-ink-2 sm:block">
              Accounts, active runs and tools at a glance.
            </p>
          </div>
          <Link
            href="/tools"
            className="min-h-11 px-3 sm:px-4 rounded-lg border border-line text-xs sm:text-sm text-ink flex items-center justify-center shrink-0 hover:bg-surface-2"
          >
            <span className="sm:hidden">Explore</span><span className="hidden sm:inline">Explore packages</span>
          </Link>
        </header>
        <DashboardMetrics
          onTopUp={() => setShowDepositModal(true)}
          onSend={() => router.push("/transfer")}
        />
        <DashboardAccounts />
        <DashboardActivity />
        <DashboardQuickActions />
        <DashboardFavourites />
      </section>

      {showDepositModal && (
        <DepositModal onClose={() => setShowDepositModal(false)} />
      )}
    </>
  );
}
