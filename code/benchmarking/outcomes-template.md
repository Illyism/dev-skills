# Benchmark outcomes log

Keep these in your own repo (e.g. `docs/perf-outcomes/`). One file per **locked-in** perf change. Numbers are machine-specific; **patterns and rules** are what we keep.

## When to append

After Phase D (lock-in), not after investigation-only runs.

## Filename

`YYYY-MM-DD-<project-or-domain>-<short-slug>.md`

Example: `2026-01-15-checkout-form-validation.md`

## Template (copy per entry)

```markdown
# <title>

- **Date:** YYYY-MM-DD
- **Project:** repo or product name
- **User-visible action:** e.g. Enter / Copy in picker
- **Suites:** `bun tools/benchmark/<suite>.mjs` (+ live trace if used)
- **Runtime:** Bun x.x · happy-dom / Chrome trace

## Locked in

| Change | Module | Ship gate |
|---|---|---|
| … | `src/…` | pass / fail + why |

## Round 0 → shipped (µs/op or ms)

| Label | Before | After | × vs ref |
|---|---|---|---|

## Learnings → perf rules

- Rule N: … (portable; no golden µs)

## Live trace (optional)

Link or summary from [perf-live-traces.md](perf-live-traces.md).

## Next ideas (not shipped)

- …
```

## Perf rules index

Derived rules live in [perf-rules.md](perf-rules.md). After each lock-in, add or tighten a rule if the learning generalizes — treat it like lint policy for hot paths.
