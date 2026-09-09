import { pageMetadata } from '../lib/meta';
import HeroFrame from '../components/HeroFrame';
import ContactForm from './ContactForm';
import { contact as C } from '../lib/content/contact';
import styles from './contact.module.css';

export const metadata = pageMetadata({
  title: 'SAGA — Request a demonstration',
  description: 'Request a demonstration configured for your vertical and region. [draft — needs review]',
  path: '/contact',
});

/* /contact — demo request, with the provenance instrumentation the project's
   success metric depends on. See app/lib/visitSource.js.
   All copy is [draft — needs review]. */


export default function ContactPage() {
  return (
    <>
      <HeroFrame>
        <section className="sec" id="hero" data-scene="none">
          <div className="inner">
            <p className="eyebrow rv">{C.hero.eyebrow}</p>
            <h1 className="rv d1" style={{ maxWidth: '20ch' }}>
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

      <section className="sec" id="form">
        <div className="inner">
          <div className={styles.layout}>
            <ContactForm />
            <aside className={styles.aside}>
              <h2>Or write directly</h2>
              <p className={styles.mail}>
                <a href={`mailto:${C.mail}`}>{C.mail}</a>
              </p>
              <p>{C.mailNote}</p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
