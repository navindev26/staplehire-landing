import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useTheme } from '@/hooks/use-theme';
import { trackPageEvent } from '@/services/analyticsService';

export function SiteHeader() {
  const { isDark, toggleDarkMode } = useTheme();
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          navScrolled
            ? 'border-b border-foreground/5 bg-background/55 backdrop-blur-xl shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-[104px]">
          <div className="flex justify-between items-center h-[72px] md:h-[80px]">
            <Link to="/" className="cursor-pointer" aria-label="Staplehire home">
              <Logo size="md" />
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/blog"
                className="text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="size-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              </button>
              <a href="/#demo" onClick={() => trackPageEvent('landing_pilot_request_click', { location: 'nav' })}>
                <Button className="rounded-full px-6 h-[42px] font-bold text-[14px] shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                  Request access
                </Button>
              </a>
            </div>

            <div className="flex md:hidden items-center justify-end gap-3 min-w-0 flex-1 pl-3">
              <Link
                to="/blog"
                className="text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                Blog
              </Link>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="size-9 shrink-0 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
