import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Route } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { GUIDES, formatGuideDate, guideBySlug, readMinutes, type Guide, type GuideBlock } from "@/content/guides";
import { SITE_NAME, SITE_URL, absoluteUrl, pageMetadata } from "@/lib/site";

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const guide = guideBySlug(params.slug);
  if (!guide) return {};
  return {
    ...pageMetadata({
      title: guide.title,
      description: guide.description,
      path: `/guides/${guide.slug}`,
      article: { publishedTime: guide.published, modifiedTime: guide.updated },
    }),
    // Every guide title names FXNOD already; the template would repeat it.
    title: { absolute: guide.title },
  };
}

/** Article, breadcrumb and FAQ markup, each built from what the page shows. */
function structuredData(guide: Guide): Record<string, unknown>[] {
  const url = absoluteUrl(`/guides/${guide.slug}`);
  const organization = { "@type": "Organization", name: SITE_NAME, url: SITE_URL };
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      image: absoluteUrl(guide.image),
      datePublished: guide.published,
      dateModified: guide.updated,
      author: organization,
      publisher: { ...organization, logo: { "@type": "ImageObject", url: absoluteUrl("/assets/fxnod-logo.png") } },
      mainEntityOfPage: url,
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/guides") },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];
}

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="font-display text-2xl font-semibold text-white pt-6">{block.text}</h2>;
    case "p":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul className="list-disc pl-5 space-y-2 marker:text-zinc-600">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="space-y-4">
          {block.items.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="shrink-0 h-7 w-7 rounded-full border border-line text-xs font-mono text-gold flex items-center justify-center mt-0.5"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-1">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-[15px]">
            <thead className="bg-panel text-xs uppercase tracking-wider text-zinc-400">
              <tr>
                {block.head.map((cell, i) => (
                  <th key={i} scope="col" className="px-4 py-3 font-medium">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]} className="border-t border-line align-top">
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="px-4 py-3 font-medium text-white sm:whitespace-nowrap">
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className="px-4 py-3">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "note":
      return (
        <aside className="rounded-xl border border-gold/25 bg-panel px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-gold mb-1.5">{block.title}</p>
          <p className="text-[15px]">{block.text}</p>
        </aside>
      );
  }
}

export default function GuideDetailPage({ params }: Props) {
  const guide = guideBySlug(params.slug);
  if (!guide) notFound();

  const related = guide.related
    .map((slug) => GUIDES.find((g) => g.slug === slug))
    .filter((g): g is Guide => g !== undefined);

  return (
    <div data-theme="dark" className="min-h-screen bg-bg text-ink font-sans antialiased flex flex-col">
      {structuredData(guide).map((data) => (
        <JsonLd key={String(data["@type"])} data={data} />
      ))}
      <PublicHeader />

      <main className="flex-1 py-12 px-5 sm:px-8 lg:px-12">
        <article className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-zinc-500 mb-6">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href={"/guides" as Route} className="hover:text-white transition">
              Guides
            </Link>
          </nav>

          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-wider text-zinc-400 mb-5 font-mono uppercase">
            <span className="text-gold font-semibold">{guide.tag}</span>
            <span aria-hidden="true">·</span>
            <span>
              Updated <time dateTime={guide.updated}>{formatGuideDate(guide.updated)}</time>
            </span>
            <span aria-hidden="true">·</span>
            <span>{readMinutes(guide)} min read</span>
            <span aria-hidden="true">·</span>
            <span>By the FXNOD team</span>
          </p>

          <h1 className="font-display text-3xl sm:text-[40px] leading-tight font-bold tracking-tight mb-8">
            {guide.title}
          </h1>

          {/* The direct answer comes before anything else, including the image:
              it is the passage a search snippet or an assistant quotes. */}
          <p className="text-lg sm:text-xl leading-relaxed text-zinc-100 border-l-2 border-gold pl-5 mb-10">
            {guide.answer}
          </p>

          <div className="rounded-2xl overflow-hidden border border-line bg-panel mb-10">
            <img src={guide.image} alt="" className="w-full h-48 sm:h-64 object-cover object-center" />
          </div>

          <div className="space-y-5 text-zinc-300 leading-relaxed text-[17px]">
            {guide.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          <section aria-labelledby="faq-heading" className="mt-14">
            <h2 id="faq-heading" className="font-display text-2xl font-semibold text-white mb-6">
              Questions people ask
            </h2>
            <dl className="divide-y divide-line border-y border-line">
              {guide.faq.map((item) => (
                <div key={item.q} className="py-5">
                  <dt className="font-semibold text-white">{item.q}</dt>
                  <dd className="mt-2 text-zinc-300 leading-relaxed">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-14 rounded-2xl border border-line bg-panel p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-white mb-2">Try it on a demo account</h2>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Create an FXNOD account, connect your Deriv demo account, and use every tool with virtual funds.
            </p>
            <Link
              href={"/auth/register" as Route}
              className="bg-accent text-[#080C16] hover:opacity-90 transition inline-flex items-center justify-center h-11 px-6 rounded-full text-sm font-semibold"
            >
              Get started
            </Link>
          </section>

          {related.length > 0 && (
            <section aria-labelledby="related-heading" className="mt-14">
              <h2 id="related-heading" className="text-sm text-zinc-500 mb-4">
                Read next
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}` as Route}
                    className="bg-panel border border-line rounded-2xl p-5 hover:border-zinc-600 transition block"
                  >
                    <p className="text-[11px] uppercase tracking-wider text-gold mb-2">{g.tag}</p>
                    <p className="font-display font-semibold text-white leading-snug">{g.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-14">
            <Link href={"/guides" as Route} className="text-sm text-accent hover:text-white transition-colors">
              ← All guides
            </Link>
          </div>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}
