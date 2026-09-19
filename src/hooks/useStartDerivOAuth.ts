"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  DERIV_APP_KEY,
  DERIV_RETURN_TO_KEY,
  DERIV_STATE_KEY,
} from "@/app/deriv/callback/CallbackInner";
import { derivApi } from "@/services/tradingApi";

/** A dBot app the user is asked to approve once. */
export interface DerivAppTarget {
  appKey: string;
  /** Public Deriv OAuth client id, from GET /api/v1/deriv/apps. */
  clientId: string;
  /** In-app path to come back to; defaults to the current page. */
  returnTo?: string;
}

/**
 * Starts a Deriv OAuth round-trip.
 *
 * `start` links the dTrader account (TopBar "Connect Deriv", login modal).
 * `startAppConsent` approves one dBot app: Deriv bills markup per app and a
 * token only trades through the app it was granted to, so each app a user's
 * bots trade through needs its own, one-time approval.
 *
 * Both build the authorize URL client-side with PKCE, stash the state and the
 * return path, and hand the browser to Deriv. The callback page finishes.
 */
export function useStartDerivOAuth() {
  const [redirecting, setRedirecting] = useState(false);

  async function begin(returnTo: string, app?: DerivAppTarget) {
    setRedirecting(true);
    try {
      const redirectUri = window.location.origin + "/deriv/callback";
      const { authorize_url, state } = await derivApi.authorize(
        redirectUri,
        // A bot never moves money, so its apps are not asked for `payment`.
        app ? { clientId: app.clientId, scope: "trade account_manage" } : undefined,
      );
      sessionStorage.setItem(DERIV_STATE_KEY, state);
      if (app) sessionStorage.setItem(DERIV_APP_KEY, app.appKey);
      else sessionStorage.removeItem(DERIV_APP_KEY);
      sessionStorage.setItem(DERIV_RETURN_TO_KEY, returnTo);
      window.location.href = authorize_url;
    } catch {
      setRedirecting(false);
      toast.error("Couldn’t start Deriv sign-in", { description: "Please try again." });
    }
  }

  function currentPath() {
    return window.location.pathname + window.location.search;
  }

  function start() {
    return begin(currentPath());
  }

  function startAppConsent(app: DerivAppTarget) {
    return begin(app.returnTo ?? currentPath(), app);
  }

  return { start, startAppConsent, redirecting };
}
