import {
  query,
  type HookCallback,
  type McpServerConfig,
  type ModelUsage,
  type Options,
  type SDKMessage,
  type SDKResultMessage,
} from '@anthropic-ai/claude-agent-sdk';
import { basename, join, resolve } from 'path';
import { mkdirSync, readFileSync } from 'fs';
import type { AgentDef } from './agent-loader.js';
import type { EffortLevel } from '../pipeline.config.js';
import { canonicalModel, listCostUsd, WEB_SEARCH_USD_EACH, type TokenSplit } from './pricing.js';

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

/**
 * Every built-in tool the CLI can hand a session (code.claude.com/docs/en/
 * tools-reference, read 2026-09-28), plus `Task`, the Agent tool's older wire
 * name. The runner removes each one the agent is not granted with a bare-name
 * `disallowedTools` entry, the documented way to take a tool out of the
 * model's context; `allowedTools` alone only pre-approves, and a tool it does
 * not name stays callable (measured September round: Bash 229 calls, Edit 61,
 * PowerShell 16, ToolSearch 15, one $2.2 Agent subagent). `EndConversation`
 * is absent on purpose: the CLI keeps it whatever the lists say.
 */
const BUILTIN_TOOLS = [
  'Agent', 'Task', 'Artifact', 'AskUserQuestion', 'Bash', 'CronCreate', 'CronDelete', 'CronList',
  'Edit', 'EnterPlanMode', 'EnterWorktree', 'ExitPlanMode', 'ExitWorktree', 'Glob', 'Grep',
  'ListAgents', 'ListMcpResourcesTool', 'LSP', 'Monitor', 'NotebookEdit', 'PowerShell',
  'PushNotification', 'Read', 'ReadMcpResourceTool', 'RemoteTrigger', 'ReportFindings',
  'ScheduleWakeup', 'SendFeedback', 'SendMessage', 'SendUserFile', 'ShareOnboardingGuide', 'Skill',
  'TaskCreate', 'TaskGet', 'TaskList', 'TaskOutput', 'TaskStop', 'TaskUpdate', 'TodoWrite',
  'ToolSearch', 'WaitForMcpServers', 'WebFetch', 'WebSearch', 'Workflow', 'Write',
] as const;

/**
 * The harness diet (COST-PLAN CP-02), as environment. Each is documented at
 * code.claude.com/docs/en/env-vars. Measured before the diet: a first request
 * of 54.6k–58.5k tokens, of which our own agent prompt was 1.3k–3.9k.
 */
const DIET_ENV: Record<string, string> = {
  // Web tools load with the others instead of mid-run through ToolSearch,
  // which re-wrote 66k–90k tokens of cache once per research run.
  ENABLE_TOOL_SEARCH: 'false',
  // No auto memory, no CLAUDE.md or rules, even if a setting source slipped in.
  CLAUDE_CODE_DISABLE_AUTO_MEMORY: '1',
  CLAUDE_CODE_DISABLE_CLAUDE_MDS: '1',
  // No Explore / Plan / general-purpose subagents to spawn or list.
  CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS: '1',
  // No git status snapshot, no commit / PR instructions in the Bash schema.
  CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS: '1',
  // No skill listing, task nudges or file-changed notes in the conversation.
  CLAUDE_CODE_DISABLE_ATTACHMENTS: '1',
  // No background title-generation request.
  CLAUDE_CODE_DISABLE_TERMINAL_TITLE: '1',
  // A single-shot pass writes its reasoning and its whole file in one
  // response (a storyboard is 12k to 17k tokens of file alone), so the
  // default output cap could cut a Write off mid-file. 64k is the models'
  // streaming default for agentic work (claude-api guidance, 2026-09-28).
  CLAUDE_CODE_MAX_OUTPUT_TOKENS: '64000',
};

/**
 * Inherited variables that would change what the spawned CLI loads, how it
 * caches or which effort it sends, stripped on both billing routes. A
 * terminal inside the Claude Code desktop app carries a dozen of these
 * (session ids, a messaging socket, host auth refresh, CLAUDE_EFFORT…), and
 * the cache-TTL ones would also make the ledger's 5-minute pricing false.
 */
const STRIP_ALWAYS = /^(CLAUDECODE|CLAUDE_EFFORT|CLAUDE_PID|CLAUDE_AGENT_SDK_VERSION|CLAUDE_CODE_(CHILD_SESSION|ENTRYPOINT|SESSION_ID|HOST_SESSION_ID|MESSAGING_SOCKET|MESSAGING_TOKEN|SDK_HAS_HOST_AUTH_REFRESH|EXECPATH|EFFORT_LEVEL|PROMPT_CACHE_TTL|SUBAGENT_PROMPT_CACHE_TTL|SUBAGENT_MODEL|SIMPLE|AUTO_COMPACT_WINDOW)|ENABLE_PROMPT_CACHING_1H|FORCE_PROMPT_CACHING_5M|DISABLE_PROMPT_CACHING.*|DISABLE_MICROCOMPACT|DISABLE_COMPACT|MAX_THINKING_TOKENS|CLAUDE_AUTOCOMPACT_PCT_OVERRIDE)$/;

