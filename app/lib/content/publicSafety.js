/* /public-safety — authored content.

   [draft — needs review] applies to every string in this file.

   Written at mechanism level: verdict states, alert tiers, workflow stages and
   extraction types are named rather than described as outcomes. The test for
   each sentence is whether it could equally describe a competitor.

   ── Density pass, 2026-09-08 ──────────────────────────────────────────────
   Restructured, not simplified. The mechanism language is unchanged — the same
   tiers, verdict states, extraction types and workflow stages are named. What
   changed is packaging:

     · every module is now a 2–4 word title, one answer sentence carrying the
       mechanism, and at most two short detail sentences. No module is a
       paragraph.
     · the triad is one line per verb, for a large-type list rather than three
       card paragraphs.
     · scenarios split into a short setup and a bolded outcome.
     · the deployment note is three bold lead-ins, not three paragraphs.
     · what came out of the body is in the FAQ, which is closed by default and
       so costs nothing until a reader asks for it. Nothing was buried in a
       longer paragraph and nothing was diluted.

   Claims discipline unchanged: no counts, no client names, no deployment
   specifics and no platform coverage list. `[pending sign-off]` marks a value
   that is required but unconfirmed; `[pending]` marks the unresolved platform
   coverage list. */

const PS = 'pending sign-off';

