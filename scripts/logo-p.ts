/**
 * Parallax "P" monogram — the Fraunces P carried through the parallax effects
 * (anaglyph displacement + dimensional depth + optional lensing warp), blended.
 *
 *   npm run brand:logo   →  assets/brand/concepts/p-1-anaglyph.png
 *                           assets/brand/concepts/p-2-dimensional.png
 *                           assets/brand/concepts/p-3-lensing.png
 *
 * The P glyph is extracted as a vector PATH from the Fraunces TTF via satori
 * (so resvg needs no font), then drawn as displaced cyan/red/ink copies with
 * gradients + filters.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const PAPER = '#f4f1ea';
const INK = '#161412';
const CYAN = '#00d4ff';
const RED = '#b8341f';

async function frauncesPPath(): Promise<string> {
  const dir = join(process.cwd(), 'assets', 'fonts');
  const file = readdirSync(dir).find((f) => f.toLowerCase().endsWith('.ttf') && /fraunces/i.test(f) && !/italic/i.test(f));
  if (!file) throw new Error('No Fraunces TTF in assets/fonts/');
  const el = {
    type: 'div',
    props: {
      style: { display: 'flex', width: 1000, height: 1000, alignItems: 'center', justifyContent: 'center' },
      children: { type: 'div', props: { style: { display: 'flex', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 760, color: '#000', lineHeight: 1 }, children: 'P' } },
    },
  };
  const svg = await satori(el as unknown as Parameters<typeof satori>[0], {
    width: 1000, height: 1000, fonts: [{ name: 'Fraunces', data: readFileSync(join(dir, file)), weight: 600, style: 'normal' }],
  });
  const m = svg.match(/<path[^>]*\bd="([^"]+)"/);
  if (!m) throw new Error('could not extract P path from satori output');
  return m[1];
}

interface Opts { glass: boolean; lensing: boolean; dot: boolean }

function buildSvg(d: string, o: Opts): string {
  const defs: string[] = [];
  defs.push(`<radialGradient id="paper" cx="50%" cy="44%" r="70%"><stop offset="0%" stop-color="#f7f4ee"/><stop offset="100%" stop-color="#ece7dc"/></radialGradient>`);
  defs.push(`<linearGradient id="glassP" x1="20%" y1="12%" x2="78%" y2="92%"><stop offset="0%" stop-color="#3a352f"/><stop offset="48%" stop-color="#1b1814"/><stop offset="100%" stop-color="#000000"/></linearGradient>`);
  defs.push(`<filter id="float" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur in="SourceAlpha" stdDeviation="12"/><feOffset dx="0" dy="14" result="o"/><feFlood flood-color="#2a2118" flood-opacity="0.30"/><feComposite in2="o" operator="in" result="s"/><feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`);
  defs.push(`<filter id="fringe"><feGaussianBlur stdDeviation="3.2"/></filter>`);
  if (o.lensing) {
    defs.push(`<filter id="lens" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.009" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="38" xChannelSelector="R" yChannelSelector="G"/></filter>`);
  }
  if (o.dot) {
    defs.push(`<radialGradient id="dot" cx="38%" cy="34%" r="75%"><stop offset="0%" stop-color="#e9583f"/><stop offset="46%" stop-color="#cc3c23"/><stop offset="100%" stop-color="#9c2715"/></radialGradient>`);
  }

  const glyph = `<path d="${d}"`;
  const layers: string[] = [];
  layers.push(`<rect width="1000" height="1000" fill="url(#paper)"/>`);

  if (o.lensing) {
    const grid = `<g stroke="${INK}" stroke-width="1.4" opacity="0.09"><path d="M150 250 H850 M150 330 H850 M150 410 H850 M150 490 H850 M150 570 H850 M150 650 H850 M150 730 H850"/><path d="M250 150 V850 M330 150 V850 M410 150 V850 M490 150 V850 M570 150 V850 M650 150 V850 M730 150 V850"/></g><g fill="none" stroke="${INK}" stroke-width="2" opacity="0.13"><circle cx="500" cy="500" r="150"/><circle cx="500" cy="500" r="210"/><circle cx="500" cy="500" r="270"/><circle cx="500" cy="500" r="330"/></g>`;
    layers.push(`<g filter="url(#lens)">${grid}</g>`);
  }

  // anaglyph displaced ghosts (slight blur so they read as a fringe, not a second letter)
  layers.push(`<g filter="url(#fringe)" opacity="0.92"><g transform="translate(-15 -12)">${glyph} fill="${CYAN}"/></g><g transform="translate(15 12)">${glyph} fill="${RED}"/></g></g>`);

  // front face of the P (with float shadow), flat ink or glass gradient
  const frontFill = o.glass ? 'url(#glassP)' : INK;
  layers.push(`<g filter="url(#float)">${glyph} fill="${frontFill}"/></g>`);

  if (o.dot) {
    // red lens-dot accent inside the P's counter (the "eye"/aperture of the P)
    layers.push(`<circle cx="556" cy="352" r="40" fill="url(#dot)"/><circle cx="544" cy="340" r="12" fill="#fff4ef" opacity="0.7"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000"><defs>${defs.join('')}</defs>${layers.join('')}</svg>`;
}

async function main(): Promise<void> {
  const d = await frauncesPPath();
  const outDir = join(process.cwd(), 'assets', 'brand', 'concepts');
  mkdirSync(outDir, { recursive: true });
  const variants: { name: string; opts: Opts }[] = [
    { name: 'p-1-anaglyph', opts: { glass: false, lensing: false, dot: false } },
    { name: 'p-2-dimensional', opts: { glass: true, lensing: false, dot: false } },
    { name: 'p-3-lensing', opts: { glass: true, lensing: true, dot: false } },
  ];
  for (const v of variants) {
    const svg = buildSvg(d, v.opts);
    writeFileSync(join(outDir, `${v.name}.svg`), svg);
    try {
      const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1000 } }).render().asPng();
      writeFileSync(join(outDir, `${v.name}.png`), Buffer.from(png));
      console.log(`OK   ${v.name}.png`);
    } catch (e) {
      console.log(`FAIL ${v.name}: ${e instanceof Error ? e.message : e}`);
    }
  }
}

main().catch((err) => { console.error('logo-p failed:', err instanceof Error ? err.message : err); process.exit(1); });
