# SAGA Website — Project Brief

Read this before making changes. It defines the stack, structure, conventions and
content rules for this project.

---

## What this is

Marketing website for **SAGA** (Sentiment and Goodwill Analysis), a social media
intelligence platform by Blue Cloud Softech Solutions Limited. Sold to police forces,
government departments, political operations, brands and public figures.

**Primary audience:** law-enforcement and government buyers in India, with international
secondary. Procurement committees and senior officers, not growth marketers.

**Success metric:** demo requests originating from government and police domains.
Every structural decision serves that, not engagement or time-on-page.

---

## Stack

- **Next.js, App Router, `output: 'export'`** — static HTML at build time. Non-negotiable:
  deep links must serve real HTML to search engines and to committees opening a vertical
  page directly.
- **Plain CSS** — global stylesheet plus CSS Modules. The existing `Saga.html` contains
  ~5,600 lines of working, hand-tuned CSS. Port it. **Do not rewrite it into Tailwind.**

  **Exception — measured performance defects.** The verbatim rule is relaxed where a
  measured, attributed performance defect requires a CSS change: targeted property
  changes are in scope, wholesale refactoring is not. "Measured" means an A/B with the
  suspect change neutralised, so the cost is attributed rather than guessed, and the CPU
  throttle calibrated rather than assumed. Record the before/after figures alongside the
  change. Aesthetic or tidying edits to the ported CSS remain out of scope.

  **Known hazard — the bare `nav` element selector.** The ported sheet styles
  `nav { position: fixed; top: 0; left: 0; right: 0; z-index: 50; height: 80px; display: flex }`
  as the site header. Every semantic `<nav>` on the site inherits it, including one nested
  deep inside a page component — it will silently become a second fixed header overlapping
  the real one. Any new `<nav>` must reset `position`, `top/left/right`, `width`,
  `max-width`, `height`, `z-index`, `display`, `padding`, `margin`, `will-change` and
  `transition`. A CSS Module class beats the element selector on specificity, so the reset
  belongs in the component's own module — see `SectionNav.module.css`. Do not solve this by
  using a `<div>` instead; the element is correct and the navigation is real.

  **Known defect class — tracks the port left behind.** The footer grid declared
  five columns because the original footer had five children; this build carries
  four, so the fifth track sat empty and the whole footer packed against the
  left. Corrected on 2026-09-08 to four fluid tracks matching the four children.
  Restoring the missing column would have meant inventing navigation, which is a
  stop-and-ask. When a ported layout looks wrong, check the track count against
  the child count before adjusting anything visual.

  Class names in the global sheet stay unhashed. Code reads `getComputedStyle(card).top`
  to learn the sticky offset in the pillars stack; moving those selectors into a CSS
  Module would introduce the hashing hazard, not avoid it.
- **No UI component library.** The visual language is bespoke.
- Font: `Outfit` (300/400/500/600/700) via Google Fonts.

---

## Design system — do not change these

Ported from the existing build. These are the real values.

```css
--orange:#F15B26;   /* brand accent — 5.97:1 on --s1, passes */
--deep:#C4441A;
--lift:#FF7A45;
--soft:#FF9A6B;
--ember:#7A2A0E;
--crit:#FF4D1F;
--warn:#F5A524;
--ok:#5FD08A;

--s1:#08080A;  --s2:#0E0E11;  --s3:#16161A;
--ink:#F5F5F4;  --strong:#fff;
--muted:#A5A09B;   /* 7.72:1 on --s1 */
--faint:#8A857F;   /* 5.47:1 on --s1 */
--line:rgba(255,255,255,.08);
--line2:rgba(255,255,255,.14);
--ease:cubic-bezier(.16,1,.3,1);
```

**The theme stays dark.** A light theme was considered and rejected. Do not propose it.
The canvas renderers depend on additive blending (`globalCompositeOperation = 'lighter'`,
`mix-blend-mode: screen`), which produces nothing on a white surface.

The muted greys are compliant — `--muted` 7.72:1 and `--faint` 5.47:1 on
`--s1`. Do not "fix" them.

Two other pairings were **not** compliant and were corrected on 2026-09-08,
measured off rendered pixels rather than read off the sheet:

- `.cta` label was `#f5f5f5` on `--orange` — **3.07:1**, below AA for normal
  text, on the primary action of every route. Now `#1A0A04`, **5.75:1**. The
  fill is unchanged; darkening the label fixed a text problem without dulling
  the button.
