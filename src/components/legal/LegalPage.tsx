import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { LEGAL_UPDATED, type LegalBlock, type LegalDoc } from "@/content/legal";
import { SITE_URL, absoluteUrl } from "@/lib/site";

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p>{block}</p>;
  return (
    <ul className="list-disc pl-6 space-y-2 marker:text-zinc-500">
      {block.list.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * One legal document (Terms of Use, Privacy Policy): a dated title, the
 * introduction, a contents list with anchors, and the numbered sections.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div data-theme="dark" className="bg-bg text-ink font-sans antialiased min-h-screen flex flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: doc.title,
          url: absoluteUrl(doc.path),
          description: doc.description,
          publisher: { "@id": `${SITE_URL}/#organization` },
        }}
      />
      <PublicHeader />

      <main className="flex-1 py-12 sm:py-20 px-5 sm:px-8 lg:px-12">
        <article className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold mb-3">Legal</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold mb-3">{doc.title}</h1>
          <p className="text-sm text-zinc-400 mb-8">Last updated {LEGAL_UPDATED}</p>

          <p className="text-lg leading-relaxed text-zinc-100 border-l-2 border-gold pl-5 mb-10">{doc.intro}</p>

          <nav aria-label="Contents" className="mb-12 rounded-xl border border-line p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-400 mb-3">Contents</p>
            <ol className="space-y-1.5 text-sm">
              {doc.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-accent hover:underline">
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-10 text-zinc-300 leading-relaxed text-[16px]">
            {doc.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 space-y-3">
                <h2 className="font-display text-xl font-semibold text-white">{section.title}</h2>
                {section.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </section>
            ))}
          </div>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}
