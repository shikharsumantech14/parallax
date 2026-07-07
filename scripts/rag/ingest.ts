/**
 * RAG ingest — build the corpus, tier-gated and citation-safe.
 *
 *   npm run rag:ingest -- <topic> [--limit N] [--metadata]
 *   npm run rag:ingest -- url <url> <source_id> <tier> [viewpoint]
 *
 * Only sources marked `ingest: full` in the allowlist are full-text-ingested
 * (ingest_class='open-fulltext', quotable) — that gate is licence-respecting
 * (curators set ingest:full only for open/official/PD/CC works). Closed sources
 * stay metadata-only (guide-only; pass --metadata to ingest their title row).
 *
 * Every chunk carries full provenance + a source URL; ingest HARD-FAILS on any
 * chunk missing source_id/url, so the claim→source audit chain never breaks.
 *
 * Parsing: HTML via cheerio; PDF via a GROBID server (set GROBID_URL) for
 * page-accurate academic text — without GROBID, PDFs are skipped with a warning.
 *
 * Bills VOYAGE_API_KEY (embeddings) + needs PUBLIC_SUPABASE_URL +
 * SUPABASE_SERVICE_ROLE_KEY. Operator-run / weekly cron.
 */
import { loadEnvLocal, requireEnv, serviceClient } from '../lib/social.js';
import { embed } from '../lib/voyage.js';
import {
  parseAllowlist,
  chunkText,
  chunkHash,
  kindForTier,
  kebab,
  type AllowlistSource,
  type RagChunkInput,
  type Tier,
} from '../lib/rag.js';
import { createHash } from 'crypto';
import * as cheerio from 'cheerio';
import type { SupabaseClient } from '@supabase/supabase-js';

const EMBED_BATCH = 64;

export interface Extracted { text: string; isPdf: boolean }

export async function fetchAndExtract(url: string): Promise<Extracted | null> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ParallaxResearchBot/1.0 (+https://parallaxlens.com)' },
    redirect: 'follow',
  });
  if (!res.ok) { console.warn(`  fetch ${res.status} for ${url}`); return null; }
  const ctype = res.headers.get('content-type') ?? '';

  if (ctype.includes('pdf') || url.toLowerCase().endsWith('.pdf')) {
    const grobid = process.env.GROBID_URL;
    if (!grobid) { console.warn(`  PDF skipped (set GROBID_URL to ingest): ${url}`); return null; }
    const buf = Buffer.from(await res.arrayBuffer());
    const fd = new FormData();
    fd.append('input', new Blob([buf], { type: 'application/pdf' }), 'doc.pdf');
    const tei = await fetch(`${grobid.replace(/\/$/, '')}/api/processFulltextDocument`, {
      method: 'POST',
      body: fd,
    });
    if (!tei.ok) { console.warn(`  GROBID ${tei.status} for ${url}`); return null; }
    const $ = cheerio.load(await tei.text(), { xmlMode: true });
    const text = $('text body').text() || $('body').text();
    return { text: text.replace(/\s+\n/g, '\n').trim(), isPdf: true };
  }

  // HTML / text
  const html = await res.text();
  if (!ctype.includes('html') && !/<html/i.test(html)) {
    return { text: html.trim(), isPdf: false };
  }
  const $ = cheerio.load(html);
  $('script, style, nav, header, footer, aside, form, noscript, iframe').remove();
  const root = $('article').length ? $('article') : $('main').length ? $('main') : $('body');
  // paragraph-structured text so the chunker can split on \n\n
  const parts: string[] = [];
  root.find('h1, h2, h3, p, li, blockquote').each((_, el) => {
    const t = $(el).text().replace(/\s+/g, ' ').trim();
    if (t.length > 0) parts.push(t);
  });
  const text = (parts.length ? parts.join('\n\n') : root.text()).trim();
  return { text, isPdf: false };
}

