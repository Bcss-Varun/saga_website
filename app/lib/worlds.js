/* Vertical content model, ported from Saga.html.

   Keys renamed per decision 5 — `political` → `governance`, `police` →
   `publicSafety`, `brand` → `brands` — so route params, data keys and copy
   stay aligned across the nine pages. Values are unchanged.

   This is the source for the four vertical pages. The homepage `worlds` tab
   widget these once fed has been removed (decision 4).

   [copy: needs specificity rewrite] */

export const WICON = {
  governance: '<circle cx="9" cy="8" r="3"/><path d="M3.2 20a5.9 5.9 0 0 1 11.6 0"/><path d="M16.2 5.6a3 3 0 0 1 0 5.4"/><path d="M18.6 20a5.7 5.7 0 0 0-2.7-4.8"/>',
  publicSafety: '<path d="M12 3.2 19 6v5.4c0 4.2-2.9 8-7 9.4-4.1-1.4-7-5.2-7-9.4V6z"/><path d="m9 12 2.1 2.1L15.2 10"/>',
  brands: '<path d="M20 13.6a2 2 0 0 1-2 2H8.6L4.6 19.4V6a2 2 0 0 1 2-2H18a2 2 0 0 1 2 2z"/><path d="M8.4 8.8h7.2M8.4 12.2h4.6"/>',
  celebrity: '<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.6 9.7l5.8-.8z"/>'
};

export const WORLDS = {
  governance: {
    shot: 'images/saga website image 5.png',
    label: 'Public Policy & Governance',
    title: 'Understand how people respond to decisions.',
    body: 'Public conversations can reveal how people perceive policies, programs and decisions. SAGA brings these signals together to help governments understand public sentiment, identify emerging narratives and see where attention is needed.',
    items: [
      ['Public Sentiment', 'See how people are responding to policies, decisions and public initiatives.'],
      ['Emerging Narratives', 'Identify conversations and issues that are gaining attention.'],
      ['Regional Trends', 'Understand how sentiment and conversations differ across districts and regions.'],
      ['Public Concerns', 'Surface issues that may require attention before they grow.']],
    valueLine: 'From public conversation to clearer understanding.',
    valueBody: 'SAGA helps decision-makers move beyond isolated feedback and see the broader picture across digital conversations.'
  },
  publicSafety: {
    shot: 'images/public-safety.webp',
    label: 'Law Enforcement & Public Safety',
    title: 'See the signals before they escalate.',
    body: 'Digital conversations can contain early indicators of threats, incidents and emerging situations. SAGA helps law enforcement teams bring these signals together, understand what is happening and support faster, evidence-backed investigation.',
    items: [
      ['Emerging Threats', 'Identify signals that may indicate developing risks or incidents.'],
      ['Digital Activity', 'Monitor relevant conversations and activity across platforms.'],
      ['Connections', 'Discover relationships between people, accounts, entities and events.'],
      ['Incidents', 'Bring related information together to understand what happened.']],
    valueLine: 'From scattered signals to connected intelligence.',
    valueBody: 'SAGA helps investigators move from individual signals toward a broader understanding of an incident and its surrounding context.'
  },
  brands: {
    shot: 'images/brands.webp',
    label: 'Brand & Enterprises',
    title: 'Know what people are saying about your brand.',
    body: 'Your brand is being discussed across digital channels every day. SAGA brings these conversations together to help organizations understand sentiment, identify emerging narratives and recognize reputation risks early.',
    items: [
      ['Brand Sentiment', 'Understand how people feel about your brand and products.'],
      ['Conversations', 'See what people are discussing and what is gaining attention.'],
      ['Reputation Risks', 'Identify negative shifts and emerging issues before they grow.'],
      ['Competitor Activity', 'Understand how your brand compares within the wider conversation.']],
    valueLine: 'From brand conversations to reputation intelligence.',
    valueBody: 'SAGA helps organizations understand not just what is being said, but how conversations are changing and where attention may be needed.'
  },
  celebrity: {
    shot: 'images/saga website image 6.png',
    label: 'Celebrity & Public Figures',
    title: 'Understand the person behind the perception.',
    body: 'Public perception can shift quickly. SAGA helps understand how people respond, where support is growing, and where reputation risks may be emerging.',
    items: [
      ['Public Sentiment', 'Understand how people are responding to a public figure across different contexts.'],
      ['Fan Intelligence', 'Identify fan communities, engagement patterns and where support is strongest.'],
      ['Reputation Risks', 'Detect unusual activity, coordinated attacks and emerging reputation concerns.'],
      ['Influence & Impact', 'Understand endorsement risk, event impact and how public attention changes over time.']],
    valueLine: 'From public attention to reputation intelligence.',
    valueBody: 'SAGA helps teams understand not just what is being said about a public figure, but how sentiment, support and risk are shifting over time.'
  }
};


