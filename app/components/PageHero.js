import Link from 'next/link';
import { bento } from './Bento';
import styles from './PageHero.module.css';

/* The page hero.

   Copy on the left, a wide showcase card beneath it, warm and cool washes
   behind both. The showcase is the most credible object on a page that cannot
   publish its product UI, so it gets the width rather than being squeezed into
   a column beside the headline.

   It keeps `id="hero"` because the section order on a vertical page is
   asserted against it (tests/test-cp6.mjs). Everything the ported sheet sets
   on `#hero` is the full-viewport framed card, which this is not — see the
   module for why the overrides are written the way they are.

   No scene. The vertical heroes used to declare the `worlds` point-cloud field
   here; it was removed on 2026-09-09 because it ran under the headline and the
   lead, and a field drawn behind words is not a background. Per CLAUDE.md a
   route with no scene leaves `#stage` unpainted, which is correct and not a
   bug. `data-scene="none"` is still emitted so the engine sees a host and
   paints nothing, exactly as it already did on /platform and /trust. */
export default function PageHero({
  pill,
  title,
  lit,
  lead,
  actions = [],
  stats = [],
  showcase,
  media,
  backdrop,
  backdropPos,
}) {
  return (
    <section
      className={backdrop ? `${styles.hero} ${styles.withBackdrop}` : styles.hero}
      id="hero"
      data-scene="none"
    >
      <div className={`${bento.wash} ${bento.washSplit}`} aria-hidden="true" />

      {/* A photographic backdrop across the whole hero, behind the wash rather
          than beside the copy. Three layers, all decorative: the picture, then
          a scrim that is opaque across the copy column and gone by the middle
          of the hero, then a strip that darkens the top so the fixed header
          sits on near-black rather than on the brightest part of the image.

          The scrim is what keeps the contrast figures honest — the headline is
          read against flat black, which is what they assume. It is the same
          arrangement as the Home hero; see the note above `.heroPhoto` in
          globals.css for why each layer is its own element. */}
      {backdrop && (
        <>
          <div
            className={styles.backdrop}
            /* `backdropPos` shifts which part of a `cover`-cropped render is
               in frame. A wide picture in a shorter box loses its sides, and
               which side matters is a per-page question — the composition sits
               differently in each one. */
            style={{
              backgroundImage: `url(${backdrop})`,
              ...(backdropPos ? { backgroundPosition: backdropPos } : null),
            }}
            aria-hidden="true"
          />
          <div className={styles.backdropScrim} aria-hidden="true" />
        </>
      )}

      <div className={media ? `${styles.inner} ${styles.split}` : styles.inner}>
        <div className={styles.copy}>
          {pill && <p className={bento.pill}>{pill}</p>}
          <h1 className={styles.title}>
            {title}
            {lit && (
              <>
                {' '}
                <span className={bento.lit}>{lit}</span>
              </>
            )}
          </h1>
          <p className={styles.lead}>{lead}</p>

          {actions.length > 0 && (
            <div className={styles.actions}>
              {actions.map((a) => (
                <Link className={a.primary ? 'cta' : 'cta2'} href={a.href} key={a.href}>
                  {a.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {stats.length > 0 && (
          /* A description list, not three divs: each figure is defined by the
             label under it, and that relationship should survive being read
             aloud. */
          <dl className={styles.stats}>
            {stats.map((s) => (
              <div className={styles.stat} key={s.label}>
                <dt className={styles.statValue}>{s.value}</dt>
                <dd className={styles.statLabel}>{s.label}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* The wide board under the copy, or a visual beside it — never both.
            `media` puts the object in the second column of a split hero, which
            is what a page whose showcase is a photograph wants. */}
        {media && <div className={styles.media}>{media}</div>}

        {showcase && <div className={styles.showcase}>{showcase}</div>}
      </div>
    </section>
  );
}
