import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function LoginPage() {
  if (!db) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <h1 className="font-serif text-3xl">Admin</h1>
        <p className="mt-3 text-muted">The admin area needs a database. Set DATABASE_URL to your Neon connection string and redeploy.</p>
      </div>
    );
  }
  if (await getAdminSession()) redirect("/admin");
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-3xl text-ink">Admin sign in</h1>
      <p className="mt-2 text-sm text-muted">Only emails listed in ADMIN_EMAILS can create an account.</p>
      <LoginForm />
    </div>
  );
}
