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
  belongs in the component's own module. Do not solve this by using a `<div>` instead; the
  element is correct and the navigation is real. The worked example used to be
  `SectionNav.module.css`; that component was removed on 2026-09-10 and the site now has
  exactly one `<nav>`. The hazard is unchanged and applies to the next one written.

  **Known hazard — ID selectors in the ported sheet.** `#hero` is styled as the
  full-viewport framed card: `min-height: 100svh`, flex column, and above 1024px
  margined in by `--hero-side` so the light gutter shows around it. `#hero h1`,
  `#hero .lead`, `#hero .eyebrow` and `#hero .inner` are styled too. A CSS
  Module class cannot override any of it — an id beats a class — and Next's
  CSS Modules hash ids as well as classes, so writing `#hero` inside a module
  renames it. The three rail pages need a compact hero and keep the id (the
  section order is asserted against it, and `#hero .eyebrow::before` draws the
  rule that leads the eyebrow), so their overrides are written
  `:global(#hero).hero { … }` and `:global(#hero) .title { … }`. `:global()`
  keeps the id global; the local class supplies the winning specificity. See
  `PageHero.module.css`. The global sheet stays untouched.

  **The Home hero frame is gone.** Removed 2026-09-09 on request: the light
  gutter, the black inset card, and the scroll-driven inset that closed it to
  full bleed. `HeroFrame`, the `--hero-top/side/bottom/radius` tokens, the
  `--frame` colour and the root `--p` write in `Nav.js` went with it — nothing
  else read any of them. The pillars stack writes its own `--p` per card; that
  is unrelated and still live. The two notes below record why the effect was
  wrong before it was removed, because the defect classes outlive it.

  **Known defect class — a scroll effect that resizes the document.** The Home
  hero's framed card animated its top margin from 112px to 0 against a top
  padding running 56px to 120px, both driven by `--p`. The hero is
  `min-height: 100svh` and its content is shorter than that, so the padding
  change was absorbed and the margin change was not: the document lost 112px of
  height between `--p` 0 and 1. A page that gets shorter while a reader scrolls
  down it makes everything below travel faster than the scroll, which is what
  "the animation is not working properly" turned out to mean. Corrected
  2026-09-09 — the top offset and top padding are now fixed and only the sides
  and the corner radius animate, which is the part anyone can see.

  Before: document height 12000px at `--p` 0, 11888px at `--p` 1.
  After: 12000px throughout. Frame times through the hero were 37 of 70 over
  16.7ms before and 34 of 70 after; the height shift was the defect, not the
  frame cost.

  The same rule generalises: **a scroll-driven effect may not change the height
  of the document.** Animate insets, radii, opacity and transforms; do not
  animate a margin or a padding that the page's own height depends on.

  **Known defect class — a fixed inset that was meant to be proportional.** The
  same hero set `--hero-side: 200px`, so the light gutter was 14% of the width
  per side at 1440 and 18% at 1100 — the narrower the window, the more of the
  page was frame — and then the 1024px rule cut it to zero in one step. Now
  `min(5vw, 96px)`: about 5% a side at every width above the breakpoint, and a
  51px step at the cut rather than a 200px one. Measured off rendered pixels,
  2026-09-09.

  | viewport | gutter before | gutter after |
  |---|---|---|
  | 1440px | 28% | 10% |
  | 1280px | 31% | 10% |
  | 1100px | 36% | 10% |

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
/investigation     Blura SAGA AI assistance, deepfake, OSINT, identity, location
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

**Redesign requested 2026-09-14.** The user has authorised a new layout and content plan for all four verticals. Follow [the revised vertical brief](copy/vertical-redesign-plan.md) for this work: each page must introduce Blura SAGA and explain its solution completely for a first-time visitor arriving directly from search. Related-page links provide optional depth. The old identical structure and counts below describe the previous implementation and are superseded for the redesign. Use Blura SAGA as the public product name.

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

## Bento layout — every route except Home

Built 2026-09-09 from an approved reference, replacing the rail layout that
stood for one day. Live on `/platform`, `/trust`, `/public-safety`,
`/governance`, `/brands`, `/celebrity`, `/investigation`, `/contact` and the
404. **Home is deliberately not converted yet** — it carries the pillars
sticky-stack and the console showcase, the two most fragile pieces on the site,
and it is the last page to move.

