import { PLATFORM_FAQS } from '../lib/faqs';

/* Native <details>/<summary>, as in the original: the answer is real content
   in the DOM, reachable by keyboard and by find-in-page, and it prints. The
   shared `name` makes the group behave as an exclusive accordion without a
   line of JavaScript. */
function Qa({ q, a }) {
  return (
    <details className="qa" name="qa">
      <summary>
        <h3>{q}</h3>
        <i className="qi" aria-hidden="true">
          <svg viewBox="0 0 18 18">
            <path d="M4 6.8 9 11.8 14 6.8" />
          </svg>
        </i>
      </summary>
      <div className="qabody">
        <p>{a}</p>
      </div>
    </details>
  );
}

export default function Faq() {
  const half = Math.ceil(PLATFORM_FAQS.length / 2);
  const cols = [PLATFORM_FAQS.slice(0, half), PLATFORM_FAQS.slice(half)];

  return (
    <section className="sec" id="faq" data-scene="none">
      <div className="inner">
        <div className="faqhead">
          <p className="eyebrow rv">FAQ</p>
          <h2 className="rv d1">Start with the question you actually have.</h2>
          <p className="rv d2">
            The questions teams ask most, answered. Open one to see what sits underneath it.
          </p>
        </div>
        <div className="faqs" id="faqgrid">
          {cols.map((col, i) => (
            <div className="faqcol" key={i}>
              {col.map((f) => (
                <Qa key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
