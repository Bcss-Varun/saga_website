/* /investigation — authored content. [draft — needs review] on every string.

   Reader: an investigating officer. Someone who has a username, an image or a
   phone number and needs to know what the tool will return for it, and how
   much of that return can be relied on.

   That reader is best served by stating the shape of the output and the
   conditions under which it is empty. A tool that says what it cannot resolve
   is more useful to an investigation than one that implies it always can, so
   the failure conditions are written next to the capabilities rather than
   omitted.

   Claims discipline: no counts, no client names, no accuracy figures, no
   platform coverage list. No legal claims — these are evidence-grade workflows,
   not admissibility promises. */

const PS = 'pending sign-off';

export const investigation = {
  /* Replaced 2026-09-10 on request, with supplied copy. The previous headline
     opened on what the tools return — "you have a handle, an image or a
     number" — and the mechanism it named survives further down the page in the
     tools section, so nothing was lost by leading on the trail instead. */
  hero: {
    eyebrow: 'Investigation',
    title: 'Start with a clue.',
    lit: 'Find what connects to it.',
    body:
      'SAGA turns fragmented digital information into an investigation trail — connecting people, accounts, content, locations, activity and evidence across sources.',
  },

  /* ── how SAGA investigates ────────────────────────────────────────────
     Replaced the AI assistance section on 2026-09-10 with supplied copy. Three
     stages, so they keep their indices — find, connect, build is a genuine
     sequence, which is the test CLAUDE.md sets for numbering anything.

     The boundary statements that used to sit here are the ones CLAUDE.md
     protects: that it queries collected records rather than the open internet,
     that a question outside scope returns nothing, and that a query is an event
     in the audit trail. They are not lost — the FAQ below carries all three,
     including the `[pending sign-off: read-logging]` marker, which is
     APPROVALS item 1 and the single most load-bearing sentence on this page
     for a government buyer. If that FAQ is ever trimmed, this copy has to take
     the statements back. */
  workflow: {
    eyebrow: 'How SAGA investigates',
    title: 'One signal can reveal a much bigger picture.',
    lead:
      'Blura SAGA connects related digital signals, entities and activity to give investigators the context behind what they find. Instead of reviewing isolated results, investigators can follow the relationships between them.',
    steps: [
      {
        n: '01',
        name: 'Find the signal',
        body:
          'Start with a digital clue such as an account, keyword, image, location or piece of content. Blura SAGA identifies relevant signals and brings the surrounding context into view.',
      },
      {
        n: '02',
        name: 'Connect the context',
        body:
          'Link related accounts, content, entities and activity to reveal relationships, coordinated behaviour and emerging patterns that may not be visible from a single signal.',
      },
      {
        n: '03',
        name: 'Build the intelligence',
        body:
          'Combine the relevant findings into a structured investigative picture, with source context and evidence that can support further investigation and reporting.',
      },
    ],
  },

  /* ── the tool catalogue ───────────────────────────────────────────────
     Replaced 2026-09-10 on request, with supplied copy and a supplied
     reference. Twelve tools in three categories: OSINT, deepfake, global
     search.

     What it replaced was the Takes / Returns / Limits cards, and those carried
     the limitation statements CLAUDE.md rules out of any pass that would cut
     them — Needs Review is a real outcome, a handle match is a string match,
     most platforms strip EXIF, coverage is uneven by identifier and region,
     and search covers what collection retained rather than the open internet.
     The new copy states none of them. They are not cut: all five are in the
     FAQ below, which is where the AI assistance boundary statements went for the
     same reason. If that FAQ is trimmed, these cards have to take them back.

     Two lines of the supplied copy were written to be careful and are kept
     careful. The legal mapping engine maps and classifies against defined
     categories; it does not determine that content is criminal. The sentiment
     tool classifies across monitored sources, which is a class and not the
     coverage list CLAUDE.md holds as unresolved. No card states a count, an
     accuracy figure or a platform name. */
  tools: {
    eyebrow: 'Investigation tools',
    title: 'Specialised tools for deeper digital investigation.',
    lead:
      'Blura SAGA brings identity intelligence, media analysis and contextual search together to help investigators move from digital signals to actionable intelligence.',
    categories: [
      {
        key: 'osint',
        descriptor: 'Open Source Intelligence',
        name: 'OSINT',
        icon: 'search',
        title: 'Explore open-source intelligence.',
        lead:
          'Investigate digital identities, connections and visual information across available sources.',
        items: [
          {
            icon: 'person',
            name: 'Username Intelligence',
            lead: 'Identify digital identities.',
            body:
              'Investigate usernames across available sources to discover related profiles, activity and contextual signals.',
            capability: 'Identity & profile intelligence',
          },
          {
            icon: 'inbox',
            name: 'Email Intelligence',
            lead: 'Investigate an email address.',
            body:
              'Analyse an email identifier to uncover available digital signals, associated information and relevant investigative context.',
            capability: 'Email-based intelligence',
          },
          {
            icon: 'network',
            name: 'Cross-Platform Search',
            lead: 'Follow a signal across platforms.',
            body:
              'Search for related usernames, identifiers and content across multiple platforms to uncover connections that may be missed in a single source.',
            capability: 'Cross-platform intelligence',
          },
          {
            icon: 'image',
            name: 'Image Intelligence',
            lead: 'Investigate what an image reveals.',
            body:
              'Analyse images to identify available visual and contextual signals that can support identification and investigation.',
            capability: 'Visual intelligence',
          },
        ],
      },
      {
        key: 'deepfake',
        descriptor: 'Media Verification',
        name: 'Deepfake',
        icon: 'play',
        title: 'Examine digital media for authenticity.',
        lead:
          'Analyse suspicious media and identify signals associated with manipulated or synthetic content.',
        items: [
          {
            icon: 'video',
            name: 'Video Intelligence',
            lead: 'Analyse video beyond what you see.',
            body:
              'Examine video content for manipulation and authenticity signals to help investigators assess suspicious or potentially synthetic media.',
            capability: 'Video & deepfake intelligence',
          },
        ],
      },
      {
        key: 'global',
        descriptor: 'Advanced Intelligence Search',
        name: 'Global Search',
        icon: 'globe',
        title: 'Search across the intelligence landscape.',
        lead:
          'Combine keywords, identities, sentiment and context to uncover the information behind a signal.',
        items: [
          {
            icon: 'search',
            name: 'Username Search',
            lead: 'Search by digital identity.',
            body:
              'Find relevant usernames and associated signals across available intelligence sources to build a broader investigative picture.',
            capability: 'Identity search',
          },
          {
            icon: 'chat',
            name: 'Context Search',
            lead: 'Search for meaning, not just keywords.',
            body:
              'Use contextual and keyword-based searches to discover relevant conversations, narratives, entities and associated intelligence.',
            capability: 'Contextual intelligence',
          },
          {
            icon: 'chip',
            name: 'SAGA AI Assistance',
            lead: 'Ask SAGA to make sense of the signal.',
            body:
              'Use AI-assisted analysis to explore information, identify relevant context and accelerate investigative understanding.',
            capability: 'AI-assisted investigation',
          },
          {
            icon: 'mood',
            name: 'Sentiment Analysis',
            lead: 'Understand how people are responding.',
            body:
              'Analyse positive, neutral and negative sentiment to identify shifts in public opinion around people, topics, events and narratives across the sources a deployment monitors.',
            capability: 'Sentiment & narrative intelligence',
          },
          {
            icon: 'filter',
            name: 'Exclusion Engine',
            lead: 'Filter out what does not matter.',
            body:
              'Apply exclusion rules to refine results, reduce irrelevant signals and keep investigations focused on meaningful information.',
            capability: 'Precision filtering',
          },
          {
            icon: 'scales',
            name: 'Legal Mapping Engine',
            lead: 'Connect digital signals to legal context.',
            body:
              'Map relevant content to defined legal categories and indicators, helping investigators assess signals such as hate speech and other applicable sections. SAGA maps and classifies; the determination remains the department\u2019s.',
            capability: 'Legal intelligence mapping',
          },
          {
            icon: 'megaphone',
            name: 'Grievance Management',
            lead: 'Turn grievances into actionable intelligence.',
            body:
              'Capture and analyse public complaints to identify recurring issues, emerging concerns and signals requiring attention, with escalation to the team that owns them.',
            capability: 'Grievance intelligence',
          },
        ],
      },
    ],
  },

  /* ── investigation context ───────────────────────────────────────────
     Replaced 2026-09-11 on request, with supplied copy. Three cards: one
     record, trace, ready for investigation.

     Two statements the previous copy carried did not survive into it, and both
     are ones this brief protects. Every check being recorded with the
     identifier, the tool, the user and the time is in the FAQ below, with its
     `[pending sign-off: read-logging]` marker, which is APPROVALS item 1.
     Timestamped capture with metadata alongside an immutable audit trail —
     the phrasing the no-legal-claims rule requires in place of
     "court-admissible" — is now a FAQ entry too. If either is trimmed from
     there, this copy has to take it back.

     The new copy is written a level more general than the mechanism register
     CLAUDE.md asks for: "structured intelligence for investigation, review and
     reporting" would describe most tools in this market. It is published as
     supplied; the specificity is carried by the tools section above it. */
  chain: {
    eyebrow: 'Investigation context',
    title: 'Every finding stays connected to its source.',
    lead:
      'Blura SAGA keeps the signals, relationships and evidence behind an investigation together, so investigators can understand where a finding came from and how it connects to the wider case.',
    items: [
      {
        n: '01',
        name: 'One investigative record',
        lead: 'Keep related findings together.',
        body:
          'Signals from different investigation tools can be connected to the relevant person, account, content, location or event, giving investigators one contextual view instead of disconnected results.',
      },
      {
        n: '02',
        name: 'Trace every finding',
        lead: 'Know where every result came from.',
        body:
          'Blura SAGA preserves the source and context behind investigative findings, making it easier to review how a result was identified and follow it back to the underlying information.',
      },
      {
        n: '03',
        name: 'Ready for investigation',
        lead: 'Turn findings into usable intelligence.',
        body:
          'Relevant findings can be organised into structured intelligence for investigation, review and reporting, while preserving the context needed to understand the finding.',
      },
    ],
  },

  faqs: [
    {
      q: 'Does Blura SAGA AI assistance search the open internet?',
      a: 'No. It queries the records the deployment has already collected, within the retention window and within the asking user’s scope. That boundary is the reason its answers can be traced back to specific records.',
    },
    {
      q: 'What does a Needs Review verdict mean?',
      a: 'That the evidence does not support Real, Fake or Suspicious. It is returned deliberately, with the confidence figure and frame-level breakdown, and routed to a person. It is not a failure to process the file.',
    },
    {
      q: 'Why did EXIF extraction return nothing?',
      a: 'Most platforms strip EXIF when an image is uploaded, so an image saved from social media usually carries no metadata. A file received directly often retains it. The tool reports the metadata as absent rather than estimating a location.',
    },
    {
      q: 'Is a username match proof of the same person?',
      a: 'No. It is a match on a string across sources, and it is returned as a set of candidates with the profile details and the time of the check. The judgement remains the investigator’s.',
    },
    {
      q: 'Why is a result empty for one identifier and full for another?',
      a: `Returns are uneven by identifier type and by region. An empty result is a statement about what is visible to the deployment, not about whether something exists [${PS}: sources and coverage by tool].`,
    },
    {
      q: 'Do the search tools reach the open internet?',
      a: 'No. They cover what the deployment has already collected and retained, within the retention window and within the asking user\u2019s scope, and the sources collected are [pending]. That boundary is why a result can be traced back to specific records.',
    },
    {
      q: 'How is captured material held?',
      a: 'With its original metadata and its capture time. Timestamped capture with metadata alongside an immutable audit trail is what supports evidence-grade workflows: the platform records what was collected and when, and the department’s own process determines what is done with it.',
    },
    {
      q: 'Is a search recorded even when it finds nothing?',
      a: `Yes — the identifier submitted, the tool, the user and the time are recorded regardless of the result [${PS}: read-logging]. A recorded negative is often the point: it establishes that the question was asked and when.`,
    },
  ],
};
