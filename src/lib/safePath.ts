/**
 * Accepts only a path inside this app, for use as a "go back there after
 * signing in" target.
 *
 * The value arrives in a query string, so it is attacker-controlled: a link
 * to /login?next=https://evil.example would otherwise turn our login page
 * into the first hop of a phishing redirect. A leading "//" or "/\" is a
 * scheme-relative URL to another host in every browser, and control
 * characters are how the two are smuggled past a naive check.
 */
export function safeInternalPath(raw: string | null | undefined): string | null {
  if (!raw || raw.length > 512) return null;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return null;
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f\\]/.test(raw)) return null;
  // Never send someone back to the pages that sign them in.
  if (raw === "/auth" || raw.startsWith("/auth/") || raw.startsWith("/auth?")) return null;
  return raw;
}

/** Paths that are only for a signed-in user. Shared by the middleware and the gate. */
export const SIGNED_IN_PREFIXES = [
  "/home",
  "/dbot",
  "/autohub",
  "/wallet",
  "/settings",
  "/tools",
  "/venues",
  "/transfer",
  "/referrals",
  "/partner/dashboard",
  "/subscriptions",
] as const;

export function needsSignIn(pathname: string): boolean {
  return SIGNED_IN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

const LOGIN_PATH = "/auth/login";

/** The login URL that returns to `path` afterwards. */
export function loginUrlFor(path: string): string {
  const next = safeInternalPath(path);
  return next ? `${LOGIN_PATH}?next=${encodeURIComponent(next)}` : LOGIN_PATH;
}
