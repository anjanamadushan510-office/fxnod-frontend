"use client";

import { useEffect, useState } from "react";
import { Maximize, Minimize } from "lucide-react";

/**
 * Bottom-right strip — green status dot, current date and a live GMT clock.
 *
 * The clock owns its own 1-second ticker so it's the only thing repainting
 * — the chart canvas and order panel are unaffected.
 */
export function ChartFooter() {
  const now = useNowGMT();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="flex h-10 items-center justify-end gap-3 px-4 text-[13px] font-medium text-gray-600 dark:text-gray-300 bg-opt-bg-elev border-t border-opt-line">
      <div className="flex items-center gap-1.5 border-r border-opt-line pr-3">
        <span className="h-1.5 w-1.5 rounded-full bg-opt-rise" />
        <span className="tabular-nums">
          {formatDate(now)}
        </span>
      </div>
      <div className="flex items-center gap-2 tabular-nums">
        <span>{formatTime(now)} GMT</span>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label="Fullscreen"
          className="grid h-6 w-6 place-items-center rounded hover:bg-opt-bg-sunk text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function useNowGMT() {
  // Render the SSR value as "—" so server/client markup matches, then hydrate
  // to the real time on the client. Prevents the "now" mismatch warning.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatDate(d: Date | null) {
  if (!d) return "—";
  return d.toUTCString().slice(5, 16); // "21 May 2026"
}

function formatTime(d: Date | null) {
  if (!d) return "--:--:--";
  return [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}
