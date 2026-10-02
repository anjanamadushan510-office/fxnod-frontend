import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} scroll-smooth scroll-pt-24`} suppressHydrationWarning>
      <body className="bg-bg text-ink font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
