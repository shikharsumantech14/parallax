/**
 * The link-preview card (STORY-MODE-SPEC §5) — the one renderer the build
 * needs. `scripts/story/og.ts` calls it from the `prebuild` hook to write
 * public/og/story/<slug>.png, the og:image every issue and story page points
 * at, so a shared link previews as a Parallax card on WhatsApp, X, Slack.
 *
 * Raw SVG → PNG via resvg, the brand mark from src/lib/mark.ts, Newsreader
 * and Instrument Sans from assets/fonts (static TTFs, fetched by
 * scripts/fetch-fonts.mjs). Themed per desk (the palettes below — mirrored by
 * `npm run design:check`, so an ink change here must match the tokens).
 *
 * Lens (2026-09-30): a share card is a COVER, so it is the one place a desk's
 * deep plate fills the frame (BRIEF.md principle 1; the Brand-ShareCards
 * board). Text on it is the on-deep paper; the desk's mark (the lime on tech
 * and sports) carries the eyebrow and the medallion. Phase 4 adds the cover
 * graphic and the emphasised word; this pass moves the palette and the faces.
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

/* The six desks. Mirrors TOPICS in src/content/config.ts, which cannot be
   imported here: that module imports `astro:content`, a virtual module that
   exists only inside an Astro build. */
export const TOPICS = ['politics', 'space', 'earth', 'tech', 'travel', 'sports'] as const;
export type Topic = (typeof TOPICS)[number];

// ── theme ──────────────────────────────────────────────────────────────────
/** `accent` is the desk MARK (gated against shared/design/worlds.css);
 *  `plate` its deep ground; `hi` the mark that reads on that plate (the lime
 *  on tech and sports, which exists only for this); `ink` the on-deep paper. */
export interface Theme {
  plate: string; accent: string; hi: string; ink: string; ring: string;
}
const ON_DEEP = '#f5f2eb';
const INK = '#16140f';
export const THEMES: Record<Topic, Theme> = {
  politics: { plate: '#2a1410', accent: '#c8412a', hi: '#c8412a', ink: ON_DEEP, ring: INK },
  space:    { plate: '#0b1b33', accent: '#1b9ac4', hi: '#1b9ac4', ink: ON_DEEP, ring: INK },
  earth:    { plate: '#0f2a25', accent: '#22897a', hi: '#22897a', ink: ON_DEEP, ring: INK },
  tech:     { plate: '#111111', accent: '#86a81b', hi: '#c6f432', ink: ON_DEEP, ring: INK },
  travel:   { plate: '#2c1d10', accent: '#c97c22', hi: '#c97c22', ink: ON_DEEP, ring: INK },
  sports:   { plate: '#0f2820', accent: '#5a9e2f', hi: '#e8f048', ink: ON_DEEP, ring: INK },
};

/** `a` over `b` at opacity `t`, as a literal: resvg is given no rgba(). */
function over(a: string, b: string, t: number): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return '#' + x.map((v, i) => Math.round(v * t + y[i] * (1 - t)).toString(16).padStart(2, '0')).join('');
}

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

/* The site's two families (Lens): Newsreader 500 for the display role (the
   opsz-72 static instance, whose family name is "Newsreader 72pt"), its
   italic for the emphasised word, and Instrument Sans 500 / 600 for labels
   and numbers. resvg matches them by family + weight + style. */
const FONT_FILES = [
  findFont('Newsreader Medium', (f) => /^newsreader-medium\.ttf$/i.test(f)),
  findFont('Newsreader Medium Italic', (f) => /^newsreader-mediumitalic\.ttf$/i.test(f)),
  findFont('Instrument Sans Medium', (f) => /^instrumentsans-medium\.ttf$/i.test(f)),
  findFont('Instrument Sans SemiBold', (f) => /^instrumentsans-semibold\.ttf$/i.test(f)),
];
const SERIF = "'Newsreader 72pt', Newsreader";
const SANS = "'Instrument Sans'";

