import type { Route } from "next";
import Link from "next/link";

/**
 * The footer that carries the partner programme.
 *
 * FXNod had no site footer at all, which is why there was nowhere to put an
 * affiliate entry point. A footer is the conventional home for one: it is on
 * every page, it does not compete with the trading UI for attention, and it is
 * where someone goes looking for "how do I earn from this".
 *
 * "Partner" points at the public explainer rather than straight at the
 * dashboard, so it works for a signed-out visitor — which is the visitor an
 * affiliate programme is trying to reach.
 */

const SECTIONS: { title: string; links: { label: string; href: Route }[] }[] = [
  {
    title: "Earn",
    links: [
      { label: "Partner programme", href: "/partner" },
      { label: "Your partner dashboard", href: "/partner/dashboard" },
    ],
  },
  {
    title: "Trade",
    links: [
      { label: "Options", href: "/options" },
      { label: "Subscriptions", href: "/subscriptions" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Dashboard", href: "/home" },
      { label: "Log in", href: "/auth/login" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[#0a0f1c]/10 bg-white/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <span className="text-lg font-extrabold tracking-tight text-[#0a0f1c]">
            FX<span className="text-[#c9a24e]">NOD</span>
          </span>
          <p className="m-0 mt-3 max-w-[28ch] text-sm leading-relaxed text-[#0a0f1c]/55">
            Trade options and run automated bots, with a wallet that settles in
            USDT.
          </p>
        </div>

        {SECTIONS.map((section) => (
          <nav key={section.title} aria-label={section.title}>
            <h2 className="m-0 text-xs font-bold uppercase tracking-wider text-[#0a0f1c]/40">
              {section.title}
            </h2>
            <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-[#0a0f1c]/70 transition-colors hover:text-[#c9a24e]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-[#0a0f1c]/5 px-6 py-5 lg:px-8">
        <p className="mx-auto m-0 max-w-7xl text-xs text-[#0a0f1c]/40">
          &copy; {new Date().getFullYear()} FXNod. Trading involves risk.
        </p>
      </div>
    </footer>
  );
}
