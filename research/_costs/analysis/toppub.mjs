import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync('measure_output.json','utf8'));
for (const d of data) {
  const doms = d.s8.domains;
  const counts = {};
  for (const dom of doms) counts[dom] = (counts[dom]||0)+1;
  const total = doms.length;
  const top = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
  const pct = top ? (100*top[1]/total).toFixed(1) : 'n/a';
  console.log(`${d.group.padEnd(6)} ${d.cat.padEnd(8)} total=${total}  distinctDomains=${d.s8.distinctDomains.length}  top=${top?top[0]:'-'} (${top?top[1]:0}/${total}=${pct}%)`);
}
