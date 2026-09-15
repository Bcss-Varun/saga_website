import styles from './RecordConvergence.module.css';

/* The signature visual on /public-safety: four inputs arriving at one record.

   The labels are HTML text, not text inside the SVG — SVG text scales with the
   viewBox and would be six pixels tall on a phone. The SVG draws only the
   connectors, which is the one thing the sentence beside it cannot say: that
   the four arrive at the same place. It is marked decorative because every
   word it carries is already in the list beside it.

   Nothing here moves. It communicates convergence standing still, which is the
   test a visual on this site has to pass. */
export default function RecordConvergence({ inputs, target, targetMeta }) {
  return (
    <div className={styles.wrap}>
      <ul className={styles.inputs}>
        {inputs.map((label) => (
          <li className={styles.input} key={label}>
            <span className={styles.dot} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>

      <svg
        className={styles.wires}
        viewBox="0 0 120 240"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M0 30 C 62 30, 58 120, 120 120" />
        <path d="M0 100 C 62 100, 58 120, 120 120" />
        <path d="M0 160 C 62 160, 58 120, 120 120" />
        <path d="M0 230 C 62 230, 58 120, 120 120" />
      </svg>

      <div className={styles.target}>
        <p className={styles.targetName}>{target}</p>
        <p className={styles.targetMeta}>{targetMeta}</p>
      </div>
    </div>
  );
}
