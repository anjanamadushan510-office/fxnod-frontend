/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── Production build optimizations ───────────────────────────────────────
  // Don't leak the framework in headers.
  poweredByHeader: false,
  // Gzip handled by Vercel's edge; keep on for self-hosted fallback too.
  compress: true,
  // Source maps for the browser bundle are a info-leak + size cost in prod.
  productionBrowserSourceMaps: false,

  experimental: {
    typedRoutes: true,
    // Trim what ships to the client for these heavy libs.
    optimizePackageImports: ["lucide-react", "@tanstack/react-query"],
  },

  // Remote images (none yet) — declare patterns here when product art lands.
  images: {
    remotePatterns: [],
  },

  // The API base + WS URL are the only runtime-public config. They're read
  // through src/lib/env.ts, never hardcoded. Listing them here documents the
  // contract and lets `next build` fail fast in CI if they're referenced
  // before being defined.
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },

  // Development-only API proxy.
  //
  // `next dev` on localhost is not in the API's CORS allowlist, and it must not
  // be: that allowlist protects a credentialed production endpoint, and widening
  // it so a developer can point a local UI at prod would trade a real security
  // boundary for convenience. Proxying through the dev server instead makes the
  // browser see a same-origin request, so no CORS is involved at all.
  //
  // Opt-in via DEV_API_PROXY_TARGET, never on by default — an accidental proxy
  // to prod is how local experiments reach real data. Set it in .env.local
  // alongside NEXT_PUBLIC_API_URL=http://localhost:3000.
  // dBot moved out of the options scope into the dashboard, where the rest of
  // the account lives. These are the paths people already have open, bookmarked
  // or linked from older emails; they are temporary (307) because the old
  // routes may come back as a run view if the shape of the product changes.
  async redirects() {
    return [
      { source: "/options/dbot", destination: "/dbot", permanent: false },
      { source: "/options/dbot/history", destination: "/dbot", permanent: false },
      {
        source: "/options/dbot/subscription",
        destination: "/dbot/subscription",
        permanent: false,
      },
    ];
  },

  async rewrites() {
    const reportRewrites = [
      { source: "/reports/:path*", destination: "/options/dtrader" },
    ];
    if (process.env.NODE_ENV === "production") return reportRewrites;
    const target = process.env.DEV_API_PROXY_TARGET;
    if (!target) return reportRewrites;
    return [...reportRewrites, { source: "/api/:path*", destination: `${target}/api/:path*` }];
  },
};

export default nextConfig;
