import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostGrid } from "@/components/post-card";
import { categories, isCategory } from "@/lib/categories";
import { getPublishedPosts } from "@/lib/posts";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps<"/category/[category]">): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};
  return { title: categories[category].name, description: categories[category].description };
}

export default async function CategoryPage({ params }: PageProps<"/category/[category]">) {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  const posts = await getPublishedPosts({ category });
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <h1 className="font-serif text-4xl text-ink">{categories[category].name}</h1>
      <p className="mt-2 text-lg text-muted">{categories[category].description}</p>
      <div className="mt-8">
        {posts.length ? <PostGrid posts={posts} /> : <p className="text-muted">No articles here yet.</p>}
      </div>
    </div>
  );
}
