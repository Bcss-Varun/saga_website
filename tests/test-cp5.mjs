import { launch } from './cdp.mjs';
import fs from 'node:fs';

const B = process.env.SAGA_TEST_URL || 'http://127.0.0.1:3115';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const out = (l, p, d='') => { console.log(`${p?'  PASS':'  FAIL'}  ${l}${d?' — '+d:''}`); if(!p) process.exitCode = 1; };

const b = await launch();
await b.send('Page.addScriptToEvaluateOnNewDocument', { source: fs.readFileSync('./tests/probe.js','utf8') });
await b.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
const ev = e => b.evaluate(e);

/* Sample the stack's state at a set of absolute scroll positions. `--p` per
   card is the whole output of the engine, so equality across entry paths is
   the acceptance test. */
/* Sample `--p` at fixed ABSOLUTE scroll positions.

   Deriving positions from the stack's top would measure a moving target: the
   hero collapses once the page scrolls, shortening the document and lifting
   the stack ~112px. Same scroll position must mean same state whatever route
   the reader took to get there, so the positions are fixed and the hero is
   settled first. */
const SAMPLE = `(async () => {
  const cards = [...document.querySelectorAll('#pstack .pcard')];
  const step = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  scrollTo({ top: 1200, behavior: 'instant' });   // settle the hero collapse
  await step(); await step();
  const rows = [];
  for (const y of [2400, 2900, 3400, 4200, 5000, 5800, 6600]) {
    scrollTo({ top: y, behavior: 'instant' });
    await step();
    rows.push(cards.map(c => c.style.getPropertyValue('--p').trim()));
  }
  return JSON.stringify(rows);
})()`;

const sample = async () => JSON.parse(await ev(SAMPLE));
const fmt = rows => rows.map(r => r.join('/')).join('  ');

console.log('\n1. Identical behaviour: hard load vs client navigation vs resize');

await b.goto(B + '/');
await sleep(1500);
const hard = await sample();
console.log('   hard load        :', fmt(hard));

// client navigation INTO the route (the case `load` and fonts.ready never cover)
await b.goto(B + '/trust/');
await sleep(900);
await ev(`(()=>{const a=[...document.querySelectorAll('a')].find(a=>new URL(a.href).pathname==='/'); a.click(); return 1;})()`);
await sleep(1500);
const client = await sample();
console.log('   client navigation:', fmt(client));

// after a window resize
await b.send('Emulation.setDeviceMetricsOverride', { width: 1180, height: 780, deviceScaleFactor: 1, mobile: false });
await sleep(400);
await b.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await ev(`dispatchEvent(new Event('resize')),1`);
await sleep(1200);
const resized = await sample();
console.log('   after resize     :', fmt(resized));

out('client navigation matches hard load', JSON.stringify(client) === JSON.stringify(hard),
    JSON.stringify(client) === JSON.stringify(hard) ? 'identical' : 'DIFFERS');
out('post-resize matches hard load', JSON.stringify(resized) === JSON.stringify(hard),
    JSON.stringify(resized) === JSON.stringify(hard) ? 'identical' : 'DIFFERS');

console.log('\n1b. The hero-collapse transient');
/* Scrolling collapses the hero and shifts the stack. Landing on a position
   directly (one scroll, crossing the collapse) must agree with arriving at the
   same position once the hero has already settled. */
await b.goto(B + '/');
await sleep(1400);
const direct = JSON.parse(await ev(`(async () => {
  const cards=[...document.querySelectorAll('#pstack .pcard')];
  scrollTo({top:3400, behavior:'instant'});
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  return JSON.stringify(cards.map(c=>c.style.getPropertyValue('--p').trim()));
})()`));
const settled = JSON.parse(await ev(`(async () => {
  const cards=[...document.querySelectorAll('#pstack .pcard')];
  const step=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  scrollTo({top:1200, behavior:'instant'}); await step(); await step();
  scrollTo({top:3400, behavior:'instant'}); await step();
  return JSON.stringify(cards.map(c=>c.style.getPropertyValue('--p').trim()));
})()`));
const converged = JSON.parse(await ev(`(async () => {
  const cards=[...document.querySelectorAll('#pstack .pcard')];
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  return JSON.stringify(cards.map(c=>c.style.getPropertyValue('--p').trim()));
})()`));
/* One instantaneous jump across the collapse can land a frame early: the hero
   shrink is applied by the nav's own rAF handler, so on that first frame the
   document has not resized yet and there is nothing for the guard to detect.
   What matters is that it self-corrects immediately and does not stay wrong. */
