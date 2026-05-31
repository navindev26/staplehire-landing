import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function AnimatedCounter({
  target,
  duration = 1.5,
  suffix = '',
  prefix = '',
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const steps = 60;
    const increment = target / steps;
    const stepDuration = (duration * 1000) / steps;
    let current = 0;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      // Ease-out: fast start, slow finish
      const progress = 1 - Math.pow(1 - frame / steps, 3);
      current = Math.round(progress * target);
      setCount(current);

      if (frame >= steps) {
        setCount(target);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
