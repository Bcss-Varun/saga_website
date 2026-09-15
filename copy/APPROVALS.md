# Approvals needed before launch

Everything marked `[pending sign-off]` in page copy, in priority order.
Nothing here may be published as written until the owner named against it
confirms the value. Where a claim cannot be confirmed, the sentence comes out —
it is not softened.

---

## 1. Read-logging on the audit trail — `/trust`

> "The trail records reads as well as writes: looking at a person-of-interest
> record is an event, not a silent action."

**Owner: engineering.** The deck lists an audit trail; that is not the same
claim. Every system logs writes. Logging *views* is a specific architectural
decision and it is the first thing a technical evaluator will test. If
read-logging is not implemented, **the sentence is removed** rather than
qualified.

This is the single most load-bearing sentence on `/trust` for a government
buyer, which is why it is first.

**The audit section was rebuilt to a supplied reference on 2026-09-11** and the
sentence above is no longer on the page in that form. The claim is, on card 01
— "Alerts, queries, actions and data access are recorded with timestamps" —
which carries the marker. It is also asserted **inside the record panel**, as a
highlighted READ row reading "Intelligence record accessed", and a claim drawn
as a picture is the thing item 0 exists to catch. That is why the marker had to
land in text rather than being dropped with the sentence.

Three other statements the old copy carried did not survive into the supplied
copy, and this page has no FAQ to move them to. Recorded verbatim:

> **What is recorded.** Every search, export, verdict request, case action,
> permission change and revocation — written to an immutable audit trail
> carrying the user, the timestamp and the record touched.
>
> **Captured material.** Stored with its original metadata and its capture
> time, retained alongside the original file. An investigator can show what was
> collected, when, by whom, and what state it was in at collection —
> evidence-grade workflows.
>
> **Retention.** Audit records are retained for the period set in the
> deployment agreement [pending sign-off: retention period] and can be exported
> for internal review or inspection.

The first two are the phrasing the no-legal-claims rule asks for, in place of
"court-admissible" or "tamper-proof". Losing them and gaining
"tamper-protection mechanisms" in their place moves this page in the wrong
direction on exactly the rule that matters most here.

**Tamper-protection mechanisms** — `/trust`, card 02. New with the same
rebuild. Not a banned phrase, and adjacent to one: nothing behind it says what
the mechanism is, and "immutable logging" beside it is already the approved
wording on its own. Marked on the page. If it cannot be specified, the clause
goes and the sentence keeps the half that is approved.

---

## 2. Deployment model — `/trust`, `/public-safety`, `/governance`

- The deployment sentence itself. **Supplied copy of 2026-09-11 names three
  models — on-premise, cloud, hybrid — where the previous copy carried
  on-premise, private cloud, department-hosted.** Supplied copy is not sign-off
  under the rule at the foot of this file, so this stays open; what changed is
  which three names are waiting on it. The `/trust` deployment sheet was moved
  to match. The marker sits once, on the section lead, rather than on each of
  the three cards: one marker covers a claim the three make jointly, and three
  would read as three separate doubts.
- Supported topologies for a deployment inside a department's own network
  boundary.
- Update and support arrangements for an isolated deployment.

**Removed from the page on 2026-09-11, on request.** The deployment sheet and
the section's closing note were both taken off `/trust` with the card rebuild.
Nothing replaced them, so these sentences are now on no page on the site. They
are recorded here verbatim because two of them are boundary statements a
security reviewer reads this section for, and because this page has no FAQ,
which is where such statements live everywhere else:

> Where a department requires the system to run inside its own network
> boundary, it does [pending sign-off: confirm supported topologies]. Support
> for an isolated deployment is agreed at contract [pending sign-off].

And the deployment sheet, five rows and a footnote:

> hosting — On-premise · cloud · hybrid
> data residency — Set per deployment
> retention — Deployment agreement
> network — Inside your own boundary
> audit export — Internal review or inspection
> Every line above is confirmed in the deployment agreement rather than fixed
> by the product.

The last of those is the one worth arguing back onto the page: it is the
sentence that stops the three model cards reading as a product specification
rather than as a contract term. Raised and overruled; the removal was
explicit.
- Hosting location, data residency, retention periods.
- Audit-record retention period.
- Contractual terms: data protection, processor/controller responsibilities.

