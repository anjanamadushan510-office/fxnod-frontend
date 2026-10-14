import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customInstance } from "@/services/api/mutator/custom-instance";
import { useAuthStore } from "@/stores/authStore";

export type Broker = "deriv" | "binance" | "bybit";
export interface BrokerLink { broker: Broker; url: string | null; platform_fallback_available: boolean }
export interface BrokerSignup { broker: Broker; url: string | null; source: "partner" | "fxnod" | "unavailable" }
const base = "/api/v1/referrals";
export function useBrokerLinks() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({ queryKey: ["broker-affiliate-links", userId], enabled: !!userId,
    queryFn: () => customInstance<BrokerLink[]>({ url: `${base}/broker-links`, method: "GET" }) });
}
export function useSaveBrokerLink() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ broker, url }: { broker: Broker; url: string | null }) =>
    customInstance<BrokerLink>({ url: `${base}/broker-links/${broker}`, method: "PUT", data: { url } }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["broker-affiliate-links"] }),
  });
}
export function useBrokerSignup(broker: Broker) {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({ queryKey: ["broker-signup", userId, broker], enabled: !!userId,
    queryFn: () => customInstance<BrokerSignup>({ url: `${base}/broker-signup/${broker}`, method: "GET" }),
    staleTime: 0, retry: 2,
  });
}
