'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordPage } from '../lib/visitSource';

/* Records the in-site route trail. Mounted once in the layout so it observes
   every client navigation — which is the only place the trail can be built,
   since a client navigation never updates document.referrer. */
export default function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    recordPage(pathname);
  }, [pathname]);
  return null;
}
