import { launch } from './cdp.mjs';
import fs from 'node:fs';

/* A/B in one session so machine contention affects both arms equally.
   Arm A: /trust  — #stage + nav only.
   Arm B: /        — #stage + nav + globe + sticky-stack.
   Interleaved and repeated, best-of taken, calibration reported alongside. */
const B = process.env.SAGA_TEST_URL || 'http://127.0.0.1:3116';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b = await launch();
await b.send('Page.addScriptToEvaluateOnNewDocument', { source: fs.readFileSync('./tests/probe.js','utf8') });
await b.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

const calib = () => b.evaluate(`(() => { const t=performance.now(); let x=0;
  for (let i=0;i<6e6;i++) x+=Math.sqrt(i); return Math.round(performance.now()-t); })()`);

async function run(path, rate, from, to) {
  await b.send('Emulation.setCPUThrottlingRate', { rate });
  await b.goto(B + path);
  await sleep(1400);
  await b.evaluate(`scrollTo({top:${from}, behavior:'instant'}),1`);
  await sleep(800);
  await b.evaluate('__resetFrames(),1');
  let y = from, dir = 1;
  const t = Date.now();
  while (Date.now() - t < 2500) {
    y += dir * 60;
    if (y > to) { y = to; dir = -1; }
    if (y < from) { y = from; dir = 1; }
    await b.evaluate(`scrollTo({top:${y}, behavior:'instant'}),1`);
  }
  return { fps: await b.evaluate('__fps()'), ms: await calib() };
}

/* Three arms, so the cost can be attributed rather than just observed:
     base   /trust        — #stage + nav only
     stack  Home y5000+   — stack active, globe off-screen (its loop stopped)
     both   Home y2600+   — stack active, globe on screen */
for (const rate of [4, 6]) {
  const acc = { base: [], stack: [], both: [] };
  for (let i = 0; i < 3; i++) {
    acc.base.push(await run('/trust/', rate, 300, 1400));
    acc.stack.push(await run('/', rate, 5000, 6500));
    acc.both.push(await run('/', rate, 2600, 4200));
  }
  const best = rs => rs.reduce((m, r) => (r.fps > m.fps ? r : m));
  const base = best(acc.base), stack = best(acc.stack), both = best(acc.both);
  console.log(`${rate}x`);
  console.log(`   base  #stage+nav only          ${String(base.fps).padStart(3)}fps  [calib ${base.ms}ms]`);
  console.log(`   +stack (globe parked)         ${String(stack.fps).padStart(3)}fps  [calib ${stack.ms}ms]   stack costs ${base.fps - stack.fps}fps`);
  console.log(`   +stack +globe                 ${String(both.fps).padStart(3)}fps  [calib ${both.ms}ms]   globe costs a further ${stack.fps - both.fps}fps`);
}
await b.send('Emulation.setCPUThrottlingRate', { rate: 1 });
b.close();