**Tokens are unchanged.** The reference was drawn in a different palette
(`#F0522B`, `#0A0A0B`, `#101012`) and three fonts (Poppins, Inter, IBM Plex
Mono). The layouts were taken and the design system above was not: everything
is `--orange` on `--s1`/`--s2` in Outfit. If a future reference arrives in other
colours, the same rule applies.

**One addition — blue, in washes only.** `rgba(46, 92, 230, …)` appears in
background gradients and nowhere else. It is never type, never a border, never
a status. The contrast table and the colour-plus-label rule are untouched by
it, and the lowest measured pairing on the site is 4.93:1 against a 4.5
requirement.

**Headings are `--orange`. Reversed on 2026-09-10, on request, sitewide.**
They were `--strong` under this layout, on the argument that the reference's
restraint came from white type with the accent held back. The client asked for
the ported treatment instead, so no component in this layer sets a heading
colour at all — `Head`, `PageHero`, `PageCta` and `FaqSection` all inherit the
ported `h1`/`h2` rule, which means there is one place to change it and one
behaviour across the bento pages and Home alike. `--orange` measures 5.97:1 on
`--s1`, so it passes AA for body text let alone display sizes.

The highlight inverted with them: `.lit` marks one trailing phrase in
`--strong` against an orange heading, rather than an orange gradient against a
white one. Still the `h1` and the closing CTA only.

**Eyebrows are plain tracked capitals, not pills.** Same pass, same request.
`Bento`'s `.pill` class now renders the ported `.eyebrow` treatment — Outfit
600 at 14px, `.16em` tracking, uppercase, `--strong`, no border and no ground.
The class keeps the name because every page and component already passes
through it. The rule that led the Home hero eyebrow went with the pills.

**The shape.** A left-aligned hero (pill, h1, lead, actions, stat row) with a
wide showcase board beneath it; a centred pill row for in-page navigation; then
full-bleed sections alternating plain `--s1` against raised `--s2`, each with a
centred head and a twelve-column bento grid; then a split FAQ with the heading
sticky on the left; then a full-bleed CTA with both washes meeting under it.

**Components.** `Bento` (layer, section, head, pill, grid, card, checks, row,
steps), `PageHero`, `PageCta`, `FaqSection` + `Faq`, `SectionNav` as a pill
row, `SpecBoard`, `PipelineBoard`, `AuditLog`, `ScopeRings`,
`RecordConvergence`. Page-specific blocks stay in each route's own module.

Two of the shared components were removed on 2026-09-10, on request, and
deleted rather than left unused. `DraftBanner` was the on-page "[draft — needs
review]" strip; the copy is still draft and the marker survives in each route's
meta description and in the content files, which is where the tracking belongs.
`SectionNav` was the centred pill row of in-page jump links that sat under the
hero on `/platform`, `/trust`, `/investigation` and all four verticals, along
with the `SECTIONS` table in each page and the `useRovingFocus` hook it was the
last caller of. The section `id`s stay: they are what `tests/test-cp6.mjs`
asserts the block order against, and the hero actions still link to them.

**No tabs and no carousels.** Both were built for the rail layout and both were
removed here. A tab strip hides three quarters of a section in a screenshot and
a carousel hides the cards past the fold, and the static-frame criterion below
asks the opposite of that. Everything is a grid that reads complete standing
still.

**Washes are plain radial gradients on a static layer.** No `filter`, no
`blur`, no animation. A blurred layer is the most expensive way to draw a soft
edge and compositing cost is exactly what the open performance item below is
about.

**No canvas scene in a bento hero.** The four vertical heroes carried the
`worlds` point-cloud field. It was removed on 2026-09-09: it ran under the
headline and the lead, and a field drawn behind words is not a background. A
scrim was tried first and was not enough. Every bento hero now emits
`data-scene="none"` and `#stage` paints nothing on those routes, which per the
canvas section below is a per-page decision and not a defect. Each vertical's
own point-cloud form is still shown, as the static signature graphic in block 4.
`tests/test-cp12.mjs` section 5 now checks Home alone, for that reason.

**`#hero` is an ID in the ported sheet.** It is styled as the full-viewport
framed card — `min-height: 100svh`, flex column, and above 1024px margined in
by `--hero-side`. `#hero h1`, `#hero .lead`, `#hero .eyebrow` and `#hero .inner`
are styled too. A CSS Module class cannot override any of it, and Next's CSS
Modules hash ids as well as classes, so writing `#hero` inside a module renames
it. The id is kept (the section order on a vertical page is asserted against
it), so the overrides are written `:global(#hero).hero` and
`:global(#hero) .title`. See `PageHero.module.css`.