async function ingestSource(
  supabase: SupabaseClient | null,
  src: AllowlistSource,
  opts: { dry: boolean },
): Promise<number> {
  if (!src.url) throw new Error(`source ${src.source_id} has no url — cannot ingest (citation integrity)`);
  console.log(`• ${src.source_id} (${src.tier}) ${src.url}`);
  const ex = await fetchAndExtract(src.url);
  if (!ex || ex.text.length < 200) { console.warn('  no usable text — skipped'); return 0; }

  const docVersion = createHash('sha256').update(ex.text).digest('hex').slice(0, 16);
  const chunks = chunkText(ex.text);
  const retrievedAt = new Date().toISOString();
  const viewpoint = src.viewpoint && src.viewpoint !== 'n/a' ? src.viewpoint : null;

  const rows: RagChunkInput[] = chunks.map((content) => ({
    source_id: src.source_id,
    work_title: src.name,
    authors: null,
    year: null,
    venue: null,
    doi_or_url: src.url,
    license: null,
    tier: src.tier,
    viewpoint,
    ingest_class: 'open-fulltext',
    kind: kindForTier(src.tier),
    section_title: null,
    page_start: null,
    page_end: null,
    char_span: content.length,
    content,
    chunk_hash: chunkHash(src.source_id, docVersion, content),
    retrieved_at: retrievedAt,
  }));

  if (opts.dry) { console.log(`  [dry] ${rows.length} chunks (not embedded/written)`); return rows.length; }
  if (!supabase) return rows.length;

  // Embed in batches (Voyage document vectors).
  for (let i = 0; i < rows.length; i += EMBED_BATCH) {
    const batch = rows.slice(i, i + EMBED_BATCH);
    const vectors = await embed(batch.map((r) => r.content), 'document');
    batch.forEach((r, j) => (r.embedding = vectors[j]));
  }

  const { error } = await supabase
    .from('rag_chunks')
    .upsert(rows, { onConflict: 'chunk_hash', ignoreDuplicates: true });
  if (error) throw new Error(`rag_chunks upsert failed (${src.source_id}): ${error.message}`);

  console.log(`  ✓ ${rows.length} chunks`);
  return rows.length;
}

async function main(): Promise<void> {
  loadEnvLocal();
  const args = process.argv.slice(2);
  const dry = args.includes('--dry');
  if (!dry) { requireEnv('VOYAGE_API_KEY'); requireEnv('PUBLIC_SUPABASE_URL'); requireEnv('SUPABASE_SERVICE_ROLE_KEY'); }
  const supabase = dry ? null : serviceClient();

  let sources: AllowlistSource[];

  if (args[0] === 'url') {
    const [, url, sourceId, tier, viewpoint] = args;
    if (!url || !sourceId || !tier) {
      console.error('Usage: npm run rag:ingest -- url <url> <source_id> <tier> [viewpoint]');
      process.exit(1);
    }
    sources = [{
      source_id: kebab(sourceId), name: sourceId, url, tier: tier as Tier,
      access: 'open', ingest: 'full', viewpoint: viewpoint ?? 'n/a', cadence: 'live',
    }];
  } else {
    const topic = args[0];
    if (!topic) {
      console.error('Usage: npm run rag:ingest -- <topic> [--limit N] | url <url> <source_id> <tier>');
      process.exit(1);
    }
    const limIdx = args.indexOf('--limit');
    const limit = limIdx !== -1 ? Number(args[limIdx + 1]) : Infinity;
    // Tier-gate: only ingest:full sources get full-text ingestion (open-fulltext).
    sources = parseAllowlist(topic).filter((s) => s.ingest === 'full').slice(0, limit);
    console.log(`${topic}: ${sources.length} ingest:full sources to process.\n`);
  }

  let total = 0;
  for (const src of sources) {
    try {
      total += await ingestSource(supabase, src, { dry });
    } catch (err) {
      console.error(`  ! ${src.source_id}: ${err instanceof Error ? err.message : err}`);
    }
  }
  console.log(`\nDone. ${total} chunks ${dry ? 'previewed' : 'ingested'}.`);
}

const invokedDirectly = process.argv[1] && process.argv[1].endsWith('ingest.ts');
if (invokedDirectly) {
  main().catch((err) => {
    console.error('rag:ingest failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
