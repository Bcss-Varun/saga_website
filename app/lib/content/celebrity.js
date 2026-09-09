/* /celebrity — authored content. [draft — needs review] on every string.

   Medium depth: 4 capability modules, 2 scenarios, 4 FAQ, short deployment
   note. The deck's four capabilities map one-to-one onto the four slots. */

const PS = 'pending sign-off';

export const celebrity = {
  hero: {
    title: 'Which audience is saying it, and whether they are people.',
    body:
      'SAGA separates sentiment by context rather than reporting one figure, scores attack activity for bot and troll characteristics, identifies the communities and individual advocates carrying support, and tracks endorsement risk across a rolling six-month window — so a team can tell a bad week from a real shift.',
  },

  triad: [
    {
      key: 'monitor',
      name: 'Monitor',
      body:
        'Sentiment is reported by context — a role, a release, an appearance, a controversy — rather than as one blended figure, because the same person can be praised in one context and criticised in another on the same day.',
    },
    {
      key: 'investigate',
      name: 'Investigate',
      body: `Attack activity is scored for bot and troll characteristics: account age, posting cadence, repeated phrasing and burst timing [${PS}: scoring thresholds]. The score separates a coordinated push from a broad negative reaction.`,
    },
    {
      key: 'manage',
      name: 'Manage',
      body: `Communities carrying support are identified along with the individual advocates inside them. Endorsement risk is tracked across a rolling six-month window [${PS}: window length] so a commercial decision can be made against a trend rather than a snapshot.`,
    },
  ],

  modules: [
    {
      name: 'Sentiment separated by context',
      body:
        'Sentiment is reported per context — a specific role, release, appearance or controversy — instead of as a single number. A public figure can be strongly positive on one and negative on another at the same moment, and a blended figure hides exactly the movement worth acting on.',
    },
    {
      name: 'Bot and troll attack scoring',
      body: `Attack activity is scored on account age, posting cadence, repeated phrasing and burst timing [${PS}: scoring thresholds]. The output separates coordinated activity from organic criticism and reports them apart, so a manufactured pile-on is not read as public opinion.`,
    },
    {
      name: 'Fan communities and advocates',
      body:
        'Communities carrying sustained positive conversation are identified, along with the individual accounts inside them whose posts are repeatedly amplified by others. Support is described as specific communities and named-by-handle advocates, not as a follower total.',
    },
    {
      name: 'Endorsement risk',
      body: `Sentiment relevant to a commercial association is tracked across a rolling six-month window [${PS}: window length], so a brand decision is made against a trend line with its driving events named, rather than against the state of one week.`,
    },
  ],

  signature: {
    line: 'A bad week and a real shift do not look the same.',
    body:
      'Context-separated sentiment, an attack score and a rolling endorsement window answer three different questions: what is being criticised, whether the criticism is people, and whether the direction has actually changed. Reported as one number, all three are invisible.',
  },

  scenarios: [
    {
      name: 'A pile-on that was not an audience',
      body:
        'Negative posts about a public figure rise sharply within a few hours. Attack scoring finds most of the volume in accounts created within a short window, posting near-identical phrasing on a tight cadence. A separate and much smaller organic group raises one specific criticism. The team answers the real point and does not dignify the rest.',
    },
    {
      name: 'One role, not one person',
      body:
        'Blended sentiment for a public figure falls over a fortnight. Separated by context, the decline sits almost entirely in reaction to a single project, while sentiment on their other work and public appearances is unchanged. The endorsement window shows no movement in the commercially relevant conversation.',
    },
  ],

  deployment: [
    `SAGA is deployed as [${PS}: deployment model], with hosting location and retention periods set per deployment [${PS}]. Access is bounded by role and scoped to the individuals or subjects a user is responsible for [${PS}: role names], and every search, export and case action is written to an immutable audit trail.`,
  ],

  faqs: [
    {
      q: 'Why separate sentiment by context?',
      a: 'Because a single figure averages away the thing worth knowing. A public figure can be strongly positive on one project and negative on another simultaneously; blended, both disappear and the number moves for reasons nobody can name.',
    },
    {
      q: 'How do you score an attack?',
      a: `On account age, posting cadence, repeated phrasing and burst timing [${PS}: scoring thresholds]. Coordinated and organic activity are reported separately, because a manufactured pile-on and a genuine criticism frequently arrive together.`,
    },
    {
      q: 'What counts as an advocate?',
      a: 'An account inside a supportive community whose posts are repeatedly amplified by others in that community. Advocates are identified individually rather than inferred from follower counts, which measure reach rather than influence.',
    },
    {
      q: 'What does endorsement risk actually track?',
      a: `Sentiment in the conversation relevant to a commercial association, across a rolling six-month window [${PS}: window length], with the events driving each movement named. It is a trend with causes attached, not a score on its own.`,
    },
  ],
};
