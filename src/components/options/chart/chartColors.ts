/**
 * Hardcoded chart palette.
 *
 * TradingView Lightweight Charts parses colors with its own parser that does
 * NOT understand modern CSS color spaces — notably `oklch()`. Our Tailwind v4
 * `--opt-*` design tokens resolve to `oklch(...)` at runtime, so reading them
 * via getComputedStyle and handing the value to the chart crashed with:
 *
 *   Uncaught Error: Failed to parse color: oklch(0.66 0.16 152)
 *
 * These constants mirror the design tokens as plain HEX so the chart parser
 * always succeeds. Keep them in sync with the `--opt-*` tokens and with
 * OVERLAY_COLORS in stores/useTradeOverlays.ts (also literal hex for the same
 * reason). Do NOT read these from CSS variables.
 */
export const CHART_COLORS = {
  ink: "#6EE7D8", // Accent cyan — area line / primary stroke
  inkFaint: "#9CA3AF", // Light gray — axis text
  line: "#24344F", // Dark line — grid lines / scale borders
  rise: "#1eaf7b", // --opt-rise  — up / green
  fall: "#e0533d", // --opt-fall  — down / red
} as const;
