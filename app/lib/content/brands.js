/* /brands — authored content. [draft — needs review] on every string.

   Medium depth: 4 capability modules, 2 scenarios, 4 FAQ, short deployment
   note. The deck lists six capabilities for this vertical and there are four
   slots, so pre-viral detection is folded into viral risk scoring (they are the
   same mechanism read at two thresholds) and competitor share of voice moves to
   the triad and the FAQ. */

const PS = 'pending sign-off';

export const brands = {
  hero: {
    title: 'A complaint cluster, a velocity score, and someone to answer it.',
    body:
      'SAGA scores a conversation for viral risk while it is still small, clusters complaints by location and subject so a pattern is visible before it is a trend, separates organic criticism from coordinated activity, and opens a response workflow against the cluster rather than against a single post.',
  },

  triad: [
    {
      key: 'monitor',
      name: 'Monitor',
      body:
        'Conversations are scored for viral risk on their rate of acceleration rather than their current size, so a thread is flagged while a response is still proportionate. Share of voice against named competitors is tracked on the same conversations.',
    },
    {
      key: 'investigate',
      name: 'Investigate',
      body: `Complaints are clustered by location and subject, so a fault appearing in one region reads as a pattern rather than as scattered posts. Activity is attributed as organic or coordinated from account age, posting cadence and repeated phrasing [${PS}: attribution thresholds].`,
    },
    {
      key: 'manage',
      name: 'Manage',
      body:
        'A cluster becomes a response case with an owner, a state and a record of what was said publicly and when. Time from detection to first response is recorded against each case.',
    },
  ],

  modules: [
    {
      name: 'Viral risk scoring',
      body:
        'A conversation is scored on how fast it is accelerating, not how large it currently is — so a thread can be flagged before it is widely visible. The score names the accounts and posts carrying it, so a team can see whether the growth is coming from many people or a few large ones.',
    },
    {
      name: 'Location clustering of complaints',
      body:
        'Complaints are grouped by location and subject rather than listed chronologically. A fault reported by unrelated people in one region resolves into a single cluster with a location, a subject and a count of distinct accounts, which is the form a product or operations team can act on.',
    },
    {
      name: 'Organic versus coordinated attribution',
      body: `Criticism is attributed as organic or coordinated using account age, posting cadence, repeated phrasing and burst timing [${PS}: attribution thresholds]. The two are reported separately, so a coordinated push is not mistaken for consumer sentiment and genuine complaints inside it are not dismissed as bots.`,
    },
    {
      name: 'Crisis response workflow',
      body:
        'A cluster or scored conversation opens a case with an owner and a state. Public statements made in response are attached to the case with their timestamps, and time from detection to first response is recorded — so a post-incident review reads from the record rather than from memory.',
    },
  ],

  signature: {
    line: 'From scattered posts to one cluster with an owner.',
    body:
      'A complaint cluster carries its location, its subject, the accounts behind it and whether the activity is organic or coordinated. That is enough for a communications team to decide whether to answer, and enough for a product team to decide whether there is something to fix.',
  },

  scenarios: [
    {
      name: 'A fault with a postcode',
      body:
        'Individually unremarkable complaints about the same product behaviour arrive over two days from unrelated accounts. Clustered by location and subject, they resolve into one region and one fault description. The cluster reaches the operations team as a pattern with a location, rather than as a rising count of tickets.',
    },
    {
      name: 'A push that was not a public',
      body:
        'Criticism of a campaign accelerates sharply. Attribution splits it: a majority of the volume comes from accounts created within a short window repeating near-identical phrasing, while a smaller organic group raises one specific and different objection. The coordinated volume is reported separately, and the response addresses the real objection instead of the noise.',
    },
  ],

  deployment: [
    `SAGA is deployed as [${PS}: deployment model], with hosting location and retention periods set per deployment [${PS}]. Access is bounded by role and scoped to the brands, markets or subjects a user is responsible for [${PS}: role names], and every search, export and case action is written to an immutable audit trail.`,
  ],

  faqs: [
    {
      q: 'How early is "pre-viral"?',
      a: 'Scoring is based on rate of acceleration rather than size, so a conversation can be flagged while it is still small. The score names the posts and accounts driving the growth, so a team can judge for itself whether the trajectory is real.',
    },
    {
      q: 'How is a complaint cluster different from a mention count?',
      a: 'A cluster carries a location, a subject and the number of distinct accounts raising it. A mention count tells you volume; a cluster tells you what is wrong and where, which is the form an operations or product team can act on.',
    },
    {
      q: 'Can you tell a coordinated attack from real criticism?',
      a: `Activity is attributed using account age, posting cadence, repeated phrasing and burst timing [${PS}: attribution thresholds], and the organic and coordinated portions are reported separately rather than combined. Both can be present in the same conversation, and treating one as the other is the common failure.`,
    },
    {
      q: 'What is recorded during a crisis response?',
      a: 'The case owner, the state, the public statements attached with their timestamps, and the time from detection to first response — written to an immutable audit trail so a post-incident review reads from the record.',
    },
  ],
};
