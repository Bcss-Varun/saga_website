import { launch } from './cdp.mjs';
import fs from 'node:fs';

const B = process.env.SAGA_TEST_URL || 'http://127.0.0.1:3112';
const LAB = B + '/';   // the globe now lives in the pillars section on Home
const OTHER = B + '/trust/';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const out = (l, p, d='') => { console.log(`${p ? '  PASS' : '  FAIL'}  ${l}${d ? ' — ' + d : ''}`); if(!p) process.exitCode = 1; };

const b = await launch();
await b.send('Page.addScriptToEvaluateOnNewDocument', { source: fs.readFileSync('./tests/probe.js', 'utf8') });
const ev = e => b.evaluate(e);
const stats = () => ev(`JSON.stringify({
  app: window.__CANVAS_STATS__ || null,
  probe: { ioLive: __PROBE__.ioLive.size, ioMade: __PROBE__.ioMade, ioKilled: __PROBE__.ioKilled,
           rafLive: __PROBE__.rafLive.size, timers: __PROBE__.timers.size,
           resizeListeners: __PROBE__.resizeListeners },
  detached: __detachedRetained(),
  ourObservers: __ourObservers('.globe'),
})`).then(JSON.parse);

const clickTo = async (path) => {
  await ev(`(() => { const a=[...document.querySelectorAll('a')].find(a=>new URL(a.href).pathname==='${path}');
    if(a){a.click();return 1;} history.pushState({},'','${path}'); dispatchEvent(new PopStateEvent('popstate')); return 2; })()`);
};
// The lab route is not in the nav, so navigate by router where needed.
const goLab = async () => { await b.goto(LAB); };

// ═════ TEST 4 first (clean page state): reduced motion ═════════════
console.log('\nTEST 4 — prefers-reduced-motion draws exactly one frame');
await b.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await goLab();
await ev(`document.querySelector('#pGlobe').scrollIntoView({block:'center'}),1`);
await sleep(1200);
const rm1 = await ev(`JSON.stringify({
  frames: window.__CANVAS_STATS__.frames, rafLive: __PROBE__.rafLive.size, rafMade: __PROBE__.rafMade,
  lit: (()=>{const c=document.querySelector('#pGlobe canvas'),g=c.getContext('2d');
    const d=g.getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>8)n++;return n;})(),
  ourObservers: __ourObservers('.globe'), allObservers: __PROBE__.ioLive.size })`).then(JSON.parse);
await sleep(1000);
const rm2 = await ev(`JSON.stringify({ frames: window.__CANVAS_STATS__.frames, rafLive: __PROBE__.rafLive.size })`).then(JSON.parse);
out('canvas is painted, not blank', rm1.lit > 500, rm1.lit + ' lit px');
out('exactly one frame drawn', rm1.frames === 1, 'frames=' + rm1.frames);
out('frame count does not grow over 1s', rm2.frames === rm1.frames, `${rm1.frames} → ${rm2.frames}`);
out('no animation frame scheduled afterward', rm2.rafLive === 0, 'rafLive=' + rm2.rafLive);
out('no IntersectionObserver on the scene host under reduced motion', rm1.ourObservers === 0,
    `scene-host observers=${rm1.ourObservers} (page total ${rm1.allObservers}, the rest are Next's Link prefetch)`);
await b.send('Emulation.setEmulatedMedia', { features: [] });

// ═════ TEST 5: off-screen stop / restart ═══════════════════════════
console.log('\nTEST 5 — loop stops off-screen, restarts on re-entry');
await goLab();
await ev(`document.querySelector('#pGlobe').scrollIntoView({block:'center'}),1`);
await sleep(700);
const onScreen1 = await ev(`window.__CANVAS_STATS__.frames`);
await sleep(600);
const onScreen2 = await ev(`window.__CANVAS_STATS__.frames`);
out('loop runs while on screen', onScreen2 > onScreen1 + 10, `${onScreen1} → ${onScreen2} frames`);

await ev(`scrollTo(0,0),1`); await sleep(900);
const off1 = await ev(`JSON.stringify({f:window.__CANVAS_STATS__.frames, raf:__PROBE__.rafLive.size, appRaf:window.__CANVAS_STATS__.rafs})`).then(JSON.parse);
await sleep(700);
const off2 = await ev(`JSON.stringify({f:window.__CANVAS_STATS__.frames, raf:__PROBE__.rafLive.size})`).then(JSON.parse);
out('frames stop entirely off-screen', off2.f === off1.f, `${off1.f} → ${off2.f} (no growth)`);
// The one pending rAF on any page is #stage's permanent loop, which by decision 1
// never stops. What must reach zero is this scene's own loop.
out('scene loop fully halted off-screen (not idling)', off1.appRaf === 0,
    `scene rAF loops=${off1.appRaf}; page-wide pending rAF=${off2.raf} (that one is #stage, which never stops by design)`);

const beforeReenter = off2.f;
await ev(`document.querySelector('#pGlobe').scrollIntoView({block:'center'}),1`); await sleep(800);
const back = await ev(`JSON.stringify({f:window.__CANVAS_STATS__.frames, raf:__PROBE__.rafLive.size,
  lit:(()=>{const c=document.querySelector('#pGlobe canvas'),g=c.getContext('2d');
   const d=g.getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>8)n++;return n;})()})`).then(JSON.parse);
