import Link from "next/link";
import type { Route } from "next";

/**
 * The footer of the public reading pages (guides, blog, about, risk warning).
 *
 * It carries two things every public page of a trading product owes its
 * reader: the risk line, and the statement that FXNOD is not the broker. It
 * also links the public pages to each other, which is how a crawler that
 * lands on one guide finds the rest.
 */

const LINKS: { label: string; href: string }[] = [
  { label: "Guides", href: "/guides" },
  { label: "Blog", href: "/blog" },
  { label: "Partner programme", href: "/partner" },
  { label: "About", href: "/about" },
  { label: "Risk warning", href: "/risk-disclosure" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-line px-5 sm:px-8 lg:px-12 py-10 mt-20">
      <div className="max-w-6xl mx-auto">
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400 mb-6">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href as Route} className="hover:text-white transition">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-[11px] text-zinc-600 leading-relaxed max-w-3xl">
          &copy; {new Date().getFullYear()} FXNOD. Trading involves risk and you can lose your entire stake. FXNOD is an
          independent product and is not affiliated with Deriv, Bybit or Binance.
        </p>
      </div>
    </footer>
  );
}
