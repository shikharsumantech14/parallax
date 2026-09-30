/**
 * The stage's scene, as data (Lens Phase 4, LENS §8; the Home and Desk
 * boards). Pure: no DOM, no Astro, so a script or a test can build any
 * issue's stage without a server. `components/stage/StageScene.astro` draws
 * what this returns; `core/Stage.astro` is the plate it sits on.
 *
 * A stage is one issue told as a picture: the cover number set at 160, a
 * drawn figure, a ladder of at most three rows, then the headline. Which
 * figure depends on what the issue carries, never on its desk:
 *
 *   spiral  a running clock. The issue has a timeline with a dated anchor
 *           (its `key` event) and a dated `now` event after it, and its cover
 *           section is that timeline or a readout (the number the clock
 *           counts). One turn is one year from the anchor; the events between
 *           sit on the spiral; a closed case found in a latency-waterfall is
 *           the short arc on the inner ring. (The Home board, No 17.)
 *   orbit   a descent. The cover section is a descent-profile: its altitudes
 *           become rings over a planet's edge, squeezed (heights not to
 *           scale), and the line spirals down through them. (The Desk board,
 *           No 14.)
 *   bars    a readout. The cover section is a data-readout: its numeric
 *           tiles drawn as bars against the largest, the key tile in the mark.
 *   cover   anything else: the issue's cover mark on a tint panel, beside
 *           the number when there is one.
 *
 * Every number and label is the issue's own, clipped to at most three words
 * (LENS §5.5). Nothing is invented.
 */
import type { Topic } from '../content/config';
import { asNumber, clipWords, coverSection, dateValue, fmtNum, shortDate, type CoverField } from './cover';

const DAY = 86_400_000;
const YEAR = 365.25 * DAY;
const f1 = (n: number) => +n.toFixed(1);
const plain = (t: unknown) => String(t ?? '').replace(/\*\*|\*/g, '').trim();

interface SectionLike { kind: string; data?: any; caption?: string }
export interface StageIssue {
  topic: Topic;
  title: string;
  sections: SectionLike[];
  cover?: CoverField;
}

export interface LadderRow {
  /** The large value ("113 days", "415 km"). */
  value: string;
  /** Who or what, in capitals (≤ 3 words). */
  name: string;
  /** The second line ("Closed", "Mar 2026"); optional. */
  note?: string;
  /** The open / key row, in the desk's hi colour. */
  hot?: boolean;
  /** Altitude rows sit by value on the orbit scene (0 top .. 1 bottom). */
  at?: number;
}

export interface SpiralMark { x: number; y: number; who: string; what: string; tx: number; ty: number; anchor: 'start' | 'end' }
export interface SpiralGeo {
  w: number; h: number; vx: number; vy: number;
  cx: number; cy: number;
  fs: number; yfs: number;
  guides: { r: number; label: string; ly: number }[];
  d: string;
  start: { x: number; y: number };
  head: { x: number; y: number };
  today: { x: number; y: number; date: string };
  marks: SpiralMark[];
  inner?: { d: string; label: string; lx: number; ly: number };
  aria: string;
}

export interface OrbitGeo {
  w: number; h: number;
  earth: { cx: number; cy: number; r: number };
  rings: { r: number; style: 'solid' | 'dash' | 'dot' }[];
  d: string;
  marks: { x: number; y: number; alt: string; last: boolean; lx: number; ly: number }[];
  aria: string;
}

export interface BarRow { label: string; value: string; frac: number; key: boolean }

export interface StageModel {
  scene: 'spiral' | 'orbit' | 'bars' | 'cover';
  /** The number set at 160 / 88, with the label under it. */
  counter?: { text: string; to: number; label: string };
  headline: string;
  ladder: LadderRow[];
  spiral?: { desktop: SpiralGeo; phone: SpiralGeo };
  orbit?: { desktop: OrbitGeo; phone: OrbitGeo };
  bars?: BarRow[];
  /** A foot line for the figure ("One turn, one year", "Heights not to scale"). */
  foot?: string;
}

// ── words ────────────────────────────────────────────────────────────────────

const ARTICLE = /^(the|a|an)$/i;
/** The event's subject: its leading capitalised words, at most two
 *  ("Manchester City charged" -> "Manchester City", "City, still …" -> "City"). */
