import fs from 'node:fs';

const files = [
  ['SEPT','earth','D:/SideProjects/parallax/research/earth/2026-09-17-indonesia-fire-burns-soil-not-trees-dossier.md'],
  ['SEPT','space','D:/SideProjects/parallax/research/space/2026-09-17-iss-retirement-set-by-contract-dossier.md'],
  ['SEPT','travel','D:/SideProjects/parallax/research/travel/2026-09-17-half-indias-arrivals-are-indians-dossier.md'],
  ['SEPT','tech','D:/SideProjects/parallax/research/tech/2026-09-17-open-models-four-months-behind-dossier.md'],
  ['SEPT','sports','D:/SideProjects/parallax/research/sports/2026-09-17-premier-league-squad-cost-ratio-dossier.md'],
  ['SEPT','politics','D:/SideProjects/parallax/research/politics/2026-09-17-eleven-bills-fifteen-percent-dossier.md'],
  ['EARLY','earth','D:/SideProjects/parallax/research/earth/2026-05-03-el-nino-new-floor-dossier.md'],
  ['EARLY','sports','D:/SideProjects/parallax/research/sports/2026-06-04-arsenal-set-piece-title-dossier.md'],
  ['EARLY','travel','D:/SideProjects/parallax/research/travel/2026-06-04-queue-is-the-product-dossier.md'],
  ['EARLY','politics','D:/SideProjects/parallax/research/politics/2026-05-02-transgender-ratchet-dossier.md'],
  ['EARLY','tech','D:/SideProjects/parallax/research/tech/2026-06-04-ai-coding-token-bill-dossier.md'],
  ['EARLY','earth','D:/SideProjects/parallax/research/earth/2026-06-04-amazon-tipping-point-dossier.md'],
  ['EARLY','space','D:/SideProjects/parallax/research/space/2026-06-04-asteroid-2024-yr4-dossier.md'],
  ['EARLY','politics','D:/SideProjects/parallax/research/politics/2026-06-04-cockroach-janta-party-dossier.md'],
];

function getSection5(raw) {
  const lines = raw.split('\n');
  let start = -1, end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+5\./.test(lines[i])) start = i + 1;
    else if (start !== -1 && /^##\s+6\./.test(lines[i])) { end = i; break; }
  }
  if (start === -1) return '';
  return lines.slice(start, end).join('\n');
}

for (const [group, cat, path] of files) {
  const raw = fs.readFileSync(path, 'utf8');
  const s5 = getSection5(raw);
  // split into blocks by blank-line-separated runs of quote-blocks
  const blocks = s5.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  let quoteBlocks = 0, quoteBlocksWithUrl = 0;
  for (const b of blocks) {
    if (/^>\s*"/.test(b)) {
      quoteBlocks++;
      if (/https?:\/\//.test(b)) quoteBlocksWithUrl++;
    }
  }
  console.log(`${group.padEnd(6)} ${cat.padEnd(8)} quoteBlocks=${quoteBlocks}  withUrl=${quoteBlocksWithUrl}  missing=${quoteBlocks-quoteBlocksWithUrl}`);
}
