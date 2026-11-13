import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/categories";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" aria-label="Biotin Hair Products home" className="shrink-0">
          <Image src="/logo.png" alt="Biotin Hair" width={233} height={94} className="-my-4 h-16 w-auto" priority />
        </Link>
        <nav className="-mx-1 flex max-w-full gap-1 overflow-x-auto text-sm font-medium text-ink-soft">
          {Object.entries(categories).map(([slug, c]) => (
            <Link key={slug} href={`/category/${slug}`} className="whitespace-nowrap rounded-full px-3 py-1.5 hover:bg-brand-50 hover:text-brand-600">
              {c.name}
            </Link>
          ))}
          <Link href="/blog" className="whitespace-nowrap rounded-full px-3 py-1.5 hover:bg-brand-50 hover:text-brand-600">
            All articles
          </Link>
        </nav>
      </div>
    </header>
  );
}
