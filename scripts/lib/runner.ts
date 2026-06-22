import { query, type McpServerConfig } from '@anthropic-ai/claude-agent-sdk';
import type { AgentDef } from './agent-loader.js';

export interface RunResult {
  success: boolean;
  finalMessage: string;
  costUsd: number;
  durationMs: number;
}

/**
 * Run a Parallax pipeline agent via the Claude Agent SDK.
 * Streams tool calls and assistant text to stdout as the run progresses.
 * Returns cost + duration for the footer display.
 */
export async function runAgent(opts: {
  agent: AgentDef;
  prompt: string;
  model: string;
  cwd: string;
  verbose?: boolean;
  /** In-process MCP servers (e.g. the RAG corpus). Only the editorial pipeline
   *  passes this; an agent can call a tool only if its frontmatter lists it. */
  mcpServers?: Record<string, McpServerConfig>;
}): Promise<RunResult> {
  const startMs = Date.now();
  let lastAssistantText = '';
  let costUsd = 0;

  try {
    for await (const msg of query({
      prompt: opts.prompt,
      options: {
        systemPrompt: opts.agent.systemPrompt,
        allowedTools: opts.agent.tools,
        model: opts.model,
        cwd: opts.cwd,
        ...(opts.mcpServers ? { mcpServers: opts.mcpServers } : {}),
      },
    })) {
      const type = (msg as { type?: string }).type;

      if (type === 'assistant') {
        // Content is an array of blocks: text | tool_use | tool_result
        const content = (msg as Record<string, unknown>).message as Record<string, unknown> | undefined;
        const blocks = content?.content as Array<Record<string, unknown>> | undefined;

        if (Array.isArray(blocks)) {
          for (const block of blocks) {
            if (block.type === 'text' && typeof block.text === 'string') {
              // Dim the running assistant text so tool lines stand out
              process.stdout.write('\x1b[2m' + block.text + '\x1b[0m');
              lastAssistantText += block.text;
            } else if (block.type === 'tool_use') {
              const name   = String(block.name ?? 'tool');
              const input  = JSON.stringify(block.input ?? {});
              const trunc  = input.length > 140 ? input.slice(0, 140) + '…' : input;
              console.log(`\n\x1b[36m[${name}]\x1b[0m ${trunc}`);
            }
            // tool_result suppressed unless --verbose
            else if (block.type === 'tool_result' && opts.verbose) {
              const content = JSON.stringify(block.content ?? '');
              const trunc = content.length > 200 ? content.slice(0, 200) + '…' : content;
              console.log(`\x1b[90m[result] ${trunc}\x1b[0m`);
            }
          }
        }

      } else if (type === 'result') {
        // SDKResultMessage — total_cost_usd is the billed cost for this run
        const result = msg as Record<string, unknown>;
        if (typeof result.total_cost_usd === 'number') {
          costUsd = result.total_cost_usd;
        }
      }
    }

    // Ensure stdout ends on a clean newline after streaming
    if (lastAssistantText && !lastAssistantText.endsWith('\n')) {
      process.stdout.write('\n');
    }

    return {
      success:      true,
      finalMessage: lastAssistantText.trim(),
      costUsd,
      durationMs:   Date.now() - startMs,
    };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    if (/authentication|api.?key|401|unauthorized/i.test(message)) {
      console.error('\n\x1b[31mError:\x1b[0m ANTHROPIC_API_KEY is missing or invalid.');
      console.error('Add it to .env.local:  ANTHROPIC_API_KEY=sk-ant-...');
    } else if (/rate.?limit|429|too many/i.test(message)) {
      console.error('\n\x1b[31mError:\x1b[0m Rate limit hit. Wait a moment and retry.');
      process.exit(2);
    } else {
      console.error('\n\x1b[31mAgent error:\x1b[0m', message);
      if (opts.verbose && err instanceof Error && err.stack) {
        console.error(err.stack);
      }
    }
    process.exit(1);
  }
}
