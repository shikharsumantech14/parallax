/**
 * Parallax social card system (Phase B workhorse) — bespoke, data-driven card
 * archetypes redesigned for the feed. Raw SVG → PNG via resvg, reusing the brand
 * mark + Fraunces/JetBrains. Themed per topic (the six worlds). The locked
 * aesthetic: dimensional, bold-payoff, clean type, footer lockup.
 *
 * Archetypes (this file): hero · data-readout. (comparison is the space-signature
 * sample in card-sample.ts; paradox + timeline land next.)
 *
 *   npx tsx scripts/social/cards.ts            # render the sample sheet to .cache
 *   npx tsx scripts/social/cards.ts hero space # one archetype/topic
 */
import { readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Resvg } from '@resvg/resvg-js';
import { TOPICS, type Topic } from '../lib/social.js';

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
// This module is on the PREBUILD critical path (scripts/story/og.ts imports it,
// and `prebuild` runs before every `npm run build`, including on Vercel). A
// missing or renamed TTF therefore fails the whole deploy, not just the social
// pipeline — so name the file we wanted rather than letting `undefined` flow
// into join() and surface as an unreadable ENOENT.
const fontDir = join(process.cwd(), 'assets', 'fonts');

function findFont(label: string, match: (f: string) => boolean): string {
  const hit = readdirSync(fontDir).find(match);
  if (!hit) {
    throw new Error(
      `[cards] No ${label} TTF in ${fontDir}. satori needs a STATIC instance ` +
        `(it crashes on variable fonts). Run \`node scripts/fetch-fonts.mjs\`, ` +
        `or drop one in by hand.`,
    );
  }
  return hit;
}

const frauncesFile = findFont('Fraunces', (f) => /fraunces/i.test(f) && /\.ttf$/i.test(f) && !/italic/i.test(f));
const monoFile = findFont('JetBrains Mono', (f) => /jetbrains/i.test(f) && /\.ttf$/i.test(f));

// ── sizes ──────────────────────────────────────────────────────────────────
export type Size = 'wide' | 'square' | 'og';
const DIMS: Record<Size, { w: number; h: number }> = {
  wide: { w: 1600, h: 900 },
  square: { w: 1080, h: 1080 },
  og: { w: 1200, h: 630 }, // link-preview card (WhatsApp/Slack/Twitter)
};

