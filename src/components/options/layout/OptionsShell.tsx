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
  const [orderWidth, setOrderWidth] = useState(340);
  const [isResizing, setIsResizing] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(360);
  const [isResizingDrawer, setIsResizingDrawer] = useState(false);

  // ── Hydrate persisted widths (client-only to avoid SSR mismatch) ──────────
  useEffect(() => {
    const savedOrder = localStorage.getItem("fxnod_right_panel_width");
    if (savedOrder) setOrderWidth(Number(savedOrder));
    const savedDrawer = localStorage.getItem("fxnod_left_drawer_width");
    if (savedDrawer) setDrawerWidth(Number(savedDrawer));
  }, []);

  // ── Right panel resizer ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e: MouseEvent) => {
      let w = window.innerWidth - e.clientX;
      if (w < 280) w = 280;
      if (w > 500) w = 500;
      setOrderWidth(w);
    };
    const onUp = (e: MouseEvent) => {
      // Persist the final width so it survives a page reload.
      const w = window.innerWidth - e.clientX;
      const clamped = Math.min(500, Math.max(280, w));
      localStorage.setItem("fxnod_right_panel_width", String(clamped));
      setIsResizing(false);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isResizing]);

  // ── Left drawer resizer ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isResizingDrawer) return;
    const onMove = (e: MouseEvent) => {
      let w = e.clientX - 76; // 76px = icon sidebar width
      if (w < 250) w = 250;
      if (w > 500) w = 500;
      setDrawerWidth(w);
    };
    const onUp = (e: MouseEvent) => {
      // Persist the final width so it survives a page reload.
      const w = e.clientX - 76;
      const clamped = Math.min(500, Math.max(250, w));
      localStorage.setItem("fxnod_left_drawer_width", String(clamped));
      setIsResizingDrawer(false);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isResizingDrawer]);

  return (
    <div
      data-app="options"
      data-opt-theme={theme}
      className={cn(
        "fixed inset-0 flex flex-row overflow-hidden bg-opt-bg font-sans text-opt-ink",
        (isResizing || isResizingDrawer) && "cursor-col-resize select-none"
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
              drawerOpen && "border-r border-opt-line"
            )}
            style={{
              width: drawerOpen ? drawerWidth : 0,
              transition: isResizingDrawer ? "none" : "width 300ms ease-out",
            }}
          >
            {drawerOpen && (
              <div
                onMouseDown={(e) => { e.preventDefault(); setIsResizingDrawer(true); }}
                className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize z-30 hover:bg-opt-ink/10 transition-colors"
              />
            )}
            <div className="w-full h-full overflow-hidden" style={{ minWidth: drawerOpen ? 250 : 0 }}>
              {drawer}
            </div>
          </div>

          {/* Chart Area (flex-1 min-w-0) — NEVER absolute, NEVER hardcoded width */}
          <div className="flex-1 min-w-0 h-full relative z-10 overflow-hidden">
            {main}
          </div>

          {/* Right Order Panel (flex-none) */}
          <div
            className="flex-none h-full relative z-20 bg-opt-bg-elev border-l border-opt-line flex flex-col"
            style={{
              width: orderWidth,
              transition: isResizing ? "none" : "width 300ms ease-out",
            }}
          >
            <div
              onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
              className="absolute -left-1.5 top-0 bottom-0 w-3 cursor-col-resize z-30 hover:bg-opt-ink/10 transition-colors"
            />
            {order}
          </div>

        </div>
      </div>
    </div>
  );
}
