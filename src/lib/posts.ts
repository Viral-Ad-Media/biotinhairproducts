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

/**
 * Runs a database read for the public site. If the database can't be read (tables not created yet,
 * database unreachable during a build), logs it and serves the Markdown files instead, so a database
 * problem never takes the public site or the build down.
 */
async function withFileFallback<T>(what: string, query: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (err) {
    const cause = (err as { cause?: { message?: string } })?.cause?.message ?? (err as Error)?.message;
    console.warn(`[posts] ${what}: database read failed (${cause}); serving content/posts instead.`);
    return fallback();
  }
}

async function filePosts(opts: { category?: string; limit?: number }) {
  const all = (await readPostFiles()).filter((p) => !opts.category || p.category === opts.category);
  return opts.limit ? all.slice(0, opts.limit) : all;
}

export async function getPublishedPosts(opts: { category?: string; limit?: number } = {}): Promise<Post[]> {
  if (!db) return filePosts(opts);
  const where = opts.category
    ? and(eq(schema.post.status, "published"), eq(schema.post.category, opts.category))
    : eq(schema.post.status, "published");
  const q = db.select().from(schema.post).where(where).orderBy(desc(schema.post.publishedAt));
  return withFileFallback("getPublishedPosts", async () => (opts.limit ? q.limit(opts.limit) : q), () => filePosts(opts));
}

export async function getPost(slug: string, { includeDrafts = false } = {}): Promise<Post | null> {
  const fromFiles = async () => (await readPostFiles()).find((p) => p.slug === slug) ?? null;
  if (!db) return fromFiles();
  const database = db;
  return withFileFallback(
    "getPost",
    async () => {
      const [row] = await database.select().from(schema.post).where(eq(schema.post.slug, slug)).limit(1);
      if (!row || (!includeDrafts && row.status !== "published")) return null;
      return row;
    },
    fromFiles,
  );
}

export async function getAllPostsForAdmin(): Promise<Post[]> {
  if (!db) return [];
  return db.select().from(schema.post).orderBy(desc(schema.post.publishedAt));
}

export function readingMinutes(markdown: string) {
  return Math.max(1, Math.round(markdown.split(/\s+/).length / 220));
}
