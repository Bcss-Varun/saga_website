import { pageMetadata } from '../lib/meta';
import Link from 'next/link';
import HeroFrame from '../components/HeroFrame';
import { trust } from '../lib/content/trust';
import styles from './trust.module.css';

export const metadata = pageMetadata({
  title: 'SAGA — Trust',
  description: 'How SAGA is deployed, how access is bounded, what the audit trail records, and the basis on which data is handled. [draft — needs review]',
  path: '/trust',
});

/* /trust — deployment, access control, audit trail, lawful basis.

   Small page, disproportionate weight in government procurement. It is reachable
   from the top nav, not only the footer.

   All copy is [draft — needs review]; see app/lib/content/trust.js. */


/* An eyebrow, rendered as a pill under the density layout. */
function Eyebrow({ children }) {
  return <p className="eyebrow dpill rv">{children}</p>;
}

export default function TrustPage() {
  /* Density layout — see CLAUDE.md, "Density pass". `dense` is a global class
     carrying the shared type scale, grounds, pills and lead-in card. */
  const alt = trust.dense ? 'dalt' : '';

  return (
    <div className={trust.dense ? 'dense' : undefined}>
      <HeroFrame>
        <section className="sec" id="hero" data-scene="none">
          <div className="inner">
            <Eyebrow>{trust.hero.eyebrow}</Eyebrow>
            <h1 className="rv d1" style={{ maxWidth: '20ch' }}>
              {trust.hero.title}
            </h1>
            <p className="lead rv d2" style={{ maxWidth: '58ch' }}>
              {trust.hero.body}
            </p>
          </div>
        </section>
      </HeroFrame>

      <p className={styles.draftBanner} role="note">
        [draft &mdash; needs review] &mdash; copy on this page is drafted and not yet signed off.
      </p>

      {trust.sections.map((s, si) => (
        /* alternate grounds so the four blocks read as blocks */
        <section className={`sec ${styles.anchor} ${si % 2 ? alt : ''}`} id={s.id} key={s.id}>
          <div className="inner">
            <Eyebrow>{s.eyebrow}</Eyebrow>
            <h2 className="rv d1" style={{ maxWidth: '22ch' }}>
              {s.title}
            </h2>

            {s.lead && <p className={`lead rv d2 ${styles.sectionLead}`}>{s.lead}</p>}

            {s.body.length > 0 &&
              (typeof s.body[0] === 'string' ? (
                <div className={styles.prose}>
                  {s.body.map((para) => (
                    <p key={para.slice(0, 40)}>{para}</p>
                  ))}
                </div>
              ) : (
                /* bold lead-in, then the statement. This is the treatment the
                   lawful-basis block needs most: it is the densest prose on the
                   site and nothing in it was cut to achieve this. */
                <div className="dleadgrid">
                  {s.body.map((para) => (
                    <p className="dleadin" key={para.lead}>
                      <b>{para.lead}</b>
                      {para.body}
                    </p>
                  ))}
                </div>
              ))}

            {s.roles && (
              <div className={`cabgrid ${styles.roles}`}>
                {s.roles.map((r, i) => (
                  <article className={i ? `cab rv d${i}` : 'cab rv'} key={r.name}>
                    <h3>{r.name}</h3>
                    {r.answer ? (
                      <>
                        <p className={styles.answer}>{r.answer}</p>
                        {r.detail.map((line) => (
                          <p className={styles.detail} key={line.slice(0, 30)}>
                            {line}
                          </p>
                        ))}
                      </>
                    ) : (
                      <p>{r.body}</p>
                    )}
                  </article>
                ))}
              </div>
            )}

            {s.extras && (
              <div className={styles.extras}>
                {s.extras.map((e) => (
                  <article className={styles.extra} key={e.name}>
                    <h3>{e.name}</h3>
                    <p>{e.body}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      <section className={`sec ${styles.anchor} ${alt}`} id="deployments">
        <div className="inner">
          <Eyebrow>{trust.deployments.eyebrow}</Eyebrow>
          <h2 className="rv d1" style={{ maxWidth: '20ch' }}>
            {trust.deployments.title}
          </h2>
          <p className={styles.note}>{trust.deployments.note}</p>
          <ul className={styles.descriptors}>
            {trust.deployments.items.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec" id="final">
        <div className="inner">
          <Eyebrow>{trust.cta.eyebrow}</Eyebrow>
          <h2
            className="rv d1"
            style={{ maxWidth: '20ch', marginLeft: 'auto', marginRight: 'auto' }}
          >
            {trust.cta.title}
          </h2>
          <p className="lead rv d2" style={{ maxWidth: '52ch' }}>
            {trust.cta.body}
          </p>
          <div className="finalrow rv d3">
            <Link className="cta" href="/contact">
              Request a Demo
            </Link>
            <Link className="cta2" href="/platform">
              How the platform works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
