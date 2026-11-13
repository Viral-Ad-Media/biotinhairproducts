"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const input = "mt-1 w-full rounded-lg border border-black/15 px-3 py-2 focus:border-brand-500 focus:outline-none";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    const res =
      mode === "signin"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name: String(f.get("name") || email) });
    setPending(false);
    if (res.error) return setError(res.error.message ?? "Something went wrong.");
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      {mode === "signup" && (
        <label className="block text-sm font-medium">
          Name
          <input name="name" className={input} autoComplete="name" />
        </label>
      )}
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" required className={input} autoComplete="email" />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input name="password" type="password" required minLength={10} className={input} autoComplete={mode === "signin" ? "current-password" : "new-password"} />
      </label>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button disabled={pending} className="w-full rounded-full bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600 disabled:opacity-60">
        {pending ? "Please wait…" : mode === "signin" ? "Sign in" : "Create admin account"}
      </button>
      <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="w-full text-sm text-brand-600 hover:underline">
        {mode === "signin" ? "First time? Create your admin account" : "Already have an account? Sign in"}
      </button>
    </form>
  );
}
