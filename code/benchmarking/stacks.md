# Stack-specific benchmarking

Read the section that matches the project before writing suites. Combine with the improvement loop in [SKILL.md](SKILL.md).

---

## Discover project layout

```
Where do benchmarks live?
├── package.json has "benchmark" script → use that entrypoint
├── tools/benchmark-*.mjs or scripts/bench/*.mjs → existing convention; follow it
└── None yet → copy scripts from this skill's `scripts/` folder
    ├── benchmark-harness.mjs → tools/benchmark-harness.mjs
    ├── benchmark-run-all.mjs → tools/benchmark-run-all.mjs
    └── add "benchmark": "bun tools/benchmark-run-all.mjs" (or node)
```

**Runtime:** Prefer the project's package manager and runtime (`bun`, `node`, `pnpm exec tsx`). Record runtime + version in Round 0.

**Domain catalog:** For non-trivial codebases, add `tools/benchmark-domains.md` from [domains-template.md](domains-template.md).

---

## Bun / Node — pure functions

Best fit for micro-benchmarks (µs/op).

- Import production code directly from `src/` (TypeScript via Bun) or compiled `dist/`.
- Use `bench` for repeated single calls; `benchSamples` for batched inputs.
- Always include edge cases in `assertSameResults` (empty, null, normalized variants).
- Memoize: benchmark **cold** (fresh cache per op) and **warm** (shared cache).

```javascript
import { benchSamples, assertSameResults } from "./benchmark-harness.mjs";
import { productionFn } from "../src/module.ts";

assertSameResults("candidate", candidateFn, productionFn, inputs);
const reference = benchSamples("production", productionFn, inputs);
```

---

## React (client components, hooks, utils)

| What | How |
|---|---|
| Pure helpers | Same as Bun/Node — no renderer |
| Component render | happy-dom or jsdom + `react-dom/client` `createRoot` |
| Hooks | `@testing-library/react` `renderHook` — measure callback body only |
| Context-heavy trees | Minimal wrapper; mock providers with stable refs |

**Measure:** function under test only — not full test suite startup.

**Iterations:** 50–200 for render paths; 400 for cheap pure helpers.

**Do not** use Jest's `--testTimeout` timing as benchmark data.

---

## Next.js

Split by **where code runs**:

| Layer | Benchmark approach |
|---|---|
| Shared utils (`lib/`, `utils/`) | Bun/Node micro-bench — same as pure functions |
| Server Actions / Route handlers | Import handler; call with mocked `Request` / FormData; no real network |
| RSC / `async` server components | Extract pure data-fetch + transform; bench transform with fixture JSON |
| Client components | React section above |
| `getStaticProps` / caching | Bench serialization + MDX/markdown if hot; full build is manual-only |

**SSR / hydration / prompt-job tabs:** Live Cursor browser + CDP (`Runtime.evaluate`, `Performance.getMetrics`) is a valid Round 0 — nodes, images, TTFB, heap. Do not fake in a µs harness. Web-perf skill only for CWV / Lighthouse.

**Edge vs Node:** Run benches in the same runtime the code ships in when possible.

---

## Browser / DOM (no framework)

- happy-dom or jsdom for offline benches.
- Load fixtures from `tests/fixtures/` or saved HTML snippets.
- DOM-heavy: iterations ≤ 50–100.
- Full paint/layout or “which tab is heavy?”: live CDP is enough — no extra tooling.

---

## IndexedDB / localStorage / SQLite

- **Bun/Node:** use `fake-indexeddb`, `better-sqlite3` in-memory, or project test polyfills — only report numbers from a real store implementation.
- **If polyfill unavailable:** document manual Chrome trace; never invent timings.
- Seed realistic **N** (100, 1k, 10k) before measuring list/search.

---

## Chrome extensions

- Pure modules: Bun/Node import from `src/`.
- Popup/options pages: happy-dom + mock `chrome.*` APIs; measure init fn only.
- Content script / cold start: manual-only (Performance panel).

---

## Zip / bytes / crypto

- Synthetic payloads only — vary entry count and byte size tiers.
- Never fetch real URLs in benchmarks.
- iterations 10–100 depending on payload size.

---

## When to use a different skill

| Goal | Use instead |
|---|---|
| LCP, INP, CLS, Lighthouse | web-perf skill |
| React render churn in production | React Profiler / browser trace |
| DB query plans | EXPLAIN / APM, not micro-bench |

Micro-benchmarks answer: **"Is this function faster?"** not **"Is the site fast?"**
