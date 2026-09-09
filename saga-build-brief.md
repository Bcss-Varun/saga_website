# SAGA Website — Build Brief

Companion to `CLAUDE.md`. That file defines *what* the site is — stack, tokens, routes,
content rules, claim restrictions. This file defines *how the build runs*: the decisions
already made, the order of work, and where you stop and ask.

Read `CLAUDE.md` first. Where the two conflict, `CLAUDE.md` wins.

---

## Working agreement

**Stop at every checkpoint below and show the result before continuing.** Do not run
several checkpoints together. A wrong decision at checkpoint 3 that surfaces at
checkpoint 8 costs the whole intervening build.

**Do not write marketing copy on your own initiative.** Structure and placeholders are
yours. Final copy is reviewed. Where copy is needed and not yet supplied, write it and
mark it inline `[draft — needs review]`.

**Do not invent facts.** No numbers, no client names, no deployment claims, no coverage
lists. See the claims section of `CLAUDE.md`. If a value is required, write
`[pending sign-off]`.

**Ask before adding any dependency.** The current build has zero. The target is Next.js
and nothing else. No Tailwind, no UI kit, no animation library, no icon package.

**Do not refactor working code you were not asked to touch.** The CSS in particular is
hand-tuned and ports verbatim.

---

## Decisions already made — do not re-open

These came out of a full inventory of `Saga.html`. They are settled.

**1. `#stage` mounts in the root layout, not per page.**
It is fixed-position and full-viewport — it is the site background, not a page element.
Mount once in the layout shell as a singleton that survives client navigation. Drive
scene changes through the existing `data-scene` attributes and `window.SAGA_SETWORLD`.

Consequence: `#stage` is the one canvas that must **not** be torn down on route change.
`.gcanvas` still follows the normal cleanup pattern. Do not apply the same lifecycle to both.

**2. Do not ship the bake pipeline.**
`bake/` contains `scenes.js`, `renderer.html`, `bake.py` and `ScrubSequence.tsx`, with only
the `act` scene baked in `frames/`. Ship the live scene engine instead. An 820-point cloud
with hand-rolled projection and no dependencies is cheap; baked WebP sequences on a
full-viewport background are not. Leave `bake/` in the repo untouched. Revisit only if
real-device testing shows a problem.

**3. Replace the hero frame backdrop — do not port it.**
The current implementation runs two `position:fixed` divs synced to a normal-flow
element's margin box via `getBoundingClientRect` on every scroll frame. It fights the
layout engine now and will fight React harder — any re-render that changes hero margins
without firing a scroll event leaves the backdrop stale.

Rebuild the `--frame` light gutter as a wrapper element with a background. No measurement,
no scroll listener, no fixed positioning. If the visual cannot be matched exactly this way,
stop and show the closest result rather than reinstating the JS sync.

**4. Collapse the two vertical selectors into one.**
The homepage currently offers the verticals twice: the tabbed `worlds` widget at DOM
position 6, and the four doors at position 9. That was reasonable when the verticals were
tabs on a single page. They are now separate routes, so it is the same choice offered twice.

- Keep the four doors. Move them to position 5, directly after Observe/Understand/Act.
- Remove the `worlds` tab section from the homepage.
- Keep the `WORLDS`, `WICON` and `WGRAPH` data objects — they become the content source
  for the four vertical pages.
- The tab widget's roving-tabindex and arrow-key handling is well built. Preserve the
  pattern; it will be reused for in-page navigation on the vertical pages.

**5. Rename the vertical data keys.**
`WORLDS` uses `police` and `political` as keys. Public copy uses Public Safety and
Governance. Keys are invisible to users, but rename them to `publicSafety` and `governance`
so route params, data keys and copy do not drift apart across nine pages.

---

## Build sequence

Each checkpoint has an acceptance test. Meet it before moving on.

### Checkpoint 1 — Scaffold
Next.js, App Router, `output: 'export'`. Port the entire `<style>` block from `Saga.html`
into a global stylesheet, unchanged. Fonts via `next/font` or the existing Google Fonts link.

*Accept when:* `next build` produces static HTML and the global stylesheet loads with all
custom properties intact.

### Checkpoint 2 — Layout shell
Header, nav, footer. Nav items: Platform · Solutions ▾ · Investigation · Trust ·
Request a Demo. Solutions is a dropdown containing the four verticals with one-line
descriptors. Port the existing hide-on-scroll and mobile toggle behaviour. Mount `#stage`
here as the persistent singleton.

*Accept when:* the shell renders on a blank route, the dropdown is keyboard operable, and
`#stage` paints behind it.

