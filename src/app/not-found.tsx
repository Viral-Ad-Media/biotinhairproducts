import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-serif text-4xl text-ink">Page not found</h1>
      <p className="mt-3 text-muted">That page may have moved when we rebuilt the site.</p>
      <Link href="/blog" className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600">
        Browse all articles
      </Link>
    </div>
  );
}