export const publicSafety = {
  /* Opt in to the density layout. The other three verticals still render the
     original template until the same pass is applied to them. */
  dense: true,

  hero: {
    title: 'From a keyword hit to a case file.',
    body:
      'Watchlists in four languages. Four alert tiers. Person-of-interest records linked to FIR numbers, and every action written to an immutable audit trail.',
  },

  /* One line each — this renders as a large-type list, not three cards. */
  triad: [
    {
      key: 'monitor',
      name: 'Monitor',
      line: 'Watchlists in English, Telugu, Hindi and Urdu, matched across script and transliteration.',
    },
    {
      key: 'investigate',
      name: 'Investigate',
      line: 'Username enumeration, EXIF extraction and deepfake verdicts on one record.',
    },
    {
      key: 'manage',
      name: 'Manage',
      line: 'Cases linked to FIR numbers, grievances tracked to resolution, every action logged.',
    },
  ],

  /* title · answer · at most two detail sentences */
  modules: [
    {
      name: 'Multilingual watchlists',
      answer: 'Watchlists you define, running in English, Telugu, Hindi and Urdu.',
      detail: [
        'Matching covers native script, romanised transliteration and mixed-script posts.',
        'Each hit records the post, the account, the capture time and the term that fired.',
      ],
    },
    {
      name: 'Four-tier alerting',
      answer:
        'Every match is raised on one of four tiers and routed to the officer who owns that geography or subject.',
      detail: [
        `Unacknowledged alerts escalate to the next level of command on a timer [${PS}: escalation intervals].`,
      ],
    },
    {
      name: 'POI records, FIR linkage',
      answer: 'A person-of-interest record can be linked to an FIR number.',
      detail: [
        'It holds known accounts, aliases, captured media and observed locations, so the digital trail and the registered case reference each other.',
      ],
    },
    {
      name: 'Deepfake verdicts',
      answer:
        'Returns Real, Fake, Suspicious or Needs Review, with a confidence figure and a frame-level breakdown.',
      detail: [
        'Needs Review routes to a person rather than asserting a result the model cannot support.',
      ],
    },
    {
      name: 'OSINT and image forensics',
      answer: 'Username enumeration resolves one handle to accounts across sources [pending].',
      detail: [
        'EXIF returns GPS coordinates, capture time and device make and model.',
        'Both attach to the case, with the original file preserved beside the extracted values.',
      ],
    },
    {
      name: 'Grievance lifecycle',
      answer:
        'Public complaints are routed to the responsible department and tracked through New, In Progress and Resolved.',
      detail: [
        'Each records the department holding it, the time in each state and who closed it.',
        'Resolution reports by department and district, not as one total.',
      ],
    },
  ],

  signature: {
    line: 'One handle, one image, one keyword — one record.',
    body:
      'A watchlist hit, an enumerated username, a set of EXIF coordinates and a deepfake verdict all attach to the same person-of-interest record and the same FIR number.',
  },

  /* Scenario narratives replace screenshots — the product cannot show its UI
     publicly. Anonymised: no real names, places, cases or accounts.
     `outcome` is the bolded line the card closes on. */
  scenarios: [
    {
      name: 'A term fires overnight',
      setup:
        'A Telugu-language watchlist term matches a post from an account with no prior history. Raised Critical, routed to the district officer on duty, acknowledged inside the escalation window.',
      outcome:
        'The account deleted the post hours later. The captured copy and its metadata stayed on the case.',
    },
    {
      name: 'A clip, before the clarification',
      setup:
        'A video appears to show a senior officer making an inflammatory statement, spreading through regional-language groups.',
      outcome:
        'Returned Fake, with a frame-level breakdown, before the press office drafted its clarification.',
    },
    {
      name: 'One image, one location',
      setup:
        'An image circulating with a protest call still carries its EXIF metadata.',
      outcome:
        'GPS and capture time placed it in a different district, several days earlier than the post claimed.',
    },
  ],

  /* Bold lead-in, then one short statement. The lead-in is what a procurement
     reader scans for; the statement is what they read when it matters. */
  deployment: [
    {
      lead: 'Deployment model',
      body: `SAGA is deployed as [${PS}: deployment model]. Hosting location, data residency and retention are set per deployment [${PS}].`,
    },
    {
      lead: 'Access',
      body: `Bounded by role — Super Admin, Level-2 and Level-1 [${PS}: role names] — each scoped to its own geography or subject.`,
    },
    {
      lead: 'Audit',
      body:
        'Every search, export, verdict request and case action is written to an immutable audit trail carrying the user, the time and the record touched.',
    },
  ],

  /* Eight entries, not six. The depth table set six when the body carried the
     detail; the density pass moved detail here rather than deleting it, and a
     closed disclosure costs a reader nothing until they ask. */
  faqs: [
    {
      q: 'What does SAGA actually monitor?',
      a: 'Keyword watchlists that your team defines, running against public sources in English, Telugu, Hindi and Urdu. The list of sources covered is [pending] and is confirmed per deployment rather than published.',
    },
    {
      q: 'How does an alert reach the right officer?',
      a: `Each match is raised on one of four tiers — Critical, High, Medium or Low [${PS}: tier labels] — and routed by the geography or subject it belongs to. If it is not acknowledged, it escalates to the next level of command on a timer [${PS}: escalation intervals]. Acknowledgement, reassignment and closure are recorded against the alert.`,
    },
    {
      q: 'How reliable is a deepfake verdict?',
      a: "The verdict is one of four states — Real, Fake, Suspicious or Needs Review — returned with a confidence figure and a frame-level breakdown. Needs Review exists so that an uncertain result is routed to a person rather than reported as a decision. The verdict is an input to an investigator's judgement.",
    },
    {
      q: 'What connects a digital record to a registered case?',
      a: 'A person-of-interest record can be linked to an FIR number. Accounts, aliases, captured media, extracted locations and verdicts attach to that record, so the digital trail and the registered case reference each other.',
    },
    {
      q: 'What is recorded when an officer runs a search?',
      a: 'The user, the time and the records touched, written to an immutable audit trail that also covers exports, verdict requests and case actions.',
    },
    {
      q: 'What happens when a post is deleted?',
      a: 'A post captured before deletion is retained with its capture timestamp and the account metadata recorded at capture time. The captured copy stays attached to the case whether or not the original remains online.',
    },
    {
      q: 'How is captured material held?',
      a: 'With its original metadata and its capture time, alongside the values extracted from it. That supports evidence-grade workflows under the lawful basis your department already operates.',
    },
    {
      q: 'Can one officer see everything?',
      a: `No. Each role's visibility is scoped to its own geography or subject, so an officer sees the districts and watchlists they are responsible for and not the rest. Role names and the exact span of each are [${PS}].`,
    },
  ],
};
