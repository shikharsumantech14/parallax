/**
 * The verifier pre-pass (docs/COST-PLAN.md CP-06, job b).
 *
 * Before the Opus verifier reads a draft, this pulls every checkable claim out
 * of the issue's frontmatter, finds the three dossier passages that share the
 * most numbers and names with each one, and asks Jev ONE question pair per
 * claim: does a passage back it (supports / contradicts / says_nothing), and
 * which passage. Code, not Jev, then checks what Jev must never be trusted
 * with: whether each number in the claim appears in those passages at all,
 * whether a quote is verbatim, and whether the cited passage is marked
 * [PARTIAL] / [UNVERIFIED] / [HISTORICAL] in the dossier.
 *
 * The output routes attention. It is never a verdict: "supports" at p ≥ 0.90
 * means only that Jev read a passage as stating the claim. The verifier still
 * owns every ✅ / ⚠️ / ❌, every quote, all arithmetic and every date.
 *
 * Cost: one call per claim, ~500–2,000 input tokens each, so about a cent for
 * a 100-claim issue at $0.042 per million.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative } from 'node:path';
import matter from 'gray-matter';
import {
  jev,
  jevRoute,
  jevThreshold,
  mapPool,
  pickOf,
  stateCharBudget,
  stateTokens,
  truncateWithNote,
  MAX_STATE_TOKENS,
  REPO_ROOT,
} from './jev.js';
import type { ChoiceAnswer, ChoiceQuestion, JevUse } from './jev.js';

// ════════════════════════════════════════════════════════════════════════════
// Normalisation: numbers, dates, words. Code's job, never Jev's.
// ════════════════════════════════════════════════════════════════════════════

const MONTH_RE = 'Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?';
const MONTHS: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const monthNo = (m: string) => MONTHS[m.slice(0, 3).toLowerCase()] ?? 0;
const pad2 = (n: number | string) => String(n).padStart(2, '0');

const WORD_NUMBERS: Record<string, number> = {
  two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40,
  fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100,
  thousand: 1000, dozen: 12,
};
const MAGNITUDE: Record<string, number> = {
  k: 1e3, thousand: 1e3, m: 1e6, mn: 1e6, million: 1e6, bn: 1e9, billion: 1e9,
  tn: 1e12, trillion: 1e12, lakh: 1e5, lakhs: 1e5, crore: 1e7, crores: 1e7, cr: 1e7,
};

const canon = (v: number) => String(Number(v.toPrecision(12)));

/** One number found in a text, with every key it can be matched by. */
export interface NumToken {
  raw: string;
  keys: string[];
  /** Ranking weight: 5 for a quantity or an exact date, 2 for a bare year or season, 3 for a month. */
  weight: number;
  /** A bare year, season or date: context, not the claim's quantity. */
  temporal: boolean;
}

