/**
 * _fig.ts: the space desk's shared drawing helpers for the figure panel
 * (Lens Phase 6, 2026-09-30; docs/design/LENS.md §3.3, §5.2, §6.4).
 *
 * Every SVG space kind is drawn for the pinned figure panel at W = 470 units
 * (the panel body at 1280, measured), so a 12-unit label prints at 12px, and
 * drawn AGAIN at 290 units for a phone (the component renders itself twice
 * with <Astro.self w={...}>; `.px-sfig__dual` in dataviz-v2.css shows one).
 * So no label shrinks under LENS's floor and no chart scrolls sideways.
 *
 * In-SVG text takes a LITERAL font stack in a style attribute (RD-01b), never
 * var(). A cue numeral inside an SVG sits in a foreignObject that holds the
 * exact `.px-cue-tag` slot core/Section.astro fills (its regex wants
 * `<span class="px-cue-tag" data-cue-tag="id" hidden></span>`, verbatim).
 */

/** The panel body at 1280 (`.px-fig__body`, 470px measured 2026-09-30). */
export const W = 470;

export const SANS = "font-family:'Instrument Sans','Helvetica Neue',Arial,sans-serif;font-variant-numeric:tabular-nums";
export const SERIF = "font-family:'Newsreader',Georgia,'Times New Roman',serif";

/** en-US grouping: the build island's counter tweens en-US, so the static text matches it. */
export const nf = (n: number, dp = 0) =>
  n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });

/** Decimal places an authored number carries (4.8 → 1, 84 → 0). */
export const dpOf = (n: number) => {
  const s = String(n);
  if (/e/i.test(s)) return 0;
  const i = s.indexOf('.');
  return i < 0 ? 0 : Math.min(3, s.length - i - 1);
};

/** A cue numeral's slot inside an SVG, centred on (cx, cy). Room for two numerals. */
export const svgTag = (id: string | number, cx: number, cy: number) =>
  `<foreignObject x="${(cx - 10).toFixed(1)}" y="${(cy - 10).toFixed(1)}" width="52" height="20" style="overflow:visible">` +
  `<div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;height:20px;line-height:1">` +
  `<span class="px-cue-tag" data-cue-tag="${id}" hidden></span></div></foreignObject>`;

/** An empty HTML slot, for an anchor's HTML label. */
export const htmlTag = (id: string | number) => `<span class="px-cue-tag" data-cue-tag="${id}" hidden></span>`;

/** Nice round ticks from 0 to at least `max`. */
export function niceTicks(max: number, target = 4): number[] {
  // the smallest round step that needs at most target + 1 intervals
  const raw = Math.max(max, 1e-9) / (target + 1);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  const out: number[] = [];
  for (let v = 0; v < max + step * 0.999; v += step) out.push(+v.toFixed(10));
  return out;
}

/** Smooth path through points (Catmull-Rom), control points clamped to each
 *  segment's box so the curve never overshoots a point. */
export function smooth(ps: { x: number; y: number }[]): string {
  if (!ps.length) return '';
  let d = `M${ps[0].x.toFixed(1)} ${ps[0].y.toFixed(1)}`;
  for (let i = 0; i < ps.length - 1; i++) {
    const p0 = ps[i - 1] ?? ps[i], p1 = ps[i], p2 = ps[i + 1], p3 = ps[i + 2] ?? p2;
    const cl = (v: number, a: number, b: number) => Math.min(Math.max(v, Math.min(a, b)), Math.max(a, b));
    const c1x = cl(p1.x + (p2.x - p0.x) / 6, p1.x, p2.x), c1y = cl(p1.y + (p2.y - p0.y) / 6, p1.y, p2.y);
    const c2x = cl(p2.x - (p3.x - p1.x) / 6, p1.x, p2.x), c2y = cl(p2.y - (p3.y - p1.y) / 6, p1.y, p2.y);
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Text width estimate for Instrument Sans at `fs` (wide on purpose). */
export const textW = (s: string, fs = 13, bold = false) => {
  let u = 0;
  for (const ch of String(s)) u += /[A-Z0-9#%&@MW]/.test(ch) ? 0.68 : /[ .,:;'|!il()]/.test(ch) ? 0.3 : /[mw]/.test(ch) ? 0.82 : 0.56;
  return u * fs * (bold ? 1.06 : 1);
};

export type Box = { x0: number; y0: number; x1: number; y1: number };
export const hit = (a: Box, b: Box, g = 2) => a.x0 < b.x1 + g && b.x0 < a.x1 + g && a.y0 < b.y1 + g && b.y0 < a.y1 + g;
/** A text box from its anchor point (baseline y). */
export const tbox = (x: number, y: number, w: number, anchor: 'start' | 'middle' | 'end', fs = 13): Box => {
  const x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
  return { x0, y0: y - fs * 0.8, x1: x0 + w, y1: y + fs * 0.25 };
};

/** Wrap a label into lines of at most `max` characters (word boundaries). */
export function wrap(s: string, max: number): string[] {
  const words = String(s).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= max) cur += ' ' + w;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}
