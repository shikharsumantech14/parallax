/**
 * Single-shot prompt assembly for the pipeline's writing passes
 * (docs/COST-PLAN.md CP-03, signed 2026-09-28).
 *
 * Until 2026-09-28 every pass read its own inputs, one Read at a time: 18 to
 * 41 API requests a run, each re-reading the whole context, and the drafter
 * read its own dossier and storyboard twice. Now `scripts/pipeline.ts`
 * gathers every input here, labels it, and inlines it into one prompt. The
 * agent answers once and writes its one file once.
 *
 * Every path is repo-relative and read from process.cwd(), which is the repo
 * root for every pipeline run. Line endings are normalised to \n: half the
 * reference files are CRLF (src/content/config.ts, the catalog, the voice
 * contract), and a carriage return is a token that carries nothing.
 *
 * The file resolvers copy the small logic in `scripts/lib/prompts.ts` rather
 * than import it, so this module depends on no file that other work edits.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

/** Measured on this repo's markdown with the Opus 5 tokenizer: 2.5 to 2.8
 *  characters per token (docs/cost/2026-09-27-cost-levers.md §5). */
export const CHARS_PER_TOKEN = 2.7;

const CATALOG      = 'docs/design/catalog.md';
const CONFIG_TS    = 'src/content/config.ts';
const VOICE_CORE   = 'research/_voice/_voice-core.md';
const CANON        = 'docs/design/CANON.md';
const LENS         = 'docs/design/LENS.md';
const GRAPH        = 'docs/generated/PROJECT-GRAPH.md';
const RULE         = '.claude/rules/issue-authoring.md';
const ISSUES_DIR   = 'src/content/issues';

const root      = (): string => process.cwd();
const abs       = (rel: string): string => join(root(), rel);
const toPosix   = (p: string): string => p.replace(/\\/g, '/');
const escapeRe  = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalise = (s: string): string => s.replace(/\r\n?/g, '\n');

/** `2026-09-17-glacier-lake` → `glacier-lake`. A bare slug passes through. */
export const bareSlug = (s: string): string => s.replace(/^\d{4}-\d{2}-\d{2}-/, '');

/** Today's date as YYYY-MM-DD in IST (Asia/Kolkata), the pipeline's clock. */
export function todayIST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

/** A YYYY-MM-DD date moved by `days` (negative for the past). */
function shiftDate(ymd: string, days: number): string {
  const d = new Date(`${ymd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** A repo-relative file as text, line endings normalised. */
export function readRepo(rel: string): string {
  return normalise(readFileSync(abs(rel), 'utf-8'));
}

export function existsRepo(rel: string): boolean {
  return existsSync(abs(rel));
}

// ── Blocks ────────────────────────────────────────────────────────────────────

/** One labelled input. `text` is the form that goes into the prompt:
 *  `\n\n===== <label> (<source>) =====\n<content>\n===== end <label> =====\n` */
export interface Block {
  label: string;
  /** Where the content came from: a repo-relative path, with a section note when it is an extract. */
  source: string;
  content: string;
  text: string;
}

/** A block from content already in hand (an extract, a derived list). */
export function textBlock(label: string, source: string, content: string): Block {
  const body = normalise(content).replace(/\s+$/, '');
  return {
    label,
    source,
    content: body,
    text: `\n\n===== ${label} (${source}) =====\n${body}\n===== end ${label} =====\n`,
  };
}

/** A whole repo file as a block. */
export function block(label: string, path: string): Block {
  const rel = toPosix(path);
  return textBlock(label, rel, readRepo(rel));
}

// ── Assembly ──────────────────────────────────────────────────────────────────

export interface InventoryRow { label: string; path: string; chars: number }

export interface Assembled {
  text: string;
  chars: number;
  estTokens: number;
  inventory: InventoryRow[];
  /** The repo-relative files the prompt tells the agent to write, set by the
   *  builder, so the script's checks after the run look at the same paths. */
  out?: string[];
}

/** A prompt part: a block, a run of instruction text, or nothing (skipped). */
export type Part = Block | string | null | undefined | false;

/** Concatenate the parts in order. Plain strings are the instructions and
 *  appear in the inventory as `instructions`. */
export function assembled(parts: Part[]): Assembled {
  let text = '';
  const inventory: InventoryRow[] = [];
  for (const p of parts) {
    if (!p) continue;
    if (typeof p === 'string') {
      text += p;
      inventory.push({ label: 'instructions', path: '(prompt text)', chars: p.length });
    } else {
      text += p.text;
      inventory.push({ label: p.label, path: p.source, chars: p.text.length });
    }
  }
  return { text, chars: text.length, estTokens: Math.round(text.length / CHARS_PER_TOKEN), inventory };
}

/** The inventory as an aligned table, for `--dry-run`. */
export function formatInventory(a: Assembled): string {
  const k = (n: number) => (n / 1000).toFixed(1) + 'k';
  const rows = a.inventory.map(r => {
    const t = Math.round(r.chars / CHARS_PER_TOKEN);
    return `  ${r.label.slice(0, 44).padEnd(44)} ${k(r.chars).padStart(7)} chars ${k(t).padStart(6)} tok   ${r.path}`;
  });
  return [
    ...rows,
    `  ${'TOTAL'.padEnd(44)} ${k(a.chars).padStart(7)} chars ${k(a.estTokens).padStart(6)} tok   (at ${CHARS_PER_TOKEN} chars per token)`,
  ].join('\n');
}

// ── Markdown helpers ──────────────────────────────────────────────────────────

interface Heading { line: number; level: number; text: string }

/** ATX headings outside fenced code blocks. */
function headingsOf(lines: string[]): Heading[] {
  const out: Heading[] = [];
  let inFence = false;
  lines.forEach((l, i) => {
    if (/^\s*(```|~~~)/.test(l)) { inFence = !inFence; return; }
    if (inFence) return;
    const m = /^(#{1,6})\s+(.*?)\s*$/.exec(l);
    if (m) out.push({ line: i, level: m[1].length, text: m[2] });
  });
  return out;
}

