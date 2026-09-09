/**
 * Single source of truth for the markets list shown in the picker.
 * Now dynamic and populated via Deriv API.
 */

import { useMarketStore } from "./marketStore";

export type MarketCategoryId =
  | "favorites"
  | "stock_indices"
  | "derived"
  | "cryptocurrencies"
  | "forex"
  | "commodities";

export type MarketSubCategoryId = "baskets" | "synthetics";

/** Visual group inside a category's right pane (e.g. "Crash/Boom"). */
export interface MarketGroup {
  id: string;
  label: string;
  marketIds: string[];
}

export interface MarketCategory {
  id: MarketCategoryId;
  label: string;
  /** Optional expandable sub-items shown under the rail row. */
  subCategories?: { id: MarketSubCategoryId; label: string }[];
  /** Groups rendered in the right pane (ordering matters). */
  groups: MarketGroup[];
}

export interface Market {
  id: string;
  /** Human-readable name shown in the picker rows + MarketPill. */
  name: string;
  /** Tick seed price used by the simulator (replace with REST snapshot later). */
  seedPrice: number;
  category: MarketCategoryId;
  /** Optional sub-category for hierarchical placement. */
  subCategory?: MarketSubCategoryId;
  /** Market is currently unavailable (shows a red "CLOSED" badge, A 5). */
  closed?: boolean;
}

export function findMarket(id: string): Market | undefined {
  return useMarketStore.getState().findMarket(id);
}
