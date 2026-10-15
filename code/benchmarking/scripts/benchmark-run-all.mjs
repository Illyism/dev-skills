#!/usr/bin/env bun
/**
 * Run every benchmark-*.mjs in a directory except this runner and the shared harness.
 *
 * Copy to your project (e.g. tools/benchmark-run-all.mjs) and wire:
 *   "benchmark": "bun tools/benchmark-run-all.mjs"
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const toolsDir = import.meta.dir;
const skip = new Set(["benchmark-harness.mjs", "benchmark-run-all.mjs"]);

const suites = readdirSync(toolsDir)
  .filter((name) => name.startsWith("benchmark-") && name.endsWith(".mjs") && !skip.has(name))
  .sort();

if (suites.length === 0) {
  console.error("No benchmark suites found in", toolsDir);
  process.exit(1);
}

let failed = false;

for (const suite of suites) {
  console.log(`\n${"═".repeat(72)}\n▶ ${suite}\n${"═".repeat(72)}`);
  const result = spawnSync(process.execPath, [join(toolsDir, suite)], {
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) failed = true;
}

process.exit(failed ? 1 : 0);
