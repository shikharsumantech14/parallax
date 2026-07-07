/**
 * RAG harvesters — pull ACTUAL documents (not landing pages) into the corpus,
 * with rich provenance. The fix for the "allowlist URLs are hubs" problem.
 *
 *   npm run rag:harvest -- openalex <topic|all> [--limit N] [--dry]
 *   npm run rag:harvest -- local    <topic|all> [--dry]
 *
 * - **openalex**: queries the free OpenAlex API for the topic's most-cited
 *   OPEN-ACCESS works and ingests each OA full text with author/year/venue/doi/
 *   licence provenance. PDFs need GROBID_URL (else skipped); OA HTML ingests now.
 *   Quotability follows the licence: cc-by/cc0/PD → open-fulltext (quotable);
 *   anything else (incl. -nc/-nd) → stored retrievable-but-metadata-only.
 * - **local**: ingests files you drop in research/_corpus/<topic>/ (.txt/.md/.html
 *   now; .pdf via GROBID). For owned/PD books + specific reports you legally hold.
 *
 * Bills VOYAGE_API_KEY; needs PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 * Set OPENALEX_API_KEY (free; the mailto polite-pool was retired Feb 2026).
 */
import { readdirSync, existsSync, readFileSync } from 'fs';
import { join, extname, basename } from 'path';
import { createHash } from 'crypto';
import * as cheerio from 'cheerio';
import { fetchAndExtract } from './ingest.js';
import { embed } from '../lib/voyage.js';
import {
  chunkText, chunkHash, kindForTier, kebab,
  type RagChunkInput, type Tier, type IngestClass, type ChunkKind,
} from '../lib/rag.js';
import { loadEnvLocal, requireEnv, serviceClient, TOPICS, type Topic } from '../lib/social.js';
import type { SupabaseClient } from '@supabase/supabase-js';

const EMBED_BATCH = 64;

interface DocRef {
  url?: string; file?: string; abstract?: string | null;
  source_id: string; tier: Tier;
  work_title: string; authors?: string | null; year?: number | null; venue?: string | null;
  doi_or_url: string; license?: string | null; viewpoint?: string | null;
  ingest_class: IngestClass; kind: ChunkKind;
}

// commercial-quotable licences (open-fulltext); -nc/-nd or unknown → metadata-only
function classForLicense(lic: string | null | undefined): IngestClass {
  return lic && /(cc-?by(-sa)?|cc0|public[- ]?domain)/i.test(lic) && !/nc|nd/i.test(lic)
    ? 'open-fulltext' : 'metadata-only';
}

// OpenAlex returns abstracts as an inverted index {word: [positions]} — rebuild the text.
function fromInverted(idx?: Record<string, number[]>): string | null {
  if (!idx) return null;
  const words: string[] = [];
  for (const [word, positions] of Object.entries(idx)) for (const p of positions) words[p] = word;
  const s = words.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  return s.length > 40 ? s : null;
}

// ── OpenAlex ──────────────────────────────────────────────────────────────────
const OPENALEX_QUERY: Record<Topic, string> = {
  politics: 'electoral systems OR constitutional law OR legislative process OR democratic backsliding',
  space: 'orbital debris OR planetary defense OR asteroid OR spaceflight OR satellite constellation',
  earth: 'climate change OR sea level rise OR earth system OR carbon emissions OR climate tipping point',
  tech: 'large language models OR semiconductor OR machine learning OR data center energy',
  travel: 'tourism economics OR aviation OR overtourism OR air travel demand',
  sports: 'expected goals OR sports analytics OR football tactics OR athletic performance',
};

interface OAWork {
  id?: string; title?: string; display_name?: string; doi?: string; publication_year?: number;
  authorships?: { author?: { display_name?: string } }[];
  open_access?: { oa_url?: string };
  best_oa_location?: OALoc; primary_location?: OALoc;
  abstract_inverted_index?: Record<string, number[]>;
}
interface OALoc { pdf_url?: string; landing_page_url?: string; license?: string; source?: { display_name?: string } }

