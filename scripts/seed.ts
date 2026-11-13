import "dotenv/config";
import { sql } from "drizzle-orm";
import { db, schema } from "../src/db";
import { readPostFiles } from "../src/lib/posts";

async function main() {
  if (!db) throw new Error("Set DATABASE_URL (your Neon connection string) first.");
  const posts = await readPostFiles();
  for (const p of posts) {
    // Insert new posts; leave posts that already exist alone so edits made in /admin are never overwritten.
    await db.insert(schema.post).values(p).onConflictDoNothing({ target: schema.post.slug });
  }
  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(schema.post);
  console.log(`Seeded ${posts.length} posts from content/posts (table now has ${count}).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
