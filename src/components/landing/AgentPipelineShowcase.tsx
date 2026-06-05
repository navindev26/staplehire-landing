import { useState } from 'react';
import { Inbox, Mic, Search, Terminal, UserCheck, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackPageEvent } from '@/services/analyticsService';
import PipelineShowcaseFlow, { TerminalLine } from '@/components/landing/PipelineShowcaseFlow';
import {
  HireEmailPreview,
  InboxPreview,
  InvestigatePreview,
  InterviewPreview,
  SourceListPreview,
} from '@/components/landing/AgentPipelinePreviews';

export type PipelineId = 'source' | 'inbox' | 'investigate' | 'interview' | 'hire';

const CANDIDATES_JSON = [
  { id: 'cand_mc', name: 'Maya Chen', score: 8.9, fit: 'strong', stage: 'sourced' },
  { id: 'cand_jm', name: 'James Marcialis', score: 8.8, fit: 'strong', stage: 'sourced' },
  { id: 'cand_ec', name: 'Emily Chen', score: 8.9, fit: 'strong', stage: 'sourced' },
  { id: 'cand_sm', name: 'Savannah Morris', score: 8.7, fit: 'strong', stage: 'sourced' },
];

const PIPELINE = [
  {
    id: 'source' as const,
    label: 'Source',
    icon: Users,
    summary: 'Start sourcing from a JD. Prospects sync as structured records your agent can rank and filter.',
    headline: 'Ten prospects. One command.',
    subhead: 'Create a role, start sourcing, pipe prospects into your agent.',
    footer: '— LOGIN · SOURCE · JSON —',
    rootLabel: 'prospects',
    json: JSON.stringify(
      { role_id: 'rol_sdr_solar_01', count: 10, prospects: CANDIDATES_JSON },
      null,
      2,
    ),
    previewTitle: 'dashboard — sourced',
    preview: <SourceListPreview />,
    commands: (
      <>
        <TerminalLine>
          <span className="text-[#7ec8ff]">staplehire login</span>
        </TerminalLine>
        <TerminalLine>
          <span className="text-[#7ec8ff]">staplehire roles create</span>
          <span className="text-white/70"> --jd @senior-sdr.md</span>
        </TerminalLine>
        <TerminalLine>
          <span className="text-[#7ec8ff]">staplehire sourcing start</span>
          <span className="text-white/70"> {'<roleId>'}</span>
        </TerminalLine>
        <TerminalLine>
          <span className="text-[#7ec8ff]">staplehire sourcing prospects</span>
          <span className="text-white/70"> {'<roleId>'} --json</span>
        </TerminalLine>
      </>
    ),
  },
  {
    id: 'inbox' as const,
    label: 'Agent inbox',
    icon: Inbox,
    summary:
      'Every role ships a virtual inbox. The agent parses resumes, scores fit, and only surfaces people worth your time.',
    headline: 'No one gets lost in the inbox.',
    subhead:
      'Applications land in a role inbox — the agent triages, parses, and ranks so you only see strong fits.',
    footer: '— PARSE · SCORE · SURFACE —',
    rootLabel: 'inbox',
    json: JSON.stringify(
      {
        role_id: 'rol_sdr_solar_01',
        inbox_address: 'hire+rol_sdr@in.staplehire.com',
        total_received: 47,
        surfaced: 6,
        auto_archived: 41,
        fit_threshold: 7.5,
        messages: [
          { id: 'msg_pn', name: 'Priya Nair', score: 8.6, resume_parsed: true, surfaced: true },
          { id: 'msg_mc', name: 'Maya Chen', score: 8.9, resume_parsed: true, surfaced: true },
          { id: 'msg_jl', name: 'Jordan Lee', score: 8.2, resume_parsed: true, surfaced: true },
        ],
      },
      null,
      2,
    ),
    previewTitle: 'inbox — senior-sdr',
    preview: <InboxPreview />,
    commands: (
      <>
        <TerminalLine>
          <span className="text-[#7ec8ff]">staplehire roles list</span>
          <span className="text-white/70"> --json</span>
        </TerminalLine>
        <TerminalLine>
          <span className="text-[#7ec8ff]">staplehire inbox messages</span>
          <span className="text-white/70"> rol_sdr_solar_01 --json</span>
        </TerminalLine>
        <TerminalLine>
          <span className="text-[#7ec8ff]">staplehire inbox triage</span>
          <span className="text-white/70"> rol_sdr_solar_01 --surface-above 7.5</span>
        </TerminalLine>
      </>
    ),
  },
  {
    id: 'investigate' as const,
    label: 'Investigate',
    icon: Search,
    summary: 'Enrich and screen before you interview. Pull JD match signals and evidence into JSON.',
    headline: 'Research before the interview.',
    subhead: 'Enrich, research, and pull screening signals — same UI as the app.',
    footer: '— ENRICH · RESEARCH · SCREEN —',
    rootLabel: 'screening',
    json: JSON.stringify(
      {
        candidate_id: 'cand_mc',
        name: 'Maya Chen',
        score: 8.9,
        fit: 'strong',
        enriched: true,
        found_across: ['linkedin', 'github', 'portfolio'],
        timeline_roles: 3,
      },
      null,
      2,
    ),
    previewTitle: 'candidate — maya-chen',
    preview: <InvestigatePreview />,
    commands: (
      <>
        <TerminalLine>
          <span className="text-[#7ec8ff]">staplehire candidates enrich</span>
          <span className="text-white/70"> cand_mc</span>
        </TerminalLine>
        <TerminalLine>
          <span className="text-[#7ec8ff]">staplehire candidates research</span>
          <span className="text-white/70"> cand_mc</span>
        </TerminalLine>
        <TerminalLine>
          <span className="text-[#7ec8ff]">staplehire candidates screening-result</span>
          <span className="text-white/70"> cand_mc --json</span>
        </TerminalLine>
      </>
    ),
  },
  {
    id: 'interview' as const,
    label: 'Interview',
    icon: Mic,
    summary: 'Send interview designs and list completed sessions — same flow as the dashboard.',
    headline: 'The agent runs the screen.',
    subhead: 'Design the round, send the invite, read the session JSON.',
    footer: '— DESIGN · INVITE · SESSION —',
    rootLabel: 'session',
    json: JSON.stringify(
      {
        session_id: 'sess_lisa_01',
        candidate_name: 'Lisa',
        role: 'Senior SDR',
        status: 'in_progress',
        agent_state: 'listening',
      },
      null,
      2,
    ),
    previewTitle: 'interview — live',
    preview: <InterviewPreview />,
    commands: (
      <>
        <TerminalLine>
          <span className="text-[#7ec8ff]">staplehire designs create</span>
          <span className="text-white/70"> {'<roleId>'} --brief &quot;SDR screen&quot;</span>
        </TerminalLine>
        <TerminalLine>
          <span className="text-[#7ec8ff]">staplehire candidates send-interview</span>
          <span className="text-white/70"> cand_lisa --design dsg_01</span>
        </TerminalLine>
        <TerminalLine>
          <span className="text-[#7ec8ff]">staplehire sessions list</span>
          <span className="text-white/70"> {'<roleId>'} --json</span>
        </TerminalLine>
      </>
    ),
  },
  {
    id: 'hire' as const,
    label: 'Hire',
    icon: UserCheck,
    summary: 'Move stages and send agent mail without leaving the terminal.',
    headline: 'Agent mail from the terminal.',
    subhead: 'Preview outreach, send branded email, confirm in JSON.',
    footer: '— PREVIEW · SEND · PIPELINE —',
    rootLabel: 'outreach',
    json: JSON.stringify(
      {
        candidate_id: 'cand_mc',
        to: 'maya.chen@launchdarkly.com',
        template: 'candidate_message',
        subject: 'Quick intro about the SDR role',
        sent: true,
      },
      null,
      2,
    ),
    previewTitle: 'agent mail — preview',
    preview: <HireEmailPreview />,
    commands: (
      <>
        <TerminalLine>
          <span className="text-[#7ec8ff]">staplehire candidates send-email</span>
          <span className="text-white/70"> cand_mc \</span>
        </TerminalLine>
        <p className="pl-4 text-white/70">
          --subject &quot;Staplehire&quot; \<br />
          --title &quot;Quick intro&quot; \<br />
          --body @message.md
        </p>
      </>
    ),
  },
];