/** The section under the first heading (at `level`, when given) whose text
 *  passes `match`, heading line included, up to the next heading at the same
 *  or a higher level. Null when no heading matches. */
export function mdSection(text: string, match: (heading: string) => boolean, level?: number): string | null {
  const lines = normalise(text).split('\n');
  const hs = headingsOf(lines);
  const i = hs.findIndex(h => (level === undefined || h.level === level) && match(h.text));
  if (i < 0) return null;
  const start = hs[i];
  const end = hs.slice(i + 1).find(h => h.level <= start.level);
  return lines.slice(start.line, end ? end.line : lines.length).join('\n').replace(/\s+$/, '');
}

/** `## 3. The beats` style sections: heading text starting `3.` or `§3`. */
function numberedSection(text: string, n: number, level = 2): string | null {
  return mdSection(text, h => new RegExp(`^(?:§\\s*)?${n}(?:\\.|\\s|$)`).test(h), level);
}

/**
 * The number the next section appended to a dossier takes: one past the
 * highest `## N.` or `## §N` heading outside a code fence. A fresh dossier
 * ends at `## 9.`, so its first check pass is §10, a top-up after it §11, and
 * a second check pass after that §12.
 */
export function nextDossierSection(text: string): number {
  let max = 0;
  for (const h of headingsOf(normalise(text).split('\n'))) {
    if (h.level !== 2) continue;
    const m = /^(?:§\s*(\d+)\b|(\d+)\.)/.exec(h.text);
    if (m) max = Math.max(max, Number(m[1] ?? m[2]));
  }
  return max + 1;
}

interface MdTable { header: string[]; rows: string[][] }

function splitRow(line: string): string[] {
  const t = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return t.split(/(?<!\\)\|/).map(c => c.trim());
}

/** Every pipe table in `text`: a `|` header row followed by a `|---|` row. */
function mdTables(text: string): MdTable[] {
  const lines = normalise(text).split('\n');
  const out: MdTable[] = [];
  for (let i = 0; i < lines.length - 1; i++) {
    if (!/^\s*\|/.test(lines[i]) || !/^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) continue;
    const header = splitRow(lines[i]);
    const rows: string[][] = [];
    let j = i + 2;
    while (j < lines.length && /^\s*\|/.test(lines[j])) { rows.push(splitRow(lines[j])); j++; }
    out.push({ header, rows });
    i = j - 1;
  }
  return out;
}

