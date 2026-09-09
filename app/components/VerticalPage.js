import Link from 'next/link';
import HeroFrame from './HeroFrame';
import SectionNav from './SectionNav';
import WorldGraphic from './WorldGraphic';
import { getVertical } from '../lib/verticalContent';
import styles from './VerticalPage.module.css';

/* The single template behind /public-safety, /governance, /brands and
   /celebrity. Structure is identical across all four; only depth varies
   (6/6/4/4 modules, 3/3/2/2 scenarios, 6/6/4/4 FAQ).

   Every block is written to stand alone. Qualified traffic arrives from a PDF
   link, a search result or a forward — never from Home — so the page names the
   product, states what it does, restates the signal-to-action pipeline rather
   than referring back to it, and closes with its own CTA. No block assumes the
   visitor has read anything else.

   Placeholders render as visible placeholders. That is deliberate: filler that
   reads like real copy is how unreviewed sentences reach production.

   ── Density layout ────────────────────────────────────────────────────────
   A vertical whose content sets `dense: true` renders the restructured layout:
   larger display type, eyebrow pills, alternating section grounds, the triad as
   a large-type list, modules as title/answer/detail, and scenarios with a
   bolded outcome. Everything else renders exactly as before.

   Both paths are live on purpose. The pass is being reviewed one page at a
   time, and a shared template cannot change under three pages that have not
   been through it. When all four are converted the `dense` branches collapse
   and the old ones go.

   [copy: needs specificity rewrite] */

const SECTIONS = [
  { id: 'how', name: 'How it works' },
  { id: 'capabilities', name: 'Capabilities' },
  { id: 'pipeline', name: 'Signal to action' },
  { id: 'scenarios', name: 'Scenarios' },
  { id: 'deployment', name: 'Deployment' },
  { id: 'faq', name: 'FAQ' },
];

function Pending({ children }) {
  return <span className={styles.pending}>{children}</span>;
}

/* Only the density layout gets a wrapper element. The other three verticals
   keep the exact DOM they have today — no extra div for a sibling selector to
   trip over. Defined at module scope: a component declared inside render is a
   new type on every render, which remounts its whole subtree. */
function Shell({ dense, children }) {
  return dense ? <div className="dense">{children}</div> : <>{children}</>;
}

/* An eyebrow, rendered as a pill under the density layout and as the plain
   ported eyebrow otherwise. Same element and same text either way, so nothing
   about the heading order or the reading order changes. */
function Eyebrow({ dense, className = '', children }) {
  return <p className={`eyebrow ${dense ? 'dpill' : ''} ${className}`}>{children}</p>;
}

