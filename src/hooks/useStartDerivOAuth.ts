"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DERIV_APP_KEY,
  DERIV_RETURN_TO_KEY,
  DERIV_STATE_KEY,
} from "@/app/deriv/callback/CallbackInner";
import { env } from "@/lib/env";
import { derivListApps } from "@/services/api/endpoints/trading/trading";
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
 * The only staging address registered on all seven Deriv apps.
 * A Vercel deployment URL is a different host, and Deriv rejects it.
 */
const STAGING_OAUTH_ORIGIN = "https://fxnod-frontend-git-staging-sribees-digitel.vercel.app";

const CONSENT_PARAM = "deriv_consent";
const CONNECT_PARAM = "deriv_connect";

/** One resume per page load. Several screens mount this hook together. */
let resumeStarted = false;

function registeredOrigin(): string {
  if (env.apiUrl.includes("://api-staging.fxnod.com")) return STAGING_OAUTH_ORIGIN;
  return window.location.origin;
}

function pathWithoutOAuthFlags(): string {
  const params = new URLSearchParams(window.location.search);
  params.delete(CONSENT_PARAM);
  params.delete(CONNECT_PARAM);
  const query = params.toString();
  return window.location.pathname + (query ? `?${query}` : "");
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
    const origin = registeredOrigin();
    if (window.location.origin !== origin) {
      const next = new URL(window.location.pathname + window.location.search, origin);
      next.searchParams.delete(CONSENT_PARAM);
      next.searchParams.delete(CONNECT_PARAM);
      if (app) next.searchParams.set(CONSENT_PARAM, app.appKey);
      else next.searchParams.set(CONNECT_PARAM, "1");
      window.location.assign(next.toString());
      return;
    }

    setRedirecting(true);
    try {
      const redirectUri = origin + "/deriv/callback";
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
    return pathWithoutOAuthFlags();
  }

  function start() {
    return begin(currentPath());
  }

  function startAppConsent(app: DerivAppTarget) {
    return begin(app.returnTo ?? currentPath(), app);
  }

  // Arriving from a deployment URL: the user already pressed Allow or Connect.
  // Continue on the host Deriv knows, where the callback can read this tab.
  useEffect(() => {
    if (resumeStarted || window.location.origin !== registeredOrigin()) return;
    const params = new URLSearchParams(window.location.search);
    const appKey = params.get(CONSENT_PARAM);
    const connect = params.get(CONNECT_PARAM) === "1";
    if (!appKey && !connect) return;
    resumeStarted = true;
    const returnTo = pathWithoutOAuthFlags();
    window.history.replaceState(null, "", returnTo);
    if (connect) {
      void begin(returnTo);
      return;
    }
    void derivListApps()
      .then((list) => {
        const app = list.connections.find((item) => item.app_key === appKey);
        if (!app) {
          toast.error("Couldn’t start Deriv sign-in", { description: "Please try again." });
          return;
        }
        return begin(returnTo, { appKey: app.app_key, clientId: app.client_id, returnTo });
      })
      .catch(() => {
        toast.error("Couldn’t start Deriv sign-in", { description: "Please try again." });
      });
    // Resume once, from the URL that brought this page up.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { start, startAppConsent, redirecting };
}
