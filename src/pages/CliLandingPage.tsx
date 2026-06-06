import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Copy, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useTheme } from '@/hooks/use-theme';
import { trackPageEvent } from '@/services/analyticsService';
import ScrollReveal from '@/components/landing/ScrollReveal';
import EditorAgentCards from '@/components/landing/EditorAgentCards';
import {
  DevGridContainer,
  DevGridRule,
  DevGridShell,
} from '@/components/landing/DevGridFrame';

const INSTALL_CMD = 'npm install -g @staplehire/staplehire-cli';
const SKILL_CMD = 'staplehire skills install';
const KEY_CMD = 'export STAPLEHIRE_KEY="sh_live_your_key_here"';
const NPM_URL = 'https://www.npmjs.com/package/@staplehire/staplehire-cli';
const DOCS_URL = '/docs/index';
const APP_URL = 'https://app.staplehire.com';

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

/** Monospace bracket section label, e.g. `[ Install ]` — sits on a dotted rule. */
function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
      [ {children} ]
    </span>
  );
}

function useCopy(text: string, event?: string) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (event) trackPageEvent(event);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }, [text, event]);
  return { copied, copy };
}

function CopyButton({ text, event, label }: { text: string; event?: string; label?: string }) {
  const { copied, copy } = useCopy(text, event);
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-white/55 transition-colors hover:border-white/25 hover:text-white"
      aria-label={label ?? 'Copy to clipboard'}
    >
      {copied ? <Check className="size-3 text-[#7DD97D]" /> : <Copy className="size-3 opacity-70" />}
      {label ?? (copied ? 'Copied' : 'Copy')}
    </button>
  );
}

