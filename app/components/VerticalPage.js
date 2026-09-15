import Image from 'next/image';
import Link from 'next/link';
import { BentoLayer, Section, Head } from './Bento';
import PageHero from './PageHero';
import PageCta from './PageCta';
import FaqSection from './FaqSection';
import { getVertical } from '../lib/verticalContent';
import VerticalVisual, { Icon } from './verticals/VerticalVisual';
import styles from './VerticalPage.module.css';

// Used only by the four solution routes. Shared site components stay unchanged.
function TextLink({ link }) {
  return link ? (
    <Link className={styles.textLink} href={link.href}>
      <span>{link.label}</span><Icon name="arrow" />
    </Link>
  ) : null;
}

function FeatureDetails({ items, columns = false }) {
  return (
    <div className={columns ? styles.detailColumns : styles.details}>
      {items.map(item => (
        <article className={styles.detail} key={item.title}>
          <span className={styles.detailMark} aria-hidden="true" />
          <div><h3>{item.title}</h3><p>{item.body}</p></div>
        </article>
      ))}
    </div>
  );
}

function FeatureSection({ feature, index }) {
  const wide = feature.layout === 'wide';
  return (
    <Section id={feature.id} raised={index !== 1} wash={index === 1 ? 'cool' : undefined}>
      {wide ? (
        <>
          <Head pill={feature.eyebrow} title={feature.title} sub={feature.body} wide />
          <VerticalVisual type={feature.visual} title={feature.visualTitle} wide />
          <FeatureDetails items={feature.items} columns />
        </>
      ) : (
        <div className={[styles.featureSplit, feature.flip ? styles.reversed : ''].join(' ')}>
          <div className={styles.featureCopy}>
            <Head pill={feature.eyebrow} title={feature.title} sub={feature.body} left />
            <FeatureDetails items={feature.items} />
            {feature.note && <p className={styles.note}>{feature.note}</p>}
            <TextLink link={feature.link} />
          </div>
          <VerticalVisual type={feature.visual} title={feature.visualTitle} />
        </div>
      )}
      {wide && feature.note && <p className={styles.wideNote}>{feature.note}</p>}
      {wide && <TextLink link={feature.link} />}
    </Section>
  );
}

function Workflow({ data }) {
  return (
    <Section id={data.id} wash="warm">
      {data.visual ? (
        <div className={styles.featureSplit}>
          <div className={styles.featureCopy}>
            <Head pill={data.eyebrow} title={data.title} sub={data.body} left />
            <FeatureDetails items={data.steps} />
          </div>
          <VerticalVisual type={data.visual} title="A briefing connected to its sources" />
        </div>
      ) : (
        <>
          <Head pill={data.eyebrow} title={data.title} sub={data.body} wide />
          <ol className={styles.workflow}>
            {data.steps.map((step, i) => (
              <li key={step.title}>
                <div className={styles.stepRail}><span>{String(i + 1).padStart(2, '0')}</span></div>
                <h3>{step.title}</h3><p>{step.body}</p>
              </li>
            ))}
          </ol>
        </>
      )}
    </Section>
  );
}

function Scenarios({ data }) {
  return (
    <Section id="scenarios" raised>
      <div className={styles.scenarioHead}>
        <Head pill="In practice" title={data.title} left />
        <p className={styles.scenarioIntro}>{data.intro}</p>
      </div>
      <div className={styles.scenarios} style={{ '--scenario-columns': data.items.length }}>
        {data.items.map(item => (
          <article key={item.title} className={styles.scenario}>
            <div className={styles.scenarioIcon}><Icon name={item.icon} /></div>
            <h3>{item.title}</h3>
            <p>{item.setup}</p>
            <div className={styles.scenarioAction}><span>How the team uses it</span><p>{item.action}</p></div>
            <p className={styles.outcome}><Icon name="arrow" />{item.outcome}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export default function VerticalPage({ vertical }) {
  const page = getVertical(vertical);
  return (
    <BentoLayer>
      <div className={styles.page} data-vertical={page.key}>
        <PageHero
          pill={'Blura SAGA for ' + page.name}
          title={page.hero.title}
          lit={page.hero.lit}
          lead={page.hero.body}
          actions={[
            { href: '/contact', label: 'Request a Demo', primary: true },
            { href: '#overview', label: page.hero.secondary },
          ]}
          media={
            <figure className={styles.heroArtwork}>
              <Image src={page.hero.image} alt="" width={1536} height={1024}
                priority sizes="(max-width: 940px) 100vw, 48vw" />
              <figcaption>
                <span className={styles.artCaption}>{page.hero.caption}</span>
                <ul className={styles.heroTags}>{page.hero.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
              </figcaption>
            </figure>
          }
        />

        <Section id="overview" wash="warm">
          <div className={styles.overviewHead}>
            <Head pill={page.overview.eyebrow} title={page.overview.title} left />
            <div className={styles.overviewCopy}>
              <p>{page.overview.body}</p>
              <TextLink link={page.overview.link} />
            </div>
          </div>
          <div className={styles.overviewSteps}>
            {page.overview.steps.map((step, i) => (
              <article key={step.title}>
                <Icon name={['signal', 'context', 'record'][i]} />
                <h3>{step.title}</h3><p>{step.body}</p>
              </article>
            ))}
          </div>
          <p className={styles.coverage}><Icon name="info" />{page.overview.note}</p>
        </Section>

        {page.features.map((feature, i) => <FeatureSection key={feature.id} feature={feature} index={i} />)}
        {page.workflow && <Workflow data={page.workflow} />}
        <Scenarios data={page.scenarios} />

        {page.access && (
          <Section id="deployment">
            <div className={styles.accessHead}>
              <Head pill={page.access.eyebrow} title={page.access.title} sub={page.access.body} left />
              <TextLink link={page.access.link} />
            </div>
            <div className={styles.accessGrid}>
              {page.access.items.map((item, i) => (
                <article key={item.title}><Icon name={['shield', 'record', 'settings'][i]} />
                  <h3>{item.title}</h3><p>{item.body}</p>
                </article>
              ))}
            </div>
          </Section>
        )}

        {page.outputs && (
          <Section id="outputs" wash="warm">
            <div className={styles.featureSplit}>
              <div className={styles.featureCopy}>
                <Head pill={page.outputs.eyebrow} title={page.outputs.title} sub={page.outputs.body} left />
                <FeatureDetails items={page.outputs.items} />
                <p className={styles.note}>{page.outputs.note}</p>
                <TextLink link={page.outputs.link} />
              </div>
              <VerticalVisual type={page.outputs.visual} title={page.outputs.visualTitle} />
            </div>
          </Section>
        )}

        <FaqSection pill={page.name + ' questions'} title="A little more clarity."
          items={page.faqs} name={'faq-' + page.key} raised />
        <PageCta id="contact" pill="Your next step" {...page.cta}
          actions={[{ href: '/contact', label: 'Request a Demo', primary: true }]} />
      </div>
    </BentoLayer>
  );
}
