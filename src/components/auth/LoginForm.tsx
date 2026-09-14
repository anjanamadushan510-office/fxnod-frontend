"use client";

import { useState, useEffect } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { useLogin } from "@/services/api/endpoints/auth/auth";
import { setAccessToken } from "@/services/authToken";
import { useAuthStore } from "@/stores/authStore";
import { parseApiError } from "@/lib/apiError";

/**
 * Login screen wired to the Orval `useLogin` mutation (POST /api/v1/auth/login
 * through the shared credentialed Axios instance — the backend sets the
 * httpOnly refresh cookie). On success we stash the access token, run the auth
 * store's bootstrap() to load the user + flip status to "authenticated", then
 * redirect to the home dashboard (users pick a service from there).
 */
export function LoginForm() {
  const router = useRouter();
  const bootstrap = useAuthStore((s) => s.bootstrap);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
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
      onSuccess: async (data) => {
        setAccessToken(data.access_token);
        await bootstrap(); // GET /users/me → store user + status: authenticated
        toast.success("Welcome back");
        router.push("/" as Route);
      },
      onError: (err) => {
        const parsed = parseApiError(err, "Login failed. Please try again.");
        setFieldErrors(parsed.fieldErrors);
        toast.error(parsed.message);
      },
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    loginMut.mutate({ data: { email, password } });
  }

  // Find the first error string to display in the single <p id="auth-error"> element
  const generalError = fieldErrors.detail || fieldErrors.email || fieldErrors.password || "";

  return (
    <div className="h-[100dvh] overflow-hidden grid lg:grid-cols-2 bg-[#080C16] text-white font-sans antialiased">
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
            Build and run your own Deriv strategies. Free with markup, or monthly from your wallet.
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
        className="flex flex-col items-center justify-center px-4 sm:px-5 py-6 sm:py-8 overflow-y-auto"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))", paddingTop: "max(1.5rem, env(safe-area-inset-top))" }}
      >
        <div className="w-full max-w-[420px]">
          <Link href="/" className="lg:hidden inline-flex mb-6 sm:mb-8" aria-label="FXNOD home">
            <img src="/assets/fxnod-logo.png" alt="FXNOD" className="h-6 sm:h-7 w-auto" />
          </Link>

          <div className="bg-[#101827] border border-[#24344F] rounded-2xl p-5 sm:p-8">
            <h1 id="auth-title" className="font-display text-[28px] font-semibold tracking-tight mb-6">Log in</h1>

            <form id="auth-form" className="space-y-4" noValidate onSubmit={onSubmit}>
              <label className="block">
                <span className="text-sm text-zinc-300">Email</span>
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="username"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full h-12 px-3.5 rounded-xl bg-[#0B1220] border border-[#24344F] focus:border-[#C9A08C] focus:outline-none transition-colors"
                />
              </label>
              <label className="block">
                <span className="text-sm text-zinc-300">Password</span>
                <input
                  id="auth-pass"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={4}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full h-12 px-3.5 rounded-xl bg-[#0B1220] border border-[#24344F] focus:border-[#C9A08C] focus:outline-none transition-colors"
                />
              </label>
              <button
                type="button"
                id="forgot-btn"
                className="text-sm text-zinc-400 hover:text-white"
                onClick={() => toast.info("Forgot password flow coming soon.")}
              >
                Forgot your password?
              </button>
              <p id="auth-error" className="text-xs text-red-400 min-h-[1rem]">
                {generalError}
              </p>
              <button
                type="submit"
                id="auth-submit"
                disabled={loginMut.isPending}
                className="w-full h-12 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loginMut.isPending ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className="relative my-6">
              <div className="h-px bg-[#24344F]"></div>
              <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3 bg-[#101827] text-[11px] uppercase tracking-wider text-zinc-500">
                or
              </span>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                className="w-full h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2.5 bg-[#152238] border border-[#24344F] hover:bg-[#1A3358] transition-colors"
                onClick={() => toast.info("Demo login coming soon.")}
              >
                Continue as demo
              </button>
              <button
                type="button"
                className="w-full h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2.5 bg-[#152238] border border-[#24344F] hover:bg-[#1A3358] transition-colors"
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
                className="w-full h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2.5 bg-[#152238] border border-[#24344F] hover:bg-[#1A3358] transition-colors"
                onClick={() => toast.info("Apple login coming soon.")}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.7 2.3-1.6 2.8-.4 6.9 1.1 9.2.8 1.1 1.7 2.3 2.9 2.3 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-.1 2.9-2.3c.6-1.1 1.1-2.2 1.1-2.2s-2.2-.8-2.2-3.1zM14.7 6.3c.6-.8 1.1-1.9.9-3-1 .1-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.5 2.9-1.4z" />
                </svg>
                Log in with Apple
              </button>
            </div>
          </div>

          <p id="auth-switch" className="text-sm text-zinc-500 text-center mt-6">
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
