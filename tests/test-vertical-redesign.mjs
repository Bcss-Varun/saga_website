import { launch, KEY } from './cdp.mjs';
import fs from 'node:fs';
const base = process.env.SAGA_TEST_URL || 'http://127.0.0.1:3000';
const routes = {
 'public-safety': ['hero','overview','monitoring','investigate','casework','workflow','scenarios','deployment','faq','contact'],
 governance: ['hero','overview','local-intelligence','impact','grievances','briefings','scenarios','deployment','faq','contact'],
 brands: ['hero','overview','risk','issues','response','scenarios','outputs','faq','contact'],
 celebrity: ['hero','overview','activity','communities','endorsements','scenarios','outputs','faq','contact'],
};
const browser = await launch();
const failures=[];
function check(label,pass,detail=''){ console.log((pass?'PASS ':'FAIL ')+label+(detail?' — '+detail:'')); if(!pass)failures.push(label); }
const links = new Set();
try {
 for(const [route,sections] of Object.entries(routes)){
  for(const width of [1440,768,390,320]){
   await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
   await browser.goto(base+'/'+route+'/');
   await browser.evaluate('document.fonts.ready.then(()=>true)');
   const state = await browser.evaluate(`({
    sections: [...document.querySelectorAll('section[id]')].map(e=>e.id),
    h1: document.querySelectorAll('h1').length,
    title: document.title,
    intro: document.querySelector('#hero').innerText,
    images: [...document.querySelectorAll('[data-vertical] img')].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})),
    overflow: [...document.querySelectorAll('[data-vertical] *')].filter(e=>{
      const r=e.getBoundingClientRect();return r.width>0 && (r.right>innerWidth+2 || r.left < -2);
    }).slice(0,8).map(e=>e.tagName+'.'+e.className),
    faqs: document.querySelectorAll('#faq details').length,
    links: [...document.querySelectorAll('[data-vertical] a')].map(a=>a.getAttribute('href')),
    placeholders: /pending sign-off|placeholder|SOC.EYE|draft — needs review/i.test(document.querySelector('[data-vertical]').innerText),
    badAnchors:[...document.querySelectorAll('[data-vertical] a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash),
    height:document.documentElement.scrollHeight
   })`);
   check(route+' '+width+'px layout',state.overflow.length===0,state.overflow.join(','));
   if(width===1440){
    check(route+' section order',JSON.stringify(state.sections)===JSON.stringify(sections),state.sections.join(' → '));
    check(route+' standalone introduction',state.h1===1 && state.intro.includes('Blura SAGA') && /social media intelligence platform/i.test(state.intro));
    check(route+' unique branded metadata',state.title.includes('Blura SAGA') && !state.title.includes('draft'),state.title);
    check(route+' images loaded',state.images.length===1&&state.images.every(i=>i.loaded));
    check(route+' 8 complete FAQs',state.faqs===8);
    check(route+' no placeholder copy',!state.placeholders);
    check(route+' local anchors resolve',state.badAnchors.length===0);
    state.links.filter(l=>l.startsWith('/')&&!l.startsWith('//')).forEach(l=>links.add(l));
    const shot=await browser.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:1440,height:state.height,scale:1}});
    fs.writeFileSync('/tmp/saga-'+route+'-desktop.png',Buffer.from(shot.data,'base64'));
   }
   if(width===390){
    const shot=await browser.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:390,height:state.height,scale:1}});
    fs.writeFileSync('/tmp/saga-'+route+'-mobile.png',Buffer.from(shot.data,'base64'));
   }
  }
  await browser.evaluate("document.querySelector('#faq summary').focus()");
  await browser.key('keyDown',{...KEY.Enter,text:'\r',unmodifiedText:'\r'});await browser.key('keyUp',KEY.Enter);
  check(route+' FAQ keyboard opens',await browser.evaluate("document.querySelector('#faq details').open"));
  await browser.key('keyDown',{...KEY.Enter,text:'\r',unmodifiedText:'\r'});await browser.key('keyUp',KEY.Enter);
  check(route+' FAQ keyboard closes',!await browser.evaluate("document.querySelector('#faq details').open"));
  const html=await (await fetch(base+'/'+route+'/')).text();
  check(route+' content in server HTML',html.includes('Blura SAGA')&&html.includes('id="overview"')&&html.includes('id="faq"'));
 }
 for(const href of links){
  const [path,anchor]=href.split('#');
  const response=await fetch(base+path);const html=await response.text();
  check('Related page '+href,response.ok && (!anchor||html.includes('id="'+anchor+'"')));
 }
 check('No runtime exceptions',browser.events.filter(e=>e.method==='Runtime.exceptionThrown').length===0);
} finally { browser.close(); }
console.log(failures.length+' failures');
if(failures.length)process.exitCode=1;
