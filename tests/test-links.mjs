/* Every internal link on every exported page, checked against the export.
   Static: no browser needed, so it tests what a crawler or a committee opening
   a deep link would actually get. */
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'out';
const pages = [];
const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
  const f = path.join(d, e.name);
  if (e.isDirectory()) walk(f); else if (f.endsWith('.html')) pages.push(f);
});
walk(OUT);

const routeOf = f => {
  const r = '/' + path.relative(OUT, f).replace(/index\.html$/, '').replace(/\\/g, '/');
  return r === '/404.html' ? '/404.html' : r;
};
const exists = href => {
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '/') return fs.existsSync(path.join(OUT, 'index.html'));
  const p = path.join(OUT, clean);
  return fs.existsSync(path.join(p, 'index.html')) || fs.existsSync(p) || fs.existsSync(p + '.html');
};

let broken = 0, checked = 0, external = new Set(), anchors = 0, badAnchor = 0;
const seen = new Map();

for (const f of pages) {
  const html = fs.readFileSync(f, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:)/.test(href)) { external.add(href); continue; }
    if (href.startsWith('#')) {
      anchors++;
      if (!ids.has(href.slice(1))) { badAnchor++; console.log(`  BROKEN ANCHOR  ${routeOf(f)} → ${href}`); }
      continue;
    }
    checked++;
    seen.set(href, (seen.get(href) || 0) + 1);
    if (!exists(href)) { broken++; console.log(`  BROKEN  ${routeOf(f)} → ${href}`); }
  }
}

console.log(`\npages           : ${pages.length}`);
console.log(`internal links  : ${checked} across ${seen.size} distinct targets`);
console.log(`broken          : ${broken}`);
console.log(`in-page anchors : ${anchors} (${badAnchor} pointing at no such id)`);
console.log(`external/mailto : ${[...external].join(', ') || 'none'}`);

/* every exported route must be reachable from at least one other page */
const targets = new Set([...seen.keys()].map(h => h.split('#')[0]));
const orphans = pages.map(routeOf).filter(r => r !== '/' && !r.startsWith('/404') && !targets.has(r));
console.log(`unreachable     : ${orphans.length ? orphans.join(', ') : 'none — every route is linked'}`);
process.exitCode = (broken || badAnchor || orphans.length) ? 1 : 0;
