import Link from "next/link";
import { categories } from "@/lib/categories";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-serif text-xl text-white">{site.name}</p>
          <p className="mt-2 text-sm">{site.tagline}.</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Topics</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {Object.entries(categories).map(([slug, c]) => (
              <li key={slug}>
                <Link href={`/category/${slug}`} className="hover:text-brand-500">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs leading-relaxed text-white/60">
          The content on this site is for general information only and isn&apos;t medical advice. If you&apos;re
          worried about hair loss, talk to a doctor or dermatologist.
        </p>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}
