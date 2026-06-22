/**
 * Render the final Parallax brand assets from the locked logo (the two-lens mark
 * + Fraunces wordmark). Type-led, editorial, warm paper. The mark's dimensional
 * hero sphere is echoed on the banner by the six world-accent spheres.
 *
 *   npm run brand:assets
 *     → assets/brand/avatar.png            (1000x1000, transparent, dark ink — for light themes)
 *     → assets/brand/avatar-ondark.png     (1000x1000, transparent, light ink — for dark themes)
 *     → assets/brand/avatar-onpaper.png    (1000x1000, warm-paper disc — background-proof)
 *     → assets/brand/banner.png            (1500x500, warm paper)
 *     → assets/brand/banner-dark.png       (1500x500, ink)
 *
 * Wordmark rendered by resvg from the static Fraunces SemiBold TTF.
 */
import { readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Resvg } from '@resvg/resvg-js';

const INK = '#1a1712';
const PAPER = '#f4f1ea';
const PAPER_INK = '#e9e2d4'; // light ring colour for dark backgrounds
const TAGLINE_INK = '#6b6055';
// six world accents (politics → sports)
const ACCENTS = ['#b8341f', '#00d4ff', '#2d6a4f', '#c6f432', '#c85a3c', '#e8f048'];

const fontDir = join(process.cwd(), 'assets', 'fonts');
const frauncesFile = readdirSync(fontDir).find((f) => /fraunces/i.test(f) && /\.ttf$/i.test(f) && !/italic/i.test(f));
if (!frauncesFile) throw new Error('Fraunces TTF not found in assets/fonts/');
const frauncesPath = join(fontDir, frauncesFile);

// ---- the locked mark (centred on 500,500) ----
const ring = 170, hero = 66;
const L = { x: 404, y: 500 }, R = { x: 596, y: 500 }, O = { x: 500, y: 500 };

function markDefs(): string {
  return (
    `<linearGradient id="ringInk" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#332c24"/><stop offset="50%" stop-color="#1a1712"/><stop offset="100%" stop-color="#0d0b08"/></linearGradient>` +
    `<radialGradient id="hero" cx="37%" cy="31%" r="76%"><stop offset="0%" stop-color="#ff9d72"/><stop offset="33%" stop-color="#ea5a34"/><stop offset="71%" stop-color="#bd361d"/><stop offset="100%" stop-color="#871f0f"/></radialGradient>` +
    `<radialGradient id="heroGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#e0492c" stop-opacity="0.5"/><stop offset="60%" stop-color="#e0492c" stop-opacity="0.22"/><stop offset="100%" stop-color="#e0492c" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="spec" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fff3ec" stop-opacity="0.95"/><stop offset="100%" stop-color="#fff3ec" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="ballSpec" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient>` +
    `<filter id="blurS" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="9"/></filter>` +
    `<filter id="blurG" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="11"/></filter>`
  );
}
function lens(c: { x: number; y: number }, stroke: string): string {
  return (
    `<circle cx="${c.x}" cy="${c.y + 14}" r="${ring}" fill="none" stroke="${INK}" stroke-width="11" opacity="0.1" filter="url(#blurS)"/>` +
    `<circle cx="${c.x}" cy="${c.y}" r="${ring}" fill="none" stroke="${stroke}" stroke-width="11"/>`
  );
}
function markBody(stroke = 'url(#ringInk)'): string {
  return (
    lens(L, stroke) + lens(R, stroke) +
    `<circle cx="${O.x}" cy="${O.y}" r="${hero + 22}" fill="url(#heroGlow)" filter="url(#blurG)"/>` +
    `<ellipse cx="${O.x}" cy="${O.y + hero * 0.95}" rx="${hero * 0.8}" ry="${hero * 0.2}" fill="${INK}" opacity="0.18" filter="url(#blurS)"/>` +
    `<circle cx="${O.x}" cy="${O.y}" r="${hero}" fill="url(#hero)"/>` +
    `<circle cx="${O.x}" cy="${O.y}" r="${hero}" fill="none" stroke="#7e1f10" stroke-width="1.5" opacity="0.4"/>` +
    `<circle cx="${O.x - hero * 0.32}" cy="${O.y - hero * 0.38}" r="${hero * 0.4}" fill="url(#spec)"/>` +
    `<circle cx="${O.x - hero * 0.4}" cy="${O.y - hero * 0.46}" r="6.5" fill="#fff6ef" opacity="0.9"/>`
  );
}
function markGroup(cx: number, cy: number, scale: number, stroke?: string): string {
  return `<g transform="translate(${cx} ${cy}) scale(${scale}) translate(-500 -500)">${markBody(stroke)}</g>`;
}
function word(x: number, y: number, size: number, anchor: string, ink: string, ls = -1): string {
  return `<text x="${x}" y="${y}" font-family="Fraunces" font-weight="600" font-size="${size}" letter-spacing="${ls}" fill="${ink}" text-anchor="${anchor}">Parallax</text>`;
}
// a small dimensional accent sphere (one per world)
function ball(cx: number, cy: number, r: number, color: string): string {
  return (
    `<ellipse cx="${cx}" cy="${cy + r * 0.92}" rx="${r * 0.82}" ry="${r * 0.2}" fill="${INK}" opacity="0.16" filter="url(#blurS)"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#000" stroke-width="1" opacity="0.16"/>` +
    `<circle cx="${cx - r * 0.32}" cy="${cy - r * 0.36}" r="${r * 0.5}" fill="url(#ballSpec)"/>` +
    `<circle cx="${cx - r * 0.38}" cy="${cy - r * 0.42}" r="${r * 0.16}" fill="#fff" opacity="0.85"/>`
  );
}

