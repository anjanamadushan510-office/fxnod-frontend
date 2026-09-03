"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The overflow menu in dBot's header.
 *
 * It lives in the header rather than on the bot picker, which is where it was
 * first sketched. The picker only exists in an EMPTY tab, so a menu there is
 * unreachable the moment a bot is running — exactly when someone is most likely
 * to want their subscription or their history. The header sits above the tab
 * strip, so it is present in every state of the page and in one place.
 *
 * Items are data so the list can grow without touching the menu's behaviour.
 */

export interface BotMenuItem {
  label: string;
  /** Second line. Says what the destination is for, not what it is called. */
  hint: string;
  href: Route;
}

interface BotMenuProps {
  items: BotMenuItem[];
}

export function BotMenu({ items }: BotMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  // Pointer down rather than click: a click on something that unmounts on
  // mousedown never reaches this listener, and the menu would stay open.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function onMenuKeyDown(event: React.KeyboardEvent) {
    const last = items.length - 1;
    const current = itemRefs.current.findIndex(
      (el) => el === document.activeElement,
    );

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        close(true);
        break;
      case "ArrowDown":
        event.preventDefault();
        itemRefs.current[current >= last ? 0 : current + 1]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        itemRefs.current[current <= 0 ? last : current - 1]?.focus();
        break;
      case "Home":
        event.preventDefault();
        itemRefs.current[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        itemRefs.current[last]?.focus();
        break;
      case "Tab":
        // Tabbing out of a menu closes it, without stealing the focus move.
        setOpen(false);
        break;
      default:
        break;
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label="More"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(event) => {
          // Opening from the keyboard lands on the first item, so the menu is
          // usable without a pointer.
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            if (!open) {
              event.preventDefault();
              setOpen(true);
              requestAnimationFrame(() => itemRefs.current[0]?.focus());
            }
          }
        }}
        className={cn(
          "grid h-9 w-9 place-items-center rounded-[var(--opt-radius-sm)] border",
          "transition-colors",
          open
            ? "border-opt-line-strong bg-opt-bg-sunk text-opt-ink"
            : "border-opt-line bg-opt-bg-elev text-opt-ink-2 hover:border-opt-line-strong hover:text-opt-ink",
        )}
      >
        <MoreVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="dBot"
          onKeyDown={onMenuKeyDown}
          className={cn(
            "absolute right-0 top-[calc(100%+6px)] z-50 w-60 overflow-hidden",
            "rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev shadow-lg",
          )}
        >
          {items.map((item, index) => (
            <Link
              key={item.href}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              role="menuitem"
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex flex-col gap-0.5 border-b border-opt-line px-3 py-2.5 last:border-b-0",
                "transition-colors hover:bg-opt-bg-sunk focus-visible:bg-opt-bg-sunk",
                "focus-visible:outline-none",
              )}
            >
              <span className="text-[12.5px] font-semibold text-opt-ink">
                {item.label}
              </span>
              <span className="text-[10.5px] leading-snug text-opt-ink-3">
                {item.hint}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
