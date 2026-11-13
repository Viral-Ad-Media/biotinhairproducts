import Image from "next/image";
import Link from "next/link";
import { PostGrid } from "@/components/post-card";
import { getPublishedPosts } from "@/lib/posts";

export const revalidate = 3600;

export default async function HomePage() {
  const [reviews, latest] = await Promise.all([
    getPublishedPosts({ category: "reviews", limit: 6 }),
    getPublishedPosts({ limit: 30 }),
  ]);
  const guides = latest.filter((p) => p.category !== "reviews").slice(0, 6);

  return (
    <>
      <section className="bg-gradient-to-br from-brand-50 via-white to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Biotin hair care, explained</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
              Reviews for top biotin hair products
            </h1>
            <p className="mt-4 max-w-prose text-lg text-muted">
              Plain-English reviews of popular biotin shampoos, plus evidence-based guides on what biotin can and
              can&apos;t do for your hair.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/category/reviews" className="rounded-full bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600">
                Read the reviews
              </Link>
              <Link href="/does-biotin-shampoo-work" className="rounded-full border border-ink/15 px-6 py-3 font-medium text-ink hover:border-brand-500 hover:text-brand-600">
                Does biotin shampoo work?
              </Link>
            </div>
          </div>
          <Image src="/uploads/2022/02/Hero-2.png" alt="Woman with long, healthy hair" width={829} height={648} priority className="mx-auto w-full max-w-md" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl text-ink">Our latest biotin reviews</h2>
          <Link href="/category/reviews" className="shrink-0 text-sm font-medium text-brand-600 hover:underline">See all</Link>
        </div>
        <PostGrid posts={reviews} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl text-ink">Guides and tips</h2>
          <Link href="/blog" className="shrink-0 text-sm font-medium text-brand-600 hover:underline">All articles</Link>
        </div>
        <PostGrid posts={guides} />
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="grid items-center gap-8 rounded-3xl bg-ink-soft p-8 text-white md:grid-cols-[1fr_auto] md:p-12">
          <div>
            <h2 className="font-serif text-3xl">Why biotin?</h2>
            <p className="mt-3 max-w-2xl text-white/80">
              Biotin (vitamin B7) helps your body build keratin, the protein hair is made of. Good biotin shampoos pair
              it with proteins and gentle cleansers to make hair look fuller and break less. If you&apos;re losing
              hair, though, the cause matters more than the shampoo.
            </p>
          </div>
          <Link href="/does-biotin-regrow-hair" className="justify-self-start rounded-full bg-brand-500 px-6 py-3 font-medium hover:bg-brand-600">
            Does biotin regrow hair?
          </Link>
        </div>
      </section>
    </>
  );
}
