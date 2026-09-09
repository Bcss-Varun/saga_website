/* Ported from Saga.html. [copy: needs specificity rewrite] 
   The 01-05 indices are kept: Detected -> Scored -> Verified -> Escalated ->
   Resolved is a genuine sequence. */

export default function Flow() {
  return (
      <section className="sec" id="flow">
        <div className="inner">
          <p className="eyebrow rv">Signal to action</p>
          <h2 className="rv d1" style={{"maxWidth": "17ch"}}>Every signal has somewhere to go.</h2>
          <div className="flow">
            <div className="fstep rv"><span className="n">01</span>
              <h3>Detected</h3>
              <p>A post, article or event enters the stream and is classified in seconds.</p>
            </div>
            <div className="fstep rv d1"><span className="n">02</span>
              <h3>Scored</h3>
              <p>Sentiment, topic and risk are attached. Viral potential is estimated.</p>
            </div>
            <div className="fstep rv d2"><span className="n">03</span>
              <h3>Verified</h3>
              <p>Source attribution, identity resolution and deepfake checks where it matters.</p>
            </div>
            <div className="fstep rv d3"><span className="n">04</span>
              <h3>Escalated</h3>
              <p>An alert opens a case, routed to whoever owns that geography or subject.</p>
            </div>
            <div className="fstep rv d3"><span className="n">05</span>
              <h3>Resolved</h3>
              <p>Action taken, outcome recorded, evidence retained, report generated.</p>
            </div>
          </div>
        </div>
      </section>
  );
}
