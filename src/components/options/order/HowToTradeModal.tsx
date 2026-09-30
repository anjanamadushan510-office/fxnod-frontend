"use client";

import { useEffect } from "react";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const DotLottiePlayer = dynamic(
  () => import("@dotlottie/react-player").then((mod) => mod.DotLottiePlayer),
  { ssr: false }
);

const TEAL = "#00A79E";

interface DirectionSection {
  title: string;
  description: React.ReactNode;
  /** Exit price callout shown in the diagram placeholder (last digit bolded). */
  exit: string;
  darkAnim?: string;
  lightAnim?: string;
}

/** Per-trade-type help content (Even/Odd fully fleshed out per §7.1). */
const CONTENT: Record<
  string,
  { intro: React.ReactNode; sections: DirectionSection[] }
> = {
  "Even/Odd": {
    intro: (
      <>
        Even/Odd lets you predict if the last digit of the last tick&apos;s price
        will be an even or odd number at contract{" "}
        <Glossary>expiry</Glossary> (<Glossary>exit spot</Glossary>).
      </>
    ),
    sections: [
      {
        title: "Even",
        description: (
          <>
            Earn a <Glossary>payout</Glossary> if the last digit of the exit spot
            is even (0, 2, 4, 6, or 8).
          </>
        ),
        exit: "1900.02",
      },
      {
        title: "Odd",
        description: (
          <>
            Earn a <Glossary>payout</Glossary> if the last digit of the exit spot
            is odd (1, 3, 5, 7, or 9).
          </>
        ),
        exit: "1900.03",
      },
    ],
  },
  "Rise/Fall": {
    intro: (
      <>
        Rise/Fall lets you predict if the market price will end higher or lower than the <Glossary>entry spot</Glossary> at contract <Glossary>expiry</Glossary>.
      </>
    ),
    sections: [
      {
        title: "Rise",
        description: <>Earn a <Glossary>payout</Glossary> if the <Glossary>exit spot</Glossary> is strictly higher than the <Glossary>entry spot</Glossary>.</>,
        exit: "1900.00",
        darkAnim: "/trade-types/rise-fall/rise_dark.lottie",
        lightAnim: "/trade-types/rise-fall/rise_light.lottie",
      },
      {
        title: "Fall",
        description: <>Earn a <Glossary>payout</Glossary> if the <Glossary>exit spot</Glossary> is strictly lower than the <Glossary>entry spot</Glossary>.</>,
        exit: "1900.00",
        darkAnim: "/trade-types/rise-fall/fall_dark.lottie",
        lightAnim: "/trade-types/rise-fall/fall_light.lottie",
      },
    ],
  },
  "Accumulators": {
    intro: (
      <>
        Accumulators allow you to predict how much an index can move and potentially grow your <Glossary>stake</Glossary> exponentially at a fixed growth rate. Your <Glossary>payout</Glossary> is the sum of your initial <Glossary>stake</Glossary> and profit. It keeps growing as long as the spot price stays within a specified <Glossary>barrier</Glossary> range from the previous spot price at each interval. If the spot price goes outside that range, you lose your <Glossary>stake</Glossary> and the trade is terminated.
      </>
    ),
    sections: [
      {
        title: "Accumulators",
        description: (
          <>
            Your <Glossary>payout</Glossary> keeps growing as long as the spot price stays within a specified <Glossary>barrier</Glossary> range from the previous spot price at each interval.
            <span className="block mt-2"><strong>Take profit:</strong> You can close your trade early to secure your profit.</span>
            <span className="block mt-2"><strong>Note:</strong> You are exposed to slippage risk if the market gaps.</span>
          </>
        ),
        exit: "1900.00",
        darkAnim: "/trade-types/accumulators/accumulators_dark.lottie",
        lightAnim: "/trade-types/accumulators/accumulators_light.lottie",
      },
    ],
  },
  "Matches/Differs": {
    intro: (
      <>
        Matches/Differs lets you predict whether the last digit of the last tick&apos;s price will match your chosen number at contract <Glossary>expiry</Glossary> (<Glossary>exit spot</Glossary>).
      </>
    ),
    sections: [
      {
        title: "Matches",
        description: <>Earn a <Glossary>payout</Glossary> if the last digit of the <Glossary>exit spot</Glossary> matches your prediction.</>,
        exit: "1900.00",
        darkAnim: "/trade-types/matches-differs/matches_dark.lottie",
        lightAnim: "/trade-types/matches-differs/matches_light.lottie",
      },
      {
        title: "Differs",
        description: <>Earn a <Glossary>payout</Glossary> if the last digit of the <Glossary>exit spot</Glossary> differs from your prediction.</>,
        exit: "1900.00",
        darkAnim: "/trade-types/matches-differs/differs_dark.lottie",
        lightAnim: "/trade-types/matches-differs/differs_light.lottie",
      },
    ],
  },
  "Over/Under": {
    intro: (
      <>
        Over/Under lets you predict if the last digit of the <Glossary>exit spot</Glossary> at contract <Glossary>expiry</Glossary> will be over or under your chosen number.
      </>
    ),
    sections: [
      {
        title: "Over",
        description: <>Earn a <Glossary>payout</Glossary> if the last digit of the <Glossary>exit spot</Glossary> is greater than your chosen number.</>,
        exit: "1900.00",
      },
      {
        title: "Under",
        description: <>Earn a <Glossary>payout</Glossary> if the last digit of the <Glossary>exit spot</Glossary> is less than your chosen number.</>,
        exit: "1900.00",
      },
    ],
  },
  "Multipliers": {
    intro: (
      <>
        Multipliers let you amplify your potential profit or loss by applying a multiplier to the asset price movement.
      </>
    ),
    sections: [
      {
        title: "Up",
        description: <>Earn a profit if the asset price rises above the <Glossary>entry price</Glossary> at the time you close the trade.</>,
        exit: "1900.00",
        darkAnim: "/trade-types/multiplers/multipliers_up_dark.lottie",
        lightAnim: "/trade-types/multiplers/multipliers_up_light.lottie",
      },
      {
        title: "Down",
        description: <>Earn a profit if the asset price falls below the <Glossary>entry price</Glossary> at the time you close the trade.</>,
        exit: "1900.00",
        darkAnim: "/trade-types/multiplers/multipliers_down_dark.lottie",
        lightAnim: "/trade-types/multiplers/multipliers_down_light.lottie",
      },
    ],
  },
  "Touch/No Touch": {
    intro: (
      <>
        Touch/No Touch lets you predict if the market price will reach a set <Glossary>barrier</Glossary> at any time during the contract period.
      </>
    ),
    sections: [
      {
        title: "Touch",
        description: <>Earn a <Glossary>payout</Glossary> if the market touches the <Glossary>barrier</Glossary> at any time before <Glossary>expiry</Glossary>.</>,
        exit: "1900.00",
        darkAnim: "/trade-types/touch-no touch/touch_dark.lottie",
        lightAnim: "/trade-types/touch-no touch/touch_light.lottie",
      },
      {
        title: "No Touch",
        description: <>Earn a <Glossary>payout</Glossary> if the market never touches the <Glossary>barrier</Glossary> before <Glossary>expiry</Glossary>.</>,
        exit: "1900.00",
        darkAnim: "/trade-types/touch-no touch/no_touch_dark.lottie",
        lightAnim: "/trade-types/touch-no touch/no_touch_light.lottie",
      },
    ],
  },
  "Higher/Lower": {
    intro: (
      <>
        Higher/Lower lets you predict if the market price will end higher or lower than a set <Glossary>barrier</Glossary> at contract <Glossary>expiry</Glossary> (<Glossary>exit spot</Glossary>).
      </>
    ),
    sections: [
      {
        title: "Higher",
        description: <>Earn a <Glossary>payout</Glossary> if the <Glossary>exit spot</Glossary> is strictly higher than the <Glossary>barrier</Glossary>.</>,
        exit: "1900.00",
        darkAnim: "/trade-types/higher-lower/higher_dark.lottie",
        lightAnim: "/trade-types/higher-lower/higher_light.lottie",
      },
      {
        title: "Lower",
        description: <>Earn a <Glossary>payout</Glossary> if the <Glossary>exit spot</Glossary> is strictly lower than the <Glossary>barrier</Glossary>.</>,
        exit: "1900.00",
        darkAnim: "/trade-types/higher-lower/lower_dark.lottie",
        lightAnim: "/trade-types/higher-lower/lower_light.lottie",
      },
    ],
  },
  "Turbos": {
    intro: (
      <>
        Turbos allow you to predict the direction of the underlying asset&apos;s movements.
      </>
    ),
    sections: [
      {
        title: "Up",
        description: <>Earn a <Glossary>payout</Glossary> if the spot price never falls below the <Glossary>barrier</Glossary> during the contract period.</>,
        exit: "1900.00",
        darkAnim: "/trade-types/turbos/turbos_up_dark.lottie",
        lightAnim: "/trade-types/turbos/turbos_up_light.lottie",
      },
      {
        title: "Down",
        description: <>Earn a <Glossary>payout</Glossary> if the spot price never rises above the <Glossary>barrier</Glossary> during the contract period.</>,
        exit: "1900.00",
        darkAnim: "/trade-types/turbos/turbos_down_dark.lottie",
        lightAnim: "/trade-types/turbos/turbos_down_light.lottie",
      },
    ],
  },
  "Vanillas": {
    intro: (
      <>
        Vanillas allow you to predict if the underlying asset&apos;s price will be above or below the strike price at contract <Glossary>expiry</Glossary> (<Glossary>exit spot</Glossary>).
      </>
    ),
    sections: [
      {
        title: "Call",
        description: <>Earn a <Glossary>payout</Glossary> if the <Glossary>exit spot</Glossary> is above the strike price at <Glossary>expiry</Glossary>.</>,
        exit: "1900.00",
        darkAnim: "/trade-types/vanillas/vanillas_call_dark.lottie",
        lightAnim: "/trade-types/vanillas/vanillas_call_light.lottie",
      },
      {
        title: "Put",
        description: <>Earn a <Glossary>payout</Glossary> if the <Glossary>exit spot</Glossary> is below the strike price at <Glossary>expiry</Glossary>.</>,
        exit: "1900.00",
        darkAnim: "/trade-types/vanillas/vanillas_put_dark.lottie",
        lightAnim: "/trade-types/vanillas/vanillas_put_light.lottie",
      },
    ],
  },
};

