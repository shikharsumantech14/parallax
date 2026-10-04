#!/usr/bin/env node
/**
 * check-prose — the register and composition gate (docs/REGISTER-PLAN.md §7.1,
 * RG-11, 2026-09-13).
 *
 *   npm run check:prose              report on every issue (published, then drafts)
 *   npm run check:prose -- <slug>    one issue
 *   npm run check:prose -- --gate    published issues only; exit 1 on a blocking flag
 *                                    (joins `prebuild` once the backlist passes)
 *
 * Why this is code in the repo and not a linter: every reader-facing string
 * lives in NESTED frontmatter (sections[].intro, data.events[].note …), which
 * Vale cannot see (measured: 14.4% of the prose), and the readability
 * formulas penalise Hinglish (retext-readability flags a Hindi-seasoned
 * sentence at 25 words where plain English survives past 36). So this walks
 * the fields itself, measures what actually predicts difficulty — blocks,
 * names, numbers, connectives, unglossed terms, Hindi carrying meaning — and
 * runs ARI only as a warn-only floor on English-dominant prose.
 *
 * Flags (the contract is research/_voice/_voice-core.md v2):
 *   ❌ blocking  HINDI-SCRIPT · HINDI-FIELD · NUMBER-DRIFT
 *   ⚠️ warning   everything else — see FLAGS below, including the four
 *                diversity floors added 2026-09-16 (REGISTER-PLAN §5.1):
 *                FEW-GRAPHICS · CARD-HEAVY · NO-NEW-KIND · SOURCE-NARROW,
 *                and the two Lens flags added 2026-10-01 (Phase 7):
 *                CUES (two to four cues per graphic section, every [[n]]
 *                marker matched by a cue and every cue by a marker or an
 *                item that gets its button automatically, none on a
 *                narrative kind) · NO-COVER (no `cover` block). Both warn
 *                on every status since Lens Phase 8 (2026-10-04), when the
 *                backlist gained its cues and covers; until then a
 *                published issue reported them ℹ
 * Report mode never fails; --gate fails on ❌ only, so a warning never breaks
 * a deploy until the operator promotes it.
 *
 * Windows note (CD-08): a scratch .mjs, never a one-liner. Paths are joined
 * with node:path; frontmatter is parsed with gray-matter (already a dep).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import matter from 'gray-matter';
import { automatedReadability } from 'automated-readability';
import { canonicalKind } from './lib/kind-aliases.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const GATE = args.includes('--gate');
const only = args.find((a) => !a.startsWith('--'));

// ── Thresholds (REGISTER-PLAN §3.3, §5.1, §7.1) ─────────────────────────────
const T = {
  readerWords: 1100,
  wordsBeforeFirstGraphic: 80,
  visualShare: 0.6,
  proseSections: 3,
  proseSectionWords: 200,
  paragraphWords: 90,
  introWords: 45,
  skimWords: 40,
  hookWords: 25,
  dekWords: 14,
  titleWords: 8,
  timelineEvents: 6,
  timelineNoteWords: 20,
  tileNoteWords: 15,
  paradoxDetailWords: 45,
  annotationWords: 12,
  sentenceMean: 16,
  sentenceP95: 25,
  sentenceMax: 35,
  numbersPerSentence: 2,
  numbersPerParagraph: 4,
  names: 12,
  ariGrade: 9,
  blocksPerSection: 3,
  hindiLoadBearingShare: 0.4,
  // The diversity floors (2026-09-16). Measured before they were set: the ten
  // published issues used `you-think` in ten of ten and the four plain-language
  // cards for most "visual" sections; 76 of 101 kinds never published; four
  // issues on one or two publishers.
  graphicShare: 0.4,
  graphicKinds: 3,
  plainCardsPerIssue: 3,
  newKinds: 2,
  sourcesMin: 8,
  sourceHosts: 5,
  sourceTopShare: 0.4, // an official record (T0) may pass it, 2026-09-28: see sourceSpread()
};

// Kinds that carry no graphic. `paradox` is two blocks of prose (REGISTER-PLAN §1.3).
// The narrative set plus `paradox`; `jargon-buster` and `three-steps` (RG-09) render cells and cards, not a graphic.
const TEXT_ONLY = new Set(['act-break', 'prose', 'quote', 'analogy', 'comparison', 'paradox', 'jargon-buster', 'three-steps']);
const WORKHORSES = new Set(['prose', 'data-readout', 'timeline', 'paradox', 'quote', 'comparison']);
// Typographic cards: visual for the 60% floor, but not DRAWN graphics (2026-09-16).
// `jargon-buster` and `three-steps` are already in TEXT_ONLY.
const CARD_KINDS  = new Set(['you-think', 'number-sense', 'data-readout']);
const PLAIN_CARDS = new Set(['you-think', 'number-sense', 'jargon-buster', 'three-steps']);
const isGraphic   = (k) => !TEXT_ONLY.has(k) && !CARD_KINDS.has(k);
// The cue contract (LENS §5.2, Lens Phase 7): the kinds that carry NO cues are
// the ones whose catalog block reads `- **CUES:** none` (the narrative kinds,
// which run in the article column with no figure panel). Read from the catalog
// so this list cannot drift from it; a different question from TEXT_ONLY,
// which counts graphics for the composition floors.
const NO_CUES = (() => {
  const out = new Set();
  const cat = join(root, 'docs', 'design', 'catalog.md');
  if (!existsSync(cat)) return new Set(['act-break', 'prose', 'quote', 'analogy']);
  let cur = null;
  for (const ln of readFileSync(cat, 'utf-8').split(/\r?\n/)) {
    const h = ln.match(/^## ([a-z0-9-]+)\s*$/);
    if (h) { cur = h[1]; continue; }
    if (cur && /^- \*\*CUES:\*\*\s*none\b/.test(ln)) out.add(cur);
  }
  return out;
})();
// Items the article sets as sentences and gives their cue button without a
// marker when a cue names them by number (core/Section.astro, `lead`).
const AUTO_BUTTON = {
  'data-readout': (d) => arrLen(d?.tiles),
  timeline: (d) => arrLen(d?.events),
  'jargon-buster': (d) => arrLen(d?.terms),
  'three-steps': (d) => arrLen(d?.steps),
  'you-think': () => 2, // "1" the belief, "2" the record ("3", the figure, gets none)
};
const arrLen = (v) => (Array.isArray(v) ? v.length : 0);
// The precision layer: English only (contract §2, precision test).
const PRECISION_FIELDS = new Set(['caption', 'source', 'label', 'unit', 'attribution']);
// Data keys that are never prose.
const SKIP_KEYS = new Set(['url', 'id', 'kind', 'state', 'region', 'code', 'role', 'accent', 'emphasis', 'color', 'colour', 'date', 'km', 'elevM', 'x', 'y', 'lat', 'lon', 'from', 'to', 'mode', 'layout', 'sourceRefs', 'status', 'topic', 'tags', 'publishedAt', 'readTimeMinutes', 'voice', 'story', 'sources', 'at', 'side', 'value', 'logX', 'logY', 'unit']);

// ── Lexicon and jargon ──────────────────────────────────────────────────────
function tableFirstCells(md, headingPrefix) {
  const out = [];
  let inSection = false;
  for (const line of md.split(/\r?\n/)) {
    if (/^## /.test(line)) inSection = line.startsWith('## ' + headingPrefix);
    if (!inSection || !line.startsWith('|')) continue;
    const cell = line.split('|')[1]?.trim();
    if (!cell || /^-+$/.test(cell) || /^(Spelling|Word|Term|Desk)$/i.test(cell)) continue;
    for (const part of cell.split(/\s*[,/]\s*/)) {
      const w = part.replace(/\*/g, '').trim();
      if (w && !/keep English/i.test(w)) out.push(w.toLowerCase());
    }
  }
  return out;
}
const lexiconPath = join(root, 'research', '_voice', 'hinglish-lexicon.md');
const lexiconMd = existsSync(lexiconPath) ? readFileSync(lexiconPath, 'utf-8') : '';
const HINDI_ALLOWED = new Set([
  ...tableFirstCells(lexiconMd, 'Allowed'),
].flatMap((w) => w.split(/\s+/)).filter((w) => /^[a-z]+$/.test(w)));
const HINDI_BANNED = new Set(tableFirstCells(lexiconMd, 'Banned').filter((w) => /^[a-z]+$/.test(w)));
// A small always-on list so the check works before the lexicon is signed.
for (const w of ['matlab', 'kyunki', 'lekin', 'bas', 'bilkul', 'kaafi', 'thoda', 'zyada', 'seedha', 'seedhi', 'asli', 'sirf', 'abhi', 'pehle', 'baad', 'wapas', 'yeh', 'woh', 'kya', 'kaise', 'kyun', 'hisaab', 'jugaad', 'jhoola', 'tamasha', 'kahani', 'sawaal', 'jawab', 'galti', 'mehngai', 'kharcha', 'bachat', 'kamai', 'udhaar', 'naksha', 'rasta', 'aasmaan', 'dharti', 'samundar', 'baarish', 'garmi', 'sardi', 'maidan', 'mauka', 'samajh', 'samjho', 'dekho', 'socho', 'chalo', 'hai', 'nahi', 'nahin', 'hain', 'ka', 'ki', 'ke', 'ko', 'se', 'mein', 'par', 'aur', 'toh', 'garam', 'thanda', 'thandi', 'saal', 'hawa', 'jaati', 'jaata', 'raha', 'rahi', 'bik', 'cheez', 'jo', 'ab', 'log', 'ek', 'das', 'kuch', 'sab']) HINDI_ALLOWED.add(w);
for (const w of ['yaar', 'bhai', 'bro', 'dude', 'dosto', 'namaskar', 'samjhe', 'shayad', 'lagbhag', 'jhoot', 'chor', 'ghotala']) HINDI_BANNED.add(w);
// English words that collide with lexicon spellings — never count these as Hindi.
for (const w of ['bas', 'log', 'par', 'se', 'ka', 'ko', 'ke', 'ki', 'jo', 'ab', 'ek', 'das', 'mode', 'to', 'the']) { /* handled via ENGLISH_COLLIDERS below */ }
const ENGLISH_COLLIDERS = new Set(['log', 'par', 'bas', 'to', 'the', 'a', 'ab', 'ka', 'se', 'das']);
// Particles carry no meaning on their own; a caption reading "12 ka" (a geologic
// unit) or a lone "ki" is not Hindi in the precision layer. Content words are.
const HINDI_PARTICLES = new Set(['ka', 'ki', 'ke', 'ko', 'se', 'mein', 'par', 'aur', 'hai', 'hain', 'jo', 'ab', 'ek', 'das', 'toh', 'yeh', 'woh', 'kuch', 'sab', 'nahi', 'nahin']);
const arr = (v) => (Array.isArray(v) ? v : []);

