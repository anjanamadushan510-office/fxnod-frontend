"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DepositModal } from "@/components/home/DepositModal";
import { DashboardMetrics } from "@/components/home/DashboardMetrics";
import { DashboardQuickActions } from "@/components/home/DashboardQuickActions";
import { DashboardActivity } from "@/components/home/DashboardActivity";

export default function HomePage() {
  const router = useRouter();
  const [showDepositModal, setShowDepositModal] = useState(false);

  return (
    <>
      <section data-view="hub" className="p-4 lg:p-8 space-y-4 pb-4">
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
