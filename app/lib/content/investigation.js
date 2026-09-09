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
  hero: {
    eyebrow: 'Investigation',
    title: 'You have a handle, an image or a number. What comes back.',
    body:
      'SAGA’s investigation tools resolve identifiers into records: a username into accounts across sources, an image into coordinates and a capture time, a clip into a verdict with a frame-level breakdown. Each returns what it found, what it did not, and the time it looked — because an investigator needs the gaps as much as the hits.',
  },

  soceye: {
    eyebrow: 'SOC-EYE',
    title: 'Ask the collected material a question.',
    lead:
      'SOC-EYE queries what the deployment has already collected. It is not a search of the open internet and it does not reach beyond the records the platform holds — which is precisely why its answers can be traced.',
    body: [
      'A question is asked in plain language — an account, a term, a location, a date range, or a combination — and the answer returns as the matching records with their sources, capture times and the accounts behind them. The answer cites the records it was built from, so an investigator reads evidence rather than a summary they would have to take on trust.',
      'Because it runs over collected records rather than a live crawl, SOC-EYE inherits the boundaries of the deployment: it can only answer from what collection retained, within the retention window, and within the scope the asking user’s role permits. A question outside that scope returns nothing rather than reaching for it.',
      `Queries are audited like any other access: the user, the question, the time and the records returned [${PS}: read-logging]. A question asked is an event in the audit trail, not a silent lookup.`,
    ],
  },

  tools: {
    eyebrow: 'Tools',
    title: 'What each one takes, and what it gives back.',
    items: [
      {
        name: 'Deepfake detection',
        takes: 'A video or image',
        gives:
          'One of four verdicts — Real, Fake, Suspicious or Needs Review — with a confidence figure and a frame-level breakdown showing which frames drove the result.',
        limit:
          'Needs Review is a real outcome, not an error. It is returned when the evidence does not support a verdict, and it routes to a person rather than reporting a decision the model cannot stand behind.',
      },
      {
        name: 'OSINT username enumeration',
        takes: 'A username or handle',
        gives:
          'The accounts carrying that handle across sources, with the profile details visible at the time of the check and the time the check was run.',
        limit:
          'A match on a handle is a match on a string, not proof of a shared owner. The result is a set of candidates for an investigator to weigh, and the sources searched are [pending].',
      },
      {
        name: 'EXIF and location extraction',
        takes: 'An image file',
        gives:
          'GPS coordinates, capture timestamp, and device make and model where the metadata is present, alongside the original file preserved unmodified.',
        limit:
          'Most platforms strip EXIF on upload. An image saved from a social platform will usually carry nothing; one received as a file often still does. The tool reports metadata absent rather than inferring a location.',
      },
      {
        name: 'Email and phone intelligence',
        takes: 'An email address or phone number',
        gives:
          'The accounts and public records associated with the identifier where such an association is visible, with the time of the check recorded.',
        limit: `Returns are uneven by identifier type and by region, and an empty result is a statement about visibility rather than about existence [${PS}: sources and coverage for this tool].`,
      },
      {
        name: 'Cross-platform search',
        takes: 'A term, an entity or a date range',
        gives:
          'Matching records from every source the deployment collects, in one result set, with each item carrying its source, its capture time and the account that posted it.',
        limit:
          'Search covers what collection retained, not the open internet. The window is the deployment’s retention period, and the sources are [pending].',
      },
    ],
  },

  chain: {
    eyebrow: 'Working the record',
    title: 'One identifier, one file.',
    body: [
      'Results from every tool attach to the same person-of-interest record. An enumerated username, a set of EXIF coordinates, a deepfake verdict and a cross-platform result are held against one entity and, where a case exists, one FIR number — so an investigator reads a file rather than reconciling five exports.',
      'Every check is recorded with the identifier submitted, the tool used, the user who ran it and the time. That record exists whether or not the check returned anything, which is what makes a negative result usable later: it shows that the question was asked, and when.',
      'Captured material is stored with its original metadata and its capture time. Timestamped capture with metadata alongside an immutable audit trail is what supports evidence-grade workflows — the platform records what was collected and when, and the department’s own process determines what is done with it.',
    ],
  },

  faqs: [
    {
      q: 'Does SOC-EYE search the internet?',
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
      q: 'Is a search recorded even when it finds nothing?',
      a: `Yes — the identifier submitted, the tool, the user and the time are recorded regardless of the result [${PS}: read-logging]. A recorded negative is often the point: it establishes that the question was asked and when.`,
    },
  ],
};
