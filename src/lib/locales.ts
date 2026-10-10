/**
 * The languages the public guides are written in.
 *
 * A language is a set of pages with their own addresses (/es/guias/...), not
 * a switch that rewrites a page in the browser. A crawler does not run the
 * switch, so text that only exists after it would never be indexed, and one
 * address cannot rank in two languages. Each language is therefore rendered
 * on the server at its own path, and pages that say the same thing point at
 * each other with hreflang.
 *
 * Only the guides are translated. The app behind the login is in English.
 */
export type Locale = "en" | "es";

/** Set on the request by middleware.ts, read by the root layout for <html lang>. */
export const LOCALE_HEADER = "x-locale";

const PREFIXES: { prefix: string; locale: Locale }[] = [{ prefix: "/es", locale: "es" }];

export function localeOfPath(pathname: string): Locale {
  const match = PREFIXES.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return match ? match.locale : "en";
}

/** What the guide pages need to say in each language, and where they live. */
export interface GuideLabels {
  locale: Locale;
  /** Open Graph locale, e.g. "es_419". */
  ogLocale: string;
  homePath: string;
  guidesPath: string;
  home: string;
  guides: string;
  updated: string;
  minRead: string;
  byTeam: string;
  questions: string;
  readNext: string;
  allGuides: string;
  getStarted: string;
  months: string[];
}

export const GUIDE_LABELS: Record<Locale, GuideLabels> = {
  en: {
    locale: "en",
    ogLocale: "en_US",
    homePath: "/",
    guidesPath: "/guides",
    home: "Home",
    guides: "Guides",
    updated: "Updated",
    minRead: "min read",
    byTeam: "By the FXNOD team",
    questions: "Questions people ask",
    readNext: "Read next",
    allGuides: "All guides",
    getStarted: "Get started",
    months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  },
  es: {
    locale: "es",
    ogLocale: "es_419",
    homePath: "/",
    guidesPath: "/es/guias",
    home: "Inicio",
    guides: "Guías",
    updated: "Actualizado",
    minRead: "min de lectura",
    byTeam: "Por el equipo de FXNOD",
    questions: "Preguntas frecuentes",
    readNext: "Sigue leyendo",
    allGuides: "Todas las guías",
    getStarted: "Empezar",
    months: ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"],
  },
};

/** "2026-10-06" -> "6 OCT 2026" in the page's language. No time zone is involved. */
export function formatGuideDateIn(iso: string, labels: GuideLabels): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${labels.months[month - 1]} ${year}`;
}
