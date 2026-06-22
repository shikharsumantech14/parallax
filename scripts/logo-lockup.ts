/**
 * Parallax LOGO lockups — the mark + the "Parallax" wordmark in Fraunces.
 * Produces a stacked lockup (mark over wordmark, the primary logo) and a
 * horizontal lockup (mark left, wordmark right — for headers/banner). Wordmark
 * is rendered by resvg from the static Fraunces SemiBold TTF.
 *
 *   npx tsx scripts/logo-lockup.ts
 *     → assets/brand/concepts/lockup-stacked.{svg,png}  + -light.png
 *     → assets/brand/concepts/lockup-horizontal.{svg,png} + -light.png
 */
import { readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Resvg } from '@resvg/resvg-js';

const INK = '#1a1712';
const fontDir = join(process.cwd(), 'assets', 'fonts');
const frauncesFile = readdirSync(fontDir).find((f) => /fraunces/i.test(f) && /\.ttf$/i.test(f) && !/italic/i.test(f));
if (!frauncesFile) throw new Error('Fraunces TTF not found in assets/fonts/');
const frauncesPath = join(fontDir, frauncesFile);

// ---- the mark (centred on 500,500 in its own 1000-box) ----
const ring = 170;
const hero = 66;
const L = { x: 404, y: 500 };
const R = { x: 596, y: 500 };
const O = { x: 500, y: 500 };

function defs(): string {
  return (
    `<linearGradient id="ringInk" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#332c24"/><stop offset="50%" stop-color="#1a1712"/><stop offset="100%" stop-color="#0d0b08"/></linearGradient>` +
    `<radialGradient id="hero" cx="37%" cy="31%" r="76%"><stop offset="0%" stop-color="#ff9d72"/><stop offset="33%" stop-color="#ea5a34"/><stop offset="71%" stop-color="#bd361d"/><stop offset="100%" stop-color="#871f0f"/></radialGradient>` +
    `<radialGradient id="heroGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#e0492c" stop-opacity="0.5"/><stop offset="60%" stop-color="#e0492c" stop-opacity="0.22"/><stop offset="100%" stop-color="#e0492c" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="spec" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fff3ec" stop-opacity="0.95"/><stop offset="100%" stop-color="#fff3ec" stop-opacity="0"/></radialGradient>` +
    `<filter id="blurS" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="9"/></filter>` +
    `<filter id="blurG" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="11"/></filter>`
  );
}
function lens(c: { x: number; y: number }): string {
  return (
    `<circle cx="${c.x}" cy="${c.y + 14}" r="${ring}" fill="none" stroke="${INK}" stroke-width="11" opacity="0.12" filter="url(#blurS)"/>` +
    `<circle cx="${c.x}" cy="${c.y}" r="${ring}" fill="none" stroke="url(#ringInk)" stroke-width="11"/>`
  );
}
function markBody(): string {
  return (
    lens(L) + lens(R) +
    `<circle cx="${O.x}" cy="${O.y}" r="${hero + 22}" fill="url(#heroGlow)" filter="url(#blurG)"/>` +
    `<ellipse cx="${O.x}" cy="${O.y + hero * 0.95}" rx="${hero * 0.8}" ry="${hero * 0.2}" fill="${INK}" opacity="0.18" filter="url(#blurS)"/>` +
    `<circle cx="${O.x}" cy="${O.y}" r="${hero}" fill="url(#hero)"/>` +
    `<circle cx="${O.x}" cy="${O.y}" r="${hero}" fill="none" stroke="#7e1f10" stroke-width="1.5" opacity="0.4"/>` +
    `<circle cx="${O.x - hero * 0.32}" cy="${O.y - hero * 0.38}" r="${hero * 0.4}" fill="url(#spec)"/>` +
    `<circle cx="${O.x - hero * 0.4}" cy="${O.y - hero * 0.46}" r="6.5" fill="#fff6ef" opacity="0.9"/>`
  );
}
function markGroup(cx: number, cy: number, scale: number): string {
  return `<g transform="translate(${cx} ${cy}) scale(${scale}) translate(-500 -500)">${markBody()}</g>`;
}
function word(x: number, y: number, size: number, anchor: string, ink = INK): string {
  return `<text x="${x}" y="${y}" font-family="Fraunces" font-weight="600" font-size="${size}" letter-spacing="-1" fill="${ink}" text-anchor="${anchor}">Parallax</text>`;
}

function stacked(bg?: string, ink = INK): string {
  const w = 1000, h = 820;
  const rect = bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs()}</defs>${rect}${markGroup(500, 330, 0.9)}${word(500, 720, 168, 'middle', ink)}</svg>`;
}
function horizontal(bg?: string, ink = INK): string {
  const w = 1500, h = 540;
  const rect = bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs()}</defs>${rect}${markGroup(300, 270, 0.62)}${word(560, 330, 168, 'start', ink)}</svg>`;
}

function png(s: string, width: number): Buffer {
  return Buffer.from(
    new Resvg(s, {
      fitTo: { mode: 'width', value: width },
      font: { fontFiles: [frauncesPath], loadSystemFonts: false, defaultFontFamily: 'Fraunces' },
    }).render().asPng(),
  );
}

const outDir = join(process.cwd(), 'assets', 'brand', 'concepts');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'lockup-stacked.svg'), stacked());
writeFileSync(join(outDir, 'lockup-stacked.png'), png(stacked(), 1000));
writeFileSync(join(outDir, 'lockup-stacked-light.png'), png(stacked('#f4f1ea'), 1000));
writeFileSync(join(outDir, 'lockup-horizontal.svg'), horizontal());
writeFileSync(join(outDir, 'lockup-horizontal.png'), png(horizontal(), 1500));
writeFileSync(join(outDir, 'lockup-horizontal-light.png'), png(horizontal('#f4f1ea'), 1500));
console.log('wrote lockup-stacked + lockup-horizontal (svg, png, light)');
