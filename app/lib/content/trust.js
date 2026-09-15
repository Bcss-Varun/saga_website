/* /trust — authored content.

   [draft — needs review] applies to every string in this file.

   Small page, disproportionate weight in government procurement: it is what a
   security reviewer opens first and often the only page a procurement committee
   reads in full. It must answer where the system runs, who can see what, what is
   recorded, and under whose authority — without making a claim nobody has
   approved.

   Claims discipline: no legal claims ("court-admissible", "tamper-proof",
   "legally defensible" are not used). No client names — deployments are
   described by unnamed descriptor only, and every descriptor carries
   [pending sign-off] because even an unnamed descriptor asserts a deployment
   exists. The deployment sentence itself is [pending sign-off].

   ── Density pass, 2026-09-08 ────────────────────────────────────────────────
   Restructured, not simplified. Section bodies carry a bold lead-in a
   procurement reader can scan, then the statement they read when it matters.

   The lawful-basis section keeps every sentence it had. It is the densest prose
   on the site and the one a security reviewer reads most carefully, so nothing
   was cut from it. The audit section carries a fourth entry because its second
   paragraph held two separate claims — what is recorded, and that reads count
   as events — and the read-logging claim is the single most load-bearing
   sentence on the page (APPROVALS item 1). It stands on its own rather than
   buried mid-paragraph.

   ── Restructured 2026-09-09, for the rail layout ───────────────────────────
   Same sentences again. The three roles became three alternatives a reader
   picks between, each paired with the scope ring it can reach, because the
   thing a reviewer is actually checking is containment and containment is
   easier to see than to read. */

const PS = 'pending sign-off';