out('lands within one frame of the settled state',
    Math.abs(Number(direct[0]) - Number(settled[0])) < 0.12,
    `direct ${direct[0]} vs settled ${settled[0]}`);
out('converges to the settled state on the next frame',
    JSON.stringify(converged) === JSON.stringify(settled),
    `${direct.join('/')} → ${converged.join('/')} (settled ${settled.join('/')})`);

console.log('\n2. The engine actually drives something (not uniformly 0 or 1)');
const flat = hard.flat().map(Number);
out('--p spans a real range', Math.min(...flat) < 0.05 && Math.max(...flat) > 0.95,
    `min=${Math.min(...flat)} max=${Math.max(...flat)}`);
out('cards progress independently', new Set(hard.map(r => r.join())).size >= 5,
    `${new Set(hard.map(r => r.join())).size} distinct states across 7 scroll points`);

console.log('\n3. Measurement is not time-dependent');
const src = fs.readFileSync('./app/home/Pillars.js', 'utf8');
const codeOnly = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
out('no setTimeout in the stack engine', !/setTimeout/.test(codeOnly));
out('no dependency on load or document.fonts', !/addEventListener\(\s*'load'|document\.fonts/.test(codeOnly));
out('measurement driven by ResizeObserver', /new ResizeObserver/.test(codeOnly));

console.log('\n4. Visual state driven by progress is applied');
await b.goto(B + '/');
await sleep(1200);
const vis = JSON.parse(await ev(`(async () => {
  const step = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  scrollTo({ top: 1200, behavior: 'instant' }); await step(); await step();
  scrollTo({ top: 5000, behavior: 'instant' }); await step();
  const intelOn = document.querySelectorAll('#pIntel .i-in.on, #pIntel .i-out.on').length;
  scrollTo({ top: 7600, behavior: 'instant' }); await step(); await step();
  const steps = document.querySelectorAll('#pFlow .k-cell.on').length;
  const axis = !!document.querySelector('#pFlow.axis');
  const lit = document.querySelectorAll('.pcard.lit').length;
  const marks = [...document.querySelectorAll('.pmark')].map(m => Math.round(parseFloat(m.style.fontSize)||0));
  return JSON.stringify({ intelOn, steps, axis, lit, marks });
})()`));
out('understand card lights its signals', vis.intelOn > 0, `${vis.intelOn} signals on`);
out('act card advances its flow', vis.steps > 0 && vis.axis, `${vis.steps} steps on, axis=${vis.axis}`);
out('cards receive the .lit visibility class', vis.lit > 0, `${vis.lit} lit`);
out('pmark words sized by fitMarks', vis.marks.every(m => m > 20), `font sizes ${vis.marks.join(', ')}px`);

console.log('\n5. Teardown');
await ev(`(()=>{const a=[...document.querySelectorAll('a')].find(a=>new URL(a.href).pathname==='/trust/'); a.click(); return 1;})()`);
await sleep(1000);
const td = JSON.parse(await ev(`JSON.stringify({
  detached: __detachedRetained(), scenes: (window.__CANVAS_STATS__||{}).scenes,
  intervals: __PROBE__.intervals.size, resize: __PROBE__.resizeListeners })`));
out('no observer retains a detached element', td.detached.n === 0, JSON.stringify(td.detached));
out('canvas scene torn down', td.scenes === 0, `scenes=${td.scenes}`);
out('no intervals left', td.intervals === 0, `${td.intervals}`);

const exc = b.events.filter(e=>e.method==='Runtime.exceptionThrown');
const errs = b.events.filter(e=>e.method==='Log.entryAdded' && e.params.entry.level==='error').map(e=>e.params.entry.text);
console.log('\n6. Console');
out('no uncaught exceptions', exc.length===0, exc.length?JSON.stringify(exc[0].params.exceptionDetails?.exception?.description||'').slice(0,200):'');
out('no console errors', errs.length===0, errs.slice(0,2).join(' | '));
b.close();
