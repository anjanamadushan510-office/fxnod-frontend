import { useMutation } from "@tanstack/react-query";
import { customInstance } from "@/services/api/mutator/custom-instance";
import type { BotRun } from "@/services/api/model";

/**
 * Ends a run immediately. The generated client does not know this route yet;
 * it is the escape hatch for a bot whose ordinary Stop is stuck on "stopping".
 */
export function forceStopBotRun(id: string) {
  return customInstance<BotRun>({
    url: `/api/v1/bots/runs/${id}/force-stop`,
    method: "POST",
  });
}

export function useForceStopBotRun() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => forceStopBotRun(id),
  });
}
