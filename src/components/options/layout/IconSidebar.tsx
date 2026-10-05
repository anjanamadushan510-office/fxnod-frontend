"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useDerivStatus, derivStatusKey } from "@/hooks/useDerivStatus";
import { useDerivUnlink } from "@/services/api/endpoints/trading/trading";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AppsGridIcon,
  ClockIcon,
  DocIcon,
  GlobeIcon,
  HelpIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  /** Optional red badge count (positions). */
  badge?: number | string;
  /**
   * Override the default click handler. If set, the item renders as a
   * <button> regardless of `href`.
   */
  onClick?: () => void;
  /**
   * Override the computed active state (used when active is controlled by
   * a parent — e.g. PositionsDrawer open ↔ positions row active).
   */
  controlledActive?: boolean;
  /** Whether the href is an external link. */
  external?: boolean;
  /** Caption under the icon in the phone tab bar; defaults to `label`. */
  shortLabel?: string;
}

interface IconSidebarProps {
  /** "DT" / "FX" / etc — first two letters shown in the brand block. */
  brandInitials?: string;
  positionsBadge?: number;
  positionsOpen?: boolean;
  onPositionsToggle?: () => void;
  theme?: "light" | "dark";
  onThemeToggle?: () => void;
  reportsOpen?: boolean;
  onReportsToggle?: () => void;
}

/**
 * Vertical icon-only rail (Vela style). Each row is a self-contained
 * button/link so future tooltips / context menus only re-render their own
 * subtree.
 *
 * Below lg the same items lay out as a bottom tab bar with captions: an
 * icon-only rail relies on hover tooltips, which a touch screen does not have.
 *
 * Positions is the one item that doesn't navigate — instead it toggles the
 * PositionsDrawer. The parent owns that open/close flag via
 * `positionsOpen` + `onPositionsToggle`.
 */
export function IconSidebar({
  brandInitials = "DT",
  positionsBadge,
  positionsOpen = false,
  onPositionsToggle,
  theme = "light",
  onThemeToggle,
  reportsOpen = false,
  onReportsToggle,
}: IconSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeKey, setActiveKey] = useState<string>("home");

  // The theme is only known in the browser, so the server and the first client
  // render must agree on one icon; choosing by theme before mount is a
  // hydration mismatch that throws the whole page back to client rendering.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const showSun = mounted && theme === "dark";

  const queryClient = useQueryClient();
  const { linked } = useDerivStatus();
  const unlinkMutation = useDerivUnlink();

  async function disconnectDeriv() {
    const ok = window.confirm(
      "Sign out of Deriv? Running bots will stop, and you will need to connect again before trading."
    );
    if (!ok) return;
    try {
      await unlinkMutation.mutateAsync();
      await queryClient.invalidateQueries({ queryKey: derivStatusKey });
      await queryClient.invalidateQueries();
      toast.success("Signed out of Deriv");
      router.push("/venues");
    } catch {
      toast.error("Could not sign out of Deriv. Please try again.");
    }
  }

  const primary: NavItem[] = [
    { key: "apps", label: "Apps", shortLabel: "Dashboard", icon: <AppsGridIcon className="h-[18px] w-[18px]" />, href: "/home" },
    { key: "home", label: "Home", shortLabel: "Options", icon: <HomeIcon className="h-[18px] w-[18px]" />, href: "/options" },
    {
      key: "positions",
      label: "Positions",
      icon: <ClockIcon className="h-[18px] w-[18px]" />,
      badge: positionsBadge,
      onClick: onPositionsToggle,
      controlledActive: positionsOpen,
    },
    {
      key: "reports",
      label: "Reports",
      icon: <DocIcon className="h-[18px] w-[18px]" />,
      onClick: onReportsToggle,
      controlledActive: reportsOpen,
    },
  ];

  const secondary: NavItem[] = [
    { key: "help", label: "Help", icon: <HelpIcon className="h-5 w-5" />, href: "https://deriv.com/help-centre/deriv-trader", external: true },
  ];

  const isActive = (item: NavItem) => {
    if (item.controlledActive !== undefined) return item.controlledActive;
    if (item.href) return pathname?.startsWith(item.href) ?? false;
    return activeKey === item.key;
  };

  return (
    <div className="flex h-full items-stretch justify-around px-1 py-1 lg:flex-col lg:justify-start lg:px-0 lg:py-3.5">
      {/* Brand block */}
      <div className="hidden justify-center px-3 pb-4 lg:flex">
        <div
          className={cn(
            "grid h-7 w-7 place-items-center rounded-lg",
            "bg-opt-ink text-opt-bg",
            "font-semibold text-sm",
          )}
        >
          {brandInitials.slice(0, 2)}
        </div>
      </div>

      <NavRail items={primary} isActive={isActive} onSelect={setActiveKey} />

      <div className="max-lg:contents lg:mt-auto lg:flex lg:flex-col lg:gap-2 lg:pb-8">
        <div className="hidden lg:block">
          <NavRail items={secondary} isActive={isActive} onSelect={setActiveKey} />
        </div>

        <NavButton
          label={showSun ? "Light mode" : "Dark mode"}
          shortLabel="Theme"
          icon={
            showSun ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )
          }
          active={false}
          onClick={onThemeToggle}
        />

        <NavButton
          label="Disconnect Deriv"
          shortLabel="Disconnect"
          icon={<LogOut className="h-5 w-5" />}
          active={false}
          onClick={disconnectDeriv}
        />
      </div>
    </div>
  );
}

