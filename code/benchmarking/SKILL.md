---
name: benchmarking
description: Micro-benchmark and iteratively improve hot paths in any codebase — baseline first, mandatory improvement suggestions (bottleneck + 3 creative ideas + recommended next step), bounded attempts, user lock-in checkpoints, then human WHY comments after lock-in. Use when the user asks to benchmark, profile, optimize performance, compare implementations, or measure µs/op before shipping perf changes. Applies to Bun/Node, React, Next.js, browser code, and extensions.
metadata:
  version: 1.0.0
  author: illyism
  source: https://il.ly/skills/benchmarking
---

# Micro-benchmarking

Encode **process**, not target numbers. Numbers change; the workflow stays fixed.

## Harness setup

```
Measuring a live page / tab / paint (DOM, RSC, navigation)?
├── Yes → Available browser tools + CDP is enough. Do not copy a µs harness.
│         Round 0 = nodes, images, TTFB, nav ms, heap. Report ms, not µs/op.
└── No (pure function / mapper / transform)
    ├── Harness exists in repo? → use tools/benchmark-*.mjs or scripts/bench/*
    └── No → copy from this skill's `scripts/` folder
             benchmark-harness.mjs + benchmark-run-all.mjs
             add package.json script: "benchmark": "bun tools/benchmark-run-all.mjs"
```

| Artifact | Typical location |
|---|---|
| Benchmark suites | `tools/benchmark-<domain>.mjs` or `scripts/bench/<domain>.mjs` |
| Shared harness | `benchmark-harness.mjs` (same dir as suites) |
| Domain catalog | `tools/benchmark-domains.md` (optional; use [domains-template.md](domains-template.md)) |
| Stack notes | [stacks.md](stacks.md) — React, Next.js, Node, DOM, IDB |

Benchmarks are **not** in CI. They are local decision tools before merging perf work.

---

## Step 0: Classify the work

```
Is this a perf investigation or a perf change?
├── Investigation only → run suites → Round 0 table → Suggest block → stop (unless user picks a suggestion)
└── Perf change → Improvement loop + Steps 1–6
```

```
No benchmark suite exists for this domain yet?
├── Yes → read hot path in src/ → propose suite outline in Suggest block → ask user before scaffolding
└── No → run existing suite
```

```
What surface are you measuring?
├── Pure function (no DOM, no I/O)
│   └── Import from src/ directly; use bench / benchSamples
├── React / Next client component
│   └── happy-dom or jsdom; see stacks.md
├── Server handler / RSC data path
│   └── Mock Request; bench transform only — see stacks.md
├── DOM pipeline (offline / unit)
│   └── happy-dom + HTML fixtures
├── Storage (IDB, SQLite)
│   └── polyfill in test runtime OR manual trace — never fake
└── Full page / tab / cold start / “which view is heavy?”
    └── Live browser + CDP. Valid Round 0. No harness, no Lighthouse required.
```

Live **DOM / CDP is first-class**, not a fallback. Open the real page, lock the tab, `Runtime.evaluate` + `Performance.getMetrics`. A table of nodes / images / TTFB / heap **is** the baseline. Skip copying `benchmark-harness.mjs` unless you are timing a pure function. Use the web-perf skill only when you need CWV / Lighthouse — not for “how fat is this tab?”

Stack-specific setup: [stacks.md](stacks.md).

---

## Suggest block (mandatory after every benchmark)

**Always** output this after Round 0 — investigation-only **and** improvement loop. Do not stop at a table alone. Do not jump straight to coding without surfacing suggestions unless the user already said "implement #1".

```
After benchmark numbers are in chat
├── Write Suggest block (template below)
├── State one Recommended next step (single sentence, bold the verb)
└── Then:
    ├── Investigation only → wait for user pick
    └── Improvement loop → Phase B uses the same 3 ideas; ask before Attempt 1 unless user said "try #1" / "proceed"
```

### Template

