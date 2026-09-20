"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";

/**
 * Top-level layout for /options.
 *
 * 4-column grid: [icon sidebar 76] [positions drawer 0↔360] [chart 1fr]
 * [order panel 340]. The drawer column animates between 0 and 360px, so the
 * chart (1fr) **compresses** smoothly instead of being overlaid — and the
 * LiveChart ResizeObserver fires throughout the transition to resize the
 * canvas.
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
  // Theme as local state so the sidebar's sun/moon toggle can flip it later.
  const [theme, _setTheme] = useState<"light" | "dark">(themeProp ?? "light");
  const [orderWidth, setOrderWidth] = useState(340);
  const [isResizing, setIsResizing] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(360);
  const [isResizingDrawer, setIsResizingDrawer] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleDrawerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingDrawer(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      let newWidth = window.innerWidth - e.clientX;
      if (newWidth < 280) newWidth = 280;
      if (newWidth > 500) newWidth = 500;
      setOrderWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    if (!isResizingDrawer) return;

    const handleMouseMove = (e: MouseEvent) => {
      let newWidth = e.clientX - 76;
      if (newWidth < 250) newWidth = 250;
      if (newWidth > 500) newWidth = 500;
      setDrawerWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingDrawer(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingDrawer]);

  return (
    <div
      data-app="options"
      data-opt-theme={theme}
      style={{
        gridTemplateColumns: drawerOpen
          ? `76px ${drawerWidth}px 1fr ${orderWidth}px`
          : `76px 0px 1fr ${orderWidth}px`,
      }}
      className={cn(
        "fixed inset-0 grid overflow-hidden",
        // rows: topbar 64 / rest
        "grid-rows-[64px_1fr]",
        // cols: sidebar 76 / drawer 0↔360 / chart 1fr / order 340 — animated.
        !(isResizing || isResizingDrawer) && "transition-[grid-template-columns] duration-300 ease-out",
        "bg-opt-bg font-sans text-opt-ink",
        (isResizing || isResizingDrawer) && "cursor-col-resize select-none"
      )}
    >
      {/* Sidebar — spans both rows */}
      <div className="row-span-2 border-r border-opt-line bg-opt-bg-elev">
        {sidebar}
      </div>

      {/* Top bar — spans drawer + chart + order columns (left edge fixed at 76) */}
      <div className="col-start-2 col-span-3 row-start-1 border-b border-opt-line bg-opt-bg-elev">
        {topbar}
      </div>

      {/* Positions drawer column — clipped to its (animating) width */}
      <div className="relative col-start-2 row-start-2 overflow-hidden">
        {drawerOpen && (
          <div
            onMouseDown={handleDrawerMouseDown}
            className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize z-50 hover:bg-opt-ink/10 transition-colors"
          />
        )}
        {drawer}
      </div>

      {/* Chart column — 1fr, compresses as the drawer column grows */}
      <div className="col-start-3 row-start-2 flex min-h-0 min-w-0 flex-col">
        {main}
      </div>

      {/* Right-side order panel */}
      <aside className="relative col-start-4 row-start-2 flex min-h-0 flex-col border-l border-opt-line bg-opt-bg-elev">
        {/* Resizer Handle */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute -left-1.5 top-0 bottom-0 w-3 cursor-col-resize z-50 hover:bg-opt-ink/10 transition-colors"
        />
        {order}
      </aside>
    </div>
  );
}
