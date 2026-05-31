import { motion, useInView, type Variants } from 'framer-motion';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: 'blur(6px)' },
  visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -48, filter: 'blur(6px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 48, filter: 'blur(6px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
};

const PRESETS = { fadeUp, fadeIn, scaleIn, slideLeft, slideRight } as const;

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Returns true if the element is within ~one screen of the initial viewport
 * at mount time. This is a safety net for a known IntersectionObserver edge
 * case where elements that start exactly at the fold (or just below) never
 * trigger `whileInView` until the user scrolls — leaving them stuck at the
 * `hidden` variant (opacity 0) on first paint.
 */
function useRevealOnMount(ref: React.RefObject<HTMLElement | null>) {
  const [revealOnMount, setRevealOnMount] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    // Reveal anything in or within ~one screen below the initial viewport.
    // Elements further down still animate on scroll via IntersectionObserver.
    if (rect.top < window.innerHeight + 200) {
      setRevealOnMount(true);
    }
  }, [ref]);

  return revealOnMount;
}

interface ScrollRevealProps {
  children: ReactNode;
  preset?: keyof typeof PRESETS;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

export default function ScrollReveal({
  children,
  preset = 'fadeUp',
  delay = 0,
  duration = 0.85,
  className,
  once = true,
  amount = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });
  const revealOnMount = useRevealOnMount(ref);
  const isVisible = revealOnMount || inView;

  return (
    <motion.div
      ref={ref}
      variants={PRESETS[preset]}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — children must use StaggerItem (or their own variants). */
export function StaggerContainer({
  children,
  className,
  stagger = 0.12,
  delayChildren = 0,
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const revealOnMount = useRevealOnMount(ref);
  const isVisible = revealOnMount || inView;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  preset = 'fadeUp',
}: {
  children: ReactNode;
  className?: string;
  preset?: keyof typeof PRESETS;
}) {
  return (
    <motion.div
      variants={PRESETS[preset]}
      transition={{ duration: 0.7, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
