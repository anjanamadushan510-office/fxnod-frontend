"use client";

import { useCommerce } from "./useCommerce";

/** Mirror the server's capability check so a denied run never looks ready. */
export function useToolTradingAccess(toolId: string, isVirtual: boolean) {
  const catalog = useCommerce();
  const tool = catalog.data?.tools.find((item) => item.id === toolId);
  const capability = toolId === "dtrader" ? "manual_trade" : isVirtual ? "bot_demo" : "bot_real";
  const allowed = catalog.isSuccess && !!tool?.access.allowed && !!tool?.access.capabilities.includes(capability);
  const message = catalog.isLoading
    ? "Checking your tool package…"
    : catalog.isError
      ? "Unable to verify your tool package. Reload and try again."
      : allowed
        ? null
        : tool?.access.allowed && capability === "bot_real"
          ? "Your package supports demo trading. Switch to a demo account or choose a package with real-account access in Discover."
          : "Activate a package for this tool in Discover before trading.";
  return { allowed, message };
}
