"use client";

import { useActionState } from "react";
import { categories } from "@/lib/categories";
import type { Post } from "@/lib/posts";
import { deletePost, savePost, type FormState } from "./actions";

const input = "mt-1 w-full rounded-lg border border-black/15 px-3 py-2 focus:border-brand-500 focus:outline-none";

export function PostForm({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePost.bind(null, post?.slug ?? null), {});
  return (
    <form action={action} className="space-y-5">
      <label className="block text-sm font-medium">
        Title
        <input name="title" required defaultValue={post?.title} className={input} />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Slug (URL)
          <input name="slug" defaultValue={post?.slug} placeholder="generated from the title" className={input} />
        </label>
        <label className="block text-sm font-medium">
          Category
          <select name="category" defaultValue={post?.category ?? "reviews"} className={input}>
            {Object.entries(categories).map(([slug, c]) => (
              <option key={slug} value={slug}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Cover image
          <input name="coverImage" defaultValue={post?.coverImage ?? ""} placeholder="/uploads/2026/09/photo.jpg" className={input} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium">
            Status
            <select name="status" defaultValue={post?.status ?? "published"} className={input}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Publish date
            <input name="publishedAt" type="date" defaultValue={(post?.publishedAt ?? new Date()).toISOString().slice(0, 10)} className={input} />
          </label>
        </div>
      </div>
      <label className="block text-sm font-medium">
        Excerpt
        <textarea name="excerpt" required rows={2} defaultValue={post?.excerpt} className={input} />
      </label>
      <label className="block text-sm font-medium">
        Content (Markdown)
        <textarea name="content" required rows={22} defaultValue={post?.content} className={`${input} font-mono text-sm`} />
      </label>
      {state.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      {state.saved && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">Saved.</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button disabled={pending} className="rounded-full bg-brand-500 px-6 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-60">
          {pending ? "Saving…" : "Save"}
        </button>
        {post && (
          <>
            <a href={`/${post.slug}`} target="_blank" className="text-sm text-brand-600 hover:underline">View</a>
            <button
              type="button"
              onClick={() => confirm("Delete this post permanently?") && deletePost(post.slug)}
              className="ml-auto text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </form>
  );
}