/** A flat outlined button with corner brackets (AgentMail-style secondary action). */
function BracketLink({
  href,
  children,
  onClick,
  external,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group relative inline-flex h-[46px] items-center justify-center px-6 font-mono text-[13px] uppercase tracking-[0.12em] text-foreground transition-colors hover:text-primary"
    >
      <span className="pointer-events-none absolute left-0 top-0 size-2.5 border-l border-t border-foreground/30 transition-colors group-hover:border-primary" />
      <span className="pointer-events-none absolute right-0 top-0 size-2.5 border-r border-t border-foreground/30 transition-colors group-hover:border-primary" />
      <span className="pointer-events-none absolute bottom-0 left-0 size-2.5 border-b border-l border-foreground/30 transition-colors group-hover:border-primary" />
      <span className="pointer-events-none absolute bottom-0 right-0 size-2.5 border-b border-r border-foreground/30 transition-colors group-hover:border-primary" />
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Syntax-highlighted code rendering (lightweight, token-based)        */
/* ------------------------------------------------------------------ */

type Tok = { t: string; c?: string };

const C = {
  dim: 'text-white/30',
  cmd: 'text-white/85',
  flag: 'text-[#7AC2F5]',
  str: 'text-[#7DD97D]',
  kw: 'text-[#C4A8ED]',
  num: 'text-[#7AC2F5]',
  comment: 'text-white/30 italic',
  key: 'text-[#FF7A1A]',
};

function Line({ tokens }: { tokens: Tok[] }) {
  return (
    <span className="block whitespace-pre">
      {tokens.map((tok, i) => (
        <span key={i} className={tok.c}>
          {tok.t}
        </span>
      ))}
      {'\n'}
    </span>
  );
}

/** Card chrome with a faux window/tab header + copy button. */
function CodeCard({
  title,
  copyText,
  copyEvent,
  children,
  className = '',
}: {
  title: string;
  copyText?: string;
  copyEvent?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/10 bg-[#0B0C0D] ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="font-mono text-[12px] text-white/50">{title}</span>
        {copyText ? <CopyButton text={copyText} event={copyEvent} /> : null}
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.65] text-[#E8E6E3]">
        <code>{children}</code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tabbed "Working code" panel                                          */
/* ------------------------------------------------------------------ */

const PROMPT_LINES: Tok[][] = [
  [{ t: '# Prompt your agent in plain English after installing the skill:', c: C.comment }],
  [{ t: '', c: C.dim }],
  [{ t: '"Create a Senior SDR role from this JD, source 10 prospects,', c: C.str }],
  [{ t: ' rank them by fit, and add the strong ones to the pipeline"', c: C.str }],
  [{ t: '', c: C.dim }],
  [{ t: '"Enrich candidate cand_mc, then send the structured interview', c: C.str }],
  [{ t: ' design once research comes back"', c: C.str }],
  [{ t: '', c: C.dim }],
  [{ t: '"Move everyone who scored above 8.5 to Shortlist and email', c: C.str }],
  [{ t: ' them a scheduling link"', c: C.str }],
];

const SCRIPT_LINES: Tok[][] = [
  [{ t: '# Source, poll the async job, then read prospects as JSON', c: C.comment }],
  [{ t: 'ROLE_ID', c: C.cmd }, { t: '=$(', c: C.dim }, { t: 'staplehire', c: C.key }, { t: ' roles create ', c: C.cmd }, { t: '--jd', c: C.flag }, { t: ' @jd.md', c: C.cmd }, { t: ' | jq -r ', c: C.dim }, { t: "'.role.id'", c: C.str }, { t: ')', c: C.dim }],
  [{ t: 'JOB_ID', c: C.cmd }, { t: '=$(', c: C.dim }, { t: 'staplehire', c: C.key }, { t: ' sourcing start ', c: C.cmd }, { t: '"$ROLE_ID"', c: C.str }, { t: ' | jq -r ', c: C.dim }, { t: "'.job.id'", c: C.str }, { t: ')', c: C.dim }],
  [{ t: 'staplehire', c: C.key }, { t: ' jobs poll ', c: C.cmd }, { t: '"$JOB_ID"', c: C.str }],
  [{ t: 'staplehire', c: C.key }, { t: ' sourcing prospects ', c: C.cmd }, { t: '"$ROLE_ID"', c: C.str }, { t: ' | jq ', c: C.dim }, { t: "'.prospects[]'", c: C.str }],
  [{ t: '', c: C.dim }],
  [{ t: '# Every command emits JSON on stdout when piped', c: C.comment }],
];

const TABS = [
  { id: 'prompt', label: 'Prompt your agent (Staplehire skill)', lines: PROMPT_LINES, copy: PROMPT_LINES.map((l) => l.map((t) => t.t).join('')).join('\n') },
  { id: 'script', label: 'Shell / CI script', lines: SCRIPT_LINES, copy: SCRIPT_LINES.map((l) => l.map((t) => t.t).join('')).join('\n') },
];

function WorkingCode() {
  const [active, setActive] = useState(TABS[0].id);
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0B0C0D]">
      <div className="flex items-center gap-1 overflow-x-auto border-b border-white/10 px-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`relative whitespace-nowrap px-3 py-3 font-mono text-[12px] transition-colors ${
              active === t.id
                ? 'text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {t.label}
            {active === t.id && (
              <span className="absolute inset-x-2 bottom-0 h-px bg-primary" />
            )}
          </button>
        ))}
        <div className="ml-auto pr-2">
          <CopyButton text={tab.copy} event="cli_code_copy" />
        </div>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.7] text-[#E8E6E3]">
        <code>
          {tab.lines.map((line, i) => (
            <Line key={i} tokens={line} />
          ))}
        </code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Why cards                                                           */
/* ------------------------------------------------------------------ */

const WHY = [
  {
    title: 'Runs the whole loop',
    body: 'Create roles, source, enrich, screen, interview, and move stages — the same primitives your dashboard uses, exposed as stable commands.',
  },
  {
    title: 'JSON in, JSON out',
    body: 'Auto-detects a pipe and emits structured JSON on stdout. Errors are JSON on stderr with stable exit codes your agent can branch on.',
  },
  {
    title: 'Discoverable by agents',
    body: 'Ship a skill to Cursor, Claude Code, or Codex and run `staplehire commands` for a machine-readable command tree — no guessing flags.',
  },
];

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

const FAQ = [
  {
    q: 'What is the Staplehire CLI?',
    a: 'A single binary (`staplehire`) that runs your entire hiring pipeline from the terminal — roles, stages, candidates, sourcing, enrichment, AI interviews, and agent email — with JSON output built for scripts and AI agents.',
  },
  {
    q: 'How do AI agents use it?',
    a: 'Run `staplehire skills install` to drop a skill into your `.agents`, `.claude`, or `.cursor` folder. The agent then discovers commands with `staplehire commands` and runs the same flows you would, passing JSON between steps.',
  },
  {
    q: 'Do I need a browser to authenticate?',
    a: 'Locally, `staplehire login` opens a browser for a one-time PKCE flow and writes a key to `.env`. For agents and CI, set `STAPLEHIRE_KEY` directly — no browser required.',
  },
  {
    q: 'Does it work in CI/CD?',
    a: 'Yes. Set `STAPLEHIRE_KEY` as a secret, install the CLI, and use `-q` for clean JSON output. Stable exit codes let your pipeline assert on success or failure.',
  },
  {
    q: 'Is the output stable enough to script against?',
    a: 'Every data command writes JSON to stdout; failures write structured JSON to stderr with documented exit codes (2 auth, 3 validation, 4 not found, and so on). Parse `error.code`, never message strings.',
  },
];

function FaqItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div className="border-b border-foreground/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="typography-h3 text-[18px] font-medium text-foreground sm:text-[19px]">{q}</span>
        <Plus
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ease-out ${open ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <p className="para text-muted-foreground max-w-[60ch]">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function CliLandingPage() {
  const { isDark, toggleDarkMode } = useTheme();
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    document.title = 'Staplehire CLI — a recruiting tool for your AI agents';
    trackPageEvent('cli_landing_viewed');
  }, []);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <DevGridShell className="text-foreground overflow-x-clip">
      {/* ---------------- Nav (mirrors SiteHeader; CLI active) ---------------- */}
      <header>
        <nav
          className={`sticky top-0 z-50 transition-all duration-300 ${
            navScrolled
              ? 'border-b border-[rgba(214,235,253,0.12)] bg-background/70 backdrop-blur-xl'
              : 'border-b border-transparent bg-transparent'
          }`}
        >
          <DevGridContainer>
            <div className="flex h-[72px] items-center justify-between md:h-[80px]">
              <a href="/" className="cursor-pointer" aria-label="Staplehire home">
                <Logo size="md" />
              </a>

              <div className="hidden items-center gap-7 md:flex">
                <a href="/#features" className="text-[14px] font-medium tracking-[0.01em] text-muted-foreground transition-colors hover:text-foreground">
                  Features
                </a>
                <a href="/cli" aria-current="page" className="text-[14px] font-medium tracking-[0.01em] text-foreground">
                  CLI
                </a>
                <a href="/docs/index" className="text-[14px] font-medium tracking-[0.01em] text-muted-foreground transition-colors hover:text-foreground">
                  Docs
                </a>
                <a href="/blog" className="text-[14px] font-medium tracking-[0.01em] text-muted-foreground transition-colors hover:text-foreground">
                  Blog
                </a>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
                </button>
                <a href={`${APP_URL}/login`} className="hidden text-[14px] font-medium tracking-[0.01em] text-muted-foreground transition-colors hover:text-foreground sm:inline">
                  Sign in
                </a>
                <a href="#get-started" onClick={() => trackPageEvent('cli_cta_click', { location: 'nav' })}>
                  <Button className="h-[40px] rounded-full px-5 text-[14px] font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30">
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
        {/* ---------------- Hero ---------------- */}
        <section className="relative isolate pt-16 pb-20 md:pt-24 md:pb-28">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px]">
            <div className="absolute left-1/2 top-[-40px] h-[440px] w-[820px] -translate-x-1/2 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(255,103,1,0.07),transparent_72%)] blur-[30px]" />
            <div className="absolute left-[14%] top-[140px] h-[260px] w-[260px] bg-[radial-gradient(circle,rgba(85,171,237,0.05),transparent_70%)] blur-[60px]" />
            <div className="absolute right-[14%] top-[110px] h-[240px] w-[240px] bg-[radial-gradient(circle,rgba(181,150,229,0.05),transparent_70%)] blur-[60px]" />
          </div>

          <DevGridContainer className="max-w-[860px]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-muted-foreground"
            >
              <span className="inline-block size-1.5 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(255,103,1,0.5)]" />
              Terminal + AI agents
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="typography-display max-w-[16ch] text-balance"
            >
              Give your agents a recruiting tool
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14 }}
              className="mt-6 para-lg max-w-[52ch] text-muted-foreground"
            >
              The Staplehire CLI runs your whole hiring pipeline from the terminal — create roles,
              source and enrich candidates, send AI interviews, and move stages. JSON output built
              for scripts and AI agents; human-readable when you&apos;re at the shell.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
            >
              <a href="#get-started" onClick={() => trackPageEvent('cli_cta_click', { location: 'hero' })}>
                <Button className="h-[46px] rounded-full px-7 text-[15px] font-bold shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40">
                  Install the CLI
                </Button>
              </a>
              <BracketLink href={DOCS_URL} onClick={() => trackPageEvent('cli_docs_click', { location: 'hero' })}>
                Docs
              </BracketLink>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-12 max-w-[620px]"
            >
              <CodeCard title="terminal" copyText={`${INSTALL_CMD}\nstaplehire login`} copyEvent="cli_install_copy">
                <Line tokens={[{ t: '$ ', c: C.dim }, { t: 'npm install -g ', c: C.cmd }, { t: '@staplehire/staplehire-cli', c: C.key }]} />
                <Line tokens={[{ t: '$ ', c: C.dim }, { t: 'staplehire', c: C.key }, { t: ' login', c: C.cmd }]} />
                <Line tokens={[{ t: '✓ Authenticated as ', c: C.str }, { t: 'Acme Corp', c: C.cmd }]} />
              </CodeCard>
            </motion.div>
          </DevGridContainer>
        </section>

        <DevGridRule />

        {/* ---------------- Install ---------------- */}
        <section className="py-16 md:py-24">
          <DevGridContainer>
            <ScrollReveal className="mb-3">
              <SectionTag>Install</SectionTag>
            </ScrollReveal>
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <ScrollReveal>
                <h2 className="typography-h2 text-balance">Two commands</h2>
                <p className="mt-4 para-lg max-w-[44ch] text-muted-foreground">
                  Install the package globally, then authenticate. For agents and CI, skip the
                  browser and set an API key instead.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <BracketLink href={NPM_URL} external onClick={() => trackPageEvent('cli_npm_link')}>
                    npm
                  </BracketLink>
                  <a
                    href={DOCS_URL}
                    onClick={() => trackPageEvent('cli_docs_click', { location: 'install' })}
                    className="font-mono text-[13px] uppercase tracking-[0.12em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    Installation guide →
                  </a>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.06} className="flex flex-col gap-4">
                <CodeCard title="Install globally with npm" copyText={INSTALL_CMD} copyEvent="cli_install_copy">
                  <Line tokens={[{ t: 'npm install -g ', c: C.cmd }, { t: '@staplehire/staplehire-cli', c: C.key }]} />
                </CodeCard>
                <CodeCard title="Or set an API key (agents & CI)" copyText={KEY_CMD} copyEvent="cli_key_copy">
                  <Line tokens={[{ t: 'export ', c: C.kw }, { t: 'STAPLEHIRE_KEY', c: C.cmd }, { t: '=', c: C.dim }, { t: '"sh_live_your_key_here"', c: C.str }]} />
                </CodeCard>
              </ScrollReveal>
            </div>
          </DevGridContainer>
        </section>

        <DevGridRule />

        {/* ---------------- Why ---------------- */}
        <section className="py-16 md:py-24">
          <DevGridContainer>
            <ScrollReveal className="mb-3">
              <SectionTag>Why</SectionTag>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="typography-h2 max-w-[18ch] text-balance">
                Why your agent needs its own recruiter
              </h2>
            </ScrollReveal>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.06] sm:grid-cols-3">
              {WHY.map((item, i) => (
                <ScrollReveal key={item.title} delay={0.04 * i} className="h-full">
                  <div className="flex h-full flex-col bg-background p-6 md:p-7">
                    <span className="font-mono text-[12px] text-primary">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="typography-h3 mt-4 text-[19px] font-medium text-foreground sm:text-[20px]">
                      {item.title}
                    </h3>
                    <p className="para mt-3 text-muted-foreground">{item.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </DevGridContainer>
        </section>

        <DevGridRule />

        {/* ---------------- Working code ---------------- */}
        <section className="py-16 md:py-24">
          <DevGridContainer>
            <ScrollReveal className="mb-3">
              <SectionTag>Code</SectionTag>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="typography-h2 text-balance">Working code</h2>
              <p className="mt-4 para-lg max-w-[52ch] text-muted-foreground">
                Prompt your agent in plain English with the Staplehire skill, or script the same
                flow in your shell or CI. Both speak JSON.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.06} className="mt-9">
              <WorkingCode />
            </ScrollReveal>
          </DevGridContainer>
        </section>

        <DevGridRule />

        {/* ---------------- Editors / agents ---------------- */}
        <section className="py-16 md:py-24">
          <DevGridContainer>
            <ScrollReveal className="mb-3">
              <SectionTag>Editors</SectionTag>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="typography-h2 max-w-[22ch] text-balance">
                Wire hiring into your agent of choice
              </h2>
              <p className="mt-4 para-lg max-w-[56ch] text-muted-foreground">
                Install skills, discover commands programmatically, and run the same flows you would
                in the app — Cursor, Claude Code, Codex, OpenClaw, Hermes, and Pi.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.06}>
              <EditorAgentCards />
            </ScrollReveal>
            <ScrollReveal delay={0.1} className="mt-6 max-w-[620px]">
              <CodeCard title="Install the agent skill" copyText={SKILL_CMD} copyEvent="cli_skill_copy">
                <Line tokens={[{ t: 'staplehire', c: C.key }, { t: ' skills install', c: C.cmd }]} />
                <Line tokens={[{ t: '# → .agents/skills/staplehire, .claude/…, .cursor/…', c: C.comment }]} />
              </CodeCard>
            </ScrollReveal>
          </DevGridContainer>
        </section>

        <DevGridRule />

        {/* ---------------- FAQ ---------------- */}
        <section className="py-16 md:py-24">
          <DevGridContainer>
            <ScrollReveal className="mb-3">
              <SectionTag>FAQ</SectionTag>
            </ScrollReveal>
            <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
              <ScrollReveal>
                <h2 className="typography-h2 text-balance">FAQ</h2>
                <p className="mt-4 para-lg text-muted-foreground">
                  Common questions about the Staplehire CLI and agents.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <div className="border-t border-foreground/10">
                  {FAQ.map((item, i) => (
                    <FaqItem key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </DevGridContainer>
        </section>

        <DevGridRule />

        {/* ---------------- Closing CTA ---------------- */}
        <section id="get-started" className="py-24 md:py-32">
          <DevGridContainer centered className="max-w-[720px]">
            <ScrollReveal>
              <h2 className="typography-h1 text-balance">Ship an agent that can actually hire</h2>
              <p className="mt-5 para-lg mx-auto max-w-[46ch] text-muted-foreground">
                Self-serve install, browser login, and a machine-readable command tree. Start in
                minutes from your repo root.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.08} className="mt-10">
              <div className="mx-auto flex max-w-[560px] items-center gap-3 rounded-xl border border-white/10 bg-[#0B0C0D] px-4 py-3 text-left">
                <span className="font-mono text-[13px] text-white/35">$</span>
                <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-[#E8E6E3]">
                  {INSTALL_CMD}
                </code>
                <CopyButton text={INSTALL_CMD} event="cli_install_copy" />
              </div>
              <div className="mt-7 flex justify-center">
                <a href={DOCS_URL} onClick={() => trackPageEvent('cli_docs_click', { location: 'cta' })}>
                  <Button className="h-[46px] rounded-full px-7 text-[15px] font-bold shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40">
                    Read the docs
                  </Button>
                </a>
              </div>
            </ScrollReveal>
          </DevGridContainer>
        </section>
      </main>

      <DevGridRule />

      {/* ---------------- Footer ---------------- */}
      <footer className="py-12 md:py-16">
        <DevGridContainer>
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-4">
              <Logo size="footer" />
              <p className="para-sm max-w-[34ch] text-muted-foreground">
                A recruiting tool for your terminal and AI agents.
              </p>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <span className="inline-block size-1.5 rounded-full bg-[var(--sh-build-text)] shadow-[0_0_8px_1px_var(--sh-build-text)]" />
                All systems online
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-2 sm:grid-cols-3">
              <FooterCol title="Product" links={[
                { label: 'Features', href: '/#features' },
                { label: 'Product', href: '/' },
                { label: 'Open app', href: `${APP_URL}/dashboard`, external: true },
              ]} />
              <FooterCol title="CLI" links={[
                { label: 'Docs', href: DOCS_URL },
                { label: 'npm', href: NPM_URL, external: true },
                { label: 'Command reference', href: '/docs/commands' },
              ]} />
              <FooterCol title="More" links={[
                { label: 'Blog', href: '/blog' },
                { label: 'Sign in', href: `${APP_URL}/login`, external: true },
              ]} />
            </div>
          </div>

          <div className="mt-10 border-t border-foreground/10 pt-6">
            <p className="para-sm text-muted-foreground">
              © {new Date().getFullYear()} Staplehire. CLI for agents &amp; terminals.
            </p>
          </div>
        </DevGridContainer>
      </footer>
    </DevGridShell>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/60">{title}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="text-[14px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Component() {
  return <CliLandingPage />;
}

export default CliLandingPage;
