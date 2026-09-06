/**
 * make-pdf.mjs — render voice-id-script.html into a print-laid-out PDF.
 *
 *   node research/_voice/make-pdf.mjs
 *   node research/_voice/make-pdf.mjs --dark
 *
 * Reads the reading script (the same file published as the artifact), pulls out
 * the parts / takes / cues / lines, and re-lays them for A4 paper: no interactive
 * chrome, one part per page, take numbers as the navigation handle. Regenerate
 * after any edit to voice-id-script.html so the two never drift.
 *
 * Take numbers are assigned by document order here exactly as the web page
 * assigns them at runtime, so "pick up at take 34" means the same thing in both.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, 'voice-id-script.html');
const DARK = process.argv.includes('--dark');
const OUT_HTML = join(HERE, DARK ? '.print-dark.html' : '.print.html');
const OUT_PDF = join(HERE, DARK ? 'Parallax-Voice-Session-dark.pdf' : 'Parallax-Voice-Session.pdf');

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => { try { readFileSync(p); return true; } catch { return false; } });

if (!CHROME) throw new Error('No Chrome or Edge found for PDF rendering.');

/* ── fonts ──────────────────────────────────────────────────────────────────
 * Headless Chrome does not fetch remote webfonts when printing a file:// page,
 * so the whole document silently falls back to a system sans. Cache the latin
 * woff2 subsets locally on first run and inline them as data URIs — the print
 * HTML then carries its own type and renders identically offline.
 */
const FONT_DIR = join(HERE, 'fonts');
const FACES = [
  { file: 'fraunces.woff2', fam: 'Fraunces', style: 'normal', wght: '400 700',
    q: 'family=Fraunces:opsz,wght@9..144,400..700' },
  { file: 'fraunces-italic.woff2', fam: 'Fraunces', style: 'italic', wght: '400 600',
    q: 'family=Fraunces:ital,opsz,wght@1,9..144,400..600' },
  { file: 'schibsted.woff2', fam: 'Schibsted Grotesk', style: 'normal', wght: '400 700',
    q: 'family=Schibsted+Grotesk:wght@400..700' },
  { file: 'mono.woff2', fam: 'JetBrains Mono', style: 'normal', wght: '400 700',
    q: 'family=JetBrains+Mono:wght@400..700' },
];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

