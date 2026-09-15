/* Standalone vertical content. Revised 2026-09-14.
   Illustrations and scenarios describe concepts, not deployed product results.
   Exact deployment specifications remain subject to product confirmation. */
export const celebrity = {
  "name": "Celebrity",
  "path": "/celebrity",
  "meta": {
    "title": "Celebrity Reputation and Audience Intelligence | Blura SAGA",
    "description": "Understand public reputation with Blura SAGA: context-specific sentiment, coordinated activity indicators, fan communities and endorsement-related trends."
  },
  "hero": {
    "title": "Understand your audience.",
    "lit": "See your reputation clearly.",
    "body": "Blura SAGA is a social media intelligence platform for public figures, talent managers and PR teams. Separate reactions to projects and appearances, examine negative activity and understand the communities and events shaping public reputation.",
    "image": "/images/verticals/celebrity-hero.webp",
    "caption": "Public reputation & audience intelligence",
    "tags": [
      "Contextual sentiment",
      "Fan communities",
      "Endorsement insights"
    ],
    "secondary": "Explore reputation intelligence"
  },
  "overview": {
    "eyebrow": "Reputation in context",
    "title": "One public figure. More than one conversation.",
    "body": "Reaction to a release can differ from reaction to an appearance or commercial association. Blura SAGA separates sentiment by context and connects changes to the discussion behind them, helping teams understand which part of a public reputation is moving.",
    "note": "Analysis reflects configured public sources. A sentiment reading is a view of that conversation, not a verdict on the person.",
    "steps": [
      {
        "title": "Separate the contexts",
        "body": "Review projects, appearances and controversies as distinct conversations."
      },
      {
        "title": "Examine the activity",
        "body": "Understand negative patterns and the communities carrying support."
      },
      {
        "title": "Inform the next decision",
        "body": "Bring the relevant discussion and trend into PR or commercial review."
      }
    ],
    "link": {
      "href": "/platform#layers",
      "label": "How Blura SAGA analyses sentiment and narratives"
    }
  },
  "features": [
    {
      "id": "activity",
      "eyebrow": "Negative activity & coordination",
      "title": "Understand the criticism and how it is spreading.",
      "body": "A sudden increase in negative posts can contain both substantive criticism and coordinated amplification. Blura SAGA helps your team examine the pattern and the underlying conversation before deciding how to respond.",
      "visual": "activity",
      "visualTitle": "Read activity patterns alongside the conversation",
      "items": [
        {
          "title": "Account and posting patterns",
          "body": "Examine account age, posting cadence, repeated phrasing and burst timing for indications that activity may be coordinated."
        },
        {
          "title": "The substance of the discussion",
          "body": "Review what people are actually raising, alongside the amplification pattern. A repeated campaign and an individual criticism may concern different issues."
        },
        {
          "title": "Human interpretation",
          "body": "Use the findings to inform the team's assessment. A pattern alone cannot determine whether an account is a bot or whether a participant is a real person."
        }
      ]
    },
    {
      "id": "communities",
      "eyebrow": "Fan communities & advocates",
      "title": "See the communities carrying support.",
      "body": "Understand where supportive conversation is sustained and which accounts are repeatedly amplified within those communities. This gives talent teams context about how support is expressed and shared.",
      "visual": "communities",
      "visualTitle": "Communities, advocates and shared conversation",
      "flip": true,
      "items": [
        {
          "title": "Support around a shared interest",
          "body": "Identify communities contributing sustained positive conversation around a public figure or their work."
        },
        {
          "title": "Advocates within the community",
          "body": "Examine individual accounts whose posts are repeatedly amplified by others, alongside the conversation that earns that response."
        },
        {
          "title": "Influence with context",
          "body": "Understand the relationship between an advocate and their community instead of interpreting follower totals as a complete picture of support."
        }
      ]
    },
    {
      "id": "endorsements",
      "eyebrow": "Endorsement & reputation trends",
      "title": "Put the commercial conversation in perspective.",
      "body": "Track sentiment relevant to a commercial association and examine the events behind changes. A contextual trend gives talent and commercial teams a better basis for review than a single period's overall reaction.",
      "visual": "endorsement",
      "visualTitle": "Connect a reputation trend to its context",
      "layout": "wide",
      "items": [
        {
          "title": "Relevant conversation",
          "body": "Focus the review on discussion connected to the commercial association, while keeping unrelated projects or controversies in their own context."
        },
        {
          "title": "Events behind movement",
          "body": "Examine the releases, appearances or other events associated with a sentiment change and the source material behind it."
        },
        {
          "title": "A basis for commercial review",
          "body": "Use the analysis to inform a partnership discussion. A sentiment trend supports judgement; it does not guarantee an endorsement's outcome."
        }
      ],
      "note": "The available analysis period and retained history should be confirmed for your deployment."
    }
  ],
  "scenarios": {
    "title": "Different conversations call for different decisions.",
    "intro": "Illustrative public-figure situations. These examples do not represent a named individual or a customer result.",
    "items": [
      {
        "icon": "context",
        "title": "Reaction to one project",
        "setup": "Overall sentiment declines while a new project is receiving criticism.",
        "action": "Separate the project conversation from other work, public appearances and commercially relevant discussion before assessing the wider reputation.",
        "outcome": "Clarity about which context is changing."
      },
      {
        "icon": "network",
        "title": "A sudden negative surge",
        "setup": "Negative activity rises rapidly, with tightly repeated language and other accounts raising a specific concern.",
        "action": "Examine posting patterns and substantive criticism separately, then review the supporting posts with the PR team.",
        "outcome": "A more informed basis for deciding whether and how to respond."
      }
    ]
  },
  "outputs": {
    "eyebrow": "For the team around the public figure",
    "title": "A shared understanding of what is changing.",
    "body": "Talent, PR and commercial representatives approach the same reputation from different responsibilities. Context-specific sentiment, community insights and endorsement-related trends give each team relevant material to examine.",
    "visual": "talentBrief",
    "visualTitle": "Context for the next team discussion",
    "items": [
      {
        "title": "Talent management",
        "body": "Understand the reception of a project or appearance in relation to the other conversations around the public figure."
      },
      {
        "title": "Public relations",
        "body": "Examine the concern being raised and the patterns behind a sudden change in attention."
      },
      {
        "title": "Commercial representatives",
        "body": "Review the discussion relevant to a commercial association and the events behind its direction."
      }
    ],
    "note": "Access is scoped to assigned individuals or subjects. Review source coverage, permissions and retained history against the team's requirements.",
    "link": {
      "href": "/trust",
      "label": "Explore access and data handling"
    }
  },
  "faqs": [
    {
      "q": "What is Blura SAGA for Celebrity?",
      "a": "It is the public-reputation use of the Blura SAGA social media intelligence platform. It helps public figures, talent managers and PR teams examine sentiment by context, review coordination indicators, understand supportive communities and follow endorsement-related reputation trends."
    },
    {
      "q": "Why separate sentiment by context?",
      "a": "A public figure can receive different reactions to a project, appearance and commercial association at the same time. Separating these discussions makes it possible to examine where a change is happening instead of treating the overall average as the whole reputation."
    },
    {
      "q": "Does the platform monitor every conversation?",
      "a": "No. Findings come from the public sources and subjects configured for the deployment. The source list, language requirements and retained history must be reviewed for the team's needs. Coverage does not imply access to private conversations."
    },
    {
      "q": "Can an activity score prove that an account is a bot?",
      "a": "No. Account age, posting cadence, repeated phrasing and burst timing are indicators used to examine activity. They do not definitively establish who operates an account or whether it is automated. Human review and the underlying posts remain necessary."
    },
    {
      "q": "How is an advocate identified?",
      "a": "An advocate is an account within a supportive community whose posts are repeatedly amplified by others in that community. The useful context is the relationship and conversation behind that support, rather than the follower count alone."
    },
    {
      "q": "What does endorsement analysis cover?",
      "a": "It follows sentiment relevant to a commercial association and the events connected with its changes. Confirm the available analysis period and retained history for your deployment. The findings inform commercial judgement and do not guarantee the outcome of a partnership."
    },
    {
      "q": "Is a reputation decline always a change in the whole audience?",
      "a": "No. The change may be concentrated in one project, appearance or source community. Review those contexts and the underlying material before interpreting a movement as a wider shift."
    },
    {
      "q": "Can information be scoped to a particular public figure?",
      "a": "Access is bounded by role and the individuals or subjects assigned to a user. Detailed permissions, source coverage, hosting and retention requirements should be established for the team's deployment."
    }
  ],
  "cta": {
    "title": "Explore Blura SAGA",
    "lit": "for your public reputation.",
    "body": "Review the projects, public conversations and commercial associations your team needs to understand."
  }
};
