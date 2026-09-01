#!/usr/bin/env node
/**
 * guard-git — PreToolUse(Bash) hook. Turns two AGENTS.md §7 rules from prose
 * into enforcement.
 *
 *   1. "Claude commits only — never pushes."  The operator pushes, partly
 *      because Vercel's Hobby plan blocks deploys from unrecognised commit
 *      authors, and partly because pushing is the irreversible step.
 *   2. "Never git checkout / reset / stash / restore a file to 'undo'."
 *      An agent once wiped hours of uncommitted work that way, and most of
 *      this repo's work sits uncommitted for long stretches.
 *
 * Both were requests written in a document. CLAUDE.md is context, not enforced
 * configuration — so a request is all it was. This makes them walls.
 *
 * Contract (docs/CONTEXT-PLAN.md B2):
 *   - deny  → exit 0 with permissionDecision:"deny" + a reason naming the rule
 *   - allow → exit 0 with NO output, so the normal permission flow still runs.
 *             We never emit "allow": that would silently bypass the user's own
 *             permission settings for every git command in the repo.
 *   - a crash must never block work: the catch-all exits 0 silently.
 *
 * Read-only git (status/log/diff/show/branch) is never touched.
 */
import { readFileSync } from 'node:fs';

const deny = (reason) => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
};

/* Strip quoted runs and comments so a commit message mentioning "git push"
   cannot trip the matcher. We only care about executable command text. */
const strip = (s) => s
  .replace(/<<-?\s*(['"]?)(\w+)\1[\s\S]*?^\s*\2\s*$/gm, ' ')  // heredocs
  .replace(/'[^']*'/g, ' ')
  .replace(/"[^"]*"/g, ' ')
  .replace(/#.*$/gm, ' ');

/* Split on separators so `npm test && git push` is caught. */
const segments = (s) => strip(s).split(/(?:&&|\|\||[;|\n])/);

/* Global flags that consume the NEXT token as their value, so `git -C . push`
   resolves to subcommand `push` rather than `.`. */
const VALUE_FLAGS = new Set(['-C', '-c', '--git-dir', '--work-tree', '--exec-path', '--namespace']);

/** Split a git segment into { sub, rest }, skipping global flags. */
function parseGit(seg) {
  const tokens = seg.split(/\s+/).filter(Boolean);
  let i = tokens.findIndex((t) => /(^|[/\\])git$/.test(t));
  if (i === -1) return null;
  i++;
  while (i < tokens.length && tokens[i].startsWith('-')) {
    const flag = tokens[i].split('=')[0];
    i += (VALUE_FLAGS.has(flag) && !tokens[i].includes('=')) ? 2 : 1;
  }
  if (i >= tokens.length) return null;
  return { sub: tokens[i], rest: tokens.slice(i + 1) };
}

export function decide(command) {
  if (typeof command !== 'string' || !command.trim()) return null;

  for (const raw of segments(command)) {
    const seg = raw.trim();
    if (!/(^|[/\\\s])git(\s|$)/.test(' ' + seg)) continue;

    const parsed = parseGit(seg);
    if (!parsed) continue;
    const sub = parsed.sub;
    const args = parsed.rest;
    const rest = args.join(' ');

    if (sub === 'push') {
      return 'BLOCKED by AGENTS.md §7 (enforced: CONTEXT-PLAN CD-01/B2). '
        + 'Claude commits; the operator pushes. Vercel Hobby blocks deploys from '
        + 'unrecognised commit authors, and pushing is the irreversible step. '
        + 'Commit instead, then ask the operator to run `git push`.';
    }

    /* checkout/restore/reset/stash CAN destroy uncommitted work. A few forms
       provably cannot, and blocking those would just be noise. */
    if (['checkout', 'restore', 'reset', 'stash'].includes(sub)) {
      /* Inspecting the stash is read-only. */
      if (sub === 'stash' && /^(list|show)$/.test(args[0] || '')) continue;

      /* Branch operations are safe: they never discard working-tree changes.
         Note a branch name legitimately contains slashes (feature/x), so a
         slash is NOT evidence of a path here — the discriminators are an
         explicit `--`, a bare `.`, a file extension, or a destructive flag. */
      if (sub === 'checkout') {
        const creating = args[0] === '-b' || args[0] === '-B';
        const operand = creating ? args.slice(1) : args;
        const looksLikePath = operand.some((a) =>
          a === '--' || a === '.' ||
          /\.(astro|ts|tsx|mjs|js|css|mdx|md|json|sql|svg|html)$/.test(a));
        const destructive = args.some((a) => /^(--force|-f|--hard)$/.test(a));
        if (operand.length === 1 && !looksLikePath && !destructive) continue;
      }

      return `BLOCKED by AGENTS.md §7 (enforced: CONTEXT-PLAN CD-01/B2). `
        + `\`git ${sub}\` can destroy uncommitted work — an agent once wiped hours `
        + `of it here, and most of this repo's work sits uncommitted for long `
        + `stretches. Never undo by restoring; make a new commit instead. `
        + `If you truly need this, ask the operator to run it.`;
    }
  }
  return null;
}

/* ── entry ─────────────────────────────────────────────────────────────── */
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  try {
    const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
    const reason = decide(input?.tool_input?.command);
    if (reason) deny(reason);
  } catch {
    /* Never block on a hook bug. */
  }
  process.exit(0);
}
