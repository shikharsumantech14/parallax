/**
 * The script side of the single-shot passes (docs/COST-PLAN.md CP-03, CP-09,
 * CP-06): what pipeline.ts does around a pass that the pass can no longer do
 * for itself, now that it answers once and writes once.
 *
 * - The drafter's check round: `check:prose` and the schema check on the
 *   first draft. Their flags go back to the drafter in one more request, on
 *   the first run's resumed session (COST-PLAN §12.5 item 2).
 * - The stylist guard: a snapshot before, a field-by-field comparison after,
 *   and a restore when any field outside the stylist's list moved.
 * - The check pass's corrections: read from its report's §6, applied to the
 *   dossier by the script, and checked by the dossier guard before the
 *   dossier is written (COST-PLAN §12.5 item 1). The agent never writes it.
 * - Merging the drafter's two runs into one result for the one ledger row.
 * - The --dry-run report.
 * - The Jev hooks (Agent C's modules, loaded only when present, CP-06).
 *
 * Nothing here calls a model except through the Jev hooks, and those only
 * when Jev is configured. The guards and the gates are local and free.
 */
import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { basename, dirname, join } from 'path';
import { pathToFileURL } from 'url';
import matter from 'gray-matter';
import { type Assembled, CHARS_PER_TOKEN, formatInventory, jevPass, mdSection, nextDossierSection } from './assemble.js';
import type { RunResult } from './runner.js';
import { validateIssueFile } from './validate-issue.js';

const abs = (rel: string): string => join(process.cwd(), rel);
const relOf = (file: string): string => file.replace(/\\/g, '/').replace(`${process.cwd().replace(/\\/g, '/')}/`, '');
const msg = (e: unknown): string => (e instanceof Error ? e.message.split('\n')[0] : String(e));

// ── --dry-run ─────────────────────────────────────────────────────────────────

/** The inventory and the size of an assembled prompt. Sends nothing. */
export function printDryRun(title: string, a: Assembled, saveAs?: string): void {
  const over = a.estTokens > 100_000;
  console.log(`\n  \x1b[1mdry run: ${title}\x1b[0m (assembled, not sent: nothing bills)`);
  console.log(formatInventory(a));
  console.log(`  prompt: ${a.chars.toLocaleString('en-US')} characters, about ${a.estTokens.toLocaleString('en-US')} tokens at ${CHARS_PER_TOKEN} characters per token${over ? '  \x1b[31mOVER 100k\x1b[0m' : ''}`);
  // The prompt itself, so it can be read (Lens Phase 7): outside the repo, in
  // the OS temp directory, overwritten by the next dry run of the same name.
  if (saveAs) {
    const dir = join(tmpdir(), 'parallax-dry-run');
    mkdirSync(dir, { recursive: true });
    const file = join(dir, `${saveAs.replace(/[^a-z0-9.-]+/gi, '-')}.prompt.txt`);
    writeFileSync(file, a.text);
    console.log(`  saved:  ${file}`);
  }
}

// ── Outputs that already exist ────────────────────────────────────────────────

/**
 * Claude Code's Write tool refuses to overwrite a file the session has not
 * Read, and a single-shot pass reads nothing: its inputs arrive inlined. The
 * stylist always overwrites the issue, the drafter's check round its first
 * draft, and any same-day re-run its own earlier output, a check report among
 * them (the check pass no longer writes the dossier, the script does). So
 * before a run every output that already exists is set
 * aside as `<path>.pre-run` (an extension no lookup, gate or Astro collection
 * reads), and the agent's Write creates the file. `settleOutputs` then puts
 * back each one the agent did not write and removes the set-aside copy of
 * each one it did. A run killed in between leaves the `.pre-run` file on disk,
 * never a lost one.
 */
export function setAsideOutputs(outs: string[] | undefined): Map<string, string> {
  const moved = new Map<string, string>();
  for (const rel of outs ?? []) {
    const file = abs(rel);
    if (!existsSync(file)) continue;
    const aside = `${file}.pre-run`;
    try {
      renameSync(file, aside);
      moved.set(rel, aside);
    } catch (e) {
      console.log(`  \x1b[33mnote:\x1b[0m ${rel} could not be set aside (${msg(e)}). If the agent's Write is refused, it Reads the file once and writes again.`);
    }
  }
  if (moved.size) console.log(`  set aside until the run ends: ${[...moved.keys()].map(r => `${r} → .pre-run`).join(', ')}`);
  return moved;
}

/** After the run: restore what the agent did not write, drop the copies of what it did. */
export function settleOutputs(moved: Map<string, string>): void {
  for (const [rel, aside] of moved) {
    const file = abs(rel);
    try {
      if (existsSync(file)) rmSync(aside, { force: true });
      else { renameSync(aside, file); console.log(`  ${rel} was not rewritten: the copy set aside before the run is back in place.`); }
    } catch (e) {
      console.log(`  \x1b[31mwarning:\x1b[0m could not settle ${rel} (${msg(e)}). The pre-run copy is at ${relOf(aside)}.`);
    }
  }
}

