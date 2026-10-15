/**
 * Shared micro-benchmark helpers — copy into your project's tools/ or scripts/bench/.
 *
 * Run individual suites: bun tools/benchmark-<domain>.mjs
 * Run all: bun run benchmark (with benchmark-run-all.mjs)
 */

/**
 * @param {string} label
 * @param {() => void} fn
 * @param {{ iterations?: number; warmup?: number; opsPerIteration?: number }} [options]
 */
export function bench(label, fn, { iterations = 400, warmup = 40, opsPerIteration = 1 } = {}) {
  for (let i = 0; i < warmup; i += 1) fn();

  const start = performance.now();
  for (let i = 0; i < iterations; i += 1) fn();
  const elapsed = performance.now() - start;
  const ops = iterations * opsPerIteration;
  return { label, elapsed, ops, perOpUs: (elapsed / ops) * 1000 };
}

/**
 * @param {string} label
 * @param {(sample: unknown) => void} fn
 * @param {unknown[]} samples
 * @param {{ iterations?: number; warmup?: number }} [options]
 */
export function benchSamples(label, fn, samples, { iterations = 400, warmup = 40 } = {}) {
  const runBatch = () => {
    for (const sample of samples) fn(sample);
  };

  for (let i = 0; i < warmup; i += 1) runBatch();

  const start = performance.now();
  for (let i = 0; i < iterations; i += 1) runBatch();
  const elapsed = performance.now() - start;
  const ops = iterations * samples.length;
  return { label, elapsed, ops, perOpUs: (elapsed / ops) * 1000 };
}

/**
 * @param {string} title
 * @param {Array<{ label: string; perOpUs: number }>} rows
 * @param {{ label: string; perOpUs: number }} reference
 */
export function printSection(title, rows, reference) {
  console.log("");
  console.log(title);
  console.log("─".repeat(72));
  for (const row of rows) {
    const speedup = reference.perOpUs / row.perOpUs;
    console.log(
      `${row.label.padEnd(46)} ${row.perOpUs.toFixed(2).padStart(8)} µs/op  ${speedup.toFixed(2)}× vs ref`,
    );
  }
}

/**
 * @param {string} label
 * @param {() => unknown} fn
 * @param {unknown} expected
 */
export function assertEqual(label, fn, expected) {
  const actual = fn();
  if (actual !== expected && JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Correctness failed (${label}): ${JSON.stringify(actual)} vs ${JSON.stringify(expected)}`);
  }
}

/**
 * @param {string} label
 * @param {(input: unknown) => unknown} candidate
 * @param {(input: unknown) => unknown} reference
 * @param {unknown[]} inputs
 */
export function assertSameResults(label, candidate, reference, inputs) {
  for (const input of inputs) {
    const expected = reference(input);
    const actual = candidate(input);
    if (expected !== actual) {
      throw new Error(`Mismatch (${label}) for ${JSON.stringify(input)}: ${expected} vs ${actual}`);
    }
  }
}

/**
 * @param {{ label: string; perOpUs: number }[]} rows
 */
export function pickFastest(rows) {
  return rows.reduce((best, row) => (row.perOpUs < best.perOpUs ? row : best), rows[0]);
}
