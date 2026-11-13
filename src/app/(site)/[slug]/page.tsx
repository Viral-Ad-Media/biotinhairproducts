import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { PostGrid } from "@/components/post-card";
import { categories, isCategory } from "@/lib/categories";
import { getPost, getPublishedPosts, readingMinutes } from "@/lib/posts";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getPublishedPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

const fmt = (d: Date) => d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default async function PostPage({ params }: PageProps<"/[slug]">) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const related = (await getPublishedPosts({ category: post.category, limit: 4 })).filter((p) => p.slug !== post.slug).slice(0, 3);
  const category = isCategory(post.category) ? categories[post.category] : null;

  return (
    <article>
      <header className="mx-auto max-w-3xl px-4 pt-10">
        {category && (
          <Link href={`/category/${post.category}`} className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            {category.name}
          </Link>
        )}
        <h1 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-muted">
          Updated {fmt(post.updatedAt)} · {readingMinutes(post.content)} min read
        </p>
      </header>
      {post.coverImage && (
        <div className="relative mx-auto mt-8 aspect-[16/9] max-w-4xl overflow-hidden px-4 sm:rounded-2xl">
          <Image src={post.coverImage} alt="" fill sizes="(min-width: 896px) 896px, 100vw" className="object-cover sm:rounded-2xl" priority />
        </div>
      )}
      <div className="mx-auto mt-10 max-w-3xl px-4">
        <Markdown>{post.content}</Markdown>
        <p className="mt-10 rounded-xl bg-brand-50 p-4 text-sm text-ink-soft">
          This article is for general information and isn&apos;t medical advice. For hair loss or scalp problems, talk to a
          doctor or dermatologist.
        </p>
      </div>
      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-6xl px-4">
          <h2 className="mb-6 font-serif text-2xl text-ink">Keep reading</h2>
          <PostGrid posts={related} />
        </section>
      )}
    </article>
  );
}
