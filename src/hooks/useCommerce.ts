"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commerce } from "@/services/commerce";
import { useAuthStore } from "@/stores/authStore";

export function useCommerce() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const query = useQuery({
    queryKey: ["commerce", user?.id],
    queryFn: commerce.catalog,
    enabled: !!user,
    staleTime: 15_000,
  });
  return {
    ...query,
    isLoading: query.isLoading || status === "idle" || status === "loading",
  };
}
export function useToolActivation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      commerce.activate(id, enabled),
    onSuccess: () => client.invalidateQueries({ queryKey: ["commerce"] }),
  });
}
