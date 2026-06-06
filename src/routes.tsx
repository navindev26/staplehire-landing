import type { RouteRecord } from 'vite-react-ssg';
import { getAllBlogPaths } from '@/lib/blog';

export const routes: RouteRecord[] = [
  {
    path: '/',
    lazy: () => import('./pages/LandingPage'),
    entry: 'src/pages/LandingPage.tsx',
  },
  {
    path: '/cli',
    lazy: () => import('./pages/CliLandingPage'),
    entry: 'src/pages/CliLandingPage.tsx',
  },
  {
    path: '/blog',
    lazy: () => import('./pages/BlogIndexPage'),
    entry: 'src/pages/BlogIndexPage.tsx',
  },
  {
    path: '/blog/:slug',
    lazy: () => import('./pages/BlogPostPage'),
    entry: 'src/pages/BlogPostPage.tsx',
    getStaticPaths: () => getAllBlogPaths(),
  },
];