interface HowToTradeModalProps {
  contractLabel: string;
  onClose: () => void;
}

/**
 * "How to trade [X]?" help modal (Deriv §7.1). Fixed header (title + close),
 * scrollable body (intro + per-direction sections with animated-diagram
 * placeholders + an embedded video placeholder), fixed "Got it" footer.
 */
export function HowToTradeModal({
  contractLabel,
  onClose,
}: HowToTradeModalProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const content = CONTENT[contractLabel] ?? genericContent(contractLabel);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[80px]"
      role="dialog"
      aria-modal="true"
      aria-label={`How to trade ${contractLabel}`}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-[min(460px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-opt-line bg-opt-bg-elev shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
        {/* Fixed header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-opt-line px-5 py-4">
          <h2 className="text-[17px] font-bold text-opt-ink">{contractLabel}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-opt-ink-3 transition-colors hover:bg-opt-bg-sunk hover:text-opt-ink"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-4 [scrollbar-width:thin]">
          <p className="text-[13.5px] leading-relaxed text-opt-ink-2">
            {content.intro}
          </p>

          {content.sections.map((s) => (
            <section key={s.title} className="flex flex-col gap-2">
              <h3 className="text-[14px] font-bold text-opt-ink">{s.title}</h3>
              <p className="text-[13px] leading-relaxed text-opt-ink-2">
                {s.description}
              </p>
              {(s.darkAnim || s.lightAnim) ? (
                <div className="relative flex-shrink-0 overflow-hidden rounded-xl border border-opt-line bg-opt-bg-sunk">
                  <DotLottiePlayer
                    src={(isDark ? s.darkAnim : s.lightAnim) as string}
                    autoplay
                    loop
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                <DiagramPlaceholder label={s.title} exit={s.exit} />
              )}
            </section>
          ))}
        </div>

        {/* Fixed footer */}
        <div className="flex-shrink-0 border-t border-opt-line p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-opt-ink py-3 text-[14px] font-semibold text-opt-bg transition-[filter] hover:brightness-110"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function Glossary({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: TEAL }} className="cursor-help font-medium underline decoration-dotted underline-offset-2">
      {children}
    </span>
  );
}

/** Animated-diagram stand-in: Start → Expiry chart with the exit-price pill. */
function DiagramPlaceholder({ label, exit }: { label: string; exit: string }) {
  const lastDigit = exit.slice(-1);
  return (
    <div className="relative flex-shrink-0 h-[120px] overflow-hidden rounded-xl border border-opt-line bg-opt-bg-sunk">
      <span className="absolute left-3 top-2 text-[11px] font-semibold text-opt-ink-3">
        {label}
      </span>
      {/* dashed "start time" / solid "expiry time" verticals */}
      <span className="absolute bottom-5 left-8 top-6 w-px border-l border-dashed border-opt-ink-4" />
      <span className="absolute bottom-5 right-16 top-6 w-px" style={{ borderLeft: `2px solid ${TEAL}` }} />
      {/* price line stand-in */}
      <svg viewBox="0 0 200 80" className="absolute inset-x-0 bottom-4 h-16 w-full" preserveAspectRatio="none">
        <path d="M10 50 L60 40 L110 55 L150 30" fill="none" stroke="var(--opt-ink)" strokeWidth="1.5" />
        <circle cx="150" cy="30" r="4" fill={TEAL} />
      </svg>
      {/* exit price pill */}
      <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-[#FF4444] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white">
        {exit.slice(0, -1)}
        <span className="underline">{lastDigit}</span>
      </span>
    </div>
  );
}

function genericContent(label: string) {
  return {
    intro: (
      <>Learn how the {label} contract works and when it pays out.</>
    ),
    sections: [
      { title: label, description: <>Placeholder explainer for {label}.</>, exit: "1900.00" },
    ],
  };
}
