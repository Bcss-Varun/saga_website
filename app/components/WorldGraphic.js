import { WGRAPH, GICON } from '../lib/worlds';

/* The per-vertical signature visual, ported from `worldGraphic()` in
   Saga.html. One 600x400 vector per vertical, all built from the same frame:
   a central emblem on a lit plinth, ringed by five capability chips on an arc.

   Decorative — the page states everything it says in text, so it carries
   aria-hidden and nothing depends on it. */

const ARC = 'M100 250A200 150 0 0 1 500 250';
const ANGLES = [180, 140, 90, 40, 0];

export default function WorldGraphic({ vertical }) {
  const g = WGRAPH[vertical];
  if (!g) return null;

  return (
    <svg
      viewBox="0 0 600 400"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
    >
      <defs>
        <radialGradient id="wgGlow" cx="50%" cy="58%" r="50%">
          <stop offset="0" stopColor="#F15B26" stopOpacity=".13" />
          <stop offset="1" stopColor="#F15B26" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse className="wg-halo" cx="300" cy="252" rx="252" ry="176" />
      <path className="wg-grid" d="M46 336h508M300 336v-14" />
      <path className="wg-arc" d={ARC} />
      <path className="wg-spark" d={ARC} />
      <ellipse className="wg-pod" cx="300" cy="336" rx="126" ry="19" />
      <g className="wg-em" dangerouslySetInnerHTML={{ __html: g.em }} />
      {ANGLES.map((a, i) => {
        const r = (a * Math.PI) / 180;
        const x = 300 + 200 * Math.cos(r);
        const y = 250 - 150 * Math.sin(r);
        return (
          <g className="wg-chip" key={g.chips[i]}>
            <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="21" />
            <g
              className="wg-ico"
              transform={`translate(${(x - 11).toFixed(1)} ${(y - 11).toFixed(1)}) scale(.917)`}
              dangerouslySetInnerHTML={{ __html: GICON[g.chips[i]] }}
            />
          </g>
        );
      })}
    </svg>
  );
}
