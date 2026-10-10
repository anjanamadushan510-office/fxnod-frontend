"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DepositModal } from "@/components/home/DepositModal";
import { DashboardMetrics } from "@/components/home/DashboardMetrics";
import { DashboardQuickActions } from "@/components/home/DashboardQuickActions";
import { DashboardActivity } from "@/components/home/DashboardActivity";
import { trackDashboardView } from "@/lib/analytics";

export default function HomePage() {
  const router = useRouter();
  const [showDepositModal, setShowDepositModal] = useState(false);

  // This page is mounted only for a signed-in user (AuthGate), so this counts
  // people who reached their dashboard, not requests for its address.
  useEffect(() => {
    trackDashboardView();
  }, []);

  return (
    <>
      <section data-view="hub" className="space-y-4 p-4 lg:p-8">
        <DashboardMetrics 
          onTopUp={() => setShowDepositModal(true)} 
          onSend={() => router.push("/transfer")} 
        />
        <DashboardQuickActions />
        <DashboardActivity />
      </section>

      {showDepositModal && (
        <DepositModal onClose={() => setShowDepositModal(false)} />
      )}
    </>
  );
}
