"use client";

import { useState, useEffect, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Top-level layout for /options.
 *
 * Desktop (lg and up):
 *   [icon sidebar 56px]
 *   [main col flex-1]
 *     [topbar 64px]
 *     [content row]
 *       [drawer 0↔drawerWidth]   ← left panel
 *       [chart  1fr]             ← compresses between the two panels
 *       [order  orderWidth]      ← right panel
 *
 * Phone / tablet (below lg) — the same nodes, stacked:
 *   [topbar: account row + trade-type row]
 *   [chart, a fixed share of the screen]
 *   [order ticket, scrolls]
 *   [icon rail, as a bottom tab bar]
 *   and the positions drawer becomes a full-screen sheet.
 *
 * It is one tree restyled by breakpoint, not two trees chosen in JS: the chart
 * owns a live socket and must not remount when a phone rotates across the
 * breakpoint, and a JS switch would flash the desktop layout before hydration.
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
      let w = e.clientX - 56; // 56px = icon sidebar width
      if (w < 250) w = 250;
      if (w > 500) w = 500;
      setDrawerWidth(w);
    };
    const onUp = (e: MouseEvent) => {
      // Persist the final width so it survives a page reload.
      const w = e.clientX - 56;
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

  // The panel widths reach the grid as custom properties so the column
  // template can live in a breakpoint class; an inline grid-template-columns
  // would also apply on a phone, where it leaves the chart no width at all.
  const contentStyle = {
    "--opt-drawer-w": `${drawerOpen ? drawerWidth : 0}px`,
    "--opt-order-w": `${orderWidth}px`,
    transition:
      isResizingDrawer || isResizing ? "none" : "grid-template-columns 300ms ease-out",
  } as CSSProperties;

  return (
    <div
      data-app="options"
      data-opt-theme={theme}
      className={cn(
        "fixed inset-0 flex flex-col overflow-hidden bg-opt-bg font-sans text-opt-ink lg:flex-row",
        "pt-safe px-safe",
        (isResizing || isResizingDrawer) && "cursor-col-resize select-none"
      )}
    >
      {/* ── Icon rail: left column on desktop, bottom tab bar on a phone ── */}
      <div
        className={cn(
          "relative z-50 flex-none border-opt-line bg-opt-bg-elev",
          "order-last w-full border-t pb-safe",
          "lg:order-none lg:h-full lg:w-14 lg:border-r lg:border-t-0 lg:pb-0",
        )}
      >
        {sidebar}
      </div>

      {/* ── Main Column: Topbar + Content Row ── */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:h-full">

        {/* Topbar */}
        <div className="relative z-40 flex-shrink-0 border-b border-opt-line bg-opt-bg-elev lg:h-[64px]">
          {topbar}
        </div>

        {/* ── Content Row: Left Drawer | Chart | Right Order ── */}
        <div
          className={cn(
            "flex min-h-0 w-full flex-1 flex-col overflow-hidden",
            "lg:grid lg:[grid-template-columns:var(--opt-drawer-w)_minmax(0,1fr)_var(--opt-order-w)]",
          )}
          style={contentStyle}
        >

          {/* Left Drawer Panel — a full-screen sheet below lg */}
          <div
            className={cn(
              "bg-opt-bg overflow-hidden",
              "max-lg:fixed max-lg:inset-0 max-lg:z-[70] max-lg:pt-safe max-lg:pb-safe",
              !drawerOpen && "max-lg:hidden",
              "lg:relative lg:z-20 lg:h-full",
              drawerOpen && "lg:border-r lg:border-opt-line"
            )}
          >
            {drawerOpen && (
              <div
                onMouseDown={(e) => { e.preventDefault(); setIsResizingDrawer(true); }}
                className="absolute right-0 top-0 bottom-0 z-30 hidden w-1.5 cursor-col-resize transition-colors hover:bg-opt-ink/10 lg:block"
              />
            )}
            <div className={cn("h-full w-full overflow-hidden", drawerOpen && "lg:min-w-[250px]")}>
              {drawer}
            </div>
          </div>

          {/* Chart Area — 1fr on desktop, a fixed share of the screen on a phone */}
          <div className="relative z-10 h-[44dvh] min-h-[240px] flex-none overflow-hidden max-lg:has-[[data-sheet]]:z-[80] lg:h-full lg:min-h-0">
            {main}
          </div>

          {/* Order Panel — right column on desktop, below the chart on a phone */}
          <div className="relative z-20 flex min-h-0 flex-1 flex-col border-t border-opt-line bg-opt-bg-elev lg:h-full lg:flex-none lg:border-l lg:border-t-0">
            <div
              onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
              className="absolute -left-1.5 top-0 bottom-0 z-30 hidden w-3 cursor-col-resize transition-colors hover:bg-opt-ink/10 lg:block"
            />
            {order}
          </div>

        </div>
      </div>
    </div>
  );
}
