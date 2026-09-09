import { launch, KEY } from './cdp.mjs';
const b = await launch();
const out = (l, p, d='') => console.log(`${p?'  PASS':'  FAIL'}  ${l}${d?' — '+d:''}`);
const sleep = ms => new Promise(r=>setTimeout(r,ms));

// ── hide-on-scroll (production build) ─────────────────────────────
console.log('\n6. Hide-on-scroll, ported from Saga.html');
await b.goto('http://127.0.0.1:3112/');
await b.evaluate(`document.body.style.minHeight='4000px',1`);
const cls = () => b.evaluate(`document.querySelector('#nav').className + '|' + document.documentElement.style.getPropertyValue('--p') + '|' + document.body.className`);
const scrollTo = async y => { await b.evaluate(`scrollTo(0,${y}),1`); await sleep(250); };

await scrollTo(0);
out('at top: not floating, not hidden', !(await cls()).includes('floating'), await cls());
await scrollTo(150);
out('past 80px: floating', (await cls()).includes('floating'), await cls());
await scrollTo(400);
out('scrolling down past 200: hidden', (await cls()).includes('hidden'), await cls());
await scrollTo(300);
out('scrolling up: un-hidden', !(await cls()).includes('hidden'), await cls());
const p = await b.evaluate(`document.documentElement.style.getPropertyValue('--p')`);
out('--p scroll progress written', p !== '' && +p > 0, '--p=' + p);
await scrollTo(600);
out('body.scrolled at p>=1', (await cls()).includes('scrolled'), await cls());

// ── mobile toggle ─────────────────────────────────────────────────
console.log('\n7. Mobile toggle, ported from Saga.html');
await b.send('Emulation.setDeviceMetricsOverride', { width: 420, height: 800, deviceScaleFactor: 2, mobile: true });
await b.goto('http://127.0.0.1:3112/');
const tState = () => b.evaluate(`JSON.stringify({
  open: document.querySelector('#nav').classList.contains('menu-open'),
  expanded: document.querySelector('#navtoggle').getAttribute('aria-expanded'),
  label: document.querySelector('#navtoggle').getAttribute('aria-label'),
  linksVisible: getComputedStyle(document.querySelector('#navlinks')).visibility,
})`);
out('starts closed', JSON.parse(await tState()).open === false, await tState());
await b.evaluate(`document.querySelector('#navtoggle').click(),1`); await sleep(300);
let t1 = JSON.parse(await tState());
out('opens on click', t1.open && t1.expanded === 'true' && t1.linksVisible === 'visible', JSON.stringify(t1));
out('aria-label flips to Close menu', t1.label === 'Close menu', t1.label);
await b.evaluate(`document.body.click(),1`); await sleep(300);
out('closes on outside click', JSON.parse(await tState()).open === false);
await b.evaluate(`document.querySelector('#navtoggle').click(),1`); await sleep(250);
await b.evaluate(`scrollTo(0,300),1`); await sleep(300);
out('closes on scroll', JSON.parse(await tState()).open === false);
await b.send('Emulation.clearDeviceMetricsOverride');

// ── dev mode StrictMode double-mount ──────────────────────────────
console.log('\n8. Dev server (React StrictMode double-invokes effects)');
await b.goto('http://127.0.0.1:3111/');
await sleep(1200);
const dev = JSON.parse(await b.evaluate(`JSON.stringify({
  starts: window.__SAGA_STAGE_STARTS__,
  canvases: document.querySelectorAll('canvas#stage').length })`));
out('engine constructed once under StrictMode', dev.starts === 1, 'starts=' + dev.starts);
out('exactly one #stage canvas', dev.canvases === 1, 'count=' + dev.canvases);

b.close();
