import type { Market } from "@/components/options/market/catalog";

/**
 * Groups markets the way Deriv's own picker does. Shared by the workspace's
 * market dropdown and the bot builder so one market never sits under two
 * different headings depending on the screen.
 */
export function getGroupKey(m: Market): string {
  // Group by subCategory (synthetics/baskets) and then by name prefix
  if (m.subCategory === "baskets") return "baskets";
  
  const name = m.name.toLowerCase();
  if (name.includes("volatility") || name.includes("vol")) return "volatility";
  if (name.includes("crash") || name.includes("boom")) return "crash_boom";
  if (name.includes("jump")) return "jump";
  if (name.includes("step")) return "step";
  if (name.includes("range")) return "range";
  if (name.includes("bear") || name.includes("bull")) return "daily_reset";
  if (name.includes("btc") || name.includes("eth") || name.includes("crypto")) return "crypto";
  if (name.includes("gold") || name.includes("silver") || name.includes("xau") || name.includes("xag")) return "metals";
  if (name.includes("usd") || name.includes("eur") || name.includes("gbp") || name.includes("jpy")) return "forex_major";
  return "other";
}

export function getGroupLabel(key: string): string {
  switch (key) {
    case "volatility":    return "Volatility Indices";
    case "crash_boom":   return "Crash/Boom Indices";
    case "jump":         return "Jump Indices";
    case "step":         return "Step Indices";
    case "range":        return "Range Break Indices";
    case "daily_reset":  return "Daily Reset Indices";
    case "baskets":      return "Basket Indices";
    case "crypto":       return "Cryptocurrencies";
    case "metals":       return "Metals";
    case "forex_major":  return "Major Pairs";
    default:             return "Other";
  }
}