/**
 * On the API route, every other CLAUDE_* / ANTHROPIC_* variable goes too:
 * ANTHROPIC_AUTH_TOKEN outranks the API key in the CLI's credential order,
 * CLAUDE_CODE_OAUTH_TOKEN is a login, CLAUDE_CODE_USE_* reroute to a cloud
 * provider. The key stays; it is the only credential this route may use.
 * So does the machine's plumbing (where Git Bash lives, the shell, the temp
 * directory, TLS), which is neither a credential nor a route.
 */
const STRIP_ON_API = /^(CLAUDE|ANTHROPIC_)/;
const KEEP_ON_API = /^(ANTHROPIC_API_KEY|CLAUDE_CODE_(GIT_BASH_PATH|SHELL|SHELL_PREFIX|TMPDIR|CERT_STORE|CLIENT_CERT|CLIENT_KEY|CLIENT_KEY_PASSPHRASE|PROXY_RESOLVES_HOSTS))$/;

/** Main-loop tokens for one API response (one unique message id). */
interface RequestUsage {
  input: number;
  cacheWrite5m: number;
  cacheWrite1h: number;
  cacheRead: number;
  output: number;
}

export interface RunUsage {
  /** Main-loop tokens (the result's `usage`, or the streamed per-request sums
   *  when the run died without a result, whichever is larger per field).
   *  Helper, compaction and subagent requests are in `modelUsage`, not here. */
  inputTokens: number;
  cacheWriteTokens: number;
  cacheReadTokens: number;
  outputTokens: number;
  /** The main loop's cache writes by TTL, from `usage.cache_creation`. */
  cacheWrite5mTokens: number;
  cacheWrite1hTokens: number;
  /** WebSearch tool calls, counted from the stream (the SDK reports 0 for them). */
  webSearches: number;
  /** WebFetch tool calls, counted the same way. */
  webFetches: number;
  /** The SDK's `num_turns`: tool-use round trips, not API requests. */
  turns: number;
}

/** One model's share of a run, compact for the ledger. */
export interface ModelShare {
  in: number;
  cw: number;
  cr: number;
  out: number;
  web: number;
  /** The SDK's estimate for this model. */
  usdSdk: number;
  /** List price for this model (the SDK's figure where the table lacks the model). */
  usdList: number;
}

export type ErrorKind = 'capped' | 'auth' | 'billing' | 'model' | 'rate_limit' | 'other';

export interface RunResult {
  /** True only when the result subtype is `success` and it is not an error. */
  success: boolean;
  /** The result subtype (`success`, `error_max_turns`, `error_max_budget_usd`,
   *  `error_during_execution`…), or `error_<kind>` when the run died without one. */
  stopReason: string;
  errorKind?: ErrorKind;
  errorMessage?: string;
  finalMessage: string;
  /** List price of every request the run made (COST-PLAN CP-01). */
  costUsd: number;
  /** The SDK's `total_cost_usd`; null when no result message arrived. */
  costUsdSdk: number | null;
  durationMs: number;
  usage: RunUsage;
  /** Main-loop API responses with usage (unique message ids). */
  requests: number;
  /** input + cache write + cache read of the first request: the fixed prefix. */
  firstRequestTokens: number | null;
  modelUsage: Record<string, ModelShare>;
  /** Models the price table does not know (priced at the SDK's figure). */
  unpricedModels: string[];
  sessionId: string | null;
  sdkVersion: string | null;
  cliVersion: string | null;
  /** The tool list the CLI reported at init: what the agent could see. */
  toolsSeen: string[];
  /** CLAUDE.md / rules files the CLI loaded (should be none — the diet's canary). */
  instructionsLoaded: string[];
  /** Tool names of every denied call; each one cost a request. */
  permissionDenials: string[];
  compactions: number;
  terminalReason: string | null;
  /** Set only on a run asked to `resume`: true when the CLI continued that
   *  session (its init message carried the same id), false when it did not. */
  resumed?: boolean;
}

/** in + cache write + cache read + output. */
const shareTokens = (s: Pick<ModelShare, 'in' | 'cw' | 'cr' | 'out'>): number => s.in + s.cw + s.cr + s.out;

/**
 * Whether a resumed call's reported figure carries the session's earlier run
 * as well as its own. The stream holds only this call's requests, so the
 * figure is compared with it twice, as it stands and with the earlier run
 * taken out, and the closer reading wins. Exported for the tests.
 */
export function carriesEarlierRun(figure: number, earlier: number, streamed: number): boolean {
  return earlier > 0 && Math.abs(figure - earlier - streamed) < Math.abs(figure - streamed);
}

