import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'src/content/blog');
const distDir = path.join(root, 'dist');
const SITE_URL = 'https://staplehire.com';

function getPostSlugs() {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
      const { data } = matter(raw);
      if (!data.slug) {
        throw new Error(`Missing slug in ${file}`);
      }
      return { slug: data.slug, date: data.date ?? new Date().toISOString() };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const staticRoutes = [
  { loc: `${SITE_URL}/`, priority: '1.0' },
  { loc: `${SITE_URL}/blog`, priority: '0.8' },
];

const postRoutes = getPostSlugs().map((post) => ({
  loc: `${SITE_URL}/blog/${post.slug}`,
  priority: '0.7',
}));

const urls = [...staticRoutes, ...postRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

if (!fs.existsSync(distDir)) {
  throw new Error('dist/ not found — run vite-react-ssg build first');
}

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
console.log(`Generated sitemap.xml with ${urls.length} URLs`);
