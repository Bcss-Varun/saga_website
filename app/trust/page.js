import { pageMetadata } from '../lib/meta';
import PageHero from '../components/PageHero';
import PageCta from '../components/PageCta';
import { BentoLayer, Card, Grid, Head, Section } from '../components/Bento';
import { trust as C } from '../lib/content/trust';
import styles from './trust.module.css';

export const metadata = pageMetadata({
  title: 'SAGA — Trust',
  description:
    'How SAGA is deployed, how access is bounded, what the audit trail records, and the basis on which data is handled. [draft — needs review]',
  path: '/trust',
});

/* /trust — deployment, access control, audit trail, lawful basis.

   Small page, disproportionate weight in government procurement. It is what a
   security reviewer opens first, and often the only page a committee reads in
   full, so it is reachable from the top nav rather than the footer alone.

   All copy is [draft — needs review]; see app/lib/content/trust.js. */

/* Deployment-model marks. Line glyphs at 22px on a 2px grid, stroked in
   `currentColor` so the tile's colour is the only thing that sets them —
   nothing here carries a colour of its own.

   Decorative in every case: the card states the model's name in text beside
   the glyph, so the SVG is `aria-hidden` through the tile that holds it and
   carries no title. A building for on-premise, a cloud for cloud, and the two
   joined for hybrid, which is exactly what that model is. */
const MARKS = {
  onPrem: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
         strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V7.2a1 1 0 0 1 .6-.92l7-3.1a1 1 0 0 1 .8 0l7 3.1a1 1 0 0 1 .6.92V21" />
      <path d="M2.5 21h19" />
      <path d="M9 21v-4.5h6V21" />
      <path d="M9.5 9.5h1.2M13.3 9.5h1.2M9.5 12.8h1.2M13.3 12.8h1.2" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
         strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 18.5a4.2 4.2 0 0 1-.3-8.4 5.4 5.4 0 0 1 10.3-1.2A3.9 3.9 0 0 1 17.6 18.5z" />
    </svg>
  ),
  /* A cloud over a rack with one connector between them. Stacked rather than
     side by side: two objects on one line at 22px read as a smudge, and this
     is the one glyph of the three that has to say "both". */
  hybrid: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
         strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.1 10.2h6.6a2.15 2.15 0 0 0 .28-4.28 3.35 3.35 0 0 0-6.37-1 2.35 2.35 0 0 0-.51 5.28z" />
      <path d="M12 10.4v3" />
      <rect x="3.6" y="14.6" width="16.8" height="6.4" rx="1.6" />
      <path d="M6.7 17.8h.9" />
      <path d="M10.2 17.8h6.4" />
    </svg>
  ),
};

/* Access-control schematics, one per principle card, on a 120-unit square.

   Two strokes and nothing else: `.artLit` is the accent and marks the subject
   of the card — the person the role belongs to, the boundary the scope draws,
   the record the action lands in — and `.artDim` is everything the subject
   sits among. That pairing is the whole point of each drawing, so the two
   classes carry the colours and no path here does.

   Decorative: each card states its meaning in the copy beside the schematic,
   so the wrapper is `aria-hidden` and none of these carries a title. */
