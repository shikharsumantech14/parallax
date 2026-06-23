/**
 * Section-data extractor — pull an issue's real `sections[]` data into the social
 * card archetype shapes, so the pipeline renders cards from the actual issue
 * (not hand-authored samples). Strips the issues' inline markdown (**bold**, *em*).
 *
 *   npx tsx scripts/social/extract.ts <issue-path-or-slug>  # render every renderable section to .cache
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import type { Topic } from '../lib/social.js';
import {
  renderByKind, toPng,
  type CardKind, type ReadoutData, type ParadoxData, type TimelineData, type ComparisonData,
} from './cards.js';

const strip = (s: unknown) => String(s ?? '').replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '').replace(/\s+/g, ' ').trim();

interface Section { kind: string; eyebrow?: string; title?: string; data?: Record<string, unknown> }
type AnyRec = Record<string, unknown>;

export function loadIssue(pathOrSlug: string): { topic: Topic; title: string; sections: Section[] } {
  const path = pathOrSlug.endsWith('.mdx')
    ? pathOrSlug
    : join(process.cwd(), 'src', 'content', 'issues', pathOrSlug, 'index.mdx');
  if (!existsSync(path)) throw new Error(`issue not found: ${path}`);
  const fm = matter(readFileSync(path, 'utf-8')).data as AnyRec;
  return { topic: fm.topic as Topic, title: String(fm.title ?? ''), sections: (fm.sections ?? []) as Section[] };
}

export function findSection(sections: Section[], kind: string, nth = 0): Section | null {
  const matches = sections.filter((s) => s.kind === kind);
  return matches[nth] ?? matches[0] ?? null;
}

/** Map a section to (kind, archetype data). Returns null for non-renderable kinds. */
export function sectionToCard(s: Section): { kind: CardKind; data: ReadoutData | ParadoxData | TimelineData | ComparisonData } | null {
  const eyebrow = strip(s.eyebrow);
  const title = strip(s.title);
  const d = (s.data ?? {}) as AnyRec;
  const source = strip(d.source);
  const arr = (k: string): AnyRec[] => (Array.isArray(d[k]) ? (d[k] as AnyRec[]) : []);

  switch (s.kind) {
    case 'data-readout':
      return { kind: 'data-readout', data: { eyebrow, title, source,
        tiles: arr('tiles').map((t) => ({ value: strip(`${t.value ?? ''}${t.unit ?? ''}`), label: strip(t.label), note: t.note ? strip(t.note) : undefined, emphasis: t.emphasis as 'default' | 'key' | 'warn' | undefined })) } };
    case 'paradox':
      return { kind: 'paradox', data: { eyebrow, title, source,
        sides: arr('sides').slice(0, 2).map((x) => ({ label: strip(x.label), statement: strip(x.statement), detail: x.detail ? strip(x.detail) : undefined })) as ParadoxData['sides'] } };
    case 'timeline':
      return { kind: 'timeline', data: { eyebrow, title, source,
        events: arr('events').map((e) => ({ date: strip(e.date), label: strip(e.label), state: e.state as TimelineData['events'][0]['state'] })) } };
    case 'comparison':
      return { kind: 'comparison', data: { eyebrow, title, source,
        sides: arr('sides').slice(0, 2).map((x) => ({ label: strip(x.label), title: strip(x.title), kicker: x.kicker ? strip(x.kicker) : undefined, tag: x.tag ? strip(x.tag) : undefined })) as ComparisonData['sides'],
        rows: arr('rows').map((r) => ({ label: strip(r.label), values: (Array.isArray(r.values) ? r.values : []).map(strip) })) } };
    default:
      return null;
  }
}

// ── CLI: render every renderable section of an issue ──────────────────────────
function main(): void {
  const arg = process.argv[2];
  if (!arg) { console.error('usage: tsx scripts/social/extract.ts <issue-path-or-slug>'); process.exit(1); }
  const issue = loadIssue(arg);
  const outDir = join(process.cwd(), '.cache', 'social-cards');
  mkdirSync(outDir, { recursive: true });
  const seen = new Set<string>();
  let n = 0;
  for (const s of issue.sections) {
    const card = sectionToCard(s);
    if (!card || seen.has(card.kind)) continue; // one per kind for the test
    seen.add(card.kind);
    const name = `real-${card.kind}`;
    const svg = renderByKind(card.kind, card.data, issue.topic);
    writeFileSync(join(outDir, `${name}.png`), toPng(svg, 'wide'));
    console.log(`wrote ${name}.png  (${issue.topic} · ${card.kind})`);
    n++;
  }
  if (!n) console.log('No renderable sections (comparison/data-readout/paradox/timeline) found.');
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('scripts/social/extract.ts');
if (invokedDirectly) main();
