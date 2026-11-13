import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { db, schema } from "@/db";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const isAdminEmail = (email: string) => adminEmails.includes(email.toLowerCase());

export const auth = betterAuth({
  // Better Auth needs a database; without DATABASE_URL the admin area is simply unavailable.
  database: db
    ? drizzleAdapter(db, {
        provider: "pg",
        schema: { user: schema.user, session: schema.session, account: schema.account, verification: schema.verification },
      })
    : undefined,
  emailAndPassword: { enabled: true, minPasswordLength: 10 },
  databaseHooks: {
    user: {
      create: {
        // Only addresses listed in ADMIN_EMAILS may create an account.
        before: async (u) => {
          if (!isAdminEmail(u.email)) {
            throw new APIError("FORBIDDEN", { message: "Sign-up is limited to site admins." });
          }
          return { data: u };
        },
      },
    },
  },
  plugins: [nextCookies()],
});

export async function getAdminSession() {
  if (!db) return null;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !isAdminEmail(session.user.email)) return null;
  return session;
}
