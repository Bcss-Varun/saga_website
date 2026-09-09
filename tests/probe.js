/* Injected before any app code on every document. Counts real browser
   resources, independently of anything the app reports about itself. */
(() => {
  const P = {
    ioLive: new Map(),        // observer -> Set(targets)
    ioMade: 0, ioKilled: 0,
    rafLive: new Set(), rafMade: 0,
    timers: new Set(), timersMade: 0,
    resizeListeners: 0,
    frameStamps: [],
  };
  window.__PROBE__ = P;

  const IO = window.IntersectionObserver;
  window.IntersectionObserver = class extends IO {
    constructor(cb, opts) { super(cb, opts); P.ioMade++; P.ioLive.set(this, new Set()); }
    observe(t) { P.ioLive.get(this)?.add(t); return super.observe(t); }
    unobserve(t) { P.ioLive.get(this)?.delete(t); return super.unobserve(t); }
    disconnect() { P.ioLive.get(this)?.clear(); P.ioLive.delete(this); P.ioKilled++; return super.disconnect(); }
  };

  const raf = window.requestAnimationFrame, caf = window.cancelAnimationFrame;
  window.requestAnimationFrame = (fn) => {
    P.rafMade++;
    const id = raf((t) => { P.rafLive.delete(id); P.frameStamps.push(t); if (P.frameStamps.length > 400) P.frameStamps.shift(); fn(t); });
    P.rafLive.add(id); return id;
  };
  window.cancelAnimationFrame = (id) => { P.rafLive.delete(id); return caf(id); };

  const st = window.setTimeout, ct = window.clearTimeout;
  window.setTimeout = function (fn, ms, ...a) {
    P.timersMade++;
    const id = st(function () { P.timers.delete(id); return fn.apply(this, arguments); }, ms, ...a);
    P.timers.add(id); return id;
  };
  window.clearTimeout = function (id) { P.timers.delete(id); return ct(id); };

  const si = window.setInterval, ci = window.clearInterval;
  P.intervals = new Set(); P.intervalsMade = 0;
  window.setInterval = function (fn, ms, ...a) {
    P.intervalsMade++;
    const id = si.call(this, fn, ms, ...a); P.intervals.add(id); return id;
  };
  window.clearInterval = function (id) { P.intervals.delete(id); return ci.call(this, id); };

  const ael = window.addEventListener, rel = window.removeEventListener;
  window.addEventListener = function (t, f, o) { if (t === 'resize') P.resizeListeners++; return ael.call(this, t, f, o); };
  window.removeEventListener = function (t, f, o) { if (t === 'resize') P.resizeListeners--; return rel.call(this, t, f, o); };

  /* The exact failure mode: an observer still holding an element that is no
     longer in the document. */
  window.__detachedRetained = () => {
    let n = 0; const detail = [];
    for (const [, targets] of P.ioLive) {
      for (const t of targets) if (!t.isConnected) { n++; detail.push(t.className || t.tagName); }
    }
    return { n, detail };
  };
  /* Observers that actually watch the scene host, attributed by target —
     independent of anything the component reports, and not confused by
     Next's own Link-prefetch observer or by #stage's permanent loop. */
  window.__ourObservers = (sel) => {
    let n = 0;
    for (const [, targets] of P.ioLive) for (const t of targets) if (t.matches?.(sel)) n++;
    return n;
  };
  /* True frame rate: every rAF callback scheduled in the same frame receives
     the same timestamp, so counting callbacks multiplies the rate by however
     many loops the page runs. Count distinct frame timestamps instead. */
  window.__frames = () => new Set(P.frameStamps).size;
  window.__fps = () => {
    const s = P.frameStamps;
    if (s.length < 12) return 0;
    const span = s[s.length - 1] - s[0];
    const distinct = new Set(s).size;
    return span > 0 ? Math.round(((distinct - 1) / span) * 1000) : 0;
  };
  window.__resetFrames = () => { P.frameStamps.length = 0; };
})();
