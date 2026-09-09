import Link from 'next/link';

/* Ported from Saga.html. [copy: needs specificity rewrite] 
   Teaser only — the deep capability detail moves to /platform.
   The 01-06 indices are dropped: six parallel capabilities are not a sequence. */

export default function Capabilities() {
  return (
      <section className="sec" id="capabilities">
        <div className="inner">
          <div className="cabhead">
            <p className="eyebrow rv">SAGA Capabilities</p>
            <h2 className="rv d1">Turn signals into <br className="cbr" />intelligence.</h2>
            <p className="lead rv d2">SAGA brings together the capabilities needed to understand what is happening,
              why it matters, and where attention is needed.</p>
          </div>

          <div className="cabgrid">
            <article className="cab rv">
              <h3>Sentiment</h3>
              <p className="cab-s">Understand how people are responding.</p>
              <p>Measure public sentiment and see how attitudes change across conversations, topics, and events.</p>
            </article>

            <article className="cab rv d1">
              <h3>Intent</h3>
              <p className="cab-s">Understand what people are trying to say or do.</p>
              <p>Identify the intent behind conversations to understand what people are seeking, discussing, or responding to.</p>
            </article>

            <article className="cab rv d2">
              <h3>Narratives</h3>
              <p className="cab-s">See stories and trends as they develop.</p>
              <p>Track emerging narratives and conversations as they gain attention and evolve over time.</p>
            </article>

            <article className="cab rv">
              <h3>Threats</h3>
              <p className="cab-s">Find signals that may need attention.</p>
              <p>Surface unusual activity, emerging risks, and signals that may require closer investigation.</p>
            </article>

            <article className="cab rv d1">
              <h3>Relationships</h3>
              <p className="cab-s">Connect people, entities, and activity.</p>
              <p>Reveal connections between people, accounts, entities, locations, and conversations.</p>
            </article>

            <article className="cab rv d2">
              <h3>Context</h3>
              <p className="cab-s">See the bigger picture behind the signal.</p>
              <p>Bring related signals together to understand what is happening and why it matters.</p>
            </article>
          </div>

          <p className="rv d2" style={{ marginTop: 28 }}>
            <Link className="cta2" href="/platform">See how the platform works &rarr;</Link>
          </p>
        </div>
      </section>
  );
}
