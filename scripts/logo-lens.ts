/**
 * Parallax mark — "two lenses over the data."
 * Two overlapping glass lenses examine a small bar chart in the six Parallax
 * world-colors (the brand chord = visual explainers). Each lens magnifies +
 * shifts the chart differently, so you see the same data from two viewpoints —
 * parallax — and the six colours tie it to the brand. Glass volume + rim glow +
 * specular + soft shadow on a warm editorial-dark field for real depth.
 *
 *   npx tsx scripts/logo-lens.ts  → assets/brand/concepts/lens.png (1000x1000)
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Resvg } from '@resvg/resvg-js';

const W = 1000;
const CYAN = '#00d4ff';
const RED = '#e0492c'; // brand oxblood, nudged brighter so it reads on the dark field
// the six world accents (politics, space, earth, tech, travel, sports)
const ACCENTS = ['#d23b22', '#00d4ff', '#2d8a63', '#c6f432', '#e07a4a', '#e8f048'];

// the brand "chord": six bars of varied height = a tiny visual-explainer chart.
function chart(opacity: number): string {
  const heights = [150, 224, 186, 262, 198, 162];
  const bw = 30, gap = 26, n = 6;
  const total = n * bw + (n - 1) * gap;
  const x0 = (W - total) / 2;
  const baseY = 648;
  let s = `<g opacity="${opacity}">`;
  s += `<path d="M${x0 - 18} ${baseY} H${x0 + total + 18}" stroke="#ffffff" stroke-width="2" opacity="0.18"/>`;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * (bw + gap);
    const h = heights[i];
    s += `<rect x="${x}" y="${baseY - h}" width="${bw}" height="${h}" rx="7" fill="${ACCENTS[i]}"/>`;
    s += `<circle cx="${x + bw / 2}" cy="${baseY - h}" r="${bw / 2}" fill="${ACCENTS[i]}"/>`;
  }
  return s + `</g>`;
}

// the chart as seen through a lens: magnified about the lens centre + shifted by dx.
function refractedChart(cx: number, cy: number, mag: number, dx: number): string {
  return `<g transform="translate(${cx} ${cy}) scale(${mag}) translate(${-cx + dx} ${-cy})">${chart(0.95)}</g>`;
}

function lens(cx: number, cy: number, r: number, rim: string, glassId: string, clipId: string, glowId: string, dx: number): string {
  return (
    `<g clip-path="url(#${clipId})">` +
      refractedChart(cx, cy, 1.5, dx) +
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${glassId})"/>` +
      `<ellipse cx="${cx}" cy="${cy + r * 0.55}" rx="${r * 0.92}" ry="${r * 0.5}" fill="#07050a" opacity="0.5" filter="url(#soft)"/>` +
      `<ellipse cx="${cx - r * 0.32}" cy="${cy - r * 0.44}" rx="${r * 0.24}" ry="${r * 0.11}" fill="#ffffff" opacity="0.5" filter="url(#specBlur)" transform="rotate(-32 ${cx - r * 0.32} ${cy - r * 0.44})"/>` +
      `<circle cx="${cx - r * 0.42}" cy="${cy - r * 0.5}" r="7" fill="#ffffff" opacity="0.95"/>` +
    `</g>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${rim}" stroke-width="10" opacity="0.85" filter="url(#${glowId})"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${rim}" stroke-width="3.5" opacity="0.95"/>`
  );
}

function build(): string {
  const cy = 500, r = 196, lx = 408, rx = 592;
  const defs =
    `<radialGradient id="bg" cx="50%" cy="40%" r="78%"><stop offset="0%" stop-color="#211b14"/><stop offset="58%" stop-color="#15110c"/><stop offset="100%" stop-color="#0b0907"/></radialGradient>` +
    `<radialGradient id="glassL" cx="42%" cy="34%" r="72%"><stop offset="0%" stop-color="#00d4ff" stop-opacity="0"/><stop offset="70%" stop-color="#00d4ff" stop-opacity="0.04"/><stop offset="100%" stop-color="#00d4ff" stop-opacity="0.2"/></radialGradient>` +
    `<radialGradient id="glassR" cx="42%" cy="34%" r="72%"><stop offset="0%" stop-color="${RED}" stop-opacity="0"/><stop offset="70%" stop-color="${RED}" stop-opacity="0.04"/><stop offset="100%" stop-color="${RED}" stop-opacity="0.2"/></radialGradient>` +
    `<radialGradient id="coreGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fff6ec" stop-opacity="0.42"/><stop offset="100%" stop-color="#fff6ec" stop-opacity="0"/></radialGradient>` +
    `<clipPath id="clipL"><circle cx="${lx}" cy="${cy}" r="${r}"/></clipPath>` +
    `<clipPath id="clipR"><circle cx="${rx}" cy="${cy}" r="${r}"/></clipPath>` +
    `<filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="10"/></filter>` +
    `<filter id="specBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4.5"/></filter>` +
    `<filter id="glowL" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="12"/></filter>` +
    `<filter id="glowR" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="12"/></filter>`;

  const layers =
    `<rect width="${W}" height="${W}" fill="url(#bg)"/>` +
    chart(0.42) + // ambient chart (dim) behind the lenses
    lens(lx, cy, r, CYAN, 'glassL', 'clipL', 'glowL', 26) +
    lens(rx, cy, r, RED, 'glassR', 'clipR', 'glowR', -26) +
    `<ellipse cx="500" cy="500" rx="118" ry="178" fill="url(#coreGlow)" opacity="0.5" filter="url(#soft)"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}"><defs>${defs}</defs>${layers}</svg>`;
}

const outDir = join(process.cwd(), 'assets', 'brand', 'concepts');
mkdirSync(outDir, { recursive: true });
const svg = build();
writeFileSync(join(outDir, 'lens.svg'), svg);
writeFileSync(join(outDir, 'lens.png'), Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: 1000 } }).render().asPng()));
console.log('wrote lens.png');