export function subjectOf(label: unknown): string {
  const words = plain(label).split(/[,:;]/)[0].split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const w of words) {
    if (!/^[A-Z]/.test(w) || out.length === 2) break;
    out.push(w);
  }
  if (!out.length || ARTICLE.test(out[0])) return clipWords(label, 3);
  return out.join(' ');
}
const IRREGULAR: Record<string, string> = {
  lose: 'Lost', win: 'Won', fall: 'Fell', rise: 'Rose', leave: 'Left', take: 'Took', get: 'Got', make: 'Made', pay: 'Paid', sell: 'Sold', buy: 'Bought',
};
/** "settle" -> "Settled" (the ladder's value for an event with no number). */
function pastTense(verb: string): string {
  const v = verb.toLowerCase();
  if (IRREGULAR[v]) return IRREGULAR[v];
  const p = v.endsWith('e') ? `${v}d` : `${v}ed`;
  return p.charAt(0).toUpperCase() + p.slice(1);
}
/** What happened to the subject, in at most two words: a points change keeps
 *  its sign ("Everton lose 10 points" -> "−10"), otherwise the verb in the
 *  present ("Chelsea settle instead" -> "settles"). */
function deltaOf(label: unknown, who: string): { what: string; verb: string } {
  const rest = plain(label).slice(who.length).replace(/^[\s,:;·•|–-]+/, '');
  const down = rest.match(/\b(?:lose|loses|lost)\s+(\d[\d,.]*)/i);
  if (down) return { what: `−${down[1]}`, verb: 'lose' };
  const up = rest.match(/\b(?:gain|gains|win|wins|won)\s+(\d[\d,.]*)/i);
  if (up) return { what: `+${up[1]}`, verb: 'gain' };
  const verb = rest.split(/\s+/)[0] ?? '';
  if (!/^[a-z]+$/.test(verb)) return { what: '', verb: '' };
  return { what: /s$/i.test(verb) ? verb.toLowerCase() : `${verb.toLowerCase()}s`, verb };
}

// ── the counter ──────────────────────────────────────────────────────────────

function counterFrom(issue: StageIssue): StageModel['counter'] {
  const c = issue.cover;
  if (c) {
    const to = asNumber(c.number);
    const label = c.label.charAt(0).toUpperCase() + c.label.slice(1);
    return { text: c.number, to: Number.isFinite(to) ? to : NaN, label };
  }
  const sec = coverSection(issue.sections);
  const tiles: any[] = sec?.kind === 'data-readout' ? sec.data?.tiles ?? [] : [];
  const key = tiles.find((t) => t.emphasis === 'key') ?? tiles[0];
  if (key && String(key.value ?? '').length <= 7) {
    return { text: String(key.value), to: asNumber(key.value), label: clipWords(key.label, 5) };
  }
  return undefined;
}

// ── spiral ───────────────────────────────────────────────────────────────────

interface SpiralFrame { w: number; h: number; vx: number; vy: number; cx: number; cy: number; r0: number; step: number; fs: number; yfs: number; phone: boolean }
const SPIRAL_DESKTOP: SpiralFrame = { w: 540, h: 460, vx: 60, vy: 300, cx: 330, cy: 530, r0: 50, step: 46, fs: 15, yfs: 12, phone: false };
/* Phone type is set a notch above the board's (13 and 12) because the 350
   box prints at 320 to 335px on a 360 to 375 phone: 14 and 13.5 land at 12px
   or more (LENS §3.4). */
const SPIRAL_PHONE: SpiralFrame = { w: 350, h: 316, vx: 0, vy: 0, cx: 190, cy: 158, r0: 35, step: 31.5, fs: 14, yfs: 13.5, phone: true };

