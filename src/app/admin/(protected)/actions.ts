"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { isCategory } from "@/lib/categories";

export type FormState = { error?: string; saved?: boolean };

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

const RESERVED = new Set(["admin", "api", "blog", "category", "uploads", "sitemap.xml", "robots.txt"]);

export async function savePost(originalSlug: string | null, _prev: FormState, form: FormData): Promise<FormState> {
  if (!(await getAdminSession()) || !db) return { error: "Not signed in." };

  const title = String(form.get("title") ?? "").trim();
  const slug = slugify(String(form.get("slug") || title));
  const excerpt = String(form.get("excerpt") ?? "").trim();
  const content = String(form.get("content") ?? "").trim();
  const category = String(form.get("category") ?? "");
  const coverImage = String(form.get("coverImage") ?? "").trim() || null;
  const status = form.get("status") === "draft" ? "draft" : "published";
  const publishedAt = new Date(String(form.get("publishedAt") || Date.now()));

  if (!title || !slug || !excerpt || !content) return { error: "Title, excerpt and content are required." };
  if (RESERVED.has(slug)) return { error: `"${slug}" is reserved. Pick another slug.` };
  if (!isCategory(category)) return { error: "Pick a category." };
  if (coverImage && !/^(\/|https:\/\/)/.test(coverImage)) return { error: "Cover image must be a /uploads/... path or https URL." };
  if (Number.isNaN(publishedAt.getTime())) return { error: "Invalid publish date." };

  const values = { slug, title, excerpt, content, category, coverImage, status, publishedAt, updatedAt: new Date() } as const;
  try {
    if (originalSlug) {
      await db.update(schema.post).set(values).where(eq(schema.post.slug, originalSlug));
    } else {
      await db.insert(schema.post).values(values);
    }
  } catch {
    return { error: "Couldn't save. Is that slug already used by another post?" };
  }

  revalidatePath("/", "layout");
  if (originalSlug !== slug) redirect(`/admin/posts/${slug}`);
  return { saved: true };
}

export async function deletePost(slug: string) {
  if (!(await getAdminSession()) || !db) return;
  await db.delete(schema.post).where(eq(schema.post.slug, slug));
  revalidatePath("/", "layout");
  redirect("/admin");
}
