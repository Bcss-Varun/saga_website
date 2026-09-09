'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NAV, CTA } from '../lib/nav';
import styles from './Nav.module.css';

export default function Nav() {
  const navRef = useRef(null);
  const linksRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const itemRefs = useRef([]);

  const [menuOpen, setMenuOpen] = useState(false); // mobile drawer
  const [open, setOpen] = useState(false); // Solutions dropdown
  const pathname = usePathname();

  const solutions = NAV.find((n) => n.items);

  /* ── hide-on-scroll — ported from Saga.html frameTick ─────────── */
  useEffect(() => {
    const SHRINK = 280;
    let lastY = 0;
    let ticking = false;

    const tick = () => {
      ticking = false;
      const y = window.scrollY;
      const nav = navRef.current;
      if (!nav) return;
      const diff = y - lastY;
      const p = Math.min(1, Math.max(0, y / SHRINK));
      document.documentElement.style.setProperty('--p', p);

      if (y > 80) {
        nav.classList.add('floating');
        if (diff > 6 && y > 200) nav.classList.add('hidden');
        else if (diff < -6) nav.classList.remove('hidden');
      } else {
        nav.classList.remove('floating', 'hidden');
      }
      document.body.classList.toggle('scrolled', p >= 1);
      lastY = y;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(tick);
      }
    };

    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* ── mobile drawer — ported from Saga.html ────────────────────── */
  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest('#nav')) setMenuOpen(false);
    };
    const onScroll = () => setMenuOpen(false);
    const mq = window.matchMedia('(min-width:941px)');
    const onMq = (e) => {
      if (e.matches) setMenuOpen(false);
    };

    document.addEventListener('click', onDocClick);
    window.addEventListener('scroll', onScroll, { passive: true });
    mq.addEventListener('change', onMq);
    return () => {
      document.removeEventListener('click', onDocClick);
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', onMq);
    };
  }, []);

  /* Both menus close on navigation. */
  useEffect(() => {
    setMenuOpen(false);
    setOpen(false);
  }, [pathname]);

  /* ── Solutions dropdown ───────────────────────────────────────── */
  const closeAndRefocus = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const focusItem = useCallback((i) => {
    const items = itemRefs.current.filter(Boolean);
    if (!items.length) return;
    const next = (i + items.length) % items.length;
    items[next]?.focus();
  }, []);

  // Open, then move focus once the menu has actually rendered.
  const [pendingFocus, setPendingFocus] = useState(null);
  useEffect(() => {
    if (open && pendingFocus !== null) {
      focusItem(pendingFocus === 'last' ? -1 : 0);
      setPendingFocus(null);
    }
  }, [open, pendingFocus, focusItem]);

  const onTriggerKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
      setPendingFocus('first');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      setPendingFocus('last');
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const onMenuKeyDown = (e) => {
    const items = itemRefs.current.filter(Boolean);
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusItem(i + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusItem(i - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusItem(-1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeAndRefocus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  // A click anywhere outside the dropdown closes it, without stealing focus.
  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (!e.target.closest(`.${styles.solutions}`)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  const isCurrent = (href) => pathname === href || pathname === `${href}/`;

  return (
    <nav id="nav" ref={navRef} className={menuOpen ? 'menu-open' : undefined}>
      <Link className="brand" href="/" aria-label="Blura SAGA home">
        <Image
          src="/logo/saga-logo-transparent.png"
          alt="SAGA - Sentiment And Goodwill Analysis"
          className="brand-logo logo-light"
          width={132}
          height={40}
          priority
        />
        <Image
          src="/logo/saga-logo-rounded.png"
          alt="SAGA - Sentiment And Goodwill Analysis"
          className="brand-logo logo-dark"
          width={132}
          height={40}
          priority
        />
      </Link>

      <div className="nav-menu">
        <div className="navlinks" id="navlinks" ref={linksRef}>
          {NAV.map((item) =>
            item.items ? (
              <div key={item.label} className={styles.solutions}>
                <button
                  type="button"
                  ref={triggerRef}
                  className={styles.trigger}
                  aria-expanded={open}
                  aria-controls="solutions-menu"
                  aria-haspopup="true"
                  onClick={() => setOpen((v) => !v)}
                  onKeyDown={onTriggerKeyDown}
                >
                  {item.label}
                  <span className={styles.chev} aria-hidden="true" />
                </button>

                <div
                  id="solutions-menu"
                  ref={menuRef}
                  className={styles.menu}
                  hidden={!open}
                  onKeyDown={onMenuKeyDown}
                >
                  <ul>
                    {item.items.map((v, i) => (
                      <li key={v.key}>
                        <Link
                          href={v.href}
                          ref={(el) => {
                            itemRefs.current[i] = el;
                          }}
                          aria-current={isCurrent(v.href) ? 'page' : undefined}
                          onClick={() => setOpen(false)}
                        >
                          <span className={styles.itemName}>{v.name}</span>
                          <span className={styles.itemDesc}>{v.descriptor}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <Link className="cta" href={CTA.href}>
          {CTA.label}
        </Link>

        <button
          className="navtoggle"
          type="button"
          id="navtoggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="navlinks"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
