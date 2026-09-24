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
import { decide as renderDecide, commitPlan, pendingPaths } from './guard-render.mjs';

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

/* ── guard-render: decide(command, state) ──────────────────────────────── */
const FP = 'f'.repeat(40);
const ISS = 'src/content/issues/2026-09-21-iss-retirement-set-by-contract/index.mdx';
const EARTH = 'src/content/issues/2026-09-21-indonesia-fire-burns-soil-not-trees/index.mdx';
const COMP = 'src/components/core/VizCard.astro';
const stamp = (over = {}) => ({
  when: '2026-09-24T10:00:00.000Z', base: 'http://localhost:4321', widths: [1280, 375],
  slugs: ['2026-09-21-iss-retirement-set-by-contract', '2026-09-21-indonesia-fire-burns-soil-not-trees'],
  full: true, blocking: 0, warnings: 12, fingerprint: FP, ...over,
});
const state = (staged, over = {}) => ({ staged, stagedStatus: {}, stamp: null, fingerprint: FP, ...over });
const r = (name, cmd, st, shouldBlock) => check(`render: ${name}`, renderDecide(cmd, st), shouldBlock);
const scoped = (slugs) => stamp({ full: false, slugs });
const pub = { [ISS]: 'published' };

r('not a commit',                  'npm run build', state([COMP]), false);
r('git status is not a commit',    'git status --short', state([COMP]), false);
r('only docs staged',              'git commit -m "docs"', state(['docs/CONTEXT-PLAN.md', 'AGENTS.md']), false);
r('component guide is docs',       'git commit -m "x"', state(['src/components/AGENTS.md']), false);
r('component + no stamp',          'git commit -m "x"', state([COMP]), true);
r('component + clean full stamp',  'git commit -m "x"', state([COMP], { stamp: stamp() }), false);
r('component + stale fingerprint', 'git commit -m "x"', state([COMP], { stamp: stamp({ fingerprint: 'e'.repeat(40) }) }), true);
r('component + blocking > 0',      'git commit -m "x"', state([COMP], { stamp: stamp({ blocking: 3 }) }), true);
r('component + blocking missing',  'git commit -m "x"', state([COMP], { stamp: stamp({ blocking: undefined }) }), true);
r('component + scoped stamp',      'git commit -m "x"', state([COMP], { stamp: scoped(stamp().slugs) }), true);
r('style + clean full stamp',      'git commit -m "x"', state(['src/styles/layout-v2.css'], { stamp: stamp() }), false);
r('content config staged',         'git commit -m "x"', state(['src/content/config.ts']), true);
r('issue + stamp lists slug',      'git commit -m "x"', state([ISS], { stagedStatus: pub, stamp: scoped(['2026-09-21-iss-retirement-set-by-contract']) }), false);
r('issue + stamp lists other',     'git commit -m "x"', state([ISS], { stagedStatus: pub, stamp: scoped(['2026-09-21-indonesia-fire-burns-soil-not-trees']) }), true);
r('issue + full stamp',            'git commit -m "x"', state([ISS], { stagedStatus: pub, stamp: stamp() }), false);
r('two issues, one missing',       'git commit -m "x"', state([ISS, EARTH], { stagedStatus: { ...pub, [EARTH]: 'published' }, stamp: scoped(['2026-09-21-iss-retirement-set-by-contract']) }), true);
r('draft issue alone',             'git commit -m "x"', state([ISS], { stagedStatus: { [ISS]: 'draft' } }), false);
r('review issue renders',          'git commit -m "x"', state([ISS], { stagedStatus: { [ISS]: 'review' } }), true);
r('unknown status counts',         'git commit -m "x"', state([ISS], { stagedStatus: { [ISS]: null } }), true);
r('template is not an issue',      'git commit -m "x"', state(['src/content/issues/_template/index.mdx']), false);
r('escape hatch',                  'PX_SKIP_RENDER_GATE=1 git commit -m "x"', state([COMP]), false);
r('escape hatch, exported',        'export PX_SKIP_RENDER_GATE=1 && git commit -m "x"', state([COMP]), false);
r('escape named in message only',  'git commit -m "PX_SKIP_RENDER_GATE=1"', state([COMP]), true);
r('commit inside && chain',        'npm run check:catalog && git commit -m "x"', state([COMP]), true);
r('add && commit chain',           'git add -A && git commit -m "x"', state([COMP]), true);
r('heredoc commit',                "git commit -F- <<'MSG'\nfix the chip\nMSG", state([COMP]), true);
r('amend with nothing staged',     'git commit --amend --no-edit', state([]), false);
r('amend with a component',        'git commit --amend --no-edit', state([COMP]), true);
r('remote base is not this tree',  'git commit -m "x"', state([COMP], { stamp: stamp({ base: 'https://parallaxlens.com' }) }), true);
r('one width is not done',         'git commit -m "x"', state([COMP], { stamp: stamp({ widths: [1280] }) }), true);
r('issue-only, one width',         'git commit -m "x"', state([ISS], { stagedStatus: pub, stamp: { ...scoped(['2026-09-21-iss-retirement-set-by-contract']), widths: [375] } }), true);

/* ── guard-render: what a command will stage before it commits ─────────── */
const same = (name, actual, expected) => {
  const a = JSON.stringify([...actual].sort());
  const e = JSON.stringify([...expected].sort());
  if (a === e) { pass++; return; }
  failures.push(`render: ${name}\n      expected ${e}, got ${a}`);
};
const DIRTY = ['src/styles/layout-v2.css', 'AGENTS.md', 'src/components/core/Section.astro'];
const NEW = ['src/components/core/New.astro', 'research/x.md'];
const pp = (cmd) => pendingPaths(commitPlan(cmd), { dirty: DIRTY, untracked: NEW, root: 'D:\\SideProjects\\parallax' });
same('plain commit stages nothing',  pp('git commit -m "x"'), []);
same('add one file',                 pp('git add src/styles/layout-v2.css && git commit -m "x"'), ['src/styles/layout-v2.css']);
same('add a directory',              pp('git add src/components && git commit -m "x"'), ['src/components/core/Section.astro', 'src/components/core/New.astro']);
same('add -A takes everything',      pp('git add -A && git commit -m "x"'), [...DIRTY, ...NEW]);
same('add -u skips untracked',       pp('git add -u; git commit -m "x"'), DIRTY);
same('commit -am',                   pp('git commit -am "x"'), DIRTY);
same('commit with a pathspec',       pp('git commit -m "msg" src/styles/layout-v2.css'), ['src/styles/layout-v2.css']);
same('add after the commit ignored', pp('git commit -m "x" && git add -A'), []);
same('absolute Git Bash path',       pp('git add /d/SideProjects/parallax/AGENTS.md && git commit -m x'), ['AGENTS.md']);
same('quoted author is not a path',  pp('git commit --author="A B <a@b>" -m "x"'), []);
/* No commit segment → no plan, so the entry never touches git or the disk. */
check('render: add alone has no plan', commitPlan('git add -A'), false);

/* ── report ────────────────────────────────────────────────────────────── */
if (failures.length) {
  console.error(`hooks.test: ${failures.length} FAILED, ${pass} passed\n`);
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log(`hooks.test: ${pass} passed`);
