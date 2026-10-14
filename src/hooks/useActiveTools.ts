"use client";
import { useCallback } from "react";
import { useCommerce, useToolActivation } from "./useCommerce";
import type { FxnodTool } from "@/components/tools/catalog";

/** Activation is an account preference; access is always decided by the server. */
export function useActiveTools() {
  const catalog = useCommerce();
  const mutation = useToolActivation();
  const activeTools: FxnodTool[] = (catalog.data?.tools ?? [])
    .filter((t) => t.access.active)
    .map((t) => ({
      ...t,
      href: t.href ?? undefined,
      icon: "/assets/fxnod-mark.png",
      kind: catalog.data?.tiers.some(
        (tier) => tier.tool_id === t.id && tier.is_free,
      )
        ? "free"
        : "paid",
    }));
  const ids = activeTools.map((t) => t.id);
  const isActive = (id: string) => ids.includes(id);
  const setActive = useCallback(
    (id: string, on: boolean) => mutation.mutateAsync({ id, enabled: on }),
    [mutation],
  );
  return {
    ids,
    activeTools,
    isActive,
    setActive,
    ready: catalog.isSuccess,
    isLoading: catalog.isLoading,
    isError: catalog.isError,
  };
}
