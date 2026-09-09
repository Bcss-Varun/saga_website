import { pageMetadata } from '../lib/meta';
import Link from 'next/link';
import HeroFrame from '../components/HeroFrame';
import SectionNav from '../components/SectionNav';
import { investigation as C } from '../lib/content/investigation';
import styles from './investigation.module.css';

export const metadata = pageMetadata({
  title: 'SAGA — Investigation',
  description: 'SOC-EYE, deepfake verdicts, OSINT enumeration, EXIF and location extraction, email and phone intelligence, cross-platform search. [draft — needs review]',
  path: '/investigation',
});

/* /investigation — for an investigating officer. All copy is
   [draft — needs review]; see app/lib/content/investigation.js. */


const SECTIONS = [
  { id: 'soc-eye', name: 'SOC-EYE' },
  { id: 'tools', name: 'Tools' },
  { id: 'record', name: 'Working the record' },
  { id: 'faq', name: 'FAQ' },
];

export default function InvestigationPage() {
  return (
    <>
      <HeroFrame>
        <section className="sec" id="hero" data-scene="none">
          <div className="inner">
            <p className="eyebrow rv">{C.hero.eyebrow}</p>
            <h1 className="rv d1" style={{ maxWidth: '24ch' }}>
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

      <SectionNav sections={SECTIONS} label="On this page: Investigation" />

      {/* SOC-EYE gets a section of its own rather than a slot in a grid. */}
      <section className={`sec ${styles.anchor}`} id="soc-eye">
        <div className="inner">
          <p className="eyebrow rv">{C.soceye.eyebrow}</p>
          <h2 className="rv d1" style={{ maxWidth: '20ch' }}>
            {C.soceye.title}
          </h2>
          <p className={styles.lead}>{C.soceye.lead}</p>
          <div className={styles.prose}>
            {C.soceye.body.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className={`sec ${styles.anchor}`} id="tools">
        <div className="inner">
          <p className="eyebrow rv">{C.tools.eyebrow}</p>
          <h2 className="rv d1" style={{ maxWidth: '22ch' }}>
            {C.tools.title}
          </h2>
          <div className={styles.tools}>
            {C.tools.items.map((t) => (
              <article className={styles.tool} key={t.name}>
                <h3>{t.name}</h3>
                <dl>
                  <dt>Takes</dt>
                  <dd>{t.takes}</dd>
                  <dt>Returns</dt>
                  <dd>{t.gives}</dd>
                  <dt>Limits</dt>
                  <dd className={styles.limit}>{t.limit}</dd>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`sec ${styles.anchor}`} id="record">
        <div className="inner">
          <p className="eyebrow rv">{C.chain.eyebrow}</p>
          <h2 className="rv d1" style={{ maxWidth: '18ch' }}>
            {C.chain.title}
          </h2>
          <div className={styles.prose}>
            {C.chain.body.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <p className={styles.onward}>
            <Link href="/trust">Deployment, audit trail and lawful basis &rarr;</Link>
          </p>
        </div>
      </section>

      <section className={`sec ${styles.anchor}`} id="faq">
        <div className="inner">
          <div className="faqhead">
            <p className="eyebrow rv">FAQ</p>
            <h2 className="rv d1">Investigation questions.</h2>
          </div>
          <div className="faqs">
            {[0, 1].map((col) => (
              <div className="faqcol" key={col}>
                {C.faqs
                  .filter((_, i) => i % 2 === col)
                  .map((f) => (
                    <details className="qa" name="qa-investigation" key={f.q}>
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
            style={{ maxWidth: '20ch', marginLeft: 'auto', marginRight: 'auto' }}
          >
            Bring an identifier and see what comes back.
          </h2>
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
    </>
  );
}
