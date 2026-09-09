/* Per-route metadata, including canonical URLs.

   Canonicals are emitted only when NEXT_PUBLIC_SITE_URL is set. A canonical
   pointing at the wrong origin is worse than none — it tells search engines to
   consolidate on a URL that does not exist — so with no domain confirmed the
   tag is omitted rather than guessed. The production domain is
   [pending sign-off] and listed in copy/APPROVALS.md.

   Paths carry a trailing slash to match `trailingSlash: true` in the export, so
   the canonical and the URL actually served are the same string. */

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '');

export function canonicalPath(path) {
  if (path === '/') return '/';
  return `/${path.replace(/^\/+|\/+$/g, '')}/`;
}

export function pageMetadata({ title, description, path }) {
  const meta = { title, description };
  if (SITE) {
    meta.metadataBase = new URL(SITE);
    meta.alternates = { canonical: canonicalPath(path) };
    meta.openGraph = {
      title,
      description,
      url: `${SITE}${canonicalPath(path)}`,
      siteName: 'SAGA',
      type: 'website',
    };
  }
  return meta;
}
