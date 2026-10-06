"use client";

import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DEFAULT_ACTIVE_TOOL_IDS, FXNOD_TOOLS, type FxnodTool } from "@/components/tools/catalog";
import {
  getGetActiveToolsQueryKey,
  useGetActiveTools,
  useSetActiveTools,
} from "@/services/api/endpoints/users/users";
import type { ActiveToolsResponse } from "@/services/api/model";

function knownIds(ids: string[]): string[] {
  const allowed = new Set(FXNOD_TOOLS.map((tool) => tool.id));
  return ids.filter((id) => allowed.has(id));
}

/**
 * Which catalogue tools the account has switched on.
 *
 * The list is kept by the server, per account, so it is the same on a laptop
 * and a phone. It used to be a localStorage entry, which made it a property
 * of the browser. An account that has never changed it gets the default set.
 *
 * `ready` is false until the server has answered. A caller that shows a count
 * should wait for it: the default set is not this account's answer.
 */
export function useActiveTools() {
  const queryClient = useQueryClient();
  const query = useGetActiveTools();
  const save = useSetActiveTools();

  const ids = useMemo(() => {
    const data = query.data;
    if (!data || !data.configured) return DEFAULT_ACTIVE_TOOL_IDS;
    return knownIds(data.active_tool_ids);
  }, [query.data]);

  const isActive = useCallback((id: string) => ids.includes(id), [ids]);

  const setActive = useCallback(
    (id: string, on: boolean) => {
      const next = on ? Array.from(new Set([...ids, id])) : ids.filter((item) => item !== id);
      const key = getGetActiveToolsQueryKey();
      const previous = queryClient.getQueryData<ActiveToolsResponse>(key);

      // Shown at once, and put back if the server refuses it.
      queryClient.setQueryData<ActiveToolsResponse>(key, { configured: true, active_tool_ids: next });
      save.mutate(
        { data: { active_tool_ids: next } },
        {
          onError: () => {
            queryClient.setQueryData(key, previous);
            toast.error("That could not be saved. Please try again.");
          },
          onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: key });
          },
        },
      );
    },
    [ids, queryClient, save],
  );

  const activeTools: FxnodTool[] = useMemo(
    () => FXNOD_TOOLS.filter((tool) => ids.includes(tool.id)),
    [ids],
  );

  return { ids, activeTools, isActive, setActive, ready: query.isSuccess };
}
