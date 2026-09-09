/* Guards one defect class the port keeps producing: a global rule written for
   prose, silently inherited by an element that is not prose.

   It has bitten three times — the bare `nav` selector turning a section nav
   into a second fixed header, the footer grid declaring five column tracks for
   four children, and `p { max-width: 60ch }` clipping the draft banner's
   background to 494px inside a 1440px page.

   The check: anything that PAINTS a box (background or border) whose width is
   actually PINNED to a measure far below the width available to it. Body copy
   is exempt — it paints nothing, so a measure on it is invisible and correct.

   Two refinements the first run forced, both from false positives it produced:

   · the cap must be binding. An inline-block pill sits well under a 60ch cap
     without being constrained by it; only flag an element whose rendered width
     is the cap.
   · some painted boxes are deliberately narrow — a bordered prose note held to
     a readable measure is a design decision, not a defect. Those are listed in
     ALLOWED by their stable class name, so a *new* narrow painted box still
     has to be justified rather than blending in. */

/* Deliberately narrow painted boxes. Anything not on this list is a finding. */
const ALLOWED = [
  /* the ported deployment note on the three verticals not yet through the
     density pass: a prose callout held to 62ch on purpose */
  'VerticalPage_deployment',
  /* inside the console mock, which is a transform-scaled illustration of a
     product UI — its internal geometry is drawn, not laid out */
  'sd-search',
];
import { launch } from './cdp.mjs';

const B = process.env.SAGA_TEST_URL || 'http://127.0.0.1:3130';
const ROUTES = ['/', '/platform/', '/public-safety/', '/governance/', '/brands/',
  '/celebrity/', '/investigation/', '/trust/', '/contact/'];

const b = await launch();
await b.send('Emulation.setDeviceMetricsOverride',
  { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

let fail = 0;
const out = (l, p, d = '') => { console.log(`${p ? '  PASS' : '  FAIL'}  ${l}${d ? ' — ' + d : ''}`); if (!p) fail++; };

console.log('Painted boxes clipped by a prose measure');
for (const r of ROUTES) {
  await b.goto(B + r);
  await new Promise(res => setTimeout(res, 500));

  /* A page that failed to load has no painted boxes and would sail through
     every check below. This guard exists because it happened: the static
     server had died, all nine routes returned nothing, and the suite reported
     a clean pass — including against a build with the defect deliberately
     reintroduced. Silence is not a pass. */
  const loaded = JSON.parse(await b.evaluate(`JSON.stringify({
    h1: document.querySelectorAll('h1').length,
    els: document.querySelectorAll('body *').length,
  })`));
  if (loaded.h1 !== 1 || loaded.els < 80) {
    out(r.padEnd(18), false, `page did not load — h1=${loaded.h1} elements=${loaded.els}`);
    continue;
  }

  const bad = JSON.parse(await b.evaluate(`(() => {
    const paints = cs =>
      (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') ||
      cs.borderTopWidth !== '0px' || cs.borderLeftWidth !== '0px';
    const hits = [];
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.maxWidth === 'none' || !cs.maxWidth.endsWith('px')) continue;
      if (!paints(cs)) continue;                       /* invisible measure: fine */
      if (cs.display === 'inline') continue;
      const cap = parseFloat(cs.maxWidth);
      const parent = el.parentElement;
      if (!parent) continue;
      const cls = el.className.toString();
      if (${JSON.stringify(ALLOWED)}.some(a => cls.includes(a))) continue;
      const avail = parent.getBoundingClientRect().width;
      const w = el.getBoundingClientRect().width;
      /* the cap must actually be binding — an element that shrink-wraps well
         under its measure is not constrained by it */
      if (avail - cap > 260 && Math.abs(w - cap) < 2) {
        hits.push(el.tagName.toLowerCase() + '.' + (el.className.toString().split(' ')[0] || '?')
          + ' capped ' + Math.round(cap) + 'px inside ' + Math.round(avail) + 'px');
      }
    }
    return JSON.stringify([...new Set(hits)]);
  })()`));
  out(r.padEnd(18), bad.length === 0, bad.length ? bad.join(' | ') : 'none');
}

console.log(fail ? `\n${fail} FAILED` : '\nNo painted box is clipped by a prose measure');
b.close();
process.exitCode = fail ? 1 : 0;
