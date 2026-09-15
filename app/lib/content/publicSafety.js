/* Standalone vertical content. Revised 2026-09-14.
   Illustrations and scenarios describe concepts, not deployed product results.
   Exact deployment specifications remain subject to product confirmation. */
export const publicSafety = {
  "name": "Public Safety",
  "path": "/public-safety",
  "meta": {
    "title": "Social Media Intelligence for Law Enforcement | Blura SAGA",
    "description": "Explore Blura SAGA for public safety: multilingual monitoring, prioritised alerts, digital investigation and case workflows with source context."
  },
  "hero": {
    "title": "Identify emerging risks.",
    "lit": "Inform every response.",
    "body": "Blura SAGA is a social media intelligence platform for law-enforcement teams. Monitor relevant public digital signals, investigate their context and bring findings together in a case record that helps officers decide what to do next.",
    "image": "/images/verticals/public-safety-hero.webp",
    "caption": "Public safety intelligence",
    "tags": [
      "Multilingual monitoring",
      "Digital investigation",
      "Case management"
    ],
    "secondary": "Explore public-safety capabilities"
  },
  "overview": {
    "eyebrow": "Built for public safety",
    "title": "A signal is the start. Context makes it useful.",
    "body": "A post, an account and a circulating video may belong to the same developing issue. Blura SAGA brings relevant public information into a connected workflow, giving intelligence teams and investigating officers the sources behind an alert and a place to record their follow-up.",
    "note": "Collection covers the public sources, languages and subjects configured for your deployment.",
    "steps": [
      {
        "title": "Define what matters",
        "body": "Set watchlists around the terms, entities and subjects relevant to your responsibility."
      },
      {
        "title": "Examine the context",
        "body": "Review matched content, related accounts and available media analysis."
      },
      {
        "title": "Record the response",
        "body": "Connect findings to a case, an assigned officer or a departmental complaint."
      }
    ],
    "link": {
      "href": "/platform#idea",
      "label": "How Blura SAGA turns signals into intelligence"
    }
  },
  "features": [
    {
      "id": "monitoring",
      "eyebrow": "Monitoring & alerting",
      "title": "Find the relevant signal. Put it in the right hands.",
      "body": "Watchlists bring relevant public posts into view with the term that matched and the context around it. Prioritised alerts help teams decide which items need review and who is responsible for the next action.",
      "visual": "signal",
      "visualTitle": "From a watchlist to a reviewable alert",
      "items": [
        {
          "title": "Multilingual watchlists",
          "body": "Monitor terms in English, Telugu, Hindi and Urdu, including native script, romanised transliteration and mixed-script posts."
        },
        {
          "title": "Context with every match",
          "body": "Keep the matched term, original post, account and capture time together so the officer can inspect why the item was flagged."
        },
        {
          "title": "Priority and ownership",
          "body": "Route an alert to the officer responsible for its geography or subject, with acknowledgement and escalation recorded against the item."
        }
      ],
      "note": "An alert identifies material for review. The officer assesses the context and decides whether action is needed."
    },
    {
      "id": "investigate",
      "eyebrow": "Digital investigation",
      "title": "Follow the connections. Examine the evidence.",
      "body": "Start with an account or a piece of media. Blura SAGA helps investigators explore related information and preserve the findings with the material that produced them.",
      "visual": "investigation",
      "visualTitle": "Connected findings, with their sources",
      "flip": true,
      "items": [
        {
          "title": "Accounts and identifiers",
          "body": "Explore username matches, known aliases and related accounts across available sources. A matching handle is a candidate to investigate, not proof that two accounts belong to one person."
        },
        {
          "title": "Image metadata",
          "body": "Extract available GPS coordinates, capture time and device information from the original file. When metadata is missing, the tool reports its absence rather than estimating a location."
        },
        {
          "title": "Media authenticity",
          "body": "Review Real, Fake, Suspicious or Needs Review outcomes with confidence and frame-level analysis. A Needs Review result calls for a person to examine the material."
        }
      ],
      "link": {
        "href": "/investigation#tools",
        "label": "Explore the investigation tools and their limits"
      }
    },
    {
      "id": "casework",
      "eyebrow": "Case & grievance management",
      "title": "Keep the investigation together.",
      "body": "A useful finding needs a place in the wider case. Blura SAGA connects digital material to investigative records while keeping departmental complaints in a traceable response workflow.",
      "visual": "record",
      "visualTitle": "What an investigative record holds",
      "layout": "wide",
      "items": [
        {
          "title": "Person-of-interest records",
          "body": "Bring known accounts, aliases, captured media and observed locations into one record. Link the record to an FIR number so the digital trail and registered case reference each other."
        },
        {
          "title": "Source material and context",
          "body": "Keep the original file and capture metadata beside the values extracted from it. Investigators can return to the source when they assess a finding."
        },
        {
          "title": "Grievances with an owner",
          "body": "Categorise public complaints, route them to the responsible department and track New, In Progress and Resolved states, including time in each state and who closed the item."
        }
      ]
    }
  ],
  "workflow": {
    "id": "workflow",
    "eyebrow": "From detection to decision",
    "title": "An accountable path from signal to action.",
    "body": "The platform provides context and a record of activity. Officers retain responsibility for verification, investigation and the response.",
    "steps": [
      {
        "title": "Detect",
        "body": "A configured watchlist term matches public content."
      },
      {
        "title": "Review",
        "body": "An officer checks the source, priority and surrounding context."
      },
      {
        "title": "Assign",
        "body": "The geography or subject determines responsibility."
      },
      {
        "title": "Investigate",
        "body": "Related accounts, media and findings join the case."
      },
      {
        "title": "Record",
        "body": "The action taken and its supporting material stay together."
      }
    ]
  },
  "scenarios": {
    "title": "See the workflow in practice.",
    "intro": "Illustrative situations showing how teams can use the information. These are not customer case studies.",
    "items": [
      {
        "icon": "signal",
        "title": "A regional-language alert",
        "setup": "A watchlist term appears in a mixed-script public post. The officer needs to establish what was said and why it matters.",
        "action": "Open the matched term, captured post and account context; examine related signals before assigning further work.",
        "outcome": "A review grounded in the source material."
      },
      {
        "icon": "media",
        "title": "A video requiring verification",
        "setup": "A circulating clip appears to show an inflammatory statement. Its authenticity is uncertain.",
        "action": "Examine media-analysis results and frame-level findings, then route uncertain material for human review.",
        "outcome": "An informed assessment before a public response."
      },
      {
        "icon": "location",
        "title": "An image with another context",
        "setup": "An image is being shared with a claim about an incident. The original file is available for examination.",
        "action": "Check any retained location and capture-time metadata against the claim, preserving the file beside the extracted values.",
        "outcome": "A documented basis for further verification."
      }
    ]
  },
  "access": {
    "eyebrow": "Access & accountability",
    "title": "Built around your team's responsibilities.",
    "body": "An investigation needs clear ownership and traceable source material. Establish the operating boundaries alongside your department's requirements.",
    "items": [
      {
        "title": "Scoped responsibility",
        "body": "Access is bounded by role and the geography or subject assigned to the user."
      },
      {
        "title": "Traceable activity",
        "body": "Searches, exports and case actions carry an audit record connecting the activity to its user and time."
      },
      {
        "title": "Deployment requirements",
        "body": "Review hosting, data location, retention, role permissions and source coverage for your department's operating needs."
      }
    ],
    "link": {
      "href": "/trust",
      "label": "Review access, audit and data handling"
    }
  },
  "faqs": [
    {
      "q": "What is Blura SAGA for Public Safety?",
      "a": "It is the public-safety use of the Blura SAGA social media intelligence platform. It connects monitoring of relevant public signals, investigation tools and case workflows so law-enforcement teams can review the information behind an issue and record their actions."
    },
    {
      "q": "Which sources and languages can a team monitor?",
      "a": "Source coverage is configured for each deployment. The watchlist capability described here covers English, Telugu, Hindi and Urdu, including script and transliteration matching. Confirm the current source list and any additional language requirements in your demonstration; monitoring does not imply access to all platforms or private conversations."
    },
    {
      "q": "What happens after a watchlist match?",
      "a": "The captured item retains the matched term, account and collection context. An alert is prioritised and routed by geography or subject so the responsible officer can review it. Exact tier definitions and escalation intervals need to be established for the deployment."
    },
    {
      "q": "Does an account match establish a person's identity?",
      "a": "No. Username matching returns candidates across available sources. The investigator examines the profile details and other evidence before deciding whether accounts are connected to the same person."
    },
    {
      "q": "Can every image reveal where it was taken?",
      "a": "No. Location, capture time and device details are available only when the file retains that metadata. Many social platforms strip image metadata. An empty result means the information is absent from the file, not that a location has been verified."
    },
    {
      "q": "What does a Needs Review media result mean?",
      "a": "The available analysis does not support a more definite outcome. The result is deliberately referred to a person, with the confidence and frame-level findings available for examination. It is not an automatic determination of authenticity."
    },
    {
      "q": "How do digital findings connect to a registered case?",
      "a": "A person-of-interest record can carry known accounts, aliases, captured media and observed locations, and be linked to an FIR number. Original material and capture metadata stay available alongside the findings."
    },
    {
      "q": "How are access and evidence handling arranged?",
      "a": "Visibility is scoped to the geography or subject assigned to a user. Captured material keeps its metadata, and searches, exports and case activity are recorded in the audit trail. The department's own process governs how that material is used; hosting, retention and detailed permissions must be reviewed for the deployment."
    }
  ],
  "cta": {
    "title": "Explore Blura SAGA",
    "lit": "for your department.",
    "body": "Walk through the watchlists, investigation records and response responsibilities relevant to your team's requirements."
  }
};
