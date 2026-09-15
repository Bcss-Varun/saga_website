import Link from 'next/link';
import { bento } from './Bento';
import styles from './PageCta.module.css';

/* The closing call to action. Centred, full-bleed, with the warm and cool
   washes meeting under it — the one place on a page where both are at full
   strength, because it is the last thing on the page and nothing follows it
   that they could compete with.

   Every page carries its own. Most qualified traffic arrives from a PDF link,
   a search result or a forward, so a page cannot send a reader back to a
   homepage they never saw to find out how to get in touch. */
export default function PageCta({ id = 'final', pill, title, lit, body, actions = [], mail, backdrop }) {
  return (
    <section className={styles.cta} id={id}>
      <div className={`${bento.wash} ${bento.washFoot}`} aria-hidden="true" />

      {/* The photographic backdrop every closing call to action carries, so the
          last thing on a page is the same object on every route. Two layers,
          both decorative: the picture, then a scrim that is opaque at the top
          and bottom and thinnest across the middle, which is where the
          headline sits. The headline is read against near-black, which is what
          the contrast figures assume.

          A background that fails to load paints nothing, so a missing file
          leaves the section on its wash and nothing breaks. */}
      <div className={styles.photo} aria-hidden="true" />
      <div className={styles.photoScrim} aria-hidden="true" />
      {/* An optional still graphic between the wash and the copy. Still, not
          animated: motion has to explain something, and a drifting network
          explains nothing the same network standing still does not. */}
      {backdrop}
      <div className={styles.inner}>
        {pill && <p className={bento.pill}>{pill}</p>}
        <h2 className={styles.title}>
          {title}
          {lit && (
            <>
              {' '}
              <span className={bento.lit}>{lit}</span>
            </>
          )}
        </h2>
        {body && <p className={styles.body}>{body}</p>}
        <div className={styles.actions}>
          {actions.map((a) => (
            <Link className={a.primary ? 'cta' : 'cta2'} href={a.href} key={a.href}>
              {a.label}
            </Link>
          ))}
        </div>
        {mail && (
          <p className={styles.mail}>
            Or write directly to <a href={`mailto:${mail}`}>{mail}</a>. A product specialist
            replies within one working day.
          </p>
        )}
      </div>
    </section>
  );
}
