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
 * board). Text on it is the on-deep paper. Phase 4 (2026-09-30) drew the
 * board's anatomy: the SEAL-cut medallion top-left at the desk's station, the
 * register beside it, the headline in Newsreader 500 with its authored
 * `*word*` in italic in the desk's hi (the lime on tech and sports, the mark
 * elsewhere), "No 17 · 4 min · parallaxlens.com" at the foot, and on the
 * right 45%, behind a hair, the issue's cover mark drawn from
 * `coverModel()` (src/lib/cover.ts, pure) in on-deep colours.
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
import { coverModel, COVER_W, COVER_H, type CoverField } from '../../src/lib/cover';

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

/* A title with its authored `*word*` emphasis, as words that remember which
   are emphasised, wrapped into lines of about `maxChars`. */
interface Word { w: string; em: boolean }
function words(title: string): Word[] {
  const out: Word[] = [];
  title.split(/(\*[^*]+\*)/).forEach((part) => {
    const em = /^\*[^*]+\*$/.test(part);
    part.replace(/\*/g, '').split(/\s+/).filter(Boolean).forEach((w) => out.push({ w, em }));
  });
  return out;
}
function wrap(ws: Word[], maxChars: number): Word[][] {
  const lines: Word[][] = [];
  let cur: Word[] = [];
  const len = (l: Word[]) => l.map((x) => x.w).join(' ').length;
  for (const w of ws) {
    if (cur.length && len([...cur, w]) > maxChars) { lines.push(cur); cur = [w]; }
    else cur.push(w);
  }
  if (cur.length) lines.push(cur);
  return lines;
}

/* The medallion (RD-10 step 3), in the SEAL cut the Brand-ShareCards board
   uses on a deep plate, at the desk's own station. A card renderer resolves
   neither CSS variables nor fonts, so the P is an outlined path. Geometry
   comes from src/lib/mark.ts, the same source the in-page component uses. */
function mark(t: Theme, topic: Topic, x: number, y: number, size: number): string {
  const body = markBody({
    desk: topic,
    size,
    cut: 'seal',
    colors: { accent: t.accent, ground: t.ring, ink: t.ring, paper: t.ink },
  });
  return `<g transform="translate(${x} ${y}) scale(${(size / 300).toFixed(4)})">${body}</g>`;
}

// ── the cover mark, on the plate ─────────────────────────────────────────────
/* src/lib/cover.ts draws in CSS colour references for paper (the desk inks by
   role, the neutrals by name). On the deep plate each role takes its on-deep
   counterpart, as literals: the desk's marks and words in its hi, ink in the
   on-deep paper, the greys in on-deep-2, the paper wells as a faint hair. */