function svgDoc(w: number, h: number, body: string, bg?: string): string {
  const grad = `<radialGradient id="paper" cx="50%" cy="44%" r="80%"><stop offset="0%" stop-color="#f8f5ef"/><stop offset="100%" stop-color="#eae3d5"/></radialGradient>`;
  const rect = bg === 'paper' ? `<rect width="${w}" height="${h}" fill="url(#paper)"/>`
    : bg === 'ink' ? `<rect width="${w}" height="${h}" fill="#15110c"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${grad}${markDefs()}</defs>${rect}${body}</svg>`;
}

function png(s: string, width: number): Buffer {
  return Buffer.from(new Resvg(s, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles: [frauncesPath], loadSystemFonts: false, defaultFontFamily: 'Fraunces' },
  }).render().asPng());
}

// ---- avatars ----
function avatar(bg?: string, stroke?: string): string {
  return svgDoc(1000, 1000, markGroup(500, 500, 1.3, stroke), bg);
}

// ---- logo (mark alone + wordmark lockups) ----
function logoMark(bg?: string, stroke?: string): string {
  return svgDoc(1000, 1000, markGroup(500, 500, 1.3, stroke), bg);
}
function logoStacked(bg?: string, stroke?: string): string {
  const ink = stroke ? PAPER_INK : INK;
  return svgDoc(1000, 820, markGroup(500, 330, 0.9, stroke) + word(500, 720, 168, 'middle', ink), bg);
}
function logoHorizontal(bg?: string, stroke?: string): string {
  const ink = stroke ? PAPER_INK : INK;
  return svgDoc(1500, 540, markGroup(300, 270, 0.62, stroke) + word(560, 330, 168, 'start', ink), bg);
}

// ---- banner ----
function banner(dark: boolean): string {
  const ink = dark ? PAPER_INK : INK;
  const tag = dark ? '#b6ab9a' : TAGLINE_INK;
  const stroke = dark ? PAPER_INK : undefined;
  let balls = '';
  const bx0 = 1118, step = 52, by = 252, r = 23;
  ACCENTS.forEach((c, i) => { balls += ball(bx0 + i * step, by, r, c); });
  const body =
    markGroup(258, 250, 0.42, stroke) +
    word(398, 292, 120, 'start', ink) +
    `<text x="400" y="356" font-family="Fraunces" font-weight="600" font-size="37" letter-spacing="0" fill="${tag}">Stories you think you already understand.</text>` +
    balls;
  return svgDoc(1500, 500, body, dark ? 'ink' : 'paper');
}

const outDir = join(process.cwd(), 'assets', 'brand');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'avatar.png'), png(avatar(), 1000));
writeFileSync(join(outDir, 'avatar-ondark.png'), png(avatar(undefined, PAPER_INK), 1000));
writeFileSync(join(outDir, 'avatar-onpaper.png'), png(avatar('paper'), 1000));
writeFileSync(join(outDir, 'banner.png'), png(banner(false), 1500));
writeFileSync(join(outDir, 'banner-dark.png'), png(banner(true), 1500));
// logo kit
writeFileSync(join(outDir, 'logo-mark.png'), png(logoMark(), 1000));
writeFileSync(join(outDir, 'logo-mark-ondark.png'), png(logoMark(undefined, PAPER_INK), 1000));
writeFileSync(join(outDir, 'logo-mark-onpaper.png'), png(logoMark('paper'), 1000));
writeFileSync(join(outDir, 'logo-stacked.png'), png(logoStacked(), 1000));
writeFileSync(join(outDir, 'logo-stacked-onpaper.png'), png(logoStacked('paper'), 1000));
writeFileSync(join(outDir, 'logo-stacked-ondark.png'), png(logoStacked('ink', PAPER_INK), 1000));
writeFileSync(join(outDir, 'logo-horizontal.png'), png(logoHorizontal(), 1500));
writeFileSync(join(outDir, 'logo-horizontal-onpaper.png'), png(logoHorizontal('paper'), 1500));
writeFileSync(join(outDir, 'logo-horizontal-ondark.png'), png(logoHorizontal('ink', PAPER_INK), 1500));
console.log('wrote avatar (3), banner (2), logo mark (3) + stacked (3) + horizontal (3) → assets/brand/');
