import { launch } from './cdp.mjs';
import fs from 'node:fs';

const B = process.env.SAGA_TEST_URL || 'http://127.0.0.1:3112';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const out = (l, p, d='') => { console.log(`${p?'  PASS':'  FAIL'}  ${l}${d?' — '+d:''}`); if(!p) process.exitCode = 1; };

const b = await launch();
await b.send('Page.addScriptToEvaluateOnNewDocument', { source: fs.readFileSync('./tests/probe.js','utf8') });
const ev = e => b.evaluate(e);

console.log('\n1. Home renders in the new order');
await b.goto(B + '/');
await sleep(900);
const s = JSON.parse(await ev(`JSON.stringify({
  order: [...document.querySelectorAll('section[id], section.sec')].map(e=>e.id).filter(Boolean),
  h1: document.querySelectorAll('h1').length,
  worlds: !!document.querySelector('#worlds, #rail'),
  chips: document.querySelectorAll('.gchip').length,
  faqs: document.querySelectorAll('#faq details').length,
  doors: [...document.querySelectorAll('.route')].map(a=>new URL(a.href).pathname),
  macbook: !!document.querySelector('#mbDevice'),
})`));
const want = ['hero','showcase','challenge','pillars','doors','capabilities','flow','faq','final'];
out('section order matches the brief', JSON.stringify(s.order)===JSON.stringify(want), s.order.join(' → '));
out('exactly one h1', s.h1===1, 'h1='+s.h1);
out('worlds tab widget removed', !s.worlds);
out('four doors link to the four routes', JSON.stringify(s.doors)===JSON.stringify(['/governance/','/public-safety/','/brands/','/celebrity/']), s.doors.join(' '));
out('globe present (18 chips)', s.chips===18, 'chips='+s.chips);
out('console showcase present', s.macbook);
out('FAQ trimmed to platform-level questions', s.faqs>=4 && s.faqs<=5, s.faqs+' entries');

console.log('\n2. Dashboard timers stop when the section leaves the viewport');
/* Home also runs one page-level interval that is not the dashboard's: the hero
   question rotator. Since checkpoint 6 that rotator pauses when the hero
   leaves the viewport, so the baseline has to be taken at the SAME scroll
   position used for the off-screen check below (top of page, hero visible,
   dashboard away) — otherwise the two measurements differ by the rotator and
   the dashboard's own contribution cannot be isolated. */
await ev(`scrollTo({top:0, behavior:'instant'}),1`); await sleep(1400);
const base = JSON.parse(await ev(`JSON.stringify({ intervals: __PROBE__.intervals.size })`));
console.log(`  (page baseline with dashboard stopped: ${base.intervals} interval — the hero rotator)`);
await ev(`document.querySelector('#mbDevice').scrollIntoView({block:'center'}),1`);
await sleep(1400);
const onS = JSON.parse(await ev(`JSON.stringify({ intervals: __PROBE__.intervals.size })`));
/* The two page-level interval owners are never active at the same scroll
   position — the dashboard runs when the device is on screen, the hero rotator
   when the hero is. So assert the exact expected totals rather than trying to
   subtract a constant baseline. */
out('dashboard arms its six intervals on screen (hero rotator paused)', onS.intervals === 6,
    `${onS.intervals} intervals with the device on screen`);

// capture whether the DOM keeps mutating while away
await ev(`scrollTo({top:0, behavior:'instant'}),1`); await sleep(1500);
const offS = JSON.parse(await ev(`JSON.stringify({ intervals: __PROBE__.intervals.size })`));
const feedA = await ev(`document.querySelector('#sdFeed').innerHTML.length`);
await sleep(5200);                    // longer than the slowest interval (7.4s? use feed 4.2s)
const feedB = await ev(`document.querySelector('#sdFeed').innerHTML.length`);
const offS2 = JSON.parse(await ev(`JSON.stringify({ intervals: __PROBE__.intervals.size })`));
out('all six dashboard intervals cleared off-screen', offS.intervals === 1,
    `${onS.intervals} → ${offS.intervals} (the 1 remaining is the hero rotator, now back on screen)`);
out('dashboard stops mutating off-screen', feedA === feedB, `feed html ${feedA} → ${feedB} chars`);
out('nothing re-arms itself while away', offS2.intervals === 1, `${offS2.intervals} intervals`);

