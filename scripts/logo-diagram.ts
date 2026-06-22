/**
 * Parallax mark — "the focal object."
 * The base is the parallax DIAGRAM (the maths): two overlapping viewpoint
 * circles triangulate on a near object; the two lines of sight project it to
 * two displaced points on a far reference — that displacement is parallax.
 * On top of that base it goes dimensional: the observed object is a glowing 3D
 * HERO sphere (the thing every viewpoint is trying to resolve), the circles are
 * real glass instruments, all on warm editorial paper — light, modern, with a
 * focal element that stands out.
 *
 *   npx tsx scripts/logo-diagram.ts  → assets/brand/concepts/diagram.png (1000x1000)
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Resvg } from '@resvg/resvg-js';

const W = 1000;
const INK = '#1a1712';
const RED = '#b8341f';

// geometry — centred, balanced; survives a circular avatar crop
const L = { x: 404, y: 612 };   // left observation station (viewpoint)
const R = { x: 596, y: 612 };   // right observation station
const O = { x: 500, y: 404 };   // the observed object — the hero
const ring = 108;               // viewpoint circle radius — they overlap (brand mark)
const hero = 62;                // hero sphere radius
const farY = 296;               // far background reference line
const shiftY = 276;             // the red displacement bracket sits just above it

function proj(from: { x: number; y: number }): number {
  const t = (farY - from.y) / (O.y - from.y);
  return from.x + (O.x - from.x) * t;
}
const fxL = proj(L);
const fxR = proj(R);

function defs(): string {
  return (
    `<radialGradient id="paper" cx="50%" cy="46%" r="74%"><stop offset="0%" stop-color="#f8f5ef"/><stop offset="100%" stop-color="#eae3d5"/></radialGradient>` +
    // the hero sphere — warm, dimensional, light-friendly
    `<radialGradient id="hero" cx="37%" cy="31%" r="74%"><stop offset="0%" stop-color="#ff9d72"/><stop offset="34%" stop-color="#ea5a34"/><stop offset="72%" stop-color="#bd361d"/><stop offset="100%" stop-color="#8d2412"/></radialGradient>` +
    `<radialGradient id="heroGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#e0492c" stop-opacity="0.6"/><stop offset="100%" stop-color="#e0492c" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="spec" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fff3ec" stop-opacity="0.95"/><stop offset="100%" stop-color="#fff3ec" stop-opacity="0"/></radialGradient>` +
    // glass sheen on the viewpoint lenses (subtle top-left light on light paper)
    `<radialGradient id="glass" cx="38%" cy="32%" r="72%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="52%" stop-color="#ffffff" stop-opacity="0.05"/><stop offset="100%" stop-color="#1a1712" stop-opacity="0.07"/></radialGradient>` +
    // sightline fade (depth)
    `<linearGradient id="ray" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="${INK}" stop-opacity="0.5"/><stop offset="100%" stop-color="${INK}" stop-opacity="0.18"/></linearGradient>` +
    `<filter id="blurS" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="8"/></filter>` +
    `<filter id="blurG" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="14"/></filter>`
  );
}

function lens(c: { x: number; y: number }): string {
  return (
    // soft cast shadow
    `<ellipse cx="${c.x}" cy="${c.y + ring * 0.62}" rx="${ring * 0.82}" ry="${ring * 0.22}" fill="${INK}" opacity="0.16" filter="url(#blurS)"/>` +
    // glass body + rims
    `<circle cx="${c.x}" cy="${c.y}" r="${ring}" fill="url(#glass)"/>` +
    `<circle cx="${c.x}" cy="${c.y}" r="${ring}" fill="none" stroke="${INK}" stroke-width="4"/>` +
    `<circle cx="${c.x}" cy="${c.y}" r="${ring - 9}" fill="none" stroke="${INK}" stroke-width="1.4" opacity="0.32"/>` +
    // aperture / pupil — reads as an instrument, not a wheel
    `<circle cx="${c.x}" cy="${c.y}" r="15" fill="none" stroke="${INK}" stroke-width="2" opacity="0.55"/>` +
    `<circle cx="${c.x}" cy="${c.y}" r="4.5" fill="${INK}"/>` +
    // crisp glass catch-light
    `<circle cx="${c.x - ring * 0.42}" cy="${c.y - ring * 0.46}" r="9" fill="url(#spec)"/>`
  );
}

function build(): string {
  let bg = '';
  for (let x = 416; x <= 584; x += 42) bg += `<circle cx="${x}" cy="${farY}" r="3" fill="${INK}" opacity="0.26"/>`;

  const layers =
    `<rect width="${W}" height="${W}" fill="url(#paper)"/>` +
    // far background reference + its dots + end ticks
    `<path d="M404 ${farY} H596" stroke="${INK}" stroke-width="1.5" opacity="0.28"/>` +
    `<path d="M404 ${farY - 7} V${farY + 7} M596 ${farY - 7} V${farY + 7}" stroke="${INK}" stroke-width="1.5" opacity="0.28"/>` +
    bg +
    // stereo baseline between the two stations
    `<path d="M${L.x} ${L.y} H${R.x}" stroke="${INK}" stroke-width="1.6" opacity="0.24"/>` +
    // lines of sight (drawn behind everything, fading with depth), continuing to the far points
    `<path d="M${L.x} ${L.y} L${fxL} ${farY}" stroke="url(#ray)" stroke-width="2.2" stroke-linecap="round"/>` +
    `<path d="M${R.x} ${R.y} L${fxR} ${farY}" stroke="url(#ray)" stroke-width="2.2" stroke-linecap="round"/>` +
    // the displaced apparent positions (red) + the measured-shift bracket
    `<path d="M${fxL} ${shiftY} V${farY - 3} M${fxR} ${shiftY} V${farY - 3} M${fxR} ${shiftY} H${fxL}" stroke="${RED}" stroke-width="2.5" fill="none" opacity="0.85" stroke-linecap="round"/>` +
    `<circle cx="${fxL}" cy="${farY}" r="6.5" fill="${RED}"/>` +
    `<circle cx="${fxR}" cy="${farY}" r="6.5" fill="${RED}"/>` +
    // the two glass viewpoint instruments
    lens(L) +
    lens(R) +
    // a crisp aperture ring around the hero (modern / optical)
    `<circle cx="${O.x}" cy="${O.y}" r="${hero + 15}" fill="none" stroke="${INK}" stroke-width="1.3" opacity="0.28"/>` +
    // ===== the HERO sphere =====
    `<circle cx="${O.x}" cy="${O.y}" r="${hero + 30}" fill="url(#heroGlow)" filter="url(#blurG)"/>` +
    `<ellipse cx="${O.x}" cy="${O.y + hero * 0.92}" rx="${hero * 0.78}" ry="${hero * 0.2}" fill="${INK}" opacity="0.2" filter="url(#blurS)"/>` +
    `<circle cx="${O.x}" cy="${O.y}" r="${hero}" fill="url(#hero)"/>` +
    `<circle cx="${O.x}" cy="${O.y}" r="${hero}" fill="none" stroke="#7e1f10" stroke-width="1.5" opacity="0.45"/>` +
    `<circle cx="${O.x - hero * 0.34}" cy="${O.y - hero * 0.4}" r="${hero * 0.42}" fill="url(#spec)"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}"><defs>${defs()}</defs>${layers}</svg>`;
}

const outDir = join(process.cwd(), 'assets', 'brand', 'concepts');
mkdirSync(outDir, { recursive: true });
const svg = build();
writeFileSync(join(outDir, 'diagram.svg'), svg);
writeFileSync(join(outDir, 'diagram.png'), Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: 1000 } }).render().asPng()));
console.log('wrote diagram.png');
