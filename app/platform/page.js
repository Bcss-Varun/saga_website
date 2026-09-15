import Image from 'next/image';
import Link from 'next/link';
import { pageMetadata } from '../lib/meta';
import PageHero from '../components/PageHero';
import PageCta from '../components/PageCta';
import FaqSection from '../components/FaqSection';
import { BentoLayer, Head, Section } from '../components/Bento';
import {
  AlertCard,
  AlertContains,
  RecordWeb,
  DossierCard,
  EscalationLadder,
  GeoField,
  NetworkGraph,
  OperationLine,
  SentimentPanel,
  ControlGrid,
  SignalFlow,
} from './blocks';
import LayerStack from './LayerStack';
import { platform as C } from '../lib/content/platform';
import styles from './platform.module.css';

export const metadata = pageMetadata({
  title: 'SAGA — Platform',
  description:
    'How SAGA turns public digital signals into structured intelligence: the five intelligence layers, the detect-to-act sequence, the record model and the access boundaries. [draft — needs review]',
  path: '/platform',
});

/* /platform — for a technical evaluator.

   Rebuilt 2026-09-10 to the twelve-block brief. The page runs: the core idea,
   five intelligence layers, the sequence, the record, the alert, the chain,
   security, then the CTA. The console block and the missions block were both
   removed on request — the first duplicated Home's console showcase, the
   second was not wanted.

   Ordered as the pipeline runs rather than by importance, because that is the
   order the reader is trying to reconstruct. All copy is [draft — needs
   review]; see app/lib/content/platform.js, which also records what in the
   brief could not be published as written. */

const VISUALS = {
  sentiment: <SentimentPanel />,
  escalation: <EscalationLadder />,
  network: <NetworkGraph />,
  geo: <GeoField />,
  dossier: <DossierCard />,
};

export default function PlatformPage() {
  return (
    <BentoLayer>
      <PageHero
        pill={C.hero.eyebrow}
        title={C.hero.title}
        lit={C.hero.lit}
        lead={C.hero.body}
        actions={[
          { href: '#idea', label: 'Explore SAGA', primary: true },
          { href: '/contact', label: 'Request a Demo' },
        ]}
        /* The panorama across the whole hero rather than an object beside
           the copy. It says what the platform does before a word is read,
           which is the one job the hero object has on a product that cannot
           show its own UI, and it does it at full width. */
        backdrop="/images/platform-backdrop.webp"
      />

      {/* ── 2. the core idea ───────────────────────────────────────────── */}
      <Section id="idea" wash="warm" wide>
        <Head pill={C.core.eyebrow} title={C.core.title} sub={C.core.lead} wide />
        <SignalFlow {...C.core.flow} />
      </Section>

      {/* ── 4. five intelligence layers ────────────────────────────────
          Five equal cards, the illustration changing sides down the list. The
          numeral, the kicker and the headline are one column; the art is the
          other. Every card is the same height whatever its copy runs to, so
          the five read as one set rather than five sizes. */}
      <Section id="layers" raised wide>
        <Head pill={C.layers.eyebrow} title={C.layers.title} sub={C.layers.lead} />
        <LayerStack className={styles.layers}>
          {C.layers.items.map((l, i) => (
            <li className={styles.layer} key={l.id} style={{ '--i': i }}>
              <div className={styles.layerCopy}>
                <p className={styles.layerN} aria-hidden="true">
                  {l.n}
                  <span className={styles.layerRule} />
                </p>
                <p className={styles.layerKicker}>{l.kicker}</p>
                <h3 className={styles.layerTitle}>{l.headline}</h3>
                <p className={styles.layerBody}>{l.body}</p>
                <Link className={styles.layerLink} href={l.link.href}>
                  <span className={styles.layerArrow} aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M5 12h13M12.5 6l6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {l.link.label}
                  <span className={styles.srOnly}> about {l.kicker.toLowerCase()}</span>
                </Link>
              </div>

              <div className={styles.layerArt}>
                {l.art ? (
                  <Image
                    className={styles.layerArtImage}
                    src={l.art}
                    alt=""
                    width={720}
                    height={540}
                  />
                ) : (
                  VISUALS[l.visual]
                )}
              </div>
            </li>
          ))}
        </LayerStack>
      </Section>

      {/* ── 5. detect to act ───────────────────────────────────────────── */}
      <Section id="sequence" wash="cool">
        <Head pill={C.journey.eyebrow} title={C.journey.title} sub={C.journey.lead} />
        {/* Indices are allowed here and nowhere else on this page: this is a
            genuine sequence, which is the test CLAUDE.md sets for them. */}
        <ol className={styles.seq}>
          {C.journey.steps.map((s) => (
            <li className={styles.seqStep} key={s.n}>
              <p className={styles.seqN}>
                <span className={styles.seqRule} aria-hidden="true" />
                {s.n}
              </p>
              <h3 className={styles.seqName}>{s.name}</h3>
              <p className={styles.seqBody}>{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── 6. what SAGA sees ─────────────────────────────────────────── */}
      <Section id="context" raised wide>
        <Head pill={C.context.eyebrow} title={C.context.title} sub={C.context.lead} wide />
        <RecordWeb
          centreTop={C.context.centreTop}
          centreMain={C.context.centreMain}
          left={C.context.left}
          right={C.context.right}
          globeAlt="A globe ringed with connection points, standing for one digital signal and the context held around it."
        />
      </Section>

      {/* ── 7. the alert ─────────────────────────────────────────────── */}
      <Section id="alert" wash="warm" wide>
        <Head pill={C.alert.eyebrow} title={C.alert.title} sub={C.alert.lead} wide />
        <div className={styles.alertWrap}>
          <div className={styles.alertSide}>
            <AlertCard {...C.alert.card} />
          </div>
          <AlertContains label={C.alert.containsLabel} items={C.alert.contains} />
        </div>
        <p className={styles.alertFoot}>
          <span>{C.alert.foot.left}</span>
          <span className={styles.alertFootRule} aria-hidden="true" />
          <span>{C.alert.foot.right}</span>
        </p>
      </Section>

      {/* ── 10. in operation ──────────────────────────────────────────── */}
      <Section id="action" raised wide>
        <Head
          pill={C.action.eyebrow}
          title={C.action.title}
          lit={C.action.lit}
          sub={C.action.lead}
          rule
          flip
          wide
        />
        <OperationLine steps={C.action.chain} />
        <p className={styles.opsNote}>
          <span className={styles.opsNoteRule} aria-hidden="true" />
          {C.action.note}
          <span className={styles.opsNoteRule} aria-hidden="true" />
        </p>
      </Section>

      {/* ── 11. security ──────────────────────────────────────────────── */}
      <Section id="security" wash="cool" wide>
        <Head
          pill={C.security.eyebrow}
          title={C.security.title}
          lit={C.security.lit}
          sub={C.security.lead}
          rule
          flip
          wide
        />
        <ControlGrid items={C.security.items} />
        <p className={styles.onward}>
          <Link href={C.security.link.href}>
            {C.security.link.label} <span aria-hidden="true">&rarr;</span>
          </Link>
        </p>
      </Section>

      <FaqSection title="Platform questions." items={C.faqs} name="qa-platform" raised />

      <PageCta
        pill={C.cta.eyebrow}
        title={C.cta.title}
        lit={C.cta.lit}
        body={C.cta.body}
        actions={[
          { href: '/contact', label: 'Request a Demo', primary: true },
          { href: '/public-safety', label: 'Explore Solutions' },
        ]}
      />
    </BentoLayer>
  );
}
