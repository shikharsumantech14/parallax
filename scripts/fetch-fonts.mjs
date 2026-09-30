#!/usr/bin/env node
/**
 * One-time helper: download the static TTFs the share-card renderer needs into
 * assets/fonts/ (scripts/story/og-card.ts, on the prebuild path).
 *
 *   node scripts/fetch-fonts.mjs
 *
 * Lens (2026-09-30): the cards set in the site's two families.
 *   - Newsreader-Medium.ttf          Newsreader 500, opsz 72  (display)
 *   - Newsreader-MediumItalic.ttf    Newsreader 500 italic, opsz 72 (the emphasised word)
 *   - InstrumentSans-Medium.ttf      Instrument Sans 500 (labels)
 *   - InstrumentSans-SemiBold.ttf    Instrument Sans 600 (numbers)
 *
 * How: the Google Fonts CSS2 API, asked for ONE weight (and one optical size)
 * per request, with a plain non-browser User-Agent. Google then serves a
 * STATIC instanced TTF (no `fvar` table) instead of WOFF2 or the variable
 * font — resvg/satori cannot parse WOFF2, and variable fonts crash them. The
 * script checks for `fvar` and refuses a variable file rather than letting
 * the card renderer fail at build time.
 *
 * Best-effort: if the network is blocked, download the four static TTFs by
 * hand and drop them in assets/fonts/ under the names above. Committing them
 * is fine and makes CI deterministic (no network fetch at build time).
 */
import { mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'assets', 'fonts');
mkdirSync(OUT, { recursive: true });

// A non-browser UA: Google answers it with `format('truetype')` URLs.
const UA = 'Wget/1.21';
const CSS = 'https://fonts.googleapis.com/css2?family=';

// `satisfied` must match the way scripts/story/og-card.ts LOOKS UP each font
// (a regex over assets/fonts), not only the filename written here.
const TARGETS = [
  {
    file: 'Newsreader-Medium.ttf',
    satisfied: (f) => /^newsreader-medium\.ttf$/i.test(f),
    css: `${CSS}Newsreader:ital,opsz,wght@0,72,500`,
  },
  {
    file: 'Newsreader-MediumItalic.ttf',
    satisfied: (f) => /^newsreader-mediumitalic\.ttf$/i.test(f),
    css: `${CSS}Newsreader:ital,opsz,wght@1,72,500`,
  },
  {
    file: 'InstrumentSans-Medium.ttf',
    satisfied: (f) => /^instrumentsans-medium\.ttf$/i.test(f),
    css: `${CSS}Instrument+Sans:wght@500`,
  },
  {
    file: 'InstrumentSans-SemiBold.ttf',
    satisfied: (f) => /^instrumentsans-semibold\.ttf$/i.test(f),
    css: `${CSS}Instrument+Sans:wght@600`,
  },
];

async function download(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function ttfUrlFrom(cssUrl) {
  const res = await fetch(cssUrl, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`CSS HTTP ${res.status}`);
  const css = await res.text();
  return css.match(/src:\s*url\((https:[^)]+?\.ttf)\)/i)?.[1] ?? null;
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
    const url = await ttfUrlFrom(t.css);
    if (!url) throw new Error('no TTF url in the CSS response');
    const buf = await download(url);
    if (isVariable(buf)) throw new Error('Google served a VARIABLE font (fvar); resvg needs a static instance');
    writeFileSync(dest, buf);
    console.log(`✓ ${t.file}  (${(buf.length / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (err) {
    console.warn(`! failed ${t.file}: ${err?.message ?? err} — supply it manually`);
  }
}
console.log(`\n${ok}/${TARGETS.length} fonts in ${OUT}.`);
if (ok < TARGETS.length) process.exit(1); // the card renderer needs all four
