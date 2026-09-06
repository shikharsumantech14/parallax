#!/usr/bin/env node
/**
 * vercel-runtime — corrects the Node runtime @astrojs/vercel stamps on the
 * serverless function. Runs as `postbuild`, so it fires on every `npm run
 * build` including Vercel's.
 *
 * WHY THIS EXISTS
 * ---------------
 * `@astrojs/vercel@7.8.2` derives the function runtime from the version of
 * Node the BUILD is running on, against a hardcoded table that stops at 20:
 *
 *   const SUPPORTED_NODE_VERSIONS = {
 *     18: { status: 'retiring', ... },
 *     20: { status: 'default' },
 *   };
 *
 * Anything outside that table falls back to `nodejs18.x` — which Vercel no
 * longer accepts, so the deploy is rejected after a clean build:
 *
 *   The following Serverless Functions contain an invalid "runtime":
 *     - _render (nodejs18.x)
 *
 * There is no escape hatch: `getRuntime()` reads `process.version` and the
 * adapter exposes no option, env var or config field to override the result.
 * The value is used in exactly one place — the `runtime` key of each
 * function's `.vc-config.json` — so correcting it there is the whole fix.
 *
 * `.vc-config.json` is Vercel's documented Build Output API v3 contract, not
 * an adapter internal, which is what makes this safe to write to.
 *
 * The floor is the adapter, not Node: 7.8.2 can never emit anything above
 * `nodejs20.x`, and Vercel deprecates Node 20 on 2026-10-01. Adapter v8 fixes
 * this properly but requires Astro 5 (Content Layer API — reaches all 97
 * kinds and every issue). DELETE THIS SCRIPT when that upgrade lands.
 *
 * The target runtime is derived from `engines.node` rather than hardcoded, so
 * the build machine's Node and the function's runtime cannot drift apart.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FUNCTIONS_DIR = join(root, '.vercel/output/functions');

// A static-only build emits no functions. Nothing to correct, not an error.
if (!existsSync(FUNCTIONS_DIR)) process.exit(0);

// ── the target, from engines.node ────────────────────────────────────────────
// Vercel reads the same field to pick the build image, so this keeps one
// source of truth. It must be a pinned major: a RANGE is what caused the
// original failure (`>=20.0.0` resolves to the latest major, per Vercel's
// own version table), so refuse to run against one rather than paper over it.
const { engines } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
const pin = engines?.node ?? '';
const major = /^(\d+)\.x$/.exec(pin)?.[1];

if (!major) {
  console.error(
    `vercel-runtime: engines.node is "${pin}" — expected a pinned major such as "22.x".\n` +
      '  A range lets Vercel pick a Node the adapter does not recognise, which is\n' +
      '  the exact failure this script exists to prevent. Pin it and rebuild.',
  );
  process.exit(1);
}

const RUNTIME = `nodejs${major}.x`;

// ── walk the function bundles ────────────────────────────────────────────────
const configs = readdirSync(FUNCTIONS_DIR, { recursive: true, withFileTypes: true })
  .filter((e) => e.isFile() && e.name === '.vc-config.json')
  .map((e) => join(e.parentPath ?? e.path, e.name));

if (configs.length === 0) {
  console.error('vercel-runtime: .vercel/output/functions exists but holds no .vc-config.json');
  process.exit(1);
}

let patched = 0;

for (const path of configs) {
  const config = JSON.parse(readFileSync(path, 'utf-8'));
  if (config.runtime === RUNTIME) continue;

  const was = config.runtime;
  config.runtime = RUNTIME;
  writeFileSync(path, `${JSON.stringify(config, null, '\t')}\n`);
  patched++;
  console.log(`vercel-runtime: ${relative(root, path)} — ${was} → ${RUNTIME}`);
}

console.log(
  patched === 0
    ? `vercel-runtime: ${configs.length} function(s) already on ${RUNTIME}`
    : `vercel-runtime: corrected ${patched} of ${configs.length} function(s) to ${RUNTIME}`,
);
