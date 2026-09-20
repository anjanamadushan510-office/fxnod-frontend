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
      className={cn(
        "fixed inset-0 flex overflow-hidden bg-opt-bg font-sans text-opt-ink",
        (isResizing || isResizingDrawer) && "cursor-col-resize select-none"
      )}
    >
      {/* Icon Sidebar (fixed left) */}
      <div className="relative z-50 w-[76px] flex-shrink-0 border-r border-opt-line bg-opt-bg-elev">
        {sidebar}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <div className="relative z-40 h-[64px] flex-shrink-0 border-b border-opt-line bg-opt-bg-elev">
          {topbar}
        </div>

        {/* Middle Area: Drawer + Chart + Order */}
        <div className="flex flex-1 flex-row min-h-0 overflow-hidden">
          
          {/* Drawer Panel */}
          <div 
            className={cn(
              "relative z-50 flex-shrink-0 border-opt-line bg-opt-bg shadow-xl overflow-hidden",
              drawerOpen && "border-r",
              !(isResizing || isResizingDrawer) && "transition-[width] duration-300 ease-out"
            )}
            style={{ width: drawerOpen ? drawerWidth : 0 }}
          >
            {drawerOpen && (
              <div
                onMouseDown={handleDrawerMouseDown}
                className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize z-[60] hover:bg-opt-ink/10 transition-colors"
              />
            )}
            <div className="w-full h-full min-w-[250px]">
               {drawer}
            </div>
          </div>

          {/* Chart Panel (flex-1) */}
          <div className="relative z-10 flex-1 min-w-0 overflow-hidden flex flex-col">
            {main}
          </div>

          {/* Order Panel */}
          <aside 
            className={cn(
              "relative z-40 flex-shrink-0 flex flex-col border-l border-opt-line bg-opt-bg-elev",
              !(isResizing || isResizingDrawer) && "transition-[width] duration-300 ease-out"
            )}
            style={{ width: orderWidth }}
          >
            {/* Resizer Handle */}
            <div
              onMouseDown={handleMouseDown}
              className="absolute -left-1.5 top-0 bottom-0 w-3 cursor-col-resize z-[60] hover:bg-opt-ink/10 transition-colors"
            />
            {order}
          </aside>
        </div>
      </div>
    </div>
  );
}