const ART = {
  /* One account over three, joined. The role is the shape of who reports to
     whom, which is what "access follows responsibility" means. */
  role: (
    <svg viewBox="0 0 120 120" width="120" height="120" fill="none" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      <rect className={styles.artLit} x="42" y="10" width="36" height="36" rx="9" />
      <circle className={styles.artLit} cx="60" cy="25" r="5.4" />
      <path className={styles.artLit} d="M50.4 39.2a9.6 9.6 0 0 1 19.2 0" />
      <path className={styles.artDim} d="M60 46v14M26 60h68M26 60v10M60 60v10M94 60v10" />
      <rect className={styles.artDim} x="10" y="70" width="32" height="34" rx="8" />
      <rect className={styles.artDim} x="44" y="70" width="32" height="34" rx="8" />
      <rect className={styles.artDim} x="78" y="70" width="32" height="34" rx="8" />
      <circle className={styles.artDim} cx="26" cy="83" r="4.4" />
      <circle className={styles.artDim} cx="60" cy="83" r="4.4" />
      <circle className={styles.artDim} cx="94" cy="83" r="4.4" />
      <path className={styles.artDim} d="M18.4 96.6a7.6 7.6 0 0 1 15.2 0M52.4 96.6a7.6 7.6 0 0 1 15.2 0M86.4 96.6a7.6 7.6 0 0 1 15.2 0" />
    </svg>
  ),
  /* A stack of records with only the front one locked. The two behind are the
     ones this user does not reach, which is the boundary the card describes. */
  scope: (
    <svg viewBox="0 0 120 120" width="120" height="120" fill="none" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      <path className={styles.artDim} d="M46 18h20l6 8h32a6 6 0 0 1 6 6v46a6 6 0 0 1-6 6H46a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6z" />
      <path className={styles.artDim} d="M32 30h18l6 8h32a6 6 0 0 1 6 6v46a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6V36a6 6 0 0 1 6-6z" />
      <path className={styles.artLit} d="M18 42h18l6 8h32a6 6 0 0 1 6 6v46a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V48a6 6 0 0 1 6-6z" />
      <rect className={styles.artLit} x="36" y="76" width="24" height="18" rx="4" />
      <path className={styles.artLit} d="M42 76v-5a6 6 0 0 1 12 0v5" />
    </svg>
  ),
  /* A record with a clock on it. Every action is written down and the time is
     part of what is written. */
  action: (
    <svg viewBox="0 0 120 120" width="120" height="120" fill="none" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      <path className={styles.artDim} d="M34 14h40l18 18v58a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6z" />
      <path className={styles.artDim} d="M74 14v18h18" />
      <path className={styles.artDim} d="M40 46h30M40 58h38M40 70h24M40 82h18" />
      <circle className={styles.artLit} cx="86" cy="86" r="22" />
      <path className={styles.artLit} d="M86 74v12l8 5" />
    </svg>
  ),
};

/* The page's line glyphs, on a 24 grid and stroked in `currentColor` so every
   block that uses one sets the colour once, at whatever size it draws them.
   Shared across the access-control strip, the audit record's event column, the
   audit cards and the audit strip — the same mark means the same thing in all
   four, which is the only reason to keep one map rather than four. */
const ICONS = {
  people: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9.4" cy="8.4" r="3.4" />
      <path d="M3.4 19.4a6 6 0 0 1 12 0" />
      <path d="M16.2 5.6a3.1 3.1 0 0 1 0 5.6" />
      <path d="M17.6 14.4a5.6 5.6 0 0 1 3.4 5" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.8 4.6 5.9v5.5c0 4.6 3.1 8.4 7.4 9.8 4.3-1.4 7.4-5.2 7.4-9.8V5.9z" />
      <path d="m8.9 11.9 2.2 2.3 4-4.3" />
    </svg>
  ),
  log: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2.8h8.2L19 7.6V21a1.2 1.2 0 0 1-1.2 1.2H6A1.2 1.2 0 0 1 4.8 21V4A1.2 1.2 0 0 1 6 2.8z" />
      <path d="M14 2.8v5h5" />
      <path d="M8.2 12.4h7.2M8.2 15.8h7.2M8.2 19h4.4" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="m15.6 15.6 4.4 4.4" />
    </svg>
  ),
  doc: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2.8h8.2L19 7.6V21a1.2 1.2 0 0 1-1.2 1.2H6A1.2 1.2 0 0 1 4.8 21V4A1.2 1.2 0 0 1 6 2.8z" />
      <path d="M14 2.8v5h5" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.4v10.8" />
      <path d="m7.8 10.4 4.2 4.2 4.2-4.2" />
      <path d="M4.6 18.2v1.4a1.2 1.2 0 0 0 1.2 1.2h12.4a1.2 1.2 0 0 0 1.2-1.2v-1.4" />
    </svg>
  ),
  person: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8.2" r="3.6" />
      <path d="M5.2 20a6.8 6.8 0 0 1 13.6 0" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6.6V12l3.8 2.4" />
    </svg>
  ),
  nodes: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4.8" r="2.6" />
      <circle cx="5.4" cy="19.2" r="2.6" />
      <circle cx="18.6" cy="19.2" r="2.6" />
      <path d="M12 7.4v4.4M5.4 16.6v-2.2h13.2v2.2M12 11.8v2.6" />
    </svg>
  ),
  db: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="6" rx="7.4" ry="3.2" />
      <path d="M4.6 6v12c0 1.77 3.31 3.2 7.4 3.2s7.4-1.43 7.4-3.2V6" />
      <path d="M4.6 12c0 1.77 3.31 3.2 7.4 3.2s7.4-1.43 7.4-3.2" />
    </svg>
  ),
  gear: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.1" />
      <path d="M19.5 14.6a1.5 1.5 0 0 0 .3 1.65l.05.06a1.8 1.8 0 1 1-2.55 2.55l-.06-.06a1.5 1.5 0 0 0-1.65-.3 1.5 1.5 0 0 0-.9 1.37V20a1.8 1.8 0 1 1-3.6 0v-.1a1.5 1.5 0 0 0-.98-1.37 1.5 1.5 0 0 0-1.65.3l-.06.06a1.8 1.8 0 1 1-2.55-2.55l.06-.06a1.5 1.5 0 0 0 .3-1.65 1.5 1.5 0 0 0-1.37-.9H4a1.8 1.8 0 1 1 0-3.6h.1a1.5 1.5 0 0 0 1.37-.98 1.5 1.5 0 0 0-.3-1.65l-.06-.06a1.8 1.8 0 1 1 2.55-2.55l.06.06a1.5 1.5 0 0 0 1.65.3h.07a1.5 1.5 0 0 0 .9-1.37V4a1.8 1.8 0 1 1 3.6 0v.1a1.5 1.5 0 0 0 .9 1.37 1.5 1.5 0 0 0 1.65-.3l.06-.06a1.8 1.8 0 1 1 2.55 2.55l-.06.06a1.5 1.5 0 0 0-.3 1.65v.07a1.5 1.5 0 0 0 1.37.9H20a1.8 1.8 0 1 1 0 3.6h-.1a1.5 1.5 0 0 0-1.37.9z" />
    </svg>
  ),
};