## 3. Role names and spans — `/trust`, all verticals

Super Admin / Level-2 / Level-1 — both the **labels** and the **exact span** of
each. Currently described from the product mock, not from a specification.

**Privileged access review** — `/trust`, added with the access-control rebuild
of 2026-09-11 from supplied copy. It is asserted nowhere else on the site and
nothing behind it says who reviews privileged accounts, on what cycle, or what
a review produces. Marked on the page.

The other three controls on that strip are not marked, because each is already
published elsewhere and this states nothing new: role-based access and
multi-factor sign-in are both on `/platform`'s security section, and session
logging is the read-logging claim that item 1 above holds — the card above it
carries that marker.

**The three roles were removed from `/trust` on 2026-09-11, on request**, with
the two permission cards that sat under them. The names survive on
`/public-safety` and `/governance`, both marked `[pending sign-off: role
names]`. What is now on no page is the **span** of each role — what it reaches
and what it cannot — which is the containment a security reviewer checks.
Recorded verbatim:

> **Super Admin — full deployment.** Creates the accounts and sets the
> boundaries. Creates and removes accounts, assigns roles, and sets the
> geography or subject each role is scoped to. Sets which pages and features a
> role may reach. Holds the only view of the full deployment [pending sign-off:
> exact span].
>
> **Level-2 — assigned scope.** Works across a scope, and assigns inside it.
> Works across an assigned scope — multiple districts, watchlists or subjects —
> and assigns work to Level-1 inside it. Cannot widen its own scope [pending
> sign-off: exact span].
>
> **Level-1 — single scope.** Works inside a single assigned scope: the alerts,
> cases and grievances routed to it. Cannot see records outside it, including
> those belonging to peers [pending sign-off: exact span].
>
> **Page and feature-level permissions.** Set per page and per feature, not
> only per role — a role can be granted a page while being denied export or a
> verdict request on it. Two users holding the same role can therefore have
> different reach, set deliberately rather than by exception.
>
> **One-click revoke.** Revoked in a single action, taking effect for sessions
> already open rather than at next sign-in. Revocation is itself an audited
> event: who revoked, when, and which account.

**The `/trust` hero still reads "Three scoped roles."** With the block gone the
page states a count it never explains. Either the stat changes or the spans
come back; leaving both as they are is the one combination that does not work.
Raised, and the removal was explicit.

## 4. Alert tier labels — `/public-safety`

"Critical, High, Medium or Low". The deck says four-tier without naming them;
these labels are inferred from the dashboard chips plus the phrase "critical
alert". Escalation intervals are also unconfirmed.

## 5. Client descriptors — `/trust`

- A state police force
- A state Home Ministry
- A national government in West Africa

Each is marked because an unnamed descriptor still asserts that a deployment of
that kind exists. No client is named anywhere on the site.

## 5b. Tool coverage and language support

- `/investigation` — sources and coverage by tool. Narrower once: it read
  "sources and coverage for email and phone intelligence" until the tool
  catalogue of 2026-09-10 broadened the marker to the whole catalogue, and this
  entry was not moved with it. Corrected 2026-09-11; the sweep had been
  reporting it untracked since.
- `/platform`, `/investigation` — which languages beyond English, Telugu, Hindi
  and Urdu are supported, and confirmation that unsupported languages are
  collected but not scored.
- `/platform` — the default source-credibility weighting scheme.
- `/contact` — retention period for enquiry data, quoted in the consent text.
- `/trust` — supported topologies for a deployment inside a department's own
  network boundary, and which deployment models are offered. The wording is
  now on-premise, cloud, hybrid; see item 2.
- Sitewide — the production domain, needed before canonical and Open Graph URLs
  can be emitted. They are currently omitted rather than pointed at a guess.

## 6c. Investigation tool catalogue — `/investigation`

Added 2026-09-10, with the section rebuild. Twelve tools in three categories,
from supplied copy. Nothing on the cards states a count, an accuracy figure or a
platform name, so none of them carries an inline marker — but three need an
owner's eye before launch.

- **The tool list itself.** Twelve named tools is a product-scope claim: it says
  these exist and are available in a deployment. Confirm the list is current and
  that every tool ships, particularly SAGA AI Assistance, the exclusion engine
  and grievance management.
