#!/usr/bin/env node
/**
 * check-catalog — the registry gate.
 *
 *   npm run check:catalog        (also runs as part of `prebuild`)
 *
 * Enforces four things about SECTION_KINDS (src/content/config.ts):
 *
 *   1. every kind has a `## <kind>` block in docs/design/catalog.md
 *   2. every catalog block names a real kind
 *   3. the two lists are in the SAME ORDER
 *   4. every non-narrative kind has an EXPLAIN entry (src/lib/explainers.ts)
 *      and a KIND_PRIORITY score (src/lib/story.ts)
 *
 * Why 4 exists: both maps fail SILENTLY. A kind with no EXPLAIN renders no
 * comprehension line unless the author happens to supply `plain`; a kind with
 * no KIND_PRIORITY falls to the default 30 in story.ts and is effectively
 * unrankable as a story beat. Neither shows up in a build, a browser, or a
 * diff — which is exactly how four WebGL flagships sat unscored.
 *
 * Reports EVERY failure in one run. An earlier version hid the order check
 * behind `if (!fail)` and stopped at the first drift, so a single missing block
 * masked every ordering problem behind it.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf-8');

/* Narrative kinds explain themselves — they carry prose, not a graphic — so
   they are exempt from EXPLAIN. Keep in sync with the header comment in
   src/lib/explainers.ts, which states the same list. */
const NARRATIVE = new Set([
  'hero', 'act-break', 'prose', 'quote', 'beat-sheet', 'analogy', 'comparison',
]);

/* hero and act-break are deliberately scored <= 0 in KIND_PRIORITY so the story
   builder filters them out; they are exempt from the "must be scored" rule only
   in the sense that any explicit entry counts. */
const errors = [];
const fail = (msg) => errors.push(msg);

// ── the three lists ────────────────────────────────────────────────────────
const config = read('src/content/config.ts');
const arrMatch = config.match(/SECTION_KINDS\s*=\s*\[([\s\S]*?)\]\s*as const/);
if (!arrMatch) { console.error('check-catalog: SECTION_KINDS not found'); process.exit(1); }
const kinds = [...arrMatch[1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);

const blocks = [...read('docs/design/catalog.md').matchAll(/^## ([a-z0-9-]+)\s*$/gm)].map((m) => m[1]);

const explain = read('src/lib/explainers.ts');
const explainKeys = new Set([...explain.matchAll(/^\s*'([a-z0-9-]+)':\s*\{/gm)].map((m) => m[1]));

const story = read('src/lib/story.ts');
const kpBlock = story.match(/KIND_PRIORITY[^=]*=\s*\{([\s\S]*?)\n\};/);
if (!kpBlock) { console.error('check-catalog: KIND_PRIORITY not found in src/lib/story.ts'); process.exit(1); }
const priorityKeys = new Set([...kpBlock[1].matchAll(/'([a-z0-9-]+)'\s*:/g)].map((m) => m[1]));

const kindSet = new Set(kinds);
const blockSet = new Set(blocks);

// ── 1 + 2: membership, both directions ─────────────────────────────────────
for (const k of kinds) if (!blockSet.has(k)) fail(`MISSING catalog block: ## ${k}`);
for (const b of blocks) if (!kindSet.has(b)) fail(`UNKNOWN catalog block (not in SECTION_KINDS): ## ${b}`);

// ── 3: order. Runs unconditionally, and reports every drift, not just the
// first — comparing only the kinds present in both so a missing block does not
// cascade into a false drift at every later position. ───────────────────────
const inBoth = blocks.filter((b) => kindSet.has(b));
const expectedOrder = kinds.filter((k) => blockSet.has(k));
for (let i = 0; i < expectedOrder.length; i++) {
  if (expectedOrder[i] !== inBoth[i]) {
    fail(`ORDER drift at position ${i}: SECTION_KINDS has '${expectedOrder[i]}', catalog has '${inBoth[i] ?? '(nothing)'}'`);
  }
}

// ── 4: the two silent maps ─────────────────────────────────────────────────
for (const k of kinds) {
  if (!NARRATIVE.has(k) && !explainKeys.has(k)) {
    fail(`MISSING EXPLAIN entry: '${k}' (src/lib/explainers.ts) — it will render no "In plain terms" line unless every section authors \`plain\` by hand`);
  }
  if (!priorityKeys.has(k)) {
    fail(`MISSING KIND_PRIORITY score: '${k}' (src/lib/story.ts) — it silently defaults to 30 and will not be picked as a story beat`);
  }
}
for (const k of explainKeys) if (!kindSet.has(k)) fail(`STALE EXPLAIN entry: '${k}' is not in SECTION_KINDS`);
for (const k of priorityKeys) if (!kindSet.has(k)) fail(`STALE KIND_PRIORITY score: '${k}' is not in SECTION_KINDS`);

// ── report ─────────────────────────────────────────────────────────────────
if (errors.length) {
  for (const e of errors) console.error(e);
  console.error(`\ncheck-catalog: ${errors.length} problem${errors.length === 1 ? '' : 's'}.`);
  process.exit(1);
}

const scored = kinds.filter((k) => priorityKeys.has(k)).length;
const explained = kinds.filter((k) => explainKeys.has(k)).length;
console.log(
  `check-catalog: ${kinds.length} kinds ↔ ${blocks.length} blocks, order OK · ` +
    `${explained} explained (+${NARRATIVE.size} narrative exempt) · ${scored} scored`,
);
