import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { getPublishedPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/blog`, changeFrequency: "weekly" },
    ...Object.keys(categories).map((c) => ({ url: `${site.url}/category/${c}` })),
    ...posts.map((p) => ({ url: `${site.url}/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
