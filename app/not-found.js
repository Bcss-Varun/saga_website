import Link from 'next/link';
import HeroFrame from './components/HeroFrame';
import { VERTICALS } from './lib/nav';

/* Custom 404 in the site's own language. Next's default is a white page with
   "404: This page could not be found." — wrong on a dark site, and no help to
   someone who followed a link out of a PDF or a forwarded email, which is how
   most qualified traffic arrives here.

   [draft — needs review] */

export const metadata = {
  title: 'SAGA — Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <HeroFrame>
      <section className="sec" id="hero" data-scene="none">
        <div className="inner">
          <p className="eyebrow rv">Page not found</p>
          <h1 className="rv d1" style={{ maxWidth: '20ch' }}>
            That page is not here.
          </h1>
          <p className="lead rv d2" style={{ maxWidth: '56ch' }}>
            The address may have changed, or the link may have been shortened in
            transit. The pages below cover everything on this site.
          </p>

          <div className="routes" style={{ marginTop: 34 }}>
            {VERTICALS.map((v) => (
              <Link className="route rv" key={v.key} href={v.href}>
                <h2>{v.name}</h2>
                <p>{v.descriptor}</p>
                <span className="go">Open {v.name} &rarr;</span>
              </Link>
            ))}
          </div>

          <p className="rv d3" style={{ marginTop: 30 }}>
            <Link className="cta2" href="/platform">
              How the platform works
            </Link>{' '}
            <Link className="cta" href="/contact">
              Request a Demo
            </Link>
          </p>
        </div>
      </section>
    </HeroFrame>
  );
}
