import { cn } from '@/lib/utils';

/** Max content width — vertical dotted guides align to this box */
export const DEV_GRID_MAX = 'max-w-[1160px]';

const guideColor =
  'border-foreground/[0.14] dark:border-foreground/[0.22]';

type DevGridShellProps = {
  children: React.ReactNode;
  className?: string;
};

/** Full-page vertical dotted margin guides (context.dev-style) */
export function DevGridShell({ children, className }: DevGridShellProps) {
  return (
    <div className={cn('relative min-h-screen bg-background', className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-0 flex justify-center"
      >
        <div className={cn('relative h-full w-full', DEV_GRID_MAX, 'mx-auto')}>
          <div
            className={cn(
              'absolute inset-y-0 left-0 w-px border-l border-dotted',
              guideColor,
            )}
          />
          <div
            className={cn(
              'absolute inset-y-0 right-0 w-px border-r border-dotted',
              guideColor,
            )}
          />
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

type DevGridContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Center content (hero/CTA). Default is flush left inside the guides. */
  centered?: boolean;
};

export function DevGridContainer({
  children,
  className,
  centered = false,
}: DevGridContainerProps) {
  return (
    <div
      className={cn(
        DEV_GRID_MAX,
        'mx-auto px-6 md:px-12',
        centered && 'text-center',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Horizontal dotted rule spanning between the vertical guides */
export function DevGridRule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn(DEV_GRID_MAX, 'mx-auto px-6 md:px-12', className)}>
      <div className={cn('border-t border-dotted', guideColor)} />
    </div>
  );
}
