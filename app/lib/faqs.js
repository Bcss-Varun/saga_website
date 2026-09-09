/* All six FAQ entries from Saga.html, carried across unchanged.

   The homepage shows platform-level questions only (CLAUDE.md: 4–5 of them);
   the rest move to the vertical pages, which is where a reader asking
   "who is this for" and "what would my team do with it" actually is.
   Nothing is discarded — `scope` records where each belongs.

   The original numbered these 01–06. A list of questions is not a sequence,
   so the indices are dropped per CLAUDE.md.

   [copy: needs specificity rewrite] */

export const FAQS = [
  {
    scope: 'platform',
    q: 'What is SAGA?',
    a: 'SAGA is an AI-powered intelligence platform that analyzes digital conversations and signals to help organizations understand what is happening, why it matters, and where attention is needed.',
  },
  {
    scope: 'platform',
    q: 'What does SAGA analyze?',
    a: 'SAGA analyzes signals such as sentiment, intent, narratives, trends, threats, entities, relationships, and context across digital conversations.',
  },
  {
    scope: 'platform',
    q: 'How does SAGA identify important signals?',
    a: 'SAGA brings together patterns across conversations and activity to surface emerging issues, changes, relationships, and signals that may require attention.',
  },
  {
    scope: 'platform',
    q: 'Does SAGA replace existing workflows?',
    a: 'No. SAGA is designed to add intelligence to existing workflows, helping teams move from signals and analysis to clearer decisions and action.',
  },
  {
    scope: 'vertical',
    q: 'Who is SAGA for?',
    a: 'SAGA is designed for organizations working across public policy, public safety, brands and enterprises, and infrastructure and institutions.',
  },
  {
    scope: 'vertical',
    q: 'What can teams use SAGA for?',
    a: 'Teams can use SAGA to understand public response, identify emerging narratives, monitor potential risks, investigate signals, and support informed decisions.',
  },
];

export const PLATFORM_FAQS = FAQS.filter((f) => f.scope === 'platform');
