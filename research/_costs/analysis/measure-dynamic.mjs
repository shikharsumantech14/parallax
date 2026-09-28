import { readFileSync, readdirSync } from 'fs';

const ROOT = 'D:/SideProjects/parallax';

function chars(path) {
  try { return readFileSync(path, 'utf-8').length; } catch { return null; }
}

const files = {
  'space candidates 2026-09-16': `${ROOT}/research/space/2026-09-16-candidates.md`,
  'space candidates 2026-06-03': `${ROOT}/research/space/2026-06-03-candidates.md`,
  'ISS dossier': `${ROOT}/research/space/2026-09-17-iss-retirement-set-by-contract-dossier.md`,
  'ISS storyboard': `${ROOT}/research/space/2026-09-21-iss-retirement-set-by-contract-storyboard.md`,
  'ISS panel (1st)': `${ROOT}/research/space/2026-09-21-2026-09-21-iss-retirement-set-by-contract-panel.md`,
  'ISS panel (2nd)': `${ROOT}/research/space/2026-09-22-iss-retirement-set-by-contract-panel-2.md`,
  'ISS verification': `${ROOT}/research/space/2026-09-22-iss-retirement-set-by-contract-verification.md`,
  'ISS draft MDX': `${ROOT}/src/content/issues/2026-09-21-iss-retirement-set-by-contract/index.mdx`,
};

for (const [label, path] of Object.entries(files)) {
  const c = chars(path);
  console.log(`${label}: ${c === null ? 'MISSING' : c + ' chars, ~' + Math.round(c/4) + ' tokens'}`);
}

// Also measure dossier/storyboard/draft for other categories to get a range
console.log('\n=== Range across categories (research phase output sizes) ===');
const cats = ['politics','tech','earth','travel','sports'];
for (const cat of cats) {
  try {
    const dir = `${ROOT}/research/${cat}`;
    const dossierFiles = readdirSync(dir).filter(f => f.endsWith('-dossier.md') && !f.startsWith('2026-06'));
    for (const f of dossierFiles) {
      const c = chars(`${dir}/${f}`);
      console.log(`${cat}/${f}: ${c} chars, ~${Math.round(c/4)} tokens`);
    }
  } catch (e) { console.log(`${cat}: error ${e.message}`); }
}

console.log('\n=== Issue count in src/content/issues ===');
const issueDirs = readdirSync(`${ROOT}/src/content/issues`, { withFileTypes: true }).filter(e => e.isDirectory());
console.log(`total dirs: ${issueDirs.length}`);
let totalIssueChars = 0;
for (const d of issueDirs) {
  const c = chars(`${ROOT}/src/content/issues/${d.name}/index.mdx`);
  if (c) totalIssueChars += c;
}
console.log(`sum of all index.mdx chars (if fully read, e.g. by discovery scanning previous issues): ${totalIssueChars}, ~${Math.round(totalIssueChars/4)} tokens across ${issueDirs.length} files`);
console.log(`avg per issue: ${Math.round(totalIssueChars/issueDirs.length)} chars`);
