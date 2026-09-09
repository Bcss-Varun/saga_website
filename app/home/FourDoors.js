import Link from 'next/link';
import { VERTICALS } from '../lib/nav';

/* Moved up from DOM position 9 to position 5 (decision 4); the tabbed `worlds`
   widget that duplicated this choice is gone.

   The original markup numbered these 01–04. CLAUDE.md forbids numbered indices
   on content that is not a genuine sequence, and four parallel doors are not
   one, so the indices are dropped.

   [copy: needs specificity rewrite] */
const BLURB = {
  governance:
    'Understand public sentiment, emerging narratives, and issues shaping policy and public response.',
  publicSafety:
    'Identify threats, emerging concerns, persons of interest, and signals that may require attention.',
  brands:
    'Monitor reputation, audience sentiment, emerging narratives, and risks around your brand.',
  celebrity:
    'Understand public sentiment, audience communities, reputation risks, and influence around public figures.',
};

const ORDER = ['governance', 'publicSafety', 'brands', 'celebrity'];

export default function FourDoors() {
  const doors = ORDER.map((k) => VERTICALS.find((v) => v.key === k));

  return (
    <section className="sec" id="doors">
      <div className="inner">
        <p className="eyebrow rv">Explore your SAGA</p>
        <h2 className="rv d1" style={{ maxWidth: '14ch' }}>
          Which one of these is you?
        </h2>
        <div className="routes">
          {doors.map((v, i) => (
            <Link
              key={v.key}
              className={i === 0 ? 'route rv' : `route rv d${i}`}
              href={v.href}
            >
              <h3>{v.name}</h3>
              <p>{BLURB[v.key]}</p>
              <span className="go">Explore {v.name} &rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
