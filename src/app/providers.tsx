"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

import { captureReferralCode } from "@/lib/referral";
import { useAuthStore } from "@/stores/authStore";

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
export function Providers({ children }: { children: React.ReactNode }) {
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
    <QueryClientProvider client={queryClient}>
      {children}
      {/* App-wide toast portal (trade results, Deriv linking, …). */}
      <Toaster richColors position="top-center" closeButton />
      {/* Dev-only: the devtools entry self-excludes from production bundles,
          and this NODE_ENV guard is statically eliminated by Next at build. */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}
