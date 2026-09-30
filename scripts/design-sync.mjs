#!/usr/bin/env node
/**
 * design-sync — copies the canonical shared design CSS into both projects.
 *
 *   node scripts/design-sync.mjs          # regenerate the copies
 *   node scripts/design-sync.mjs --check  # diff only; exit 1 on drift
 *
 * Canonical sources:  shared/design/{tokens,worlds}.css
 * Generated copies:   src/styles/shared/*
 *
 * The app/ mirror retired with the merge (2026-09-06): there is one project
 * now, so there is one copy to keep in step instead of two. Half of what this
 * gate existed to prevent cannot happen any more.
 * Contract: edit the canonical files, never the copies (see shared/design/README.md).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILES = ['tokens.css', 'worlds.css'];
const TARGETS = ['src/styles/shared'];

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
   Byte-comparing the generated copy proves nothing about the OTHER places that
   hand-copy the desk inks. That is how `tech` accent-deep once forked four
   ways with every gate green. So: assert every site that CLAIMS to mirror the
   canonical inks actually does.

   LENS (2026-09-30, TOKEN-RECORD TD-09). One paper under every desk, so the
   two accent-deep roles of TD-05 are ONE role again: a desk's --accent-deep
   is its TEXT ink (>= 4.5:1 on the paper) everywhere, and --accent is its
   MARK. The in-world/light-paper split, and the CategoryCard mirror that
   carried the in-world side, are retired (the card was deleted on 2026-09-08). */

const WORLDS = ['politics', 'space', 'earth', 'tech', 'travel', 'sports'];
const ABBR = { politics: 'pol', space: 'spa', earth: 'ear', tech: 'tec', travel: 'tra', sports: 'spo' };
const HEX = '(#[0-9a-fA-F]{6})';

function canonicalInks() {
  const src = readFileSync(join(root, 'shared/design/worlds.css'), 'utf-8');
  const out = {};
  for (const w of WORLDS) {
    const a = ABBR[w];
    const get = (name) => src.match(new RegExp(`--${name}:\\s*${HEX}`))?.[1]?.toLowerCase();
    const ink = {
      accent: get(`world-${w}`), deep: get(`world-${w}-deep`),
      mark: get(`${a}-mark`), text: get(`${a}-text`), tint: get(`${a}-tint`), plate: get(`${a}-deep`),
    };
    for (const [k, v] of Object.entries(ink)) {
      if (!v) {
        console.error(`design-sync: shared/design/worlds.css is missing the ${w} ${k} ink`);
        process.exit(1);
      }
    }
    out[w] = ink;
  }
  return out;
}

const MIRRORS = [
  /* The theme header is the publication's law for a desk page: its mark and
     its text ink must be the canonical ones. */
  ...WORLDS.map((w) => ({
    label: `src/styles/themes/${w}.css`,
    file: `src/styles/themes/${w}.css`,
    world: w,
    accent: new RegExp(`--accent:\\s*${HEX}`),
    deep: new RegExp(`--accent-deep:\\s*${HEX}`),
  })),
  /* meta.css prints every desk's identity on the house pages. */
  ...WORLDS.map((w) => ({
    label: `src/styles/meta.css --topic-${w}`,
    file: 'src/styles/meta.css',
    world: w,
    accent: new RegExp(`--topic-${w}:\\s*${HEX}`),
    deep: new RegExp(`--topic-${w}-deep:\\s*${HEX}`),
  })),
  /* worlds.css must agree with itself: the :root pair and the [data-world]
     subtree tokens are the same role and are consumed interchangeably. */
  ...WORLDS.map((w) => ({
    label: `shared/design/worlds.css [data-world="${w}"]`,
    file: 'shared/design/worlds.css',
    world: w,
    accent: new RegExp(`\\[data-world="${w}"\\][^}]*--w-accent:\\s*${HEX}`),
    deep: new RegExp(`\\[data-world="${w}"\\][^}]*--w-accent-deep:\\s*${HEX}`),
  })),
  /* The share-card renderer cannot read CSS, so it carries literals. */
  ...WORLDS.map((w) => ({
    label: `scripts/story/og-card.ts THEMES.${w}`,
    file: 'scripts/story/og-card.ts',
    world: w,
    accent: new RegExp(`\\b${w}:\\s*\\{[^}]*accent:\\s*'${HEX}'`),
    deep: null,
  })),
];

