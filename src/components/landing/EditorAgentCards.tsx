import { cn } from '@/lib/utils';

type EditorCard = {
  id: string;
  name: string;
  by: string;
  description: string;
  logo: string;
  logoClassName?: string;
  statA: { label: string; value: string };
  statB: { label: string; value: string };
  badge?: string;
};

const EDITORS: EditorCard[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    by: 'Anysphere',
    description: 'Install Staplehire skills and run hiring commands from the agent sidebar.',
    logo: '/landing/editors/cursor.png',
    statA: { label: 'Skills', value: 'install' },
    statB: { label: 'Output', value: 'JSON' },
    badge: 'Popular',
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    by: 'Anthropic',
    description: 'Discover the command tree and pipe candidate data into your Claude workflow.',
    logo: '/landing/editors/claude-code.ico',
    statA: { label: 'Discovery', value: 'commands' },
    statB: { label: 'Auth', value: 'login' },
  },
  {
    id: 'codex',
    name: 'OpenAI Codex',
    by: 'OpenAI',
    description: 'Source, screen, and move candidates from Codex with the same CLI your app uses.',
    logo: '/landing/editors/openai.svg',
    logoClassName: 'size-8',
    statA: { label: 'CLI', value: 'staplehire' },
    statB: { label: 'Output', value: 'JSON' },
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    by: 'OpenClaw',
    description: 'Personal assistant on any channel — hire from Telegram, Discord, or the gateway.',
    logo: '/landing/editors/openclaw.png',
    logoClassName: 'size-9',
    statA: { label: 'Skills', value: 'install' },
    statB: { label: 'Channels', value: '5+' },
  },
  {
    id: 'hermes',
    name: 'Hermes Agent',
    by: 'Nous Research',
    description: 'Persistent memory and auto-built skills for long-running hiring workflows.',
    logo: '/landing/editors/hermes-org.png',
    statA: { label: 'Memory', value: 'SQLite' },
    statB: { label: 'Skills', value: '40+' },
  },
  {
    id: 'pi',
    name: 'Pi',
    by: 'Mario Zechner',
    description: 'Minimal terminal coding harness — extend with skills and run Staplehire in the TUI.',
    logo: '/landing/editors/pi.svg',
    logoClassName: 'size-8',
    statA: { label: 'Harness', value: 'terminal' },
    statB: { label: 'Packages', value: 'npm' },
  },
];

function EditorLogo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-border">
      <img
        src={src}
        alt={alt}
        className={cn('size-7 object-contain', className)}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          const el = e.currentTarget;
          el.style.display = 'none';
          const parent = el.parentElement;
          if (parent && !parent.querySelector('[data-fallback]')) {
            const span = document.createElement('span');
            span.dataset.fallback = 'true';
            span.className = 'text-xs font-medium text-foreground';
            span.textContent = alt.charAt(0);
            parent.appendChild(span);
          }
        }}
      />
    </div>
  );
}

function EditorCardItem({ editor }: { editor: EditorCard }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card text-foreground shadow-sm dark:border-white/10">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <EditorLogo src={editor.logo} alt={editor.name} className={editor.logoClassName} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="typography-h3 text-foreground">{editor.name}</h3>
              {editor.badge && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 caption font-medium text-primary">
                  {editor.badge}
                </span>
              )}
            </div>
            <p className="para-sm mt-1 text-muted-foreground">by {editor.by}</p>
          </div>
        </div>
        <p className="para-lg mt-4 text-muted-foreground">{editor.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-px border-t border-foreground/10 bg-border/50">
        <div className="bg-card px-4 py-3">
          <p className="para-sm text-muted-foreground">{editor.statA.label}</p>
          <p className="mt-1 font-mono text-base font-medium tabular-nums text-foreground">{editor.statA.value}</p>
        </div>
        <div className="bg-card px-4 py-3">
          <p className="para-sm text-muted-foreground">{editor.statB.label}</p>
          <p className="mt-1 font-mono text-base font-medium tabular-nums text-foreground">{editor.statB.value}</p>
        </div>
      </div>
    </article>
  );
}

export default function EditorAgentCards() {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {EDITORS.map((editor) => (
        <EditorCardItem key={editor.id} editor={editor} />
      ))}
    </div>
  );
}
