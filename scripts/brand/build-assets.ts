#!/usr/bin/env tsx
/**
 * RD-10 step 3 — write the brand's static assets from the shared geometry.
 *
 *   npx tsx scripts/brand/build-assets.ts
 *
 * These files cannot use tokens: a favicon is rendered by the browser chrome
 * with no page CSS, and the OG cards go through satori/resvg, which resolve no
 * custom properties and load no fonts for SVG text. So colours are LITERALS
 * here, taken from the meta palette in src/styles/meta.css, and the P is the
 * outlined path rather than live text — which is the whole point of RD-10.
 *
 * The favicon uses the REVERSED cut explicitly. RD-10 says auto-reverse below
 * 24px, but the delivered favicon.svg is reversed at 32px; the spec threshold
 * and the shipped asset disagree, so the cut is stated rather than inferred.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { markSVG } from '../../src/lib/mark';

/* Meta palette literals — src/styles/meta.css :root. Ink, not a topic accent:
   the meta brand's accent IS near-black there. The house cut's crescent keeps
   the politics red, which is what the delivered mark.svg draws. */
const META = {
  accent: '#b8341f',
  ground: '#faf7f0',
  ink: '#161412',
  paper: '#faf7f0',
};

/* Only what is actually referenced. The publication ships no webmanifest and
   links exactly one icon, so inventing icon-192/512 would have added files
   nothing loads. There is ONE target since the merge (2026-09-06): app/public/
   went with the app/ tree, and writing it back would recreate a stray
   directory holding a favicon no page links. When the PWA lands and a
   webmanifest exists, the icon set belongs here. */
const targets: Array<{ path: string; cut: 'mark' | 'seal' | 'reversed'; size: number; box: number }> = [
  { path: 'public/favicon.svg', cut: 'reversed', size: 32, box: 32 },
];

mkdirSync('public', { recursive: true });
for (const t of targets) {
  const svg = markSVG({ desk: 'politics', size: t.size, cut: t.cut, box: t.box, colors: META });
  writeFileSync(t.path, svg + '\n');
  console.log(`wrote ${t.path} · cut=${t.cut} · ${svg.length} bytes`);
}
