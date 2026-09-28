import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = 'D:/SideProjects/parallax';

function chars(path) {
  try {
    const c = readFileSync(path, 'utf-8');
    return c.length;
  } catch (e) {
    return null;
  }
}

function walkSum(dir) {
  let total = 0;
  let count = 0;
  const files = [];
  function walk(d) {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else {
        const c = chars(p);
        if (c !== null) { total += c; count++; files.push([p, c]); }
      }
    }
  }
  walk(dir);
  return { total, count, files };
}

const agentFiles = {
  discovery: `${ROOT}/scripts/agents/discovery.md`,
  researcher: `${ROOT}/scripts/agents/researcher.md`,
  composer: `${ROOT}/scripts/agents/composer.md`,
  drafter: `${ROOT}/scripts/agents/drafter.md`,
  'reader-panel': `${ROOT}/scripts/agents/reader-panel.md`,
  stylist: `${ROOT}/scripts/agents/stylist.md`,
  verifier: `${ROOT}/scripts/agents/verifier.md`,
};

console.log('=== Agent definition files ===');
let agentTotal = 0;
for (const [name, path] of Object.entries(agentFiles)) {
  const c = chars(path);
  agentTotal += c;
  console.log(`${name}: ${c} chars, ~${Math.round(c/4)} tokens`);
}
console.log(`SUM agent files: ${agentTotal} chars, ~${Math.round(agentTotal/4)} tokens\n`);

const referencedFiles = {
  'research/_sources/_TAXONOMY.md': `${ROOT}/research/_sources/_TAXONOMY.md`,
  'research/_sources/README.md': `${ROOT}/research/_sources/README.md`,
  'research/_sources/politics.md': `${ROOT}/research/_sources/politics.md`,
  'research/_sources/space.md': `${ROOT}/research/_sources/space.md`,
  'research/_sources/earth.md': `${ROOT}/research/_sources/earth.md`,
  'research/_sources/tech.md': `${ROOT}/research/_sources/tech.md`,
  'research/_sources/travel.md': `${ROOT}/research/_sources/travel.md`,
  'research/_sources/sports.md': `${ROOT}/research/_sources/sports.md`,
  'docs/design/catalog.md': `${ROOT}/docs/design/catalog.md`,
  'docs/design/catalog-shapes.md': `${ROOT}/docs/design/catalog-shapes.md`,
  'docs/design/CANON.md': `${ROOT}/docs/design/CANON.md`,
  'docs/generated/PROJECT-GRAPH.md': `${ROOT}/docs/generated/PROJECT-GRAPH.md`,
  'research/_templates/candidate.md': `${ROOT}/research/_templates/candidate.md`,
  'research/_templates/dossier.md': `${ROOT}/research/_templates/dossier.md`,
  'research/_templates/storyboard.md': `${ROOT}/research/_templates/storyboard.md`,
  'research/_voice/_voice-core.md': `${ROOT}/research/_voice/_voice-core.md`,
  'research/_voice/hinglish-lexicon.md': `${ROOT}/research/_voice/hinglish-lexicon.md`,
  'research/_voice/jargon.md': `${ROOT}/research/_voice/jargon.md`,
  'research/_voice/mode-library.md': `${ROOT}/research/_voice/mode-library.md`,
  'src/content/config.ts': `${ROOT}/src/content/config.ts`,
  'src/content/issues/_template/index.mdx': `${ROOT}/src/content/issues/_template/index.mdx`,
  'docs/REGISTER-PLAN.md': `${ROOT}/docs/REGISTER-PLAN.md`,
};

console.log('=== Referenced fixed files ===');
for (const [label, path] of Object.entries(referencedFiles)) {
  const c = chars(path);
  console.log(`${label}: ${c === null ? 'MISSING' : c + ' chars, ~' + Math.round(c/4) + ' tokens'}`);
}

console.log('\n=== research/_sources/*.md category allowlists — largest ===');
const catSizes = ['politics','space','earth','tech','travel','sports'].map(cat => {
  const c = chars(`${ROOT}/research/_sources/${cat}.md`);
  return [cat, c];
});
catSizes.sort((a,b) => b[1]-a[1]);
for (const [cat, c] of catSizes) console.log(`${cat}: ${c} chars, ~${Math.round(c/4)} tokens`);

console.log('\n=== docs/design/blueprints/** total ===');
const bp = walkSum(`${ROOT}/docs/design/blueprints`);
console.log(`files: ${bp.count}, total chars: ${bp.total}, ~${Math.round(bp.total/4)} tokens`);
console.log('largest 5:');
bp.files.sort((a,b)=>b[1]-a[1]).slice(0,5).forEach(([p,c]) => console.log(`  ${p.replace(ROOT+'/','')}: ${c}`));

console.log('\n=== Agent memory directories ===');
for (const agent of ['composer','drafter','stylist','verifier']) {
  try {
    const dir = `${ROOT}/.claude/agent-memory/${agent}`;
    const res = walkSum(dir);
    console.log(`${agent}: ${res.count} files, ${res.total} chars, ~${Math.round(res.total/4)} tokens`);
  } catch (e) {
    console.log(`${agent}: none found`);
  }
}

console.log('\n=== catalog.md composition: DATA lines vs prose ===');
const catalogContent = readFileSync(`${ROOT}/docs/design/catalog.md`, 'utf-8');
const lines = catalogContent.split('\n');
let dataChars = 0, totalChars = catalogContent.length;
for (const line of lines) {
  if (/^\s*-\s*\*\*DATA:\*\*/.test(line)) dataChars += line.length + 1;
}
console.log(`total: ${totalChars} chars`);
console.log(`DATA-line chars: ${dataChars} (${(100*dataChars/totalChars).toFixed(1)}%)`);
console.log(`prose/other chars: ${totalChars - dataChars} (${(100*(totalChars-dataChars)/totalChars).toFixed(1)}%)`);
const kindBlocks = (catalogContent.match(/^## /gm) || []).length;
console.log(`kind blocks (## headings): ${kindBlocks}`);