// ── text helpers ─────────────────────────────────────────────────────────────
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const mono = (t: string, x: number, y: number, size: number, color: string, ls = 3, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="JetBrains Mono" font-weight="500" font-size="${size}" letter-spacing="${ls}" fill="${color}" text-anchor="${anchor}">${esc(t)}</text>`;
const serif = (t: string, x: number, y: number, size: number, color: string, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="Fraunces" font-weight="600" font-size="${size}" fill="${color}" text-anchor="${anchor}">${esc(t)}</text>`;

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
const wrapSerif = (t: string, x: number, y: number, size: number, color: string, maxChars: number, lineH: number, anchor = 'start') =>
  wrapWords(t, maxChars).map((ln, i) => serif(ln, x, y + i * lineH, size, color, anchor)).join('');
const wrapMono = (t: string, x: number, y: number, size: number, color: string, maxChars: number, lineH: number, ls = 1, anchor = 'start') =>
  wrapWords(t, maxChars).map((ln, i) => mono(ln, x, y + i * lineH, size, color, ls, anchor)).join('');

let seed = 7;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
function starfield(w: number, h: number): string {
  let s = '';
  for (let i = 0; i < 40; i++) s += `<circle cx="${(rnd() * w).toFixed(0)}" cy="${(rnd() * h * 0.7).toFixed(0)}" r="${(rnd() * 1.4 + 0.3).toFixed(1)}" fill="#cfe6f2" opacity="${(rnd() * 0.4 + 0.1).toFixed(2)}"/>`;
  return s;
}

function mark(t: Theme, cx: number, cy: number): string {
  return (
    `<circle cx="${cx - 15}" cy="${cy}" r="26" fill="none" stroke="${t.ring}" stroke-width="3"/>` +
    `<circle cx="${cx + 15}" cy="${cy}" r="26" fill="none" stroke="${t.ring}" stroke-width="3"/>` +
    `<circle cx="${cx}" cy="${cy}" r="10" fill="url(#mhero)"/>`
  );
}

// ── card data shapes ─────────────────────────────────────────────────────────
export interface HeroData { eyebrow: string; claim: string; value: string; label: string; source: string; }
export interface Tile { value: string; label: string; note?: string; emphasis?: 'default' | 'key' | 'warn'; }
export interface ReadoutData { eyebrow: string; title: string; tiles: Tile[]; source: string; }
export interface ParadoxSide { label: string; statement: string; detail?: string; }
export interface ParadoxData { eyebrow: string; title: string; sides: [ParadoxSide, ParadoxSide]; source: string; }
export interface TimelineEvt { date: string; label: string; state?: 'default' | 'key' | 'fail' | 'now'; }
export interface TimelineData { eyebrow: string; title: string; events: TimelineEvt[]; source: string; }
export interface CmpSide { label?: string; title: string; kicker?: string; tag?: string; }
export interface CmpRow { label: string; values: string[]; }
export interface ComparisonData { eyebrow: string; title: string; sides: [CmpSide, CmpSide]; rows: CmpRow[]; source: string; }
export interface QuoteData { eyebrow?: string; quote: string; attribution: string; source: string; }

export type CardKind = 'hero' | 'data-readout' | 'paradox' | 'timeline' | 'comparison' | 'quote';

// ── shared frame (bg + footer) ───────────────────────────────────────────────
function frame(t: Theme, size: Size, inner: string, source: string): string {
  const { w, h } = DIMS[size];
  seed = 7;
  const defs =
    `<radialGradient id="bg" cx="50%" cy="20%" r="100%"><stop offset="0%" stop-color="${t.bg1}"/><stop offset="100%" stop-color="${t.bg2}"/></radialGradient>` +
    `<radialGradient id="mhero" cx="37%" cy="31%" r="76%"><stop offset="0%" stop-color="#ff9d72"/><stop offset="40%" stop-color="#ea5a34"/><stop offset="100%" stop-color="#8d2412"/></radialGradient>` +
    `<radialGradient id="vGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${t.accent}" stop-opacity="0.18"/><stop offset="100%" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>` +
    `<filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="22"/></filter>`;
  const fy = h - 56;
  const footer =
    `<line x1="80" y1="${fy - 36}" x2="${w - 80}" y2="${fy - 36}" stroke="${t.ink}" stroke-width="1" opacity="0.14"/>` +
    mark(t, 108, fy) +
    serif('Parallax', 150, fy + 14, 38, t.ink) +
    mono(source, w - 80, fy + 6, 18, t.inkSoft, 3, 'end');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>` +
    `<rect width="${w}" height="${h}" fill="url(#bg)"/>` +
    (t.stars ? starfield(w, h) : '') +
    inner + footer + `</svg>`
  );
}

// ── archetype: hero (one big number) ──────────────────────────────────────────
export function heroCard(d: HeroData, topic: Topic, size: Size = 'wide'): string {
  const t = THEMES[topic];
  const { w, h } = DIMS[size];
  const cx = w / 2, vy = size === 'wide' ? h * 0.52 : h * 0.46;
  const vSize = size === 'wide' ? 240 : 220;
  const inner =
    mono(d.eyebrow.toUpperCase(), 80, 100, 24, t.accent, 5) +
    serif(d.claim, 80, 168, size === 'wide' ? 46 : 42, t.ink) +
    `<ellipse cx="${cx}" cy="${vy - vSize * 0.28}" rx="${w * 0.4}" ry="${vSize * 0.55}" fill="url(#vGlow)" filter="url(#soft)"/>` +
    serif(d.value, cx, vy, vSize, t.ink, 'middle') +
    mono(d.label.toUpperCase(), cx, vy + 64, size === 'wide' ? 26 : 24, t.inkSoft, 4, 'middle');
  return frame(t, size, inner, d.source);
}

// ── archetype: og (link-preview: title + dek on the brand frame) ──────────────
// Purpose-built for /og/story/<slug>.png. Reuses the frame/mark/type machinery
// but composes title + dek rather than the number-centric hero — a far better
// WhatsApp/Slack/Twitter preview than a giant value would make.
export interface OgData { eyebrow: string; title: string; dek: string; source: string; }
export function ogCard(d: OgData, topic: Topic): string {
  const t = THEMES[topic];
  const { w } = DIMS.og;
  const titleLines = wrapWords(d.title, 24);
  const tY = 208, tLineH = 82, tSize = 66;
  const title = titleLines.map((ln, i) => serif(ln, 80, tY + i * tLineH, tSize, t.ink)).join('');
  const dekY = tY + (titleLines.length - 1) * tLineH + 74;
  const dek = wrapWords(d.dek, 62).slice(0, 2)
    .map((ln, i) => serif(ln, 80, dekY + i * 44, 30, t.inkSoft)).join('');
  const inner =
    mono(d.eyebrow.toUpperCase(), 80, 108, 24, t.accent, 5) +
    `<line x1="80" y1="140" x2="${w - 80}" y2="140" stroke="${t.ink}" stroke-width="1" opacity="0.14"/>` +
    title + dek;
  return frame(t, 'og', inner, d.source);
}

// ── archetype: data-readout (tiles) ───────────────────────────────────────────
export function readoutCard(d: ReadoutData, topic: Topic, size: Size = 'wide'): string {
  const t = THEMES[topic];
  const { w, h } = DIMS[size];
  const tiles = d.tiles.slice(0, 4);
  const cols = size === 'wide' ? 2 : 1;
  const rows = Math.ceil(tiles.length / cols);
  const gx = 80, gy = 280, gw = w - 160, gh = (size === 'wide' ? 470 : 600);
  const cw = (gw - (cols - 1) * 28) / cols, ch = (gh - (rows - 1) * 24) / rows;
  let grid = '';
  tiles.forEach((tile, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = gx + col * (cw + 28), y = gy + row * (ch + 24);
    const vColor = tile.emphasis === 'warn' ? t.accent : tile.emphasis === 'key' ? t.accent : t.ink;
    grid +=
      `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="18" fill="${t.ink}" opacity="0.05"/>` +
      `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="18" fill="none" stroke="${t.ink}" stroke-width="1" opacity="0.12"/>` +
      `<rect x="${x}" y="${y}" width="6" height="${ch}" rx="3" fill="${tile.emphasis === 'default' || !tile.emphasis ? t.inkSoft : t.accent}" opacity="0.9"/>` +
      serif(tile.value, x + 36, y + 96, 78, vColor) +
      mono(tile.label.toUpperCase(), x + 36, y + 134, 20, t.inkSoft, 2) +
      (tile.note ? mono(tile.note.toUpperCase(), x + 36, y + ch - 26, 15, t.inkSoft, 1) : '');
  });
  const inner =
    mono(d.eyebrow.toUpperCase(), 80, 100, 24, t.accent, 5) +
    serif(d.title, 80, 176, size === 'wide' ? 52 : 46, t.ink) +
    grid;
  return frame(t, size, inner, d.source);
}

// ── archetype: paradox (two sides) ───────────────────────────────────────────
export function paradoxCard(d: ParadoxData, topic: Topic, size: Size = 'wide'): string {
  const t = THEMES[topic];
  const { w } = DIMS[size];
  const midX = w / 2;
  const side = (s: ParadoxSide, x: number) =>
    mono(s.label.toUpperCase(), x, 332, 22, t.accent, 3) +
    wrapSerif(s.statement, x, 396, 40, t.ink, 26, 54) +
    (s.detail ? wrapMono(s.detail.toUpperCase(), x, 612, 17, t.inkSoft, 40, 26, 1) : '');
  const inner =
    mono(d.eyebrow.toUpperCase(), 80, 100, 24, t.accent, 5) +
    serif(d.title, 80, 176, 52, t.ink) +
    `<line x1="${midX}" y1="296" x2="${midX}" y2="722" stroke="${t.ink}" stroke-width="1.5" opacity="0.16"/>` +
    `<circle cx="${midX}" cy="500" r="16" fill="none" stroke="${t.accent}" stroke-width="1.5" opacity="0.5"/>` +
    `<circle cx="${midX}" cy="500" r="8" fill="${t.accent}"/>` +
    side(d.sides[0], 80) +
    side(d.sides[1], midX + 36);
  return frame(t, size, inner, d.source);
}

// ── archetype: timeline (horizontal rail) ─────────────────────────────────────
export function timelineCard(d: TimelineData, topic: Topic, size: Size = 'wide'): string {
  const t = THEMES[topic];
  const { w } = DIMS[size];
  const evs = d.events.slice(0, 6);
  const railY = size === 'wide' ? 480 : 540;
  const x0 = 160, x1 = w - 160, n = evs.length;
  const col = (s?: string) => (s === 'fail' ? '#e0653f' : s === 'now' || s === 'key' ? t.accent : t.inkSoft);
  let rail = `<line x1="${x0}" y1="${railY}" x2="${x1}" y2="${railY}" stroke="${t.ink}" stroke-width="2" opacity="0.2"/>`;
  evs.forEach((e, i) => {
    const x = n === 1 ? (x0 + x1) / 2 : x0 + ((x1 - x0) * i) / (n - 1);
    const c = col(e.state);
    rail +=
      (e.state === 'now' ? `<circle cx="${x}" cy="${railY}" r="18" fill="none" stroke="${c}" stroke-width="2" opacity="0.5"/>` : '') +
      `<circle cx="${x}" cy="${railY}" r="9" fill="${c}"/>` +
      mono(e.date.toUpperCase(), x, railY - 30, 19, c, 2, 'middle') +
      wrapSerif(e.label, x, railY + 52, 28, t.ink, 14, 36, 'middle');
  });
  const inner = mono(d.eyebrow.toUpperCase(), 80, 100, 24, t.accent, 5) + serif(d.title, 80, 176, 52, t.ink) + rail;
  return frame(t, size, inner, d.source);
}

// ── archetype: comparison (general two-column) ────────────────────────────────
export function comparisonCard(d: ComparisonData, topic: Topic, size: Size = 'wide'): string {
  const t = THEMES[topic];
  const { w } = DIMS[size];
  const midX = w / 2, cxL = w * 0.3, cxR = w * 0.7;
  const [A, B] = d.sides;
  const head = (s: CmpSide, cx: number) =>
    serif(s.title, cx, 296, 40, t.ink, 'middle') +
    (s.kicker ? mono(s.kicker.toUpperCase(), cx, 336, 19, t.accent, 2, 'middle') : '');
  let rows = '';
  d.rows.slice(0, 3).forEach((r, i) => {
    const y = 432 + i * 122;
    rows +=
      mono(r.label.toUpperCase(), midX, y, 18, t.inkSoft, 2, 'middle') +
      serif(r.values[0] ?? '', cxL, y + 56, 52, t.ink, 'middle') +
      serif(r.values[1] ?? '', cxR, y + 56, 52, t.ink, 'middle');
  });
  const inner =
    mono(d.eyebrow.toUpperCase(), 80, 100, 24, t.accent, 5) +
    serif(d.title, 80, 176, 48, t.ink) +
    `<line x1="${midX}" y1="248" x2="${midX}" y2="760" stroke="${t.ink}" stroke-width="1.5" opacity="0.14"/>` +
    head(A, cxL) + head(B, cxR) + rows;
  return frame(t, size, inner, d.source);
}

// ── archetype: quote (pull-quote) ─────────────────────────────────────────────
export function quoteCard(d: QuoteData, topic: Topic, size: Size = 'wide'): string {
  const t = THEMES[topic];
  const { w, h } = DIMS[size];
  const qSize = size === 'wide' ? 64 : 56;
  const maxChars = size === 'wide' ? 30 : 24;
  const lines = wrapWords(d.quote, maxChars);
  const lineH = Math.round(qSize * 1.2);
  const first = Math.round(h * 0.47 - ((lines.length - 1) * lineH) / 2);
  const quote = lines.map((ln, i) => serif(ln, 124, first + i * lineH, qSize, t.ink)).join('');
  const inner =
    (d.eyebrow ? mono(d.eyebrow.toUpperCase(), 124, 112, 24, t.accent, 5) : '') +
    `<text x="86" y="${first - 26}" font-family="Fraunces" font-weight="600" font-size="190" fill="${t.accent}" opacity="0.85">“</text>` +
    quote +
    mono(`— ${d.attribution}`, 124, first + (lines.length - 1) * lineH + 72, 24, t.inkSoft, 2);
  void w;
  return frame(t, size, inner, d.source);
}

// ── render ─────────────────────────────────────────────────────────────────
export function toPng(svg: string, size: Size): Buffer {
  const { w } = DIMS[size];
  return Buffer.from(new Resvg(svg, {
    fitTo: { mode: 'width', value: w },
    font: { fontFiles: [join(fontDir, frauncesFile), join(fontDir, monoFile)], loadSystemFonts: false, defaultFontFamily: 'Fraunces' },
  }).render().asPng());
}

/** Dispatch: render any archetype by kind. */
export function renderByKind(kind: CardKind, data: unknown, topic: Topic, size: Size = 'wide'): string {
  switch (kind) {
    case 'comparison': return comparisonCard(data as ComparisonData, topic, size);
    case 'data-readout': return readoutCard(data as ReadoutData, topic, size);
    case 'paradox': return paradoxCard(data as ParadoxData, topic, size);
    case 'timeline': return timelineCard(data as TimelineData, topic, size);
    case 'hero': return heroCard(data as HeroData, topic, size);
    case 'quote': return quoteCard(data as QuoteData, topic, size);
  }
}

// ── CLI: sample sheet ────────────────────────────────────────────────────────
const HERO_SAMPLE: HeroData = {
  eyebrow: 'Space · Kessler Cascade', claim: 'One constellation. One year of dodging.',
  value: '300,000+', label: 'Starlink collision-avoidance maneuvers in 2025', source: 'FCC · SpaceX',
};
const READOUT_SAMPLE: ReadoutData = {
  eyebrow: 'Space · Kessler Cascade', title: 'The system is already in evade mode.',
  tiles: [
    { value: '10,074', label: 'Starlink satellites in orbit', note: 'Crossed 10,000 on Mar 17 2026', emphasis: 'key' },
    { value: '300,000+', label: 'Collision-avoidance maneuvers', note: 'Calendar year 2025', emphasis: 'warn' },
    { value: '39', label: 'ISS debris dodges since 1998', note: 'Latest: Apr 30 2025' },
    { value: '$150k', label: 'Top FCC disposal-failure fine', note: 'Against a billion-dollar industry', emphasis: 'warn' },
  ],
  source: 'NASA ODPO · FCC · LeoLabs',
};
const PARADOX_SAMPLE: ParadoxData = {
  eyebrow: 'Politics · The Policy Void', title: 'Two rules. Two gaps.',
  sides: [
    { label: 'The Treaty Side', statement: '155 states voted to ban the test. The nine who refused hold most of the debris.', detail: 'UN Resolution A/RES/77/41, Dec 2022 — non-binding.' },
    { label: 'The Regulator Side', statement: 'A five-year disposal rule with a one-case enforcement history.', detail: 'FCC Order 22-74. Largest fine to date: $150,000.' },
  ],
  source: 'UN · FCC',
};
const TIMELINE_SAMPLE: TimelineData = {
  eyebrow: 'Space · Kessler Cascade', title: 'Four scars on low Earth orbit.',
  events: [
    { date: 'Jan 2007', label: 'Fengyun-1C ASAT', state: 'fail' },
    { date: 'Feb 2009', label: 'Iridium–Cosmos collision', state: 'fail' },
    { date: 'Mar 2019', label: 'Mission Shakti', state: 'fail' },
    { date: 'Nov 2021', label: 'Cosmos 1408 ASAT', state: 'fail' },
    { date: '2025', label: 'ESA: cascade underway', state: 'now' },
  ],
  source: 'NASA ODPO · ESA',
};
const QUOTE_SAMPLE: QuoteData = {
  eyebrow: 'Space · 2024 YR4',
  quote: 'At that distance, the rock reflects about as much light as an almond.',
  attribution: 'NASA, on tracking asteroid 2024 YR4 with JWST',
  source: 'NASA',
};

function main(): void {
  const [arg1, arg2] = process.argv.slice(2);
  const outDir = join(process.cwd(), '.cache', 'social-cards');
  mkdirSync(outDir, { recursive: true });
  const jobs: { name: string; svg: string; size: Size }[] = [];

  const tp = (arg2 as Topic) ?? 'space';
  if (arg1 === 'hero') jobs.push({ name: `hero-${tp}`, svg: heroCard(HERO_SAMPLE, tp), size: 'wide' });
  else if (arg1 === 'readout') jobs.push({ name: `readout-${tp}`, svg: readoutCard(READOUT_SAMPLE, tp), size: 'wide' });
  else if (arg1 === 'paradox') jobs.push({ name: `paradox-${tp}`, svg: paradoxCard(PARADOX_SAMPLE, tp), size: 'wide' });
  else if (arg1 === 'timeline') jobs.push({ name: `timeline-${tp}`, svg: timelineCard(TIMELINE_SAMPLE, tp), size: 'wide' });
  else if (arg1 === 'quote') jobs.push({ name: `quote-${tp}`, svg: quoteCard(QUOTE_SAMPLE, tp), size: 'wide' });
  else {
    // default sheet: every archetype, across themes (proves theming holds)
    jobs.push({ name: 'readout-space', svg: readoutCard(READOUT_SAMPLE, 'space'), size: 'wide' });
    jobs.push({ name: 'paradox-politics', svg: paradoxCard(PARADOX_SAMPLE, 'politics'), size: 'wide' });
    jobs.push({ name: 'timeline-space', svg: timelineCard(TIMELINE_SAMPLE, 'space'), size: 'wide' });
    jobs.push({ name: 'paradox-tech', svg: paradoxCard({ ...PARADOX_SAMPLE, eyebrow: 'Tech · sample' }, 'tech'), size: 'wide' });
    for (const t of ['space', 'politics', 'earth'] as Topic[]) {
      jobs.push({ name: `hero-${t}`, svg: heroCard({ ...HERO_SAMPLE, eyebrow: `${t} · sample` }, t), size: 'wide' });
    }
    jobs.push({ name: 'hero-space-sq', svg: heroCard(HERO_SAMPLE, 'space', 'square'), size: 'square' });
  }

  for (const j of jobs) {
    writeFileSync(join(outDir, `${j.name}.svg`), j.svg);
    writeFileSync(join(outDir, `${j.name}.png`), toPng(j.svg, j.size));
    console.log(`wrote ${j.name}.png`);
  }
  void TOPICS;
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('scripts/social/cards.ts');
if (invokedDirectly) main();
