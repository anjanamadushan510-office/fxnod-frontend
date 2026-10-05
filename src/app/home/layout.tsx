/**
 * Layout for the `/home` route group.
 *
 * The shell owns the TopNav, the Sidebar and the phone tab bar, so every
 * dashboard route gets the same navigation.
 */
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
