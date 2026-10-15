# Chrome DevTools — live perf for extensions

Use this when the benchmarking skill routes you to **manual trace** (picker hover, full action E2E, cold start). Report **ms**, not µs/op.

Local harness first: [SKILL.md](SKILL.md). When to trace vs bench: [perf-live-traces.md](perf-live-traces.md).

---

## Before you record

| Do | Don't |
|---|---|
| Reload the extension after code changes (`chrome://extensions` or dev watcher) | Record during the first second after opening Performance (profiler startup spike) |
| Pick **one** action per trace (hover-only **or** copy-only **or** both — label it) | Mix many unrelated actions in one recording |
| Note URL, extracted element (tag + rough size), export format (JSX / Tailwind / CSS) | Trust absolute ms across machines as ship gates |
| CPU: **No throttling** unless reproducing mobile | Use Lighthouse for picker/content-script hot paths |

**Profiler noise:** The first long frame after Record often includes `CpuProfiler::StartProfiling` (hundreds of ms). Start moving the picker **after** recording begins, or trim that frame when reading the trace.

---

## Record an extension trace (Chrome MV3)

1. Open the **target tab** (real site — Vercel, docs, etc.).
2. Open DevTools → **Performance** (not Lighthouse).
3. Click **Record** (circle) — do not reload unless measuring cold inject.
4. **Enable the extension's picker** (extension popup or shortcut).
5. Perform the labeled action:
   - **Hover:** move across 3–5 elements for ~3s; do not click.
   - **Copy:** one click or Enter on a single element.
   - **Both:** hover ~2s, then one copy — say so in notes.
6. Stop recording.
7. In the flame chart, select the longest **Main** task during your action (ignore the first profiler frame).

### Export for agent review

- **Save profile:** Performance panel → down-arrow → **Save profile** → `Trace-YYYYMMDDTHHMMSS.json`
- Attach the JSON in chat, or paste a screenshot of **Bottom-up** / **Call tree** filtered to `content.bundle`

---

## Read the trace

### Find your extension's work

Filter or search the call tree for:

| Function (example names) | Path | Means |
|---|---|---|
| `onMouseMove` handler | content script | Hover / selection (should be sub-ms per call × N moves) |
| `updateOverlay` | content script | Outline / toolbar repaint |
| `handleClick` | content script | User action started |
| `serialize` / `transform` | export | Pure computation on the click path |
| color / style conversion | export | Heavy on CSS-variable-rich sites |

Swap in your own function names; the point is to tag each hot function with the layer it belongs to.

**Your extension's user-timing marks** may appear as a user-timing bucket in Bottom-up — child calls still map to `content.bundle.js`.

### Separate hover vs copy

| Symptom | Likely layer | Next step |
|---|---|---|
| Lag while moving mouse, outline stuck or jumpy | Hover handler / overlay updates | Fix the content script; do not tune the export benchmark |
| Fine hover, pause on click | Export / mapper / clipboard | Run the export benchmark suite; check for storage reads or caches on the click path |
| Long frame before click, fast copy | Hover frame dominated pre-click | Same as row 1 |
| ~500ms once at trace start | DevTools profiler | Ignore; re-record or trim |

### Quick JSON sanity (optional)

From repo root, on a saved trace:

```bash
bun -e "
const ev = JSON.parse(require('fs').readFileSync('PATH/Trace.json','utf8')).traceEvents;
const hits = ev.filter(e => e.ph==='X' && e.dur>500 && e.args?.data?.url?.includes?.('content.bundle'));
const m = new Map();
for (const e of hits) { const k = e.args?.data?.functionName||'?'; m.set(k,(m.get(k)||0)+e.dur); }
console.log([...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,v])=>[k,(v/1000).toFixed(1)+'ms']));
"
```

---

## Extension-specific surfaces (manual-only)

Typical surfaces for a picker-style extension (keep your own list in `tools/benchmark-domains.md`):

| Surface | What to measure |
|---|---|
| Picker first paint | Time from enable inspection → outline visible |
| Hover | Mouse-move handler aggregate ms over 3s |
| Copy E2E | Click → clipboard → “Copied” feedback |
| Extension cold start | Popup open, content script inject (separate traces) |

Happy-dom benchmarks cover **export/mapper** only — not outline paint or `elementFromPoint` on real DOM.

---

## After the trace

1. Append a row to [perf-live-traces.md](perf-live-traces.md) (date, URL, action, dominant ms, conclusion).
2. If shipping a fix: local Round 0 → change → optional confirm trace → outcome entry ([template](outcomes-template.md)) + [perf-rules.md](perf-rules.md).
3. Live traces **confirm feel**; ship gate for code changes stays on local bench + tests unless the bug is paint/input-only (no suite).

---

## When to use something else

| Goal | Use |
|---|---|
| LCP, INP, CLS, whole page load | [web-perf skill](../../web-perf/SKILL.md) |
| React component render churn | React Profiler |
| Function µs/op on fixtures | `bun run benchmark` — not DevTools |