- `.fstep .n` was `--deep` on `--s2` — **3.84:1** at 10px. Now `--orange`,
  **5.75:1**.

Both are exceptions to the verbatim-CSS rule on the same footing as the
performance exception: a measured defect, a targeted property change, figures
recorded. Do not revert them to match the original sheet.

---

## Routes

```
/                  Home — platform story + four doors
/platform          How it works, architecture, RBAC, RSS engine
/public-safety     Vertical — police and law enforcement
/governance        Vertical — administrations, departments, political operations
/brands            Vertical — brand and communications teams
/celebrity         Vertical — public figures and talent teams
/investigation     SOC-EYE, deepfake, OSINT, identity, location
/trust             Deployment, security, data handling, lawful basis
/contact           Demo request
```

**Navigation:** Platform · Solutions ▾ · Investigation · Trust · Request a Demo
Solutions is a dropdown containing the four verticals with one-line descriptors.

---

## Home page composition

Keep, in this order:

1. Hero
2. Console showcase (the macbook render — the most credible object on the site)
3. The challenge
4. Observe / Understand / Act
5. **Four doors** — moved up from the page foot; each links to its vertical page
6. Capabilities teaser → links to `/platform`
7. Signal-to-action flow
8. Short FAQ — 4–5 platform-level questions only
9. Final CTA

Move **off** Home:

- The full Governance deep-dive → `/governance`. It currently makes the page lopsided,
  since it is the only vertical with a deep section.
- Most FAQ entries → split across the vertical pages.
- Deep capability detail → `/platform`.

Home answers three things: what SAGA is, how it works, which door is yours.

---

## Vertical page template

All four verticals use one shared template. Structure is identical; depth varies.

| Block | Public Safety | Governance | Brands | Celebrity |
|---|---|---|---|---|
| Hero — vertical problem | ✓ | ✓ | ✓ | ✓ |
| Monitor / Investigate / Manage triad | ✓ | ✓ | ✓ | ✓ |
| Capability modules | 6 | 6 | 4 | 4 |
| Signature visual | 1 | 1 | 1 | 1 |
| Signal-to-action strip | ✓ | ✓ | ✓ | ✓ |
| Scenario narratives | 3 | 3 | 2 | 2 |
| Deployment note | full | full | short | short |
| FAQ | 8 | 8 | 5 | 5 |
| CTA | ✓ | ✓ | ✓ | ✓ |

Every page carries every block, so no vertical looks abandoned. Effort weights toward
Public Safety and Governance, which lead revenue.

**FAQ counts rose from 6/6/4/4 on 2026-09-08**, with the density pass. Detail in a
disclosure is better placed than the same detail in a paragraph — that is the point of
the pass — so material moved out of the body lands here rather than being deleted. A
closed disclosure costs a scanning reader nothing.

Brands and Celebrity still carry 4 and reach 5 when they go through the density pass
(rollout order below). `DEPTH` in `app/lib/verticalContent.js` is the machine-readable
copy of this table and `tests/test-cp6.mjs` asserts the rendered DOM against it, so the
two cannot drift apart silently.

Each vertical page must **stand alone**. Most qualified traffic arrives from a PDF link,
a search result or a forward — never assume homepage context.

---

## Canvas components — get this pattern right

There are two canvas renderers in the existing build (`#stage` hero field, `.gcanvas`
globe). Wrap both in a single reusable component. Without cleanup, every navigation
leaks an animation loop and the site degrades as the visitor moves between pages.

```jsx
useEffect(() => {
  const cv = ref.current;
  const ctx = cv.getContext('2d');
  let raf;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  // size to bounding rect * dpr, then ctx.setTransform(dpr,0,0,dpr,0,0)

  const draw = (t) => { /* existing draw code, unchanged */ raf = requestAnimationFrame(draw); };
  raf = requestAnimationFrame(draw);

  return () => cancelAnimationFrame(raf);   // required
}, []);
```

Also required:
- Pause when off-screen via `IntersectionObserver`.
- Draw a single static frame when `prefers-reduced-motion: reduce` — do not freeze
  mid-animation, and do not leave the canvas blank.
- Debounce resize; re-fit on resize.

The existing build has 5 `prefers-reduced-motion` CSS blocks plus 3 `matchMedia`
calls in JavaScript. Preserve all of them.