export default function VerticalPage({ vertical }) {
  const v = getVertical(vertical);
  /* alternating grounds, so sections read as blocks rather than one scroll */
  const alt = v.dense ? 'dalt' : '';
  return (
    <Shell dense={v.dense}>
      {/* 1 — hero: the vertical's problem, and what SAGA is, for a reader
             who has never seen the site before */}
      {/* The `worlds` scene renders this vertical's own point-cloud form:
          a street grid for Public Safety, territorial patches for Governance,
          a radial spread for Brands, hubs and runs for Celebrity. The scene
          anchors and clips to #worldslot, so the field sits beside the copy
          rather than behind it. */}
      <HeroFrame>
        <section className="sec" id="hero" data-scene="worlds" data-world={v.key}>
        <div className={styles.heroSlot} id="worldslot" aria-hidden="true" />
        <div className="inner">
          <Eyebrow dense={v.dense} className="rv">{v.label}</Eyebrow>
          <h1 className="rv d1" style={{ maxWidth: '22ch' }}>
            {v.title}
          </h1>
          <p className="lead rv d2" style={{ maxWidth: '58ch' }}>
            {v.body}
          </p>
          <div className="herorow rv d3">
            <Link className="cta" href="/contact">
              Request a Demo
            </Link>
            <Link className="cta2" href="/platform">
              How the platform works
            </Link>
          </div>
          </div>
        </section>
      </HeroFrame>

      {v.authored && (
        <p className={styles.draftBanner} role="note">
          [draft &mdash; needs review] &mdash; copy on this page is drafted and not yet signed off.
        </p>
      )}

      <SectionNav sections={SECTIONS} label={`On this page: ${v.name}`} />

      {/* 2 — Monitor / Investigate / Manage */}
      <section className={`sec ${styles.anchor}`} id="how">
        <div className="inner">
          <Eyebrow dense={v.dense} className="rv">How teams use it</Eyebrow>
          <h2 className="rv d1" style={{ maxWidth: '20ch' }}>
            Monitor, investigate, manage.
          </h2>
          {v.dense ? (
            /* one line per verb — a list to be read down, not three cards to
               be read across */
            <ul className={styles.triadList}>
              {v.triad.map((t, i) => (
                <li className={i ? `rv d${i}` : 'rv'} key={t.key}>
                  <h3>{t.name}</h3>
                  <p>{t.line}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="cabgrid">
              {v.triad.map((t, i) => (
                <article className={i ? `cab rv d${i}` : 'cab rv'} key={t.key}>
                  <h3>{t.name}</h3>
                  <p className="cab-s">
                    {t.placeholder ? <Pending>{t.body}</Pending> : t.body}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3 — capability modules */}
      <section className={`sec ${styles.anchor} ${alt}`} id="capabilities">
        <div className="inner">
          <div className="cabhead">
            <Eyebrow dense={v.dense} className="rv">Capabilities</Eyebrow>
            <h2 className="rv d1">What {v.name} teams get.</h2>
          </div>
          <div className="cabgrid">
            {v.modules.map((m, i) => (
              <article className={i % 4 ? `cab rv d${i % 4}` : 'cab rv'} key={m.name}>
                <h3>{m.name}</h3>
                {m.answer ? (
                  <>
                    {/* the answer carries the mechanism and is the only line a
                        scanning reader is expected to take */}
                    <p className={styles.answer}>{m.answer}</p>
                    {m.detail.map((line) => (
                      <p className={styles.detail} key={line.slice(0, 30)}>
                        {line}
                      </p>
                    ))}
                  </>
                ) : (
                  <p>{m.placeholder ? <Pending>{m.body}</Pending> : m.body}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — signature visual */}
      <section className="sec" id="signature">
        <div className="inner">
          <div className={styles.signature}>
            <div className="wshot" data-k={v.key}>
              <WorldGraphic vertical={v.key} />
            </div>
            <div className={styles.signatureCopy}>
              <h2 className="rv" style={{ maxWidth: '18ch' }}>
                {v.valueLine}
              </h2>
              <p className="lead rv d1">{v.valueBody}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — signal-to-action strip. Restated in full: this page stands alone. */}
      <section className={`sec ${styles.anchor} ${alt}`} id="pipeline">
        <div className="inner">
          <Eyebrow dense={v.dense} className="rv">Signal to action</Eyebrow>
          <h2 className="rv d1" style={{ maxWidth: '17ch' }}>
            Every signal has somewhere to go.
          </h2>
          <div className="flow">
            {v.strip.map(([n, name], i) => (
              <div className={i ? `fstep rv d${Math.min(i, 3)}` : 'fstep rv'} key={n}>
                <span className="n">{n}</span>
                <h3>{name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — scenario narratives (illustrative, anonymised) */}
      <section className={`sec ${styles.anchor}`} id="scenarios">
        <div className="inner">
          <Eyebrow dense={v.dense} className="rv">Scenarios</Eyebrow>
          <h2 className="rv d1" style={{ maxWidth: '20ch' }}>
            What this looks like in practice.
          </h2>
          <p className={`rv d2 ${styles.illustrative}`}>
            Illustrative. Anonymised, with no real names or places.
          </p>
          <div className={styles.scenarios}>
            {v.scenarios.map((s, i) => (
              <article className={i ? `${styles.scenario} rv d${i}` : `${styles.scenario} rv`} key={s.name}>
                <h3>{s.name}</h3>
                {s.outcome ? (
                  <>
                    <p className={styles.setup}>{s.setup}</p>
                    {/* the outcome is what the card is for; it reads bold and
                        last so the eye can take only that line */}
                    <p className={styles.outcome}>{s.outcome}</p>
                  </>
                ) : (
                  <p>{s.placeholder ? <Pending>{s.body}</Pending> : s.body}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — deployment note */}
      <section className={`sec ${styles.anchor} ${alt}`} id="deployment">
        <div className="inner">
          <Eyebrow dense={v.dense} className="rv">Deployment</Eyebrow>
          <h2 className="rv d1" style={{ maxWidth: '20ch' }}>
            How it is deployed.
          </h2>
          <div className={styles.deployment}>
            {v.deployment.paragraphs.map((para) =>
              typeof para === 'string' ? (
                <p key={para.slice(0, 40)}>
                  {v.deployment.placeholder ? <Pending>{para}</Pending> : para}
                </p>
              ) : (
                /* bold lead-in, then the statement — the densest prose on a
                   vertical page, and the block that most needs a scan line */
                <p className="dleadin" key={para.lead}>
                  <b>{para.lead}</b>
                  {para.body}
                </p>
              )
            )}
            <p className={styles.deploymentMeta}>
              <Link href="/trust">Security, data handling and lawful basis &rarr;</Link>
            </p>
          </div>
        </div>
      </section>

      {/* 8 — FAQ */}
      <section className={`sec ${styles.anchor}`} id="faq">
        <div className="inner">
          <div className="faqhead">
            <Eyebrow dense={v.dense} className="rv">FAQ</Eyebrow>
            <h2 className="rv d1">{v.name} questions.</h2>
          </div>
          <div className="faqs">
            {[0, 1].map((col) => (
              <div className="faqcol" key={col}>
                {v.faqs
                  .filter((_, i) => i % 2 === col)
                  .map((f) => (
                    <details className="qa" name={`qa-${v.key}`} key={f.q}>
                      <summary>
                        <h3>{f.q}</h3>
                        <i className="qi" aria-hidden="true">
                          <svg viewBox="0 0 18 18">
                            <path d="M4 6.8 9 11.8 14 6.8" />
                          </svg>
                        </i>
                      </summary>
                      <div className="qabody">
                        <p>{f.placeholder ? <Pending>{f.a}</Pending> : f.a}</p>
                      </div>
                    </details>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 — CTA */}
      <section className={`sec ${alt}`} id="final">
        <div className="inner">
          <Eyebrow dense={v.dense} className="rv">Request a demonstration</Eyebrow>
          <h2
            className="rv d1"
            style={{ maxWidth: '17ch', marginLeft: 'auto', marginRight: 'auto' }}
          >
            See it running on your own region.
          </h2>
          <div className="finalrow rv d3">
            <Link className="cta" href="/contact">
              Request a Demo
            </Link>
            <Link className="cta2" href="/platform">
              How the platform works
            </Link>
          </div>
          <p className="mailnote rv d3">
            Or write directly to{' '}
            <a href="mailto:smartapps@bluecloudsoftech.com">smartapps@bluecloudsoftech.com</a>
            <br />A product specialist replies within one working day.
          </p>
        </div>
      </section>
    </Shell>
  );
}
