'use client';

import { useCallback, useRef } from 'react';
import styles from './SectionNav.module.css';

/* In-page section jump bar.

   Reuses the roving-tabindex and arrow-key handling from the original
   `worlds` tab widget: one stop in the tab order, arrows move between the
   links, Home/End jump to the ends. `role="toolbar"` is the pattern that
   licenses roving tabindex on a group of links — without it, a screen-reader
   user would meet links that Tab appears to skip.

   The links are real anchors to real sections, so this degrades to ordinary
   in-page navigation with no JavaScript. */
export default function SectionNav({ sections, label = 'On this page' }) {
  const refs = useRef([]);

  const focusAt = useCallback((i) => {
    const items = refs.current.filter(Boolean);
    if (!items.length) return;
    const next = (i + items.length) % items.length;
    items.forEach((el, n) => {
      el.tabIndex = n === next ? 0 : -1;
    });
    items[next].focus();
  }, []);

  const onKeyDown = (e) => {
    const items = refs.current.filter(Boolean);
    const i = items.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      focusAt(i + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusAt(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusAt(-1);
    }
  };

  return (
    <nav className={styles.bar} aria-label={label}>
      <ul role="toolbar" aria-label={label} aria-orientation="horizontal" onKeyDown={onKeyDown}>
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              tabIndex={i === 0 ? 0 : -1}
              ref={(el) => {
                refs.current[i] = el;
              }}
            >
              {s.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
