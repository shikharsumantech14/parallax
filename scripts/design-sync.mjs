#!/usr/bin/env node
/**
 * design-sync — copies the canonical shared design CSS into both projects.
 *
 *   node scripts/design-sync.mjs          # regenerate the copies
 *   node scripts/design-sync.mjs --check  # diff only; exit 1 on drift
 *
 * Canonical sources:  shared/design/{tokens,worlds}.css
 * Generated copies:   src/styles/shared/*  +  app/src/styles/shared/*
 * Contract: edit the canonical files, never the copies (see shared/design/README.md).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILES = ['tokens.css', 'worlds.css'];
const TARGETS = ['src/styles/shared', 'app/src/styles/shared'];

const HEADER = (name) =>
  `/* GENERATED from shared/design/${name} — DO NOT EDIT.\n` +
  `   Edit the canonical file, then run: npm run design:sync */\n`;

const check = process.argv.includes('--check');
let drift = 0;

for (const name of FILES) {
  const canonicalPath = join(root, 'shared/design', name);
  if (!existsSync(canonicalPath)) {
    console.error(`design-sync: missing canonical file shared/design/${name}`);
    process.exit(1);
  }
  const expected = HEADER(name) + readFileSync(canonicalPath, 'utf-8');

  for (const target of TARGETS) {
    const outPath = join(root, target, name);
    const rel = `${target}/${name}`;
    const current = existsSync(outPath) ? readFileSync(outPath, 'utf-8') : null;

    if (check) {
      if (current !== expected) {
        console.error(`design-sync --check: DRIFT in ${rel} (run: npm run design:sync)`);
        drift++;
      }
    } else if (current !== expected) {
      mkdirSync(join(root, target), { recursive: true });
      writeFileSync(outPath, expected, 'utf-8');
      console.log(`design-sync: wrote ${rel}`);
    } else {
      console.log(`design-sync: ${rel} up to date`);
    }
  }
}

if (check) {
  if (drift) process.exit(1);
  console.log('design-sync --check: all copies in sync');
}
