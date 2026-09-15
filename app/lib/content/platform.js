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
   platform coverage list.

   ── Restructured 2026-09-10, to the twelve-block brief ─────────────────────
   The page was four stages, architecture, RSS engine, languages and access
   control. It is now: the core idea, five intelligence layers, the
   signal-to-intelligence sequence, the record, the alert, the chain, security,
   CTA. The console and missions blocks were removed on request. Reformatted, not diluted — the pipeline
   copy became the sequence, the RSS weighting became a layer, the record
   architecture became the alert section's argument, and access control folded
   into security with the detail carried to /trust.

   The languages block was removed on request the same day. Its limitation
   statement survives in the FAQ, because per CLAUDE.md a limitation that earns
   credibility is reformatted rather than cut.

   Three things in the brief could not be published as written and are marked
   instead of invented:
     · the source lists (X, Facebook, Instagram, YouTube; News, Forums,
       Communities, Grievances) — the coverage list is unresolved, so the flow
       names the source classes and marks the list [pending];
     · the alert figures (1,240 signals, 91% confidence, a detection time) —
       a figure inside a picture of a product asserts itself harder than the
       same figure in a headline, so each is a redaction bar;
     · the cipher and protocol names (AES-256, TLS 1.3) and the tier labels —
       neither is approved anywhere on this site today. */

const PS = 'pending sign-off';

