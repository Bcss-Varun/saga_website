# SAGA website — launch readiness

Static export, eleven routes. Generated 2026-09-08, revised the same day
after the console-mock redaction and the two contrast fixes.
Verification: `tests/` — `test-cp3` canvas lifecycle, `cp4` home, `cp5` pillars
stack, `cp6` vertical template, `cp11` contact instrumentation, `cp12`
accessibility and metadata, `test-sweep` claims and build sweeps.

---

## Done

**Build.** Next.js App Router, `output: 'export'`. Eleven routes as static HTML
plus a custom 404. Three runtime dependencies — `next`, `react`, `react-dom` —
unchanged since the scaffold. Verification instrumentation is compiled out: zero
occurrences across the ten pages and all 25 JavaScript chunks.

That claim was previously unproven. The sweep read only the top level of
`out/_next/static/chunks` and skipped directories — and `chunks/app/` is exactly
where the instrumentation lands, so a build carrying it would have been reported
clean. The check now walks the whole tree, and was verified by running it
against a `NEXT_PUBLIC_CANVAS_STATS=1` build: it fails there, naming
`chunks/app/layout-*.js` and `chunks/app/page-*.js`. The shipped export is
clean; it is now also demonstrated to be.

**Stylesheet.** Ported near-verbatim, with five recorded deviations: the
`.js-reveal` gating that keeps content visible without JavaScript, the footer
heading level change, the two measured contrast corrections below, one added
block for the console mock's redaction bars, and the footer grid corrected from
five column tracks to four so it matches the four children this build actually
carries. Nothing was tidied.

**Navigation.** 236 internal links across 11 exported pages, zero broken; 34
in-page anchors, all resolving; every route reachable. Behaviour checked in a
browser: header links, the Solutions dropdown and all four verticals, the header
CTA, the logo, Escape returning focus to the trigger, all nine footer links, and
the mobile menu at 420px. `tests/test-links.mjs` and `tests/test-nav.mjs`.

**The console mock.** Its figures are withheld. Every number is a redaction bar
sized like the number it replaced; the platform rows carry no names and no brand
colours; the live-feed avatars are neutral; the alert counters are dots. Layout,
chrome, donut arcs, sparklines and bar widths — and the movement of all three —
are untouched, because shape is what makes the object credible and it asserts
nothing. `aria-hidden` stays, so assistive technology still does not read the
illustration as data.

The rule applied: UI furniture stays — the clock, the date filter, the filter
pills, the relative timestamps, the version string — and anything a reader could
mistake for a finding becomes a bar. That caught three figures hiding in prose
rather than in figure slots: "across 40+ accounts", "resolved … within 4 hours",
and the sequential grievance ids (#GRV-12543 asserts twelve and a half thousand
grievances). Verified at runtime after 3s of live drift: 53 redaction bars, zero
platform names, and every remaining digit accounted for as furniture — the
menubar clock, the date range, the trending ranks and the "N min ago" stamps.

**Content.** All eleven routes carry authored copy at mechanism level. No
placeholders remain. Every page is marked `[draft — needs review]` in the page
itself.

**Accessibility.** One `h1` per route, no skipped heading levels. Every image
has alt text or is marked decorative. Keyboard traversal on all nine content
routes: 17–56 stops each (fewest `/trust`, most `/public-safety`), no traps,
visible focus on every stop. Dropdown opens
on ArrowDown, Escape returns focus to the trigger. Reduced motion draws exactly
one static frame on all four vertical scenes and on Home, with no loop
scheduled. Every route is fully readable with JavaScript disabled — 146 to 1,152
words, zero hidden elements.

**Contrast.** 137 measurable pairings across ten routes meet WCAG AA. A further
49 could not be computed from the DOM — text over gradients, and text over
fixed-position elements whose backdrop is painted by something they are not
descendants of. Those were measured by sampling rendered pixels instead: the nav
over the hero gutter is 9.32:1, the FAQ open state is 6.66:1 at its worst stop.

The two failures found in the sweep are fixed. The `.cta` label was `#f5f5f5` on
`--orange` — 3.07:1 on the primary action of every route — and is now `#1A0A04`
at **5.75:1**, with the fill unchanged so the button is as loud as it was.
`.fstep .n` was `--deep` on `--s2` at 3.84:1 and is now `--orange` at
**5.75:1**. Both figures are recorded in CLAUDE.md so neither is reverted to
match the original sheet.

**Keyboard, `<summary>`.** Enter activation is verified, closing the one gap
left open at checkpoint 12. The earlier failure was harness technique, not site
code: a bare `keyDown` never produces the character event Chrome's default
`<summary>` handler acts on. Sending the full rawKeyDown → char → keyUp sequence
a physical key produces, Enter toggles the first disclosure on `/`,
`/public-safety` and `/governance`, and Space toggles it back.

**Instrumentation.** `/contact` carries provenance that survives client-side
navigation — the case `document.referrer` cannot cover, and the reason the
project's success metric is measurable at all. Verified for client navigation,
direct arrival, mid-session reload and UTM capture.

---

## Blocked on approvals

`copy/APPROVALS.md` holds every item. In priority order:

**1. Read-logging on the audit trail.** `/trust` asserts that views are logged,
not only writes. If engineering cannot confirm it, the sentence comes out rather
than being softened.

**2. Everything else** — deployment model, role names and spans, alert tier
labels, escalation intervals, retention periods, attribution and scoring
thresholds, unrest band labels, the endorsement window, client descriptors,
language support beyond the four named, the source-credibility weighting
scheme, and contractual terms. 21 distinct markers, 56 occurrences, each tracked.

**3. Two configuration values.** The contact endpoint is `[pending: endpoint]` —
unset, the form says plainly it has nowhere to send rather than faking success.
The production domain is unset, so canonical and Open Graph URLs are omitted
rather than pointed at a guess.

---

## Open pre-launch measurement

**Pillars-stack scroll performance, on real hardware.** Measured in headless
Chromium at 6× CPU throttle: 20fps scrolling the pinned stack, 38fps elsewhere
on Home against 60fps on `/trust`.

**Those numbers should not be acted on.** That environment rasterises through
SwiftShader with no GPU, and both costs found are exactly the work a GPU does
nearly free. The signature is an inversion: a *paused, non-drawing* globe canvas
cost 14fps while the scene engine drawing 820 points every frame cost 9fps —
rasterisation-bound, not compute-bound.

Re-measure on a low-end Windows desktop with an integrated GPU under Chrome's
CPU throttle: `node --experimental-websocket tests/measure.mjs`, with
`SAGA_TEST_URL`, `RATE` and `REPS`. If it clears ~30fps, close the item. If it
does not, the bisection has already ruled out the obvious suspects —
`contain: paint`, halved shadow blur, flat backgrounds, zero border-radius and
hiding the oversized word together bought 4fps. The real costs are sticky-layer
compositing and canvas layer rasterisation. One further lever is untested:
whether `#stage` needs to paint at all while the globe is on screen.

---

## What I would fix before this goes public

**Confirm read-logging or cut the sentence.** It is the most load-bearing claim
on `/trust` and the first thing a technical evaluator will test.

**Set the production domain.** Without it there are no canonicals, and the
success metric depends on deep links from search results and PDFs resolving to
one URL.

**Read the mock, not only the copy, in any future sweep.** The console mock
published a platform list and 98.60M for the whole build because every sweep
read sentences and none read what a canvas or a template drew at runtime. The
rule is now written into CLAUDE.md, but the check has to be run, not just
recorded.

---

## Not done, and out of scope by instruction

Pricing, case studies, a resources hub. The copy rewrite is complete but
unreviewed — every page says so.
