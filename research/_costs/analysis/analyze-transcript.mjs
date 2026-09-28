import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const file = process.argv[2];
const label = process.argv[3] || file;

function len(x) {
  if (x == null) return 0;
  if (typeof x === 'string') return x.length;
  try { return JSON.stringify(x).length; } catch { return 0; }
}

function textOf(content) {
  // tool_result content can be a string or an array of blocks
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map(b => {
      if (typeof b === 'string') return b;
      if (b.type === 'text') return b.text || '';
      return JSON.stringify(b);
    }).join('');
  }
  return JSON.stringify(content ?? '');
}

async function main() {
  const rl = createInterface({ input: createReadStream(file, { encoding: 'utf-8' }), crlfDelay: Infinity });

  const toolUseIndex = new Map(); // tool_use_id -> {name, input, turnSeq}
  const toolUseCounts = {};       // name -> count
  const toolResultCharsByName = {}; // name -> total chars
  const toolResultTop = [];       // {tool, size, ident}
  let assistantTextChars = 0;
  let assistantThinkingChars = 0;
  let toolUseInputChars = 0;      // the JSON args of tool calls (part of model output)
  let userPromptChars = 0;        // real human/system-fed text (non tool_result) in 'user' entries
  let firstUserMessageChars = 0;
  let compactionBoundaries = 0;

  const perIdUsage = new Map();   // message.id -> usage (last write wins, should be stable)
  const idOrder = [];             // order of first appearance of each message.id

  let systemEntryCount = 0;
  let lineNo = 0;
  let firstUserSeen = false;

  // sequence of "turn events" in order, each: {kind: 'assistant'|'tool_result', bytes, name?}
  const timeline = [];
  let turnSeq = 0;

  for await (const line of rl) {
    lineNo++;
    if (!line.trim()) continue;
    let obj;
    try { obj = JSON.parse(line); } catch { continue; }

    if (obj.type === 'system') {
      systemEntryCount++;
      if (obj.subtype === 'compact_boundary') compactionBoundaries++;
      continue;
    }

    if (obj.type === 'assistant' && obj.message) {
      const id = obj.message.id;
      if (!perIdUsage.has(id)) { idOrder.push(id); turnSeq++; }
      if (obj.message.usage) perIdUsage.set(id, obj.message.usage);

      const blocks = Array.isArray(obj.message.content) ? obj.message.content : [];
      for (const b of blocks) {
        if (b.type === 'text') {
          assistantTextChars += len(b.text);
          timeline.push({ kind: 'output', bytes: len(b.text), turnSeq });
        } else if (b.type === 'thinking') {
          const t = b.thinking ?? b.text ?? '';
          assistantThinkingChars += len(t);
          timeline.push({ kind: 'output', bytes: len(t), turnSeq });
        } else if (b.type === 'tool_use') {
          toolUseCounts[b.name] = (toolUseCounts[b.name] || 0) + 1;
          const inputChars = len(b.input);
          toolUseInputChars += inputChars;
          timeline.push({ kind: 'output', bytes: inputChars, turnSeq });
          toolUseIndex.set(b.id, { name: b.name, input: b.input, turnSeq });
        }
      }
      continue;
    }

    if (obj.type === 'user' && obj.message) {
      const content = obj.message.content;
      if (typeof content === 'string') {
        if (!firstUserSeen) { firstUserMessageChars = content.length; firstUserSeen = true; }
        userPromptChars += content.length;
        timeline.push({ kind: 'prefix_or_user', bytes: content.length, turnSeq });
      } else if (Array.isArray(content)) {
        let hadToolResult = false;
        for (const b of content) {
          if (b.type === 'tool_result') {
            hadToolResult = true;
            const ref = toolUseIndex.get(b.tool_use_id);
            const name = ref ? ref.name : 'UNKNOWN';
            const txt = textOf(b.content);
            const size = txt.length;
            toolResultCharsByName[name] = (toolResultCharsByName[name] || 0) + size;
            timeline.push({ kind: 'tool_result', bytes: size, turnSeq, name });
            let ident = '';
            if (ref) {
              const inp = ref.input || {};
              ident = inp.url || inp.file_path || inp.path || inp.pattern || inp.query || JSON.stringify(inp).slice(0, 100);
            }
            toolResultTop.push({ tool: name, size, ident });
          } else if (b.type === 'text') {
            const t = b.text || '';
            if (!firstUserSeen) { firstUserMessageChars = t.length; firstUserSeen = true; }
            userPromptChars += t.length;
            timeline.push({ kind: 'prefix_or_user', bytes: t.length, turnSeq });
          }
        }
      }
      continue;
    }
  }

  // ---- Report ----
  console.log(`\n############ ${label} ############`);
  console.log(`file: ${file}`);
  console.log(`total JSONL lines: ${lineNo}`);
  console.log(`compaction boundaries hit: ${compactionBoundaries}`);
  console.log(`unique assistant message.id ("turns" by this measure): ${idOrder.length}`);

  console.log(`\n--- tool_use blocks by name (assistant-issued calls) ---`);
  const totalToolUse = Object.values(toolUseCounts).reduce((a,b)=>a+b,0);
  for (const [name, count] of Object.entries(toolUseCounts).sort((a,b)=>b[1]-a[1])) {
    console.log(`  ${name}: ${count}`);
  }
  console.log(`  TOTAL tool_use blocks: ${totalToolUse}`);

  console.log(`\n--- tool_result content chars by originating tool ---`);
  let totalToolResultChars = 0;
  for (const [name, chars] of Object.entries(toolResultCharsByName).sort((a,b)=>b[1]-a[1])) {
    totalToolResultChars += chars;
    console.log(`  ${name}: ${chars} chars (~${Math.round(chars/4)} tok)`);
  }
  console.log(`  TOTAL tool_result chars: ${totalToolResultChars} (~${Math.round(totalToolResultChars/4)} tok)`);

  console.log(`\n--- Ten largest single tool_result blocks ---`);
  toolResultTop.sort((a,b)=>b.size-a.size);
  toolResultTop.slice(0,10).forEach((t,i) => {
    console.log(`  ${i+1}. [${t.tool}] ${t.size} chars (~${Math.round(t.size/4)} tok) — ${String(t.ident).slice(0,140)}`);
  });

  console.log(`\n--- Assistant output (text + thinking + tool-call JSON args) ---`);
  console.log(`  text: ${assistantTextChars} chars (~${Math.round(assistantTextChars/4)} tok)`);
  console.log(`  thinking: ${assistantThinkingChars} chars (~${Math.round(assistantThinkingChars/4)} tok)`);
  console.log(`  tool_use input JSON: ${toolUseInputChars} chars (~${Math.round(toolUseInputChars/4)} tok)`);
  const totalOutput = assistantTextChars + assistantThinkingChars + toolUseInputChars;
  console.log(`  TOTAL model output: ${totalOutput} chars (~${Math.round(totalOutput/4)} tok)`);

  console.log(`\n--- First user message (the invocation prompt) ---`);
  console.log(`  ${firstUserMessageChars} chars (~${Math.round(firstUserMessageChars/4)} tok)`);
  console.log(`  total user-authored text across run (should ≈ first message, no extra human input expected): ${userPromptChars} chars`);

  console.log(`\n--- Real API usage, deduped by message.id (first 3 and last 3 turns) ---`);
  const usageList = idOrder.map(id => perIdUsage.get(id));
  usageList.slice(0,3).forEach((u,i) => console.log(`  turn ${i+1}: cache_creation=${u.cache_creation_input_tokens} cache_read=${u.cache_read_input_tokens} input=${u.input_tokens} output=${u.output_tokens}`));
  console.log('  ...');
  usageList.slice(-3).forEach((u,i) => console.log(`  turn ${usageList.length-2+i}: cache_creation=${u.cache_creation_input_tokens} cache_read=${u.cache_read_input_tokens} input=${u.input_tokens} output=${u.output_tokens}`));

  let sumCacheCreate=0, sumCacheRead=0, sumInput=0, sumOutput=0;
  let sumContextPerTurn = 0; // real, token-accurate "context length at that turn" summed over turns
  for (const u of usageList) {
    sumCacheCreate += u.cache_creation_input_tokens || 0;
    sumCacheRead += u.cache_read_input_tokens || 0;
    sumInput += u.input_tokens || 0;
    sumOutput += u.output_tokens || 0;
    sumContextPerTurn += (u.cache_creation_input_tokens||0) + (u.cache_read_input_tokens||0) + (u.input_tokens||0);
  }
  console.log(`\n  SUM across all ${usageList.length} turns (real API usage, tokens):`);
  console.log(`    cache_creation_input_tokens: ${sumCacheCreate}`);
  console.log(`    cache_read_input_tokens: ${sumCacheRead}`);
  console.log(`    input_tokens: ${sumInput}`);
  console.log(`    output_tokens: ${sumOutput}`);
  console.log(`    => sum over turns of (context length at that turn), tokens = cache_creation+cache_read+input summed = ${sumContextPerTurn}`);
  console.log(`    final turn's cache_creation+cache_read+input (≈ context size at end of run) = ${(usageList.at(-1).cache_creation_input_tokens||0)+(usageList.at(-1).cache_read_input_tokens||0)+(usageList.at(-1).input_tokens||0)}`);
  console.log(`    first turn's cache_creation (≈ prefix: system prompt + tool schemas + first user msg, written fresh) = ${usageList[0].cache_creation_input_tokens} tokens (~${usageList[0].cache_creation_input_tokens*4} chars)`);

  // ---- char-based simulation per the task's requested method ----
  console.log(`\n--- Char-based approximation (task's requested method): cumulative context ÷4, simulated turn by turn ---`);
  // timeline entries are in file order already (append order), tagged with turnSeq
  // Build per-turn deltas: for turn N, what NEW bytes were added by prefix/user, tool_result, output
  const maxTurn = turnSeq;
  const addedPrefix = new Array(maxTurn+1).fill(0);
  const addedToolResult = new Array(maxTurn+1).fill(0);
  const addedOutput = new Array(maxTurn+1).fill(0);
  for (const ev of timeline) {
    const t = ev.turnSeq;
    if (ev.kind === 'prefix_or_user') addedPrefix[t] += ev.bytes;
    else if (ev.kind === 'tool_result') addedToolResult[t] += ev.bytes;
    else if (ev.kind === 'output') addedOutput[t] += ev.bytes;
  }
  let cumPrefix=0, cumToolResult=0, cumOutput=0;
  let grandPrefix=0, grandToolResult=0, grandOutput=0;
  for (let t=0; t<=maxTurn; t++) {
    cumPrefix += addedPrefix[t];
    cumToolResult += addedToolResult[t];
    cumOutput += addedOutput[t];
    grandPrefix += cumPrefix;
    grandToolResult += cumToolResult;
    grandOutput += cumOutput;
  }
  const grandTotal = grandPrefix + grandToolResult + grandOutput;
  console.log(`  turns simulated: ${maxTurn}`);
  console.log(`  grand-total cumulative chars from PREFIX/user text: ${grandPrefix} (~${Math.round(grandPrefix/4)} tok) = ${(100*grandPrefix/grandTotal).toFixed(1)}%`);
  console.log(`  grand-total cumulative chars from TOOL RESULTS:     ${grandToolResult} (~${Math.round(grandToolResult/4)} tok) = ${(100*grandToolResult/grandTotal).toFixed(1)}%`);
  console.log(`  grand-total cumulative chars from MODEL OUTPUT:     ${grandOutput} (~${Math.round(grandOutput/4)} tok) = ${(100*grandOutput/grandTotal).toFixed(1)}%`);
  console.log(`  GRAND TOTAL (sum over turns of context length, chars): ${grandTotal} (~${Math.round(grandTotal/4)} tok)`);
  console.log(`  NOTE: this char-based method undercounts real prefix (system prompt+tool schemas), since it only`);
  console.log(`  captures the literal user-role text logged in the transcript, not the system prompt/tool-schema`);
  console.log(`  bytes the API actually processed (see the real-usage first-turn cache_creation figure above).`);
}

main();
