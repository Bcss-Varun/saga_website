import { WORLDS } from './worlds';
import { FAQS } from './faqs';
import { publicSafety } from './content/publicSafety';
import { governance } from './content/governance';
import { brands } from './content/brands';
import { celebrity } from './content/celebrity';

/* Verticals with authored content. Anything not listed here still renders the
   full structure, with visible placeholders where the copy is pending.
   [draft — needs review] applies to all authored copy. */
const AUTHORED = { publicSafety, governance, brands, celebrity };

/* Content model for the four vertical pages.

   Depth follows the table in CLAUDE.md:

     block               Public Safety  Governance  Brands  Celebrity
     capability modules        6             6         4        4
     scenario narratives       3             3         2        2
     FAQ                       6             6         4        4
     deployment note         full          full      short    short

   Where Saga.html already has content it is carried across unchanged from
   `worlds.js` / `faqs.js`. Everything else is an explicit PLACEHOLDER — this
   checkpoint builds the structure, not the copy. Placeholders render visibly
   as placeholders rather than as plausible-looking filler, so no unreviewed
   sentence can reach a page by being mistaken for real copy.

   Every string here still needs the specificity rewrite.
   [copy: needs specificity rewrite] */

export const DEPTH = {
  publicSafety: { modules: 6, scenarios: 3, faqs: 8, deployment: 'full' },
  governance: { modules: 6, scenarios: 3, faqs: 8, deployment: 'full' },
  brands: { modules: 4, scenarios: 2, faqs: 4, deployment: 'short' },
  celebrity: { modules: 4, scenarios: 2, faqs: 4, deployment: 'short' },
};

export const NAMES = {
  publicSafety: 'Public Safety',
  governance: 'Governance',
  brands: 'Brands',
  celebrity: 'Celebrity',
};

export const PLACEHOLDER = '[placeholder — copy pending]';

/* Monitor / Investigate / Manage. The three verbs are structural and fixed
   across all four verticals; what each means per vertical is copy. */
const TRIAD = [
  { key: 'monitor', name: 'Monitor' },
  { key: 'investigate', name: 'Investigate' },
  { key: 'manage', name: 'Manage' },
];

/* The signal-to-action strip. A genuine sequence, so it keeps its indices.
   Carried across from the homepage flow — each vertical page has to stand on
   its own, so it restates the pipeline rather than assuming Home was read. */
const STRIP = [
  ['01', 'Detected'],
  ['02', 'Scored'],
  ['03', 'Verified'],
  ['04', 'Escalated'],
  ['05', 'Resolved'],
];

function modules(vertical, want) {
  const authored = AUTHORED[vertical]?.modules;
  if (authored) {
    if (authored.length !== want) {
      throw new Error(
        `${vertical}: ${authored.length} authored modules, depth table wants ${want}`
      );
    }
    return authored.map((m) => ({ ...m, placeholder: false }));
  }
  const real = (WORLDS[vertical]?.items || []).map(([name, body]) => ({
    name,
    body,
    placeholder: false,
  }));
  const out = real.slice(0, want);
  while (out.length < want) {
    out.push({
      name: `Capability ${out.length + 1}`,
      body: PLACEHOLDER,
      placeholder: true,
    });
  }
  return out;
}

function faqs(vertical, want) {
  const authored = AUTHORED[vertical]?.faqs;
  if (authored) {
    if (authored.length !== want) {
      throw new Error(
        `${vertical}: ${authored.length} authored FAQ entries, depth table wants ${want}`
      );
    }
    return authored.map((f) => ({ ...f, placeholder: false }));
  }
  const carried = FAQS.filter((f) => f.scope === 'vertical').map((f) => ({
    q: f.q,
    a: f.a,
    placeholder: false,
  }));
  const out = carried.slice(0, want);
  while (out.length < want) {
    out.push({
      q: `Question ${out.length + 1} for ${NAMES[vertical]}`,
      a: PLACEHOLDER,
      placeholder: true,
    });
  }
  return out;
}

function scenarios(vertical, want) {
  const authored = AUTHORED[vertical]?.scenarios;
  if (authored) {
    if (authored.length !== want) {
      throw new Error(
        `${vertical}: ${authored.length} authored scenarios, depth table wants ${want}`
      );
    }
    return authored.map((sc) => ({ ...sc, placeholder: false }));
  }
  return Array.from({ length: want }, (_, i) => ({
    name: `Scenario ${i + 1}`,
    body: PLACEHOLDER,
    placeholder: true,
  }));
}

export function getVertical(vertical) {
  const w = WORLDS[vertical];
  const d = DEPTH[vertical];
  if (!w || !d) throw new Error(`unknown vertical: ${vertical}`);
  const a = AUTHORED[vertical];

  return {
    key: vertical,
    name: NAMES[vertical],
    label: w.label,
    title: a?.hero?.title ?? w.title,
    body: a?.hero?.body ?? w.body,
    valueLine: a?.signature?.line ?? w.valueLine,
    valueBody: a?.signature?.body ?? w.valueBody,
    triad: a?.triad
      ? a.triad.map((t) => ({ ...t, placeholder: false }))
      : TRIAD.map((t) => ({ ...t, body: PLACEHOLDER, placeholder: true })),
    modules: modules(vertical, d.modules),
    strip: STRIP,
    scenarios: scenarios(vertical, d.scenarios),
    deployment: a?.deployment
      ? { depth: d.deployment, paragraphs: a.deployment, placeholder: false }
      : { depth: d.deployment, paragraphs: [PLACEHOLDER], placeholder: true },
    faqs: faqs(vertical, d.faqs),
    authored: Boolean(a),
    /* Opt-in to the density layout. Set per vertical so the pass can be
       reviewed on one page before the other three are converted; the template
       renders the original structure for anything without it. */
    dense: Boolean(a?.dense),
  };
}

export const VERTICAL_KEYS = Object.keys(DEPTH);
