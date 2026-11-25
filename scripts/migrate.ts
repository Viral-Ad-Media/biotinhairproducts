/**
 * Runs on every build (see "build" in package.json):
 * 1. applies any pending migrations in ./drizzle, so the tables always match the code;
 * 2. imports content/posts only when the post table is empty (a fresh database), so posts
 *    edited or deleted in /admin are never brought back by a later deploy.
 * Skipped when DATABASE_URL isn't set (the site then serves content/posts directly).
 * A failure is logged loudly but doesn't stop the build: the public pages fall back to
 * content/posts, while /admin needs the tables, so check the build log if it says "FAILED".
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { db, schema } from "../src/db";
import { readPostFiles } from "../src/lib/posts";

async function main() {
  if (!db) {
    console.log("[db] DATABASE_URL not set; skipping migrations.");
    return;
  }
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("[db] Migrations applied.");

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(schema.post);
  if (count > 0) {
    console.log(`[db] post table has ${count} rows; not seeding.`);
    return;
  }
  const posts = await readPostFiles();
  await db.insert(schema.post).values(posts).onConflictDoNothing({ target: schema.post.slug });
  console.log(`[db] Fresh database: imported ${posts.length} posts from content/posts.`);
}

main().catch((e) => {
  console.error("[db] Migration FAILED. Public pages will serve content/posts; /admin needs the tables.", e);
});
