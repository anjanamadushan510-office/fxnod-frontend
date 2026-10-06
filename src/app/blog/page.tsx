import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { coverUrl, formatPostDate, getPublishedPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Blog: product news and updates",
  description:
    "Product news, feature releases and trading explainers from the team that builds FXNOD, the trading terminal for Deriv accounts.",
  path: "/blog",
});

// A server component: the list is in the HTML a crawler receives. It used to
// be fetched in the browser, which showed every non-JavaScript reader an
// empty page that said "Loading".
export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div data-theme="dark" className="bg-bg text-ink font-sans antialiased min-h-screen flex flex-col">
      <PublicHeader />

      <main className="px-5 sm:px-8 lg:px-12 py-10 sm:py-20 flex-1">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold mb-3">Blog</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold mb-4">Latest updates from FXNOD.</h1>
          <p className="text-zinc-400 max-w-xl mb-12 leading-relaxed">
            Product news, feature releases and trading explainers. For how each tool works, read the{" "}
            <Link href={"/guides" as Route} className="text-accent hover:underline">
              guides
            </Link>
            .
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts === null ? (
              <p className="col-span-full py-20 text-center text-zinc-500">
                The posts could not be loaded. Please try again shortly.
              </p>
            ) : posts.length === 0 ? (
              <p className="col-span-full py-20 text-center text-zinc-500">No posts yet.</p>
            ) : (
              posts.map((post) => {
                const cover = coverUrl(post);
                return (
                  <Link
                    href={`/blog/${post.slug}` as Route}
                    key={post.id}
                    className="group flex flex-col bg-panel border border-line rounded-2xl overflow-hidden hover:border-zinc-700 transition duration-300"
                  >
                    <div className="h-48 bg-line overflow-hidden relative">
                      {cover && (
                        <img
                          src={cover}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-6 sm:p-8 flex-1 flex flex-col">
                      <p className="text-[10px] uppercase tracking-wider text-gold mb-3 font-semibold">
                        {post.tags && post.tags.length > 0 ? post.tags[0] : "POST"} &middot;{" "}
                        <time dateTime={post.created_at}>{formatPostDate(post.created_at)}</time>
                      </p>
                      <h2 className="text-xl font-display font-semibold text-white leading-snug mb-3 group-hover:text-accent transition">
                        {post.title}
                      </h2>
                      <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-1">{post.excerpt}</p>
                      <div className="mt-auto text-sm font-semibold text-white group-hover:text-accent transition flex items-center gap-2">
                        Read post <span className="text-lg leading-none">→</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
