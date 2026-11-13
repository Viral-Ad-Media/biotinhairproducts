"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await authClient.signOut();
        router.replace("/admin/login");
        router.refresh();
      }}
      className="rounded-full border border-black/15 px-4 py-1.5 hover:border-brand-500 hover:text-brand-600"
    >
      Sign out
    </button>
  );
}
