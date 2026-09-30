/**
 * Shared figure helpers for the earth desk's kinds (Lens Phase 6). Pure
 * functions, build time only. The headline number (FigHead.astro), the cue
 * numeral layer over an SVG (CueLayer.astro) and the label budgeting every
 * earth SVG uses.
 */
export { wrapWords } from '../../../lib/cover';

/** The literal font stack for in-SVG text (RD-01b, LENS §3.3: never var()). */
export const SANS = "font-family:'Instrument Sans','Helvetica Neue',Arial,sans-serif";
export const SERIF = "font-family:'Newsreader',Georgia,'Times New Roman',serif";

/** Width estimate of a string at `fs` px in Instrument Sans (0.56em a char,
 *  0.62 at 600 weight), the same estimate src/lib/cover.ts uses. */
export const textW = (s: string, fs: number, bold = false) => s.length * fs * (bold ? 0.6 : 0.56);

/** A number as printed: grouped en-US, at most `dp` decimals. */
export const fmt = (v: number, dp = 1) =>
  v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: 0 });

/**
 * How the headline number builds (LENS §6.4). A counter when the text holds
 * ONE number with at most one decimal (the island's two formats); anything
 * else (a range, two decimals) rises into place instead.
 */
export function headBuild(text: string): { kind: 'counter' | 'rise'; to?: string; format?: string } {
  const m = /^[^\d]*?(\d[\d,]*(?:\.(\d+))?)[^\d]*$/.exec(text);
  if (!m) return { kind: 'rise' };
  const dp = m[2]?.length ?? 0;
  if (dp > 1) return { kind: 'rise' };
  return { kind: 'counter', to: m[1].replace(/,/g, ''), format: dp === 1 ? '1dp' : undefined };
}

/** A box, for collision tests. */
export interface Box { x0: number; y0: number; x1: number; y1: number }
export const hits = (a: Box, b: Box, pad = 2) =>
  a.x0 < b.x1 + pad && b.x0 < a.x1 + pad && a.y0 < b.y1 + pad && b.y0 < a.y1 + pad;

/**
 * Stack labels along one axis without overlap: each item keeps its wanted
 * position unless the one before it (in order) needs the room, then it moves
 * down; a final pass pulls the stack back up if it ran past `max`.
 */
export function stack<T extends { want: number; size: number }>(items: T[], min: number, max: number, gap = 4): (T & { at: number })[] {
  const out = items.map((it) => ({ ...it, at: Math.max(min, it.want) }));
  for (let i = 1; i < out.length; i++) {
    const prev = out[i - 1];
    out[i].at = Math.max(out[i].at, prev.at + prev.size + gap);
  }
  for (let i = out.length - 1; i >= 0; i--) {
    const lim = i === out.length - 1 ? max - out[i].size : out[i + 1].at - out[i].size - gap;
    if (out[i].at > lim) out[i].at = Math.max(min, lim);
  }
  return out;
}
