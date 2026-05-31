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

## SEO

- Meta tags, Open Graph, Twitter cards, and JSON-LD in `index.html`
- `public/robots.txt` and `public/sitemap.xml`
- Semantic `header` / `main` / `footer`, skip link, descriptive image alts
