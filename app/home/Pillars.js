'use client';

import { useEffect, useRef } from 'react';
import Globe from '../components/Globe';

/* Observe / Understand / Act — the sticky-stack.

   Three cards pin on top of each other. Each owns a 0->1 scroll progress
   written to `--p`, which drives its right-hand visual, so the run reads as
   one continuous movement.

   Two things make this port different from the original:

   1. Measurement is driven by a ResizeObserver on the stack and on <body>,
      not by `load` and `document.fonts.ready`. Neither of those fires on a
      client navigation, and layout is not settled when useEffect runs. The
      body observer matters as much as the stack one: `measure()` records the
      stack's absolute document offset, so anything above it changing height
      — the macbook image arriving, a font swapping — invalidates the ranges
      without the stack itself resizing.

   2. Nothing is timed. There is no setTimeout anywhere in here. If measurement
      needed a delay to land, the trigger would be wrong.

   The `.pcard` / `.pgap` class names stay global and unhashed — see the note
   in the checkpoint report. `getComputedStyle(card).top` reads the sticky
   offset, and measuring happens off the `.pgap` runways, which never stick and
   so still report an honest position while the cards above them are pinned.

   [copy: needs specificity rewrite] */

export default function Pillars() {
  const stackRef = useRef(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return undefined;

    const cards = [...stack.querySelectorAll('.pcard')];
    const gaps = [...stack.querySelectorAll('.pgap')];
    const marks = [...stack.querySelectorAll('.pmark')];
    if (!cards.length) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
    const narrow = () => window.matchMedia('(max-width: 980px)').matches;

    const intel = stack.querySelector('#pIntel');
    const sigIn = intel ? [...intel.querySelectorAll('.i-in')] : [];
    const sigOut = intel ? [...intel.querySelectorAll('.i-out')] : [];
    const flow = stack.querySelector('#pFlow');
    const steps = flow ? [...flow.querySelectorAll('.k-cell')] : [];
    const STEP_AT = [0.04, 0.34, 0.64, 0.94]; // the fourth lands on Report, then holds

    let ranges = [];
    let dead = false;

    /* A stuck element reports its pinned offset, so its own geometry cannot be
       trusted. Every static top is read off the .pgap runways instead. */
    function measure() {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const tops = cards.map((c, i) =>
        i === 0
          ? stack.getBoundingClientRect().top + y
          : gaps[i - 1].getBoundingClientRect().bottom + y
      );
      ranges = cards.map((c, i) => {
        const stick = parseFloat(getComputedStyle(c).top) || 0;
        /* start once the card has risen past mid-viewport; finish just as the
           next card's edge reaches the bottom of the screen — after that it is
           being covered and nobody can read it any more */
        const start = tops[i] - vh * 0.55;
        const end =
          i < cards.length - 1
            ? tops[i + 1] - vh
            : tops[i] - stick + gaps[gaps.length - 1].offsetHeight * 0.92;
        return { start, span: Math.max(end - start, 1) };
      });
    }

    function progress(i) {
      if (narrow() || !ranges[i]) {
        // cards sit in normal flow
        const r = cards[i].getBoundingClientRect();
        return clamp(
          (window.innerHeight * 0.82 - r.top) / Math.max(r.height * 0.55, 1),
          0,
          1
        );
      }
      return clamp((window.scrollY - ranges[i].start) / ranges[i].span, 0, 1);
    }

    function paint() {
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        const p = reduced ? 1 : progress(i);
        c.style.setProperty('--p', p.toFixed(4));
        const kind = c.dataset.vis;
        if (kind === 'understand' && intel) {
          /* signals arrive, the core lights, then intelligence leaves */
          for (let k = 0; k < sigIn.length; k++) {
            sigIn[k].classList.toggle('on', p > 0.1 + k * 0.022);
          }
          intel.classList.toggle('core', p > 0.4);
          for (let k = 0; k < sigOut.length; k++) {
            sigOut[k].classList.toggle('on', p > 0.52 + k * 0.045);
          }
        } else if (kind === 'act' && flow) {
          const fp = clamp((p - 0.26) / 0.62, 0, 1);
          flow.classList.toggle('axis', p > 0.2);
          for (let k = 0; k < steps.length; k++) {
            steps[k].classList.toggle('on', fp >= STEP_AT[k]);
          }
        }
      }
    }

    /* Every word spans its card edge to edge whatever its length, capped so a
       short one like "Act" cannot grow taller than the card. `.pmark` is
       absolutely positioned, so resizing it cannot feed back into the card's
       own box and retrigger the observer. */
    function fitMarks() {
      for (const m of marks) {
        const card = m.closest('.pcard');
        const grid = card.querySelector('.pgrid');
        const avail = grid ? grid.clientWidth : card.clientWidth;
        m.style.fontSize = '100px';
        const w = m.getBoundingClientRect().width;
        if (!w) continue;
        m.style.fontSize = `${Math.min((100 * avail) / w, card.clientHeight * 0.54)}px`;
      }
    }

    /* copy fades in on visibility, not on progress — a card is on screen for
       most of a viewport before it ever pins */
    const litIO = new IntersectionObserver(
      (es) => {
        for (const e of es) e.target.classList.toggle('lit', e.isIntersecting);
      },
      { threshold: 0.12 }
    );
    cards.forEach((c) => litIO.observe(c));

    /* The hero collapses as the page scrolls, which shortens the document and
       lifts the whole stack by ~112px. The ranges cached at scroll position 0
       are stale from that moment on. The body ResizeObserver does notice, but
       only a frame later, which shows as a jump in --p exactly as the first
       card starts moving. So the scroll handler re-measures itself whenever the
       document's height has changed since the last frame — one property read,
       and no dependence on when an observer happens to fire. */
    let lastDocH = document.documentElement.scrollHeight;
    let queued = false;
    const onScroll = () => {
      if (queued || dead) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (dead) return;
        const h = document.documentElement.scrollHeight;
        if (h !== lastDocH) {
          lastDocH = h;
          measure();
        }
        paint();
      });
    };

    /* One coalesced re-measure. The observers below all funnel here rather
       than each doing their own layout pass. */
    let remeasureQueued = false;
    const remeasure = () => {
      if (remeasureQueued || dead) return;
      remeasureQueued = true;
      requestAnimationFrame(() => {
        remeasureQueued = false;
        if (dead) return;
        fitMarks();
        measure();
        lastDocH = document.documentElement.scrollHeight;
        paint();
      });
    };

    /* The stack's own box, and the document's — the latter catches anything
       above the stack changing height and shifting it without resizing it. */
    const ro = new ResizeObserver(remeasure);
    ro.observe(stack);
    ro.observe(document.body);
    cards.forEach((c) => ro.observe(c));

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', remeasure, { passive: true });

    fitMarks();
    measure();
    paint();

    return () => {
      dead = true;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', remeasure);
      ro.disconnect();
      litIO.disconnect();
    };
  }, []);

  return (
      <section className="pillars" id="pillars">
        <div className="pstack" id="pstack" ref={stackRef}>

          {/* 01 OBSERVE */}
          <article className="pcard" id="p-observe" data-vis="observe" style={{"--i": "0"}}>
            <span className="pmark" aria-hidden="true">Observe</span>
            <div className="pgrid">
              <div className="pcopy">
                <h2>See what is happening.</h2>
                <p className="lead">SAGA continuously watches digital conversations, content, events and feeds so teams can
                  build a clearer picture of what is happening.</p>
              </div>
              <div className="pvis">
                <Globe />
              </div>
            </div>
          </article>
          <i className="pgap" aria-hidden="true"></i>

          {/* 02 UNDERSTAND */}
          <article className="pcard" id="p-understand" data-vis="understand" style={{"--i": "1"}}>
            <span className="pmark" aria-hidden="true" style={{"--mk": ".74"}}>Understand</span>
            <div className="pgrid">
              <div className="pcopy">
                <h2>Know what the signals mean.</h2>
                <p className="lead">SAGA uses AI-driven analysis to turn digital activity into meaningful intelligence.</p>
                <p>It helps reveal sentiment, intent, narratives, threats, trends, entities and relationships.</p>
              </div>
              <div className="pvis">
                <div className="ivis" id="pIntel">
            <svg className="isvg" viewBox="0 0 1000 580" role="img" aria-label="Raw signals entering SAGA and leaving as intelligence">
              <defs>
                <symbol id="ic-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11.4a8 8 0 0 1-8.6 8 8.8 8.8 0 0 1-3.2-.6L4 20.2l1.3-4A7.6 7.6 0 0 1 3.5 11.4a8 8 0 0 1 8.5-7.9 8 8 0 0 1 8.5 7.9Z" /></symbol>
                <symbol id="ic-doc" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h8l4.5 4.5V21H6z" /><path d="M14 3v5h4.5" /><path d="M9 13h6M9 16.5h4" /></symbol>
                <symbol id="ic-rss" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6.3" cy="17.7" r="1.7" /><path d="M4.6 12.2A7.2 7.2 0 0 1 11.8 19.4" /><path d="M4.6 6.6A12.8 12.8 0 0 1 17.4 19.4" /></symbol>
                <symbol id="ic-play" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.8" /><path d="M10.2 8.6 15.4 12l-5.2 3.4z" /></symbol>
                <symbol id="ic-like" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 21V10.5l4.2-7a2 2 0 0 1 2.9 2.4L13 10h5.6a2 2 0 0 1 1.95 2.45l-1.5 6.5A2 2 0 0 1 17.1 21z" /><path d="M7 10.5H3.6V21H7z" /></symbol>
                <symbol id="ic-hash" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.6 3.6 7.9 20.4M16.4 3.6l-1.7 16.8M4.2 8.6h16M3.6 15.4h16" /></symbol>
                <symbol id="ic-img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2.6" /><circle cx="8.6" cy="9.6" r="1.7" /><path d="M3.8 16.8 9 12.5l4.2 3.4 3.2-2.6 3.8 3" /></symbol>
                <symbol id="ic-cam" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5h3.3l1.6-2.4h7.2l1.6 2.4h3.3v11h-17z" /><circle cx="12" cy="13.6" r="3.6" /></symbol>
                <symbol id="ic-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8.2" r="3.4" /><path d="M5.4 20.4a6.6 6.6 0 0 1 13.2 0" /></symbol>
                <symbol id="ic-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13z" /></symbol>
                <symbol id="ic-at" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3.6" /><path d="M15.6 12v1.9a2.7 2.7 0 0 0 5.4 0V12a9 9 0 1 0-3.6 7.2" /></symbol>
                <symbol id="ic-smile" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.8" /><path d="M8.6 14.2a4.4 4.4 0 0 0 6.8 0" /><path d="M9.2 9.6v.1M14.8 9.6v.1" /></symbol>
                <symbol id="ic-target" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.6" /><circle cx="12" cy="12" r="4.6" /><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" /></symbol>
                <symbol id="ic-quote" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 5.5h12v9h-7l-5 4z" /><path d="M8.5 9.5h11v9h-3v3l-4-3" /></symbol>
                <symbol id="ic-warn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.2 2.9 19.2h18.2z" /><path d="M12 10v4M12 16.7v.1" /></symbol>
                <symbol id="ic-trend" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 16.5 9 11l4 4 7.5-7.5" /><path d="M15 7.5h5.5V13" /></symbol>
                <symbol id="ic-people" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8.6" cy="8.2" r="3" /><path d="M3.2 19.4a5.4 5.4 0 0 1 10.8 0" /><path d="M16 6.2a3 3 0 0 1 0 5.9M20.8 17.6a5.2 5.2 0 0 0-3-4.4" /></symbol>
                <radialGradient id="iHalo"><stop offset="0" stopColor="#F15B26" stopOpacity=".40" /><stop offset="55%" stopColor="#F15B26" stopOpacity=".09" /><stop offset="100%" stopColor="#F15B26" stopOpacity="0" /></radialGradient>
                <linearGradient id="iSlab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A2A31" /><stop offset="100%" stopColor="#08080A" /></linearGradient>
                <linearGradient id="iHot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFC9A6" /><stop offset="45%" stopColor="#F15B26" /><stop offset="100%" stopColor="#A8380F" /></linearGradient>
                <filter id="iBlur" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="9" /></filter>
              </defs>
              <ellipse className="i-halo" cx="566" cy="348" rx="310" ry="200" fill="url(#iHalo)" />
              <g className="i-inputs">
                <g className="i-in" style={{"--k": "0"}}>
                  <path className="iwire base" d="M82,232 C162,232 334,276 446,276" />
                  <path className="iwire flow" d="M82,232 C162,232 334,276 446,276" style={{"animationDelay": "0.00s"}} />
                  <g className="inode" transform="translate(58,232)"><circle r="22" /><use href="#ic-chat" x="-11" y="-11" width="22" height="22" /></g>
                </g>
                <g className="i-in" style={{"--k": "1"}}>
                  <path className="iwire base" d="M144,148 C224,148 334,276 446,276" />
                  <path className="iwire flow" d="M144,148 C224,148 334,276 446,276" style={{"animationDelay": "-0.31s"}} />
                  <g className="inode" transform="translate(120,148)"><circle r="22" /><use href="#ic-doc" x="-11" y="-11" width="22" height="22" /></g>
                </g>
                <g className="i-in" style={{"--k": "2"}}>
                  <path className="iwire base" d="M128,318 C208,318 334,276 446,276" />
                  <path className="iwire flow" d="M128,318 C208,318 334,276 446,276" style={{"animationDelay": "-0.62s"}} />
                  <g className="inode" transform="translate(104,318)"><circle r="22" /><use href="#ic-rss" x="-11" y="-11" width="22" height="22" /></g>
                </g>
                <g className="i-in" style={{"--k": "3"}}>
                  <path className="iwire base" d="M92,404 C172,404 334,276 446,276" />
                  <path className="iwire flow" d="M92,404 C172,404 334,276 446,276" style={{"animationDelay": "-0.93s"}} />
                  <g className="inode" transform="translate(68,404)"><circle r="22" /><use href="#ic-play" x="-11" y="-11" width="22" height="22" /></g>
                </g>
                <g className="i-in" style={{"--k": "4"}}>
                  <path className="iwire base" d="M216,102 C296,102 334,276 446,276" />
                  <path className="iwire flow" d="M216,102 C296,102 334,276 446,276" style={{"animationDelay": "-1.24s"}} />
                  <g className="inode" transform="translate(192,102)"><circle r="22" /><use href="#ic-like" x="-11" y="-11" width="22" height="22" /></g>
                </g>
                <g className="i-in" style={{"--k": "5"}}>
                  <path className="iwire base" d="M224,240 C304,240 334,276 446,276" />
                  <path className="iwire flow" d="M224,240 C304,240 334,276 446,276" style={{"animationDelay": "-1.55s"}} />
                  <g className="inode" transform="translate(200,240)"><circle r="22" /><use href="#ic-hash" x="-11" y="-11" width="22" height="22" /></g>
                </g>
                <g className="i-in" style={{"--k": "6"}}>
                  <path className="iwire base" d="M182,438 C262,438 334,276 446,276" />
                  <path className="iwire flow" d="M182,438 C262,438 334,276 446,276" style={{"animationDelay": "-1.86s"}} />
                  <g className="inode" transform="translate(158,438)"><circle r="22" /><use href="#ic-img" x="-11" y="-11" width="22" height="22" /></g>
                </g>
                <g className="i-in" style={{"--k": "7"}}>
                  <path className="iwire base" d="M282,166 C362,166 334,276 446,276" />
                  <path className="iwire flow" d="M282,166 C362,166 334,276 446,276" style={{"animationDelay": "-2.17s"}} />
                  <g className="inode" transform="translate(258,166)"><circle r="22" /><use href="#ic-cam" x="-11" y="-11" width="22" height="22" /></g>
                </g>
                <g className="i-in" style={{"--k": "8"}}>
                  <path className="iwire base" d="M286,344 C366,344 334,276 446,276" />
                  <path className="iwire flow" d="M286,344 C366,344 334,276 446,276" style={{"animationDelay": "-2.48s"}} />
                  <g className="inode" transform="translate(262,344)"><circle r="22" /><use href="#ic-user" x="-11" y="-11" width="22" height="22" /></g>
                </g>
                <g className="i-in" style={{"--k": "9"}}>
                  <path className="iwire base" d="M150,506 C230,506 334,276 446,276" />
                  <path className="iwire flow" d="M150,506 C230,506 334,276 446,276" style={{"animationDelay": "-2.79s"}} />
                  <g className="inode" transform="translate(126,506)"><circle r="22" /><use href="#ic-heart" x="-11" y="-11" width="22" height="22" /></g>
                </g>
                <g className="i-in" style={{"--k": "10"}}>
                  <path className="iwire base" d="M264,502 C344,502 334,276 446,276" />
                  <path className="iwire flow" d="M264,502 C344,502 334,276 446,276" style={{"animationDelay": "-3.10s"}} />
                  <g className="inode" transform="translate(240,502)"><circle r="22" /><use href="#ic-at" x="-11" y="-11" width="22" height="22" /></g>
                </g>
              </g>
              <g className="i-core">
                <path className="slab-s" d="M433.4,409.6 Q396.0,394.0 433.4,378.4 L528.6,338.6 Q566.0,323.0 603.4,338.6 L698.6,378.4 Q736.0,394.0 698.6,409.6 L603.4,449.4 Q566.0,465.0 528.6,449.4 Z" />
                <path className="slab-t" d="M433.4,383.6 Q396.0,368.0 433.4,352.4 L528.6,312.6 Q566.0,297.0 603.4,312.6 L698.6,352.4 Q736.0,368.0 698.6,383.6 L603.4,423.4 Q566.0,439.0 528.6,423.4 Z" />
                <path className="hot-s" d="M456.8,349.8 Q426.0,337.0 456.8,324.2 L535.2,291.8 Q566.0,279.0 596.8,291.8 L675.2,324.2 Q706.0,337.0 675.2,349.8 L596.8,382.2 Q566.0,395.0 535.2,382.2 Z" filter="url(#iBlur)" opacity=".9" />
                <path className="hot-s" d="M456.8,349.8 Q426.0,337.0 456.8,324.2 L535.2,291.8 Q566.0,279.0 596.8,291.8 L675.2,324.2 Q706.0,337.0 675.2,349.8 L596.8,382.2 Q566.0,395.0 535.2,382.2 Z" />
                <path className="hot-t" d="M456.8,332.8 Q426.0,320.0 456.8,307.2 L535.2,274.8 Q566.0,262.0 596.8,274.8 L675.2,307.2 Q706.0,320.0 675.2,332.8 L596.8,365.2 Q566.0,378.0 535.2,365.2 Z" />
                <path className="slab-s" d="M472.4,303.0 Q446.0,292.0 472.4,281.0 L539.6,253.0 Q566.0,242.0 592.4,253.0 L659.6,281.0 Q686.0,292.0 659.6,303.0 L592.4,331.0 Q566.0,342.0 539.6,331.0 Z" />
                <path className="slab-t lit" d="M472.4,279.0 Q446.0,268.0 472.4,257.0 L539.6,229.0 Q566.0,218.0 592.4,229.0 L659.6,257.0 Q686.0,268.0 659.6,279.0 L592.4,307.0 Q566.0,318.0 539.6,307.0 Z" />
                <path className="slab-i" d="M493.5,276.6 Q473.0,268.0 493.5,259.4 L545.5,237.6 Q566.0,229.0 586.5,237.6 L638.5,259.4 Q659.0,268.0 638.5,276.6 L586.5,298.4 Q566.0,307.0 545.5,298.4 Z" />
                <text className="i-mark" x="566" y="278" textAnchor="middle">SAGA</text>
              </g>
              <g className="i-outputs">
                <g className="i-out" style={{"--k": "0"}}>
                  <path className="owire base" d="M686,270 C756,270 712,62 764,62" />
                  <path className="owire flow" d="M686,270 C756,270 712,62 764,62" style={{"animationDelay": "0.00s"}} />
                  <g className="onode" transform="translate(790,62)"><circle r="26" /><use href="#ic-smile" x="-12" y="-12" width="24" height="24" /></g>
                  <text className="olabel" x="826" y="68">Sentiment</text>
                </g>
                <g className="i-out" style={{"--k": "1"}}>
                  <path className="owire base" d="M686,270 C756,270 712,150 764,150" />
                  <path className="owire flow" d="M686,270 C756,270 712,150 764,150" style={{"animationDelay": "-0.36s"}} />
                  <g className="onode" transform="translate(790,150)"><circle r="26" /><use href="#ic-target" x="-12" y="-12" width="24" height="24" /></g>
                  <text className="olabel" x="826" y="156">Intent</text>
                </g>
                <g className="i-out" style={{"--k": "2"}}>
                  <path className="owire base" d="M686,270 C756,270 712,238 764,238" />
                  <path className="owire flow" d="M686,270 C756,270 712,238 764,238" style={{"animationDelay": "-0.72s"}} />
                  <g className="onode" transform="translate(790,238)"><circle r="26" /><use href="#ic-quote" x="-12" y="-12" width="24" height="24" /></g>
                  <text className="olabel" x="826" y="244">Narratives</text>
                </g>
                <g className="i-out" style={{"--k": "3"}}>
                  <path className="owire base" d="M686,270 C756,270 712,326 764,326" />
                  <path className="owire flow" d="M686,270 C756,270 712,326 764,326" style={{"animationDelay": "-1.08s"}} />
                  <g className="onode" transform="translate(790,326)"><circle r="26" /><use href="#ic-warn" x="-12" y="-12" width="24" height="24" /></g>
                  <text className="olabel" x="826" y="332">Threats</text>
                </g>
                <g className="i-out" style={{"--k": "4"}}>
                  <path className="owire base" d="M686,270 C756,270 712,414 764,414" />
                  <path className="owire flow" d="M686,270 C756,270 712,414 764,414" style={{"animationDelay": "-1.44s"}} />
                  <g className="onode" transform="translate(790,414)"><circle r="26" /><use href="#ic-trend" x="-12" y="-12" width="24" height="24" /></g>
                  <text className="olabel" x="826" y="420">Trends</text>
                </g>
                <g className="i-out" style={{"--k": "5"}}>
                  <path className="owire base" d="M686,270 C756,270 712,502 764,502" />
                  <path className="owire flow" d="M686,270 C756,270 712,502 764,502" style={{"animationDelay": "-1.80s"}} />
                  <g className="onode" transform="translate(790,502)"><circle r="26" /><use href="#ic-people" x="-12" y="-12" width="24" height="24" /></g>
                  <text className="olabel" x="826" y="508">Relationships</text>
                </g>
              </g>
            </svg>
                </div>
              </div>
            </div>
          </article>
          <i className="pgap" aria-hidden="true"></i>

          {/* 03 ACT */}
          <article className="pcard" id="p-act" data-vis="act" style={{"--i": "2"}}>
            <span className="pmark" aria-hidden="true">Act</span>
            <div className="pgrid">
              <div className="pcopy">
                <h2>Turn intelligence into action.</h2>
                <p className="lead">SAGA connects intelligence to the workflows teams use to respond, investigate, manage and
                  make decisions.</p>
              </div>
              <div className="pvis">
                <div className="fvis" id="pFlow">
                  <svg className="ksvg" viewBox="0 0 820 600" role="img" aria-label="Alert, Investigate, Manage, Report">
                    <defs>
                      <radialGradient id="kGlow"><stop offset="0" stopColor="#F15B26" stopOpacity=".11" /><stop offset="60%" stopColor="#F15B26" stopOpacity=".03" /><stop offset="100%" stopColor="#F15B26" stopOpacity="0" /></radialGradient>
                      <linearGradient id="kV" gradientUnits="userSpaceOnUse" x1="410" y1="28" x2="410" y2="572"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="50%" stopColor="#fff" stopOpacity=".15" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></linearGradient>
                      <linearGradient id="kH" gradientUnits="userSpaceOnUse" x1="16" y1="295" x2="804" y2="295"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="50%" stopColor="#fff" stopOpacity=".15" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></linearGradient>
                      <filter id="kBlur" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5" /></filter>
                    </defs>
                    <g className="k-axis">
                      <path d="M410,28 V572" stroke="url(#kV)" strokeWidth="1.2" fill="none" />
                      <path d="M16,295 H804" stroke="url(#kH)" strokeWidth="1.2" fill="none" />
                      <circle cx="410" cy="295" r="9" fill="#F15B26" opacity=".38" filter="url(#kBlur)" />
                      <circle cx="410" cy="295" r="3" fill="#F15B26" />
                    </g>
                    <g className="k-cell" style={{"--k": "0"}}>
                      <circle cx="205" cy="130" r="92" fill="url(#kGlow)" />
                      <g className="k-icon" transform="translate(153,78) scale(4.3333)">
                        <g className="k-base"><circle cx="12" cy="12" r="7.1" /><path d="M12 8.5v4.3" /><path d="M12 15.6v.1" /></g>
                        <g className="k-accent"><path d="M4.9 5.9a9.4 9.4 0 0 0 0 12.2" /><path d="M19.1 5.9a9.4 9.4 0 0 1 0 12.2" /></g>
                      </g>
                      <text className="klabel" x="205" y="230" textAnchor="middle">Alert</text>
                    </g>
                    <g className="k-cell" style={{"--k": "1"}}>
                      <circle cx="615" cy="130" r="92" fill="url(#kGlow)" />
                      <g className="k-icon" transform="translate(563,78) scale(4.3333)">
                        <g className="k-base"><circle cx="10.5" cy="10.5" r="6.7" /><path d="M7.6 11.9 9.9 9.3l2.1 1.5 2.1-2.4" /></g>
                        <g className="k-accent"><path d="M15.3 15.3 20.6 20.6" /><circle cx="14.1" cy="8.4" r=".95" fill="currentColor" stroke="none" /></g>
                      </g>
                      <text className="klabel" x="615" y="230" textAnchor="middle">Investigate</text>
                    </g>
                    <g className="k-cell" style={{"--k": "2"}}>
                      <circle cx="205" cy="420" r="92" fill="url(#kGlow)" />
                      <g className="k-icon" transform="translate(153,368) scale(4.3333)">
                        <g className="k-base"><rect x="3.5" y="4.3" width="17" height="4.3" rx="2.15" /><rect x="3.5" y="9.85" width="17" height="4.3" rx="2.15" /><rect x="3.5" y="15.4" width="17" height="4.3" rx="2.15" /></g>
                        <g className="k-accent"><path d="M6.3 6.45h4.8M6.3 12h7.7M6.3 17.55h3.1" /></g>
                      </g>
                      <text className="klabel" x="205" y="520" textAnchor="middle">Manage</text>
                    </g>
                    <g className="k-cell" style={{"--k": "3"}}>
                      <circle cx="615" cy="420" r="92" fill="url(#kGlow)" />
                      <g className="k-icon" transform="translate(563,368) scale(4.3333)">
                        <g className="k-base"><rect x="5.1" y="2.9" width="13.8" height="18.2" rx="2.2" /><path d="M8.3 7.3h7.4M8.3 9.9h4.7" /></g>
                        <g className="k-accent"><path d="M8.8 17.6v-3.1M11.9 17.6v-5.2M15 17.6v-2.1" /></g>
                      </g>
                      <text className="klabel" x="615" y="520" textAnchor="middle">Report</text>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </article>

          <i className="pgap prunway" aria-hidden="true"></i>
        </div>
      </section>
  );
}
