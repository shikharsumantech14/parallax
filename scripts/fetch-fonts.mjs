#!/usr/bin/env node
/**
 * One-time helper: download the static TTFs the share-card renderer needs into
 * assets/fonts/ (scripts/story/og-card.ts, on the prebuild path).
 *
 *   node scripts/fetch-fonts.mjs
 *
 * One face (the operator's ruling of 2026-10-04): the cards set in Literata,
 * as the site does.
 *   - Literata72pt-Bold.ttf      Literata 700, the opsz-72 cut (the headline)
 *   - Literata72pt-Italic.ttf    Literata 400 italic, opsz 72 (the emphasised word)
 *   - Literata-SemiBold.ttf      Literata 600 (the capitals labels and the meta)
 *
 * Where: STATIC instances from the googlefonts/literata repository. Google's
 * CSS2 endpoint serves Literata as a VARIABLE font, which resvg cannot use
 * (the launch design learned this in 2026-09), so the repository is the
 * source. The script checks for an `fvar` table and refuses a variable file
 * rather than letting the card renderer fail at build time.
 *
 * Best-effort: if the network is blocked, download the three static TTFs by
 * hand from github.com/googlefonts/literata (fonts/ttf/) and drop them in
 * assets/fonts/ under the names above. Committing them is fine and makes CI
 * deterministic (no network fetch at build time).
 */
import { mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'assets', 'fonts');
mkdirSync(OUT, { recursive: true });

const REPO = 'https://raw.githubusercontent.com/googlefonts/literata/main/fonts/ttf/';

// `satisfied` must match the way scripts/story/og-card.ts LOOKS UP each font
// (a regex over assets/fonts), not only the filename written here.
const TARGETS = [
  { file: 'Literata72pt-Bold.ttf', satisfied: (f) => /^literata72pt-bold\.ttf$/i.test(f) },
  { file: 'Literata72pt-Italic.ttf', satisfied: (f) => /^literata72pt-italic\.ttf$/i.test(f) },
  { file: 'Literata-SemiBold.ttf', satisfied: (f) => /^literata-semibold\.ttf$/i.test(f) },
];

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/** The sfnt table directory: a variable font carries an `fvar` table. */
function isVariable(buf) {
  if (buf.length < 12) return false;
  const n = buf.readUInt16BE(4);
  for (let i = 0; i < n; i++) {
    if (buf.toString('latin1', 12 + 16 * i, 16 + 16 * i) === 'fvar') return true;
  }
  return false;
}

let ok = 0;
const onDisk = existsSync(OUT) ? readdirSync(OUT) : [];
for (const t of TARGETS) {
  const dest = join(OUT, t.file);
  const already = onDisk.find(t.satisfied);
  if (already) { console.log(`✓ ${t.file} (on disk)`); ok++; continue; }
  try {
    const buf = await download(REPO + t.file);
    if (isVariable(buf)) throw new Error('the repository served a VARIABLE font (fvar); resvg needs a static instance');
    writeFileSync(dest, buf);
    console.log(`✓ ${t.file}  (${(buf.length / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (err) {
    console.warn(`! failed ${t.file}: ${err?.message ?? err} — supply it manually`);
  }
}
console.log(`\n${ok}/${TARGETS.length} fonts in ${OUT}.`);
if (ok < TARGETS.length) process.exit(1); // the card renderer needs all three
