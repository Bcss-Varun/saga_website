/* ═══════════════════════════════════════════════════════════
SAGA globe — the `.gcanvas` renderer from the pillars section.

Ported from Saga.html with the drawing maths unchanged. Everything to do
with *when* it draws has been removed: no rAF loop, no resize listener, no
IntersectionObserver, no `spinning` flag. That is <CanvasScene>'s job, so
the two canvases cannot drift into two different lifecycle stories.

Returns the renderer contract <CanvasScene> expects:
  resize()  — re-fit to the container (DPR capped at 2, setTransform)
  draw(t)   — paint one frame at time t
  destroy() — release anything the renderer itself owns
═══════════════════════════════════════════════════════════ */

export function createGlobe(globe) {
    const cvs = globe.querySelector('canvas');
    const g2 = cvs.getContext('2d');
    const chips = [...globe.querySelectorAll('.gchip')];
    const RAD = Math.PI / 180;

    /* simplified coastlines — [lon, lat, …] per landmass */
    const COAST = [
      [-17,15,-16,12,-10,5,0,5,9,4,9,-1,12,-6,12,-17,15,-27,18,-34,25,-34,32,-29,35,-24,40,-16,40,-10,39,-6,41,-2,45,3,51,11,48,12,43,12,39,15,37,22,34,28,32,31,25,32,15,32,10,37,3,36,-5,36,-10,31,-13,25,-17,21],
      [-81,0,-79,-5,-75,-14,-71,-18,-70,-23,-71,-33,-73,-42,-75,-50,-68,-55,-65,-55,-62,-50,-58,-38,-53,-34,-48,-25,-45,-23,-39,-18,-38,-12,-35,-8,-42,-2,-50,0,-52,4,-60,8,-68,11,-75,9,-78,2],
      [-168,66,-160,58,-152,58,-140,60,-130,54,-124,48,-122,37,-117,32,-110,24,-105,20,-95,16,-92,15,-88,16,-87,21,-90,21,-94,19,-97,26,-90,29,-84,30,-80,25,-81,32,-76,37,-70,42,-66,45,-60,47,-56,52,-64,60,-70,63,-85,70,-100,69,-115,70,-130,70,-145,70,-160,71],
      [-10,43,-2,43,0,49,4,52,8,54,12,55,18,55,24,60,30,64,35,66,45,68,60,70,75,73,90,75,105,77,115,73,130,72,140,72,160,69,170,68,178,65,178,62,165,60,160,55,155,50,142,46,135,43,126,38,122,38,120,33,122,30,118,24,110,20,106,10,100,8,98,12,94,18,90,22,85,20,80,15,78,8,73,15,70,22,66,25,61,25,57,25,56,23,58,20,54,17,47,13,43,13,43,17,39,21,36,26,34,31,36,36,30,40,26,40,23,40,20,39,19,42,14,45,12,44,8,44,3,43,0,40,-1,37,-6,36,-9,38],
      [114,-22,113,-26,115,-34,120,-34,129,-32,137,-35,141,-38,146,-39,150,-37,153,-28,146,-19,142,-11,137,-12,130,-12,125,-14,122,-17,117,-20],
      [-45,60,-50,64,-53,68,-55,72,-60,76,-50,82,-30,83,-22,76,-25,70,-35,65],
      [130,32,135,34,140,36,142,40,145,43,141,45,138,37,132,34],
      [-5,50,1,51,0,54,-2,58,-5,58,-6,55],
      [43,-12,50,-15,47,-25,44,-20],
      [173,-35,178,-38,174,-42,167,-46,170,-42,172,-38],
      [95,5,100,0,106,-6,103,-5,97,2],
      [109,2,117,4,119,-3,110,-3],
      [131,-2,141,-3,150,-9,143,-9,134,-8],
      [120,18,124,17,126,10,122,6,120,12],
      [-24,65,-14,66,-15,64,-22,64]
    ];

    function toUnit(flat) {
      const n = flat.length / 2, out = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const lo = flat[i * 2] * RAD, la = flat[i * 2 + 1] * RAD, cl = Math.cos(la);
        out[i * 3] = cl * Math.sin(lo);
        out[i * 3 + 1] = Math.sin(la);
        out[i * 3 + 2] = cl * Math.cos(lo);
      }
      return out;
    }

    const SHAPES = COAST.map(toUnit);

    const GRAT = [];
    for (let lon = -180; lon < 180; lon += 20) {
      const f = []; for (let lat = -82; lat <= 82; lat += 4) f.push(lon, lat);
      GRAT.push(toUnit(f));
    }
    for (let lat = -60; lat <= 60; lat += 20) {
      const f = []; for (let lon = -180; lon <= 180; lon += 6) f.push(lon, lat);
      GRAT.push(toUnit(f));
    }

    /* where each icon's signal comes from — same order as the markup */
    const ANCHOR = [78, 21, -75, 40, 45, 32, 11, 51, -47, -12, 7, 8,
                    145, -30, 26, -29, 139, 36, -119, 36, 110, -5, -100, 20,
                    31, 27, -4, 40, -106, 56, -64, -34, 37, -1, 60, 58];
    const ANC = toUnit(ANCHOR);
    const SHELL = 1.3;                       // radius of the network cage

    /* ── the cage ────────────────────────────────────────────
       Nodes spread evenly over a sphere by the fibonacci spiral, linked
       to anything inside a fixed angle. Every icon is a node too, so the
       mesh closes around them instead of leaving them floating. */
    const NN = 82, GA = Math.PI * (3 - Math.sqrt(5));
    const NODE = new Float32Array((NN + chips.length) * 3);
    for (let i = 0; i < NN; i++) {
      const y = 1 - (i / (NN - 1)) * 2, r = Math.sqrt(Math.max(0, 1 - y * y)), th = GA * i;
      NODE[i * 3] = Math.cos(th) * r; NODE[i * 3 + 1] = y; NODE[i * 3 + 2] = Math.sin(th) * r;
    }
    for (let i = 0; i < chips.length; i++) {
      NODE[(NN + i) * 3] = ANC[i * 3];
      NODE[(NN + i) * 3 + 1] = ANC[i * 3 + 1];
      NODE[(NN + i) * 3 + 2] = ANC[i * 3 + 2];
    }
    const TOTAL = NN + chips.length, LINK = [];
    for (let i = 0; i < TOTAL; i++) for (let j = i + 1; j < TOTAL; j++) {
      const d = NODE[i * 3] * NODE[j * 3] + NODE[i * 3 + 1] * NODE[j * 3 + 1] + NODE[i * 3 + 2] * NODE[j * 3 + 2];
      if (d > .82) LINK.push(i, j);
    }
    const LK = new Int32Array(LINK);

    let cw = 0, ch = 0;
    function sizeCanvas() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cw = globe.clientWidth; ch = globe.clientHeight;
      if (!cw) return;
      cvs.width = cw * dpr; cvs.height = ch * dpr;
      cvs.style.width = cw + 'px'; cvs.style.height = ch + 'px';
      g2.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const TILT = .36, cT = Math.cos(TILT), sT = Math.sin(TILT);
    let R = 0, ox = 0, oy = 0, cs = 1, sn = 0, PX = 0, PY = 0, PZ = 0;

    function proj(u, i, rad) {
      const x = u[i * 3], y0 = u[i * 3 + 1], z0 = u[i * 3 + 2];
      const xr = x * cs + z0 * sn, zr = z0 * cs - x * sn;   // spin about Y
      PZ = y0 * sT + zr * cT;                               // + toward viewer
      PX = ox + xr * R * rad;
      PY = oy - (y0 * cT - zr * sT) * R * rad;
    }

    /* far-side points are pulled onto the limb, so a landmass running over
       the horizon still closes into something fillable */
    function projClamp(u, i) {
      const x = u[i * 3], y0 = u[i * 3 + 1], z0 = u[i * 3 + 2];
      const xr = x * cs + z0 * sn, zr = z0 * cs - x * sn;
      const yv = y0 * cT - zr * sT;
      PZ = y0 * sT + zr * cT;
      let dx = xr, dy = -yv;
      if (PZ < 0) { const L = Math.hypot(dx, dy) || 1e-6; dx /= L; dy /= L; }
      PX = ox + dx * R; PY = oy + dy * R;
    }

    function strokeLine(u, closed, lo, hi) {
      const n = u.length / 3, last = closed ? n : n - 1;
      let open = false;
      for (let k = 0; k <= last; k++) {
        proj(u, k % n, 1);
        if (PZ < lo || PZ > hi) { open = false; continue; }
        if (open) g2.lineTo(PX, PY); else { g2.moveTo(PX, PY); open = true; }
      }
    }

    function cage(lo, hi, lineA, dotA) {
      g2.strokeStyle = `rgba(255,150,105,${lineA})`;
      g2.lineWidth = 1;
      g2.beginPath();
      for (let e = 0; e < LK.length; e += 2) {
        const i = LK[e], j = LK[e + 1];
        proj(NODE, i, SHELL); const ax = PX, ay = PY, az = PZ;
        proj(NODE, j, SHELL); const bz = PZ;
        if ((az + bz) / 2 < lo || (az + bz) / 2 > hi) continue;
        g2.moveTo(ax, ay); g2.lineTo(PX, PY);
      }
      g2.stroke();
      g2.fillStyle = `rgba(255,205,175,${dotA})`;
      for (let i = 0; i < NN; i++) {
        proj(NODE, i, SHELL);
        if (PZ < lo || PZ > hi) continue;
        g2.beginPath(); g2.arc(PX, PY, PZ > 0 ? 2 : 1.5, 0, 6.283); g2.fill();
      }
    }

    function drawEarth(t) {
      if (!cw) return;
      g2.clearRect(0, 0, cw, ch);
      R = Math.min(cw, ch) * .29; ox = cw / 2; oy = ch / 2;
      const spin = t * 0.000048;
      cs = Math.cos(spin); sn = Math.sin(spin);
      g2.lineJoin = 'round'; g2.lineCap = 'round';

      cage(-1.1, 0, .10, .28);                       // cage behind the globe

      /* the globe body */
      const grd = g2.createRadialGradient(ox - R * .34, oy - R * .38, R * .06, ox, oy, R);
      grd.addColorStop(0, 'rgba(241,91,38,.32)');
      grd.addColorStop(.55, 'rgba(126,44,18,.17)');
      grd.addColorStop(1, 'rgba(52,16,6,.10)');
      g2.fillStyle = grd;
      g2.beginPath(); g2.arc(ox, oy, R, 0, 6.283); g2.fill();

      g2.strokeStyle = 'rgba(241,91,38,.10)';        // graticule
      g2.lineWidth = 1;
      g2.beginPath();
      for (const u of GRAT) strokeLine(u, false, .015, 1.1);
      g2.stroke();

      g2.strokeStyle = 'rgba(241,91,38,.13)';        // far-side coasts
      g2.lineWidth = .9;
      g2.beginPath();
      for (const u of SHAPES) strokeLine(u, true, -1.1, .015);
      g2.stroke();

      for (const u of SHAPES) {                      // landmasses, filled
        const n = u.length / 3;
        let mz = -2;
        for (let k = 0; k < n; k++) { proj(u, k, 1); if (PZ > mz) mz = PZ; }
        if (mz < .02) continue;
        g2.beginPath();
        for (let k = 0; k < n; k++) { projClamp(u, k); if (k) g2.lineTo(PX, PY); else g2.moveTo(PX, PY); }
        g2.closePath();
        g2.fillStyle = 'rgba(241,91,38,.30)'; g2.fill();
        g2.strokeStyle = 'rgba(255,176,136,.95)'; g2.lineWidth = 1.35; g2.stroke();
      }

      g2.strokeStyle = 'rgba(255,150,105,.34)';      // limb
      g2.lineWidth = 1.1;
      g2.beginPath(); g2.arc(ox, oy, R, 0, 6.283); g2.stroke();
    }

    /* ── the sources ─────────────────────────────────────────
       Each icon sits on the cage directly above its own place on the map
       and turns with it, tethered to the surface by a signal line. Once
       its anchor rotates past the limb the icon fades out. */
    function placeChips() {
      for (let i = 0; i < chips.length; i++) {
        const el = chips[i];
        proj(ANC, i, 1);
        const sx = PX, sy = PY, z = PZ;
        if (z < .05) { el.style.opacity = '0'; continue; }
        proj(ANC, i, SHELL);
        const ex = PX, ey = PY;
        const a = Math.min((z - .05) / .28, 1);

        g2.strokeStyle = `rgba(255,140,95,${(a * .75).toFixed(3)})`;
        g2.lineWidth = 1.1;
        g2.beginPath(); g2.moveTo(sx, sy); g2.lineTo(ex, ey); g2.stroke();

        g2.fillStyle = `rgba(255,215,190,${a.toFixed(3)})`;
        g2.beginPath(); g2.arc(sx, sy, 2.4, 0, 6.283); g2.fill();
        g2.strokeStyle = `rgba(241,91,38,${(a * .5).toFixed(3)})`;
        g2.lineWidth = 1;
        g2.beginPath(); g2.arc(sx, sy, 5.6, 0, 6.283); g2.stroke();

        el.style.transform = `translate(-50%,-50%) translate(${(ex - cw / 2).toFixed(1)}px,${(ey - ch / 2).toFixed(1)}px) scale(${(.84 + z * .18).toFixed(3)})`;
        el.style.opacity = a.toFixed(3);
        el.style.zIndex = 60 + Math.round(z * 30);
      }
    }
    /* One frame. The caller decides whether there is ever another. */
    function draw(t) {
      drawEarth(t);
      placeChips();
      cage(0, 1.1, .28, .88);                        // cage in front of the globe
    }

    function destroy() {
      // The renderer owns no listeners, timers or observers by design.
      // Chip transforms are inline styles on elements React will remove.
      g2.setTransform(1, 0, 0, 1, 0, 0);
      g2.clearRect(0, 0, cvs.width, cvs.height);
    }

    return { resize: sizeCanvas, draw, destroy };
}