const jargonPath = join(root, 'research', '_voice', 'jargon.md');
const jargonMd = existsSync(jargonPath) ? readFileSync(jargonPath, 'utf-8') : '';
const JARGON = [];
for (const line of jargonMd.split(/\r?\n/)) {
  if (!line.startsWith('| ')) continue;
  const cell = line.split('|')[1]?.trim();
  if (!cell || /^-+$/.test(cell) || /^Term$/i.test(cell)) continue;
  // "xG (expected goals)" → xG, expected goals · "El Niño / La Niña" → both
  const parts = cell.replace(/\)/g, '').split(/\s*[(/]\s*/).map((p) => p.trim()).filter(Boolean);
  for (const p of parts) if (p.length > 1) JARGON.push(p);
}
const GLOSS_MARKERS = /[—–:(]|\bmatlab\b|\bthat means\b|\bwhich means\b|\bwhich is\b|\bin other words\b|\bin plain terms\b|\bthink of it\b|\bthat is\b|\bi\.e\.|\bcalled\b|\bknown as\b/i;

// ── Text helpers ────────────────────────────────────────────────────────────
// Unicode-aware: "Niño" and "café" are one word each (an ASCII class split them in two).
const words = (s) => (s.match(/[\p{L}\p{N}₹$][\p{L}\p{N}’'.,%₹$°-]*/gu) || []).filter((w) => /[\p{L}\p{N}]/u.test(w));
const wc = (s) => words(String(s)).length;
function sentences(s) {
  return String(s)
    .replace(/\*\*|\*/g, '')
    .replace(/([.!?…])(["”’)]?)\s+(?=[A-Z0-9"“(₹$])/g, '$1$2|')
    .split('|')
    .map((x) => x.trim())
    .filter((x) => wc(x) > 0);
}
// A numeral never ends in a comma: "2025," is the numeral 2025 followed by punctuation.
// A clock time ("14:00") is one numeral, not two.
const numerals = (s) => (String(s).match(/\d(?:[\d,]*\d)?(?:\.\d+)?(?::\d{2})?/g) || []);
const hindiTokens = (s) => words(String(s)).map((w) => w.toLowerCase().replace(/[^a-z]/g, '')).filter((w) => w && HINDI_ALLOWED.has(w) && !ENGLISH_COLLIDERS.has(w));
const hindiContent = (s) => hindiTokens(s).filter((w) => !HINDI_PARTICLES.has(w));
const bannedTokens = (s) => words(String(s)).map((w) => w.toLowerCase().replace(/[^a-z]/g, '')).filter((w) => HINDI_BANNED.has(w));
const hasDevanagari = (s) => /[ऀ-ॿ]/.test(String(s));

/** Recursively collect reader-facing strings from a section's data. */
function collectData(node, path, out) {
  if (node == null) return;
  if (typeof node === 'string') {
    const key = path.split('.').pop().replace(/\[\d+\]/, '');
    // A jargon-buster `term` is one word by nature; it must enter the walk so the
    // first-use check sees it glossed. Everything else needs two words or a unit.
    if (key === 'term' || wc(node) >= 2 || /[₹$%]/.test(node)) out.push({ path, text: node, key });
    return;
  }
  if (Array.isArray(node)) { node.forEach((v, i) => collectData(v, `${path}[${i}]`, out)); return; }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (SKIP_KEYS.has(k)) continue;
      collectData(v, path ? `${path}.${k}` : k, out);
    }
  }
}

// ── Proper-noun heuristic (names) ──────────────────────────────────────────
const NAME_STOP = new Set(['The', 'A', 'An', 'In', 'On', 'At', 'By', 'For', 'To', 'Of', 'And', 'But', 'So', 'Or', 'If', 'As', 'It', 'Its', 'This', 'That', 'These', 'Those', 'What', 'Why', 'How', 'When', 'Where', 'Who', 'Which', 'Not', 'No', 'Yes', 'Now', 'Then', 'Here', 'There', 'Every', 'Each', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Ten', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Sept', 'Oct', 'Nov', 'Dec', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'India', 'Indian', 'Indians', 'Earth', 'Sun', 'Moon', 'Pacific', 'Atlantic', 'North', 'South', 'East', 'West', 'Both', 'Most', 'Some', 'All', 'Think', 'Look', 'Notice', 'Imagine', 'Picture', 'Consider', 'Read', 'Start', 'Take', 'Say', 'Compare', 'Follow', 'Press', 'Drag', 'Hover', 'Tap', 'Scroll', 'Source', 'Payload', 'Camp', 'Base', 'Summit', 'Model', 'Models', 'Up', 'Down', 'Out', 'Over', 'Under', 'After', 'Before', 'Until', 'While', 'Since', 'Because', 'Although', 'Though', 'Even', 'Still', 'Also', 'Only', 'Just', 'Very', 'More', 'Less', 'Much', 'Many', 'Few', 'First', 'Second', 'Third', 'Last', 'Next', 'Old', 'New', 'Big', 'Small', 'High', 'Low', 'Long', 'Short', 'Same', 'Other', 'Another', 'Such', 'Own', 'Per', 'Via', 'Versus', 'From', 'With', 'Without', 'Into', 'Onto', 'Upon', 'About', 'Above', 'Below', 'Between', 'Among', 'Around', 'Through', 'Across', 'Against', 'Along', 'During', 'Except', 'Like', 'Unlike', 'Near', 'Off', 'Toward', 'Towards', 'Within', 'Yet', 'Nor', 'Once', 'Twice', 'Half', 'Nobody', 'Nothing', 'Everyone', 'Everything', 'Someone', 'Something', 'Anyone', 'Anything', 'We', 'You', 'They', 'He', 'She', 'I', 'Our', 'Your', 'Their', 'His', 'Her', 'My', 'Us', 'Them', 'Him', 'Me', 'Yeh', 'Woh', 'Kya', 'Toh', 'Matlab', 'Headlines', 'Everest', 'Fuji',
  // roles and institutions-as-common-nouns, not names
  'MP', 'MPs', 'Prime', 'Minister', 'Constitution', 'Parliament', 'Payload', 'Trail', 'Summit']);
function names(text) {
  const found = new Set();
  for (const sent of sentences(text)) {
    const toks = sent.replace(/[“”"()]/g, ' ').split(/\s+/);
    for (let i = 1; i < toks.length; i++) {
      const t = toks[i].replace(/[.,;:!?’'s]+$/g, '');
      if (!/^[A-Z][a-zA-Z.-]+$/.test(t) || NAME_STOP.has(t)) continue;
      // extend multi-word names: "Alan Arnette", "Lok Sabha", "Carnegie Endowment"
      let j = i, seq = [t];
      while (j + 1 < toks.length) {
        const n = toks[j + 1].replace(/[.,;:!?’'s]+$/g, '');
        // "of / for / the" join a name ("Carnegie Endowment for International Peace"); "and" never
        // does — "Tamil Nadu, Kerala and Andhra Pradesh" is three names, not one.
        if (/^(of|for|the|de|von|van)$/.test(n) && j + 2 < toks.length && /^[A-Z]/.test(toks[j + 2])) { seq.push(n); j++; continue; }
        if (/^[A-Z][a-zA-Z.-]+$/.test(n) && !NAME_STOP.has(n)) { seq.push(n); j++; continue; }
        break;
      }
      found.add(seq.join(' '));
      i = j;
    }
  }
  return found;
}

// ── Source spread (REGISTER-PLAN §5.1) ─────────────────────────────────────
// The floor (2026-09-16): at least 8 sources from at least 5 publishers, none
// behind more than 40% of them. A publisher is a source's host, `www.` dropped.
// Amended 2026-09-28 by the operator's ruling: an official-record publisher,
// one whose domain sits at T0 on the desk's allowlist, sits outside the 40%
// ceiling and counts once, provided at least five other publishers are cited.
// T0 only. _TAXONOMY.md §1 files official statistics under T0, while T1 mixes
// public data portals with private data shops (Transfermarkt, Understat and
// all of github.com on the sports list), the one-publisher lean the ceiling
// exists to catch. A host that is not on the allowlist is never official.
const OFFICIAL_TIERS = new Set(['T0']);
const allowlists = new Map();
/** A desk's allowlist as `{ host, path, tier }`, one per source line that carries a URL and a `tier:`. */
function allowlist(topic) {
  const desk = String(topic ?? '');
  if (allowlists.has(desk)) return allowlists.get(desk);
  const entries = [];
  const file = join(root, 'research', '_sources', `${desk}.md`);
  if (/^[a-z]+$/.test(desk) && existsSync(file)) {
    for (const line of readFileSync(file, 'utf-8').split(/\r?\n/)) {
      const url = line.match(/https?:\/\/[^\s)>\]]+/)?.[0];
      const tier = line.match(/\btier:\s*\**\s*(T[0-7])\b/i)?.[1];
      if (!url || !tier) continue; // politics.md's format example carries `<url>`, not a URL
      try {
        const u = new URL(url);
        entries.push({ host: u.hostname.replace(/^www[.]/, ''), path: u.pathname, tier: tier.toUpperCase() });
      } catch { /* not a URL */ }
    }
  }
  allowlists.set(desk, entries);
  return entries;
}
/** The allowlist on one source: its tier (null when off the list) and whether its publisher is an official record. */
function allowlistTier(host, path, entries) {
  // The most specific host on the list wins: the source's own host, else its nearest parent.
  const hits = entries.filter((e) => host === e.host || host.endsWith(`.${e.host}`));
  if (!hits.length) return { tier: null, official: false };
  const longest = Math.max(...hits.map((e) => e.host.length));
  const own = hits.filter((e) => e.host.length === longest);
  // Official by host, whichever page is cited. eci.gov.in files its statistical
  // reports at T6 and cag.gov.in its audits, and each is still the official body.
  const official = own.some((e) => OFFICIAL_TIERS.has(e.tier));
  // The tier shown: the entry whose path prefixes the source's, else the host's most primary tier.
  const byPath = own.filter((e) => path.startsWith(e.path)).sort((a, b) => b.path.length - a.path.length)[0];
  return { tier: byPath?.tier ?? own.map((e) => e.tier).sort()[0], official };
}
const pct = (x) => `${Math.round(x * 100)}%`;
const plural = (k, one) => `${k} ${one}${k === 1 ? '' : 's'}`;
/**
 * An issue's sources against the floor, and the line that reports them in the
 * dossier's `Spread:` format. An official record that carries more than 40% is
 * set aside and counted once. The publisher count and the top share are then
 * taken on the sources that remain, where an official record is never held to
 * the ceiling. With nothing set aside this is the 2026-09-16 rule unchanged, so
 * an issue that met the old floor meets this one.
 */
function sourceSpread(srcs, entries) {
  const n = srcs.length;
  const groups = new Map();
  for (const s of srcs) {
    let key, path = '/';
    try { const u = new URL(String(s.url)); key = u.hostname.replace(/^www[.]/, ''); path = u.pathname; } catch { key = String(s.publisher ?? s.url ?? '?'); }
    const { tier, official } = allowlistTier(key, path, entries);
    const g = groups.get(key) ?? { key, rows: 0, official, tiers: new Set(), offList: 0, names: new Map() };
    groups.set(key, g);
    g.rows += 1;
    if (tier) g.tiers.add(tier); else g.offList += 1;
    const name = String(s.publisher ?? '').trim();
    if (name) g.names.set(name, (g.names.get(name) ?? 0) + 1);
  }
  const nameOf = (g) => [...g.names].sort((a, b) => b[1] - a[1])[0]?.[0] ?? g.key;
  const all = [...groups.values()];
  const aside = all.filter((g) => g.official && g.rows / n > T.sourceTopShare);
  const rest = all.filter((g) => !aside.includes(g));
  const restRows = n - aside.reduce((a, g) => a + g.rows, 0);
  // The ceiling holds every remaining publisher, or every non-official one once an official record is set aside.
  const top = rest.filter((g) => !(aside.length && g.official)).sort((a, b) => b.rows - a.rows)[0];
  const topShare = top ? top.rows / restRows : 0;
  const narrow = n < T.sourcesMin || rest.length < T.sourceHosts || topShare > T.sourceTopShare;
  const tiers = [...new Set(all.flatMap((g) => [...g.tiers]))].sort();
  const offList = all.reduce((a, g) => a + g.offList, 0);
  const which = aside.length ? 'non-official publisher' : 'publisher';
  const line = [
    `${plural(n, 'source')} · ${plural(rest.length, 'publisher')}${aside.length ? ` + ${plural(aside.length, 'official record')} (${aside.map((g) => `${nameOf(g)}, ${plural(g.rows, 'row')}`).join(' · ')})` : ''}`,
    `tiers ${tiers.join(', ') || 'none'}${offList ? ` (${offList} off the allowlist)` : ''}`,
    top ? `top ${which} ${pct(topShare)} (${nameOf(top)})` : `no ${which}`,
  ].join(' · ');
  return { n, publishers: rest.length, official: aside.length, narrow, line };
}

// ── The walk ────────────────────────────────────────────────────────────────
const issuesDir = join(root, 'src', 'content', 'issues');
const slugs = readdirSync(issuesDir, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
  .map((e) => e.name)
  .filter((s) => !only || s === only)
  .sort();

const summary = [];
let blockingTotal = 0;

// Kinds already in front of readers, per published issue — NO-NEW-KIND asks
// what an issue brings that no OTHER published issue has (2026-09-16).
const publishedKinds = new Map();
for (const s of readdirSync(issuesDir, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith('_')).map((e) => e.name)) {
  const f = join(issuesDir, s, 'index.mdx');
  if (!existsSync(f)) continue;
  const d = matter(readFileSync(f, 'utf-8')).data;
  if (d.status === 'published') publishedKinds.set(s, new Set((Array.isArray(d.sections) ? d.sections : []).map((x) => canonicalKind(x.kind))));
}

for (const slug of slugs) {
  const file = join(issuesDir, slug, 'index.mdx');
  if (!existsSync(file)) continue;
  const raw = readFileSync(file, 'utf-8');
  // Cue markers (`[[n]]`, the Lens reading system, 2026-09-30) render as
  // buttons, not words: strip them before anything is counted or scored.
  const noCues = (v) => typeof v === 'string' ? v.replace(/\s*\[\[[1-4]\]\]\s*/g, ' ').trim()
    : Array.isArray(v) ? v.map(noCues)
      : v && typeof v === 'object' && !(v instanceof Date) ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, noCues(x)]))
        : v;
  const fm = noCues(matter(raw).data);
  const status = fm.status ?? 'draft';
  if (GATE && status === 'draft') continue;

  const flags = []; // {sev:'❌'|'⚠️'|'ℹ', code, where, note}
  const flag = (sev, code, where, note) => flags.push({ sev, code, where, note });

  // Retired kind names resolve to their host, as the schema does (Lens, 2026-09-30).
  const sectionsArr = (Array.isArray(fm.sections) ? fm.sections : []).map((x) => (x && x.kind ? { ...x, kind: canonicalKind(x.kind) } : x));
  const head = { title: fm.title ?? '', dek: fm.dek ?? '', hook: fm.hook ?? '', primer: fm.primer ?? '' };

  // — Collect every reader-facing string with its field and section index —
  const strings = []; // {sec, kind, field, key, text, precision, body}
  for (const [k, v] of Object.entries(head)) if (v) strings.push({ sec: -1, kind: 'head', field: k, key: k, text: String(v), precision: false, body: k !== 'title' });
  sectionsArr.forEach((s, i) => {
    for (const k of ['eyebrow', 'title', 'intro', 'caption', 'skimCaption']) {
      if (s[k]) strings.push({ sec: i, kind: s.kind, field: k, key: k, text: String(s[k]), precision: PRECISION_FIELDS.has(k), body: k === 'intro' || k === 'skimCaption' });
    }
    if (s.source) strings.push({ sec: i, kind: s.kind, field: 'source', key: 'source', text: typeof s.source === 'string' ? s.source : String(s.source.label ?? ''), precision: true, body: false });
    // A cue's own `text` is the line the figure panel shows while it is lit: a
    // data claim in the precision layer, like the caption (Lens Phase 7).
    arr(s.cues).forEach((c, k) => { if (c && typeof c.text === 'string' && c.text.trim()) strings.push({ sec: i, kind: s.kind, field: `cues[${k}].text`, key: 'cue', text: c.text, precision: true, body: false }); });
    const dataStrings = [];
    collectData(s.data ?? {}, 'data', dataStrings);
    for (const d of dataStrings) {
      const key = d.key;
      // An in-chart callout (`annotations[].text`) is a data label in the precision
      // layer: English only, word-capped, never sentence-scored as prose.
      const isAnnot = d.path.includes('annotations');
      strings.push({ sec: i, kind: s.kind, field: d.path, key, text: d.text, precision: isAnnot || PRECISION_FIELDS.has(key) || key === 'caption' || key === 'source', body: !isAnnot && ['lead', 'paragraphs', 'followup', 'detail', 'body', 'punchline', 'statement', 'note', 'desc', 'text', 'kicker', 'headline', 'bullets'].includes(key) });
    }
  });

  const readerWords = strings.reduce((a, s) => a + wc(s.text), 0);
  const bodyStrings = strings.filter((s) => s.body);

  // — Composition —
  const kinds = sectionsArr.map((s) => s.kind);
  const visual = kinds.filter((k) => !TEXT_ONLY.has(k)).length;
  const visualShare = kinds.length ? visual / kinds.length : 0;
  if (kinds.length && visualShare < T.visualShare) flag('⚠️', 'TEXT-HEAVY', 'sections', `${visual}/${kinds.length} visual (${Math.round(visualShare * 100)}%), floor ${Math.round(T.visualShare * 100)}%`);
  for (let i = 1; i < kinds.length; i++) if (TEXT_ONLY.has(kinds[i]) && TEXT_ONLY.has(kinds[i - 1])) flag('⚠️', 'PROSE-RUN', `sections ${i}–${i + 1}`, `${kinds[i - 1]} → ${kinds[i]}`);
  const firstVisual = kinds.findIndex((k) => !TEXT_ONLY.has(k));
  if (kinds.length && (firstVisual !== 0)) flag('⚠️', 'NO-LEAD-GRAPHIC', 'section 1', `first section is ${kinds[0] ?? 'none'}; the first visual is section ${firstVisual + 1 || 'none'}`);
  const proseSecs = sectionsArr.filter((s) => s.kind === 'prose');
  if (proseSecs.length > T.proseSections) flag('⚠️', 'PROSE-COUNT', 'sections', `${proseSecs.length} prose sections, cap ${T.proseSections}`);
  if (!kinds.some((k) => !WORKHORSES.has(k) && !TEXT_ONLY.has(k))) flag('⚠️', 'WORKHORSE-ONLY', 'sections', 'no kind from outside prose/data-readout/timeline/paradox/quote/comparison');

  // — The diversity floors (REGISTER-PLAN §5.1, added 2026-09-16) —
  const graphicKinds = [...new Set(kinds.filter(isGraphic))];
  const graphics = kinds.filter(isGraphic).length;
  const graphicShare = kinds.length ? graphics / kinds.length : 0;
  if (kinds.length && (graphicShare < T.graphicShare || graphicKinds.length < T.graphicKinds)) flag('⚠️', 'FEW-GRAPHICS', 'sections', `${graphics}/${kinds.length} drawn graphics (${Math.round(graphicShare * 100)}%), ${graphicKinds.length} graphic kind(s) — floor ${Math.round(T.graphicShare * 100)}% and ${T.graphicKinds} kinds; you-think / number-sense / data-readout / jargon-buster / three-steps are cards, not graphics`);
  const plainCards = kinds.filter((k) => PLAIN_CARDS.has(k));
  const cardDupes = [...PLAIN_CARDS].filter((k) => kinds.filter((x) => x === k).length > 1);
  if (plainCards.length > T.plainCardsPerIssue || cardDupes.length) flag('⚠️', 'CARD-HEAVY', 'sections', `${plainCards.length} plain-language cards (${plainCards.join(', ')}), cap ${T.plainCardsPerIssue} and one of each${cardDupes.length ? ` — repeated: ${cardDupes.join(', ')}` : ''}`);
  const seenElsewhere = new Set();
  for (const [s, ks] of publishedKinds) if (s !== slug) for (const k of ks) seenElsewhere.add(k);
  const newKinds = graphicKinds.filter((k) => !seenElsewhere.has(k));
  if (kinds.length && newKinds.length < T.newKinds) flag(status === 'published' ? 'ℹ' : '⚠️', 'NO-NEW-KIND', 'sections', `${newKinds.length} graphic kind(s) new to the publication (${newKinds.join(', ') || '—'}), floor ${T.newKinds} — the ledger is docs/generated/PROJECT-GRAPH.md`);
  const srcs = Array.isArray(fm.sources) ? fm.sources : [];
  const spread = sourceSpread(srcs, allowlist(fm.topic));
  if (spread.narrow) flag('⚠️', 'SOURCE-NARROW', 'sources', `${spread.line}. Floor ${T.sourcesMin} sources from ${T.sourceHosts} publishers, none above ${pct(T.sourceTopShare)}, and an official record (T0 on the ${fm.topic ? `${fm.topic} ` : ''}allowlist) may pass ${pct(T.sourceTopShare)} when ${T.sourceHosts} other publishers are cited`);

  // — Cues and the cover (LENS §5.2 and §8.2; Lens Phase 7, 2026-10-01) —
  // Read from the RAW frontmatter: `fm` has had its [[n]] markers stripped.
  {
    const rawSecs = (() => { const d = matter(raw).data; return Array.isArray(d.sections) ? d.sections : []; })();
    rawSecs.forEach((s, i) => {
      if (!s || !s.kind) return;
      const kind = canonicalKind(s.kind);
      const w = `section ${i + 1} (${kind})`;
      const cues = arr(s.cues);
      const { cues: _cues, ...rest } = s;
      const markers = [...JSON.stringify(rest).matchAll(/\[\[([1-4])\]\]/g)].map((m) => Number(m[1]));
      if (NO_CUES.has(kind)) {
        if (cues.length || markers.length) flag('⚠️', 'CUES', w, `a narrative kind carries no cues (${cues.length} cue(s), ${markers.length} [[n]] marker(s)): it has no figure panel to light`);
        return;
      }
      if (!cues.length) {
        flag('⚠️', 'CUES', w, `no cues${markers.length ? `, but ${markers.length} [[n]] marker(s)` : ''}: a graphic section takes two to four, naming the anchors on the kind's CUES line in docs/design/catalog.md`);
        return;
      }
      if (cues.length < 2 || cues.length > 4) flag('⚠️', 'CUES', w, `${cues.length} cue(s); a graphic section takes two to four`);
      const ns = cues.map((c) => Number(c?.n));
      const dup = [...new Set(ns.filter((n, k) => ns.indexOf(n) !== k))];
      if (dup.length) flag('⚠️', 'CUES', w, `cue numeral repeated: ${dup.join(', ')}`);
      for (const m of new Set(markers)) if (!ns.includes(m)) flag('⚠️', 'CUES', w, `[[${m}]] marker with no matching cue: a button that lights nothing`);
      const autoN = AUTO_BUTTON[kind] ? AUTO_BUTTON[kind](s.data) : 0;
      for (const c of cues) {
        const n = Number(c?.n);
        if (markers.includes(n)) continue;
        const ids = String(c?.at ?? '').split(/[\s,]+/).filter(Boolean);
        if (ids.some((id) => /^\d+$/.test(id) && Number(id) >= 1 && Number(id) <= autoN)) continue;
        flag('⚠️', 'CUES', w, `cue ${n} (at "${c?.at ?? ''}") has no [[${n}]] marker, and names no item that gets its button automatically: the figure prints a numeral no button in the article names`);
      }
    });
    if (!fm.cover) {
      flag('⚠️', 'NO-COVER', 'head', 'no `cover: { section, number, label }`: the stage and the cover card fall back to a generic scene (LENS §8.2)');
    } else {
      const cs = Number(fm.cover.section);
      const target = rawSecs[cs];
      if (!Number.isInteger(cs) || !target) flag('⚠️', 'NO-COVER', 'head', `cover.section ${fm.cover.section} names no section (0-based, act-breaks counted; the issue has ${rawSecs.length})`);
      else if (NO_CUES.has(canonicalKind(target.kind))) flag('⚠️', 'NO-COVER', 'head', `cover.section ${cs} is a ${canonicalKind(target.kind)}, a narrative kind with no figure to draw`);
    }
  }

  // words before the first graphic: head + everything up to and including the first visual section's intro
  let before = wc(head.title) + wc(head.dek) + wc(head.hook) + wc(head.primer);
  for (let i = 0; i < sectionsArr.length; i++) {
    const s = sectionsArr[i];
    before += wc(s.eyebrow ?? '') + wc(s.title ?? '') + wc(s.intro ?? '');
    if (!TEXT_ONLY.has(s.kind)) break;
    const ds = []; collectData(s.data ?? {}, 'data', ds); before += ds.reduce((a, d) => a + wc(d.text), 0);
  }
  if (before > T.wordsBeforeFirstGraphic) flag('⚠️', 'HEAD-HEAVY', 'head', `${before} words before the first graphic, cap ${T.wordsBeforeFirstGraphic}`);
  if (readerWords > T.readerWords) flag('⚠️', 'ISSUE-LONG', 'issue', `${readerWords} reader-facing words, cap ${T.readerWords}`);

  // blocks per section (chrome + data notes), besides the title
  sectionsArr.forEach((s, i) => {
    const blocks = strings.filter((x) => x.sec === i && x.field !== 'title' && x.field !== 'eyebrow' && wc(x.text) >= 4).length;
    if (blocks > T.blocksPerSection + 2) flag('ℹ', 'CHROME-HEAVY', `section ${i + 1} (${s.kind})`, `${blocks} text blocks`);
  });

  // — Field caps —
  if (wc(head.title) > T.titleWords) flag('⚠️', 'FIELD-OVER-CAP', 'title', `${wc(head.title)} words, cap ${T.titleWords}`);
  if (wc(head.hook) > T.hookWords) flag('⚠️', 'FIELD-OVER-CAP', 'hook', `${wc(head.hook)} words, cap ${T.hookWords}`);
  if (wc(head.dek) > T.dekWords) flag('⚠️', 'FIELD-OVER-CAP', 'dek', `${wc(head.dek)} words, cap ${T.dekWords}`);
  if (/^The .+ That /i.test(head.title.replace(/\*/g, ''))) flag('⚠️', 'TITLE-FORMULA', 'title', `"${head.title}"`);
  if (head.hook && !/\d/.test(head.hook) && !/\byou\b/i.test(head.hook)) flag('⚠️', 'HOOK-ABSTRACT', 'hook', 'no number and no "you"');
  sectionsArr.forEach((s, i) => {
    const w = `section ${i + 1} (${s.kind})`;
    if (s.intro && wc(s.intro) > T.introWords) flag('⚠️', 'FIELD-OVER-CAP', `${w} intro`, `${wc(s.intro)} words, cap ${T.introWords}`);
    if (s.skimCaption && wc(s.skimCaption) > T.skimWords) flag('⚠️', 'FIELD-OVER-CAP', `${w} skimCaption`, `${wc(s.skimCaption)} words, cap ${T.skimWords}`);
    if (s.kind === 'prose') {
      const pw = wc(s.data?.lead ?? '') + arr(s.data?.paragraphs).reduce((a, p) => a + wc(p), 0);
      if (pw > T.proseSectionWords) flag('⚠️', 'FIELD-OVER-CAP', `${w} prose`, `${pw} words, cap ${T.proseSectionWords}`);
    }
    if (s.kind === 'timeline' && arr(s.data?.events).length > T.timelineEvents) flag('⚠️', 'FIELD-OVER-CAP', `${w} events`, `${s.data.events.length} events, cap ${T.timelineEvents}`);
    for (const e of arr(s.data?.events)) if (e?.note && wc(e.note) > T.timelineNoteWords) flag('⚠️', 'FIELD-OVER-CAP', `${w} event note`, `${wc(e.note)} words, cap ${T.timelineNoteWords}`);
    for (const t of arr(s.data?.tiles)) if (t?.note && wc(t.note) > T.tileNoteWords) flag('⚠️', 'FIELD-OVER-CAP', `${w} tile note`, `${wc(t.note)} words, cap ${T.tileNoteWords}`);
    if (s.kind === 'paradox') for (const sd of arr(s.data?.sides)) if (sd?.detail && wc(sd.detail) > T.paradoxDetailWords) flag('⚠️', 'FIELD-OVER-CAP', `${w} paradox detail`, `${wc(sd.detail)} words, cap ${T.paradoxDetailWords}`);
    for (const a of arr(s.data?.annotations)) if (a?.text && wc(a.text) > T.annotationWords) flag('⚠️', 'FIELD-OVER-CAP', `${w} annotation`, `${wc(a.text)} words, cap ${T.annotationWords}`);
    // The plain-language kinds' caps (their blueprints' §3, docs/design/blueprints/core/).
    const capField = (label, text, cap) => { if (text && wc(text) > cap) flag('⚠️', 'FIELD-OVER-CAP', `${w} ${label}`, `${wc(text)} words, cap ${cap}`); };
    if (s.kind === 'you-think') { capField('think.text', s.data?.think?.text, 30); capField('actually.text', s.data?.actually?.text, 30); capField('note', s.data?.note, 20); }
    if (s.kind === 'number-sense') { capField('label', s.data?.label, 8); capField('note', s.data?.note, 20); for (const e of arr(s.data?.equals)) { capField('equals.text', e?.text, 14); capField('equals.note', e?.note, 12); } }
    if (s.kind === 'jargon-buster') for (const t of arr(s.data?.terms)) { capField('meaning', t?.meaning, 25); capField('hindi', t?.hindi, 10); }
    if (s.kind === 'three-steps') for (const st of arr(s.data?.steps)) { capField('step title', st?.title, 6); capField('step text', st?.text, 25); }
    if (s.kind === 'analogy') for (const p of arr(s.data?.pairs)) { capField('pair.this', p?.this, 12); capField('pair.that', p?.that, 12); capField('pair.note', p?.note, 16); }
  });

  // — Sentences, paragraphs, rhythm, numbers —
  const allSent = [];
  for (const s of bodyStrings) {
    const ss = sentences(s.text);
    const lens = ss.map(wc);
    allSent.push(...lens);
    if (wc(s.text) > T.paragraphWords) flag('⚠️', 'PARA-OVER-CAP', `section ${s.sec + 1} ${s.field}`, `${wc(s.text)} words, cap ${T.paragraphWords}`);
    for (let i = 2; i < lens.length; i++) if (lens[i] < 8 && lens[i - 1] < 8 && lens[i - 2] < 8) { flag('⚠️', 'STACCATO', `section ${s.sec + 1} ${s.field}`, `three sentences under 8 words: "${ss[i - 2]} ${ss[i - 1]} ${ss[i]}"`); break; }
    ss.forEach((x) => { const n = numerals(x).length; if (n > T.numbersPerSentence) flag('⚠️', 'NUMBER-DENSE', `section ${s.sec + 1} ${s.field}`, `${n} numbers in one sentence: "${x.slice(0, 90)}…"`); });
    const np = numerals(s.text).length; if (np > T.numbersPerParagraph) flag('⚠️', 'NUMBER-DENSE', `section ${s.sec + 1} ${s.field}`, `${np} numbers in one paragraph`);
    if (['lead', 'paragraphs', 'intro', 'primer'].includes(s.key) && ss.length > 1 && wc(s.text) >= 25 && !/\b(because|so|which means|but|that means|matlab|kyunki|lekin)\b/i.test(s.text)) flag('ℹ', 'NO-CONNECTIVE', `section ${s.sec + 1} ${s.field}`, 'no because / so / which means / but');
    if (/\bIt is not [^.]+\. It is [^.]+\./.test(s.text) || /\b(is|was) not (an? |the )?[^.]{2,40}\. (It|That|This) (is|was) /.test(s.text)) flag('ℹ', 'BINARY-REFRAME', `section ${s.sec + 1} ${s.field}`, 'max one per issue');
    if (/\bFirst,?\b[\s\S]*\bSecond,?\b[\s\S]*\bThird,?\b/.test(s.text)) flag('⚠️', 'NUMBERED-MANIFESTO', `section ${s.sec + 1} ${s.field}`, 'First… Second… Third…');
  }

  // — The machine-prose marks (contract §6 tells 1, 18–21; operator ruling 2026-09-14) —
  // Checked over every reader-facing prose field except the precision layer's
  // labels and sources: em-dashes (none by default, hard cap one per issue),
  // semicolons in prose / captions / notes, the AI word list, the opening adverb.
  {
    const PROSE_EXEMPT = new Set(['source', 'label', 'unit', 'attribution', 'term', 'kicker', 'stamp', 'tag', 'badge', 'name', 'quote']); // a verbatim quote keeps its own punctuation
    const AI_WORDS = /\b(delve|delves|delving|tapestry|robust|leverage|leverages|leveraging|seamless|seamlessly|testament|underscores?|underscoring|pivotal|crucially|notably|arguably|nuanced|multifaceted|realm|unlock|unlocks|foster|fosters|harness|harnessing|elevate|elevates|game-changer|ever-evolving|fast-paced|at its core|the reality is|it's worth noting|it is worth noting)\b/i;
    const AI_FIG = /\b(navigate|navigating) (the|this|a) (landscape|complexit|terrain|challenge)|\b(the|a) landscape of\b|\bjourney (of|to|through|into)\b/i;
    let issueDashes = 0;
    for (const s of strings) {
      if (PROSE_EXEMPT.has(s.key) || s.field.includes('annotations') || s.field.includes('sources')) continue;
      // An em-dash, or a spaced en-dash used as one; 'May–July' and '1850–1900' are ranges.
      const dashes = (s.text.match(/—|\s–\s/g) || []).length;
      if (dashes) { issueDashes += dashes; flag('⚠️', 'EM-DASH', `section ${s.sec + 1} ${s.field}`, `${dashes} — none by default; a comma, a full stop or a new sentence`); }
      if (/;/.test(s.text)) flag('⚠️', 'SEMICOLON', `section ${s.sec + 1} ${s.field}`, `"${s.text.slice(0, 80)}" — a full stop instead`);
      const w = s.text.match(AI_WORDS) || s.text.match(AI_FIG);
      if (w) flag('⚠️', 'AI-WORD', `section ${s.sec + 1} ${s.field}`, `"${w[0]}"`);
      if (/(^|[.!?]\s+)(Notably|Crucially|Importantly|Interestingly|Ultimately|Essentially),/.test(s.text)) flag('⚠️', 'OPENING-ADVERB', `section ${s.sec + 1} ${s.field}`, s.text.match(/(Notably|Crucially|Importantly|Interestingly|Ultimately|Essentially),/)[0]);
      if (/\b(it'?s|is|was) not (just |only |merely )?about [^.]+, (it'?s|it is|but) about\b/i.test(s.text) || /\bless (a|an) [^.]+ than (a|an)\b/i.test(s.text)) flag('⚠️', 'NOT-X-BUT-Y', `section ${s.sec + 1} ${s.field}`, 'the reframe in another dress — say Y');
    }
    if (issueDashes > 1) flag('⚠️', 'EM-DASH-ISSUE', 'issue', `${issueDashes} em-dashes in prose; the hard cap is one`);
  }
  if (allSent.length) {
    const sorted = [...allSent].sort((a, b) => a - b);
    const mean = allSent.reduce((a, b) => a + b, 0) / allSent.length;
    const p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))];
    const max = sorted[sorted.length - 1];
    if (mean > T.sentenceMean) flag('⚠️', 'SENTENCE-MEAN', 'body prose', `mean ${mean.toFixed(1)} words, cap ${T.sentenceMean}`);
    if (p95 > T.sentenceP95) flag('⚠️', 'SENTENCE-P95', 'body prose', `95th percentile ${p95} words, cap ${T.sentenceP95}`);
    if (max > T.sentenceMax) flag('⚠️', 'SENTENCE-MAX', 'body prose', `longest ${max} words, cap ${T.sentenceMax}`);
  }

  // — Hand-holding floor (prose sections) —
  proseSecs.forEach((s) => {
    const i = sectionsArr.indexOf(s);
    const text = [s.intro, s.data?.lead, ...arr(s.data?.paragraphs)].filter(Boolean).join(' ');
    if (!/\b(in simple terms|in other words|that means|which means|to put that in perspective|put simply|matlab|basically|for context|the point is|here's the thing|so why|so what)\b/i.test(text)) flag('⚠️', 'NO-RESTATEMENT', `section ${i + 1} (prose)`, 'no restatement phrase');
    if (!/\b(think of|like a|like an|as if|imagine|picture|is like|sort of like|kind of like|the same way|the way a|jaise)\b/i.test(text)) flag('⚠️', 'NO-ANALOGY', `section ${i + 1} (prose)`, 'no analogy or worked example marker');
  });

  // — Names —
  const nameSet = new Set();
  for (const s of strings) if (s.body || ['title', 'hook', 'dek', 'primer', 'caption'].includes(s.key)) for (const n of names(s.text)) nameSet.add(n);
  if (nameSet.size > T.names) flag('⚠️', 'NAME-THROUGHPUT', 'issue', `${nameSet.size} distinct capitalised names (heuristic), cap ${T.names}: ${[...nameSet].slice(0, 12).join(', ')}…`);

  // — Jargon —
  const orderedText = strings.map((s) => s.text).join(' \n ');
  for (const term of JARGON) {
    const re = new RegExp(`(^|[^A-Za-z])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[^A-Za-z]|$)`, term.length <= 4 ? '' : 'i');
    const m = re.exec(orderedText);
    if (!m) continue;
    const from = m.index;
    // "Expected goals (xG)" is the gloss-then-abbreviation pattern: glossed.
    if (/\(\s*$/.test(orderedText.slice(Math.max(0, from - 3), from + m[1].length))) continue;
    const window = orderedText.slice(from, from + 320);
    const twoSentences = sentences(window).slice(0, 2).join(' ');
    if (!GLOSS_MARKERS.test(twoSentences.slice(term.length))) flag('⚠️', 'JARGON-UNGLOSSED', 'first use', `"${term}" — "${twoSentences.slice(0, 110)}…"`);
  }

  // — Hindi —
  for (const s of strings) {
    if (hasDevanagari(s.text)) flag('❌', 'HINDI-SCRIPT', `section ${s.sec + 1} ${s.field}`, 'Devanagari — Roman script only');
    // `jargon-buster`'s `hindi` slot is a Hindi-only field by design (its English
    // meaning sits beside it), so the density and load-bearing rules do not apply.
    if (s.key === 'hindi') continue;
    const hc = hindiContent(s.text);
    if (s.precision && hc.length) flag('❌', 'HINDI-FIELD', `section ${s.sec + 1} ${s.field}`, `Hindi in the precision layer: ${hc.join(', ')}`);
    const bt = bannedTokens(s.text);
    if (bt.length) flag('⚠️', 'HINDI-BANNED', `section ${s.sec + 1} ${s.field}`, bt.join(', '));
    if (!hc.length) continue;
    const ss = sentences(s.text);
    let withHindi = 0, prevHad = false;
    for (const x of ss) {
      const toks = words(x).map((w) => w.toLowerCase().replace(/[^a-z]/g, '')).filter(Boolean);
      const h = toks.filter((w) => HINDI_ALLOWED.has(w) && !ENGLISH_COLLIDERS.has(w)).length;
      const had = hindiContent(x).length > 0;
      if (had) withHindi++;
      if (had && prevHad) flag('⚠️', 'HINDI-CONSECUTIVE', `section ${s.sec + 1} ${s.field}`, `"${x.slice(0, 90)}"`);
      if (had && toks.length >= 4 && h / toks.length >= T.hindiLoadBearingShare) flag('⚠️', 'HINDI-LOAD-BEARING', `section ${s.sec + 1} ${s.field}`, `${Math.round(100 * h / toks.length)}% Hindi tokens: "${x.slice(0, 90)}" — the panel's Karthik decides`);
      prevHad = had;
    }
    if (withHindi > 1) flag('⚠️', 'HINDI-DENSE', `section ${s.sec + 1} ${s.field}`, `${withHindi} sentences carry Hindi in one block; ceiling one phrase per paragraph`);
  }

  // — Indian ground and foreign anchors —
  const all = strings.map((s) => s.text).join(' ');
  // Indian ground is money, place, institution OR habit (contract §3.5): a cricket
  // comparison anchors an issue as surely as a rupee does, and under rule 4 an issue
  // whose only money is historical carries no ₹ at all.
  const hasIndian = /₹|\b(lakh|crore|rupee|rupees|India|Indian|Delhi|Mumbai|Bengaluru|Chennai|Kolkata|Hyderabad|Lok Sabha|Rajya Sabha|IPL|cricket|Test match|net practice|penalty corner|hockey|Bollywood|monsoon|kirana|UPI|Aadhaar|Maggi)\b/.test(all);
  if (!hasIndian) flag('⚠️', 'NO-INDIAN-ANCHOR', 'issue', 'no ₹ / lakh / crore, no Indian place, institution or habit anywhere');
  // A dollar amount is "converted" once any string in the issue pairs it with a ₹
  // figure; after that, its bare repeats in cells and notes are not foreign anchors.
  // Flag each distinct unconverted amount once.
  {
    const amountsOf = (t) => (t.match(/(?:US)?\$\s?\d[\d,]*(?:\.\d+)?\s?(?:lakh|crore|million|billion|m|bn|k)?/gi) || []).map((a) => a.replace(/\s+/g, ' ').trim());
    const converted = new Set();
    for (const s of strings) if (/₹/.test(s.text)) for (const a of amountsOf(s.text)) converted.add(a);
    const seen = new Set();
    for (const s of strings) {
      for (const a of amountsOf(s.text)) {
        if (converted.has(a) || seen.has(a)) continue;
        seen.add(a);
        // Info, not a warning: a CURRENT figure wants "(about ₹…)", a HISTORICAL one
        // must stay unconverted (contract §3 rule 4), and only a reader knows which.
        flag('ℹ', 'FOREIGN-ANCHOR', `section ${s.sec + 1} ${s.field}`, `${a} carries no ₹ — right if historical, add "(about ₹…)" if current`);
      }
      if (/\b(miles?|Fahrenheit|°F|acres?|gallons?)\b/.test(s.text)) flag('⚠️', 'FOREIGN-ANCHOR', `section ${s.sec + 1} ${s.field}`, s.text.match(/\b(miles?|Fahrenheit|°F|acres?|gallons?)\b/)[0]);
    }
  }

  // — ARI, warn-only, English-dominant body sentences only —
  {
    let sc = 0, wcnt = 0, ch = 0;
    for (const s of bodyStrings) for (const x of sentences(s.text)) {
      if (hindiTokens(x).length) continue;
      const ws = words(x); sc++; wcnt += ws.length; ch += ws.join('').length;
    }
    if (sc >= 5) {
      const grade = automatedReadability({ sentence: sc, word: wcnt, character: ch });
      if (grade > T.ariGrade) flag('ℹ', 'ARI-HIGH', 'body prose', `ARI grade ${grade.toFixed(1)} on English-dominant sentences (warn-only floor ${T.ariGrade})`);
    }
  }

  // — Number preservation against the last committed version (rewrites) —
  {
    const rel = `src/content/issues/${slug}/index.mdx`;
    let prev = null;
    try { prev = execSync(`git show HEAD:${rel}`, { cwd: root, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { prev = null; }
    if (prev && prev !== raw) {
      // A section's `cues` (numerals and anchor ids) and its `[[n]]` markers
      // are structure, not reader numbers (Lens Phase 3): neither is counted.
      // Nor is the issue's `cover` block (Lens schema): its `section` is an
      // index and its `number` is copied from that section's data, which is
      // already counted, so adding a cover would read as two new numerals.
      const bare = (d) => { const { cover: _cover, ...x } = noCues(d); if (Array.isArray(x.sections)) x.sections = x.sections.map(({ cues, ...rest }) => rest); return x; };
      const count = (txt) => { const m = new Map(); for (const n of numerals(matter(txt).content + JSON.stringify(bare(matter(txt).data)))) m.set(n, (m.get(n) ?? 0) + 1); return m; };
      const a = count(prev), b = count(raw);
      const removed = [...a].filter(([n, c]) => (b.get(n) ?? 0) < c).map(([n]) => n);
      const added = [...b].filter(([n, c]) => (a.get(n) ?? 0) < c).map(([n]) => n);
      if (removed.length || added.length) flag(status === 'draft' ? 'ℹ' : '❌', 'NUMBER-DRIFT', 'vs HEAD', `numerals removed: ${removed.slice(0, 12).join(', ') || '—'} · added: ${added.slice(0, 12).join(', ') || '—'} (a rewrite copies numbers; it never retypes them — check each)`);
    }
  }

  // — Report —
  const blocking = flags.filter((f) => f.sev === '❌').length;
  blockingTotal += blocking;
  const warn = flags.filter((f) => f.sev === '⚠️').length;
  summary.push({ slug, status, readerWords, sections: kinds.length, visual: `${visual}/${kinds.length}`, graphics: `${graphics}/${kinds.length}`, newKinds: newKinds.length, sources: `${spread.n}/${spread.publishers}${spread.official ? `+${spread.official}` : ''}`, before, names: nameSet.size, blocking, warn });
  console.log(`\n${status === 'published' ? '●' : '○'} ${slug}  [${status}]  ${readerWords} reader words · ${kinds.length} sections, ${visual} visual, ${graphics} drawn, ${newKinds.length} new kind(s) · ${spread.line} · ${before} words before the first graphic · ${nameSet.size} names`);
  const order = { '❌': 0, '⚠️': 1, 'ℹ': 2 };
  for (const f of flags.sort((x, y) => order[x.sev] - order[y.sev] || x.code.localeCompare(y.code))) console.log(`   ${f.sev} ${f.code.padEnd(18)} ${f.where} — ${f.note}`);
  if (!flags.length) console.log('   clean');
}

// ── Summary ─────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(100));
console.log('slug'.padEnd(42) + 'status'.padEnd(11) + 'words'.padStart(6) + '  sections  visual   drawn  new  src/pub  before  names  ❌  ⚠️');
for (const r of summary.filter((r) => r.slug)) {
  console.log(r.slug.padEnd(42) + r.status.padEnd(11) + String(r.readerWords).padStart(6) + String(r.sections).padStart(9) + r.visual.padStart(9) + r.graphics.padStart(8) + String(r.newKinds).padStart(5) + r.sources.padStart(9) + String(r.before).padStart(8) + String(r.names).padStart(7) + String(r.blocking).padStart(4) + String(r.warn).padStart(4));
}
console.log(`\ncheck-prose: ${summary.filter((r) => r.slug).length} issue(s) · thresholds from docs/REGISTER-PLAN.md · ${GATE ? 'GATE mode (published only)' : 'report mode'}`);
if (GATE && blockingTotal) { console.error(`check-prose: ${blockingTotal} blocking flag(s).`); process.exit(1); }
