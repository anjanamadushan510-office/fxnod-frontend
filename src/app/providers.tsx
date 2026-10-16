"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "next-themes";

import { Analytics } from "@/components/analytics/Analytics";
import { captureReferralCode } from "@/lib/referral";
import { useAuthStore } from "@/stores/authStore";
import { MaintenanceBanner } from "@/components/layout/MaintenanceBanner";

/**
 * App-wide client providers.
 *
 * - One QueryClient per browser session, created in state so it survives
 *   re-renders but is never shared across requests (important for the App
 *   Router / RSC boundary).
 * - On mount, `bootstrap()` restores the session: there is no access token in
 *   memory after a reload, so /users/me 401s, the axios interceptor refreshes
 *   via the httpOnly cookie, and the retry succeeds if the cookie is valid.
 */
export function Providers({
  children,
  nonce,
}: {
  children: React.ReactNode;
  /** CSP nonce for the inline theme script next-themes injects. */
  nonce?: string;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000, // 30s — avoid refetch storms on navigation
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  const bootstrap = useAuthStore((s) => s.bootstrap);
  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  // An affiliate link can land on any page, and the visitor may only register
  // several pages later — so the code is picked up app-wide and remembered,
  // rather than being read on the signup form where it usually is not.
  //
  // window.location rather than useSearchParams: this sits above every route,
  // and useSearchParams here would opt the whole app out of static rendering.
  // Only the entry URL matters, so reading it once on mount is enough.
  useEffect(() => {
    captureReferralCode(window.location.search);
  }, []);

  return (
    <ThemeProvider attribute={["class", "data-theme"]} defaultTheme="dark" enableSystem disableTransitionOnChange nonce={nonce}>
      <QueryClientProvider client={queryClient}>
        <ThemeColorSync />
        <MaintenanceBanner />
        {children}
      <Analytics />
      {/* App-wide toast portal (trade results, Deriv linking, …). */}
      <ThemedToaster />
      {/* Dev-only: the devtools entry self-excludes from production bundles,
          and this NODE_ENV guard is statically eliminated by Next at build. */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
    </ThemeProvider>
  );
}

function ThemeColorSync() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = resolvedTheme === "light" ? "#f3f6fb" : "#080f1c";
  }, [resolvedTheme]);
  return null;
}

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return <Toaster theme={resolvedTheme === "dark" ? "dark" : "light"} richColors position="top-center" closeButton />;
}
