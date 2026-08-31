#!/usr/bin/env python3
"""
SAGA — pre-rendered 3D sequence baker.

There is no 3D artist on this project, so the "pre-rendered" sequences are
generated procedurally from the same scene code the site runs, then baked to
numbered WebP frames. Re-running this with the same seed reproduces the same
frames exactly, so a scene tweak is a re-bake, not a re-shoot.

    pip install playwright pillow --break-system-packages
    playwright install chromium          # skip if PLAYWRIGHT_BROWSERS_PATH is set
    python3 bake.py                      # all scenes
    python3 bake.py observe understand   # just these

Output:  ../frames/<scene>/0001.webp ...  +  ../frames/manifest.json
"""
import json, os, shutil, sys, time
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent
OUT  = HERE.parent / "frames"
PAGE = (HERE / "renderer.html").resolve().as_uri()

# ── bake spec ───────────────────────────────────────────────────────────────
# width/height match the brand system's sequence spec (§6.6).
WIDTH, HEIGHT = 1600, 900
QUALITY       = 82          # WebP quality — 82 is the sweet spot on black
FRAMES        = 96          # 96 frames ≈ 2.5 MB per sequence at this size

# Each scene advances `t` as well as `p`, so ambient drift is baked in and the
# sequence does not look frozen when the visitor stops scrolling mid-section.
SCENES = {
    "noise":      {"t0": 4000, "dt": 42},
    "observe":    {"t0": 4000, "dt": 42},
    "understand": {"t0": 4000, "dt": 42},
    "act":        {"t0": 4000, "dt": 42},
    "orbit":      {"t0": 4000, "dt": 34},
}

def bake(names):
    OUT.mkdir(exist_ok=True)
    manifest = {}
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT},
                                device_scale_factor=1)
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(PAGE)
        page.wait_for_function("typeof window.SAGA_RENDER === 'function'", timeout=10000)

        for name in names:
            cfg = SCENES[name]
            d = OUT / name
            if d.exists():
                shutil.rmtree(d)
            d.mkdir(parents=True)
            t0 = time.time()

            for i in range(FRAMES):
                p = i / (FRAMES - 1)
                t = cfg["t0"] + i * cfg["dt"]
                page.evaluate("([n,p,t]) => window.SAGA_RENDER(n,p,t)", [name, p, t])
                png = d / f"{i+1:04d}.png"
                page.screenshot(path=str(png))
                im = Image.open(png).convert("RGB")
                im.save(d / f"{i+1:04d}.webp", "WEBP", quality=QUALITY, method=5)
                png.unlink()

            size = sum(f.stat().st_size for f in d.glob("*.webp"))
            manifest[name] = {
                "frames": FRAMES, "width": WIDTH, "height": HEIGHT,
                "pattern": f"/frames/{name}/{{n:0>4}}.webp",
                "bytes": size, "mb": round(size / 1048576, 2),
            }
            print(f"  {name:11s} {FRAMES} frames  {size/1048576:5.2f} MB  "
                  f"({time.time()-t0:.0f}s)")

        if errors:
            print("  ! page errors:", errors)
        browser.close()

    # merge with any previously baked scenes so a partial re-bake is safe
    mf = OUT / "manifest.json"
    existing = json.loads(mf.read_text()) if mf.exists() else {}
    existing.update(manifest)
    mf.write_text(json.dumps(existing, indent=2))
    total = sum(v["bytes"] for v in existing.values())
    print(f"\n  total baked: {total/1048576:.2f} MB across {len(existing)} sequences")
    print(f"  manifest:    {mf}")

if __name__ == "__main__":
    wanted = sys.argv[1:] or list(SCENES)
    bad = [w for w in wanted if w not in SCENES]
    if bad:
        sys.exit(f"unknown scene(s): {', '.join(bad)} — choose from {', '.join(SCENES)}")
    print(f"baking {len(wanted)} sequence(s) at {WIDTH}x{HEIGHT}, {FRAMES} frames each\n")
    bake(wanted)
