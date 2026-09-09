/* Route + nav model.
   Vertical keys follow decision 5: `publicSafety` and `governance`, not the
   `police` / `political` keys the original WORLDS object used.

   The descriptors below are the existing labels carried across from
   Saga.html unchanged. [copy: needs specificity rewrite] */

export const VERTICALS = [
  {
    key: 'publicSafety',
    href: '/public-safety',
    name: 'Public Safety',
    descriptor: 'Law Enforcement & Public Safety',
  },
  {
    key: 'governance',
    href: '/governance',
    name: 'Governance',
    descriptor: 'Public Policy & Governance',
  },
  {
    key: 'brands',
    href: '/brands',
    name: 'Brands',
    descriptor: 'Brand & Enterprises',
  },
  {
    key: 'celebrity',
    href: '/celebrity',
    name: 'Celebrity',
    descriptor: 'Celebrity & Public Figures',
  },
];

export const NAV = [
  { href: '/platform', label: 'Platform' },
  { label: 'Solutions', items: VERTICALS },
  { href: '/investigation', label: 'Investigation' },
  { href: '/trust', label: 'Trust' },
];

export const CTA = { href: '/contact', label: 'Request a Demo' };
