"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { derivStatusKey, useDerivStatus } from "@/hooks/useDerivStatus";
import { useDerivUnlink } from "@/services/api/endpoints/trading/trading";

/**
 * Signing out of Deriv, as its own control rather than an item in a menu.
 *
 * Connecting was a button on the top bar; disconnecting was three clicks into a
 * dropdown, which is not a fair trade. Ending a session with a broker that can
 * place trades on your behalf should be at least as easy as starting one, and
 * a control people cannot find is a control they do not believe exists.
 *
 * Renders nothing when no account is linked — there is nothing to disconnect,
 * and a disabled button would only raise the question.
 */
export function DerivDisconnectButton() {
  const queryClient = useQueryClient();
  const { linked } = useDerivStatus();
  const unlinkMutation = useDerivUnlink();

  if (!linked) return null;

  async function disconnect() {
    const ok = window.confirm(
      "Sign out of Deriv? Running bots will stop, and you will need to " +
        "connect again before trading.",
    );
    if (!ok) return;
    try {
      await unlinkMutation.mutateAsync();
      await queryClient.invalidateQueries({ queryKey: derivStatusKey });
      // Balance, positions, bot runs and the account list are all per-account.
      // Naming each one here is how the next one gets forgotten.
      await queryClient.invalidateQueries();
      toast.success("Signed out of Deriv");
    } catch {
      toast.error("Could not sign out of Deriv. Please try again.");
    }
  }

  return (
    <button
      type="button"
      onClick={disconnect}
      disabled={unlinkMutation.isPending}
      title="Sign out of your Deriv account"
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-[10px] px-3 py-1.5",
        "text-[12px] font-semibold transition-colors",
        // Not styled as a destructive action. It is reversible in two clicks,
        // and painting it red next to real-money controls makes people hesitate
        // over the wrong thing.
        "border border-opt-line text-opt-ink-2 hover:border-opt-line-strong hover:text-opt-ink",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      {unlinkMutation.isPending ? "Signing out…" : "Log out of Deriv"}
    </button>
  );
}
