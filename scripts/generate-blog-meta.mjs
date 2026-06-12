import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'src/content/blog');
const outputFile = path.join(root, 'src/generated/blog-posts.json');

const REQUIRED = ['title', 'description', 'slug', 'date', 'author'];

if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, '[]\n');
  console.log('No blog content directory — wrote empty blog-posts.json');
  process.exit(0);
}

const posts = fs
  .readdirSync(contentDir)
  .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
  .map((file) => {
    const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
    const { data } = matter(raw);

    for (const field of REQUIRED) {
      if (!data[field]) {
        throw new Error(`Blog post "${file}" is missing required frontmatter: ${field}`);
      }
    }

    return {
      file,
      slug: data.slug,
      title: data.title,
      metaTitle: data.metaTitle ?? undefined,
      description: data.description,
      date: data.date,
      author: data.author,
      image: data.image ?? undefined,
      authorImage: data.authorImage ?? undefined,
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(posts, null, 2)}\n`);
console.log(`Generated blog-posts.json with ${posts.length} post(s)`);
