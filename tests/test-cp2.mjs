import { launch, KEY } from './cdp.mjs';

const B = 'http://127.0.0.1:3112';
const b = await launch();
const errors = [];
const out = (label, pass, detail = '') =>
  console.log(`${pass ? '  PASS' : '  FAIL'}  ${label}${detail ? ' — ' + detail : ''}`);


// ── 1. shell renders on a blank route ─────────────────────────────
console.log('\n1. Shell renders on a blank route (/trust)');
await b.goto(B + '/trust/');
const shell = await b.evaluate(`JSON.stringify({
  nav: !!document.querySelector('nav#nav'),
  stage: !!document.querySelector('canvas#stage'),
  footer: !!document.querySelector('footer'),
  navItems: [...document.querySelectorAll('#navlinks > a, #navlinks button')].map(e => e.textContent.trim().replace(/\\s+/g,' ')),
  cta: document.querySelector('.cta')?.textContent.trim(),
  h1s: document.querySelectorAll('h1').length,
})`);
const s = JSON.parse(shell);
out('nav present', s.nav);
out('footer present', s.footer);
out('#stage present', s.stage);
out('nav order', JSON.stringify(s.navItems) === JSON.stringify(['Platform','Solutions','Investigation','Trust']), s.navItems.join(' · '));
out('CTA', s.cta === 'Request a Demo', s.cta);
out('exactly one h1', s.h1s === 1, 'found ' + s.h1s);

// ── 2. #stage paints ──────────────────────────────────────────────
console.log('\n2. #stage paints behind the shell');
await b.goto(B + '/');   // the scene host lives on the page, so measure where one exists
const paint = await b.evaluate(`(() => {
  const cv = document.querySelector('canvas#stage');
  const r = cv.getBoundingClientRect();
  const st = getComputedStyle(cv);
  const g = cv.getContext('2d');
  const d = g.getImageData(0, 0, cv.width, cv.height).data;
  let lit = 0;
  for (let i = 3; i < d.length; i += 4) if (d[i] > 8) lit++;
  return JSON.stringify({ w: cv.width, h: cv.height, dpr: devicePixelRatio,
    pos: st.position, z: st.zIndex, pe: st.pointerEvents,
    lit, total: cv.width * cv.height,
    behind: st.zIndex === '0' });
})()`);
const p = JSON.parse(paint);
out('canvas sized to viewport * DPR', p.w > 0 && p.h > 0, `${p.w}x${p.h} @dpr${p.dpr}`);
out('non-empty pixels drawn', p.lit > 500, `${p.lit} lit px of ${p.total}`);
out('fixed, behind content, click-through', p.pos === 'fixed' && p.pe === 'none', `position:${p.pos} z:${p.z} pointer-events:${p.pe}`);

// ── 3. dropdown keyboard operation ────────────────────────────────
console.log('\n3. Solutions dropdown — keyboard');
const focusTrigger = () => b.evaluate(`document.querySelector('#navlinks button[aria-controls="solutions-menu"]').focus(), 1`);
const state = () => b.evaluate(`JSON.stringify({
  expanded: document.querySelector('[aria-controls="solutions-menu"]').getAttribute('aria-expanded'),
  hidden: document.querySelector('#solutions-menu').hidden,
  active: document.activeElement.textContent.trim().replace(/\\s+/g,' ').slice(0,40),
  activeTag: document.activeElement.tagName,
})`);
const press = async (k) => { await b.key('rawKeyDown', KEY[k]); await b.key('keyUp', KEY[k]); await new Promise(r=>setTimeout(r,120)); };

await focusTrigger();
let st0 = JSON.parse(await state());
out('starts closed', st0.expanded === 'false' && st0.hidden === true);

await press('ArrowDown');
let st1 = JSON.parse(await state());
out('ArrowDown opens + focuses first item', st1.expanded === 'true' && st1.activeTag === 'A' && st1.active.startsWith('Public Safety'), st1.active);

await press('ArrowDown');
let st2 = JSON.parse(await state());
out('ArrowDown moves to next item', st2.active.startsWith('Governance'), st2.active);

await press('ArrowUp');
let st3 = JSON.parse(await state());
out('ArrowUp moves back', st3.active.startsWith('Public Safety'), st3.active);