function NavRail({
  items,
  isActive,
  onSelect,
}: {
  items: NavItem[];
  isActive: (i: NavItem) => boolean;
  onSelect: (k: string) => void;
}) {
  return (
    <div className="max-lg:contents lg:flex lg:flex-col lg:gap-0.5 lg:px-2">
      {items.map((item) => {
        const active = isActive(item);
        const hasCustomClick = !!item.onClick;
        // A custom onClick beats the href — useful for "Positions" which is a
        // drawer toggle, not a route.
        if (item.href && !hasCustomClick) {
          if (item.external) {
            return (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                title={item.label}
                aria-label={item.label}
                className={cn(navItemClass, active && navItemActive)}
              >
                <span className="relative grid place-items-center">
                  {item.icon}
                  {item.badge && <Badge value={item.badge} />}
                </span>
                <Caption>{item.shortLabel ?? item.label}</Caption>
              </a>
            );
          }
          return (
            <NavLinkBtn
              key={item.key}
              href={item.href}
              label={item.label}
              shortLabel={item.shortLabel}
              icon={item.icon}
              active={active}
              badge={item.badge}
            />
          );
        }
        return (
          <NavButton
            key={item.key}
            label={item.label}
            icon={item.icon}
            active={active}
            badge={item.badge}
            shortLabel={item.shortLabel}
            onClick={() => {
              item.onClick?.();
              onSelect(item.key);
            }}
          />
        );
      })}
    </div>
  );
}

function NavLinkBtn({
  href,
  label,
  icon,
  active,
  badge,
  shortLabel,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  badge?: number | string;
  shortLabel?: string;
}) {
  return (
    <Link
      href={href as Route}
      title={label}
      aria-label={label}
      className={cn(navItemClass, active && navItemActive)}
    >
      <span className="relative grid place-items-center">
        {icon}
        {badge && <Badge value={badge} />}
      </span>
      <Caption>{shortLabel ?? label}</Caption>
    </Link>
  );
}

function NavButton({
  label,
  icon,
  active,
  badge,
  onClick,
  shortLabel,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  badge?: number | string;
  onClick?: () => void;
  shortLabel?: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(navItemClass, active && navItemActive)}
    >
      <span className="relative grid place-items-center">
        {icon}
        {badge && <Badge value={badge} />}
      </span>
      <Caption>{shortLabel ?? label}</Caption>
    </button>
  );
}

/** Tab-bar caption; the desktop rail stays icon-only. */
function Caption({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-medium leading-none lg:hidden">{children}</span>
  );
}

function Badge({ value }: { value: number | string }) {
  return (
    <span
      className={cn(
        "absolute -right-1.5 -top-1.5 grid h-[14px] min-w-[14px] place-items-center rounded-full px-1",
        "bg-opt-fall text-white text-[9px] font-semibold leading-none",
      )}
    >
      {value}
    </span>
  );
}

const navItemClass = cn(
  "flex h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg",
  "lg:mx-auto lg:grid lg:h-10 lg:w-10 lg:flex-none lg:place-items-center",
  "text-opt-ink-3",
  "transition-colors duration-150",
  "hover:bg-opt-bg-sunk hover:text-opt-ink",
);
const navItemActive = "bg-opt-bg-sunk text-opt-ink";
