/**
 * wire-kind — wires a new section kind through the six code registry places.
 *   node scripts/wire-kind.mjs <config.json>
 *
 * Built during Phase 3 of the revamp (docs/REVAMP-PLAN.md) and used for all
 * seven kinds shipped so far; Waves 2-4 should reuse it rather than editing the
 * registry by hand. The remaining registry duties it does NOT cover — the
 * worked example in the world's showcase issue, and any TRIM cap in
 * src/lib/story.ts — stay manual.
 *
 * Example config (the shape used for age-pyramid):
 *   { "kind": "age-pyramid", "world": "politics",
 *     "component": "AgePyramid", "file": "AgePyramid.astro",
 *     "afterKind": "bill-funnel",
 *     "comment": "HTML — composition by age band and sex, counts or shares",
 *     "prefix": "px-pyr",
 *     "props": "bands={data.bands ?? []} sides={data.sides} mode={data.mode} unit={data.unit}",
 *     "explainWhat": "<=220 chars, the FORM, never the data",
 *     "explainHow": "the interaction cue for the expand modal",
 *     "catalogBlock": "## age-pyramid
- **World/Tier:** ...",
 *     "priority": 66 }
 *
 * Config: { kind, world, component, file, afterKind, comment, props,
 *           explainWhat, explainHow, catalogBlock, priority, prefix }
 *
 * `afterKind` is the existing kind this one is inserted after — it anchors the
 * SECTION_KINDS entry, the dispatch arm and the catalog block, which keeps all
 * three in the same order (check:catalog enforces that 1:1).
 *
 * Idempotent: every step skips if its edit is already present, so a partial run
 * can be re-run safely. Line endings are matched per file.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const R = 'D:/SideProjects/parallax/';
const rd = (f) => readFileSync(R + f, 'utf8');
const wr = (f, s) => writeFileSync(R + f, s);
const die = (m) => { console.error('FAILED: ' + m); process.exit(1); };
const eol = (s) => (s.includes('\r\n') ? '\r\n' : '\n');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const cfg = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const { kind, world, component, file, afterKind, comment, props,
        explainWhat, explainHow, catalogBlock, priority, prefix } = cfg;

if (explainWhat.length > 220) die(`explainWhat is ${explainWhat.length} chars, over the 220 cap`);

// 1 ── SECTION_KINDS
let s = rd('src/content/config.ts');
if (s.includes(`'${kind}'`)) console.log('  = SECTION_KINDS');
else {
  const N = eol(s);
  const re = new RegExp(`( *'${esc(afterKind)}'(,?)([^\\r\\n]*)\\r?\\n)`);
  const m = s.match(re);
  if (!m) die(`anchor '${afterKind}' in config.ts`);
  // If the anchor was the last entry it has no comma; add one.
  const fixed = m[2] ? m[1] : m[1].replace(`'${afterKind}'`, `'${afterKind}',`);
  s = s.replace(m[1], `${fixed}  '${kind}',${' '.repeat(Math.max(1, 22 - kind.length))}// ${comment}${N}`);
  wr('src/content/config.ts', s);
  console.log('  + SECTION_KINDS');
}

// 2 ── SectionBody: import + dispatch arm
s = rd('src/components/SectionBody.astro');
if (s.includes(component)) console.log('  = SectionBody');
else {
  const N = eol(s);
  const impRe = /(import [A-Za-z]+ from '\.\/topic\/[a-z]+\/[A-Za-z]+\.astro';\r?\n)(?![\s\S]*import [A-Za-z]+ from '\.\/topic\/)/;
  if (!impRe.test(s)) die('an import anchor in SectionBody');
  s = s.replace(impRe, `$1import ${component} from './topic/${world}/${file}';${N}`);
  const armRe = new RegExp(`(\\{section\\.kind === '${esc(afterKind)}' && [\\s\\S]*?\\)\\}\\r?\\n)`);
  if (!armRe.test(s)) die(`dispatch arm for '${afterKind}'`);
  const arm =
    `    {section.kind === '${kind}' && (${N}` +
    `      <${component} ${props} howToRead={section.howToRead} caption={section.caption ?? data.caption} source={section.source ?? data.source} />${N}` +
    `    )}${N}`;
  s = s.replace(armRe, `$1${arm}`);
  wr('src/components/SectionBody.astro', s);
  console.log('  + SectionBody');
}

// 3 ── EXPLAIN
s = rd('src/lib/explainers.ts');
if (s.includes(`'${kind}':`)) console.log('  = EXPLAIN');
else {
  const N = eol(s);
  const re = /( *'orbital-shells':)/;
  if (!re.test(s)) die('explainers anchor');
  const esc1 = (t) => t.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  s = s.replace(re, `  '${kind}': { what: '${esc1(explainWhat)}', how: '${esc1(explainHow)}' },${N}$1`);
  wr('src/lib/explainers.ts', s);
  console.log(`  + EXPLAIN (what=${explainWhat.length})`);
}

// 4 ── catalog block, in the SAME position as SECTION_KINDS
s = rd('docs/design/catalog.md');
if (s.includes(`## ${kind}\n`) || s.includes(`## ${kind}\r`)) console.log('  = catalog');
else {
  const N = eol(s);
  const start = s.indexOf(`## ${afterKind}`);
  if (start < 0) die(`catalog block '## ${afterKind}'`);
  const re = /\r?\n## /g;
  re.lastIndex = start;
  const m = re.exec(s);
  const at = m ? m.index : s.indexOf('<!-- check:catalog expects') - N.length;
  const body = catalogBlock.trim().split(/\r?\n/).join(N);
  s = s.slice(0, at) + N + N + body + s.slice(at);
  wr('docs/design/catalog.md', s);
  console.log('  + catalog');
}

// 5 ── KIND_PRIORITY
s = rd('src/lib/story.ts');
if (s.includes(`'${kind}':`)) console.log('  = KIND_PRIORITY');
else {
  const re = new RegExp(`('${esc(afterKind)}': *\\d+,)`);
  if (!re.test(s)) die(`story.ts score for '${afterKind}'`);
  s = s.replace(re, `$1 '${kind}': ${priority},`);
  wr('src/lib/story.ts', s);
  console.log(`  + KIND_PRIORITY ${priority}`);
}

// 6 ── prefix table
s = rd('src/components/AGENTS.md');
if (s.includes(`\`${prefix}\``)) console.log('  = prefix');
else {
  const N = eol(s);
  const m = s.match(/(\| *`px-[a-z0-9-]+` *\|[^\r\n]*\r?\n)/);
  if (!m) die('prefix table');
  s = s.replace(m[1], `${m[1]}| \`${prefix}\` | \`${kind}\` | ${world} · \`${file}\` |${N}`);
  wr('src/components/AGENTS.md', s);
  console.log('  + prefix');
}
console.log(`  ${kind} wired.`);
