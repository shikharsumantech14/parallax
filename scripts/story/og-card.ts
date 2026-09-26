/**
 * The link-preview card (STORY-MODE-SPEC §5) — the one renderer the build
 * needs. `scripts/story/og.ts` calls it from the `prebuild` hook to write
 * public/og/story/<slug>.png, the og:image every issue and story page points
 * at, so a shared link previews as a Parallax card on WhatsApp, X, Slack.
 *
 * Raw SVG → PNG via resvg, the brand mark from src/lib/mark.ts, Literata from
 * assets/fonts. Themed per world (the six palettes below — mirrored by
 * `npm run design:check`, so an accent change here must match the tokens).
 *
 * History: this was the `ogCard` archetype of the 2026-06 social card system
 * (scripts/social/cards.ts). The social pipelines that used the other six
 * archetypes were retired on 2026-09-27 (docs/archive/CONTENT-ENGINE.md); the
 * sixty lines the build depends on live here now.
 */
import { readdirSync } from 'fs';
import { join } from 'path';
import { Resvg } from '@resvg/resvg-js';
import { markBody } from '../../src/lib/mark';

/* The six worlds. Mirrors TOPICS in src/content/config.ts, which cannot be
   imported here: that module imports `astro:content`, a virtual module that
   exists only inside an Astro build. */
export const TOPICS = ['politics', 'space', 'earth', 'tech', 'travel', 'sports'] as const;
export type Topic = (typeof TOPICS)[number];

// ── theme ──────────────────────────────────────────────────────────────────
export interface Theme {
  bg1: string; bg2: string; accent: string; ink: string; inkSoft: string;
  ring: string; dark: boolean; stars: boolean;
}
export const THEMES: Record<Topic, Theme> = {
  politics: { bg1: '#f6f2ea', bg2: '#e9e0cf', accent: '#b8341f', ink: '#1a1612', inkSoft: '#6b6055', ring: '#1a1612', dark: false, stars: false },
  space:    { bg1: '#0e2038', bg2: '#060f1d', accent: '#00d4ff', ink: '#eaf2f8', inkSoft: '#92a7b8', ring: '#e9e2d4', dark: true,  stars: true  },
  earth:    { bg1: '#f1ead8', bg2: '#e2d8bf', accent: '#2d6a4f', ink: '#1a1a17', inkSoft: '#5c5747', ring: '#1a1a17', dark: false, stars: false },
  tech:     { bg1: '#141414', bg2: '#070707', accent: '#c6f432', ink: '#ededed', inkSoft: '#8a8a8a', ring: '#ededed', dark: true,  stars: false },
  travel:   { bg1: '#fffdf6', bg2: '#f2e9d6', accent: '#c85a3c', ink: '#1a1a17', inkSoft: '#5c5747', ring: '#1a1a17', dark: false, stars: false },
  sports:   { bg1: '#103126', bg2: '#081a14', accent: '#e8f048', ink: '#eaf5ee', inkSoft: '#9bb3a5', ring: '#eaf5ee', dark: true,  stars: false },
};

// ── fonts ──────────────────────────────────────────────────────────────────
// This module is on the PREBUILD critical path: a missing or renamed TTF fails
// the whole deploy, so name the file we wanted rather than letting `undefined`
// flow into join() and surface as an unreadable ENOENT.
const fontDir = join(process.cwd(), 'assets', 'fonts');

function findFont(label: string, match: (f: string) => boolean): string {
  const hit = readdirSync(fontDir).find(match);
  if (!hit) {
    throw new Error(
      `[og-card] No ${label} TTF in ${fontDir}. resvg needs a STATIC instance ` +
        `(variable fonts fail). Run \`node scripts/fetch-fonts.mjs\`, or drop one in by hand.`,
    );
  }
  return hit;
}

/* One family on the card as on the site (launch design, 2026-09-08): Literata
   Bold carries the display role, Literata Medium the tracked small-capital
   labels. Both are STATIC instances from the googlefonts/literata repo —
   resvg matches them by family + weight. */
const displayFile = findFont('Literata Bold', (f) => /literata-bold/i.test(f) && /\.ttf$/i.test(f));
const labelFile = findFont('Literata Medium', (f) => /literata-medium/i.test(f) && /\.ttf$/i.test(f));

// ── geometry ───────────────────────────────────────────────────────────────
const W = 1200;
const H = 630; // the link-preview size every platform accepts