```markdown
### Bottleneck
<1–2 sentences: what dominates µs/op from numbers + a quick read of the hot path>

### Worth optimizing?
<Yes | Probably not | Need more data> — <one line tied to ship gate: ≥1.15× or ≥100µs user-visible>

### Ideas
1. **<Structural>** — <what> · <why from bottleneck> · risk: low|med|high
2. **<Cache / amortize>** — …
3. **<Less work>** — …

**Recommended next step:** <Try idea #N | Add benchmark for `<fn>` first | Lock in — already within noise | Stop — cost > payoff>
```

### Suggestion rules (strict)

| Rule | Why |
|---|---|
| Exactly **3** ideas, one per kind (structural / cache / less work) | Same breadth as Phase B |
| **Recommend one** next step — never leave a flat list | Agent proposes, not only measures |
| Tie every idea to **Round 0 numbers or code path** | Untethered ideas read generic |
| If cold path is ≥3× slower than warm, **one idea must address cold** | Warm-only wins often lie |
| If no suite exists **and** the surface is a pure function, recommend **scaffold benchmark** first | Can't optimize what you can't measure. Live page/tab → CDP table is enough; do not scaffold a harness. |
| At user checkpoint, repeat a one-line **Suggestion:** (`I'd lock in #2 because…`) | Informed nudge |

**Investigation-only still suggests.** Reporting numbers without ideas forces the user to invent the strategy.

---

## Improvement loop (perf changes only)

Walk this tree every optimization session. **Never skip Phase A.** **Never implement before Phase B.** **Never run attempt 4+ without a user checkpoint.**

```
Enter improvement loop
├── Phase A — Freeze baseline (Round 0)
├── Phase B — Three creative hypotheses
├── Phase C — Attempt rounds (max 3 before checkpoint)
│   └── After each attempt → user checkpoint
└── Phase D — Lock in (user chose "Lock in")
    └── Document WHY in src/ (final step — always)
```

### Phase A — Freeze baseline (always first)

Do this **before** editing production code or adding experiment branches.

1. Run the relevant suite (or `npm run benchmark` / `bun run benchmark`).
2. Paste the **Round 0** table in the chat:

```
Round 0 — baseline (production)
<domain> · fixture/payload · <runtime> <version>
<label>                                          XX.XX µs/op  (reference)
[cold row if caching exists]
User-visible action: <search | render | save | API call | …>
```

3. Note git state (clean / branch name). If the tree is already dirty from unrelated work, say so.

**Why:** Every later attempt compares to Round 0. Comparing attempt 2 only to attempt 1 hides regressions vs shipped code.

Immediately after Round 0, output the **Suggest block**. Phase B **reuses those 3 ideas** (refine if code read changed your mind — say what changed).

---

### Phase B — Three creative hypotheses (before coding)

Same content as **Suggest block → Ideas**, ranked by ROI. If you already posted Suggest block in Phase A, write:

`Phase B: attempting ranked idea #<N> — <title> (user confirmed | user said proceed | default #1 after suggest)`

Output the ranked list only when Suggest block was skipped (user jumped straight to "optimize X").

For each idea when listing fresh:

- **What** — concrete change in `src/` or benchmark variant name
- **Why it might win** — tied to Round 0 bottleneck
- **Risk** — `low` | `med` | `high`

| Slot | Kind | Example angles |
|---|---|---|
| **1 — Structural** | Algorithm, data layout, precompute, typed arrays | Precompute lookup table; flatten nested loop |
| **2 — Cache / amortize** | Memo, batching, reuse, warm vs cold | Normalized cache keys; shared Map vs per-call |
| **3 — Less work** | Early exit, skip work, smaller scan, defer | Reject cheap before expensive; cap walk depth |

Rank 1 → 3 by expected ROI. **Attempt order follows that rank.**

---

### Phase C — Attempt rounds

**Hard limit:** at most **3 implementation attempts** per checkpoint cycle.

For each attempt:

```
Attempt N (<idea title>)
- [ ] assertSameResults (Step 1) — fail → fix or abandon, do not bench
- [ ] Warm bench vs Round 0 baseline
- [ ] Cold bench vs Round 0 (if caching exists)
- [ ] Ship gate (Step 3) — pass/fail with numbers
- [ ] User checkpoint (below) — mandatory before next attempt
```

Report format:

