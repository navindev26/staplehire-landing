import type { ComponentType } from 'react';
import postsMeta from '@/generated/blog-posts.json';

const REQUIRED_FIELDS = ['title', 'description', 'slug', 'date', 'author'] as const;

export interface BlogPostMeta {
  slug: string;
  title: string;
  metaTitle?: string;
  description: string;
  date: string;
  author: string;
  image?: string;
  authorImage?: string;
}

export interface BlogPost extends BlogPostMeta {
  Component: ComponentType;
}

interface BlogPostRecord extends BlogPostMeta {
  file: string;
}

const mdxModules = import.meta.glob('../content/blog/*.mdx', {
  eager: true,
}) as Record<string, { default: ComponentType }>;

function findMdxModule(file: string) {
  const exactKey = `../content/blog/${file}`;
  if (mdxModules[exactKey]?.default) {
    return mdxModules[exactKey];
  }

  const match = Object.entries(mdxModules).find(([path]) => path.endsWith(`/${file}`));
  if (match?.[1]?.default) {
    return match[1];
  }

  throw new Error(`MDX module not found for blog post file: ${file}`);
}

function validateRecord(record: BlogPostRecord): void {
  for (const field of REQUIRED_FIELDS) {
    if (!record[field] || typeof record[field] !== 'string' || !record[field].trim()) {
      throw new Error(`Blog post "${record.file}" is missing required field: ${field}`);
    }
  }
}

function parsePosts(): BlogPost[] {
  const records = postsMeta as BlogPostRecord[];

  return records.map((record) => {
    validateRecord(record);
    const mdxModule = findMdxModule(record.file);

    const { file: _file, ...meta } = record;
    return {
      ...meta,
      Component: mdxModule.default,
    };
  });
}

let cachedPosts: BlogPost[] | null = null;

function getPosts(): BlogPost[] {
  if (!cachedPosts) {
    cachedPosts = parsePosts();
  }
  return cachedPosts;
}

export function getAllPosts(): BlogPostMeta[] {
  return getPosts().map(({ Component: _Component, ...meta }) => meta);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getPosts().find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return getPosts().map((post) => post.slug);
}

export function getAllBlogPaths(): string[] {
  return getAllSlugs().map((slug) => `/blog/${slug}`);
}

export const SITE_URL = 'https://staplehire.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export function getDocumentTitle(post: BlogPostMeta): string {
  const base = post.metaTitle ?? post.title;
  return base.length <= 60 ? `${base} | Staplehire` : `${base.slice(0, 57)}... | Staplehire`;
}
