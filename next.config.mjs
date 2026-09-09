/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    /* Verification instrumentation (window.__CANVAS_STATS__ / __SAGA_STAGE__)
       is compiled out unless this is '1'. Declared here so the value is always
       inlined as a literal — an undeclared NEXT_PUBLIC_* var is left as a
       runtime lookup instead, which defeats dead-code elimination and leaves
       the instrumentation in the shipped bundle. */
    NEXT_PUBLIC_CANVAS_STATS: process.env.NEXT_PUBLIC_CANVAS_STATS === '1' ? '1' : '',

    /* Where /contact posts. Declared here for the same reason as the flag
       above: an undeclared NEXT_PUBLIC_* var is left as a runtime lookup
       instead of being inlined. Unset while the destination is
       [pending: endpoint] — the form then says so rather than faking a send. */
    NEXT_PUBLIC_CONTACT_ENDPOINT: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || '',

    /* Origin for canonical and Open Graph URLs. Unset until the production
       domain is confirmed [pending sign-off]; canonicals are then omitted
       rather than pointed at a guessed origin. */
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '',
  },
};

export default nextConfig;
