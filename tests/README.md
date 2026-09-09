# Verification harness

Zero-dependency browser tests. Drives the Chromium that Playwright already
cached, over CDP, using Node's flagged WebSocket — nothing is installed.

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
