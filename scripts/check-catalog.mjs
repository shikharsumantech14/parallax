#!/usr/bin/env node
/**
 * check-catalog — enforces the 1:1, same-order match between SECTION_KINDS
 * (src/content/config.ts) and the `##` blocks of docs/design/catalog.md.
 *
 *   npm run check:catalog
 *
 * Fails loudly on: kinds missing a catalog block, catalog blocks for unknown
 * kinds, or order drift. Cheap insurance once many hands add kinds.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const config = readFileSync(join(root, 'src/content/config.ts'), 'utf-8');
const arrMatch = config.match(/SECTION_KINDS\s*=\s*\[([\s\S]*?)\]\s*as const/);
if (!arrMatch) { console.error('check-catalog: SECTION_KINDS not found'); process.exit(1); }
const kinds = [...arrMatch[1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);

const catalog = readFileSync(join(root, 'docs/design/catalog.md'), 'utf-8');
const blocks = [...catalog.matchAll(/^## ([a-z0-9-]+)\s*$/gm)].map((m) => m[1]);

let fail = false;
const kindSet = new Set(kinds);
const blockSet = new Set(blocks);

for (const k of kinds) if (!blockSet.has(k)) { console.error(`MISSING catalog block: ## ${k}`); fail = true; }
for (const b of blocks) if (!kindSet.has(b)) { console.error(`UNKNOWN catalog block (not in SECTION_KINDS): ## ${b}`); fail = true; }

if (!fail) {
  const inBoth = blocks.filter((b) => kindSet.has(b));
  for (let i = 0; i < kinds.length; i++) {
    if (kinds[i] !== inBoth[i]) {
      console.error(`ORDER drift at position ${i}: SECTION_KINDS has '${kinds[i]}', catalog has '${inBoth[i]}'`);
      fail = true;
      break;
    }
  }
}

if (fail) process.exit(1);
console.log(`check-catalog: ${kinds.length} kinds ↔ ${blocks.length} blocks, order OK`);
