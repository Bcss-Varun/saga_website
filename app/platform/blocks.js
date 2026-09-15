import Image from 'next/image';
import Link from 'next/link';
import Redacted from '../components/Redacted';
import styles from './platform.module.css';

/* Page-specific blocks for /platform. Per CLAUDE.md the shared bento
   vocabulary lives in `Bento`, and a block that belongs to one route stays in
   that route's own module — these do.

   Two rules govern every visual in this file.

   1. Nothing animates. Each one has to read as complete standing still, which
      is the static-frame criterion; and a soft-edged animated layer is exactly
      the compositing cost the open performance item in CLAUDE.md is about.

   2. Nothing states a figure. A number inside a picture of a product asserts
      itself harder than the same number in a headline, not softer — that is
      APPROVALS item 0. Where a real system would print a value, these draw a
      redaction bar that carries its own explanation.

   The SVGs are decorative: every label they carry is also a DOM text node
   beside them, so nothing exists only inside a graphic. */

/* ── icons ──────────────────────────────────────────────────────────────
   A small stroke set, drawn here rather than pulled from a library: the site
   carries no UI dependency and eight icons do not justify starting one. All
   are decorative — each sits beside its own text label — so all are hidden
   from assistive technology by the component that draws them. */
const ICONS = {
  people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a6 6 0 0 1 12 0M17 11a3 3 0 1 0-2-5.2M18 20a5.9 5.9 0 0 0-1.5-4',
  chip: 'M8 8h8v8H8zM4 9h2M4 15h2M18 9h2M18 15h2M9 4v2M15 4v2M9 18v2M15 18v2M6 6h12v12H6z',
  chart: 'M5 19V11M12 19V5M19 19v-6',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 13.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z',
  chat: 'M20 12a7.5 7.5 0 0 1-11 6.6L4 20l1.4-4.2A7.5 7.5 0 1 1 20 12Z',
  news: 'M6 4h9l3 3v13H6zM9 9h6M9 13h6M9 17h4',
  inbox: 'M4 13h4l1.5 3h5L16 13h4M4 13 6.5 5h11L20 13v6H4z',
  translate: 'M4 6h8M8 6v1.5c0 3-1.6 5.6-4 7M6 10.5c1.2 2.4 3.2 4.2 5.5 5M13 20l3.5-9 3.5 9M14.6 17h4.8',
  mood: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 10h.01M15.5 10h.01M8 14.5c1 1.2 2.4 1.8 4 1.8s3-.6 4-1.8',
  person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0',
  image: 'M4 5h16v14H4zM4 15l4.5-4.5L13 15l3-3 4 4M9.5 9.5h.01',
  shield: 'M12 3.5 20 7v6c0 4.6-3.4 7.6-8 8.5-4.6-.9-8-3.9-8-8.5V7ZM9 12l2.2 2.2L15.5 10',
  network: 'M6 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 21.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 21.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM7.4 5.6l9.2 12.8M16.6 5.6 7.4 18.4',
  trend: 'M4 17l5-5 3.5 3.5L20 8M20 8h-4.5M20 8v4.5',
  bell: 'M18 16V11a6 6 0 1 0-12 0v5l-1.5 2.5h15L18 16ZM10 21h4',
  store: 'M12 8c4.4 0 8-1.1 8-2.5S16.4 3 12 3 4 4.1 4 5.5 7.6 8 12 8ZM4 5.5v13C4 20 7.6 21 12 21s8-1 8-2.5v-13M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5',
  send: 'M21 3 3 10.5l7 3 3 7L21 3ZM10 14l3.5-3.5',
  warn: 'M12 4 2.6 20h18.8ZM12 10v4.5M12 17.3h.01',
  chevron: 'M9.5 5.5 16 12l-6.5 6.5',
  lock: 'M6 10.5h12V21H6zM8.5 10.5V7a3.5 3.5 0 1 1 7 0v3.5M12 14.5v2.5',
  transfer: 'M4 8.5h13M14 5.5l3 3-3 3M20 15.5H7M10 12.5l-3 3 3 3',
  fingerprint: 'M12 11v2.5a7 7 0 0 1-1.4 4.2M8.4 8.6a4.5 4.5 0 0 1 7.1 3.6v1.3M5.8 15.6A7 7 0 0 0 6.4 12a5.6 5.6 0 0 1 .5-2.3M4.6 6.9A9 9 0 0 1 19 9.4v3.2M15.6 16.4a12 12 0 0 1-.5 2.4',
  layers: 'M12 3.5 3 8l9 4.5L21 8ZM4.5 12.5 12 16.2l7.5-3.7M4.5 16.5 12 20.2l7.5-3.7',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM16.8 16.8 21 21',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5.2l3.4 2',
  pin: 'M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  calendar: 'M5 6h14v14H5zM5 10h14M9 3v4M15 3v4M9 14h2.5l-2 3H12',
  gear: 'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM19.4 14a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4 14H3.8a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1.2Z',
};

