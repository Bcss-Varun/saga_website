/* Visit provenance — the instrumentation the project's success metric rests on.

   The metric is "demo requests originating from government and police domains".
   A request is only attributable if the submission carries where the visitor
   came from and which vertical they were reading. Without that, every lead is a
   single undifferentiated row and the metric does not exist.

   Why this cannot be `document.referrer`:
   `document.referrer` is the EXTERNAL referrer of the document load. Under the
   App Router, moving from /public-safety to /contact is a client-side
   navigation — no document load, so the referrer still names whatever site the
   visitor originally arrived from, or is empty. A visitor who lands on
   /public-safety from a search result and then clicks "Request a Demo" would be
   recorded as having come from the search engine, with no trace of the vertical
   page that actually did the work. So the in-site trail is tracked explicitly.

   Stored in sessionStorage so it survives a reload and dies with the tab. It
   holds no personal data: routes, an external referrer and any UTM parameters.

   The payload shape is the contract with whatever receives the submission —
   see PAYLOAD_SHAPE below. */

const KEY = 'saga.visit.v1';
const TRAIL_MAX = 12;

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
];

function read() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // private mode, or storage disabled
  }
}

function write(v) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* storage unavailable — provenance degrades, the form still works */
  }
}

/* The export uses trailingSlash, so routes arrive as "/public-safety/".
   Normalised on the way in so every stored route has one spelling — reporting
   that groups by source_page should not have to cope with two. */
function normalise(pathname) {
  if (!pathname) return '/';
  const clean = String(pathname).replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
}

/* Called on every route change, including the first. */
export function recordPage(rawPathname) {
  if (typeof window === 'undefined') return;
  const pathname = normalise(rawPathname);
  const now = new Date().toISOString();
  const existing = read();

  if (!existing) {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) utm[k] = v.slice(0, 200);
    }
    write({
      landingPage: pathname,
      externalReferrer: document.referrer || null,
      startedAt: now,
      utm,
      trail: [pathname],
    });
    return;
  }

  const trail = existing.trail || [];
  // A repeated pathname is a re-render, not a navigation.
  if (trail[trail.length - 1] === pathname) return;
  trail.push(pathname);
  write({ ...existing, trail: trail.slice(-TRAIL_MAX) });
}

/* The in-site page the visitor was on immediately before the current one.
   Null on a direct arrival, which is itself worth recording. */
export function sourcePage() {
  const v = read();
  if (!v || !v.trail || v.trail.length < 2) return null;
  return v.trail[v.trail.length - 2];
}

/* Maps a vertical route to its form value, so arriving from a vertical page
   pre-selects that vertical rather than making the visitor restate it. */
const ROUTE_TO_VERTICAL = {
  '/public-safety': 'publicSafety',
  '/governance': 'governance',
  '/brands': 'brands',
  '/celebrity': 'celebrity',
};

export function verticalFromRoute(pathname) {
  if (!pathname) return '';
  return ROUTE_TO_VERTICAL[normalise(pathname)] || '';
}

/* Assembled at submit time, not at mount — the trail is still growing while
   the visitor reads the page. */
export function provenance() {
  const v = read() || {};
  const src = sourcePage();
  return {
    source_page: src,
    source_vertical: verticalFromRoute(src) || null,
    landing_page: v.landingPage ?? null,
    external_referrer: v.externalReferrer ?? null,
    session_started_at: v.startedAt ?? null,
    page_trail: v.trail ?? [],
    utm: v.utm ?? {},
  };
}

/* The contract with whatever endpoint receives this. Documented here because
   the reporting that separates government-origin leads depends on these names
   staying stable. */
export const PAYLOAD_SHAPE = {
  // what the visitor typed
  name: 'string',
  organisation: 'string',
  role: 'string',
  vertical: 'one of: publicSafety | governance | brands | celebrity | undecided',
  region: 'string',
  message: 'string',

  // explicit consent, captured with what was agreed to and when
  consent: 'boolean — always true; the form cannot be submitted otherwise',
  consent_text: 'string — the exact wording shown, so a later change is detectable',
  consent_at: 'ISO 8601 timestamp',

  // provenance — the reason this checkpoint exists
  source_page: 'in-site route immediately before /contact, or null on direct arrival',
  source_vertical: 'vertical inferred from source_page, or null',
  landing_page: 'first in-site route of the session',
  external_referrer: 'document.referrer at session start, or null',
  session_started_at: 'ISO 8601 timestamp',
  page_trail: 'array of in-site routes, most recent last, capped at 12',
  utm: 'object of any utm_* / gclid parameters present on the landing URL',

  // submission context
  submitted_at: 'ISO 8601 timestamp',
  form_version: 'string — bump when fields change so old rows stay interpretable',

  // spam signal, advisory rather than enforced
  elapsed_ms: 'milliseconds between the form rendering and submission',
  suspected_automation:
    'boolean — true when elapsed_ms is implausibly short. The submission is still '
    + 'sent: a fast human (paste, autofill) must not be silently discarded, so the '
    + 'receiving end decides. Honeypot hits are dropped client-side and never arrive.',
};

export const FORM_VERSION = '2026-09-08.1';
