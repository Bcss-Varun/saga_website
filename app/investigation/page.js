import Link from 'next/link';
import { pageMetadata } from '../lib/meta';
import PageHero from '../components/PageHero';
import PageCta from '../components/PageCta';
import FaqSection from '../components/FaqSection';
import { BentoLayer, Head, Section } from '../components/Bento';
import ToolExplorer from './ToolExplorer';
import { investigation as C } from '../lib/content/investigation';
import styles from './investigation.module.css';

export const metadata = pageMetadata({
  title: 'SAGA — Investigation',
  description:
    'Blura SAGA investigation tools for deepfake analysis, open-source intelligence, image metadata, email and phone intelligence, and contextual search.',
  path: '/investigation',
});

/* /investigation — for an investigating officer. All copy is
   [draft — needs review]; see app/lib/content/investigation.js. */

export default function InvestigationPage() {
  return (
    <BentoLayer>
      <PageHero
        pill={C.hero.eyebrow}
        title={C.hero.title}
        lit={C.hero.lit}
        lead={C.hero.body}
        actions={[
          { href: '/contact', label: 'Request a Demo', primary: true },
          { href: '#tools', label: 'See the tools' },
        ]}
        /* The supplied render: an investigation graph of accounts, images,
           locations and identifiers radiating from one node — the page's own
           argument, drawn. Its left third is empty, which is where the copy
           sits; the scrim in `PageHero` keeps the headline on flat black
           regardless. */
        backdrop="/images/investigation-backdrop.webp"
        /* Shifted right of centre in the crop, which moves the picture left in
           frame: the graph and its node cluster sit at the render's right-hand
           end and were being cut by the `cover` crop. */
        backdropPos="68% center"
      />

      {/* How SAGA investigates — find, connect, build.

          A genuine sequence, which is why the three carry indices. The
          boundary statements this section used to hold are in the FAQ; see the
          note in app/lib/content/investigation.js. */}
      <Section id="how" wash="warm" wide>
        <Head pill={C.workflow.eyebrow} title={C.workflow.title} sub={C.workflow.lead} wide />
        <ol className={styles.steps}>
          {C.workflow.steps.map((st) => (
            <li className={styles.step} key={st.n}>
              <p className={styles.stepHead}>
                <span className={styles.stepN}>{st.n}</span>
                <span className={styles.stepRule} aria-hidden="true" />
                <span className={styles.stepName}>{st.name}</span>
              </p>
              <p className={styles.stepBody}>{st.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* The tool explorer — three category tabs over a card track.

          Replaced the Takes / Returns / Limits cards on 2026-09-10 with
          supplied copy, then rebuilt as tabs and a carousel on request. The
          objection to both is recorded in ToolExplorer.js and in CLAUDE.md;
          the `<noscript>` rule below is what keeps the whole catalogue
          readable when the interaction is not available.

          The limitation statements those cards carried are in the FAQ now; see
          the note in app/lib/content/investigation.js, and do not trim them. */}
      <Section id="tools" raised wide>
        <Head pill={C.tools.eyebrow} title={C.tools.title} sub={C.tools.lead} wide />
        <noscript>
          <style>{'[data-panel]{display:block!important}'}</style>
        </noscript>
        <ToolExplorer categories={C.tools.categories} />
      </Section>

      {/* Investigation context — three fixed cards.

          Rebuilt 2026-09-11 with supplied copy. The two statements the old
          copy carried and this one does not are in the FAQ; see the note in
          app/lib/content/investigation.js, and do not trim them.

          The indices are the client's and the run is a progression — hold the
          findings, trace them, work them — which is the test CLAUDE.md sets
          for numbering anything. */}
      <Section id="record" wash="cool" wide>
        <Head pill={C.chain.eyebrow} title={C.chain.title} sub={C.chain.lead} wide />
        <ol className={styles.recs}>
          {C.chain.items.map((r) => (
            <li className={styles.rec} key={r.n}>
              <p className={styles.recHead}>
                <span className={styles.recN}>{r.n}</span>
                <span className={styles.recRule} aria-hidden="true" />
                <span className={styles.recName}>{r.name}</span>
              </p>
              <h3 className={styles.recLead}>{r.lead}</h3>
              <p className={styles.recBody}>{r.body}</p>
            </li>
          ))}
        </ol>
        <p className={styles.onward}>
          <Link href="/trust">Deployment, audit trail and lawful basis &rarr;</Link>
        </p>
      </Section>

      <FaqSection title="Investigation questions." items={C.faqs} name="qa-investigation" raised />

      <PageCta
        pill="Request a demonstration"
        title="Bring an identifier and"
        lit="see what comes back."
        body="A product specialist can run the tools against the kind of material your team actually works with."
        actions={[
          { href: '/contact', label: 'Request a Demo', primary: true },
          { href: '/platform', label: 'How the platform works' },
        ]}
      />
    </BentoLayer>
  );
}
