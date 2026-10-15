# Benchmark domain catalog

Maintain this in the project when hot paths multiply. One row = one benchmark row or suite section.

## Pure utils (no DOM / no I/O)

| Domain | Module | Functions | Sample inputs | Suite file |
|---|---|---|---|---|
| Example | `src/lib/format.ts` | `formatCurrency` | edge cases, locales | `tools/benchmark-format.mjs` |

**Scale:** 400 iterations × sample count for µs-scale ops.

---

## DOM / React / server

| Domain | Module | Functions | Fixture | Iterations |
|---|---|---|---|---|
| Example | `src/components/List.tsx` | render + filter | saved HTML or factory | ≤ 100 |

---

## Storage / network-shaped (mock only)

| Domain | Module | Functions | Scale N | Notes |
|---|---|---|---|---|
| Example | `src/db/items.ts` | `list`, `search` | 100, 1k, 10k | polyfill IDB in Bun; never fake timings |

---

## Manual-only (document, do not fake)

| Surface | How |
|---|---|
| Which tab / view is heavy? | Live CDP: nodes, images, TTFB, heap — no harness |
| Full page load / LCP | Chrome DevTools Performance or web-perf skill |
| Cold app start | Real device or browser trace |

Report manual traces as **ms**, not µs/op.

---

## Planned suites

Priority when profiling shows cost:

1. …
2. …
