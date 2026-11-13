import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { and, desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  status: "draft" | "published";
  publishedAt: Date;
  updatedAt: Date;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

/** Reads the seed Markdown files. Used by the seed script, and by the site when no database is configured. */
export async function readPostFiles(): Promise<Post[]> {
  const files = (await fs.readdir(CONTENT_DIR)).filter((f) => f.endsWith(".md"));
  const posts = await Promise.all(
    files.map(async (file) => {
      const { data, content } = matter(await fs.readFile(path.join(CONTENT_DIR, file), "utf8"));
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title),
        excerpt: String(data.excerpt),
        content: content.trim(),
        category: String(data.category),
        coverImage: data.coverImage ? String(data.coverImage) : null,
        status: "published" as const,
        publishedAt: new Date(data.publishedAt),
        updatedAt: new Date(data.updatedAt ?? data.publishedAt),
      };
    }),
  );
  return posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function getPublishedPosts(opts: { category?: string; limit?: number } = {}): Promise<Post[]> {
  if (!db) {
    const all = (await readPostFiles()).filter((p) => !opts.category || p.category === opts.category);
    return opts.limit ? all.slice(0, opts.limit) : all;
  }
  const where = opts.category
    ? and(eq(schema.post.status, "published"), eq(schema.post.category, opts.category))
    : eq(schema.post.status, "published");
  const q = db.select().from(schema.post).where(where).orderBy(desc(schema.post.publishedAt));
  return opts.limit ? q.limit(opts.limit) : q;
}

export async function getPost(slug: string, { includeDrafts = false } = {}): Promise<Post | null> {
  if (!db) return (await readPostFiles()).find((p) => p.slug === slug) ?? null;
  const [row] = await db.select().from(schema.post).where(eq(schema.post.slug, slug)).limit(1);
  if (!row || (!includeDrafts && row.status !== "published")) return null;
  return row;
}

export async function getAllPostsForAdmin(): Promise<Post[]> {
  if (!db) return [];
  return db.select().from(schema.post).orderBy(desc(schema.post.publishedAt));
}

export function readingMinutes(markdown: string) {
  return Math.max(1, Math.round(markdown.split(/\s+/).length / 220));
}
