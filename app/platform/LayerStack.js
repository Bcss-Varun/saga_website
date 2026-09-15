'use client';

import { useEffect, useRef } from 'react';

/* The sticky stack on /platform's intelligence layers.

   `position: sticky` alone pins the cards, but it cannot say *how covered* a
   pinned card is, and without that the run reads as five panels sliding over
   each other rather than as a pile. This writes a 0→1 `--cover` on every card
   from how far the next card has risen over it; the stylesheet uses it to sink
   the card behind a scrim and scale it down towards its own pinned edge, so a
   covered card reads as one that has gone into the pile.

   It follows the pattern the pillars on Home already use, minus the parts this
   section does not need:

   · no measurement of document offsets, so no ResizeObserver on the body. The
     value is read from live bounding rects on the frame it is used, which
     cannot go stale when something above changes height;
   · one rAF-coalesced scroll handler for the whole stack, not one per card;
   · it stops when the section is off screen, so scrolling the rest of the page
     costs nothing.

   Reduced motion gets no scrim at all: every card is then simply itself, which
   is the honest static state — not a frozen half-covered one. */
export default function LayerStack({ children, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const cards = [...root.children];
    if (cards.length < 2) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stacked = window.matchMedia('(min-width: 961px)');
    const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

    let raf = 0;
    let onScreen = true;

    const clear = () => cards.forEach((c) => c.style.setProperty('--cover', '0'));

    const paint = () => {
      raf = 0;
      if (!stacked.matches || reduced.matches) return;

      for (let i = 0; i < cards.length - 1; i++) {
        const me = cards[i].getBoundingClientRect();
        const next = cards[i + 1].getBoundingClientRect();
        /* 0 when the next card is a full card-height below this one, 1 once
           its top has reached this one's top and the cover is complete. */
        const raw = clamp(1 - (next.top - me.top) / Math.max(me.height, 1));
        /* Eased, not linear. Linear spends most of the travel barely changing
           and then finishes in a rush; this darkens and recedes early, which
           is when the reader can still see it happening. */
        const cover = 1 - (1 - raw) ** 1.7;
        cards[i].style.setProperty('--cover', cover.toFixed(3));
      }
      /* The last card is never covered by anything. */
      cards[cards.length - 1].style.setProperty('--cover', '0');
    };

    const request = () => {
      if (!raf && onScreen) raf = requestAnimationFrame(paint);
    };

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0].isIntersecting;
        if (onScreen) request();
      },
      { rootMargin: '120px' }
    );
    io.observe(root);

    const onChange = () => {
      clear();
      request();
    };

    paint();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });
    reduced.addEventListener('change', onChange);
    stacked.addEventListener('change', onChange);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      reduced.removeEventListener('change', onChange);
      stacked.removeEventListener('change', onChange);
    };
  }, []);

  return (
    <ol className={className} ref={ref}>
      {children}
    </ol>
  );
}
