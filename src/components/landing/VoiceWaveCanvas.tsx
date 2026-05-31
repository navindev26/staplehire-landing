import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/** Brand hustle blues only (DESIGN.md — links / info) */
const HUSTLE = '#55ABED';
const HUSTLE_LIGHT = '#7AC2F5';

const CONFIG = {
  count: 1100,
  /** Wave draw amplitude scale (includes +14% size pass vs historical 1.12) */
  intensity: 1.277,
  speed: 0.15,
  /** Lower = more visible dots toward the left/right edges (needed on full-bleed wide canvas) */
  widthExp: 0.2,
  /** Max device pixel ratio for crisp dots on retina without melting low-end GPUs */
  maxDpr: 2.75,
  /** Cursor repulsion: radius in CSS px where influence fades to zero */
  repelRadius: 168,
  /** Max push distance in CSS px at cursor center */
  repelMaxPx: 26,
};

function rng(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type VoiceWaveCanvasProps = {
  fullBleed?: boolean;
  className?: string;
};

export default function VoiceWaveCanvas({ fullBleed = false, className }: VoiceWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const rand = rng(42);
    const blues = [HUSTLE, HUSTLE_LIGHT];
    const particles: {
      x: number;
      offset: number;
      size: number;
      speedMul: number;
      alpha: number;
      color: string;
      /** Slight phase split so secondary wave does not look synced */
      phase2: number;
    }[] = [];

    for (let i = 0; i < CONFIG.count; i++) {
      particles.push({
        x: rand(),
        offset: (rand() - 0.5) * 2,
        size: 1.0 + rand() * 2.2,
        speedMul: 0.5 + rand() * 0.9,
        alpha: 0.5 + rand() * 0.48,
        color: blues[rand() < 0.55 ? 0 : 1],
        phase2: rand() * Math.PI * 2,
      });
    }

    let wCss = 0;
    let hCss = 0;
    let raf = 0;
    let timeSec = 0;
    let lastFrameMs = performance.now();

    /** Pointer in canvas CSS coordinates; tracked via window so canvas can stay pointer-events-none */
    let targetPointer: { x: number; y: number } | null = null;
    let smoothMx = 0;
    let smoothMy = 0;
    let repelBlend = 0;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function repelOffset(px: number, py: number, mx: number, my: number) {
      const dx = px - mx;
      const dy = py - my;
      const distSq = dx * dx + dy * dy;
      const R = CONFIG.repelRadius;
      const R2 = R * R;
      if (distSq >= R2 || distSq < 1e-6) return { ox: 0, oy: 0 };
      const dist = Math.sqrt(distSq);
      const nx = dx / dist;
      const ny = dy / dist;
      const t = 1 - dist / R;
      const w = t * t * (3 - 2 * t);
      const push = CONFIG.repelMaxPx * w;
      return { ox: nx * push, oy: ny * push };
    }

    function updatePointerFromEvent(clientX: number, clientY: number) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x >= -2 && y >= -2 && x <= rect.width + 2 && y <= rect.height + 2) {
        targetPointer = { x, y };
      } else {
        targetPointer = null;
      }
    }

    function onPointerMove(ev: PointerEvent) {
      updatePointerFromEvent(ev.clientX, ev.clientY);
    }

    function onPointerDown(ev: PointerEvent) {
      updatePointerFromEvent(ev.clientX, ev.clientY);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
      const r = canvas.getBoundingClientRect();
      wCss = r.width;
      hCss = r.height;
      canvas.width = Math.max(1, Math.floor(wCss * dpr));
      canvas.height = Math.max(1, Math.floor(hCss * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    /** Smoother than raw pow envelope (fewer harsh pockets in the field) */
    function envelope(xNorm: number) {
      const s = Math.sin(xNorm * Math.PI);
      const e = Math.pow(Math.max(s, 0), CONFIG.widthExp);
      return e * e * (3 - 2 * e);
    }

    function waveY(
      xNorm: number,
      t: number,
      offset: number,
      phase2: number,
      amp: number,
      env: number,
      h: number,
      cy: number,
    ) {
      const flow = xNorm * 8 + t * CONFIG.speed * 0.72 + offset * 3;
      const primary = Math.sin(flow);
      const secondary = 0.34 * Math.sin(xNorm * 15 + t * CONFIG.speed * 1.05 + phase2);
      const tertiary = 0.12 * Math.sin(xNorm * 23 - t * CONFIG.speed * 0.4 + offset * 5);
      return cy + (primary + secondary + tertiary) * amp * env + offset * h * 0.038 * env;
    }

    function drawFrame(dt: number) {
      timeSec += dt;

      ctx.clearRect(0, 0, wCss, hCss);
      const cy = hCss / 2;
      const amp = hCss * 0.24 * CONFIG.intensity;

      const repelOk = !reducedMotion.matches;
      if (repelOk) {
        if (targetPointer !== null) {
          if (repelBlend < 0.02) {
            smoothMx = targetPointer.x;
            smoothMy = targetPointer.y;
          } else {
            const k = Math.min(1, dt * 18);
            smoothMx += (targetPointer.x - smoothMx) * k;
            smoothMy += (targetPointer.y - smoothMy) * k;
          }
          repelBlend = Math.min(1, repelBlend + dt * 5);
        } else {
          repelBlend = Math.max(0, repelBlend - dt * 3.5);
        }
      } else {
        repelBlend = 0;
        targetPointer = null;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const xNorm = (p.x + timeSec * 0.04 * p.speedMul * CONFIG.speed) % 1;
        let sx = xNorm * wCss;
        const env = envelope(xNorm);
        let y = waveY(xNorm, timeSec, p.offset, p.phase2, amp, env, hCss, cy);

        if (repelOk && repelBlend > 0.004) {
          const { ox, oy } = repelOffset(sx, y, smoothMx, smoothMy);
          sx += ox * repelBlend;
          y += oy * repelBlend;
        }

        const radius = p.size * (0.6 + env * 0.8) * 1.14;
        const baseA = p.alpha * (0.38 + env * 0.62);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = baseA * 0.88;
        ctx.beginPath();
        ctx.arc(sx, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    }

    function tick(now: number) {
      const dt = Math.min(48, now - lastFrameMs) / 1000;
      lastFrameMs = now;
      drawFrame(dt);
      raf = requestAnimationFrame(tick);
    }

    if (reducedMotion.matches) {
      drawFrame(0);
    } else {
      lastFrameMs = performance.now();
      raf = requestAnimationFrame(tick);
    }

    const onMotionChange = () => {
      cancelAnimationFrame(raf);
      if (reducedMotion.matches) {
        drawFrame(0);
      } else {
        lastFrameMs = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    reducedMotion.addEventListener('change', onMotionChange);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      reducedMotion.removeEventListener('change', onMotionChange);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  /**
   * Shorter caps on narrow viewports so the band does not fight the GIF height.
   * Percent is relative to the positioned parent section (GIF + padding).
   */
  const bandHeight =
    'h-[min(240px,58%)] min-[390px]:h-[min(280px,62%)] md:h-[min(380px,72%)] lg:h-[min(479px,82%)]';

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'pointer-events-none absolute z-0',
        bandHeight,
        fullBleed
          ? 'left-1/2 top-[58%] w-[100dvw] -translate-x-1/2 -translate-y-1/2 md:top-1/2'
          : 'left-0 right-0 top-[58%] w-full max-w-full -translate-y-1/2 md:top-1/2',
        className,
      )}
      aria-hidden
    />
  );
}