function spiralGeo(fr: SpiralFrame, t0: number, t1: number, anchorYear: number, events: { t: number; who: string; what: string }[], closed?: { days: number; unit: string }, nowDate?: string): SpiralGeo {
  const T = (t1 - t0) / YEAR;
  /* The spiral must fit its frame: a longer clock tightens the turns. */
  const step = Math.min(fr.step, ((fr.phone ? 118 : 168) / Math.max(T, 1)));
  const at = (turns: number) => {
    const r = fr.r0 + step * turns;
    const a = turns * 2 * Math.PI;
    return { x: f1(fr.cx + r * Math.sin(a)), y: f1(fr.cy - r * Math.cos(a)) };
  };
  const pts: string[] = [];
  const n = Math.max(2, Math.ceil(T * 180));
  for (let i = 0; i <= n; i++) {
    const p = at((T * i) / n);
    pts.push(`${p.x} ${p.y}`);
  }
  const guides = [];
  for (let k = 0; k <= Math.floor(T); k++) {
    const r = fr.r0 + step * k;
    guides.push({ r: f1(r), label: String(anchorYear + k), ly: f1(fr.cy - r - (fr.phone ? 6 : 6)) });
  }
  const est = (s: string, fs: number) => s.length * fs * 0.56;
  const marks: SpiralMark[] = events.map((e) => {
    const p = at((e.t - t0) / YEAR);
    const text = `${e.who} ${e.what}`.trim();
    let anchor: 'start' | 'end' = p.x < fr.cx ? 'end' : 'start';
    let tx = anchor === 'end' ? p.x - 10 : p.x + 10;
    let ty = p.y - 6;
    /* A label that would leave the frame on the right turns back, and lifts
       clear of the line (the Home-Phone board's Chelsea). */
    if (anchor === 'start' && fr.vx + fr.w - (tx + est(text, fr.fs)) < 4) {
      anchor = 'end'; tx = fr.vx + fr.w - 4; ty = p.y - 14;
    }
    return { x: p.x, y: p.y, who: e.who, what: e.what, tx: f1(tx), ty: f1(ty), anchor };
  });
  const head = at(T);
  let inner: SpiralGeo['inner'];
  if (closed && closed.days > 0) {
    const ri = f1(fr.r0 * 0.52);
    const a = Math.min(0.97, closed.days / 365.25) * 2 * Math.PI;
    const ex = f1(fr.cx + ri * Math.sin(a)), ey = f1(fr.cy - ri * Math.cos(a));
    inner = {
      d: `M${fr.cx} ${f1(fr.cy - ri)} A${ri} ${ri} 0 ${a > Math.PI ? 1 : 0} 1 ${ex} ${ey}`,
      label: `${fmtNum(closed.days)} ${closed.unit}`,
      lx: fr.cx - (fr.phone ? 3 : 4), ly: f1(fr.cy + ri + (fr.phone ? 7 : 4)),
    };
  }
  const aria = `A spiral clock, one turn for each year since ${shortDate(new Date(t0).toISOString().slice(0, 10))}. `
    + `The line runs ${T.toFixed(2)} turns to ${nowDate ?? 'today'}. `
    + events.map((e) => `${e.who} ${e.what}`).join('. ')
    + (closed ? `. A closed case took ${fmtNum(closed.days)} ${closed.unit}.` : '.');
  return {
    w: fr.w, h: fr.h, vx: fr.vx, vy: fr.vy, cx: fr.cx, cy: fr.cy, fs: fr.fs, yfs: fr.yfs,
    guides, d: 'M' + pts.join(' L'), start: at(0), head,
    today: { x: f1(head.x - (fr.phone ? 16 : 18)), y: f1(head.y + (fr.phone ? 20 : 22)), date: nowDate ?? '' },
    marks, inner, aria,
  };
}

