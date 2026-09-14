"use client";

import { useState } from "react";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Watermark } from "@/components/layout/Watermark";
import { AccountsSection } from "@/components/home/AccountsSection";
import { ExploreMarkets } from "@/components/home/ExploreMarkets";
import { Highlights } from "@/components/home/Highlights";
import { MobileBanner } from "@/components/home/MobileBanner";
import { TotalValueCard } from "@/components/home/TotalValueCard";
import { DepositModal } from "@/components/home/DepositModal";

export default function HomePage() {
  const [showDepositModal, setShowDepositModal] = useState(false);

  return (
    <>
      <div className="relative mx-auto flex max-w-[1080px] flex-col gap-9 px-4 pb-[100px] pt-[18px] lg:px-8 lg:pb-20 lg:pt-7">
        <Watermark intensity={0.28} />

        {/* Every direct child sits above the watermark. */}
        <div className="relative z-10 flex flex-col gap-8">
          <TotalValueCard onDeposit={() => setShowDepositModal(true)} />
          <AccountsSection />
          <ExploreMarkets />
          <Highlights />
          <MobileBanner />
        </div>
      </div>

      <MobileTabBar active="home" onSelect={() => {}} />
      
      {showDepositModal && (
        <DepositModal onClose={() => setShowDepositModal(false)} />
      )}
    </>
  );
}
