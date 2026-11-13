import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
        <Link href="/admin" className="font-serif text-2xl text-ink">Site admin</Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted">{session.user.email}</span>
          <SignOutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