/** A model's reported usage minus the earlier run's share of it, floored at 0. */
function minusEarlierShare(mu: ModelUsage, e: ModelShare | undefined): ModelUsage {
  if (!e) return mu;
  const less = (v: unknown, by: number) => Math.max(0, n(v) - by);
  return {
    ...mu,
    inputTokens:              less(mu.inputTokens, e.in),
    cacheCreationInputTokens: less(mu.cacheCreationInputTokens, e.cw),
    cacheReadInputTokens:     less(mu.cacheReadInputTokens, e.cr),
    outputTokens:             less(mu.outputTokens, e.out),
    webSearchRequests:        less(mu.webSearchRequests, e.web),
    costUSD:                  less(mu.costUSD, e.usdSdk),
  };
}

/** The installed SDK's version, read at run time for the ledger. */
function installedSdkVersion(cwd: string): string | null {
  try {
    const pkg = JSON.parse(readFileSync(join(cwd, 'node_modules', '@anthropic-ai', 'claude-agent-sdk', 'package.json'), 'utf-8'));
    return typeof pkg.version === 'string' ? pkg.version : null;
  } catch {
    return null;
  }
}

/** A permission rule's tool: `Bash(pdftotext *)` → `Bash`. */
const ruleTool = (rule: string) => rule.replace(/\(.*$/s, '').trim();

/** The environment the spawned CLI gets: the inherited one, minus the
 *  variables above, plus the diet, plus the isolated config dir on `api`. */
export function childEnv(
  billing: 'api' | 'subscription',
  configDir: string,
  source: NodeJS.ProcessEnv = process.env,
): Record<string, string | undefined> {
  const env: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(source)) {
    if (STRIP_ALWAYS.test(key)) continue;
    if (billing === 'api' && STRIP_ON_API.test(key) && !KEEP_ON_API.test(key)) continue;
    // `subscription`: the login is the only credential. With the key left in
    // the environment a missing or expired login would fall back to the key
    // and bill it while the ledger row said "subscription" (the mirror of the
    // 2026-09-22 finding, closed 2026-09-29). Without it, a missing login
    // fails with a 401 before anything is spent.
    if (billing === 'subscription' && /^(ANTHROPIC_API_KEY|ANTHROPIC_AUTH_TOKEN)$/.test(key)) continue;
    env[key] = value;
  }
  Object.assign(env, DIET_ENV);
  // `api`: isolated from the operator's login so the key is the only
  // credential (see API_CONFIG_DIR). `subscription`: the login stays, and the
  // key is stripped above, so each door has exactly one credential.
  if (billing === 'api') env.CLAUDE_CONFIG_DIR = configDir;
  return env;
}

/** What the agent may see and call: its frontmatter tools plus each scoped
 *  rule's tool; the rules pre-approve; every other built-in is removed. */
export function toolSurface(
  agent: Pick<AgentDef, 'tools' | 'allow'>,
  extraAllow: string[] = [],
  hasMcpServers = false,
): { tools: string[]; allowedTools: string[]; disallowedTools: string[] } {
  const allowRules = [...new Set([...extraAllow, ...agent.allow])];
  const toolSet = new Set<string>([...agent.tools, ...allowRules.map(ruleTool)]);
  const disallowedTools: string[] = BUILTIN_TOOLS.filter((t) => !toolSet.has(t));
  if (!hasMcpServers) disallowedTools.push('mcp__*');
  return {
    tools: [...toolSet],
    allowedTools: [...new Set([...agent.tools, ...allowRules])],
    disallowedTools,
  };
}

const n = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

function classify(text: string, assistantError: string | null): ErrorKind {
  const t = `${assistantError ?? ''} ${text}`;
  if (/maximum number of turns|max_turns|max_budget|budget/i.test(t)) return 'capped';
  if (/authentication|invalid.{0,12}api.?key|x-api-key|401|unauthori[sz]ed/i.test(t)) return 'auth';
  if (/billing|credit balance|insufficient|out of extra usage|usage limit|402/i.test(t)) return 'billing';
  if (/model_not_found|(not.?found|404).{0,80}model|model.{0,80}(not.?found|404)/i.test(t)) return 'model';
  if (/rate.?limit|429|overloaded|529|too many/i.test(t)) return 'rate_limit';
  return 'other';
}