// ── The drafter's check round ─────────────────────────────────────────────────

export interface GateFlags {
  /** The flags for the drafter, one per line (❌ and ⚠️ from check:prose, every schema error). */
  lines: string[];
  /** A gate that could not run. Printed for the operator, never sent to the drafter. */
  toolErrors: string[];
}

/** Run `check:prose` on one issue and the content schema on its file. */
export async function draftGateFlags(issueRel: string): Promise<GateFlags> {
  const dir = basename(dirname(abs(issueRel)));
  const lines: string[] = [];
  const toolErrors: string[] = [];
  // check-prose matches its argument against the issue's directory name.
  const r = spawnSync(process.execPath, [join(process.cwd(), 'scripts', 'check-prose.mjs'), dir], {
    cwd: process.cwd(), encoding: 'utf-8', maxBuffer: 32 * 1024 * 1024,
  });
  if (r.error || r.status !== 0) {
    toolErrors.push(`check:prose did not run cleanly (${r.error ? msg(r.error) : `exit ${r.status}`}) ${(r.stderr ?? '').trim().split(/\r?\n/).slice(-2).join(' / ')}`.trim());
  }
  let sawIssue = false;
  // A flag's note can quote a sentence that carries newlines, so the lines
  // after a flag belong to it until the next flag, a blank line or the table.
  let open = -1;
  for (const l of (r.stdout ?? '').split(/\r?\n/)) {
    if (l.includes(dir)) sawIssue = true;
    const flag = /^\s{2,}(❌|⚠️|ℹ)\s+(\S+)\s+(.*)$/u.exec(l);
    if (flag) {
      if (flag[1] === 'ℹ') { open = -1; continue; } // informational, never sent
      lines.push(`check:prose ${flag[1]} ${flag[2]} ${flag[3].trim()}`);
      open = lines.length - 1;
    } else if (open >= 0 && l.trim() && !/^[─●○]/.test(l.trim())) {
      lines[open] += ` / ${l.trim()}`;
    } else {
      open = -1;
    }
  }
  if (!r.error && r.status === 0 && !sawIssue) toolErrors.push(`check:prose did not report on ${dir}`);
  try {
    const v = await validateIssueFile(issueRel);
    for (const e of v.errors) lines.push(`schema ❌ ${e}`);
  } catch (e) {
    toolErrors.push(`the schema check did not run (${msg(e)})`);
  }
  return { lines, toolErrors };
}

/**
 * Two runs of one phase as one result, for the one ledger row pipeline.ts
 * writes per invocation. Counters add up (tokens, dollars, requests, turns,
 * time, per-model usage), lists concatenate, and the rest takes the second
 * run's value, except `firstRequestTokens`, which stays the first run's (it
 * is the fixed prefix of the first request, not a counter), and the SDK's
 * dollar estimate, which is null unless both runs reported one.
 */
export function mergeRunResults<T>(first: T, second: T): T {
  const merge = (a: unknown, b: unknown, key: string): unknown => {
    if (a === undefined) return b;
    if (b === undefined) return a;
    if (key === 'firstRequestTokens') return a ?? b;
    if (key === 'costUsdSdk') return typeof a === 'number' && typeof b === 'number' ? a + b : null;
    if (key === 'finalMessage' && typeof a === 'string' && typeof b === 'string') return `${a}\n\n── check round ──\n\n${b}`;
    if (key === 'sessionId' && typeof a === 'string' && typeof b === 'string') return a === b ? a : `${a}, ${b}`;
    if (typeof a === 'number' && typeof b === 'number') return a + b;
    if (typeof a === 'boolean' && typeof b === 'boolean') return a && b;
    if (Array.isArray(a) && Array.isArray(b)) {
      const all = [...a, ...b];
      return key === 'permissionDenials' ? all : [...new Set(all)];
    }
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      const out: Record<string, unknown> = {};
      const ao = a as Record<string, unknown>;
      const bo = b as Record<string, unknown>;
      for (const k of new Set([...Object.keys(ao), ...Object.keys(bo)])) out[k] = merge(ao[k], bo[k], k);
      return out;
    }
    return b ?? a;
  };
  return merge(first, second, '') as T;
}

/** A resumed session to continue: its id, and the run that left it. */
export interface ResumeFrom { sessionId: string; from: RunResult }

/**
 * The drafter's check round, run after the first draft when the gates flag
 * something. Since the trial issue (COST-PLAN §12.5 item 2) it resumes the
 * first run's session with `resumePrompt`, the flags alone: the dossier, the
 * storyboard, the reference blocks and the first draft are already in the
 * session, and still in the cache, so they are read back instead of written
 * again. When the session cannot be resumed (the first run reported no
 * session id, or the resumed call ended before its first request) the round
 * runs as it did before, on a fresh session with `freshPrompt` and every
 * input inlined, after a warning. The two runs come back merged for the one
 * ledger row, `resumed` saying which way the round went.
 */