out('loop restarts on re-entry', back.f > beforeReenter + 10, `${beforeReenter} → ${back.f} frames`);
out('no visual discontinuity (canvas painted throughout)', back.lit > 500, back.lit + ' lit px');

// ═════ TEST 1 + 2: twenty navigations, frame rate + teardown ═══════
console.log('\nTEST 1/2 — twenty navigations between two routes');
await goLab();
await ev(`document.querySelector('#pGlobe').scrollIntoView({block:'center'}),1`);
await sleep(1000);
await ev(`__resetFrames(),1`); await sleep(1000);
const fpsBefore = await ev(`__fps()`);
const baseline = await stats();

for (let i = 0; i < 20; i++) {
  await b.goto(OTHER);            // hard nav away
  await sleep(120);
  await b.goto(LAB);              // and back
  await ev(`document.querySelector('#pGlobe')?.scrollIntoView({block:'center'}),1`);
  await sleep(160);
}
await sleep(900);
await ev(`__resetFrames(),1`); await sleep(1200);
const fpsAfter = await ev(`__fps()`);
out('frame rate holds across 20 navigations', fpsAfter >= fpsBefore * 0.8 && fpsAfter > 30, `${fpsBefore}fps → ${fpsAfter}fps`);

// Now client-side navigation (no document teardown) — the real leak surface.
console.log('\n  client-side navigation (no reload, leaks accumulate in one document)');
await goLab();
await sleep(600);
const csBase = await stats();
for (let i = 0; i < 20; i++) {
  await ev(`(()=>{const a=[...document.querySelectorAll('a')].find(a=>new URL(a.href).pathname==='/trust/'); a.click(); return 1;})()`);
  await sleep(220);
  await ev(`history.back(),1`);
  await sleep(260);
}
await sleep(900);
const csAfter = await stats();
out('scenes balanced after 20 client navigations', csAfter.app.scenes <= 1, `scenes=${csAfter.app.scenes}`);
out('observers balanced', csAfter.app.observers <= 1 && csAfter.ourObservers <= 1,
    `app=${csAfter.app.observers} scene-host=${csAfter.ourObservers}`);
out('no observer retains a detached element', csAfter.detached.n === 0, JSON.stringify(csAfter.detached));
out('resize listeners balanced', csAfter.probe.resizeListeners - csBase.probe.resizeListeners <= 1,
    `${csBase.probe.resizeListeners} → ${csAfter.probe.resizeListeners}`);
out('no pending or late-firing debounce timers', csAfter.app.timers === 0 && csAfter.app.lateTimerFires === 0,
    `pending=${csAfter.app.timers} lateFires=${csAfter.app.lateTimerFires}`);
out('rAF loops balanced', csAfter.app.rafs <= 1, `appRafs=${csAfter.app.rafs}`);

// ═════ TEST 3: rapid mount/unmount inside the init window ══════════
console.log('\nTEST 3 — rapid mount/unmount during the initialisation window');
await goLab();
await sleep(500);
const rapidBase = await stats();
for (let i = 0; i < 5; i++) {
  await ev(`(()=>{const a=[...document.querySelectorAll('a')].find(a=>new URL(a.href).pathname==='/trust/'); if(a) a.click(); return 1;})()`);
  await sleep(16);   // leave during the very first frame
  await ev(`history.back(),1`);
  await sleep(16);
}
await sleep(1400);
const rapid = await stats();
out('no observer retains a detached canvas after 5 fast flips', rapid.detached.n === 0, JSON.stringify(rapid.detached));
out('scene count did not run away', rapid.app.scenes <= 1, `scenes=${rapid.app.scenes}`);
out('observer count did not run away', rapid.app.observers <= 1 && rapid.ourObservers <= 1,
    `app=${rapid.app.observers} scene-host=${rapid.ourObservers}`);
out('no orphaned or late-firing debounce timers', rapid.app.timers === 0 && rapid.app.lateTimerFires === 0,
    `pending=${rapid.app.timers} lateFires=${rapid.app.lateTimerFires}`);
out('resize listeners did not accumulate', rapid.probe.resizeListeners - rapidBase.probe.resizeListeners <= 1,
    `${rapidBase.probe.resizeListeners} → ${rapid.probe.resizeListeners}`);

// resize fired inside the unmount window must not touch a dead renderer
console.log('\n  resize fired immediately before unmount (debounce vs teardown race)');
await goLab(); await sleep(500);
await ev(`dispatchEvent(new Event('resize')),1`);
await ev(`(()=>{const a=[...document.querySelectorAll('a')].find(a=>new URL(a.href).pathname==='/trust/'); a.click(); return 1;})()`);
await sleep(700);   // longer than the 140ms debounce
const race = await stats();
out('debounce timer cleared by teardown, never fired into a dead scene',
    race.app.timers === 0 && race.app.lateTimerFires === 0,
    `pending=${race.app.timers} lateFires=${race.app.lateTimerFires}`);
out('no detached retention after resize/unmount race', race.detached.n === 0, JSON.stringify(race.detached));

// ═════ errors ══════════════════════════════════════════════════════
const exc = b.events.filter(e => e.method === 'Runtime.exceptionThrown');
const errs = b.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error').map(e => e.params.entry.text);
console.log('\nConsole');
out('no uncaught exceptions across the whole run', exc.length === 0, exc.length ? JSON.stringify(exc[0].params?.exceptionDetails?.exception?.description||'').slice(0,220) : '');
out('no console errors', errs.length === 0, errs.slice(0,2).join(' | '));

b.close();
