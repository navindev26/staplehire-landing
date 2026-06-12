import { useReducedMotion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';

interface LandingVideoProps {
  /**
   * Asset base path without extension or theme suffix, e.g.
   * "/landing/sourcing-borderless". Resolves to `${base}.mp4` /
   * `${base}-dark.mp4` and matching `-poster.jpg` files.
   */
  base: string;
  alt: string;
  className?: string;
  /** Intrinsic dimensions of the source — required to reserve aspect ratio and avoid layout shift. */
  width: number;
  height: number;
  eager?: boolean;
}

export function LandingVideo({
  base,
  alt,
  className,
  width,
  height,
  eager = false,
}: LandingVideoProps) {
  const { isDark } = useTheme();
  const reduceMotion = useReducedMotion();
  const suffix = isDark ? '-dark' : '';
  const mp4 = `${base}${suffix}.mp4`;
  const poster = `${base}${suffix}-poster.jpg`;

  // Honor prefers-reduced-motion: show the final-frame poster instead of an
  // autoplaying loop. The poster carries the same information as the video.
  if (reduceMotion) {
    return (
      <img
        src={poster}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }

  return (
    <video
      // Remount on theme change so the new source loads and autoplays.
      key={mp4}
      className={className}
      width={width}
      height={height}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload={eager ? 'auto' : 'metadata'}
      aria-label={alt}
    >
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
