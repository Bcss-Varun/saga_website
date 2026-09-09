/* ═══════════════════════════════════════════════════════════
SAGA scene engine — one canvas, many scenes.
Hand-written projection so the site stays dependency-free.

Ported from Saga.html verbatim apart from its edges: the canvas is passed in,
every listener is tracked for teardown, the rAF handle is retained, the scene
hosts are re-readable, and the window globals are now a returned API.
The projection and scene maths are unchanged.
═══════════════════════════════════════════════════════════ */

export function createStage(cv) {
  const listeners = [];
    const on = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts);
      listeners.push([target, type, fn, opts]);
    };
    let raf = 0;

    const ctx = cv.getContext('2d', { alpha: true });
    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ORANGE = [241, 91, 38], LIFT = [255, 122, 69], GREY = [120, 116, 112];

    let W = 0, H = 0, DPR = 1;
    function resize() {
      DPR = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize(); on(window, 'resize', resize);

    /* ── point cloud ─────────────────────────────────────────── */
    const N = 820;
    const R = new Float32Array(N * 4);        // 4 stable randoms per point
    /* seeded PRNG — bakes must be reproducible, so no Math.random anywhere */
    let _s = 0x9E3779B9 >>> 0;
    const srnd = () => { _s ^= _s << 13; _s >>>= 0; _s ^= _s >> 17; _s ^= _s << 5; _s >>>= 0; return _s / 4294967296; };
    for (let i = 0; i < N; i++) { for (let k = 0; k < 4; k++) R[i * 4 + k] = srnd(); }

    const rnd = (i, k) => R[i * 4 + k];
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
    const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    /* ── projection ──────────────────────────────────────────── */
    let camRY = 0, camRX = 0, px = 0, py = 0;      // pointer parallax
    const FOV = 520;
    /* Where on screen the scene is anchored. Scenes set this so the 3D never
       sits underneath the copy column — the single biggest legibility win. */
    const O = { x: 0, y: 0 };
    let GS = 1;                            // per-scene global scale, set at scene start
    function anchorRight() { O.x = W > 1024 ? W * 0.705 : W * 0.5; O.y = H * 0.5; }
    function fit(base) { GS = base * clamp(Math.min(W, H) / 820, 0.62, 1.55); }
    function anchorCenter() { O.x = W * 0.5; O.y = H * 0.5; }
    function anchorEl(sel, fallbackRight) {
      const el = document.querySelector(sel);
      if (!el) { fallbackRight ? anchorRight() : anchorCenter(); return null; }
      const r = el.getBoundingClientRect();
      if (r.width < 40) { fallbackRight ? anchorRight() : anchorCenter(); return null; }
      O.x = r.left + r.width / 2; O.y = r.top + r.height / 2;
      return r;
    }
    function project(x, y, z, scale) {
      const cy = Math.cos(camRY), sy = Math.sin(camRY);
      let X = x * cy - z * sy, Z = x * sy + z * cy;
      const cx2 = Math.cos(camRX), sx2 = Math.sin(camRX);
      let Y = y * cx2 - Z * sx2; Z = y * sx2 + Z * cx2;
      const d = FOV / (FOV + Z + 340);
      const sc = scale * GS;
      return [O.x + X * d * sc + px, O.y + Y * d * sc + py, d];
    }
    function dot(x, y, z, scale, col, alpha, size) {
      const [sx, sy, d] = project(x, y, z, scale);
      if (d <= 0.05) return;
      const r = size * d, a = alpha * clamp(d * 1.15, 0, 1);
      if (a <= 0.01) return;
      ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a})`;
      ctx.beginPath(); ctx.arc(sx, sy, Math.max(.4, r), 0, 6.283); ctx.fill();
    }
    function line(a, b, scale, col, alpha, w) {
      const p1 = project(a[0], a[1], a[2], scale), p2 = project(b[0], b[1], b[2], scale);
      ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha})`;
      ctx.lineWidth = w || 1;
      ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
    }
    function glow(x, y, rad, col, alpha) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${alpha})`);
      g.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
      ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }

    /* ── world target clouds ─────────────────────────────────── */
    function buildWorld(kind) {
      const out = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const a = rnd(i, 0), b = rnd(i, 1), c = rnd(i, 2), d = rnd(i, 3);
        let x, y, z;
        if (kind === 'publicSafety') {                            // angular city grid
          const g = 7, gx = Math.round(a * g - g / 2), gz = Math.round(b * g - g / 2);
          const along = (c - .5) * 2;
          if (d < .5) { x = gx * 46; z = along * 160; } else { x = along * 160; z = gz * 46; }
          y = d < .14 ? -Math.abs(along) * 86 : (c - .5) * 10;
        } else if (kind === 'governance') {                       // territorial patches
          const k = Math.floor(a * 6), ang = (k / 6) * 6.283;
          const cxx = Math.cos(ang) * 105, czz = Math.sin(ang) * 105;
          const rr = Math.sqrt(b) * 66, th = c * 6.283;
          x = cxx + Math.cos(th) * rr; z = czz + Math.sin(th) * rr; y = (d - .5) * 14 + Math.sin(rr * .05) * 8;
        } else if (kind === 'brands') {                           // radial spread
          const ring = Math.floor(a * 5) + 1, th = b * 6.283, spir = c * .9;
          const rr = ring * 34 + spir * 26;
          x = Math.cos(th + spir) * rr; z = Math.sin(th + spir) * rr; y = (d - .5) * 20 - ring * 4;
        } else if (kind === 'celebrity') {                    // a crowd around one focus
          const H = 6, hub = Math.floor(a * H);
          const ang = (hub / H) * 6.283 + .35, nxt = (((hub + 1) % H) / H) * 6.283 + .35;
          const hx = Math.cos(ang) * 118, hz = Math.sin(ang) * 118;
          if (b < .44) {                                      // the hub itself
            const rr = Math.pow(c, .6) * 30, th = d * 6.283;
            x = hx + Math.cos(th) * rr; z = hz + Math.sin(th) * rr; y = (d - .5) * 26;
          } else {                                            // the run between hubs
            const nx = Math.cos(nxt) * 118, nz = Math.sin(nxt) * 118, f = c;
            x = hx + (nx - hx) * f; z = hz + (nz - hz) * f;
            y = (d - .5) * 12 - Math.sin(f * 3.1416) * 20;
          }
        } else {
          /* Previously an unguarded `else`, which meant any unknown key — a
             typo, or the old pre-rename keys — silently rendered the celebrity
             crowd on the wrong page. Fail loudly in development instead. */
          if (process.env.NODE_ENV !== 'production') {
            throw new Error(`buildWorld: unknown vertical "${kind}" (expected publicSafety, governance, brands or celebrity)`);
          }
          x = 0; y = 0; z = 0;
        }
        out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z;
      }
      return out;
    }
    const CLOUD = {
      publicSafety: buildWorld('publicSafety'), governance: buildWorld('governance'),
      brands: buildWorld('brands'), celebrity: buildWorld('celebrity')
    };

    /* morph state */
    let wFrom = 'governance', wTo = 'governance', wT = 1, wStart = 0;
    const MORPH_MS = 900;

    /* ── scenes ──────────────────────────────────────────────── */
    const scenes = {

      /* 01 — live: signals converge into the core, then branch four ways */
      hero(p, t) {
        anchorRight(); fit(1.45);
        const fade = 1 - clamp((p - .55) / .45, 0, 1);
        if (fade <= 0) return;
        camRY = t * 0.00011; camRX = Math.sin(t * 0.00008) * 0.10;
        const [ccx, ccy] = project(0, 0, 0, 1);
        glow(ccx, ccy, Math.min(W, H) * 0.42, [122, 42, 14], 0.34 * fade);
        glow(ccx, ccy, 74, ORANGE, 0.28 * fade);

        for (let i = 0; i < N; i++) {
          const a = rnd(i, 0), b = rnd(i, 1), c = rnd(i, 2), d = rnd(i, 3);
          const ph = (t * 0.00013 + a) % 1;                     // travel 0→1 inward
          const th = b * 6.283, el = Math.acos(2 * c - 1);
          const far = 330 + d * 250, near = 16;
          const rr = lerp(far, near, ph * ph);
          const x = Math.sin(el) * Math.cos(th) * rr, y = Math.cos(el) * rr * .75, z = Math.sin(el) * Math.sin(th) * rr;
          const hot = ph > .72;
          const col = hot ? LIFT : (d > .55 ? ORANGE : GREY);
          dot(x, y, z, 1, col, (hot ? .95 : .42) * fade, hot ? 1.9 : 1.25);
        }
        /* four branches out of the core */
        for (let k = 0; k < 4; k++) {
          const ang = (k / 4) * 6.283 + t * 0.00011;
          const grow = clamp((Math.sin(t * 0.0006 - k * 1.2) + 1) / 2, 0, 1);
          for (let s = 0; s < 26; s++) {
            const f = s / 26, rr = 30 + f * 210 * grow;
            dot(Math.cos(ang) * rr, -f * 40, Math.sin(ang) * rr, 1, ORANGE, (1 - f) * .62 * fade, 1.5);
          }
        }
        ctx.fillStyle = `rgba(255,255,255,${.9 * fade})`;
        ctx.beginPath(); ctx.arc(ccx, ccy, 4.5, 0, 6.283); ctx.fill();
      },

      /* 02 — noise: everything is loud, three things matter */
      noise(p, t) {
        anchorRight(); fit(1.5);
        glow(O.x, O.y, Math.min(W, H) * 0.34, [122, 42, 14], 0.14);
        camRY = t * 0.00006; camRX = 0.06;
        const settle = easeInOut(clamp(p * 1.25, 0, 1));
        for (let i = 0; i < N; i++) {
          const a = rnd(i, 0), b = rnd(i, 1), c = rnd(i, 2), d = rnd(i, 3);
          const signal = d > 0.9905;                       // ~3 of 820
          const drift = Math.sin(t * 0.0004 + a * 9) * 8;
          const x = (a - .5) * 620, y = (b - .5) * 400 + drift, z = (c - .5) * 420;
          if (signal) {
            const rise = settle * -70;
            dot(x * .35, y * .4 + rise, z * .35, 1, LIFT, 1, lerp(1.6, 4.2, settle));
            const [sx, sy] = project(x * .35, y * .4 + rise, z * .35, 1);
            glow(sx, sy, lerp(0, 52, settle), ORANGE, .5 * settle);
          } else {
            dot(x, y, z, 1, GREY, lerp(.6, .08, settle), lerp(1.8, 1.1, settle));
          }
        }
      },

      /* 03 — observe: scattered sources organise into readable lanes */
      observe(p, t) {
        anchorRight(); fit(1.72);
        glow(O.x, O.y, Math.min(W, H) * 0.30, [122, 42, 14], 0.20);
        camRY = lerp(0.42, 0.10, easeInOut(p)) + t * 0.00004; camRX = lerp(0.05, 0.22, easeInOut(p));
        const o = easeInOut(clamp(p * 1.2, 0, 1));
        const LANES = 7;
        for (let i = 0; i < N; i++) {
          const a = rnd(i, 0), b = rnd(i, 1), c = rnd(i, 2), d = rnd(i, 3);
          const lane = Math.floor(a * LANES);
          const sx = (a - .5) * 640, sy = (b - .5) * 420, sz = (c - .5) * 440;
          const flow = ((t * 0.00016) + d) % 1;
          const tx = lerp(-250, 250, flow), ty = (lane - (LANES - 1) / 2) * 40, tz = (d - .5) * 36;
          const x = lerp(sx, tx, o), y = lerp(sy, ty, o), z = lerp(sz, tz, o);
          dot(x, y, z, 1, d > .72 ? ORANGE : GREY, lerp(.4, .95, o), lerp(1.5, 2.2, o));
        }
        /* lane rails appear as things organise */
        if (o > .35) {
          const al = (o - .35) / .65 * .16;
          for (let l = 0; l < LANES; l++) {
            const y = (l - (LANES - 1) / 2) * 40;
            line([-262, y, 0], [262, y, 0], 1, ORANGE, al * 1.6, 1);
          }
        }
      },

      /* 04 — understand: lanes classify, then connect into a network */
      understand(p, t) {
        anchorRight(); fit(1.62);
        glow(O.x, O.y, Math.min(W, H) * 0.30, [122, 42, 14], 0.22);
        camRY = 0.14 + easeInOut(p) * 0.42 + t * 0.00005; camRX = lerp(0.22, 0.30, p);
        const cls = easeInOut(clamp(p * 2, 0, 1));            // classify
        const net = easeInOut(clamp((p - .42) / .58, 0, 1));    // connect
        const LANES = 7;
        const pos = [];
        for (let i = 0; i < N; i++) {
          const a = rnd(i, 0), b = rnd(i, 1), c = rnd(i, 2), d = rnd(i, 3);
          const lane = Math.floor(a * LANES);
          const flow = ((t * 0.00016) + d) % 1;
          const lx = lerp(-250, 250, flow), ly = (lane - (LANES - 1) / 2) * 40, lz = (d - .5) * 36;
          /* network target: clustered by class */
          const grp = Math.floor(d * 4), ang = (grp / 4) * 6.283 + .4;
          const nx = Math.cos(ang) * 98 + (b - .5) * 70, ny = (c - .5) * 86, nz = Math.sin(ang) * 98 + (a - .5) * 70;
          const x = lerp(lx, nx, net), y = lerp(ly, ny, net), z = lerp(lz, nz, net);
          const risk = d > .86;
          const col = risk ? LIFT : (d > .55 ? ORANGE : GREY);
          dot(x, y, z, 1, col, lerp(.6, risk ? 1 : .85, cls), risk ? 3.0 : 1.9);
          if (i % 7 === 0) pos.push([x, y, z, d]);
        }
        if (net > .05) {
          for (let i = 0; i < pos.length; i++) {
            for (let j = i + 1; j < i + 3 && j < pos.length; j++) {
              const A = pos[i], B = pos[j];
              const dx = A[0] - B[0], dy = A[1] - B[1], dz = A[2] - B[2];
              if (dx * dx + dy * dy + dz * dz < 15000) line(A, B, 1, ORANGE, net * .22, 1);
            }
          }
        }
      },

      /* 05 — act: the network resolves into four owned stages */
      act(p, t) {
        anchorRight(); fit(1.7);
        glow(O.x, O.y, Math.min(W, H) * 0.30, [122, 42, 14], 0.20);
        camRY = lerp(0.95, 0.1, easeInOut(p)); camRX = lerp(0.3, 0.12, easeInOut(p));
        const f = easeInOut(clamp(p * 1.15, 0, 1));
        const STG = 4, ys = [-108, -36, 36, 108];
        for (let i = 0; i < N; i++) {
          const a = rnd(i, 0), b = rnd(i, 1), c = rnd(i, 2), d = rnd(i, 3);
          const grp = Math.floor(d * 4), ang = (grp / 4) * 6.283 + .4;
          const nx = Math.cos(ang) * 98 + (b - .5) * 70, ny = (c - .5) * 86, nz = Math.sin(ang) * 98 + (a - .5) * 70;
          const stg = Math.floor(a * STG);
          const bx = (b - .5) * 250, by = ys[stg] + (c - .5) * 13, bz = (d - .5) * 66;
          const x = lerp(nx, bx, f), y = lerp(ny, by, f), z = lerp(nz, bz, f);
          /* colour cools stage by stage — resolution reads as the orange draining out */
          const heat = 1 - stg / (STG - 1);
          const col = heat > .6 ? LIFT : heat > .3 ? ORANGE : [95, 208, 138];
          dot(x, y, z, 1, f > .5 ? col : ORANGE, lerp(.6, .95, f), 2.1);
        }
        if (f > .3) {
          const al = (f - .3) / .7;
          for (let s = 0; s < STG; s++) {
            const y = ys[s];
            line([-150, y, 0], [150, y, 0], 1, s === STG - 1 ? [95, 208, 138] : ORANGE, al * .22, 1);
          }
        }
      },

      /* 06 — live: the four worlds morph into each other */
      worlds(p, t) {
        const r = anchorEl('#worldslot', false);
        GS = clamp(Math.min(r ? r.width : W, (r ? r.height : H) * 1.5) / 330, .6, 2.1);
        if (r) { ctx.save(); ctx.beginPath(); ctx.rect(r.left, r.top, r.width, r.height); ctx.clip(); }
        camRY = t * 0.00013; camRX = 0.30 + Math.sin(t * 0.0002) * 0.05;
        if (wT < 1) { wT = clamp((t - wStart) / MORPH_MS, 0, 1); }
        const m = easeInOut(wT);
        const A = CLOUD[wFrom], B = CLOUD[wTo];
        const SC = 1.0;
        const [ccx, ccy] = project(0, 0, 0, SC);
        glow(ccx, ccy, 300, [122, 42, 14], 0.5);
        const kind = m > .5 ? wTo : wFrom;
        for (let i = 0; i < N; i++) {
          const j = i * 3;
          const x = lerp(A[j], B[j], m), y = lerp(A[j + 1], B[j + 1], m), z = lerp(A[j + 2], B[j + 2], m);
          const d = rnd(i, 3);
          /* mid-morph everything cools to grey, then re-lights — reads as a system reconfiguring */
          const heat = Math.abs(m - .5) * 2;
          const col = d > .82 ? LIFT : d > .5 ? ORANGE : GREY;
          const mixed = [lerp(GREY[0], col[0], heat), lerp(GREY[1], col[1], heat), lerp(GREY[2], col[2], heat)];
          dot(x, y, z, SC, mixed, d > .82 ? 1 : .82, d > .82 ? 3.2 : 2);
        }
        /* per-world connective tissue */
        ctx.lineWidth = 1;
        if (kind === 'brands') {                   // conversation radiating from the brand
          for (let i = 0; i < N; i += 17) {
            const j = i * 3;
            const x = lerp(A[j], B[j], m), y = lerp(A[j + 1], B[j + 1], m), z = lerp(A[j + 2], B[j + 2], m);
            line([0, 0, 0], [x, y, z], SC, ORANGE, .10, 1);
          }
          const [bx, by] = project(0, 0, 0, SC);
          glow(bx, by, 46, LIFT, .5);
          ctx.fillStyle = 'rgba(255,220,200,.95)';
          ctx.beginPath(); ctx.arc(bx, by, 4.2, 0, 6.283); ctx.fill();
        }
        if (kind === 'publicSafety') {               // scattered signals finding each other
          const pts = [];
          for (let i = 0; i < N; i += 19) {
            const j = i * 3;
            pts.push([lerp(A[j], B[j], m), lerp(A[j + 1], B[j + 1], m), lerp(A[j + 2], B[j + 2], m)]);
          }
          for (let i = 0; i < pts.length; i++) {
            for (let q = i + 1; q < pts.length; q++) {
              const dx = pts[i][0] - pts[q][0], dy = pts[i][1] - pts[q][1], dz = pts[i][2] - pts[q][2];
              if (dx * dx + dy * dy + dz * dz < 5200) line(pts[i], pts[q], SC, LIFT, .22, 1);
            }
          }
        }
        if (r) ctx.restore();
      },

      /* 07 — capability nodes orbiting the core */
      orbit(p, t) {
        anchorRight(); fit(1.35);
        camRY = t * 0.00009; camRX = 0.34;
        const [ccx, ccy] = project(0, 0, 0, 1);
        glow(ccx, ccy, Math.min(W, H) * 0.30, [122, 42, 14], 0.22);
        for (let i = 0; i < N; i++) {
          const a = rnd(i, 0), b = rnd(i, 1), c = rnd(i, 2), d = rnd(i, 3);
          const ring = Math.floor(a * 3) + 1, th = b * 6.283 + t * (0.00007 + ring * 0.00002);
          const rr = ring * 62 + (c - .5) * 22;
          dot(Math.cos(th) * rr, (d - .5) * 30, Math.sin(th) * rr, 1, d > .8 ? ORANGE : GREY, d > .8 ? .75 : .3, d > .8 ? 1.9 : 1.15);
        }
        for (let k = 0; k < 7; k++) {
          const th = (k / 7) * 6.283 + t * 0.00007;
          const rr = 186;
          dot(Math.cos(th) * rr, 0, Math.sin(th) * rr, 1, LIFT, .95, 3.4);
          line([0, 0, 0], [Math.cos(th) * rr, 0, Math.sin(th) * rr], 1, ORANGE, .10, 1);
        }
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.beginPath(); ctx.arc(ccx, ccy, 4, 0, 6.283); ctx.fill();
      }
    };

    /* ── scene selection from scroll ─────────────────────────── */
    let hosts = [];
    /* #stage outlives every page beneath it, so the scene hosts are re-read
       on navigation rather than captured once at startup. */
    function refreshHosts() {
      hosts = [...document.querySelectorAll('[data-scene]')].map(el => ({
        el, name: el.dataset.scene, world: el.dataset.world || null,
      }));
      /* A page picks its vertical form declaratively with data-world. Set it
         outright here rather than morphing, so arriving on a page never plays
         a transition from whatever the previous page happened to show. */
      const declared = hosts.find(h => h.world);
      if (declared && declared.world !== wTo) setWorld(declared.world);
    }
    refreshHosts();
    function activeScene() {
      const mid = H * 0.5; let best = null, bestD = Infinity;
      for (const h of hosts) {
        const r = h.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > H) continue;
        const range = r.height - H;
        const p = range > 4 ? clamp(-r.top / range, 0, 1) : clamp((H * 0.75 - r.top) / (r.height || 1), 0, 1);
        const d = Math.abs((r.top + r.height / 2) - mid);
        if (d < bestD) { bestD = d; best = { name: h.name, p, world: h.world }; }
      }
      return best;
    }

    /* pointer parallax — hero only, and gently */
    let mx = 0, my = 0;
    if (!REDUCED) on(window, 'pointermove', e => { mx = (e.clientX / W - .5); my = (e.clientY / H - .5); }, { passive: true });

    /* ── loop ────────────────────────────────────────────────── */
    let last = 0, fps = 60, frames = 0, acc = 0, quality = 1;
    function frame(t) {
      const cur = activeScene();
      ctx.clearRect(0, 0, W, H);
      if (cur && scenes[cur.name]) {
        // in-page changes of the declared world morph rather than snap
        if (cur.world && cur.world !== wTo) morph(cur.world);
        const heroish = cur.name === 'hero';
        px = lerp(px, mx * (heroish ? 34 : 10), .06);
        py = lerp(py, my * (heroish ? 24 : 8), .06);
        ctx.globalCompositeOperation = 'lighter';
        scenes[cur.name](cur.p, REDUCED ? 0 : t);
        ctx.globalCompositeOperation = 'source-over';
      }
      if (REDUCED) return;                       // one static frame, then stop
      /* auto-degrade: drop DPR if we can't hold frame budget */
      if (last) {
        acc += t - last; frames++;
        if (acc > 1200) {
          fps = frames * 1000 / acc; frames = 0; acc = 0;
          if (fps < 42 && quality === 1) { quality = .7; DPR = 1; resize(); }
        }
      }
      last = t;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    /* ── public API ──────────────────────────────────────────── */
    function render(name, p, t) {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      px = 0; py = 0;
      scenes[name](p, t);
      ctx.globalCompositeOperation = 'source-over';
    }
    function setWorld(k) { wFrom = k; wTo = k; wT = 1; }
    function morph(k) {
      if (k === wTo) return;
      wFrom = wT < 1 ? wFrom : wTo;   // if mid-morph, keep origin so it never snaps
      wTo = k; wT = REDUCED ? 1 : 0; wStart = performance.now();
    }

    /* Only ever called when the stage itself unmounts — not on navigation.
       See decision 1: #stage is the site background, not a page element. */
    function destroy() {
      cancelAnimationFrame(raf);
      for (const [target, type, fn, opts] of listeners) target.removeEventListener(type, fn, opts);
      listeners.length = 0;
      ctx.clearRect(0, 0, W, H);
    }

    return { render, setWorld, morph, refreshHosts, destroy };
}
