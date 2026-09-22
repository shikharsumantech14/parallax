import { query, type McpServerConfig } from '@anthropic-ai/claude-agent-sdk';
import { join } from 'path';
import { mkdirSync } from 'fs';
import type { AgentDef } from './agent-loader.js';

/**
 * The config directory the spawned CLI sees. The machine's own
 * ~/.claude holds the operator's claude.ai login, and the CLI PREFERS that
 * login over an ANTHROPIC_API_KEY it has not been told to trust (the key is
 * "approved" interactively, which a pipeline never does). Measured
 * 2026-09-21: every run reported the key as its source and every run drew
 * on the subscription, until it ran out of extra usage mid-draft. An empty
 * config directory has no login to prefer, so the key is the only credential.
 */
export const API_CONFIG_DIR = '.claude-api-home';

export interface RunUsage {
  inputTokens: number;
  cacheWriteTokens: number;
  cacheReadTokens: number;
  outputTokens: number;
  /** WebSearch tool calls, counted from the stream (the SDK reports 0 for them). */
  webSearches: number;
  /** WebFetch tool calls, counted the same way. */
  webFetches: number;
  turns: number;
}

export interface RunResult {
  /** True only when the SDK's result subtype is `success`; a run cut off by
   *  `maxTurns` (subtype `error_max_turns`) returns false with `stopReason` set. */
  success: boolean;
  stopReason: string;
  finalMessage: string;
  costUsd: number;
  durationMs: number;
  usage: RunUsage;
}

/**
 * Run a Parallax pipeline agent via the Claude Agent SDK.
 * Streams tool calls and assistant text to stdout as the run progresses.
 * Returns cost, token usage and duration for the footer display.
 *
 * Two things measured on 2026-09-16 that this wrapper now accounts for:
 *
 * - The SDK spawns a Claude Code CLI, and that CLI inherits every MCP server
 *   the desktop app has registered for this machine (seven claude.ai
 *   connectors — Gmail, ClickUp, Drive, Calendar… — 196 tool schemas instead
 *   of 28). None of them can be CALLED (an agent may only use the tools its
 *   frontmatter lists), but their schemas ride along in every run's context.
 *   `strictMcpConfig: true` keeps only the servers passed here (the RAG
 *   corpus), which is what a pipeline run should see.
 * - Every run writes its first turn (~35–50k tokens: the CLI's own prompt,
 *   the tool schemas, the agent definition) to a one-hour prompt cache and
 *   reads it on later turns. The footer prints the split so a cost that
 *   looks high for a short run can be read correctly.
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
  /** Safety cap on agent turns (MAX_TURNS in pipeline.config.ts). */
  maxTurns?: number;
  /** Which credential the spawned CLI may use. `api` (default) isolates the
   *  CLI from the operator's login so the key is the only credential;
   *  `subscription` leaves the machine's claude.ai login in play, which the
   *  CLI prefers over the key — the operator's choice when the key is short
   *  (2026-09-22). The ledger row records which. */
  billing?: 'api' | 'subscription';
}): Promise<RunResult> {
  const startMs = Date.now();
  let lastAssistantText = '';
  let costUsd = 0;
  let stopReason = 'unknown';
  const usage: RunUsage = { inputTokens: 0, cacheWriteTokens: 0, cacheReadTokens: 0, outputTokens: 0, webSearches: 0, webFetches: 0, turns: 0 };
  const billing = opts.billing ?? 'api';

  const configDir = join(opts.cwd, API_CONFIG_DIR);
  mkdirSync(configDir, { recursive: true });
  const env = billing === 'api'
    ? { ...process.env, CLAUDE_CONFIG_DIR: configDir }
    : { ...process.env };

  try {
    for await (const msg of query({
      prompt: opts.prompt,
      options: {
        systemPrompt: opts.agent.systemPrompt,
        allowedTools: opts.agent.tools,
        model: opts.model,
        cwd: opts.cwd,
        // `api`: isolated from the operator's login so the key is the only
        // credential (see API_CONFIG_DIR). `subscription`: the login stays.
        env,
        // Only the MCP servers passed below — never the machine's connectors.
        strictMcpConfig: true,
        ...(opts.maxTurns ? { maxTurns: opts.maxTurns } : {}),
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
              // Counted here because the SDK's usage.server_tool_use reports 0
              // for the CLI's WebSearch tool (measured 2026-09-16: 13 searches, 0 reported).
              if (name === 'WebSearch') usage.webSearches++;
              else if (name === 'WebFetch') usage.webFetches++;
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
        stopReason = String(result.subtype ?? 'unknown');
        if (typeof result.total_cost_usd === 'number') {
          costUsd = result.total_cost_usd;
        }
        if (typeof result.num_turns === 'number') usage.turns = result.num_turns;
        const u = result.usage as Record<string, unknown> | undefined;
        if (u) {
          usage.inputTokens      = Number(u.input_tokens ?? 0);
          usage.cacheWriteTokens = Number(u.cache_creation_input_tokens ?? 0);
          usage.cacheReadTokens  = Number(u.cache_read_input_tokens ?? 0);
          usage.outputTokens     = Number(u.output_tokens ?? 0);
          const stu = u.server_tool_use as Record<string, unknown> | undefined;
          // Keep whichever count is larger: the stream count is the honest one
          // for the CLI's WebSearch tool, the server figure for a server tool.
          usage.webSearches      = Math.max(usage.webSearches, Number(stu?.web_search_requests ?? 0));
        }
      }
    }

    // Ensure stdout ends on a clean newline after streaming
    if (lastAssistantText && !lastAssistantText.endsWith('\n')) {
      process.stdout.write('\n');
    }

    return {
      success:      stopReason === 'success',
      stopReason,
      finalMessage: lastAssistantText.trim(),
      costUsd,
      durationMs:   Date.now() - startMs,
      usage,
    };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    // The SDK THROWS on an error result rather than yielding it (measured
    // 2026-09-21: the tech composer hit maxTurns after writing its storyboard,
    // while looping on its memory file). Return a failed result so the caller
    // still writes the ledger row; the cost is not reported on this path.
    if (/maximum number of turns|out of extra usage|usage limit|returned an error result/i.test(message)) {
      console.error(`\n\x1b[31mStopped:\x1b[0m ${message}`);
      return {
        success:      false,
        stopReason:   /maximum number of turns/i.test(message) ? 'error_max_turns' : `error: ${message.slice(0, 120)}`,
        finalMessage: lastAssistantText.trim(),
        costUsd:      0,
        durationMs:   Date.now() - startMs,
        usage,
      };
    }

    if (/authentication|api.?key|401|unauthorized/i.test(message)) {
      console.error('\n\x1b[31mError:\x1b[0m ANTHROPIC_API_KEY is missing or invalid.');
      console.error('Add it to .env.local:  ANTHROPIC_API_KEY=sk-ant-...');
    } else if (/not.?found|404/i.test(message) && /model/i.test(message)) {
      console.error(`\n\x1b[31mError:\x1b[0m the model "${opts.model}" is not served. Check scripts/pipeline.config.ts against the current model list.`);
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