const cellText = (c: string): string => c.replace(/[`*_]/g, '').trim().toLowerCase();

/** Registered kinds named in a table cell. Backticked names win when the cell
 *  has any, so a note like "(not prose)" beside `timeline` adds nothing. */
function kindsInCell(cell: string, known: Set<string>): string[] {
  const ticked = [...cell.matchAll(/`([a-z][a-z0-9-]*)`/g)].map(m => m[1]).filter(k => known.has(k));
  if (ticked.length) return ticked;
  return (cell.match(/[a-z][a-z0-9]*(?:-[a-z0-9]+)*/g) ?? []).filter(k => known.has(k));
}

// ── The component library ─────────────────────────────────────────────────────

let kindsCache: string[] | null = null;

/** `SECTION_KINDS` from src/content/config.ts, in registry order (the file is
 *  parsed, not imported: it imports `astro:content`, which exists only inside
 *  an Astro build). */
export function sectionKindsList(): string[] {
  if (kindsCache) return kindsCache;
  const src = readRepo(CONFIG_TS);
  const m = /export const SECTION_KINDS = \[([\s\S]*?)\] as const;/.exec(src);
  if (!m) throw new Error(`SECTION_KINDS not found in ${CONFIG_TS}`);
  const body = m[1].split('\n').map(l => l.replace(/\/\/.*$/, '')).join('\n');
  const kinds = [...body.matchAll(/'([a-z0-9-]+)'/g)].map(x => x[1]);
  if (kinds.length < 50) throw new Error(`SECTION_KINDS parsed to ${kinds.length} kinds; expected about 100`);
  kindsCache = kinds;
  return kinds;
}

export function sectionKindsBlock(): Block {
  const kinds = sectionKindsList();
  return textBlock(
    'SECTION_KINDS',
    CONFIG_TS,
    `${kinds.length} registered kinds, in registry order. Use nothing outside this list. \`hero\` is retired and not in it.\n\n${kinds.join(', ')}`,
  );
}

/** The issue frontmatter schema: config.ts from `const sourceSchema` to the
 *  end of `const issuesCollection`, comments kept (they carry rules). */
export function issueSchemaBlock(): Block {
  const src = readRepo(CONFIG_TS);
  const start = src.indexOf('const sourceSchema');
  const coll = src.indexOf('const issuesCollection');
  const end = coll < 0 ? -1 : src.indexOf('\n});', coll);
  if (start < 0 || end < 0) throw new Error(`The issue schema was not found in ${CONFIG_TS}`);
  return textBlock('ISSUE FRONTMATTER SCHEMA', `${CONFIG_TS}, sourceSchema to issuesCollection`, src.slice(start, end + 4));
}

let catalogCache: Map<string, string> | null = null;

/** catalog.md split into its `## <kind>` blocks. */
function catalogIndex(): Map<string, string> {
  if (catalogCache) return catalogCache;
  const map = new Map<string, string>();
  let cur: string | null = null;
  let buf: string[] = [];
  const flush = () => { if (cur) map.set(cur, buf.join('\n').replace(/\s+$/, '')); };
  for (const l of catalogForPrompt().split('\n')) {
    const m = /^## (\S+)\s*$/.exec(l);
    if (m) { flush(); cur = m[1]; buf = [l]; continue; }
    if (cur) buf.push(l);
  }
  flush();
  catalogCache = map;
  return map;
}

/** The `## <kind>` blocks of docs/design/catalog.md for the given kinds, in
 *  the order given, deduplicated. A kind with no block says so in place. */
export function catalogBlocks(kinds: string[]): Block {
  const idx = catalogIndex();
  const wanted = [...new Set(kinds)];
  const parts = wanted.map(k => idx.get(k) ?? `## ${k}\n(no block for this kind in ${CATALOG})`);
  return textBlock('CATALOG BLOCKS', `${CATALOG}: ${wanted.join(', ')}`, parts.join('\n\n'));
}

/** The catalog as a pass reads it: every block without its BUILD line.
 *  BUILD (Lens Phase 7) is the order the build island animates a figure in,
 *  which a component author needs and no writing pass acts on: about 13k
 *  characters across 87 blocks. CUES stays, because the composer and the
 *  drafter author `at` from it. */
function catalogForPrompt(): string {
  return readRepo(CATALOG).split('\n').filter(l => !l.startsWith('- **BUILD:**')).join('\n');
}

/** The whole catalog, every kind (its BUILD lines left out). */
export function catalogFull(): Block {
  return textBlock('CATALOG (all kinds)', `${CATALOG}, BUILD lines left out`, catalogForPrompt());
}

export function catalogShapes(): Block {
  return block('CATALOG SHAPES', 'docs/design/catalog-shapes.md');
}

