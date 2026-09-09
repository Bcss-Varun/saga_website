'use client';

/* eslint-disable @next/next/no-img-element --
   Both images here are decorative chrome inside the mock console: the macbook
   frame and the logo in the fake sidebar. They are CSS-sized inside a
   transform-scaled screen, and `output: 'export'` disables image optimisation
   anyway, so next/image would add layout constraints for no benefit. */

import { useEffect, useRef } from 'react';
import { createDashboard } from '../lib/showcaseDashboard';

/* The console showcase — the macbook render and the dashboard inside it.

   Ported from Saga.html. Three behaviours, each of which leaked in the
   original and is now torn down:
     · the 1440x980 dashboard is scaled to the screen area by a ResizeObserver
     · the device rises as it scrolls into view (rAF-coalesced scroll handler)
     · the dashboard's six intervals run only while the section is on screen

   The dashboard itself still renders through the original innerHTML templates
   — ported mechanically, as the build brief asks — but every lookup inside it
   is scoped to this component's root rather than the document.

   Figures and platform identities are withheld throughout; see
   `showcaseDashboard.js` for why, and what stays.

   [copy: needs specificity rewrite] */

export default function Showcase() {
  const rootRef = useRef(null);
  const deviceRef = useRef(null);
  const osRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const device = deviceRef.current;
    const os = osRef.current;
    if (!root || !device || !os) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const screenEl = os.parentElement;
    let dead = false;

    /* keep the 1440x980 dashboard scaled to whatever the screen area is */
    const fit = () => os.style.setProperty('--sd-s', screenEl.clientWidth / 1510);
    const ro = new ResizeObserver(fit);
    ro.observe(screenEl);
    fit();

    /* rise as the device scrolls into view */
    let raf = 0;
    let queued = false;
    const rise = () => {
      queued = false;
      if (dead) return;
      const r = device.getBoundingClientRect();
      const start = window.innerHeight * 0.96;
      const end = window.innerHeight * 0.42;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
      device.style.setProperty('--mb', reduced ? 1 : p);
    };
    const onScroll = () => {
      if (!queued) { queued = true; raf = requestAnimationFrame(rise); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    rise();

    /* the dashboard: drawn once, animated only while on screen */
    const dash = createDashboard(root);
    let io = null;
    if (!reduced) {
      io = new IntersectionObserver(
        (entries) => {
          if (dead) return;
          if (entries[0].isIntersecting) dash.start();
          else dash.stop();
        },
        { rootMargin: '120px' }
      );
      io.observe(device);
    }

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      ro.disconnect();
      if (io) io.disconnect();
      dash.destroy();
    };
  }, []);

  return (
      <section className="sec showcase" id="showcase" ref={rootRef}>
        <div className="inner">
          <p className="eyebrow rv">The console</p>
          <h2 className="rv d1">Every signal, one screen.</h2>
          <p className="lead rv d2" style={{"maxWidth": "54ch"}}>Mentions, risk, grievances and sentiment — resolved live across
            platforms, languages and regions.</p>

          <div className="mb-device" id="mbDevice" ref={deviceRef}>
            <div className="mb-glow"></div>
            <div className="mb-rig">
              <div className="mb-shell">
                <div className="mb-screen" aria-hidden="true">
                  <div className="mb-os" id="mbOs" ref={osRef}>
                    <div className="mb-menubar">
                      <svg className="apple" viewBox="0 0 814 1000" aria-hidden="true">
                        <path fill="currentColor" d="M788 341c-6 4-108 62-108 190 0 149 130 201 134 202-1 3-21 72-69 142-43 62-87 123-155 123s-86-39-164-39c-77 0-104 41-166 41s-106-57-156-127C47 791 0 663 0 542c0-194 126-298 251-298 66 0 121 43 162 43 40 0 101-46 176-46 29 0 131 3 199 100zM554 159c31-37 53-88 53-139 0-7-1-14-2-20-51 2-111 34-147 76-29 32-55 84-55 136 0 8 1 16 2 18 3 1 8 1 14 1 45 0 102-30 135-72z" />
                      </svg>
                      <span className="app">Blura SAGA</span>
                      <span>File</span><span>Edit</span><span>View</span><span>Go</span>
                      <span>Window</span><span>Help</span>
                      <span className="right">
                        <i className="batt"></i>
                        <svg className="mi" viewBox="0 0 24 24" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="7" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
                          <circle cx="7.5" cy="7.5" r="2" fill="currentColor" />
                          <rect x="3" y="13" width="18" height="7" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
                          <circle cx="16.5" cy="16.5" r="2" fill="currentColor" />
                        </svg>
                        <svg className="mi" viewBox="0 0 24 24" aria-hidden="true">
                          <circle cx="10.5" cy="10.5" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.9" />
                          <path d="M15.4 15.4 21 21" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                        </svg>
                        <svg className="mi" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M2.4 8.4a15 15 0 0 1 19.2 0M5.6 12.2a10.4 10.4 0 0 1 12.8 0M9 16a5.2 5.2 0 0 1 6 0" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                          <circle cx="12" cy="19.6" r="1.5" fill="currentColor" />
                        </svg>
                        <span>Mon Jun 22</span>
                        <span>9:41 AM</span>
                      </span>
                    </div>
                    <div className="sd-viewport" id="sdViewport">

                      {/* sidebar */}
                      <aside className="sd-side">
                        <div className="sd-brand">
                          <img src="/logo/saga-logo-transparent.png" alt="SAGA" />
                        </div>
                        <div className="sd-nav-active"><span className="sd-ico">▦</span> Dashboard</div>
                        <div className="sd-group">Intelligence</div>
                        <div className="sd-link"><span className="sd-ico">◉</span> Surveillance</div>
                        <div className="sd-link"><span className="sd-ico">◬</span> Alerts <b className="sd-badge sd-badge-dot"></b>
                        </div>
                        <div className="sd-link"><span className="sd-ico">✉</span> Grievances</div>
                        <div className="sd-link"><span className="sd-ico">▤</span> Events</div>
                        <div className="sd-link"><span className="sd-ico">⌖</span> POI Monitoring</div>
                        <div className="sd-link"><span className="sd-ico">#</span> Keywords</div>
                        <div className="sd-link"><span className="sd-ico">▣</span> Reports</div>
                        <div className="sd-group">OSINT Tools</div>
                        <div className="sd-link"><span className="sd-ico">◎</span> SOC-EYE AI</div>
                        <div className="sd-link"><span className="sd-ico">◐</span> Deepfake Detection</div>
                        <div className="sd-link"><span className="sd-ico">☖</span> Profile Intelligence</div>
                        <div className="sd-link"><span className="sd-ico">⌘</span> Location Intelligence</div>
                        <div className="sd-link"><span className="sd-ico">⌕</span> Search Intelligence</div>
                        <div className="sd-group">Administration</div>
                        <div className="sd-link"><span className="sd-ico">☰</span> User Management</div>
                        <div className="sd-link"><span className="sd-ico">⚿</span> Roles &amp; Permissions</div>
                        <div className="sd-status">
                          <div className="h"><i className="sd-dot"></i> System Status</div>
                          <div className="p">All Systems Operational</div>
                        </div>
                        <div className="sd-ver">v2.4.0</div>
                      </aside>

                      {/* main */}
                      <div className="sd-main">
                        <header className="sd-top">
                          <div className="sd-search"><span>⌕</span> Search for keywords, users, topics, reports… <span className="k">⌘K</span></div>
                          <div className="sd-genbtn"><span>▤</span> Generate Report</div>
                          <div className="sd-icobtn">♧<span className="n sd-badge-dot"></span></div>
                          <div className="sd-icobtn">?</div>
                          <div className="sd-icobtn">⚙</div>
                          <div className="sd-user">
                            <div className="av">AS</div>
                            <div><b>Arjun Sharma</b><span>Super Admin</span></div>
                          </div>
                        </header>

                        <div className="sd-body">
                          <div className="sd-filters">
                            <div className="sd-pill">▤ May 12 – May 19, 2025</div>
                            <div className="sd-pill">All Platforms <span className="cr">▾</span></div>
                            <div className="sd-pill">All Categories <span className="cr">▾</span></div>
                            <div className="sd-pill">All Regions <span className="cr">▾</span></div>
                            <div className="sd-custom">✎ Customize Dashboard</div>
                          </div>

                          {/* kpis */}
                          <div className="sd-kpis" id="sdKpis"></div>

                          {/* donuts + trending */}
                          <div className="sd-row sd-r2">
                            <div className="sd-card">
                              <div className="ch"><b>Sentiment Overview</b>
                                <div className="sd-mini">All Platforms ▾</div>
                              </div>
                              <div className="sd-donut">
                                <svg width="128" height="128" viewBox="0 0 128 128">
                                  <circle cx="64" cy="64" r="52" fill="none" stroke="#F2F4F7" strokeWidth="17" />
                                  <circle className="sdSeg" data-i="0" cx="64" cy="64" r="52" fill="none" stroke="#12B76A" strokeWidth="17" strokeDasharray="0 327" transform="rotate(-90 64 64)" strokeLinecap="butt" />
                                  <circle className="sdSeg" data-i="1" cx="64" cy="64" r="52" fill="none" stroke="#2E6BE6" strokeWidth="17" strokeDasharray="0 327" transform="rotate(-90 64 64)" strokeLinecap="butt" />
                                  <circle className="sdSeg" data-i="2" cx="64" cy="64" r="52" fill="none" stroke="#E5372B" strokeWidth="17" strokeDasharray="0 327" transform="rotate(-90 64 64)" strokeLinecap="butt" />
                                  <rect className="sd-redact-svg" x="47" y="50" width="34" height="12" rx="3" />
                                  <text className="midl" x="64" y="78" textAnchor="middle">Total Mentions</text>
                                </svg>
                                <div className="sd-leg" id="sdSentLeg"></div>
                              </div>
                            </div>

                            <div className="sd-card">
                              <div className="ch"><b>Risk Level Distribution</b>
                                <div className="sd-mini">All Categories ▾</div>
                              </div>
                              <div className="sd-donut">
                                <svg width="128" height="128" viewBox="0 0 128 128">
                                  <circle cx="64" cy="64" r="52" fill="none" stroke="#F2F4F7" strokeWidth="17" />
                                  <circle className="sdRisk" data-i="0" cx="64" cy="64" r="52" fill="none" stroke="#E5372B" strokeWidth="17" strokeDasharray="0 327" transform="rotate(-90 64 64)" />
                                  <circle className="sdRisk" data-i="1" cx="64" cy="64" r="52" fill="none" stroke="#F79009" strokeWidth="17" strokeDasharray="0 327" transform="rotate(-90 64 64)" />
                                  <circle className="sdRisk" data-i="2" cx="64" cy="64" r="52" fill="none" stroke="#12B76A" strokeWidth="17" strokeDasharray="0 327" transform="rotate(-90 64 64)" />
                                  <rect className="sd-redact-svg" x="47" y="50" width="34" height="12" rx="3" />
                                  <text className="midl" x="64" y="78" textAnchor="middle">Total Mentions</text>
                                </svg>
                                <div className="sd-leg" id="sdRiskLeg"></div>
                              </div>
                            </div>

                            <div className="sd-card">
                              <div className="ch"><b>Top Trending Topics</b>
                                <div className="sd-mini">Trending Now ▾</div>
                              </div>
                              <div className="sd-trend" id="sdTrend"></div>
                            </div>
                          </div>

                          {/* platform / alerts / grievances / heatmap */}
                          <div className="sd-row sd-r3">
                            <div className="sd-card">
                              <div className="ch"><b>Platform Distribution</b></div>
                              <div className="sd-plist" id="sdPlat"></div>
                            </div>

                            <div className="sd-card">
                              <div className="ch"><b>Alerts Summary</b>
                                <div className="sd-mini">All Alerts ▾</div>
                              </div>
                              <div className="sd-list" id="sdAlerts"></div>
                              <div className="sd-viewall">View All Alerts →</div>
                            </div>

                            <div className="sd-card">
                              <div className="ch"><b>Recent Grievances</b>
                                <div className="sd-mini">All Status ▾</div>
                              </div>
                              <div className="sd-list" id="sdGriev"></div>
                              <div className="sd-viewall">View All Grievances →</div>
                            </div>

                            <div className="sd-card">
                              <div className="ch"><b>Geo Heatmap</b>
                                <div className="sd-mini">India ▾</div>
                              </div>
                              <div className="sd-heat">
                                <svg viewBox="0 0 100 116" preserveAspectRatio="xMidYMid meet">
                                  <defs>
                                    <radialGradient id="sdH">
                                      <stop offset="0" stopColor="#E5372B" stopOpacity=".85" />
                                      <stop offset="1" stopColor="#E5372B" stopOpacity="0" />
                                    </radialGradient>
                                    <radialGradient id="sdM">
                                      <stop offset="0" stopColor="#F79009" stopOpacity=".85" />
                                      <stop offset="1" stopColor="#F79009" stopOpacity="0" />
                                    </radialGradient>
                                    <radialGradient id="sdL">
                                      <stop offset="0" stopColor="#12B76A" stopOpacity=".8" />
                                      <stop offset="1" stopColor="#12B76A" stopOpacity="0" />
                                    </radialGradient>
                                  </defs>
                                  {/* India (simplified outline) */}
                                  <path className="sd-india" d="M35.4 5.6 30.1 6.3 27.4 9.4 22.6 10.2 21.9 14.6 24.4 17.9 22.1 21.3
                                  17.3 22.6 13.9 25.4 12.6 30.2 9.4 33.1 6.6 37.4 4.9 43.2 3.6 48.6 5.4 52.1 9.6 53.4
                                  13.1 52.6 15.9 55.3 17.4 60.2 18.1 65.6 19.4 71.4 21.2 77.1 23.4 82.9 26.1 88.6
                                  29.1 94.2 32.1 99.8 34.6 105.3 36.6 108.4 38.4 104.1 39.6 98.2 40.9 92.3 42.4 86.4
                                  43.9 80.4 45.6 74.6 48.4 70.1 52.6 66.4 57.4 63.1 62.1 59.9 66.4 57.1 69.1 54.1
                                  67.9 49.6 67.1 45.1 69.9 42.6 74.1 43.9 77.6 46.4 81.4 47.6 85.1 46.1 88.9 43.4
                                  92.6 40.1 95.4 36.1 91.6 33.9 87.1 32.9 82.4 31.6 77.6 30.4 72.4 29.6 66.9 28.9
                                  61.4 27.9 55.9 26.4 50.4 24.4 45.4 21.9 40.9 18.9 37.1 15.4 35.9 10.4 35.4 5.6 Z" />
                                  {/* Sri Lanka */}
                                  <path className="sd-india" d="M41.4 108.6 39.9 112.4 41.1 115.1 43.4 113.6 43.9 110.4 Z" />
                                  {/* live heat, pinned to real cities */}
                                  <circle className="sd-blob" cx="32.9" cy="32.6" r="9" fill="url(#sdH)" style={{"animationDelay": "0s"}} />
                                  <circle className="sd-blob" cx="19.0" cy="67.4" r="8" fill="url(#sdM)" style={{"animationDelay": ".5s"}} />
                                  <circle className="sd-blob" cx="37.1" cy="73.6" r="9" fill="url(#sdH)" style={{"animationDelay": "1s"}} />
                                  <circle className="sd-blob" cx="69.0" cy="54.7" r="7" fill="url(#sdM)" style={{"animationDelay": "1.5s"}} />
                                  <circle className="sd-blob" cx="34.2" cy="89.7" r="7" fill="url(#sdL)" style={{"animationDelay": "2s"}} />
                                  <circle className="sd-blob" cx="42.9" cy="89.3" r="6" fill="url(#sdL)" style={{"animationDelay": "2.5s"}} />
                                </svg>
                                <div className="sd-heatleg">
                                  <div><i style={{"background": "#E5372B"}}></i> High</div>
                                  <div><i style={{"background": "#F79009"}}></i> Medium</div>
                                  <div><i style={{"background": "#12B76A"}}></i> Low</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* feed / ai / quick */}
                          <div className="sd-row sd-r4">
                            <div className="sd-card" style={{"display": "flex", "flexDirection": "column", "minHeight": "0"}}>
                              <div className="ch"><b>Real-time Feed</b>
                                <div className="sd-live"><i></i> Live</div>
                              </div>
                              <div className="sd-feed" id="sdFeed"></div>
                            </div>

                            <div className="sd-card">
                              <div className="ch"><b>SOC-EYE AI Assistant</b></div>
                              <div className="sd-ai">
                                <div className="orb">◎</div>
                                <div className="ph">Ask anything about the intelligence data…</div>
                                <div className="snd">➤</div>
                              </div>
                            </div>

                            <div className="sd-card">
                              <div className="ch"><b>Quick Actions</b></div>
                              <div className="sd-qa">
                                <div><span>#</span>Add Keyword</div>
                                <div><span>⌖</span>Monitor POI</div>
                                <div><span>▤</span>Generate Report</div>
                                <div><span>📢</span>Broadcast Alert</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-glare"></div>
                </div>
                <img className="mb-frame" src="/assets/macbook.png" alt="" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
