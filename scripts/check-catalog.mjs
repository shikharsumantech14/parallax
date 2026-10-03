#!/usr/bin/env node
/**
 * check-catalog — the registry gate.
 *
 *   npm run check:catalog        (also runs as part of `prebuild`)
 *
 * Enforces seven things about SECTION_KINDS (src/content/config.ts):
 *
 *   1. every kind has a `## <kind>` block in docs/design/catalog.md
 *   2. every catalog block names a real kind
 *   3. the two lists are in the SAME ORDER
 *   4. every kind has a KIND_PRIORITY score (src/lib/story.ts). Until Lens
 *      Phase 7 it also asserted an EXPLAIN entry (src/lib/explainers.ts) for
 *      every non-narrative kind; that copy fed the plain line and the
 *      how-to-read panel, which stopped rendering in Phase 3, nothing imports
 *      the file any more, and Phase 8 deletes it, so the assertion went
 *      (2026-10-01)
 *   5. every field named in a catalog DATA line is actually read by its
 *      component (2026-09-15) — see the block at check 5 for why
 *   6. every retired kind name in KIND_ALIASES (src/content/config.ts)
 *      resolves to a registered kind, is not itself registered, and has no
 *      catalog block of its own (the Lens verdict, 2026-09-30)
 *
 * Why 4 exists: the map fails SILENTLY. A kind with no KIND_PRIORITY falls
 * to the default 30 in story.ts and is effectively unrankable as a story
 * beat. It shows up in no build, browser or diff — which is exactly how four
 * WebGL flagships sat unscored.
 *
 * Reports EVERY failure in one run. An earlier version hid the order check
 * behind `if (!fail)` and stopped at the first drift, so a single missing block
 * masked every ordering problem behind it.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf-8');

/* act-break is deliberately scored <= 0 in KIND_PRIORITY so the story builder
   filters it out; it is exempt from the "must be scored" rule only in the sense
   that any explicit entry counts. (`hero` was retired 2026-09-13.) */
const errors = [];
const fail = (msg) => errors.push(msg);

