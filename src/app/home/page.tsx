"use client";

import { useState } from "react";
import { DepositModal } from "@/components/home/DepositModal";
import { DashboardMetrics } from "@/components/home/DashboardMetrics";
import { DashboardQuickActions } from "@/components/home/DashboardQuickActions";
import { DashboardActivity } from "@/components/home/DashboardActivity";
import { MobileTabBar } from "@/components/layout/MobileTabBar";

export default function HomePage() {
  const [showDepositModal, setShowDepositModal] = useState(false);

  return (
    <>
      <section data-view="hub" className="p-4 lg:p-8 space-y-6 pb-24 lg:pb-8 max-w-[1280px] mx-auto min-h-full">
        <div className="flex flex-col gap-6">
          <DashboardMetrics 
            onTopUp={() => setShowDepositModal(true)} 
            onSend={() => {}} 
          />
          <DashboardQuickActions />
          <DashboardActivity />
        </div>
      </section>

      <MobileTabBar active="home" onSelect={() => {}} />
      
      {showDepositModal && (
        <DepositModal onClose={() => setShowDepositModal(false)} />
      )}
    </>
  );
}
