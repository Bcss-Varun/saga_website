import { launch } from './cdp.mjs';
import fs from 'node:fs';

/* Repeatable scroll frame-rate measurement.
   Frame rate is counted from DISTINCT rAF timestamps (several loops run per
   frame). Each arm reports the CPU-throttle calibration next to it so runs are
   comparable across a machine whose background load varies. Best of N. */
const B = process.env.SAGA_TEST_URL || 'http://127.0.0.1:3116';
const RATE = +(process.env.RATE || 6);
const REPS = +(process.env.REPS || 3);
const sleep = ms => new Promise(r => setTimeout(r, ms));

const ARMS = [
  ['/trust  (#stage + nav only)',        '/trust/',  300, 1400],
  ['Home    stack OFF screen',           '/',        8500, 10000],
  ['Home    stack ON screen (no globe)', '/',        5000, 6500],
  ['Home    stack + globe',              '/',        2600, 4200],
];

const b = await launch();
await b.send('Page.addScriptToEvaluateOnNewDocument', { source: fs.readFileSync('./tests/probe.js','utf8') });
await b.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
const calib = () => b.evaluate(`(()=>{const t=performance.now();let x=0;for(let i=0;i<6e6;i++)x+=Math.sqrt(i);return Math.round(performance.now()-t);})()`);

async function one(path, from, to) {
  await b.send('Emulation.setCPUThrottlingRate', { rate: RATE });
  await b.goto(B + path);
  await sleep(1400);
  await b.evaluate(`scrollTo({top:${from}, behavior:'instant'}),1`);
  await sleep(800);
  await b.evaluate('__resetFrames(),1');
  let y = from, dir = 1; const t = Date.now();
  while (Date.now() - t < 2500) {
    y += dir * 60; if (y > to) { y = to; dir = -1; } if (y < from) { y = from; dir = 1; }
    await b.evaluate(`scrollTo({top:${y}, behavior:'instant'}),1`);
  }
  return { fps: await b.evaluate('__fps()'), ms: await calib() };
}

console.log(`\n${RATE}x CPU throttle · best of ${REPS} · ${process.env.LABEL || ''}`);
for (const [label, path, from, to] of ARMS) {
  const runs = [];
  for (let i = 0; i < REPS; i++) runs.push(await one(path, from, to));
  const best = runs.reduce((m, r) => (r.fps > m.fps ? r : m));
  const flag = best.fps >= 30 ? '' : '   <-- under 30fps';
  console.log(`  ${label.padEnd(36)} ${String(best.fps).padStart(3)}fps  [calib ${best.ms}ms]${flag}`);
}
await b.send('Emulation.setCPUThrottlingRate', { rate: 1 });
b.close();
