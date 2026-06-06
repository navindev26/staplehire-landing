import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Copy,
  Check,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useTheme } from '@/hooks/use-theme';
import { trackPageEvent } from '@/services/analyticsService';
import ScrollReveal from '@/components/landing/ScrollReveal';
import AgentPipelineShowcase from '@/components/landing/AgentPipelineShowcase';
import EditorAgentCards from '@/components/landing/EditorAgentCards';
import {
  DevGridContainer,
  DevGridRule,
  DevGridShell,
} from '@/components/landing/DevGridFrame';

const INSTALL_CMD = 'npm install -g @staplehire/staplehire-cli';

function CodePanel({ code, className = '' }: { code: string; className?: string }) {
  return (
    <pre
      className={`overflow-x-auto rounded-xl border border-foreground/10 bg-[#0d0d0d] p-4 font-mono text-[13px] leading-relaxed text-[#e8e6e3] dark:border-white/10 ${className}`}
    >
      <code>{code}</code>
    </pre>
  );
}

function CopyInstallButton() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      trackPageEvent('cli_install_copy');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-[#e8e6e3] transition-colors hover:bg-white/10"
      aria-label="Copy install command"
    >
      {copied ? <Check className="size-4 text-[#2BA316]" /> : <Copy className="size-4 opacity-70" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function CliLandingPage() {
  const { isDark, toggleDarkMode } = useTheme();
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    document.title = 'Staplehire CLI — recruiting for AI agents';
    trackPageEvent('cli_landing_viewed');
  }, []);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <DevGridShell className="text-foreground overflow-x-clip">
      <header>
        <nav
          className={`sticky top-0 z-50 transition-all duration-300 ${
            navScrolled
              ? 'bg-background/80 backdrop-blur-xl'
              : 'bg-background/60 backdrop-blur-sm'
          }`}
        >
          <DevGridContainer>
            <div className="flex justify-between items-center h-[72px]">
              <a href="/" className="cursor-pointer" aria-label="Staplehire home">
                <Logo size="md" />
              </a>
              <div className="flex items-center gap-4 sm:gap-6">
                <a
                  href="/#features"
                  className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </a>
                <a
                  href="/docs"
                  className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Docs
                </a>
                <a
                  href="/blog"
                  className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </a>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="size-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
                </button>
                <a
                  href="#get-started"
                  onClick={() => trackPageEvent('cli_cta_click', { location: 'nav' })}
                >
                  <Button className="rounded-full px-5 h-[46px] font-bold text-base shadow-lg shadow-primary/20">
                    Get started
                  </Button>
                </a>
              </div>
            </div>
          </DevGridContainer>
        </nav>
      </header>

      <DevGridRule />

      <main>
        {/* 1. Hero — context.dev pattern */}
        <section className="relative isolate pt-14 pb-16 md:pt-24 md:pb-24">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] pointer-events-none -z-10">
            <div className="absolute top-[60px] left-[15%] w-[360px] h-[360px] bg-[radial-gradient(circle,rgba(85,171,237,0.06),transparent_70%)] blur-[50px]" />
            <div className="absolute top-[40px] right-[15%] w-[280px] h-[280px] bg-[radial-gradient(circle,rgba(181,150,229,0.06),transparent_70%)] blur-[50px]" />
          </div>

          <DevGridContainer centered className="max-w-[920px]">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="typography-eyebrow inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-muted/40 px-3 py-1 text-primary mb-6"
            >
              <Terminal className="size-3.5" />
              Staplehire CLI · v0.6
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="typography-h1 text-balance"
            >
              Give your agents a recruiting tool
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-5 text-xl font-medium tracking-tight text-foreground sm:text-2xl"
            >
              Source. Inbox. Investigate. Interview. Hire.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 para-lg text-muted-foreground max-w-[640px] mx-auto"
            >
              One CLI for your terminal and AI editor — roles, sourcing, screening, interviews, pipeline moves, and agent mail. JSON when piped; human-readable when you&apos;re at the shell.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <a href="#get-started" onClick={() => trackPageEvent('cli_cta_click', { location: 'hero' })}>
                <Button className="rounded-full px-6 h-[46px] font-bold text-base shadow-lg shadow-primary/20">
                  Install the CLI
                </Button>
              </a>
              <a
                href="https://staplehire.com"
                className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                onClick={() => trackPageEvent('cli_product_link')}
              >
                See the hiring agent →
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-12 max-w-[640px] mx-auto text-left"
            >
              <div className="flex items-center justify-between gap-3 rounded-t-xl border border-b-0 border-foreground/10 bg-[#0d0d0d] px-4 py-2.5 dark:border-white/10">
                <span className="font-mono text-xs text-white/50">terminal</span>
                <CopyInstallButton />
              </div>
              <pre className="rounded-b-xl border border-foreground/10 bg-[#0d0d0d] px-4 py-4 font-mono text-[13px] text-[#e8e6e3] dark:border-white/10">
                <span className="text-white/40">$ </span>
                {INSTALL_CMD}
                {'\n'}
                <span className="text-white/40">$ </span>
                staplehire login
              </pre>
            </motion.div>
          </DevGridContainer>
        </section>

        <DevGridRule />

        {/* 2. One CLI — pipeline tabs (context.dev “One API” section) */}
        <section className="py-16 md:py-24">
          <DevGridContainer>
            <ScrollReveal>
              <p className="typography-eyebrow text-primary mb-3">For AI agents</p>
              <h2 className="typography-h2 text-balance max-w-[720px]">
                One CLI.{' '}
                <span className="text-muted-foreground">The full hiring loop.</span>
              </h2>
              <p className="mt-4 para-lg text-muted-foreground max-w-[600px]">
                Same primitives your dashboard uses — exposed as stable commands with JSON output for automation.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <AgentPipelineShowcase />
            </ScrollReveal>
          </DevGridContainer>
        </section>

        <DevGridRule />

        {/* 3. Built for agents — context.dev “Connect your agent” cards */}
        <section className="py-16 md:py-24 bg-muted/30 dark:bg-muted/15">
          <DevGridContainer>
            <ScrollReveal>
              <h2 className="typography-h2 text-balance">
                Wire hiring into Cursor, Claude Code, Codex, OpenClaw, Hermes, and Pi
              </h2>
              <p className="mt-4 para-lg text-muted-foreground max-w-[620px]">
                Install skills, discover commands programmatically, and run the same flows you would in the app — without leaving the editor.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <EditorAgentCards />
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="mt-10">
              <p className="para text-muted-foreground mb-3">Agent skill install</p>
              <CodePanel code={`staplehire skills install
# Copies Staplehire agent skills into your editor`} />
            </ScrollReveal>
          </DevGridContainer>
        </section>

        <DevGridRule />

        {/* 4. Final CTA — context.dev closing section */}
        <section id="get-started" className="py-20 md:py-28">
          <DevGridContainer centered className="max-w-[720px]">
            <ScrollReveal>
              <h2 className="typography-h2 text-balance">
                Ship an agent that can actually hire
              </h2>
              <p className="mt-5 para-lg text-muted-foreground">
                Self-serve install, browser login, and a machine-readable command tree. Start in minutes from your repo root.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08} className="mt-10">
              <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto max-w-md mx-auto">
                <code className="flex-1 rounded-xl border border-foreground/10 bg-muted/50 px-4 py-3 font-mono text-sm text-left dark:border-white/10">
                  {INSTALL_CMD}
                </code>
                <CopyInstallButton />
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
                <a
                  href="https://www.npmjs.com/package/@staplehire/staplehire-cli"
                  className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackPageEvent('cli_npm_link')}
                >
                  npm package
                </a>
                <span className="text-muted-foreground/40" aria-hidden>
                  ·
                </span>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline bg-transparent border-0 cursor-pointer p-0 font-inherit text-sm"
                  onClick={() => {
                    trackPageEvent('cli_docs_click');
                    window.open('https://staplehire.com/docs', '_blank');
                  }}
                >
                  staplehire docs
                </button>
              </div>
            </ScrollReveal>
          </DevGridContainer>
        </section>
      </main>

      <DevGridRule />

      <footer className="bg-[var(--primitive-sunken)] py-8 dark:bg-card">
        <DevGridContainer className="flex flex-col items-center gap-3">
          <Logo size="footer" />
          <p className="text-sm text-muted-foreground text-center">
            <a href="/" className="underline-offset-4 hover:underline">
              Staplehire product
            </a>
            {' · '}
            CLI for agents &amp; terminals
          </p>
        </DevGridContainer>
      </footer>
    </DevGridShell>
  );
}

export function Component() {
  return <CliLandingPage />;
}

export default CliLandingPage;