**`/public-safety` is forked off the vertical template.** It was the first route
onto this layout, and converting `VerticalPage` would have moved `/governance`,
`/brands` and `/celebrity` before any of them had been reviewed. All four now
render the same nine blocks in the same order to the same depth — that is the
table above, and `tests/test-cp6.mjs` asserts it against `DEPTH` for all four
routes — so the two paths can collapse whenever someone wants to.

**`/platform` was rebuilt on 2026-09-10** to a twelve-block brief, still on
this layout: the core idea and a signal-path board, five
intelligence layers as alternating rows, the detect-to-act
sequence, the context web, the alert, the missions, the chain, security, then
the CTA. The languages block was removed on request; its limitation statement
moved to the FAQ. The page-specific visuals live in `app/platform/blocks.js`
and none of them animate. **Every hero column is aligned to the header.** `PageHero`'s `.inner` and the
ported `#hero .inner` both carry the header's own geometry — `max-width:1600px`
centred with `clamp(18px, 3vw, 44px)` of padding inside it, dropping to a flat
14px below 560px, which is exactly what the `nav` rule uses. The headline
therefore starts on the same vertical as the logo above it, on every route and
at every width; measured at 1920, 1600, 1280, 900 and 420 across Home,
`/platform`, `/investigation`, `/trust` and `/public-safety`. The hero's own
horizontal padding is zero for the same reason: the padding lives on the column
so the two can share one pair of values.

**Copy that pair, not a number**, if another block ever has to line up with the
header. And watch the cascade: the mobile override has to sit *after* the base
`#hero .inner` rule in the global sheet, not inside an earlier `max-width:560`
block — same specificity, so the later declaration wins whatever the media
query says. That cost a round trip. A hero that carries a backdrop also has a floor of
`min(88vh, 880px)` and centres its column vertically, so those two read as the
same object. It was written as a bare `.withBackdrop`
class at first and did nothing: this module's own `:global(#hero).hero` sets
`min-height: 0` to undo the ported full-viewport card, and an id plus a class
beats a lone class. Every backdrop hero was simply as tall as its own copy —
543px on `/investigation` against 707px on `/platform`. The rule is
`:global(#hero).withBackdrop` now. The same trap applies to anything else this
module adds; see the ID-selector note near the top of this file.

**`/investigation`'s hero carries a supplied backdrop** from 2026-09-10: an
investigation graph of accounts, identifiers, locations and images radiating
from one node, through the same `backdrop` prop on `PageHero` that `/platform`
uses. Worth a second look before launch: it contains two thumbnails of a
blurred street scene with people in it. At render size they are about 30px and
read as evidence items in a graph rather than as photography of a crowd, which
is what the "no stock photography of crowds" rule is aimed at — but the rule is
close enough that someone should agree with that reading.

**`/trust`'s hero carries a supplied backdrop** from 2026-09-11, on the same
`backdrop` prop: a dark corridor, one lit doorway, a shield on the wall. It
also takes `backdropPos="92% center"`, because the render is 2:1 and the hero
is not, so `cover` crops the sides — centred, the shield lost its right edge
and at 1200px it lost half of itself. Holding the crop to the right keeps both
the doorway and the shield whole and spends the crop on the empty left wall,
which sits under the opaque part of the scrim anyway. **Check a new backdrop at
1200 as well as at 1600**; the two crop very differently, and the scrim widens
at 1200 as well.

That hero's copy changed with it, to supplied copy, and the **deployment sheet
that used to be its showcase moved down into the deployment section** rather
than being deleted. A board and a photograph in one hero are two objects
competing for the same width. The rule generalises: a hero taking a backdrop
gives up its showcase, and the showcase goes to the section it describes.

The render has two blocks of text baked into it — a slogan on the left wall and
the words `PEOPLE · DATA · ACCESS · EVIDENCE` on the right pillar. Neither is a
claim, and all four nouns are real sections on the page, so nothing exists only
inside the picture. It is still marketing language that no sweep can read; see
`copy/APPROVALS.md` item 10, which also carries the contrast figures measured
at 760px, the narrowest width that still draws it.

