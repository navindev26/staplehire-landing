import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'src/content/blog');
const distDir = path.join(root, 'dist');
const SITE_URL = 'https://staplehire.com';

function getPosts() {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
      const { data, content } = matter(raw);
      for (const field of ['title', 'description', 'slug', 'date', 'author']) {
        if (!data[field]) {
          throw new Error(`Missing ${field} in ${file}`);
        }
      }
      return {
        title: data.title,
        description: data.description,
        slug: data.slug,
        date: data.date,
        author: data.author,
        excerpt: content.replace(/\s+/g, ' ').trim().slice(0, 280),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const posts = getPosts();
const buildDate = new Date().toUTCString();

const items = posts
  .map(
    (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      <author>${post.author}</author>
    </item>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Staplehire Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Insights on hiring, technical interviews, and building better recruiting workflows.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

if (!fs.existsSync(distDir)) {
  throw new Error('dist/ not found — run vite-react-ssg build first');
}

const rssDir = path.join(distDir, 'blog');
fs.mkdirSync(rssDir, { recursive: true });
fs.writeFileSync(path.join(rssDir, 'rss.xml'), xml);
console.log(`Generated blog/rss.xml with ${posts.length} posts`);
