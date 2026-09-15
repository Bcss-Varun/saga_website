import styles from './SpecBoard.module.css';

/* A wide spec sheet: the label/value rows of a card, laid across the page
   rather than down a column. Used as a hero showcase where the values are the
   substance and there are more of them than a narrow card can hold.

   Every value is a term already stated in the body copy of the page it sits
   on. Nothing here is an instance of anything — no locations, no periods, no
   customer, no figure. */
export default function SpecBoard({ label, state, rows, footnote }) {
  return (
    <div className={styles.board}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        <span className={styles.state}>
          <span className={styles.dot} aria-hidden="true" />
          {state}
        </span>
      </div>

      <dl className={styles.grid}>
        {rows.map((r) => (
          <div className={r.accent ? `${styles.cell} ${styles.lit}` : styles.cell} key={r.k}>
            <dt className={styles.k}>{r.k}</dt>
            <dd className={styles.v}>{r.v}</dd>
          </div>
        ))}
      </dl>

      {footnote && <p className={styles.note}>{footnote}</p>}
    </div>
  );
}