/** Strip what carries numbers but no claim: URLs, section references, markdown emphasis. */
export function cleanForMatching(text: string): string {
  return String(text)
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/§\s?\d+(?:\.\d+)*[a-z]?/g, ' ')
    .replace(/\b(?:src|C)-\d+\b/g, ' ')
    .replace(/[*_`]/g, '');
}

/**
 * Every number in `text`, normalised so "28.3" matches "28.3%", "1,000" matches
 * "1000", "£6.8bn" matches "£6,800m", "81.5%" matches "0.815", "fourteen"
 * matches "14", and "21 Nov 2025" matches "2025-11-21".
 */
export function extractNumbers(text: string): NumToken[] {
  let s = cleanForMatching(text);
  const out: NumToken[] = [];
  const take = (re: RegExp, fn: (m: RegExpExecArray) => NumToken | null) => {
    s = s.replace(re, (...args: unknown[]) => {
      const m = args.slice(0, -2) as unknown as RegExpExecArray;
      const t = fn(m);
      if (t) out.push(t);
      return ' ';
    });
  };
  const year = (y: string): NumToken => ({ raw: y, keys: [`y:${y}`], weight: 2, temporal: true });

  // Dates first, so their parts are not read as quantities.
  take(new RegExp(`\\b(\\d{1,2})\\s+(${MONTH_RE})\\.?,?\\s+((?:19|20)\\d{2})\\b`, 'gi'), (m) => {
    out.push(year(m[3]));
    return { raw: m[0], keys: [`d:${m[3]}-${pad2(monthNo(m[2]))}-${pad2(m[1])}`], weight: 5, temporal: true };
  });
  take(new RegExp(`\\b(${MONTH_RE})\\.?\\s+(\\d{1,2}),?\\s+((?:19|20)\\d{2})\\b`, 'gi'), (m) => {
    out.push(year(m[3]));
    return { raw: m[0], keys: [`d:${m[3]}-${pad2(monthNo(m[1]))}-${pad2(m[2])}`], weight: 5, temporal: true };
  });
  take(/\b((?:19|20)\d{2})-(\d{2})-(\d{2})\b/g, (m) => {
    out.push(year(m[1]));
    return { raw: m[0], keys: [`d:${m[1]}-${m[2]}-${m[3]}`], weight: 5, temporal: true };
  });
  take(/\b((?:19|20)\d{2})[/–-](\d{2})\b/g, (m) => {
    out.push(year(m[1]));
    const a = Number(m[1]), b = Number(m[2]);
    if (b === (a + 1) % 100) return { raw: m[0], keys: [`s:${m[1]}/${m[2]}`], weight: 2, temporal: true };
    if (b >= 1 && b <= 12) return { raw: m[0], keys: [`d:${m[1]}-${m[2]}`], weight: 3, temporal: true };
    return null;
  });
  take(new RegExp(`\\b(${MONTH_RE})\\.?\\s+((?:19|20)\\d{2})\\b`, 'gi'), (m) => {
    out.push(year(m[2]));
    return { raw: m[0], keys: [`d:${m[2]}-${pad2(monthNo(m[1]))}`], weight: 3, temporal: true };
  });

  // Fractions in words ("two thirds", "a quarter") are approximations, not figures to match.
  take(/\b(?:one|two|three|a)[\s-]+(?:thirds?|quarters?|halves)\b|\bhalf\b/gi, () => null);
  // Compound number words: "thirty-two" is 32, not 30 and 2.
  take(/\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[\s-](one|two|three|four|five|six|seven|eight|nine)\b/gi, (m) => {
    const units: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
    return { raw: m[0], keys: [`n:${WORD_NUMBERS[m[1].toLowerCase()] + units[m[2].toLowerCase()]}`], weight: 5, temporal: false };
  });
  // Numbers written as words ("fourteen clubs", "a sevenfold rise").
  take(new RegExp(`\\b(${Object.keys(WORD_NUMBERS).join('|')})(fold)?\\b`, 'gi'), (m) => {
    const v = WORD_NUMBERS[m[1].toLowerCase()];
    return { raw: m[0], keys: [`n:${v}`], weight: 5, temporal: false };
  });

  // Numerals, with a currency, a magnitude or a percent sign.
  take(/([£$€₹])?\s?(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?(?:\s?(%|per ?cent|bn|billion|mn|million|m|k|thousand|tn|trillion|lakhs?|crores?|cr)(?![A-Za-z]))?/gi, (m) => {
    const [raw, cur, int, frac, suffix] = [m[0], m[1], m[2], m[3], m[4]];
    const v = Number(int.replace(/,/g, '') + (frac ?? ''));
    if (!Number.isFinite(v)) return null;
    if (!cur && !frac && !suffix && /^\d{4}$/.test(int) && v >= 1900 && v <= 2099) return year(int);
    const keys = [`n:${canon(v)}`];
    const sfx = suffix?.toLowerCase().replace(/\s/g, '');
    if (sfx === '%' || sfx === 'percent') keys.push(`n:${canon(v / 100)}`);
    else if (sfx && MAGNITUDE[sfx]) keys.push(`a:${canon(v * MAGNITUDE[sfx])}`);
    if (!sfx && frac && v > 0 && v < 1 && frac.length >= 3) keys.push(`n:${canon(v * 100)}`);
    return { raw: raw.trim(), keys, weight: 5, temporal: false };
  });
  return out;
}

const STOPWORDS = new Set(`a an the of to in on at for from by with and or but nor is are was were be been being it its this that these those as than then so not no
  more most less least all each every any both either neither has have had do does did done can could will would shall should may might must which who whom whose
  what when where why how their they them there here about into onto over under up down out only also just very per you your we our us he she his her him if
  while because same other own new old one ones such some many much few across after before between through during within without again still even yet
  it's that's let say says said get got make made take took going way thing things like`.split(/\s+/).filter(Boolean));

/** A crude, consistent stem: "approves" and "approved" both become "approv", "clubs" "club". */
function stem(w: string): string {
  let t = w;
  if (t.length > 4 && t.endsWith('ies')) t = t.slice(0, -3) + 'y';
  else if (t.length > 3 && t.endsWith('s') && !t.endsWith('ss')) t = t.slice(0, -1);
  if (t.length > 5 && t.endsWith('ing')) t = t.slice(0, -3);
  else if (t.length > 4 && t.endsWith('ed')) t = t.slice(0, -2);
  if (t.length > 4 && t.endsWith('e')) t = t.slice(0, -1);
  return t;
}

export interface WordSets { caps: Set<string>; words: Set<string> }

/** Content words (stop-listed, lightly stemmed), with the capitalised ones kept apart: names weigh more. */
export function contentWords(text: string): WordSets {
  const caps = new Set<string>();
  const words = new Set<string>();
  const s = cleanForMatching(text).replace(/\d[\d.,]*/g, ' ');
  for (const tok of s.match(/[A-Za-z][A-Za-z’'-]*/g) ?? []) {
    const lower = tok.toLowerCase().replace(/[’']s$/, '').replace(/[’']/g, '');
    if (lower.length < 3 || STOPWORDS.has(lower) || WORD_NUMBERS[lower] !== undefined) continue;
    const n = stem(lower);
    words.add(n);
    if (/^[A-Z]/.test(tok)) caps.add(n);
  }
  return { caps, words };
}

const NUMBER_WORD_RE = new RegExp(`\\b(${Object.keys(WORD_NUMBERS).join('|')})(fold)?\\b|\\b(half|twice|double|doubled|triple|tripled|quarter|thirds?)\\b`, 'i');

/** Does this text carry a figure: a digit, a currency, a percent, a year, a number word? */
export function hasNumber(s: string): boolean {
  return /\d/.test(s) || /[£$€₹%]/.test(s) || /\bper ?cent\b/i.test(s) || NUMBER_WORD_RE.test(s);
}

/** Sentence split, the way scripts/check-prose.mjs does it (plus £ and € as openers). */
export function sentences(s: string): string[] {
  return String(s)
    .replace(/\*\*|\*/g, '')
    .replace(/([.!?…])(["”’)]?)\s+(?=[A-Z0-9"“(₹$£€])/g, '$1$2\u0001')
    .split('\u0001')
    .map((x) => x.replace(/\s+/g, ' ').trim())
    .filter((x) => /[\p{L}\p{N}]/u.test(x));
}

// ════════════════════════════════════════════════════════════════════════════
// Claims: every checkable statement in the draft's frontmatter.
// ════════════════════════════════════════════════════════════════════════════

export type ClaimType = 'sentence' | 'caption' | 'quote' | 'data' | 'annotation';

export interface Claim {
  n: number;
  text: string;
  type: ClaimType;
  /** 0 = the head (title, hook, dek, primer). Sections count from 1, as the verifier's report does. */
  section: number;
  kind: string;
  field: string;
  location: string;
  /** For a quote claim: the quotation alone, without its attribution, for the verbatim check. */
  quote?: string;
}

// Keys that are never a claim (identifiers, styling, anchors, provenance).
const SKIP_KEYS = new Set(['url', 'id', 'kind', 'state', 'color', 'colour', 'emphasis', 'accent', 'highlight', 'group', 'mode', 'layout',
  'side', 'series', 'src', 'alt', 'fit', 'code', 'role', 'region', 'icon', 'status', 'story', 'sourceRefs', 'source', 'sources',
  'howToRead', 'plain', 'eyebrow', 'skimCaption', 'intro', 'caption', 'credit', 'tag', 'stamp', 'primary', 'sortDesc', 'logX', 'logY']);
// Numeric settings of a chart, not claims about the world.
const NUM_SETTING_KEYS = new Set(['maxValue', 'minValue', 'xMin', 'xMax', 'yMin', 'yMax', 'min', 'max', 'ticks', 'tickStep', 'step',
  'width', 'height', 'zoom', 'scale', 'rotate', 'rotation', 'tilt', 'speed', 'duration', 'delay', 'opacity', 'size', 'order', 'index', 'cols', 'number']);
// Root-level labels: a number in an axis title is not a claim.
const ROOT_LABEL_KEYS = new Set(['xLabel', 'yLabel', 'refLabel', 'label', 'title', 'subtitle', 'headline', 'legend', 'unit', 'axisLabel', 'punchline']);
// Fields that name a record rather than describe it.
const HEAD_KEYS = ['date', 'time', 'year', 'label', 'name', 'term', 'title'];
// Short strings that are values ("£948m", "85%").
const VALUE_KEYS = new Set(['value', 'amount', 'figure', 'stat', 'count', 'total', 'for', 'against', 'required', 'present', 'shortfall']);
// Arrays of labels for the chart itself (comparison sides, ternary corners, flow nodes): never records.
const LABEL_ARRAYS = new Set(['sides', 'corners', 'nodes', 'legend', 'axes', 'keys']);

/** "1000" in "£m" becomes "£1000m", so it matches "£1bn". "86.8" in "%" becomes "86.8%". Otherwise "value unit". */
function withUnit(v: unknown, unit: unknown): string {
  const value = fmt(v);
  const u = typeof unit === 'string' ? unit.trim() : '';
  if (!u) return value;
  const cm = u.match(/^([£$€₹])\s?(k|m|mn|bn|tn|crore|lakh)$/i);
  if (cm) return /^(crore|lakh)$/i.test(cm[2]) ? `${cm[1]}${value} ${cm[2]}` : `${cm[1]}${value}${cm[2]}`;
  if (/^[£$€₹]$/.test(u)) return `${u}${value}`;
  if (!/[A-Za-z]/.test(u) && u.length <= 2) return `${value}${u}`;
  return `${value} ${u}`;
}

const LONG_TEXT = 300;
const MAX_RECORD_CHARS = 520;

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNumArray = (v: unknown): v is number[] => Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'number');
const isStrArray = (v: unknown): v is string[] => Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'string');
const fmt = (v: unknown) => (typeof v === 'number' ? String(v) : String(v ?? '')).replace(/\s+/g, ' ').trim();
const flat = (s: string) => s.replace(/\*\*|\*/g, '').replace(/\s+/g, ' ').trim();

/** Kind-aware rendering for the data shapes whose numbers mean nothing without their axis or corner. */
function renderSpecial(kind: string, obj: Obj, root: Obj): string | null {
  if (kind === 'scaling-plot' && typeof obj.x === 'number' && typeof obj.y === 'number') {
    return `${fmt(obj.label ?? 'point')}: ${fmt(root.xLabel ?? 'x')} ${obj.x}; ${fmt(root.yLabel ?? 'y')} ${obj.y}`;
  }
  if (kind === 'channel-ternary' && isNumArray(obj.values) && Array.isArray(root.corners)) {
    const corners = (root.corners as Obj[]).map((c) => fmt(isObj(c) ? c.label : c));
    const parts = obj.values.map((v, i) => `${corners[i] ?? `value ${i + 1}`} ${v}`);
    return joinSentences([`${fmt(obj.name ?? obj.label)}: ${parts.join(', ')}`, obj.note ? flat(fmt(obj.note)) : '']);
  }
  if (typeof obj.from === 'string' && typeof obj.to === 'string' && typeof obj.value === 'number' && Array.isArray(root.nodes)) {
    const label = (id: string) => {
      const n = (root.nodes as Obj[]).find((x) => isObj(x) && x.id === id);
      return fmt(n?.label ?? id);
    };
    return `${label(obj.from)} → ${label(obj.to)}: ${withUnit(obj.value, root.unit)}${obj.note ? ` (${flat(fmt(obj.note))})` : ''}`;
  }
  return null;
}

/** Render one record (an object carrying a figure) as a sentence-like claim. */
function renderRecord(kind: string, obj: Obj, root: Obj, isRoot: boolean, folded: Set<string>): string {
  const special = renderSpecial(kind, obj, root);
  if (special) { for (const k of Object.keys(obj)) folded.add(k); return special; }
  const head: string[] = [];
  for (const k of HEAD_KEYS) {
    if (typeof obj[k] === 'string' || typeof obj[k] === 'number') { head.push(flat(fmt(obj[k]))); folded.add(k); }
  }
  // A record's own unit, else the chart's (a root record IS the chart).
  const unit = typeof obj.unit === 'string' ? obj.unit : !isRoot && typeof root.unit === 'string' ? root.unit : '';
  const values: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (folded.has(k) || SKIP_KEYS.has(k) || NUM_SETTING_KEYS.has(k)) continue;
    if (typeof v === 'number') {
      const valueLike = k === 'value' || k === 'refValue';
      values.push(valueLike ? withUnit(v, unit) : `${k} ${v}`);
      folded.add(k);
    } else if (isNumArray(v)) {
      values.push(`${k} [${v.join(', ')}]`);
      folded.add(k);
    } else if (typeof v === 'string' && VALUE_KEYS.has(k) && v.length <= 40) {
      values.push(k === 'value' ? withUnit(flat(v), unit) : `${k} ${flat(v)}`);
      folded.add(k);
    }
  }
  if (typeof obj.refLabel === 'string' && typeof obj.refValue === 'number') { head.push(flat(obj.refLabel)); folded.add('refLabel'); }
  folded.add('unit');
  const texts: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (folded.has(k) || SKIP_KEYS.has(k) || k === 'unit' || k === 'annotations') continue;
    if (typeof v === 'string' && v.length <= LONG_TEXT && !(isRoot && ROOT_LABEL_KEYS.has(k))) { texts.push(flat(v)); folded.add(k); }
    else if (isStrArray(v) && v.every((x) => x.length <= LONG_TEXT)) {
      const sides = Array.isArray(root.sides) ? (root.sides as Obj[]).map((sd) => flat(fmt(sd.title ?? sd.label))) : [];
      texts.push(v.map((x, i) => (k === 'values' && sides[i] ? `${sides[i]}: ${flat(x)}` : flat(x))).join(' | '));
      folded.add(k);
    }
  }
  const lead = head.join(' · ');
  const body = values.join(', ');
  return joinSentences([lead && body ? `${lead}: ${body}` : lead || body, ...texts]);
}

/** Join parts as sentences: a full stop between two parts, unless the first already ends in one. */
function joinSentences(parts: string[]): string {
  return parts.filter(Boolean).reduce((acc, p) => (acc ? `${acc}${/[.!?…:]$/.test(acc) ? '' : '.'} ${p}` : p), '');
}

/** Every checkable statement in an issue's frontmatter, in reading order. */
export function extractClaims(fm: Obj): Claim[] {
  const claims: Claim[] = [];
  const seen = new Set<string>();
  const push = (c: Omit<Claim, 'n' | 'location'>) => {
    const text = c.text.replace(/\s+/g, ' ').trim();
    if (!text) return;
    const key = `${c.section}|${text}`;
    if (seen.has(key)) return;
    seen.add(key);
    const where = c.section === 0 ? 'head' : `§${c.section} ${c.kind}`;
    claims.push({ ...c, text, n: claims.length + 1, location: `${where} · ${c.field}` });
  };
  const numericSentences = (text: string, base: Omit<Claim, 'n' | 'location' | 'text' | 'type'>) => {
    for (const s of sentences(text)) if (hasNumber(s)) push({ ...base, text: s, type: 'sentence' });
  };

  // The head.
  for (const k of ['title', 'hook', 'dek', 'primer']) {
    const v = fm[k];
    if (typeof v !== 'string') continue;
    if (k === 'title') { if (hasNumber(v)) push({ section: 0, kind: 'head', field: k, text: flat(v), type: 'sentence' }); }
    else numericSentences(v, { section: 0, kind: 'head', field: k });
  }

  const sections = Array.isArray(fm.sections) ? (fm.sections as Obj[]) : [];
  sections.forEach((s, i) => {
    if (!isObj(s)) return;
    const section = i + 1;
    const kind = String(s.kind ?? 'unknown');
    const base = { section, kind };
    const data = isObj(s.data) ? s.data : {};
    if (typeof s.title === 'string' && hasNumber(s.title)) push({ ...base, field: 'title', text: flat(s.title), type: 'sentence' });
    if (typeof s.intro === 'string') numericSentences(s.intro, { ...base, field: 'intro' });
    if (typeof s.skimCaption === 'string') numericSentences(s.skimCaption, { ...base, field: 'skimCaption' });
    const caption = typeof s.caption === 'string' ? s.caption : typeof data.caption === 'string' ? data.caption : null;
    if (caption) push({ ...base, field: 'caption', text: flat(caption), type: 'caption' });
    walkData(data, 'data', null, true, data, kind, section, push);
  });
  return claims;
}

type Push = (c: Omit<Claim, 'n' | 'location'>) => void;

function walkData(node: unknown, path: string, parentKey: string | null, isRoot: boolean, root: Obj, kind: string, section: number, push: Push): void {
  const base = { section, kind };
  if (Array.isArray(node)) {
    if (isStrArray(node)) {
      for (const [i, s] of node.entries()) {
        if (parentKey === 'quote' || parentKey === 'quotes') push({ ...base, field: `${path}[${i}]`, text: flat(s), type: 'quote' });
        else for (const sent of sentences(s)) if (hasNumber(sent)) push({ ...base, field: `${path}[${i}]`, text: sent, type: 'sentence' });
      }
      return;
    }
    node.forEach((el, i) => walkData(el, `${path}[${i}]`, parentKey, false, root, kind, section, push));
    return;
  }
  if (!isObj(node)) return;

  // An in-chart callout is a data claim in the precision layer, figure or not.
  if (parentKey === 'annotations' && typeof node.text === 'string') {
    const at = node.at === undefined ? '' : `Callout on "${fmt(node.at)}": `;
    push({ ...base, field: path, text: `${at}${flat(node.text)}`, type: 'annotation' });
    return;
  }
  // A you-think card's `think` is the misconception the card exists to correct.
  if (kind === 'you-think' && parentKey === 'think') return;
  // A quotation, verbatim: `quote: "…"` or `quote: { text, attribution }`.
  if (parentKey === 'quote' && typeof node.text === 'string') {
    push({ ...base, field: `${path}.text`, text: flat(node.text), type: 'quote' });
    return;
  }

  // Chart furniture (comparison sides, ternary corners, flow nodes) labels the figure. It asserts nothing.
  if (LABEL_ARRAYS.has(parentKey ?? '')) return;

  const entries = Object.entries(node).filter(([k]) => !(isRoot && SKIP_KEYS.has(k)));
  let folded = new Set<string>();

  if (typeof node.quote === 'string') {
    const who = typeof node.attribution === 'string' ? ` (${flat(node.attribution)})` : '';
    push({ ...base, field: `${path}.quote`, text: `${flat(node.quote)}${who}`, type: 'quote', quote: flat(node.quote) });
    folded.add('quote'); folded.add('attribution');
  }

  const numeric = entries.some(([k, v]) => !SKIP_KEYS.has(k) && !NUM_SETTING_KEYS.has(k) && (typeof v === 'number' || isNumArray(v)));
  const valueStr = entries.some(([k, v]) => VALUE_KEYS.has(k) && typeof v === 'string' && v.length <= 40 && hasNumber(v));
  const textNumber = entries.some(([k, v]) => !folded.has(k) && !SKIP_KEYS.has(k) && !(isRoot && ROOT_LABEL_KEYS.has(k))
    && ((typeof v === 'string' && v.length <= LONG_TEXT && hasNumber(v)) || (isStrArray(v) && v.every((x) => x.length <= LONG_TEXT) && v.some(hasNumber))));

  if (numeric || valueStr || textNumber) {
    const record = Object.fromEntries(entries.filter(([k]) => !folded.has(k)));
    const used = new Set(folded);
    let text = renderRecord(kind, record, root, isRoot, used);
    if (text.length > MAX_RECORD_CHARS) {
      // Too long to be one item: keep the figures and the head, and split the prose into sentences below.
      const short = Object.fromEntries(Object.entries(record).filter(([k, v]) => typeof v !== 'string' || v.length <= 120 || HEAD_KEYS.includes(k)));
      const usedShort = new Set(folded);
      text = renderRecord(kind, short, root, isRoot, usedShort);
      folded = usedShort;
    } else {
      folded = used;
    }
    if (hasNumber(text)) push({ ...base, field: path, text: truncateWithNote(text, MAX_RECORD_CHARS), type: 'data' });
  }

  for (const [k, v] of entries) {
    if (folded.has(k) || SKIP_KEYS.has(k)) continue;
    if (typeof v === 'string') {
      if (isRoot && ROOT_LABEL_KEYS.has(k)) continue;
      for (const sent of sentences(v)) if (hasNumber(sent)) push({ ...base, field: `${path}.${k}`, text: sent, type: 'sentence' });
    } else if (Array.isArray(v) || isObj(v)) {
      walkData(v, `${path}.${k}`, k, false, root, kind, section, push);
    }
  }
}

// ════════════════════════════════════════════════════════════════════════════
// Source lines: each section's `source` against the publishers of its
// sourceRefs. Code only, no Jev call. The verifier's reports flag this class
// by hand (seven of the September sports issue's twenty ⚠️ rows were it).
// ════════════════════════════════════════════════════════════════════════════

export interface SourceLineCheck {
  section: number;
  kind: string;
  location: string;
  /** The source line as the reader sees it (the label of a `{label, date}` source). */
  line: string | null;
  refs: string[];
  /** The publishers of the cited refs, once each, in citation order. */
  publishers: string[];
  flags: string[];
}

// Words that name a kind of body, never a particular one.
const GENERIC_NAME_WORDS = new Set(['research', 'institute', 'foundation', 'university', 'government', 'ministry', 'department', 'national',
  'international', 'organisation', 'organization', 'association', 'council', 'commission', 'office', 'bureau', 'agency', 'press', 'times',
  'daily', 'journal', 'review', 'report', 'group', 'company', 'limited', 'india', 'indian', 'world', 'global', 'centre', 'center', 'society',
  'library', 'statistics', 'legislative', 'annual', 'official', 'online', 'media', 'league', 'network', 'services', 'studies']);

const normName = (s: string) => ` ${s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim()} `;

/** The ways a source line can name a publisher: its full name, an all-caps token ("PRS", "UEFA"), its initials, or its most distinctive word. */
function publisherIds(publisher: string): string[] {
  const ids = new Set<string>();
  const full = normName(publisher).trim().replace(/^the /, '');
  if (full) ids.add(full);
  for (const t of publisher.split(/[^A-Za-z0-9]+/)) if (t.length >= 2 && /[A-Z]/.test(t) && t === t.toUpperCase()) ids.add(t.toLowerCase());
  const caps = publisher.split(/\s+/).filter((w) => /^[A-Z]/.test(w) && !/^(the|of|and|for|in|on)$/i.test(w));
  if (caps.length >= 3) ids.add(caps.map((w) => w[0]).join('').toLowerCase());
  const distinctive = full.split(' ').filter((t) => t.length >= 5 && !GENERIC_NAME_WORDS.has(t)).sort((a, b) => b.length - a.length)[0];
  if (distinctive) ids.add(distinctive);
  return [...ids];
}

const namesPublisher = (line: string, publisher: string) => {
  const s = normName(line);
  return publisherIds(publisher).some((id) => s.includes(` ${id} `));
};

/**
 * One entry per section. Flags: a source line with no sourceRefs, sourceRefs
 * with no source line, a ref that resolves to nothing, a cited publisher the
 * line does not name ("club accounts" over The Swiss Ramble), and a publisher
 * the line names that no cited ref is from.
 */
export function checkSourceLines(fm: Obj): SourceLineCheck[] {
  const sources = Array.isArray(fm.sources) ? (fm.sources as unknown[]).filter(isObj) : [];
  const publisherOf = new Map(sources.map((s) => [String(s.id), String(s.publisher ?? '').trim()]));
  const allPublishers = [...new Set([...publisherOf.values()].filter(Boolean))];
  const sections = Array.isArray(fm.sections) ? (fm.sections as unknown[]) : [];
  return sections.map((raw, i) => {
    const s = isObj(raw) ? raw : {};
    const kind = String(s.kind ?? 'unknown');
    const data = isObj(s.data) ? s.data : {};
    const src = s.source ?? data.source;
    const line = typeof src === 'string' ? flat(src) : isObj(src) && typeof src.label === 'string' ? flat(src.label) : null;
    const refs = Array.isArray(s.sourceRefs) ? s.sourceRefs.map(String) : [];
    const publishers = [...new Set(refs.map((r) => publisherOf.get(r)).filter((p): p is string => Boolean(p)))];
    const flags: string[] = [];
    if (line && !refs.length) flags.push('a source line but no sourceRefs: nothing in sources[] backs it');
    if (!line && refs.length) flags.push(`sourceRefs (${refs.join(', ')}) but no source line: the reader is never told where this comes from`);
    const unresolved = refs.filter((r) => !publisherOf.has(r));
    if (unresolved.length) flags.push(`sourceRefs ${unresolved.join(', ')} match no entry in sources[]`);
    if (line) {
      for (const p of publishers) {
        if (namesPublisher(line, p)) continue;
        flags.push(`cites ${p} (${refs.filter((r) => publisherOf.get(r) === p).join(', ')}) but the source line does not name it`);
      }
      for (const p of allPublishers) {
        if (!publishers.includes(p) && namesPublisher(line, p)) flags.push(`the source line names ${p}, but none of the section's sourceRefs is from ${p}`);
      }
    }
    return { section: i + 1, kind, location: `§${i + 1} ${kind} · source`, line, refs, publishers, flags };
  });
}

