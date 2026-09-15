'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from './blocks';
import styles from './investigation.module.css';

/* The tool explorer on /investigation: three category tabs over a card track.

   Built 2026-09-10 to a supplied reference, on the client's repeated
   instruction. It is a tab strip and a carousel, and CLAUDE.md's bento note
   rules out both — a tab strip hides three quarters of a section in a
   screenshot and a carousel hides the cards past the fold, which is the
   opposite of the static-frame criterion. That objection was raised and
   overruled; this records it rather than relitigating it.

   Three things keep the damage contained, and none of them should be removed
   without replacing it:

   · every card of every category is in the exported HTML, so nothing exists
     only inside an interaction — an inactive panel is `hidden`, not unbuilt;
   · a `<noscript>` block in the page reveals all three panels, so a reader
     without JavaScript gets the whole catalogue as a plain stack rather than
     one category;
   · the track is a real scroll container holding all its cards, so a card
     past the fold is still reachable by keyboard tabbing and by a trackpad
     swipe, not only by the arrow buttons.

   Tabs follow the ARIA tabs pattern: one stop in the page tab order, arrow
   keys move between tabs, Home and End jump to the ends. */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/* One category's cards. The track shows four at a time above 1080px and
   scrolls to the rest; when everything already fits, the controls are not
   drawn at all rather than drawn inert. */
function Track({ items, name, active }) {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  /* The last position the track can actually reach, not the last card: with
     four cards visible, a seven-card track stops scrolling at card four. A
     dot or an arrow for a position the track cannot reach is a control that
     does nothing, so the count is derived from the geometry. */
  const [maxIndex, setMaxIndex] = useState(0);
  const [overflow, setOverflow] = useState(false);
  const reduced = useReducedMotion();

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setOverflow(el.scrollWidth - el.clientWidth > 4);
    const first = el.firstElementChild;
    if (!first) return;
    const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || 0);
    if (step <= 0) return;
    setIndex(Math.round(el.scrollLeft / step));
    setMaxIndex(Math.max(0, Math.round((el.scrollWidth - el.clientWidth) / step)));
  }, []);

  /* Re-measured when the panel becomes visible: a `hidden` element reports
     zero for both widths, so a measurement taken while it was inactive would
     say "no overflow" for every category. */
  useEffect(() => {
    if (!active) return undefined;
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [active, measure]);

  const go = (n) => {
    const el = ref.current;
    const first = el?.firstElementChild;
    if (!el || !first) return;
    const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || 0);
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    el.scrollTo({
      left: Math.min(max, Math.max(0, n * step)),
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  return (
    <>
      <div className={styles.trackWrap}>
        {overflow && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            onClick={() => go(index - 1)}
            disabled={index <= 0}
            aria-label={`Previous ${name} tool`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M14.5 5.5 8 12l6.5 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <ol className={styles.track} ref={ref} onScroll={measure}>
          {/* No card carries a resting highlight. The reference draws one on
              the first card of each category; it was dropped on request, and
              the accent now belongs to hover and keyboard focus alone, which
              is the only state a reader can act on. */}
          {items.map((t) => (
            <li className={styles.tool} key={t.name}>
              <p className={styles.toolTop}>
                <span className={styles.toolIcon} aria-hidden="true">
                  <Icon name={t.icon} className={styles.toolIconSvg} />
                </span>
              </p>
              <h4 className={styles.toolName}>{t.name}</h4>
              <p className={styles.toolLead}>{t.lead}</p>
              <p className={styles.toolBody}>{t.body}</p>
              <p className={styles.toolCap}>
                <span className={styles.toolCapLabel}>Capability</span>
                <span className={styles.toolCapValue}>{t.capability}</span>
              </p>
            </li>
          ))}
        </ol>

        {overflow && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={() => go(index + 1)}
            disabled={index >= maxIndex}
            aria-label={`Next ${name} tool`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M9.5 5.5 16 12l-6.5 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {overflow && (
        <div className={styles.trackFoot}>
          <ul className={styles.dots}>
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <li key={items[i]?.name || i}>
                <button
                  type="button"
                  className={`${styles.dot} ${i === index ? styles.dotOn : ''}`}
                  onClick={() => go(i)}
                  aria-label={`Show ${items[i]?.name || `position ${i + 1}`}`}
                  aria-current={i === index ? 'true' : undefined}
                />
              </li>
            ))}
          </ul>
          {/* Position, not a claim: the count is the number of dots drawn
              beside it, which is why the sweep's number rules do not reach it.
              Announced politely so a screen reader is not interrupted mid-card. */}
          <p className={styles.count} aria-live="polite">
            {String(index + 1).padStart(2, '0')} / {String(maxIndex + 1).padStart(2, '0')}
          </p>
        </div>
      )}
    </>
  );
}

export default function ToolExplorer({ categories }) {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);

  const onKey = (e) => {
    const n = categories.length;
    let next = null;
    if (e.key === 'ArrowRight') next = (active + 1) % n;
    else if (e.key === 'ArrowLeft') next = (active - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className={styles.explorer}>
      <div className={styles.tabs} role="tablist" aria-label="Tool categories" onKeyDown={onKey}>
        {categories.map((c, i) => (
          <button
            type="button"
            key={c.key}
            id={`tab-${c.key}`}
            role="tab"
            ref={(el) => {
              tabs.current[i] = el;
            }}
            className={`${styles.tab} ${i === active ? styles.tabOn : ''}`}
            aria-selected={i === active}
            aria-controls={`panel-${c.key}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            <span className={styles.tabIcon} aria-hidden="true">
              <Icon name={c.icon} className={styles.tabIconSvg} />
            </span>
            <span className={styles.tabText}>
              <span className={styles.tabName}>{c.name}</span>
              <span className={styles.tabDesc}>{c.descriptor}</span>
            </span>
          </button>
        ))}
      </div>

      {categories.map((c, i) => (
        <section
          key={c.key}
          id={`panel-${c.key}`}
          role="tabpanel"
          aria-labelledby={`tab-${c.key}`}
          className={styles.panel}
          data-panel=""
          hidden={i !== active}
        >
          <div className={styles.catHead}>
            <p className={styles.catKicker}>{c.name} tools</p>
            <h3 className={styles.catTitle}>{c.title}</h3>
            <p className={styles.catLead}>{c.lead}</p>
          </div>
          <Track items={c.items} name={c.name} active={i === active} />
        </section>
      ))}
    </div>
  );
}
