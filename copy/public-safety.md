# /public-safety — full page copy

**Status: `[draft — needs review]` — every line below.**
Not wired into the page. Source: the 24-page deck.

Claims discipline applied: no counts, no client names, no deployment specifics,
no platform coverage list. `[pending sign-off]` marks a value that is required
but unconfirmed. `[pending]` marks the platform coverage list specifically.

---

## 1. Hero

**Eyebrow:** Law Enforcement & Public Safety

**H1:** From a keyword hit to a case file, with the audit trail intact.

**Lead:** SAGA runs keyword watchlists in English, Telugu, Hindi and Urdu,
raises each match on one of four alert tiers, and carries it through escalation
into a case record — person-of-interest entries linked to FIR numbers, captured
posts held with their original metadata, and every action written to an
immutable audit trail.

**Buttons:** Request a Demo · How the platform works

---

## 2. Monitor / Investigate / Manage

**Section heading:** Monitor, investigate, manage.

**Monitor**
Watchlists run continuously in English, Telugu, Hindi and Urdu, matching native
script, transliteration and mixed-script text. Each match is raised on one of
four tiers — Critical, High, Medium or Low `[pending sign-off: tier labels]` —
and routed to the officer who owns that geography or subject.

**Investigate**
Resolve one username to accounts across sources with OSINT enumeration. Pull
GPS coordinates, capture time and device make and model from image EXIF where
the metadata survives upload. Submit a clip for a deepfake verdict and get back
one of four states with a frame-level breakdown.

**Manage**
Open a case from an alert, attach the captured post with its timestamp and
account metadata, and link the person of interest to an FIR number. Public
grievances run their own lifecycle alongside — routed to a department and
tracked to resolution. Every action is written to the audit trail with the user,
the time and the record touched.

---

## 3. Capability modules (6)

**Multilingual keyword watchlists**
Watchlists you define, running in English, Telugu, Hindi and Urdu. Matching
covers native script, romanised transliteration and mixed-script posts, so a
term written three ways still returns one match. Each hit records the source
post, the account, the capture time and which watchlist term fired.

**Four-tier alerting and escalation**
Every match is raised on one of four tiers and routed to the officer who owns
that geography or subject. An alert left unacknowledged escalates to the next
level of command on a timer `[pending sign-off: escalation intervals]`, so no
alert sits unowned. Acknowledgement, reassignment and closure are all recorded.

**Person-of-interest records with FIR linkage**
A POI record holds known accounts, aliases, previously captured media and
observed locations. It can be linked to an FIR number, so the digital record and
the registered case point at each other rather than living in separate systems.

**Deepfake verdicts**
A submitted video or image returns Real, Fake, Suspicious or Needs Review, with
a confidence figure and a frame-level breakdown showing which frames drove the
verdict. Needs Review is a real outcome, not a failure state: it routes to a
human rather than asserting a result the model cannot support.

**OSINT enumeration and image forensics**
Username enumeration resolves one handle to accounts across sources `[pending]`.
EXIF extraction returns GPS coordinates, capture timestamp and device make and
model where present. Both attach to the case record with the original file
preserved alongside the extracted values.

**Grievance lifecycle**
Public complaints are captured, categorised and routed to the responsible
department, then tracked through New, In Progress and Resolved. Each grievance
records the department holding it, the time spent in each state, and who closed
it — so resolution can be reported by department and by district rather than as
a single total.

---

## 4. Signature visual

**Heading:** One handle, one image, one keyword — resolved into one record.

**Body:** A watchlist hit, an enumerated username, a set of EXIF coordinates and
a deepfake verdict can all attach to the same person-of-interest record and the
same FIR number. An investigator reads one file instead of reconciling four
tools.

---

## 5. Signal to action

**Heading:** Every signal has somewhere to go.

01 Detected · 02 Scored · 03 Verified · 04 Escalated · 05 Resolved

---

## 6. Scenario narratives (3) — illustrative

Anonymised. No real names, places, cases or accounts.

**A watchlist term fires overnight**
A Telugu-language watchlist term matches a post from an account with no prior
history. The match is raised as a Critical alert and routed to the district
officer on duty; it is acknowledged inside the escalation window. The post is
captured with its timestamp and account metadata. The account deletes the post
some hours later; the captured copy and its metadata remain attached to the
case. *Illustrative.*

