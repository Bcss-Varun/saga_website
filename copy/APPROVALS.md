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

---

## 2. Deployment model — `/trust`, `/public-safety`, `/governance`

- The deployment sentence itself: on-premise, private cloud, or
  department-hosted.
- Supported topologies for a deployment inside a department's own network
  boundary.
- Update and support arrangements for an isolated deployment.
- Hosting location, data residency, retention periods.
- Audit-record retention period.
- Contractual terms: data protection, processor/controller responsibilities.

## 3. Role names and spans — `/trust`, all verticals

Super Admin / Level-2 / Level-1 — both the **labels** and the **exact span** of
each. Currently described from the product mock, not from a specification.

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

- `/investigation` — sources and coverage for email and phone intelligence.
- `/platform`, `/investigation` — which languages beyond English, Telugu, Hindi
  and Urdu are supported, and confirmation that unsupported languages are
  collected but not scored.
- `/platform` — the default source-credibility weighting scheme.
- `/contact` — retention period for enquiry data, quoted in the consent text.
- `/trust` — supported topologies for a deployment inside a department's own
  network boundary, and the deployment model wording itself (on-premise,
  private cloud, or department-hosted).
- Sitewide — the production domain, needed before canonical and Open Graph URLs
  can be emitted. They are currently omitted rather than pointed at a guess.

## 6. Scored windows and thresholds — `/governance`, `/celebrity`

- Unrest score: the 0–100 range and five levels are stated in copy. Band labels
  unconfirmed.
- Endorsement-risk window: **six months** is stated in copy. Confirm it is the
  actual analysis period.
- Coordinated-activity attribution thresholds.
- Bot and troll attack scoring thresholds.

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
