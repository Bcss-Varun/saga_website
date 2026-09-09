/* Ported from Saga.html. [copy: needs specificity rewrite] 
   The 01/02/03 card indices are dropped: four parallel problems are not a
   sequence, and CLAUDE.md forbids indices on content that is not one. */

export default function Challenge() {
  return (
      <section className="sec challenge" id="challenge">
        <div className="inner">
          <p className="eyebrow cv">The challenge</p>
          <h2 className="cv d1" style={{"maxWidth": "18ch"}}>When everything speaks, what do you listen to? </h2>
          <p className="lead cv d2" style={{"maxWidth": "58ch"}}>The challenge isn&apos;t hearing everything.
            It&apos;s knowing what matters. </p>
          <p className="cv d2" style={{"maxWidth": "58ch"}}>SAGA helps turn that complexity into intelligence you can understand
            and act on.</p>

          <div className="challenge-grid">
            <div className="challenge-card cv">
              <span className="ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M3 12v0M6.5 9v6M10 6v12M13.5 8v8M17 5v14M20.5 10v4" />
                </svg>
              </span>
              <h3>Too Much Noise</h3>
              <i className="rule"></i>
              <p>Millions of conversations make it hard to spot what really matters.</p>
            </div>
            <div className="challenge-card cv d1">
              <span className="ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="M20 20l-4.8-4.8" />
                </svg>
              </span>
              <h3>Hidden Signals</h3>
              <i className="rule"></i>
              <p>Important warnings can be buried inside everyday conversations.</p>
            </div>
            <div className="challenge-card cv d2">
              <span className="ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 16l6-6 4 4 8-9" />
                  <path d="M15 5h6v6" />
                </svg>
              </span>
              <h3>Fast-Moving Stories</h3>
              <i className="rule"></i>
              <p>Stories, campaigns and issues can spread quickly and change fast.</p>
            </div>
            <div className="challenge-card cv d3">
              <span className="ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="5" cy="8" r="1.8" />
                  <circle cx="12" cy="17" r="1.8" />
                  <circle cx="19" cy="9" r="1.8" />
                  <circle cx="14" cy="6" r="1.8" />
                  <path d="M6.5 9l4.5 6.3M13.5 7l4 1.4" />
                </svg>
              </span>
              <h3>Missing Context</h3>
              <i className="rule"></i>
              <p>A single signal rarely tells the full story. Context makes it meaningful.</p>
            </div>
          </div>
        </div>
      </section>
  );
}
