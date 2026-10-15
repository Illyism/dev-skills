# Performance: local benchmark vs live trace

Use **both**, in this order. Local µs/op decides whether to ship; live ms confirms feel on real pages.

**How to record and read Chrome traces:** [devtools.md](devtools.md)

## When to use which

| Surface | Tool | Report as |
|---|---|---|
| Export pipeline, mapper, zip, IDB | `bun run benchmark` / `tools/benchmark/*.mjs` | µs/op vs Round 0 |
| Picker hover, outline paint, first inject | Chrome Performance on target tab | ms frames |
| Full user action E2E (copy → clipboard → toast) | Chrome Performance + optional console marks | ms to feedback |
| Extension cold start, popup open | Manual Chrome only | ms wall time |

**Do not** fake extension storage latency in CI. Mock delay in a dedicated suite  is fine for I/O shape.

## Live trace checklist

1. Record **one** representative action (hover only, copy only, or both — label which).
2. Note URL, element size, format (JSX/Tailwind/CSS).
3. Identify longest task; name the function stack if visible.
4. Compare to local bench — if bench says fast but trace says slow, the gap is I/O, main-thread yield, or site-specific CSS.

## Trace log

Append one row per investigation. Link the outcome entry when a change ships (see [outcomes-template.md](outcomes-template.md)).

| Date | URL / fixture | Action | Dominant ms | Conclusion | Outcome file |
|---|---|---|---|---|---|
| YYYY-MM-DD | e.g. `/dashboard` | e.g. open report | before → after | what shipped, or why not | link |

## After a live trace

1. If the slow part is pure computation (transform, export, serialize) → run or extend the matching local benchmark fixture.
2. If the slow part is paint or input handling → stay in the live trace; happy-dom has no substitute for paint.
3. Append row above; if locked in, copy learnings to [perf-rules.md](perf-rules.md) and an outcome entry ([template](outcomes-template.md)).