function onDeep(c: string | undefined, t: Theme): string | undefined {
  if (!c) return c;
  const soft = over(t.ink, t.plate, 0.72);
  if (/--[a-z]{3}-(mark|text)\)|--topic-/.test(c)) return t.hi;
  if (/--[a-z]{3}-tint\)/.test(c)) return t.plate;
  if (c === 'var(--ink)') return t.ink;
  if (c === 'var(--ink-2)' || c === 'var(--muted)') return soft;
  if (c === 'var(--paper-2)') return over(t.ink, t.plate, 0.12);
  if (c === 'var(--hair-2)') return over(t.ink, t.plate, 0.24);
  return c.startsWith('var(') ? soft : c;
}
function coverArt(t: Theme, topic: Topic, d: OgData, x0: number, y0: number, k: number): string {
  const m = coverModel(topic, d.sections as any, d.title, { cover: d.cover });
  /* No drawable section: the desk medallion, large, the card's own mark. */
  if (!m.drawn) return mark(t, topic, x0 + (COVER_W * k - 200) / 2, y0 + (COVER_H * k - 200) / 2, 200);
  const g: string[] = [];
  for (const p of m.paths) {
    g.push(`<path d="${p.d}" fill="${onDeep(p.fill, t) ?? 'none'}"`
      + (p.stroke ? ` stroke="${onDeep(p.stroke, t)}" stroke-width="${p.sw ?? 1}"` : '')
      + (p.dash ? ` stroke-dasharray="${p.dash}"` : '')
      + (p.cap ? ` stroke-linecap="${p.cap}"` : '')
      + ` stroke-linejoin="round"` + (p.op != null ? ` opacity="${p.op}"` : '') + `/>`);
  }
  for (const r of m.rects) {
    g.push(`<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"` + (r.rx ? ` rx="${r.rx}"` : '')
      + ` fill="${onDeep(r.fill, t)}"` + (r.op != null ? ` fill-opacity="${r.op}"` : '') + `/>`);
  }
  for (const c of m.circles) {
    g.push(`<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="${onDeep(c.fill, t)}"`
      + (c.stroke ? ` stroke="${onDeep(c.stroke, t)}" stroke-width="${c.sw ?? 1}"` : '') + `/>`);
  }
  for (const x of m.texts) {
    g.push(`<text x="${x.x}" y="${x.y}" font-family="${SANS}" font-size="${x.fs}" font-weight="${x.w && x.w >= 600 ? 600 : 500}"`
      + (x.caps ? ' letter-spacing="0.8"' : '')
      + ` fill="${onDeep(x.fill, t)}" text-anchor="${x.anchor ?? 'start'}">${esc(x.t)}</text>`);
  }
  return `<g transform="translate(${x0.toFixed(1)} ${y0.toFixed(1)}) scale(${k.toFixed(4)})">${g.join('')}</g>`;
}

// ── the card: the seal and the eyebrow, the headline, the meta; the cover ───
export interface OgData {
  /** "Parallax · Match programme" */
  eyebrow: string;
  /** The title with its authored `*word*` emphasis. */
  title: string;
  /** "No 17 · 4 min · parallaxlens.com" */
  meta: string;
  /** The issue's sections and cover, for the cover mark on the right. */
  sections?: unknown[];
  cover?: CoverField;
}
export function ogCard(d: OgData, topic: Topic): string {
  const t = THEMES[topic];
  const soft = over(t.ink, t.plate, 0.72);
  const hair = over(t.ink, t.plate, 0.18);
  const LEFT = 660; // the words take 55%, the cover 45% (the Brand-ShareCards board)

  let size = 76;
  let lines = wrap(words(d.title), 15);
  if (lines.length > 4) { size = 60; lines = wrap(words(d.title), 19); }
  if (lines.length > 5) lines = lines.slice(0, 5);
  const lh = Math.round(size * 1.04);
  const top = Math.round((H - lines.length * lh) / 2 + size * 0.8);
  const title = lines.map((ln, i) =>
    `<text x="52" y="${top + i * lh}" font-family="${SERIF}" font-weight="500" font-size="${size}" letter-spacing="${(-0.01 * size).toFixed(2)}" fill="${t.ink}">`
    + ln.map((w, j) => `<tspan${w.em ? ` font-style="italic" fill="${t.hi}"` : ''}>${j ? ' ' : ''}${esc(w.w)}</tspan>`).join('')
    + `</text>`).join('');

  const k = 460 / COVER_W;
  const art = coverArt(t, topic, d, LEFT + (W - LEFT - COVER_W * k) / 2, (H - COVER_H * k) / 2, k);

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="${W}" height="${H}" fill="${t.plate}"/>` +
    mark(t, topic, 52, 44, 80) +
    label(d.eyebrow.toUpperCase(), 156, 94, 24, soft, 1.9) +
    title +
    label(d.meta, 52, H - 48, 24, soft, 0) +
    `<line x1="${LEFT}" y1="0" x2="${LEFT}" y2="${H}" stroke="${hair}" stroke-width="2"/>` +
    art +
    `</svg>`
  );
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
