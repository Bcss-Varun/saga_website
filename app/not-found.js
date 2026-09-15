import Link from 'next/link';
import PageHero from './components/PageHero';
import { BentoLayer, Card, Grid, Section } from './components/Bento';
import { VERTICALS } from './lib/nav';
import styles from './not-found.module.css';

/* Custom 404 in the site's own language. Next's default is a white page with
   "404: This page could not be found." — wrong on a dark site, and no help to
   someone who followed a link out of a PDF or a forwarded email, which is how
   most qualified traffic arrives here.

   [draft — needs review] */

export const metadata = {
  title: 'SAGA — Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <BentoLayer>
      <PageHero
        pill="Page not found"
        title="That page is"
        lit="not here."
        lead="The address may have changed, or the link may have been shortened in transit. The pages below cover everything on this site."
        actions={[
          { href: '/contact', label: 'Request a Demo', primary: true },
          { href: '/platform', label: 'How the platform works' },
        ]}
      />

      <Section id="routes" wash="warm">
        <Grid>
          {VERTICALS.map((v, i) => (
            <Card key={v.key} span={3} lit={i === 0}>
              <h2 className={styles.name}>{v.name}</h2>
              <p className={styles.descriptor}>{v.descriptor}</p>
              <p className={styles.go}>
                <Link href={v.href}>Open {v.name} &rarr;</Link>
              </p>
            </Card>
          ))}
        </Grid>
      </Section>
    </BentoLayer>
  );
}