export const platform = {
  /* ── 1. hero ──────────────────────────────────────────────────────────── */
  hero: {
    eyebrow: 'Blura SAGA platform',
    title: 'From millions of digital signals to',
    lit: 'intelligence you can act on.',
    body:
      'SAGA continuously monitors public digital signals, understands what is being said, detects emerging threats and narratives, and turns them into structured intelligence for faster, more informed decisions.',
    imageAlt:
      'An analyst at a workstation, facing a glowing globe ringed with panels for public sentiment, policies and schemes, data insights, emerging trends and potential risks.',
  },

  /* ── 2. the core idea ─────────────────────────────────────────────────── */
  core: {
    eyebrow: 'How SAGA thinks',
    title: 'The internet is full of signals. SAGA finds the ones that matter.',
    lead:
      'Conversations, news, narratives, grievances, emerging threats and coordinated activity appear across digital channels every day. SAGA brings these signals together, understands their context and transforms them into intelligence that can be investigated, monitored and acted upon.',
    /* Four stages, each with an icon head and the things it actually carries.

       The stage lists name source *classes* — social media, news and media,
       online communities, grievances — and not one platform. That is what
       makes this block publishable: CLAUDE.md records the coverage list as
       unresolved, and a class is not a list. The footer says the same thing in
       words, so a reader is told coverage is configured per deployment rather
       than left to infer a list that is not there. */
    flow: {
      stages: [
        {
          n: '01',
          name: 'Digital signals',
          sub: 'What enters SAGA',
          icon: 'people',
          items: [
            { name: 'Social media', body: 'Public posts, accounts, replies', icon: 'chat' },
            { name: 'News and media', body: 'News, RSS, articles', icon: 'news' },
            { name: 'Online communities', body: 'Forums, groups, discussions', icon: 'people' },
            { name: 'Grievances', body: 'Citizen inputs and open sources', icon: 'inbox' },
          ],
        },
        {
          n: '02',
          name: 'AI understanding',
          sub: 'How SAGA makes sense of it',
          icon: 'chip',
          items: [
            { name: 'Language identification', body: 'Multi-lingual NLP', icon: 'translate' },
            { name: 'Sentiment analysis', body: 'Tone, emotion and intent', icon: 'mood' },
            { name: 'Entity detection', body: 'People, organisations, places', icon: 'person' },
            { name: 'Media analysis', body: 'Images, video, deepfake detection', icon: 'image' },
          ],
        },
        {
          n: '03',
          name: 'Intelligence',
          sub: 'What SAGA discovers',
          icon: 'chart',
          items: [
            { name: 'Threats', body: 'Risks, incitement, harmful content', icon: 'shield' },
            { name: 'Narratives', body: 'Emerging themes and stories', icon: 'news' },
            { name: 'Networks', body: 'Connected accounts and influence', icon: 'network' },
            { name: 'Trends', body: 'Shifts over time and by location', icon: 'trend' },
          ],
        },
        {
          n: '04',
          name: 'Action',
          sub: 'What teams receive',
          icon: 'target',
          items: [
            { name: 'Real-time alerts', body: 'Issues requiring attention', icon: 'bell' },
            { name: 'Intelligence reports', body: 'Analytical and executive summaries', icon: 'news' },
            { name: 'Evidence', body: 'Timestamped, auditable records', icon: 'store' },
            { name: 'Response', body: 'For investigation, monitoring or action', icon: 'send' },
          ],
        },
      ],
      foot: {
        name: 'Coverage is configurable',
        body:
          'Platforms, languages and sources are configured to the operational requirement of each deployment.',
        link: { href: '/trust', label: 'Learn more' },
      },
    },
  },

  /* ── 4. five intelligence layers ──────────────────────────────────────
     Five cards, alternating side to side. Each carries an index, the layer's
     full name as a kicker, a short headline, one paragraph and a link on.

     The headlines are the short forms from the approved reference; the
     paragraphs stay at mechanism level, because the reference's copy
     ("analyse public sentiment and key themes") is the vague register
     CLAUDE.md exists to keep off this site. The two pending markers that used
     to sit in bullet lists are folded into the paragraphs rather than dropped
     with the lists.

     `art` is the illustration for the right-hand half. It is null until the
     supplied icons land in `public/images/layers/`; while it is null the card
     draws the built-in schematic named by `visual` instead, so the section is
     complete either way. */
  layers: {
    eyebrow: 'Intelligence layers',
    title: 'See beyond the signal.',
    lead:
      'Five layers read the same record. Each one answers a different question about it, and each keeps the inputs that produced its answer.',
    items: [
      {
        id: 'sentiment',
        n: '01',
        kicker: 'Sentiment and narrative intelligence',
        headline: 'Understand what people are saying.',
        body:
          'Tone, sentiment and narrative shift are scored per record rather than per account, and themes are clustered by shared phrasing rather than by keyword alone. Change is measured against the preceding window, so a shift is visible as a shift.',
        link: { href: '/governance', label: 'Learn more' },
        visual: 'sentiment',
        art: '/images/layers/sentiment.webp',
      },
      {
        id: 'threat',
        n: '02',
        kicker: 'Threat and escalation intelligence',
        headline: 'Detect and prioritise emerging risks.',
        body:
          `Threat language, incitement and suspicious activity are flagged with the matching text kept, and escalation runs four tiers on velocity and reach [${PS}: tier labels]. A tier change is an event on the record, not a silent overwrite.`,
        link: { href: '/public-safety', label: 'Learn more' },
        visual: 'escalation',
        art: '/images/layers/threat.webp',
      },
      {
        id: 'network',
        n: '03',
        kicker: 'Coordinated campaign and network intelligence',
        headline: 'See the connections behind the narrative.',
        body:
          `Relationships between accounts, content and narratives are mapped to expose coordinated amplification and influence. Attribution comes from account age, posting cadence, repeated phrasing and burst timing [${PS}: attribution thresholds].`,
        link: { href: '/investigation', label: 'Learn more' },
        visual: 'network',
        art: '/images/layers/network.webp',
      },
      {
        id: 'geo',
        n: '04',
        kicker: 'Geo-spatial intelligence',
        headline: 'Know where activity is emerging.',
        body:
          'Digital signals become geographic intelligence: each area scored on a 0–100 scale across five levels, driven by issue velocity. Spread reads as a sequence of areas over time rather than one heat picture, and every level carries its name beside the colour.',
        link: { href: '/governance', label: 'Learn more' },
        visual: 'geo',
        art: '/images/layers/geo.webp',
      },
      {
        id: 'evidence',
        n: '05',
        kicker: 'Evidence and intelligence outputs',
        headline: 'Turn analysis into actionable intelligence.',
        body:
          'Structured alerts, analytical reports and evidence packages carry their original sources: timestamped capture with metadata, an immutable audit trail and the context around the record. A brief carries its records, so the reader can check the finding.',
        link: { href: '/trust', label: 'Learn more' },
        visual: 'dossier',
        art: '/images/layers/evidence.webp',
      },
    ],
  },

  /* ── 5. signal to intelligence ────────────────────────────────────────── */
  journey: {
    eyebrow: 'The sequence',
    title: 'From signal to intelligence.',
    lead:
      'A genuine sequence, which is why these carry numbers. Every record keeps its origin from the first step onward, so a score at the end can be opened back to the post it came from.',
    steps: [
      {
        n: '01',
        name: 'Detect',
        body:
          'Public signals enter continuously. Watchlist terms and tracked entities decide what is retained; an item that matches nothing is not kept.',
      },
      {
        n: '02',
        name: 'Understand',
        body:
          'Language identification, sentiment, entity extraction and media analysis determine context and meaning. Near-identical reposts collapse to one record.',
      },
      {
        n: '03',
        name: 'Connect',
        body:
          'Narratives, accounts, locations and events are linked to expose patterns. An entity is held once and resolved across sources, not stored three times.',
      },
      {
        n: '04',
        name: 'Predict',
        body:
          'Escalation, virality and emerging risk are scored from velocity, reach and attribution. The inputs stay attached, so a score can be argued with.',
      },
      {
        n: '05',
        name: 'Act',
        body:
          'Alerts, reports and evidence packages reach the people responsible for response. Ownership, acknowledgement and closure are recorded against the record.',
      },
    ],
  },

  /* ── 6. what SAGA sees ──────────────────────────────────────────────
     The record and the context held against it. Ten types, each with what it
     actually contributes, laid out around the signal itself.

     The labels are real text, not part of the illustration. Only the globe in
     the middle and the wave artwork at the edges are image; a label that lives
     inside a picture cannot be read aloud, searched, translated or reflowed on
     a phone, and CLAUDE.md rules out content that exists only in a graphic
     layer. */
  context: {
    eyebrow: 'The record',
    title: 'SAGA does not just monitor content. It connects the context around it.',
    lead:
      'A post on its own is an opinion. The same post with its account history, its location, its narrative, its timing and the entities it names is intelligence. SAGA holds the second thing.',
    centreTop: 'Digital',
    centreMain: 'Signal',
    left: [
      { name: 'Time', body: 'When it happened, what else was happening', icon: 'clock' },
      { name: 'Media', body: 'Images, video, other content', icon: 'image' },
      { name: 'Organisation', body: 'Linked entities, networks', icon: 'network' },
      { name: 'Threat', body: 'Relevant risks, past incidents', icon: 'shield' },
      { name: 'Sentiment', body: 'Tone, emotion, how it changed', icon: 'mood' },
    ],
    right: [
      { name: 'Account', body: 'Account history, associated accounts', icon: 'store' },
      { name: 'Person', body: 'Author, affiliations, past behaviour', icon: 'person' },
      { name: 'Location', body: 'Where it originated, where it spread', icon: 'pin' },
      { name: 'Narrative', body: 'Key themes, related conversations', icon: 'news' },
      { name: 'Event', body: 'Related events, broader situation', icon: 'calendar' },
    ],
    note: 'Illustrative. The entity-resolution graphic is [pending sign-off].',
  },

  /* ── 7. the alert ─────────────────────────────────────────────────────
     The object the reader is told arrives instead of a dashboard, so it has to
     look like one — and so every counted value on it is a redaction bar.

     The supplied render for this section states a risk level, a confidence
     figure and four counts. None is approved. A figure inside a picture of a
     product asserts itself harder than the same figure in a headline, which is
     APPROVALS item 0, so the card is rebuilt here from the render's layout with
     its values withheld. Only the render's thread and glow are used as image. */
  alert: {
    eyebrow: 'Delivery',
    title: 'Intelligence arrives as an alert — not another dashboard to check.',
    lead:
      'The unit is the record, not the chart. An alert is a query over records that still exist individually, which is why any figure on it opens back to the items that produced it.',
    /* ── the alert card ──────────────────────────────────────────────────
       Drawn in HTML rather than shipped as the render, so the type is crisp at
       any zoom and on any screen, and so it reflows on a phone.

       **The figures below are unapproved.** High Risk, 87%, 248, 18, 6 and 3
       come from the supplied render and no owner has confirmed any of them.
       They are published at the client's explicit and repeated instruction —
       see the BLOCKER at the top of item 6b in copy/APPROVALS.md, which is
       where this is resolved before launch. Now that they are text rather than
       pixels the claims sweep can at least see them; they are listed in its
       allowlist against that blocker. */
    card: {
      tier: 'Priority tier',
      headline: 'Coordinated narrative detected',
      sub: 'Multiple signals indicate a connected pattern.',
      stats: [
        { value: 'High Risk', label: 'Risk level', crit: true },
        { value: '87%', label: 'Confidence' },
        { value: '248', label: 'Signals' },
      ],
      counts: [
        { value: '18', label: 'Accounts', icon: 'people' },
        { value: '6', label: 'Locations', icon: 'pin' },
        { value: '3', label: 'Narratives', icon: 'news' },
      ],
      action: 'View intelligence',
    },
    containsLabel: 'What the alert contains',
    contains: [
      {
        name: 'What happened',
        body: 'The detected activity, with the records that raised it.',
        icon: 'news',
      },
      {
        name: 'Why it matters',
        body: 'Risk and context, and the inputs the score was built from.',
        icon: 'chart',
      },
      {
        name: 'Where',
        body: 'Geographic spread, as a sequence of areas rather than one picture.',
        icon: 'pin',
      },
      {
        name: 'Who',
        body: 'The entities and accounts involved, resolved across sources.',
        icon: 'people',
      },
      {
        name: 'What next',
        body: 'The recommended investigation or action, and who owns it.',
        icon: 'chevron',
      },
    ],
    foot: { left: 'From alert to action', right: 'With full traceability' },
  },

  /* ── 10. in operation ─────────────────────────────────────────────────
     One signal crossing the whole platform, as seven stations on a line.

     The heading is split: the first phrase white, the second in the accent.
     Headings are orange sitewide since 2026-09-10, so this is the inverse of
     `lit` and it is here because the supplied reference for this section draws
     it that way.

     The line ends on a person, and the caption under it says so. That is the
     most important sentence in the block for a government buyer and it is why
     it gets a rule of its own rather than a footnote's grey. */
  action: {
    eyebrow: 'In operation',
    title: 'When a signal',
    lit: 'becomes intelligence.',
    lead:
      'From a digital signal to a decision-ready intelligence alert, every step is traceable, contextual, and connected.',
    chain: [
      {
        name: 'Digital signal',
        body: 'A public conversation, event or activity enters the system.',
        icon: 'chat',
      },
      {
        name: 'Detect',
        body: 'Unusual activity is identified in real time.',
        icon: 'search',
      },
      {
        name: 'Analyse',
        body: 'Narrative, sentiment and key entities are analysed.',
        icon: 'news',
      },
      {
        name: 'Correlate',
        body: 'Related accounts, locations and events are connected.',
        icon: 'network',
      },
      {
        name: 'Score',
        body: 'Risk is assessed with full context and evidence.',
        icon: 'chart',
      },
      {
        name: 'Raise intelligence',
        body: 'An alert or intelligence brief is generated and routed.',
        icon: 'bell',
      },
      {
        name: 'Human decision',
        body: 'An analyst reviews and decides the next course of action.',
        icon: 'person',
      },
    ],
    note: 'SAGA supports the decision — it does not make it.',
  },

  /* ── 11. security ─────────────────────────────────────────────────────
     Six controls as a grid, to a supplied reference.

     ── The inline markers came off on 2026-09-10 ─────────────────────────
     Three of these tiles carried `[pending sign-off]` and the reference draws
     them without. Two are now fine either way: "enterprise-grade encryption
     standards" and "secure protocols" name no cipher and no protocol version,
     which is what was unapproved. The other two still assert something nobody
     has confirmed — the three-role structure (APPROVALS item 3) and the
     deployment siting (item 2) — and now assert it with nothing on the page
     saying so. Both are recorded in `copy/APPROVALS.md`; that file is the only
     thing holding them open. */
  security: {
    eyebrow: 'Security',
    title: 'Built for sensitive',
    lit: 'intelligence environments.',
    lead:
      'Access is bounded by role and scoped to a geography or subject. A user sees what is assigned to them and not the rest, including records belonging to peers at the same level.',
    items: [
      {
        name: 'Data at rest',
        body: 'Encrypted in storage with enterprise-grade encryption standards.',
        icon: 'lock',
      },
      {
        name: 'Data in transit',
        body: 'Encrypted between every component using secure protocols.',
        icon: 'transfer',
      },
      {
        name: 'Role-based access',
        body: 'Three scoped roles with a per-feature permission layer beneath them.',
        icon: 'people',
      },
      {
        name: 'Authentication',
        body: 'Multi-factor sign-in, with access revocable mid-session rather than at next sign-in.',
        icon: 'fingerprint',
      },
      {
        name: 'Audit trail',
        body: 'Every search, export and permission change written to an immutable trail.',
        icon: 'news',
      },
      {
        name: 'Deployment',
        body: "Sited to keep data inside the department's own boundary.",
        icon: 'layers',
      },
    ],
    link: { href: '/trust', label: 'Deployment, audit trail and lawful basis' },
  },

  faqs: [
    {
      q: 'What happens to an item that matches nothing?',
      a: 'It is not retained. Collection keeps what a watchlist term or a tracked entity caused it to keep; the rest is discarded at the first step rather than stored against a future query.',
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
      a: `News and RSS feeds run through the same pipeline as social sources, and each source carries a credibility weight that changes how much an item contributes to a score. The weight applied is shown on the record. Weights are configurable per deployment [${PS}: default weighting scheme], because a judgement about a source belongs to the department operating the system.`,
    },
    {
      q: 'Can SAGA tell whether coverage followed the conversation, or the other way round?',
      a: 'News items and social conversation about the same subject are correlated, so the ordering question can be answered. That ordering is frequently the difference between an organic story and a placed one.',
    },
    {
      q: 'What happens in an unsupported language?',
      a: `Items are collected and stored but not scored [${PS}: which languages beyond English, Telugu, Hindi and Urdu are supported]. They are neither dropped nor passed through a model that does not read them.`,
    },
  ],

  /* ── 12. CTA ──────────────────────────────────────────────────────────── */
  cta: {
    eyebrow: 'See SAGA in action',
    title: 'See what your digital environment',
    lit: 'is telling you.',
    body:
      'Explore how SAGA turns fragmented digital signals into structured, actionable intelligence.',
  },
};
