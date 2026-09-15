import Link from 'next/link';

/* Ported from Saga.html. [copy: needs specificity rewrite]

   The photographic backdrop was added 2026-09-10 so the closing call to action
   is the same object on Home as on every other route. Two decorative layers,
   the same pair `PageCta` uses: the picture, then a scrim opaque top and
   bottom and thinnest across the middle, where the headline sits. The headline
   is read against near-black, which is what the contrast figures assume. */

export default function FinalCta() {
  return (
      <section className="sec ctaShot" id="final">
        <div className="ctaPhoto" aria-hidden="true" />
        <div className="ctaScrim" aria-hidden="true" />
        <div className="inner">
          <p className="eyebrow rv">Request a demonstration</p>
          <h2 className="rv d1" style={{"maxWidth": "17ch", "marginLeft": "auto", "marginRight": "auto"}}>See it running on your own region.
          </h2>
          <p className="lead rv d2" style={{"maxWidth": "48ch"}}>Tell us which world you operate in and we will show you SAGA
            configured for it — not a generic deck.</p>
          <div className="finalrow rv d3">
            <Link className="cta" href="/contact">Request a Demo</Link>
            <Link className="cta2" href="/public-safety">Explore a solution</Link>
          </div>
          <p className="mailnote rv d3">Or write directly to <a href="mailto:smartapps@bluecloudsoftech.com">smartapps@bluecloudsoftech.com</a><br />A product specialist
            replies within one working day.</p>
        </div>
      </section>
  );
}
