import { api } from "./api";
import { getActiveTools } from "./api/endpoints/users/users";

export interface ToolAccess {
  owned: boolean;
  renewal_due: boolean;
  allowed: boolean;
  active: boolean;
  tier_id: string | null;
  tier_name: string | null;
  expires_at: string | null;
  source: string | null;
  capabilities: string[];
}
export interface CommerceTool {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  href: string | null;
  badges: string[];
  status: "draft" | "published" | "coming_soon" | "archived";
  sort_order: number;
  access: ToolAccess;
}
export interface Tier {
  id: string;
  tool_id: string;
  name: string;
  rank: number;
  features: string[];
  capabilities: string[];
  is_free: boolean;
  is_active: boolean;
}
export interface Offer {
  id: string;
  name: string;
  description: string;
  tier_ids: string[];
  months: number | null;
  days: number | null;
  price: string;
  compare_at: string | null;
  is_active: boolean;
  featured: boolean;
  sort_order: number;
}
export interface Catalog {
  activation_configured: boolean;
  currency: string;
  tools: CommerceTool[];
  tiers: Tier[];
  offers: Offer[];
}
export interface Quote {
  id: string;
  offer_id: string;
  subtotal: string;
  discount: string;
  total: string;
  currency: string;
  coupon_code: string | null;
  expires_at: string;
}
export interface Receipt {
  id: string;
  offer_id: string;
  total: string;
  subtotal: string;
  discount: string;
  currency: string;
  created_at: string;
  coupon_code: string | null;
  snapshot: { offer: Offer; tiers: Tier[] };
}
const root = "/api/v1/wallet/commerce";
export const commerce = {
  catalog: async (): Promise<Catalog> => {
    const data = (await api.get<Catalog>(`${root}/catalog`)).data;
    if (data.activation_configured) return data;
    // Carry forward this account's prior server-saved workspace selection.
    // Only migrate tools the commerce service currently permits.
    try {
      const previous = await getActiveTools();
      const ids = previous.active_tool_ids.filter((id) =>
        data.tools.some(
          (tool) =>
            tool.id === id &&
            tool.status === "published" &&
            tool.access.allowed,
        ),
      );
      if (ids.length) {
        await Promise.all(ids.map((id) => commerce.activate(id, true)));
        return (await api.get<Catalog>(`${root}/catalog`)).data;
      }
    } catch {
      // The catalog still works if the older preference service is unavailable.
    }
    return data;
  },
  activate: (id: string, enabled: boolean) =>
    api.put(`${root}/tools/${id}/activation`, { enabled }),
  quote: (offer_id: string, coupon_code?: string) =>
    api
      .post<Quote>(`${root}/quote`, {
        offer_id,
        coupon_code: coupon_code || null,
      })
      .then((r) => r.data),
  checkout: (quote_id: string) =>
    api.post<Receipt>(`${root}/checkout`, { quote_id }).then((r) => r.data),
  orders: (offset = 0) =>
    api
      .get<{ items: Receipt[]; total: number }>(`${root}/orders`, {
        params: { offset },
      })
      .then((r) => r.data),
};
export function term(offer: Offer): string {
  if (offer.months)
    return `${offer.months} month${offer.months === 1 ? "" : "s"}`;
  if (offer.days) return `${offer.days} days`;
  return "Lifetime";
}
export function money(value: string, currency = "USDT") {
  return `${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${currency}`;
}
export function commerceError(error: unknown): string {
  const detail = (error as { response?: { data?: { detail?: unknown } } })
    ?.response?.data?.detail;
  return typeof detail === "string"
    ? detail
    : "Unable to complete the request. Please try again.";
}
