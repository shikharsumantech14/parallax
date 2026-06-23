/**
 * SAMPLE — bespoke social "comparison" card archetype (Phase B, workhorse).
 * Data-driven from an issue's `comparison` section, redesigned for the feed:
 * the altitude asymmetry as two glowing orbital shells over Earth's limb, the
 * big fragment counts as the bold payoff on a diagonal (Fengyun high-right,
 * Cosmos low-left). Space-world theme. Raw SVG → PNG (resvg), reusing the brand
 * mark + Fraunces/JetBrains. One-off to lock the look before generalising.
 *
 *   npx tsx scripts/social/card-sample.ts → .cache/social-cards/comparison-kessler.png (1600x900)
 */
import { readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Resvg } from '@resvg/resvg-js';

const W = 1600, H = 900;
// space world
const BG1 = '#0e2038', BG2 = '#060f1d', ACCENT = '#00d4ff', INK = '#eaf2f8', INK_SOFT = '#92a7b8', RING = '#e9e2d4';

const fontDir = join(process.cwd(), 'assets', 'fonts');
const fraunces = readdirSync(fontDir).find((f) => /fraunces/i.test(f) && /\.ttf$/i.test(f) && !/italic/i.test(f))!;
const mono = readdirSync(fontDir).find((f) => /jetbrains/i.test(f) && /\.ttf$/i.test(f))!;

const EC = { x: 800, y: 2470 }, ER = 1700;
const PXPK = 0.62;
const shellRadius = (km: number) => ER + km * PXPK;
function pointOnShell(km: number, x: number) {
  const r = shellRadius(km), dx = x - EC.x;
  return { x, y: EC.y - Math.sqrt(Math.max(0, r * r - dx * dx)) };
}
function arcPath(km: number): string {
  const r = shellRadius(km), a = pointOnShell(km, 120), b = pointOnShell(km, W - 120);
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${r.toFixed(0)} ${r.toFixed(0)} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

let seed = 1337;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

function starfield(): string {
  let s = '';
  for (let i = 0; i < 42; i++) {
    const x = rnd() * W, y = rnd() * 620, r = rnd() * 1.5 + 0.3, o = rnd() * 0.42 + 0.1;
    s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#cfe6f2" opacity="${o.toFixed(2)}"/>`;
  }
  return s;
}

// a small, deliberate debris scatter around a node
function debris(cx: number, cy: number, n: number, spread: number, color: string, op: number): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = cx + (rnd() - 0.5) * spread, y = cy + (rnd() - 0.5) * spread * 0.55;
    s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(rnd() * 1.8 + 1).toFixed(1)}" fill="${color}" opacity="${op}"/>`;
  }
  return s;
}

function mark(cx: number, cy: number): string {
  return (
    `<circle cx="${cx - 15}" cy="${cy}" r="26" fill="none" stroke="${RING}" stroke-width="3"/>` +
    `<circle cx="${cx + 15}" cy="${cy}" r="26" fill="none" stroke="${RING}" stroke-width="3"/>` +
    `<circle cx="${cx}" cy="${cy}" r="10" fill="url(#mhero)"/>`
  );
}

