#!/usr/bin/env node
/**
 * guard-render — PreToolUse(Bash) hook. Turns the AGENTS.md §8 render gate
 * (2026-09-24) from a documented step into an enforced one.
 *
 * `npm run check:render` (scripts/ui-probe.mjs) renders every published issue
 * at 1280 and 375 in headless Chrome and reports blocking findings. Until now
 * nothing stopped a visual change, or a status flip to `published`, being
 * committed without it; the 2026-09-22 and 2026-09-23 rounds both shipped
 * defects a render would have shown. This refuses a `git commit` whose STAGED
 * changes affect rendering unless a fresh, clean run covers them.
 *
 * "Fresh" is exact, not a timestamp: the probe writes research/_ui/last-run.json
 * with the render fingerprint (scripts/lib/render-fingerprint.mjs) taken at the
 * START of its run; this recomputes it now. Any edit to a rendering file since
 * that run, including one made during it, is a mismatch.
 *
 * Rules, in order:
 *   - not a `git commit`, or the operator's PX_SKIP_RENDER_GATE=1 → silent
 *   - nothing rendering-relevant staged → silent. Relevant = the fingerprint's
 *     inputs, plus an issue's index.mdx whose STAGED status is not `draft`
 *   - otherwise require a stamp that: was rendered from a local server; carries
 *     this tree's fingerprint; covered 1280 AND 375; covered the staged scope
 *     (a full run when anything outside src/content/issues/ is staged, else
 *     every staged slug); and found 0 blocking findings.
 *
 * "Staged" means what the commit will actually contain, so a command that
 * stages and commits in one go (`git add x && git commit`, `git commit -a`,
 * `git commit <paths>`) is judged on the files it is about to stage, not on
 * the index as it stands before the command runs. That is the commonest way
 * an agent commits, and the gate would be decorative without it.
 *
 * Same contract as guard-git (docs/CONTEXT-PLAN.md B2): deny with a reason, or
 * exit 0 silently so the normal permission flow runs. Never emits "allow". A
 * crash never blocks: the catch-all exits 0.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { strip, segments, parseGit } from './guard-git.mjs';
import {
  isRenderSource, issueSlugOf, issueStatus, renderFingerprint,
} from '../../scripts/lib/render-fingerprint.mjs';

export const STAMP = 'research/_ui/last-run.json';

/* A quoted run survives parsing as this token, so `-m "msg" path` keeps its
   shape (guard-git's strip would drop the message and let -m eat `path`). */
const Q = '␟';
const FILL = ` ${Q} `;

const norm = (p) => String(p).replace(/\\/g, '/').replace(/^(\.\/)+/, '');

/* git commit options that take the NEXT token as their value. */
const COMMIT_LONG_VALUE = new Set([
  '--message', '--file', '--reuse-message', '--reedit-message', '--author', '--date',
  '--template', '--cleanup', '--fixup', '--squash', '--trailer', '--pathspec-from-file',
]);

function parseCommit(rest) {
  const c = { all: false, amend: false, paths: [], unknownPaths: false };
  let dd = false;
  for (let i = 0; i < rest.length; i++) {
    const t = rest[i];
    if (!dd && t === '--') { dd = true; continue; }
    if (!dd && t.startsWith('--')) {
      const name = t.split('=')[0];
      if (name === '--all') c.all = true;
      else if (name === '--amend') c.amend = true;
      else if (name === '--pathspec-from-file') c.unknownPaths = true;
      if (COMMIT_LONG_VALUE.has(name) && !t.includes('=')) i++;
      continue;
    }
    if (!dd && /^-[^-]/.test(t)) {
      for (let k = 1; k < t.length; k++) {
        const ch = t[k];
        if (ch === 'S' || ch === 'u') break; // optional value, attached
        if (ch === 'a') c.all = true;
        if ('mFCct'.includes(ch)) { if (k === t.length - 1) i++; break; }
      }
      continue;
    }
    if (t.includes(Q)) c.unknownPaths = true;
    else c.paths.push(t);
  }
  return c;
}

function parseAdd(rest) {
  const a = { all: false, update: false, paths: [], unknown: false };
  let dd = false;
  for (let i = 0; i < rest.length; i++) {
    const t = rest[i];
    if (!dd && t === '--') { dd = true; continue; }
    if (!dd && t.startsWith('--')) {
      const name = t.split('=')[0];
      if (name === '--all' || name === '--no-ignore-removal') a.all = true;
      else if (name === '--update') a.update = true;
      else if (name === '--pathspec-from-file') { a.unknown = true; if (!t.includes('=')) i++; }
      continue;
    }
    if (!dd && /^-[^-]/.test(t)) {
      if (t.includes('A')) a.all = true;
      if (t.includes('u')) a.update = true;
      continue;
    }
    if (t.includes(Q)) a.unknown = true;
    else a.paths.push(t);
  }
  return a;
}

/**
 * The shape of a command's commit, or null when it runs no `git commit`.
 * `adds` are the `git add` / `git stage` segments that run BEFORE a commit
 * (an add after the last commit cannot change it).
 */
