/**
 * In-process MCP server exposing the RAG corpus to the editorial agents as the
 * tool `mcp__parallax_rag__search`. Registered in scripts/lib/runner.ts via the
 * query() `mcpServers` option; an agent can call it only if its frontmatter
 * `tools:` lists `mcp__parallax_rag__search`.
 *
 * Read-only + auditable (every call shows in the tool_use log). The handler
 * degrades gracefully: if the corpus isn't ingested or VOYAGE/Supabase env is
 * absent, it returns a message telling the agent to fall back to allowlisted
 * WebSearch/WebFetch (so a missing corpus never breaks a pipeline run).
 */
import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import { ragSearch, type RagHit } from '../rag/search.js';
import type { Tier } from '../lib/rag.js';

function formatHit(h: RagHit, i: number): string {
  const quote = h.ingest_class === 'open-fulltext' ? 'QUOTABLE' : 'GUIDE-ONLY (do not quote)';
  const page = h.page_start ? ` · p.${h.page_start}${h.page_end && h.page_end !== h.page_start ? `–${h.page_end}` : ''}` : '';
  return [
    `[${i + 1}] ${h.tier} · ${quote} · source_id=${h.source_id}`,
    `    ${h.work_title ?? h.source_id}${h.authors ? ` — ${h.authors}` : ''}${h.year ? ` (${h.year})` : ''}`,
    `    cite: ${h.source_url}${page}`,
    `    ${h.content}`,
  ].join('\n');
}

export const ragMcpServer = createSdkMcpServer({
  name: 'parallax_rag',
  version: '1.0.0',
  tools: [
    tool(
      'search',
      [
        'Search the Parallax research corpus — allowlisted, tier-tagged (T0–T7),',
        'viewpoint-tagged, citation-tracked. Prefer this over WebSearch for sourced',
        'facts. Use tier_filter:["T0","T1","T2"] to demand a primary/data/peer-reviewed',
        'anchor. Each result shows its source URL (cite it) and whether it is QUOTABLE',
        '(open-fulltext) or GUIDE-ONLY (metadata-only — use it to find the claim, but',
        'quote ONLY from the original, never from a guide-only chunk).',
      ].join(' '),
      {
        query: z.string().describe('the search query (a claim, entity, statute, figure, or question)'),
        top_k: z.number().int().min(1).max(20).optional().describe('results after rerank (default 8)'),
        tier_filter: z.array(z.string()).optional().describe('restrict to tiers, e.g. ["T0","T1","T2"]'),
        viewpoint_filter: z.array(z.string()).optional().describe('restrict to viewpoint clusters'),
      },
      async (args) => {
        try {
          const hits = await ragSearch(args.query, {
            topK: args.top_k,
            tierFilter: args.tier_filter as Tier[] | undefined,
            viewpointFilter: args.viewpoint_filter,
          });
          if (hits.length === 0) {
            return {
              content: [{
                type: 'text' as const,
                text: 'No corpus matches. The corpus may not be ingested for this topic yet — fall back to allowlisted WebSearch/WebFetch.',
              }],
            };
          }
          return {
            content: [{ type: 'text' as const, text: hits.map(formatHit).join('\n\n') }],
          };
        } catch (err) {
          return {
            content: [{
              type: 'text' as const,
              text: `RAG unavailable (${err instanceof Error ? err.message : String(err)}). Fall back to allowlisted WebSearch/WebFetch.`,
            }],
          };
        }
      },
    ),
  ],
});
