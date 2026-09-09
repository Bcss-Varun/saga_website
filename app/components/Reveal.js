'use client';

import { useEffect } from 'react';

/* The `.rv` / `.cv` scroll reveals from Saga.html.

   Progressive enhancement, unlike the original. The stylesheet hides `.rv`
   with `opacity: 0` until JavaScript adds `.in`, which means a script failure
   left the page blank — unacceptable on a site that gets opened on locked-down
   government desktops. So the hidden state is now gated behind `.js-reveal` on
   <html>, set here at runtime. No JavaScript, no hiding: the content is simply
   visible, which is the correct fallback and matches what a reduced-motion
   visitor already saw.

   `.rv` fires once and unobserves. `.cv` toggles on every entry and exit —
   that difference is from the original and is preserved.

   Re-scans on route change, since the observed nodes belong to the pages. */
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined; // stylesheet already shows everything

    root.classList.add('js-reveal');

    const once = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); once.unobserve(e.target); }
      }),
      { threshold: 0.15 }
    );
    const repeat = new IntersectionObserver(
      (es) => es.forEach((e) => e.target.classList.toggle('in', e.isIntersecting)),
      { threshold: 0.15 }
    );

    /* Observed nodes are tracked so that ones removed by a route change can be
       released. Without this the repeating `.cv` observer keeps every element
       it has ever seen — and because this component lives in the layout and
       never unmounts, those detached nodes would accumulate for the whole
       session. `.rv` unobserves itself on reveal; `.cv` never does. */
    const seen = new Set();
    let raf = 0;
    const scan = () => {
      for (const el of seen) {
        if (!el.isConnected) {
          once.unobserve(el);
          repeat.unobserve(el);
          seen.delete(el);
        }
      }
      document.querySelectorAll('.rv:not(.in)').forEach((el) => {
        if (seen.has(el)) return;
        once.observe(el);
        seen.add(el);
      });
      document.querySelectorAll('.cv').forEach((el) => {
        if (seen.has(el)) return;
        repeat.observe(el);
        seen.add(el);
      });
    };
    scan();

    /* Pages mount their content after this effect on a client navigation, so
       re-scan when the DOM changes rather than only at mount. */
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      once.disconnect();
      repeat.disconnect();
      seen.clear();
      root.classList.remove('js-reveal');
    };
  }, []);

  return null;
}
