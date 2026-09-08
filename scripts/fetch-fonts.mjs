#!/usr/bin/env node
/**
 * One-time helper: download the static TTFs the social card renderer needs into
 * assets/fonts/. Uses the Google Fonts CSS2 API with a legacy User-Agent (which
 * makes Google serve TTF instead of WOFF2 — satori can't read WOFF2).
 *
 *   node scripts/fetch-fonts.mjs
 *
 * Best-effort: if Google's response shape changes or the network is blocked,
 * download the TTFs manually and drop them in assets/fonts/ with these names:
 *   - Literata-Bold.ttf     (Literata, weight 700 — display)
 *   - Literata-Medium.ttf   (Literata, weight 500 — labels)
 *
 * Committing these TTFs is fine and makes CI deterministic (no network fetch).
 */
import { mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'assets', 'fonts');
mkdirSync(OUT, { recursive: true });

// Legacy UA → Google serves TTF urls in the CSS.
const UA = 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:10.0) Gecko/20100101 Firefox/10.0';

// satori needs STATIC TTF instances (not variable fonts — those crash its font
// parser). Try Google Fonts CSS2 for a single static weight (legacy UA → TTF),
// then fall back to @fontsource static TTFs on jsDelivr.
// `satisfied` must match the way scripts/social/cards.ts LOOKS UP each font
// (a regex over assets/fonts), not the filename we would write. The static
// Fraunces on disk today is `Fraunces_72pt-SemiBold.ttf`, so matching on the
// literal `file` would re-download a second Fraunces under a different name and
// leave the card renderer picking between them by readdir order.
const TARGETS = [
  // Launch design (2026-09-08): one family. Static instances from the
  // googlefonts/literata repo — Google's CSS2 endpoint serves the VARIABLE
  // font for Literata, which satori/resvg cannot parse, so the repo is primary.
  {
    file: 'Literata-Bold.ttf',
    satisfied: (f) => /literata-bold/i.test(f) && /\.ttf$/i.test(f),
    css: null,
    fallback: 'https://raw.githubusercontent.com/googlefonts/literata/main/fonts/ttf/Literata-Bold.ttf',
  },
  {
    file: 'Literata-Medium.ttf',
    satisfied: (f) => /literata-medium/i.test(f) && /\.ttf$/i.test(f),
    css: null,
    fallback: 'https://raw.githubusercontent.com/googlefonts/literata/main/fonts/ttf/Literata-Medium.ttf',
  },
];

// NOTE on Fraunces: it ships as a VARIABLE font on Google/fontsource, and
// satori cannot parse variable fonts (it crashes). The fetch above targets a
// single static weight via CSS2; if your environment returns WOFF2 (no static
// TTF), download a static "Fraunces SemiBold" TTF manually from
// fonts.google.com (or the undercasetype/Fraunces repo) and drop it in
// assets/fonts/Fraunces-SemiBold.ttf. JetBrains Mono fetches reliably (static).
// The evergreen orchestrator degrades to text-only posts when a font is
// missing. The CARD RENDERER DOES NOT: scripts/social/cards.ts is imported by
// scripts/story/og.ts, which runs as the `prebuild` hook, so a missing TTF
// fails `npm run build` outright — including on Vercel. It throws with this
// script's name in the message rather than an unreadable ENOENT.

async function download(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function ttfUrlFrom(cssUrl) {
  const css = await (await fetch(cssUrl, { headers: { 'User-Agent': UA } })).text();
  return css.match(/src:\s*url\((https:[^)]+?\.ttf)\)/i)?.[1] ?? null;
}

let ok = 0;
const onDisk = existsSync(OUT) ? readdirSync(OUT) : [];
for (const t of TARGETS) {
  const dest = join(OUT, t.file);
  const already = onDisk.find(t.satisfied);
  if (already) { console.log(`✓ ${t.file} (satisfied by ${already})`); ok++; continue; }
  let buf = null;
  try {
    const url = t.css ? await ttfUrlFrom(t.css) : null;
    if (url) buf = await download(url);
  } catch { /* fall through to fallback */ }
  if (!buf) {
    try { buf = await download(t.fallback); } catch (err) {
      console.warn(`! failed ${t.file}: ${err?.message ?? err} — supply it manually`);
      continue;
    }
  }
  writeFileSync(dest, buf);
  console.log(`✓ ${t.file}  (${(buf.length / 1024).toFixed(0)} KB)`);
  ok++;
}
console.log(`\n${ok}/${TARGETS.length} fonts in ${OUT}.`);
if (ok < 2) process.exit(1); // both Literata weights are required
