/* Does the navigation actually navigate? Clicks every nav, dropdown and footer
   control in a real browser and checks the page that arrives is the page named
   — header links, the Solutions dropdown, the header CTA, the logo, Escape
   behaviour, every footer link, and the mobile menu at 420px.

   Static link integrity is `test-links.mjs`; this one is about behaviour. */
import { launch, KEY } from './cdp.mjs';
const B = process.env.SAGA_TEST_URL || 'http://127.0.0.1:3130';
const b = await launch();
let fail = 0;
const out = (l, p, d='') => { console.log(`${p?'  PASS':'  FAIL'}  ${l}${d?' — '+d:''}`); if(!p) fail++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

await b.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await b.goto(B + '/');

console.log('\nHeader nav — client-side navigation');
for (const [label, want] of [['Platform','/platform/'], ['Investigation','/investigation/'], ['Trust','/trust/']]) {
  await b.evaluate(`[...document.querySelectorAll('nav a')].find(a=>a.textContent.trim()==='${label}').click()`);
  await sleep(700);
  const got = await b.evaluate('location.pathname');
  const h1  = await b.evaluate('document.querySelector("h1")?.textContent.slice(0,42)');
  out(`${label} → ${want}`, got === want, `${got} · h1 "${h1}"`);
  await b.evaluate('history.back(),1'); await sleep(600);
}

console.log('\nSolutions dropdown');
await b.evaluate(`document.querySelector('[aria-controls="solutions-menu"]').focus()`);
await b.key('rawKeyDown', KEY.ArrowDown); await b.key('keyUp', KEY.ArrowDown); await sleep(350);
out('opens on ArrowDown', await b.evaluate(`document.querySelector('[aria-controls="solutions-menu"]').getAttribute('aria-expanded')==='true'`));
const items = await b.evaluate(`JSON.stringify([...document.querySelectorAll('#solutions-menu a')].map(a=>[a.textContent.trim().split('\\n')[0], new URL(a.href).pathname]))`);
console.log('    items:', items);
for (const [name, href] of JSON.parse(items)) {
  await b.evaluate(`document.querySelector('#solutions-menu a[href="${href}"]').click()`);
  await sleep(700);
  const got = await b.evaluate('location.pathname');
  out(`${name} → ${href}`, got === href, got);
  await b.goto(B + '/');
}

console.log('\nFooter links');
await b.evaluate(`document.querySelector('footer').scrollIntoView({block:'end',behavior:'instant'})`);
const flinks = JSON.parse(await b.evaluate(`JSON.stringify([...document.querySelectorAll('footer a')].map(a=>[a.textContent.trim(), a.getAttribute('href')]))`));
for (const [txt, href] of flinks) {
  if (href.startsWith('mailto:')) { out(`${txt} (mailto)`, true, href); continue; }
  await b.evaluate(`document.querySelector('footer a[href="${href}"]').click()`);
  await sleep(700);
  const got = await b.evaluate('location.pathname');
  out(`${txt} → ${href}`, got.replace(/\/$/,'/') === (href.endsWith('/')?href:href+'/'), got);
  await b.goto(B + '/');
  await b.evaluate(`document.querySelector('footer').scrollIntoView({block:'end',behavior:'instant'})`);
}

await b.goto(B + '/public-safety/');
console.log('\nHeader CTA and logo');
await b.evaluate(`document.querySelector('nav a.cta').click()`); await sleep(700);
out('header "Request a Demo" → /contact/', await b.evaluate('location.pathname') === '/contact/');
await b.evaluate(`document.querySelector('nav a[href="/"], nav a[href="/contact/"] ~ *') && document.querySelector('nav a[href="/"]').click()`); await sleep(700);
out('logo → home', await b.evaluate('location.pathname') === '/');

console.log('\nEscape closes the dropdown and returns focus');
await b.evaluate(`document.querySelector('[aria-controls="solutions-menu"]').focus()`);
await b.key('rawKeyDown', KEY.ArrowDown); await b.key('keyUp', KEY.ArrowDown); await sleep(300);
await b.key('rawKeyDown', KEY.Escape); await b.key('keyUp', KEY.Escape); await sleep(300);
out('closed', await b.evaluate(`document.querySelector('[aria-controls="solutions-menu"]').getAttribute('aria-expanded')==='false'`));
out('focus back on the trigger', await b.evaluate(`document.activeElement===document.querySelector('[aria-controls="solutions-menu"]')`));

console.log('\nMobile menu at 420px');
await b.send('Emulation.setDeviceMetricsOverride', { width: 420, height: 820, deviceScaleFactor: 1, mobile: true });
await b.goto(B + '/');
await sleep(600);
const tog = await b.evaluate(`(()=>{const t=document.querySelector('.navtoggle, [aria-label*="enu"], button[aria-expanded]'); return t?t.className+'|'+(t.getAttribute('aria-label')||''):null;})()`);
console.log('    toggle:', tog);
await b.evaluate(`document.querySelector('.navtoggle, [aria-label*="enu"]').click()`); await sleep(500);
const open = await b.evaluate(`(()=>{const m=document.querySelector('.nav-menu'); return m? getComputedStyle(m).display+'/'+getComputedStyle(m).visibility+'/'+getComputedStyle(m).transform : 'no .nav-menu';})()`);
console.log('    menu after click:', open);
const links = await b.evaluate(`document.querySelectorAll('.nav-menu a').length`);
out('mobile menu exposes its links', links > 0, links + ' links');
await b.evaluate(`document.querySelector('.nav-menu a[href="/trust/"]').click()`); await sleep(800);
out('mobile link navigates', await b.evaluate('location.pathname') === '/trust/', await b.evaluate('location.pathname'));


console.log(fail ? `\n${fail} FAILED` : '\nEvery navigation control works');
b.close(); process.exitCode = fail ? 1 : 0;