### Checkpoint 3 — Canvas lifecycle
Build `<CanvasScene>` for `.gcanvas`: `useRef` + `useEffect`, `cancelAnimationFrame` on
cleanup, `IntersectionObserver` pause, DPR capped at 2 with `setTransform`, debounced
resize re-fit, and a single static frame under `prefers-reduced-motion`.

*Accept when:* navigating between two routes twenty times leaves frame rate unchanged and
no orphaned animation loops in the profiler. **Verify this before building any pages** —
a lifecycle bug found at checkpoint 8 means reworking eight pages.

### Checkpoint 4 — Home
Port in this order: hero → console showcase → challenge → Observe/Understand/Act →
four doors → capabilities teaser → signal-to-action flow → short FAQ (4–5 platform-level
questions) → final CTA. `worlds` tabs removed. Governance deep-dive removed — it moves to
`/governance`.

The showcase dashboard's `innerHTML` templates port mechanically, but every
`getElementById('sd…')` becomes a ref, all intervals must be cleared on unmount, and it
must pause off-screen like the globe.

*Accept when:* Home renders in the new order with no console errors and the dashboard
timers stop when the section leaves the viewport.

### Checkpoint 5 — Pillars sticky-stack
The hardest port. Current code measures absolute document offsets and depends on `load`
plus `document.fonts.ready`. Under the App Router there is no `load` on client navigation
and layout is unsettled when `useEffect` fires.

Rebuild against a `ResizeObserver` on the stack container that re-runs `measure()`. Keep
`.pgap` and `.pcard` selectors in a single CSS Module — the code reads
`getComputedStyle(c).top` to learn the sticky offset, and hashed class names must not break
that relationship. Measure off the non-sticky `.pgap` runways, not the pinned cards.

*Accept when:* the stack behaves identically on hard load, on client navigation into the
route, and after a window resize.

### Checkpoint 6 — Vertical template
One parameterised component driving all four routes. Blocks: hero → Monitor / Investigate /
Manage triad → capability modules → signature visual → signal-to-action strip → scenario
narratives → deployment note → FAQ → CTA. Depth per the table in `CLAUDE.md`.

Each vertical page must stand alone — most qualified traffic arrives from a PDF link or a
search result, never from Home.

*Accept when:* all four routes render from the template with placeholder content and are
individually reachable as static HTML.

### Checkpoint 7 — `/public-safety` in full
Complete content. Six capability modules, three scenario narratives, six FAQ entries.
This is the revenue-leading vertical and the proof that the content approach works.

*Accept when:* a reader with no prior knowledge can name five specific things the product
does after reading it.

### Checkpoint 8 — `/trust`
Deployment statement, access control (Super Admin / Level-2 / Level-1), audit trail,
lawful basis, unnamed client descriptors. Small page, disproportionate weight in government
deals. Reachable from the top nav, not only the footer.

### Checkpoint 9 — Remaining verticals
`/governance` at full depth, then `/brands` and `/celebrity` at medium depth.

### Checkpoint 10 — `/platform` and `/investigation`
Pipeline in depth, architecture, RBAC, RSS engine. Investigation: SOC-EYE, deepfake,
OSINT, identity, location.

### Checkpoint 11 — `/contact`
Form with validation, consent capture, and hidden metadata recording the source page and
selected vertical. This instrumentation is how government-origin demo requests become
countable — without it the project's success metric does not exist.

### Checkpoint 12 — Verification pass
Contrast measured on any new colour pairing. Keyboard traversal on every route.
Reduced-motion static states on every animated element. No content existing only inside a
scroll trigger or canvas. Custom 404. `next build` clean.

---

## Stop and ask — do not decide these yourself

- Any numeric claim, coverage list, client name, deployment specific or timeline figure.
- Whether a capability may be described publicly at all.
- Any new dependency.
- Any change to the four-route naming or the nav structure.
- Any proposal to change the theme, the palette, or the muted grey values.
- Whether the hero frame visual is acceptable after the CSS-only rebuild.

---

## Known content problem — flag, do not silently fix

The existing copy sits at exactly the vague altitude `CLAUDE.md` rules out — lines in the
register of "From scattered signals to connected intelligence" and "Predictive
intelligence". This is not a porting issue; it is a rewrite, and it is the largest
remaining chunk of work.

During the port, carry the existing copy across as-is and mark each section
`[copy: needs specificity rewrite]`. Do not attempt the rewrite mid-port — page structure
must settle first, or the rewrite gets done twice.

When the rewrite happens, the test for every sentence is: **could this sentence equally
describe a competitor?** If yes, it fails. Replace outcome language with mechanism —
score ranges, verdict states, alert tiers, workflow stages, extraction types.