/* The Lens names in worlds.css must equal the legacy pair they alias, and the
   theme header's tint and plate must equal the canonical ones. */
const LENS_INKS = WORLDS.length * 4;
function checkLensInks(canon) {
  let bad = 0;
  for (const w of WORLDS) {
    const c = canon[w];
    if (c.mark !== c.accent) { console.error(`design-sync --check: worlds.css --${ABBR[w]}-mark ${c.mark} ≠ --world-${w} ${c.accent}`); bad++; }
    if (c.text !== c.deep) { console.error(`design-sync --check: worlds.css --${ABBR[w]}-text ${c.text} ≠ --world-${w}-deep ${c.deep}`); bad++; }
    const p = join(root, `src/styles/themes/${w}.css`);
    if (!existsSync(p)) continue;
    const src = readFileSync(p, 'utf-8');
    const tint = src.match(new RegExp(`--accent-tint:\\s*${HEX}`))?.[1]?.toLowerCase();
    const plate = src.match(new RegExp(`--deep:\\s*${HEX}`))?.[1]?.toLowerCase();
    if (tint !== c.tint) { console.error(`design-sync --check: themes/${w}.css --accent-tint ${tint ?? 'missing'} ≠ --${ABBR[w]}-tint ${c.tint}`); bad++; }
    if (plate !== c.plate) { console.error(`design-sync --check: themes/${w}.css --deep ${plate ?? 'missing'} ≠ --${ABBR[w]}-deep ${c.plate}`); bad++; }
  }
  return bad;
}

/* ONE PAPER (TD-09). No desk sets its own page ground or ink: every theme
   header, meta.css and the worlds.css subtree carry the canonical neutrals of
   shared/design/tokens.css. This is the gate that keeps a dark desk ground
   from coming back. */
const NEUTRALS = ['paper', 'paper-2', 'paper-3', 'ink', 'ink-2', 'muted', 'hair', 'hair-2'];
function canonicalNeutrals() {
  const src = readFileSync(join(root, 'shared/design/tokens.css'), 'utf-8');
  const out = {};
  for (const k of NEUTRALS) {
    const v = src.match(new RegExp(`--${k}:\\s*${HEX}`))?.[1]?.toLowerCase();
    if (!v) { console.error(`design-sync: shared/design/tokens.css is missing --${k}`); process.exit(1); }
    out[k] = v;
  }
  return out;
}
/* Each declaring file: the token it declares → the canonical neutral it must equal. */
const GROUND_MAP = { bg: 'paper', paper: 'paper', 'paper-2': 'paper-2', 'paper-3': 'paper-3', ink: 'ink', 'ink-soft': 'ink-2', muted: 'muted', rule: 'hair' };
const GROUND_FILES = [...WORLDS.map((w) => `src/styles/themes/${w}.css`), 'src/styles/meta.css'];
function checkOnePaper(n) {
  let bad = 0;
  let count = 0;
  for (const rel of GROUND_FILES) {
    const p = join(root, rel);
    if (!existsSync(p)) continue;
    const src = readFileSync(p, 'utf-8');
    for (const [tok, neutral] of Object.entries(GROUND_MAP)) {
      const got = src.match(new RegExp(`(?:^|[\\s;{])--${tok}:\\s*${HEX}`, 'm'))?.[1]?.toLowerCase();
      count++;
      if (!got) { console.error(`design-sync --check: ${rel} does not declare --${tok} (TD-09 one paper)`); bad++; }
      else if (got !== n[neutral]) { console.error(`design-sync --check: ONE-PAPER DRIFT in ${rel} — --${tok} is ${got}, the paper system says ${n[neutral]} (--${neutral})`); bad++; }
    }
  }
  const wsrc = readFileSync(join(root, 'shared/design/worlds.css'), 'utf-8');
  for (const w of WORLDS) {
    for (const [tok, neutral] of [['w-bg', 'paper'], ['w-paper', 'paper-2'], ['w-ink', 'ink']]) {
      const got = wsrc.match(new RegExp(`\\[data-world="${w}"\\][^}]*--${tok}:\\s*${HEX}`))?.[1]?.toLowerCase();
      count++;
      if (got !== n[neutral]) { console.error(`design-sync --check: worlds.css [data-world="${w}"] --${tok} ${got ?? 'missing'} ≠ --${neutral} ${n[neutral]}`); bad++; }
    }
  }
  checkOnePaper.count = count;
  return bad;
}