/**
 * Run a Parallax pipeline agent via the Claude Agent SDK.
 * Streams tool calls and assistant text to stdout as the run progresses.
 * Never exits the process: every outcome, failed runs included, comes back as
 * a RunResult so the caller can write the ledger row (COST-PLAN CP-01).
 *
 * What the SDK is told, and why (COST-PLAN CP-02, signed 2026-09-28; the
 * measurements are in docs/cost/2026-09-27-cost-levers.md):
 *
 * - `settingSources: []`. Without it the SDK loads user, project and local
 *   settings: the root CLAUDE.md + AGENTS.md (about 31k tokens) rode in every
 *   first request, nested CLAUDE.md files and rules loaded on first read, and
 *   the operator's 415 local allow rules came along, `Bash(npm run *)` among
 *   them, which would let an agent start a billing `npm run pipeline:*`.
 * - `tools` is the frontmatter list (plus the tool of each `allow` rule), and
 *   every other built-in is removed by bare-name `disallowedTools`.
 * - `permissionMode: 'dontAsk'`: a call no rule approves is denied instead of
 *   waiting on a prompt nobody answers. Writes under `.claude/` are protected
 *   paths, which this mode always denies, agent-memory files included.
 * - `strictMcpConfig: true`: the CLI otherwise inherits every MCP server the
 *   desktop app registered on the machine (seven claude.ai connectors, 196
 *   tool schemas instead of 28, measured 2026-09-16).
 * - `verbatimPrompts: true`: no `@path` expansion, no `/command` parsing of
 *   the prompt text, which carries whole inlined files.
 * - `effort` and `maxBudgetUsd` per phase from pipeline.config.ts. The budget
 *   is checked against the SDK's own estimate.
 * - The cache TTL is the CLI's default: 5 minutes on an API key, 1 hour on a
 *   subscription within plan usage. Nothing here asks for an hour (it would
 *   add about $6.20 an issue on the API route), so a run on `api` that writes
 *   1-hour entries is not billing the key, and the footer says so.
 * - `stopAfterWrite` ends a single-shot pass at its Write through a
 *   PostToolUse hook (`continue: false`), so the closing "done" request is
 *   never sent (2026-09-29; the option's comment below has the measurement).
 * - `resume` continues an earlier run's session (COST-PLAN §12.5 item 2, the
 *   drafter's check round). The CLI finds the transcript under
 *   `$CLAUDE_CONFIG_DIR/projects/<encoded cwd>/` (the isolated config dir on
 *   `api`, the login's on `subscription`), so a resumed run must use the same
 *   `billing` and `cwd` as the run it continues, which pipeline.ts does. It
 *   also restores the session's saved totals (CLI 2.1.277 and later), so the
 *   result's `total_cost_usd` and `modelUsage` count the earlier run again,
 *   and `resumeFrom` lets the runner take them back out. `maxBudgetUsd` counts
 *   only the call's own spend either way (code.claude.com/docs/en/agent-sdk/
 *   cost-tracking and /sessions, read 2026-09-28).
 */