export const GICON = {
  doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M9.6 12.2h6.8M9.6 15.6h4.8"/>',
  scales: '<path d="M12 4.6v14.8M7 19.4h10M4.6 8.6h14.8"/><path d="M4.6 8.6 2.1 14.6h5z"/><path d="M19.4 8.6 16.9 14.6h5z"/>',
  people: '<circle cx="9" cy="8" r="2.9"/><path d="M3.4 19.6a5.7 5.7 0 0 1 11.2 0"/><path d="M16.2 5.7a2.9 2.9 0 0 1 0 5.2"/><path d="M18.5 19.6a5.6 5.6 0 0 0-2.6-4.6"/>',
  pin: '<path d="M12 20.8s6.8-6 6.8-10.7a6.8 6.8 0 1 0-13.6 0c0 4.7 6.8 10.7 6.8 10.7z"/><circle cx="12" cy="9.9" r="2.4"/>',
  chart: '<path d="M4 19.8h16"/><path d="M7.4 19.8v-6.4M12 19.8V6.6M16.6 19.8v-9.4"/>',
  bell: '<path d="M12 4.2a5.8 5.8 0 0 1 5.8 5.8v4.6l1.8 2.8H4.4l1.8-2.8V10A5.8 5.8 0 0 1 12 4.2z"/><path d="M10 19.8a2 2 0 0 0 4 0"/>',
  target: '<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r=".9"/>',
  link: '<path d="M9.6 14.4 14.4 9.6"/><path d="M10.2 6.6 12 4.8a3.7 3.7 0 0 1 5.2 5.2l-1.8 1.8"/><path d="M13.8 17.4 12 19.2A3.7 3.7 0 0 1 6.8 14l1.8-1.8"/>',
  clock: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.4V12l3.2 2.2"/>',
  star: '<path d="m12 4.2 2.5 5.2 5.6.8-4.1 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4.1-3.9 5.6-.8z"/>',
  heart: '<path d="M12 19.8S4.6 15 4.6 10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.4 3c0 4.8-7.4 9.6-7.4 9.6z"/>',
  cart: '<path d="M3.4 4.6h2.5l2.4 10.3h9.3l2-7.4H6.9"/><circle cx="10" cy="18.6" r="1.3"/><circle cx="16.6" cy="18.6" r="1.3"/>',
  chat: '<path d="M20 13.6a2 2 0 0 1-2 2H8.6l-4 3.8V6a2 2 0 0 1 2-2H18a2 2 0 0 1 2 2z"/><path d="M8.4 8.8h7.2M8.4 12.2h4.6"/>',
  mega: '<path d="M5 9.8h3l7-4.4v13.2L8 14.2H5A1.6 1.6 0 0 1 3.4 12.6v-1.2A1.6 1.6 0 0 1 5 9.8z"/><path d="M18 9.6a3.8 3.8 0 0 1 0 4.8"/><path d="M7.6 14.2v4.6h3.2"/>',
  shield: '<path d="M12 3.4 19 6.2v5.4c0 4.2-2.9 8-7 9.4-4.1-1.4-7-5.2-7-9.4V6.2z"/><path d="m9.2 11.9 2 2 3.6-4"/>'
};


export const WGRAPH = {
  governance: {
    chips: ['doc', 'scales', 'people', 'pin', 'chart'],
    /* a legislature on a lit dais */
    em: '<path d="M186 316h228"/><path d="M200 306h200"/>' +
      '<path d="M218 218v88M259 218v88M300 218v88M341 218v88M382 218v88"/>' +
      '<path d="M198 218h204M198 206h204"/>' +
      '<path class="hot" d="M300 150 406 206H194z"/>' +
      '<path d="M300 150v-24"/><path class="hot" d="m300 126 24 7-24 7z"/>'
  },
  publicSafety: {
    chips: ['bell', 'target', 'link', 'pin', 'clock'],
    /* a shield closing over the signals */
    em: '<path d="M300 148 384 180v52c0 43-32 80-84 96-52-16-84-53-84-96v-52z"/>' +
      '<path class="hot" d="m270 246 22 22 42-46"/>' 
  },
  brands: {
    chips: ['star', 'heart', 'cart', 'chat', 'mega'],
    /* the brand itself, listening */
    em: '<path d="M246 214h108l11 104H235z"/>' +
      '<path class="hot" d="M275 214v-16a25 25 0 0 1 50 0v16"/>' +
      '<path d="M262 246h76M262 268h48"/>'
  },
  celebrity: {
    chips: ['heart', 'people', 'star', 'chart', 'shield'],
    /* the figure, and the attention trained on them */
    em: '<circle cx="300" cy="214" r="26"/>' +
      '<path d="M244 310v-10a56 56 0 0 1 112 0v10"/>' +
      '<path class="hot" d="M263.3 204.2 251.7 201.1M267.1 195 256.7 189' +
      'M281 181.1 275 170.7M300 176V164M319 181.1 325 170.7' +
      'M332.9 195 343.3 189M336.7 204.2 348.3 201.1"/>'
  }
};

/* five chips swept across an ellipse that arcs over the emblem */