/* TD-01 / TD-02 / TD-04, as re-pointed by TD-09 (docs/design/TOKEN-RECORD.md).
   --paper-warm is the well (paper-3) on every desk, --paper-deep its alias,
   --on-accent the paper. Still gated per theme: an ungated token drifts
   within two sessions. */
const NEW_TOKENS = [
  { key: 'paper-warm', politics: '#ede9df', space: '#ede9df', earth: '#ede9df', tech: '#ede9df', travel: '#ede9df', sports: '#ede9df' },
  { key: 'paper-deep', politics: '#ede9df', space: '#ede9df', earth: '#ede9df', tech: '#ede9df', travel: '#ede9df', sports: '#ede9df' },
  { key: 'on-accent',  politics: '#f5f2eb', space: '#f5f2eb', earth: '#f5f2eb', tech: '#f5f2eb', travel: '#f5f2eb', sports: '#f5f2eb' },
];

function checkNewTokens() {
  let bad = 0;
  for (const t of NEW_TOKENS) {
    for (const w of WORLDS) {
      const p = join(root, `src/styles/themes/${w}.css`);
      if (!existsSync(p)) continue;
      const got = readFileSync(p, 'utf-8').match(new RegExp(`--${t.key}:\\s*${HEX}`))?.[1]?.toLowerCase();
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
      const got = wsrc.match(new RegExp(`\\[data-world="${w}"\\][^}]*--w-${key}:\\s*${HEX}`))?.[1]?.toLowerCase();
      if (got && got !== rec[w]) {
        console.error(`design-sync --check: --w-${key} DRIFT for ${w} — has ${got}, record says ${rec[w]}`);
        bad++;
      }
    }
  }
  return bad;
}

function checkMirrors(canon) {
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
      console.error(`design-sync --check: ACCENT DRIFT in ${m.label} — has ${got}, canonical mark is ${want.accent}`);
      bad++;
    }

    if (m.deep) {
      const gotDeep = src.match(m.deep)?.[1]?.toLowerCase();
      if (!gotDeep) {
        console.error(`design-sync --check: ${m.label} — could not find an accent-deep to check`);
        bad++;
      } else if (gotDeep !== want.deep) {
        console.error(`design-sync --check: ACCENT-DEEP DRIFT in ${m.label} — has ${gotDeep}, canonical text ink is ${want.deep}`);
        bad++;
      }
    }
  }
  return bad;
}

if (check) {
  const canon = canonicalInks();
  drift += checkMirrors(canon);
  drift += checkLensInks(canon);
  drift += checkOnePaper(canonicalNeutrals());
  drift += checkNewTokens();
  if (drift) {
    console.error(`\ndesign-sync --check: ${drift} problem${drift === 1 ? '' : 's'}.`);
    process.exit(1);
  }
  console.log(
    `design-sync --check: all copies in sync · ${MIRRORS.length} ink mirrors + ${LENS_INKS} Lens inks + ` +
      `${checkOnePaper.count} one-paper neutrals + ${NEW_TOKENS.length * WORLDS.length} record tokens`,
  );
}