- **Legal Mapping Engine.** The card says SAGA maps content to defined legal
  categories and indicators, names hate speech as an example, and states that
  the determination remains the department's. It deliberately does not say SAGA
  finds content criminal. Confirm the wording and which category set is mapped
  against — a named statute section on the page would be a legal claim and is
  not published.
- **Sentiment Analysis.** Positive, neutral and negative classification "across
  the sources a deployment monitors". That is a source class, not the coverage
  list held open at item 7, and it is written that way on purpose. Confirm the
  three-way classification is the actual output.

**The section is tabbed.** Only one category is on screen at a time, so a
screenshot of this section shows a third of the catalogue. That is a
presentation decision taken on instruction, not a claims one, and it changes
nothing about what is asserted — every card is in the exported HTML and a reader
without JavaScript sees all three categories. Noted here because a reviewer
working from a PDF of the page will not see the other two categories unless they
are told to click.

**Displaced limitation statements, second pass (2026-09-11).** The "working the
record" section was replaced by the investigation-context cards, and two more
statements moved into the FAQ rather than being cut: that every check is
recorded with the identifier, the tool, the user and the time, and that captured
material is held with its original metadata and capture time. The page's FAQ now
carries the boundary statements from three rebuilds. Trimming it deletes them.

**Displaced limitation statements.** The Takes / Returns / Limits cards this
section replaced carried five boundary statements that CLAUDE.md rules out of
any pass that would cut them. The new copy states none of them, so all five are
now in the page's FAQ: Needs Review is a real verdict, a handle match is a
string match, most platforms strip EXIF on upload, returns are uneven by
identifier and region, and search covers what collection retained rather than
the open internet. Two FAQ entries were added to carry the last two. **If that
FAQ is ever trimmed, the section copy has to take them back.**

## 6. Scored windows and thresholds — `/governance`, `/celebrity`

- Unrest score: the 0–100 range and five levels are stated in copy. Band labels
  unconfirmed.
- Endorsement-risk window: **six months** is stated in copy. Confirm it is the
  actual analysis period.
- Coordinated-activity attribution thresholds.
- Bot and troll attack scoring thresholds.

## 6b. Platform page rebuild — `/platform`

Added 2026-09-10 with the twelve-block rebuild of the page. Three claims the
brief asked for could not be published as written.

- **Encryption specifications.** The security block claims data encrypted at
  rest and in transit, and the brief named a cipher and a protocol version.
  Neither is stated anywhere else on this site, so the names are withheld and
  the two tiles carry `[pending sign-off: encryption specifications]`. Owner:
  engineering. If the specifications are confirmed, the names go in; if they
  are not, the tiles say only that the data is encrypted.

- **Console figures.** ~~The command-view board on `/platform`~~ — **removed
  2026-09-10.** The board duplicated the console showcase on Home, so the whole
  section came off the page. Nothing on `/platform` now draws a console and the
  marker is gone with it. Kept here because the rule it followed still binds
  the next such object: a board of that kind states no count, share or time,
  for the reason in item 0.

- **Scale in the hero headline.** The headline reads "From millions of digital
  signals to intelligence you can act on." *Millions* is a scale claim of the
  same family as the banned "100M+ conversations daily" — it has no owner and
  no date, and it is in the largest type on the page. It is published at the
  client's explicit request and recorded here rather than marked inline.
  **Owner: marketing.** Either confirm the wording or replace it; the sentence
  works without the quantity.

The alert card's figures — a signal count, a connected-account count, a
location count and a confidence figure — are all redaction bars for the reason
in item 0. The tier labels on it and on the escalation ladder are item 4.