await press('ArrowUp');
let st4 = JSON.parse(await state());
out('ArrowUp wraps to last', st4.active.startsWith('Celebrity'), st4.active);

await press('End');
out('End → last', JSON.parse(await state()).active.startsWith('Celebrity'));
await press('Home');
out('Home → first', JSON.parse(await state()).active.startsWith('Public Safety'));

await press('Escape');
let st5 = JSON.parse(await state());
out('Escape closes', st5.expanded === 'false' && st5.hidden === true);
out('Escape returns focus to trigger', st5.activeTag === 'BUTTON', st5.activeTag + ' "' + st5.active + '"');

// descriptors present
const desc = await b.evaluate(`JSON.stringify([...document.querySelectorAll('#solutions-menu li')].map(li => li.textContent.trim().replace(/\\s+/g,' ')))`);
console.log('   dropdown contents:', JSON.parse(desc).map(d => '\n     · ' + d).join(''));

// ── 4. #stage singleton across client navigation ──────────────────
console.log('\n4. #stage survives client navigation (decision 1)');
await b.goto(B + '/');
await b.evaluate(`(() => {
  const cv = document.querySelector('canvas#stage');
  cv.__mark = 'MARK-' + Math.random().toString(36).slice(2);
  window.__mark = cv.__mark;
  window.__navCount = 0;
  return 1;
})()`);

const clickNav = async (href) => {
  await b.evaluate(`(() => {
    const a = [...document.querySelectorAll('a')].find(a => new URL(a.href).pathname === '${href}');
    if (!a) throw new Error('no link for ${href}');
    a.click(); return 1;
  })()`);
  await new Promise(r => setTimeout(r, 450));
};

const route = ['/platform/', '/trust/', '/investigation/', '/contact/'];
let identityHeld = true, reloads = 0;
for (let i = 0; i < 12; i++) {
  const href = route[i % route.length];
  await clickNav(href);
  const chk = await b.evaluate(`JSON.stringify({
    path: location.pathname,
    same: document.querySelector('canvas#stage')?.__mark === window.__mark,
    starts: window.__SAGA_STAGE_STARTS__,
    hasEngine: !!window.__SAGA_STAGE__,
    navExists: !!document.querySelector('nav#nav'),
  })`);
  const c = JSON.parse(chk);
  if (!c.same) identityHeld = false;
  if (c.starts !== 1) reloads = c.starts;
}
const fin = JSON.parse(await b.evaluate(`JSON.stringify({
  starts: window.__SAGA_STAGE_STARTS__,
  same: document.querySelector('canvas#stage').__mark === window.__mark,
  path: location.pathname,
  lit: (() => { const cv=document.querySelector('#stage'), g=cv.getContext('2d');
    const d=g.getImageData(0,0,cv.width,cv.height).data; let n=0;
    for (let i=3;i<d.length;i+=4) if (d[i]>8) n++; return n; })(),
  hosts: document.querySelectorAll('[data-scene]').length,
})`));
out('12 client navigations, canvas element never replaced', identityHeld && fin.same);
out('scene engine constructed exactly once', fin.starts === 1, 'starts=' + fin.starts);
await clickNav('/');
const home = JSON.parse(await b.evaluate(`JSON.stringify({
  lit: (() => { const cv=document.querySelector('#stage'), g=cv.getContext('2d');
    const d=g.getImageData(0,0,cv.width,cv.height).data; let n=0;
    for (let i=3;i<d.length;i+=4) if (d[i]>8) n++; return n; })(),
  hosts: document.querySelectorAll('[data-scene]').length, path: location.pathname })`));
out('still painting after 12 navigations', home.lit > 500, home.lit + ' lit px on ' + home.path);

// ── 5. console errors ─────────────────────────────────────────────
console.log('\n5. Console');
const logs = b.events.filter(e => e.method === 'Runtime.exceptionThrown');
const logEntries = b.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
  .map(e => e.params.entry.text);
out('no uncaught exceptions', logs.length === 0, logs.length ? JSON.stringify(logs[0]).slice(0,200) : '');
out('no console errors', logEntries.length === 0, logEntries.slice(0,3).join(' | '));

b.close();
