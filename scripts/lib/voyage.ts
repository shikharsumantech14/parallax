/**
 * Voyage AI client — embeddings (voyage-4) + reranker (rerank-2.5).
 *
 * Anthropic does not provide embeddings and recommends Voyage. voyage-4 is the
 * current generation (1024-dim default; int8 quantization via output_dtype) and
 * stays inside Voyage's 200M free monthly tokens at the Parallax corpus scale.
 *
 * No SDK — the REST API is a thin fetch. Needs VOYAGE_API_KEY.
 * Docs: https://docs.voyageai.com/docs/embeddings , /docs/reranker
 */
import { requireEnv } from './social.js';

const BASE = 'https://api.voyageai.com/v1';

export const EMBED_MODEL = process.env.VOYAGE_EMBED_MODEL ?? 'voyage-4';
export const RERANK_MODEL = process.env.VOYAGE_RERANK_MODEL ?? 'rerank-2.5';
export const EMBED_DIM = 1024;

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${requireEnv('VOYAGE_API_KEY')}`,
    'Content-Type': 'application/json',
  };
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * POST to Voyage with retry on 429. The free tier WITHOUT a payment method is
 * capped at ~3 RPM / 10K TPM, so we back off ~20s+ between retries. Add a
 * payment method on the Voyage dashboard for standard rate limits (the 200M
 * free monthly tokens still apply).
 */
async function postVoyage<T>(path: string, payload: unknown): Promise<T> {
  const maxRetries = Number(process.env.VOYAGE_MAX_RETRIES ?? '6');
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (res.ok) return (await res.json()) as T;
    const text = await res.text();
    if (res.status === 429 && attempt < maxRetries) {
      const waitMs = Math.min(60_000, Math.round(21_000 * Math.pow(1.4, attempt)));
      console.warn(`  Voyage 429 (rate limit) — waiting ${Math.round(waitMs / 1000)}s (retry ${attempt + 1}/${maxRetries})`);
      await sleep(waitMs);
      continue;
    }
    throw new Error(`Voyage ${path} ${res.status}: ${text}`);
  }
}

interface EmbedResponse {
  data: { embedding: number[]; index: number }[];
  usage?: { total_tokens: number };
}

/**
 * Embed up to ~128 inputs in one call. input_type 'document' for corpus chunks,
 * 'query' for a search query (Voyage tunes each side). Returns one vector per
 * input, in input order. int8 dtype → small integer components; pgvector stores
 * them as a vector(1024) and cosine distance is consistent as long as both the
 * stored chunks and the query use the same model/dtype/dim.
 */
export async function embed(
  inputs: string[],
  inputType: 'document' | 'query' = 'document',
): Promise<number[][]> {
  if (inputs.length === 0) return [];
  const json = await postVoyage<EmbedResponse>('/embeddings', {
    input: inputs,
    model: EMBED_MODEL,
    input_type: inputType,
    output_dimension: EMBED_DIM,
    output_dtype: 'int8',
  });
  const out: number[][] = [];
  for (const d of json.data.sort((a, b) => a.index - b.index)) out.push(d.embedding);
  return out;
}

export async function embedOne(input: string, inputType: 'document' | 'query' = 'query'): Promise<number[]> {
  return (await embed([input], inputType))[0];
}

interface RerankResponse {
  data: { index: number; relevance_score: number }[];
}

/**
 * Rerank `documents` against `query` with rerank-2.5. Returns the original
 * indices in relevance order (best first), truncated to topK.
 */
export async function rerank(
  query: string,
  documents: string[],
  topK: number,
): Promise<{ index: number; score: number }[]> {
  if (documents.length === 0) return [];
  const json = await postVoyage<RerankResponse>('/rerank', {
    query,
    documents,
    model: RERANK_MODEL,
    top_k: Math.min(topK, documents.length),
    return_documents: false,
  });
  return json.data
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .map((d) => ({ index: d.index, score: d.relevance_score }));
}
