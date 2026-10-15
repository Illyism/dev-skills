# Perf rules (portable lint policy)

Short rules agents and reviewers apply on hot paths. **No golden µs** — only patterns. Update after each outcome log ([template](outcomes-template.md)) lock-in when a learning generalizes.

## I/O and extension APIs

| Rule | Rationale |
|---|---|
| **P-01** Don't read `chrome.storage` (or async settings) on every user action in a session | Preload at session start; listen to `onChanged` for invalidation |
| **P-02** Defer analytics, persistence, and library writes until after the user-visible outcome | Clipboard / download / toast first |

## DOM and export walks

| Rule | Rationale |
|---|---|
| **P-03** Scope memo caches to one export or picker session; clear on `endSession` | Avoid stale styles; bound memory |
| **P-04** Memoize repeated pure transforms (color parse → utility, normalized keys) inside that scope | Same computed string hits dozens of nodes on dashboards |
| **P-05** Skip redundant work on high-frequency events (hover): early exit when target unchanged | RAF-coalesce + contains-check before re-selection |
| **P-10** Skip page shell on small extracted elements; don’t inject body font/color on phrasing roots | Paste targets already set globals; small `div`s skip `min-h-screen` wrapper |
| **P-11** Hover skip: never block child drill-down inside a highlighted ancestor | `contains(rawElement)` made picker feel stuck/laggy on real pages |

## Measurement

| Rule | Rationale |
|---|---|
| **P-06** Round 0 baseline before editing production code | Compare all attempts vs shipped, not vs last attempt |
| **P-07** Local bench for export/mapper; live trace for picker E2E and real-site CSS | Don't optimize hover from export-benchmark numbers alone |
| **P-08** Log lock-ins to outcome log ([template](outcomes-template.md)) with date, suites, and portable learnings | Builds org memory; numbers stay in the log file only |

## Next.js Cache Components + auth

| Rule | Rationale |
|---|---|
| **P-12** Don't call `getSession` / `headers()` at the page root under Cache Components | Uncached request data blocks prerender; wrap auth + page fetch in `<Suspense>` so the shell can stream |
| **P-13** `await connection()` before Better Auth `getSession` when `cookieCache` is on | Cookie-cache expiry uses `Date.now()`; without a request-time mark, layouts throw `blocking-prerender-current-time` |
| **P-14** Don't put slow SQL or full-export payloads in the initial RSC document; fetch below-the-fold on view | Suspense still keeps HTML open until the slowest island; competing POSTs delay above-the-fold charts |
| **P-15** Directory homepages: first HTML is above-the-fold only; load the card grid after intersection (or filter URL) | `Suspense` still serializes the listing into the document; observer + client fetch keeps screenshot URLs out of first paint |

## Remotion / headless stills

| Rule | Rationale |
|---|---|
| **P-16** Don't call `renderStill` per live still request | It opens a tab, loads the webpack bundle, screenshots, and closes — that dwarfs React caption layout |
| **P-17** Pass cacheable HTTPS template URLs into the player, not data URLs | Same format, new captions should hit Chrome's HTTP cache instead of re-decoding a giant base64 string |

## Comments in `src/`

| Rule | Rationale |
|---|---|
| **P-09** WHY comments only after lock-in; no µs/op in code | See benchmarking skill Step 7 |
