"use client";

import { useDerivListApps } from "@/services/api/endpoints/trading/trading";
import { useStartDerivOAuth } from "@/hooks/useStartDerivOAuth";
import { cn } from "@/lib/cn";

/**
 * Shown when a real-money bot needs its one-time Deriv approval.
 *
 * Each bot trades through its own FXNod app on Deriv, and Deriv only lets an
 * app trade with a permission the user gave that app. So the first time a
 * user runs a bot on real money, Deriv has to be asked once. The user never
 * chooses anything here — the server decided which app — they only allow it.
 *
 * Nothing starts on the way back: the user returns to the saved bot and
 * presses Start themselves, because a real-money run should never begin as a
 * side effect of a redirect.
 */
interface DerivAppConsentModalProps {
  /** The app the server asked for; null hides the modal. */
  appKey: string | null;
  /** In-app path to return to after Deriv, usually the saved bot. */
  returnTo: string;
  onClose: () => void;
}

export function DerivAppConsentModal({ appKey, returnTo, onClose }: DerivAppConsentModalProps) {
  const apps = useDerivListApps({ query: { enabled: appKey !== null } });
  const { startAppConsent, redirecting } = useStartDerivOAuth();

  if (appKey === null) return null;

  const app = apps.data?.connections.find((c) => c.app_key === appKey);
  const expired = Boolean(app?.expires_at);
  const unavailable = apps.isError || (apps.isSuccess && !app);

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deriv-app-consent-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev p-6 shadow-2xl"
      >
        <h2 id="deriv-app-consent-title" className="m-0 text-[17px] font-bold text-opt-ink">
          {expired ? "Reconnect this bot to Deriv" : "Allow this bot on Deriv"}
        </h2>

        <p className="m-0 mt-2 text-[13px] leading-relaxed text-opt-ink-2">
          {expired
            ? "Deriv’s permission for this bot has expired. Allow it again to keep trading on your real account."
            : "Bots trade on your real account through FXNod’s automated-trading connection. Deriv asks you to allow it once."}
        </p>

        <p className="m-0 mt-4 rounded-[var(--opt-radius-sm)] bg-opt-bg-sunk px-3 py-2.5 text-[12px] leading-relaxed text-opt-ink-2">
          Sign in to Deriv with the same account you trade on FXNod. You’ll come
          back to this bot — press <strong className="text-opt-ink">Start</strong> again
          to run it.
        </p>

        {unavailable && (
          <p className="m-0 mt-3 text-[12px] text-opt-fall">
            This connection is not available right now. Please try again shortly.
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!app || redirecting}
            onClick={() =>
              app && startAppConsent({ appKey: app.app_key, clientId: app.client_id, returnTo })
            }
            className={cn(
              "inline-flex items-center rounded-[var(--opt-radius-sm)] px-5 py-2.5",
              "bg-opt-rise text-[13px] font-bold text-white",
              "transition-opacity hover:opacity-90 disabled:opacity-50",
            )}
          >
            {redirecting ? "Opening Deriv…" : "Allow on Deriv"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--opt-radius-sm)] px-4 py-2.5 text-[13px] font-semibold text-opt-ink-2 transition-colors hover:bg-opt-bg-sunk"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
