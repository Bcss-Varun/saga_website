# Layer illustrations — /platform, "See beyond the signal."

One image per intelligence layer, named for its layer id:

    sentiment.webp  threat.webp  network.webp  geo.webp  evidence.webp

All five are in place. The `art: null` fallback in the content file is kept
anyway: a layer with no art draws its built-in schematic rather than an empty
half, which is what a sixth layer, or a replaced image, would land on.

Supplied art arrives as PNG at around 1.5MB. Keep the original in `images/`
outside `public/` (as `layer-<id>.png`) and ship a WebP at 1200px wide,
quality 82 — about 40KB, and no visible difference at this scale. A department
network is a poor place to send 1.5MB of decoration.

**`geo.webp` is cropped.** The supplied render carried a panel column naming
five real cities with a risk state each. See `copy/APPROVALS.md` item 6b: that
is an unapproved finding about a real place, so only the globe is used.

Then set `art` for that layer in `app/lib/content/platform.js`:

    art: '/images/layers/sentiment.png',

While `art` is null the card draws the built-in schematic instead, so the
section is complete either way and the two can be switched over one at a time.

The card gives the art half a fixed height, so a wide landscape image sits
better than a tall one; anything is contained rather than cropped. The `alt` is
empty on purpose — every card states its meaning in the copy beside the image,
so the illustration is decorative and should not be announced twice.
