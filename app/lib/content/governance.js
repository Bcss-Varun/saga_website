/* Standalone vertical content. Revised 2026-09-14.
   Illustrations and scenarios describe concepts, not deployed product results.
   Exact deployment specifications remain subject to product confirmation. */
export const governance = {
  "name": "Governance",
  "path": "/governance",
  "meta": {
    "title": "Governance Intelligence and Public Sentiment | Blura SAGA",
    "description": "Understand local concerns with Blura SAGA: district-level sentiment, emerging issues, policy impact, grievance routing and intelligence briefings."
  },
  "hero": {
    "title": "Understand public concerns.",
    "lit": "Coordinate your response.",
    "body": "Blura SAGA is a social media intelligence platform for governance teams. Understand public conversations by district or constituency, examine the issues behind a change and follow grievances through the department responsible for response.",
    "image": "/images/verticals/governance-hero.webp",
    "caption": "Governance intelligence",
    "tags": [
      "Local sentiment",
      "Policy & event impact",
      "Grievance management"
    ],
    "secondary": "Explore governance intelligence"
  },
  "overview": {
    "eyebrow": "A clearer local picture",
    "title": "Understand the issue behind the conversation.",
    "body": "A state-wide average can hide a local concern. Blura SAGA connects public conversations and configured grievance inputs with issue and geographic context, helping administrations see where attention is needed and examine the material behind a finding.",
    "note": "Digital conversation reflects the sources being monitored. It is not a census of public opinion.",
    "steps": [
      {
        "title": "Listen to local signals",
        "body": "Bring relevant public discussions and configured grievance inputs into view."
      },
      {
        "title": "Understand the issue",
        "body": "Connect sentiment shifts with themes, areas and supporting source records."
      },
      {
        "title": "Coordinate follow-up",
        "body": "Track departmental responsibility and bring unresolved issues into the briefing."
      }
    ],
    "link": {
      "href": "/platform#idea",
      "label": "How public signals become structured intelligence"
    }
  },
  "features": [
    {
      "id": "local-intelligence",
      "eyebrow": "District & constituency intelligence",
      "title": "See where concerns are emerging.",
      "body": "Examine sentiment at constituency and district level, with the issue driving the movement beside it. Teams can compare areas and investigate an accelerating concern without losing it inside an overall average.",
      "visual": "geography",
      "visualTitle": "Read an area through its issues",
      "items": [
        {
          "title": "Sentiment with a local context",
          "body": "Review how people are responding within the available geographic context. Open the posts and complaints behind a reading to understand what is being discussed."
        },
        {
          "title": "Issue acceleration",
          "body": "Examine how quickly a subject is developing within an area. Geographic risk scoring connects that movement to its underlying issue for review."
        },
        {
          "title": "Comparable area views",
          "body": "Read each area alongside its own prior period, so an improving district and a deteriorating one remain visible as separate changes."
        }
      ],
      "note": "Geographic interpretation depends on the information available in the source. A precise location cannot be inferred for every post."
    },
    {
      "id": "impact",
      "eyebrow": "Policy, event & narrative analysis",
      "title": "Understand what changed. Examine why.",
      "body": "Follow the response to an announcement, scheme or event by comparing the same areas before and after it. Examine the discussion behind a movement and how that discussion is being amplified.",
      "visual": "comparison",
      "visualTitle": "Compare the same area over time",
      "flip": true,
      "items": [
        {
          "title": "Before-and-after context",
          "body": "Compare reactions around a policy change, budget or public event against each area's own preceding reading. Examine the eligibility questions, service concerns or other themes associated with the change."
        },
        {
          "title": "Coordinated activity indicators",
          "body": "Review account age, posting cadence, repeated phrasing and burst timing. Examine repeated amplification separately from the substantive concerns people are raising."
        },
        {
          "title": "Findings with their sources",
          "body": "Return from the area or issue view to the underlying posts. The relationship between an event and a shift can be examined rather than assumed from a headline score."
        }
      ],
      "note": "Activity patterns support analyst review. They do not establish an account's identity or prove why a person posted."
    },
    {
      "id": "grievances",
      "eyebrow": "Grievance management",
      "title": "Give every complaint a path forward.",
      "body": "Turn recurring public complaints into issues with a responsible department and a visible status. Teams can examine where cases are waiting and which subjects are appearing repeatedly.",
      "visual": "grievance",
      "visualTitle": "A grievance lifecycle with ownership",
      "layout": "wide",
      "items": [
        {
          "title": "Categorise and route",
          "body": "Group complaints by subject and send them to the department responsible for that service or issue."
        },
        {
          "title": "Track progress",
          "body": "Follow New, In Progress and Resolved states, including the time spent in each state and the person who records closure."
        },
        {
          "title": "Review recurring issues",
          "body": "Examine resolution reports by department and district. A backlog on one subject stays visible rather than disappearing into an overall total."
        }
      ],
      "note": "The platform records progress. The responsible department carries out the service response."
    }
  ],
  "workflow": {
    "id": "briefings",
    "eyebrow": "Intelligence briefings",
    "title": "Bring the local picture into the daily briefing.",
    "body": "A scheduled briefing brings together the areas that moved, the issues driving each change and grievances awaiting attention. Each finding retains a path to the posts and complaints behind it.",
    "visual": "briefing",
    "steps": [
      {
        "title": "Areas to review",
        "body": "Which districts or constituencies changed, with the issue behind each movement."
      },
      {
        "title": "Discussion to examine",
        "body": "Relevant narratives and activity flagged for possible coordination."
      },
      {
        "title": "Follow-up to track",
        "body": "Open grievances, the department holding them and their recorded progress."
      }
    ]
  },
  "scenarios": {
    "title": "Local context changes the next step.",
    "intro": "Illustrative governance situations. Examples describe possible workflows rather than results from a customer deployment.",
    "items": [
      {
        "icon": "location",
        "title": "One scheme, different concerns",
        "setup": "Overall discussion around a scheme appears favourable, while nearby districts raise the same eligibility question.",
        "action": "Compare the district-level themes and inspect the underlying posts before deciding what clarification is needed.",
        "outcome": "The specific question and affected areas are visible."
      },
      {
        "icon": "record",
        "title": "A recurring service complaint",
        "setup": "Complaints about the same service remain In Progress in one district.",
        "action": "Review the subject cluster, department ownership and recorded time in state, then bring the pattern into the briefing.",
        "outcome": "A follow-up grounded in departmental responsibility."
      },
      {
        "icon": "network",
        "title": "Amplification and real concern",
        "setup": "A policy discussion accelerates with repeated wording alongside individual accounts describing their experiences.",
        "action": "Examine coordination indicators and the substantive issue separately before interpreting the change.",
        "outcome": "A clearer view of the concerns beneath the activity."
      }
    ]
  },
  "access": {
    "eyebrow": "Responsibilities & data handling",
    "title": "The right context for each responsibility.",
    "body": "Governance teams need to know which areas they can review and who owns the response. Access and operating boundaries are part of the deployment discussion.",
    "items": [
      {
        "title": "Geographic scope",
        "body": "Users see the geographies or subjects assigned to their role, supporting district and wider-area responsibilities."
      },
      {
        "title": "Separate operating contexts",
        "body": "Administrations and political operations use separate deployments and data. Their responsibilities and access boundaries must remain distinct."
      },
      {
        "title": "Deployment requirements",
        "body": "Review hosting, retention, source coverage, permissions and the audit trail against the operating body's requirements."
      }
    ],
    "link": {
      "href": "/trust",
      "label": "Explore access, audit and data handling"
    }
  },
  "faqs": [
    {
      "q": "What does Blura SAGA do for governance teams?",
      "a": "It helps teams understand relevant public conversations, examine local sentiment and emerging issues, assess discussion around policies or events, and follow grievances through the responsible department. Findings can be brought into a briefing with their supporting source records."
    },
    {
      "q": "Does sentiment represent everyone in an area?",
      "a": "No. It reflects the material available from the sources the deployment monitors. Differences in source coverage, language and who participates affect the picture. Teams should interpret digital sentiment alongside other administrative and public-feedback evidence."
    },
    {
      "q": "How is geographic information interpreted?",
      "a": "Readings use the geographic context available to the deployment. An area view brings together relevant signals and the issues behind them, but a precise location is not available for every item. Review the sources behind a finding before drawing a geographic conclusion."
    },
    {
      "q": "What drives an emerging-issue score?",
      "a": "Issue velocity describes how quickly a subject is accelerating within an area. The driving issue and its source material accompany the reading. Review the score scale, band definitions and the deployment's geographic coverage during the demonstration."
    },
    {
      "q": "Can a policy's impact be compared across districts?",
      "a": "The same areas can be compared before and after an announcement or event against their own preceding readings. The associated conversation helps explain the movement, but a change after an event does not by itself establish that the event caused it."
    },
    {
      "q": "Where does a grievance go?",
      "a": "It is categorised by subject and routed to the department that owns it. New, In Progress and Resolved states record its progress, along with time in state and closure activity. Reports can be examined by department and district."
    },
    {
      "q": "What does the daily briefing include?",
      "a": "Areas that changed, the issues driving those changes, activity flagged for possible coordination and grievances still awaiting attention. The briefing is connected to the underlying records so a reader can examine the material behind a finding."
    },
    {
      "q": "Can departments and political operations see one another's data?",
      "a": "They use separate deployments and separate data. Within a deployment, users' access is scoped to their assigned geographies or subjects. Detailed permissions, hosting and retention requirements must be established for the operating body."
    }
  ],
  "cta": {
    "title": "Explore Blura SAGA",
    "lit": "for your governance needs.",
    "body": "Walk through the areas, issues, grievance responsibilities and briefing requirements your team works with."
  }
};
