import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/posts";
import { categories, isCategory } from "@/lib/categories";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/${post.slug}`} className="relative block aspect-[16/9] bg-brand-50">
        {post.coverImage && (
          <Image src={post.coverImage} alt="" fill sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {isCategory(post.category) && (
          <Link href={`/category/${post.category}`} className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            {categories[post.category].name}
          </Link>
        )}
        <h3 className="mt-2 font-serif text-lg leading-snug text-ink">
          <Link href={`/${post.slug}`} className="group-hover:text-brand-600">{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{post.excerpt}</p>
      </div>
    </article>
  );
}

export function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </div>
  );
}