export async function runAgent(opts: {
  agent: AgentDef;
  prompt: string;
  model: string;
  cwd: string;
  verbose?: boolean;
  /** In-process MCP servers. Nothing passes this today (the RAG corpus did,
   *  until 2026-09-27); an agent can call a tool only if its frontmatter lists it. */
  mcpServers?: Record<string, McpServerConfig>;
  /** Safety cap on agent turns (MAX_TURNS in pipeline.config.ts). */
  maxTurns?: number;
  /** Hard stop in dollars on the SDK's estimate (MAX_BUDGET_USD). */
  maxBudgetUsd?: number;
  /** The `effort` option (EFFORT in pipeline.config.ts). */
  effort?: EffortLevel;
  /** Scoped rules granted on top of the agent's own `allow:` (ALLOW in pipeline.config.ts). */
  allow?: string[];
  /** Which credential the spawned CLI may use. `api` (default) isolates the
   *  CLI from the operator's login so the key is the only credential;
   *  `subscription` leaves the machine's claude.ai login in play, which the
   *  CLI prefers over the key — the operator's choice when the key is short
   *  (2026-09-22). The ledger row records which. */
  billing?: 'api' | 'subscription';
  /** The session id of an earlier run to continue (the SDK's `resume`): the
   *  prompt is then only what is new. Same `billing` and `cwd` as that run. */
  resume?: string;
  /** That earlier run's figures. The CLI restores the session's totals on
   *  resume, so without them this run's cost would count the earlier run
   *  twice once the two are merged into one ledger row. */
  resumeFrom?: Pick<RunResult, 'usage' | 'modelUsage' | 'costUsdSdk'>;
  /** Repo-relative paths of the run's planned output files. When the agent's
   *  Write to one of them succeeds, a PostToolUse hook ends the run there
   *  (the operator's ruling of 2026-09-29, COST-PLAN §12.5 item 3). Without
   *  it a single-shot pass sends one more request after its Write, to say it
   *  is done, and because the Write outran the five-minute cache that request
   *  re-wrote the whole context: about $3.70 an issue on the trial for replies
   *  nothing reads. The single-shot passes set it; the loops never do, they
   *  Edit and re-read after they Write. */
  stopAfterWrite?: string[];
}): Promise<RunResult> {
  const startMs = Date.now();
  const billing = opts.billing ?? 'api';

  // ── The environment and the tool surface the CLI gets ─────────────────────
  const configDir = join(opts.cwd, API_CONFIG_DIR);
  mkdirSync(configDir, { recursive: true });
  const env = childEnv(billing, configDir);
  const { tools, allowedTools, disallowedTools } = toolSurface(opts.agent, opts.allow, !!opts.mcpServers);

  // ── What the run reports ──────────────────────────────────────────────────
  let lastAssistantText = '';
  let lastAssistantError: string | null = null;
  let result: SDKResultMessage | null = null;
  let sessionId: string | null = null;
  let cliVersion: string | null = null;
  let toolsSeen: string[] = [];
  let mainModelSeen: string | null = null;
  let compactions = 0;
  let webSearches = 0;
  let webFetches = 0;
  let stderrTail = '';
  const instructionsLoaded: string[] = [];
  const deniedStream: string[] = [];
  const requests = new Map<string, RequestUsage>();
  let firstRequestId: string | null = null;
  let streamingId: string | null = null;
  // Stops a resumed run whose CLI did not continue the session it was given:
  // the prompt would reach a model that has none of the earlier context.
  const abort = new AbortController();
  let resumeRefused: string | null = null;
  // The stop-after-Write hook (see `stopAfterWrite`): the planned outputs,
  // normalised the way the Write tool's `file_path` arrives (absolute, either
  // slash, any drive-letter case).
  const normPath = (p: string) => resolve(opts.cwd, p).replace(/\\/g, '/').toLowerCase();
  const stopTargets = new Set((opts.stopAfterWrite ?? []).map(normPath));
  let stoppedAfterWrite: string | null = null;

  const noteRequest = (id: string, u: Record<string, unknown> | null | undefined) => {
    if (!u || requests.has(id)) return;
    const cc = u.cache_creation as Record<string, unknown> | null | undefined;
    const cacheWrite = n(u.cache_creation_input_tokens);
    const cacheWrite1h = n(cc?.ephemeral_1h_input_tokens);
    requests.set(id, {
      input:        n(u.input_tokens),
      cacheWrite1h,
      cacheWrite5m: Math.max(n(cc?.ephemeral_5m_input_tokens), cacheWrite - cacheWrite1h),
      cacheRead:    n(u.cache_read_input_tokens),
      output:       n(u.output_tokens), // a placeholder until message_delta reports the real count
    });
    firstRequestId ??= id;
  };

  const onInstructions: HookCallback = async (input) => {
    if (input.hook_event_name === 'InstructionsLoaded') {
      instructionsLoaded.push(`${input.file_path} (${input.load_reason})`);
    }
    return {};
  };

  // PostToolUse fires only for a Write that succeeded (a refused or failed
  // Write is PostToolUseFailure, and the agent must see it and retry), so a
  // halt here always leaves the file on disk. The tool result is recorded
  // before the hooks run, which is what lets the session be resumed later
  // (the drafter's check round). Measured 2026-09-29, COST-PLAN §12.5 item 3.
  const onPostWrite: HookCallback = async (input) => {
    if (input.hook_event_name !== 'PostToolUse' || input.tool_name !== 'Write') return {};
    const filePath = (input.tool_input as { file_path?: unknown } | undefined)?.file_path;
    if (typeof filePath !== 'string' || !stopTargets.has(normPath(filePath))) return {};
    stoppedAfterWrite = filePath;
    console.log(`\n\x1b[32m[written]\x1b[0m ${basename(filePath)} is on disk. The run ends here: no closing request.`);
    return { continue: false, stopReason: `the pipeline ends a single-shot pass once ${basename(filePath)} is written` };
  };

  const options: Options = {
    systemPrompt: opts.agent.systemPrompt,
    model: opts.model,
    cwd: opts.cwd,
    env,
    settingSources: [],
    tools,
    allowedTools,
    disallowedTools,
    permissionMode: 'dontAsk',
    // Only the MCP servers passed below — never the machine's connectors.
    strictMcpConfig: true,
    // The prompt is delivered as written: an `@path` in inlined text is not
    // expanded into a file read, and a line starting with `/` is not run as a
    // command. The single-shot passes inline whole files, catalog and all.
    verbatimPrompts: true,
    // Stream events carry each response's final output count (the assistant
    // message only has a placeholder), so a run that dies still has its totals.
    includePartialMessages: true,
    // No Co-Authored-By trailer or PR footer in the context (AGENTS.md §7).
    settings: { attribution: { commit: '', pr: '' } },
    hooks: {
      InstructionsLoaded: [{ hooks: [onInstructions] }],
      ...(stopTargets.size ? { PostToolUse: [{ matcher: 'Write', hooks: [onPostWrite] }] } : {}),
    },
    stderr: (data: string) => { stderrTail = (stderrTail + data).slice(-4000); },
    ...(opts.effort ? { effort: opts.effort } : {}),
    ...(opts.maxBudgetUsd ? { maxBudgetUsd: opts.maxBudgetUsd } : {}),
    ...(opts.maxTurns ? { maxTurns: opts.maxTurns } : {}),
    ...(opts.mcpServers ? { mcpServers: opts.mcpServers } : {}),
    // The earlier run's session, continued under its own id (no forkSession).
    ...(opts.resume ? { resume: opts.resume } : {}),
    abortController: abort,
  };

  let thrown: string | null = null;
  try {
    for await (const msg of query({ prompt: opts.prompt, options }) as AsyncIterable<SDKMessage>) {
      switch (msg.type) {
        case 'system': {
          if (msg.subtype === 'init') {
            sessionId = msg.session_id;
            cliVersion = msg.claude_code_version;
            toolsSeen = msg.tools;
            console.log(`\x1b[90m[init] CLI ${cliVersion} · tools: ${toolsSeen.join(', ') || '(none)'}${msg.mcp_servers.length ? ` · mcp: ${msg.mcp_servers.map((s) => s.name).join(', ')}` : ''}${opts.resume ? ` · resuming ${opts.resume}` : ''}\x1b[0m`);
            if (opts.resume && sessionId !== opts.resume) {
              // A resume continues the session under its own id. Any other id
              // means the earlier context is not there: stop before a request.
              resumeRefused = `the CLI opened session ${sessionId}, not the session ${opts.resume} it was asked to resume`;
              console.log(`\x1b[31m[resume]\x1b[0m ${resumeRefused}. Stopping before the first request.`);
              abort.abort();
            }
          } else if (msg.subtype === 'compact_boundary') {
            compactions++;
            console.log(`\n\x1b[33m[compacted]\x1b[0m at ${msg.compact_metadata.pre_tokens} tokens`);
          } else if (msg.subtype === 'permission_denied') {
            deniedStream.push(msg.tool_name);
            console.log(`\n\x1b[31m[denied]\x1b[0m ${msg.tool_name}: ${msg.message.slice(0, 160)}`);
          }
          break;
        }

        case 'stream_event': {
          // Main session only (the SDK never streams subagent events).
          const ev = msg.event;
          if (ev.type === 'message_start') {
            streamingId = ev.message.id;
            noteRequest(ev.message.id, ev.message.usage as unknown as Record<string, unknown>);
          } else if (ev.type === 'message_delta' && streamingId) {
            const r = requests.get(streamingId);
            const u = ev.usage as unknown as Record<string, unknown>;
            if (r && u) {
              r.output = Math.max(r.output, n(u.output_tokens));
              r.input = Math.max(r.input, n(u.input_tokens));
              r.cacheRead = Math.max(r.cacheRead, n(u.cache_read_input_tokens));
            }
          }
          break;
        }

        case 'assistant': {
          if (msg.error) lastAssistantError = msg.error;
          if (msg.parent_tool_use_id === null) {
            mainModelSeen ??= msg.message.model;
            noteRequest(msg.message.id, msg.message.usage as unknown as Record<string, unknown>);
          }
          for (const block of msg.message.content) {
            if (block.type === 'text') {
              // Dim the running assistant text so tool lines stand out
              process.stdout.write('\x1b[2m' + block.text + '\x1b[0m');
              lastAssistantText += block.text;
            } else if (block.type === 'tool_use') {
              const input = JSON.stringify(block.input ?? {});
              const trunc = input.length > 140 ? input.slice(0, 140) + '…' : input;
              console.log(`\n\x1b[36m[${block.name}]\x1b[0m ${trunc}`);
              // Counted here because the SDK's usage.server_tool_use reports 0
              // for the CLI's WebSearch tool (measured 2026-09-16: 13 searches, 0 reported).
              if (block.name === 'WebSearch') webSearches++;
              else if (block.name === 'WebFetch') webFetches++;
            }
          }
          break;
        }

        case 'user': {
          // Tool results come back in user messages; print them with --verbose.
          const content = msg.message.content;
          if (opts.verbose && Array.isArray(content)) {
            for (const block of content) {
              if (block.type !== 'tool_result') continue;
              const text = JSON.stringify(block.content ?? '');
              console.log(`\x1b[90m[result${block.is_error ? ' · error' : ''}] ${text.length > 200 ? text.slice(0, 200) + '…' : text}\x1b[0m`);
            }
          }
          break;
        }

        case 'result': {
          result = msg;
          break;
        }

        default:
          break;
      }
    }
  } catch (err: unknown) {
    // A single-shot query() throws AFTER yielding an error result (max turns,
    // max budget, an execution error), so `result` is usually set by now; a
    // connection or process failure yields none. Either way the caller gets a
    // RunResult and writes the ledger row.
    thrown = err instanceof Error ? err.message : String(err);
    if (opts.verbose && err instanceof Error && err.stack) console.error(err.stack);
  }

  // Ensure stdout ends on a clean newline after streaming
  if (lastAssistantText && !lastAssistantText.endsWith('\n')) process.stdout.write('\n');

  // ── Totals ────────────────────────────────────────────────────────────────
  // The main loop, two ways: the result's `usage` (authoritative for output)
  // and the per-request sums from the stream (all there is if the run died,
  // and complete when `error_max_budget_usd` leaves the last response out).
  const streamed: RequestUsage = { input: 0, cacheWrite5m: 0, cacheWrite1h: 0, cacheRead: 0, output: 0 };
  for (const r of requests.values()) {
    streamed.input += r.input;
    streamed.cacheWrite5m += r.cacheWrite5m;
    streamed.cacheWrite1h += r.cacheWrite1h;
    streamed.cacheRead += r.cacheRead;
    streamed.output += r.output;
  }
  const res = result as SDKResultMessage | null;
  // A resumed run: the CLI restores the session's saved totals (2.1.277 and
  // later), so the result may count the earlier run again. The stream never
  // does, so each reported figure is tested against it below and, when it
  // carries the earlier run, reduced to this call's own share.
  const earlier = opts.resume ? opts.resumeFrom : undefined;
  const streamedTokens = streamed.input + streamed.cacheWrite5m + streamed.cacheWrite1h + streamed.cacheRead + streamed.output;
  let ru = (res?.usage ?? null) as unknown as Record<string, unknown> | null;
  if (earlier && ru) {
    const figure = n(ru.input_tokens) + n(ru.cache_creation_input_tokens) + n(ru.cache_read_input_tokens) + n(ru.output_tokens);
    const u0 = earlier.usage;
    // Documented as the call's own. If it ever carries the earlier run, the stream is the record.
    if (carriesEarlierRun(figure, u0.inputTokens + u0.cacheWriteTokens + u0.cacheReadTokens + u0.outputTokens, streamedTokens)) ru = null;
  }
  const rcc = ru?.cache_creation as Record<string, unknown> | null | undefined;
  const resultWrite = n(ru?.cache_creation_input_tokens);
  const resultWrite1h = n(rcc?.ephemeral_1h_input_tokens);
  const main: RequestUsage = {
    input:        Math.max(streamed.input, n(ru?.input_tokens)),
    cacheWrite1h: Math.max(streamed.cacheWrite1h, resultWrite1h),
    cacheWrite5m: Math.max(streamed.cacheWrite5m, n(rcc?.ephemeral_5m_input_tokens), resultWrite - resultWrite1h),
    cacheRead:    Math.max(streamed.cacheRead, n(ru?.cache_read_input_tokens)),
    output:       Math.max(streamed.output, n(ru?.output_tokens)),
  };
  const stu = ru?.server_tool_use as Record<string, unknown> | null | undefined;
  webSearches = Math.max(webSearches, n(stu?.web_search_requests));

  // Every request of the run, per model, at list price. `modelUsage` covers
  // the main loop plus compaction, WebFetch / WebSearch helpers and any
  // subagent; its cache writes are not split by TTL, so the main loop's
  // measured 1-hour writes are attributed to the main model and the rest is
  // priced at 5 minutes (the only TTL outside the main loop on an API key).
  const mainKey = canonicalModel(mainModelSeen ?? opts.model);
  const modelUsage: Record<string, ModelShare> = {};
  const unpricedModels: string[] = [];
  let costUsd = 0;
  let reportedSearches = 0;
  let mainPriced = false;
  let entries = Object.entries((res?.modelUsage ?? {}) as Record<string, ModelUsage>);
  let sdkCost: number | null = res ? n(res.total_cost_usd) : null;
  if (earlier && res) {
    const keyOf = (name: string, mu: ModelUsage) => canonicalModel(mu.canonicalModel ?? name);
    const mainNow = entries.find(([name, mu]) => keyOf(name, mu) === mainKey)?.[1];
    const mainBefore = earlier.modelUsage[mainKey];
    const figure = mainNow ? n(mainNow.inputTokens) + n(mainNow.cacheCreationInputTokens) + n(mainNow.cacheReadInputTokens) + n(mainNow.outputTokens) : 0;
    if (mainNow && mainBefore && carriesEarlierRun(figure, shareTokens(mainBefore), streamedTokens)) {
      entries = entries
        .map(([name, mu]) => [name, minusEarlierShare(mu, earlier.modelUsage[keyOf(name, mu)])] as [string, ModelUsage])
        // A model only the earlier run used has nothing left: no row for it.
        .filter(([, mu]) => n(mu.inputTokens) + n(mu.cacheCreationInputTokens) + n(mu.cacheReadInputTokens) + n(mu.outputTokens) + n(mu.webSearchRequests) + n(mu.costUSD) > 0);
      const restoredUsd = earlier.costUsdSdk ?? Object.values(earlier.modelUsage).reduce((s, m) => s + m.usdSdk, 0);
      sdkCost = Math.max(0, n(res.total_cost_usd) - restoredUsd);
      console.log(`\x1b[90m[resume] the result carried the session's earlier spend (SDK estimate $${restoredUsd.toFixed(4)}). This run's figures are its own.\x1b[0m`);
    }
  }
  for (const [name, mu] of entries) {
    const key = canonicalModel(mu.canonicalModel ?? name);
    let split: TokenSplit = {
      input:        n(mu.inputTokens),
      cacheWrite5m: n(mu.cacheCreationInputTokens),
      cacheWrite1h: 0,
      cacheRead:    n(mu.cacheReadInputTokens),
      output:       n(mu.outputTokens),
      webSearches:  n(mu.webSearchRequests),
    };
    if (key === mainKey && !mainPriced) {
      mainPriced = true;
      // A crashed run's result can come back zeroed: then the stream is the record.
      if (split.input + split.cacheWrite5m + split.cacheRead < main.input + main.cacheWrite5m + main.cacheWrite1h + main.cacheRead) {
        split = { ...main, webSearches: split.webSearches };
      } else {
        const oneHour = Math.min(main.cacheWrite1h, split.cacheWrite5m);
        split = { ...split, cacheWrite5m: split.cacheWrite5m - oneHour, cacheWrite1h: oneHour };
      }
    }
    reportedSearches += split.webSearches ?? 0;
    const list = listCostUsd(key, split);
    if (list === null) unpricedModels.push(name);
    const usdList = list ?? n(mu.costUSD);
    costUsd += usdList;
    const prev = modelUsage[key];
    modelUsage[key] = {
      in:  (prev?.in ?? 0) + split.input,
      cw:  (prev?.cw ?? 0) + split.cacheWrite5m + split.cacheWrite1h,
      cr:  (prev?.cr ?? 0) + split.cacheRead,
      out: (prev?.out ?? 0) + split.output,
      web: (prev?.web ?? 0) + (split.webSearches ?? 0),
      usdSdk:  (prev?.usdSdk ?? 0) + n(mu.costUSD),
      usdList: (prev?.usdList ?? 0) + usdList,
    };
  }
  if (!mainPriced && requests.size > 0) {
    // No result, or a result without the main model: price the streamed main loop.
    const list = listCostUsd(mainKey, main);
    if (list === null) unpricedModels.push(mainModelSeen ?? opts.model);
    costUsd += list ?? 0;
    modelUsage[mainKey] = {
      in: main.input, cw: main.cacheWrite5m + main.cacheWrite1h, cr: main.cacheRead, out: main.output,
      web: 0, usdSdk: 0, usdList: list ?? 0,
    };
  }
  // WebSearch calls the stream saw but no model reported: $10 per 1,000.
  costUsd += Math.max(0, webSearches - reportedSearches) * WEB_SEARCH_USD_EACH;
  for (const share of Object.values(modelUsage)) {
    share.usdSdk = Math.round(share.usdSdk * 1e6) / 1e6;
    share.usdList = Math.round(share.usdList * 1e6) / 1e6;
  }

  const first = firstRequestId ? requests.get(firstRequestId) : undefined;
  const firstRequestTokens = first ? first.input + first.cacheWrite5m + first.cacheWrite1h + first.cacheRead : null;

  // ── Outcome ───────────────────────────────────────────────────────────────
  const isErrorResult = !!res && (res.subtype !== 'success' || res.is_error);
  // A clean success result stands even if the SDK throws afterwards (the
  // documented throw follows an ERROR result); the throw is still shown. A
  // run the stop-after-Write hook ended is a success by design, whatever the
  // halted loop reported: its output is on disk, and the ledger row says
  // `stopped_after_write` so the two are never confused.
  const success = !!stoppedAfterWrite || (!!res && !isErrorResult);
  if (success && thrown) console.error(`\n\x1b[33mNote:\x1b[0m the SDK threw after ${stoppedAfterWrite ? 'the hook ended the run' : 'a success result'}: ${thrown.slice(0, 300)}`);
  let stopReason = stoppedAfterWrite ? 'stopped_after_write' : (res?.subtype ?? 'unknown');
  let errorKind: ErrorKind | undefined;
  let errorMessage: string | undefined;
  if (!success) {
    const resultText = res
      ? (res.subtype === 'success' ? res.result : (res.errors ?? []).join('; '))
      : '';
    errorMessage = [resumeRefused && `resume: ${resumeRefused}`, thrown, resultText, stderrTail.trim().split(/\r?\n/).slice(-3).join(' | ')]
      .filter(Boolean).join(' — ').slice(0, 600) || 'no result message';
    errorKind = res?.subtype === 'error_max_turns' || res?.subtype === 'error_max_budget_usd'
      ? 'capped'
      : classify(errorMessage, lastAssistantError);
    if (!res) stopReason = `error_${errorKind}`;
    console.error(`\n\x1b[31mStopped:\x1b[0m ${stopReason} — ${errorMessage}`);
  }

  if (instructionsLoaded.length) {
    console.error(`\x1b[31m  diet leak:\x1b[0m the CLI loaded instruction files: ${instructionsLoaded.join(', ')}`);
  }

  const denials = res?.permission_denials?.map((d) => d.tool_name) ?? deniedStream;

  return {
    success,
    stopReason,
    ...(errorKind ? { errorKind } : {}),
    ...(errorMessage ? { errorMessage } : {}),
    finalMessage: lastAssistantText.trim(),
    costUsd:      Math.round(costUsd * 1e6) / 1e6,
    costUsdSdk:   sdkCost,
    durationMs:   Date.now() - startMs,
    usage: {
      inputTokens:        main.input,
      cacheWriteTokens:   main.cacheWrite5m + main.cacheWrite1h,
      cacheReadTokens:    main.cacheRead,
      outputTokens:       main.output,
      cacheWrite5mTokens: main.cacheWrite5m,
      cacheWrite1hTokens: main.cacheWrite1h,
      webSearches,
      webFetches,
      turns: n(res?.num_turns),
    },
    requests: requests.size,
    firstRequestTokens,
    modelUsage,
    unpricedModels,
    sessionId,
    sdkVersion: installedSdkVersion(opts.cwd),
    cliVersion,
    toolsSeen,
    instructionsLoaded,
    permissionDenials: denials,
    compactions,
    terminalReason: (res?.terminal_reason as string | undefined) ?? null,
    ...(opts.resume ? { resumed: sessionId === opts.resume } : {}),
  };
}
