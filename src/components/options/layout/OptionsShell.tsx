"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";

/**
 * Top-level layout for /options.
 *
 * Strict Flexbox — NO CSS Grid:
 *   [icon sidebar flex-none 76px]
 *   [main col flex-1]
 *     [topbar flex-none 64px]
 *     [content row flex-1]
 *       [drawer flex-none 0↔drawerWidth]   ← left panel
 *       [chart  flex-1 min-w-0]            ← compresses between the two panels
 *       [order  flex-none orderWidth]      ← right panel
 *
 * The wrapper carries `data-app="options"` so the scoped CSS-variable tokens
 * (--opt-bg, --opt-ink, --opt-rise, …) take effect inside this subtree only.
 */
interface OptionsShellProps {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  main: React.ReactNode;
  order: React.ReactNode;
  /** Positions drawer content — rendered in the (clipped) drawer column. */
  drawer?: React.ReactNode;
  /** Open state drives the drawer column width animation. */
  drawerOpen?: boolean;
  /** Light = default, "dark" flips the scoped dark tokens. */
  theme?: "light" | "dark";
}

export function OptionsShell({
  sidebar,
  topbar,
  main,
  order,
  drawer,
  drawerOpen = false,
  theme: themeProp,
}: OptionsShellProps) {
  const [theme, _setTheme] = useState<"light" | "dark">(themeProp ?? "light");

  return (
    <div
      data-app="options"
      data-opt-theme={theme}
      className={cn(
        "fixed inset-0 flex flex-row overflow-hidden bg-opt-bg font-sans text-opt-ink"
      )}
    >
      {/* ── Icon Sidebar (flex-none) ── */}
      <div className="flex-none w-[76px] h-full relative z-50 border-r border-opt-line bg-opt-bg-elev">
        {sidebar}
      </div>

      {/* ── Main Column: Topbar + Content Row ── */}
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="relative z-40 h-[64px] flex-shrink-0 border-b border-opt-line bg-opt-bg-elev">
          {topbar}
        </div>

        {/* ── Content Row: Left Drawer | Chart | Right Order ── */}
        <div className="flex flex-row flex-1 min-h-0 w-full overflow-hidden">

          {/* Left Drawer Panel (flex-none) */}
          <div
            className={cn(
              "flex-none h-full relative z-20 bg-opt-bg overflow-hidden",
              drawerOpen ? "w-[280px] border-r border-opt-line" : "w-0"
            )}
            style={{ transition: "width 300ms ease-out" }}
          >
            <div className="w-full h-full overflow-hidden min-w-[280px]">
              {drawer}
            </div>
          </div>

          {/* Chart Area (flex-1 min-w-0) — NEVER absolute, NEVER hardcoded width */}
          <div className="flex-1 min-w-0 h-full relative z-10 overflow-hidden">
            {main}
          </div>

          {/* Right Order Panel (flex-none) */}
          <div className="flex-none h-full w-[280px] relative z-20 bg-opt-bg-elev border-l border-opt-line flex flex-col">
            {order}
          </div>

        </div>
      </div>
    </div>
  );
}