function spiralModel(issue: StageIssue): Pick<StageModel, 'spiral' | 'ladder' | 'foot'> | undefined {
  const cover = coverSection(issue.sections, issue.cover?.section);
  if (!cover || (cover.kind !== 'timeline' && cover.kind !== 'data-readout')) return undefined;
  const tl = cover.kind === 'timeline' ? cover : issue.sections.find((s) => s.kind === 'timeline');
  const ev: any[] = tl?.data?.events ?? [];
  const ai = ev.findIndex((e) => e.state === 'key' && Number.isFinite(dateValue(e.date)) && !/^\d{4}$/.test(String(e.date).trim()));
  const ni = ev.findIndex((e, i) => i > ai && e.state === 'now' && Number.isFinite(dateValue(e.date)));
  if (ai < 0 || ni < 0) return undefined;
  const t0 = dateValue(ev[ai].date), t1 = dateValue(ev[ni].date);
  /* A clock shorter than one turn is an arc, not a spiral: another scene. */
  if (!(t1 - t0 >= YEAR)) return undefined;
  const between = ev
    .map((e, i) => ({ e, i, t: dateValue(e.date) }))
    .filter((x) => x.i !== ai && x.i !== ni && Number.isFinite(x.t) && x.t > t0 && x.t < t1)
    .slice(-3);
  const marks = between.map(({ e, t }) => {
    const who = subjectOf(e.label);
    const { what, verb } = deltaOf(e.label, who);
    return { t, who, what, verb, date: shortDate(e.date) };
  });

  /* A closed case: a latency-waterfall whose spans name one of these subjects
     ("Forest: referral to decision"). Its whole length is the inner arc. */
  const lw = issue.sections.find((s) => s.kind === 'latency-waterfall');
  const unit = String(lw?.data?.unit ?? 'days');
  const spans: any[] = lw?.data?.spans ?? [];
  const closedFor = (who: string) => {
    const mine = spans.filter((s) => plain(s.label).split(/[:,]/)[0].trim().split(/\s+/).pop() === who.split(/\s+/).pop());
    if (!mine.length) return undefined;
    return Math.max(...mine.map((s) => Number(s.start ?? 0) + Number(s.dur ?? 0)));
  };

  const nowWho = subjectOf(ev[ni].label);
  const c = issue.cover;
  const unitWord = c && /^[a-z]/.test(c.label) ? c.label.split(/\s+/)[0] : '';
  const days = Math.round((t1 - t0) / DAY);
  const nowValue = c ? `${c.number}${unitWord ? ` ${unitWord}` : ''}` : `${fmtNum(days)} days`;

  let closed: { days: number; unit: string } | undefined;
  const ladder: LadderRow[] = marks.slice(-2).map((m) => {
    const total = closedFor(m.who);
    if (total && !closed) closed = { days: total, unit };
    return total
      ? { value: `${fmtNum(total)} ${unit}`, name: m.who, note: 'Closed' }
      : { value: m.verb ? pastTense(m.verb) : m.date, name: m.who, note: m.date };
  });
  ladder.push({ value: nowValue, name: nowWho, note: 'Open', hot: true });

  const anchorYear = new Date(t0).getFullYear();
  const nowDate = String(ev[ni].date).trim();
  return {
    ladder,
    foot: 'One turn, one year',
    spiral: {
      desktop: spiralGeo(SPIRAL_DESKTOP, t0, t1, anchorYear, marks, closed, nowDate),
      phone: spiralGeo(SPIRAL_PHONE, t0, t1, anchorYear, marks, closed, nowDate),
    },
  };
}

// ── orbit ────────────────────────────────────────────────────────────────────

interface OrbitFrame { w: number; h: number; cx: number; cy: number; rEarth: number; rLow: number; rHigh: number; a0: number; a1: number; lab: [number, number] }
const ORBIT_DESKTOP: OrbitFrame = { w: 1280, h: 720, cx: -40, cy: 1060, rEarth: 520, rLow: 641, rHigh: 748, a0: 10, a1: 52, lab: [-34, 21] };
const ORBIT_PHONE: OrbitFrame = { w: 390, h: 240, cx: -20, cy: 410, rEarth: 280, rLow: 332.8, rHigh: 379.6, a0: 10, a1: 40, lab: [-30, 22] };

