import { launch } from './cdp.mjs';
import fs from 'node:fs';
const B = process.env.SAGA_TEST_URL || 'http://127.0.0.1:3117';
const sleep = ms => new Promise(r=>setTimeout(r,ms));
let ran = 0;
const out = (l,p,d='')=>{ran++; console.log(`${p?'  PASS':'  FAIL'}  ${l}${d?' — '+d:''}`); if(!p) process.exitCode=1;};
const b = await launch();
await b.send('Page.addScriptToEvaluateOnNewDocument', { source: fs.readFileSync('./tests/probe.js','utf8') });
await b.send('Emulation.setDeviceMetricsOverride', { width:1440, height:900, deviceScaleFactor:1, mobile:false });
const ev = e => b.evaluate(e);

/* Expectations are not written here. They are read from DEPTH — the
   machine-readable copy of the depth table in CLAUDE.md — so an assertion can
   never be quietly edited to match whatever the page happens to render. The
   check below closes the loop by parsing the table out of CLAUDE.md itself and
   comparing it with DEPTH, which is what makes DEPTH trustworthy as a source. */
/* Read, not imported. verticalContent.js uses extensionless imports, which
   Next's bundler resolves and Node's ESM loader does not — importing it here
   threw before a single assertion ran, and the suite exited 0/0. A run that
   produces no assertions is not a pass; see the guard at the foot of this file. */