function Icon({ name, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICONS[name]} fill="none" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── 2. the signal flow ──────────────────────────────────────────────────
   Four stages left to right, each an icon head over the things that stage
   actually carries.

   The stage lists name source classes, never a platform. That is the whole
   reason this block can be published: CLAUDE.md records the coverage list as
   unresolved, and "social media · public posts, accounts, replies" is a class
   rather than a list. The footer states the same thing in words instead of
   leaving the reader to infer a list that is not on the page.

   The arrows are separate list items marked `aria-hidden`, so the reading
   order is stage, then its contents, then the next stage — not a stream of
   arrow characters. */
export function SignalFlow({ stages, foot }) {
  return (
    <div className={styles.flow}>
      <ol className={styles.flowTrack}>
        {stages.map((s, i) => (
          <li className={styles.flowStage} key={s.n}>
            <div className={styles.flowHead}>
              <span className={styles.flowIcon} aria-hidden="true">
                <Icon name={s.icon} className={styles.flowIconSvg} />
              </span>
              <div>
                <p className={styles.flowN}>{s.n}</p>
                <h3 className={styles.flowName}>{s.name}</h3>
                <p className={styles.flowSub}>{s.sub}</p>
              </div>
            </div>

            <ul className={styles.flowList}>
              {s.items.map((it) => (
                <li className={styles.flowItem} key={it.name}>
                  <Icon name={it.icon} className={styles.flowItemIcon} />
                  <span>
                    <span className={styles.flowItemName}>{it.name}</span>
                    <span className={styles.flowItemBody}>{it.body}</span>
                  </span>
                </li>
              ))}
            </ul>

            {i < stages.length - 1 && (
              <span className={styles.flowArrow} aria-hidden="true">
                &rarr;
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className={styles.flowFoot}>
        <span className={styles.flowFootIcon} aria-hidden="true">
          <Icon name="gear" className={styles.flowIconSvg} />
        </span>
        <p className={styles.flowFootName}>{foot.name}</p>
        <p className={styles.flowFootBody}>{foot.body}</p>
        <Link className={styles.flowFootLink} href={foot.link.href}>
          {foot.link.label} <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}

/* ── 4.01 sentiment ─────────────────────────────────────────────────────
   Three bands, a trend and a set of clusters. The band widths are drawn from
   a fixed ratio in CSS and carry no figure; the label is what says which band
   is which, because colour alone fails in print. */
export function SentimentPanel() {
  const bands = [
    { name: 'Positive', key: 'pos' },
    { name: 'Neutral', key: 'neu' },
    { name: 'Negative', key: 'neg' },
  ];
  return (
    <div className={styles.panel}>
      <p className={styles.panelLabel}>Sentiment split</p>
      <ul className={styles.bands}>
        {bands.map((b) => (
          <li className={styles.band} key={b.key}>
            <span className={`${styles.bandFill} ${styles[b.key]}`} aria-hidden="true" />
            <span className={styles.bandName}>{b.name}</span>
            <Redacted label={`${b.name} share withheld pending sign-off`} width="3ch" />
          </li>
        ))}
      </ul>

      <p className={styles.panelLabel}>Trend, against the preceding window</p>
      <svg className={styles.spark} viewBox="0 0 240 56" aria-hidden="true">
        <polyline
          points="0,44 30,40 60,42 90,30 120,33 150,22 180,25 210,12 240,8"
          fill="none"
          stroke="var(--orange)"
          strokeWidth="2"
        />
      </svg>

      <p className={styles.panelLabel}>Theme clusters</p>
      <ul className={styles.clusters}>
        {['Service delay', 'Local grievance', 'Rumour', 'Praise'].map((c) => (
          <li className={styles.cluster} key={c}>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── 4.02 escalation ────────────────────────────────────────────────────
   Four tiers as a ladder. The labels themselves are unapproved, so the rung
   names are generic and the tier labels carry the pending marker in the copy
   beside this graphic rather than inside it. */
export function EscalationLadder() {
  const rungs = ['Low', 'Medium', 'High', 'Critical'];
  return (
    <div className={styles.panel}>
      <p className={styles.panelLabel}>Escalation, on velocity and reach</p>
      <ol className={styles.rungs}>
        {rungs.map((r, i) => (
          <li className={styles.rung} key={r} data-tier={i}>
            <span className={styles.rungBar} aria-hidden="true" />
            <span className={styles.rungName}>{r}</span>
          </li>
        ))}
      </ol>
      <p className={styles.panelNote}>
        A tier change is an event on the record. Colour never carries the tier on its own.
      </p>
    </div>
  );
}

/* ── 4.03 network ───────────────────────────────────────────────────────
   A central account, the accounts amplifying it, and the content clusters
   they share. Fixed geometry, no simulation: a force layout would move on
   every mount and say nothing more. */
export function NetworkGraph() {
  const spokes = [
    [70, 26], [122, 34], [156, 78], [140, 130], [92, 148], [40, 128], [22, 76], [56, 60],
    [176, 44], [186, 116],
  ];
  return (
    <div className={styles.panel}>
      <p className={styles.panelLabel}>Amplification map</p>
      <svg className={styles.graph} viewBox="0 0 208 176" aria-hidden="true">
        {spokes.map(([x, y]) => (
          <line key={`${x}-${y}`} x1="104" y1="88" x2={x} y2={y} stroke="var(--line2)" strokeWidth="1" />
        ))}
        {spokes.map(([x, y], i) => (
          <circle
            key={`n-${x}-${y}`}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 6 : 4}
            fill={i % 3 === 0 ? 'var(--soft)' : 'var(--ember)'}
            stroke="var(--lift)"
            strokeWidth="1"
          />
        ))}
        <circle cx="104" cy="88" r="13" fill="var(--orange)" />
      </svg>
      <ul className={styles.legend}>
        <li>
          <span className={`${styles.key} ${styles.keyOn}`} aria-hidden="true" />
          Origin account
        </li>
        <li>
          <span className={`${styles.key} ${styles.keyMid}`} aria-hidden="true" />
          Amplifying accounts
        </li>
        <li>
          <span className={`${styles.key} ${styles.keyLow}`} aria-hidden="true" />
          Content clusters
        </li>
      </ul>
    </div>
  );
}

/* ── 4.04 geo ───────────────────────────────────────────────────────────
   An abstract area grid, not a map of a real place. A recognisable outline
   would invite the reader to read a real district off an illustration. */
export function GeoField() {
  const cells = Array.from({ length: 36 }, (_, i) => i);
  const hot = new Set([9, 10, 15, 16, 17, 22, 23, 28]);
  const warm = new Set([3, 4, 8, 11, 21, 24, 29, 30]);
  return (
    <div className={styles.panel}>
      <p className={styles.panelLabel}>Area scores, illustrative</p>
      <div className={styles.geo} aria-hidden="true">
        {cells.map((c) => (
          <span
            key={c}
            className={[
              styles.cell,
              hot.has(c) ? styles.cellHot : '',
              warm.has(c) ? styles.cellWarm : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ))}
      </div>
      <ul className={styles.legend}>
        <li>
          <span className={`${styles.key} ${styles.keyOn}`} aria-hidden="true" />
          Rising
        </li>
        <li>
          <span className={`${styles.key} ${styles.keyMid}`} aria-hidden="true" />
          Watch
        </li>
        <li>
          <span className={`${styles.key} ${styles.keyLow}`} aria-hidden="true" />
          Settled
        </li>
      </ul>
      <p className={styles.panelNote}>
        Areas are abstract. Every level carries its name beside the colour.
      </p>
    </div>
  );
}

/* ── 4.05 the dossier ───────────────────────────────────────────────────
   What an evidence package looks like as an object. Severity, confidence and
   the detection time are exactly the three values a reader would quote, so
   all three are withheld. */
export function DossierCard() {
  const fields = [
    { label: 'Severity', hint: 'severity withheld pending sign-off' },
    { label: 'Confidence', hint: 'confidence figure withheld pending sign-off' },
    { label: 'Detected', hint: 'detection time withheld pending sign-off' },
  ];
  return (
    <div className={styles.dossier}>
      <p className={styles.dossierHead}>Intelligence alert</p>
      <dl className={styles.dossierFields}>
        {fields.map((f) => (
          <div className={styles.dossierField} key={f.label}>
            <dt>{f.label}</dt>
            <dd>
              <Redacted label={f.hint} width="5ch" />
            </dd>
          </div>
        ))}
      </dl>
      <ul className={styles.dossierParts}>
        {['Narrative', 'Network', 'Entities', 'Locations', 'Evidence', 'Timeline'].map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <p className={styles.dossierAction} aria-hidden="true">
        Generate intelligence brief
      </p>
      <p className={styles.panelNote}>Illustrative. The brief template is [pending sign-off].</p>
    </div>
  );
}

/* ── 6. the record ──────────────────────────────────────────────────────
   The signal in the middle, the context around it: two columns of typed cards
   flanking the globe, wave artwork running the full width of the viewport
   behind them.

   The globe and the waves are cut out of the supplied render; every label is
   real text. That split is the point — a label inside a picture cannot be read
   aloud, found by search, translated or reflowed onto a phone.

   The artwork is full-bleed and the cards are not: `.record` breaks out to the
   viewport width so the waves reach both edges, and `.recGrid` inside it holds
   the cards to a readable measure. Without the break-out the artwork ended on
   a straight vertical edge at the container, which read as a picture pasted
   into the page rather than the page's own ground.

   The columns are one list, not two: a reader hears ten types of context, in
   order, rather than a left group and a right group, which is a layout fact
   and not a fact about the record. */
export function RecordWeb({ centreTop, centreMain, left, right, globeAlt }) {
  const card = (n) => (
    <li className={styles.recNode} key={n.name}>
      <span className={styles.recIcon} aria-hidden="true">
        <Icon name={n.icon} className={styles.recIconSvg} />
      </span>
      <span className={styles.recText}>
        <span className={styles.recName}>{n.name}</span>
        <span className={styles.recBody}>{n.body}</span>
      </span>
      <span className={styles.recTie} aria-hidden="true" />
    </li>
  );

  return (
    <div className={styles.record}>
      <span className={`${styles.recWave} ${styles.recWaveL}`} aria-hidden="true" />
      <span className={`${styles.recWave} ${styles.recWaveR}`} aria-hidden="true" />

      <div className={styles.recGrid}>
        <ul className={`${styles.recCol} ${styles.recColL}`}>{left.map(card)}</ul>

        <div className={styles.recCentre}>
          <Image
            className={styles.recGlobe}
            src="/images/record/globe.webp"
            alt={globeAlt}
            width={520}
            height={520}
          />
          <p className={styles.recCentreLabel}>
            <span className={styles.recCentreTop}>{centreTop}</span>
            <span className={styles.recCentreMain}>{centreMain}</span>
          </p>
        </div>

        <ul className={`${styles.recCol} ${styles.recColR}`}>{right.map(card)}</ul>
      </div>
    </div>
  );
}

/* ── 7. the alert ───────────────────────────────────────────────────────
   The supplied render's card, redrawn in HTML.

   Shipped as an image first, and replaced because a raster card is soft the
   moment anyone zooms, on any display denser than the crop, and it cannot
   reflow on a phone. Everything here is type and CSS: it is sharp at any size
   and the layout survives a 360px screen.

   ── What this publishes ───────────────────────────────────────────────────
   The figures are the render's own — High Risk, 87%, 248, 18, 6, 3 — and none
   has an owner or a date. They are published at the client's explicit and
   repeated instruction and tracked as a BLOCKER in `copy/APPROVALS.md` item
   6b. As text rather than pixels they are at least visible to the claims
   sweep, which is more than the image version allowed. */
export function AlertCard({ tier, headline, sub, stats, counts, action }) {
  return (
    <div className={styles.alert}>
      <div className={styles.alertCard}>
        <span className={styles.alertDots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>

        <div className={styles.alertHead}>
          <span className={styles.alertMark} aria-hidden="true">
            <Icon name="warn" className={styles.alertMarkSvg} />
          </span>
          <div>
            <p className={styles.alertTier}>{tier}</p>
            <p className={styles.alertTitle}>{headline}</p>
            <p className={styles.alertSub}>{sub}</p>
          </div>
        </div>

        <dl className={styles.alertStats}>
          {stats.map((f) => (
            <div className={styles.alertStat} key={f.label}>
              <dt className={f.crit ? `${styles.alertValue} ${styles.alertCrit}` : styles.alertValue}>
                {f.value}
              </dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </dl>

        <dl className={styles.alertCounts}>
          {counts.map((c) => (
            <div className={styles.alertCount} key={c.label}>
              <span className={styles.alertCountIcon} aria-hidden="true">
                <Icon name={c.icon} className={styles.alertCountSvg} />
              </span>
              <span>
                <dt>{c.value}</dt>
                <dd>{c.label}</dd>
              </span>
            </div>
          ))}
        </dl>

        <p className={styles.alertAction} aria-hidden="true">
          {action} <span>&rarr;</span>
        </p>
      </div>
    </div>
  );
}

/* The five parts of an alert, as a run down a single thread. An ordered list:
   they are what the reader meets in order when the alert is opened. */
export function AlertContains({ label, items }) {
  return (
    <div className={styles.contains}>
      <p className={styles.containsLabel}>{label}</p>
      <ol className={styles.containsList}>
        {items.map((c) => (
          <li className={styles.containsRow} key={c.name}>
            <span className={styles.containsDot} aria-hidden="true" />
            <span className={styles.containsIcon} aria-hidden="true">
              <Icon name={c.icon} className={styles.containsIconSvg} />
            </span>
            <span>
              <span className={styles.containsName}>{c.name}</span>
              <span className={styles.containsBody}>{c.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── 10. in operation ───────────────────────────────────────────────────
   Seven stations on one line: a ringed icon per step, a connector with a node
   between each pair, and the step's name and what happens there underneath.

   An ordered list, because it is one signal moving through the platform in
   order — the only other place on this page allowed an index. The connectors
   are `aria-hidden` pseudo-elements, so a screen reader hears seven steps
   rather than a stream of dashes. */
export function OperationLine({ steps }) {
  return (
    <ol className={styles.ops}>
      {steps.map((st) => (
        <li className={styles.opStep} key={st.name}>
          <span className={styles.opNode} aria-hidden="true">
            <Icon name={st.icon} className={styles.opIcon} />
          </span>
          <h3 className={styles.opName}>{st.name}</h3>
          <p className={styles.opBody}>{st.body}</p>
        </li>
      ))}
    </ol>
  );
}

/* ── 11. security ───────────────────────────────────────────────────────
   Six controls in a grid, each an icon tile beside what it does.

   A description list, not six divs: each control is defined by the sentence
   next to it, and that pairing should survive being read aloud. */
export function ControlGrid({ items }) {
  return (
    <dl className={styles.controls}>
      {items.map((c) => (
        <div className={styles.control} key={c.name}>
          <span className={styles.controlIcon} aria-hidden="true">
            <Icon name={c.icon} className={styles.controlIconSvg} />
          </span>
          <div>
            <dt>{c.name}</dt>
            <dd>{c.body}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