export async function draftCheckRound(args: {
  first: RunResult;
  resumePrompt: Assembled;
  freshPrompt: () => Assembled;
  /** The runner call. `out` is the prompt's declared output, so the run ends at its Write. */
  run: (prompt: string, resume?: ResumeFrom, out?: string[]) => Promise<RunResult>;
}): Promise<{ result: RunResult; how: 'resumed' | 'fresh' }> {
  const { first } = args;
  // The round overwrites the first draft, which the session did not Read.
  const once = async (a: Assembled, resume?: ResumeFrom): Promise<RunResult> => {
    const aside = setAsideOutputs(a.out);
    try { return await args.run(a.text, resume, a.out); } finally { settleOutputs(aside); }
  };
  if (first.sessionId) {
    console.log(`  resuming session ${first.sessionId}: the new prompt is the flags alone, about ${args.resumePrompt.estTokens.toLocaleString('en-US')} tokens\n`);
    const second = await once(args.resumePrompt, { sessionId: first.sessionId, from: first });
    // A round that made a request stands, whatever its outcome: it was paid for.
    if (second.success || second.requests > 0) return { result: { ...mergeRunResults(first, second), resumed: second.resumed === true }, how: 'resumed' };
    console.log(`\n  \x1b[33mcheck round:\x1b[0m the session could not be resumed (${second.errorMessage ?? second.stopReason}). Running the round on a fresh session with every input inlined, as before the trial.`);
  } else {
    console.log(`  \x1b[33mcheck round:\x1b[0m the first run reported no session id, so the round runs on a fresh session with every input inlined.`);
  }
  const fresh = args.freshPrompt();
  console.log(`  (about ${fresh.estTokens.toLocaleString('en-US')} tokens)\n`);
  const second = await once(fresh);
  return { result: { ...mergeRunResults(first, second), resumed: false }, how: 'fresh' };
}

// ── Frontmatter comparison ────────────────────────────────────────────────────

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date);

function sameValue(a: unknown, b: unknown): boolean {
  if (a instanceof Date || b instanceof Date) return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Every path at which `a` and `b` differ. An `atomic` path is compared whole. */
function diffPaths(a: unknown, b: unknown, path: string, out: string[], atomic: (p: string) => boolean): void {
  if (path && atomic(path)) { if (!sameValue(a, b)) out.push(path); return; }
  if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) diffPaths(a[i], b[i], path ? `${path}.${i}` : String(i), out, atomic);
    return;
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diffPaths(a[k], b[k], path ? `${path}.${k}` : k, out, atomic);
    return;
  }
  if (!sameValue(a, b)) out.push(path || '(the whole frontmatter)');
}

function parseIssue(text: string): { data: unknown; body: string } {
  const m = matter(text);
  return { data: structuredClone(m.data), body: m.content.trim() };
}

// ── The stylist guard ─────────────────────────────────────────────────────────

/** The fields the stylist may rewrite (stylist.md Step 6). Everything else is
 *  compared with the snapshot and must not move. */
export const STYLIST_EDITABLE: RegExp[] = [
  // `plain` left this list in Lens Phase 7 (2026-10-01): it is retired, and a
  // legacy one is copied, never rewritten. A cue's `text` joined it: the
  // stylist may reword a cue's sentence in the register, never its `n` or `at`.
  /^sections\.\d+\.(intro|skimCaption)$/,
  /^sections\.\d+\.cues\.\d+\.text$/,
  /^sections\.\d+\.data\.(lead|followup)$/,
  /^sections\.\d+\.data\.paragraphs$/,
];

/** Each section's `[[n]]` cue markers, as a sorted list, outside `cues`
 *  itself. A rewrite may move a marker with its sentence, inside the fields
 *  it may rewrite; it may never drop one or add one (Lens Phase 7). */
function sectionMarkers(data: unknown): string[] {
  const secs = isPlainObject(data) && Array.isArray((data as Record<string, unknown>).sections)
    ? ((data as Record<string, unknown>).sections as unknown[])
    : [];
  return secs.map(s => {
    if (!isPlainObject(s)) return '';
    const { cues: _cues, ...rest } = s as Record<string, unknown>;
    return [...JSON.stringify(rest).matchAll(/\[\[([1-4])\]\]/g)].map(m => m[1]).sort().join(' ');
  });
}

export interface GuardResult {
  ok: boolean;
  /** Every path that differs. */
  changed: string[];
  /** The paths that differ and were not the pass's to change. */
  moved: string[];
}

