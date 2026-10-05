"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";

/**
 * Top-level layout for /options.
 *
 * Strict Flexbox — NO CSS Grid:
 *   [icon sidebar flex-none 56px]
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

  return (
    <div
      data-app="options"
      data-opt-theme={theme}
      className={cn(
        "fixed inset-0 flex flex-col overflow-hidden bg-opt-bg font-sans text-opt-ink lg:flex-row",
        (isResizing || isResizingDrawer) && "cursor-col-resize select-none"
      )}
    >
      {/* Icon rail: a bottom bar on a phone, a left column on a wide screen. */}
      <div className="order-last flex h-14 w-full shrink-0 items-center overflow-x-auto border-t border-opt-line bg-opt-bg-elev pb-[env(safe-area-inset-bottom)] lg:order-none lg:h-full lg:w-14 lg:flex-none lg:items-stretch lg:overflow-visible lg:border-r lg:border-t-0 lg:pb-0">
        {sidebar}
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-40 h-14 shrink-0 border-b border-opt-line bg-opt-bg-elev lg:h-16">
          {topbar}
        </div>

        {/* Phone: chart, then the ticket. Wide: drawer | chart | ticket. */}
        <div
          className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden lg:grid"
          style={{
            gridTemplateColumns: `${drawerOpen ? drawerWidth : 0}px minmax(0, 1fr) ${orderWidth}px`,
            transition: (isResizingDrawer || isResizing) ? "none" : "grid-template-columns 300ms ease-out",
          }}
        >
            <div
              className={cn(
                "z-20 overflow-hidden bg-opt-bg",
                "max-lg:absolute max-lg:inset-0",
                drawerOpen ? "max-lg:block" : "max-lg:hidden",
                "lg:relative lg:block lg:h-full",
                drawerOpen && "lg:border-r lg:border-opt-line",
              )}
            >
              {drawerOpen && (
                <div
                  onMouseDown={(e) => { e.preventDefault(); setIsResizingDrawer(true); }}
                  className="absolute right-0 top-0 bottom-0 z-30 hidden w-1.5 cursor-col-resize hover:bg-opt-ink/10 lg:block"
                />
              )}
              <div className="h-full w-full overflow-auto lg:overflow-hidden" style={{ minWidth: drawerOpen ? undefined : 0 }}>
                {drawer}
              </div>
            </div>

            <div className="relative z-10 min-h-[180px] flex-1 overflow-hidden lg:h-full lg:min-h-0">
              {main}
            </div>

            <div className="relative z-20 flex max-h-[46vh] shrink-0 flex-col overflow-y-auto border-t border-opt-line bg-opt-bg-elev lg:h-full lg:max-h-none lg:overflow-hidden lg:border-l lg:border-t-0">
              <div
                onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
                className="absolute -left-1.5 top-0 bottom-0 z-30 hidden w-3 cursor-col-resize hover:bg-opt-ink/10 lg:block"
              />
              {order}
            </div>
        </div>
      </div>
    </div>
  );
}
