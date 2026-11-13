# Biotin Hair Products

Rebuild of biotinhairproducts.com (formerly WordPress) with Next.js 16, Tailwind CSS 4, Neon Postgres (Drizzle ORM) and Better Auth.

## What's here

- **Public site:** home, 17 articles at `/<slug>`, category pages at `/category/<slug>`, `/blog`, sitemap and robots.
- **Admin:** `/admin` (Better Auth email + password). Only emails listed in `ADMIN_EMAILS` can create an account. Admins can create, edit, draft and delete posts (Markdown).
- **Content:** starter posts live in `content/posts/*.md`. With a database, they're imported once by `npm run db:seed` and then edited in `/admin`. Without `DATABASE_URL`, the site serves the Markdown files directly (handy for previews).
- **Images:** `public/uploads/` holds the original uploads recovered from the old site, each checked to be a real image with no embedded code. Old `/wp-content/uploads/...` links redirect here.
- **Redirects:** old WordPress URLs (dated permalinks, duplicate posts, categories, tags) 301 to the new pages in `next.config.ts`. Any `*.php` request goes to the home page.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, ADMIN_EMAILS
npm run db:migrate           # create tables in Neon (drizzle/0000_init.sql)
npm run db:seed              # import the posts in content/posts
npm run dev
```

Then open `/admin/login`, choose "Create your admin account" with an email from `ADMIN_EMAILS`, and sign in.

Note: the drizzle-kit and seed scripts read `.env` (via dotenv); copy your values there too, or export them in your shell.

## Deploying (Vercel)

Set the same env vars in the project settings (`BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` = your production URL), run the migrate and seed steps once against the production database, and deploy.

## Notes

- The old site was compromised. Nothing from it was carried over except images. Don't copy PHP files or plugins back.
- The articles were rewritten from the old site's titles and topics because no database backup survived. Product reviews describe each product as its brand does; check them against current labels before relying on them.
