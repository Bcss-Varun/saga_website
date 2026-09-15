import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { launch } from './cdp.mjs';

const b = await launch();
const base = process.env.SAGA_TEST_URL || 'http://127.0.0.1:3130';
const sizes = [[1920, 1080], [1440, 900], [1366, 768], [1280, 720],
  [1280, 600], [1024, 640], [960, 540], [768, 1024], [390, 844], [320, 568]];
try {
  await b.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const route of ['/', '/platform/', '/investigation/', '/public-safety/', '/governance/', '/brands/', '/celebrity/', '/trust/', '/contact/']) {
    await b.goto(base + route);
    await b.evaluate('document.fonts.ready.then(() => true)');
    for (const [width, height] of sizes) {
      await b.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
      await b.evaluate('window.scrollTo(0, 0)');
      await new Promise(r => setTimeout(r, 150));
      const result = await b.evaluate(`(() => {
        const errors = [];
        if (!document.querySelector('h1')) errors.push('missing page');
        if (document.documentElement.scrollWidth > innerWidth + 1) errors.push('horizontal overflow');
        const hero = document.querySelector('.homeHero');
        if (hero && innerWidth >= 981 && innerHeight >= 600 && hero.getBoundingClientRect().bottom > innerHeight + 1) errors.push('home hero exceeds viewport');
        for (const card of document.querySelectorAll('.pcard')) {
          const rect = card.getBoundingClientRect();
          if (getComputedStyle(card).position === 'sticky' && rect.height + parseFloat(getComputedStyle(card).top) > innerHeight + 1) errors.push(card.id + ' exceeds pinned viewport');
          for (const child of card.querySelectorAll('.pcopy, .globe, .ivis, .fvis')) {
            const r = child.getBoundingClientRect();
            if (r.bottom > rect.bottom + 1 || r.right > rect.right + 1 || r.left < rect.left - 1) errors.push(card.id + ' clips ' + child.className);
          }
        }
        return errors;
      })()`);
      console.log(route, width + 'x' + height, result.length ? result : 'PASS');
      assert.deepEqual(result, [], route + ' ' + width + 'x' + height);
      if (route === '/' && width === 1280 && height === 720) {
        writeFileSync('/tmp/saga-hero-1280.png', Buffer.from((await b.send('Page.captureScreenshot')).data, 'base64'));
        await b.evaluate("window.scrollTo(0, document.querySelector('#p-observe').getBoundingClientRect().top + scrollY - 92)");
        await new Promise(r => setTimeout(r, 200));
        writeFileSync('/tmp/saga-observe-1280.png', Buffer.from((await b.send('Page.captureScreenshot')).data, 'base64'));
      }
    }
  }
} finally { b.close(); }
