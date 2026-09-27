"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useAuthStore } from "@/stores/authStore";

export function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const status = useAuthStore((s) => s.status);

  return (
    <div className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md">
      <header className="site-header min-h-16 border-b border-line flex items-center justify-between gap-3 py-3 sm:py-0 sm:h-16 sm:px-8 lg:px-12">
        <Link href="/" aria-label="FXNOD home" className="shrink-0">
          <img src="/assets/fxnod-logo.png" alt="FXNOD" className="h-6 sm:h-7 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          <Link href={"/#product" as Route} className="hover:text-white transition">Product</Link>
          <Link href={"/guides" as Route} className="hover:text-white transition">Guides</Link>
          <Link href={"/blog" as Route} className="hover:text-white transition">Blog</Link>
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          {status === "authenticated" ? (
            <Link href={"/home" as Route} className="bg-accent text-[#080C16] hidden md:inline-flex h-9 px-4 items-center rounded-full text-sm font-semibold hover:opacity-90 transition">Go to Dashboard</Link>
          ) : (
            <>
              <Link href={"/auth/login" as Route} className="hidden md:inline-flex h-9 px-4 items-center rounded-full text-sm text-zinc-300 hover:text-white transition">Log in</Link>
              <Link href={"/auth/register" as Route} className="bg-accent text-[#080C16] hidden md:inline-flex h-9 px-4 items-center rounded-full text-sm font-semibold hover:opacity-90 transition">Get started</Link>
            </>
          )}
          <button 
            type="button" 
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            aria-label="Open menu" 
            aria-expanded={isMobileMenuOpen} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>
      </header>
      {isMobileMenuOpen && (
        <nav className="md:hidden border-b border-line bg-panel p-4 flex flex-col gap-4 text-sm" aria-label="Mobile">
          <Link href={"/#product" as Route} onClick={() => setIsMobileMenuOpen(false)}>Product</Link>
          <Link href={"/guides" as Route} onClick={() => setIsMobileMenuOpen(false)}>Guides</Link>
          <Link href={"/blog" as Route} onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
          <hr className="border-line" />
          {status === "authenticated" ? (
            <Link href={"/home" as Route} className="text-accent font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Go to Dashboard</Link>
          ) : (
            <>
              <Link href={"/auth/login" as Route} onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
              <Link href={"/auth/register" as Route} className="text-accent font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Get started</Link>
            </>
          )}
        </nav>
      )}
    </div>
  );
}
