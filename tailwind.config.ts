import type { Config } from "tailwindcss";

/**
 * Tailwind is configured to read the design tokens from CSS variables
 * (defined in `src/app/globals.css`). This keeps the FXNod theme — navy,
 * gold, light/dark — switchable from a single place.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      // color-mix preserves local token overrides and lets Tailwind emit /opacity utilities.
      colors: {
        bg: "color-mix(in srgb, var(--bg) calc(<alpha-value> * 100%), transparent)",
        surface: "color-mix(in srgb, var(--surface) calc(<alpha-value> * 100%), transparent)",
        panel: "color-mix(in srgb, var(--surface) calc(<alpha-value> * 100%), transparent)",
        "surface-2": "color-mix(in srgb, var(--surface-2) calc(<alpha-value> * 100%), transparent)",
        ink: "color-mix(in srgb, var(--ink) calc(<alpha-value> * 100%), transparent)",
        "ink-2": "color-mix(in srgb, var(--ink-2) calc(<alpha-value> * 100%), transparent)",
        "ink-3": "color-mix(in srgb, var(--ink-3) calc(<alpha-value> * 100%), transparent)",
        line: "color-mix(in srgb, var(--line) calc(<alpha-value> * 100%), transparent)",
        "line-2": "color-mix(in srgb, var(--line-2) calc(<alpha-value> * 100%), transparent)",
        navy: "color-mix(in srgb, var(--navy) calc(<alpha-value> * 100%), transparent)",
        "navy-2": "color-mix(in srgb, var(--navy-2) calc(<alpha-value> * 100%), transparent)",
        "navy-3": "color-mix(in srgb, var(--navy-3) calc(<alpha-value> * 100%), transparent)",
        gold: "color-mix(in srgb, var(--gold) calc(<alpha-value> * 100%), transparent)",
        "gold-2": "color-mix(in srgb, var(--gold-2) calc(<alpha-value> * 100%), transparent)",
        "gold-3": "color-mix(in srgb, var(--gold-3) calc(<alpha-value> * 100%), transparent)",
        "gold-soft": "color-mix(in srgb, var(--gold-soft) calc(<alpha-value> * 100%), transparent)",
        accent: "#6EE7D8",
        positive: "rgb(var(--positive) / <alpha-value>)",
        negative: "rgb(var(--negative) / <alpha-value>)",
        "negative-soft": "rgb(var(--negative-soft) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",

        // /options scope — only meaningful inside [data-app="options"].
        "opt-bg": "color-mix(in srgb, var(--opt-bg) calc(<alpha-value> * 100%), transparent)",
        "opt-bg-elev": "color-mix(in srgb, var(--opt-bg-elev) calc(<alpha-value> * 100%), transparent)",
        "opt-bg-sunk": "color-mix(in srgb, var(--opt-bg-sunk) calc(<alpha-value> * 100%), transparent)",
        "opt-line": "color-mix(in srgb, var(--opt-line) calc(<alpha-value> * 100%), transparent)",
        "opt-line-strong": "color-mix(in srgb, var(--opt-line-strong) calc(<alpha-value> * 100%), transparent)",
        "opt-ink": "color-mix(in srgb, var(--opt-ink) calc(<alpha-value> * 100%), transparent)",
        "opt-ink-2": "color-mix(in srgb, var(--opt-ink-2) calc(<alpha-value> * 100%), transparent)",
        "opt-ink-3": "color-mix(in srgb, var(--opt-ink-3) calc(<alpha-value> * 100%), transparent)",
        "opt-ink-4": "color-mix(in srgb, var(--opt-ink-4) calc(<alpha-value> * 100%), transparent)",
        "opt-rise": "color-mix(in srgb, var(--opt-rise) calc(<alpha-value> * 100%), transparent)",
        "opt-rise-soft": "color-mix(in srgb, var(--opt-rise-soft) calc(<alpha-value> * 100%), transparent)",
        "opt-fall": "color-mix(in srgb, var(--opt-fall) calc(<alpha-value> * 100%), transparent)",
        "opt-fall-soft": "color-mix(in srgb, var(--opt-fall-soft) calc(<alpha-value> * 100%), transparent)",
      },
      fontFamily: {
        sans: ["color-mix(in srgb, var(--font-inter) calc(<alpha-value> * 100%), transparent)", "sans-serif"],
        display: ["color-mix(in srgb, var(--font-outfit) calc(<alpha-value> * 100%), transparent)", "sans-serif"],
        mono: ["color-mix(in srgb, var(--font-mono) calc(<alpha-value> * 100%), transparent)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "color-mix(in srgb, var(--shadow-card) calc(<alpha-value> * 100%), transparent)",
        nav: "color-mix(in srgb, var(--shadow-nav) calc(<alpha-value> * 100%), transparent)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // `land:` — a phone held sideways: wide enough to look like a tablet, far
    // too short to stack a chart above an order ticket. It is a variant, not
    // an entry in `screens`: a raw media query there switches off every
    // `max-*` variant in the project.
    ({ addVariant }: { addVariant: (name: string, definition: string) => void }) =>
      addVariant(
        "land",
        "@media (max-width: 1023.98px) and (orientation: landscape) and (max-height: 520px)",
      ),
    // `coarse:` — a finger, not a mouse. Touch targets grow under it without
    // loosening the denser desktop controls, whatever the screen width: a
    // touch laptop gets them, a narrow desktop window does not.
    ({ addVariant }: { addVariant: (name: string, definition: string) => void }) =>
      addVariant("coarse", "@media (pointer: coarse)"),
  ],
};

export default config;
