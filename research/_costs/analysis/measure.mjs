import fs from 'node:fs';

const files = [
  // September six
  ['SEPT', 'earth', 'D:/SideProjects/parallax/research/earth/2026-09-17-indonesia-fire-burns-soil-not-trees-dossier.md'],
  ['SEPT', 'space', 'D:/SideProjects/parallax/research/space/2026-09-17-iss-retirement-set-by-contract-dossier.md'],
  ['SEPT', 'travel', 'D:/SideProjects/parallax/research/travel/2026-09-17-half-indias-arrivals-are-indians-dossier.md'],
  ['SEPT', 'tech', 'D:/SideProjects/parallax/research/tech/2026-09-17-open-models-four-months-behind-dossier.md'],
  ['SEPT', 'sports', 'D:/SideProjects/parallax/research/sports/2026-09-17-premier-league-squad-cost-ratio-dossier.md'],
  ['SEPT', 'politics', 'D:/SideProjects/parallax/research/politics/2026-09-17-eleven-bills-fifteen-percent-dossier.md'],
  // Earlier group (Phase 4 / Phase 6) - dossiers that actually exist
  ['EARLY', 'earth', 'D:/SideProjects/parallax/research/earth/2026-05-03-el-nino-new-floor-dossier.md'],
  ['EARLY', 'sports', 'D:/SideProjects/parallax/research/sports/2026-06-04-arsenal-set-piece-title-dossier.md'],
  ['EARLY', 'travel', 'D:/SideProjects/parallax/research/travel/2026-06-04-queue-is-the-product-dossier.md'],
  ['EARLY', 'politics', 'D:/SideProjects/parallax/research/politics/2026-05-02-transgender-ratchet-dossier.md'],
  ['EARLY', 'tech', 'D:/SideProjects/parallax/research/tech/2026-06-04-ai-coding-token-bill-dossier.md'],
  ['EARLY', 'earth', 'D:/SideProjects/parallax/research/earth/2026-06-04-amazon-tipping-point-dossier.md'],
  ['EARLY', 'space', 'D:/SideProjects/parallax/research/space/2026-06-04-asteroid-2024-yr4-dossier.md'],
  ['EARLY', 'politics', 'D:/SideProjects/parallax/research/politics/2026-06-04-cockroach-janta-party-dossier.md'],
];

function getSections(lines) {
  const idx = [];
  lines.forEach((l, i) => {
    const m = l.match(/^##\s+(\d+)\.\s+(.*)$/);
    if (m) idx.push({ n: parseInt(m[1], 10), title: m[2].trim(), line: i });
  });
  const sections = {};
  for (let k = 0; k < idx.length; k++) {
    const start = idx[k].line + 1;
    const end = k + 1 < idx.length ? idx[k + 1].line : lines.length;
    sections[idx[k].n] = { title: idx[k].title, text: lines.slice(start, end).join('\n') };
  }
  return sections;
}

function countTableRows(text) {
  const lines = text.split('\n');
  let dataRows = 0, sepRows = 0, totalPipeLines = 0;
  for (const l of lines) {
    const t = l.trim();
    if (/^\|.*\|$/.test(t)) {
      totalPipeLines++;
      if (/^\|[\s\-:|]+\|$/.test(t)) sepRows++;
    }
  }
  // data rows = total pipe lines - separator rows - (1 header row per table = count of sepRows)
  dataRows = totalPipeLines - sepRows - sepRows;
  return { totalPipeLines, sepRows, dataRows };
}

function countKindNames(text) {
  const lines = text.split('\n');
  const kinds = [];
  for (const l of lines) {
    if (/^###\s+4/.test(l.trim()) || /DRAWN GRAPHIC/i.test(l)) {
      const backticks = [...l.matchAll(/`([a-zA-Z0-9_-]+)`/g)].map(m => m[1]);
      if (backticks.length) kinds.push({ heading: l.trim(), kinds: backticks });
    }
  }
  return kinds;
}

function countUnverified(fullText) {
  const m = fullText.match(/\[UNVERIFIED/g);
  return m ? m.length : 0;
}

function countDiscrepancy(fullText) {
  const m = fullText.match(/discrepan|disagree|conflict|differs?\b/gi);
  return m ? m.length : 0;
}

function findDiscrepancyLines(fullText) {
  return fullText.split('\n').filter(l => /discrepan|disagree|conflict|differs?\b/i.test(l)).map(l => l.trim());
}

function analyzeQuotes(text) {
  const lines = text.split('\n');
  let quoteStarts = 0, attributions = 0;
  const attributionLines = [];
  for (const l of lines) {
    if (/^>\s*"/.test(l.trim())) quoteStarts++;
    if (/^>\s*—/.test(l.trim())) { attributions++; attributionLines.push(l.trim()); }
  }
  const hasUrl = attributionLines.map(l => /https?:\/\//.test(l));
  return { quoteStarts, attributions, attributionLines, urlCoverage: hasUrl };
}

function wordCount(text) {
  const stripped = text.replace(/\*\*/g, '').replace(/`/g, '').replace(/\[|\]|\(|\)/g, '').trim();
  if (!stripped) return 0;
  return stripped.split(/\s+/).filter(Boolean).length;
}

function analyzeSection8(text) {
  const lines = text.split('\n');
  const spreadLine = lines.find(l => /Spread:/.test(l));
  let inNotCitable = false;
  const sourceLines = [];
  const notCitableLines = [];
  for (const l of lines) {
    if (/not citable/i.test(l)) { inNotCitable = true; continue; }
    if (/^-\s+\[/.test(l.trim())) {
      if (inNotCitable) notCitableLines.push(l.trim());
      else sourceLines.push(l.trim());
    } else if (/^-\s+\S/.test(l.trim()) && inNotCitable) {
      notCitableLines.push(l.trim());
    }
  }
  const urls = [];
  for (const l of sourceLines) {
    const m = l.match(/\((https?:\/\/[^\s)]+)\)/);
    if (m) urls.push(m[1]);
  }
  const domains = urls.map(u => {
    try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return 'PARSE_ERROR'; }
  });
  const distinctDomains = [...new Set(domains)];
  return { spreadLine, sourceRowCount: sourceLines.length, notCitableCount: notCitableLines.length, urlCount: urls.length, distinctDomains, domains };
}

const results = [];
for (const [group, cat, path] of files) {
  const raw = fs.readFileSync(path, 'utf8');
  const lines = raw.split('\n');
  const sections = getSections(lines);
  const s4 = sections[4] ? sections[4].text : '';
  const s5 = sections[5] ? sections[5].text : '';
  const s1 = sections[1] ? sections[1].text : '';
  const s8 = sections[8] ? sections[8].text : '';

  const tableRows4 = countTableRows(s4);
  const kindNames4 = countKindNames(s4);
  const unverifiedTotal = countUnverified(raw);
  const unverified4 = countUnverified(s4);
  const discrepTotal = countDiscrepancy(raw);
  const discrepLines = findDiscrepancyLines(raw);
  const quotes = analyzeQuotes(s5);
  const s1Words = wordCount(s1);
  const s8analysis = analyzeSection8(s8);

  results.push({
    group, cat, path,
    lineCount: lines.length,
    charCount: raw.length,
    sectionsFound: Object.keys(sections).map(Number).sort((a,b)=>a-b),
    s4_tableRows: tableRows4,
    s4_kindNamesFound: kindNames4,
    unverifiedTotal, unverified4,
    discrepTotal, discrepLines,
    quotes,
    s1Words,
    s1Filled: s1.trim().length > 0,
    s8: s8analysis,
  });
}

console.log(JSON.stringify(results, null, 2));