function orbitGeo(fr: OrbitFrame, pts: { t: number; altKm: number }[], stops: { t: number; alt: number }[]): OrbitGeo {
  const tMin = Math.min(...pts.map((p) => p.t)), tMax = Math.max(...pts.map((p) => p.t));
  const aMin = Math.min(...pts.map((p) => p.altKm)), aMax = Math.max(...pts.map((p) => p.altKm));
  const R = (alt: number) => fr.rLow + (aMax > aMin ? (alt - aMin) / (aMax - aMin) : 1) * (fr.rHigh - fr.rLow);
  const A = (t: number) => ((fr.a0 + (tMax > tMin ? (t - tMin) / (tMax - tMin) : 0) * (fr.a1 - fr.a0)) * Math.PI) / 180;
  const P = (t: number, alt: number) => ({ x: f1(fr.cx + R(alt) * Math.sin(A(t))), y: f1(fr.cy - R(alt) * Math.cos(A(t))) });
  const altAt = (t: number) => {
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1], q = pts[i];
      if (t >= p.t && t <= q.t) return q.t === p.t ? q.altKm : p.altKm + ((t - p.t) / (q.t - p.t)) * (q.altKm - p.altKm);
    }
    return pts[pts.length - 1].altKm;
  };
  const line: string[] = [];
  for (let i = 0; i <= 90; i++) {
    const t = tMin + ((tMax - tMin) * i) / 90;
    const p = P(t, altAt(t));
    line.push(`${p.x} ${p.y}`);
  }
  const alts = [...new Set(stops.map((s) => s.alt))].sort((a, b) => b - a);
  const rings = alts.map((a, i) => ({ r: f1(R(a)), style: (i === 0 ? 'solid' : i === alts.length - 1 ? 'dot' : 'dash') as 'solid' | 'dash' | 'dot' }));
  const marks = stops.map((s, i) => {
    const p = P(s.t, s.alt);
    return { ...p, alt: fmtNum(s.alt), last: i === stops.length - 1, lx: f1(p.x + fr.lab[0]), ly: f1(p.y + fr.lab[1]) };
  });
  return {
    w: fr.w, h: fr.h, earth: { cx: fr.cx, cy: fr.cy, r: fr.rEarth }, rings, d: 'M' + line.join(' L'), marks,
    aria: `A planet's edge with ${alts.length} orbits drawn at squeezed heights, ${alts.map((a) => `${fmtNum(a)} km`).join(', ')}. A line spirals down through them.`,
  };
}

function orbitModel(issue: StageIssue): Pick<StageModel, 'orbit' | 'ladder' | 'foot'> | undefined {
  const sec = coverSection(issue.sections, issue.cover?.section);
  if (sec?.kind !== 'descent-profile') return undefined;
  const pts: { t: number; altKm: number }[] = (sec.data?.points ?? []).filter((p: any) => Number.isFinite(p?.t) && Number.isFinite(p?.altKm));
  if (pts.length < 2) return undefined;
  const altAt = (t: number) => {
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1], q = pts[i];
      if (t >= p.t && t <= q.t) return q.t === p.t ? q.altKm : p.altKm + ((t - p.t) / (q.t - p.t)) * (q.altKm - p.altKm);
    }
    return NaN;
  };
  /* One stop per altitude, the LAST event at each (the burn, not its start),
     at most three: the ladder and the marks. */
  const byAlt = new Map<number, { t: number; alt: number; label: string }>();
  for (const e of sec.data?.events ?? []) {
    const alt = Math.round(altAt(Number(e.t)));
    if (Number.isFinite(alt)) byAlt.set(alt, { t: Number(e.t), alt, label: clipWords(e.label, 3) });
  }
  let stops = [...byAlt.values()].sort((a, b) => a.t - b.t);
  if (stops.length > 3) stops = [stops[0], stops[Math.floor(stops.length / 2)], stops[stops.length - 1]];
  if (!stops.length) stops = [pts[0], pts[pts.length - 1]].map((p) => ({ t: p.t, alt: p.altKm, label: '' }));
  const aHi = Math.max(...stops.map((s) => s.alt)), aLo = Math.min(...stops.map((s) => s.alt));
  const ladder = stops.map((s, i) => ({
    value: `${fmtNum(s.alt)} km`, name: s.label, hot: i === stops.length - 1,
    at: aHi > aLo ? (aHi - s.alt) / (aHi - aLo) : i / Math.max(1, stops.length - 1),
  }));
  return {
    ladder,
    foot: 'Heights not to scale',
    orbit: { desktop: orbitGeo(ORBIT_DESKTOP, pts, stops), phone: orbitGeo(ORBIT_PHONE, pts, stops) },
  };
}

// ── bars ─────────────────────────────────────────────────────────────────────

function barsModel(issue: StageIssue): Pick<StageModel, 'bars' | 'ladder'> | undefined {
  const sec = coverSection(issue.sections, issue.cover?.section);
  if (sec?.kind !== 'data-readout') return undefined;
  const tiles: any[] = (sec.data?.tiles ?? []).filter((t: any) => Number.isFinite(asNumber(t.value)));
  if (tiles.length < 2) return undefined;
  const max = Math.max(...tiles.map((t) => Math.abs(asNumber(t.value))));
  if (!(max > 0)) return undefined;
  const key = tiles.find((t) => t.emphasis === 'key') ?? tiles[0];
  const bars = tiles.slice(0, 4).map((t) => ({
    label: clipWords(t.label, 3), value: String(t.value), frac: Math.abs(asNumber(t.value)) / max, key: t === key,
  }));
  const ladder = tiles.filter((t) => t !== key).slice(0, 3).map((t) => ({ value: String(t.value), name: clipWords(t.label, 3) }));
  return { bars, ladder };
}

