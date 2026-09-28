/**
 * The script side of the single-shot passes (docs/COST-PLAN.md CP-03, CP-09,
 * CP-06): what pipeline.ts does around a pass that the pass can no longer do
 * for itself, now that it answers once and writes once.
 *
 * - The drafter's check round: `check:prose` and the schema check on the
 *   first draft. Their flags go back to the drafter in one more request.
 * - The stylist guard: a snapshot before, a field-by-field comparison after,
 *   and a restore when any field outside the stylist's list moved.
 * - The dossier guard: the same for the check pass's rewrite of a dossier.
 * - Merging the drafter's two runs into one result for the one ledger row.
 * - The --dry-run report.
 * - The Jev hooks (Agent C's modules, loaded only when present, CP-06).
 *
 * Nothing here calls a model except through the Jev hooks, and those only
 * when Jev is configured. The guards and the gates are local and free.
 */
import { spawnSync } from 'child_process';
import { existsSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';
import { pathToFileURL } from 'url';
import matter from 'gray-matter';
import { type Assembled, CHARS_PER_TOKEN, formatInventory, jevPass } from './assemble.js';
import { validateIssueFile } from './validate-issue.js';

const abs = (rel: string): string => join(process.cwd(), rel);
const relOf = (file: string): string => file.replace(/\\/g, '/').replace(`${process.cwd().replace(/\\/g, '/')}/`, '');
const msg = (e: unknown): string => (e instanceof Error ? e.message.split('\n')[0] : String(e));

// ── --dry-run ─────────────────────────────────────────────────────────────────

/** The inventory and the size of an assembled prompt. Sends nothing. */
export function printDryRun(title: string, a: Assembled): void {
  const over = a.estTokens > 100_000;
  console.log(`\n  \x1b[1mdry run: ${title}\x1b[0m (assembled, not sent: nothing bills)`);
  console.log(formatInventory(a));
  console.log(`  prompt: ${a.chars.toLocaleString('en-US')} characters, about ${a.estTokens.toLocaleString('en-US')} tokens at ${CHARS_PER_TOKEN} characters per token${over ? '  \x1b[31mOVER 100k\x1b[0m' : ''}`);
}

// ── Outputs that already exist ────────────────────────────────────────────────

/**
 * Claude Code's Write tool refuses to overwrite a file the session has not
 * Read, and a single-shot pass reads nothing: its inputs arrive inlined. The
 * stylist always overwrites the issue, the drafter's check round its first
 * draft, the check pass the dossier it corrects, and any same-day re-run its
 * own earlier output. So before a run every output that already exists is set
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
  /^sections\.\d+\.(intro|skimCaption|plain)$/,
  /^sections\.\d+\.data\.(lead|followup)$/,
  /^sections\.\d+\.data\.paragraphs$/,
];

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

// ── The dossier guard ─────────────────────────────────────────────────────────

const headingLines = (s: string): string[] => s.split('\n').filter(l => /^#{1,6}\s/.test(l)).map(l => l.trim());
const urlsOf = (s: string): Set<string> => new Set(s.match(/https?:\/\/[^\s)>\]|"'`]+/g) ?? []);
const unverifiedCount = (s: string): number => (s.match(/\[UNVERIFIED/g) ?? []).length;

/**
 * The check pass may change numbers in place and append `## §10 Check pass`.
 * A rewrite that lost a heading, a URL or an [UNVERIFIED] marker, or changed
 * more than 5% of the text or of its lines before §10, is refused.
 */
export function dossierGuard(beforeText: string, afterText: string): GuardResult {
  const before = beforeText.replace(/\r\n?/g, '\n');
  const after = afterText.replace(/\r\n?/g, '\n');
  const moved: string[] = [];
  const cut = after.search(/^##\s+(?:§\s*)?10\b.*$/m);
  if (cut < 0) moved.push('no "## §10 Check pass" section was added');
  const pre = cut < 0 ? after : after.slice(0, cut);
  const preHeadings = new Set(headingLines(pre));
  const lostHeadings = headingLines(before).filter(h => !preHeadings.has(h));
  if (lostHeadings.length) moved.push(`headings lost: ${lostHeadings.slice(0, 5).join(' | ')}`);
  const afterUrls = urlsOf(after);
  const lostUrls = [...urlsOf(before)].filter(u => !afterUrls.has(u));
  if (lostUrls.length) moved.push(`URLs lost: ${lostUrls.slice(0, 5).join(', ')}`);
  if (unverifiedCount(pre) < unverifiedCount(before)) moved.push(`[UNVERIFIED] markers: ${unverifiedCount(before)} before, ${unverifiedCount(pre)} after`);
  const drift = Math.abs(pre.trimEnd().length - before.trimEnd().length) / Math.max(1, before.length);
  if (drift > 0.05) moved.push(`the text before §10 changed length by ${(drift * 100).toFixed(1)}%`);
  const beforeLines = before.split('\n').filter(l => l.trim());
  const preLines = new Map<string, number>();
  for (const l of pre.split('\n')) if (l.trim()) preLines.set(l, (preLines.get(l) ?? 0) + 1);
  let changedLines = 0;
  for (const l of beforeLines) {
    const left = preLines.get(l) ?? 0;
    if (left > 0) preLines.set(l, left - 1); else changedLines++;
  }
  if (changedLines > Math.max(15, beforeLines.length * 0.05)) moved.push(`${changedLines} of ${beforeLines.length} lines changed before §10`);
  return { ok: moved.length === 0, changed: [], moved };
}

/** After the check pass: accept its dossier rewrite, or restore the snapshot
 *  and keep the rewrite aside as `<dossier>.check-rejected.md` (a name the
 *  pipeline's `-dossier.md` lookups never match). */
export function enforceDossierGuard(dossierRel: string, snapshot: string): { outcome: GuardOutcome; report: string } {
  const file = abs(dossierRel);
  const after = existsSync(file) ? readFileSync(file, 'utf-8') : '';
  if (after === snapshot) return { outcome: 'unchanged', report: 'dossier guard: the dossier was not rewritten.' };
  const g = dossierGuard(snapshot, after);
  if (g.ok) return { outcome: 'accepted', report: 'dossier guard: the corrected dossier kept every heading, URL and [UNVERIFIED] marker, and carries its §10.' };
  const rejected = file.replace(/\.md$/, '.check-rejected.md');
  writeFileSync(rejected, after);
  writeFileSync(file, snapshot);
  return {
    outcome: 'rejected',
    report: `dossier guard: REFUSED (${g.moved.join('; ')}). The original dossier is restored, and the check pass's version is at ${relOf(rejected)}. Its report stands: apply the corrections by hand.`,
  };
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