export default function TrustPage() {
  return (
    <BentoLayer>
      <PageHero
        pill={C.hero.eyebrow}
        title={C.hero.title}
        lit={C.hero.lit}
        lead={C.hero.body}
        actions={[
          { href: '/contact', label: 'Request a Demo', primary: true },
          { href: '#audit', label: 'Read the audit trail' },
        ]}
        stats={C.hero.stats}
        /* The picture across the whole hero rather than an object beside the
           copy, the same arrangement as /platform. It says "controlled space,
           one way in" before a word is read, which is what this page is about.

           The deployment sheet that used to be the hero's showcase went down
           into the deployment section when this arrived, and was removed from
           the page entirely on request the same day along with the section's
           closing note. Its rows are quoted verbatim in copy/APPROVALS.md
           item 2, which is where that wording is tracked. */
        backdrop="/images/trust-backdrop.webp"
        /* Held to the right of the frame. The render is 2:1 and the hero is
           wider than it is tall by less, so `cover` crops the sides — centred,
           the shield lost its right edge. Pushing the crop right keeps the
           shield whole and takes the crop out of the empty left wall instead,
           which is under the opaque part of the scrim anyway. */
        backdropPos="92% center"
      />

      {/* ── deployment ───────────────────────────────────────────────────
          Three models a department picks between. Every card is the same
          object in the same order: the mark, the name, the one-line answer,
          the detail, then the reader it is for on the card foot.

          The mark is a tile with a line glyph in it, the treatment the
          security section on /platform already uses. It is what makes three
          cards of prose scannable — a reviewer looking for the hybrid option
          finds it by shape before reading a word — and it is drawn rather
          than photographed, so it costs one inline SVG and no request.
          Decorative: the model's name is stated in text beside it, so
          announcing the glyph would say everything twice.

          The index sits quietly at the top right rather than leading the
          card. It is the client's and it is kept, but it is not the thing a
          reader is looking for; see the note in app/lib/content/trust.js for
          why this brief would otherwise rule it out.

          No card is lit. `lit` marks one card in a grid, and the three here
          are alternatives — lighting the first would read as a
          recommendation nobody has made. */}
      <Section id={C.deployment.id} wash="warm">
        <Head pill={C.deployment.eyebrow} title={C.deployment.title} sub={C.deployment.lead} />
        <Grid>
          {C.deployment.models.map((m) => (
            <Card key={m.label} span={4} className={styles.model}>
              <div className={styles.modelTop}>
                <span className={styles.modelMark} aria-hidden="true">
                  {MARKS[m.icon]}
                </span>
                <span className={styles.modelN} aria-hidden="true">
                  {m.n}
                </span>
              </div>
              <p className={styles.modelLabel}>{m.label}</p>
              <h3 className={styles.modelTitle}>{m.headline}</h3>
              <p className={styles.modelBody}>{m.body}</p>
              {/* A description list, not two paragraphs: "best for" defines
                  the line under it, and that relationship should survive
                  being read aloud. `margin-top: auto` is what puts it on the
                  card foot, so the three sit on one baseline whatever the
                  bodies run to. */}
              <dl className={styles.bestFor}>
                <dt className={styles.bestForLabel}>Best for</dt>
                <dd className={styles.bestForValue}>{m.bestFor}</dd>
              </dl>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* ── access control ───────────────────────────────────────────────
          Built to a supplied reference, 2026-09-11: an eyebrow over a short
          accent rule, a two-tone headline, three principle cards each with a
          schematic beside its copy, and a capability strip closing the block.

          The three named roles that used to sit below the strip were removed
          on request the same day, along with the two permission cards under
          them. Their spans are quoted in copy/APPROVALS.md item 3, which also
          records that the hero still says "Three scoped roles" with nothing on
          the page explaining the count. */}
      <Section id={C.access.id} raised>
        <Head
          pill={C.access.eyebrow}
          rule
          wide
          title={C.access.title}
          sub={C.access.lead}
        />

        <Grid>
          {C.access.pillars.map((p) => (
            <Card key={p.label} span={4} className={styles.pillar}>
              {/* The index over its own rule, the reference's arrangement.
                  Decorative: the label under it is what names the card. */}
              <p className={styles.pillarN} aria-hidden="true">
                {p.n}
              </p>
              <span className={styles.pillarRule} aria-hidden="true" />
              <div className={styles.pillarRow}>
                <div className={styles.pillarCopy}>
                  <p className={styles.pillarLabel}>{p.label}</p>
                  <h3 className={styles.pillarTitle}>{p.headline}</h3>
                  <p className={styles.pillarBody}>{p.body}</p>
                </div>
                {/* Drawn, not photographed, and decorative — every card states
                    its meaning in the copy beside the schematic. */}
                <span className={styles.pillarArt} aria-hidden="true">
                  {ART[p.art]}
                </span>
              </div>
            </Card>
          ))}
        </Grid>

        {/* The capability strip. A list, not four divs: it is four items of
            one kind, and that should survive being read aloud. */}
        <div className={styles.layer}>
          <p className={styles.layerLabel}>{C.access.layer.label}</p>
          <ul className={styles.layerList}>
            {C.access.layer.items.map((i) => (
              <li className={styles.layerItem} key={i.name}>
                <span className={styles.layerIcon} aria-hidden="true">
                  {ICONS[i.icon]}
                </span>
                <span className={styles.layerName}>
                  {i.name}
                  {/* The marker on its own line and out of the tracked
                      capitals. It still reads as text to the copy sweep,
                      which is the only thing that has to find it. */}
                  {i.pending && (
                    <span className={styles.layerPending}>[pending sign-off: {i.pending}]</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </Section>

      {/* ── audit trail ──────────────────────────────────────────────────
          Built to a supplied reference, 2026-09-11: the heading with its
          slogan beside it, the record panel, three cards and a closing strip.

          The panel is real HTML — a real `table` with real headers — not the
          picture the reference draws. A label inside an image cannot be read
          aloud, found by search, translated or reflowed onto a phone, and this
          brief rules out content that exists only in a graphic layer. Its rows
          are fabricated and the panel says so on its own header; see the note
          in app/lib/content/trust.js and APPROVALS item 0b. */}
      <Section id={C.audit.id} wash="cool">
        <div className={styles.auditHead}>
          <Head
            pill={C.audit.eyebrow}
            rule
            title={C.audit.title}
            lit={C.audit.lit}
            sub={C.audit.lead}
          />
          {/* Four words on their own rule, to the right of the heading. A
              slogan rather than a statement, so below 1200px — where there is
              no column to put it in — it is not drawn. */}
          <p className={styles.aside}>
            {C.audit.aside.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </p>
        </div>

        {/* `data-mock` is what tests/test-sweep.mjs strips before it reads
            this page's prose, the same treatment the console mock on Home
            gets. Invented rows inside a picture of a product are tracked
            against APPROVALS rather than swept as copy — sweeping them would
            bury a claims problem in a list of digits. Remove the attribute and
            the sweep starts reporting every timestamp as an unapproved
            number. */}
        <div className={styles.record} data-mock="audit-record">
          <div className={styles.recordBar}>
            <span className={styles.recordLabel}>{C.audit.record.label}</span>
            {/* The mitigation that lets this panel publish invented rows at
                all. It is text, on the panel's own header, where the copy
                sweep reads it — not a caption somewhere below. Do not remove
                it without removing the rows. */}
            <span className={styles.recordTag}>{C.audit.record.tag}</span>
            {/* Colour plus a label, never colour alone: the dot is decorative
                and the state is written out beside it. */}
            <span className={styles.recordState}>
              <span className={styles.recordDot} aria-hidden="true" />
              {C.audit.record.state}
            </span>
          </div>

          {/* The table scrolls on its own axis rather than the page doing it.
              Five columns cannot be made to fit a phone and stay a table. */}
          <div className={styles.recordScroll}>
            <table className={styles.recordTable}>
              <thead>
                <tr>
                  {C.audit.record.columns.map((c) => (
                    <th scope="col" key={c}>
                      {c}
                    </th>
                  ))}
                  <th scope="col">
                    <span className={styles.srOnly}>Row actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {C.audit.record.rows.map((r) => (
                  <tr className={r.accent ? styles.rowLit : undefined} key={r.time}>
                    <td className={styles.cellTime}>{r.time}</td>
                    {/* The flex row is an inner span, not the cell. A `td`
                        set to `display: flex` stops being a table cell and
                        the column loses its alignment with the header. */}
                    <td className={styles.cellEvent}>
                      <span className={styles.event}>
                        <span className={styles.eventIcon} aria-hidden="true">
                          {ICONS[r.icon]}
                        </span>
                        {r.event}
                      </span>
                    </td>
                    <td>{r.desc}</td>
                    <td>{r.who}</td>
                    <td className={styles.cellRef}>{r.ref}</td>
                    {/* The overflow mark the reference draws. It is not a
                        control — nothing opens — so it is a decorative mark
                        rather than a button that lies about what it does. */}
                    <td className={styles.cellMore} aria-hidden="true">
                      •••
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Grid>
          {C.audit.pillars.map((p) => (
            <Card key={p.label} span={4} className={styles.auditCard}>
              <p className={styles.auditN} aria-hidden="true">
                {p.n}
                <span className={styles.auditNRule} />
              </p>
              <div className={styles.auditRow}>
                <span className={styles.auditMark} aria-hidden="true">
                  {ICONS[p.icon]}
                </span>
                <div className={styles.auditCopy}>
                  <p className={styles.pillarLabel}>{p.label}</p>
                  <h3 className={styles.pillarTitle}>{p.headline}</h3>
                  <p className={styles.pillarBody}>{p.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </Grid>

        <ul className={styles.qualities}>
          {C.audit.strip.map((q) => (
            <li className={styles.quality} key={q.name}>
              <span className={styles.qualityIcon} aria-hidden="true">
                {ICONS[q.icon]}
              </span>
              <span>
                <span className={styles.qualityName}>{q.name}</span>
                <span className={styles.qualitySub}>{q.sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── lawful basis ───────────────────────────────────────────────── */}
      <Section id={C.basis.id} raised>
        <Head pill={C.basis.eyebrow} title={C.basis.title} />
        {/* Kept in full. It is the densest prose on the site and the part a
            security reviewer reads most carefully; nothing here was cut to make
            the page shorter. */}
        <Grid>
          {C.basis.items.map((it) => (
            <Card key={it.name} span={4} title={it.name} body={it.body[0]} />
          ))}
        </Grid>
      </Section>

      {/* ── who runs it ────────────────────────────────────────────────── */}
      <Section id={C.deployments.id}>
        <Head pill={C.deployments.eyebrow} title={C.deployments.title} sub={C.deployments.note} />
        <Grid>
          {C.deployments.items.map((d, i) => (
            <Card key={d} span={4}>
              <p className={styles.mark} aria-hidden="true">
                <span className={styles.markBar} data-w={i} />
              </p>
              <h3 className={styles.cardTitle}>{d}</h3>
              <p className={styles.pending}>{C.deployments.pending}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      <PageCta
        pill={C.cta.eyebrow}
        title="Bring your security questions"
        lit="to the demonstration."
        body={C.cta.body}
        actions={[
          { href: '/contact', label: 'Request a Demo', primary: true },
          { href: '/platform', label: 'How the platform works' },
        ]}
      />
    </BentoLayer>
  );
}