/** The kinds named in a storyboard's §3 (every table there with a `Kind`
 *  column, which is the beats table and the per-row copy table), registered
 *  kinds only, first-seen order. */
export function storyboardKinds(storyboardPath: string): string[] {
  const text = readRepo(toPosix(storyboardPath));
  const known = new Set(sectionKindsList());
  const s3 = numberedSection(text, 3) ?? '';
  const found: string[] = [];
  const add = (k: string) => { if (!found.includes(k)) found.push(k); };
  for (const t of mdTables(s3)) {
    const col = t.header.findIndex(h => cellText(h) === 'kind');
    if (col < 0) continue;
    for (const row of t.rows) if (row[col] !== undefined) kindsInCell(row[col], known).forEach(add);
  }
  if (!found.length) for (const m of s3.matchAll(/`([a-z][a-z0-9-]*)`/g)) if (known.has(m[1])) add(m[1]);
  return found;
}

/** The kinds an issue file uses, from its `kind:` lines, first-seen order. */
export function issueKinds(issuePath: string): string[] {
  const known = new Set(sectionKindsList());
  const found: string[] = [];
  for (const m of readRepo(toPosix(issuePath)).matchAll(/^\s*-?\s*kind:\s*['"]?([a-z0-9-]+)['"]?\s*$/gm)) {
    if (known.has(m[1]) && !found.includes(m[1])) found.push(m[1]);
  }
  return found;
}

// ── Standing reference files ──────────────────────────────────────────────────

export const voiceCore   = (): Block => block('VOICE CONTRACT', VOICE_CORE);
export const lexicon     = (): Block => block('HINGLISH LEXICON', 'research/_voice/hinglish-lexicon.md');
export const jargon      = (): Block => block('JARGON LIST', 'research/_voice/jargon.md');
export const modeLibrary = (): Block => block('MODE LIBRARY', 'research/_voice/mode-library.md');
export const taxonomy    = (): Block => block('SOURCE TAXONOMY', 'research/_sources/_TAXONOMY.md');
export const allowlist   = (category: string): Block => block(`SOURCE ALLOWLIST (${category})`, `research/_sources/${category}.md`);
export const template    = (name: 'storyboard' | 'dossier' | 'check' | 'candidate'): Block =>
  block(`${name.toUpperCase()} TEMPLATE`, `research/_templates/${name}.md`);
export const issueTemplate = (): Block => block('ISSUE TEMPLATE', `${ISSUES_DIR}/_template/index.mdx`);

/** Numbered sections of the voice contract, e.g. [1, 2] for the panel. */
export function voiceCoreSections(nums: number[]): Block {
  const text = readRepo(VOICE_CORE);
  const parts = nums.map(n => numberedSection(text, n) ?? `(§${n} not found in ${VOICE_CORE})`);
  return textBlock(`VOICE CONTRACT §${nums.join(' AND §')}`, `${VOICE_CORE} §${nums.join(', §')}`, parts.join('\n\n'));
}

/** Numbered sections of CANON.md (the composer takes §2 and §3). */
export function canonSections(nums: number[] = [2, 3]): Block {
  const text = readRepo(CANON);
  const parts = nums.map(n => numberedSection(text, n) ?? `(§${n} not found in ${CANON})`);
  return textBlock(`CANON §${nums.join(' AND §')}`, `${CANON} §${nums.join(', §')}`, parts.join('\n\n'));
}

/** Numbered subsections of docs/design/LENS.md, e.g. ['5.2', '8.2']: the cue
 *  contract and the cover (Lens Phase 7). A single-shot pass cannot open the
 *  file, and the catalog's CUES lines name anchors without saying how a cue
 *  is authored. */
export function lensSections(nums: string[]): Block {
  const text = readRepo(LENS);
  const parts = nums.map(n => mdSection(text, h => h.startsWith(`${n} `), 3) ?? `(§${n} not found in ${LENS})`);
  return textBlock(`LENS §${nums.join(' AND §')}`, `${LENS} §${nums.join(', §')}`, parts.join('\n\n'));
}

/** The kind ledger: PROJECT-GRAPH.md's "Never in a published issue" section. */
export function neverPublishedLedger(): Block {
  const sec = mdSection(readRepo(GRAPH), h => /^Never in a published issue/i.test(h), 2);
  return textBlock('NEVER-PUBLISHED LEDGER', `${GRAPH}, "Never in a published issue"`, sec ?? `(section not found in ${GRAPH})`);
}

/** The rule minus its frontmatter and its preamble. The preamble explains how
 *  Claude Code loads the rule and points at `_AGENTS.md`, a file a
 *  single-shot pass must not open, so the block starts at the first `## `. */
export function issueAuthoringRule(): Block {
  const raw = readRepo(RULE).replace(/^---\n[\s\S]*?\n---\n/, '');
  const at = raw.search(/^## /m);
  return textBlock('ISSUE AUTHORING RULE', `${RULE}, from its first ## heading`, at >= 0 ? raw.slice(at) : raw);
}

/** The digest the post-review pass keeps (CP-05). Empty when there is none. */
export function memoryDigest(agent: string): string {
  const rel = `.claude/agent-memory/${agent}/DIGEST.md`;
  return existsRepo(rel) ? readRepo(rel).trim() : '';
}

export function memoryDigestBlock(agent: string): Block | null {
  const d = memoryDigest(agent);
  return d ? textBlock('MEMORY DIGEST', `.claude/agent-memory/${agent}/DIGEST.md`, d) : null;
}

// ── Storyboard extracts ───────────────────────────────────────────────────────

/** A storyboard's §6, the three questions with their model answers: all the
 *  reader panel may see of the storyboard. */
export function storyboardQuestions(storyboardPath: string): Block {
  const rel = toPosix(storyboardPath);
  const sec = numberedSection(readRepo(rel), 6);
  return textBlock('THE THREE QUESTIONS', `${rel} §6`, sec ?? `(§6 not found in ${rel})`);
}

/** One line per storyboard: its kinds, and which it claimed as new. */
function ledgerLine(rel: string, known: Set<string>): string {
  const text = readRepo(rel);
  const status = /^\s*-\s*\*\*Status:\*\*\s*([a-z-]+)/im.exec(text)?.[1] ?? 'unknown';
  const s9 = numberedSection(text, 9);
  const items: string[] = [];
  if (s9) {
    for (const t of mdTables(s9)) {
      const kindCol = t.header.findIndex(h => cellText(h) === 'kind');
      const newCol = t.header.findIndex(h => /^new/.test(cellText(h)));
      if (kindCol < 0) continue;
      for (const row of t.rows) {
        const kinds = kindsInCell(row[kindCol] ?? '', known);
        const isNew = newCol >= 0 && /^yes/.test(cellText(row[newCol] ?? ''));
        for (const k of kinds) items.push(isNew ? `${k} (NEW)` : k);
      }
    }
  }
  if (items.length) return `${rel} [${status}]: ${[...new Set(items)].join(', ')}`;
  const kinds = storyboardKinds(rel);
  return `${rel} [${status}]: no §9 ledger. Kinds in its §3: ${kinds.join(', ') || '(none found)'}`;
}

/** The §9 kind ledgers of the storyboards dated within the last `days` days
 *  (every desk), one line each, excluding `excludeSlug` (the storyboard
 *  being rewritten). Null when there are none. */
export function recentStoryboardLedgers(excludeSlug: string | null, days = 30): Block | null {
  const today = todayIST();
  const cutoff = shiftDate(today, -days);
  const known = new Set(sectionKindsList());
  const lines: string[] = [];
  const researchDir = abs('research');
  for (const cat of readdirSync(researchDir, { withFileTypes: true })) {
    if (!cat.isDirectory() || cat.name.startsWith('_')) continue;
    for (const f of readdirSync(join(researchDir, cat.name)).sort()) {
      const m = /^(\d{4}-\d{2}-\d{2})-(.+)-storyboard\.md$/.exec(f);
      if (!m || m[1] < cutoff || m[1] > today) continue;
      if (excludeSlug && m[2] === excludeSlug) continue;
      lines.push(ledgerLine(`research/${cat.name}/${f}`, known));
    }
  }
  if (!lines.length) return null;
  return textBlock(
    `OTHER STORYBOARDS SINCE ${cutoff}`,
    `research/*/*-storyboard.md dated ${cutoff} to ${today}, §9 kind ledgers`,
    `One line per storyboard: its kinds, with (NEW) where it claimed the kind as new to the publication.\n\n${lines.join('\n')}`,
  );
}

// ── File resolvers (copied from prompts.ts, see the header) ───────────────────

/** The most recently NAMED file in `dirRel` ending with `suffix`. With
 *  `slug`, only `<date>-<slug><suffix>`. Returns the filename or null. */
function findMostRecentIn(dirRel: string, suffix: string, slug?: string): string | null {
  const exact = slug ? new RegExp(`^\\d{4}-\\d{2}-\\d{2}-(?:\\d{4}-\\d{2}-\\d{2}-)?${escapeRe(bareSlug(slug))}${escapeRe(suffix)}$`) : null;
  try {
    const files = readdirSync(abs(dirRel))
      .filter(f => f.endsWith(suffix) && (!exact || exact.test(f)))
      .sort()
      .reverse();
    return files.length ? files[0] : null;
  } catch {
    return null;
  }
}

const inResearch = (category: string, f: string | null): string | null => (f ? `research/${category}/${f}` : null);

export function dossier(category: string, slug?: string): string | null {
  return inResearch(category, findMostRecentIn(`research/${category}`, '-dossier.md', slug));
}

export function storyboard(category: string, slug?: string): string | null {
  return inResearch(category, findMostRecentIn(`research/${category}`, '-storyboard.md', slug));
}

export function candidates(category: string): string | null {
  return inResearch(category, findMostRecentIn(`research/${category}`, '-candidates.md'));
}

export function checkReport(category: string, slug: string): string | null {
  return inResearch(category, findMostRecentIn(`research/${category}`, '-check.md', slug));
}

/** Agent C's claim-support pre-pass report for the verifier (CP-06 b). */
export function jevPass(category: string, slug: string): string | null {
  return inResearch(category, findMostRecentIn(`research/${category}`, '-jevpass.md', slug));
}

/** A reader-panel report. `first` is `<date>-<slug>-panel.md` (a date-doubled
 *  name from before 2026-09-22 also ends that way), `second` is
 *  `-panel-2.md`, `latest` is whichever of the two was written last. */
export function panelReport(category: string, slug: string, pass: 'first' | 'second' | 'latest'): string | null {
  const dir = `research/${category}`;
  const bare = bareSlug(slug);
  const pick = (suffix: string): string | null => {
    try {
      const files = readdirSync(abs(dir)).filter(f => f.endsWith(suffix)).sort().reverse();
      return files.length ? `${dir}/${files[0]}` : null;
    } catch {
      return null;
    }
  };
  const first = pick(`-${bare}-panel.md`);
  const second = pick(`-${bare}-panel-2.md`);
  if (pass === 'first') return first;
  if (pass === 'second') return second;
  if (!first || !second) return first ?? second;
  return statSync(abs(second)).mtimeMs >= statSync(abs(first)).mtimeMs ? second : first;
}

/** An issue file, `src/content/issues/<dir>/index.mdx`, from its directory
 *  name or its bare slug (then the most recent date wins). */
export function draft(slugOrDir: string): string | null {
  let names: string[];
  try {
    names = readdirSync(abs(ISSUES_DIR), { withFileTypes: true })
      .filter(e => e.isDirectory() && !e.name.startsWith('_'))
      .map(e => e.name);
  } catch {
    return null;
  }
  const bare = bareSlug(slugOrDir);
  const exact = names.includes(slugOrDir) ? [slugOrDir] : [];
  const dated = names.filter(n => new RegExp(`^\\d{4}-\\d{2}-\\d{2}-${escapeRe(bare)}$`).test(n)).sort().reverse();
  for (const n of [...exact, ...dated]) {
    const rel = `${ISSUES_DIR}/${n}/index.mdx`;
    if (existsRepo(rel)) return rel;
  }
  return null;
}

/** The candidate a dossier came from: its `**Candidate:** C-NN` line names the
 *  id and usually the candidates file. Without a file, the desk's most recent
 *  one. Returns the `## C-NN` section as a block, or null. */
export function candidateEntry(category: string, dossierPath: string): Block | null {
  const head = readRepo(toPosix(dossierPath)).split('\n').slice(0, 40).join('\n');
  const m = /\*\*Candidate:\*\*\s*`?(C-\d{2})`?([^\n]*)/.exec(head);
  if (!m) return null;
  const id = m[1];
  const named = /(research\/[^\s`)]+-candidates\.md)/.exec(m[2])?.[1];
  const file = named && existsRepo(named) ? named : candidates(category);
  if (!file) return null;
  const sec = mdSection(readRepo(file), h => new RegExp(`^${id}\\b`).test(h), 2);
  return sec ? textBlock(`CANDIDATE ENTRY ${id}`, file, sec) : null;
}