// ── geometry ───────────────────────────────────────────────────────────────
const W = 1200;
const H = 630; // the link-preview size every platform accepts

// ── text helpers ─────────────────────────────────────────────────────────────
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const label = (t: string, x: number, y: number, size: number, color: string, ls = 1.4, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="${SANS}" font-weight="500" font-size="${size}" letter-spacing="${ls}" fill="${color}" text-anchor="${anchor}">${esc(t)}</text>`;
const serif = (t: string, x: number, y: number, size: number, color: string, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="${SERIF}" font-weight="500" font-size="${size}" letter-spacing="${(-0.01 * size).toFixed(2)}" fill="${color}" text-anchor="${anchor}">${esc(t)}</text>`;

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

/* The medallion (RD-10 step 3), in the SEAL cut the Brand-ShareCards board
   uses on a deep plate, at the desk's own station. A card renderer resolves
   neither CSS variables nor fonts, so the P is an outlined path. Geometry
   comes from src/lib/mark.ts, the same source the in-page component uses. */
function mark(t: Theme, topic: Topic, cx: number, cy: number, r = 30): string {
  const scale = (r * 2) / 300;
  const body = markBody({
    desk: topic,
    size: r * 2,
    cut: 'seal',
    colors: { accent: t.accent, ground: t.plate, ink: t.ring, paper: t.ink },
  });
  return `<g transform="translate(${cx - r} ${cy - r}) scale(${scale.toFixed(4)})">${body}</g>`;
}

// ── shared frame (the plate + footer) ────────────────────────────────────────
function frame(t: Theme, topic: Topic, inner: string, source: string): string {
  const soft = over(t.ink, t.plate, 0.72);   // --on-deep-2
  const hair = over(t.ink, t.plate, 0.18);   // --on-deep-hair
  const fy = H - 56;
  const footer =
    `<line x1="80" y1="${fy - 36}" x2="${W - 80}" y2="${fy - 36}" stroke="${hair}" stroke-width="1"/>` +
    mark(t, topic, 108, fy) +
    serif('Parallax', 150, fy + 12, 36, t.ink) +
    label(source, W - 80, fy + 6, 20, soft, 0, 'end');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="${W}" height="${H}" fill="${t.plate}"/>` +
    inner + footer + `</svg>`
  );
}

// ── the card: eyebrow + title + dek on the desk's plate ──────────────────────
export interface OgData { eyebrow: string; title: string; dek: string; source: string; }
export function ogCard(d: OgData, topic: Topic): string {
  const t = THEMES[topic];
  const soft = over(t.ink, t.plate, 0.72);
  const hair = over(t.ink, t.plate, 0.18);
  const titleLines = wrapWords(d.title, 26);
  const tY = 212, tLineH = 72, tSize = 66;
  const title = titleLines.map((ln, i) => serif(ln, 80, tY + i * tLineH, tSize, t.ink)).join('');
  const dekY = tY + (titleLines.length - 1) * tLineH + 70;
  const dek = wrapWords(d.dek, 64).slice(0, 2)
    .map((ln, i) => label(ln, 80, dekY + i * 40, 28, soft, 0)).join('');
  const inner =
    label(d.eyebrow.toUpperCase(), 80, 108, 22, t.hi, 1.3) +
    `<line x1="80" y1="140" x2="${W - 80}" y2="140" stroke="${hair}" stroke-width="1"/>` +
    title + dek;
  return frame(t, topic, inner, d.source);
}

// ── render ─────────────────────────────────────────────────────────────────
export function toPng(svg: string): Buffer {
  return Buffer.from(new Resvg(svg, {
    fitTo: { mode: 'width', value: W },
    font: {
      fontFiles: FONT_FILES.map((f) => join(fontDir, f)),
      loadSystemFonts: false,
      defaultFontFamily: 'Instrument Sans',
    },
  }).render().asPng());
}
