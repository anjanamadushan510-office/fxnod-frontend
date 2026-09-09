import { create } from "zustand";
import type { Market, MarketCategory, MarketCategoryId, MarketSubCategoryId, MarketGroup } from "./catalog";

export interface ActiveSymbol {
  symbol: string;
  display_name: string;
  market: string;
  submarket: string;
  exchange_is_open: number;
  is_trading_suspended: number;
}

interface MarketStoreState {
  markets: Record<string, Market>;
  categories: MarketCategory[];
  allMarkets: Market[];
  isLoaded: boolean;
  setMarketsFromDeriv: (symbols: ActiveSymbol[]) => void;
  findMarket: (id: string) => Market | undefined;
}

export const useMarketStore = create<MarketStoreState>((set, get) => ({
  markets: {},
  categories: [],
  allMarkets: [],
  isLoaded: false,

  findMarket: (id: string) => {
    return get().markets[id];
  },

  setMarketsFromDeriv: (symbols: ActiveSymbol[]) => {
    const marketsMap: Record<string, Market> = {};
    const allMarkets: Market[] = [];
    
    // Grouping structures
    const categoriesMap = new Map<MarketCategoryId, MarketCategory>();
    
    // Ensure "favorites" category exists first
    categoriesMap.set("favorites", {
      id: "favorites",
      label: "Favorites",
      groups: [],
    });

    for (const sym of symbols) {
      const categoryId = mapMarketCategory(sym.market);
      const subCategoryId = mapMarketSubCategory(sym.market);
      
      const market: Market = {
        id: sym.symbol,
        name: sym.display_name,
        category: categoryId,
        subCategory: subCategoryId,
        closed: sym.exchange_is_open === 0 || sym.is_trading_suspended === 1,
        seedPrice: 100.0, // Default seed price for simulator
      };

      marketsMap[market.id] = market;
      allMarkets.push(market);

      // Build categories & groups dynamically
      let cat = categoriesMap.get(categoryId);
      if (!cat) {
        cat = {
          id: categoryId,
          label: getCategoryLabel(categoryId),
          subCategories: categoryId === "derived" 
            ? [{ id: "baskets", label: "Baskets" }, { id: "synthetics", label: "Synthetics" }] 
            : undefined,
          groups: [],
        };
        categoriesMap.set(categoryId, cat);
      }

      // Find or create group for this submarket
      const groupId = sym.submarket || "default";
      let group = cat.groups.find(g => g.id === groupId);
      if (!group) {
        group = {
          id: groupId,
          label: getGroupLabel(sym.submarket),
          marketIds: [],
        };
        cat.groups.push(group);
      }
      
      group.marketIds.push(market.id);
    }

    // Convert map to array and sort categories logically
    const categoryOrder: MarketCategoryId[] = [
      "favorites", "derived", "forex", "stock_indices", "cryptocurrencies", "commodities"
    ];
    
    const categories = Array.from(categoriesMap.values()).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.id);
      const indexB = categoryOrder.indexOf(b.id);
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });

    set({ markets: marketsMap, allMarkets, categories, isLoaded: true });
  },
}));

// --- Helpers ---

function mapMarketCategory(derivMarket: string): MarketCategoryId {
  switch (derivMarket) {
    case "synthetic_index":
    case "basket_index":
      return "derived";
    case "forex":
      return "forex";
    case "cryptocurrency":
      return "cryptocurrencies";
    case "commodities":
      return "commodities";
    case "indices":
      return "stock_indices";
    default:
      return "forex"; // safe fallback
  }
}

function mapMarketSubCategory(derivMarket: string): MarketSubCategoryId | undefined {
  if (derivMarket === "synthetic_index") return "synthetics";
  if (derivMarket === "basket_index") return "baskets";
  return undefined;
}

function getCategoryLabel(id: MarketCategoryId): string {
  switch (id) {
    case "favorites": return "Favorites";
    case "derived": return "Derived";
    case "forex": return "Forex";
    case "stock_indices": return "Stock indices";
    case "cryptocurrencies": return "Cryptocurrencies";
    case "commodities": return "Commodities";
    default: return "Markets";
  }
}

function getGroupLabel(submarket: string): string {
  switch (submarket) {
    case "volatility_indices": return "Continuous indices";
    case "crash_boom": return "Crash/Boom";
    case "jump_indices": return "Jump indices";
    case "daily_reset_indices": return "Daily reset indices";
    case "step_indices": return "Step indices";
    case "range_break_indices": return "Range break indices";
    
    case "major_pairs": return "Major pairs";
    case "minor_pairs": return "Minor pairs";
    case "smart_fx": return "Smart FX";
    
    case "cryptocurrency": return "Cryptos";
    case "metals": return "Metals";
    
    case "forex_basket": return "Forex basket";
    case "commodities_basket": return "Commodities basket";
    
    default:
      if (!submarket) return "Other";
      // E.g. "random_index" -> "Random index"
      const formatted = submarket.replace(/_/g, " ");
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
}