**`/trust`'s deployment section was rebuilt to supplied copy on 2026-09-11**:
three models a department picks between — on-premise, cloud, hybrid — each card
an index and a name, a one-line answer, the detail, then the reader it is for
pinned to the card foot with `margin-top: auto` so the three "best for" lines
sit on one baseline whatever the bodies run to. No card is lit: `lit` marks one
card in a grid, and these three are alternatives, so lighting the first would
read as a recommendation nobody has made.

**Its 01/02/03 indices are the client's and this brief rules them out.** A
department picks one of the three; it does not pass through them, so the run is
not a sequence, which is the test the "no numbered indices" rule sets. Raised
and overruled, kept as supplied, recorded here and in the content file. Unlike
the tabs on `/investigation`, nothing about this one needs a mitigation — an
index that implies an order that is not there costs a reader very little.

Each card leads with a **line glyph in an accent tile** — a building, a cloud,
a cloud over a rack — the treatment the security section on `/platform`
already uses. Three cards of prose are hard to scan and a shape is found before
a word is read. They are drawn inline, stroked in `currentColor`, and
decorative: the model's name is stated in text beside each one. The tile ground
is a flat fill rather than a glow, for the compositing reason recorded against
the washes above. `Card` gained an additive `className` prop for this, so the
page's module could set the padding without rebuilding the cell; no other
caller passes it.

**The deployment sheet and the section's closing note were removed the same
day, on request, and nothing replaced them.** The sheet was the `SpecBoard` of
hosting, residency, retention, network and audit export; the note carried the
two boundary statements the supplied copy had dropped. Those sentences are now
on no page on the site. They are quoted verbatim in `copy/APPROVALS.md` item 2
so the wording survives, and one of them — that every line of the sheet is
confirmed in the deployment agreement rather than fixed by the product — is
worth arguing back on, because without it the three model cards read as a
product specification rather than as a contract term. Raised and overruled; the
removal was explicit. `SpecBoard` itself stays: `/public-safety` still uses it.

**`/trust`'s access-control section was rebuilt to a supplied reference on
2026-09-11**: an eyebrow over a short accent rule, a heading, three
principle cards — role, scope, action — each with a two-stroke schematic beside
its copy, and a capability strip closing the block. Every card carries an
accent line along its top edge, drawn with `::after`; Bento's `.card` already
uses `::before` for its top sheen and its `::after` belongs to `.cardLit`,
which is free only because none of these three is lit. Light one and the two
rules collide.

**Its heading went through two replacements the same day.** The reference's
two-tone "Give every user the access / they need. And nothing they don't." went
first, on request, taking the `lit` with it — which returns the page to one
highlight, the `h1`, as the rule above asks. "Structured for every level of
operation." followed and did not survive review: it would describe any product
with an admin screen, which is the test the content rules set. The heading is
now "Bounded by role, and by scope.", which names the two mechanisms the three
cards below it describe.

**`/trust`'s audit-trail section was rebuilt to a supplied reference on
2026-09-11**: the heading with a four-word slogan on a rule beside it, a record
panel, three cards, and a strip of four qualities. The cards are the
access-control cards with the mark on the left of the copy instead of the right
— same parts, opposite arrangement, which is what that reference draws. The
slogan is decoration and is not drawn below 1200px, where there is no column
beside the heading to put it in.

**The record panel is real HTML.** A real `table` with real headers, not the
picture the reference draws: a label inside an image cannot be read aloud,
found by search, translated or reflowed, and this brief rules out content that
exists only in a graphic layer. Five columns cannot be made to fit a phone and
stay a table, so the table scrolls on its own axis and the page never does. The
`td` holding the event name is a table cell with a flex span inside it — set
`display: flex` on the cell itself and the column stops aligning with its
header. The table is `border-collapse: separate` so the highlighted row can
carry a rounded outline; a collapsed table ignores `border-radius` on cells.

**Its rows are invented and it says so on its own header.** Five timestamps,
role names and three reference identifiers, where the build it replaced drew
redaction bars for exactly that reason. Two things keep it from being the
console mock again and neither may be removed without the rows going too: the
panel carries `data-mock="audit-record"`, which `tests/test-sweep.mjs` strips
before reading the page's prose — take the attribute away and every timestamp
is reported as an unapproved number — and a second sweep check asserts the
panel still says "illustrative records". See `copy/APPROVALS.md` item 0b, which
also records that the header says "Live record" beside that tag, which is the
one thing in the reference that contradicts itself.

**The heading brings `lit` back**, so the page again has two highlights where
the rule above asks for one. The reference draws it two-tone and that was the
request.

