import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { BarsIcon, AppsGridIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

/**
 * /options — platform picker.
 *
 * "Options" in the nav used to jump straight into manual trading. It now lands
 * here, because options trading is no longer one product: dTrader is the manual
 * ticket, dBot is the automated one, and more platforms are planned. Sending
 * someone directly to dTrader would make every future platform a second-class
 * citizen reachable only from inside another one.
 *
 * Deliberately a server component — it is static links and copy, so there is no
 * reason to ship it as client JS. The trading apps themselves stay client-side.
 */

interface Platform {
  key: string;
  name: string;
  tagline: string;
  description: string;
  href: Route;
  icon: ReactNode;
  cta: string;
  /** Renders the muted "not yet available" treatment and disables the link. */
  comingSoon?: boolean;
}

const PLATFORMS: Platform[] = [
  {
    key: "dtrader",
    name: "dTrader",
    tagline: "Trade manually",
    description:
      "Place options trades yourself with live charts, market picker and full contract control.",
    href: "/options/dtrader" as Route,
    icon: <BarsIcon className="h-7 w-7" />,
    cta: "Open dTrader",
  },
  {
    key: "dbot",
    name: "dBot",
    tagline: "Trade automatically",
    description:
      "Run an automated strategy with your own stake, take-profit and session limits. Stops itself when a limit is reached.",
    href: "/options/dbot" as Route,
    icon: <AppsGridIcon className="h-7 w-7" />,
    cta: "Open dBot",
  },
];

export default function OptionsHubPage() {
  return (
    <>
      <TopNav />

      <div className="mx-auto flex max-w-[1000px] flex-col gap-8 px-8 pb-20 pt-12 max-lg:gap-6 max-lg:px-4 max-lg:pt-8">
        <header className="flex flex-col gap-2">
          <h1 className="m-0 text-[26px] font-bold tracking-[-0.02em] text-ink max-lg:text-[22px]">
            Options
          </h1>
          <p className="m-0 max-w-[52ch] text-[14px] leading-relaxed text-ink-3">
            Choose how you want to trade. You can switch between platforms at any
            time — they share the same account and balance.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1 max-lg:gap-4">
          {PLATFORMS.map((platform) => (
            <PlatformCard key={platform.key} platform={platform} />
          ))}
        </div>
      </div>
    </>
  );
}

function PlatformCard({ platform }: { platform: Platform }) {
  const body = (
    <>
      <div
        className={cn(
          "grid h-14 w-14 place-items-center rounded-full",
          "bg-[linear-gradient(180deg,var(--navy),var(--navy-3))] text-gold",
          "shadow-[inset_0_0_0_2.5px_var(--gold),0_0_0_4px_rgba(201,162,78,0.15)]",
        )}
      >
        {platform.icon}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <h2 className="m-0 text-[19px] font-bold tracking-[-0.01em] text-ink">
            {platform.name}
          </h2>
          <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-semibold text-gold-3">
            {platform.tagline}
          </span>
        </div>
        <p className="m-0 text-[13px] leading-relaxed text-ink-3">
          {platform.description}
        </p>
      </div>

      <span
        className={cn(
          "mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold",
          platform.comingSoon ? "text-ink-3" : "text-gold-3",
        )}
      >
        {platform.comingSoon ? "Coming soon" : platform.cta}
        {!platform.comingSoon && <span aria-hidden="true">→</span>}
      </span>
    </>
  );

  const shell = cn(
    "flex min-h-[230px] flex-col items-start gap-4 rounded-2xl border border-line",
    "bg-surface p-6 shadow-card",
  );

  if (platform.comingSoon) {
    return (
      <div className={cn(shell, "opacity-60")} aria-disabled="true">
        {body}
      </div>
    );
  }

  return (
    <Link
      href={platform.href}
      className={cn(
        shell,
        "transition-[transform,box-shadow,border-color] duration-150",
        "hover:-translate-y-0.5 hover:border-gold hover:shadow-nav",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
      )}
    >
      {body}
    </Link>
  );
}
