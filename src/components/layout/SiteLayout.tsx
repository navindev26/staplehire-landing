import type { ReactNode } from 'react';
import { ClientOnly } from 'vite-react-ssg';
import { Analytics } from '@vercel/analytics/react';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

interface SiteLayoutProps {
  children: ReactNode;
  className?: string;
}

export function SiteLayout({ children, className = '' }: SiteLayoutProps) {
  return (
    <div className={`min-h-screen bg-background text-foreground overflow-x-clip ${className}`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <SiteHeader />
      {children}
      <SiteFooter />
      <ClientOnly>{() => <Analytics />}</ClientOnly>
    </div>
  );
}