const cap = (t: string, x: number, y: number, size: number, color: string, ls = 4, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="JetBrains Mono" font-weight="500" font-size="${size}" letter-spacing="${ls}" fill="${color}" text-anchor="${anchor}">${t}</text>`;
const serif = (t: string, x: number, y: number, size: number, color: string, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="Fraunces" font-weight="600" font-size="${size}" fill="${color}" text-anchor="${anchor}">${t}</text>`;

function build(): string {
  const fNode = pointOnShell(865, 1100); // Fengyun, high-right
  const cNode = pointOnShell(480, 380); // Cosmos, low-left

  const defs =
    `<radialGradient id="bg" cx="50%" cy="22%" r="95%"><stop offset="0%" stop-color="${BG1}"/><stop offset="100%" stop-color="${BG2}"/></radialGradient>` +
    `<linearGradient id="earthG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#16344f"/><stop offset="100%" stop-color="#081523"/></linearGradient>` +
    `<radialGradient id="mhero" cx="37%" cy="31%" r="76%"><stop offset="0%" stop-color="#ff9d72"/><stop offset="40%" stop-color="#ea5a34"/><stop offset="100%" stop-color="#8d2412"/></radialGradient>` +
    `<filter id="glowS" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.5"/></filter>`;

  const layers =
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>` +
    starfield() +
    `<circle cx="${EC.x}" cy="${EC.y}" r="${ER}" fill="url(#earthG)"/>` +
    `<path d="${arcPath(0)}" fill="none" stroke="${ACCENT}" stroke-width="3" opacity="0.32" filter="url(#glowS)"/>` +
    // shells — dim lower (clearing) vs bright glowing higher (persists)
    `<path d="${arcPath(480)}" fill="none" stroke="${ACCENT}" stroke-width="2.5" opacity="0.45"/>` +
    `<path d="${arcPath(865)}" fill="none" stroke="${ACCENT}" stroke-width="4" opacity="0.85" filter="url(#glowS)"/>` +
    `<path d="${arcPath(865)}" fill="none" stroke="${ACCENT}" stroke-width="2.5" opacity="0.98"/>` +
    // thinned debris
    debris(cNode.x, cNode.y, 7, 120, INK_SOFT, 0.45) +
    debris(fNode.x, fNode.y, 16, 190, ACCENT, 0.7) +
    `<circle cx="${cNode.x}" cy="${cNode.y}" r="5.5" fill="${INK_SOFT}"/>` +
    `<circle cx="${fNode.x}" cy="${fNode.y}" r="8" fill="${ACCENT}" filter="url(#glowS)"/>` +
    `<circle cx="${fNode.x}" cy="${fNode.y}" r="5" fill="#fff"/>` +
    // title (top-left)
    cap('THE ALTITUDE ASYMMETRY', 80, 92, 24, ACCENT, 6) +
    serif('Where the break happened decides', 80, 162, 58, INK) +
    serif('how long it remembers.', 80, 226, 58, INK) +
    // Fengyun payoff (top-right, by the high shell)
    cap('FENGYUN-1C · CHINA · 2007', 1520, 318, 22, ACCENT, 3, 'end') +
    serif('3,500+', 1520, 410, 96, INK, 'end') +
    cap('FRAGMENTS · 865 KM · ALOFT PAST 2100', 1520, 450, 21, INK_SOFT, 3, 'end') +
    // Cosmos payoff (low-left, by the dim shell)
    cap('COSMOS 1408 · RUSSIA · 2021', 80, 622, 22, INK_SOFT, 3) +
    serif('1,500+', 80, 706, 72, INK) +
    cap('FRAGMENTS · 480 KM · LOWER ORBIT, CLEARING', 80, 744, 21, INK_SOFT, 3) +
    // footer lockup
    `<line x1="80" y1="812" x2="${W - 80}" y2="812" stroke="${INK}" stroke-width="1" opacity="0.12"/>` +
    mark(108, 856) +
    serif('Parallax', 150, 872, 40, INK) +
    cap('NASA ODPO · LEOLABS', W - 80, 864, 19, INK_SOFT, 3, 'end');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${layers}</svg>`;
}

const outDir = join(process.cwd(), '.cache', 'social-cards');
mkdirSync(outDir, { recursive: true });
const svg = build();
writeFileSync(join(outDir, 'comparison-kessler.svg'), svg);
writeFileSync(
  join(outDir, 'comparison-kessler.png'),
  Buffer.from(new Resvg(svg, {
    fitTo: { mode: 'width', value: W },
    font: { fontFiles: [join(fontDir, fraunces), join(fontDir, mono)], loadSystemFonts: false, defaultFontFamily: 'Fraunces' },
  }).render().asPng()),
);
console.log('wrote comparison-kessler.png');
