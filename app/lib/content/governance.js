/* /governance — authored content.

   [draft — needs review] applies to every string in this file.

   Dual audience by design. This vertical serves administrations and departments
   AND political operations, and the two do not read the same page differently —
   they read it looking for themselves. Every sentence here is written to work
   for a Home Ministry official and a party office at once: the unit is the
   constituency or district, the actor is "an administration or a party office",
   and no capability is framed as electoral or as administrative alone. A
   sentence that only works for one of them is too narrow and has been rewritten.

   ── Density pass, 2026-09-08 ──────────────────────────────────────────────
   Restructured, not simplified — same pass as /public-safety. The 0–100 scale,
   the five levels, issue velocity, the attribution signals, the grievance
   states and the dual-audience framing are all unchanged. What changed is
   packaging: modules are title / answer / at most two details, the triad is one
   line per verb, scenarios split into setup and a bolded outcome, and the
   deployment note is three bold lead-ins. Detail that came out of the body is
   in the FAQ rather than deleted.

   Claims discipline: no counts, no client names, no deployment specifics, no
   platform coverage list. */

const PS = 'pending sign-off';

export const governance = {
  dense: true,

  hero: {
    title: 'Which areas moved, how fast, on what issue.',
    body:
      'Sentiment resolved to constituency and district rather than a national average. A 0–100 unrest score per area driven by issue velocity, and grievances routed to the department that owns them.',
  },

  triad: [
    {
      key: 'monitor',
      name: 'Monitor',
      line: 'Sentiment by constituency and district, each area scored 0–100 on issue velocity.',
    },
    {
      key: 'investigate',
      name: 'Investigate',
      line: 'Organic reaction separated from coordinated activity; events measured against each area’s own prior reading.',
    },
    {
      key: 'manage',
      name: 'Manage',
      line: 'Grievances routed to the owning department, tracked to resolution, assembled into a scheduled briefing.',
    },
  ],

  modules: [
    {
      name: 'Constituency-level sentiment',
      answer:
        'Sentiment is resolved to the constituency and the district, not reported as one national figure.',
      detail: [
        'An administration sees which areas moved on a scheme; a party office sees where its position is being tested.',
      ],
    },
    {
      name: 'Unrest score, five levels',
      answer: `0–100 per area across five levels [${PS}: band labels], driven by issue velocity rather than volume.`,
      detail: [
        'A small district accelerating fast outranks a large one that is merely loud.',
        'The issue driving the score is named alongside it.',
      ],
    },
    {
      name: 'Grievance routing',
      answer:
        'Complaints are categorised by subject and routed to the department that owns them.',
      detail: [
        'Tracked through New, In Progress and Resolved, with time in each state recorded.',
        'Resolution reports by department and district, not as one total.',
      ],
    },
    {
      name: 'Coordinated activity',
      answer: `Activity is attributed as organic or coordinated from account age, posting cadence, repeated phrasing and burst timing [${PS}: attribution thresholds].`,
      detail: [
        'The two are reported separately rather than summed — both can be present in one conversation.',
      ],
    },
    {
      name: 'Event impact',
      answer:
        'The same constituencies compared before and after an announcement, rally, budget or policy change.',
      detail: [
        'Measured against each area’s own prior reading, so a district that improved is not hidden inside a national average that fell.',
      ],
    },
    {
      name: 'Daily briefing',
      answer:
        'A scheduled briefing of the areas that moved, the issue driving each, and grievances open past their expected resolution.',
      detail: [
        'Any line opens back to the posts and complaints beneath it.',
      ],
    },
  ],

  signature: {
    line: 'One issue, from the post to the district to the department.',
    body:
      'A sentiment shift, the issue velocity behind it, the grievances filed against that issue and the department holding them are one record read at different depths.',
  },

  scenarios: [
    {
      name: 'A scheme lands two ways',
      setup:
        'A scheme reads positively across the state. Resolved to district level, two adjacent districts move the other way, both on the same eligibility question.',
      outcome:
        'The department responsible saw the pattern before it reached a national outlet.',
    },
    {
      name: 'A hundred accounts, one sentence',
      setup:
        'A policy hashtag accelerates overnight. Attribution splits the burst: accounts created within a short window posting near-identical phrasing, and long-standing accounts writing in their own words.',
      outcome:
        'Reported separately, so the genuine objection underneath was neither dismissed nor inflated.',
    },
    {
      name: 'A backlog, before the complaint',
      setup:
        'Grievances on one subject in one district stay In Progress well past their usual close time. No individual complaint is unusual; the pattern is.',
      outcome:
        'The briefing surfaced the department and the district while the issue was still administrative rather than public.',
    },
  ],

  deployment: [
    {
      lead: 'Deployment model',
      body: `SAGA is deployed as [${PS}: deployment model]. Hosting location, data residency and retention are set per deployment [${PS}].`,
    },
    {
      lead: 'Access',
      body: `Bounded by role — Super Admin, Level-2 and Level-1 [${PS}: role names] — each scoped to a geography or subject, whether the deployment sits with a department or a political operation.`,
    },
    {
      lead: 'Audit',
      body:
        'Every search, export and case action is written to an immutable audit trail carrying the user, the time and the record touched.',
    },
  ],

  faqs: [
    {
      q: 'What does SAGA measure at constituency level?',
      a: 'Sentiment, the issues driving it, grievance volume and resolution state, and an unrest score — each resolved to the constituency and district rather than aggregated nationally. Every area reading opens back to the posts and complaints behind it.',
    },
    {
      q: 'What drives the unrest score?',
      a: `Issue velocity — how fast a topic is accelerating within that area — rather than raw volume. The score runs 0–100 across five levels [${PS}: band labels], and the issue driving it is named alongside the number so the score is never the only thing reported.`,
    },
    {
      q: 'How do you tell coordinated activity from genuine anger?',
      a: `Account age, posting cadence, repeated phrasing and burst timing are used to attribute activity as organic or coordinated [${PS}: attribution thresholds]. The two are reported separately rather than summed, because a coordinated burst and a real objection can be present in the same conversation at the same time.`,
    },
    {
      q: 'Where does a grievance go?',
      a: 'It is categorised by subject and routed to the department that owns that subject, then tracked through New, In Progress and Resolved. The department holding it, the time spent in each state and who closed it are recorded.',
    },
    {
      q: 'What is in the daily briefing?',
      a: 'The areas that moved and the issue driving each, activity flagged as coordinated, and grievances open past their expected resolution. It is assembled from the platform’s own records, so any line can be opened back to its sources.',
    },
    {
      q: 'Can a department and a political operation use the same deployment?',
      a: `They are separate deployments with separate data. Within either, access is bounded by role and scoped to a geography or subject [${PS}: role names], and the audit trail records who looked at what. The capabilities are the same; the boundary around them is set per deployment.`,
    },
    {
      q: 'Who sees which areas?',
      a: `Each role’s visibility is scoped to its own geography or subject: a district officer sees their district, a state-level user sees the areas assigned to them. Role names and the exact span of each are [${PS}].`,
    },
    {
      q: 'How is captured material held?',
      a: 'With its original metadata and its capture time, alongside the values extracted from it. That supports evidence-grade workflows under the lawful basis the operating body already holds.',
    },
  ],
};
