import type { Metadata } from "next";
import { PostGrid } from "@/components/post-card";
import { getPublishedPosts } from "@/lib/posts";

export const revalidate = 3600;
export const metadata: Metadata = { title: "All articles", description: "Every biotin review and hair care guide on the site." };

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <h1 className="font-serif text-4xl text-ink">All articles</h1>
      <p className="mt-2 text-lg text-muted">Reviews, guides and tips on biotin and hair care.</p>
      <div className="mt-8">
        <PostGrid posts={posts} />
      </div>
    </div>
  );
}