Three statements the supplied copy dropped are quoted verbatim in APPROVALS
item 1, and one — read-logging — could not be dropped at all: the reference
asserts it *inside the mock*, as a highlighted READ row reading "Intelligence
record accessed". A claim drawn as a picture is what item 0 exists to catch, so
its marker moved onto card 01, whose "data access" is the same claim in text.
The section also gained "tamper-protection mechanisms", which is not a banned
phrase and sits next to one; it is marked.

**The schematics are two strokes and nothing else.** The accent marks the
subject of the card — the person the role belongs to, the boundary the scope
draws, the record the action lands in — and a flat neutral marks everything it
sits among. That pairing is the drawing; no path carries a colour of its own.
Below 560px the art moves above the copy, because a drawing beside a paragraph
in a phone column leaves a measure of about a dozen characters.

**The three named roles were removed the same day, on request**, along with the
two permission cards under them and the `ScopeRings` component, which had no
other caller and was deleted rather than left unused. Their spans — what each
role reaches and what it cannot — are quoted verbatim in `copy/APPROVALS.md`
item 3, because that containment is the thing a security reviewer checks and it
is now on no page. The names themselves survive on `/public-safety` and
`/governance`, marked.

**The hero still reads "Three scoped roles."** With the block gone the page
states a count it never explains, and the supplied copy that remains sits a
level more general than the register this brief asks for: "the right
organisational and operational boundaries" would describe any product with an
admin screen. Either the stat changes or the spans come back. Raised, and the
removal was explicit.

Of the four controls on the strip, three are already published elsewhere and
one, **privileged access review, is asserted nowhere else on the site** and is
marked. Its marker renders under the control's name in lower case rather than
inside the tracked capitals: a caps-and-brackets marker reads louder than the
control it qualifies, and a marker's job is to be honest, not loud.

**Every closing call to action carries a photographic backdrop** from
2026-09-10: a supplied render behind `PageCta` on the seven routes that use it,
and behind Home's ported `.sec#final` through the `ctaShot` classes in the
global sheet. Two decorative layers, the pattern the Home hero already uses —
the picture, then a scrim opaque top and bottom and thinnest across the middle,
so the headline is read against near-black. Dimmed 0.90/0.89 in the shipped
WebP rather than by a CSS `filter`, hidden below 720px and in print. It carries
four source labels, two of which are coverage claims made nowhere else on the
site; see `copy/APPROVALS.md`. The still SVG network that used to sit behind
`/platform`'s CTA was removed with it.

**The security section was rebuilt to a supplied reference on 2026-09-10**:
six controls in a grid, each an icon tile beside its own sentence, over a
centred link to `/trust`; the shield-and-ring layout it replaced is gone. Three
of its tiles carried inline `[pending sign-off]` markers and the reference
draws them without — two are now unproblematic because the copy no longer names
a cipher or a protocol version, and two (the role structure, the deployment
siting) are asserted with nothing on the page marking them. See
`copy/APPROVALS.md`.

**The "in operation" section was rebuilt to a supplied reference on
2026-09-10**: seven ringed stations on one line, each with the step's name and
what happens there, and the sentence "SAGA supports the decision — it does not
make it" on its own rule beneath. It is the first user of two more opt-in
options on `Head` — `rule` (a short accent rule under the eyebrow) and `flip`
(heading white, highlight orange, the inverse of the sitewide pairing). Both
exist because that reference draws them; neither changes any other head.

