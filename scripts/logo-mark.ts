/**
 * Parallax LOGO mark — distilled from the diagram into an icon.
 * Two overlapping lens-apertures (the two viewpoints) converge on a glowing 3D
 * hero sphere at their intersection — the object both angles resolve. All the
 * textbook scaffolding (far line, ticks, brackets, background dots) is gone.
 * Transparent background. Built to read at avatar size.
 *
 *   npx tsx scripts/logo-mark.ts
 *     → assets/brand/concepts/mark.svg / mark.png      (transparent — the asset)
 *     → assets/brand/concepts/mark-light.png           (preview on warm paper)
 *     → assets/brand/concepts/mark-dark.png            (preview on dark)
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Resvg } from '@resvg/resvg-js';

const W = 1000;
const INK = '#1a1712';

const L = { x: 404, y: 500 };
const R = { x: 596, y: 500 };
const O = { x: 500, y: 500 };
const ring = 170;
const hero = 66;

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

// one viewpoint lens — gradient-stroked ring + soft drop for dimension
function lens(c: { x: number; y: number }): string {
  return (
    `<circle cx="${c.x}" cy="${c.y + 14}" r="${ring}" fill="none" stroke="${INK}" stroke-width="11" opacity="0.12" filter="url(#blurS)"/>` +
    `<circle cx="${c.x}" cy="${c.y}" r="${ring}" fill="none" stroke="url(#ringInk)" stroke-width="11"/>`
  );
}

function mark(): string {
  return (
    lens(L) +
    lens(R) +
    // hero glow + contact shadow + sphere + rim + specular
    `<circle cx="${O.x}" cy="${O.y}" r="${hero + 22}" fill="url(#heroGlow)" filter="url(#blurG)"/>` +
    `<ellipse cx="${O.x}" cy="${O.y + hero * 0.95}" rx="${hero * 0.8}" ry="${hero * 0.2}" fill="${INK}" opacity="0.18" filter="url(#blurS)"/>` +
    `<circle cx="${O.x}" cy="${O.y}" r="${hero}" fill="url(#hero)"/>` +
    `<circle cx="${O.x}" cy="${O.y}" r="${hero}" fill="none" stroke="#7e1f10" stroke-width="1.5" opacity="0.4"/>` +
    `<circle cx="${O.x - hero * 0.32}" cy="${O.y - hero * 0.38}" r="${hero * 0.4}" fill="url(#spec)"/>` +
    `<circle cx="${O.x - hero * 0.4}" cy="${O.y - hero * 0.46}" r="6.5" fill="#fff6ef" opacity="0.9"/>`
  );
}

function svg(bg?: string): string {
  const rect = bg ? `<rect width="${W}" height="${W}" fill="${bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}"><defs>${defs()}</defs>${rect}${mark()}</svg>`;
}

function png(s: string): Buffer {
  return Buffer.from(new Resvg(s, { fitTo: { mode: 'width', value: 1000 } }).render().asPng());
}

const outDir = join(process.cwd(), 'assets', 'brand', 'concepts');
mkdirSync(outDir, { recursive: true });
const transparent = svg();
writeFileSync(join(outDir, 'mark.svg'), transparent);
writeFileSync(join(outDir, 'mark.png'), png(transparent));
writeFileSync(join(outDir, 'mark-light.png'), png(svg('#f4f1ea')));
writeFileSync(join(outDir, 'mark-dark.png'), png(svg('#15110c')));
console.log('wrote mark.svg, mark.png (transparent), mark-light.png, mark-dark.png');
