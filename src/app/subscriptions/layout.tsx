import { DashboardShell } from "@/components/layout/DashboardShell";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function SubscriptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      {children}
      <SiteFooter />
    </DashboardShell>
  );
}
