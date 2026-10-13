"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { parseApiError } from "@/lib/apiError";

type Favourites = { bot_ids: string[] };
const endpoint = "/api/v1/users/me/autohub/favourites";

export function useBotFavourites() {
  const userId = useAuthStore((state) => state.user?.id);
  const client = useQueryClient();
  const key = ["autohub-favourites", userId] as const;
  const query = useQuery({
    queryKey: key,
    enabled: !!userId,
    queryFn: async () => (await api.get<Favourites>(endpoint)).data,
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });
  const mutation = useMutation({
    mutationKey: key,
    mutationFn: async ({
      botId,
      favourite,
    }: {
      botId: string;
      favourite: boolean;
    }) => {
      if (!userId || useAuthStore.getState().user?.id !== userId)
        throw new Error("Session changed");
      await api.put(`${endpoint}/${encodeURIComponent(botId)}`, { favourite });
    },
    onMutate: async ({ botId, favourite }) => {
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData<Favourites>(key);
      client.setQueryData<Favourites>(key, {
        bot_ids: favourite
          ? [...new Set([...(previous?.bot_ids ?? []), botId])]
          : (previous?.bot_ids ?? []).filter((id) => id !== botId),
      });
      return { previous };
    },
    onError: (error, _, context) => {
      client.setQueryData(key, context?.previous);
      toast.error(
        parseApiError(error, "Could not save your favourite. Please try again.")
          .message,
      );
    },
    onSettled: () => client.invalidateQueries({ queryKey: key }),
  });
  return {
    ids: new Set(userId ? (query.data?.bot_ids ?? []) : []),
    ready: !!userId && query.isSuccess,
    isLoading: query.isPending,
    isError: query.isError,
    saving: mutation.isPending,
    retry: () => query.refetch(),
    toggle: (botId: string) =>
      mutation.mutate({
        botId,
        favourite: !(query.data?.bot_ids ?? []).includes(botId),
      }),
  };
}
