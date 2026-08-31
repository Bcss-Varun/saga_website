'use client';
/**
 * ScrubSequence — plays a baked SAGA sequence against scroll position.
 *
 * This is the production replacement for the live narrative scenes. It obeys
 * the rules in the brand system §6.4 and §6.7:
 *   · draws to a 2D canvas, never the DOM, so nothing layouts per frame
 *   · decodes to ImageBitmap once, then only ever draws
 *   · progressive load — every 6th frame first, so the section is usable early
 *   · reduced motion renders the final frame and stops
 *   · lazy — nothing is fetched until the section is one viewport away
 *
 *   <ScrubSequence name="observe" frames={96} className="..." />
 */
import { useEffect, useRef } from 'react';

type Props = {
  name: string;
  frames?: number;
  width?: number;
  height?: number;
  /** where the sequence files live; {n} is replaced with a 4-digit index */
  pattern?: string;
  className?: string;
  /** how far into the section the sequence starts/ends, 0–1 */
  range?: [number, number];
};

export default function ScrubSequence({
  name,
  frames = 96,
  width = 1600,
  height = 900,
  pattern = '/frames/{name}/{n}.webp',
  className,
  range = [0, 1],
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current, canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bitmaps: (ImageBitmap | undefined)[] = new Array(frames);
    let current = -1, raf = 0, alive = true;

    const url = (i: number) =>
      pattern.replace('{name}', name).replace('{n}', String(i + 1).padStart(4, '0'));

    async function load(i: number) {
      if (!alive || bitmaps[i]) return;
      try {
        const res = await fetch(url(i));
        if (!res.ok) return;
        bitmaps[i] = await createImageBitmap(await res.blob());
      } catch { /* a dropped frame is survivable — we fall back to the nearest */ }
    }

    /** nearest already-decoded frame, so early scrolling never shows a gap */
    function nearest(i: number) {
      if (bitmaps[i]) return bitmaps[i];
      for (let d = 1; d < frames; d++) {
        if (bitmaps[i - d]) return bitmaps[i - d];
        if (bitmaps[i + d]) return bitmaps[i + d];
      }
      return undefined;
    }

    function fit() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const r = host.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      current = -1;
    }

    function draw(i: number) {
      const bmp = nearest(i);
      if (!bmp) return;
      const cw = canvas.width, ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);
      // cover-fit, centred
      const scale = Math.max(cw / width, ch / height);
      const w = width * scale, h = height * scale;
      ctx.drawImage(bmp, (cw - w) / 2, (ch - h) / 2, w, h);
    }

    function progress() {
      const r = host.getBoundingClientRect();
      const span = r.height - innerHeight;
      const raw = span > 4 ? -r.top / span : (innerHeight * 0.75 - r.top) / (r.height || 1);
      const [a, b] = range;
      return Math.min(1, Math.max(0, (Math.min(1, Math.max(0, raw)) - a) / (b - a)));
    }

    function tick() {
      raf = 0;
      const i = Math.min(frames - 1, Math.max(0, Math.round(progress() * (frames - 1))));
      if (i !== current) { current = i; draw(i); }
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };

    async function start() {
      fit();
      if (reduced) {                       // one frame, no listeners, no loop
        await load(frames - 1);
        draw(frames - 1);
        return;
      }
      // progressive: a coarse pass first so the section is scrubbable immediately
      for (let i = 0; i < frames; i += 6) await load(i);
      tick();
      for (let i = 0; i < frames; i++) if (i % 6) { await load(i); }
      current = -1; tick();
      addEventListener('scroll', schedule, { passive: true });
      addEventListener('resize', () => { fit(); schedule(); });
    }

    // don't fetch ~1 MB until the section is genuinely close
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { io.disconnect(); start(); } },
      { rootMargin: '100% 0px' }
    );
    io.observe(host);

    return () => {
      alive = false;
      io.disconnect();
      removeEventListener('scroll', schedule);
      if (raf) cancelAnimationFrame(raf);
      bitmaps.forEach((b) => b?.close());
    };
  }, [name, frames, width, height, pattern, range[0], range[1]]);

  return (
    <div ref={hostRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