**Update, 2026-09-10: the supplied layer artwork, and one crop.** Four
illustrations were supplied for the intelligence layers and are live on cards
01 to 04. Three went in untouched — their labels are category names ("Threat ·
suspicious activity detected", "Accounts · related entities identified") with
no figure and no real entity.

The fourth, the globe, arrived with a panel column beside it reading **New York
· increased activity**, **London · normal**, **Mumbai · elevated risk**,
**Singapore · normal**, **Sydney · unusual activity**. That is an unapproved
risk finding about five real cities, published as a picture, on a site selling
to the governments of some of them. It is the same defect as item 0 and a
sharper one: a fabricated figure invites doubt, a fabricated risk level about a
named city invites a phone call. **The panels are cropped out and only the
globe is used.** If the panels are wanted, the labels have to be anonymised the
way every scenario on this site is — "a state capital", "a metro district" —
and re-rendered. Nothing else about the image was altered.

### BLOCKER — the `/platform` delivery card publishes unapproved figures

The alert card on `/platform` reproduces the supplied render, published on
2026-09-10 at the client's explicit and repeated instruction and redrawn in
HTML the same day for sharpness. It states, in a picture of the product:

| shown | what it asserts |
|---|---|
| High Risk | a tier label, which item 4 records as unconfirmed |
| 87% | a confidence figure |
| 248 | a signal count |
| 18 / 6 / 3 | accounts, locations and narratives on one alert |

**None has an owner or a date.** It was first built the other way — rebuilt in
HTML to the render's layout with every value a redaction bar, which is the
treatment item 0 below established for exactly this case — and that was
replaced on request.

Two things follow, and both matter more than usual:

1. **The sweep now sees them, and is holding them open.** The card was
   shipped as the render's own image first, which made the figures pixels and
   invisible to `tests/test-sweep.mjs` — the same blind spot that let the
   console mock publish 2.45M and 98.60M for the whole build (item 0). It is
   redrawn in HTML now, for sharpness, and the figures are text again. They are
   listed in that test's `ALLOWED` set with a comment pointing back here, so
   the check still fails on any *other* unapproved number. **Delete them from
   that list the day this is resolved.**
2. **It needs sign-off or replacement before launch.** Either an owner confirms
   the six values with a date, or the card is re-rendered with them removed.
   The caption under it says the figures are placeholders, which mitigates and
   does not resolve.

The caption that said the figures were placeholders was removed from the page
on request on 2026-09-10. Nothing on the page now marks them as illustration.

**Owner: marketing, with product.**

**The closing call-to-action backdrop**, supplied 2026-09-10 and now on every
route's final section, carries four labels in the render: *social media*,
*news*, *public records* and *dark web*.

The first two are source classes the site already names. The other two are
**new coverage claims made nowhere else on this site**, in a picture, on the
last thing every visitor sees:

- *Public records* asserts SAGA reads them. `/investigation` describes identity
  and OSINT work but does not claim a public-records source.
- *Dark web* asserts dark-web collection. Nothing on the site claims it, and it
  is the kind of claim a law-enforcement buyer will ask to see demonstrated.

Both fall under item 7, the unresolved coverage list. Published on the client's
instruction; confirm them or have the render redone without those two labels.
**Owner: product.**

**The `/platform` security tiles lost their inline markers on 2026-09-10**,
with the section rebuild to a supplied reference. Three tiles carried
`[pending sign-off]` and the reference draws them without.

- *Data at rest* and *data in transit* are now fine either way. They read
  "enterprise-grade encryption standards" and "secure protocols", which name no
  cipher and no protocol version — the naming was the unapproved part, and
  encryption specifications are no longer claimed anywhere on the site.
- *Role-based access* still asserts three scoped roles with a per-feature
  layer, which is **item 3** above, and *deployment* still asserts siting
  inside a department's own boundary, which is **item 2**. Both are now
  asserted with nothing on the page saying they are unconfirmed. This file is
  the only thing holding them open.

**The `/platform` record render**, supplied 2026-09-10, ships only as two
crops: the globe from its centre and the wave artwork from its edges. Neither
carries a word. The render's own labelled pills are not published — the same
ten labels are HTML beside the globe instead — so nothing on that section is a
claim made inside a picture.

**The `/platform` hero backdrop**, supplied the same day, went in untouched.
Its six labels — real-time monitoring, narrative analysis, risk detection,
multi-source intelligence, actionable insights, safer communities — are
capability names with no figure, no platform and no real entity. The globe on
it carries lit points and no place labels, which is the difference between it
and the layer-04 render below.

Card 05's art followed the same day and went in untouched: its labels are
"narrative brief", "analyst report" and "export data" — output types, with no
figure and no entity.

**Update, same day: the source list no longer needs a marker.** The
"How SAGA thinks" block was reworked from five marked columns to four stages
whose lists name source *classes* — social media, news and media, online
communities, grievances — and no platform. A class is not a list, so there is
nothing pending to mark; the block's footer states in words that platforms,
languages and sources are configured per deployment. Item 7 is untouched: the
coverage list is still unresolved, it is simply no longer implied on the page.

---

## 0b. The `/trust` audit record panel — invented rows, marked on their face

Added 2026-09-11 with the audit rebuild, to a supplied reference. It is a
picture of a product UI, which is what item 0 below is about, so it is tracked
here rather than swept as prose.

**What it publishes.** Five rows of an audit log: timestamps (09:42:18 through
10:12:15), event names, one-line descriptions, role names, and three reference
identifiers — `#SR-2841`, `#CASE-1092`, `#USR-7710`. All invented.

**Why this is not item 0 again.** Nothing in it asserts a scale, a coverage or
a performance figure. A reference identifier makes no quantitative claim and a
clock time makes none either; item 0's failure was "2.45M mentions" and "98.60M
potential reach", published as fact inside a screenshot. And the panel carries
**"Illustrative records" on its own header**, in text, where the copy sweep
reads it — a mitigation the console mock never had.

**It reverses a decision.** The build this replaced drew redaction bars instead
of identifiers, on the reasoning that "a fabricated identifier inside a picture
of an audit log is a claim about a deployment that does not exist". That
reasoning still stands; the mark on the header is what answers it. Published on
request.

**Two conditions, and neither may go quietly.** The panel carries
`data-mock="audit-record"`, which is what `tests/test-sweep.mjs` strips before
reading the page's prose — remove the attribute and the sweep reports every
timestamp as an unapproved number. And a second check asserts the panel still
says "illustrative records"; remove the mark and the suite fails rather than
the rows going unswept.

**One thing to settle before launch.** The header also carries a green dot and
the words "Live record", beside a tag saying the records are illustrative. Both
are in the reference. They contradict each other, and a procurement reader is
the audience least likely to enjoy working out which one is true.

---

## 0. CLOSED — the console mock no longer publishes figures or platform names

Found in the checkpoint 12 sweep, closed on 2026-09-08 by redacting the mock.
Recorded rather than deleted, because it is the case that shows why the claims
rules need to cover pictures and not only sentences.

**What it was doing.** The macbook showcase on the homepage rendered, at
runtime, a five-platform coverage list — X (Twitter) · Facebook · Instagram ·
YouTube · Telegram, with shares — and numeric scale claims: "Total Mentions
2.45M", "Potential Reach 98.60M", "High Risk Alerts 186", per-platform volumes
and trending figures. CLAUDE.md records the coverage list as *unresolved* and
names "100M+ conversations daily" as the banned example of a numeric claim.
98.60M inside a product screenshot is the same assertion in a more convincing
wrapper, on the homepage, inside what the brief calls the most credible object
on the site.

**What was done.** Every figure is now a redaction bar sized like the number it
replaces; the platform rows carry no names and no brand colours; the live-feed
avatars are neutral rather than platform glyphs; the alert counters are dots.
The layout, the chrome, the donut arcs, the sparklines, the bar widths and the
movement of all three are untouched — shape is what makes the object credible
and it asserts nothing. `aria-hidden` stays.

Redaction rather than blur: blur degrades to a smudge in print — these pages get
printed and forwarded inside departments — reads as a rendering fault, and stays
legible enough to guess at. A bar cannot be read back. A dashboard visibly
withholding its figures reads as a real system sanitised for publication, which
is exactly what it is.

**Nothing here is approved by this change.** The coverage list is still
unresolved (item 7); it is simply no longer published. If the list and the
figures are confirmed later, the redaction can be lifted per-figure.

**The line, as applied.** UI furniture stays; anything a reader could mistake
for a finding becomes a bar.

*Stays* — the menubar clock, the date-range filter, the filter pills ("All
Regions"), the relative timestamps ("15 min ago"), the trending ranks 1–5, the
version string. These are controls and chrome. No finding can be read off them.

*Redacted* — volumes, reach, shares, counts, durations and sequential record
ids, wherever they appear. Three were caught on a second pass because they sat
inside prose rather than in a figure slot:

- "coordinated posting pattern detected across **40+ accounts**" — first left
  in on the grounds that it quantifies a fictional detection rather than SAGA's
  scale. That reasoning holds for body copy and fails here: inside a redacted
  panel, one surviving figure reads as the single thing the vendor was willing
  to show. The redaction makes it *more* conspicuous, not less, and the
  mechanism is already carried by "coordinated posting pattern detected".
- "resolved the water supply complaint in Ward 12 **within 4 hours**" — a
  resolution-time claim, which is a performance figure in the same class as
  reach or volume.
- **#GRV-12543** — a record id is furniture, but a *sequential* one is a
  volume: it tells the reader there have been twelve and a half thousand
  grievances. The reference slot stays so the list still reads as a queue of
  real records; the number does not.

**One content-rule breach fixed in passing:** a feed item read "Protest
gathering at Connaught Place, New Delhi." Scenario narratives must be
anonymised, no real places. It now reads "reported in the central business
district."

---

## 7. Platform coverage list — sitewide

Marked `[pending]`, not `[pending sign-off]`, because CLAUDE.md records it as
unresolved rather than merely unconfirmed. The deck names five platforms; the
one-pagers add TikTok, News/RSS and Blogs/Forums. Neither list is published —
including inside the console mock, which used to (item 0).

---

## 8. Mocks and diagrams on the rail pages — `/platform`, `/trust`, `/public-safety`

Added 2026-09-09 with the rail layout. Item 0's rule applied before the fact
rather than after it: these three pages each put a picture of the product beside
the hero copy, and every value inside those pictures was written under the same
discipline as a sentence.

**What is drawn, and why it is safe.** Each card states categories the system
records, never instances of them. `/public-safety` shows a watchlist hit whose
values are "Telugu watchlist term", "No prior history", "Recorded at
collection", "District officer on duty", "FIR number" — what the record holds,
not what any record held. `/trust` shows a deployment sheet whose every row is
already stated in body copy. `/platform` shows a record crossing four stages,
labelled by what each stage adds.

**What is withheld.** Two figures and every identifier:

- `/platform`, processing stage — the occurrence count. "Reposts collapse to one
  record" is mechanism and "1" states it; the count of occurrences is a
  measurement and none is approved, so it is a redaction bar reading
  "occurrences counted, with the accounts behind them".
- `/trust`, audit rows — user ids, record ids, case numbers and times. The four
  action names (SEARCH, READ, EXPORT, REVOKE) are the claim and are real; the
  identifiers beside them are bars. Times are omitted rather than invented,
  since a timestamped log asserts a deployment producing it.

**Still pending, and marked in the copy:**

- `/public-safety` — alert tier labels (item 4), and the real alert view.
- `/platform` — the product pipeline schematic, the entity-resolution graphic
  and the source-credibility scale graphic. All three render as visibly hatched
  placeholder panels saying so, not as finished artwork.
- `/trust` — the real audit view.

**The line, restated.** A category is not a claim. An instance is. If a value in
one of these cards could be read as something that happened in a deployment, it
is a bar.

---

## 9. The Home hero photograph

Added 2026-09-09, supplied by the client, replacing the particle canvas.
Recorded here because it is a picture of the product and item 0 is the reason
this file covers pictures at all.

**What it shows.** A person at a laptop, a globe, and five floating panels
labelled Public Sentiment, Policies & Schemes, Emerging Trends, Data Insights
and Potential Risks, over bar and line charts. The laptop shows a dashboard.

**Why it passes.** The five labels are capability claims and every one of them
is already stated in approved-register copy: sentiment, policy and scheme
tracking, emerging narratives, insights and risk. The charts carry no readable
values — no volumes, no reach, no counts, no dates — so nothing in the picture
asserts scale or performance. That was the failure in item 0 and it is absent
here.

**What is not settled by it.** It is an illustration, not a screenshot of SAGA.
It does not approve a platform coverage list (item 7), any figure, or any
client. If the image is ever replaced by one showing real product UI, it comes
back to this file first.

**Two rules it sits against, both decided deliberately:**

- CLAUDE.md rules out stock photography *of control rooms, police officers,
  protests or crowds*. A person at a workstation is none of those, and the
  client chose the image, so this is inside the rule rather than an exception
  to it. The rule is unchanged.
- The image is decorative: it carries `aria-hidden`, it is a CSS background
  rather than an `<img>`, and every word visible in it is also in the page
  copy. Nothing on the page exists only inside it.

**How it is served.** WebP at q84, 131KB, from `public/images/hero-home.webp`.
The 1596KB source PNG is kept at `images/hero-home.png`, outside `public/`, so
it stays in the repository without being shipped.

---

## 10. The `/trust` hero photograph

Added 2026-09-11, supplied by the client, replacing the deployment-sheet board
that used to be the hero's showcase. Recorded here for the same reason item 9
is: it is a picture, and item 0 is why this file covers pictures.

**What it shows.** A dark corridor, one lit doorway, and a glowing shield on
the right-hand wall. No product UI, no people, no place.

**Why it passes.** It asserts nothing. There is no figure, no platform name, no
client, no claim of any kind in it — the subject is an architectural space. The
failure in item 0 was a picture publishing numbers; there are none here.

**Two blocks of text are baked into the render, and someone should agree with
this reading before launch:**

- on the left wall, `CONTROL TODAY FOR A SAFER TOMORROW`;
- on the right pillar, `PEOPLE · DATA · ACCESS · EVIDENCE · A SAFER TOMORROW`.

Neither is a claim this file has to hold. There is no number, no legal term, no
client and no coverage list in either. The four nouns on the pillar are the
page's own four sections — deployment, access control, audit trail, lawful
basis — every one of which is real HTML below the hero, so nothing exists only
inside the picture, which is the rule that would otherwise bite. `A SAFER
TOMORROW` is a slogan rather than a capability statement, and it appears
nowhere in the site's copy. **It is marketing language published as a picture,
which means no sweep reads it** — that is the reason this entry exists. If the
line is not wanted, the fix is a new render, not a crop: the text is in the
middle of a lit wall and cannot be painted out cleanly.

**What is not settled by it.** Nothing. It approves no figure, no coverage list
and no deployment claim; every `[pending sign-off]` on `/trust` stands
unchanged.

**How it is served.** WebP at q82, 41KB, from `public/images/trust-backdrop.webp`,
graded to 0.90 brightness so it sits at the same mean luminance as the other
two backdrops (17.3 against `/platform`'s 17.7). The grade is baked into the
WebP rather than applied as a CSS `filter`, for the compositing and print
reasons recorded against the `/platform` backdrop. The 1.5MB source PNG stays
at `images/trust-hero.png`, outside `public/`.

**Contrast, measured off rendered pixels at 760px** — the narrowest width that
still draws the picture, and the worst case, because the copy column covers
most of the frame there. Ground sampled at the 25th percentile of luminance
under each run of text:

| text | ground | ratio |
|---|---|---|
| lead, right-hand end | `#201619` | 6.81:1 |
| headline band | `#090C17` | 7.53:1 |
| stat strip | `#25120D` | 6.92:1 |

All above the 4.5 requirement. The scrim is what holds them there; it is not
decoration and must not be thinned.

---

## How a number becomes approved

**Only an owner approves a number. Appearing in a style example does not.**

Recorded because it nearly went wrong: "0–100 score per area across five levels"
was published on `/governance` partly on the grounds that CLAUDE.md uses that
phrase. It does — as a worked example of the *register* to write in, contrasting
mechanism-level language against "predictive intelligence". It demonstrates how
to write; it does not authorise a specification. The figure stands only because
it independently matches the deck.

The general rule: a number is approved when a named owner confirms it on a date.
Not because it appears in a brief's illustration, not because it appears in old
collateral, and not because it appears elsewhere on the site.

A stated analysis period — "a rolling six-month window", "the last 30 days" — is
a description of what a figure covers, not a claim about scale or performance.
State it plainly and list it here for confirmation. Writing "a rolling window"
to avoid saying six months tells the reader nothing and reads as evasion.

---

## Standing rules these sit under

- No numeric claims without an owner and a date.
- No named clients.
- No legal claims: "court-admissible", "tamper-proof", "legally defensible" are
  never used. "Evidence-grade workflows", "immutable audit trail" and
  "timestamped capture with metadata" are.
- No public mention of Reputation Shield or Bulk X Actions in any form.
