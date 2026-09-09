import styles from './HeroFrame.module.css';

/* Wraps the hero to paint the light gutter and the black card behind it.
   See HeroFrame.module.css — this is pure CSS; the component exists only to
   provide the element. */
export default function HeroFrame({ children }) {
  return <div className={styles.frame}>{children}</div>;
}
