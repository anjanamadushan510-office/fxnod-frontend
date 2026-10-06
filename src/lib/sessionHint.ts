/**
 * A first-party marker that this browser was signed in when it last asked.
 *
 * It is NOT a credential and grants nothing. The session itself is the
 * httpOnly refresh cookie on the API host, which this app's own server can
 * never see: the API is a different origin. So the middleware has no way to
 * know, when a request for /home arrives, whether there is a session behind
 * it. This cookie is the answer the browser leaves for it: present after a
 * successful sign-in or session restore, removed on sign-out or expiry.
 *
 * The middleware uses it only to decide whether to send someone to the login
 * page before any signed-in page is served. Anyone can set it by hand; all
 * that gets them is the empty shell the client gate then replaces with the
 * login page, because every piece of data still needs the API to accept a
 * real token. Do not make anything trust it for more than that.
 */
export const SESSION_HINT_COOKIE = "fx_session";

/** As long as the refresh cookie lives; renewed on every successful restore. */
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function write(value: string, maxAge: number): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SESSION_HINT_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function setSessionHint(): void {
  write("1", MAX_AGE_SECONDS);
}

export function clearSessionHint(): void {
  write("", 0);
}
