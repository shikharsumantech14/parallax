/**
 * The mark's geometry, in ONE place (RD-10).
 *
 * Three consumers need it and must not drift: `core/Mark.astro` (in-page,
 * token-coloured), the favicon/app-icon writer, and the OG card renderer —
 * which cannot use tokens at all, because satori and resvg resolve no CSS
 * variables. So the shapes live here and each consumer supplies its own
 * colours.
 *
 * Numbers are the delivered brand SVGs', verified against all six desk marks:
 * accent disc r110, ground-offset disc r113 pushed 15 units along the desk's
 * dial, ink ring r118.
 */
import { MARK_GLYPH, glyphTier } from './mark-glyph';

export type Desk = 'politics' | 'space' | 'earth' | 'tech' | 'travel' | 'sports';
export type Cut = 'mark' | 'seal' | 'reversed';

/** Fixed stations (RD-10). Not interpolated, not rotated, not "close enough". */
export const DIAL: Record<Desk, number> = {
  politics: 325, space: 25, earth: 85, tech: 145, travel: 205, sports: 265,
};

/** The prototype's own formula (Web.dc.html:914) at r = 15. */
export function dialAt(deg: number, r = 15): [number, number] {
  return [
    +(150 - r * Math.cos((deg * Math.PI) / 180)).toFixed(1),
    +(150 - r * Math.sin((deg * Math.PI) / 180)).toFixed(1),
  ];
}

/** Ring weight thickens as the mark shrinks, so it survives being small. */
export function ringFor(size: number): number {
  return size >= 96 ? 7 : size >= 40 ? 10 : 14;
}

/** Below 24px the reversed cut is a declared tier, not a degradation. */
export function cutFor(size: number): Cut {
  return size < 24 ? 'reversed' : 'mark';
}

export interface MarkColors {
  accent: string;
  ground: string;
  ink: string;
  paper: string;
}

/** The mark's inner shapes, colour-agnostic. Consumers wrap in their own <svg>. */
export function markBody(
  { desk = 'politics', size = 40, cut, colors }:
  { desk?: Desk; size?: number; cut?: Cut; colors: MarkColors }
): string {
  const [ox, oy] = dialAt(DIAL[desk]);
  const ring = ringFor(size);
  const c = cut ?? cutFor(size);
  const glyph = MARK_GLYPH[glyphTier(size)];
  const { accent, ground, ink, paper } = colors;

  if (c === 'reversed') {
    return `<circle cx="150" cy="150" r="118" fill="${ink}"/>`
         + `<path d="${glyph}" fill="${paper}"/>`;
  }
  if (c === 'seal') {
    return `<circle cx="150" cy="150" r="118" fill="${ink}"/>`
         + `<circle cx="150" cy="150" r="110" fill="${accent}"/>`
         + `<circle cx="${ox}" cy="${oy}" r="113" fill="${ink}"/>`
         + `<path d="${glyph}" fill="${paper}"/>`;
  }
  return `<circle cx="150" cy="150" r="110" fill="${accent}"/>`
       + `<circle cx="${ox}" cy="${oy}" r="113" fill="${ground}"/>`
       + `<circle cx="150" cy="150" r="118" fill="none" stroke="${ink}" stroke-width="${ring}"/>`
       + `<path d="${glyph}" fill="${ink}"/>`;
}

/** A standalone SVG document — for generated files and satori/resvg. */
export function markSVG(
  opts: { desk?: Desk; size?: number; cut?: Cut; colors: MarkColors; box?: number }
): string {
  const box = opts.box ?? opts.size ?? 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" `
       + `width="${box}" height="${box}">${markBody(opts)}</svg>`;
}
