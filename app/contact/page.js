import { pageMetadata } from '../lib/meta';
import PageHero from '../components/PageHero';
import ContactForm from './ContactForm';
import { BentoLayer, Section } from '../components/Bento';
import { contact as C } from '../lib/content/contact';
import styles from './contact.module.css';

export const metadata = pageMetadata({
  title: 'SAGA — Request a demonstration',
  description:
    'Request a demonstration configured for your vertical and region. [draft — needs review]',
  path: '/contact',
});

/* /contact — demo request, with the provenance instrumentation the project's
   success metric depends on. See app/lib/visitSource.js.

   No closing call to action on this page: the page is the call to action, and
   a second one under the form would only send a reader who has arrived at the
   right place somewhere else. All copy is [draft — needs review]. */

export default function ContactPage() {
  return (
    <BentoLayer>
      <PageHero
        pill={C.hero.eyebrow}
        title={C.hero.title}
        lead={C.hero.body}
      />

      <Section id="form" wash="cool">
        <div className={styles.layout}>
          <div className={styles.formCard}>
            <ContactForm />
          </div>

          <aside className={styles.aside}>
            <h2>Or write directly</h2>
            <p className={styles.mail}>
              <a href={`mailto:${C.mail}`}>{C.mail}</a>
            </p>
            <p>{C.mailNote}</p>
          </aside>
        </div>
      </Section>
    </BentoLayer>
  );
}