// ── text helpers ─────────────────────────────────────────────────────────────
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const mono = (t: string, x: number, y: number, size: number, color: string, ls = 3, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="Literata" font-weight="500" font-size="${size}" letter-spacing="${ls}" fill="${color}" text-anchor="${anchor}">${esc(t)}</text>`;
const serif = (t: string, x: number, y: number, size: number, color: string, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="Literata" font-weight="700" font-size="${size}" fill="${color}" text-anchor="${anchor}">${esc(t)}</text>`;

// crude word-wrap (raw SVG has no auto-wrap): break into lines of ~maxChars
function wrapWords(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let cur = '';
  for (const wd of text.split(' ')) {
    if (cur && (cur + ' ' + wd).length > maxChars) { lines.push(cur); cur = wd; }
    else cur = cur ? `${cur} ${wd}` : wd;
  }
  if (cur) lines.push(cur);
  return lines;
}

let seed = 7;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
function starfield(w: number, h: number): string {
  let s = '';
  for (let i = 0; i < 40; i++) s += `<circle cx="${(rnd() * w).toFixed(0)}" cy="${(rnd() * h * 0.7).toFixed(0)}" r="${(rnd() * 1.4 + 0.3).toFixed(1)}" fill="#cfe6f2" opacity="${(rnd() * 0.4 + 0.1).toFixed(2)}"/>`;
  return s;
}

/* The medallion (RD-10 step 3). A card renderer resolves neither CSS variables
   nor fonts, so the P must be an outlined path. Geometry comes from
   src/lib/mark.ts, the same source the in-page component uses, with literal
   colours supplied here. The mark is drawn on a 300-unit box, so it is scaled
   and translated into the card's coordinate space rather than redrawn. */
function mark(t: Theme, cx: number, cy: number, r = 30): string {
  const scale = (r * 2) / 300;
  const body = markBody({
    desk: 'politics',
    size: r * 2,
    cut: 'mark',
    colors: { accent: t.accent, ground: t.bg1, ink: t.ring, paper: t.bg1 },
  });
  return `<g transform="translate(${cx - r} ${cy - r}) scale(${scale.toFixed(4)})">${body}</g>`;
}

// ── shared frame (bg + footer) ───────────────────────────────────────────────
function frame(t: Theme, inner: string, source: string): string {
  seed = 7;
  const defs =
    `<radialGradient id="bg" cx="50%" cy="20%" r="100%"><stop offset="0%" stop-color="${t.bg1}"/><stop offset="100%" stop-color="${t.bg2}"/></radialGradient>`;
  const fy = H - 56;
  const footer =
    `<line x1="80" y1="${fy - 36}" x2="${W - 80}" y2="${fy - 36}" stroke="${t.ink}" stroke-width="1" opacity="0.14"/>` +
    mark(t, 108, fy) +
    serif('Parallax', 150, fy + 14, 38, t.ink) +
    mono(source, W - 80, fy + 6, 18, t.inkSoft, 3, 'end');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>` +
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>` +
    (t.stars ? starfield(W, H) : '') +
    inner + footer + `</svg>`
  );
}

// ── the card: eyebrow + title + dek on the brand frame ───────────────────────
export interface OgData { eyebrow: string; title: string; dek: string; source: string; }
export function ogCard(d: OgData, topic: Topic): string {
  const t = THEMES[topic];
  const titleLines = wrapWords(d.title, 24);
  const tY = 208, tLineH = 82, tSize = 66;
  const title = titleLines.map((ln, i) => serif(ln, 80, tY + i * tLineH, tSize, t.ink)).join('');
  const dekY = tY + (titleLines.length - 1) * tLineH + 74;
  const dek = wrapWords(d.dek, 62).slice(0, 2)
    .map((ln, i) => serif(ln, 80, dekY + i * 44, 30, t.inkSoft)).join('');
  const inner =
    mono(d.eyebrow.toUpperCase(), 80, 108, 24, t.accent, 5) +
    `<line x1="80" y1="140" x2="${W - 80}" y2="140" stroke="${t.ink}" stroke-width="1" opacity="0.14"/>` +
    title + dek;
  return frame(t, inner, d.source);
}

// ── render ─────────────────────────────────────────────────────────────────
export function toPng(svg: string): Buffer {
  return Buffer.from(new Resvg(svg, {
    fitTo: { mode: 'width', value: W },
    font: { fontFiles: [join(fontDir, displayFile), join(fontDir, labelFile)], loadSystemFonts: false, defaultFontFamily: 'Literata' },
  }).render().asPng());
}