console.log('\n3. Restart on re-entry');
await ev(`document.querySelector('#mbDevice').scrollIntoView({block:'center'}),1`);
await sleep(1200);
const back = JSON.parse(await ev(`JSON.stringify({ intervals: __PROBE__.intervals.size })`));
out('dashboard intervals restart on re-entry', back.intervals === 6,
    `${back.intervals} intervals back`);

console.log('\n4. Teardown on navigation away from Home');
await ev(`(()=>{const a=[...document.querySelectorAll('a')].find(a=>new URL(a.href).pathname==='/trust/'); a.click(); return 1;})()`);
await sleep(1200);
const gone = JSON.parse(await ev(`JSON.stringify({
  intervals: __PROBE__.intervals.size,
  detached: __detachedRetained(),
  scenes: (window.__CANVAS_STATS__||{}).scenes,
  path: location.pathname })`));
out('all dashboard intervals cleared on unmount', gone.intervals === 0, `${gone.intervals} left on ${gone.path}`);
out('no observer retains a detached element', gone.detached.n === 0, JSON.stringify(gone.detached));
out('canvas scene torn down with the page', gone.scenes === 0, `scenes=${gone.scenes}`);

console.log('\n5. Reduced motion');
await b.send('Emulation.setEmulatedMedia', { features: [{name:'prefers-reduced-motion', value:'reduce'}] });
await b.goto(B + '/');
await ev(`document.querySelector('#mbDevice').scrollIntoView({block:'center'}),1`);
await sleep(1600);
const rm = JSON.parse(await ev(`JSON.stringify({
  intervals: __PROBE__.intervals.size,
  sceneFrames: (window.__CANVAS_STATS__||{}).frames,
  globeLit: (()=>{const c=document.querySelector('#pGlobe canvas'); if(!c) return -1;
    const g=c.getContext('2d'); const d=g.getImageData(0,0,c.width,c.height).data;
    let n=0; for(let i=3;i<d.length;i+=4) if(d[i]>8) n++; return n;})(),
  questions: document.querySelectorAll('#heroQ .q').length })`));
out('no dashboard intervals under reduced motion', rm.intervals === 0, `${rm.intervals}`);
out('globe drawn as a single static frame', rm.sceneFrames === 1 && rm.globeLit > 500, `frames=${rm.sceneFrames} lit=${rm.globeLit}`);
out('all hero questions remain in the DOM', rm.questions === 4, `${rm.questions} questions`);
await b.send('Emulation.setEmulatedMedia', { features: [] });

console.log('\n6. Console');
const exc = b.events.filter(e=>e.method==='Runtime.exceptionThrown');
const errs = b.events.filter(e=>e.method==='Log.entryAdded' && e.params.entry.level==='error').map(e=>e.params.entry.text);
out('no uncaught exceptions', exc.length===0, exc.length?JSON.stringify(exc[0].params.exceptionDetails?.exception?.description||'').slice(0,200):'');
out('no console errors', errs.length===0, errs.slice(0,2).join(' | '));
b.close();

console.log('\n7. No-JavaScript fallback (content must not depend on a scroll trigger)');
{
  const b2 = await (await import('./cdp.mjs')).launch();
  await b2.send('Emulation.setScriptExecutionDisabled', { value: true });
  await b2.goto(B + '/');
  await sleep(600);
  const vis = JSON.parse(await b2.evaluate(`JSON.stringify({
    h1: (()=>{const e=document.querySelector('h1'); const s=getComputedStyle(e);
      return { text: e.textContent.trim().slice(0,40), opacity: s.opacity, display: s.display };})(),
    hiddenRv: [...document.querySelectorAll('.rv,.cv')].filter(e=>+getComputedStyle(e).opacity === 0).length,
    totalRv: document.querySelectorAll('.rv,.cv').length,
    doors: document.querySelectorAll('.route').length,
  })`));
  out('h1 visible without JavaScript', vis.h1.opacity === '1', `opacity=${vis.h1.opacity} "${vis.h1.text}"`);
  out('no .rv/.cv content hidden without JavaScript', vis.hiddenRv === 0, `${vis.hiddenRv} of ${vis.totalRv} hidden`);
  out('four doors present without JavaScript', vis.doors === 4, `${vis.doors} doors`);
  b2.close();
}
