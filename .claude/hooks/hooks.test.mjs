#!/usr/bin/env node
/**
 * hooks.test — fixture tests for the PreToolUse guards.
 *
 *   npm run hooks:test
 *
 * Hooks fire on EVERY matching tool call, so a false positive is expensive:
 * it blocks legitimate work with a confusing message, and the model may not
 * realise the block is spurious. A false negative silently loses the
 * protection the hook exists for. Both directions are tested.
 *
 * Pure functions are imported directly — no subprocess, no stdin plumbing —
 * so this runs in milliseconds and works identically on Windows.
 */
import { decide as gitDecide } from './guard-git.mjs';
import { decide as genDecide } from './guard-generated.mjs';

let pass = 0;
const failures = [];

const check = (name, actual, shouldBlock) => {
  const blocked = actual !== null;
  if (blocked === shouldBlock) { pass++; return; }
  failures.push(`${name}\n      expected ${shouldBlock ? 'BLOCK' : 'ALLOW'}, got ${blocked ? 'BLOCK' : 'ALLOW'}`);
};

const blocks = (name, cmd) => check(name, gitDecide(cmd), true);
const allows = (name, cmd) => check(name, gitDecide(cmd), false);

/* ── guard-git: must BLOCK ─────────────────────────────────────────────── */
blocks('git push', 'git push');
blocks('git push with remote', 'git push origin main');
blocks('git push --force', 'git push --force origin main');
blocks('push after &&', 'npm run build && git push');
blocks('push after ;', 'git commit -m "x" ; git push');
blocks('push with global flag', 'git -C . push');
blocks('checkout a file', 'git checkout src/pages/index.astro');
blocks('checkout -- path', 'git checkout -- src/lib/story.ts');
blocks('checkout dot', 'git checkout .');
blocks('restore a file', 'git restore src/components/core/VizCard.astro');
blocks('reset --hard', 'git reset --hard origin/main');
blocks('reset a path', 'git reset HEAD src/content/config.ts');
blocks('stash (would hide work)', 'git stash');
blocks('stash push', 'git stash push -m wip');
blocks('full path to git', '/usr/bin/git push');

/* ── guard-git: must ALLOW ─────────────────────────────────────────────── */
allows('git status', 'git status --short');
allows('git log', 'git log --oneline -10');
allows('git diff', 'git diff HEAD --stat');
allows('git show', 'git show HEAD');
allows('git add', 'git add -A');
allows('git commit', 'git commit -m "Phase A"');
allows('git mv', 'git mv docs/a.md docs/archive/a.md');
allows('git branch', 'git branch -a');
allows('new branch', 'git checkout -b feature/context-phase-b');
allows('switch branch', 'git checkout main');
allows('stash list', 'git stash list');
allows('not git at all', 'npm run build');
allows('grep for the word push', 'grep -rn "git push" docs/');
allows('commit msg mentions push', 'git commit -m "note: operator runs git push"');
allows('empty', '');
/* Real commands used while building this system — regressions here would
   block ordinary work, which is the expensive failure mode. */
allows('heredoc commit', "git commit -F- <<'MSG'\nfix: git push is the operator's job\nMSG");
allows('check-ignore', 'git check-ignore "Parallax Design System Revamp"');
allows('range log', 'git log --oneline origin/main..HEAD');
allows('config read', 'git config user.email');
allows('add then commit', 'git add -A && git commit -m "wip"');
allows('gh cli, not git', 'gh api repos/x/y --jq .stargazers_count');
allows('cd then status', 'cd /d/SideProjects/parallax && git status --short');
allows('checkout slashed branch', 'git checkout feature/a/b');
blocks('checkout branch then push', 'git checkout -b x && git push -u origin x');
blocks('reset soft still denied', 'git reset --soft HEAD~1');
blocks('restore staged', 'git restore --staged src/lib/story.ts');

/* ── guard-generated ───────────────────────────────────────────────────── */
const g = (name, p, shouldBlock) => check(name, genDecide(p), shouldBlock);
g('generated md',   'D:/SideProjects/parallax/docs/generated/PROJECT-GRAPH.md', true);
g('generated json', 'docs/generated/project-graph.json', true);
g('generated posix','/d/SideProjects/parallax/docs/generated/x.md', true);
g('normal doc',     'docs/STATE-OF-PLAY.md', false);
g('a component',    'src/components/core/VizCard.astro', false);
g('similar name',   'docs/generated-by-hand.md', false);
g('undefined path',  undefined, false);

/* ── report ────────────────────────────────────────────────────────────── */
if (failures.length) {
  console.error(`hooks.test: ${failures.length} FAILED, ${pass} passed\n`);
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log(`hooks.test: ${pass} passed`);