**Checkpoint 3's five canvas assertions must be re-run in situ at checkpoint 5**, when
the globe mounts inside the pillars sticky-stack. That stack runs its own
`ResizeObserver` and writes `--p` on scroll — a materially different environment from the
isolated harness the assertions were first proven in. Checkpoint 3 is not settled until it
passes there. The harness lives in `tests/`.

**Scene assignment is a per-page content decision.** There is no default scene and none
should be invented. A route with no `data-scene` host leaves `#stage` unpainted — that is
correct, not a bug to be patched with a cosmetic default. Each page declares its own scene
at its own checkpoint.

---

## Density pass — acceptance criteria

Applies to every section on every route. The pass restructures what exists; it does not
simplify the mechanism language. Stripping specificity returns the copy to "predictive
intelligence", and specificity is the only differentiation available given that the
product shows no UI, publishes no numbers and names no clients. **Reformat, don't
dilute.**

Shape per block: a 2–4 word title, one bold answer sentence, then at most two short
sentences of detail. No module carries a paragraph. Roughly 600–700 rendered words per
page. Short section headings, three to six words, at a substantially larger display
scale. Alternating section grounds. Eyebrow pills on section headers. Shorter measures
and more whitespace between blocks.

**Static-frame criterion.** With animation stopped or absent, every section must answer
yes to all four:

- is its purpose immediately clear?
- is the visual meaningful without motion?
- is the text-to-visual ratio right?
- does it read as complete in a screenshot?

**Empty-space classification.** Every large empty area is exactly one of:

- **A** — intentional breathing room
- **B** — required by animation
- **C** — excessive
- **D** — should carry supporting content

Only **C** and **D** get changed, and with the minimum edit. Classify before editing;
an area that is A or B is left alone.

**Animation test.** Every animated element must communicate one of: signals, data
movement, relationships, geography, narrative spread, threat escalation, investigation,
evidence, or action. Anything that communicates none of these is decoration and gets
questioned.

**Rollout order.** One page at a time, reviewed before the next:

1. `/public-safety` — done 2026-09-08
2. `/governance`
3. `/trust` — moved up: it is the page a procurement committee opens first, and its
   lawful-basis section is the densest prose on the site
4. `/brands`, `/celebrity`
5. Home — after the verticals. It carries the pillars sticky-stack and the console
   showcase, the most fragile pieces on the site, and is best attempted once the
   pattern is settled across four pages
6. `/platform`, `/investigation`
7. `/contact`