export default function AgentPipelineShowcase() {
  const [pipeline, setPipeline] = useState<PipelineId>('source');
  const active = PIPELINE.find((p) => p.id === pipeline)!;
  const ActiveIcon = active.icon;

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] dark:border-white/10 dark:shadow-none">
      <div className="flex min-h-[640px] flex-col lg:flex-row">
        {/* Left: context.dev feature list */}
        <aside className="border-b border-foreground/10 bg-[var(--primitive-zircon)] px-3 py-4 sm:px-4 sm:py-5 lg:w-[min(100%,340px)] lg:shrink-0 lg:border-b-0 lg:border-r dark:border-white/10 dark:bg-muted/20 xl:w-[360px]">
          <ul className="flex flex-col gap-1.5 lg:gap-2">
            {PIPELINE.map((step) => {
              const Icon = step.icon;
              const isActive = pipeline === step.id;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setPipeline(step.id);
                      trackPageEvent('cli_pipeline_tab', { step: step.id });
                    }}
                    className={cn(
                      'flex w-full gap-3 rounded-xl px-3.5 py-3 text-left transition-all sm:px-4 sm:py-3.5',
                      isActive
                        ? 'border border-foreground/10 bg-card shadow-[0_4px_20px_-6px_rgba(0,0,0,0.12)] dark:border-white/12 dark:bg-card dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]'
                        : 'border border-transparent hover:bg-foreground/[0.03] dark:hover:bg-white/[0.04]',
                    )}
                  >
                    <Icon
                      className={cn(
                        'mt-0.5 size-[18px] shrink-0 stroke-[1.5]',
                        isActive ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'text-[15px] font-medium leading-snug sm:text-base',
                          isActive ? 'text-foreground' : 'text-foreground/80',
                        )}
                      >
                        {step.label}
                      </p>
                      <p
                        className={cn(
                          'para-sm mt-1 leading-relaxed',
                          isActive ? 'text-muted-foreground' : 'text-muted-foreground/80',
                        )}
                      >
                        {step.summary}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Right: textured stage + floating demo */}
        <div className="relative flex min-h-[480px] min-w-0 flex-1 flex-col lg:min-h-0">
          <div
            className="pointer-events-none absolute inset-0 bg-[#1a1412]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.55] mix-blend-soft-light dark:opacity-40"
            style={{
              backgroundImage: `radial-gradient(ellipse 90% 70% at 75% 25%, rgba(255, 103, 1, 0.22), transparent 55%),
                radial-gradient(ellipse 70% 60% at 15% 85%, rgba(85, 171, 237, 0.12), transparent 50%),
                radial-gradient(ellipse 50% 40% at 50% 50%, rgba(181, 150, 229, 0.08), transparent 60%)`,
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
            aria-hidden
          />

          <div className="relative flex min-h-0 flex-1 flex-col p-4 sm:p-6 lg:p-8">
            <div className="mb-4 flex shrink-0 items-center justify-between gap-3 sm:mb-5">
              <div className="flex min-w-0 items-center gap-2.5 text-white">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10">
                  <ActiveIcon className="size-4 stroke-[1.5]" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-medium sm:text-lg">{active.label}</p>
                  <p className="truncate para-sm text-white/50">{active.headline}</p>
                </div>
              </div>
              <span className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 para-sm font-medium text-white/70 sm:inline-flex">
                <Terminal className="size-3.5" />
                staplehire CLI
              </span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-background shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)] dark:bg-card">
              <PipelineShowcaseFlow
                embedded
                headline={active.headline}
                subhead={active.subhead}
                footer={active.footer}
                commands={active.commands}
                rootLabel={active.rootLabel}
                json={active.json}
                preview={active.preview}
                previewTitle={active.previewTitle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
