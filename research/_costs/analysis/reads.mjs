// List every file-reading tool call (Read/Grep/Glob) with its result size and the API call index it fed.
import { readFileSync } from 'fs';
const file = process.argv[2];
const entries = readFileSync(file, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const seen = new Set(); let call = 0; const byId = new Map(); const rows = [];
for (const o of entries) {
  if (o.isSidechain) continue;
  if (o.type === 'assistant') {
    if (!seen.has(o.message.id)) { seen.add(o.message.id); call++; }
    for (const b of o.message.content ?? []) if (b.type === 'tool_use') byId.set(b.id, { name: b.name, input: b.input, call });
  } else if (o.type === 'user' && Array.isArray(o.message?.content)) {
    for (const b of o.message.content) {
      if (b.type !== 'tool_result') continue;
      const t = byId.get(b.tool_use_id); if (!t) continue;
      if (!['Read', 'Grep', 'Glob'].includes(t.name)) continue;
      const n = typeof b.content === 'string' ? b.content.length : JSON.stringify(b.content ?? '').length;
      const i = t.input ?? {};
      const target = (i.file_path ?? i.path ?? '') + (i.pattern ? ` /${i.pattern}/` : '') + (i.offset ? ` @${i.offset}` : '') + (i.limit ? ` +${i.limit}` : '');
      rows.push({ call: t.call, tool: t.name, target: target.replace(/^D:\\SideProjects\\parallax\\?/i, '').replace(/\\/g, '/').slice(0, 90), chars: n });
    }
  } else if (o.type === 'attachment' && o.attachment?.type === 'nested_memory') {
    const a = o.attachment;
    rows.push({ call: call + 1, tool: 'nested_memory', target: String(a.path ?? a.filePath ?? JSON.stringify(a).slice(0, 80)).replace(/\\/g, '/').slice(-90), chars: JSON.stringify(a).length });
  }
}
console.log(file.split('/').pop(), 'calls', call);
console.table(rows);
const tot = {}; for (const r of rows) tot[r.tool] = (tot[r.tool] ?? 0) + r.chars;
console.log('chars by tool', tot);
