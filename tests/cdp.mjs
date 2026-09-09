/* Minimal CDP driver — no dependencies. Node's flagged WebSocket + the
   Chromium already cached by playwright. */
import { spawn } from 'node:child_process';

const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';

export async function launch() {
  const proc = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${process.env.CDP_PORT || 9333}`, '--no-sandbox',
    /* GPU off by default for determinism, but canvas compositing cost is very
       different under software rasterisation — set CDP_GPU=1 when measuring
       anything involving a canvas. */
    ...(process.env.CDP_GPU === '1' ? [] : ['--disable-gpu']),
    '--hide-scrollbars', '--window-size=1440,900',
    `--user-data-dir=/tmp/cdp-profile-saga${process.env.CDP_PORT || ''}`, 'about:blank',
  ], { stdio: 'ignore' });

  let target;
  for (let i = 0; i < 100; i++) {
    await new Promise(r => setTimeout(r, 150));
    try {
      const list = await (await fetch(`http://127.0.0.1:${process.env.CDP_PORT || 9333}/json/list`)).json();
      target = list.find(t => t.type === 'page');
      if (target) break;
    } catch {}
  }
  if (!target) throw new Error('chrome did not start');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));

  let id = 0;
  const pending = new Map();
  const events = [];
  ws.addEventListener('message', (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    else if (msg.method) events.push(msg);
  });

  const send = (method, params = {}) => new Promise((res, rej) => {
    const n = ++id;
    pending.set(n, (msg) => msg.error ? rej(new Error(method + ': ' + msg.error.message)) : res(msg.result));
    ws.send(JSON.stringify({ id: n, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');

  const evaluate = async (expr) => {
    const r = await send('Runtime.evaluate', {
      expression: expr, awaitPromise: true, returnByValue: true,
    });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval failed');
    return r.result.value;
  };

  const goto = async (url) => {
    await send('Page.navigate', { url });
    for (let i = 0; i < 120; i++) {
      await new Promise(r => setTimeout(r, 100));
      const ready = await evaluate('document.readyState');
      if (ready === 'complete') break;
    }
    await new Promise(r => setTimeout(r, 400));
  };

  const key = async (type, opts) => send('Input.dispatchKeyEvent', { type, ...opts });

  return {
    send, evaluate, goto, key, events,
    close: () => { ws.close(); proc.kill(); },
  };
}

export const KEY = {
  Tab: { windowsVirtualKeyCode: 9, key: 'Tab', code: 'Tab' },
  Enter: { windowsVirtualKeyCode: 13, key: 'Enter', code: 'Enter' },
  Escape: { windowsVirtualKeyCode: 27, key: 'Escape', code: 'Escape' },
  ArrowUp: { windowsVirtualKeyCode: 38, key: 'ArrowUp', code: 'ArrowUp' },
  ArrowDown: { windowsVirtualKeyCode: 40, key: 'ArrowDown', code: 'ArrowDown' },
  End: { windowsVirtualKeyCode: 35, key: 'End', code: 'End' },
  Home: { windowsVirtualKeyCode: 36, key: 'Home', code: 'Home' },
};
