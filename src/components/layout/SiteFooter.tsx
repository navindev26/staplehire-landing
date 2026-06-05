import { Link } from 'react-router-dom';
import { appPath } from '@/lib/app-url';
import { Logo } from '@/components/ui/logo';

export function SiteFooter() {
  return (
    <footer className="bg-[var(--primitive-sunken)] px-4 py-8 sm:px-6 md:px-[104px] dark:bg-card">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-4">
        <Logo size="footer" className="pt-px" />
        <p className="text-sm text-muted-foreground text-center">
          <Link to="/blog" className="underline-offset-4 hover:underline">
            Blog
          </Link>
          {' · '}
          <a href={appPath('/login')} className="underline-offset-4 hover:underline">
            Sign in
          </a>
          {' · '}
          Already hiring with Staplehire? Open the{' '}
          <a href={appPath('/dashboard')} className="underline-offset-4 hover:underline">
            app
          </a>
        </p>
      </div>
    </footer>
  );
}