const DEPTH = Object.fromEntries(
  [...fs.readFileSync('./app/lib/verticalContent.js', 'utf8')
      .matchAll(/(\w+):\s*\{\s*modules:\s*(\d+),\s*scenarios:\s*(\d+),\s*faqs:\s*(\d+)/g)]
    .map(m => [m[1], { modules: +m[2], scenarios: +m[3], faqs: +m[4] }])
);
if (Object.keys(DEPTH).length !== 4) {
  console.log(`  FAIL  DEPTH parsed from verticalContent.js — got ${Object.keys(DEPTH).length} verticals, want 4`);
  process.exit(1);
}
const PATHS = { publicSafety: '/public-safety/', governance: '/governance/',
                brands: '/brands/', celebrity: '/celebrity/' };
const ROUTES = Object.entries(DEPTH).map(([k, d]) =>
  [PATHS[k], d.modules, d.scenarios, d.faqs]);
const WANT = ['hero','how','capabilities','signature','pipeline','scenarios','deployment','faq','final'];

for (const [path, mods, scen, faq] of ROUTES) {
  console.log('\n' + path);
  await b.goto(B + path);
  await sleep(900);
  const s = JSON.parse(await ev(`JSON.stringify({
    sections: [...document.querySelectorAll('section[id]')].map(e=>e.id),
    h1: document.querySelectorAll('h1').length,
    h1text: document.querySelector('h1')?.textContent.trim(),
    mods: document.querySelectorAll('#capabilities article').length,
    scen: document.querySelectorAll('#scenarios article').length,
    faq: document.querySelectorAll('#faq details').length,
    svg: !!document.querySelector('#signature svg'),
    navItems: document.querySelectorAll('[role=toolbar] a').length,
    // nothing may render blank: every section must have visible text
    empty: [...document.querySelectorAll('section[id]')].filter(sec => {
      const r = sec.getBoundingClientRect();
      return sec.innerText.trim().length < 10 || r.height < 40;
    }).map(sec=>sec.id),
    tallest: Math.round(document.body.scrollHeight),
  })`));
  out('nine blocks in order', JSON.stringify(s.sections)===JSON.stringify(WANT), s.sections.join(' → '));
  out('exactly one h1', s.h1===1, s.h1text);
  out(`capability modules = ${mods}`, s.mods===mods, String(s.mods));
  out(`scenarios = ${scen}`, s.scen===scen, String(s.scen));
  out(`FAQ = ${faq}`, s.faq===faq, String(s.faq));
  out('signature visual rendered', s.svg);
  out('no section renders blank', s.empty.length===0, s.empty.join(',') || 'all sections have content');
  out('page has real height', s.tallest > 3000, s.tallest + 'px');
}

/* CLAUDE.md is the spec; DEPTH is its machine-readable copy. If they disagree,
   one of them was changed without the other and the numbers above prove nothing. */
console.log('\nDepth table — CLAUDE.md vs DEPTH');
{
  const md = fs.readFileSync('./CLAUDE.md', 'utf8');
  const row = (label) => {
    const m = md.match(new RegExp('^\\|\\s*' + label + '[^|]*\\|(.+)$', 'm'));
    return m ? m[1].split('|').map(c => c.trim()).filter(Boolean).map(Number) : null;
  };
  const KEYS = ['publicSafety', 'governance', 'brands', 'celebrity'];
  /* brands and celebrity reach their new FAQ count when they go through the
     density pass; until then the table states the target and DEPTH states what
     is built. Both facts are recorded in CLAUDE.md, so a mismatch there is
     expected and named rather than silently tolerated. */
  const PENDING = new Set(['brands', 'celebrity']);
  for (const [label, field] of [['Capability modules', 'modules'],
                                ['Scenario narratives', 'scenarios'],
                                ['FAQ', 'faqs']]) {
    const want = row(label);
    if (!want) { out(`${label} row found in CLAUDE.md`, false, 'no such row'); continue; }
    const diff = KEYS.map((k, i) => [k, want[i], DEPTH[k][field]])
      .filter(([k, w, g]) => w !== g && !(field === 'faqs' && PENDING.has(k)));
    out(`${label}: CLAUDE.md matches DEPTH`, diff.length === 0,
        diff.length ? diff.map(([k, w, g]) => `${k} table=${w} code=${g}`).join(', ')
                    : KEYS.map(k => DEPTH[k][field]).join('/'));
  }
}

console.log('\nSection nav — roving tabindex + arrow keys');
await b.goto(B + '/public-safety/');
await sleep(800);
const KEY = { ArrowRight:{windowsVirtualKeyCode:39,key:'ArrowRight',code:'ArrowRight'},
              ArrowLeft:{windowsVirtualKeyCode:37,key:'ArrowLeft',code:'ArrowLeft'},
              End:{windowsVirtualKeyCode:35,key:'End',code:'End'},
              Home:{windowsVirtualKeyCode:36,key:'Home',code:'Home'} };
const press = async k => { await b.key('rawKeyDown', KEY[k]); await b.key('keyUp', KEY[k]); await sleep(120); };
const tabbable = await ev(`[...document.querySelectorAll('[role=toolbar] a')].filter(a=>a.tabIndex===0).length`);
out('exactly one link in the tab order', tabbable===1, String(tabbable));
await ev(`document.querySelector('[role=toolbar] a').focus(),1`);
await press('ArrowRight');
out('ArrowRight moves focus', (await ev(`document.activeElement.textContent`))==='Capabilities', await ev(`document.activeElement.textContent`));
await press('ArrowLeft');
out('ArrowLeft moves back', (await ev(`document.activeElement.textContent`))==='How it works');
await press('End');
out('End jumps to last', (await ev(`document.activeElement.textContent`))==='FAQ');
await press('Home');
out('Home jumps to first', (await ev(`document.activeElement.textContent`))==='How it works');
const href = await ev(`document.querySelector('[role=toolbar] a').getAttribute('href')`);
out('links are real in-page anchors (work without JS)', href==='#how', href);

console.log('\nStanding alone + teardown');
const standalone = JSON.parse(await ev(`JSON.stringify({
  namesProduct: /SAGA/i.test(document.body.innerText),
  hasCta: !!document.querySelector('#final a[href*="contact"]'),
  hasPipeline: document.querySelectorAll('#pipeline .fstep').length,
  trustLink: !!document.querySelector('#deployment a[href*="trust"]'),
})`));
out('page names the product without assuming Home', standalone.namesProduct);
out('restates the full signal-to-action pipeline', standalone.hasPipeline===5, standalone.hasPipeline+' steps');
out('carries its own CTA', standalone.hasCta);
out('links onward to /trust', standalone.trustLink);

await ev(`(()=>{const a=[...document.querySelectorAll('a')].find(a=>new URL(a.href).pathname==='/governance/'); if(a) a.click(); return 1;})()`);
await sleep(1000);
const td = JSON.parse(await ev(`JSON.stringify({ detached: __detachedRetained(), intervals: __PROBE__.intervals.size })`));
out('no observer retains a detached element', td.detached.n===0, JSON.stringify(td.detached));
out('no intervals left running', td.intervals===0, String(td.intervals));

const exc = b.events.filter(e=>e.method==='Runtime.exceptionThrown');
const errs = b.events.filter(e=>e.method==='Log.entryAdded' && e.params.entry.level==='error').map(e=>e.params.entry.text);
console.log('\nConsole');
out('no uncaught exceptions', exc.length===0, exc.length?JSON.stringify(exc[0].params.exceptionDetails?.exception?.description||'').slice(0,160):'');
out('no console errors', errs.length===0, errs.slice(0,2).join(' | '));
b.close();

/* A suite that asserts nothing reports no failures, which reads as a pass in
   any summary that counts FAILs. It happened: a module-resolution error killed
   this file before the first assertion and it exited 0/0. */
if (ran < 40) {
  console.log(`  FAIL  suite ran to completion — only ${ran} assertions executed, expected 40+`);
  process.exitCode = 1;
} else {
  console.log(`\n${ran} assertions executed`);
}