mkdirSync(FONT_DIR, { recursive: true });
for (const f of FACES) {
  const dest = join(FONT_DIR, f.file);
  if (existsSync(dest)) continue;
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${f.q}&display=block`,
    { headers: { 'User-Agent': UA } })).text();
  // Pick the `latin` subset: the only block whose unicode-range starts at U+0000.
  const block = css.split('@font-face').slice(1)
    .find((b) => /unicode-range:\s*U\+0000-00FF/.test(b));
  const url = (block || '').match(/src:\s*url\((https:[^)]+)\)/)?.[1];
  if (!url) throw new Error(`No latin woff2 found for ${f.fam}`);
  const buf = Buffer.from(await (await fetch(url, { headers: { 'User-Agent': UA } })).arrayBuffer());
  writeFileSync(dest, buf);
  console.log(`fetched ${f.file} (${(buf.length / 1024).toFixed(0)} KB)`);
}

const FONT_CSS = FACES.map((f) => `@font-face{font-family:'${f.fam}';font-style:${f.style};` +
  `font-weight:${f.wght};font-display:block;` +
  `src:url(data:font/woff2;base64,${readFileSync(join(FONT_DIR, f.file)).toString('base64')}) format('woff2');}`
).join('\n');

/* ── parse ──────────────────────────────────────────────────────────────── */
const src = readFileSync(SRC, 'utf8');
const one = (re, s = src) => { const m = s.match(re); return m ? m[1].trim() : ''; };
const words = (html) => {
  const t = html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').trim();
  return t ? t.split(/\s+/).length : 0;
};

const title = one(/<h1>([\s\S]*?)<\/h1>/);
const kicker = one(/<p class="kicker">([\s\S]*?)<\/p>/);
const dek = one(/<p class="dek">([\s\S]*?)<\/p>/);
const endnote = one(/<p class="endnote">([\s\S]*?)<\/p>/);

const specs = [...src.matchAll(/<div class="spec"><dt>([\s\S]*?)<\/dt><dd>([\s\S]*?)<\/dd><\/div>/g)]
  .map((m) => ({ k: m[1].trim(), v: m[2].trim() }));

const notes = [...one(/<ul class="notes">([\s\S]*?)<\/ul>/).matchAll(/<li>([\s\S]*?)<\/li>/g)]
  .map((m) => m[1].trim());

let takeNo = 0;
const parts = src.split(/<section class="part-wrap"[^>]*>/).slice(1).map((chunk) => {
  const no = one(/<span class="part__no">([\s\S]*?)<\/span>/, chunk);
  const heading = one(/<h2 class="part__t">([\s\S]*?)<\/h2>/, chunk);
  const takes = [...chunk.matchAll(/<section class="take" id="t\d+">([\s\S]*?)<\/section>/g)]
    .map((m) => {
      const blocks = [];
      const re = /<div class="(cue|hold)">([\s\S]*?)<\/div>|<p class="line">([\s\S]*?)<\/p>/g;
      let b;
      while ((b = re.exec(m[1])) !== null) {
        if (b[1] === 'cue') {
          blocks.push({ t: 'cue', html: b[2].replace(/<span class="cue__tag">[\s\S]*?<\/span>\s*/, '') });
        } else if (b[1] === 'hold') {
          blocks.push({
            t: 'hold',
            k: one(/<span class="hold__k">([\s\S]*?)<\/span>/, b[2]),
            v: one(/<span class="hold__v">([\s\S]*?)<\/span>/, b[2]),
          });
        } else {
          blocks.push({ t: 'line', html: b[3] });
        }
      }
      takeNo += 1;
      return { n: String(takeNo).padStart(3, '0'), blocks };
    });
  const w = takes.reduce(
    (a, t) => a + t.blocks.filter((b) => b.t === 'line').reduce((x, b) => x + words(b.html), 0), 0);
  return { no, heading, takes, words: w };
});

const totalWords = parts.reduce((a, p) => a + p.words, 0);
const totalTakes = takeNo;
const mins = (w) => Math.max(1, Math.round(w / 138));

/* ── palette ────────────────────────────────────────────────────────────── */
const T = DARK
  ? { paper: '#16150F', ink: '#F2EFE7', muted: '#948E80', brass: '#C9AC6E', signal: '#E0655A', rule: '#33302A', box: '#1E1C18' }
  : { paper: '#FCFBF7', ink: '#191713', muted: '#6A655B', brass: '#7C6531', signal: '#B23A2E', rule: '#D8D3C7', box: '#F4F1E9' };

/* ── emit ───────────────────────────────────────────────────────────────── */
const esc = (s) => s;

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<title>Parallax Voice Session</title>
<style>
${FONT_CSS}
@page{ size:A4; margin:17mm 19mm 19mm; }
:root{
  --paper:${T.paper}; --ink:${T.ink}; --muted:${T.muted};
  --brass:${T.brass}; --signal:${T.signal}; --rule:${T.rule}; --box:${T.box};
  --serif:'Fraunces',Georgia,'Times New Roman',serif;
  --ui:'Schibsted Grotesk',system-ui,'Segoe UI',sans-serif;
  --mono:'JetBrains Mono',ui-monospace,Consolas,monospace;
}
*{box-sizing:border-box}
html,body{
  background:var(--paper); color:var(--ink); margin:0; padding:0;
  font-optical-sizing:auto;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
body{ font-family:var(--ui); font-size:11pt; line-height:1.5; }
p{ orphans:3; widows:3; margin:0; }

/* ── cover ── */
.cover{ break-after:page; padding-top:22mm; }
.kick{ font-family:var(--mono); font-size:8.5pt; letter-spacing:.2em; text-transform:uppercase;
  color:var(--brass); margin:0 0 9mm; }
h1{ font-family:var(--serif); font-size:40pt; font-weight:600; line-height:1.02;
  letter-spacing:-.02em; margin:0; max-width:14ch; }
h1 em{ font-style:italic; font-weight:500; }
.dek{ font-size:12pt; line-height:1.55; color:var(--muted); max-width:52ch; margin:8mm 0 0; }
.rulebar{ height:3px; background:var(--ink); margin:9mm 0 7mm; }

.contents{ width:100%; border-collapse:collapse; font-family:var(--mono); font-size:9pt; }
.contents th{ text-align:left; font-weight:500; letter-spacing:.12em; text-transform:uppercase;
  font-size:7.5pt; color:var(--muted); padding:0 0 2.5mm; border-bottom:1px solid var(--rule); }
.contents td{ padding:2.6mm 0; border-bottom:1px solid var(--rule); vertical-align:baseline; }
.contents .c-no{ color:var(--signal); width:16mm; }
.contents .c-t{ font-family:var(--serif); font-size:11.5pt; }
.contents .c-r,.contents .c-m{ text-align:right; color:var(--muted); font-variant-numeric:tabular-nums; }
.contents .c-r{ width:26mm; } .contents .c-m{ width:20mm; }
.contents tr.tot td{ border-bottom:0; border-top:2px solid var(--ink); color:var(--ink); padding-top:3mm; }

/* ── briefing ── */
.brief{ break-after:page; }
.brief h2{ font-family:var(--mono); font-size:9pt; font-weight:700; letter-spacing:.18em;
  text-transform:uppercase; color:var(--brass); margin:0 0 6mm; }
.specs{ display:grid; grid-template-columns:1fr 1fr; gap:0 10mm; margin:0 0 9mm; }
.spec{ padding:3mm 0; border-bottom:1px solid var(--rule); }
.spec dt{ font-family:var(--mono); font-size:7.5pt; letter-spacing:.13em; text-transform:uppercase;
  color:var(--muted); margin:0 0 1mm; }
.spec dd{ margin:0; font-size:10.5pt; }
.notes{ margin:0; padding:0; list-style:none; }
.notes li{ position:relative; padding-left:7mm; margin:0 0 4mm; font-size:11pt; line-height:1.55;
  max-width:64ch; break-inside:avoid; }
.notes li::before{ content:''; position:absolute; left:0; top:.72em; width:4mm; height:1px; background:var(--brass); }
.notes b{ font-weight:600; }

/* ── parts ── */
.part{ break-before:page; }
.part__hd{ border-top:3px solid var(--ink); border-bottom:1px solid var(--rule);
  padding:3.5mm 0 3mm; margin:0 0 8mm; display:flex; align-items:baseline; gap:5mm; break-after:avoid; }
.part__no{ font-family:var(--mono); font-size:9pt; font-weight:700; letter-spacing:.16em;
  text-transform:uppercase; color:var(--signal); }
.part__t{ font-family:var(--serif); font-size:21pt; font-weight:600; letter-spacing:-.015em;
  margin:0; flex:1; line-height:1.1; }
.part__m{ font-family:var(--mono); font-size:8pt; color:var(--muted); font-variant-numeric:tabular-nums; }

/* ── takes ── */
.take{ margin:0 0 8mm; }
.take__hd{ display:flex; align-items:center; gap:3mm; margin:0 0 3.5mm; break-after:avoid; }
.take__box{ width:3.6mm; height:3.6mm; border:1px solid var(--rule); flex:none; }
.take__n{ font-family:var(--mono); font-size:9pt; font-weight:500; letter-spacing:.1em;
  color:var(--brass); font-variant-numeric:tabular-nums; }
.take__hd::after{ content:''; flex:1; height:1px; background:var(--rule); }

.line{ font-family:var(--serif); font-size:17pt; line-height:1.6; letter-spacing:-.005em;
  margin:0 0 4.5mm; }
.line:last-child{ margin-bottom:0; }
.line em{ font-style:italic; } .line b{ font-weight:600; }

.cue{ border-left:2.5pt solid var(--signal); background:var(--box); padding:3mm 4mm;
  margin:0 0 5mm; font-family:var(--mono); font-size:9pt; line-height:1.6; color:var(--muted);
  break-inside:avoid; }
.cue b{ color:var(--ink); font-weight:500; }
.cue::before{ content:'Cue · do not read'; display:block; color:var(--signal); font-weight:700;
  letter-spacing:.12em; text-transform:uppercase; font-size:7.5pt; margin:0 0 1.5mm; }

.hold{ border:1px dashed var(--rule); padding:3.5mm 4mm; margin:0 0 5mm; break-inside:avoid; }
.hold__k{ font-family:var(--mono); font-size:8pt; font-weight:700; letter-spacing:.14em;
  text-transform:uppercase; color:var(--brass); display:block; margin:0 0 1.5mm; }
.hold__v{ font-family:var(--mono); font-size:9pt; color:var(--muted); line-height:1.6; }

.end{ break-before:page; border-top:3px solid var(--ink); padding:6mm 0 0;
  font-size:11pt; line-height:1.6; color:var(--muted); max-width:60ch; }
.end b{ color:var(--ink); font-weight:600; }
</style>
</head><body>

<section class="cover">
  <p class="kick">${esc(kicker)}</p>
  <h1>${esc(title)}</h1>
  <p class="dek">${esc(dek)}</p>
  <div class="rulebar"></div>
  <table class="contents">
    <thead><tr><th></th><th>Part</th><th class="c-r">Takes</th><th class="c-m">Approx</th></tr></thead>
    <tbody>
${parts.map((p) => {
  const first = p.takes[0] ? p.takes[0].n : '—';
  const last = p.takes[p.takes.length - 1] ? p.takes[p.takes.length - 1].n : '—';
  return `      <tr><td class="c-no">${p.no.replace('Part ', '')}</td><td class="c-t">${p.heading}</td>` +
         `<td class="c-r">${first}&ndash;${last}</td><td class="c-m">~${mins(p.words)} min</td></tr>`;
}).join('\n')}
      <tr class="tot"><td class="c-no"></td><td class="c-t">Total</td><td class="c-r">${totalTakes}</td><td class="c-m">~${mins(totalWords)} min</td></tr>
    </tbody>
  </table>
</section>

<section class="brief">
  <h2>Before you press record</h2>
  <div class="specs">
${specs.map((s) => `    <dl class="spec"><dt>${s.k}</dt><dd>${s.v}</dd></dl>`).join('\n')}
  </div>
  <ul class="notes">
${notes.map((n) => `    <li>${n}</li>`).join('\n')}
  </ul>
</section>

${parts.map((p) => `<section class="part">
  <header class="part__hd">
    <span class="part__no">${p.no}</span>
    <h2 class="part__t">${p.heading}</h2>
    <span class="part__m">${p.words.toLocaleString()} words &middot; ~${mins(p.words)} min</span>
  </header>
${p.takes.map((t) => `  <article class="take">
    <div class="take__hd"><span class="take__box"></span><span class="take__n">${t.n}</span></div>
${t.blocks.map((b) => {
    if (b.t === 'cue') return `    <div class="cue">${b.html}</div>`;
    if (b.t === 'hold') return `    <div class="hold"><span class="hold__k">${b.k}</span><span class="hold__v">${b.v}</span></div>`;
    return `    <p class="line">${b.html}</p>`;
  }).join('\n')}
  </article>`).join('\n')}
</section>`).join('\n')}

<p class="end">${esc(endnote)}</p>

</body></html>
`;

mkdirSync(HERE, { recursive: true });
writeFileSync(OUT_HTML, html, 'utf8');

const args = [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  '--no-pdf-header-footer',
  '--generate-pdf-document-outline',
  '--virtual-time-budget=12000',
  `--print-to-pdf=${OUT_PDF}`,
  `file:///${OUT_HTML.replace(/\\/g, '/')}`,
];

try {
  execFileSync(CHROME, args, { stdio: 'pipe' });
} catch (e) {
  // Older builds reject --generate-pdf-document-outline; retry without it.
  execFileSync(CHROME, args.filter((a) => a !== '--generate-pdf-document-outline'), { stdio: 'pipe' });
}

console.log(`${parts.length} parts · ${totalTakes} takes · ${totalWords.toLocaleString()} words · ~${mins(totalWords)} min at 138 wpm`);
console.log(`→ ${OUT_PDF}`);
