'use client';

import Link from 'next/link';
import HeroFrame from '../components/HeroFrame';
import { useEffect, useRef, useState } from 'react';

/* [copy: needs specificity rewrite] — carried across from Saga.html unchanged. */
const QUESTIONS = [
  'Trying to understand what people are saying about a policy or scheme?',
  'Something changing around you that you need to understand?',
  'Trying to see what people are saying about your brand?',
  'Trying to understand how people really see you?',
];

const HOLD = 3400; // ms each question holds before the next fades in

export default function Hero() {
  const [i, setI] = useState(0);
  const timer = useRef(null);
  const rollRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const roll = rollRef.current;
    let onScreen = true;
    let hidden = document.hidden;

    const stop = () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
    /* Runs only when it can actually be seen. A 3.4s re-render nobody is
       looking at still competes with the scene engine for frame budget on
       slow hardware. */
    const sync = () => {
      if (onScreen && !hidden) {
        if (!timer.current) {
          timer.current = setInterval(() => setI((n) => (n + 1) % QUESTIONS.length), HOLD);
        }
      } else {
        stop();
      }
    };

    const onVisibility = () => { hidden = document.hidden; sync(); };
    const io = new IntersectionObserver(
      (entries) => { onScreen = entries[0].isIntersecting; sync(); },
      { rootMargin: '80px' }
    );
    if (roll) io.observe(roll);

    sync();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <HeroFrame>
      <section className="sec" id="hero" data-scene="hero">
      <div className="inner">
        <p className="eyebrow rv">Dealing with something you can&rsquo;t fully see?</p>

        {/* The rotation is decorative; all four questions stay in the DOM and
            are announced as one block, so nothing exists only inside the
            animation. */}
        <div className="qroll rv d1" id="heroQ" ref={rollRef}>
          {QUESTIONS.map((q, n) => (
            <span key={q} className={n === i ? 'q on' : 'q'}>
              {q}
            </span>
          ))}
        </div>

        <h1 className="rv d2" style={{ maxWidth: '30ch' }}>
          SAGA helps you understand what&rsquo;s really happening.
        </h1>
        <p className="lead rv d3" style={{ maxWidth: '56ch' }}>
          Bring together conversations, sentiment, narratives, threats and relationships to
          understand what is happening and why.
        </p>

        <div className="herorow rv d3">
          <Link className="cta" href="/contact">Request a Demo</Link>
          <Link className="cta2" href="/platform">Explore SAGA</Link>
        </div>
        <p
          className="small mono rv d3"
          style={{ marginTop: 18, color: 'var(--faint)', letterSpacing: '.08em' }}
        >
          One intelligence platform. Four specialized worlds.
        </p>
      </div>
      </section>
    </HeroFrame>
  );
}
