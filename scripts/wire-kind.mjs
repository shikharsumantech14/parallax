/**
 * wire-kind — wires a new section kind through five code registry places (SECTION_KINDS, the SectionBody import and arm, the catalog block, KIND_PRIORITY, the prefix table).
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
 *     "catalogBlock": "## age-pyramid\n- **World/Tier:** ...\n- **CUES:** ...\n- **BUILD:** ...",
 *     "priority": 66 }
 *
 * Config: { kind, world, component, file, afterKind, comment, props,
 *           catalogBlock, priority, prefix } plus the optional extras below.
 *
 * `afterKind` is the existing kind this one is inserted after — it anchors the
 * SECTION_KINDS entry, the dispatch arm and the catalog block, which keeps all
 * three in the same order (check:catalog enforces that 1:1).
 *
 * Idempotent: every step skips if its edit is already present, so a partial run
 * can be re-run safely. Line endings are matched per file.

 *
 * THE LENS SHAPE (Phase 8, 2026-10-04). The dispatch arm it emits is the one
 * every kind uses since Lens Phase 6:
 *   <Name ...props caption={section.caption ?? data.caption}
 *         source={section.source ?? data.source} />
 * core/Section.astro prints the caption (in the article) and the source (in
 * the figure panel) once; the component renders neither, and there is no
 * how-to-read panel and no plain line any more (src/lib/explainers.ts was
 * deleted in Phase 8). Config extras: `world: 'core'` for a universal kind
 * (imports from ./core/), `vizcard: false` for a narrative kind (a bare arm,
 * no chrome props), `narrative: true` for a kind that runs in the article
 * column with no figure panel (it must also join the NARRATIVE set in
 * core/Section.astro and scripts/project-graph.mjs by hand).
 *
 * Step 3 REFUSES a catalog block without a CUES line and a BUILD line: a
 * narrative kind says `- **CUES:** none`, every other kind lists the anchor
 * ids its component exposes as `data-cue="<id>"` (under a `Cue anchors:`
 * header comment), and check:catalog check 7 then asserts each id is in the
 * component. The component's own contract (anchors, `.px-cue-tag` slots,
 * `data-build-*` attributes, no motion of its own) is src/components/AGENTS.md
 * §3 and §11; this script cannot write it for you.

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
        catalogBlock, priority, prefix } = cfg;

if (cfg.explainWhat || cfg.explainHow) {
  die('`explainWhat` / `explainHow` are gone with src/lib/explainers.ts (Lens Phase 8). Drop them; the kind explains itself through cues (docs/design/LENS.md §5.2).');
}
// 0 ── the catalog block must carry the Lens lines BEFORE anything is written
{
  const cues = (catalogBlock ?? '').match(/^- \*\*CUES:\*\*\s*(.+)$/m)?.[1]?.trim();
  const build = (catalogBlock ?? '').match(/^- \*\*BUILD:\*\*\s*(.+)$/m)?.[1]?.trim();
  if (!cues) die('catalogBlock has no `- **CUES:**` line (the anchor ids, or `none` on a narrative kind)');
  if (!build) die('catalogBlock has no `- **BUILD:**` line (the build order, LENS §6.4)');
  if (cfg.narrative && !/^none\b/.test(cues)) die('a narrative kind\'s CUES line must say `none`');
  if (!cfg.narrative && /^none\b/.test(cues)) die('a figure kind needs anchor ids on its CUES line (two to four cues per section)');
}

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
  // `world: 'core'` places a universal kind under src/components/core/.
  const importPath = world === 'core' ? `./core/${file}` : `./topic/${world}/${file}`;
  s = s.replace(impRe, `$1import ${component} from '${importPath}';${N}`);
  const armRe = new RegExp(`(\\{section\\.kind === '${esc(afterKind)}' && [\\s\\S]*?\\)\\}\\r?\\n)`);
  if (!armRe.test(s)) die(`dispatch arm for '${afterKind}'`);
  // The Lens arm (Phase 6): the data props, then caption and source, which
  // core/Section.astro prints once (the component renders neither). A
  // `vizcard: false` config emits a bare arm (narrative kinds take no chrome).
  const arm = cfg.vizcard === false
    ? `    {section.kind === '${kind}' && (${N}      <${component} ${props} />${N}    )}${N}`
    : `    {section.kind === '${kind}' && (${N}` +
      `      <${component} ${props} caption={section.caption ?? data.caption} source={section.source ?? data.source} />${N}` +
      `    )}${N}`;
  s = s.replace(armRe, `$1${arm}`);
  wr('src/components/SectionBody.astro', s);
  console.log('  + SectionBody');
}

// 3 ── (the EXPLAIN step lived here until Lens Phase 8; the CUES and BUILD
// lines it was replaced by are checked in step 0, before any write.)

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
console.log(`  ${kind} wired. Now run npm run check:catalog: check 7 fails until every CUES id is a data-cue in ${file}.`);
