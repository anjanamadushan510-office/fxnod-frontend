"use client";

import { useEffect } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { loginUrlFor } from "@/lib/safePath";
import { useAuthStore } from "@/stores/authStore";

/**
 * Renders its children only for a signed-in user.
 *
 * Until the session has been restored it shows a neutral placeholder, and for
 * a visitor with no session it goes to the login page. Nothing inside it is
 * mounted before then, so no signed-in screen is drawn for someone who is
 * signed out, and no page fires its data requests without a token only to
 * have every one of them refused.
 *
 * This is presentation. What actually protects an account is the API, which
 * refuses every request that does not carry a valid token; a visitor who
 * forces their way past this component sees empty frames.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const hasUser = useAuthStore((s) => s.user !== null);

  // A restore that runs while someone is already in keeps the user it had, so
  // the page under them is not torn down and rebuilt.
  const signedIn = status === "authenticated" || (status === "loading" && hasUser);

  useEffect(() => {
    if (status !== "anonymous") return;
    const here = window.location.pathname + window.location.search;
    router.replace(loginUrlFor(here) as Route);
  }, [status, router]);

  if (signedIn) return <>{children}</>;

  return (
    <div className="grid min-h-[100dvh] place-items-center bg-bg" aria-busy="true" aria-live="polite">
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-ink-2"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
