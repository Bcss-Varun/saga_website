'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { createStage } from '../lib/sceneEngine';

/* Decision 1: #stage is the site background, not a page element.
   It mounts once in the root layout and must survive client navigation —
   so this component never tears the engine down on a route change. The only
   teardown is the layout itself unmounting, which in practice means a full
   page unload.

   The instance is held at module scope rather than in a ref so that React
   StrictMode's double-invoked effects in development cannot produce two
   engines racing on one canvas. */
let stage = null;
let stageStarts = 0;

/* Hoisted to module scope so the comparison is statically resolvable and the
   guarded block is dropped from the bundle entirely — read inline inside the
   effect it survives minification as a runtime check. */
const STATS = process.env.NEXT_PUBLIC_CANVAS_STATS === '1';

export default function Stage() {
  const ref = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!ref.current) return undefined;
    if (!stage) {
      stage = createStage(ref.current);
      stageStarts++;
      /* Exposed purely so the singleton claim can be asserted in a browser
         rather than assumed. Nothing in the site reads these, and they are
         compiled out unless the verification flag is set. */
      if (STATS) {
        window.__SAGA_STAGE__ = stage;
        window.__SAGA_STAGE_STARTS__ = stageStarts;
      }
    }
    return undefined; // deliberately no cleanup — see note above
  }, []);

  /* Scene hosts live in the pages beneath the stage, so the engine re-reads
     them whenever the route changes. */
  useEffect(() => {
    stage?.refreshHosts();
  }, [pathname]);

  return <canvas id="stage" ref={ref} aria-hidden="true" />;
}
