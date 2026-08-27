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

/* ── palette mirrors ────────────────────────────────────────────────────────
   Byte-comparing the two generated copies proves nothing about the SIX OTHER
   places that hand-copy the world accents. That is how `tech` accent-deep
   forked four ways: worlds.css #9cc528, CategoryCard #a3cc1f, meta.css
   #5a6e16, plus the theme header — with every gate green.

   So: assert every site that CLAIMS to mirror the canonical accents actually
   does. Scoped deliberately to `--accent` / `--accent-deep`, because those are
   the values that must agree everywhere. Backgrounds and inks are NOT checked —
   the card renderers legitimately carry their own gradient pairs, and meta.css
   carries a deliberately darker -deep for large type on light paper (documented
   at shared/design/worlds.css). Widening this check to those would be noise.  */

const WORLDS = ['politics', 'space', 'earth', 'tech', 'travel', 'sports'];

function canonicalAccents() {
  const src = readFileSync(join(root, 'shared/design/worlds.css'), 'utf-8');
  const out = {};
  for (const w of WORLDS) {
    const accent = src.match(new RegExp(`--world-${w}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
    const deep = src.match(new RegExp(`--world-${w}-deep:\\s*(#[0-9a-fA-F]{6})`))?.[1];
    if (!accent || !deep) {
      console.error(`design-sync: shared/design/worlds.css is missing --world-${w} / -deep`);
      process.exit(1);
    }
    out[w] = { accent: accent.toLowerCase(), deep: deep.toLowerCase() };
  }
  return out;
}

/* Each mirror declares how to find one world's accent (and optionally its
   accent-deep) in its own file. `deep: null` means that site legitimately does
   not carry the deep variant. */
const MIRRORS = [
  ...WORLDS.map((w) => ({
    label: `src/styles/themes/${w}.css`,
    file: `src/styles/themes/${w}.css`,
    world: w,
    accent: /--accent:\s*(#[0-9a-fA-F]{6})/,
    deep: /--accent-deep:\s*(#[0-9a-fA-F]{6})/,
  })),
  ...WORLDS.map((w) => ({
    label: `scripts/social/cards.ts THEMES.${w}`,
    file: 'scripts/social/cards.ts',
    world: w,
    accent: new RegExp(`\\b${w}:\\s*\\{[^}]*accent:\\s*'(#[0-9a-fA-F]{6})'`),
    deep: null,
  })),
  /* The home covers re-declare a full per-topic palette locally, because the
     home page renders in META colours — a card cannot inherit [data-topic]
     from <html>. That is legitimate, but it is where `tech` accent-deep drifted
     to #a3cc1f. Gate the two values that must agree; the rest of the block is
     card-specific (gradients, motifs) and stays local until worlds.css grows
     rule/ink-soft/muted in the Phase 2 token record. */
  ...WORLDS.map((w) => ({
    label: `home/CategoryCard.astro [data-topic="${w}"]`,
    file: 'src/components/home/CategoryCard.astro',
    world: w,
    accent: new RegExp(`\\.px-cat\\[data-topic="${w}"\\][^}]*--accent:\\s*(#[0-9a-fA-F]{6})`),
    deep: new RegExp(`\\.px-cat\\[data-topic="${w}"\\][^}]*--accent-deep:\\s*(#[0-9a-fA-F]{6})`),
  })),
];

function checkMirrors() {
  const canon = canonicalAccents();
  let bad = 0;
  for (const m of MIRRORS) {
    const path = join(root, m.file);
    if (!existsSync(path)) continue;
    const src = readFileSync(path, 'utf-8');
    const want = canon[m.world];

    const got = src.match(m.accent)?.[1]?.toLowerCase();
    if (!got) {
      console.error(`design-sync --check: ${m.label} — could not find an accent to check`);
      bad++;
    } else if (got !== want.accent) {
      console.error(`design-sync --check: ACCENT DRIFT in ${m.label} — has ${got}, canonical is ${want.accent}`);
      bad++;
    }

    if (m.deep) {
      const gotDeep = src.match(m.deep)?.[1]?.toLowerCase();
      if (gotDeep && gotDeep !== want.deep) {
        console.error(`design-sync --check: ACCENT-DEEP DRIFT in ${m.label} — has ${gotDeep}, canonical is ${want.deep}`);
        bad++;
      }
    }
  }
  return bad;
}

if (check) {
  drift += checkMirrors();
  if (drift) {
    console.error(`\ndesign-sync --check: ${drift} problem${drift === 1 ? '' : 's'}.`);
    process.exit(1);
  }
  console.log(`design-sync --check: all copies in sync · ${MIRRORS.length} palette mirrors match canonical`);
}
