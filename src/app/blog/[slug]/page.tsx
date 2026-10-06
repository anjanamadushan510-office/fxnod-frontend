import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { coverUrl, formatPostDate, getPost } from "@/lib/blog";
import { SITE_NAME, SITE_URL, absoluteUrl, pageMetadata } from "@/lib/site";

interface Props {
  params: { slug: string };
}

// The page below asks for the same post; Next serves both from one request.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    article: { publishedTime: post.created_at, modifiedTime: post.updated_at },
    image: coverUrl(post) ?? undefined,
  });
}

export default async function SingleBlogPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const cover = coverUrl(post);
  const url = absoluteUrl(`/blog/${post.slug}`);
  const organization = { "@type": "Organization", name: SITE_NAME, url: SITE_URL };

  return (
    <div data-theme="dark" className="bg-bg text-ink font-sans antialiased min-h-screen flex flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          ...(cover ? { image: cover } : {}),
          datePublished: post.created_at,
          dateModified: post.updated_at,
          author: organization,
          publisher: { ...organization, logo: { "@type": "ImageObject", url: absoluteUrl("/assets/fxnod-logo.png") } },
          mainEntityOfPage: url,
          inLanguage: "en",
        }}
      />
      <PublicHeader />

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-20">
        <Link href={"/blog" as Route} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition mb-8">
          ← Back to Blog
        </Link>

        <article className="bg-panel border border-line rounded-3xl overflow-hidden shadow-xl">
          <div className="w-full h-64 sm:h-96 bg-line overflow-hidden relative">
            {cover && <img src={cover} alt="" className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full">
              <p className="text-[11px] uppercase tracking-wider text-gold mb-3">
                {post.tags && post.tags.length > 0 ? post.tags[0] : "POST"} &middot;{" "}
                <time dateTime={post.created_at}>{formatPostDate(post.created_at)}</time>
              </p>
              <h1 className="font-display text-3xl sm:text-5xl font-semibold text-white leading-tight">{post.title}</h1>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-16">
            <div
              className="prose prose-invert lg:prose-lg max-w-none prose-a:text-accent hover:prose-a:text-accent/80 prose-headings:font-display prose-headings:font-semibold prose-img:rounded-xl prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}
