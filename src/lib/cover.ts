/**
 * The cover mark's derivation (Lens Phase 2, `core/CoverMark.astro`).
 *
 * An issue's authored `cover` (Phase 4, LENS §4.2) picks the section when
 * `cover.section` names one of the kinds below; otherwise the cover is
 * DERIVED: the first section whose kind has a compact drawing below is the
 * cover, and its own `data` is what the mark draws. The model also carries
 * the one-line `caption` a desk card prints under the figure. Nothing is invented: every number on
 * a cover is a number the section already carries, and a label is the
 * section's own label clipped to at most three words (LENS §5.5).
 */

import type { Topic } from '../content/config';
import { ink } from './desk-inks';

/** The kinds a cover can draw, in no particular order: the first section of
 *  ANY of these kinds wins. */
export const COVER_KINDS = [
  'data-readout',
  'benchmark-chart',
  'timeline',
  'descent-profile',
  'attrition-waffle',
  'bill-funnel',
  'climate-strip',
  'vote-result',
  'gauge',
  'scaling-plot',
  'power-flow',
] as const;
export type CoverKind = (typeof COVER_KINDS)[number];

interface SectionLike {
  kind: string;
  data?: unknown;
  /** The section's authored caption (the data claim the verifier traces). */
  caption?: string;
}

/** The first sentence of an authored caption, cue markers and emphasis
 *  dropped, when it is short enough to sit on one line under a card figure. */
export function captionLine(raw: unknown, max = 90): string {
  const t = String(raw ?? '').replace(/\[\[\d+\]\]\s*/g, '').replace(/\*\*|\*/g, '').replace(/\s+/g, ' ').trim();
  const first = (t.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? t).replace(/[.]$/, '').trim();
  return first.length && first.length <= max ? first : '';
}

/** The authored cover (LENS §4.2): the section to draw and its one number. */
export interface CoverField {
  section: number;
  number: string;
  label: string;
  headline?: string;
}

const drawable = (s: SectionLike | undefined) => Boolean(s && (COVER_KINDS as readonly string[]).includes(s.kind));

/** The section a cover draws: the authored `cover.section` when it names a
 *  drawable kind, else the issue's first section a cover can draw, or
 *  undefined (the medallion). */
export function coverSection<S extends SectionLike>(sections: S[] | undefined, index?: number): S | undefined {
  const list = sections ?? [];
  if (index != null && drawable(list[index])) return list[index];
  return list.find((s) => drawable(s));
}

/** The authored cover's number and label as one line: the number leads when
 *  the label starts with a unit ("1,330 days since City were charged"),
 *  otherwise it follows ("The station's last year, 2030"). */
export function coverLine(c: Pick<CoverField, 'number' | 'label'>): string {
  const label = c.label.trim();
  if (/^[a-z]/.test(label) && !/^(the|a|an)\s/i.test(label)) return `${c.number} ${label}`;
  return `${label.charAt(0).toUpperCase()}${label.slice(1)}, ${c.number}`;
}

const LEADING = new Set(['if', 'when', 'the', 'a', 'an']);
const ARTICLES = new Set(['the', 'a', 'an']);
const TRAILING = new Set([
  'the', 'a', 'an', 'of', 'in', 'on', 'to', 'by', 'for', 'and', 'or', 'with', 'at', 'from',
  'where', 'it', 'is', 'its', 'but', 'any', 'both', 'than', 'as', 'into', 'per',
]);

/**
 * A label of at most `max` words, from an authored one. Markdown emphasis is
 * dropped; anything after the first comma, colon, parenthesis or middle dot is
 * a qualifier and goes; then leading conditionals and articles, then inner
 * articles, then the tail, which never ends on a preposition or an article.
 *   "Goals conceded, fewest in the league" -> "Goals conceded"
 *   "Days since the charge"                -> "Days since charge"
 *   "Kimi K3 · ECI 158"                    -> "Kimi K3"
 */
