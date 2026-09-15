import styles from './PipelineBoard.module.css';

/* The wide object under the /platform hero: one record crossing four stages,
   and what each stage attaches to it.

   Every value on it is a category the system records, never an instance of
   one. No counts, no ids, no timestamps. APPROVALS item 0 is the reason: a
   figure inside a picture of a product asserts itself more forcefully than the
   same figure in a headline, not less, and this is the largest picture on the
   page.

   The stage names are paragraphs, not headings. They label the parts of a
   diagram; they are not sections of the document, and as headings they would
   sit between the h1 and the first h2 and break the level order. */
export default function PipelineBoard({ label, note, stages }) {
  return (
    <div className={styles.board}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        <span className={styles.legend}>
          <span className={styles.dot} aria-hidden="true" />
          origin carried through every stage
        </span>
      </div>

      <ol className={styles.track}>
        {stages.map((s, i) => (
          <li className={styles.stage} key={s.name}>
            <div className={styles.marker} aria-hidden="true">
              <span className={i === 0 ? styles.nodeOn : styles.node} />
              {i < stages.length - 1 && <span className={styles.wire} />}
            </div>
            <p className={styles.n}>{s.n}</p>
            <p className={styles.name}>{s.name}</p>
            <ul className={styles.fields}>
              {s.fields.map((f) => (
                <li className={styles.field} key={f}>
                  {f}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <p className={styles.note}>{note}</p>
    </div>
  );
}
