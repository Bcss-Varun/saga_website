import styles from './Redacted.module.css';

/* A withheld value. Announced, not silently blank.

   ── Why this exists ────────────────────────────────────────────────────────
   APPROVALS item 0: the console mock on Home published fabricated figures and
   a platform coverage list for the whole of the build, because every claims
   sweep read copy and none read what a mock drew. A number inside a picture of
   a product asserts itself harder than the same number in a headline, not
   softer.

   So a value a diagram cannot state truthfully is drawn as a bar carrying its
   own explanation, never as a plausible number. Redaction rather than blur: a
   blur degrades to a smudge in print, reads as a rendering fault, and stays
   legible enough to guess at. A bar cannot be read back. */
export default function Redacted({ label = 'value withheld pending sign-off', width = '5ch' }) {
  return <span className={styles.bar} style={{ width }} role="img" aria-label={label} />;
}
