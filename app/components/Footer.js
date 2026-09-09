import Link from 'next/link';
import Image from 'next/image';
import { VERTICALS } from '../lib/nav';

/* Ported from Saga.html. Section links now point at real routes instead of
   in-page anchors; the copy is carried across unchanged.
   [copy: needs specificity rewrite] */
export default function Footer() {
  return (
    <footer>
      <div className="foot">
        <div className="foot-top">
          <div className="foot-brand">
            <Image
              className="foot-mark"
              src="/logo/saga-logo-rounded.png"
              alt="Blura SAGA — Sentiment And Goodwill Analysis"
              width={120}
              height={120}
            />
            <p className="blurb">
              Sentiment And Goodwill Analysis. One platform to read public sentiment,
              follow emerging narratives, and act on the signals that matter.
            </p>
            <div className="foot-by">
              <span className="tag">A product by</span>
              <Image
                src="/logo/BCSS_logo.png"
                alt="Blue Cloud Softech Solutions Ltd."
                width={140}
                height={40}
              />
            </div>
          </div>

          <div className="foot-col">
            <h2>Solutions</h2>
            <ul>
              {VERTICALS.map((v) => (
                <li key={v.key}>
                  <Link href={v.href}>{v.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col">
            <h2>Platform</h2>
            <ul>
              <li><Link href="/platform">How it works</Link></li>
              <li><Link href="/investigation">Investigation</Link></li>
              <li><Link href="/trust">Trust</Link></li>
            </ul>
          </div>

          <div className="foot-col">
            <h2>Get in touch</h2>
            <ul>
              <li>
                <a className="mail" href="mailto:smartapps@bluecloudsoftech.com">
                  smartapps@bluecloudsoftech.com
                </a>
              </li>
              <li><span>A product specialist replies within one working day.</span></li>
              <li><Link className="foot-cta" href="/contact">Request a Demo →</Link></li>
            </ul>
          </div>
        </div>

        <div className="foot-bar">
          <div className="c">© 2026 Blue Cloud Softech Solutions Ltd. All rights reserved.</div>
          <div className="c">Blura SAGA — Sentiment And Goodwill Analysis</div>
        </div>
      </div>
    </footer>
  );
}
