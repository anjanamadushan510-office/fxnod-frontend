import { PartnerTabs } from "@/components/partner/PartnerTabs";

export default function PartnerHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PartnerTabs />
      {children}
    </>
  );
}
