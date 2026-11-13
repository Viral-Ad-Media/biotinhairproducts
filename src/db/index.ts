import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

/** Null when DATABASE_URL isn't set; the site then serves the Markdown files in content/posts. */
export const db = url ? drizzle(neon(url), { schema }) : null;
export { schema };
