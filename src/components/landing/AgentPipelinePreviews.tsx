import { Bot, Check, FileText, Mail, Mic, Search, Send, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const candidates = [
  { name: 'Maya Chen', role: 'Senior SDR @ LaunchDarkly', score: 8.9, fit: 'Strong', on: true },
  { name: 'James Marcialis', role: 'SDR @ Soligent', score: 8.8, fit: 'Strong' },
  { name: 'Emily Chen', role: 'SDR @ Evergreen Solar', score: 8.9, fit: 'Strong' },
  { name: 'Savannah Morris', role: 'SDM II @ Aptos Solar', score: 8.7, fit: 'Strong' },
];

export function SourceListPreview() {
  return (
    <div className="flex h-full min-h-0 flex-col text-foreground">
      <p className="para-sm border-b border-border px-4 py-2.5 font-medium text-muted-foreground">
        Sourced (10)
      </p>
      <ul className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
        {candidates.map((c) => (
          <li
            key={c.name}
            className={cn(
              'border-b border-border/80 px-4 py-3',
              c.on && 'bg-primary/10',
            )}
          >
            <div className="flex justify-between gap-2">
              <div className="min-w-0">
                <p className="para truncate font-medium">{c.name}</p>
                <p className="para-sm mt-0.5 truncate text-muted-foreground">{c.role}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="para font-medium tabular-nums">{c.score}</p>
                <p className="para-sm font-medium text-[var(--sh-build-text)] dark:text-[var(--primitive-success-dark)]">
                  {c.fit}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const inboxSurfaced = [
  { name: 'Priya Nair', source: 'Resume · inbound', score: 8.6, parsed: true },
  { name: 'Maya Chen', source: 'Apply link', score: 8.9, parsed: true, active: true },
  { name: 'Jordan Lee', source: 'Referral', score: 8.2, parsed: true },
  { name: 'Alex Kim', source: 'Resume · inbound', score: 7.8, parsed: true },
];

export function InboxPreview() {
  return (
    <div className="flex h-full min-h-0 flex-col text-foreground">
      <div className="border-b border-border px-4 py-3 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="para font-medium">Senior SDR · agent inbox</p>
            <p className="para-sm mt-0.5 text-muted-foreground">hire+rol_sdr@in.staplehire.com</p>
          </div>
          <span className="para-sm inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
            <Bot className="size-3.5" />
            Agent on
          </span>
        </div>
        <p className="para-sm mt-3 text-muted-foreground">
          <span className="font-medium text-foreground">6 surfaced</span>
          {' · '}
          41 auto-archived below fit bar
        </p>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
        {inboxSurfaced.map((c) => (
          <li
            key={c.name}
            className={cn(
              'border-b border-border/80 px-4 py-3 sm:px-5',
              c.active && 'bg-primary/10',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="para font-medium">{c.name}</p>
                <p className="para-sm mt-0.5 text-muted-foreground">{c.source}</p>
                <span className="para-sm mt-2 inline-flex items-center gap-1 text-muted-foreground">
                  <FileText className="size-3.5" />
                  Resume parsed
                </span>
              </div>
              <div className="shrink-0 text-right">
                <p className="para-lg font-medium tabular-nums">{c.score}</p>
                <p className="para-sm font-medium text-[var(--sh-build-text)] dark:text-[var(--primitive-success-dark)]">
                  Fit score
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-border bg-muted/40 px-4 py-3 sm:px-5">
        <p className="para-sm text-muted-foreground">
          Low-fit applications stay out of your queue — the agent triages every message so nobody good gets lost.
        </p>
      </div>
    </div>
  );
}

export function InvestigatePreview() {
  return (
    <div className="flex h-full min-h-0 flex-col justify-center space-y-4 p-5 text-foreground sm:p-6">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="para-lg font-medium">Maya Chen</h4>
            <span className="para-sm rounded border border-border px-2 py-0.5">Fit 8.9</span>
            <span className="para-sm rounded bg-[var(--sh-build-soft)] px-2 py-0.5 font-medium text-[var(--sh-build-text)] dark:bg-[var(--primitive-build-soft-dark)] dark:text-[var(--primitive-success-dark)]">
              Strong
            </span>
          </div>
          <p className="para-sm mt-1 text-muted-foreground">Senior SDR · LaunchDarkly</p>
        </div>
        <button
          type="button"
          className="para-sm inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 font-medium text-primary-foreground"
          tabIndex={-1}
        >
          <Star className="size-3.5 fill-current" />
          Shortlist
        </button>
      </div>
      <p className="para text-muted-foreground">
        Strong outbound for developer tools. Quota ownership and engineering-buyer messaging on public
        profiles.
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="para-sm inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1.5 font-medium text-primary-foreground">
          <Search className="size-3.5" />
          Deep search
        </span>
        <span className="para-sm inline-flex items-center gap-1.5 rounded-lg bg-[var(--sh-build-soft)] px-2.5 py-1.5 font-medium text-[var(--sh-build-text)] dark:bg-[var(--primitive-build-soft-dark)] dark:text-[var(--primitive-success-dark)]">
          <Check className="size-3.5" />
          Enriched
        </span>
      </div>
    </div>
  );
}

export function InterviewPreview() {
  return (
    <div className="relative flex h-full min-h-[240px] flex-col items-center justify-center bg-card px-6 py-10 text-center sm:px-8 sm:py-12">
      <div className="mb-3 flex gap-1.5" aria-hidden>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="size-2 rounded-full bg-[var(--sh-hustle)] opacity-70" />
        ))}
      </div>
      <p className="para-sm font-medium text-[var(--sh-hustle)]">Listening, take your time</p>
      <p className="para-lg mt-4 max-w-[340px] text-balance font-medium text-foreground sm:text-xl">
        Hi Lisa, thanks for taking the time to chat about the Senior SDR role…
      </p>
      <div className="absolute bottom-4 right-4 h-16 w-24 overflow-hidden rounded-lg border border-border bg-gradient-to-br from-[#4a3728] to-[#2a1f1c]">
        <div className="absolute inset-x-0 bottom-1.5 flex justify-center">
          <div className="size-9 rounded-full bg-[#8B5E4B]/90" />
        </div>
      </div>
      <Mic className="absolute bottom-4 left-4 size-5 text-muted-foreground/40" aria-hidden />
    </div>
  );
}

export function HireEmailPreview() {
  return (
    <div className="flex h-full min-h-0 flex-col text-foreground">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Mail className="size-5 text-muted-foreground" />
          <div>
            <p className="para font-medium">Review email</p>
            <p className="para-sm text-muted-foreground">Maya Chen · maya.chen@launchdarkly.com</p>
          </div>
        </div>
        <X className="size-4 text-muted-foreground" aria-hidden />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-lg bg-muted px-5 py-5">
          <p className="para font-bold">Staplehire</p>
          <p className="para-lg mt-4 text-center font-medium">Quick intro about the SDR role</p>
          <p className="para mt-4 text-muted-foreground">
            Hi Maya — your outbound work at LaunchDarkly stood out. Open to a 20-min intro this week?
          </p>
        </div>
      </div>
      <div className="flex gap-2 border-t border-border p-3">
        <button type="button" className="para flex-1 rounded-full border border-border py-2" tabIndex={-1}>
          Cancel
        </button>
        <button
          type="button"
          className="para inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2 font-medium text-primary-foreground"
          tabIndex={-1}
        >
          <Send className="size-4" />
          Send
        </button>
      </div>
    </div>
  );
}