export function clipWords(input: unknown, max = 3): string {
  let t = String(input ?? '').replace(/\*\*|\*|_|[→←↑↓]/g, '').replace(/\s+/g, ' ').trim();
  t = t.split(/\s[·•|–—]\s|\s-\s|[,(:;]|[.!?](?:\s|$)/)[0].trim();
  let w = t.split(' ').filter(Boolean);
  while (w.length > max && LEADING.has(w[0].toLowerCase())) w.shift();
  /* Inner articles go only when that makes the WHOLE phrase fit ("Days since
     the charge" -> "Days since charge"); dropping them from a long phrase and
     then cutting it glues unrelated words ("Everything else clubs"). */
  if (w.length > max) {
    const bare = w.filter((x, i) => i === 0 || !ARTICLES.has(x.toLowerCase()));
    if (bare.length <= max) w = bare;
  }
  if (w.length > max) {
    const cut = w;
    w = w.slice(0, max);
    /* Never split a proper noun ("Lok | Sabha"): a capitalised last word whose
       next word is capitalised too goes with it. */
    const cap = (s?: string) => Boolean(s && /^[A-Z]/.test(s));
    if (w.length > 1 && cap(w[w.length - 1]) && cap(cut[max])) w.pop();
    while (w.length > 1 && TRAILING.has(w[w.length - 1].toLowerCase())) w.pop();
  }
  const out = w.join(' ');
  return out.charAt(0).toUpperCase() + out.slice(1);
}

/**
 * Words that fit `maxPx` at `fs` px, dropping whole words from the end (never
 * mid-word, never below one word). The width is an estimate in em per
 * character: Literata runs about 0.56em lower-case, 0.72em in the
 * capitals the labels use once their .06em tracking is added.
 */
export function fitWords(text: string, maxPx: number, fs: number, caps = false): string {
  const em = caps ? 0.72 : 0.56;
  let w = text.split(' ').filter(Boolean);
  while (w.length > 1 && w.join(' ').length * em * fs > maxPx) {
    w = w.slice(0, -1);
    while (w.length > 1 && TRAILING.has(w[w.length - 1].toLowerCase())) w.pop();
  }
  return w.join(' ');
}

/**
 * The words of `text` wrapped into at most `lines` lines of `maxPx` each
 * (the same width estimate as fitWords). What does not fit the last line is
 * dropped by whole words, never cut mid-word.
 */
export function wrapWords(text: string, maxPx: number, fs: number, caps = false, lines = 2): string[] {
  const em = caps ? 0.72 : 0.56;
  const fits = (s: string) => s.length * em * fs <= maxPx;
  const out: string[] = [];
  let line = '';
  for (const word of text.split(' ').filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (fits(next) || !line) { line = next; continue; }
    out.push(line);
    line = word;
    if (out.length === lines) { line = ''; break; }
  }
  if (line && out.length < lines) out.push(line);
  return out.map((l, i) => (i === out.length - 1 ? fitWords(l, maxPx, fs, caps) : l));
}

/** A number as the issue would print it: grouped, and no more decimals than it needs. */
export function fmtNum(v: number): string {
  if (!Number.isFinite(v)) return String(v);
  const a = Math.abs(v);
  /* Small values keep two significant figures (0.004 stays 0.004); larger
     ones keep the one decimal an authored figure usually carries (106.2). */
  if (a > 0 && a < 1) return v.toLocaleString('en-US', { maximumSignificantDigits: 2 });
  const digits = a >= 1000 ? 0 : a >= 10 ? 1 : 2;
  return v.toLocaleString('en-US', { maximumFractionDigits: digits });
}

/** A value with its unit when the unit is short enough to sit beside it
 *  ("£4,400m", "3.7°C", "12%", "4,000/day"). A long unit returns the number
 *  alone; the caller prints the unit once, as the figure's foot. */
export function withUnit(n: string, unit?: unknown): string {
  const u = typeof unit === 'string' ? unit.trim() : '';
  if (!u) return n;
  if (u === '%' || u.startsWith('°') || u.startsWith('/')) return n + u;
  if (/^[£$€₹¥]/.test(u)) {
    /* "£m" seats as "£4,400m"; "₹ crore" seats as "₹1,450" and unitIsLong()
       tells the caller to print the whole unit once, so "crore" is never lost. */
    const rest = u.slice(1).trim();
    return u[0] + n + (rest.length <= 2 && !/\s/.test(rest) ? rest : '');
  }
  if (u.length <= 3) return `${n} ${u}`;
  return n;
}

/** True when `withUnit` could not seat the whole unit beside the number. */
export function unitIsLong(unit?: unknown): boolean {
  const u = typeof unit === 'string' ? unit.trim() : '';
  if (!u) return false;
  if (u === '%' || u.startsWith('°') || u.startsWith('/')) return false;
  if (/^[£$€₹¥]/.test(u)) {
    const rest = u.slice(1).trim();
    return rest.length > 2 || /\s/.test(rest);
  }
  return u.length > 3;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** A timeline date, short: a bare year stays a year; a parseable date becomes
 *  "Oct 2025"; anything else keeps its first two words. */
export function shortDate(raw: unknown): string {
  const s = String(raw ?? '').trim();
  if (/^\d{4}$/.test(s)) return s;
  const t = Date.parse(s);
  if (!Number.isNaN(t)) {
    /* An ISO date parses as UTC; "Feb 2023" or "6 Feb 2023" parses as LOCAL
       time, so read each back in the zone it was parsed in (in IST a local
       1 February is still 31 January in UTC). */
    const d = new Date(t);
    const iso = /^\d{4}-\d{2}(-\d{2})?/.test(s);
    const m = iso ? d.getUTCMonth() : d.getMonth();
    const y = iso ? d.getUTCFullYear() : d.getFullYear();
    return `${MONTHS[m]} ${y}`;
  }
  return s.split(/\s+/).slice(0, 2).join(' ');
}

/** A date's position on a time axis, or NaN when it is not a date. */
export function dateValue(raw: unknown): number {
  const s = String(raw ?? '').trim();
  if (/^\d{4}$/.test(s)) return Date.UTC(Number(s), 0, 1);
  return Date.parse(s);
}

/** A readout value as a number, when it is one ("1,330" -> 1330). */
export function asNumber(v: unknown): number {
  if (typeof v === 'number') return v;
  const s = String(v ?? '').replace(/,/g, '').trim();
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : NaN;
}

/** The drawing box: the width of a cover card in the 3-across grid. */
export const COVER_W = 368;
export const COVER_H = 216;

export interface CoverRect { x: number; y: number; w: number; h: number; fill: string; rx?: number; op?: number }
export interface CoverCircle { cx: number; cy: number; r: number; fill: string; stroke?: string; sw?: number }
export interface CoverPath { d: string; stroke?: string; fill?: string; sw?: number; dash?: string; op?: number; cap?: 'round' | 'butt' }
export interface CoverText { x: number; y: number; t: string; fs: number; fill: string; w?: number; anchor?: 'start' | 'middle' | 'end'; caps?: boolean }
export interface CoverModel {
  /** false: no section could be drawn; show the desk medallion. */
  drawn: boolean;
  rects: CoverRect[];
  circles: CoverCircle[];
  paths: CoverPath[];
  texts: CoverText[];
  /** The figure in words, full labels, for the aria-label. */
  aria: string;
  /** One line under the figure saying what it shows (a desk card's
   *  figcaption, LENS §4.2: no graphic without its caption). Empty when
   *  nothing was drawn (the medallion carries no caption). */
  caption: string;
  /** Draw the desk medallion here too (box units): the compact readout. */
  medallion?: { x: number; y: number; size: number };
}

export interface CoverOptions {
  /** The row thumbnail (120 x 72): no words will print, so every kind keeps
   *  marks heavy enough to read at about 0.3 scale, and no kind is left with
   *  nothing drawn. */
  compact?: boolean;
  /** The issue's authored `cover`: picks the section and supplies the
   *  caption when it is that section's number. */
  cover?: CoverField;
}

/**
 * The cover drawing as primitives on the 368 x 216 box, in CSS colour
 * references (the desk inks by role, the neutrals by name). Pure: no DOM, no
 * Astro, so a script can draw every issue's cover without a server.
 */
export function coverModel(desk: Topic, sections: SectionLike[] | undefined, title: string, opts: CoverOptions = {}): CoverModel {
  type R = CoverRect; type C = CoverCircle; type P = CoverPath; type T = CoverText;
  const compact = Boolean(opts.compact);
  /* A size for the card, and one for the thumbnail, where 1 box unit prints
     at about 0.3px: a 2-unit stroke or a 5-unit dot would vanish. */
  const z = (card: number, thumb: number) => (compact ? thumb : card);
  let medallion: CoverModel['medallion'];
  const MARK = ink(desk, 'mark');
  const TEXT = ink(desk, 'text');
  const INK = 'var(--ink)';
  const INK2 = 'var(--ink-2)';
  const MUTED = 'var(--muted)';
  const PAPER2 = 'var(--paper-2)';
  const HAIR2 = 'var(--hair-2)';

  const f1 = (n: number) => +n.toFixed(1);


  const rects: R[] = [];
  const circles: C[] = [];
  const paths: P[] = [];
  const texts: T[] = [];
  let aria = '';

  const sec = coverSection(sections, opts.cover?.section);
  const d: any = sec?.data ?? {};
  let drawn = false;
  let caption = '';
  /* A label lower-cased to sit mid-sentence, unless its first word reads as
     a name: "Days since the charge" -> "days since the charge", while
     "Manchester City" and "Lok Sabha" keep their capitals. */
  const lc = (t: unknown) => {
    const x = String(t ?? '').replace(/\*\*|\*/g, '').trim();
    const [w1, w2] = x.split(/\s+/);
    const name = /^[A-Z]{2,}/.test(w1 ?? '') || Boolean(w2 && /^[A-Z]/.test(w2));
    return name ? x : x.charAt(0).toLowerCase() + x.slice(1);
  };

  /* ── bars: two to four labelled rows, a value on the right, a track behind.
     Two rows take the Home board's geometry exactly. `centre` draws a funnel. */
  function bars(
    rows: { label: string; value: number; display: string; emph: boolean }[],
    foot?: string,
    centre = false,
  ) {
    const n = rows.length;
    const max = Math.max(...rows.map((r) => Math.abs(r.value)));
    if (!n || !(max > 0)) return false;
    if (compact) {
      const step = 160 / n;
      const bh = Math.min(44, step * 0.62);
      rows.forEach((r, i) => {
        const by = f1(28 + i * step + (step - bh) / 2);
        const w = Math.max(8, (320 * Math.abs(r.value)) / max);
        const x = centre ? 24 + (320 - w) / 2 : 24;
        if (!centre && w < 320) rects.push({ x: 24, y: by, w: 320, h: f1(bh), fill: PAPER2, rx: 4 });
        rects.push({ x: f1(x), y: by, w: f1(w), h: f1(bh), fill: r.emph ? MARK : INK2, rx: 4 });
      });
      return true;
    }
    const two = n <= 2;
    const step = two ? 70 : (foot ? 150 : 164) / n;
    const top = two ? 58 : 40;
    const bh = two ? 22 : 14;
    rows.forEach((r, i) => {
      const ly = f1(top + i * step);
      const by = ly + (two ? 10 : 8);
      const w = Math.max(2, (320 * Math.abs(r.value)) / max);
      const x = centre ? 24 + (320 - w) / 2 : 24;
      const valueText = r.display;
      const labelMax = 320 - valueText.length * 0.62 * 13 - 16;
      texts.push({ x: 24, y: ly, t: fitWords(clipWords(r.label), labelMax, 13), fs: 13, fill: INK2 });
      texts.push({ x: 344, y: ly, t: valueText, fs: 13, w: 600, fill: r.emph ? TEXT : INK, anchor: 'end' });
      if (!centre && w < 320) rects.push({ x: 24, y: by, w: 320, h: bh, fill: PAPER2, rx: 2 });
      rects.push({ x: f1(x), y: by, w: f1(w), h: bh, fill: r.emph ? MARK : INK2, rx: 2 });
    });
    if (foot) texts.push({ x: 24, y: two ? 194 : 204, t: foot, fs: 13, fill: MUTED });
    return true;
  }

  /* ── two numbers, left in the desk text, right in ink (the Desk board). */
  function statPair(a: { value: string; label: string }, b?: { value: string; label: string }) {
    const size = (s: string) => Math.max(20, Math.min(40, Math.floor(150 / (0.6 * Math.max(1, s.length)))));
    const put = (s: { value: string; label: string }, x: number, anchor: 'start' | 'end', key: boolean) => {
      texts.push({ x, y: 110, t: s.value, fs: size(s.value), w: 600, fill: key ? TEXT : INK, anchor });
      /* The label wraps to two lines in its half of the panel rather than
         losing words: "DAYS SINCE / CHARGE". */
      wrapWords(clipWords(s.label).toUpperCase(), 148, 13, true).forEach((ln, i) => {
        texts.push({ x, y: 136 + i * 17, t: ln, fs: 13, w: 500, fill: key ? TEXT : MUTED, anchor, caps: true });
      });
    };
    put(a, 24, 'start', true);
    if (b) put(b, 344, 'end', false);
    return true;
  }

  switch (sec?.kind) {
    case 'benchmark-chart': {
      const items: any[] = (d.items ?? []).filter((i: any) => Number.isFinite(Number(i?.value)));
      if (!items.length) break;
      const subj = items.find((i) => i.highlight) ?? items[0];
      const rivals = items.filter((i) => i !== subj).map((i) => ({ label: i.label, value: Number(i.value) }));
      if (Number.isFinite(Number(d.refValue))) rivals.push({ label: d.refLabel ?? 'Reference', value: Number(d.refValue) });
      const rival = rivals.sort((a, b) => b.value - a.value)[0];
      const show = (v: number) => withUnit(fmtNum(v), d.unit);
      const rows = [{ label: subj.label, value: Number(subj.value), display: show(Number(subj.value)), emph: true }];
      if (rival) rows.push({ label: rival.label, value: rival.value, display: show(rival.value), emph: false });
      drawn = bars(rows, unitIsLong(d.unit) ? clipWords(d.unit) : undefined);
      aria = rows.map((r) => `${r.label}: ${r.display}`).join('. ') + (unitIsLong(d.unit) ? ` (${d.unit})` : '');
      caption = rival
        ? `${clipWords(subj.label)} ${show(Number(subj.value))}, against ${clipWords(rival.label)} ${show(rival.value)}`
        : `${clipWords(subj.label)} ${show(Number(subj.value))}`;
      break;
    }
    case 'data-readout': {
      const tiles: any[] = d.tiles ?? [];
      if (!tiles.length) break;
      const key = tiles.find((t) => t.emphasis === 'key') ?? tiles[0];
      const other = tiles.find((t) => t !== key);
      const val = (t: any) => withUnit(String(t.value ?? ''), t.unit);
      aria = [key, other].filter(Boolean).map((t: any) => `${t.label}: ${val(t)}`).join('. ');
      caption = `${val(key)} ${lc(key.label)}`;
      if (compact) {
        /* Two tiles in the same unit race as two bars, scaled to the larger.
           Otherwise the key value is one bar on a hair baseline, beside the
           desk medallion: tiles in different units are never set against
           each other. */
        const unit = (t: any) => (typeof t?.unit === 'string' ? t.unit.trim() : '');
        const kv = asNumber(key.value), ov = asNumber(other?.value);
        if (other && unit(key) && unit(key) === unit(other) && kv >= 0 && ov >= 0 && Math.max(kv, ov) > 0) {
          drawn = bars([
            { label: key.label ?? '', value: kv, display: '', emph: true },
            { label: other.label ?? '', value: ov, display: '', emph: false },
          ]);
        } else {
          medallion = { x: 24, y: 40, size: 136 };
          rects.push({ x: 184, y: 84, w: 160, h: 40, fill: MARK, rx: 4 });
          paths.push({ d: 'M184 136 H344', stroke: HAIR2, sw: 4 });
          drawn = true;
        }
        break;
      }
      drawn = statPair(
        { value: val(key), label: key.label ?? '' },
        other ? { value: val(other), label: other.label ?? '' } : undefined,
      );
      break;
    }
    case 'timeline': {
      const ev: any[] = d.events ?? [];
      if (ev.length < 2) break;
      const ts = ev.map((e) => dateValue(e.date));
      const t0 = Math.min(...ts), t1 = Math.max(...ts);
      const timed = ts.every((t) => Number.isFinite(t)) && t1 > t0;
      /* Placed by date when the dates allow it; in order, evenly, when they
         do not parse, or when two events would sit closer than a dot's width
         (a cluster of discs reads as one blot). Only the end dates are
         printed, so an even axis claims nothing about the gaps between. */
      const byDate = ev.map((_, i) => 40 + ((ts[i] - t0) / (t1 - t0)) * 288);
      const sorted = [...byDate].sort((a, b) => a - b);
      const clustered = sorted.some((x, i) => i > 0 && x - sorted[i - 1] < z(16, 44));
      const xs = ev.map((_, i) => f1(timed && !clustered ? byDate[i] : 40 + (i * 288) / (ev.length - 1)));
      /* A dotted axis on the card; a solid one on the thumbnail, where a
         dotted hair prints as nothing and the events read as loose dots. */
      paths.push(compact
        ? { d: 'M24 108 H344', stroke: INK2, sw: 6, cap: 'round' }
        : { d: 'M24 108 H344', stroke: INK2, sw: 2, dash: '0.1 6', cap: 'round' });
      ev.forEach((e, i) => {
        const hot = e.state === 'key' || e.state === 'now';
        circles.push({
          cx: xs[i], cy: 108, r: e.state === 'now' ? z(8, 24) : z(6, 18),
          fill: hot ? MARK : e.state === 'fail' ? INK2 : PAPER2,
          stroke: hot || e.state === 'fail' ? undefined : MARK, sw: z(2, 7),
        });
      });
      const picks = [0, ev.length - 1];
      const keyI = ev.findIndex((e, i) => (e.state === 'key' || e.state === 'now') && !picks.includes(i)
        && picks.every((p) => Math.abs(xs[p] - xs[i]) >= 120));
      if (keyI >= 0) picks.push(keyI);
      for (const i of picks) {
        const anchor = xs[i] < 90 ? 'start' : xs[i] > 278 ? 'end' : 'middle';
        const x = anchor === 'start' ? xs[i] - 6 : anchor === 'end' ? xs[i] + 6 : xs[i];
        texts.push({ x, y: 84, t: shortDate(ev[i].date), fs: 13, w: 600, fill: TEXT, anchor });
        texts.push({ x, y: 138, t: fitWords(clipWords(ev[i].label), 112, 13), fs: 13, fill: INK, anchor });
      }
      drawn = true;
      aria = ev.map((x) => `${shortDate(x.date)}: ${String(x.label ?? '').replace(/\*/g, '')}`).join('. ');
      caption = `${ev.length} dated events, ${shortDate(ev[0].date)} to ${shortDate(ev[ev.length - 1].date)}`;
      break;
    }
    case 'descent-profile': {
      const pts: any[] = (d.points ?? []).filter((p: any) => Number.isFinite(p?.t) && Number.isFinite(p?.altKm));
      if (pts.length < 2) break;
      const tMin = Math.min(...pts.map((p) => p.t)), tMax = Math.max(...pts.map((p) => p.t));
      const aMin = Math.min(...pts.map((p) => p.altKm)), aMax = Math.max(...pts.map((p) => p.altKm));
      const X = (t: number) => f1(96 + (tMax > tMin ? (t - tMin) / (tMax - tMin) : 0.5) * 228);
      const Y = (a: number) => f1(aMax > aMin ? 40 + ((aMax - a) / (aMax - aMin)) * 120 : 100);
      const altAt = (t: number) => {
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i - 1], q = pts[i];
          if (t >= p.t && t <= q.t) return q.t === p.t ? q.altKm : p.altKm + ((t - p.t) / (q.t - p.t)) * (q.altKm - p.altKm);
        }
        return NaN;
      };
      paths.push({ d: 'M0 216 V200 Q184 180 368 200 V216 Z', fill: MARK, op: 0.22 });
      const alts = [pts[0].altKm, pts[pts.length - 1].altKm, ...(d.events ?? []).map((e: any) => altAt(e.t))]
        .filter((a) => Number.isFinite(a));
      const guides: number[] = [];
      for (const a of [...new Set(alts.map((a) => Math.round(a)))].sort((p, q) => q - p)) {
        if (guides.length < 3 && guides.every((g) => Math.abs(Y(g) - Y(a)) >= 18)) guides.push(a);
      }
      for (const a of guides) {
        paths.push({ d: `M84 ${Y(a)} H344`, stroke: TEXT, sw: z(1, 3), dash: z(1, 0) ? '3 4' : '10 12', op: 0.3 });
        texts.push({ x: 24, y: Y(a) + 4, t: `${fmtNum(a)} km`, fs: 13, w: 600, fill: TEXT });
      }
      paths.push({ d: 'M' + pts.map((p) => `${X(p.t)} ${Y(p.altKm)}`).join(' L'), stroke: MARK, sw: z(2.5, 10), cap: 'round' });
      const evs: any[] = (d.events ?? []).filter((e: any) => Number.isFinite(altAt(e.t)));
      evs.forEach((e, i) => circles.push({ cx: X(e.t), cy: Y(altAt(e.t)), r: i === evs.length - 1 ? z(6, 20) : z(5, 15), fill: i === evs.length - 1 ? TEXT : MARK }));
      drawn = true;
      caption = `Altitude falls from ${fmtNum(pts[0].altKm)} km to ${fmtNum(pts[pts.length - 1].altKm)} km`;
      aria = caption
        + (evs.length ? `. ${evs.map((e) => String(e.label ?? '')).join('. ')}` : '');
      break;
    }
    case 'attrition-waffle': {
      const groups: any[] = (d.groups ?? []).filter((g: any) => Number(g?.count) > 0);
      const total = groups.reduce((s, g) => s + Number(g.count), 0);
      if (!groups.length || !(total > 0)) break;
      /* Largest remainder: the cells add up to exactly 100. */
      const raw = groups.map((g) => (Number(g.count) / total) * 100);
      const cells = raw.map(Math.floor);
      let left = 100 - cells.reduce((s, c) => s + c, 0);
      raw.map((r, i) => [r - Math.floor(r), i] as const).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { cells[i] += 1; left -= 1; } });
      const colours = groups.length === 2 ? [MARK, PAPER2] : [MARK, INK2, HAIR2, PAPER2, MUTED];
      let k = 0;
      groups.forEach((_, gi) => {
        for (let c = 0; c < cells[gi]; c++, k++) {
          rects.push({ x: z(24, 95) + (k % 10) * 18, y: 20 + Math.floor(k / 10) * 18, w: 14, h: 14, fill: colours[gi % colours.length] });
        }
      });
      groups.slice(0, 2).forEach((g, gi) => {
        texts.push({ x: 226, y: 78 + gi * 72, t: String(cells[gi]), fs: 40, w: 600, fill: gi === 0 ? TEXT : INK2 });
        texts.push({ x: 226, y: 100 + gi * 72, t: fitWords(clipWords(g.label), 118, 13), fs: 13, fill: INK2 });
      });
      drawn = true;
      aria = `Of every 100: ${groups.map((g, i) => `${cells[i]} ${g.label}`).join(', ')}`;
      caption = `${cells[0]} of every 100 ${lc(clipWords(groups[0].label, 4))}`;
      break;
    }
    case 'bill-funnel': {
      let stages: any[] = (d.stages ?? []).filter((s: any) => Number.isFinite(Number(s?.count)));
      if (stages.length < 2) break;
      if (stages.length > 4) stages = [...stages.slice(0, 3), stages[stages.length - 1]];
      const rows = stages.map((s, i) => ({
        label: s.label, value: Number(s.count), display: fmtNum(Number(s.count)), emph: i === stages.length - 1,
      }));
      drawn = bars(rows, stages.length <= 3 && d.unit ? clipWords(d.unit) : undefined, true);
      aria = rows.map((r) => `${r.label}: ${r.display}`).join('. ');
      caption = `${rows[0].display} ${lc(clipWords(rows[0].label))}, ${rows[rows.length - 1].display} ${lc(clipWords(rows[rows.length - 1].label))}`;
      break;
    }
    case 'climate-strip': {
      const vals: any[] = (d.values ?? []).filter((v: any) => Number.isFinite(Number(v?.value)));
      if (vals.length < 3) break;
      const nums = vals.map((v) => Number(v.value));
      const lo = Number.isFinite(d.customMin) ? d.customMin : Math.min(...nums);
      const hi = Number.isFinite(d.customMax) ? d.customMax : Math.max(...nums);
      const sw = 320 / vals.length;
      vals.forEach((v, i) => {
        const t = hi > lo ? Math.min(1, Math.max(0, (Number(v.value) - lo) / (hi - lo))) : 0.5;
        rects.push({ x: f1(24 + i * sw), y: 52, w: f1(sw + 0.4), h: 112, fill: MARK, op: +(0.08 + 0.92 * t).toFixed(3) });
      });
      texts.push({ x: 24, y: 188, t: String(vals[0].year), fs: 13, fill: MUTED });
      texts.push({ x: 344, y: 188, t: String(vals[vals.length - 1].year), fs: 13, w: 600, fill: TEXT, anchor: 'end' });
      texts.push({ x: 184, y: 188, t: 'Darker is higher', fs: 13, fill: MUTED, anchor: 'middle' });
      drawn = true;
      aria = `One stripe a year, ${vals[0].year} to ${vals[vals.length - 1].year}, darker for a higher value`;
      caption = `One stripe a year, ${vals[0].year} to ${vals[vals.length - 1].year}`;
      break;
    }
    case 'vote-result': {
      const yes = Number(d.for), no = Number(d.against);
      const present = Number.isFinite(Number(d.present)) ? Number(d.present) : yes + no;
      const need = Number(d.required);
      if (!(present > 0) || !Number.isFinite(yes)) break;
      const D = Math.min(Math.round(present), 120);
      const radii = [56, 74, 92, 110, 128];
      const sumR = radii.reduce((s, r) => s + r, 0);
      const seats: { a: number; x: number; y: number }[] = [];
      radii.forEach((r, ri) => {
        const n = ri === radii.length - 1
          ? D - seats.length
          : Math.round((D * r) / sumR);
        for (let j = 0; j < n; j++) {
          const a = Math.PI - (n === 1 ? Math.PI / 2 : (j * Math.PI) / (n - 1));
          seats.push({ a, x: f1(184 + r * Math.cos(a)), y: f1(172 - r * Math.sin(a)) });
        }
      });
      seats.sort((p, q) => q.a - p.a);
      const yesD = Math.round((yes / present) * D);
      const noD = Number.isFinite(no) ? Math.round((no / present) * D) : 0;
      seats.forEach((s, i) => circles.push({ cx: s.x, cy: s.y, r: z(4, 6), fill: i < yesD ? MARK : i < yesD + noD ? INK2 : HAIR2 }));
      if (Number.isFinite(need) && need > 0 && need <= present) {
        const a = Math.PI - (need / present) * Math.PI;
        paths.push({ d: `M${f1(184 + 44 * Math.cos(a))} ${f1(172 - 44 * Math.sin(a))} L${f1(184 + 140 * Math.cos(a))} ${f1(172 - 140 * Math.sin(a))}`, stroke: INK, sw: z(1.5, 5) });
        texts.push({ x: 344, y: 204, t: `Needed ${fmtNum(need)}`, fs: 13, fill: INK2, anchor: 'end' });
      }
      texts.push({ x: 24, y: 204, t: `For ${fmtNum(yes)}`, fs: 13, w: 600, fill: TEXT });
      drawn = true;
      aria = `${fmtNum(yes)} for${Number.isFinite(no) ? `, ${fmtNum(no)} against` : ''}, ${fmtNum(present)} present${Number.isFinite(need) ? `, ${fmtNum(need)} needed` : ''}`;
      caption = aria;
      break;
    }
    case 'gauge': {
      const cx = 184, cy = 168, r = 112;
      const pt = (frac: number) => {
        const a = Math.PI - frac * Math.PI;
        return `${f1(cx + r * Math.cos(a))} ${f1(cy - r * Math.sin(a))}`;
      };
      const arc = (a: number, b: number) => `M${pt(a)} A${r} ${r} 0 0 1 ${pt(b)}`;
      paths.push({ d: arc(0, 1), stroke: PAPER2, sw: z(16, 36), cap: 'butt' });
      const budget = d.variant === 'budget' || (d.variant == null && d.remaining != null);
      const capacity = d.variant === 'capacity' || (d.variant == null && !budget && d.max != null);
      if (budget) {
        const rem = Math.min(1, Math.max(0, Number(d.remaining)));
        if (!Number.isFinite(rem)) break;
        if (rem < 1) paths.push({ d: arc(0, 1 - rem), stroke: MARK, sw: z(16, 36), cap: 'butt' });
        texts.push({ x: cx, y: 146, t: `${Math.round(rem * 100)}%`, fs: 40, w: 600, fill: TEXT, anchor: 'middle' });
        texts.push({ x: cx, y: 168, t: 'REMAINING', fs: 13, w: 500, fill: MUTED, anchor: 'middle', caps: true });
        aria = `${Math.round(rem * 100)}% remaining; the filled arc is the share used`;
      } else if (capacity) {
        const v = Number(d.value), max = Number(d.max);
        if (!(max > 0) || !Number.isFinite(v)) break;
        const frac = Math.min(1, Math.max(0, v / max));
        if (frac > 0) paths.push({ d: arc(0, frac), stroke: MARK, sw: z(16, 36), cap: 'butt' });
        const shown = withUnit(fmtNum(v), d.unit);
        texts.push({ x: cx, y: 146, t: shown, fs: 40, w: 600, fill: TEXT, anchor: 'middle' });
        texts.push({ x: cx, y: 168, t: fitWords(clipWords(d.label ?? `of ${fmtNum(max)}`).toUpperCase(), 180, 13, true), fs: 13, w: 500, fill: MUTED, anchor: 'middle', caps: true });
        aria = `${shown} of ${fmtNum(max)}${d.label ? `, ${d.label}` : ''}`;
      } else {
        const v = Math.min(100, Math.max(-100, Number(d.value)));
        if (!Number.isFinite(v)) break;
        const a = Math.PI / 2 - (v / 100) * (82 * Math.PI / 180);
        paths.push({ d: `M${cx} ${cy} L${f1(cx + 100 * Math.cos(a))} ${f1(cy - 100 * Math.sin(a))}`, stroke: INK, sw: z(2.5, 10), cap: 'round' });
        circles.push({ cx, cy, r: z(6, 16), fill: INK });
        texts.push({ x: 72, y: 194, t: fitWords(clipWords(d.leftLabel ?? 'Left'), 100, 13), fs: 13, fill: INK2, anchor: 'middle' });
        texts.push({ x: 296, y: 194, t: fitWords(clipWords(d.rightLabel ?? 'Right'), 100, 13), fs: 13, fill: INK2, anchor: 'middle' });
        aria = `A lean of ${v} between ${d.leftLabel ?? 'left'} and ${d.rightLabel ?? 'right'}`;
      }
      drawn = true;
      caption = aria.split(';')[0];
      break;
    }
    case 'scaling-plot': {
      const pts: any[] = (d.points ?? []).filter((p: any) => Number.isFinite(Number(p?.x)) && Number.isFinite(Number(p?.y)));
      if (pts.length < 2) break;
      const tx = (v: number) => (d.logX ? Math.log10(Math.max(v, 1e-12)) : v);
      const ty = (v: number) => (d.logY ? Math.log10(Math.max(v, 1e-12)) : v);
      const xs = pts.map((p) => tx(Number(p.x))), ys = pts.map((p) => ty(Number(p.y)));
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const X = (v: number) => f1(84 + (x1 > x0 ? (v - x0) / (x1 - x0) : 0.5) * 240);
      const Y = (v: number) => f1(152 - (y1 > y0 ? (v - y0) / (y1 - y0) : 0.5) * 100);
      paths.push({ d: 'M64 36 V172 H344', stroke: z(1, 0) ? HAIR2 : INK2, sw: z(1, 5), op: z(1, 0) ? undefined : 0.5 });
      const hiI = ys.indexOf(y1), loI = ys.indexOf(y0);
      pts.forEach((_, i) => circles.push({ cx: X(xs[i]), cy: Y(ys[i]), r: i === hiI ? z(6, 20) : z(5, 16), fill: i === hiI ? TEXT : MARK }));
      for (const i of [...new Set([loI, hiI])]) {
        const lbl = pts[i].label ? fitWords(clipWords(pts[i].label), 150, 13) : withUnit(fmtNum(Number(pts[i].y)), undefined);
        const right = X(xs[i]) > 220;
        texts.push({ x: right ? X(xs[i]) - 12 : X(xs[i]) + 12, y: Y(ys[i]) + 4, t: lbl, fs: 13, w: i === hiI ? 600 : 400, fill: i === hiI ? TEXT : INK2, anchor: right ? 'end' : 'start' });
      }
      if (d.yLabel) texts.push({ x: 64, y: 24, t: fitWords(clipWords(d.yLabel), 200, 13), fs: 13, fill: MUTED });
      const logNote = d.logX || d.logY ? `${d.logX && d.logY ? 'Both axes' : d.logY ? 'Vertical' : 'Horizontal'} log scale` : '';
      if (d.xLabel) texts.push({ x: 344, y: 192, t: fitWords(clipWords(String(d.xLabel).replace(/[→←]/g, '')), 150, 13), fs: 13, fill: MUTED, anchor: 'end' });
      if (logNote) texts.push({ x: 64, y: 192, t: logNote, fs: 13, fill: MUTED });
      drawn = true;
      aria = pts.map((p) => `${p.label ?? ''} ${fmtNum(Number(p.y))}`.trim()).join('. ') + (logNote ? `. ${logNote}` : '');
      caption = `${pts.length} points${d.yLabel ? `, ${lc(clipWords(d.yLabel, 4))}` : ''}${logNote ? `, ${logNote.toLowerCase()}` : ''}`;
      break;
    }
    case 'power-flow': {
      const nodes: any[] = d.nodes ?? [];
      const links: any[] = (d.links ?? []).filter((l: any) => Number(l?.value) > 0);
      if (!links.length) break;
      const byId = new Map(nodes.map((n) => [n.id, n]));
      const via = new Set(nodes.filter((n) => n.group === 'via').map((n) => n.id));
      let out = links.filter((l) => via.has(l.from));
      if (!out.length) out = links.filter((l) => byId.get(l.to)?.group === 'sink');
      if (!out.length) out = links;
      const agg = new Map<string, number>();
      for (const l of out) agg.set(l.to, (agg.get(l.to) ?? 0) + Number(l.value));
      const top = [...agg.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
      const rows = top.map(([id, v], i) => ({
        label: byId.get(id)?.label ?? id, value: v, display: withUnit(fmtNum(v), d.unit), emph: i === 0,
      }));
      const foot = unitIsLong(d.unit) ? `Where it goes · ${clipWords(d.unit)}` : 'Where it goes';
      drawn = bars(rows, foot);
      aria = `Where it goes: ${rows.map((r) => `${r.label} ${r.display}`).join(', ')}${unitIsLong(d.unit) ? ` (${d.unit})` : ''}`;
      caption = `The largest share goes to ${clipWords(rows[0].label)}, ${rows[0].display}`;
      break;
    }
  }

  if (drawn && !aria) aria = title.replace(/\*/g, '');
  /* The authored cover's own line wins when it names the section drawn. */
  /* The section's own authored caption wins over the derived line when its
     first sentence fits; the authored cover's line wins over both when it
     names the section drawn and its number is one that section carries. */
  const authored = captionLine(sec?.caption);
  if (authored) caption = authored;
  if (drawn && opts.cover && sec === (sections ?? [])[opts.cover.section]
    && JSON.stringify(sec?.data ?? {}).includes(opts.cover.number)) caption = coverLine(opts.cover);
  if (!drawn) caption = '';
  return { drawn, rects, circles, paths, texts: compact ? [] : texts, aria, caption: caption.replace(/\s+/g, ' ').trim(), medallion };
}
