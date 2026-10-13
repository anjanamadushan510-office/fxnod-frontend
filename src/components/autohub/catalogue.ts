import type { AutoHubBot } from "@/services/api/model";
export const contractLabels: Record<string, string> = {
  CALL: "Rise",
  PUT: "Fall",
  CALLE: "Rise or equal",
  PUTE: "Fall or equal",
  DIGITMATCH: "Digit matches",
  DIGITDIFF: "Digit differs",
  DIGITOVER: "Digit over",
  DIGITUNDER: "Digit under",
  DIGITEVEN: "Even",
  DIGITODD: "Odd",
  ACCU: "Accumulators",
  MULTUP: "Multiplier up",
  MULTDOWN: "Multiplier down",
  ONETOUCH: "Touch",
  NOTOUCH: "No touch",
};
export function contractLabel(type: string) {
  return contractLabels[type] ?? type.replaceAll("_", " ");
}
export type CatalogueFilters = {
  search: string;
  contract: string;
  markets: string;
  favouritesOnly: boolean;
  sort: string;
};
export function filterBots(
  bots: AutoHubBot[],
  favourites: Set<string>,
  filters: CatalogueFilters,
) {
  const words = filters.search
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const result = bots.filter((bot) => {
    const text = [
      bot.name,
      bot.tagline,
      bot.description,
      bot.bot_id,
      contractLabel(bot.contract_type),
      ...bot.suggested_symbols,
    ]
      .join(" ")
      .toLowerCase();
    return (
      words.every((word) => text.includes(word)) &&
      (!filters.contract || bot.contract_type === filters.contract) &&
      (!filters.markets ||
        (filters.markets === "single"
          ? bot.max_markets === 1
          : bot.max_markets > 1)) &&
      (!filters.favouritesOnly || favourites.has(bot.bot_id))
    );
  });
  if (filters.sort === "name")
    result.sort((a, b) => a.name.localeCompare(b.name));
  if (filters.sort === "stake")
    result.sort(
      (a, b) =>
        Number(a.min_stake) - Number(b.min_stake) ||
        a.name.localeCompare(b.name),
    );
  return result;
}