export function stylistGuard(beforeText: string, afterText: string): GuardResult {
  let before: { data: unknown; body: string };
  let after: { data: unknown; body: string };
  try { before = parseIssue(beforeText); } catch (e) {
    return { ok: false, changed: [], moved: [`the snapshot itself does not parse (${msg(e)}), so no field can be verified`] };
  }
  try { after = parseIssue(afterText); } catch (e) {
    return { ok: false, changed: [], moved: [`the rewritten file does not parse as YAML (${msg(e)})`] };
  }
  const changed: string[] = [];
  // A paragraphs array may change length (a paragraph split or merged), so it is compared whole.
  diffPaths(before.data, after.data, '', changed, p => /^sections\.\d+\.data\.paragraphs$/.test(p));
  if (before.body !== after.body) changed.push('(the MDX body below the frontmatter)');
  const moved = changed.filter(p => !STYLIST_EDITABLE.some(re => re.test(p)));
  const mb = sectionMarkers(before.data);
  const ma = sectionMarkers(after.data);
  for (let i = 0; i < Math.max(mb.length, ma.length); i++) {
    if ((mb[i] ?? '') !== (ma[i] ?? '')) moved.push(`sections.${i} cue markers ([[n]] ${mb[i] || 'none'} before, ${ma[i] || 'none'} after)`);
  }
  return { ok: moved.length === 0, changed, moved };
}

export type GuardOutcome = 'unchanged' | 'accepted' | 'rejected';

/**
 * After the stylist: accept its rewrite, or restore the snapshot and keep
 * the rewrite aside as `_index.rejected.mdx`. The underscore matters: Astro's
 * content collection skips underscore files, as it skips `_template/`, so a
 * rejected file (possibly with broken YAML) cannot reach the build.
 */
export function enforceStylistGuard(issueRel: string, snapshot: string): { outcome: GuardOutcome; report: string } {
  const file = abs(issueRel);
  const after = existsSync(file) ? readFileSync(file, 'utf-8') : '';
  if (after === snapshot) return { outcome: 'unchanged', report: 'stylist guard: the issue file is unchanged (the stylist wrote nothing).' };
  const g = stylistGuard(snapshot, after);
  if (g.ok) {
    return { outcome: 'accepted', report: `stylist guard: ${g.changed.length} prose field(s) changed, every other field identical to the snapshot.` };
  }
  const rejected = join(dirname(file), '_index.rejected.mdx');
  writeFileSync(rejected, after);
  writeFileSync(file, snapshot);
  const list = g.moved.slice(0, 25).join(', ') + (g.moved.length > 25 ? `, and ${g.moved.length - 25} more` : '');
  return {
    outcome: 'rejected',
    report: `stylist guard: REFUSED. ${g.moved.length} field(s) outside the stylist's list moved: ${list}. The snapshot is restored, and the stylist's version is at ${relOf(rejected)}.`,
  };
}

// ── The check pass: its corrections, applied by the script ────────────────────

