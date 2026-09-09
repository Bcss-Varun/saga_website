/* The console showcase's live dashboard, ported from Saga.html.

   Templates and data are unchanged; what changed is ownership. Every
   `document.getElementById('sd…')` is now scoped to the component root, and
   every timer is tracked so the whole thing can be stopped when the section
   leaves the viewport and torn down on unmount. The original set six
   intervals and never cleared them.

   Same split as the globe (checkpoint 3): this module draws, the component
   decides when.

   Figures and platform names are withheld. The showcase depicts the console;
   it does not report on it. Volumes, reach, shares and a platform coverage
   list are unapproved claims (CLAUDE.md, "Claims — hard rules"), and a
   fabricated number inside a product screenshot asserts itself more
   forcefully than the same number in a headline, not less. Every figure is
   therefore rendered as a redaction bar of the right size, and the platform
   rows carry no names and no brand colours. Shape stays — sparklines, donut
   arcs, bar widths and the movement of all three — because shape is what
   makes the object credible and it claims nothing.

   Redaction rather than blur: it survives print (these pages get printed and
   forwarded inside government departments), it reads unambiguously as
   withheld rather than as a rendering fault, and it cannot be squinted back
   into a number.

   The line between what is redacted and what stays: UI furniture stays,
   anything a reader could mistake for a finding becomes a bar. So the menubar
   clock, the date-range filter, the filter pills, the relative timestamps and
   the version string remain — they are controls and chrome, and no finding can
   be read off them. Volumes, reach, shares, counts, durations and sequential
   record ids do not remain, wherever they appear, including inside the prose
   of a feed item. A single surviving figure in a redacted panel reads as the
   one thing the vendor was willing to show, which makes it more conspicuous
   rather than less. [copy: needs specificity rewrite] */

