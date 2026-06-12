# Staplehire marketing site

Public landing page for [staplehire.com](https://staplehire.com). The authenticated product lives at [app.staplehire.com](https://app.staplehire.com) ([Staplehire](https://github.com/navindev26/Staplehire) monorepo).

## Develop

```bash
cp .env.example .env.local
# fill VITE_SUPABASE_ANON_KEY (publishable key)
npm install
npm run dev
```

## Deploy (Vercel)

1. Import this repo as a new Vercel project.
2. Set **Production** domain: `staplehire.com` (and `www` → apex redirect).
3. Environment variables:
   - `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — same as production app (demo form).
   - `VITE_APP_URL` — `https://app.staplehire.com`
4. Point the main app project at `app.staplehire.com` only.

Legacy paths (`/login`, `/signup`, `/apply/*`) redirect to the app subdomain via `vercel.json`.

## CLI docs (Mintlify)

CLI documentation is in [`docs/`](docs/) (Mintlify `docs.json` + MDX pages). Production:

- **https://staplehire.com/docs** — proxied via `vercel.json` to Mintlify (`staplehire.mintlify.dev`)
- **Agent search MCP** — `https://staplehire.com/docs/mcp`

After editing MDX locally, push to `main` (or merge a PR). Mintlify deploys from the connected Git branch. To edit via Cursor Admin MCP, reconnect Mintlify in **Cursor → MCP settings** (refresh token required).

## SEO

- Per-page meta via `vite-react-ssg` `<Head>` (homepage, blog index, each post)
- `sitemap.xml` and `blog/rss.xml` generated at build time
- `public/robots.txt` points to the sitemap
- Semantic `header` / `main` / `footer`, skip link, descriptive image alts

## Blog

Posts live in `src/content/blog/` as `.mdx` files with YAML frontmatter. The build pre-renders `/blog` and `/blog/:slug` to static HTML.

### Publishing a blog post

1. Export the article from Outrank as markdown
2. Add or normalize frontmatter (`title`, `description`, `slug`, `date`, `author`; optional `metaTitle`, `image`, `authorImage`)
3. Save as `src/content/blog/your-slug.mdx` — use `##` for sections, not `#` (the page H1 comes from `title`)
4. Run `npm run build` locally to verify, then commit and deploy

Required frontmatter:

```yaml
---
title: "Post title for the page H1"
description: "150–160 char summary used as meta description"
slug: "url-slug"
date: "2026-06-05"
author: "Author Name"
image: "/blog/your-slug/cover.webp"        # optional hero banner
authorImage: "/blog/authors/navin.webp"   # optional author avatar
---
```

### Inline banner images

Drop images into `public/blog/your-slug/` (WebP recommended), then reference them in the MDX body:

```md
![Descriptive alt text for SEO and accessibility](/blog/your-slug/banner-name.webp)
```

Images render full-width between paragraphs with rounded corners and a subtle card border — matching the centered header + inline banner layout.