// ── the model ────────────────────────────────────────────────────────────────

export function stageModel(issue: StageIssue): StageModel {
  const counter = counterFrom(issue);
  const headline = issue.cover?.headline ?? issue.title;
  const spiral = spiralModel(issue);
  if (spiral) return { scene: 'spiral', counter, headline, ...spiral };
  const orbit = orbitModel(issue);
  if (orbit) return { scene: 'orbit', counter, headline, ...orbit };
  const bars = barsModel(issue);
  if (bars) return { scene: 'bars', counter, headline, ...bars };
  return { scene: 'cover', counter, headline, ladder: [] };
}

// ── the intro's third scene ──────────────────────────────────────────────────

export interface IntroCue { n: number; lead: string; rest: string; value: string; unit: string }
export interface IntroFigure {
  cues: [IntroCue, IntroCue];
  open: { label: string; days: number };
  closed: { label: string; spans: number[]; total: number };
  caption: string;
  source?: { label: string; date?: string };
  /** A short name for the section the figure comes from ("Two clocks"). */
  eyebrow: string;
}

/**
 * The intro's live miniature of the reading system (the Intro board, scene
 * 3): two cue sentences from the cover issue and the two-clock bars they point
 * at. Built only when the issue carries the shape it needs, a readout whose
 * key tile is the open clock and a latency-waterfall with a closed case (No
 * 17 does); otherwise undefined, and the scene shows the cover mark instead.
 */
export function introFigure(issue: StageIssue): IntroFigure | undefined {
  const ro = issue.sections.find((s) => s.kind === 'data-readout');
  const lw = issue.sections.find((s) => s.kind === 'latency-waterfall');
  const tl = issue.sections.find((s) => s.kind === 'timeline');
  const key = (ro?.data?.tiles ?? []).find((t: any) => t.emphasis === 'key');
  const spans: any[] = lw?.data?.spans ?? [];
  if (!lw || !key || spans.length < 2) return undefined;
  const who = (s: any) => plain(s.label).split(/[:,]/)[0].trim();
  const open = spans.reduce((a, b) => (Number(b.dur) > Number(a.dur) ? b : a));
  const closedWho = who(spans.find((s) => who(s) !== who(open)) ?? {});
  const mine = spans.filter((s) => who(s) === closedWho);
  if (!closedWho || !mine.length) return undefined;
  const total = Math.max(...mine.map((s) => Number(s.start ?? 0) + Number(s.dur ?? 0)));
  const last = closedWho.split(/\s+/).pop()!;
  const ev = (tl?.data?.events ?? []).find((e: any) => subjectOf(e.label).split(/\s+/).pop() === last);
  if (!ev) return undefined;
  const unit = String(lw.data?.unit ?? 'days');
  const cap = String(lw.caption ?? '').replace(/\[\[\d+\]\]\s*/g, '').replace(/\*\*|\*/g, '').trim();
  const first = (cap.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? cap).trim();
  const src = (lw as any).source;
  return {
    eyebrow: (() => {
      const e = plain((lw as any).eyebrow ?? (lw as any).short ?? '').toLowerCase();
      return e.charAt(0).toUpperCase() + e.slice(1);
    })(),
    cues: [
      { n: 1, lead: `${clipWords(key.label, 6)}: ${key.value}.`, rest: plain(key.note), value: String(key.value), unit: `${unit} · ${who(open).split(/\s+/).pop()}, still open` },
      { n: 2, lead: `${plain(ev.label)}.`, rest: plain(ev.note), value: fmtNum(Number(mine[0].dur)), unit: `${unit} · ${last}'s first decision` },
    ],
    open: { label: who(open), days: Number(open.dur) },
    closed: { label: closedWho, spans: mine.map((s) => Number(s.dur)), total },
    caption: first,
    source: typeof src === 'object' && src ? { label: String(src.label), date: src.date ? String(src.date) : undefined } : undefined,
  };
}
