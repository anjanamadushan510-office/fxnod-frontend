import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { GUIDES, formatGuideDate } from "@/content/guides";
import { HOME_FAQ } from "@/content/homeFaq";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl, pageMetadata } from "@/lib/site";

const TITLE = "FXNOD — Deriv trading terminal: dTrader, dBot and Auto Hub";

export const metadata: Metadata = {
  ...pageMetadata({ title: TITLE, description: SITE_DESCRIPTION, path: "/" }),
  // The home page states the whole name itself; the "| FXNOD" template would repeat it.
  title: { absolute: TITLE },
};

/**
 * What the site tells a machine about itself. Only facts the page also shows
 * a person: no ratings, no review counts, no price other than the real one.
 */
const STRUCTURED_DATA: Record<string, unknown>[] = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/assets/fxnod-logo.png"),
    description: SITE_DESCRIPTION,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    url: SITE_URL,
    image: absoluteUrl(OG_IMAGE.url),
    description: SITE_DESCRIPTION,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "dTrader: manual trading on a Deriv account with a live chart and ten trade types",
      "dBot: a bot builder for Deriv that needs no code",
      "Auto Hub: ready-made bots for Deriv",
    ],
    publisher: { "@id": `${SITE_URL}/#organization` },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  },
];

export default function HomePage() {
  const guides = GUIDES.map((g) => ({
    slug: g.slug,
    tag: g.tag,
    date: formatGuideDate(g.updated),
    title: g.title,
    description: g.description,
  }));

  return (
    <>
      {STRUCTURED_DATA.map((data) => (
        <JsonLd key={String(data["@type"])} data={data} />
      ))}
      <LandingPage guides={guides} />
    </>
  );
}
