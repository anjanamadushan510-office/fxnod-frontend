/**
 * Google Analytics 4, and the only place that talks to it.
 *
 * What may be sent is decided here, not at the call sites. This app holds a
 * trader's session and shows their money, so an event carries what was done
 * (a bot was started, on a demo or a real account) and never who did it or
 * how much: no user id, no email, no account id, no stake, no balance. A new
 * event gets a function in this file; nothing else calls `gtag`.
 *
 * Page addresses are sent without their query string, apart from campaign
 * tags. Several pages are opened with a secret in the query (an email
 * verification token, a Deriv authorisation code), and the tag would
 * otherwise send the whole address.
 *
 * Analytics runs on the public site only. The same build answers on the
 * staging and testing previews and on the project's `*.vercel.app` alias,
 * and visits there are ours, not visitors'.
 */

/** A measurement id is public: it is in the page source of every site that uses one. */
export const GA_MEASUREMENT_ID = "G-GL26240RM4";

/** The hosts Google's tag loads from and reports to, for `connect-src` in middleware.ts. */
export const GA_CONNECT_SOURCES = [
  "https://www.googletagmanager.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
];

const ANALYTICS_HOSTS = new Set(["fxnod.com", "www.fxnod.com"]);

/** Query parameters that say where a visit came from and carry nothing else. */
const CAMPAIGN_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "gclid"];

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function analyticsEnabled(): boolean {
  return typeof window !== "undefined" && ANALYTICS_HOSTS.has(window.location.hostname);
}

function gtag(..._args: unknown[]) {
  // The tag reads these entries as `arguments` objects; an array is ignored.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer!.push(arguments);
}

/** An address with only its campaign tags left in the query, and no fragment. */
export function cleanUrl(href: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return "";
  }
  const kept = new URLSearchParams();
  for (const name of CAMPAIGN_PARAMS) {
    const value = url.searchParams.get(name);
    if (value) kept.set(name, value);
  }
  const query = kept.toString();
  return url.origin + url.pathname + (query ? `?${query}` : "");
}

let started = false;

/** Loads the tag. Called once, by components/analytics/Analytics.tsx. */
export function startAnalytics(): void {
  if (started || !analyticsEnabled()) return;
  started = true;

  window.dataLayer = window.dataLayer ?? [];
  // Measurement only: nothing is stored or shared for advertising.
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    // Page views are sent by trackPageView, with a cleaned address.
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  // Created by a script the policy already trusts, which is what
  // 'strict-dynamic' allows; it needs no nonce of its own.
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function track(name: string, params: Params = {}): void {
  if (!started) return;
  gtag("event", name, params);
}

/** `referrer` is the address the visitor came from, as the browser or the last page view reported it. */
export function trackPageView(referrer: string): void {
  if (!started) return;
  // Set for every later event as well, not only this one. The tag sends events
  // of its own (a scroll to the bottom, an outbound click) and stamps each
  // with the address; without this it reads the address bar, query and all.
  gtag("set", { page_location: cleanUrl(window.location.href), page_referrer: cleanUrl(referrer) });
  track("page_view", { page_title: document.title });
}

/** A public guide was opened. `language` is the guide's own, not the browser's. */
export function trackGuideView(slug: string, language: string): void {
  track("guide_view", { guide_slug: slug, guide_language: language });
}

export function trackSignUp(): void {
  track("sign_up", { method: "email" });
}

export function trackDashboardView(): void {
  track("dashboard_view");
}

/**
 * Demo and real are separate event names, not a parameter, so each is its own
 * row in the Events report and can be marked as a key event by itself.
 */
function accountSuffix(isVirtual: boolean): "demo" | "real" {
  return isVirtual ? "demo" : "real";
}

export function trackDtraderTrade(isVirtual: boolean, contractType: string, symbol: string): void {
  track(`dtrader_trade_${accountSuffix(isVirtual)}`, { contract_type: contractType, symbol });
}

/** `source` is where the bot was started from: the builder, or the list of saved bots. */
export function trackDbotStart(isVirtual: boolean, strategyId: string, source: "builder" | "saved"): void {
  track(`dbot_start_${accountSuffix(isVirtual)}`, { strategy_id: strategyId, start_source: source });
}

export function trackAutoHubStart(isVirtual: boolean, botId: string): void {
  track(`autohub_start_${accountSuffix(isVirtual)}`, { bot_id: botId });
}
