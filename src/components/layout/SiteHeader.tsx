import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Menu, X, Search, MessageSquare, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useTheme } from '@/hooks/use-theme';
import { trackPageEvent } from '@/services/analyticsService';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const APP_URL = 'https://app.staplehire.com';

// The three real product features on the landing page, each anchored to its
// section in FromJobToShortlistSection (ids: #source / #interview / #manage).
const FEATURES = [
  {
    title: 'Source',
    description: 'Surface qualified candidates with profiles, references, and fit signals on each one.',
    href: '/#source',
    icon: Search,
  },
  {
    title: 'Interview',
    description: 'Structured interviews on the candidate’s schedule, graded against your bar and recorded.',
    href: '/#interview',
    icon: MessageSquare,
  },
  {
    title: 'Manage',
    description: 'Every candidate ranked by fit, with signals, recordings, and the analysis behind each score.',
    href: '/#manage',
    icon: ListChecks,
  },
];

const SIMPLE_LINKS = [
  { label: 'CLI', href: '/cli', internal: true },
  { label: 'Docs', href: '/docs/index' },
  { label: 'Blog', href: '/blog', internal: true },
];

const navLinkClass =
  'text-[14px] font-medium tracking-[0.01em] text-muted-foreground transition-colors hover:text-foreground';

export function SiteHeader() {
  const { isDark, toggleDarkMode } = useTheme();
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

            {/* Center: primary nav (desktop) — Features is a dropdown */}
            <div className="hidden md:block">
              <NavigationMenu viewport={false}>
                <NavigationMenuList className="gap-2">
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-9 bg-transparent px-3 text-[14px] font-medium tracking-[0.01em] text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=open]:bg-transparent data-[state=open]:text-foreground">
                      Features
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="rounded-xl border border-[rgba(214,235,253,0.12)]">
                      <ul className="grid w-[360px] gap-1 p-2">
                        {FEATURES.map((feature) => (
                          <li key={feature.title}>
                            <NavigationMenuLink asChild>
                              <a
                                href={feature.href}
                                className="flex flex-row items-start gap-3 rounded-lg p-3"
                              >
                                <feature.icon className="mt-0.5 size-[18px] shrink-0 text-primary" />
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[14px] font-semibold leading-none text-foreground">
                                    {feature.title}
                                  </span>
                                  <span className="text-[13px] leading-snug text-muted-foreground">
                                    {feature.description}
                                  </span>
                                </div>
                              </a>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {SIMPLE_LINKS.map((item) => (
                    <NavigationMenuItem key={item.label}>
                      {item.internal ? (
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                          <Link
                            to={item.href}
                            className="h-9 bg-transparent px-3 text-[14px] font-medium tracking-[0.01em] text-muted-foreground hover:bg-transparent hover:text-foreground"
                          >
                            {item.label}
                          </Link>
                        </NavigationMenuLink>
                      ) : (
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                          <a
                            href={item.href}
                            className="h-9 bg-transparent px-3 text-[14px] font-medium tracking-[0.01em] text-muted-foreground hover:bg-transparent hover:text-foreground"
                          >
                            {item.label}
                          </a>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
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
              {/* Features expanded inline on mobile */}
              <p className="px-1 pb-1 pt-2 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                Features
              </p>
              {FEATURES.map((feature) => (
                <a
                  key={feature.title}
                  href={feature.href}
                  className="flex items-center gap-3 rounded-lg px-1 py-2 text-[15px] text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  <feature.icon className="size-[18px] shrink-0 text-primary" />
                  {feature.title}
                </a>
              ))}
              <div className="my-2 h-px bg-[rgba(214,235,253,0.12)]" />
              {SIMPLE_LINKS.map((item) =>
                item.internal ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`${navLinkClass} py-2`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`${navLinkClass} py-2`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              )}
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