const lf = (s: string): string => s.replace(/\r\n?/g, '\n');
const headingLines = (s: string): string[] => s.split('\n').filter(l => /^#{1,6}\s/.test(l)).map(l => l.trim());
const urlsOf = (s: string): Set<string> => new Set(s.match(/https?:\/\/[^\s)>\]|"'`]+/g) ?? []);
const unverifiedCount = (s: string): number => (s.match(/\[UNVERIFIED/g) ?? []).length;

/** Where the section a pass appended starts: the first `## §N` heading line
 *  the original does not carry. -1 when there is none. */
function appendedSectionAt(after: string, originalHeadings: Set<string>): number {
  let at = 0;
  for (const line of after.split('\n')) {
    if (/^##\s+§\s*\d+/.test(line) && !originalHeadings.has(line.trim())) return at;
    at += line.length + 1;
  }
  return -1;
}

/**
 * The dossier guard. The check pass changes a dossier only through the script
 * (`applyCheckCorrections`), which replaces each correction's text in place
 * and appends one new `## §N Check pass` section. The guard compares that
 * version with the original: one that lost a heading, a URL or an
 * [UNVERIFIED] marker, or changed more than 5% of the text or of its lines
 * before the new section, is refused.
 *
 * Until 2026-09-28 the guard cut at the first `## §10`, so on a dossier that
 * already carried §10 and §11 it counted both as lost: that is what refused
 * the trial issue's second check pass. The new section is now the first
 * `## §N` heading the original does not have.
 */
export function dossierGuard(beforeText: string, afterText: string): GuardResult {
  const before = lf(beforeText);
  const after = lf(afterText);
  const moved: string[] = [];
  const cut = appendedSectionAt(after, new Set(headingLines(before)));
  if (cut < 0) moved.push('no new "## §N Check pass" section was added');
  const pre = cut < 0 ? after : after.slice(0, cut);
  const preHeadings = new Set(headingLines(pre));
  const lostHeadings = headingLines(before).filter(h => !preHeadings.has(h));
  if (lostHeadings.length) moved.push(`headings lost: ${lostHeadings.slice(0, 5).join(' | ')}`);
  const afterUrls = urlsOf(after);
  const lostUrls = [...urlsOf(before)].filter(u => !afterUrls.has(u));
  if (lostUrls.length) moved.push(`URLs lost: ${lostUrls.slice(0, 5).join(', ')}`);
  if (unverifiedCount(pre) < unverifiedCount(before)) moved.push(`[UNVERIFIED] markers: ${unverifiedCount(before)} before, ${unverifiedCount(pre)} after`);
  const drift = Math.abs(pre.trimEnd().length - before.trimEnd().length) / Math.max(1, before.length);
  if (drift > 0.05) moved.push(`the text before the new section changed length by ${(drift * 100).toFixed(1)}%`);
  const beforeLines = before.split('\n').filter(l => l.trim());
  const preLines = new Map<string, number>();
  for (const l of pre.split('\n')) if (l.trim()) preLines.set(l, (preLines.get(l) ?? 0) + 1);
  let changedLines = 0;
  for (const l of beforeLines) {
    const left = preLines.get(l) ?? 0;
    if (left > 0) preLines.set(l, left - 1); else changedLines++;
  }
  if (changedLines > Math.max(15, beforeLines.length * 0.05)) moved.push(`${changedLines} of ${beforeLines.length} lines changed before the new section`);
  return { ok: moved.length === 0, changed: [], moved };
}

/** One correction from the check report's §6 block. */
export interface CheckCorrection {
  /** The dossier section the text sits in, as the report names it (`§4i`). */
  section: string;
  /** The dossier's text, exactly, occurring once. */
  was: string;
  /** What replaces it. */
  now: string;
  /** One line: the inputs and the formula. */
  why: string;
}

export interface CheckCorrectionsBlock {
  corrections: CheckCorrection[];
  /** Entries that are not a usable correction, each with why. */
  malformed: string[];
  /** The report's `Verdict:` line, when it has one. */
  verdict: string | null;
  /** Why no block could be read at all. */
  error?: string;
}

/**
 * The report's §6: a fenced ```json block `{"corrections":[{section, was,
 * now, why}]}`, the list empty when the verdict is CLEAN. When §6 holds more
 * than one block, the last one that parses wins (a template example left in
 * place comes first). Nothing here guesses: a block that is not valid JSON is
 * an error for the operator, never repaired.
 */
export function parseCheckCorrections(reportText: string): CheckCorrectionsBlock {
  const text = lf(reportText);
  const verdict = /^\s*-\s*\*\*Verdict:\*\*\s*`?([A-Z]+)/m.exec(text)?.[1] ?? null;
  const s6 = mdSection(text, h => /^(?:§\s*)?6(?:\.|\s|$)/.test(h), 2);
  const fences = (src: string) => [...src.matchAll(/^[ \t]*```[ \t]*(json)?[ \t]*\n([\s\S]*?)\n[ \t]*```/gim)];
  const candidates = s6 ? fences(s6) : [];
  const blocks = (candidates.length ? candidates : fences(text).filter(m => m[1])).map(m => m[2]);
  if (!blocks.length) return { corrections: [], malformed: [], verdict, error: 'the report has no ```json corrections block in its §6' };
  let list: unknown[] | null = null;
  let parseError = '';
  for (const b of [...blocks].reverse()) {
    try {
      const data: unknown = JSON.parse(b);
      const found = Array.isArray(data) ? data : isPlainObject(data) ? data.corrections : undefined;
      if (Array.isArray(found)) { list = found; break; }
      parseError ||= 'the block has no "corrections" list';
    } catch (e) {
      parseError ||= `the block is not valid JSON (${msg(e)})`;
    }
  }
  if (!list) return { corrections: [], malformed: [], verdict, error: `its §6 block could not be read: ${parseError}` };
  const corrections: CheckCorrection[] = [];
  const malformed: string[] = [];
  list.forEach((item, i) => {
    if (!isPlainObject(item)) { malformed.push(`#${i + 1}: not an object`); return; }
    const { section, was, now, why } = item;
    if (typeof was !== 'string' || !was) { malformed.push(`#${i + 1}: no "was" text`); return; }
    if (typeof now !== 'string') { malformed.push(`#${i + 1}: no "now" text`); return; }
    corrections.push({ section: typeof section === 'string' ? section : '', was, now, why: typeof why === 'string' ? why : '' });
  });
  return { corrections, malformed, verdict };
}

/** Every place `needle` occurs in `hay`, overlapping ones included. */
function occurrences(hay: string, needle: string): { at: number; end: number }[] {
  const out: { at: number; end: number }[] = [];
  for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + 1)) out.push({ at: i, end: i + needle.length });
  return out;
}

/**
 * Every place `needle` occurs when each run of whitespace in it may match any
 * run of whitespace in `hay`. Dossiers are hard-wrapped near 78 columns, and a
 * clause copied across a wrap rarely keeps the line break and the indent: the
 * trial issue's second check pass wrote its one correction on a single line,
 * where the dossier had it over two.
 */
function looseOccurrences(hay: string, needle: string): { at: number; end: number }[] {
  const words = needle.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const re = new RegExp(words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+'), 'g');
  return [...hay.matchAll(re)].map(m => ({ at: m.index ?? 0, end: (m.index ?? 0) + m[0].length }));
}

export interface CheckApplication {
  /** The dossier with the corrections in place and the new section at the end (LF). */
  text: string;
  /** The new section's number: one past the dossier's last `## §N` or `## N.`. */
  section: number;
  applied: CheckCorrection[];
  refused: { correction: CheckCorrection; reason: string }[];
  /** The applied ones whose `was` matched only with its whitespace loosened. */
  acrossWraps: CheckCorrection[];
}

/**
 * Apply the check pass's corrections to a dossier. Each `was` is looked up in
 * the dossier as it stood when the check pass read it, and replaced by its
 * `now` only when it occurs exactly once: as written, or else with its
 * whitespace matched loosely across a line wrap. A correction is refused,
 * with the reason, when its text occurs nowhere or more than once, when it
 * overlaps another correction, when it touches a heading line, or when its
 * `now` drops a URL or an [UNVERIFIED] marker its `was` carried. The dossier
 * then gains a final `## §N Check pass, <date>` section listing what was
 * applied and what was refused, so every later reader of the dossier sees
 * both.
 */
export function applyCheckCorrections(
  dossierText: string,
  corrections: CheckCorrection[],
  meta: { date: string; reportRel: string; verdict?: string | null },
): CheckApplication {
  const dossier = lf(dossierText);
  const section = nextDossierSection(dossier);
  // Heading lines as [start, end) offsets.
  const headings: [number, number][] = [];
  let pos = 0;
  for (const line of dossier.split('\n')) {
    if (/^#{1,6}\s/.test(line)) headings.push([pos, pos + line.length]);
    pos += line.length + 1;
  }
  const taken: { index: number; at: number; end: number; now: string; loose: boolean }[] = [];
  const refused: CheckApplication['refused'] = [];
  corrections.forEach((c, index) => {
    const was = lf(c.was);
    let now = lf(c.now);
    const refuse = (reason: string) => refused.push({ correction: c, reason });
    if (was.trim() === now.trim()) return refuse('its "was" and "now" are the same text');
    let found = occurrences(dossier, was);
    const loose = found.length === 0;
    if (loose) {
      found = looseOccurrences(dossier, was);
      // The loose match leaves out whitespace at either end of `was`, so `now` does too.
      if (was !== was.trim()) now = now.trim();
    }
    if (found.length === 0) return refuse('its "was" text is not in the dossier');
    if (found.length > 1) return refuse(`its "was" text occurs ${found.length} times in the dossier, so the place is ambiguous`);
    const { at, end } = found[0];
    // The line break on either side of a heading counts as the heading's.
    if (headings.some(([s, e]) => at <= e && end >= s)) return refuse('it touches a heading line');
    const nowUrls = urlsOf(now);
    const dropped = [...urlsOf(was)].filter(u => !nowUrls.has(u));
    if (dropped.length) return refuse(`its "now" drops ${dropped.join(', ')}`);
    if (unverifiedCount(now) < unverifiedCount(was)) return refuse('its "now" drops an [UNVERIFIED] marker');
    const clash = taken.find(t => at < t.end && end > t.at);
    if (clash) return refuse(`it overlaps correction #${clash.index + 1}`);
    taken.push({ index, at, end, now, loose });
  });
  // Splice from the end, so every earlier offset still holds.
  let text = dossier;
  for (const t of [...taken].sort((a, b) => b.at - a.at)) text = text.slice(0, t.at) + t.now + text.slice(t.end);
  const applied = taken.map(t => corrections[t.index]);
  const acrossWraps = taken.filter(t => t.loose).map(t => corrections[t.index]);
  const body = text.trimEnd();
  const rule = /\n---$/.test(body) ? '' : '\n\n---';
  text = `${body}${rule}\n\n${checkSectionText(section, meta, applied, refused)}\n`;
  return { text, section, applied, refused, acrossWraps };
}

/** The `## §N Check pass` section the script appends. */
function checkSectionText(n: number, meta: { date: string; reportRel: string; verdict?: string | null }, applied: CheckCorrection[], refused: CheckApplication['refused']): string {
  const cell = (s: string) => lf(s).trim().replace(/\n+/g, ' / ').replace(/\|/g, '\\|');
  const out = [
    `## §${n} Check pass, ${meta.date}`,
    '',
    `Applied by the pipeline from §6 of the check report \`${meta.reportRel}\`${meta.verdict ? `, verdict **${meta.verdict}**` : ''}. Only the text in the Was column changed. The flags behind the verdict live in the report, not here.`,
    '',
  ];
  if (applied.length) {
    out.push('| # | Where | Was | Now | Why |', '|---|---|---|---|---|');
    applied.forEach((c, i) => out.push(`| ${i + 1} | ${cell(c.section)} | ${cell(c.was)} | ${cell(c.now)} | ${cell(c.why)} |`));
  } else {
    out.push('No correction could be applied.');
  }
  if (refused.length) {
    out.push('', 'Not applied, because the script could not place them in the dossier. Each stays in the report for the operator to check and apply by hand.', '');
    out.push('| # | Where | Was | Now | Why not applied |', '|---|---|---|---|---|');
    refused.forEach((r, i) => out.push(`| ${i + 1} | ${cell(r.correction.section)} | ${cell(r.correction.was)} | ${cell(r.correction.now)} | ${cell(r.reason)} |`));
  }
  return out.join('\n');
}

export interface CheckPassOutcome {
  outcome: GuardOutcome;
  /** Lines for the operator, in order. */
  lines: string[];
  /** True when something needs the operator: a refused correction, an
   *  unreadable block, a dossier the agent wrote, or a guard refusal. */
  needsOperator: boolean;
}

/**
 * After the check pass (COST-PLAN §12.5 item 1). The agent wrote the report
 * and nothing else. This reads the report's §6 corrections, applies them to
 * the snapshot of the dossier taken before the run (`applyCheckCorrections`),
 * runs the dossier guard on the result, and writes the dossier only when the
 * guard accepts it. A refused version is kept aside as
 * `<dossier>.check-rejected.md`, a name no `-dossier.md` lookup matches.
 * `reportFresh` is false when the report on disk is not this run's (the
 * agent wrote none and an earlier one was put back): its corrections were
 * applied by its own run, so they are not applied again.
 */
export function applyCheckPass(args: { dossierRel: string; reportRel: string; snapshot: string; date: string; reportFresh: boolean }): CheckPassOutcome {
  const file = abs(args.dossierRel);
  const lines: string[] = [];
  let needsOperator = false;
  // The agent has Write, and an old habit: a dossier it wrote anyway is kept
  // aside, and the snapshot is what the corrections apply to.
  const onDisk = existsSync(file) ? readFileSync(file, 'utf-8') : '';
  if (onDisk !== args.snapshot) {
    const aside = file.replace(/\.md$/, '.check-agent.md');
    writeFileSync(aside, onDisk);
    writeFileSync(file, args.snapshot);
    lines.push(`check pass: the agent wrote the dossier, which it no longer may. Its version is at ${relOf(aside)}, and the dossier is back as it was before the run.`);
    needsOperator = true;
  }
  const reportFile = abs(args.reportRel);
  if (!existsSync(reportFile) || !args.reportFresh) {
    lines.push(`check pass: no report from this run at ${args.reportRel}, so no correction was applied. The dossier is unchanged.`);
    return { outcome: 'unchanged', lines, needsOperator: true };
  }
  const block = parseCheckCorrections(readFileSync(reportFile, 'utf-8'));
  if (block.error) {
    lines.push(`check pass: ${block.error}. No correction was applied. Read the report's §6 and apply its corrections by hand.`);
    return { outcome: 'unchanged', lines, needsOperator: true };
  }
  for (const m of block.malformed) lines.push(`check pass: correction ${m}. Skipped.`);
  if (block.malformed.length) needsOperator = true;
  if (!block.corrections.length) {
    lines.push(`check pass: the report's §6 lists no corrections${block.verdict ? ` (verdict ${block.verdict})` : ''}. The dossier is unchanged.`);
    return { outcome: 'unchanged', lines, needsOperator };
  }
  const eol = args.snapshot.includes('\r\n') ? '\r\n' : '\n';
  const a = applyCheckCorrections(args.snapshot, block.corrections, { date: args.date, reportRel: args.reportRel, verdict: block.verdict });
  const short = (s: string) => { const t = lf(s).replace(/\s+/g, ' ').trim(); return t.length > 70 ? `${t.slice(0, 67)}...` : t; };
  lines.push(`check pass: ${block.corrections.length} correction(s) in the report's §6, ${a.applied.length} applied, ${a.refused.length} refused.`);
  for (const c of a.applied) lines.push(`  applied  ${c.section || '(no §)'}: "${short(c.was)}" → "${short(c.now)}"${a.acrossWraps.includes(c) ? ' (found across a line wrap)' : ''}`);
  for (const r of a.refused) lines.push(`  refused  ${r.correction.section || '(no §)'}: "${short(r.correction.was)}", because ${r.reason}.`);
  if (a.refused.length) needsOperator = true;
  const g = dossierGuard(args.snapshot, a.text);
  const next = a.text.replace(/\n/g, eol);
  if (!g.ok) {
    const rejected = file.replace(/\.md$/, '.check-rejected.md');
    writeFileSync(rejected, next);
    lines.push(`dossier guard: REFUSED (${g.moved.join('; ')}). The dossier is unchanged, and the corrected version is at ${relOf(rejected)}. The report stands: apply its corrections by hand.`);
    return { outcome: 'rejected', lines, needsOperator: true };
  }
  writeFileSync(file, next);
  lines.push(`dossier guard: every heading, URL and [UNVERIFIED] marker kept. The dossier is written with its new \`## §${a.section} Check pass, ${args.date}\`.`);
  return { outcome: 'accepted', lines, needsOperator };
}

// ── The Jev hooks (CP-06, Agent C's modules) ──────────────────────────────────

type AnyFn = (...args: unknown[]) => unknown;

/** A repo module, when it exists. Null, with a note, when it does not load. */
async function loadOptional(rel: string): Promise<Record<string, unknown> | null> {
  const file = abs(rel);
  if (!existsSync(file)) return null;
  try {
    return (await import(pathToFileURL(file).href)) as Record<string, unknown>;
  } catch (e) {
    console.log(`  jev: ${rel} did not load (${msg(e)}). Skipped.`);
    return null;
  }
}

/** True when the Jev provider is configured. Prints why not otherwise. */
async function jevReady(): Promise<boolean> {
  const core = await loadOptional('scripts/lib/jev.ts');
  if (!core) return false;
  const available = core.jevAvailable as AnyFn | undefined;
  if (typeof available !== 'function') return false;
  if (available()) return true;
  const why = core.jevUnavailableReason as AnyFn | undefined;
  console.log(`  jev: not configured${typeof why === 'function' ? ` (${String(why())})` : ''}. Skipped.`);
  return false;
}

/** The newest `-jevpass.md` for the issue, only when it was written after the
 *  draft it read: a pre-pass of an earlier draft would route the verifier's
 *  attention by claims that have since changed. */
export function freshJevPass(category: string, slug: string, draftRel: string): string | null {
  const j = jevPass(category, slug);
  if (!j || !existsSync(abs(draftRel))) return null;
  return statSync(abs(j)).mtimeMs >= statSync(abs(draftRel)).mtimeMs ? j : null;
}

/**
 * The claim-support pre-pass before the verifier (CP-06 b): Agent C's
 * `runJevVerify`, writing `research/<category>/<today>-<slug>-jevpass.md`.
 * Returns the report's repo-relative path, or null. A failure never stops
 * the verifier: Jev is a filter, never a gate.
 */
export async function jevVerifyPrePass(args: { draftRel: string; dossierRel: string; outRel: string }): Promise<string | null> {
  const mod = await loadOptional('scripts/lib/jev-verify.ts');
  if (!mod) return null;
  const run = mod.runJevVerify as AnyFn | undefined;
  if (typeof run !== 'function') { console.log('  jev: scripts/lib/jev-verify.ts exports no runJevVerify. Skipped.'); return null; }
  if (!(await jevReady())) return null;
  try {
    const r = (await run({ draftPath: abs(args.draftRel), dossierPath: abs(args.dossierRel), outPath: abs(args.outRel) })) as
      { summary?: Record<string, number>; cost?: { usd?: number } } | undefined;
    const s = r?.summary;
    console.log(`  jev: pre-pass written to ${args.outRel}${s ? ` (${s.claims} claims, ${s.supported} confidently supported, ${s.contradicts} contradicted, ${s.saysNothing} with nothing in the dossier, ${s.low} low confidence)` : ''}${r?.cost?.usd !== undefined ? `, $${r.cost.usd.toFixed(4)}` : ''}.`);
    return existsSync(abs(args.outRel)) ? args.outRel : null;
  } catch (e) {
    console.log(`  jev: the pre-pass failed (${msg(e)}). The verifier runs without it.`);
    return null;
  }
}

/**
 * The quiz grade after a panel (CP-06 c): Agent C's `runJevPanel` re-grades
 * each persona's answer beside the panel's own grade. Advisory only.
 */
export async function jevPanelGrade(args: { storyboardRel: string; panelRel: string; outRel: string; slug: string }): Promise<void> {
  const mod = await loadOptional('scripts/lib/jev-panel.ts');
  if (!mod) return;
  const run = mod.runJevPanel as AnyFn | undefined;
  if (typeof run !== 'function') { console.log('  jev: scripts/lib/jev-panel.ts exports no runJevPanel. Skipped.'); return; }
  if (!existsSync(abs(args.panelRel))) { console.log(`  jev: no panel report at ${args.panelRel}. Skipped.`); return; }
  if (!(await jevReady())) return;
  try {
    const r = (await run({ storyboardPath: abs(args.storyboardRel), panelPath: abs(args.panelRel), outPath: abs(args.outRel), slug: args.slug })) as
      { agreement?: { graded: number; agree: number; rate: number }; cost?: { usd?: number } } | undefined;
    const a = r?.agreement;
    console.log(`  jev: quiz grades written to ${args.outRel}${a ? ` (agrees with the panel on ${a.agree} of ${a.graded})` : ''}${r?.cost?.usd !== undefined ? `, $${r.cost.usd.toFixed(4)}` : ''}.`);
  } catch (e) {
    console.log(`  jev: the quiz grade failed (${msg(e)}). The panel's report stands on its own.`);
  }
}