export function commitPlan(command) {
  if (typeof command !== 'string' || !command.trim()) return null;
  let plan = null;
  let queued = [];
  for (const raw of segments(command, FILL)) {
    // `--author="A B"` → one token, so a quoted VALUE is never read as a path
    const seg = raw.replace(new RegExp(`=\\s*${Q}`, 'g'), `=${Q}`).trim();
    if (!/(^|[/\\\s])git(\s|$)/.test(' ' + seg)) continue;
    const g = parseGit(seg);
    if (!g) continue;
    if (g.sub === 'add' || g.sub === 'stage') { queued.push(parseAdd(g.rest)); continue; }
    if (g.sub !== 'commit') continue;
    const c = parseCommit(g.rest);
    plan = plan || { all: false, amend: false, paths: [], unknownPaths: false, adds: [] };
    plan.all = plan.all || c.all;
    plan.amend = plan.amend || c.amend;
    plan.unknownPaths = plan.unknownPaths || c.unknownPaths;
    plan.paths.push(...c.paths);
    plan.adds.push(...queued);
    queued = [];
  }
  return plan;
}

/** The operator's override: `PX_SKIP_RENDER_GATE=1 git commit …`. Read from the
 *  executable text only, so a commit MESSAGE that mentions it is still checked. */
export function overridden(command) {
  if (typeof command !== 'string') return false;
  return /(^|[\s;&|(])(?:\$env:)?PX_SKIP_RENDER_GATE=1(?=$|[\s;&|)])/m.test(strip(command));
}

/* ── pathspecs ─────────────────────────────────────────────────────────── */
const ALL = Symbol('all');

function rootForms(root) {
  const r = norm(root || '').replace(/\/+$/, '').toLowerCase();
  if (!r) return [];
  const m = /^([a-z]):\/(.*)$/.exec(r);
  return m ? [r, `/${m[1]}/${m[2]}`, `/mnt/${m[1]}/${m[2]}`] : [r];
}

/** A matcher for one pathspec, or ALL when it cannot be resolved narrowly
 *  (`.`, magic, globs over everything, paths outside the repo). Conservative
 *  on purpose: an over-wide match can only add paths to the check. */
