"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

/** A quiet page-position control for long workspace pages. */
export function ScrollProgressButton({ pathname }: { pathname: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const canvas = document.querySelector<HTMLElement>(".workspace-canvas");
    const usesCanvas = !!canvas && canvas.scrollHeight > canvas.clientHeight + 100 &&
      ["auto", "scroll"].includes(getComputedStyle(canvas).overflowY);
    containerRef.current = usesCanvas ? canvas : null;
    const target = usesCanvas ? canvas : window;
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.scrollingElement ?? document.documentElement;
      const top = usesCanvas ? canvas!.scrollTop : window.scrollY;
      const max = usesCanvas
        ? Math.max(0, canvas!.scrollHeight - canvas!.clientHeight)
        : Math.max(0, root.scrollHeight - window.innerHeight);
      const progress = max > 0 ? Math.min(1, Math.max(0, top / max)) : 0;
      buttonRef.current?.style.setProperty("--scroll-progress", `${progress * 100}%`);
      setVisible(max > 400 && top > 160);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    target.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.documentElement);
    if (canvas) observer.observe(canvas);
    schedule();
    return () => {
      target.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  function scrollToTop() {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTop}
      className={`scroll-progress-button fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-[35] grid h-12 w-12 place-items-center rounded-full p-[3px] shadow-lg transition-opacity duration-200 lg:bottom-5 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <span className="grid h-full w-full place-items-center rounded-full bg-surface text-ink">
        <ArrowUp className="h-5 w-5" aria-hidden />
      </span>
    </button>
  );
}
