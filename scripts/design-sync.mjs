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
   does. Backgrounds and inks are NOT checked — the card renderers legitimately
   carry their own gradient pairs, and widening the check to those would be
   noise, which is how gates get switched off.  */

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

/* THE ACCENT IS UNIVERSAL; THE DEEP IS NOT.
   Every world's --accent means the same thing everywhere, so every mirror is
   gated against it. --accent-deep carries TWO roles that are provably
   irreconcilable on dark worlds (see the proof in shared/design/worlds.css):

     light-paper role  worlds.css --world-*-deep / --w-accent-deep,
                       meta.css --topic-*-deep. Printed on #faf7f0 or #fff.
     in-world role     the theme files' --accent-deep, and CategoryCard's,
                       both printed on that world's OWN ground.

   So the deep values are gated WITHIN each role, never across them. A gate that
   demanded they match is what would push a dark world's cyan back onto light
   paper at 1.4:1.

   `deep: null` means the mirror carries no deep variant to check. */
const MIRRORS = [
  ...WORLDS.map((w) => ({
    label: `src/styles/themes/${w}.css`,
    file: `src/styles/themes/${w}.css`,
    world: w,
    accent: /--accent:\s*(#[0-9a-fA-F]{6})/,
    deep: null, // in-world role — gated against CategoryCard below, not canonical
  })),
  /* meta.css prints world identity on meta paper, so its -deep is the
     light-paper role and must equal the canonical one. These agreed only by
     accident until 2026-08-27; tech and sports had been hand-darkened here
     while worlds.css kept the in-world values. */
  ...WORLDS.map((w) => ({
    label: `src/styles/meta.css --topic-${w}-deep`,
    file: 'src/styles/meta.css',
    world: w,
    accent: new RegExp(`--topic-${w}:\\s*(#[0-9a-fA-F]{6})`),
    deep: new RegExp(`--topic-${w}-deep:\\s*(#[0-9a-fA-F]{6})`),
  })),
  /* worlds.css must agree with itself: the :root scalar and the [data-world]
     subtree token are the same role and are consumed interchangeably. */
  ...WORLDS.map((w) => ({
    label: `shared/design/worlds.css [data-world="${w}"]`,
    file: 'shared/design/worlds.css',
    world: w,
    accent: new RegExp(`\\[data-world="${w}"\\][^}]*--w-accent:\\s*(#[0-9a-fA-F]{6})`),
    deep: new RegExp(`\\[data-world="${w}"\\][^}]*--w-accent-deep:\\s*(#[0-9a-fA-F]{6})`),
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
    deep: null, // in-world role — gated against its theme file below
  })),
];

/* TD-01 / TD-04 (docs/design/TOKEN-RECORD.md). These are new tokens, so they get
   a gate in the same commit that introduces them — an ungated token drifts
   within two sessions, which is exactly what produced the four-way tech
   accent-deep split. --paper-deep is TD-02's alias and must equal --paper-warm;
   --on-accent is TD-04 and must equal that world's ground. */
const NEW_TOKENS = [
  { key: 'paper-warm', politics: '#f2eee4', space: '#12233c', earth: '#ece2c4', tech: '#171717', travel: '#f6efe2', sports: '#12332a' },
  { key: 'paper-deep', politics: '#f2eee4', space: '#12233c', earth: '#ece2c4', tech: '#171717', travel: '#f6efe2', sports: '#12332a' },
  { key: 'on-accent',  politics: '#f4f1ea', space: '#0a1628', earth: '#f0e9d8', tech: '#0d0d0d', travel: '#faf6ef', sports: '#0f2820' },
];

function checkNewTokens() {
  let bad = 0;
  for (const t of NEW_TOKENS) {
    for (const w of WORLDS) {
      const p = join(root, `src/styles/themes/${w}.css`);
      if (!existsSync(p)) continue;
      const got = readFileSync(p, 'utf-8').match(new RegExp(`--${t.key}:\\s*(#[0-9a-fA-F]{6})`))?.[1]?.toLowerCase();
      if (!got) {
        console.error(`design-sync --check: themes/${w}.css is missing --${t.key} (TOKEN-RECORD)`);
        bad++;
      } else if (got !== t[w]) {
        console.error(`design-sync --check: --${t.key} DRIFT in themes/${w}.css — has ${got}, record says ${t[w]}`);
        bad++;
      }
    }
  }
  // worlds.css mirrors two of them for cross-surface consumers
  const wsrc = readFileSync(join(root, 'shared/design/worlds.css'), 'utf-8');
  for (const [key, rec] of [['paper-warm', NEW_TOKENS[0]], ['on-accent', NEW_TOKENS[2]]]) {
    for (const w of WORLDS) {
      const got = wsrc.match(new RegExp(`\\[data-world="${w}"\\][^}]*--w-${key}:\\s*(#[0-9a-fA-F]{6})`))?.[1]?.toLowerCase();
      if (got && got !== rec[w]) {
        console.error(`design-sync --check: --w-${key} DRIFT for ${w} — has ${got}, record says ${rec[w]}`);
        bad++;
      }
    }
  }
  return bad;
}

/* The in-world deep role has no canonical scalar, so it is gated as an equality
   between the two places that render it on a world's own ground. */
const IN_WORLD_DEEP = WORLDS.map((w) => ({
  world: w,
  a: { label: `src/styles/themes/${w}.css`, file: `src/styles/themes/${w}.css`, re: /--accent-deep:\s*(#[0-9a-fA-F]{6})/ },
  b: {
    label: `home/CategoryCard.astro [data-topic="${w}"]`,
    file: 'src/components/home/CategoryCard.astro',
    re: new RegExp(`\\.px-cat\\[data-topic="${w}"\\][^}]*--accent-deep:\\s*(#[0-9a-fA-F]{6})`),
  },
}));

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

  for (const p of IN_WORLD_DEEP) {
    const read = (side) => {
      const path = join(root, side.file);
      if (!existsSync(path)) return null;
      return readFileSync(path, 'utf-8').match(side.re)?.[1]?.toLowerCase() ?? null;
    };
    const a = read(p.a);
    const b = read(p.b);
    if (a && b && a !== b) {
      console.error(
        `design-sync --check: IN-WORLD ACCENT-DEEP MISMATCH for ${p.world} — ` +
          `${p.a.label} has ${a}, ${p.b.label} has ${b}`,
      );
      bad++;
    }
  }
  return bad;
}

if (check) {
  drift += checkMirrors();
  drift += checkNewTokens();
  if (drift) {
    console.error(`\ndesign-sync --check: ${drift} problem${drift === 1 ? '' : 's'}.`);
    process.exit(1);
  }
  console.log(`design-sync --check: all copies in sync · ${MIRRORS.length} mirrors + ${IN_WORLD_DEEP.length} in-world deeps + ${NEW_TOKENS.length * WORLDS.length} record tokens`);
}
