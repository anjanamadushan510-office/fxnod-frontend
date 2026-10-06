/**
 * Read access to the published blog, for server components.
 *
 * Posts are written in the admin console and served by the public
 * `/api/v1/blogs` routes. They are fetched on the server so that the list and
 * each post arrive as HTML: a crawler that does not run JavaScript sees
 * nothing of a list that is fetched in the browser.
 */

import { env } from "@/lib/env";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** HTML, sanitised by the API on write and again on read. */
  content: string;
  cover_image: string | null;
  status: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

const API_URL = env.apiUrl;
const REVALIDATE_SECONDS = 60;

/** Every published post, newest first, or `null` when the API could not be read. */
export async function getPublishedPosts(): Promise<BlogPost[] | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/blogs`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as BlogPost[]) : null;
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return null;
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/blogs/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as BlogPost;
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return null;
  }
}

/** A cover is stored either as a full URL or as a path on the API host. */
export function coverUrl(post: BlogPost): string | null {
  const cover = post.cover_image;
  if (!cover) return null;
  if (cover.startsWith("http")) return cover;
  return `${API_URL}${cover.startsWith("/") ? "" : "/"}${cover}`;
}

/** "22 Sep 2026", in UTC so the server and every reader agree on the day. */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