async function openalexHarvest(topic: Topic, limit: number): Promise<DocRef[]> {
  const params = new URLSearchParams({
    search: OPENALEX_QUERY[topic], // relevance sort is the default when `search` is set
    filter: 'open_access.is_oa:true',
    'per-page': String(Math.min(limit, 50)),
  });
  if (process.env.OPENALEX_API_KEY) params.set('api_key', process.env.OPENALEX_API_KEY);
  else if (process.env.OPENALEX_MAILTO) params.set('mailto', process.env.OPENALEX_MAILTO);
  const res = await fetch(`https://api.openalex.org/works?${params.toString()}`);
  if (!res.ok) { console.warn(`  OpenAlex ${res.status} (set OPENALEX_API_KEY if 403): ${(await res.text()).slice(0, 120)}`); return []; }
  const json = (await res.json()) as { results?: OAWork[] };
  const docs: DocRef[] = [];
  for (const w of json.results ?? []) {
    const best = w.best_oa_location ?? w.primary_location ?? {};
    const url = best.pdf_url || w.open_access?.oa_url || best.landing_page_url;
    if (!url) continue;
    const license = best.license ?? null;
    const authors = (w.authorships ?? []).slice(0, 6).map((a) => a.author?.display_name).filter(Boolean).join(', ') || null;
    const oaId = (w.id ?? '').split('/').pop() || kebab(w.title ?? 'work');
    docs.push({
      url, source_id: kebab(`oa ${oaId}`), tier: 'T2',
      work_title: w.title || w.display_name || 'Untitled',
      authors, year: w.publication_year ?? null, venue: best.source?.display_name ?? null,
      doi_or_url: w.doi || url, license, viewpoint: null,
      ingest_class: classForLicense(license), kind: 'research-paper',
      abstract: fromInverted(w.abstract_inverted_index),
    });
  }
  return docs;
}

// ── local drop folder ─────────────────────────────────────────────────────────
function localHarvest(topic: Topic): DocRef[] {
  const dir = join(process.cwd(), 'research', '_corpus', topic);
  if (!existsSync(dir)) return [];
  const docs: DocRef[] = [];
  for (const f of readdirSync(dir)) {
    const ext = extname(f).toLowerCase();
    if (!['.txt', '.md', '.html', '.htm', '.pdf'].includes(ext)) continue;
    const title = basename(f, ext).replace(/[-_]+/g, ' ').trim();
    const tier: Tier = ext === '.pdf' ? 'T6' : 'T5';
    docs.push({
      file: join(dir, f), source_id: kebab(`local ${topic} ${title}`), tier,
      work_title: title, doi_or_url: `local:${topic}/${f}`,
      license: 'operator-supplied (owned/PD)', ingest_class: 'open-fulltext', kind: kindForTier(tier),
    });
  }
  return docs;
}

async function extractLocal(file: string): Promise<string | null> {
  const ext = extname(file).toLowerCase();
  if (ext === '.txt' || ext === '.md') return readFileSync(file, 'utf-8');
  if (ext === '.html' || ext === '.htm') {
    const $ = cheerio.load(readFileSync(file, 'utf-8'));
    $('script,style,nav,header,footer,aside,form,noscript').remove();
    const parts: string[] = [];
    $('h1,h2,h3,p,li,blockquote').each((_, el) => { const t = $(el).text().replace(/\s+/g, ' ').trim(); if (t) parts.push(t); });
    return parts.join('\n\n');
  }
  if (ext === '.pdf') {
    const grobid = process.env.GROBID_URL;
    if (!grobid) { console.warn(`  local PDF skipped (set GROBID_URL): ${file}`); return null; }
    const fd = new FormData();
    fd.append('input', new Blob([readFileSync(file)], { type: 'application/pdf' }), 'doc.pdf');
    const tei = await fetch(`${grobid.replace(/\/$/, '')}/api/processFulltextDocument`, { method: 'POST', body: fd });
    if (!tei.ok) { console.warn(`  GROBID ${tei.status} for ${file}`); return null; }
    const $ = cheerio.load(await tei.text(), { xmlMode: true });
    return ($('text body').text() || $('body').text()).replace(/\s+\n/g, '\n').trim();
  }
  return null;
}

