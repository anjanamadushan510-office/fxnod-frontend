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
      <section data-view="hub" className="space-y-5 p-4 lg:p-6">
        <header className="workspace-hero flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-ink sm:text-2xl">
              {name ? `${name}’s workspace` : "Your trading workspace"}
            </h2>
            <p className="mt-1 text-sm text-ink-2">
              Accounts, active runs and tools at a glance.
            </p>
          </div>
          <Link
            href="/tools"
            className="min-h-10 px-4 rounded-lg border border-line text-sm text-ink flex items-center justify-center shrink-0 hover:bg-surface-2"
          >
            Explore packages
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
