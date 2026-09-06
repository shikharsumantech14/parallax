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
import { Resvg } from '@resvg/resvg-js';
import { markBody, markSVG } from '../../src/lib/mark';

/* Meta palette literals — src/styles/meta.css :root. Ink, not a topic accent:
   the meta brand's accent IS near-black there. The house cut's crescent keeps
   the politics red, which is what the delivered mark.svg draws. */
const META = {
  accent: '#b8341f',
  ground: '#faf7f0',
  ink: '#161412',
  paper: '#faf7f0',
};

/* The favicon stays SVG — browser chrome renders it at whatever size it likes,
   and the reversed cut is the declared tier below 24px (RD-10). */
const targets: Array<{ path: string; cut: 'mark' | 'seal' | 'reversed'; size: number; box: number }> = [
  { path: 'public/favicon.svg', cut: 'reversed', size: 32, box: 32 },
];

mkdirSync('public', { recursive: true });
for (const t of targets) {
  const svg = markSVG({ desk: 'politics', size: t.size, cut: t.cut, box: t.box, colors: META });
  writeFileSync(t.path, svg + '\n');
  console.log(`wrote ${t.path} · cut=${t.cut} · ${svg.length} bytes`);
}

/* ── PWA icons ──────────────────────────────────────────────────────────────
   Rendered, not drawn: same geometry as everything else, so the medallion can
   never drift between the favicon, the About dial and the home-screen icon.

   Two things force a per-icon decision rather than one image resized.

   MASKABLE. Android crops an adaptive icon to a platform shape (circle,
   squircle, teardrop) and only guarantees the central 80% — a safe-zone RADIUS
   of 40% of the width. The `mark` cut draws its ring at r=118 with a 7-unit
   stroke, so its outer edge sits at 121.5 of a 150 half-box: 81% of the icon
   wide, and OUTSIDE that guarantee. Resizing the file cannot fix it; the art
   has to be inset within the canvas. MASK_SCALE pulls the outer edge to ~95
   (63% of the icon), comfortably inside, and the paper ground goes full-bleed
   so the crop always lands on brand colour instead of transparency.

   OPAQUE. iOS composites `apple-touch-icon` on white and applies its own
   corner radius, so transparency there produces a white-cornered card. Every
   PNG below is painted on paper for that reason; only the SVG favicon keeps
   its transparent ground. */
const PAPER = META.paper;
const MASK_SCALE = 0.78;

/** One PNG, painted on paper, optionally inset for a maskable crop. */
function iconPNG(px: number, inset: boolean): Buffer {
  const art = markBody({ desk: 'politics', size: px, cut: 'mark', colors: META });
  const body = inset
    ? `<g transform="translate(150,150) scale(${MASK_SCALE}) translate(-150,-150)">${art}</g>`
    : art;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="${px}" height="${px}">` +
    `<rect width="300" height="300" fill="${PAPER}"/>${body}</svg>`;
  return new Resvg(svg, { fitTo: { mode: 'width', value: px } }).render().asPng();
}

const icons: Array<{ path: string; px: number; inset: boolean }> = [
  { path: 'public/icon-192.png', px: 192, inset: false },
  { path: 'public/icon-512.png', px: 512, inset: false },
  { path: 'public/icon-maskable-512.png', px: 512, inset: true },
  // iOS: 180 is the current home-screen size, and it never gets a mask.
  { path: 'public/apple-touch-icon.png', px: 180, inset: false },
];

for (const i of icons) {
  const png = iconPNG(i.px, i.inset);
  writeFileSync(i.path, png);
  console.log(`wrote ${i.path} · ${i.px}px${i.inset ? ' · maskable' : ''} · ${png.length} bytes`);
}

/* ── The manifest ───────────────────────────────────────────────────────────
   Generated here so the colours cannot drift from the palette above.

   `name` vs `short_name` lands exactly on the brand/legal split (AGENTS.md §1):
   `name` is metadata — install prompts, app listings — so it carries the legal
   name, like a <title>. `short_name` sits under the icon on a home screen,
   which is brand-facing, so it is the public brand.

   theme_color is PAPER, not ink: it tints the browser/status chrome, and every
   entry point a reader installs from (home, archive, about, an issue) opens on
   warm paper. A dark chrome above a light page reads as a rendering fault. */
const manifest = {
  id: '/',
  name: 'Parallax Lens',
  short_name: 'Parallax',
  description: 'Stories you think you already understand.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  theme_color: META.paper,
  background_color: META.paper,
  categories: ['news', 'education'],
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};

writeFileSync('public/manifest.webmanifest', JSON.stringify(manifest, null, 2) + '\n');
console.log('wrote public/manifest.webmanifest');
