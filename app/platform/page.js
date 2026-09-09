import { pageMetadata } from '../lib/meta';
import Link from 'next/link';
import HeroFrame from '../components/HeroFrame';
import SectionNav from '../components/SectionNav';
import { platform as C } from '../lib/content/platform';
import styles from './platform.module.css';

export const metadata = pageMetadata({
  title: 'SAGA — Platform',
  description: 'The four-stage pipeline, the record architecture, the RSS engine and the access model. [draft — needs review]',
  path: '/platform',
});

/* /platform — for a technical evaluator. All copy is [draft — needs review];
   see app/lib/content/platform.js. */


const SECTIONS = [
  { id: 'pipeline', name: 'Pipeline' },
  { id: 'architecture', name: 'Architecture' },
  { id: 'rss', name: 'RSS engine' },
  { id: 'languages', name: 'Languages' },
  { id: 'access', name: 'Access control' },
  { id: 'faq', name: 'FAQ' },
];

function Prose({ body }) {
  return (
    <div className={styles.prose}>
      {body.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </div>
  );
}

export default function PlatformPage() {
  return (
    <>
      <HeroFrame>
        <section className="sec" id="hero" data-scene="none">
          <div className="inner">
            <p className="eyebrow rv">{C.hero.eyebrow}</p>
            <h1 className="rv d1" style={{ maxWidth: '22ch' }}>
              {C.hero.title}
            </h1>
            <p className="lead rv d2" style={{ maxWidth: '58ch' }}>
              {C.hero.body}
            </p>
          </div>
        </section>
      </HeroFrame>

      <p className={styles.draftBanner} role="note">
        [draft &mdash; needs review] &mdash; copy on this page is drafted and not yet signed off.
      </p>

      <SectionNav sections={SECTIONS} label="On this page: Platform" />

      <section className={`sec ${styles.anchor}`} id="pipeline">
        <div className="inner">
          <p className="eyebrow rv">{C.stages.eyebrow}</p>
          <h2 className="rv d1" style={{ maxWidth: '22ch' }}>
            {C.stages.title}
          </h2>
          <p className={styles.lead}>{C.stages.lead}</p>
          <ol className={styles.stages}>
            {C.stages.items.map((s) => (
              <li key={s.n}>
                <span className={styles.stageN} aria-hidden="true">
                  {s.n}
                </span>
                <h3>{s.name}</h3>
                <p>{s.body}</p>
                {s.note && <p className={styles.stageNote}>{s.note}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {[C.architecture, C.rss, C.languages].map((s, i) => (
        <section
          className={`sec ${styles.anchor}`}
          id={['architecture', 'rss', 'languages'][i]}
          key={s.title}
        >
          <div className="inner">
            <p className="eyebrow rv">{s.eyebrow}</p>
            <h2 className="rv d1" style={{ maxWidth: '24ch' }}>
              {s.title}
            </h2>
            <Prose body={s.body} />
          </div>
        </section>
      ))}

      <section className={`sec ${styles.anchor}`} id="access">
        <div className="inner">
          <p className="eyebrow rv">{C.rbac.eyebrow}</p>
          <h2 className="rv d1" style={{ maxWidth: '24ch' }}>
            {C.rbac.title}
          </h2>
          <Prose body={C.rbac.body} />
          <p className={styles.onward}>
            <Link href={C.rbac.link.href}>{C.rbac.link.label} &rarr;</Link>
          </p>
        </div>
      </section>

      <section className={`sec ${styles.anchor}`} id="faq">
        <div className="inner">
          <div className="faqhead">
            <p className="eyebrow rv">FAQ</p>
            <h2 className="rv d1">Platform questions.</h2>
          </div>
          <div className="faqs">
            {[0, 1].map((col) => (
              <div className="faqcol" key={col}>
                {C.faqs
                  .filter((_, i) => i % 2 === col)
                  .map((f) => (
                    <details className="qa" name="qa-platform" key={f.q}>
                      <summary>
                        <h3>{f.q}</h3>
                        <i className="qi" aria-hidden="true">
                          <svg viewBox="0 0 18 18">
                            <path d="M4 6.8 9 11.8 14 6.8" />
                          </svg>
                        </i>
                      </summary>
                      <div className="qabody">
                        <p>{f.a}</p>
                      </div>
                    </details>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="final">
        <div className="inner">
          <p className="eyebrow rv">Request a demonstration</p>
          <h2
            className="rv d1"
            style={{ maxWidth: '18ch', marginLeft: 'auto', marginRight: 'auto' }}
          >
            See the pipeline running on your own sources.
          </h2>
          <div className="finalrow rv d3">
            <Link className="cta" href="/contact">
              Request a Demo
            </Link>
            <Link className="cta2" href="/investigation">
              Investigation tools
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