Two of the brief's blocks were removed on request: the console board, which
duplicated the console showcase on Home, and the missions block ("one platform,
different intelligence missions"), which was not wanted. Removing a section
breaks the plain/raised ground alternation from that point down, so it is
re-derived each time. Three claims in the brief could not be
published as written — the source lists, the alert figures, and the cipher and
protocol names — and are marked rather than invented; see `copy/APPROVALS.md`
item 6b.
The intelligence layers were rebuilt to an approved reference on 2026-09-10:
five equal-height cards with the illustration alternating side to side, a
numeral, a kicker, a short headline, one paragraph and a link on. The height is
fixed with `grid-auto-rows` so five paragraphs of different lengths do not
produce five card sizes. Each card carries a hover and focus state — an
accent border, a slight scale on the art and a sliding arrow. That is
interaction feedback, not the per-section fade-up this brief rules out: every
card is complete standing still and the art's scale stops under
`prefers-reduced-motion`. The hover *lift* was dropped on 2026-09-10: a
transform makes a sticky element its own containing block and it stops
sticking.

**The five cards are a sticky stack**, added 2026-09-10 on request, the same
behaviour as the pillars on Home: each card pins one 15px strip lower than the
last, so the ones already read stay as a pile of edges behind the current card,
with a 46vh runway between them. Below 960px they go back into normal flow —
there is no room to stack a card that is already a full-width column.

Sticky alone pinned the cards but could not say *how covered* a pinned card
is, and without that the run read as five panels sliding over each other.
`LayerStack` (`app/platform/LayerStack.js`) writes an eased 0–1 `--cover` per
card from how far the next card has risen over it; the stylesheet uses it to
sink the covered card behind a flat scrim and scale it 5.5% towards its own
pinned top edge, so it recedes into the pile. One rAF-coalesced scroll handler
for the whole stack, paused by an `IntersectionObserver` when the section is
off screen, and no scrim or scale at all under `prefers-reduced-motion` — a
frozen half-covered card is not an honest static state.

A transform does **not** stop a sticky element sticking; that was measured, not
assumed. The hover lift is still gone because a card pinned to the top of the
window that jumps under the pointer reads as a glitch.

**Card five's runway is `padding-bottom` on the list, not `margin-bottom` on
the card.** A last child's bottom margin collapses out of a parent with no
padding or border, so the first attempt did not extend the list at all: card
five unpinned at the old boundary and the runway became empty ground under it.
Padding cannot collapse, and a sticky element is held by its parent's padding
box.

**It is still a second sticky stack on the site**, and the open performance
item below found sticky-layer compositing to be the largest single cost on
Home — this belongs in the same re-measurement on real hardware. All five cards carry supplied illustrations from
`public/images/layers/` — 01 to 04 on 2026-09-10 and 05 later the same day. The
`art: null` fallback to a built-in schematic is kept for the next layer, or a
replaced image. The globe on card 04 is **cropped**: it arrived with a panel column
naming five real cities and giving each a risk state, which is an unapproved
finding about a real place published as a picture — the same defect class as
the console mock. See `copy/APPROVALS.md` item 6b and the README in that image
folder, which also records the PNG-original-outside-`public`, ship-WebP rule
the hero already follows.

**The delivery section was rebuilt to a supplied render on 2026-09-10.** The
alert card, the "what the alert contains" run and the rule under both follow
the render's layout. The card reproduces the render in HTML — shipped
as the cropped image first and redrawn because a raster card goes soft the
moment anyone zooms and cannot reflow on a phone. **It states a risk level, a
confidence figure and four counts that nobody has approved**, published on the
client's repeated instruction; see the BLOCKER at the top of
`copy/APPROVALS.md` item 6b, which is where this gets resolved before launch.
The figures are listed in `tests/test-sweep.mjs`'s allowlist against that
blocker, so the sweep still catches any other unapproved number. The
"illustrative, every figure is a placeholder" caption under the card was
removed on request the same day — the blocker is what keeps this open now, not
a line on the page. The card and the list beside it stretch to the same height,
with the action button pinned to the card's foot.

**The record section was rebuilt to a supplied render on 2026-09-10.** Only
two parts of that render ship: the globe cut out of its middle, and the wave
artwork from its far left and right, masked on both axes so it fades instead of
ending on a straight edge. The ten context types around it are **real HTML**,
not the pills baked into the render — a label inside a picture cannot be read
aloud, found by search, translated or reflowed onto a phone, and this brief
rules out content that exists only in a graphic layer. The original render is
`images/platform-record.png`, so any part of it can be re-cut. The block is
`RecordWeb` in `app/platform/blocks.js`; it flanks the globe with two columns
above 900px, stacks globe-then-two-columns below that, and goes to one column
below 640px. It is **full-bleed**: the block breaks out to the window width so
the artwork reaches both edges, with an inner grid holding the cards to a
readable measure. Held to the section's own measure the artwork ended on a
straight vertical edge, which read as a picture pasted into the page. The
break-out uses `width: 100vw` with `margin-left: calc(50% - 50vw)` and
`overflow: clip`; document `scrollWidth` was checked against `clientWidth` at
1600, 1280, 900 and 420 to confirm it adds no horizontal scrollbar.

The "How SAGA thinks" block was reworked to an approved reference the same day:
four icon-headed stage cards whose lists name source classes rather than
platforms, so that one needs no marker at all. It is the first user of two
additive options on the shared components — `Section wide` (1440px instead of
the 1240px page rhythm, for a block that is a wide object rather than a column
of prose) and `Head wide` (a wider measure, and a wider lead under it, for a head
that carries a full sentence rather than a three-word label). Both are opt-in; no other page moved.
The hero there uses the `backdrop` variant of `PageHero`, added 2026-09-10:
a supplied panorama across the whole hero with the copy over it, scrimmed to
flat black down the copy column so the contrast figures still hold, and hidden
below 720px where a panorama is a smear. The shipped file is dimmed — 0.85
brightness, 0.80 contrast — because the render as supplied competed with the
headline. **Baked into the WebP, not applied as a CSS `filter`**: a filter puts
the whole hero on its own composited layer on every scroll frame, which is the
cost the open performance item below is about, and it does not survive print.
The untouched original is in `images/platform-backdrop.png`, so the grade can
be redone from source. It replaced the split variant (copy
left, a photograph in the second column) that stood for a few hours; `media`
and the `.split` rules are kept in the component, unused, because the next hero
that wants an object beside the copy rather than behind it will want them.

**`HeroFrame` no longer exists.** It was Home-only after this pass, and Home's
frame was removed on 2026-09-09; the component and its stylesheet went with it.

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

**No route declares a scene any more.** The four vertical heroes dropped the
`worlds` field on 2026-09-09 and Home dropped the `hero` field the same day,
replaced by a photographic background. `#stage` still mounts and still paints
nothing, so the engine, `worlds.js` and the scene code are now shipped to every
visitor and used by nobody — worth removing, not yet removed. The globe in the
pillars stack is a separate renderer and is still live.
`tests/test-cp12.mjs` section 5 asserts the removal holds, so a scene coming
back by accident fails the suite.

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

Two departures from the criteria below are deliberate under the bento layout and
were taken with it: blocks are separated by alternating full-bleed grounds
rather than by a ground change inside a column, and eyebrows are plain tracked
capitals sitewide rather than pills — see the heading and eyebrow note above,
which supersedes "eyebrow pills on section headers" in the shape list below.

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

1. `/public-safety` — done 2026-09-08, then rebuilt on the bento layout
   2026-09-09 (see above); it no longer renders `VerticalPage`
2. `/governance`
3. `/trust` — done 2026-09-09 on the bento layout. It was moved up because it is
   the page a procurement committee opens first, and its lawful-basis section is
   the densest prose on the site; that section is still carried in full
4. `/brands`, `/celebrity`
5. Home — after the verticals. It carries the pillars sticky-stack and the console
   showcase, the most fragile pieces on the site, and is best attempted once the
   pattern is settled across four pages
6. `/platform` and `/investigation` — done 2026-09-09 on the bento layout, out of
   order: the whole site except Home moved to it in one pass, so the ordering
   this list describes was overtaken. It is kept as the record of why each page
   was reached when it was
7. `/contact`

The layout is opt-in per page (`dense: true` in the vertical content files, or the
page's own module) so a shared template never changes under a page that has not been
reviewed. When every route is converted the dual code paths collapse.

The bento layout supersedes `dense` rather than extending it: it carries its own
type scale and its own block vocabulary and sets no `dense` wrapper. Every route
except Home is now on it, so the `dense` flags in the content files no longer
drive any layout — they are left in place because they still record which pages
have been through the density *pass*, which is a copy question and not a layout
one.

**Not to be touched by this pass:** the limitation statements on `/investigation` earn
credibility and stay — reformatted into the Takes / Returns / Limits card structure, not
cut.

**The "working the record" section was rebuilt on 2026-09-11** with supplied
copy and renamed "investigation context": three fixed cards — one investigative
record, trace every finding, ready for investigation — in the same card
language as the tools above them, so the page reads as one object. The indices
are the client's and the run is a progression, which is the test this brief
sets for numbering.

Two statements the old copy carried did not survive into the new copy, and both
are ones this brief protects. Every check being recorded with the identifier,
the tool, the user and the time is in the FAQ, with its
`[pending sign-off: read-logging]` marker. Timestamped capture with metadata
alongside an immutable audit trail — the phrasing the no-legal-claims rule
requires — is a FAQ entry now too. **This page's FAQ is load-bearing.** It
carries the boundary statements from three separate rebuilds; trimming it
silently deletes the reason a government buyer trusts the page.

The supplied copy sits a level more general than the mechanism register this
brief asks for: "structured intelligence for investigation, review and
reporting" would describe most tools in this market. Published as supplied. The
specificity on this page is carried by the tools section above it.

**A second exception, same day, same page.** The tools section — the Takes /
Returns / Limits cards — was replaced with a supplied twelve-tool catalogue in
three categories: OSINT, deepfake, global search. Its five limitation
statements went into the FAQ, which now carries all of them, and
`copy/APPROVALS.md` item 6c records which sentence landed where. Same standing
condition as the Blura SAGA AI assistance one: if that FAQ is trimmed, the cards take them back.

The supplied reference draws that section as a tab strip over a card carousel,
and **both were built**, on the client's repeated instruction. This layer's own
rule says otherwise — "no tabs and no carousels", because a tab strip hides
three quarters of a section in a screenshot and a carousel hides the cards past
the fold, which is the opposite of the static-frame criterion. The objection was
raised and overruled. It is recorded here and in `ToolExplorer.js` so the next
person does not have to rediscover it, and so the exception stays an exception:
this is the only tabbed section on the site.

Three things keep it from costing what the rule was written to prevent, and none
of them may be removed without a replacement:

- every card of every category is in the exported HTML. An inactive panel is
  `hidden`, not unbuilt, so nothing exists only inside an interaction;
- a `<noscript>` block in the page reveals all three panels, so a reader without
  JavaScript gets the whole catalogue as a plain stack. `tests/test-cp12.mjs`
  section 6 measures the page with script execution disabled and reports 960
  words and zero hidden nodes, which is what that rule is for;
- the track is a real scroll container holding all its cards, so a card past
  the fold is still laid out, still focusable and still reachable by a swipe —
  not only by the arrow buttons.

The tabs follow the ARIA tabs pattern: one stop in the page tab order, arrow
keys between tabs, Home and End to the ends, and the selected tab carries a
white name as well as the accent border, because colour alone is not a state
under the accessibility rules above.

The cards sit on four **fixed-width** columns, not four fluid ones, and carry a
**fixed height** rather than a minimum, so a card is exactly the same object
whichever category is showing and whatever its body runs to; that equality was
asked for. Anything past the fourth is scrolled to. Four across stops at 1340px
rather than at the usual 1080: below that a quarter of the row is about 260px
and the longest body on the page needs a taller card than the rest of the set,
which would break the fixed height. Two across from there, one below 640px where
the height goes back to automatic. No card carries a resting highlight: the
reference lights the first card of each category and that was dropped on
request, so the accent border and glow belong to hover and keyboard focus
alone — the only states a reader can act on. The faint border tint they
replaced was not a state anyone could see. The cards carry **no index numerals**: they were
dropped on request, and this brief rules them out anyway on content that is not
a genuine sequence — a catalogue of tools is not one. The arrows,
dots and counter are drawn **only when the track actually overflows** — OSINT
and deepfake fit, so they get none, and a disabled arrow beside a row that
cannot scroll is a control that lies about what it does. The dot count and the
counter's denominator come from the reachable scroll positions rather than from
the card count, which is why seven global-search cards read `01 / 04` and not
`01 / 07`: position four is the last one the track can reach.

**One exception, taken on request 2026-09-10.** The Blura SAGA AI assistance section was
replaced with supplied copy — "how Blura SAGA investigates", three stages:
find, connect, build. Its three boundary statements did not survive into the
new copy: that it queries collected records rather than the open internet, that
a question outside scope returns nothing rather than reaching for it, and that
a query is an event in the audit trail. **All three are still on the page**, in
the FAQ, including the `[pending sign-off: read-logging]` marker, which is
APPROVALS item 1 and the most load-bearing sentence on this page for a
government buyer. If that FAQ is ever trimmed, the section copy has to take
them back. The Takes / Returns / Limits cards below are untouched. The lawful-basis section on `/trust` stays in full and gets the bold-lead-in
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
- Do not use stock photography of control rooms, police officers, protests or
  crowds. The Home hero photograph added 2026-09-09 is a person at a
  workstation and is none of those; it was supplied by the client and is
  recorded as item 9 in `copy/APPROVALS.md`. The rule is unchanged.
- Do not add per-section fade-up animations. Motion should explain something — the
  pipeline, the sequence, the convergence — or not exist.
- Do not restore numbered indices (01/02/03) on content that is not a genuine sequence.
