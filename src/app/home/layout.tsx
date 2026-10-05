/**
 * Layout for the `/home` route.
 * Sidebar, top bar, and the phone tab bar live in DashboardShell.
 */
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
