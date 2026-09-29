"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_ACTIVE_TOOL_IDS, FXNOD_TOOLS, type FxnodTool } from "@/components/tools/catalog";

const LS_KEY = "fxnod.active-tools";

function knownIds(ids: string[]): string[] {
  const allowed = new Set(FXNOD_TOOLS.map((tool) => tool.id));
  return ids.filter((id) => allowed.has(id));
}

function readStored(): string[] {
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (raw === null) return [...DEFAULT_ACTIVE_TOOL_IDS];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [...DEFAULT_ACTIVE_TOOL_IDS];
    return knownIds(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return [...DEFAULT_ACTIVE_TOOL_IDS];
  }
}

function writeStored(ids: string[]) {
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(ids));
  } catch {
    // Quota or private mode. The in-memory list still updates this page.
  }
}

/**
 * Which catalogue tools the user has switched on from the Tools page.
 *
 * Subscriptions renders this list and nothing else. Stored on this device,
 * same as other preferences that have no account API yet.
 */
export function useActiveTools() {
  const [ids, setIds] = useState<string[]>(DEFAULT_ACTIVE_TOOL_IDS);

  useEffect(() => {
    const sync = () => setIds(readStored());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const isActive = useCallback((id: string) => ids.includes(id), [ids]);

  const setActive = useCallback((id: string, on: boolean) => {
    setIds((prev) => {
      const next = on ? Array.from(new Set([...prev, id])) : prev.filter((item) => item !== id);
      writeStored(next);
      return next;
    });
  }, []);

  const activeTools: FxnodTool[] = FXNOD_TOOLS.filter((tool) => ids.includes(tool.id));

  return { ids, activeTools, isActive, setActive };
}
