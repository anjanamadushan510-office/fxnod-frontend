import { SiteFooter } from "@/components/layout/SiteFooter";
import { TopNav } from "@/components/layout/TopNav";

/**
 * Chrome for the account-level pages — the ones about who you are and what you
 * are owed, rather than about trading. Same shell as /subscriptions, so moving
 * between them does not feel like changing product.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f6f0]">
      <TopNav />
      {children}
      <SiteFooter />
    </div>
  );
}