The layout is opt-in per page (`dense: true` in the vertical content files, or the
page's own module) so a shared template never changes under a page that has not been
reviewed. When every route is converted the dual code paths collapse.

**Not to be touched by this pass:** the limitation statements on `/investigation` earn
credibility and stay — reformatted into the Takes / Returns / Limits card structure, not
cut. The lawful-basis section on `/trust` stays in full and gets the bold-lead-in
treatment.

---

## Content rules

**Specificity is the proof.** This product cannot show its UI publicly. Vague capability
language is therefore worthless — it is indistinguishable from any social listening tool.
Write at mechanism level.

- Good: "0–100 score per area across five levels, driven by issue velocity."
- Bad: "Predictive intelligence."
- Good: "Returns Real, Fake, Suspicious or Needs Review with a confidence figure and a
  frame-level breakdown."
- Bad: "Advanced AI-powered verification."

If a sentence could equally describe a competitor, rewrite it.

**Scenario narratives replace screenshots.** Short operational stories — a keyword firing
a critical alert, a story captured before it expires, a deepfake verdict returned before a
clarification was issued. Anonymised, no real names or places, marked illustrative.

**Naming.** Public Safety / Governance / Brands / Celebrity. Never "Police Saga" or
"Political Saga" in public copy. Use literal search terms in body copy — "law enforcement",
"police intelligence" — so search still finds the pages.

---

## Claims — hard rules

These have not been approved. Do not publish, invent, or restore them.

- **No numeric claims** without an owner and a date. This includes "100M+ conversations
  daily" and "8+ countries". If a number appears in old collateral, it is not thereby approved.
- **No legal claims.** Do not use "court-admissible", "tamper-proof" or "legally
  defensible". Write "evidence-grade workflows", "immutable audit trail", "timestamped
  capture with metadata".
- **No named clients.** Use unnamed descriptors: "a state police force", "a national
  government in West Africa", "a state Home Ministry".
- **No public mention of Reputation Shield / Bulk X Actions** in any form, including a
  gated teaser. Not in copy, not in nav, not in metadata.
**These rules govern rendered UI, not only sentences.** The console mock on
Home published a five-platform coverage list and figures including 2.45M
mentions and 98.60M potential reach, in a screenshot, for the whole of the
build — because every sweep read copy and no sweep read what the mock drew at
runtime. A fabricated number inside a product screenshot asserts itself more
forcefully than the same number in a headline, not less. Its figures are now
redaction bars and its platform rows carry neither names nor brand colours; see
`copy/APPROVALS.md` item 0. Any new mock, diagram or chart is subject to every
rule below.

- **Platform coverage list is unresolved.** The deck names five social platforms; the
  one-pagers add TikTok, News/RSS and Blogs/Forums. Do not publish either list until
  confirmed — mark it `[pending]` in the copy.

Anywhere a claim is required but unapproved, write the copy and mark it inline as
`[pending sign-off]` rather than inventing a value.

---

## Accessibility — already correct, keep it that way

The existing build has one `h1`, clean heading hierarchy, alt text on all images,
24 `aria-label`s, and correct `aria-expanded`/`aria-controls` on disclosures. Match this
standard on every new page.

- Risk and status states pair colour with a text label. Colour alone fails for colour-blind
  users and in print — these pages get printed and forwarded inside government departments.
- No content may exist only inside a scroll trigger or a canvas layer.
- Every interactive control reachable by keyboard with a visible focus state.

---

## Local development

**Never run `next build` while `next dev` is running.** They share `.next`, and building
underneath a live dev server corrupts its client manifest — the dev server then fails with
`Could not find the module ... in the React Client Manifest` until `.next` is deleted and
the dev server restarted. Stop the dev server first, or build from a separate checkout.

---

## Migration order

1. Scaffold Next.js with static export; port the global stylesheet unchanged.
2. Build the layout shell: header, nav with Solutions dropdown, footer.
3. Build the `<CanvasScene>` wrapper and verify cleanup across navigation.
4. Port Home, resequenced per the composition above.
5. Build the vertical page template as one parameterised component.
6. Fill `/public-safety` completely. Verify the content approach works before repeating it.
7. Build `/trust` — small page, disproportionate impact on government deals.
8. Fill `/governance`, then `/brands`, `/celebrity`.
9. Build `/platform` and `/investigation`.
10. `/contact` with form validation, consent capture, and source-page metadata so
    government-origin leads are separable in reporting.

---

## Open items — pre-launch

**Re-measure pillars-stack and Home scroll performance on real hardware.** A low-end
Windows desktop with an integrated GPU, under Chrome's CPU throttle. The harness takes
`SAGA_TEST_URL`, `RATE` and `REPS`: `node --experimental-websocket tests/measure.mjs`.

Measured at checkpoint 5 in headless Chromium at 6x throttle: 20fps scrolling the pinned
stack, and 38fps elsewhere on Home against 60fps on `/trust`. **Those numbers are not
trustworthy** — that environment rasterises through SwiftShader with no GPU, and both
costs found are exactly the work a GPU does nearly free. The signature is an inversion:
a *paused, non-drawing* globe canvas cost 14fps while the scene engine drawing 820 points
every frame cost 9fps. That is a rasterisation-bound measurement, not a compute-bound one.

If it clears ~30fps on real hardware, close this item — there is nothing to fix. If it
does not, the bisection has already ruled out the obvious suspects: `contain: paint`,
halved shadow blur, flat backgrounds, zero border-radius and hiding the oversized word
together bought 4fps. The real costs are:

- sticky-layer compositing — `position: static` on `.pcard` took 16fps to 28fps
- canvas layer rasterisation — removing the globe element took 18fps to 32fps, and the
  two canvases together account for the entire 60→38fps Home baseline gap

One further lever to test at that point, not yet tried: **whether `#stage` needs to paint
at all while the globe is on screen.** One canvas at a time may be cheaper than any CSS
change, and it costs nothing visually if the stage is hidden behind a pinned card anyway.

Per the CSS exception above, change nothing here without a calibrated A/B on the target
hardware.

---

## Things not to do

- Do not add a vertical chooser or splash gate before the homepage content.
- Do not client-render the vertical pages.
- Do not add pricing, case studies, or a resources hub in this phase.
- Do not use stock photography of control rooms, police officers, protests or crowds.
- Do not add per-section fade-up animations. Motion should explain something — the
  pipeline, the sequence, the convergence — or not exist.
- Do not restore numbered indices (01/02/03) on content that is not a genuine sequence.
