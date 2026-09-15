import styles from './Bento.module.css';

/* Components for the bento design language. See Bento.module.css for the
   reasoning behind the visual decisions; this file is only the markup. */

/* The layer wrapper. Carries the wash tokens, so anything using a wash has to
   sit inside one. Put it around the whole page. */
export function BentoLayer({ children }) {
  return <div className={styles.layer}>{children}</div>;
}

const WASH = {
  warm: styles.washWarm,
  cool: styles.washCool,
  split: styles.washSplit,
  foot: styles.washFoot,
};

/* A full-bleed section. `raised` steps the ground up one level; alternating it
   is what makes a long page read as blocks rather than as one scroll. */
export function Section({ id, raised, wash, narrow, wide, tight, children }) {
  return (
    <section
      id={id}
      className={[styles.section, raised ? styles.raised : '', tight ? styles.tight : '']
        .filter(Boolean)
        .join(' ')}
    >
      {wash && <div className={`${styles.wash} ${WASH[wash]}`} aria-hidden="true" />}
      <div
        className={[styles.inner, narrow ? styles.narrow : '', wide ? styles.wide : '']
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </section>
  );
}

export function Pill({ children }) {
  return <p className={styles.pill}>{children}</p>;
}

/* Eyebrow pill, heading, one line under it. Centred by default.

   `lit` highlights a trailing phrase of the heading in the accent gradient.
   One per page at most — it stops being a highlight the second time. */
export function Head({ pill, title, lit, sub, left, wide, rule, flip, children }) {
  return (
    <div
      className={[
        styles.head,
        left ? styles.headLeft : '',
        wide ? styles.headWide : '',
        flip ? styles.headFlip : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {pill && <Pill>{pill}</Pill>}
      {rule && <span className={styles.headRule} aria-hidden="true" />}
      <h2 className={styles.title}>
        {title}
        {lit && (
          <>
            {' '}
            <span className={styles.lit}>{lit}</span>
          </>
        )}
      </h2>
      {sub && <p className={styles.sub}>{sub}</p>}
      {children}
    </div>
  );
}

export function Grid({ children }) {
  return <div className={styles.grid}>{children}</div>;
}

/* One bento cell. `span` is in twelfths: 3 a quarter, 4 a third, 6 a half.
   `visual` is the well at the top; `lit` marks the one card per grid that
   carries the accent.

   `className` is additive and opt-in: a page's own module can add a class to
   the cell without the page having to rebuild the card. It appends, so the
   shared ground, border and radius still apply and the page class wins only on
   what it actually declares. Added 2026-09-11 for the /trust deployment models,
   which needed their own padding; no other caller passes it. */
export function Card({
  span = 6,
  visual,
  title,
  body,
  lit,
  className,
  as: Tag = 'article',
  children,
}) {
  return (
    <Tag
      className={[styles.card, styles['s' + span], lit ? styles.cardLit : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {visual && <div className={styles.visual}>{visual}</div>}
      {title && <h3 className={styles.cardTitle}>{title}</h3>}
      {body && <p className={styles.cardBody}>{body}</p>}
      {children}
    </Tag>
  );
}

function Tick() {
  return (
    <span className={styles.tick} aria-hidden="true">
      <svg viewBox="0 0 12 12">
        <path d="M2.5 6.4 4.8 8.7 9.5 3.6" />
      </svg>
    </span>
  );
}

export function Checks({ items }) {
  return (
    <ul className={styles.checks}>
      {items.map((i) => (
        <li className={styles.check} key={i.slice(0, 36)}>
          <Tick />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

/* A full-width row: copy on one side, a visual on the other, alternating down
   the page. `flip` puts the visual first. */
export function Row({ flip, title, body, points, visual }) {
  return (
    <div className={flip ? `${styles.row} ${styles.rowFlip}` : styles.row}>
      <div className={styles.rowCopy}>
        <h3 className={styles.rowTitle}>{title}</h3>
        {body && <p className={styles.rowBody}>{body}</p>}
        {points && <Checks items={points} />}
      </div>
      <div className={styles.rowVisual}>{visual}</div>
    </div>
  );
}

/* Numbered steps. A genuine sequence, which is the only thing on this site
   that gets an index. */
export function Steps({ items }) {
  return (
    <ol className={styles.steps}>
      {items.map((s, i) => (
        <Card key={s.title} as="li" span={4} visual={s.visual}>
          <p className={styles.stepN}>
            <span className={styles.stepRule} aria-hidden="true" />
            Step {String(i + 1).padStart(2, '0')}
          </p>
          <h3 className={styles.cardTitle}>{s.title}</h3>
          <p className={styles.cardBody}>{s.body}</p>
        </Card>
      ))}
    </ol>
  );
}

export { styles as bento };