// ════════════════════════════════════════════════════════════════════════════
// Passages: the dossier, cut into rows, items, paragraphs and quotes.
// ════════════════════════════════════════════════════════════════════════════

export interface Passage {
  id: string;
  section: string;
  heading: string;
  type: 'row' | 'item' | 'para' | 'quote' | 'code';
  text: string;
  order: number;
  nums: NumToken[];
  numKeys: Set<string>;
  words: Set<string>;
  /** A dossier caveat on the passage or its heading: [PARTIAL …], [UNVERIFIED], [HISTORICAL …]. */
  marker: string | null;
}

const MARKER_RE = /\[(UNVERIFIED|PARTIAL|HISTORICAL|ATTRIBUTE TO THE OUTLET|DERIVED|ESTIMATED?|NOT (?:VERIFIED|PARSED)|CONTESTED|DISPUTED|SINGLE[- ]SOURCED?)\b[^\]]*\]?/i;

/** Sections a claim may trace to. §7 (the proposed structure) and §8 (the bibliography) are not evidence. */
export const DEFAULT_EXCLUDED_SECTIONS = ['0', '7', '8'];

function cleanPassage(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\((?:https?:)?[^)]*\)/g, '$1')
    .replace(/\*\*|__/g, '')
    .replace(/`/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/** Cut a dossier into passages, each with a stable id (`4.4/row3`, `9.1/item1`, `1/para2`, `5/quote1`). */
export function parseDossier(md: string, excluded: string[] = DEFAULT_EXCLUDED_SECTIONS): Passage[] {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const out: Passage[] = [];
  const counters = new Map<string, number>();
  let section = '0';
  let heading = '';
  const top = (sec: string) => sec.split('.')[0].replace(/[a-z]$/, '');
  const push = (type: Passage['type'], raw: string) => {
    const text = cleanPassage(raw);
    if (!/[\p{L}\p{N}]/u.test(text) || excluded.includes(top(section))) return;
    const key = `${section}/${type}`;
    const n = (counters.get(key) ?? 0) + 1;
    counters.set(key, n);
    const nums = extractNumbers(text);
    const cw = contentWords(`${heading} ${text}`);
    const m = text.match(MARKER_RE) ?? heading.match(MARKER_RE);
    out.push({
      id: `${section}/${type}${n}`, section, heading, type, text, order: out.length,
      nums, numKeys: new Set(nums.flatMap((t) => t.keys)), words: cw.words,
      marker: m ? `[${m[1].toUpperCase()}]${heading.match(MARKER_RE) && !text.match(MARKER_RE) ? ' (section heading)' : ''}` : null,
    });
  };
  const isTable = (l: string) => /^\s*\|/.test(l);
  const isBullet = (l: string) => /^\s*(?:[-*+]|\d+[.)])\s+/.test(l);
  const isHeading = (l: string) => /^#{1,6}\s/.test(l);
  const isQuote = (l: string) => /^\s*>/.test(l);
  const isRule = (l: string) => /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(l);
  const isFence = (l: string) => /^\s*```/.test(l);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || isRule(line)) { i++; continue; }
    if (isHeading(line)) {
      const text = line.replace(/^#{1,6}\s+/, '').replace(/\s+#*\s*$/, '').trim();
      const m = text.match(/^§?\s*(\d+(?:\.\d+)*[a-z]?)[.)]?(?:\s+|$)(.*)$/);
      if (m) { section = m[1]; heading = cleanPassage(`${m[1]} ${m[2]}`); }
      else if (/^#\s/.test(line)) { section = '0'; heading = cleanPassage(text); }
      else heading = cleanPassage(`${section} ${text}`);
      i++;
      continue;
    }
    if (isFence(line)) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !isFence(lines[i])) buf.push(lines[i++]);
      i++;
      push('code', buf.join('\n'));
      continue;
    }
    if (isTable(line)) {
      const rows: string[] = [];
      while (i < lines.length && isTable(lines[i])) rows.push(lines[i++].trim());
      const sep = (r: string) => /^\|?[\s:|-]+\|?$/.test(r) && r.includes('-');
      const header = rows.length > 1 && sep(rows[1]) ? rows[0] : null;
      for (const r of rows.slice(header ? 2 : 0)) if (!sep(r)) push('row', header ? `${header}\n${r}` : r);
      continue;
    }
    if (isQuote(line)) {
      const buf: string[] = [];
      while (i < lines.length && (isQuote(lines[i]) || (lines[i].trim() && !isHeading(lines[i]) && !isTable(lines[i]) && !isBullet(lines[i]) && buf.length && /^\s*\*?\(/.test(lines[i])))) {
        buf.push(lines[i++].replace(/^\s*>\s?/, ''));
      }
      push('quote', buf.join(' '));
      continue;
    }
    if (isBullet(line)) {
      const buf = [line.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, '')];
      i++;
      while (i < lines.length && lines[i].trim() && !isBullet(lines[i]) && !isHeading(lines[i]) && !isTable(lines[i]) && !isQuote(lines[i]) && /^\s+/.test(lines[i])) {
        buf.push(lines[i++].trim());
      }
      push('item', buf.join(' '));
      continue;
    }
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() && !isHeading(lines[i]) && !isTable(lines[i]) && !isBullet(lines[i]) && !isQuote(lines[i]) && !isFence(lines[i]) && !isRule(lines[i])) {
      buf.push(lines[i++].trim());
    }
    if (buf.length) push('para', buf.join(' '));
    else i++;
  }
  return out;
}

