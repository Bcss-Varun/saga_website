import { launch, KEY } from './cdp.mjs';
import fs from 'node:fs';
/* Scenarios 7 and 8 assert the UNCONFIGURED-endpoint behaviour, so run this
   against a build with NEXT_PUBLIC_CONTACT_ENDPOINT unset — which is the
   shipping configuration while the destination is [pending: endpoint]. The
   configured path (real POST, success and error states, payload contents) is
   verified separately against a local echo endpoint. */
const B = process.env.SAGA_TEST_URL || 'http://127.0.0.1:3125';
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const out=(l,p,d='')=>{console.log(`${p?'  PASS':'  FAIL'}  ${l}${d?' — '+d:''}`); if(!p) process.exitCode=1;};
const b = await launch();
await b.send('Page.addScriptToEvaluateOnNewDocument', { source: fs.readFileSync('./tests/probe.js','utf8') });
await b.send('Emulation.setDeviceMetricsOverride', { width:1440, height:900, deviceScaleFactor:1, mobile:false });
const ev = e => b.evaluate(e);
const clickTo = async (path) => {
  await ev(`(()=>{const a=[...document.querySelectorAll('a')].find(a=>new URL(a.href).pathname==='${path}'); if(!a) throw new Error('no link '+'${path}'); a.click(); return 1;})()`);
  await sleep(700);
};
const prov = () => ev(`JSON.stringify(JSON.parse(sessionStorage.getItem('saga.visit.v1')||'null'))`).then(JSON.parse);
/* sessionStorage survives navigations in the same tab, so each scenario starts
   from a cleared session — otherwise scenario 2's "direct arrival" inherits
   scenario 1's trail and the test proves nothing. */
const freshSession = async (url) => {
  await b.goto(url);
  await ev('sessionStorage.clear(),1');
  await b.goto(url);
  await sleep(900);
};

console.log('\n1. Provenance survives CLIENT-SIDE navigation (the case document.referrer cannot cover)');
await freshSession(B + '/');
await clickTo('/public-safety/');
await clickTo('/contact/');
const v = await prov();
out('trail records the in-site route sequence', JSON.stringify(v.trail) === JSON.stringify(['/','/public-safety','/contact']), (v.trail||[]).join(' → '));
out('landing page recorded', v.landingPage === '/', v.landingPage);
const selected = await ev(`document.querySelector('#vertical').value`);
out('vertical pre-selected from the source page', selected === 'publicSafety', selected || '(empty)');
const ref = await ev(`document.referrer`);
out('document.referrer is empty here — proving the trail is doing the work', ref === '', `referrer="${ref}"`);

console.log('\n2. Direct arrival (hard load straight to /contact)');
await freshSession(B + '/contact/');
const v2 = await prov();
out('trail holds only /contact', JSON.stringify(v2.trail) === JSON.stringify(['/contact']), (v2.trail||[]).join(' → '));
out('source page is null, and that is recorded', v2.trail.length === 1);
out('vertical left unselected', (await ev(`document.querySelector('#vertical').value`)) === '', 'empty');

console.log('\n3. Provenance survives a reload mid-session');
await freshSession(B + '/');
await clickTo('/governance/');
await b.send('Page.reload');
await sleep(1200);
await clickTo('/contact/');
const v3 = await prov();
out('trail preserved across reload', v3.trail.includes('/governance') && v3.trail[v3.trail.length-1] === '/contact', (v3.trail||[]).join(' → '));
out('routes stored with one consistent spelling (no trailing slashes)',
    v3.trail.every(r => r === '/' || !r.endsWith('/')), (v3.trail||[]).join(' → '));
out('vertical pre-selected as governance', (await ev(`document.querySelector('#vertical').value`)) === 'governance');

console.log('\n4. UTM capture');
await freshSession(B + '/public-safety/?utm_source=gov_portal&utm_campaign=q3&gclid=xyz');
await clickTo('/contact/');
const v4 = await prov();
out('utm parameters captured from the landing URL', v4.utm.utm_source === 'gov_portal' && v4.utm.utm_campaign === 'q3', JSON.stringify(v4.utm));

