/**
 * Affiliate attribution on the client.
 *
 * Someone arrives on ANY page with `?ref=CODE`, wanders around, and registers
 * some minutes later — so the code has to be remembered between the landing and
 * the signup, and it has to survive the detour through the login page that
 * people take when they realise they need an account.
 *
 * Two deliberate limits:
 *
 *   sessionStorage, not localStorage or a cookie. The code lives for this visit
 *   only. A months-long attribution window is a business decision about whose
 *   commission it is, not something to arrive at by picking a storage API; and
 *   sessionStorage keeps it out of every request and away from consent rules.
 *
 *   Nothing here is trusted. The value is a hint the browser supplies, and the
 *   server resolves it — an unknown code simply leaves the account
 *   unattributed. The shape check below is only so obvious junk from a crafted
 *   URL never gets stored or sent.
 */

const STORAGE_KEY = "fxnod.referral_code";

/** Codes are generated from uppercase letters and digits; see ReferralService. */
const CODE_PATTERN = /^[A-Z0-9]{4,32}$/;

function normalize(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const code = raw.trim().toUpperCase();
  return CODE_PATTERN.test(code) ? code : null;
}

/**
 * Remember the `ref` in a query string, if there is a usable one.
 *
 * First one wins. Someone who arrives through one affiliate's link and later
 * hits another has already been introduced by the first, and letting the last
 * link overwrite it would make attribution a race between whoever can get one
 * more click in before signup.
 */
export function captureReferralCode(search: string): void {
  const code = normalize(new URLSearchParams(search).get("ref"));
  if (!code) return;
  try {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return;
    window.sessionStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Private mode, or storage disabled. Attribution is best-effort by design;
    // it must never stop someone signing up.
  }
}

/** The code to send with a registration, if this visit came through a link. */
export function readReferralCode(): string | null {
  try {
    return normalize(window.sessionStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

/**
 * Forget the code once it has been spent on an account.
 *
 * Without this, a second account created in the same browser session would be
 * attributed to the same affiliate — which is both wrong and the cheapest
 * possible way to farm referrals.
 */
export function clearReferralCode(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clean up if storage was never readable.
  }
}
