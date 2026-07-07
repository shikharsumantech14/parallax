/**
 * Story/issue OG image generator (STORY-MODE-SPEC §5).
 *
 * Renders one 1200×630 link-preview PNG per non-draft issue into
 * public/og/story/<slug>.png, using the brand card system (scripts/social/
 * cards.ts `ogCard`). Runs at BUILD time via the `prebuild` npm hook — no DB,
 * no secrets, fonts + fs only — so both story pages (/s/<slug>/) and issue
 * pages (/issues/<slug>/) can point og:image at a deterministic asset.
 *
 *   npm run story:og      # (also runs automatically before `npm run build`)
 */
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { ogCard, toPng, type OgData } from '../social/cards.js';
import { stripEmphasis } from '../../src/lib/text.js';
import { TOPICS, type Topic } from '../lib/social.js';

const ISSUES_DIR = join(process.cwd(), 'src', 'content', 'issues');
const OUT_DIR = join(process.cwd(), 'public', 'og', 'story');

const DESK: Record<Topic, string> = {
  politics: 'Parliamentary Desk',
  space: 'Mission Control',
  earth: 'Field Atlas',
  tech: 'Tech Desk',
  travel: 'Field Bureau',
  sports: 'Matchday Programme',
};

function discoverIssues(): { slug: string; topic: Topic; title: string; dek: string }[] {
  const out: { slug: string; topic: Topic; title: string; dek: string }[] = [];
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
      title: stripEmphasis(String(data.title ?? entry)),
      dek: String(data.dek ?? data.hook ?? ''),
    });
  }
  return out;
}

function run(): void {
  mkdirSync(OUT_DIR, { recursive: true });
  const issues = discoverIssues();
  let n = 0;
  for (const iss of issues) {
    const d: OgData = {
      eyebrow: `Parallax · ${DESK[iss.topic]}`,
      title: iss.title,
      dek: iss.dek,
      source: 'parallaxlens.com',
    };
    const png = toPng(ogCard(d, iss.topic), 'og');
    const path = join(OUT_DIR, `${iss.slug}.png`);
    writeFileSync(path, png);
    console.log(`story:og  wrote public/og/story/${iss.slug}.png (${png.length} bytes)`);
    n++;
  }
  console.log(`story:og  ${n} card(s) rendered`);
  if (n === 0) { console.error('story:og  no non-draft issues found'); process.exit(1); }
}

run();