console.log('\n5. Validation');
await freshSession(B + '/contact/');
await ev(`document.querySelector('button[type=submit]').click(),1`);
await sleep(400);
const errs = await ev(`document.querySelectorAll('[id$="-error"], p[class*="error"]').length`);
const invalid = await ev(`document.querySelectorAll('[aria-invalid="true"]').length`);
out('submitting empty shows inline errors', errs >= 6, errs + ' error messages');
out('invalid fields marked aria-invalid', invalid >= 6, invalid + ' fields');
out('focus moved to the first bad field', (await ev(`document.activeElement.getAttribute('data-field')`)) === 'name');
out('errors name the field, not just colour', (await ev(`[...document.querySelectorAll('p[class*="error"]')].every(e=>e.textContent.trim().length>8)`)) === true);

console.log('\n6. Consent is required and captured explicitly');
await ev(`(()=>{
  const proto = el => el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype
               : el instanceof HTMLSelectElement ? HTMLSelectElement.prototype
               : HTMLInputElement.prototype;
  const set=(id,v)=>{ const el=document.querySelector('#'+id);
    Object.getOwnPropertyDescriptor(proto(el),'value').set.call(el,v);
    el.dispatchEvent(new Event(el instanceof HTMLSelectElement ? 'change' : 'input',{bubbles:true})); };
  set('name','A Officer'); set('organisation','A Department'); set('role','Inspector');
  set('region','A State'); set('message','Evaluating for a procurement exercise.');
  set('vertical','publicSafety');
  return 1; })()`);
await sleep(300);
await ev(`document.querySelector('button[type=submit]').click(),1`);
await sleep(400);
out('cannot submit without consent', (await ev(`!!document.querySelector('#consent[aria-invalid="true"]')`)) === true);
out('still on the form, not a success state', (await ev(`!!document.querySelector('form')`)) === true);

console.log('\n7. Endpoint unconfigured is stated, not faked');
await ev(`document.querySelector('#consent').click(),1`);
await sleep(200);
await ev(`document.querySelector('button[type=submit]').click(),1`);
await sleep(900);
const outcome = await ev(`document.querySelector('[role=status]')?.innerText || ''`);
out('shows the pending-endpoint notice rather than a false success', /no destination configured/i.test(outcome), outcome.split('\n')[0]);
out('says nothing was sent or stored', /nothing has been sent and nothing has been stored/i.test(outcome));

console.log('\n8. Spam protection');
await freshSession(B + '/contact/');   // the form is replaced by the outcome above
const hp = await ev(`JSON.stringify((()=>{const el=document.querySelector('#company_website');
  if(!el) return {present:false}; const r=el.getBoundingClientRect(); const w=el.closest('[aria-hidden="true"]');
  return {present:true, offscreen:r.left < -1000 || r.width<=1, ariaHidden:!!w, tabIndex:el.tabIndex};})())`).then(JSON.parse);
out('honeypot field present', hp.present);
out('honeypot hidden from sight', hp.offscreen);
out('honeypot hidden from assistive tech and tab order', hp.ariaHidden && hp.tabIndex === -1);

/* A fast submission must NOT be silently discarded — a pasting or autofilling
   human is exactly the government lead this project is measured on. */
const fast = await ev(`(()=>{
  const proto = el => el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype
               : el instanceof HTMLSelectElement ? HTMLSelectElement.prototype
               : HTMLInputElement.prototype;
  const set=(id,v)=>{ const el=document.querySelector('#'+id);
    Object.getOwnPropertyDescriptor(proto(el),'value').set.call(el,v);
    el.dispatchEvent(new Event(el instanceof HTMLSelectElement ? 'change' : 'input',{bubbles:true})); };
  set('name','Fast Human'); set('organisation','Dept'); set('role','Officer');
  set('region','A State'); set('message','Pasted from a prepared brief.');
  set('vertical','governance');
  document.querySelector('#consent').click();
  document.querySelector('button[type=submit]').click();
  return 1; })()`);
await sleep(900);
const fastOutcome = await ev(`document.querySelector('[role=status]')?.innerText || ''`);
out('a fast (pasted/autofilled) submission is not silently discarded',
    /no destination configured/i.test(fastOutcome),
    fastOutcome.split('\n')[0] || '(no outcome shown)');

const exc = b.events.filter(e=>e.method==='Runtime.exceptionThrown');
console.log('\n9. Console');
out('no uncaught exceptions', exc.length===0, exc.length?JSON.stringify(exc[0].params.exceptionDetails?.exception?.description||'').slice(0,160):'');
b.close();
