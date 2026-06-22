/**
 * Shared RAG helpers: chunking, the allowlist source-manifest parser, the
 * chunk provenance type, and stable chunk hashing. Used by scripts/rag/*.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

export type Tier = 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7';
export type IngestField = 'full' | 'metadata' | 'live';
export type IngestClass = 'open-fulltext' | 'metadata-only';
export type ChunkKind =
  | 'article'
  | 'research-paper'
  | 'book-chapter'
  | 'dataset'
  | 'podcast-transcript'
  | 'official-document'
  | 'report';

/** One source line parsed from a research/_sources/<topic>.md allowlist. */
export interface AllowlistSource {
  source_id: string; // derived: kebab(name)
  name: string;
  url: string;
  tier: Tier;
  access: string;
  ingest: IngestField;
  viewpoint: string;
  cadence: string;
}

/** A chunk ready to upsert into rag_chunks (mirrors the table columns). */
export interface RagChunkInput {
  source_id: string;
  work_title: string | null;
  authors: string | null;
  year: number | null;
  venue: string | null;
  doi_or_url: string; // REQUIRED — ingest hard-fails without it
  license: string | null;
  tier: Tier;
  viewpoint: string | null;
  ingest_class: IngestClass;
  kind: ChunkKind;
  section_title: string | null;
  page_start: number | null;
  page_end: number | null;
  char_span: number;
  content: string;
  chunk_hash: string;
  retrieved_at: string;
  embedding?: number[];
}

export function kebab(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

/** Default chunk kind for a tier (overridable per source). */
export function kindForTier(tier: Tier): ChunkKind {
  switch (tier) {
    case 'T0': return 'official-document';
    case 'T1': return 'dataset';
    case 'T2': return 'research-paper';
    case 'T5': return 'book-chapter';
    case 'T6': return 'report';
    default: return 'article';
  }
}

/**
 * Parse a research/_sources/<topic>.md allowlist into structured sources.
 * Line format (see _TAXONOMY.md §2):
 *   - **Name** — <url> — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: ...
 */
export function parseAllowlist(topic: string, cwd: string = process.cwd()): AllowlistSource[] {
  const md = readFileSync(join(cwd, 'research', '_sources', `${topic}.md`), 'utf-8');
  const out: AllowlistSource[] = [];
  const lineRe =
    /^- \*\*(.+?)\*\*\s+—\s+(\S+)\s+—\s+tier:\s*(T[0-7])\s*·\s*access:\s*(\S+)\s*·\s*ingest:\s*(full|metadata|live)\s*·\s*viewpoint:\s*([^·]+?)\s*·\s*cadence:\s*(\S+)/;
  for (const line of md.split('\n')) {
    const m = line.match(lineRe);
    if (!m) continue;
    const [, name, url, tier, access, ingest, viewpoint, cadence] = m;
    out.push({
      source_id: kebab(name),
      name: name.trim(),
      url: url.trim(),
      tier: tier as Tier,
      access: access.trim(),
      ingest: ingest as IngestField,
      viewpoint: viewpoint.trim(),
      cadence: cadence.trim(),
    });
  }
  return out;
}

export function chunkHash(sourceId: string, docVersion: string, content: string): string {
  return createHash('sha256').update(`${sourceId}|${docVersion}|${content}`).digest('hex');
}

/**
 * Paragraph-aware chunking. Accumulates paragraphs up to ~targetWords, with a
 * ~15% word overlap carried into the next chunk so a claim split across a
 * boundary is still retrievable. Returns chunk strings in order.
 */
export function chunkText(
  text: string,
  opts: { targetWords?: number; overlap?: number } = {},
): string[] {
  const targetWords = opts.targetWords ?? 600; // ~800 tokens
  const overlap = opts.overlap ?? Math.round(targetWords * 0.15);
  const paras = text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 0);

  const chunks: string[] = [];
  let buf: string[] = [];
  let count = 0;

  const flush = () => {
    if (buf.length === 0) return;
    chunks.push(buf.join(' '));
    // carry the last `overlap` words into the next buffer
    const words = buf.join(' ').split(' ');
    const tail = words.slice(Math.max(0, words.length - overlap));
    buf = tail.length ? [tail.join(' ')] : [];
    count = tail.length;
  };

  for (const p of paras) {
    const w = p.split(' ').length;
    if (w >= targetWords * 1.5) {
      // a very long paragraph: split it on sentences into target-sized pieces
      flush();
      const sentences = p.split(/(?<=[.!?])\s+/);
      let sb: string[] = [];
      let sc = 0;
      for (const s of sentences) {
        sb.push(s);
        sc += s.split(' ').length;
        if (sc >= targetWords) { chunks.push(sb.join(' ')); sb = []; sc = 0; }
      }
      if (sb.length) chunks.push(sb.join(' '));
      buf = [];
      count = 0;
      continue;
    }
    if (count + w > targetWords && buf.length) flush();
    buf.push(p);
    count += w;
  }
  flush();
  return chunks.filter((c) => c.trim().length > 0);
}
