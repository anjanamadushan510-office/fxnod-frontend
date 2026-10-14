"use client";

import { useState, useEffect } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { useLogin, useVerifyTwoFALogin } from "@/services/api/endpoints/auth/auth";
import { setAccessToken } from "@/services/authToken";
import { useAuthStore } from "@/stores/authStore";
import { parseApiError } from "@/lib/apiError";
import { safeInternalPath } from "@/lib/safePath";
import { ForgotPasswordFlow } from "./ForgotPasswordFlow";

/**
 * Login screen wired to the Orval `useLogin` mutation (POST /api/v1/auth/login
 * through the shared credentialed Axios instance — the backend sets the
 * httpOnly refresh cookie). On success we stash the access token, run the auth
 * store's bootstrap() to load the user + flip status to "authenticated", then
 * redirect to the home dashboard (users pick a service from there).
 */
/**
 * Where to go once signed in: the page the visitor was sent here from, when
 * the link names one inside this app, and the home dashboard otherwise.
 * Read from the address bar at the moment it is needed; useSearchParams here
 * would opt the login page out of static rendering.
 */
function afterSignIn(): Route {
  const next = safeInternalPath(new URLSearchParams(window.location.search).get("next"));
  return (next ?? "/home") as Route;
}

export function LoginForm() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  // Someone who is already signed in has no business on this page: a visitor
  // sent here by the middleware whose session then restored, or a bookmark.
  useEffect(() => {
    if (status === "authenticated") router.replace(afterSignIn());
  }, [status, router]);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // 2FA state
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const loginMut = useLogin({
    mutation: {
      onSuccess: async (data, variables, context) => {
        // If data has requires_2fa, it's the 202 response
        if ("requires_2fa" in data && data.requires_2fa) {
          setPendingToken(data.pending_token);
          toast.info("Please enter the 2FA code sent to your email.");
          return;
        }
        
        // Otherwise it's a normal TokenPair
        if ("access_token" in data) {
          setAccessToken(data.access_token);
          await bootstrap(); // GET /users/me → store user + status: authenticated
          toast.success("Welcome back");
          router.push(afterSignIn());
        }
      },
      onError: (err) => {
        const parsed = parseApiError(err, "Login failed. Please try again.");
        setFieldErrors(parsed.fieldErrors);
        toast.error(parsed.message);
      },
    },
  });

  const verify2FAMut = useVerifyTwoFALogin({
    mutation: {
      onSuccess: async (data) => {
        setAccessToken(data.access_token);
        await bootstrap();
        toast.success("Welcome back");
        router.push(afterSignIn());
      },
      onError: (err) => {
        const parsed = parseApiError(err, "Invalid code. Please try again.");
        setFieldErrors(parsed.fieldErrors);
        toast.error(parsed.message);
      },
    },
    request: {
      headers: {
        Authorization: pendingToken ? `Bearer ${pendingToken}` : "",
      },
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    
    if (pendingToken) {
      if (!otpCode.trim()) {
        setFieldErrors({ otp: "Please enter the code." });
        return;
      }
      verify2FAMut.mutate({ data: { pending_token: pendingToken, code: otpCode.trim() } });
    } else {
      loginMut.mutate({ data: { email, password } });
    }
  }

  // Find the first error string to display in the single <p id="auth-error"> element
  const generalError = fieldErrors.detail || fieldErrors.email || fieldErrors.password || fieldErrors.otp || fieldErrors.code || "";

  return (
    <div className="grid min-h-[100dvh] bg-[#080C16] font-sans text-white antialiased lg:h-[100dvh] lg:grid-cols-2 lg:overflow-hidden">
      <aside className="relative hidden lg:block overflow-hidden m-3 rounded-2xl">
        <div className="absolute inset-0">
          <img
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${currentSlide === 0 ? "opacity-100" : "opacity-0"}`}
            src="/assets/login-slide-1.jpg"
            alt=""
          />
          <img
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${currentSlide === 1 ? "opacity-100" : "opacity-0"}`}
            src="/assets/login-slide-2.jpg"
            alt=""
          />
          <img
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${currentSlide === 2 ? "opacity-100" : "opacity-0"}`}
            src="/assets/login-slide-3.jpg"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080C16] via-[#080C16]/25 to-[#080C16]/40"></div>
        </div>
        <Link href="/" className="absolute top-8 left-8 z-10" aria-label="FXNOD home">
          <img src="/assets/fxnod-logo.png" alt="FXNOD" className="h-7 w-auto" />
        </Link>
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="h-40 w-40 rounded-full bg-[#080C16]/40 backdrop-blur-md border border-[#C9A08C]/20 flex items-center justify-center shadow-2xl">
            <img src="/assets/fxnod-mark.png" alt="" className="h-24 w-24 object-contain" />
          </div>
        </div>
        <div className="absolute bottom-10 left-8 right-8 z-10">
          <h2 id="slide-title" className="font-display text-3xl font-semibold tracking-tight mb-3">
            The Ultimate Trading Hub
          </h2>
          <p id="slide-copy" className="text-sm text-zinc-300 max-w-md leading-relaxed mb-6">
            Build and run your own Deriv strategies. Choose a tool package and access period from your FXNOD Wallet.
          </p>
          <div className="flex gap-2" id="slide-dots">
            <button
              type="button"
              className={`h-1.5 rounded-full transition-all ${currentSlide === 0 ? "w-6 bg-[#C9A08C]" : "w-1.5 bg-white/30"}`}
              onClick={() => setCurrentSlide(0)}
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              className={`h-1.5 rounded-full transition-all ${currentSlide === 1 ? "w-6 bg-[#C9A08C]" : "w-1.5 bg-white/30"}`}
              onClick={() => setCurrentSlide(1)}
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              className={`h-1.5 rounded-full transition-all ${currentSlide === 2 ? "w-6 bg-[#C9A08C]" : "w-1.5 bg-white/30"}`}
              onClick={() => setCurrentSlide(2)}
              aria-label="Slide 3"
            ></button>
          </div>
        </div>
      </aside>

      <section
        className="relative flex min-w-0 flex-col items-center bg-[radial-gradient(ellipse_at_80%_0%,rgba(42,83,139,0.24),transparent_54%)] px-4 py-4 sm:px-5 lg:overflow-y-auto lg:bg-none"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))", paddingTop: "max(1.5rem, env(safe-area-inset-top))" }}
      >
        <div className="relative w-full max-w-[420px] py-3 lg:my-auto lg:py-4">
          <Link href="/" className="mb-6 inline-flex lg:hidden" aria-label="FXNOD home">
            <img src="/assets/fxnod-logo.png" alt="FXNOD" className="h-8 w-auto" />
          </Link>

          <div className="mb-6 lg:hidden">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d1ad67]">Your trading workspace</p>
            <p className="font-display text-[30px] font-semibold leading-tight tracking-tight text-white">Welcome back.</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">Sign in to pick up where you left off.</p>
          </div>

          <div className="relative rounded-[1.5rem] border border-[#2d4261] bg-[#101b2e]/95 p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.85)] sm:p-6 lg:rounded-2xl lg:border-[#24344F] lg:bg-[#101827] lg:shadow-none">
            <div aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d1ad67]/70 to-transparent lg:hidden" />
            {isForgotPassword ? (
              <ForgotPasswordFlow onBackToLogin={() => setIsForgotPassword(false)} />
            ) : (
              <>
                <h1 id="auth-title" className="mb-6 font-display text-[26px] font-semibold tracking-tight lg:text-[28px]">
                  {pendingToken ? "Check your email" : "Log in"}
                </h1>

            <form id="auth-form" className="space-y-3" noValidate onSubmit={onSubmit}>
              {!pendingToken ? (
                <>
                  <label className="block">
                    <span className="text-sm text-zinc-300">Email</span>
                    <input
                      id="auth-email"
                      type="email"
                      inputMode="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      autoComplete="username"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 h-12 w-full rounded-xl border border-[#334866] bg-[#0B1220] px-3.5 text-base outline-none transition-colors focus:border-[#d1ad67] focus:ring-2 focus:ring-[#d1ad67]/20 lg:h-10 lg:border-[#24344F] lg:focus:ring-0"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-zinc-300">Password</span>
                    <div className="relative mt-2">
                      <input
                        id="auth-pass"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        minLength={4}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 w-full rounded-xl border border-[#334866] bg-[#0B1220] pl-3.5 pr-12 text-base outline-none transition-colors focus:border-[#d1ad67] focus:ring-2 focus:ring-[#d1ad67]/20 lg:h-10 lg:border-[#24344F] lg:focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center text-zinc-400 hover:text-white"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                  </label>
                  <button
                    type="button"
                    id="forgot-btn"
                    className="inline-flex min-h-11 items-center text-sm text-zinc-300 hover:text-white lg:min-h-0"
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Forgot your password?
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-zinc-300 mb-2">We sent a 6-digit code to {email}.</p>
                  <label className="block">
                    <span className="text-sm text-zinc-300">Two-Factor Code</span>
                    <input
                      id="auth-otp"
                      type="text"
                      autoComplete="one-time-code"
                      required
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="mt-2 h-12 w-full rounded-xl border border-[#334866] bg-[#0B1220] px-3.5 text-center font-mono text-base tracking-[0.5em] outline-none transition-colors focus:border-[#d1ad67] focus:ring-2 focus:ring-[#d1ad67]/20 lg:h-10 lg:border-[#24344F] lg:focus:ring-0"
                    />
                  </label>
                  <button
                    type="button"
                    className="text-sm text-zinc-400 hover:text-white"
                    onClick={() => {
                      setPendingToken(null);
                      setOtpCode("");
                      setFieldErrors({});
                    }}
                  >
                    Back to login
                  </button>
                </>
              )}
              
              <p id="auth-error" className="text-xs text-negative min-h-[1rem]">
                {generalError}
              </p>
              <button
                type="submit"
                id="auth-submit"
                disabled={loginMut.isPending || verify2FAMut.isPending}
                className="h-12 w-full rounded-xl bg-[#d8b877] text-[#101827] text-sm font-semibold transition-colors hover:bg-[#eed09a] disabled:cursor-not-allowed disabled:opacity-50 lg:h-10 lg:bg-white lg:font-medium lg:text-black lg:hover:bg-zinc-200"
              >
                {loginMut.isPending || verify2FAMut.isPending ? "Please wait..." : (pendingToken ? "Verify Code" : "Log in")}
              </button>
            </form>


            <div className="relative my-4">
              <div className="h-px bg-[#24344F]"></div>
              <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3 bg-[#101827] text-[11px] uppercase tracking-wider text-zinc-500">
                or
              </span>
            </div>

            <div className="space-y-2.5">

              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-[#334866] bg-[#152238] text-sm font-medium transition-colors hover:bg-[#1A3358] lg:h-10 lg:border-[#24344F]"
                onClick={() => toast.info("Google login coming soon.")}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.8-4.1 2.8-7 0-.7-.1-1.3-.2-1.9H12z" />
                  <path fill="#34A853" d="M6.6 14.3l-.8.6-2.8 2.2C4.8 20.1 8.1 22 12 22c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 .9-3.6.9-2.8 0-5.1-1.9-6-4.4z" />
                  <path fill="#4A90E2" d="M3 7c-.6 1.2-1 2.6-1 4s.4 2.8 1 4c0 .1 3.6-2.8 3.6-2.8-.2-.6-.3-1.2-.3-1.8 0-.6.1-1.2.3-1.8L3 7z" />
                  <path fill="#FBBC05" d="M12 5.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.2 14.7 1.2 12 1.2 8.1 1.2 4.8 3.1 3 6.3l3.6 2.8c.9-2.5 3.2-4 6-4z" />
                </svg>
                Log in with Google
              </button>
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-[#334866] bg-[#152238] text-sm font-medium transition-colors hover:bg-[#1A3358] lg:h-10 lg:border-[#24344F]"
                onClick={() => toast.info("Apple login coming soon.")}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.7 2.3-1.6 2.8-.4 6.9 1.1 9.2.8 1.1 1.7 2.3 2.9 2.3 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-.1 2.9-2.3c.6-1.1 1.1-2.2 1.1-2.2s-2.2-.8-2.2-3.1zM14.7 6.3c.6-.8 1.1-1.9.9-3-1 .1-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.5 2.9-1.4z" />
                </svg>
                Log in with Apple
              </button>
            </div>
            </>
            )}
          </div>

          <p id="auth-switch" className="mt-5 text-center text-sm text-slate-400 lg:mt-6 lg:text-zinc-500">
            Don't have an FXNOD account?{" "}
            <Link href="/auth/register" className="text-white hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
