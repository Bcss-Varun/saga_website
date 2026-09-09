/* /platform — authored content. [draft — needs review] on every string.

   Reader: a technical evaluator. Someone who has been handed the product to
   assess and wants to know how it works — what enters the system, what is done
   to it, in what order, and what the boundaries are. Not a commissioner, and
   not a buyer looking for outcomes.

   That changes the writing. Sections are ordered as the pipeline runs rather
   than by importance. Where a stage has a limitation, it is stated in the same
   paragraph as the capability rather than omitted, because an evaluator who
   finds an unstated limitation stops trusting the rest of the page.

   Claims discipline: no counts, no client names, no deployment specifics, no
   platform coverage list. */

const PS = 'pending sign-off';

export const platform = {
  hero: {
    eyebrow: 'Platform',
    title: 'What enters, what happens to it, and in what order.',
    body:
      'SAGA runs a four-stage pipeline: collection, processing, scoring, action. Each stage hands the next a record that keeps its origin, so a score at the end can be opened back to the post it came from. This page describes the stages, the architecture around them, and the access boundaries that constrain both.',
  },

  stages: {
    eyebrow: 'The pipeline',
    title: 'Four stages, and what each one adds.',
    lead:
      'Every record carries its source and its capture time from the first stage onward. Nothing downstream discards that, which is what makes a figure at the end auditable rather than merely reported.',
    items: [
      {
        n: '01',
        name: 'Collection',
        body:
          'Public sources and RSS feeds are polled on a schedule; watchlist terms and tracked entities determine what is retained. Each retained item is stored with its source URL, its author account, its capture timestamp and the term or entity that caused it to be kept. Items that match nothing are not retained.',
        note: 'The list of sources covered is [pending] and confirmed per deployment.',
      },
      {
        n: '02',
        name: 'Processing',
        body:
          'Retained items are language-identified, normalised and deduplicated. Near-identical reposts are collapsed to one record with a count of occurrences and the accounts behind them, so repetition is measured rather than mistaken for reach. Entities — accounts, names, locations, organisations — are extracted and linked to existing records where they match.',
      },
      {
        n: '03',
        name: 'Scoring',
        body: `Records are scored for sentiment, risk and velocity, and attributed as organic or coordinated from account age, posting cadence, repeated phrasing and burst timing [${PS}: attribution thresholds]. Scores are attached to the record rather than replacing it: the inputs stay available, so a score can be disagreed with by looking underneath it.`,
      },
      {
        n: '04',
        name: 'Action',
        body:
          'A scored record raises an alert on its tier, opens or joins a case, or routes a grievance to a department. Ownership, acknowledgement, state changes and closure are recorded against the record. This is the stage where the platform stops describing and starts assigning.',
      },
    ],
  },

  architecture: {
    eyebrow: 'Architecture',
    title: 'Records, not dashboards.',
    body: [
      'The unit is the record, not the chart. A dashboard figure is a query over records that still exist individually, which is why any number on any screen can be opened back to the items that produced it. A system that stores aggregates cannot do this, and the difference only becomes visible when someone asks where a figure came from.',
      'Entities — accounts, people, locations, organisations — are resolved across sources and held once, with the records that mention them attached. That is what allows a username seen in one place, an image posted in another and a complaint filed in a third to arrive at the same entity rather than three unconnected rows.',
      `Retention is set per deployment [${PS}: retention periods]. Records are removed on the retention schedule, not on storage pressure, so the window a deployment operates on is a policy decision rather than an operational side effect.`,
    ],
  },

  rss: {
    eyebrow: 'RSS engine',
    title: 'News feeds, weighted by source, correlated with social.',
    body: [
      'RSS and news feeds are polled alongside social sources and carried through the same pipeline. Each source carries a credibility weight, so an item from an established outlet and an item from an anonymous aggregator do not contribute equally to a score, and the weight applied is visible on the record rather than folded silently into a number.',
      `Source credibility weights are configurable per deployment and can be adjusted by an administrator [${PS}: default weighting scheme]. A weight is a stated position about a source, so it is treated as a setting a department owns rather than a fact the platform asserts.`,
      'News items and social conversation about the same subject are correlated, which allows the ordering question to be answered: whether coverage followed the conversation or the conversation followed coverage. That ordering is frequently the difference between an organic story and a placed one.',
    ],
  },

  languages: {
    eyebrow: 'Languages',
    title: 'English, Telugu, Hindi and Urdu.',
    body: [
      'Language identification, sentiment scoring and watchlist matching run in English, Telugu, Hindi and Urdu. Matching covers native script, romanised transliteration and mixed-script text, so a term written in Devanagari, written in Latin script and written half in each returns one match rather than three.',
      `Additional languages are added per deployment [${PS}: which languages beyond these four are supported]. Where a language is not supported, items in it are collected and stored but not scored — they are not silently dropped, and they are not scored as though the model understood them.`,
    ],
  },

  rbac: {
    eyebrow: 'Access control',
    title: 'Three roles, scoped, with permissions below them.',
    body: [
      `Access is bounded by role — Super Admin, Level-2 and Level-1 [${PS}: role names] — and each role is scoped to a geography or subject. Scope is the primary boundary: a user sees the districts, watchlists or subjects assigned to them and not the rest, including records belonging to peers at the same level.`,
      'Beneath the role sits a per-page and per-feature permission layer, so a role can be granted a page while being denied a specific action on it, such as export or a verdict request. Two users holding the same role can therefore have different reach, set deliberately.',
      'Access can be revoked in a single action, taking effect for sessions already open rather than at next sign-in. Every search, export, permission change and revocation is written to an immutable audit trail carrying the user, the timestamp and the record touched.',
    ],
    link: { href: '/trust', label: 'Deployment, audit trail and lawful basis' },
  },

  faqs: [
    {
      q: 'What happens to an item that matches nothing?',
      a: 'It is not retained. Collection keeps what a watchlist term or a tracked entity caused it to keep; the rest is discarded at the first stage rather than stored against a future query.',
    },
    {
      q: 'Can a score be disagreed with?',
      a: 'Yes, and that is the reason scores are attached to records rather than replacing them. Sentiment, risk, velocity and organic-versus-coordinated attribution all keep their inputs available, so an analyst can open the underlying items and reach a different conclusion.',
    },
    {
      q: 'How are duplicate posts handled?',
      a: 'Near-identical reposts are collapsed into one record carrying a count of occurrences and the accounts responsible. Repetition is therefore measurable as repetition, instead of appearing as reach.',
    },
    {
      q: 'What does source credibility weighting actually change?',
      a: `It changes how much an item contributes to a score, and the weight applied is shown on the record. Weights are configurable per deployment [${PS}: default weighting scheme], because a judgement about a source belongs to the department operating the system.`,
    },
    {
      q: 'What happens in an unsupported language?',
      a: `Items are collected and stored but not scored [${PS}: which languages beyond English, Telugu, Hindi and Urdu are supported]. They are neither dropped nor passed through a model that does not read them.`,
    },
  ],
};
