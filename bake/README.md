# SAGA 3D sequence pipeline

You have no 3D artist, so nothing here depends on one. The narrative scenes are
**generated procedurally in code**, then **baked to numbered WebP frames**. A
design change is a code change plus a re-bake — not a re-render in Blender and
not a request to a contractor.

```
scenes.js ──────────────► bake/renderer.html ──────────────► frames/<scene>/0001.webp …
 the scene maths          headless bake target                the shippable asset
     │                                                                │
     └──────────────► Saga.html (live preview while designing) ◄─────┘
                                                          ScrubSequence.tsx plays them
```

## What's here

| File | What it is |
|---|---|
| `scenes.js` | The scene maths. Single source of truth for both the live preview and the bake. |
| `renderer.html` | Headless bake target — loads `scenes.js` (beside it) with the loop off and exposes `SAGA_RENDER(name, p, t)`. |
| `bake.py` | The baker. Drives a headless Chromium frame by frame and writes WebP. |
| `ScrubSequence.tsx` | The production React player. Drop-in replacement for a live scene. |
| `../frames/` | Baked output + `manifest.json`. |

## Baking

```bash
pip install playwright pillow --break-system-packages
playwright install chromium
cd bake
python3 bake.py                      # all five sequences
python3 bake.py observe understand   # just the ones you changed
```

Roughly 20 seconds per sequence. Current output:

| Sequence | Frames | Size |
|---|---|---|
| `noise` | 96 | 0.63 MB |
| `observe` | 96 | 1.11 MB |
| `understand` | 96 | 1.02 MB |
| `act` | 96 | 1.16 MB |
| `orbit` | 96 | 0.66 MB |
| **Total** | | **4.58 MB** |

All five sit inside the 2.5 MB-per-sequence budget from the brand system §6.6,
and only one loads at a time (one section ahead).

## Reproducibility

`scenes.js` seeds its own PRNG rather than calling `Math.random()`. The same
code and seed always produce byte-identical frames, so:

- a re-bake after an unrelated edit produces no diff noise
- two developers baking on different machines get the same asset
- you can bisect a visual regression

**Never introduce `Math.random()`, `Date.now()`, or `new Date()` into a scene.**
That is the one rule that keeps this pipeline honest.

## Using a baked sequence

```tsx
import ScrubSequence from '@/components/scene/ScrubSequence';

<section className="relative h-[250vh]">
  <div className="sticky top-0 h-screen flex items-center">
    <div className="w-1/2">{/* copy */}</div>
    <ScrubSequence name="observe" frames={96} className="absolute inset-0 -z-10" />
  </div>
</section>
```

The player handles the parts that are easy to get wrong:

- **Lazy** — nothing is fetched until the section is one viewport away.
- **Progressive** — every 6th frame loads first so the section is scrubbable
  almost immediately, then the gaps fill in.
- **Never blank** — before a frame has decoded it draws the nearest one it has.
- **Reduced motion** — loads and draws the final frame only, then attaches no
  listeners at all. Not "shorter animation" — no animation.
- **Canvas only** — decodes once to `ImageBitmap`, then only ever `drawImage`.
  No DOM work per frame, so it cannot cause layout.

## Changing a scene

1. Edit the scene function in `scenes.js`.
2. Open `../Saga.html` (the live preview) and scroll — the live preview runs the same maths, so
   you iterate at 60fps without baking anything.
3. When it looks right, `python3 bake.py <scene>`.
4. Commit the new frames.

## Tuning knobs

In `bake.py`:

- `WIDTH, HEIGHT` — 1600×900. Raising this raises size roughly with area.
- `FRAMES` — 96. Below ~72 the scrub starts to feel steppy on a fast scroll;
  above ~120 you pay bytes for motion nobody perceives.
- `QUALITY` — 82. On a black ground, below ~75 the faint grey particles start
  to band visibly. Check `noise` first if you lower it — it is the most fragile.

## If size ever becomes a problem

The fallback is a scrub-optimised MP4 with dense keyframes: smaller, but less
reliable to scrub on Safari, which is why frames are the default. Do not reach
for it until a sequence genuinely exceeds budget.
