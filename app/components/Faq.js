import styles from './Faq.module.css';

/* The FAQ list.

   `<details>` with a shared `name` gives an exclusive accordion — opening one
   closes the rest — with the disclosure semantics, the keyboard behaviour and
   the open/closed state announced by the browser rather than reimplemented.
   It also means every answer is in the static HTML and reachable by find-in-
   page, which a JavaScript accordion would not be.

   The +/− marker is CSS on the summary. `list-style: none` removes the native
   triangle; the marker is aria-hidden because the state is already announced
   by the element itself. */
export default function Faq({ items, name }) {
  return (
    <div className={styles.list}>
      {items.map((f) => (
        <details className={styles.item} name={name} key={f.q}>
          <summary className={styles.summary}>
            <h3 className={styles.q}>{f.q}</h3>
            <span className={styles.mark} aria-hidden="true" />
          </summary>
          <div className={styles.body}>
            <p>{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