// ════════════════════════════════════════════════════════════════════════════
// Ranking: numbers 5, capitalised words 2, other words 1.
// ════════════════════════════════════════════════════════════════════════════

export interface ClaimFeatures { nums: NumToken[]; caps: Set<string>; words: Set<string> }

export function featuresOf(text: string): ClaimFeatures {
  const cw = contentWords(text);
  return { nums: extractNumbers(text), caps: cw.caps, words: cw.words };
}

/** The lexical score the pre-pass ranks passages by (task spec: numbers ×5, capitalised ×2, other ×1). */
export function lexicalScore(f: ClaimFeatures, numKeys: Set<string>, words: Set<string>): number {
  let score = 0;
  const counted = new Set<string>();
  for (const t of f.nums) {
    const k0 = t.keys[0];
    if (counted.has(k0)) continue;
    if (t.keys.some((k) => numKeys.has(k))) { score += t.weight; counted.add(k0); }
  }
  for (const w of f.words) if (words.has(w)) score += f.caps.has(w) ? 2 : 1;
  return score;
}

/**
 * The three passages Jev sees. Slot 1 is the best lexical score. Slots 2 and 3
 * go to whichever passage adds the most figures not yet shown (half its score
 * breaks ties), so a claim naming two clubs gets both clubs' rows. Then, if no
 * shown passage carries a dossier caveat and one scores at least 75% of the
 * third slot, it takes that slot: "the 14–6 count is NOT verified" is evidence.
 */
