#!/usr/bin/env node
/**
 * project-graph — the derived project graph.
 *
 *   node scripts/project-graph.mjs                 write docs/generated/*
 *   node scripts/project-graph.mjs --check         fail if those are stale
 *   node scripts/project-graph.mjs --brief         session brief (stdout only)
 *   node scripts/project-graph.mjs --state-block   STATE-OF-PLAY §2 block
 *   node scripts/project-graph.mjs --doc-audit     doc inventory for /doc-audit
 *
 * Built under docs/CONTEXT-PLAN.md Phase D1. Modelled on check-catalog.mjs:
 * regex over ground truth, no LLM, no network, no new dependencies.
 *
 * THE FACT-CLASS SPLIT (CD-02, CD-11) is the whole design, so do not blur it:
 *
 *   DERIVED, repo-content  → the committed files. Deterministic: sorted keys,
 *                            NO timestamps, written only when the bytes change,
 *                            so `prebuild` never dirties the working tree.
 *   DERIVED, env-volatile  → --brief ONLY, never written to disk. Branch,
 *                            unpushed count and dirty files change without a
 *                            commit; committing them would recreate the
 *                            staleness disease at machine speed.
 *   ATTESTED               → NOT HERE AT ALL. "Migration applied", "live smoke
 *                            passed" cannot be computed on this box; they stay
 *                            authored prose in STATE-OF-PLAY, dated.
 *   JUDGED                 → NOT HERE. Rulings and residuals are authored and
 *                            cited by ID.
 *
 * CD-09: the output is a build artifact. A PreToolUse hook blocks hand-edits.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const R = (p) => join(root, p);
const read = (p) => readFileSync(R(p), 'utf-8');
const has = (p) => existsSync(R(p));
const rel = (p) => relative(root, p).replace(/\\/g, '/');

const git = (args, fallback = '') => {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch { return fallback; }
};

/* ── walk ──────────────────────────────────────────────────────────────── */
const SKIP = new Set(['node_modules', '.git', 'dist', '.astro', '.vercel', 'coverage']);
function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(R(dir), { withFileTypes: true }); } catch { return out; }
  for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (SKIP.has(e.name)) continue;
    const p = `${dir}/${e.name}`.replace(/^\.\//, '');
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

/* ── 1 · kinds and their nine registry places ──────────────────────────── */
function buildKinds() {
  const config = read('src/content/config.ts');
  const m = config.match(/SECTION_KINDS\s*=\s*\[([\s\S]*?)\]\s*as const/);
  if (!m) throw new Error('SECTION_KINDS not found in src/content/config.ts');
  const kinds = [...m[1].matchAll(/'([a-z0-9-]+)'/g)].map((x) => x[1]);

  const body = read('src/components/SectionBody.astro');
  const explain = read('src/lib/explainers.ts');
  const story = read('src/lib/story.ts');
  const catalog = read('docs/design/catalog.md');
  const scenes = has('src/scripts/viz3d/scenes/index.ts') ? read('src/scripts/viz3d/scenes/index.ts') : '';

  const catalogBlocks = new Set([...catalog.matchAll(/^## ([a-z0-9-]+)\s*$/gm)].map((x) => x[1]));
  const explainKeys = new Set([...explain.matchAll(/^\s*'([a-z0-9-]+)':\s*\{/gm)].map((x) => x[1]));
  const kp = story.match(/KIND_PRIORITY[^=]*=\s*\{([\s\S]*?)\n\};/);
  const priority = new Map(
    kp ? [...kp[1].matchAll(/'([a-z0-9-]+)'\s*:\s*(-?\d+)/g)].map((x) => [x[1], Number(x[2])]) : [],
  );
  const trim = new Set([...story.matchAll(/TRIM\[['"]([a-z0-9-]+)['"]\]/g)].map((x) => x[1]));

  /* Component name per dispatch arm: section.kind === 'x' ... <Name */
  const componentOf = new Map();
  for (const arm of body.matchAll(/kind === '([a-z0-9-]+)'[\s\S]{0,400}?<([A-Z][A-Za-z0-9]*)/g)) {
    if (!componentOf.has(arm[1])) componentOf.set(arm[1], arm[2]);
  }

  const blueprintOf = new Map();
  for (const f of walk('docs/design/blueprints')) {
    const bm = f.match(/blueprints\/([a-z]+)\/([a-z0-9-]+)\.md$/);
    if (bm) blueprintOf.set(bm[2], { world: bm[1], path: f });
  }

  return kinds.map((k) => ({
    kind: k,
    component: componentOf.get(k) ?? null,
    inCatalog: catalogBlocks.has(k),
    hasExplain: explainKeys.has(k),
    priority: priority.has(k) ? priority.get(k) : null,
    hasTrim: trim.has(k),
    isWebgl: new RegExp(`['"]${k}['"]`).test(scenes),
    blueprint: blueprintOf.get(k)?.path ?? null,
    world: blueprintOf.get(k)?.world ?? null,
  }));
}

/* ── 2 · issues, and which kinds each actually uses ────────────────────── */
function buildIssues() {
  const dir = 'src/content/issues';
  const out = [];
  for (const e of readdirSync(R(dir), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!e.isDirectory() || e.name.startsWith('_')) continue;
    const f = `${dir}/${e.name}/index.mdx`;
    if (!has(f)) continue;
    const src = read(f);
    const fm = src.slice(0, src.indexOf('\n---', 4) + 4);
    const field = (n) => (fm.match(new RegExp(`^${n}:\\s*["']?([^"'\\r\\n]+)`, 'm')) || [])[1]?.trim() ?? null;
    const kinds = [...src.matchAll(/^\s*-\s*kind:\s*([a-z0-9-]+)/gm)].map((x) => x[1]);
    out.push({
      slug: e.name,
      topic: field('topic'),
      status: field('status') ?? 'draft',
      title: field('title'),
      kinds: [...new Set(kinds)].sort(),
      sectionCount: kinds.length,
      sourceCount: (src.match(/^\s*-\s*id:\s*/gm) || []).length,
    });
  }
  return out;
}

/* ── 3 · decisions → the files that cite them ──────────────────────────── */
const DECISION_RE = /\b((?:RD|TD|CD)-\d{2}[a-z]?)\b/g;
function buildDecisions() {
  const files = walk('.').filter((f) =>
    /\.(md|astro|ts|tsx|mjs|css|mdx|sql)$/.test(f) && !f.startsWith('docs/archive/'));
  const cites = new Map();
  for (const f of files) {
    let s; try { s = read(f); } catch { continue; }
    for (const m of s.matchAll(DECISION_RE)) {
      if (!cites.has(m[1])) cites.set(m[1], new Set());
      cites.get(m[1]).add(f);
    }
  }
  /* "Implemented by" means a file that DOES something, not one that describes
     it. Source trees count; so do hooks, skills and settings, which are
     executable policy. .claude/rules/ and docs/ do not — they are prose. */
  const isCode = (f) => /^(src|app|shared|scripts)\//.test(f)
    || /^\.claude\/(hooks|skills)\//.test(f)
    || f === '.claude/settings.json';
  return [...cites.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([id, set]) => {
      const files = [...set].sort();
      return {
        id,
        citedIn: files.length,
        implementedBy: files.filter(isCode),
        files,
      };
    });
}

/* ── 4 · docs inventory ────────────────────────────────────────────────── */
function buildDocs() {
  return walk('docs').filter((f) => f.endsWith('.md')).map((f) => ({
    path: f,
    archived: f.startsWith('docs/archive/'),
    bytes: statSync(R(f)).size,
    lastCommit: git(['log', '-1', '--format=%ad', '--date=short', '--', f], 'uncommitted'),
  }));
}

/* ── assemble ──────────────────────────────────────────────────────────── */
function graph() {
  const kinds = buildKinds();
  const issues = buildIssues();
  const decisions = buildDecisions();

  const published = issues.filter((i) => i.status !== 'draft');
  const usedAnywhere = new Set(issues.flatMap((i) => i.kinds));
  const usedPublished = new Set(published.flatMap((i) => i.kinds));

  return {
    kinds, issues, decisions,
    totals: {
      kinds: kinds.length,
      webgl: kinds.filter((k) => k.isWebgl).length,
      issues: issues.length,
      published: published.length,
      blueprints: kinds.filter((k) => k.blueprint).length,
      neverUsedAnywhere: kinds.filter((k) => !usedAnywhere.has(k.kind)).length,
      neverInPublished: kinds.filter((k) => !usedPublished.has(k.kind)).length,
      danglingDecisions: decisions.filter((d) => d.implementedBy.length === 0).length,
    },
    usedAnywhere, usedPublished,
  };
}

/* ── renderers ─────────────────────────────────────────────────────────── */
function renderMarkdown(g) {
  const L = [];
  const P = (s = '') => L.push(s);

  P('# Project graph — GENERATED, DO NOT EDIT');
  P();
  P('> Written by `scripts/project-graph.mjs`. Hand-edits are blocked by a');
  P('> PreToolUse hook (CONTEXT-PLAN CD-09) and would be overwritten anyway.');
  P('> To change what this says, change the repo or the generator.');
  P('>');
  P('> **Repo-content facts only.** Volatile facts (branch, unpushed, dirty) live');
  P('> in `--brief` and are deliberately never committed (CD-11). Attested facts');
  P('> ("migration applied", "live smoke") cannot be computed here and stay');
  P('> authored in `docs/STATE-OF-PLAY.md`.');
  P();
  P('## Totals');
  P();
  P('| | |');
  P('|---|---|');
  for (const [k, v] of Object.entries(g.totals)) P(`| ${k} | ${v} |`);
  P();

  P('## Section kinds');
  P();
  P('`wired` is the six automated registry places; ✗ marks a gap `check:catalog` would fail on.');
  P('`published` asks whether the kind has ever appeared in a non-draft issue.');
  P();
  P('| kind | component | catalog | explain | priority | webgl | blueprint | used | published |');
  P('|---|---|---|---|---|---|---|---|---|');
  for (const k of g.kinds) {
    P(`| \`${k.kind}\` | ${k.component ?? '—'} | ${k.inCatalog ? '✓' : '✗'} | ${k.hasExplain ? '✓' : '·'} `
      + `| ${k.priority ?? '·'} | ${k.isWebgl ? '✓' : ''} | ${k.blueprint ? '✓' : ''} `
      + `| ${g.usedAnywhere.has(k.kind) ? '✓' : ''} | ${g.usedPublished.has(k.kind) ? '✓' : ''} |`);
  }
  P();

  const never = g.kinds.filter((k) => !g.usedPublished.has(k.kind));
  P(`## Never in a published issue — ${never.length} of ${g.kinds.length}`);
  P();
  P('The plan\'s argument for workstream B over Wave 2 rests on this number.');
  P('It is computed here rather than asserted.');
  P();
  P(never.map((k) => `\`${k.kind}\``).join(' · ') || '_none_');
  P();

  P('## Decisions');
  P();
  P('`implemented by` counts files that DO something and name the ID: `src/`,');
  P('`app/`, `shared/`, `scripts/`, `.claude/hooks/`, `.claude/skills/`,');
  P('`.claude/settings.json`. Prose (docs, `.claude/rules/`) is cited, not');
  P('implementing.');
  P();
  P('**Zero is not an error, and it is not proof of absence.** It means either');
  P('*decided but not yet built* (RD-03, the deferred brand mark) **or**');
  P('*built by files that never name the ID* — TD-03 is cited in 30 blueprints');
  P('while the tokens implementing it carry no `TD-03` comment. This graph can');
  P('only see citations. Treat a zero as a question, never as a verdict.');
  P();
  P('| id | cited in | implemented by |');
  P('|---|---|---|');
  for (const d of g.decisions) {
    P(`| **${d.id}** | ${d.citedIn} files | ${d.implementedBy.length}${d.implementedBy.length ? '' : ' — _dangling_'} |`);
  }
  P();

  P('## Issues');
  P();
  P('| slug | topic | status | sections | kinds | sources |');
  P('|---|---|---|---|---|---|');
  for (const i of g.issues) {
    P(`| \`${i.slug}\` | ${i.topic ?? '—'} | ${i.status} | ${i.sectionCount} | ${i.kinds.length} | ${i.sourceCount} |`);
  }
  P();
  return L.join('\n') + '\n';
}

function renderStateBlock(g) {
  const t = g.totals;
  const gaps = g.kinds.filter((k) => !k.inCatalog || !k.hasExplain).length;
  return [
    '<!-- BEGIN GENERATED — scripts/project-graph.mjs. Do not hand-edit (CD-09). -->',
    '',
    '| Derived fact | Value |',
    '|---|---|',
    `| Section kinds | **${t.kinds}** (${t.webgl} WebGL) |`,
    `| Blueprinted | ${t.blueprints} of ${t.kinds} |`,
    `| Issues | ${t.issues} (${t.published} published, ${t.issues - t.published} draft) |`,
    `| Kinds never in a published issue | **${t.neverInPublished}** |`,
    `| Registry gaps | ${gaps === 0 ? 'none' : `**${gaps}**`} |`,
    `| Decisions tracked | ${g.decisions.length} (${t.danglingDecisions} decided-but-unbuilt) |`,
    '',
    '<!-- END GENERATED -->',
  ].join('\n') + '\n';
}

function renderBrief(g) {
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'], '?');
  const dirty = git(['status', '--porcelain']).split('\n').filter(Boolean).length;
  const ahead = git(['rev-list', '--count', '@{u}..HEAD'], '?');
  const t = g.totals;

  const gate = (label, fn) => {
    try { fn(); return `${label} ok`; } catch { return `${label} FAIL`; }
  };
  const gates = [
    gate('catalog', () => execFileSync('node', ['scripts/check-catalog.mjs'], { cwd: root, stdio: 'pipe' })),
    gate('tokens', () => execFileSync('node', ['scripts/design-sync.mjs', '--check'], { cwd: root, stdio: 'pipe' })),
  ].join(' · ');

  return [
    `PARALLAX · ${branch} · ${dirty === 0 ? 'clean' : `${dirty} file(s) uncommitted`}`
      + ` · ${ahead === '0' ? 'level with origin' : `${ahead} unpushed`}`,
    `Gates: ${gates}`,
    `Library: ${t.kinds} kinds (${t.blueprints} blueprinted) · ${t.neverInPublished} never in a published issue`,
    `Issues: ${t.published} published, ${t.issues - t.published} draft`,
    'Entry point: docs/STATE-OF-PLAY.md · docs/archive/ is frozen history, not current',
    'Decisions: RD-01…09 · TD-01…06 · CD-01…12 — locked; cite, do not re-litigate',
  ].join('\n') + '\n';
}

function renderDocAudit(g) {
  const docs = buildDocs();
  /* Blueprints are 36 near-identical spec files; listing each one buries the
     signal. Summarise them and list everything else. */
  const isBlueprint = (p) => p.startsWith('docs/design/blueprints/');
  const listed = docs.filter((d) => !isBlueprint(d.path));
  const bps = docs.filter((d) => isBlueprint(d.path));

  const L = ['# Doc inventory', ''];
  L.push(`_${docs.length} docs · ${bps.length} blueprints summarised at the end · `
    + `${docs.filter((d) => d.archived).length} archived._`);
  L.push('');
  L.push('| doc | last commit | KB | |');
  L.push('|---|---|---|---|');
  for (const d of listed) {
    L.push(`| \`${d.path}\` | ${d.lastCommit} | ${(d.bytes / 1024).toFixed(1)} | ${d.archived ? 'archived' : ''} |`);
  }
  L.push('');
  if (bps.length) {
    const oldest = bps.reduce((a, b) => (a.lastCommit < b.lastCommit ? a : b));
    L.push(`## Blueprints — ${bps.length} files, oldest touched ${oldest.lastCommit}`);
    L.push('');
    L.push('Not listed individually. Check one only if a specific kind is in question.');
    L.push('');
  }
  L.push('## Dangling decisions (decided, no implementing file)');
  L.push('');
  const dangling = g.decisions.filter((d) => d.implementedBy.length === 0);
  L.push(dangling.length
    ? dangling.map((d) => `- **${d.id}** — cited in ${d.citedIn} file(s), implemented by none`).join('\n')
    : '_none_');
  L.push('');
  return L.join('\n') + '\n';
}

/* ── main ──────────────────────────────────────────────────────────────── */
const arg = process.argv[2];
const g = graph();

if (arg === '--brief') { process.stdout.write(renderBrief(g)); process.exit(0); }
if (arg === '--state-block') { process.stdout.write(renderStateBlock(g)); process.exit(0); }
if (arg === '--doc-audit') { process.stdout.write(renderDocAudit(g)); process.exit(0); }

const outDir = 'docs/generated';
const targets = [
  [`${outDir}/PROJECT-GRAPH.md`, renderMarkdown(g)],
  [`${outDir}/project-graph.json`, JSON.stringify({
    totals: g.totals,
    kinds: g.kinds,
    issues: g.issues,
    decisions: g.decisions.map(({ id, citedIn, implementedBy, files }) => ({ id, citedIn, implementedBy, files })),
  }, null, 2) + '\n'],
];

if (arg === '--check') {
  const stale = targets.filter(([p, body]) => !has(p) || read(p) !== body).map(([p]) => p);
  if (stale.length) {
    console.error('project-graph --check: STALE — ' + stale.join(', '));
    console.error('  run: node scripts/project-graph.mjs');
    process.exit(1);
  }
  console.log(`project-graph --check: in sync · ${g.totals.kinds} kinds · ${g.decisions.length} decisions`);
  process.exit(0);
}

mkdirSync(R(outDir), { recursive: true });
let wrote = 0;
for (const [p, body] of targets) {
  if (has(p) && read(p) === body) continue;   // write-only-if-changed (CD-11)
  writeFileSync(R(p), body);
  wrote++;
}
console.log(`project-graph: ${g.totals.kinds} kinds · ${g.issues.length} issues · ${g.decisions.length} decisions`
  + ` · ${g.totals.neverInPublished} never published · ${wrote} file(s) written`);
