"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  status: string;
  tags: string[];
  created_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    fetch(`${apiUrl}/api/v1/blogs`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return res.json();
      })
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching blogs:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-theme="dark" className="bg-bg text-ink font-sans antialiased min-h-screen flex flex-col">
      <PublicHeader />

      <main className="px-5 sm:px-8 lg:px-12 py-10 sm:py-20 flex-1">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold mb-3">Blog</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold mb-4">Latest updates from FXNOD.</h1>
          <p className="text-zinc-400 max-w-xl mb-12 leading-relaxed">Company news, feature releases, and engineering updates. Read about what we're building and how we're improving the platform.</p>
          <p className="text-sm text-zinc-500 mb-8">Latest posts</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-20 text-center text-zinc-500">Loading guides...</div>
            ) : posts.length === 0 ? (
              <div className="col-span-full py-20 text-center text-zinc-500">No guides found. Check back later!</div>
            ) : (
              posts.map((post) => (
                <Link href={`/blog/${post.slug}` as Route} key={post.id} className="group flex flex-col bg-panel border border-line rounded-2xl overflow-hidden hover:border-zinc-700 transition duration-300">
                  <div className="h-48 bg-line overflow-hidden relative">
                    {post.cover_image && (
                      <img 
                        src={post.cover_image.startsWith('http') ? post.cover_image : `${(process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '')}${post.cover_image.startsWith('/') ? '' : '/'}${post.cover_image}`} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <p className="text-[10px] uppercase tracking-wider text-gold mb-3 font-semibold">
                      {(post.tags && post.tags.length > 0) ? post.tags[0] : "POST"} &middot; {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <h2 className="text-xl font-display font-semibold text-white leading-snug mb-3 group-hover:text-accent transition">
                      {post.title}
                    </h2>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto text-sm font-semibold text-white group-hover:text-accent transition flex items-center gap-2">
                      Read post <span className="text-lg leading-none">→</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
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
