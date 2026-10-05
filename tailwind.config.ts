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
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        panel: "var(--surface)",
        "surface-2": "var(--surface-2)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        navy: "var(--navy)",
        "navy-2": "var(--navy-2)",
        "navy-3": "var(--navy-3)",
        gold: "var(--gold)",
        "gold-2": "var(--gold-2)",
        "gold-3": "var(--gold-3)",
        "gold-soft": "var(--gold-soft)",
        accent: "#6EE7D8",

        // /options scope — only meaningful inside [data-app="options"].
        "opt-bg": "var(--opt-bg)",
        "opt-bg-elev": "var(--opt-bg-elev)",
        "opt-bg-sunk": "var(--opt-bg-sunk)",
        "opt-line": "var(--opt-line)",
        "opt-line-strong": "var(--opt-line-strong)",
        "opt-ink": "var(--opt-ink)",
        "opt-ink-2": "var(--opt-ink-2)",
        "opt-ink-3": "var(--opt-ink-3)",
        "opt-ink-4": "var(--opt-ink-4)",
        "opt-rise": "var(--opt-rise)",
        "opt-rise-soft": "var(--opt-rise-soft)",
        "opt-fall": "var(--opt-fall)",
        "opt-fall-soft": "var(--opt-fall-soft)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        nav: "var(--shadow-nav)",
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