export function rankPassages(f: ClaimFeatures, passages: Passage[], k = 3): { passage: Passage; score: number }[] {
  const scored = passages
    .map((p) => ({ passage: p, score: lexicalScore(f, p.numKeys, p.words) }))
    .sort((a, b) => b.score - a.score || a.passage.order - b.passage.order);
  if (!scored.length) return [];
  const carries = (s: { passage: Passage }, t: NumToken) => t.keys.some((key) => s.passage.numKeys.has(key));
  const chosen = [scored[0]];
  const covered = new Set(f.nums.filter((t) => carries(scored[0], t)).map((t) => t.keys[0]));
  while (chosen.length < Math.min(k, scored.length)) {
    let best: (typeof scored)[number] | null = null;
    let bestGain = -1;
    for (const s of scored) {
      if (chosen.includes(s)) continue;
      const fresh = new Map(f.nums.filter((t) => !covered.has(t.keys[0]) && carries(s, t)).map((t) => [t.keys[0], t.weight]));
      const gain = [...fresh.values()].reduce((a, w) => a + w, 0) + s.score / 2;
      if (gain > bestGain) { best = s; bestGain = gain; }
    }
    if (!best) break;
    chosen.push(best);
    for (const t of f.nums) if (carries(best, t)) covered.add(t.keys[0]);
  }
  const last = chosen[chosen.length - 1];
  const caveat = scored.find((s) => s.passage.marker && !chosen.includes(s));
  if (chosen.length === k && caveat && caveat.score > 0 && !chosen.some((c) => c.passage.marker) && caveat.score >= 0.75 * last.score) {
    chosen[k - 1] = caveat;
  }
  return chosen;
}

