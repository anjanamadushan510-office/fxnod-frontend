"use client";

import { useState } from "react";
import { DepositModal } from "@/components/home/DepositModal";
import { DashboardMetrics } from "@/components/home/DashboardMetrics";
import { DashboardQuickActions } from "@/components/home/DashboardQuickActions";
import { DashboardActivity } from "@/components/home/DashboardActivity";

export default function HomePage() {
  const [showDepositModal, setShowDepositModal] = useState(false);

  return (
    <>
      <section data-view="hub" className="space-y-4 p-4 lg:p-8">
        <DashboardMetrics 
          onTopUp={() => setShowDepositModal(true)} 
          onSend={() => {}} 
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
