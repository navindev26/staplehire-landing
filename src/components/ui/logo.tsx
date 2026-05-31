import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'footer'
  showText?: boolean
}

const sizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  /** Landing footer; 0.9× prior 22px lockup (~10% smaller than previous footer) */
  footer: 'w-[19.8px] h-[19.8px]',
}

const textSizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-[32px]',
  footer: 'text-[19.8px]',
}

const gaps = {
  sm: 'gap-3',
  md: 'gap-3',
  lg: 'gap-3',
  footer: 'gap-[9px]',
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  return (
    <div
      className={cn(
        'flex items-center',
        gaps[size],
        className
      )}
    >
      <svg 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizes[size], 'flex-shrink-0')}
      >
        <path 
          d="M0 29.127L0.00588035 23.8094L13.1749 25.2032L0.0268291 18.4099L0.0180086 12.5458L14.9659 20.0022L0 3.75454V0.00577566L3.80459 0.0350149L19.7253 15.2835L12.7317 0.0407906L18.6929 0L25.3384 12.9404L24.2201 0.0115513L29.634 0.0202148C29.634 0.0202148 31.9932 4.53425 31.9932 15.3069C31.9932 26.0796 26.7218 31.9932 15.766 31.9932C4.81013 31.9932 0 29.127 0 29.127Z" 
          fill="currentColor"
        />
      </svg>
      {showText && (
        <span 
          className={cn(
            'font-semibold tracking-[-0.02em] font-outfit',
            textSizes[size]
          )}
        >
          Staplehire
        </span>
      )}
    </div>
  )
}

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-8 h-8', className)}
    >
      <path 
        d="M0 29.127L0.00588035 23.8094L13.1749 25.2032L0.0268291 18.4099L0.0180086 12.5458L14.9659 20.0022L0 3.75454V0.00577566L3.80459 0.0350149L19.7253 15.2835L12.7317 0.0407906L18.6929 0L25.3384 12.9404L24.2201 0.0115513L29.634 0.0202148C29.634 0.0202148 31.9932 4.53425 31.9932 15.3069C31.9932 26.0796 26.7218 31.9932 15.766 31.9932C4.81013 31.9932 0 29.127 0 29.127Z" 
        fill="currentColor"
      />
    </svg>
  )
}
