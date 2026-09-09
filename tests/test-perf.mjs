import { launch } from './cdp.mjs';
import fs from 'node:fs';

/* Frame rate under CPU throttling. Unthrottled numbers on a dev machine say
   nothing about old departmental hardware.

   Two things this measures carefully:
   · per-loop frame rate, not total rAF callbacks. #stage and a page scene each
     run their own loop, so counting rAF page-wide double-counts and reports a
     flattering ~120.
   · that the throttle is actually applied, calibrated against a fixed busy
     loop rather than assumed. */
const B = process.env.SAGA_TEST_URL || 'http://127.0.0.1:3112';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b = await launch();
await b.send('Page.addScriptToEvaluateOnNewDocument', { source: fs.readFileSync('./tests/probe.js', 'utf8') });

const throttle = (rate) => b.send('Emulation.setCPUThrottlingRate', { rate });

/* Calibration: how long a fixed lump of arithmetic takes. */
const calibrate = () => b.evaluate(`(() => {
  const t0 = performance.now();
  let x = 0; for (let i = 0; i < 6e6; i++) x += Math.sqrt(i);
  return Math.round(performance.now() - t0);
})()`);

const WINDOW = 3000;

async function measure(url, rate, label, opts = {}) {
  await throttle(rate);
  await b.goto(url);
  if (opts.globe) await b.evaluate(`document.querySelector('#pGlobe')?.scrollIntoView({block:'center'}),1`);
  if (opts.away) await b.evaluate('scrollTo({top:0, behavior:"instant"}),1');
  await sleep(1500);
  await b.evaluate('__resetFrames(),1');
  await sleep(200);

  const t0 = await b.evaluate(`JSON.stringify({
    t: performance.now(),
    scene: (window.__CANVAS_STATS__||{}).frames || 0,
    raf: __PROBE__.rafMade })`).then(JSON.parse);
  await sleep(WINDOW);
  const t1 = await b.evaluate(`JSON.stringify({
    t: performance.now(),
    scene: (window.__CANVAS_STATS__||{}).frames || 0,
    raf: __PROBE__.rafMade })`).then(JSON.parse);

  const secs = (t1.t - t0.t) / 1000;
  const sceneFps = Math.round((t1.scene - t0.scene) / secs);
  const stageFps = await b.evaluate('__fps()');   // true page frame rate
  const ms = await calibrate();
  const verdict = (f) => f >= 50 ? 'smooth' : f >= 30 ? 'OK' : f >= 24 ? 'MARGINAL' : 'POOR';
  console.log(
    `  ${label.padEnd(30)} globe ${String(sceneFps).padStart(3)}fps  page ${String(stageFps).padStart(3)}fps` +
    `   ${opts.away ? '(scene paused)' : verdict(sceneFps)}   [busy-loop ${ms}ms]`
  );
  return { sceneFps, stageFps, ms };
}

console.log('\nThrottle calibration (same arithmetic at each rate)');
for (const r of [1, 4, 6]) { await throttle(r); console.log(`  ${r}x → ${await calibrate()}ms`); }

console.log('\nGlobe + #stage on one page (Home, globe held on screen)');
const a1 = await measure(B + '/', 1, '1x unthrottled', { globe: true });
const a4 = await measure(B + '/', 4, '4x CPU throttle', { globe: true });
const a6 = await measure(B + '/', 6, '6x CPU throttle', { globe: true });

console.log('\n#stage alone (/trust — no page canvas)');
const s4 = await measure(B + '/trust/', 4, '4x CPU throttle', {});

console.log('\nGlobe scrolled away (loop halted)');
const off = await measure(B + '/', 4, '4x, scene off-screen', { away: true });

/* The stack's scroll handler only costs anything while the page is actually
   moving, so measure during a continuous scroll through it — three loops
   competing: #stage, the globe, and the stack. */
/* Scrolling is where the stack costs anything. Two corrections over the naive
   version of this measurement:

   · Frame rate is counted from DISTINCT rAF timestamps. Every callback in a
     frame shares a timestamp, and this page runs several loops (#stage, the
     globe, the nav, the stack, the reveals), so counting callbacks reports a
     rate several times the truth.
   · The sweep stays inside the range where the globe is actually on screen.
     Sweeping the whole stack averages in stretches where the globe is parked
     and drawing nothing, which reads as a performance drop that is really the
     off-screen pause working correctly. */
async function scrolling(rate, label, from, to) {
  await throttle(rate);
  await b.goto(B + '/');
  await sleep(1500);
  await b.evaluate(`scrollTo({top:${from}, behavior:'instant'}),1`);
  await sleep(900);
  await b.evaluate(`(__resetFrames(),
    window.__t0 = performance.now(),
    window.__s0 = (window.__CANVAS_STATS__||{}).frames || 0, 1)`);
  let y = from, dir = 1;
  const started = Date.now();
  while (Date.now() - started < 3000) {
    y += dir * 60;
    if (y > to) { y = to; dir = -1; }
    if (y < from) { y = from; dir = 1; }
    await b.evaluate(`scrollTo({top:${y}, behavior:'instant'}),1`);
  }
  const r = await b.evaluate(`(() => {
    const secs = (performance.now() - window.__t0) / 1000;
    return JSON.stringify({
      pageFps: __fps(),
      sceneFps: Math.round(((((window.__CANVAS_STATS__||{}).frames)||0) - window.__s0) / secs),
    });
  })()`).then(JSON.parse);
  const v = r.pageFps >= 50 ? 'smooth' : r.pageFps >= 30 ? 'OK' : r.pageFps >= 24 ? 'MARGINAL' : 'POOR';
  console.log(`  ${label.padEnd(30)} page ${String(r.pageFps).padStart(3)}fps   globe ${String(r.sceneFps).padStart(3)}fps   ${v}`);
  return r;
}

console.log('\nScrolling continuously through the sticky-stack');
const sc1 = await scrolling(1, '1x unthrottled', 2600, 4200);
const sc4 = await scrolling(4, '4x CPU throttle', 2600, 4200);
const sc6 = await scrolling(6, '6x CPU throttle', 2600, 4200);

await throttle(1);
console.log('\nSummary');
console.log(`  At 4x, the globe holds ${a4.sceneFps}fps and #stage ${a4.stageFps}fps on the same page.`);
console.log(`  At 6x, globe ${a6.sceneFps}fps / #stage ${a6.stageFps}fps.`);
console.log(`  Off-screen the scene contributes ${off.sceneFps}fps — the loop is stopped, not idling.`);
console.log(`  Scrolling through the stack: 4x ${sc4.scene}fps scene / ${sc4.stage}fps #stage; 6x ${sc6.scene}/${sc6.stage}.`);
if (sc6.scene < 30) console.log(`  *** 6x scrolling is ${sc6.scene}fps — below the ~30fps line. Design problem, not a tuning problem. ***`);
else console.log(`  6x while scrolling holds ${sc6.scene}fps — above the ~30fps line.`);
b.close();