**A clip that would have forced a clarification**
A video appears to show a senior officer making an inflammatory statement, and
spreads through regional-language groups. Submitted for verification, it returns
**Fake** with a confidence figure and a frame-level breakdown identifying the
manipulated segment. The verdict reaches the press office before a public
clarification is drafted, so the response addresses a known forgery rather than
an open question. *Illustrative.*

**One image, one location**
An image circulating with a protest call still carries its EXIF. Extraction
returns GPS coordinates, a capture timestamp and the device make and model —
placing the photograph in a different district and several days earlier than the
post claims. The original file, the extracted values and the time of extraction
are attached to the case record. *Illustrative.*

---

## 7. Deployment note (full)

SAGA is deployed as `[pending sign-off: deployment model]`. Hosting location,
data residency and retention periods are set per deployment
`[pending sign-off]`.

Access is bounded by role — Super Admin, Level-2 and Level-1
`[pending sign-off: role names]` — with each role's visibility scoped to its own
geography or subject, so an officer sees the districts and watchlists they are
responsible for and not the rest.

Every search, export, verdict request and case action is written to an immutable
audit trail carrying the user, the timestamp and the record touched. Captured
material is stored with its original metadata and its capture time, supporting
evidence-grade workflows under the lawful basis your department already
operates.

*Link:* Security, data handling and lawful basis →

---

## 8. FAQ (6)

**What does SAGA actually monitor?**
Keyword watchlists that your team defines, running against public sources in
English, Telugu, Hindi and Urdu. The list of sources covered is `[pending]` and
is confirmed per deployment rather than published.

**How does an alert reach the right officer?**
Each match is raised on one of four tiers and routed by the geography or subject
it belongs to. If it is not acknowledged, it escalates to the next level of
command on a timer `[pending sign-off: escalation intervals]`. Acknowledgement,
reassignment and closure are recorded against the alert.

**How reliable is a deepfake verdict?**
The verdict is one of four states — Real, Fake, Suspicious or Needs Review —
returned with a confidence figure and a frame-level breakdown. Needs Review
exists so that an uncertain result is routed to a person rather than reported as
a decision. The verdict is an input to an investigator's judgement.

**What connects a digital record to a registered case?**
A person-of-interest record can be linked to an FIR number. Accounts, aliases,
captured media, extracted locations and verdicts attach to that record, so the
digital trail and the registered case reference each other.

**What is recorded when an officer runs a search?**
The user, the time and the records touched, written to an immutable audit trail
that also covers exports, verdict requests and case actions.

**What happens when a post is deleted?**
A post captured before deletion is retained with its capture timestamp and the
account metadata recorded at capture time. The captured copy stays attached to
the case whether or not the original remains online.

---

## 9. Closing CTA

**Eyebrow:** Request a demonstration
**Heading:** See it running on your own region.
**Buttons:** Request a Demo · How the platform works
**Note:** Or write directly to smartapps@bluecloudsoftech.com — a product
specialist replies within one working day.

---

## Five specific things a first-time reader can name

1. Keyword watchlists in English, Telugu, Hindi and Urdu, matching native script,
   transliteration and mixed script.
2. Four alert tiers with routing by geography or subject and timed escalation to
   the next level of command.
3. Person-of-interest records linkable to an FIR number.
4. Deepfake verdicts returning Real, Fake, Suspicious or Needs Review with a
   confidence figure and a frame-level breakdown.
5. EXIF extraction returning GPS coordinates, capture timestamp and device make
   and model; OSINT username enumeration across sources.
6. An immutable audit trail recording user, time and record for searches,
   exports, verdict requests and case actions.

## What is deliberately absent

- No counts of any kind — no conversations per day, no countries, no accuracy
  percentages, no user numbers.
- No client names, named forces or named departments.
- No platform coverage list — marked `[pending]` in both places it is implied.
- No legal claims. "Evidence-grade workflows", "immutable audit trail" and
  "timestamped capture with metadata" are used; "court-admissible",
  "tamper-proof" and "legally defensible" are not.
- No mention of Reputation Shield or Bulk X Actions in any form.