function specMatcher(spec, root) {
  let s = norm(spec);
  const lower = s.toLowerCase();
  for (const f of rootForms(root)) {
    if (lower === f) return ALL;
    if (lower.startsWith(f + '/')) { s = s.slice(f.length + 1); break; }
  }
  if (!s || s === '.' || s === '*' || s.startsWith(':') || s.startsWith('../')) return ALL;
  if (s.startsWith('/') || /^[a-z]:\//i.test(s)) return ALL;
  if (/[*?[]/.test(s)) {
    const re = new RegExp('^' + s.replace(/[.+^${}()|\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '(/.*)?$');
    return (p) => re.test(p);
  }
  s = s.replace(/\/+$/, '');
  return (p) => p === s || p.startsWith(s + '/');
}

/**
 * Paths the command itself will stage before committing, chosen from the
 * working tree's tracked changes (`dirty`) and untracked files.
 */
export function pendingPaths(plan, { dirty = [], untracked = [], root = '' } = {}) {
  if (!plan) return [];
  const out = new Set();
  const take = (pool, specs) => {
    if (specs === ALL) { pool.forEach((p) => out.add(norm(p))); return; }
    const ms = specs.map((sp) => specMatcher(sp, root));
    if (ms.includes(ALL)) { pool.forEach((p) => out.add(norm(p))); return; }
    for (const p of pool) if (ms.some((m) => m(norm(p)))) out.add(norm(p));
  };
  for (const a of plan.adds) {
    const specs = a.unknown ? ALL : a.paths.length ? a.paths : (a.all || a.update) ? ALL : null;
    if (!specs) continue; // a bare `git add` stages nothing
    take(dirty, specs);
    if (!a.update || a.all) take(untracked, specs);
  }
  if (plan.all || plan.unknownPaths) take(dirty, ALL);
  else if (plan.paths.length) take(dirty, plan.paths);
  return [...out];
}

/** Staged paths that change a public render. */
export function relevantPaths(staged = [], stagedStatus = {}) {
  return (staged || []).map(norm).filter((p) => {
    if (issueSlugOf(p)) return (stagedStatus || {})[p] !== 'draft';
    return isRenderSource(p);
  });
}

/* ── the decision ──────────────────────────────────────────────────────── */
const RULE = 'BLOCKED by the AGENTS.md §8 render gate (2026-09-24; enforced by .claude/hooks/guard-render.mjs).';
const LOCAL = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
const isLocal = (base) => {
  try { return LOCAL.has(new URL(base).hostname); } catch { return false; }
};
const list = (xs, n = 4) => xs.slice(0, n).join(', ') + (xs.length > n ? ` (+${xs.length - n} more)` : '');

/**
 * state = { staged: string[], stagedStatus: {path: status|null}, stamp: object|null,
 *           fingerprint: string }. Returns a deny reason, or null to stay silent.
 */
export function decide(command, state) {
  if (!commitPlan(command)) return null;
  if (overridden(command)) return null;
  const s = state || {};
  const relevant = relevantPaths(s.staged, s.stagedStatus);
  if (!relevant.length) return null;

  const issues = [...new Set(relevant.map(issueSlugOf).filter(Boolean))].sort();
  const global = relevant.filter((p) => !issueSlugOf(p));
  const run = global.length
    ? '`npm run check:render` (every published issue at 1280 and 375, 2 to 4 minutes)'
    : `\`npm run check:render -- --slug ${issues.join(',')}\``;
  const deny = (why) => `${RULE} This commit stages files that change how pages render: ${list(relevant)}. ${why} `
    + `Run ${run}, fix every blocking finding, and commit again once it is clean. The run writes ${STAMP}, which this check reads. `
    + 'Operator-only override: prefix the commit with PX_SKIP_RENDER_GATE=1. Do not use it without the operator\'s say-so.';

  const st = s.stamp;
  if (!st || typeof st !== 'object') {
    return deny(`No render report covers this tree: ${STAMP} does not exist yet.`);
  }
  const when = st.when ? `(${st.when}) ` : '';
  if (!isLocal(st.base)) {
    return deny(`The last run ${when}rendered ${st.base || 'an unknown server'}, not a local server on this working tree.`);
  }
  if (!st.fingerprint || st.fingerprint !== s.fingerprint) {
    return deny(`The last run ${when}rendered a different tree: the stamp is older than the tree, so you edited rendering files after the last run and its result does not cover them.`);
  }
  const widths = Array.isArray(st.widths) ? st.widths.map(Number) : [];
  if (!widths.includes(1280) || !widths.includes(375)) {
    return deny(`The last run ${when}rendered at ${widths.join(', ') || 'no width'} only. A fix is not done until 1280 AND 375 are both clean.`);
  }
  const slugs = Array.isArray(st.slugs) ? st.slugs : [];
  if (global.length && st.full !== true) {
    return deny(`The last run ${when}was scoped to ${slugs.length ? list(slugs, 3) : 'part of the site'} (--slug), but ${list(global, 3)} ${global.length === 1 ? 'renders' : 'render'} on every page, so only a full run covers ${global.length === 1 ? 'it' : 'them'}.`);
  }
  if (!global.length && st.full !== true) {
    const missing = issues.filter((x) => !slugs.includes(x));
    if (missing.length) return deny(`The last run ${when}did not render ${list(missing, 3)}.`);
  }
  if (st.blocking !== 0) {
    const n = Number.isFinite(st.blocking) ? st.blocking : 'an unknown number of';
    return deny(`The last run ${when}found ${n} blocking finding${st.blocking === 1 ? '' : 's'}${st.report ? `, listed in ${st.report}` : ''}.`);
  }
  return null;
}

/* ── entry ─────────────────────────────────────────────────────────────── */
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function gather(root, plan) {
  const git = (args) => execFileSync('git', ['-c', 'core.quotepath=off', ...args], {
    cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 << 20,
  });
  const names = (args) => git(args).split('\0').filter(Boolean).map(norm);

  const cached = names(['diff', '--cached', '--name-only', '-z', '--diff-filter=AMR']);
  let pending = [];
  if (plan.adds.length || plan.all || plan.paths.length || plan.unknownPaths) {
    const dirty = names(['diff', '--name-only', '-z', '--diff-filter=AMR']);
    const untracked = plan.adds.length ? names(['ls-files', '--others', '--exclude-standard', '-z']) : [];
    pending = pendingPaths(plan, { dirty, untracked, root });
  }
  const staged = [...new Set([...cached, ...pending])];
  const fromTree = new Set(pending);
  const stagedStatus = {};
  for (const p of staged) {
    if (!issueSlugOf(p)) continue;
    try {
      /* What the commit will hold: the working-tree copy when this command
         stages it, else the index blob. */
      const src = fromTree.has(p) ? readFileSync(path.join(root, p), 'utf8') : git(['show', `:${p}`]);
      stagedStatus[p] = issueStatus(src);
    } catch {
      stagedStatus[p] = null; // unknown counts as rendered
    }
  }
  return { staged, stagedStatus };
}

function readStamp(root) {
  try {
    return JSON.parse(readFileSync(path.join(root, STAMP), 'utf8'));
  } catch {
    return null;
  }
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  try {
    const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
    const command = input?.tool_input?.command;
    const plan = commitPlan(command);
    if (plan && !overridden(command)) {
      const state = gather(ROOT, plan);
      if (relevantPaths(state.staged, state.stagedStatus).length) {
        state.stamp = readStamp(ROOT);
        state.fingerprint = renderFingerprint(ROOT);
        const reason = decide(command, state);
        if (reason) {
          process.stdout.write(JSON.stringify({
            hookSpecificOutput: {
              hookEventName: 'PreToolUse',
              permissionDecision: 'deny',
              permissionDecisionReason: reason,
            },
          }));
        }
      }
    }
  } catch {
    /* Never block on a hook bug. */
  }
  process.exit(0);
}