/** Keep the sentences of a long passage that share the most with the claim, in order, within `maxChars`. */
function excerpt(p: Passage, f: ClaimFeatures, maxChars: number): string {
  if (p.text.length <= maxChars) return p.text;
  if (p.type === 'row') return truncateWithNote(p.text, maxChars);
  const parts = p.text.split(/(?<=[.!?;])\s+(?=[A-Z0-9"“(£$€₹[])/);
  const scored = parts.map((s, i) => {
    const nums = extractNumbers(s);
    const cw = contentWords(s);
    return { i, s, score: lexicalScore(f, new Set(nums.flatMap((t) => t.keys)), cw.words) };
  });
  const chosen = new Set<number>();
  let used = 0;
  for (const c of [...scored].sort((a, b) => b.score - a.score || a.i - b.i)) {
    const cost = c.s.length + 3;
    if (used + cost > maxChars) continue;
    chosen.add(c.i);
    used += cost;
  }
  if (!chosen.size) return truncateWithNote(scored.sort((a, b) => b.score - a.score)[0]?.s ?? p.text, maxChars);
  let text = '';
  let last = -1;
  for (const i of [...chosen].sort((a, b) => a - b)) {
    text += (last === -1 ? (i > 0 ? '… ' : '') : i === last + 1 ? ' ' : ' … ') + parts[i];
    last = i;
  }
  return last < parts.length - 1 ? `${text} …` : text;
}

// ════════════════════════════════════════════════════════════════════════════
// The Jev call, one claim at a time.
// ════════════════════════════════════════════════════════════════════════════

const SUPPORT: ChoiceQuestion = {
  type: 'choice',
  instructions: 'Read `claim` and the dossier passages in `passages`. Do the passages back the claim?',
  criteria: {
    supports: 'a passage states this claim or a value it follows from directly',
    contradicts: 'a passage states a different value or fact',
    says_nothing: 'no passage addresses the claim',
  },
};

const whichQuestion = (ids: string[]): ChoiceQuestion => ({
  type: 'choice',
  instructions: 'Which passage in `passages` addresses `claim` most directly, whether it backs the claim or states something different? Answer with that passage\'s id.',
  criteria: Object.fromEntries([...ids.map((id) => [id, `the passage whose id is ${id}`]), ['none', 'no passage addresses the claim']]),
});

export type Bucket = 'supported' | 'contradicts' | 'says_nothing' | 'low' | 'error';
export type Verdict = 'supports' | 'contradicts' | 'says_nothing' | 'error';

export interface ClaimResult extends Claim {
  verdict: Verdict;
  p: number;
  probabilities: Record<string, number>;
  bucket: Bucket;
  passageId: string | null;
  passageP: number;
  passageExcerpt: string;
  top: { id: string; score: number }[];
  /** Deterministic checks: numbers absent from all three passages, a marked passage, a non-verbatim quote. */
  codeFlags: string[];
  error?: string;
  usd: number;
  inputTokens: number;
  /** The model id that answered this call (null on error). */
  model: string | null;
}

function normQuote(s: string): string {
  return s.toLowerCase()
    .replace(/[“”«»„]/g, '"').replace(/[‘’`]/g, "'")
    .replace(/\*\*|\*|__/g, '')
    .replace(/\.\.\.|…/g, '…')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * A caption or callout that ranks the chart's own figures ("furthest below the
 * line", "falls furthest") is arithmetic on the section's data, which Jev must
 * never judge and a dossier passage can wrongly "support". Code flags it for
 * the verifier to recompute. Both ❌ of this kind in the pilot were exactly this.
 */
const SUPERLATIVE = /\b(furthest|farthest|highest|lowest|biggest|smallest|largest|fewest|fastest|slowest|longest|shortest|steepest|sharpest|worst|most|least)\b/i;

function sectionLabel(p: Passage): string {
  return truncateWithNote(p.heading.replace(/\[NEVER PUBLISHED\]/gi, '').replace(/\s+/g, ' ').trim(), 90, '…');
}

async function judge(claim: Claim, passages: Passage[], dossierNorm: string, opts: { threshold: number; use: JevUse; slug: string; tag?: string }): Promise<ClaimResult> {
  const f = featuresOf(claim.text);
  const ranked = rankPassages(f, passages, 3);
  const top = ranked.map((r) => ({ id: r.passage.id, score: r.score }));

  // Fit the state under the guard: shrink the passages, never pack more items in.
  const claimText = truncateWithNote(claim.text, 900);
  let per = Math.floor((stateCharBudget() - claimText.length - 140 - ranked.length * 150) / Math.max(1, ranked.length));
  let state = { claim: claimText, passages: [] as { id: string; section: string; text: string }[] };
  for (let tries = 0; tries < 6; tries++) {
    state = {
      claim: claimText,
      passages: ranked.map((r) => ({ id: r.passage.id, section: sectionLabel(r.passage), text: excerpt(r.passage, f, Math.max(160, per)) })),
    };
    if (stateTokens(state) <= MAX_STATE_TOKENS) break;
    per = Math.floor(per * 0.8);
  }

  // Code's checks, independent of Jev.
  const codeFlags: string[] = [];
  const shownKeys = new Set(ranked.flatMap((r) => [...r.passage.numKeys]));
  const missing = [...new Map(f.nums.filter((t) => !t.temporal && !t.keys.some((k) => shownKeys.has(k))).map((t) => [t.keys[0], t.raw])).values()];
  if (claim.type === 'quote') {
    const q = normQuote(claim.quote ?? claim.text).replace(/^"|"$/g, '');
    if (q.length > 12 && !dossierNorm.includes(q)) codeFlags.push('quote not verbatim in the dossier');
  }
  if ((claim.type === 'caption' || claim.type === 'annotation') && SUPERLATIVE.test(claim.text)) {
    codeFlags.push(`ranks the chart's figures ("${claim.text.match(SUPERLATIVE)![0]}"): recompute it from the section's own data`);
  }

  const base = { ...claim, top, usd: 0, inputTokens: 0, model: null };
  let res;
  try {
    res = await jev(state, { support: SUPPORT, which: whichQuestion(ranked.map((r) => r.passage.id)) }, { use: opts.use, slug: opts.slug, tag: opts.tag });
  } catch (err) {
    return { ...base, verdict: 'error', p: 0, probabilities: {}, bucket: 'error', passageId: null, passageP: 0, passageExcerpt: '', codeFlags, error: (err as Error).message };
  }
  const support = pickOf(res.answers.support as ChoiceAnswer, opts.threshold);
  const which = pickOf(res.answers.which as ChoiceAnswer, 0);
  const verdict = support.pick as Verdict;
  const cited = passages.find((p) => p.id === which.pick) ?? (verdict === 'supports' ? ranked[0]?.passage : undefined);
  if (verdict === 'supports' && missing.length) codeFlags.push(`not in the passages shown: ${missing.slice(0, 6).join(', ')}`);
  if (cited?.marker && verdict !== 'says_nothing') codeFlags.push(`passage ${cited.id} is marked ${cited.marker}`);
  const bucket: Bucket = !support.confident ? 'low' : verdict === 'supports' ? 'supported' : verdict === 'contradicts' ? 'contradicts' : 'says_nothing';
  return {
    ...base,
    verdict,
    p: support.p,
    probabilities: (res.answers.support as ChoiceAnswer).probabilities,
    bucket,
    passageId: which.pick === 'none' ? null : which.pick,
    passageP: which.p,
    // A table row's first line is its header, so the excerpt shows the row itself.
    passageExcerpt: cited ? (cited.type === 'row' ? cited.text.split('\n').pop() ?? '' : cited.text).replace(/\s+/g, ' ').slice(0, 160) : '',
    codeFlags,
    usd: res.usage.usd,
    inputTokens: res.usage.inputTokens,
    model: res.model,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// The run, the report and the block for the verifier's prompt.
// ════════════════════════════════════════════════════════════════════════════

export interface JevVerifyOptions {
  draftPath: string;
  dossierPath: string;
  outPath: string;
  /** Default: jevThreshold('verify'), 0.90 unless configured. */
  threshold?: number;
  /** Calls in flight at once. Default 4 (the limit is 1,200 a minute). */
  concurrency?: number;
  /** Ledger tag. Default 'verify'. The pilot passes 'pilot'. */
  use?: JevUse;
  tag?: string;
  /** Dossier top-level sections that are not evidence. Default §0, §7, §8. */
  excludeSections?: string[];
  /** Progress lines to stderr. Default true. */
  log?: boolean;
}

export interface JevVerifyResult {
  title: string;
  slug: string;
  draft: string;
  dossier: string;
  out: string;
  route: { provider: string; model: string };
  answeredBy: string | null;
  threshold: number;
  generatedAt: string;
  summary: { claims: number; supported: number; contradicts: number; saysNothing: number; low: number; errors: number; flagged: number; sourceLines: number };
  claims: ClaimResult[];
  /** Every section's source-line check, flagged or clean. */
  sourceLines: SourceLineCheck[];
  forVerifier: { contradicts: ClaimResult[]; saysNothing: ClaimResult[]; low: ClaimResult[]; errors: ClaimResult[]; flagged: ClaimResult[]; sourceLines: SourceLineCheck[] };
  cost: { usd: number; calls: number; inputTokens: number };
  ms: number;
  passages: number;
}

const rel = (p: string) => {
  const r = relative(REPO_ROOT, p);
  return (r && !r.startsWith('..') && !isAbsolute(r) ? r : p).replace(/\\/g, '/');
};
const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const p2 = (p: number) => p.toFixed(2);

export async function runJevVerify(opts: JevVerifyOptions): Promise<JevVerifyResult> {
  const started = Date.now();
  const log = opts.log ?? true;
  const threshold = opts.threshold ?? jevThreshold('verify');
  const use = opts.use ?? 'verify';
  const raw = readFileSync(opts.draftPath, 'utf-8');
  const fm = matter(raw).data as Obj;
  const slug = String(fm.id ?? '').replace(/^\d{4}-\d{2}-\d{2}-/, '') || 'unknown';
  const dossierMd = readFileSync(opts.dossierPath, 'utf-8');
  const passages = parseDossier(dossierMd, opts.excludeSections ?? DEFAULT_EXCLUDED_SECTIONS);
  const dossierNorm = normQuote(dossierMd);
  const claims = extractClaims(fm);
  if (log) console.error(`[jev-verify] ${claims.length} claims · ${passages.length} dossier passages · threshold ${threshold} · ${use}`);

  let done = 0;
  const results = await mapPool(claims, opts.concurrency ?? 4, async (c) => {
    const r = await judge(c, passages, dossierNorm, { threshold, use, slug, tag: opts.tag });
    done++;
    if (log && (done % 20 === 0 || done === claims.length)) console.error(`[jev-verify] ${done}/${claims.length}`);
    return r;
  });

  const by = (b: Bucket) => results.filter((r) => r.bucket === b);
  const lowFirst = (a: ClaimResult, b: ClaimResult) => (a.probabilities.supports ?? 0) - (b.probabilities.supports ?? 0);
  const sourceLines = checkSourceLines(fm);
  const forVerifier = {
    contradicts: by('contradicts').sort((a, b) => b.p - a.p),
    saysNothing: by('says_nothing').sort((a, b) => b.p - a.p),
    low: by('low').sort(lowFirst),
    errors: by('error'),
    flagged: by('supported').filter((r) => r.codeFlags.length),
    sourceLines: sourceLines.filter((s) => s.flags.length),
  };
  const calls = results.filter((r) => r.bucket !== 'error').length;
  const result: JevVerifyResult = {
    title: flat(String(fm.title ?? slug)),
    slug,
    draft: rel(opts.draftPath),
    dossier: rel(opts.dossierPath),
    out: rel(opts.outPath),
    route: jevRoute(),
    answeredBy: null,
    threshold,
    generatedAt: new Date().toISOString(),
    summary: {
      claims: results.length,
      supported: by('supported').length,
      contradicts: forVerifier.contradicts.length,
      saysNothing: forVerifier.saysNothing.length,
      low: forVerifier.low.length,
      errors: forVerifier.errors.length,
      flagged: forVerifier.flagged.length,
      sourceLines: forVerifier.sourceLines.length,
    },
    claims: results,
    sourceLines,
    forVerifier,
    cost: { usd: results.reduce((s, r) => s + r.usd, 0), calls, inputTokens: results.reduce((s, r) => s + r.inputTokens, 0) },
    ms: Date.now() - started,
    passages: passages.length,
  };
  const models = [...new Set(results.map((r) => r.model).filter((m): m is string => Boolean(m)))];
  result.answeredBy = models.length ? models.join(', ') : null;
  mkdirSync(dirname(opts.outPath), { recursive: true });
  writeFileSync(opts.outPath, renderReport(result));
  return result;
}

function claimLine(r: ClaimResult): string {
  const where = r.passageId ? ` · passage \`${r.passageId}\`: "${r.passageExcerpt.slice(0, 120)}${r.passageExcerpt.length > 120 ? '…' : ''}"` : ' · no passage cited';
  const probs = Object.entries(r.probabilities).map(([k, v]) => `${k} ${p2(v)}`).join(', ');
  const flags = r.codeFlags.length ? ` · **code:** ${r.codeFlags.join(' · ')}` : '';
  return `- **#${r.n}** ${r.location}: "${r.text}" · ${r.verdict}${r.verdict === 'error' ? `: ${r.error}` : ` (${probs})`}${where}${flags}`;
}

/** The "For the verifier" block: only what Jev did not confidently support, most serious first. */
export function formatForVerifier(r: JevVerifyResult): string {
  const f = r.forVerifier;
  const groups: [string, string, ClaimResult[]][] = [
    ['Contradicts', 'A passage states a different value or fact.', f.contradicts],
    ['Says nothing', 'No passage the pre-pass found addresses the claim.', f.saysNothing],
    ['Low confidence', `No answer reached p ≥ ${p2(r.threshold)}. Sorted by p(supports), lowest first.`, f.low],
    ['Not checked', 'The Jev call failed.', f.errors],
    ['Supported by Jev, flagged by code', 'A figure in the claim is in none of the passages shown, a quote is not verbatim, the passage carries a dossier caveat, or a caption ranks the chart\'s own figures.', f.flagged],
  ];
  const out = [
    `Jev pre-pass (${r.summary.claims} claims, threshold ${p2(r.threshold)}): ${r.summary.supported} confidently supported, ${r.summary.contradicts} contradicted, ${r.summary.saysNothing} with nothing in the dossier, ${r.summary.low} low confidence, ${r.summary.flagged} supported but flagged by code${r.summary.errors ? `, ${r.summary.errors} not checked` : ''}. ${r.summary.sourceLines} of ${r.sourceLines.length} sections flagged on their source line.`,
    'This is routing, not a verdict: audit every claim as usual, and start with these.',
  ];
  for (const [name, why, list] of groups) {
    if (!list.length) continue;
    out.push('', `### ${name} (${list.length})`, '', why, '', ...list.map(claimLine));
  }
  if (f.sourceLines.length) {
    out.push('', `### Source lines (${f.sourceLines.length})`, '', 'Each section\'s source line against the publishers of its sourceRefs. Code only, no Jev.', '');
    for (const s of f.sourceLines) {
      out.push(`- **${s.location}**: ${s.line ? `"${s.line}"` : 'no source line'} · cites ${s.publishers.length ? s.publishers.join(', ') : 'nothing'} · ${s.flags.join(' · ')}`);
    }
  }
  return out.join('\n');
}

function renderReport(r: JevVerifyResult): string {
  const s = r.summary;
  const rows = r.claims.map((c) => {
    const verdict = c.verdict === 'error' ? 'error' : `${c.verdict}${c.bucket === 'low' ? ' (low)' : ''}`;
    return `| ${c.n} | ${cell(c.text)} | ${cell(c.location)} | ${verdict} | ${c.verdict === 'error' ? '—' : p2(c.p)} | ${c.passageId ?? '—'} | ${cell(c.passageExcerpt)} | ${cell(c.codeFlags.join(' · ')) || '—'} |`;
  });
  return [
    `# Jev pre-pass: ${r.title}`,
    '',
    `- **Draft:** ${r.draft}`,
    `- **Dossier:** ${r.dossier}`,
    `- **Run:** ${r.generatedAt.slice(0, 10)} · ${r.answeredBy ?? r.route.model} via ${r.route.provider} · threshold p ≥ ${p2(r.threshold)} · ${r.passages} dossier passages (§0, §7, §8 excluded)`,
    `- **Cost:** $${r.cost.usd.toFixed(5)} · ${r.cost.calls} calls · ${r.cost.inputTokens.toLocaleString('en-US')} input tokens · ${(r.ms / 1000).toFixed(1)} s`,
    '',
    '> A pre-pass, not a gate (docs/COST-PLAN.md CP-06). Each claim was compared with the three',
    '> dossier passages that share the most numbers and names with it, one claim per Jev call.',
    '> "Supports" means only that Jev read a passage as stating the claim. The verifier owns every',
    '> verdict, every quote, all arithmetic and every date. The code checks are deterministic:',
    '> a figure in the claim that none of the passages shown carries, a quote not found verbatim,',
    '> a passage the dossier marks [PARTIAL] / [UNVERIFIED] / [HISTORICAL], a caption or callout',
    '> that ranks the chart\'s own figures ("furthest", "highest"), which only a recomputation settles,',
    '> and each section\'s source line against the publishers of its sourceRefs.',
    '',
    `**Summary:** ${s.claims} claims · ${s.supported} confident support (p ≥ ${p2(r.threshold)}) · ${s.contradicts} contradicts · ${s.saysNothing} says nothing · ${s.low} low confidence · ${s.flagged} supported but flagged by code${s.errors ? ` · ${s.errors} errors` : ''} · ${s.sourceLines} of ${r.sourceLines.length} sections flagged on their source line`,
    '',
    '## For the verifier',
    '',
    formatForVerifier(r),
    '',
    '## Every claim',
    '',
    '| # | Claim | Location | Verdict | p | Passage id | Passage excerpt (first 160 chars) | Code check |',
    '|---|---|---|---|---|---|---|---|',
    ...rows,
    '',
  ].join('\n');
}
