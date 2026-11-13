import { notFound } from "next/navigation";
import { getPost } from "@/lib/posts";
import { PostForm } from "../../post-form";

export default async function EditPostPage({ params }: PageProps<"/admin/posts/[slug]">) {
  const post = await getPost((await params).slug, { includeDrafts: true });
  if (!post) notFound();
  return (
    <>
      <h1 className="mb-6 font-serif text-2xl">Edit post</h1>
      <PostForm post={post} />
    </>
  );
}
