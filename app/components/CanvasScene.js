'use client';

import { useEffect, useRef, useState } from 'react';

/* ═══════════════════════════════════════════════════════════
<CanvasScene> — lifecycle for every per-page canvas.

This is NOT used by #stage. #stage is the layout singleton and is never torn
down on navigation (decision 1); this wrapper is for canvases that belong to a
page and must die with it. Do not unify the two.

The renderer passed in via `create` owns drawing only, and returns:
  { resize(), draw(t), destroy() }
`create` must be referentially stable — module scope or useCallback — or the
lifecycle rebuilds on every render.

What this component guarantees:
  · cancelAnimationFrame on unmount
  · the loop STOPS entirely off-screen and restarts on re-entry —
    not a flag flipped inside a still-running loop
  · DPR capped at 2, applied by the renderer's own resize()
  · resize debounced, with the pending timer cleared on unmount
  · under prefers-reduced-motion: exactly one frame, then nothing scheduled
  · observers disconnected, listeners removed, media query unsubscribed

Every teardown path is guarded by `dead`, because the dangerous window is the
one between mount and first frame: a navigation there can otherwise leave an
IntersectionObserver holding a detached canvas, or a debounce timer firing
into a unmounted component.
═══════════════════════════════════════════════════════════ */

/* Live-resource counters, used by tests/ to assert teardown against a real
   build rather than assume it.

   Compiled out of the shipped site: NEXT_PUBLIC_CANVAS_STATS is inlined by
   Next at build time, so with the flag unset this whole body is unreachable
   and the minifier drops it. Build the verification target with
   `NEXT_PUBLIC_CANVAS_STATS=1 npm run build`. */
const STATS = process.env.NEXT_PUBLIC_CANVAS_STATS === '1';

function bump(key, n) {
  if (!STATS) return;
  if (typeof window === 'undefined') return;
  window.__CANVAS_STATS__ = window.__CANVAS_STATS__ || {
    scenes: 0, observers: 0, timers: 0, listeners: 0, rafs: 0, frames: 0,
    lateTimerFires: 0,
  };
  window.__CANVAS_STATS__[key] += n;
}

export default function CanvasScene({
  create,
  className,
  canvasClassName,
  children,
  rootMargin = '140px',
  ...rest
}) {
  const hostRef = useRef(null);

  /* Held in state so that a change to the user's motion preference rebuilds
     the whole lifecycle below, rather than trying to patch a running one.

     Read synchronously on the first client render, NOT in an effect. Seeding
     this `false` and correcting it afterwards would mean a reduced-motion
     visitor still gets one pass of the animated lifecycle — an observer
     registered and a second frame drawn — before the correction lands.
     Nothing in the returned markup depends on this value, so the
     server-rendered `false` cannot cause a hydration mismatch. */
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let dead = false;
    let raf = 0;
    let running = false;
    let debounce = 0;
    let renderer = null;
    let io = null;

    /* ── the loop ─────────────────────────────────────────────── */
    const frame = (t) => {
      if (dead) return;
      bump('frames', 1);
      renderer.draw(t);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (dead || running || reduced) return;
      running = true;
      bump('rafs', 1);
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      bump('rafs', -1);
      cancelAnimationFrame(raf);
      raf = 0;
    };

    /* A single static frame. Not a frozen loop, and never a blank canvas. */
    const drawStatic = () => {
      if (dead || !renderer) return;
      bump('frames', 1);
      renderer.draw(0);
    };

    /* ── construction ─────────────────────────────────────────── */
    // The host may already be detached if this effect is running late.
    if (!host.isConnected) return undefined;

    renderer = create(host);
    if (dead || !renderer) return undefined;
    bump('scenes', 1);

    renderer.resize();
    drawStatic(); // something is on screen before the first rAF ever lands

    /* ── resize, debounced ────────────────────────────────────── */
    const onResize = () => {
      if (dead) return;
      if (debounce) {
        clearTimeout(debounce);
        bump('timers', -1);
      }
      bump('timers', 1);
      debounce = setTimeout(() => {
        debounce = 0;
        bump('timers', -1);
        if (dead || !host.isConnected) {
          /* Reaching here means the timer was never cleared: teardown missed
             it and it fired into a dead scene. The guard makes that harmless,
             but it is still a leak, so it is counted rather than swallowed. */
          bump('lateTimerFires', 1);
          return;
        }
        renderer.resize();
        // A resize clears the backing store, so repaint even while paused.
        if (!running) drawStatic();
      }, 140);
    };
    window.addEventListener('resize', onResize, { passive: true });
    bump('listeners', 1);

    /* ── off-screen: stop the loop, do not just idle it ───────── */
    if (reduced) {
      // Exactly one frame has been drawn above. Schedule nothing.
    } else {
      io = new IntersectionObserver(
        (entries) => {
          if (dead) return;
          if (entries[0].isIntersecting) start();
          else stop();
        },
        { rootMargin }
      );
      io.observe(host);
      bump('observers', 1);
    }

    /* ── teardown ─────────────────────────────────────────────── */
    return () => {
      dead = true;
      stop();
      if (debounce) {
        clearTimeout(debounce);
        debounce = 0;
        bump('timers', -1);
      }
      window.removeEventListener('resize', onResize);
      bump('listeners', -1);
      if (io) {
        io.disconnect(); // must not retain the detached host
        io = null;
        bump('observers', -1);
      }
      if (renderer) {
        renderer.destroy?.();
        renderer = null;
        bump('scenes', -1);
      }
    };
  }, [create, rootMargin, reduced]);

  return (
    <div ref={hostRef} className={className} {...rest}>
      <canvas className={canvasClassName} aria-hidden="true" />
      {children}
    </div>
  );
}
