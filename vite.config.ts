import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import path from 'path';
import { rehypeBlogImages } from './src/lib/rehype-blog-images';
import { mintlifyDocsProxy } from './vite-mintlify-proxy';

export default defineConfig({
  plugins: [
    mintlifyDocsProxy(),
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        rehypeBlogImages,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: { className: ['anchor-link'] },
          },
        ],
      ],
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  ssgOptions: {
    formatting: 'minify',
  },
});
