import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useTheme } from '@/hooks/use-theme';
import { trackPageEvent } from '@/services/analyticsService';

const APP_URL = 'https://app.staplehire.com';

type NavItem = { label: string; href: string; internal?: boolean };

// Resend-style primary navigation: product surfaces grouped left of the CTA.
// Features anchors the landing's "How it works" section; CLI + Docs + Blog are
// the developer/content surfaces. Anchor links use absolute "/#features" so they
// resolve from any page (e.g. /blog), not just the landing route.
const NAV_ITEMS: NavItem[] = [
  { label: 'Features', href: '/#features' },
  { label: 'CLI', href: '/cli', internal: true },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog', internal: true },
];

const navLinkClass =
  'text-[14px] font-medium tracking-[0.01em] text-muted-foreground transition-colors hover:text-foreground';

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  if (item.internal) {
    return (
      <Link to={item.href} className={navLinkClass} onClick={onClick}>
        {item.label}
      </Link>
    );
  }
  return (
    <a href={item.href} className={navLinkClass} onClick={onClick}>
      {item.label}
    </a>
  );
}

export function SiteHeader() {
  const { isDark, toggleDarkMode } = useTheme();
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          navScrolled || mobileOpen
            ? 'border-b border-[rgba(214,235,253,0.12)] bg-background/70 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-[104px]">
          <div className="flex h-[72px] items-center justify-between md:h-[80px]">
            {/* Left: wordmark */}
            <Link to="/" className="cursor-pointer" aria-label="Staplehire home">
              <Logo size="md" />
            </Link>

            {/* Center: primary nav (desktop) */}
            <div className="hidden items-center gap-7 md:flex">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.label} item={item} />
              ))}
            </div>

            {/* Right: utilities + CTA (desktop) */}
            <div className="hidden items-center gap-4 md:flex">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              </button>
              <a href={`${APP_URL}/login`} className={navLinkClass}>
                Sign in
              </a>
              <a
                href="/#demo"
                onClick={() => trackPageEvent('landing_pilot_request_click', { location: 'nav' })}
              >
                <Button className="h-[40px] rounded-full px-5 text-[14px] font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30">
                  Request access
                </Button>
              </a>
            </div>

            {/* Mobile: toggle + hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="flex size-9 items-center justify-center rounded-full text-foreground"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="border-t border-[rgba(214,235,253,0.12)] bg-background/95 backdrop-blur-xl md:hidden">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="py-2">
                  <NavLink item={item} onClick={() => setMobileOpen(false)} />
                </div>
              ))}
              <a
                href={`${APP_URL}/login`}
                className={`${navLinkClass} py-2`}
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </a>
              <a
                href="/#demo"
                onClick={() => {
                  trackPageEvent('landing_pilot_request_click', { location: 'nav_mobile' });
                  setMobileOpen(false);
                }}
                className="mt-2"
              >
                <Button className="h-[44px] w-full rounded-full text-[14px] font-semibold">
                  Request access
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
