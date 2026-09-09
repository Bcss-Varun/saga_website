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
   exists. The deployment sentence itself is [pending sign-off]. */

/* ── Density pass, 2026-09-08 ────────────────────────────────────────────────
   Restructured, not simplified. Section bodies are now { lead, body } — a bold
   lead-in a procurement reader can scan, then the statement they read when it
   matters.

   The lawful-basis section keeps every sentence it had. It is the densest prose
   on the site and the one a security reviewer reads most carefully, so nothing
   was cut from it; it gained lead-ins and lost nothing else. The audit section
   gained a fourth lead-in because its second paragraph was carrying two
   separate claims — what is recorded, and that reads count as events — and the
   read-logging claim is the single most load-bearing sentence on the page
   (APPROVALS item 1). It now stands on its own rather than buried mid-paragraph. */

const PS = 'pending sign-off';

export const trust = {
  dense: true,

  hero: {
    eyebrow: 'Trust',
    title: 'Where it runs, who sees it, what is recorded.',
    body:
      'SAGA is bought by departments that have to answer for it afterwards. This page states the deployment model, the access boundaries, what the audit trail captures and the basis on which data is handled — so a security review can start here rather than on a call.',
  },

  sections: [
    {
      id: 'deployment',
      eyebrow: 'Deployment',
      title: 'Where the system runs.',
      body: [
        {
          lead: 'Model',
          body: `SAGA is deployed as [${PS}: deployment model — on-premise, private cloud, or department-hosted].`,
        },
        {
          lead: 'Location and retention',
          body: `Hosting location, data residency and retention periods are set per deployment and recorded in the deployment agreement rather than fixed by the product [${PS}].`,
        },
        {
          lead: 'Inside your own network',
          body: `Where a department requires the system to run inside its own network boundary, it does [${PS}: confirm supported topologies]. Support for an isolated deployment is agreed at contract [${PS}].`,
        },
      ],
    },
    {
      id: 'access',
      eyebrow: 'Access control',
      title: 'Three roles, and a boundary around each one.',
      lead: `Three roles [${PS}: role names], each scoped to its own geography or subject. An officer sees the districts, watchlists and cases they are responsible for, and not the rest.`,
      body: [],
      roles: [
        {
          name: 'Super Admin',
          answer: 'Creates and removes accounts, assigns roles, and sets the geography or subject each role is scoped to.',
          detail: [
            `Sets which pages and features a role may reach. Holds the only view of the full deployment [${PS}: exact span].`,
          ],
        },
        {
          name: 'Level-2',
          answer: 'Works across an assigned scope — multiple districts, watchlists or subjects — and assigns work to Level-1 inside it.',
          detail: [`Cannot widen its own scope [${PS}: exact span].`],
        },
        {
          name: 'Level-1',
          answer: 'Works within a single assigned scope: the alerts, cases and grievances routed to it.',
          detail: [`Cannot see records outside it, including those belonging to peers [${PS}: exact span].`],
        },
      ],
      extras: [
        {
          name: 'Page and feature-level permissions',
          body:
            'Set per page and per feature, not only per role — a role can be granted a page while being denied export or a verdict request on it. Two users holding the same role can therefore have different reach, set deliberately rather than by exception.',
        },
        {
          name: 'One-click revoke',
          body:
            'Revoked in a single action, taking effect for sessions already open rather than at next sign-in. Revocation is itself an audited event: who revoked, when, and which account.',
        },
      ],
    },
    {
      id: 'audit',
      eyebrow: 'Audit trail',
      title: 'What is recorded, and what cannot be edited.',
      body: [
        {
          lead: 'What is recorded',
          body: 'Every search, export, verdict request, case action, permission change and revocation — written to an immutable audit trail carrying the user, the timestamp and the record touched.',
        },
        {
          lead: 'Reads, not only writes',
          body: `Looking at a person-of-interest record is an event, not a silent action [${PS}: read-logging].`,
        },
        {
          lead: 'Captured material',
          body: 'Stored with its original metadata and its capture time, retained alongside the original file. An investigator can show what was collected, when, by whom, and what state it was in at collection — evidence-grade workflows.',
        },
        {
          lead: 'Retention',
          body: `Audit records are retained for the period set in the deployment agreement [${PS}: retention period] and can be exported for internal review or inspection.`,
        },
      ],
    },
    {
      id: 'lawful-basis',
      eyebrow: 'Lawful basis',
      title: 'The department’s authority, not the platform’s.',
      body: [
        {
          lead: 'The platform confers no authority',
          body: 'SAGA processes material from public sources. A department operates the system under the lawful basis it already holds, and the platform’s job is to make what was done under that basis legible afterwards.',
        },
        {
          lead: 'Scoping is the practical control',
          body: 'Watchlists, geographies and subjects are defined by the department, roles are bounded to them, and the audit trail records who looked at what. That combination is what allows a department to answer a question about its own use of the system months later.',
        },
        {
          lead: 'Contractual terms',
          body: `Data protection terms, processor and controller responsibilities, and any sector-specific obligations are set in the deployment agreement [${PS}: contractual terms].`,
        },
      ],
    },
  ],

  /* Unnamed descriptors only. Each carries [pending sign-off] because naming a
     deployment — even without naming the client — is still a claim that one
     exists in that form. */
  deployments: {
    eyebrow: 'Deployments',
    title: 'Who runs it.',
    note: 'Described by descriptor only. No client is named on this site.',
    items: [
      `A state police force [${PS}]`,
      `A state Home Ministry [${PS}]`,
      `A national government in West Africa [${PS}]`,
    ],
  },

  cta: {
    eyebrow: 'Security review',
    title: 'Bring your security questions to the demonstration.',
    body:
      'A product specialist can walk a security reviewer through the deployment model, the role boundaries and the audit trail against your own requirements.',
  },
};
