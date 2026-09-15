# Verification harness

Responsive layout regression (nine routes, ten viewport sizes):

    CHROME_PATH=/usr/bin/google-chrome node --experimental-websocket tests/test-responsive.mjs

Uses `http://127.0.0.1:3130` by default; override with `SAGA_TEST_URL`.
Checks horizontal overflow, home hero height, and pinned-card content bounds.

Zero-dependency browser tests. Drives a local Chrome over CDP, using Node's
flagged WebSocket — nothing is installed.

It looks for the Chromium Playwright caches at
`~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`. That cache is not
guaranteed to exist — it vanished from this machine on 2026-09-10 — so
`CHROME_PATH` overrides it:

    CHROME_PATH=/usr/bin/google-chrome node --experimental-websocket tests/test-cp12.mjs

    node "tests/serve.mjs" "$PWD/out" 3112 &      # serve the static export
    node --experimental-websocket tests/test-cp3.mjs

`probe.js` is injected before app code on every document and counts real
browser resources — IntersectionObservers (attributed by target element),
rAF handles, timers and resize listeners — independently of anything the
components report about themselves. That distinction matters: during
checkpoint 3 a deliberately leaked observer was invisible to the component's
own counters and only the probe caught it.

Checkpoint 3 tests assume a route mounting `<Globe/>`. The temporary
`/canvas-lab` route they were written against has been removed; re-point them
at the pillars section once checkpoint 5 lands.

Delete this directory if it stops earning its place.
