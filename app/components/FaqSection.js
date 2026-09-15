import Link from 'next/link';
import Faq from './Faq';
import { Section, Pill } from './Bento';
import styles from './FaqSection.module.css';

/* The FAQ block: the heading and the way out on the left, the questions on the
   right. The left column is sticky, so on a page with eight questions the
   "still need something" route stays on screen while the reader works down
   them rather than arriving only after they have given up. */
export default function FaqSection({ id = 'faq', pill = 'Questions', title, items, name, raised }) {
  return (
    <Section id={id} raised={raised}>
      <div className={styles.split}>
        <div className={styles.aside}>
          <Pill>{pill}</Pill>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.note}>
            Anything not answered here, a product specialist can take in the demonstration.
          </p>
          <Link className="cta2" href="/contact">
            Ask a question
          </Link>
        </div>
        <div className={styles.list}>
          <Faq items={items} name={name} />
        </div>
      </div>
    </Section>
  );
}
