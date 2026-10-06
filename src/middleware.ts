import { NextResponse, type NextRequest } from "next/server";
import { DEPLOYMENT_HOST_SUFFIX, isIndexablePath } from "@/lib/site";
import { loginUrlFor, needsSignIn } from "@/lib/safePath";
import { SESSION_HINT_COOKIE } from "@/lib/sessionHint";

/**
 * Content-Security-Policy with a per-request nonce.
 *
 * This is the second line of defence against script injection — the first is
 * that nothing untrusted is rendered as HTML (blog posts are sanitised by the
 * server on write and on read). If that ever fails, this is what stops an
 * injected <script> from running in a page that holds a trader's session.
 *
 * Why a nonce and not `script-src 'self' 'unsafe-inline'`: Next.js emits
 * inline bootstrap scripts, so a static policy has to allow ALL inline script,
 * and a policy that allows inline script does not stop XSS. With a nonce only
 * the scripts this response itself emitted may run. 'strict-dynamic' then lets
 * those scripts load the app's own chunks.
 *
 * The cost is that pages render per request rather than being prerendered —
 * Next can only stamp a nonce on a page it renders for that request. The root
 * layout reads the nonce (see app/layout.tsx), which is what opts every route
 * into that.
 *
 * `connect-src` is the list of every host the browser may talk to. A script
 * that did get in could not send a token anywhere else. Adding a new
 * third-party call to the app means adding its host here on purpose.
 */

/** Deriv's public market-data sockets (services/deriv/derivSymbols.ts). */
const DERIV_SOCKETS = ["wss://ws.derivws.com", "wss://api.derivws.com"];

function origin(value: string | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV !== "production";

  const connect = new Set<string>(["'self'", ...DERIV_SOCKETS]);
  const api = origin(process.env.NEXT_PUBLIC_API_URL);
  const ws = origin(process.env.NEXT_PUBLIC_WS_URL);
  const derivWs = origin(process.env.NEXT_PUBLIC_DERIV_WS_URL);
  if (api) connect.add(api);
  // URL.origin of a ws(s) URL is that scheme and host, which is what CSP wants.
  if (ws) connect.add(ws);
  if (derivWs) connect.add(derivWs);
  // Hot reload talks to the dev server over a websocket.
  if (isDev) connect.add("ws:");

  const directives = [
    "default-src 'self'",
    // 'unsafe-eval' in development only: React Refresh needs it.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Inline styles are everywhere (style attributes, chart canvases, toasts).
    // Style injection cannot run code, so this is the accepted trade.
    "style-src 'self' 'unsafe-inline'",
    // https: because a blog cover may be hosted anywhere; an image cannot
    // execute.
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src ${[...connect].join(" ")}`,
    "media-src 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "frame-src 'none'",
    // Nobody may frame the app: a framed trading page is a clickjacking page.
    "frame-ancestors 'none'",
    "object-src 'none'",
    // No <base> injection redirecting every relative URL to another host.
    "base-uri 'self'",
    "form-action 'self'",
  ];
  if (!isDev) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}

export function middleware(request: NextRequest) {
  // A signed-in page asked for by a browser that carries no session marker is
  // answered with the login page, before any of it is served. The marker is a
  // hint, not proof (see lib/sessionHint.ts): the client gate and, above all,
  // the API are what stand behind this.
  const { pathname, search } = request.nextUrl;
  if (needsSignIn(pathname) && !request.cookies.has(SESSION_HINT_COOKIE)) {
    const login = new URL(loginUrlFor(pathname + search), request.url);
    const redirect = NextResponse.redirect(login, 307);
    redirect.headers.set("X-Robots-Tag", "noindex");
    redirect.headers.set("Cache-Control", "no-store");
    return redirect;
  }

  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce);

  // Next reads the nonce out of the policy on the REQUEST headers and stamps
  // it on its own scripts; x-nonce is for our layout to read.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  // Search engines may index only the public pages; everything behind the
  // login is an empty shell to a signed-out crawler. The same build also
  // answers on the project's *.vercel.app alias and on the staging and testing
  // previews, and a copy of the site indexed there competes with the real one.
  //
  // The host rule names the hosts to exclude rather than the one to allow. If
  // the Host header were ever not what this expects, an allow rule would take
  // the production site out of search entirely; an exclude rule leaves a
  // duplicate that the canonical link on every page already points away from.
  const host = (request.headers.get("host") ?? "").toLowerCase().split(":")[0];
  if (host.endsWith(DEPLOYMENT_HOST_SUFFIX) || !isIndexablePath(request.nextUrl.pathname)) {
    response.headers.set("X-Robots-Tag", "noindex");
  }
  return response;
}

export const config = {
  matcher: [
    // Documents only. Static assets carry no script context of their own, and
    // prefetches are skipped so a prefetched page is not cached with a nonce
    // the real navigation will not share.
    {
      source: "/((?!api|_next/static|_next/image|assets/|trade-types/|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
