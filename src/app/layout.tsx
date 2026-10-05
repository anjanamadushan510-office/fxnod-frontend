import type { Metadata, Viewport } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FXNOD — Dashboard",
  description: "FXNod trading platform",
  icons: { icon: "/assets/fxnod-favicon.png" },
};

// `viewportFit: "cover"` is what makes env(safe-area-inset-*) non-zero on
// notched phones — without it every safe-area rule in the app resolves to 0.
// Zoom is deliberately left enabled: disabling it is an accessibility failure,
// and the focus-zoom it is usually disabled to stop is handled in globals.css.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // The app defaults to its dark theme whatever the OS prefers.
  themeColor: "#080C16",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The per-request CSP nonce from middleware.ts. Reading it here is also what
  // makes every route render per request, which Next needs in order to stamp
  // the nonce on its own scripts — do not remove it to "restore" static
  // rendering without replacing the CSP.
  const nonce = headers().get("x-nonce") ?? undefined;

  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} scroll-smooth scroll-pt-24`} suppressHydrationWarning>
      <body className="bg-bg text-ink font-sans antialiased">
        <Providers nonce={nonce}>{children}</Providers>
      </body>
    </html>
  );
}
