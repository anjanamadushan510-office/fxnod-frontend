"use client";

import { useDerivStatus } from "@/hooks/useDerivStatus";
import { useStartDerivOAuth } from "@/hooks/useStartDerivOAuth";
import { cn } from "@/lib/cn";

	import { DerivAccountMenu } from "./DerivAccountMenu";

	/**
	 * Top-bar control for Deriv account linking (authenticated users).
	 *
	 *  - Reads link status via the Orval-generated `derivAccountStatus` query
	 *    (→ GET /api/v1/deriv/account/status through the shared axios instance).
	 *  - When unlinked, starts the OAuth flow via `useStartDerivOAuth` (shared with
	 *    the login modal's "Continue with Deriv" button).
	 */
	export function ConnectDerivButton() {
	  const { linked, isLoading } = useDerivStatus();
	  const { start, redirecting } = useStartDerivOAuth();

	if (linked) {
	    // A linked account used to render as a static label: no way to switch
	    // between demo and real, and no way to sign out of Deriv at all.
	    return <DerivAccountMenu />;
	  }

  return (
    <button
      type="button"
      onClick={start}
      disabled={redirecting || isLoading}
      className={cn(
        "flex flex-shrink-0 items-center gap-1.5 rounded-[10px] px-3 py-1.5",
        "text-[12px] font-semibold transition-colors",
        "bg-opt-bg-sunk text-opt-ink hover:brightness-95",
        "disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      {redirecting && (
        <span
          aria-hidden
          className="h-3 w-3 animate-spin rounded-full border-2 border-opt-ink-3 border-t-opt-ink"
        />
      )}
      {redirecting ? "Redirecting…" : "Connect Deriv"}
    </button>
  );
}
