import type { ReactNode } from 'react';
import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

function TrafficLights() {
  return (
    <div className="flex gap-1.5" aria-hidden>
      <span className="size-2.5 rounded-full bg-[#FF5F57]" />
      <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
      <span className="size-2.5 rounded-full bg-[#28C840]" />
    </div>
  );
}

export function MacTerminal({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-[#1a1a1a]/12 bg-[#2b2b2b] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)]',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-3.5 py-2.5">
        <TrafficLights />
        {title && <span className="font-mono text-xs text-white/45">{title}</span>}
      </div>
      <div className="p-4 font-mono text-[13px] leading-[1.65] text-[#f5f5f0] sm:text-sm">{children}</div>
    </div>
  );
}

export function MacPanel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#1a1a1a]/10 bg-white shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)]',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-[#1a1a1a]/8 bg-[#FAFAFA] px-3.5 py-2.5">
        <TrafficLights />
        {title && <span className="font-mono text-xs text-[#888]">{title}</span>}
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}

function TerminalLine({ prompt = '$', children }: { prompt?: string; children: ReactNode }) {
  return (
    <p className="whitespace-pre-wrap break-all">
      <span className="text-white/35">{prompt} </span>
      {children}
    </p>
  );
}

function jsonToTreeLines(value: unknown, prefix = '', isLast = true, key?: string): string[] {
  const lines: string[] = [];
  const branch = isLast ? '└── ' : '├── ';
  const childPrefix = prefix + (isLast ? '    ' : '│   ');

  if (key !== undefined) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      lines.push(`${prefix}${branch}${key}/`);
      const entries = Object.entries(value as Record<string, unknown>);
      entries.forEach(([k, v], i) => {
        lines.push(...jsonToTreeLines(v, childPrefix, i === entries.length - 1, k));
      });
    } else if (Array.isArray(value)) {
      lines.push(`${prefix}${branch}${key}/`);
      value.forEach((item, i) => {
        lines.push(...jsonToTreeLines(item, childPrefix, i === value.length - 1, `[${i}]`));
      });
    } else {
      lines.push(`${prefix}${branch}${key}: ${formatPrimitive(value)}`);
    }
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => {
      lines.push(...jsonToTreeLines(item, prefix, i === value.length - 1, `[${i}]`));
    });
  } else if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    entries.forEach(([k, v], i) => {
      lines.push(...jsonToTreeLines(v, prefix, i === entries.length - 1, k));
    });
  }

  return lines;
}

function formatPrimitive(v: unknown): string {
  if (typeof v === 'string') return `"${v.length > 48 ? `${v.slice(0, 45)}…` : v}"`;
  return String(v);
}

export function JsonTreeOutput({ rootLabel, json }: { rootLabel: string; json: string }) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    parsed = { error: 'Invalid JSON' };
  }
  const lines = [`${rootLabel}/`, ...jsonToTreeLines(parsed, '', true)];

  return (
    <pre className="p-4 font-mono text-xs leading-[1.7] text-foreground/90 sm:text-[13px]">
      {lines.join('\n')}
    </pre>
  );
}

type ShowcaseFlowProps = {
  headline: string;
  subhead: string;
  footer?: string;
  commands: ReactNode;
  rootLabel: string;
  json: string;
  preview: ReactNode;
  previewTitle?: string;
  /** Inside context.dev-style dark pane — hides duplicate section headline */
  embedded?: boolean;
};

export default function PipelineShowcaseFlow({
  headline,
  subhead,
  footer,
  commands,
  rootLabel,
  json,
  preview,
  previewTitle = 'staplehire — app',
  embedded = false,
}: ShowcaseFlowProps) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col',
        embedded ? 'px-4 py-4 sm:px-5 sm:py-5' : 'bg-background px-5 py-8 sm:px-8 sm:py-10 md:px-10',
      )}
    >
      {!embedded && (
        <header className="text-center">
          <h3 className="typography-h2 text-balance text-foreground">{headline}</h3>
          <p className="para-lg mx-auto mt-3 max-w-lg text-muted-foreground">{subhead}</p>
        </header>
      )}

      <div
        className={cn(
          'flex flex-col gap-4 sm:gap-5',
          !embedded && 'mt-8 lg:mt-10',
          'lg:grid lg:min-h-[440px] lg:grid-cols-[minmax(0,44%)_minmax(0,56%)] lg:grid-rows-[auto_1fr] lg:items-stretch lg:gap-x-5 lg:gap-y-4',
          embedded && 'lg:min-h-[400px]',
        )}
      >
        <MacTerminal title="zsh — staplehire" className="order-1 shrink-0 lg:col-start-1 lg:row-start-1">
          {commands}
        </MacTerminal>

        <MacPanel
          title={previewTitle}
          className="order-2 flex min-h-[280px] flex-col sm:min-h-[320px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-full lg:min-h-0"
        >
          <div className="flex min-h-0 flex-1 flex-col">{preview}</div>
        </MacPanel>

        <MacPanel
          title="stdout · json"
          className="order-3 min-h-[160px] lg:col-start-1 lg:row-start-2 lg:h-full lg:min-h-0"
        >
          <JsonTreeOutput rootLabel={rootLabel} json={json} />
        </MacPanel>
      </div>

      {footer && (
        <p
          className={cn(
            'caption text-center font-mono uppercase tracking-[0.2em] text-muted-foreground',
            embedded ? 'mt-4' : 'mt-8',
          )}
        >
          {footer}
        </p>
      )}
    </div>
  );
}

export { TerminalLine };
