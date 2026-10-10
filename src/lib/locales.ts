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
 *
 * Adding a language: a content file, an entry in `GUIDE_LABELS` and
 * `PREFIXES` here, an entry in content/localGuides.ts, two thin pages under
 * its prefix, and its paths in `isIndexablePath` (lib/site.ts).
 */
export type Locale = "en" | "es" | "fr" | "si";
export type LocalLocale = Exclude<Locale, "en">;

export const LOCAL_LOCALES: LocalLocale[] = ["es", "fr", "si"];

/** Set on the request by middleware.ts, read by the root layout for <html lang>. */
export const LOCALE_HEADER = "x-locale";

const PREFIXES: { prefix: string; locale: Locale }[] = [
  { prefix: "/es", locale: "es" },
  { prefix: "/fr", locale: "fr" },
  { prefix: "/si", locale: "si" },
];

export function localeOfPath(pathname: string): Locale {
  const match = PREFIXES.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return match ? match.locale : "en";
}

/** What the guide pages need to say in each language, and where they live. */
export interface GuideLabels {
  locale: Locale;
  /** The language's own name, for the link that leads to it. */
  name: string;
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
  /** The index page of this language's guides. */
  index: { title: string; description: string; heading: string; intro: string; collectionName: string; llmsHeading: string };
}

export const GUIDE_LABELS: Record<Locale, GuideLabels> = {
  en: {
    locale: "en",
    name: "English",
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
    index: {
      title: "Guides: trading bots, risk and the Deriv tools",
      description:
        "Guides to trading and trading bots: how FXNOD's Deriv tools work, how to choose, test and limit a bot, and the basics of charts, risk and discipline.",
      heading: "Trading, bots and the tools.",
      intro: "",
      collectionName: "FXNOD guides",
      llmsHeading: "Guides",
    },
  },
  es: {
    locale: "es",
    name: "Español",
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
    index: {
      title: "Guías en español: Deriv, índices sintéticos y bots de trading",
      description:
        "Guías en español sobre Deriv y los bots de trading: qué es Deriv, cómo operar, depositar y retirar, índices sintéticos, y cómo elegir y probar un bot.",
      heading: "Deriv y bots de trading, en claro.",
      intro:
        "Respuestas directas a lo que se pregunta en español: qué es Deriv, cómo operar, depositar y retirar, qué son los índices sintéticos y cómo elegir y probar un bot de trading.",
      collectionName: "Guías de FXNOD en español",
      llmsHeading: "Guías en español",
    },
  },
  fr: {
    locale: "fr",
    name: "Français",
    ogLocale: "fr_FR",
    homePath: "/",
    guidesPath: "/fr/guides",
    home: "Accueil",
    guides: "Guides",
    updated: "Mis à jour le",
    minRead: "min de lecture",
    byTeam: "Par l'équipe FXNOD",
    questions: "Questions fréquentes",
    readNext: "À lire ensuite",
    allGuides: "Tous les guides",
    getStarted: "Commencer",
    months: ["JANV.", "FÉVR.", "MARS", "AVR.", "MAI", "JUIN", "JUIL.", "AOÛT", "SEPT.", "OCT.", "NOV.", "DÉC."],
    index: {
      title: "Guides en français : Deriv, indices synthétiques et robots de trading",
      description:
        "Guides en français sur Deriv et les robots de trading : ce qu'est Deriv, comment trader, déposer et retirer, les indices synthétiques, choisir et tester un robot.",
      heading: "Deriv et les robots de trading, clairement.",
      intro:
        "Des réponses directes aux questions posées en français : ce qu'est Deriv, comment trader, déposer et retirer, ce que sont les indices synthétiques, et comment choisir et tester un robot de trading.",
      collectionName: "Guides FXNOD en français",
      llmsHeading: "Guides en français",
    },
  },
  si: {
    locale: "si",
    name: "සිංහල",
    ogLocale: "si_LK",
    homePath: "/",
    guidesPath: "/si/guides",
    home: "මුල් පිටුව",
    guides: "Guides",
    updated: "යාවත්කාලීන කළේ",
    minRead: "විනාඩි කියවීමක්",
    byTeam: "FXNOD කණ්ඩායම",
    questions: "නිතර අහන ප්‍රශ්න",
    readNext: "ඊළඟට කියවන්න",
    allGuides: "සියලු guides",
    getStarted: "පටන් ගන්න",
    months: ["ජන", "පෙබ", "මාර්", "අප්‍රේ", "මැයි", "ජූනි", "ජූලි", "අගෝ", "සැප්", "ඔක්", "නොවැ", "දෙසැ"],
    index: {
      title: "Trading Sinhala guides: Deriv, forex සහ trading bots සිංහලෙන්",
      description:
        "Deriv trading, forex trading, binary trading සහ trading bots ගැන සිංහල guides: account එකක් හදන හැටි, deposit සහ withdraw, risk, සහ bot එකක් තෝරන හැටි.",
      heading: "Deriv සහ trading bots, සිංහලෙන් පැහැදිලිව.",
      intro:
        "ලංකාවේ traders ලා අහන ප්‍රශ්න වලට කෙලින් උත්තර: Deriv වල trade කරන හැටි, account එකක් හදන හැටි, deposit සහ withdraw, forex සහ binary trading කියන්නේ මොකක්ද, සහ trading bot එකක් තෝරලා test කරන හැටි.",
      collectionName: "FXNOD සිංහල guides",
      llmsHeading: "සිංහල guides (Sinhala)",
    },
  },
};

/** "2026-10-06" -> "6 OCT 2026" in the page's language. No time zone is involved. */
export function formatGuideDateIn(iso: string, labels: GuideLabels): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${labels.months[month - 1]} ${year}`;
}