export const trust = {
  hero: {
    /* Supplied copy, 2026-09-11, with the photographic backdrop. It sits a
       level more general than the mechanism register this brief asks for —
       "data protection", "traceable activity" — which is a hero's job here:
       the four sections below carry the mechanism, and this names the four so
       a reviewer knows the page answers them before scrolling. */
    eyebrow: 'Trust & Security',
    title: 'Know where it runs.',
    lit: 'Control who can access it.',
    body:
      'Blura SAGA is designed for sensitive intelligence environments, with controlled deployment, role-based access, data protection and traceable activity built into the platform.',
    stats: [
      { value: 'Three', label: 'scoped roles' },
      { value: 'Immutable', label: 'audit trail' },
      { value: 'Per deployment', label: 'hosting & retention' },
    ],
  },

  /* ── deployment ─────────────────────────────────────────────────────────
     Supplied copy, 2026-09-11, replacing the three prose cards. It names three
     models where the old copy carried a placeholder — on-premise, cloud,
     hybrid, against on-premise / private cloud / department-hosted.

     Supplied copy is not sign-off. APPROVALS item 2 holds the deployment
     sentence and nobody has closed it, so the marker stays; it sits on the
     lead rather than on each card, because one marker covers a claim the three
     cards make jointly and three would read as three separate doubts.

     The 01/02/03 indices are the client's and are kept as supplied. They are
     not a sequence — a department picks one of the three, it does not pass
     through them — and CLAUDE.md rules indices out on content that is not a
     genuine sequence. Raised and overruled; recorded here and in the page so
     the next person does not rediscover it. */
  deployment: {
    id: 'deployment',
    eyebrow: 'Deployment',
    title: 'Run SAGA where your intelligence belongs.',
    lead:
      `Choose the deployment model that best fits your organisation's security, infrastructure and operational requirements [${PS}: which deployment models are offered].`,
    models: [
      {
        n: '01',
        icon: 'onPrem',
        label: 'On-premise',
        headline: 'Keep SAGA within your own infrastructure.',
        body:
          "Deploy Blura SAGA inside your organisation's controlled environment for greater control over sensitive intelligence and access.",
        bestFor: 'High-security and controlled environments.',
      },
      {
        n: '02',
        icon: 'cloud',
        label: 'Cloud',
        headline: 'Scale intelligence without managing the infrastructure.',
        body:
          'Run Blura SAGA in a secure cloud environment while keeping the platform accessible, scalable and centrally managed.',
        bestFor:
          'Organisations looking for faster deployment and operational flexibility.',
      },
      {
        n: '03',
        icon: 'hybrid',
        label: 'Hybrid',
        headline: 'Keep sensitive workloads close. Scale where needed.',
        body:
          'Combine on-premise and cloud environments so organisations can keep sensitive data within controlled infrastructure while using cloud capabilities where appropriate.',
        bestFor: 'Organisations with mixed security and infrastructure requirements.',
      },
    ],
  },

  /* ── access control ─────────────────────────────────────────────────────
     Supplied copy of 2026-09-11, to a supplied reference. The three named
     roles that used to follow it — their labels, their spans, and the two
     permission cards under them — were removed on request the same day and are
     quoted verbatim in copy/APPROVALS.md item 3.

     What is left sits a level more general than the register this brief asks
     for: "the right organisational and operational boundaries" would describe
     any product with an admin screen. The spans were the specificity, and the
     hero's "Three scoped roles" is now a count the page never explains. Both
     are recorded against that APPROVALS item. */
  access: {
    id: 'access',
    eyebrow: 'Access control',
    /* Retitled twice on 2026-09-11. The reference's two-tone "Give every user
       the access / they need. And nothing they don't." went first, taking the
       page back to one `lit` — the h1 — as the sitewide rule asks. Then
       "Structured for every level of operation.", which could describe any
       product with an admin screen and so fails the test this brief sets for
       a sentence. This one names the two mechanisms the three cards below it
       describe, so the heading and the cards say the same thing. */
    title: 'Bounded by role, and by scope.',
    lead:
      'Blura SAGA uses role-based access control to keep intelligence within the right organisational and operational boundaries.',
    /* Three principles, not three steps: role, scope, action. The indices are
       the client's, as on the deployment models, and the same objection
       applies — see that note. */
    pillars: [
      {
        n: '01',
        label: 'Role',
        art: 'role',
        headline: 'Access follows responsibility.',
        body: 'Users are assigned access based on their role within the organisation.',
      },
      {
        n: '02',
        label: 'Scope',
        art: 'scope',
        headline: 'Access stays within its boundary.',
        body: 'Users only see the intelligence and operational areas authorised for them.',
      },
      {
        n: '03',
        label: 'Action',
        art: 'action',
        headline: 'Every action remains accountable.',
        body: `Access and activity are logged to support traceability and review when required [${PS}: read-logging].`,
      },
    ],
    /* The strip under the cards. Three of the four are already stated
       elsewhere on the site: role-based access and multi-factor sign-in are on
       /platform's security section, and session logging is the read-logging
       claim that APPROVALS item 1 holds. Privileged access review is asserted
       nowhere else and is marked. */
    layer: {
      label: 'Built into every access layer',
      items: [
        { icon: 'people', name: 'Role-based access' },
        { icon: 'shield', name: 'Multi-factor authentication' },
        { icon: 'log', name: 'Session logging' },
        { icon: 'gear', name: 'Privileged access review', pending: 'privileged access review' },
      ],
    },
  },

  /* ── audit trail ────────────────────────────────────────────────────────
     Built to a supplied reference on 2026-09-11, with supplied copy.

     Four statements the copy it replaced carried did not survive into it, and
     this page has no FAQ to move them to. They are quoted verbatim in
     copy/APPROVALS.md item 1. One of them is read-logging, which is the most
     load-bearing sentence on this page for a government buyer, and the
     reference asserts it *in the mock* — a highlighted READ row reading
     "Intelligence record accessed". A claim drawn as a picture is the defect
     class this brief warns about, so the marker is carried on card 01, whose
     "data access" is the same claim in text.

     The record panel publishes fabricated identifiers — #SR-2841, #CASE-1092,
     #USR-7710 — where the build it replaced drew redaction bars for exactly
     that reason. The reference marks the panel "Illustrative records" on its
     own header, which is a mitigation the console mock never had, and none of
     these asserts a scale or a coverage figure. Published on request; see
     APPROVALS item 0b. */
  audit: {
    id: 'audit',
    eyebrow: 'Audit trail',
    title: 'Every action.',
    lit: 'One clear record.',
    /* The slogan beside the heading. Decorative, and hidden below 1200px where
       there is no column to put it in. */
    aside: ['Trace', 'Investigate', 'Respond', 'With clarity'],
    lead:
      'Blura SAGA records activity across the intelligence lifecycle, creating a traceable record of what happened, when it happened, and what was acted upon.',
    record: {
      label: 'SAGA audit record',
      tag: 'Illustrative records',
      state: 'Live record',
      columns: ['Time', 'Event', 'Description', 'User / role', 'Reference'],
      rows: [
        {
          time: '09:42:18',
          icon: 'search',
          event: 'Query',
          desc: 'Intelligence search initiated',
          who: 'Analyst',
          ref: '#SR-2841',
        },
        {
          time: '09:43:06',
          icon: 'doc',
          event: 'Read',
          desc: 'Intelligence record accessed',
          who: 'Analyst',
          ref: '#SR-2841',
          accent: true,
        },
        {
          time: '09:45:31',
          icon: 'gear',
          event: 'Action',
          desc: 'Case action recorded',
          who: 'Field Officer',
          ref: '#CASE-1092',
        },
        {
          time: '09:47:02',
          icon: 'download',
          event: 'Export',
          desc: 'Evidence package generated',
          who: 'Investigation Lead',
          ref: '#CASE-1092',
        },
        {
          time: '10:12:15',
          icon: 'person',
          event: 'Permission',
          desc: 'Access level updated',
          who: 'System Admin',
          ref: '#USR-7710',
        },
      ],
    },
    pillars: [
      {
        n: '01',
        icon: 'log',
        label: 'Activity',
        headline: 'Every interaction is recorded.',
        body: `Alerts, queries, actions and data access are recorded with timestamps, creating a clear history of activity [${PS}: read-logging].`,
      },
      {
        n: '02',
        icon: 'shield',
        label: 'Integrity',
        headline: 'The record is built to remain intact.',
        body: `Audit records use immutable logging and tamper-protection mechanisms to preserve the integrity of the record [${PS}: tamper-protection mechanisms].`,
      },
      {
        n: '03',
        icon: 'doc',
        label: 'Evidence',
        headline: 'From intelligence to documented action.',
        body:
          'Evidence packages can retain a documented chain of custody for review and investigation.',
      },
    ],
    strip: [
      { icon: 'clock', name: 'Timestamped', sub: 'Every action, with time.' },
      { icon: 'nodes', name: 'Traceable', sub: 'End-to-end visibility.' },
      { icon: 'db', name: 'Immutable', sub: 'Built to remain intact.' },
      { icon: 'doc', name: 'Reviewable', sub: 'Ready for oversight.' },
    ],
  },

  basis: {
    id: 'basis',
    eyebrow: 'Lawful basis',
    title: 'The department’s authority, not the platform’s.',
    items: [
      {
        name: 'The platform confers no authority',
        body: [
          'SAGA processes material from public sources. A department operates the system under the lawful basis it already holds, and the platform’s job is to make what was done under that basis legible afterwards.',
        ],
      },
      {
        name: 'Scoping is the practical control',
        body: [
          'Watchlists, geographies and subjects are defined by the department, roles are bounded to them, and the audit trail records who looked at what. That combination is what allows a department to answer a question about its own use of the system months later.',
        ],
      },
      {
        name: 'Contractual terms',
        body: [
          `Data protection terms, processor and controller responsibilities, and any sector-specific obligations are set in the deployment agreement [${PS}: contractual terms].`,
        ],
      },
    ],
  },

  /* Unnamed descriptors only. Each carries [pending sign-off] because naming a
     deployment — even without naming the client — is still a claim that one
     exists in that form. */
  deployments: {
    id: 'deployments',
    eyebrow: 'Deployments',
    title: 'Who runs it.',
    note: 'Described by descriptor only. No client is named on this site.',
    items: ['A state police force', 'A state Home Ministry', 'A national government in West Africa'],
    pending: `[${PS}]`,
  },

  cta: {
    eyebrow: 'Security review',
    title: 'Bring your security questions to the demonstration.',
    body:
      'A product specialist can walk a security reviewer through the deployment model, the role boundaries and the audit trail against your own requirements.',
  },
};