// ── the three lists ────────────────────────────────────────────────────────
const config = read('src/content/config.ts');
const arrMatch = config.match(/SECTION_KINDS\s*=\s*\[([\s\S]*?)\]\s*as const/);
if (!arrMatch) { console.error('check-catalog: SECTION_KINDS not found'); process.exit(1); }
const kinds = [...arrMatch[1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);

const blocks = [...read('docs/design/catalog.md').matchAll(/^## ([a-z0-9-]+)\s*$/gm)].map((m) => m[1]);


const story = read('src/lib/story.ts');
const kpBlock = story.match(/KIND_PRIORITY[^=]*=\s*\{([\s\S]*?)\n\};/);
if (!kpBlock) { console.error('check-catalog: KIND_PRIORITY not found in src/lib/story.ts'); process.exit(1); }
const priorityKeys = new Set([...kpBlock[1].matchAll(/'([a-z0-9-]+)'\s*:/g)].map((m) => m[1]));

const kindSet = new Set(kinds);
const blockSet = new Set(blocks);

// ── 1 + 2: membership, both directions ─────────────────────────────────────
for (const k of kinds) if (!blockSet.has(k)) fail(`MISSING catalog block: ## ${k}`);
for (const b of blocks) if (!kindSet.has(b)) fail(`UNKNOWN catalog block (not in SECTION_KINDS): ## ${b}`);

// ── 3: order. Runs unconditionally, and reports every drift, not just the
// first — comparing only the kinds present in both so a missing block does not
// cascade into a false drift at every later position. ───────────────────────
const inBoth = blocks.filter((b) => kindSet.has(b));
const expectedOrder = kinds.filter((k) => blockSet.has(k));
for (let i = 0; i < expectedOrder.length; i++) {
  if (expectedOrder[i] !== inBoth[i]) {
    fail(`ORDER drift at position ${i}: SECTION_KINDS has '${expectedOrder[i]}', catalog has '${inBoth[i] ?? '(nothing)'}'`);
  }
}

// ── 4: the silent map ──────────────────────────────────────────────────────
for (const k of kinds) {
  if (!priorityKeys.has(k)) {
    fail(`MISSING KIND_PRIORITY score: '${k}' (src/lib/story.ts) — it silently defaults to 30 and will not be picked as a story beat`);
  }
}
for (const k of priorityKeys) if (!kindSet.has(k)) fail(`STALE KIND_PRIORITY score: '${k}' is not in SECTION_KINDS`);

// ── 5: every catalog DATA field has a reader ───────────────────────────────
// Added 2026-09-15 after a sweep of all 101 kinds found THIRTEEN fields that
// the catalog documented, authors therefore used, and no component ever read.
// Two were live on published issues — benchmark-chart's `sublabel` (the hero
// of the Kessler issue, designed around it in the approved storyboard) and
// tactics-pitch's `role` (the Arsenal pitch shipped eleven blank discs) — and
// `comparison`'s whole documented shape had never been implemented at all.
// None of it is visible in a build, a diff, or a browser: an unread prop is
// not an error in Astro, so the section just renders a little less.
//
// The reader set is deliberately wide (the dispatch arm, the component script
// and template, its direct imports, and its WebGL scene) so the check reports
// a field that reaches NOTHING, not one it merely cannot follow.
const rdSync = (p) => readFileSync(join(root, p), 'utf-8');
const exists = (p) => existsSync(join(root, p));

/* Fields a kind accepts and deliberately does not render. Each needs a reason:
   this list is the place a silent drop becomes a stated decision. */
const ACCEPTED_UNREAD = {
  // The shared annotation contract (docs/design/blueprints/_ANNOTATIONS.md §1)
  // is one shape for eight kinds: `side` is "a hint only; the kind may
  // override", and `series` only means anything where a chart has several.
  timeline: { side: 'one place a row callout can go', series: 'single series' },
  'climate-strip': { side: 'callout is always above the stripe', series: 'single series' },
  'benchmark-chart': { side: 'callout always attaches to the end of its bar', series: 'single series' },
  'adoption-curve': { series: 'single series' },
  'scaling-plot': { series: 'a scatter has one series' },
  // `division: {label?, aye: {party: n}, no: {party: n}}` — "party" is the
  // placeholder for a party NAME used as a key, not a field. Chamber reads it
  // as `division.aye[p.name]`.
  chamber: { party: 'placeholder for a party name used as an object key' },
};

const STOP_WORDS = new Set([
  'string', 'number', 'boolean', 'true', 'false', 'null', 'undefined', 'any', 'Day',
  'ok', 'bold', 'italic', 'words', 'or', 'and', 'the', 'it', 'at', 'an', 'a', 'is', 'of',
  'script', 'roman', 'set', 'Roman', 'ISO', 'ascending', 'n',
]);

/* Field names out of a DATA line: only the backticked shape sketches count,
   quoted literals and parenthetical prose are dropped, and a name counts only
   where it sits in key position (followed by `:` `,` `}` `]` or end). */
function dataFields(line) {
  const out = new Set();
  for (let sketch of [...line.matchAll(/`([^`]+)`/g)].map((m) => m[1])) {
    // A sketch is an OBJECT shape. A bare path reference in the prose after it
    // (`corners[].id`, naming a field that was struck) is not one.
    if (!sketch.includes('{')) continue;
    sketch = sketch
      .replace(/'[^']*'/g, "''")
      .replace(/"[^"]*"/g, '""')
      .replace(/\([^)]*\)/g, ' ');
    for (const m of sketch.matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*\??\s*(?=[:,}\]]|$)/g)) {
      if (!STOP_WORDS.has(m[1])) out.add(m[1]);
    }
  }
  return [...out];
}

const stripBlockComments = (t) =>
  t.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:'"\w])\/\/.*$/gm, '$1 ');

/* Brace-balanced removal of `interface X {…}` / `type X = {…}`. A DECLARATION
   is not a reader — that is precisely what hid all thirteen. One-liners count,
   which a `\n}` regex misses. */
function stripDeclarations(src) {
  const re = /(?:export\s+)?(?:interface|type)\s+\w+\s*(?:=\s*)?\{/g;
  let out = '', i = 0, m;
  while ((m = re.exec(src))) {
    if (m.index < i) continue;
    out += src.slice(i, m.index);
    let j = m.index + m[0].length, depth = 1;
    while (j < src.length && depth > 0) {
      if (src[j] === '{') depth++;
      else if (src[j] === '}') depth--;
      j++;
    }
    out += ' ';
    i = j;
    re.lastIndex = j;
  }
  return out + src.slice(i);
}

const catalogText = read('docs/design/catalog.md');
const catalogBlocks = new Map();
{
  let cur = null;
  for (const ln of catalogText.split(/\r?\n/)) {
    const h = ln.match(/^## ([a-z0-9-]+)\s*$/);
    if (h) { cur = { data: '', notes: '' }; catalogBlocks.set(h[1], cur); continue; }
    if (!cur) continue;
    if (ln.startsWith('- **DATA:**')) cur.data += ' ' + ln.replace('- **DATA:**', '');
    if (ln.startsWith('- **World/Tier:**') || ln.startsWith('- **NOTES:**')) cur.notes += ' ' + ln;
  }
}

const bodySrc = read('src/components/SectionBody.astro');
const armIndex = [...bodySrc.matchAll(/section\.kind === '([a-z0-9-]+)'/g)].map((m) => ({ kind: m[1], at: m.index }));
function dispatchArm(kind) {
  return armIndex
    .filter((a) => a.kind === kind)
    .map((h) => {
      const next = armIndex.find((a) => a.at > h.at);
      return bodySrc.slice(h.at, next ? next.at : bodySrc.length);
    })
    .join('\n');
}

const sceneRegistry = read('src/scripts/viz3d/scenes/index.ts');
function scenePath(kind) {
  const m = sceneRegistry.match(
    new RegExp(`'${kind}'\\s*:\\s*\\{\\s*load:\\s*\\(\\)\\s*=>\\s*import\\('\\./(\\w+)'\\)`),
  );
  return m ? `src/scripts/viz3d/scenes/${m[1]}.ts` : null;
}

/* Everything that could read the field, minus declarations and comments.
   A bare prop FORWARD to the kind's OWN component (`<Foo bar={data.bar} />`)
   is stripped: handing a value to a component that ignores it is the exact
   shape of the bug, so it must not count as a reader. A forward to a DIFFERENT
   component in the same arm is left standing — `seat-chart` legitimately pipes
   `quote.attribution` into `<Quote>`, which does render it. */
function stripOwnForward(arm, field, componentPath) {
  const tag = posix.basename(componentPath).replace(/\.astro$/, '');
  const forward = new RegExp(`(?<![A-Za-z0-9_.])${field}=\\{[^}]*\\}`, 'g');
  let out = '', i = 0;
  const open = new RegExp(`<${tag}\\b`, 'g');
  let m;
  while ((m = open.exec(arm))) {
    if (m.index < i) continue;
    const end = arm.indexOf('>', m.index);
    const stop = end === -1 ? arm.length : end + 1;
    out += arm.slice(i, m.index) + arm.slice(m.index, stop).replace(forward, ' ');
    i = stop;
    open.lastIndex = stop;
  }
  return out + arm.slice(i);
}

function readerText(kind, field, componentPath) {
  const parts = [stripOwnForward(stripBlockComments(dispatchArm(kind)), field, componentPath)];
  if (componentPath && exists(componentPath)) {
    const src = rdSync(componentPath);
    const fence = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    parts.push(stripDeclarations(stripBlockComments(fence ? fence[1] : src)));
    parts.push(stripBlockComments(fence ? fence[2] : ''));
    for (const m of src.matchAll(/from\s+'(\.[^']+)'/g)) {
      const base = posix.normalize(posix.join(posix.dirname(componentPath), m[1]));
      for (const ext of ['', '.ts', '.astro', '.js']) {
        if (exists(base + ext) && statSync(join(root, base + ext)).isFile()) {
          parts.push(stripBlockComments(rdSync(base + ext)));
          break;
        }
      }
    }
  }
  const sc = scenePath(kind);
  if (sc && exists(sc)) parts.push(stripBlockComments(rdSync(sc)));
  return parts.join('\n');
}

let fieldsChecked = 0;
for (const kind of kinds) {
  const block = catalogBlocks.get(kind);
  if (!block || !block.data.trim()) continue;
  const componentPath = (block.notes.match(/`(src\/components\/[^`]+\.astro)`/) || [])[1] || null;
  if (!componentPath) {
    fail(`NO COMPONENT PATH in the catalog NOTES for '${kind}' — check 5 cannot find its reader`);
    continue;
  }
  const accepted = ACCEPTED_UNREAD[kind] ?? {};
  for (const field of dataFields(block.data)) {
    if (field in accepted) continue;
    fieldsChecked++;
    if (new RegExp(`\\b${field}\\b`).test(readerText(kind, field, componentPath))) continue;
    fail(
      `UNREAD catalog field: '${kind}.${field}' is in the DATA line of docs/design/catalog.md ` +
        `but nothing in ${componentPath} (or its dispatch arm, imports or scene) reads it. ` +
        `Render it, strike it from the DATA line, or add it to ACCEPTED_UNREAD in this script with a reason.`,
    );
  }
}

// ── 6: the alias map (the Lens verdict, 2026-09-30) ────────────────────────
// Renamed and folded kinds stay buildable through KIND_ALIASES. An alias that
// points at nothing would fail every issue that uses it at build time with a
// Zod error far from the cause; one that is ALSO a registered kind would make
// the fold a no-op; one with its own catalog block would tell the agents to
// author a name that no longer has a component.
const aliasBlock = config.match(/KIND_ALIASES\s*=\s*\{([\s\S]*?)\}\s*as const/);
if (!aliasBlock) fail('KIND_ALIASES not found in src/content/config.ts (a flat literal of quoted pairs)');
const aliases = aliasBlock
  ? [...aliasBlock[1].matchAll(/'([a-z0-9-]+)'\s*:\s*'([a-z0-9-]+)'/g)].map((m) => [m[1], m[2]])
  : [];
for (const [from, to] of aliases) {
  if (!kindSet.has(to)) fail(`ALIAS '${from}' → '${to}': the target is not in SECTION_KINDS`);
  if (kindSet.has(from)) fail(`ALIAS '${from}' is also a registered kind — remove one`);
  if (blockSet.has(from)) fail(`ALIAS '${from}' has its own catalog block — a retired name gets none`);
}

// ── 7: every CUES id has an anchor (Lens Phase 7, 2026-10-01) ──────────────
// The pipeline authors `cues: [{n, at}]` from the catalog's CUES lines, so a
// CUES line naming an id the component never exposes teaches the composer
// and the drafter to light nothing: the render gate would catch the section
// only after a full draft. Each block carries one `- **CUES:**` line; every
// backticked token on it is an id, read as:
//   `none …`          a narrative kind: the component must expose no anchor
//   `1`…`n` (digits)  one id per item: a computed `data-cue={…}` must exist
//   `m1`…`mK`         a prefixed range: a template or concatenation of the
//                     prefix (`m${…}`, 'm' + …), or its literal first id
//   `<region>`        an id taken from the data: a computed `data-cue={…}`
//   `line`            a literal id: `data-cue="line"`, or the id as a quoted
//                     string or an object key in the code the anchor is
//                     computed from (comments stripped, case-insensitive,
//                     direct imports followed)
const cuesLines = new Map();
{
  let cur = null;
  for (const ln of catalogText.split(/\r?\n/)) {
    const h = ln.match(/^## ([a-z0-9-]+)\s*$/);
    if (h) { cur = h[1]; continue; }
    if (cur && ln.startsWith('- **CUES:**')) {
      if (cuesLines.has(cur)) fail(`TWO CUES lines in the catalog block for '${cur}'`);
      cuesLines.set(cur, ln.replace('- **CUES:**', '').trim());
    }
  }
}
function anchorSource(componentPath) {
  if (!componentPath || !exists(componentPath)) return '';
  const src = rdSync(componentPath);
  const parts = [stripBlockComments(src.replace(/\{\/\*[\s\S]*?\*\/\}/g, ' '))];
  for (const m of src.matchAll(/from\s+'(\.[^']+)'/g)) {
    const base = posix.normalize(posix.join(posix.dirname(componentPath), m[1]));
    for (const ext of ['', '.ts', '.js']) {
      if (exists(base + ext) && statSync(join(root, base + ext)).isFile()) {
        parts.push(stripBlockComments(rdSync(base + ext)));
        break;
      }
    }
  }
  return parts.join('\n');
}
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let cueIdsChecked = 0;
for (const kind of kinds) {
  const line = cuesLines.get(kind);
  if (line === undefined) { fail(`MISSING CUES line in the catalog block for '${kind}' (Lens Phase 7: every block carries one, \`none\` for a narrative kind)`); continue; }
  if (!catalogBlocks.get(kind)) continue;
  const componentPath = (catalogBlocks.get(kind).notes.match(/`(src\/components\/[^`]+\.astro)`/) || [])[1] || null;
  const code = anchorSource(componentPath);
  if (!code) continue; // check 5 already reports a missing component path
  const computed = /data-cue=\{/.test(code);
  if (/^none\b/.test(line)) {
    // The component's own markup only: an import such as src/lib/text.ts
    // (which builds the cue BUTTON) is not an anchor the figure exposes.
    const own = stripBlockComments(rdSync(componentPath).replace(/\{\/\*[\s\S]*?\*\/\}/g, ' '));
    if (/data-cue=/.test(own)) fail(`CUES '${kind}': the catalog says none, but ${componentPath} exposes a data-cue anchor`);
    continue;
  }
  // `a`…`b` is a range (numbers, a prefixed series, or named ids like
  // `jan`…`dec`); any other backticked token is one id.
  const items = [];
  const rest = line.replace(/`([^`]+)`\s*(?:…|\.\.\.?)\s*`([^`]+)`/g, (_, a, b) => { items.push({ a: a.trim(), b: b.trim() }); return ' '; });
  for (const m of rest.matchAll(/`([^`]+)`/g)) items.push({ a: m[1].trim() });
  if (!items.length) { fail(`CUES '${kind}': the line names no id in backticks: "${line.slice(0, 80)}"`); continue; }
  const literal = (t) => {
    const id = reEsc(t);
    return new RegExp(`data-cue="${id}"`).test(code) ||
      new RegExp(`['"\`]${id}['"\`]`, 'i').test(code) ||
      new RegExp(`(^|[\\s{,])${id}\\s*:`, 'm').test(code);
  };
  for (const { a, b } of items) {
    cueIdsChecked++;
    let ok;
    let label = b ? `${a}…${b}` : a;
    if (a.includes('<')) ok = computed;
    else if (/^\d+$/.test(a)) ok = b ? computed : computed || literal(a);
    else if (b && /\d+$/.test(a)) {
      const [, pre, num] = a.match(/^(.*?)(\d+)$/);
      const p = reEsc(pre);
      ok = new RegExp('`' + p + '\\$\\{').test(code) || new RegExp(`['"]${p}['"]\\s*\\+`).test(code) || literal(`${pre}${num}`);
    } else if (/^[A-Za-z][\w-]*$/.test(a) && (!b || /^[A-Za-z][\w-]*$/.test(b))) {
      const missing = [a, b].filter(Boolean).filter((t) => !literal(t));
      ok = missing.length === 0;
      if (!ok) label = missing.join(', ');
    } else {
      fail(`CUES '${kind}': cannot read the id \`${label}\` (write a literal id, \`1\`…\`n\`, a prefixed range like \`m1\`…\`mK\`, or \`<an id from the data>\`)`);
      continue;
    }
    if (!ok) fail(`CUES '${kind}': \`${label}\` is on the catalog's CUES line, but nothing in ${componentPath} (or its direct imports) exposes it as a data-cue anchor`);
  }
}

// ── report ─────────────────────────────────────────────────────────────────
if (errors.length) {
  for (const e of errors) console.error(e);
  console.error(`\ncheck-catalog: ${errors.length} problem${errors.length === 1 ? '' : 's'}.`);
  process.exit(1);
}

const scored = kinds.filter((k) => priorityKeys.has(k)).length;
console.log(
  `check-catalog: ${kinds.length} kinds ↔ ${blocks.length} blocks, order OK · ${scored} scored · ` +
    `${fieldsChecked} DATA fields read · ${aliases.length} aliases · ${cueIdsChecked} CUES ids anchored`,
);
