/**
 * How the partner dashboard talks about levels and products.
 *
 * Both come off the wire as open values — `level` is an integer and
 * `source_type` is a string — because the server is deliberately not pinned to
 * the two products and three tiers that exist today. So the labelling here has
 * to degrade well: a product that ships before this file is updated must
 * appear with a readable name and its real money, never be dropped or shown as
 * "unknown". Money the partner earned is money the partner earned.
 */

/** Decimal strings on the wire; parsed only to render, never to compute. */
export function money(value: string | undefined, currency = "USD"): string {
  const amount = Number.parseFloat(value ?? "");
  if (!Number.isFinite(amount)) return "—";
  const symbol = currency === "USD" ? "$" : "";
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** True when there is genuinely nothing there, so a row can be de-emphasised. */
export function isZero(value: string | undefined): boolean {
  const amount = Number.parseFloat(value ?? "");
  return !Number.isFinite(amount) || amount === 0;
}

interface LevelCopy {
  name: string;
  /** What earning at this level actually means, in the partner's words. */
  meaning: string;
}

const LEVELS: Record<number, LevelCopy> = {
  1: {
    name: "Affiliate",
    meaning: "People you invited yourself",
  },
  2: {
    name: "Master affiliate",
    meaning: "People your affiliates invited",
  },
  3: {
    name: "Tier 3",
    meaning: "One step further down your team",
  },
};

export function levelName(level: number): string {
  return LEVELS[level]?.name ?? `Tier ${level}`;
}

export function levelMeaning(level: number): string {
  return LEVELS[level]?.meaning ?? `Level ${level} of your team`;
}

const PRODUCTS: Record<string, string> = {
  dbot_subscription: "dBot subscriptions",
  trade_markup: "Trading",
};

/**
 * A readable name for a product, including one this build has never heard of.
 *
 * `signals_pro` becomes "Signals pro" rather than being hidden. A partner
 * seeing a slug is a cosmetic problem; a partner not seeing income they earned
 * is a trust problem, and only one of those is worth failing on.
 */
export function productName(sourceType: string): string {
  const known = PRODUCTS[sourceType];
  if (known) return known;
  const words = sourceType.replace(/[_-]+/g, " ").trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : sourceType;
}

/** "9 Oct 2026", in the reader's own time zone. */
export function shortDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** "2026-10" as "Oct 2026". The period is a UTC month bucket, so no time zone is applied. */
export function monthName(period: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(period);
  if (!match) return period;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
}

/** Who a row is about, for someone whose profile may not have reached this service yet. */
export function memberName(displayName: string | null | undefined, email: string | null | undefined): string {
  return displayName || email || "A team member";
}

/**
 * When a partner can expect a pending amount, per product.
 *
 * "Pending" with no explanation reads as "lost". These are different answers
 * to the same question and a partner is owed the right one.
 */
export function pendingExplanation(sourceType: string): string {
  if (sourceType === "trade_markup") {
    return "Paid after the broker settles the month.";
  }
  if (sourceType === "dbot_subscription") {
    return "Released a few days after the purchase.";
  }
  return "Released once it clears.";
}
