/* Static sweeps over the built export — no browser needed. */
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'out';
/* The console mock is an illustration of a product UI. Its contents are
   excluded from the copy sweeps and tracked separately — see the BLOCKER entry
   at the top of copy/APPROVALS.md, and the assertion below that it stays
   tracked. Sweeping it as prose would bury a claims problem in a list of
   digits. */
const stripMock = h => h.replace(/<div class="mb-screen"[\s\S]*?<img class="mb-frame"/g, ' ');
const strip = h => {
  let t = stripMock(h).replace(/<script[\s\S]*?<\/script>/g, ' ')
           .replace(/<style[\s\S]*?<\/style>/g, ' ')
           .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
           .replace(/<[^>]+>/g, ' ');
  return t.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&mdash;/g,'—')
          .replace(/&rarr;/g,'→').replace(/&rsquo;/g,'’').replace(/&apos;/g,"'")
          .replace(/&#x27;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>')
          .replace(/\s+/g,' ').trim();
};
const pages = [];
(function walk(d){ for (const e of fs.readdirSync(d,{withFileTypes:true})) {
  const f = path.join(d,e.name);
  if (e.isDirectory()) walk(f); else if (e.name.endsWith('.html')) pages.push(f); } })(OUT);

let fail = 0;
const out=(l,p,d='')=>{console.log(`${p?'  PASS':'  FAIL'}  ${l}${d?' — '+d:''}`); if(!p){fail++;process.exitCode=1;}};

console.log(`\n8. Sitewide sweep over ${pages.length} exported pages`);

const BANNED = ['court-admissible','tamper-proof','legally defensible','reputation shield','bulk x action'];
let hits = [];
for (const f of pages) { const t = strip(fs.readFileSync(f,'utf8')).toLowerCase();
  for (const b of BANNED) if (t.includes(b)) hits.push(`${f}: ${b}`); }
out('no banned phrases', hits.length===0, hits.join(' | '));

/* Numbers: everything rendered as visible text, minus the ones with a reason. */
const ALLOWED = new Set(['01','02','03','04','05','0','100','1','2','2026']);
let nums = {};
for (const f of pages) {
  for (const m of strip(fs.readFileSync(f,'utf8')).matchAll(/\b\d[\d,.]*[MK+%]?\b/g)) {
    if (!ALLOWED.has(m[0])) (nums[m[0]] ||= []).push(path.basename(path.dirname(f)));
  }
}
out('no unapproved numbers in visible copy', Object.keys(nums).length===0,
    Object.keys(nums).length ? Object.entries(nums).map(([n,p])=>`${n} (${[...new Set(p)].join(',')})`).join(' | ')
    : 'only 01–05 pipeline steps, the 0–100 score scale, Level-1/2 and the footer year');

/* Every [pending sign-off] marker must be reflected in APPROVALS.md. */
const approvals = fs.readFileSync('copy/APPROVALS.md','utf8').toLowerCase();
let markers = new Map();
for (const f of pages) {
  for (const m of strip(fs.readFileSync(f,'utf8')).matchAll(/\[pending sign-off(?::\s*([^\]]+))?\]/g)) {
    const k = (m[1]||'(unlabelled)').trim().toLowerCase();
    markers.set(k, (markers.get(k)||0)+1);
  }
}
const KEYWORD = { 'deployment model':'deployment model', 'role names':'role names',
  'sources and coverage for this tool':'email and phone intelligence',
  'which languages beyond these four are supported':'languages beyond english',
  'which languages beyond english, telugu, hindi and urdu are supported':'languages beyond english',
  'deployment model — on-premise, private cloud, or department-hosted':'on-premise',
  'tier labels':'tier labels', 'escalation intervals':'escalation intervals',
  'retention period':'retention', 'attribution thresholds':'attribution threshold',
  'scoring thresholds':'scoring threshold', 'window length':'window',
  'band labels':'band labels', 'read-logging':'read-logging',
  'contractual terms':'contractual terms', 'default weighting scheme':'weighting',
  'exact span':'span', 'confirm supported topologies':'topolog',
  'retention period for enquiry data':'enquiry', '(unlabelled)':'descriptor' };
let missing = [];
for (const k of markers.keys()) {
  const needle = KEYWORD[k] || k;
  if (!approvals.includes(needle)) missing.push(k);
}
out(`every [pending sign-off] marker is tracked in APPROVALS.md (${markers.size} distinct, ${[...markers.values()].reduce((a,b)=>a+b,0)} occurrences)`,
    missing.length===0, missing.length ? 'untracked: '+missing.join(', ') : [...markers.keys()].slice(0,6).join(', ')+'…');

/* Walk the whole chunk tree. This used to read only the top level of
   out/_next/static/chunks and skip directories — which is precisely where the
   instrumentation lands (chunks/app/page-*.js), so the check reported a clean
   export for a build that carried it. Verified by running it against a
   NEXT_PUBLIC_CANVAS_STATS=1 build and confirming it now fails. */
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const f = path.join(dir, e.name);
  return e.isDirectory() ? walk(f) : [f];
});
const chunks = walk('out/_next/static').filter(f => f.endsWith('.js'));
const instHits = [...pages, ...chunks].filter(f =>
  /__CANVAS_STATS__|__SAGA_STAGE__/.test(fs.readFileSync(f, 'utf8')));
out(`zero verification instrumentation in the export (${chunks.length} chunks scanned)`,
    instHits.length === 0, instHits.length ? instHits.join(", ") : "0");

/* The console mock used to publish a five-platform coverage list and scale
   figures; APPROVALS.md item 0 records what it was and what was done. Because
   stripMock() removes the mock from the prose sweeps above, nothing else here
   would notice it coming back — so assert directly that neither the markup nor
   the shipped JavaScript carries a platform identity or a headline figure. */
const mockSrc = [...pages, ...chunks].map(f => fs.readFileSync(f, 'utf8')).join('\n');
const leaks = ['X (Twitter)', 'Telegram', '1877F2', 'DD2A7B', '229ED9',
               '2.45e6', '98.6e6', '1.25e6', 'Total Mentions 2.45M']
  .filter(t => mockSrc.includes(t));
out('the console mock publishes no platform identity or scale figure',
    leaks.length === 0, leaks.length ? 'LEAKED: ' + leaks.join(', ') : 'none of 9 markers present');

const mockRecorded = approvals.includes('console mock') && approvals.includes('item 0');
out('APPROVALS.md still records what the mock was doing', mockRecorded,
    mockRecorded ? 'APPROVALS.md item 0' : 'NOT RECORDED');

const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
out('runtime dependencies still three', Object.keys(pkg.dependencies).length===3, Object.keys(pkg.dependencies).join(', '));

const routes = pages.filter(f=>f.endsWith('index.html')).length;
out('all eleven routes exported as static HTML', routes===10 && fs.existsSync('out/404.html'),
    `${routes} index.html + 404.html`);
console.log(`\n${fail===0 ? 'SWEEP CLEAN' : fail+' SWEEP CHECK(S) FAILED'}`);
