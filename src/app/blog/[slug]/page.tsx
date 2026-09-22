import { notFound } from "next/navigation";
import Link from "next/link";
import { Route } from "next";
import { mockPosts } from "../page";

export default function SingleBlogPage({ params }: { params: { slug: string } }) {
  const post = mockPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div data-theme="dark" className="bg-bg text-ink font-sans antialiased min-h-screen flex flex-col">
      <div className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md">
        <header className="site-header min-h-16 border-b border-line flex items-center justify-between gap-3 py-3 sm:py-0 sm:h-16 sm:px-8 lg:px-12">
          <Link href="/" aria-label="FXNOD home" className="shrink-0">
            <img src="/assets/fxnod-logo.png" alt="FXNOD" className="h-6 sm:h-7 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <Link href={"/#product" as Route} className="hover:text-white transition">Product</Link>
            <Link href={"/blog" as Route} className="text-white">Guides</Link>
            <Link href={"/blog" as Route} className="hover:text-white transition">Blog</Link>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={"/auth/login" as Route} className="hidden md:inline-flex h-9 px-4 items-center rounded-full text-sm text-zinc-300 hover:text-white transition">Log in</Link>
            <Link href={"/auth/register" as Route} className="bg-accent text-[#080C16] hidden md:inline-flex h-9 px-4 items-center rounded-full text-sm font-semibold hover:opacity-90 transition">Get started</Link>
          </div>
        </header>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-20">
        <Link href={"/blog" as Route} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition mb-8">
          ← Back to Guides
        </Link>
        
        <article className="bg-panel border border-line rounded-3xl overflow-hidden shadow-xl">
          <div className="w-full h-64 sm:h-96 bg-line overflow-hidden relative">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full">
              <p className="text-[11px] uppercase tracking-wider text-gold mb-3">{post.tag} &middot; {post.date} &middot; {post.read}</p>
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

      <footer className="border-t border-line px-5 sm:px-8 lg:px-12 py-8 text-[11px] text-zinc-600">
        <div className="max-w-6xl mx-auto flex justify-between">
          <span>© 2026 FXNOD</span>
          <Link href="/" className="hover:text-zinc-400 transition">Home</Link>
        </div>
      </footer>
    </div>
  );
}
