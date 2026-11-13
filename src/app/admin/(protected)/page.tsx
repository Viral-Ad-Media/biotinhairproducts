import Link from "next/link";
import { categories, isCategory } from "@/lib/categories";
import { getAllPostsForAdmin } from "@/lib/posts";

export default async function AdminHome() {
  const posts = await getAllPostsForAdmin();
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl">Posts ({posts.length})</h1>
        <Link href="/admin/posts/new" className="rounded-full bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600">New post</Link>
      </div>
      {posts.length === 0 && <p className="text-muted">No posts in the database yet. Run <code>npm run db:seed</code> to import the starter posts.</p>}
      <ul className="divide-y divide-black/10 rounded-xl border border-black/10">
        {posts.map((p) => (
          <li key={p.slug} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
            <div className="min-w-0">
              <Link href={`/admin/posts/${p.slug}`} className="font-medium text-ink hover:text-brand-600">{p.title}</Link>
              <p className="text-xs text-muted">
                /{p.slug} · {isCategory(p.category) ? categories[p.category].name : p.category} · {p.publishedAt.toISOString().slice(0, 10)}
              </p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs ${p.status === "published" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{p.status}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