async function ingestDocs(supabase: SupabaseClient | null, docs: DocRef[], dry: boolean): Promise<number> {
  let total = 0;
  for (const d of docs) {
    const label = d.work_title.slice(0, 60);
    try {
      let text = d.file ? await extractLocal(d.file) : d.url ? (await fetchAndExtract(d.url))?.text ?? null : null;
      let cls: IngestClass = d.ingest_class;
      // full text unfetchable (publisher block / PDF without GROBID) → fall back to the
      // abstract as a metadata-only chunk, so the paper still lands with provenance.
      if ((!text || text.length < 200) && d.abstract && d.abstract.length >= 100) { text = d.abstract; cls = 'metadata-only'; }
      if (!text || text.length < 200) { console.warn(`  • ${label}: no usable text — skipped`); continue; }
      const docVersion = createHash('sha256').update(text).digest('hex').slice(0, 16);
      const retrievedAt = new Date().toISOString();
      const rows: RagChunkInput[] = chunkText(text).map((content) => ({
        source_id: d.source_id, work_title: d.work_title, authors: d.authors ?? null, year: d.year ?? null,
        venue: d.venue ?? null, doi_or_url: d.doi_or_url, license: d.license ?? null, tier: d.tier,
        viewpoint: d.viewpoint ?? null, ingest_class: cls, kind: d.kind,
        section_title: null, page_start: null, page_end: null, char_span: content.length,
        content, chunk_hash: chunkHash(d.source_id, docVersion, content), retrieved_at: retrievedAt,
      }));
      console.log(`  • ${label} (${d.tier}/${d.ingest_class}): ${rows.length} chunks`);
      total += rows.length;
      if (dry || !supabase) continue;
      for (let i = 0; i < rows.length; i += EMBED_BATCH) {
        const b = rows.slice(i, i + EMBED_BATCH);
        const v = await embed(b.map((r) => r.content), 'document');
        b.forEach((r, j) => (r.embedding = v[j]));
      }
      const { error } = await supabase.from('rag_chunks').upsert(rows, { onConflict: 'chunk_hash', ignoreDuplicates: true });
      if (error) throw new Error(error.message);
    } catch (err) { console.warn(`  ! ${label}: ${err instanceof Error ? err.message : err}`); }
  }
  return total;
}

async function main(): Promise<void> {
  loadEnvLocal();
  const args = process.argv.slice(2);
  const mode = args[0];
  const topicArg = (args[1] ?? 'all').toLowerCase();
  const dry = args.includes('--dry');
  const limIdx = args.indexOf('--limit');
  const limit = limIdx !== -1 ? Number(args[limIdx + 1]) : 20;
  if (mode !== 'openalex' && mode !== 'local') {
    console.error('Usage: npm run rag:harvest -- <openalex|local> <topic|all> [--limit N] [--dry]');
    process.exit(1);
  }
  if (!dry) { requireEnv('VOYAGE_API_KEY'); requireEnv('PUBLIC_SUPABASE_URL'); requireEnv('SUPABASE_SERVICE_ROLE_KEY'); }
  const supabase = dry ? null : serviceClient();
  const topics: Topic[] = topicArg === 'all' ? [...TOPICS] : [topicArg as Topic];
  if (topicArg !== 'all' && !TOPICS.includes(topicArg as Topic)) {
    console.error(`Unknown topic. Use one of: ${TOPICS.join(', ')} | all`); process.exit(1);
  }

  let total = 0;
  for (const t of topics) {
    console.log(`\n=== ${mode} · ${t} ===`);
    const docs = mode === 'openalex' ? await openalexHarvest(t, limit) : localHarvest(t);
    if (!docs.length) { console.log(mode === 'local' ? '  (no files in research/_corpus/' + t + '/)' : '  (no docs returned)'); continue; }
    total += await ingestDocs(supabase, docs, dry);
  }
  console.log(`\nDone. ${total} chunks ${dry ? 'previewed' : 'ingested'}.`);
}

const invokedDirectly = process.argv[1] && process.argv[1].endsWith('harvest.ts');
if (invokedDirectly) main().catch((err) => { console.error('rag:harvest failed:', err instanceof Error ? err.message : err); process.exit(1); });