export function createDashboard(root) {
  const timers = new Set();
  let running = false;

  const track = (id) => { timers.add(id); return id; };
  const every = (fn, ms) => track(setInterval(fn, ms));

  const rnd = (a, b) => a + Math.random() * (b - a);
  /* A withheld figure: an inline bar sized like the number it replaces.
     currentColor keeps the up/down colour rhythm of the row it sits in. */
  const red = (w) => `<span class="sd-redact" style="--w:${w}em"></span>`;

  const spark = (n, up) => {
    let pts = [], v = rnd(30, 55);
    for (let i = 0; i < n; i++) { v += rnd(-9, up ? 12 : 7); v = Math.max(8, Math.min(52, v)); pts.push(`${(i / (n - 1) * 100).toFixed(1)},${(60 - v).toFixed(1)}`); }
    return pts.join(' ');
  };

  /* `up` is a direction only — it sets the arrow, the delta colour and the
     drift of the sparkline. No magnitude is carried, so none can be rendered. */
  const kpis = [
    { lbl: 'Total Mentions', up: 1, c: '#2E6BE6', bg: '#EAF1FE', ic: '📈' },
    { lbl: 'High Risk Alerts', up: 0, c: '#E5372B', bg: '#FEE4E2', ic: '⚠' },
    { lbl: 'Grievances', up: 1, c: '#7C4DFF', bg: '#F0EBFF', ic: '💬' },
    { lbl: 'Positive Sentiment', up: 1, c: '#12B76A', bg: '#D1FADF', ic: '☺' },
    { lbl: 'Potential Reach', up: 1, c: '#2E6BE6', bg: '#EAF1FE', ic: '👥' }
  ];
  root.querySelector('#sdKpis').innerHTML = kpis.map((k, i) => `
    <div class="sd-card sd-kpi">
      <div class="t"><div class="lbl">${k.lbl}</div><div class="ic" style="background:${k.bg};color:${k.c}">${k.ic}</div></div>
      <div class="v">${red(2.4)}
        <span class="d ${k.up ? 'sd-up' : 'sd-dn'}">${k.up ? '▲' : '▼'} ${red(2.2)}</span></div>
      <div class="sub">vs previous period</div>
      <svg class="sd-spark" viewBox="0 0 100 60" preserveAspectRatio="none">
        <polyline data-sp="${i}" points="${spark(22, k.up)}" stroke="${k.c}"/></svg>
    </div>`).join('');

  /* `p` survives because it is geometry — it sets the arc lengths, and the
     arcs are shape. It is never printed. Each row pairs its colour with its
     text label, which the risk donut needs anyway: colour alone fails for
     colour-blind readers and in print. */
  const sent = [{ n: 'Positive', c: '#12B76A', p: 62.8 }, { n: 'Neutral', c: '#2E6BE6', p: 23.7 }, { n: 'Negative', c: '#E5372B', p: 13.5 }];
  const risk = [{ n: 'High Risk', c: '#E5372B', p: 7.6 }, { n: 'Medium Risk', c: '#F79009', p: 30.3 }, { n: 'Low Risk', c: '#12B76A', p: 62.1 }];
  const legend = (el, rows) => el.innerHTML = rows.map(r => `
    <div><i style="background:${r.c}"></i>${r.n}
      <b class="n">${red(2.6)}</b>
      <span class="pct">${red(2.8)}</span></div>`).join('');
  legend(root.querySelector('#sdSentLeg'), sent);
  legend(root.querySelector('#sdRiskLeg'), risk);

  const C = 2 * Math.PI * 52;
  const arcs = (sel, rows) => {
    let off = 0;
    root.querySelectorAll(sel).forEach((c, i) => {
      const len = C * rows[i].p / 100;
      c.setAttribute('stroke-dasharray', `${len} ${C - len}`);
      c.setAttribute('stroke-dashoffset', -off);
      off += len;
    });
  };
  const drawArcs = () => { arcs('.sdSeg', sent); arcs('.sdRisk', risk); };
  track(setTimeout(drawArcs, 260));

  /* `m` and `c` stay internal: they order the list and reshuffle it, and
     neither reaches the DOM. The rank, the topic and the sparkline do. */
  const trend = [
    { t: '#Election2025', m: 245, c: 23.5 }, { t: '#CityProtests', m: 189, c: 18.7 },
    { t: '#FuelPriceHike', m: 143, c: 12.1 }, { t: '#NewPolicy', m: 98, c: 9.3 }, { t: '#SportsFinal', m: 76, c: -2.1 }
  ];
  const drawTrend = () => root.querySelector('#sdTrend').innerHTML = trend.map((t, i) => `
    <div><span class="r">${i + 1}</span><span class="tag">${t.t}</span>
      <span class="m">${red(3.4)} Mentions</span>
      <span class="c ${t.c > 0 ? 'sd-up' : 'sd-dn'}">${t.c > 0 ? '▲' : '▼'} ${red(2.2)}</span>
      <svg viewBox="0 0 100 60" preserveAspectRatio="none"><polyline points="${spark(16, t.c > 0)}"
        fill="none" stroke="${t.c > 0 ? '#2E6BE6' : '#E5372B'}" stroke-width="3" stroke-linecap="round"/></svg></div>`).join('');
  drawTrend();

  /* No names, no brand colours, no values. The coverage list is unresolved
     (CLAUDE.md) and a row of recognisable brand colours names the platforms
     just as plainly as the words would. What remains is five rows of
     unattributed distribution — which is what an unpublished figure looks
     like, and is true. */
  const plats = [{ w: 100 }, { w: 50 }, { w: 26 }, { w: 15 }, { w: 7 }];
  const drawPlat = () => root.querySelector('#sdPlat').innerHTML = plats.map(p => `
    <div class="sd-prow"><span class="nm">${red(4.2)}</span>
      <span class="tr"><i style="width:${p.w}%;background:#98A2B3"></i></span>
      <span class="vv">${red(3)} <span>${red(2.4)}</span></span></div>`).join('');
  drawPlat();

  const alerts = [
    { n: 'Communal Violence', k: 'sd-hi', l: 'High Risk', t: '2 min ago' },
    { n: 'Hate Speech', k: 'sd-hi', l: 'High Risk', t: '5 min ago' },
    { n: 'Fake News', k: 'sd-md', l: 'Medium Risk', t: '15 min ago' },
    { n: 'Protest Call', k: 'sd-md', l: 'Medium Risk', t: '30 min ago' }
  ];
  const drawAlerts = () => root.querySelector('#sdAlerts').innerHTML = alerts.map(a => `
    <div class="sd-lrow"><span style="color:#E5372B">⚠</span><span class="nm">${a.n}</span>
      <span class="sd-chip ${a.k}">${a.l}</span><span class="ag">${a.t}</span></div>`).join('');
  drawAlerts();

  /* The reference numbers are withheld too. A record id is furniture, but a
     *sequential* one is a volume: #GRV-12543 tells the reader there have been
     twelve and a half thousand grievances. The row keeps its reference slot so
     the list still reads as a queue of real records. */
  root.querySelector('#sdGriev').innerHTML = [
    { n: 'Pothole on Main Street', k: 'sd-nw', l: 'New', t: '10 min ago' },
    { n: 'Electricity Issue', k: 'sd-ip', l: 'In Progress', t: '25 min ago' },
    { n: 'Water Supply Problem', k: 'sd-lo', l: 'Resolved', t: '1 h ago' }
  ].map(g => `<div class="sd-lrow"><span style="color:#98A2B3">✉</span>
      <span class="nm">${g.n} <span style="color:#98A2B3;font-size:10px">#GRV-${red(2.6)}</span></span>
      <span class="sd-chip ${g.k}">${g.l}</span><span class="ag">${g.t}</span></div>`).join('');

  /* ── live feed ──────────────────────────────────── */
  /* Neutral avatars for the same reason as the platform rows: the glyph and
     the brand colour name the platform without writing it down. The handles
     are invented and generic, which the brief already asks of every example. */
  const srcs = [
    { p: '◍', c: '#667085', u: '@NewsUpdate' }, { p: '◉', c: '#7A8496', u: '@CityWatch' },
    { p: '◎', c: '#5D6675', u: '@ground_report' }, { p: '◐', c: '#8A93A3', u: '@alert_channel' },
    { p: '●', c: '#6E7787', u: '@LiveNews24' }
  ];
  const bodies = [
    ['Protest gathering reported in the central business district. Heavy police deployment in the area.', 'Protest', 'sd-hi', 'High Risk', 'Negative', '#E5372B'],
    [`Coordinated posting pattern detected across ${red(2.2)} accounts on the fuel price thread.`, 'Bot Network', 'sd-hi', 'High Risk', 'Negative', '#E5372B'],
    [`Municipal team resolved the water supply complaint in Ward 12 within ${red(2.4)}.`, 'Grievance', 'sd-lo', 'Low Risk', 'Positive', '#12B76A'],
    ['Unverified claim about the new policy spreading in regional-language groups.', 'Fake News', 'sd-md', 'Medium Risk', 'Neutral', '#F79009'],
    ['Public appreciation trending for the new metro corridor announcement.', 'Sentiment', 'sd-lo', 'Low Risk', 'Positive', '#12B76A'],
    ['Local escalation reported near the district collectorate. Monitoring in progress.', 'Incident', 'sd-md', 'Medium Risk', 'Negative', '#E5372B']
  ];
  const feed = root.querySelector('#sdFeed');
  let bi = 0;
  const push = () => {
    const s = srcs[Math.floor(Math.random() * srcs.length)], b = bodies[bi++ % bodies.length];
    const el = document.createElement('div');
    el.className = 'sd-fitem';
    el.innerHTML = `<div class="pv" style="background:${s.c}">${s.p}</div>
      <div class="bd"><div class="hd"><b>${s.u}</b><time>just now</time></div>
        <p>${b[0]}</p><div class="mt"><span class="sd-chip sd-nw">${b[1]}</span>
        <span class="sd-chip ${b[2]}">${b[3]}</span></div></div>
      <div class="rr"><span class="k">Reach</span><span class="v">${red(2.6)}</span>
        <span class="k" style="margin-top:5px">Sentiment</span>
        <span class="v" style="color:${b[5]};font-size:11px">${b[4]}</span></div>`;
    feed.prepend(el);
    feed.querySelectorAll('.sd-fitem').forEach((n, i) => { if (i > 0) n.querySelector('time').textContent = i * 2 + ' min ago'; });
    while (feed.children.length > 2) feed.lastElementChild.remove();
  };
  push(); push();

  /* ── keep it alive ──────────────────────────────────
     Everything below runs only while start() is in effect: the section is
     on screen and the visitor has not asked for reduced motion. */
  function start() {
    if (running) return;
    running = true;

    /* Draw the arcs immediately. The 260ms timeout above is scheduled at mount,
       when the section is usually still off screen — the IntersectionObserver's
       first callback then calls stop(), which clears it. Without this the
       donuts sat as empty grey rings until the drift interval's first tick,
       3.2s after the card came into view. */
    drawArcs();
    /* sentiment drifts — the arcs move, the legend does not, because there
       is nothing left in it to update */
    every(() => {
      sent[0].p = Math.max(55, Math.min(70, sent[0].p + rnd(-.6, .6)));
      sent[2].p = Math.max(9, Math.min(20, sent[2].p + rnd(-.4, .4)));
      sent[1].p = 100 - sent[0].p - sent[2].p;
      drawArcs();
    }, 3200);

    /* sparkline redraw */
    every(() => root.querySelectorAll('[data-sp]').forEach(p =>
      p.setAttribute('points', spark(22, kpis[+p.dataset.sp].up))), 4600);

    /* platform bars breathe */
    every(() => {
      plats.forEach(p => { p.w = Math.max(5, Math.min(100, p.w + rnd(-4, 4))); });
      drawPlat();
    }, 5200);

    /* new alert arrives */
    every(() => {
      const pool = ['Coordinated Campaign', 'Deepfake Detected', 'Riot Instigation', 'Doxxing Attempt', 'Impersonation'];
      alerts.unshift({ n: pool[Math.floor(Math.random() * pool.length)], k: 'sd-hi', l: 'High Risk', t: 'just now' });
      alerts.length = 4;
      drawAlerts();
    }, 7400);

    /* trending reshuffles */
    every(() => {
      trend.forEach(t => { t.m = Math.max(20, t.m + Math.round(rnd(-8, 12))); t.c += rnd(-1.4, 1.4); });
      trend.sort((a, b) => b.m - a.m);
      drawTrend();
    }, 6100);

    /* feed keeps streaming */
    every(push, 4200);
  }

  function stop() {
    running = false;
    for (const id of timers) { clearInterval(id); clearTimeout(id); }
    timers.clear();
  }

  return { start, stop, destroy: stop };
}
