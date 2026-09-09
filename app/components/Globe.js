'use client';

import CanvasScene from './CanvasScene';
import { createGlobe } from '../lib/globeRenderer';
import { GLOBE_CHIPS } from '../lib/globeChips';

/* Module scope, so the reference is stable and <CanvasScene> does not
   rebuild its lifecycle on every render. */
const create = (host) => createGlobe(host);

export default function Globe() {
  return (
    <CanvasScene
      create={create}
      className="globe"
      id="pGlobe"
      canvasClassName="gcanvas"
    >
      <div className="gcore" aria-hidden="true" />
      {GLOBE_CHIPS.map((c) => (
        <span
          key={c.label}
          className="gchip"
          role="img"
          aria-label={c.label}
          {...(c.fill ? { 'data-fill': '' } : {})}
        >
          <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: c.svg }} />
        </span>
      ))}
    </CanvasScene>
  );
}
