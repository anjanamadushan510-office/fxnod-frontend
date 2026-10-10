import type { Metadata, Viewport } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import { LOCALE_HEADER } from "@/lib/locales";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

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

// The defaults every route inherits. Public pages set their own title,
// description and canonical URL through `pageMetadata`; a page behind the
// login keeps the bare name, and is kept out of search results by the
// X-Robots-Tag header in middleware.ts.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      {
        url: "/favicon-light.ico",
        media: "(prefers-color-scheme: light)",
        type: "image/x-icon",
      },
      {
        url: "/favicon-dark.ico",
        media: "(prefers-color-scheme: dark)",
        type: "image/x-icon",
      },
    ],
  },
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
  // The guides exist in more than one language; middleware.ts says which this page is.
  const lang = headers().get(LOCALE_HEADER) ?? "en";

  return (
    <html lang={lang} className={`dark ${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} scroll-smooth scroll-pt-24`} suppressHydrationWarning>
      <body className="bg-bg text-ink font-sans antialiased">
        <Providers nonce={nonce}>{children}</Providers>
      </body>
    </html>
  );
}
