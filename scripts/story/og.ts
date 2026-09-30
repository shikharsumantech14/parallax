/**
 * Story/issue OG image generator (STORY-MODE-SPEC §5).
 *
 * Renders one 1200×630 link-preview PNG per non-draft issue into
 * public/og/story/<slug>.png, using the brand card renderer (./og-card.ts).
 * Runs at BUILD time via the `prebuild` npm hook — no DB,
 * no secrets, fonts + fs only — so both story pages (/s/<slug>/) and issue
 * pages (/issues/<slug>/) can point og:image at a deterministic asset.
 *
 *   npm run story:og      # (also runs automatically before `npm run build`)
 */
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { ogCard, toPng, TOPICS, type OgData, type Topic } from './og-card.js';
import { DESK_REGISTER } from '../../src/lib/desks.js';
import { canonicalKind } from '../lib/kind-aliases.mjs';

const ISSUES_DIR = join(process.cwd(), 'src', 'content', 'issues');
const OUT_DIR = join(process.cwd(), 'public', 'og', 'story');

interface Found {
  slug: string; topic: Topic; title: string; publishedAt: number; readTime?: number;
  sections?: unknown[]; cover?: OgData['cover'];
}

function discoverIssues(): Found[] {
  const out: Found[] = [];
  for (const entry of readdirSync(ISSUES_DIR)) {
    if (entry.startsWith('_')) continue; // _template, _AGENTS.md
    const dir = join(ISSUES_DIR, entry);
    let mdx: string;
    try {
      if (!statSync(dir).isDirectory()) continue;
      mdx = readFileSync(join(dir, 'index.mdx'), 'utf-8');
    } catch { continue; }
    const { data } = matter(mdx);
    if (!data || data.status === 'draft') continue;
    if (!TOPICS.includes(data.topic)) continue;
    out.push({
      slug: entry,
      topic: data.topic as Topic,
      title: String(data.title ?? entry),
      publishedAt: new Date(data.publishedAt).getTime(),
      readTime: typeof data.readTimeMinutes === 'number' ? data.readTimeMinutes : undefined,
      /* Retired kind names resolve to their host, as the schema does. */
      sections: Array.isArray(data.sections)
        ? data.sections.map((sec: any) => ({ ...sec, kind: canonicalKind(sec?.kind) }))
        : undefined,
      cover: data.cover,
    });
  }
  return out;
}

function run(): void {
  mkdirSync(OUT_DIR, { recursive: true });
  const issues = discoverIssues();
  /* Issue numbers the way the site derives them (src/lib/issue-number.ts):
     every non-draft issue, oldest first, ties broken by slug. */
  const order = [...issues].sort((a, b) => a.publishedAt - b.publishedAt || a.slug.localeCompare(b.slug));
  const numberOf = new Map(order.map((i, k) => [i.slug, k + 1]));
  let n = 0;
  for (const iss of issues) {
    const no = `No ${String(numberOf.get(iss.slug)).padStart(2, '0')}`;
    const d: OgData = {
      eyebrow: `Parallax · ${DESK_REGISTER[iss.topic]}`,
      title: iss.title,
      meta: [no, iss.readTime ? `${iss.readTime} min` : undefined, 'parallaxlens.com'].filter(Boolean).join(' · '),
      sections: iss.sections,
      cover: iss.cover,
    };
    const png = toPng(ogCard(d, iss.topic));
    const path = join(OUT_DIR, `${iss.slug}.png`);
    writeFileSync(path, png);
    console.log(`story:og  wrote public/og/story/${iss.slug}.png (${png.length} bytes)`);
    n++;
  }
  console.log(`story:og  ${n} card(s) rendered`);
  if (n === 0) { console.error('story:og  no non-draft issues found'); process.exit(1); }
}

run();