```
Round 0 — baseline     XX.XX µs/op
Attempt N — <label>    YY.YY µs/op   Z.ZZ× vs Round 0
Ship gate: pass | fail (<which criterion>)
```

Keep experiment variants **in the same benchmark file** until lock-in. Label rows clearly (`E1:`, `E2:`).

#### User checkpoint (mandatory after each attempt)

Stop coding. Ask the user to choose **one**:

| Option | Agent does next |
|---|---|
| **Lock in** | Phase D — ship winning attempt, delete losers |
| **Try next idea** | Next ranked hypothesis from Phase B |
| **More ideas** | New Phase B (3 fresh hypotheses); resets attempt counter |
| **Stop** | Revert uncommitted experiments; leave production unchanged |

End with: `**Suggestion:** <I'd Lock in | Try #N | More ideas | Stop> — <one sentence why>`

If 3 attempts are used without **Lock in** or **More ideas**, **must** checkpoint — no silent 4th attempt.

---

### Phase D — Lock in

Only after user chooses **Lock in**.

1. Merge winning change into `src/`.
2. Remove dead experiment branches from benchmark file; keep Round 0 + production row.
3. Run project test command + typecheck if applicable.
4. Post final summary:

```
Locked in: <one-line what changed>
Round 0 → shipped: XX.XX → YY.YY µs/op (Z.ZZ×)
User-visible: <action improved>
Cold path: unchanged | ±N% (note if tradeoff accepted)
```

5. **Document WHY in `src/`** — see Step 7. Perf work is not done until a future reader knows *why* the odd-looking code exists.
6. Step 6 housekeeping.

**Never lock in** an attempt that failed assertSameResults or ship gate without explicit user override.

---

## Step 7 — Perf comments (after lock-in)

Add comments **only after lock-in** — not during experiments.

### When to comment

```
Did the lock-in change behavior a reader wouldn't guess?
├── No (rename, move, obvious one-liner) → no comment
└── Yes
    ├── Memo / cache / fast path / different algorithm?
    │   └── Comment WHY — user scenario + repeated work avoided
    ├── Accepted tradeoff (warm vs cold, memory for speed)?
    │   └── Comment the tradeoff in plain language
    └── Skipped work (early exit, smaller scan)?
        └── Comment what we stopped doing and when it applies
```

### Comment rules (strict)

| Rule | Why |
|---|---|
| **WHY only** — never narrate what the next line does | Obvious code needs no comment |
| **User-visible scenario** — page load, search keystroke, render | Ties optimization to product context |
| **Never** paste µs/op, speedup multiples, or Big-O into `src/` | Numbers rot |
| **1–2 lines max** per optimization site | Long essays dilute signal |
| **Human tone** — write for the next maintainer | Plain language beats jargon |

```typescript
// Good — WHY in human terms
// Same rgb string appears on dozens of nodes in one render — remember the parse.
const resolveRgbCached = memoizeString(resolveRgbRaw);
```

---

## Step 1: Correctness before timing (always)

1. Pick **reference** = current shipped code.
2. Pick **candidate** = experiment.
3. Build `inputs` covering edge cases.
4. Call `assertSameResults(label, candidate, reference, inputs)` from harness.
5. If outputs differ → fix or abandon. Do not tune wrong code.

---

## Step 2: Warmup and iteration rules (strict)

| Rule | Value | Why |
|---|---|---|
| Always warmup | ≥ 20 iterations, or 10% of timed iterations | JIT skew |
| Default timed iterations | 400 cheap; 40–100 expensive (DOM, zip) | Volume vs stability |
| Report metric | **µs/op** = `(elapsed_ms / total_ops) × 1000` | Comparable |
| Compare speedup | vs explicit **reference row** | No cherry-picking |
| Cold vs warm | Run **both** when caching exists | Users hit cold on first use |
| Environment note | Record runtime version in chat/PR | Absolute µs/op is machine-specific |

### Cold cache definition

```
Does the code memoize?
├── Yes → cold = fresh cache per op OR bypass path
└── No → cold = warm only (label it)
```

---

## Step 3: Ship gate + experiment checklist

Per attempt:

```
- [ ] Reference = Round 0 production
- [ ] assertSameResults passes
- [ ] Warm benchmark vs Round 0
- [ ] Cold benchmark vs Round 0 (if caching)
- [ ] Realistic payload documented
- [ ] Ship gate evaluated
- [ ] User checkpoint answered
```

### Ship gate (all must pass to offer "Lock in")

1. **Correctness:** assertSameResults + existing tests green.
2. **Meaningful win:** ≥ **1.15×** on realistic workload **or** ≥ **100 µs** saved per user-visible action.
3. **No regression elsewhere:** Warm win but cold > 10% slower → document or reject.
4. **Complexity tax:** Reject > ~30 lines unless win is ≥ 2×.

**Why 1.15×:** Below that, noise and maintenance dominate.

---

## Step 4: File conventions

### New suite: `tools/benchmark-<domain>.mjs`

```javascript
#!/usr/bin/env bun
/**
 * Benchmark <domain> — <one line>.
 * Run: bun tools/benchmark-<domain>.mjs
 */
import { bench, benchSamples, printSection, assertSameResults } from "./benchmark-harness.mjs";
import { productionFn } from "../src/<module>.ts";

// 1. inputs + assertSameResults
// 2. const reference = benchSamples(...)
// 3. const candidate = benchSamples(...)
// 4. printSection("Title", [reference, candidate], reference);
```

Rules:

- **Shebang + run comment** on every file.
- Import **production** from `src/` — never fork logic unless comparing abandoned baseline (label clearly).
- Keep experiments **in the same file** until one ships; delete losers after merge.
- Do **not** add benchmarks to `tests/` — tests assert correctness; benchmarks measure time.

### Output format (always)

```
<Domain>
────────────────────────────────────────────────────────────────────────
<label>                                          XX.XX µs/op  X.XX× vs ref
```

---

## Step 5: Stack constraints

See [stacks.md](stacks.md) for React, Next.js, Node/Bun, DOM, IDB, extensions.

Project-specific hot paths: maintain `tools/benchmark-domains.md` from [domains-template.md](domains-template.md).

---

## Step 6: After shipping

1. Remove experiment branches that lost.
2. Update `benchmark-domains.md` if a new hot path exists.
3. Mention benchmark command in PR if perf-sensitive.
4. Confirm Step 7 perf comments are in `src/`.
5. **Append an outcome entry** — see [outcomes-template.md](outcomes-template.md): timestamped file, suites run, Round 0 → shipped table, portable learnings. Update [perf-rules.md](perf-rules.md) if a new rule generalizes. Add live trace rows to [perf-live-traces.md](perf-live-traces.md) when manual profiling was used.

Treat **perf-rules.md** like eslint policy for hot paths: short, actionable, no golden numbers in repo code.

---

## Do not

- Start experiments before **Round 0 baseline** is in chat.
- Implement a 4th attempt without **More ideas** + user consent.
- Lock in without user checkpoint (unless user said "ship it" upfront).
- Commit benchmark results as golden numbers.
- Ship perf changes without assertSameResults.
- Use `console.time` alone — use harness µs/op.
- Benchmark in CI (flaky runners).
- Optimize without naming the user-visible action improved.
- Present only attempt-vs-attempt speedups — **always** show vs Round 0.
- End with only a table — **always** Suggest block + Recommended next step.
- Implement before Suggest block (unless user named an idea).
- Add perf comments during experiments — wait for lock-in.
- Put µs/op or Big-O in `src/` comments.

---

## Additional resources

- Stack guides: [stacks.md](stacks.md)
- Domain catalog template: [domains-template.md](domains-template.md)
- Outcome log template: [outcomes-template.md](outcomes-template.md)
- Live trace workflow: [perf-live-traces.md](perf-live-traces.md)
- **Chrome DevTools recording & reading:** [devtools.md](devtools.md)
- Portable perf rules: [perf-rules.md](perf-rules.md)
- Harness scripts: [scripts/benchmark-harness.mjs](scripts/benchmark-harness.mjs), [scripts/benchmark-run-all.mjs](scripts/benchmark-run-all.mjs)
