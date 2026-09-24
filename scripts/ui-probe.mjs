#!/usr/bin/env node
/**
 * ui-probe — the RENDERING gate.
 *
 * Every other gate in this repo is textual: the Zod schema, check:catalog,
 * check:prose, design:check. None of them has ever seen a pixel, which is why
 * issues have shipped with components spilling their column, labels printed on
 * top of each other, captions twice, and a chip under the ⤢ study button while
 * every gate was green (AGENTS.md §10, 2026-09-22). This script loads each
 * published issue in headless Chrome as a SIGNED-IN reader, at desktop and
 * phone widths, measures the rendered geometry and writes a report plus
 * screenshots.
 *
 *   node scripts/ui-probe.mjs [--base http://localhost:4321] [--slug <s>]...
 *        [--widths 1280,375] [--out research/_ui/<YYYY-MM-DD>] [--report]
 *        [--no-home] [--no-serve] [--no-shots] [--concurrency 2]
 *
 *   npm run check:render            (same thing; NOT part of prebuild)
 *
 * Exit 1 when any BLOCKING finding exists (unless --report), 2 on a harness
 * failure (no Chrome, no server).
 *
 * Every completed run also writes research/_ui/last-run.json (the stamp):
 * when, base, widths, the slugs rendered, `full`, the blocking and warning
 * counts, and the render fingerprint taken at the START of the run
 * (scripts/lib/render-fingerprint.mjs). .claude/hooks/guard-render.mjs reads it
 * and refuses a rendering commit it does not cover (AGENTS.md §8, 2026-09-24).
 *
 * ── How the page is put into a measurable state ──────────────────────────────
 *  - Cookie `sb-probe-auth-token=1` on the base origin BEFORE navigation, so
 *    core/ReadingGate.astro sees a session and removes itself: the whole
 *    article renders, exactly as for a signed-in reader. Verified after load
 *    (no `.px-gate`, no `.px-gate-hidden`) or the page is reported HARNESS.
 *  - `prefers-reduced-motion: reduce` is emulated, so reveals, count-ups and
 *    the viz3d runtime settle into their final static state. NOTE: the WebGL
 *    kinds are therefore measured as their static fallback, never the canvas —
 *    that is the fallback contract (AGENTS.md §2), not a gap in the probe.
 *  - The page is scrolled through once (IntersectionObservers, lazy islands),
 *    every `[data-reveal]` is forced to `.is-in`, `document.fonts.ready` is
 *    awaited, and the Astro dev toolbar is removed.
 *  - SAFETY: request interception lets through only GET/HEAD to the base
 *    origin (minus `/api/*`) and Google Fonts. Everything else is aborted —
 *    above all ReadingTracker's POST to PUBLIC_APP_URL, which would otherwise
 *    write fake "open" events into the PRODUCTION analytics table on every
 *    run. API-fed islands (reactions, letters, save state) therefore render in
 *    their offline state; none of them sits inside #px-article.
 *
 * ── What is measured (issue pages; all inside #px-article) ───────────────────
 *  The column is #px-article's PADDING box, rule to rule. Measured at 1280 it
 *  is 858, not 860: the grid cell is 860 and the two 1px rules sit inside it,
 *  so the content measure is 718, not the 720 the figures are drawn for.
 *  Skipped everywhere: display:none,
 *  visibility:hidden, opacity 0 (self or ancestor), zero-size, non-rendering
 *  SVG (defs, clipPath, title…), a back-facing flip-card face, and HTML inside
 *  an [aria-hidden=true] subtree. SVG is measured even under aria-hidden:
 *  charts that hand AT a table instead are still drawn for sighted readers.
 *
 *  BLOCKING
 *   COLUMN   an element's visible rect (after ancestor overflow clipping)
 *            crosses the column by >1px; collapsed to the outermost offender
 *            per section. No layout is exempt: the floor-plan ruling of
 *            2026-09-23 (layout-v2.css) is that nothing crosses the rails, so
 *            a bleed / split plate wider than the column IS the defect. Above
 *            900px a horizontal scroller whose content actually scrolls is
 *            reported too (the phone card-scroll rule is the only designed
 *            scroller).
 *   FRAME    the honest overflow test (scrollTo(9999) ⇒ scrollX 0 and
 *            scrollWidth ≤ innerWidth), at every width; on failure the
 *            outermost elements past the viewport are listed.
 *   CLIP     text cut by an ancestor (self included, up to the section) whose
 *            overflow clips — hidden/clip on x, anything non-visible on y (on
 *            the ink band, below) — or by its outer <svg>. Screen-reader-only
 *            boxes (1px, clip: rect(0 0 0 0)) are not on screen and skipped. Horizontal scrollers are exempt on x (the
 *            content is reachable). Text truncated with an ellipsis or a
 *            line-clamp is the sanctioned way to shorten a cell and is counted,
 *            not reported. Also: an <svg>/<img>/<canvas> cut by a clipping box.
 *            Grouped per clipping ancestor.
 *   OVERLAP  two text leaves (neither containing the other) whose INK bands
 *            intersect by >25% of the smaller's area, or cross by more than
 *            2px in both axes (one line of a long annotation printed over a
 *            short label is a small share and still a collision). The ink
 *            band is the line box inset by the ascent/descent the glyphs leave
 *            empty (canvas
 *            measureText on the same font and string): a 70px numeral's line
 *            box reaches ~20px above its digits, which read as a collision
 *            with the eyebrow above it on the first trial. An identical
 *            string at the same spot is a halo copy and is ignored.
 *   CHIP     the caption-row chip `.px-viz__cap b` under the ⤢ study button
 *            `.px-vexp` (ExpandModal) by any amount, or any text whose ink band
 *            runs under it by more than 2px in both axes.
 *   CHROME   more than one visible caption / source / how-to-read in a section
 *            (`.vb__cap` and `.px-seats__caption` are a label and a subtitle,
 *            not captions — the same exclusions as dataviz-v2.css).
 *  WARNING
 *   ALIGN    edges spread by >8px within one of a section's two edge sets —
 *            TEXT (Section's chrome: number, eyebrow, title, intro, how, claim,
 *            plain; right edges only where ruled or boxed, since a 24ch title
 *            is ragged by design) and FIGURE (the graphic root, plus a ruled
 *            child one level inside it spanning ≥85% of the section; right
 *            edges skip plain paragraphs) — or a figure that is not
 *            symmetric about the text column. The two sets may differ (`wide`
 *            puts the figure at the 860 column and the text at the 720
 *            measure); side-by-side copy/stage columns are compared apart.
 *   TOUCH    glyphs of two separate text blocks closer than 1.5px, side by
 *            side on one line ("FEB 18 2025Earth-impact…") or stacked (an
 *            axis title sitting on a reference label) — including a crossing
 *            too small for OVERLAP's 25% share.
 *   EMPTY    a graphic kind whose graphic is under 60px tall.
 *   TINY     HTML text under 9px computed, SVG text whose rendered box is
 *            under 7px tall.
 *
 *  The home page gets FRAME, COLUMN (against the 1280 frame), CLIP, OVERLAP,
 *  CHIP and TINY, grouped by band.
 */
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { spawn, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { renderFingerprint, renderedIssueSlugs } from './lib/render-fingerprint.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ISSUES_DIR = path.join(ROOT, 'src', 'content', 'issues');
/* Local state for .claude/hooks/guard-render.mjs, which refuses a rendering
   commit unless this stamp is clean, covers the staged scope and carries the
   fingerprint of the tree being committed. research/_ui/ is gitignored. */
const STAMP = path.join(ROOT, 'research', '_ui', 'last-run.json');
const GATE_WIDTHS = [1280, 375];

const BLOCKING = ['HARNESS', 'FRAME', 'COLUMN', 'CLIP', 'OVERLAP', 'CHIP', 'CHROME'];
const WARNING = ['ALIGN', 'TOUCH', 'EMPTY', 'TINY'];
const TYPES = [...BLOCKING, ...WARNING];

/* Same set ReadingGate + check-catalog treat as narrative (no graphic). */
const NARRATIVE = ['act-break', 'prose', 'quote', 'beat-sheet', 'analogy', 'comparison', 'plate', 'jargon-buster', 'three-steps'];

const MOBILE_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36';

const THRESHOLDS = {
  col: 1, // px past the column rule
  clip: 1, // px past a clipping box (x on the line box, y on the ink band)
  overlap: 0.25, // share of the smaller text box
  chip: 0.5, // px in both axes (the chip box)
  chipText: 2, // px in both axes (a text line box under the button)
  align: 8, // px spread of edges
  empty: 60, // px graphic height
  tinyHtml: 9, // px computed font-size
  tinySvg: 7, // px rendered text box height
  touch: 1.5, // px: glyphs of two separate text blocks closer than this
  cross: 2, // px in both axes: an ink-on-ink crossing that is an OVERLAP whatever its share
  scrollerDesktop: 900, // the card-scroll rule is `max-width: 900px`
};

/* ────────────────────────────────────────────────────────────────────────── */
/* CLI                                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

function usage() {
  console.log(`ui-probe — render-verification harness

  node scripts/ui-probe.mjs [options]

  --base <url>         server to probe (default http://localhost:4321)
  --slug <s>           issue slug; repeatable or comma-separated; "home" = /
                       (default: every non-draft issue + home)
  --widths <a,b>       viewport widths (default 1280,375). <768 = phone profile
                       (DPR 2, mobile UA, touch, 812 tall); else DPR 1, 900 tall
  --out <dir>          output dir (default research/_ui/<YYYY-MM-DD>)
  --report             always exit 0 (report only)
  --no-home            skip the home page
  --no-serve           never start a dev server; fail if --base is down
  --no-shots           skip screenshots
  --concurrency <n>    pages in flight (default 2)
`);
}

function die(msg, code = 2) {
  console.error(`ui-probe: ${msg}`);
  process.exit(code);
}

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function parseArgs(argv) {
  const a = {
    base: 'http://localhost:4321',
    slugs: [],
    widths: [1280, 375],
    out: null,
    report: false,
    home: true,
    serve: true,
    shots: true,
    concurrency: 2,
  };
  const args = [];
  for (const x of argv) {
    const m = /^(--[a-z-]+)=(.*)$/.exec(x);
    if (m) args.push(m[1], m[2]);
    else args.push(x);
  }
  for (let i = 0; i < args.length; i++) {
    const k = args[i];
    const next = () => {
      const v = args[++i];
      if (v === undefined || v.startsWith('--')) die(`${k} needs a value`);
      return v;
    };
    switch (k) {
      case '--base': a.base = next().replace(/\/+$/, ''); break;
      case '--slug': a.slugs.push(...next().split(',').map((s) => s.trim()).filter(Boolean)); break;
      case '--widths': a.widths = next().split(',').map((s) => parseInt(s, 10)).filter((n) => n > 0); break;
      case '--out': a.out = next(); break;
      case '--report': a.report = true; break;
      case '--no-home': a.home = false; break;
      case '--no-serve': a.serve = false; break;
      case '--no-shots': a.shots = false; break;
      case '--concurrency': a.concurrency = Math.max(1, parseInt(next(), 10) || 1); break;
      case '-h': case '--help': usage(); process.exit(0); break;
      default: die(`unknown option ${k} (try --help)`);
    }
  }
  if (!a.widths.length) die('--widths parsed to nothing');
  a.out = path.resolve(ROOT, a.out || path.join('research', '_ui', today()));
  return a;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Environment                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

function findChrome() {
  const local = process.env.LOCALAPPDATA;
  const cands = [
    process.env.PX_CHROME,
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    local && path.join(local, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  return cands.find((p) => {
    try { return fs.statSync(p).isFile(); } catch { return false; }
  });
}

/* Every issue that renders publicly (status not `draft`: published and
   review). Shared with guard-render so "a full run" means the same set in
   both places. */
const publishedSlugs = () => renderedIssueSlugs(ROOT);

/* The render gate's stamp. Written after every completed run, clean or not:
   `blocking` is what the hook reads, so a failing run must overwrite an older
   clean one. `full` = no --slug, and every rendered issue at 1280 AND 375. */
function writeStamp(opts, pages, fingerprint, startedAt, blocking, totals, reportPath) {
  const slugs = pages.filter((p) => p !== 'home');
  const everyWidth = GATE_WIDTHS.every((w) => opts.widths.includes(w));
  const all = publishedSlugs();
  const stamp = {
    when: new Date().toISOString(),
    started: startedAt,
    base: opts.base,
    widths: opts.widths,
    slugs,
    home: pages.includes('home'),
    full: opts.slugs.length === 0 && everyWidth && all.every((s) => slugs.includes(s)),
    blocking,
    warnings: WARNING.reduce((s, t) => s + (totals[t] || 0), 0),
    report: path.relative(ROOT, reportPath).split(path.sep).join('/'),
    fingerprint,
  };
  try {
    fs.mkdirSync(path.dirname(STAMP), { recursive: true });
    fs.writeFileSync(STAMP, JSON.stringify(stamp, null, 2) + '\n');
    return stamp;
  } catch (e) {
    console.error(`ui-probe: could not write ${STAMP}: ${e.message}`);
    return null;
  }
}

function portOpen(host, port) {
  return new Promise((resolve) => {
    const s = net.connect({ host, port });
    const done = (v) => { s.destroy(); resolve(v); };
    s.setTimeout(2000, () => done(false));
    s.once('connect', () => done(true));
    s.once('error', () => done(false));
  });
}

async function httpOk(url, ms) {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(ms), redirect: 'manual' });
    return r.status > 0 && r.status < 500;
  } catch {
    return false;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ensureServer(opts) {
  const u = new URL(opts.base);
  const host = u.hostname === 'localhost' ? '127.0.0.1' : u.hostname;
  const port = Number(u.port || (u.protocol === 'https:' ? 443 : 80));
  const local = ['localhost', '127.0.0.1', '::1'].includes(u.hostname);

  let open = (await portOpen(host, port)) || (u.hostname === 'localhost' && (await portOpen('::1', port)));
  let child = null;
  if (!open) {
    if (!local || !opts.serve) die(`${opts.base} is not answering (start it with \`npm run dev\`)`);
    console.error(`ui-probe: nothing on ${opts.base}; starting \`astro dev --port ${port}\`…`);
    child = spawn('npx', ['astro', 'dev', '--port', String(port)], {
      cwd: ROOT,
      shell: process.platform === 'win32',
      detached: process.platform !== 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.stdout.on('data', () => {});
    child.stderr.on('data', () => {});
  }
  // The first request compiles the route; give it time.
  const t0 = Date.now();
  while (Date.now() - t0 < 90_000) {
    if (await httpOk(opts.base + '/', 30_000)) return child;
    await sleep(1500);
  }
  stopServer(child);
  die(`${opts.base} did not answer within 90 s`);
}

function stopServer(child) {
  if (!child || child.exitCode !== null) return;
  try {
    if (process.platform === 'win32') execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' });
    else process.kill(-child.pid, 'SIGTERM');
  } catch {
    /* already gone */
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Browser-side: scroll-through + the measurement pass                        */
/* (serialised by puppeteer — must stay self-contained)                       */
/* ────────────────────────────────────────────────────────────────────────── */

async function scrollThrough() {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const step = Math.max(200, Math.floor(window.innerHeight * 0.75));
  for (let y = 0; y < document.documentElement.scrollHeight + step; y += step) {
    window.scrollTo(0, y);
    await wait(70);
  }
  window.scrollTo(0, document.documentElement.scrollHeight);
  await wait(250);
  window.scrollTo(0, 0);
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
  await wait(120);
}

function measure(cfg) {
  const T = cfg.thresholds;
  const vw = window.innerWidth;
  const sy = window.scrollY;
  const out = { meta: {}, blocks: [], findings: [], scrollers: [], counts: { ellipsis: 0 } };

  /* ── helpers ─────────────────────────────────────────────────────────── */
  const r1 = (n) => Math.round(n * 10) / 10;
  const clsList = (el) => {
    const c = el && el.getAttribute ? el.getAttribute('class') : '';
    return c ? c.trim().split(/\s+/) : [];
  };
  const desc = (el) => {
    if (!el || !el.tagName) return '?';
    const c = clsList(el).filter((x) => !/^astro-/.test(x)).slice(0, 2);
    return el.tagName.toLowerCase() + (c.length ? '.' + c.join('.') : el.id ? '#' + el.id : '');
  };
  const snip = (t) => {
    t = (t || '').replace(/\s+/g, ' ').trim();
    return t.length > 60 ? t.slice(0, 59) + '…' : t;
  };
  const isSvg = (el) => el instanceof SVGElement;
  const csMemo = new Map();
  const cs = (el) => {
    let s = csMemo.get(el);
    if (!s) { s = getComputedStyle(el); csMemo.set(el, s); }
    return s;
  };
  const R = (r) => ({ l: r.left, t: r.top, r: r.right, b: r.bottom });
  const inter = (a, b) => {
    const w = Math.min(a.r, b.r) - Math.max(a.l, b.l);
    const h = Math.min(a.b, b.b) - Math.max(a.t, b.t);
    return w > 0 && h > 0 ? w * h : 0;
  };
  const interBox = (a, b) => ({ l: Math.max(a.l, b.l), t: Math.max(a.t, b.t), r: Math.min(a.r, b.r), b: Math.min(a.b, b.b) });
  const union = (rs) =>
    rs.reduce((u, r) => (u ? { l: Math.min(u.l, r.l), t: Math.min(u.t, r.t), r: Math.max(u.r, r.r), b: Math.max(u.b, r.b) } : { l: r.l, t: r.t, r: r.r, b: r.b }), null);
  const area = (r) => Math.max(0, r.r - r.l) * Math.max(0, r.b - r.t);
  const paddingBox = (el) => {
    const r = el.getBoundingClientRect();
    const s = cs(el);
    return {
      l: r.left + (parseFloat(s.borderLeftWidth) || 0),
      r: r.right - (parseFloat(s.borderRightWidth) || 0),
      t: r.top + (parseFloat(s.borderTopWidth) || 0),
      b: r.bottom - (parseFloat(s.borderBottomWidth) || 0),
    };
  };
  const NONRENDER = 'defs,clipPath,mask,symbol,marker,pattern,linearGradient,radialGradient,filter,title,desc,metadata,style,script,template,noscript';

  /* Back-facing flip-card faces (components-3d.css .px3d-face--back), and
     screen-reader-only boxes (the `position:absolute; 1px; overflow:hidden;
     clip: rect(0 0 0 0)` pattern several components use for their data
     notes) — neither is on screen, so neither can overlap or be clipped. */
  const awayRoots = [];
  const srRoots = [];
  document.querySelectorAll('body *').forEach((el) => {
    const st = cs(el);
    if (st.position === 'absolute' || st.position === 'fixed') {
      const zeroClip = /^rect\(\s*0(px)?[\s,]+0(px)?[\s,]+0(px)?[\s,]+0(px)?\s*\)$/.test(st.clip || '');
      const inset = /^inset\(\s*50%/.test(st.clipPath || '');
      let tiny = false;
      if (!zeroClip && !inset && st.overflow !== 'visible') {
        const r = el.getBoundingClientRect();
        tiny = r.width <= 1.5 && r.height <= 1.5;
      }
      if (zeroClip || inset || tiny) srRoots.push(el);
    }
    if (st.backfaceVisibility !== 'hidden') return;
    let sign = 1;
    for (let x = el; x && x !== document.documentElement; x = x.parentElement) {
      const t = cs(x).transform;
      if (t && t !== 'none') {
        try { if (new DOMMatrix(t).m11 < 0) sign = -sign; } catch (e) { /* unparsable */ }
      }
    }
    if (sign < 0) awayRoots.push(el);
  });

  const visMemo = new Map();
  const visible = (el) => {
    if (visMemo.has(el)) return visMemo.get(el);
    let v = true;
    if (el.closest(NONRENDER)) v = false;
    else if (el.checkVisibility) {
      v = el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true, opacityProperty: true, visibilityProperty: true });
    } else {
      const s = cs(el);
      v = s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0;
    }
    if (v && !isSvg(el) && el.closest('[aria-hidden="true"]')) v = false;
    if (v && awayRoots.length && awayRoots.some((a) => a.contains(el))) v = false;
    if (v && srRoots.length && srRoots.some((a) => a.contains(el))) v = false;
    visMemo.set(el, v);
    return v;
  };

  /* Clip imposed on an element by its ancestors (not itself), up to <body>.
     `box` counts every non-visible overflow (what is on screen right now);
     `hard` counts only hidden/clip (what no scrolling can reveal); `sx` is
     the nearest horizontal scroller, if any. */
  const INF = { l: -1e9, t: -1e9, r: 1e9, b: 1e9 };
  const clipMemo = new Map();
  const clipOf = (el) => {
    if (clipMemo.has(el)) return clipMemo.get(el);
    const p = el.parentElement;
    let res;
    if (!p || p === document.body || p === document.documentElement) res = { box: INF, hard: INF, sx: null };
    else {
      const up = clipOf(p);
      const s = cs(p);
      let box = up.box;
      let hard = up.hard;
      let sx = up.sx;
      const ox = s.overflowX;
      const oy = s.overflowY;
      if (ox !== 'visible' || oy !== 'visible') {
        const pb = paddingBox(p);
        const cut = (bx, cx, cy) => ({
          l: cx ? Math.max(bx.l, pb.l) : bx.l,
          r: cx ? Math.min(bx.r, pb.r) : bx.r,
          t: cy ? Math.max(bx.t, pb.t) : bx.t,
          b: cy ? Math.min(bx.b, pb.b) : bx.b,
        });
        const hardX = ox === 'hidden' || ox === 'clip';
        const hardY = oy === 'hidden' || oy === 'clip';
        box = cut(box, ox !== 'visible', oy !== 'visible');
        hard = cut(hard, hardX, hardY);
        if (ox === 'auto' || ox === 'scroll') sx = sx || p;
      }
      res = { box, hard, sx };
    }
    clipMemo.set(el, res);
    return res;
  };
  const effRect = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return null;
    const e = interBox(R(r), clipOf(el).box);
    // A zero-height horizontal SVG line keeps its extent; anything else that
    // clips to nothing is not on screen.
    if (e.r - e.l < 0 || e.b - e.t < 0) return null;
    if (e.r - e.l === 0 && e.b - e.t === 0) return null;
    return e;
  };

  /* Text-bearing leaf: an HTML element with a non-whitespace direct text
     node (measured by its text line boxes), or SVG text/tspan with one. */
  const hasDirectText = (el) => {
    for (const n of el.childNodes) if (n.nodeType === 3 && n.nodeValue.trim()) return true;
    return false;
  };
  const textOf = (el) => {
    let t = '';
    for (const n of el.childNodes) if (n.nodeType === 3) t += n.nodeValue;
    return t;
  };
  const textRects = (el) => {
    if (isSvg(el)) {
      const r = el.getBoundingClientRect();
      return r.width > 0.5 && r.height > 0.5 ? [R(r)] : [];
    }
    const rs = [];
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.nodeValue.trim()) continue;
      const rg = document.createRange();
      rg.selectNodeContents(n);
      for (const r of rg.getClientRects()) if (r.width > 0.5 && r.height > 0.5) rs.push(R(r));
    }
    return rs;
  };
  /* INK BANDS. A text line box is the font's full ascent + descent, which on
     a 70px numeral reaches ~20px above the digits' tops. Two labels stacked
     tight (an eyebrow over a big number, a unit under a dial value) then
     "overlap" by 50% with clear air between the glyphs. So OVERLAP, TOUCH,
     CHIP and the vertical CLIP test use the INK band instead: the line box
     inset by the share of it the glyphs actually leave empty, from canvas
     measureText on the same font and the same (case-transformed) string.
     Expressed as a share of the box, it holds for SVG text at any scale. */
  const ctx2d = document.createElement('canvas').getContext('2d');
  const inkMemo = new Map();
  const inkShare = (el, text) => {
    const st = cs(el);
    let t = text || 'x';
    if (st.textTransform === 'uppercase') t = t.toUpperCase();
    else if (st.textTransform === 'lowercase') t = t.toLowerCase();
    const font = `${st.fontStyle} ${st.fontWeight} ${st.fontSize} ${st.fontFamily}`;
    const key = font + '|' + t;
    if (inkMemo.has(key)) return inkMemo.get(key);
    let res = [0, 0];
    try {
      ctx2d.font = font;
      const m = ctx2d.measureText(t);
      const fA = m.fontBoundingBoxAscent;
      const fD = m.fontBoundingBoxDescent;
      const H = fA + fD;
      if (H > 0) {
        res = [Math.min(0.45, Math.max(0, (fA - m.actualBoundingBoxAscent) / H)), Math.min(0.45, Math.max(0, (fD - m.actualBoundingBoxDescent) / H))];
      }
    } catch (e) { /* keep the line box */ }
    inkMemo.set(key, res);
    return res;
  };
  const inkOf = (el, rects, text) => {
    const [iT, iB] = inkShare(el, text);
    return rects.map((r) => {
      const h = r.b - r.t;
      return { l: r.l, r: r.r, t: r.t + h * iT, b: r.b - h * iB };
    });
  };
  const blockOfLeaf = (el) => {
    for (let a = el; a; a = a.parentElement) {
      if (isSvg(a)) { if (a.tagName.toLowerCase() === 'text') return a; continue; }
      const d = cs(a).display;
      if (d !== 'inline' && d !== 'contents') return a;
    }
    return null;
  };
  const leavesIn = (root) => {
    const res = [];
    const cand = root.querySelectorAll('*');
    for (const el of cand) {
      if (isSvg(el)) {
        const tn = el.tagName.toLowerCase();
        if (tn !== 'text' && tn !== 'tspan') continue;
      }
      if (!hasDirectText(el) || !visible(el)) continue;
      const rects = textRects(el);
      if (!rects.length) continue;
      const u = union(rects);
      // text wholly cut away by a hidden/clip box is not on screen (text a
      // scroller has merely scrolled out of view still is)
      if (inter(u, clipOf(el).hard) === 0) continue;
      const text = textOf(el).replace(/\s+/g, ' ').trim();
      const ink = inkOf(el, rects, text);
      res.push({ el, rects, u, ink, iu: union(ink), a: ink.reduce((s, r) => s + area(r), 0), text, blk: blockOfLeaf(el) });
    }
    return res;
  };

  /* ── FRAME: the honest overflow test (AGENTS.md §8) ───────────────────── */
  window.scrollTo(9999, sy);
  const sxAfter = window.scrollX;
  const sw = document.documentElement.scrollWidth;
  window.scrollTo(0, sy);
  const honest = { scrollX: sxAfter, scrollWidth: sw, innerWidth: vw, pass: sxAfter === 0 && sw <= vw };
  out.meta.honest = honest;
  out.meta.innerWidth = vw;
  out.meta.innerHeight = window.innerHeight;
  out.meta.dpr = window.devicePixelRatio;
  out.meta.docHeight = document.documentElement.scrollHeight;
  out.meta.literata = Array.from(document.fonts).filter((f) => /Literata/i.test(f.family) && f.status === 'loaded').length;
  out.meta.gate = { present: !!document.querySelector('.px-gate'), hidden: document.querySelectorAll('.px-gate-hidden').length };

  const outermost = (set, stopAt) => {
    // set: Map el -> data. Returns [{el, data, inside}] where no ancestor (below stopAt) is in the set.
    const res = new Map();
    for (const el of set.keys()) {
      let top = el;
      for (let a = el.parentElement; a && a !== stopAt; a = a.parentElement) if (set.has(a)) top = a;
      if (!res.has(top)) res.set(top, { el: top, data: set.get(top), inside: 0 });
      if (top !== el) res.get(top).inside++;
    }
    return [...res.values()];
  };

  if (!honest.pass) {
    const past = new Map();
    for (const el of document.body.querySelectorAll('*')) {
      if (!visible(el)) continue;
      const e = effRect(el);
      if (!e) continue;
      if (e.r > vw + 1) past.set(el, { over: e.r - vw });
      else if (e.l < -1) past.set(el, { over: -e.l, left: true });
    }
    const tops = outermost(past, document.body).sort((a, b) => b.data.over - a.data.over).slice(0, 10);
    const blkOf = (el) => {
      const s = el.closest && el.closest('.px-section');
      return s ? { nn: s.id && /^sec-(\d+)$/.test(s.id) ? s.id.slice(4).padStart(2, '0') : '??', kind: s.dataset.kind || '?', layout: s.dataset.layout || 'default' } : null;
    };
    if (!tops.length) {
      out.findings.push({ type: 'FRAME', nn: '--', kind: 'page', layout: '', desc: `page scrolls sideways (scrollX ${r1(sxAfter)}, scrollWidth ${sw} > ${vw}); no single element found past the viewport`, px: sw - vw });
    }
    for (const t of tops) {
      const b = blkOf(t.el) || { nn: '--', kind: 'page', layout: '' };
      out.findings.push({
        type: 'FRAME', nn: b.nn, kind: b.kind, layout: b.layout,
        desc: `${desc(t.el)} runs ${r1(t.data.over)}px past the ${t.data.left ? 'left' : 'right'} edge of the ${vw}px viewport${t.inside ? ` (+${t.inside} inside)` : ''} — page scrollWidth ${sw}`,
        px: r1(t.data.over), el: desc(t.el),
      });
    }
  }

  /* ── blocks ───────────────────────────────────────────────────────────── */
  let colBox;
  let frameBox;
  const wrap = document.querySelector('.px-wrap');
  frameBox = wrap ? paddingBox(wrap) : { l: 0, r: vw, t: -1e9, b: 1e9 };
  frameBox = { l: Math.max(0, frameBox.l), r: Math.min(vw, frameBox.r), t: -1e9, b: 1e9 };

  const blocks = [];
  if (cfg.mode === 'issue') {
    const art = document.getElementById('px-article');
    if (!art) {
      out.findings.push({ type: 'HARNESS', nn: '--', kind: 'page', layout: '', desc: 'no #px-article on the page', px: null });
      return out;
    }
    const ab = paddingBox(art);
    colBox = { l: ab.l, r: ab.r, t: -1e9, b: 1e9 };
    const acs = cs(art);
    out.meta.column = {
      left: r1(ab.l), right: r1(ab.r), width: r1(ab.r - ab.l),
      measure: r1(ab.r - ab.l - (parseFloat(acs.paddingLeft) || 0) - (parseFloat(acs.paddingRight) || 0)),
    };
    const secs = [...art.querySelectorAll('.px-section')].filter((s) => !s.parentElement.closest('.px-section'));
    secs.forEach((s, i) => {
      const idm = /^sec-(\d+)$/.exec(s.id || '');
      const layout = s.dataset.layout || 'default';
      blocks.push({
        root: s, isSection: true,
        nn: (idm ? idm[1] : String(i + 1)).padStart(2, '0'),
        kind: s.dataset.kind || '?', layout,
        ref: colBox,
      });
    });
    blocks.push({ root: art, isSection: false, pseudo: true, nn: '--', kind: 'article', layout: '', ref: colBox });
  } else {
    colBox = frameBox;
    out.meta.column = { left: r1(frameBox.l), right: r1(frameBox.r), width: r1(frameBox.r - frameBox.l) };
    const cands = [...document.querySelectorAll(cfg.blockSel)].filter((el) => !el.parentElement.closest(cfg.blockSel));
    cands.forEach((el, i) => {
      const k = clsList(el).filter((c) => c !== 'px-band' && !/^px-band--/.test(c) && !/^astro-/.test(c))[0] || el.id || el.tagName.toLowerCase();
      blocks.push({ root: el, isSection: false, nn: String(i + 1).padStart(2, '0'), kind: k, layout: '', ref: colBox });
    });
  }
  const sectionRoots = new Map(blocks.filter((b) => !b.pseudo).map((b) => [b.root, b]));
  const blockOf = (el) => {
    for (let a = el; a; a = a.parentElement) {
      const b = sectionRoots.get(a);
      if (b) return b;
    }
    return blocks.find((b) => b.pseudo && b.root.contains(el)) || null;
  };
  const F = (type, b, d, px, extra) =>
    out.findings.push(Object.assign({ type, nn: b ? b.nn : '--', kind: b ? b.kind : 'page', layout: b ? b.layout : '', desc: d, px: px == null ? null : r1(px) }, extra || {}));

  /* ── per-block geometry record ────────────────────────────────────────── */
  for (const b of blocks) {
    if (b.pseudo) continue;
    const r = b.root.getBoundingClientRect();
    const numEl = b.root.querySelector(':scope > .px-section__num, :scope > .px-section__copy > .px-section__num');
    b.rec = {
      nn: b.nn, kind: b.kind, layout: b.layout,
      number: numEl ? numEl.textContent.trim() : null,
      left: r1(r.left - colBox.l), right: r1(colBox.r - r.right), width: r1(r.width), height: r1(r.height),
      doc: { x: r1(r.left + window.scrollX), y: r1(r.top + sy), w: r1(r.width), h: r1(r.height) },
    };
    out.blocks.push(b.rec);
  }

  /* ── COLUMN ───────────────────────────────────────────────────────────── */
  const scope = cfg.mode === 'issue' ? document.getElementById('px-article') : null;
  const scopeEls = scope ? scope.querySelectorAll('*') : blocks.flatMap((b) => [b.root, ...b.root.querySelectorAll('*')]);
  const crossing = new Map(); // block -> Map(el -> data)
  for (const el of scopeEls) {
    if (!visible(el)) continue;
    const b = blockOf(el);
    if (!b) continue;
    const e = effRect(el);
    if (!e) continue;
    const oL = b.ref.l - e.l;
    const oR = e.r - b.ref.r;
    if (oL > T.col || oR > T.col) {
      if (!crossing.has(b)) crossing.set(b, new Map());
      crossing.get(b).set(el, { oL, oR });
    }
    // A horizontal scroller that actually scrolls, where no scroller is designed.
    const s = cs(el);
    if ((s.overflowX === 'auto' || s.overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
      const rec = { nn: b.nn, kind: b.kind, el: desc(el), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
      // Issue article only: the home page's wire strip is a designed scroller.
      if (vw > T.scrollerDesktop && cfg.mode === 'issue') {
        F('COLUMN', b, `${desc(el)} scrolls sideways at ${vw}px: ${el.scrollWidth}px of content in a ${el.clientWidth}px box`, el.scrollWidth - el.clientWidth, { el: desc(el) });
      } else out.scrollers.push(rec);
    }
  }
  for (const [b, set] of crossing) {
    for (const t of outermost(set, b.pseudo ? b.root : b.root.parentElement)) {
      const { oL, oR } = t.data;
      const side = oL > oR ? 'left' : 'right';
      const px = Math.max(oL, oR);
      const ref = cfg.mode === 'issue' ? 'column rule' : 'frame';
      const txt = snip(t.el.textContent || '').slice(0, 40);
      F('COLUMN', b, `${desc(t.el)} crosses the ${side} ${ref} by ${r1(px)}px${t.inside ? ` (+${t.inside} inside)` : ''}${txt ? ` “${txt}”` : ''}`, px, { el: desc(t.el), inside: t.inside });
    }
  }

  /* ── per-block text passes: CLIP, OVERLAP, CHIP, TINY ─────────────────── */
  for (const b of blocks) {
    const allLeaves = leavesIn(b.root);
    const leaves = b.pseudo ? allLeaves.filter((l) => !l.el.closest('.px-section')) : allLeaves;

    // CLIP — text
    const clipGroups = new Map();
    for (const L of leaves) {
      for (let a = L.el; a; a = a.parentElement) {
        const s = cs(a);
        const ox = s.overflowX;
        const oy = s.overflowY;
        if (ox !== 'visible' || oy !== 'visible') {
          const pb = paddingBox(a);
          let over = 0;
          let axis = '';
          if (ox === 'hidden' || ox === 'clip') {
            const o = Math.max(pb.l - L.u.l, L.u.r - pb.r);
            if (o > T.clip && o > over) { over = o; axis = 'x'; }
          }
          if (oy !== 'visible') {
            const o = Math.max(pb.t - L.iu.t, L.iu.b - pb.b);
            if (o > T.clip && o > over) { over = o; axis = oy === 'auto' || oy === 'scroll' ? 'y (scroller)' : 'y'; }
          }
          if (over > 0) {
            const ell = s.textOverflow === 'ellipsis' || cs(L.el).textOverflow === 'ellipsis' || (s.webkitLineClamp && s.webkitLineClamp !== 'none');
            if (ell && axis !== 'y (scroller)') { out.counts.ellipsis++; break; }
            if (!clipGroups.has(a)) clipGroups.set(a, { anc: a, over: 0, n: 0, ex: [], axis });
            const g = clipGroups.get(a);
            g.n++;
            if (over > g.over) { g.over = over; g.axis = axis; }
            if (g.ex.length < 2) g.ex.push(snip(L.text));
            break;
          }
        }
        if (a === b.root) break;
      }
    }
    // CLIP — graphics
    for (const el of b.root.querySelectorAll('svg, img, canvas')) {
      if (isSvg(el) && el.ownerSVGElement) continue; // outer svg only
      if (b.pseudo && el.closest('.px-section')) continue;
      if (!visible(el)) continue;
      const r = R(el.getBoundingClientRect());
      if (area(r) === 0) continue;
      for (let a = el.parentElement; a && a !== b.root.parentElement; a = a.parentElement) {
        const s = cs(a);
        const hx = s.overflowX === 'hidden' || s.overflowX === 'clip';
        const hy = s.overflowY === 'hidden' || s.overflowY === 'clip';
        if (!hx && !hy) continue;
        const pb = paddingBox(a);
        const o = Math.max(hx ? Math.max(pb.l - r.l, r.r - pb.r) : 0, hy ? Math.max(pb.t - r.t, r.b - pb.b) : 0);
        if (o > T.clip) {
          F('CLIP', b, `graphic ${desc(el)} cut by ${desc(a)} (overflow ${s.overflowX}/${s.overflowY}) by ${r1(o)}px`, o, { el: desc(el), anc: desc(a) });
          break;
        }
      }
    }
    for (const g of clipGroups.values()) {
      const what = isSvg(g.anc) ? `its <svg> ${desc(g.anc)}` : `${desc(g.anc)} (overflow ${cs(g.anc).overflowX}/${cs(g.anc).overflowY})`;
      F('CLIP', b, `${g.n} text lea${g.n > 1 ? 'ves' : 'f'} cut on ${g.axis} by ${what}: “${g.ex.join('” · “')}”`, g.over, { anc: desc(g.anc), n: g.n });
    }

    // OVERLAP (ink bands) and TOUCH (two runs from different blocks meeting
    // on one line with no gap: "FEB 18 2025Earth-impact odds…")
    const n = leaves.length;
    const touched = [];
    for (let i = 0; i < n; i++) {
      const A = leaves[i];
      for (let j = i + 1; j < n; j++) {
        const B = leaves[j];
        if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
        // quick reject, with the TOUCH margin
        if (A.iu.r + T.touch < B.iu.l || B.iu.r + T.touch < A.iu.l || A.iu.b < B.iu.t || B.iu.b < A.iu.t) continue;
        let I = 0;
        let cross = null; // the largest single ink-on-ink crossing
        for (const ra of A.ink) {
          for (const rb of B.ink) {
            const w = Math.min(ra.r, rb.r) - Math.max(ra.l, rb.l);
            const h = Math.min(ra.b, rb.b) - Math.max(ra.t, rb.t);
            if (w > 0 && h > 0) {
              I += w * h;
              if (!cross || w * h > cross.w * cross.h) cross = { w, h };
            }
          }
        }
        const small = Math.min(A.a, B.a);
        const halo = A.text === B.text && Math.abs(A.u.l - B.u.l) < 2 && Math.abs(A.u.t - B.u.t) < 2;
        // Blocking when the crossing is >25% of the smaller text's ink, OR
        // when glyph bands cross by more than T.cross in BOTH axes: a label
        // printed over one line of a long annotation is a small share of the
        // annotation and still a collision (the token-bill scaling plot).
        const shareHit = small > 0 && I / small > T.overlap;
        const crossHit = cross && cross.w > T.cross && cross.h > T.cross;
        if (shareHit || crossHit) {
          if (halo) continue;
          F('OVERLAP', b, `“${snip(A.text)}” (${desc(A.el)}) over “${snip(B.text)}” (${desc(B.el)}) — ${Math.round((I / small) * 100)}% of the smaller, glyphs cross ${r1(cross.w)}×${r1(cross.h)}px`, Math.sqrt(I), { a: snip(A.text), b: snip(B.text), share: r1(I / small) });
          continue;
        }
        if (halo || !A.blk || !B.blk || A.blk === B.blk) continue;
        // Side by side on one line (ink bands share half the shorter height),
        // or stacked (ink bands share >2px of width) — glyphs of two separate
        // blocks closer than T.touch, or crossing by less than the OVERLAP
        // share. Lines of one paragraph are one block and never compared.
        let hit = null;
        for (const ra of A.ink) {
          for (const rb of B.ink) {
            const vh = Math.min(ra.b, rb.b) - Math.max(ra.t, rb.t);
            const hw = Math.min(ra.r, rb.r) - Math.max(ra.l, rb.l);
            if (vh >= 0.5 * Math.min(ra.b - ra.t, rb.b - rb.t)) {
              const gap = Math.max(rb.l - ra.r, ra.l - rb.r);
              if (gap < T.touch) { hit = { gap, how: 'side by side' }; break; }
            } else if (hw > 2) {
              const gap = Math.max(rb.t - ra.b, ra.t - rb.b);
              if (gap < T.touch) { hit = { gap, how: 'stacked' }; break; }
            }
          }
          if (hit) break;
        }
        if (hit) touched.push({ A, B, gap: hit.gap, how: hit.how });
      }
    }
    if (touched.length) {
      const ex = touched.slice(0, 3).map((t) => `“${snip(t.A.text).slice(0, 28)}” | “${snip(t.B.text).slice(0, 28)}” (${t.how}, ${t.gap < 0 ? `crossing ${r1(-t.gap)}px` : `${r1(t.gap)}px apart`})`);
      F('TOUCH', b, `${touched.length} pair${touched.length > 1 ? 's' : ''} of text runs from separate blocks with no air between their glyphs: ${ex.join(' · ')}`, Math.min(...touched.map((t) => t.gap)), { n: touched.length });
    }

    // CHIP — the ⤢ study button over the caption chip, or over any text
    const btns = [...b.root.querySelectorAll('.px-vexp')].filter((x) => visible(x) && (!b.pseudo || !x.closest('.px-section')));
    for (const btn of btns) {
      const br = R(btn.getBoundingClientRect());
      // The chip is a filled box: any overlap shows. A text line box carries
      // side bearings and can graze the button by a pixel without a glyph
      // touching it, so plain text needs more than T.chipText.
      const hit = (r, tol = T.chip) => {
        const w = Math.min(r.r, br.r) - Math.max(r.l, br.l);
        const h = Math.min(r.b, br.b) - Math.max(r.t, br.t);
        return w > tol && h > tol ? { w, h } : null;
      };
      const card = btn.parentElement;
      let chipHit = false;
      for (const chip of card.querySelectorAll('.px-viz__cap b')) {
        if (!visible(chip)) continue;
        const h = hit(R(chip.getBoundingClientRect()));
        if (h) {
          chipHit = true;
          F('CHIP', b, `caption chip “${snip(chip.textContent)}” sits under the ⤢ button (${r1(h.w)}×${r1(h.h)}px) in ${desc(card)}`, h.w, { el: desc(chip) });
        }
      }
      for (const L of leaves) {
        if (chipHit && L.el.closest('.px-viz__cap b')) continue;
        if (btn.contains(L.el)) continue;
        for (const r of L.ink) {
          const h = hit(r, T.chipText);
          if (h) {
            F('CHIP', b, `text “${snip(L.text)}” (${desc(L.el)}) sits under the ⤢ button (${r1(h.w)}×${r1(h.h)}px)`, h.w, { el: desc(L.el) });
            break;
          }
        }
      }
    }

    // TINY
    const tiny = [];
    for (const L of leaves) {
      if (isSvg(L.el)) {
        const h = L.u.b - L.u.t;
        if (h < T.tinySvg) {
          let est = null;
          try {
            const m = L.el.getScreenCTM();
            if (m) est = (parseFloat(cs(L.el).fontSize) || 0) * Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
          } catch (e) { /* no CTM */ }
          tiny.push({ t: snip(L.text).slice(0, 30), px: r1(h), how: `svg box ${r1(h)}px${est ? `, ≈${r1(est)}px type` : ''}` });
        }
      } else {
        const f = parseFloat(cs(L.el).fontSize);
        if (f < T.tinyHtml) tiny.push({ t: snip(L.text).slice(0, 30), px: r1(f), how: `${r1(f)}px` });
      }
    }
    if (tiny.length) {
      const min = Math.min(...tiny.map((x) => x.px));
      F('TINY', b, `${tiny.length} text lea${tiny.length > 1 ? 'ves' : 'f'} below legibility, e.g. ${tiny.slice(0, 3).map((x) => `“${x.t}” ${x.how}`).join(' · ')}`, min, { n: tiny.length });
    }
  }

  /* ── section-only passes: CHROME, ALIGN, EMPTY ────────────────────────── */
  const CHROME_CLASSES = ['px-section__num', 'px-eyebrow', 'px-section__title', 'px-section__intro', 'px-viz__how', 'px-section__claim', 'px-plain', 'px-section__copy'];
  const isChrome = (el) => clsList(el).some((c) => CHROME_CLASSES.includes(c));
  const colL = colBox.l;
  for (const b of blocks) {
    if (!b.isSection) continue;
    const sec = b.root;

    // CHROME
    const vis = (sel, not) => [...sec.querySelectorAll(sel)].filter((e) => (!not || !e.matches(not)) && visible(e) && area(R(e.getBoundingClientRect())) > 0);
    const caps = vis("[class$='__cap'], [class$='__caption'], .px-section__claim", '.vb__cap, .px-seats__caption');
    const srcs = vis(".px-plain__src, [class$='__src'], [class$='__source']");
    const hows = vis('.px-viz__how, .px-viz__how--section');
    const dup = [];
    if (caps.length > 1) dup.push(`${caps.length} captions (${caps.map(desc).join(', ')})`);
    if (srcs.length > 1) dup.push(`${srcs.length} source lines (${srcs.map(desc).join(', ')})`);
    if (hows.length > 1) dup.push(`${hows.length} how-to-read panels (${hows.map(desc).join(', ')})`);
    if (dup.length) F('CHROME', b, `duplicate-chrome: ${dup.join('; ')}`, null);
    b.rec.chrome = { captions: caps.length, sources: srcs.length, how: hows.length };

    // ALIGN
    const items = [];
    const addKids = (parent, depth) => {
      for (const c of parent.children) {
        const s = cs(c);
        if (s.display === 'contents') { addKids(c, depth); continue; }
        if (s.display === 'inline' || s.position === 'absolute' || s.position === 'fixed') continue;
        if (!visible(c)) continue;
        const r = c.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue;
        items.push({ el: c, r: R(r) });
        if (depth === 0 && (c.classList.contains('px-section__copy') || c.classList.contains('px-section__stage'))) addKids(c, 1);
      }
    };
    addKids(sec, 0);
    const secR = R(sec.getBoundingClientRect());
    const secW = secR.r - secR.l;
    /* Hairlines: a ruled child ONE level inside a figure root that spans most
       of the section (a card's header rule, a table's top rule). Deeper
       structure is the component's own drawing (a depth ruler, a centred
       pitch) and makes no alignment claim. */
    const ruled = (w, st, col) => parseFloat(w) >= 0.5 && st !== 'none' && st !== 'hidden' && !/rgba\([^)]*,\s*0\)$/.test(col) && col !== 'transparent';
    for (const root of items.filter((it) => !isChrome(it.el)).map((it) => it.el)) {
      for (const el of root.children) {
        if (items.some((x) => x.el === el)) continue;
        const s = cs(el);
        if (!(ruled(s.borderTopWidth, s.borderTopStyle, s.borderTopColor) || ruled(s.borderBottomWidth, s.borderBottomStyle, s.borderBottomColor))) continue;
        if (s.position === 'absolute' || s.position === 'fixed' || !visible(el) || clipOf(el).sx) continue;
        const r = R(el.getBoundingClientRect());
        if (r.r - r.l < 0.85 * secW) continue;
        items.push({ el, r, hair: true });
      }
    }
    const hasBox = (el) => {
      const s = cs(el);
      const edge = ['Top', 'Right', 'Bottom', 'Left'].some((k) => parseFloat(s[`border${k}Width`]) >= 0.5 && s[`border${k}Style`] !== 'none');
      const bg = s.backgroundColor && s.backgroundColor !== 'transparent' && !/rgba\([^)]*,\s*0\)$/.test(s.backgroundColor);
      return edge || bg;
    };
    const boxed = (it) => it.hair || hasBox(it.el) || !isChrome(it.el);
    const copy = sec.querySelector(':scope > .px-section__copy');
    const stage = sec.querySelector(':scope > .px-section__stage');
    let groups = [{ name: '', items }];
    if (copy && stage) {
      const cr = copy.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      if (cr.right <= sr.left + 1 || sr.right <= cr.left + 1) {
        const inCol = (it, box) => {
          const c = (it.r.l + it.r.r) / 2;
          return c >= box.left && c <= box.right;
        };
        groups = [
          { name: 'copy ', items: items.filter((it) => inCol(it, cr)) },
          { name: 'stage ', items: items.filter((it) => inCol(it, sr)) },
        ];
      }
    }
    const fmt = (arr, key) => {
      // report the outliers against the most common edge
      const vals = arr.map((it) => ({ el: it.el, x: key(it) }));
      const modal = vals.map((v) => ({ x: v.x, n: vals.filter((w) => Math.abs(w.x - v.x) <= 1).length })).sort((a, c) => c.n - a.n)[0].x;
      const off = vals.filter((v) => Math.abs(v.x - modal) > T.align).slice(0, 5);
      return `${r1(modal - colL)}px (${off.map((v) => `${desc(v.el)}@${r1(v.x - colL)}`).join(', ')})`;
    };
    /* Two edge sets per column group, compared separately, because a layout
       may legitimately put them at different widths (`wide`: the figure at
       the 860 column, the text at the 720 measure — layout-v2.css). TEXT =
       Section's chrome blocks; FIGURE = everything else plus full-ish
       hairlines inside it. Each set must share its own edges, and the figure
       must sit symmetrically about the text column (flush, or centred, or
       breaking out equally on both sides). */
    const modalOf = (vals) => vals.map((x) => ({ x, n: vals.filter((w) => Math.abs(w - x) <= 1).length })).sort((a, c) => c.n - a.n)[0].x;
    const alignNotes = [];
    let alignPx = 0;
    const spread = (label, arr, key) => {
      if (arr.length < 2) return;
      const v = arr.map(key);
      const sp = Math.max(...v) - Math.min(...v);
      if (sp > T.align) {
        alignNotes.push(`${label} spread ${r1(sp)}px: most at ${fmt(arr, key)}`);
        alignPx = Math.max(alignPx, sp);
      }
    };
    for (const g of groups) {
      const text = g.items.filter((it) => !it.hair && isChrome(it.el));
      const fig = g.items.filter((it) => it.hair || !isChrome(it.el));
      spread(`${g.name}text left edges`, text, (it) => it.r.l);
      spread(`${g.name}text right edges (ruled/boxed)`, text.filter(boxed), (it) => it.r.r);
      spread(`${g.name}figure left edges`, fig, (it) => it.r.l);
      // A plain paragraph inside the figure (a follow-up line, a note) has a
      // ragged right edge by design; only ruled, boxed or drawn blocks count.
      const figR = fig.filter((it) => it.hair || !/^(p|h[1-6]|li|dt|dd|blockquote|figcaption)$/i.test(it.el.tagName) || hasBox(it.el));
      spread(`${g.name}figure right edges`, figR, (it) => it.r.r);
      if (text.length && fig.length) {
        const tL = modalOf(text.map((it) => it.r.l));
        const tb = text.filter(boxed);
        const tR = tb.length ? modalOf(tb.map((it) => it.r.r)) : secR.r - (tL - secR.l);
        const fL = modalOf(fig.map((it) => it.r.l));
        const fR = figR.length ? modalOf(figR.map((it) => it.r.r)) : modalOf(fig.map((it) => it.r.r));
        const oL = tL - fL;
        const oR = fR - tR;
        if (Math.abs(oL - oR) > T.align) {
          alignNotes.push(`${g.name}figure off-centre on the text column: text ${r1(tL - colL)}→${r1(tR - colL)}, figure ${r1(fL - colL)}→${r1(fR - colL)} (overhang ${r1(oL)} left, ${r1(oR)} right)`);
          alignPx = Math.max(alignPx, Math.abs(oL - oR));
        }
      }
    }
    if (alignNotes.length) F('ALIGN', b, alignNotes.join('; '), alignPx);

    // EMPTY
    if (!cfg.narrative.includes(b.kind)) {
      let h = 0;
      let what = '';
      if (stage && visible(stage)) { h = stage.getBoundingClientRect().height; what = 'stage'; }
      else {
        const g = [...sec.children].filter((c) => !isChrome(c) && visible(c)).map((c) => R(c.getBoundingClientRect())).filter((r) => area(r) > 0);
        const u = union(g);
        h = u ? u.b - u.t : 0;
        what = 'graphic';
      }
      b.rec.graphicHeight = r1(h);
      if (h < T.empty) F('EMPTY', b, `${what} is ${r1(h)}px tall — a ${b.kind} with no visible graphic`, h);
    }
  }

  return out;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Per-page job                                                               */
/* ────────────────────────────────────────────────────────────────────────── */

async function probe(browser, job, opts) {
  const phone = job.width < 768;
  const height = phone ? 812 : 900;
  const res = {
    page: job.page, url: job.url, width: job.width, ok: false, error: null,
    meta: {}, sections: [], findings: [], scrollers: [], counts: {},
    blocked: {}, pageErrors: [], screenshots: [],
  };
  const page = await browser.newPage();
  const baseOrigin = new URL(opts.base).origin;
  try {
    await page.setBypassServiceWorker(true);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    if (phone) await page.setUserAgent(MOBILE_UA);
    await page.setViewport({ width: job.width, height, deviceScaleFactor: phone ? 2 : 1, isMobile: phone, hasTouch: phone });
    // ReadingGate's isAuthed(): /sb-[^=;]*-auth-token(?:\.\d+)?=/ on document.cookie.
    await page.setCookie({ name: 'sb-probe-auth-token', value: '1', url: baseOrigin + '/' });
    // A signed-in, returning reader has seen the home intro overlay.
    await page.evaluateOnNewDocument(() => {
      try { localStorage.setItem('px_intro_seen_v1', '1'); } catch (e) { /* storage off */ }
    });
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      let u;
      try { u = new URL(req.url()); } catch { return req.abort('blockedbyclient'); }
      if (u.protocol === 'data:' || u.protocol === 'blob:') return req.continue();
      const m = req.method();
      const safe = m === 'GET' || m === 'HEAD';
      const same = u.origin === baseOrigin && !u.pathname.startsWith('/api/');
      const fonts = /^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
      if (safe && (same || fonts)) return req.continue();
      const key = `${m} ${u.origin}${u.pathname}`;
      res.blocked[key] = (res.blocked[key] || 0) + 1;
      return req.abort('blockedbyclient');
    });
    page.on('pageerror', (e) => { if (res.pageErrors.length < 5) res.pageErrors.push(String(e.message || e).slice(0, 200)); });

    const t0 = Date.now();
    const resp = await page.goto(job.url, { waitUntil: 'load', timeout: 180_000 });
    if (!resp || resp.status() >= 400) throw new Error(`HTTP ${resp ? resp.status() : 'no response'}`);
    await page.evaluate(() => {
      document.querySelectorAll('astro-dev-toolbar').forEach((e) => e.remove());
    });
    const viteErr = await page.evaluate(() => {
      const o = document.querySelector('vite-error-overlay');
      if (!o) return null;
      const msg = (o.shadowRoot && o.shadowRoot.querySelector('.message-body')) || null;
      o.remove();
      return msg ? msg.textContent.slice(0, 200) : 'vite error overlay present';
    });
    if (viteErr) res.findings.push({ type: 'HARNESS', nn: '--', kind: 'page', layout: '', desc: `Vite error overlay: ${viteErr}`, px: null });

    await page.evaluate(scrollThrough);
    await page.waitForNetworkIdle({ idleTime: 400, timeout: 20_000 }).catch(() => {});
    await page.evaluate(() => document.fonts.ready.then(() => true));
    // Reveal's 2 s safety net and VizMotion's 2.2 s count-up fallback.
    const elapsed = Date.now() - t0;
    if (elapsed < 2600) await sleep(2600 - elapsed);
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
      document.querySelectorAll('astro-dev-toolbar').forEach((e) => e.remove());
      window.scrollTo(0, 0);
      return new Promise((r) => setTimeout(r, 300));
    });

    const cfg = { mode: job.page === 'home' ? 'page' : 'issue', thresholds: THRESHOLDS, narrative: NARRATIVE, blockSel: 'header.mh, .px-band, footer' };
    const m = await page.evaluate(measure, cfg);

    res.meta = m.meta;
    res.sections = m.blocks;
    res.scrollers = m.scrollers;
    res.counts = m.counts;
    res.findings.push(...m.findings);

    if (cfg.mode === 'issue') {
      if (m.meta.gate && (m.meta.gate.present || m.meta.gate.hidden)) {
        res.findings.push({ type: 'HARNESS', nn: '--', kind: 'page', layout: '', desc: `reading gate still active (gate ${m.meta.gate.present ? 'present' : 'gone'}, ${m.meta.gate.hidden} hidden blocks) — the article was measured truncated`, px: null });
      }
      if (!m.blocks.length) res.findings.push({ type: 'HARNESS', nn: '--', kind: 'page', layout: '', desc: 'no .px-section found in #px-article', px: null });
    }
    if (m.meta.innerWidth !== job.width) {
      res.findings.push({ type: 'HARNESS', nn: '--', kind: 'page', layout: '', desc: `layout viewport is ${m.meta.innerWidth}px, expected ${job.width}px (meta viewport?)`, px: null });
    }
    if (!m.meta.literata) res.meta.fontWarning = 'Literata not loaded — measured on the fallback face';

    if (opts.shots) await shoot(page, job, res, opts);
    res.ok = true;
  } catch (e) {
    res.error = String(e && e.message ? e.message : e).slice(0, 300);
    res.findings.push({ type: 'HARNESS', nn: '--', kind: 'page', layout: '', desc: `probe failed: ${res.error}`, px: null });
  } finally {
    await page.close().catch(() => {});
  }
  for (const f of res.findings) f.severity = BLOCKING.includes(f.type) ? 'blocking' : 'warning';
  return res;
}

async function shoot(page, job, res, opts) {
  const dir = path.join(opts.out, job.page, String(job.width));
  fs.rmSync(dir, { recursive: true, force: true }); // stale clips from an earlier run
  fs.mkdirSync(dir, { recursive: true });
  /* Fixed chrome (the pinned reading toolbar, toasts, notices) is painted at
     its viewport position on every capture, across whatever section sits
     there. Hide it for the pictures only; it is never inside #px-article. */
  const doc = await page.evaluate(() => {
    const st = document.createElement('style');
    st.textContent = '[data-probe-hide]{visibility:hidden!important}';
    document.head.appendChild(st);
    document.querySelectorAll('body *').forEach((el) => {
      if (getComputedStyle(el).position === 'fixed') el.setAttribute('data-probe-hide', '');
    });
    return { w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight, dpr: window.devicePixelRatio };
  });
  const rel = (p) => path.relative(opts.out, p).split(path.sep).join('/');
  {
    // A phone page at DPR 2 runs past 30,000 device px, which Chrome will not
    // always capture; the full page is an overview, so take it at 1x when tall.
    const p = path.join(dir, 'full.png');
    let scale = doc.h * doc.dpr > 16000 ? 1 / doc.dpr : 1;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await page.screenshot({ path: p, clip: { x: 0, y: 0, width: doc.w, height: doc.h, scale }, captureBeyondViewport: true });
        res.screenshots.push(rel(p));
        if (scale !== 1) res.fullScale = scale;
        break;
      } catch (e) {
        if (attempt === 1) res.shotErrors = [...(res.shotErrors || []), `full.png: ${String(e.message || e).slice(0, 160)}`];
        scale = scale / 2;
      }
    }
  }
  if (job.page === 'home') return;
  for (const s of res.sections) {
    const pad = 24;
    const x = Math.max(0, Math.floor(s.doc.x - pad));
    const y = Math.max(0, Math.floor(s.doc.y - pad));
    const w = Math.min(doc.w, Math.ceil(s.doc.x + s.doc.w + pad)) - x;
    const h = Math.min(4000, Math.min(doc.h, Math.ceil(s.doc.y + s.doc.h + pad)) - y);
    if (w <= 0 || h <= 0) continue;
    const name = `${s.nn}-${String(s.kind).replace(/[^a-z0-9-]/gi, '')}-${s.layout || 'default'}.png`;
    const p = path.join(dir, name);
    try {
      await page.screenshot({ path: p, clip: { x, y, width: w, height: h }, captureBeyondViewport: true });
      res.screenshots.push(rel(p));
      s.shot = rel(p);
    } catch (e) {
      res.shotErrors = [...(res.shotErrors || []), `${name}: ${String(e.message || e).slice(0, 160)}`];
    }
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Report                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

function countBy(findings) {
  const c = Object.fromEntries(TYPES.map((t) => [t, 0]));
  for (const f of findings) c[f.type] = (c[f.type] || 0) + 1;
  return c;
}

function summaryTable(results) {
  const head = ['Page', 'Width', ...TYPES.map((t) => (BLOCKING.includes(t) ? t : t.toLowerCase())), 'Blocking'];
  const lines = [`| ${head.join(' | ')} |`, `|${head.map((h, i) => (i < 2 ? '---' : '--:')).join('|')}|`];
  const tot = Object.fromEntries(TYPES.map((t) => [t, 0]));
  let totB = 0;
  for (const r of results) {
    const c = countBy(r.findings);
    const b = BLOCKING.reduce((s, t) => s + c[t], 0);
    totB += b;
    TYPES.forEach((t) => (tot[t] += c[t]));
    lines.push(`| ${r.page} | ${r.width} | ${TYPES.map((t) => c[t] || '·').join(' | ')} | ${b ? `**${b}**` : '0'} |`);
  }
  lines.push(`| **total** | | ${TYPES.map((t) => tot[t] || '·').join(' | ')} | **${totB}** |`);
  return { md: lines.join('\n'), totals: tot, blocking: totB };
}

function writeReport(results, opts, extra) {
  const { md: table, totals, blocking } = summaryTable(results);
  const L = [];
  L.push(`# UI probe — ${extra.date}`);
  L.push('');
  L.push(`Base \`${opts.base}\` · widths ${opts.widths.join(', ')} · ${results.length} page renders · signed-in reader, reduced motion · Chrome ${extra.chromeVersion}`);
  L.push('');
  L.push(`**${blocking} blocking** (${BLOCKING.join(', ')}) · warnings: ${WARNING.map((t) => `${t} ${totals[t]}`).join(', ')}`);
  L.push('');
  L.push(table);
  L.push('');
  L.push('Blocking types first (UPPER CASE); warnings in lower case. Screenshots: `<slug>/<width>/full.png` and `<nn>-<kind>-<layout>.png` per section.');
  for (const r of results) {
    L.push('');
    L.push(`## ${r.page} @ ${r.width}`);
    const meta = [];
    if (r.meta && r.meta.column) meta.push(`column ${r.meta.column.width}px${r.meta.column.measure ? ` (measure ${r.meta.column.measure})` : ''}`);
    if (r.meta && r.meta.honest) meta.push(`honest overflow ${r.meta.honest.pass ? 'pass' : `FAIL (scrollX ${r.meta.honest.scrollX}, scrollWidth ${r.meta.honest.scrollWidth})`}`);
    if (r.sections && r.sections.length) meta.push(`${r.sections.length} sections`);
    if (r.scrollers && r.scrollers.length) meta.push(`${r.scrollers.length} card scroller${r.scrollers.length > 1 ? 's' : ''} (designed): ${r.scrollers.map((s) => `§${s.nn} ${s.el} ${s.scrollWidth}/${s.clientWidth}`).join(', ')}`);
    if (r.counts && r.counts.ellipsis) meta.push(`${r.counts.ellipsis} ellipsis-truncated text`);
    if (r.meta && r.meta.fontWarning) meta.push(`**${r.meta.fontWarning}**`);
    if (r.pageErrors && r.pageErrors.length) meta.push(`page errors: ${r.pageErrors.map((e) => `\`${e.slice(0, 90)}\``).join('; ')}`);
    if (r.fullScale) meta.push(`full.png captured at ${r.fullScale}x (page too tall for DPR ${r.meta.dpr})`);
    if (r.shotErrors && r.shotErrors.length) meta.push(`screenshot errors: ${r.shotErrors.join('; ')}`);
    if (meta.length) L.push(`_${meta.join(' · ')}_`);
    L.push('');
    if (!r.findings.length) { L.push('Clean.'); continue; }
    const order = (f) => TYPES.indexOf(f.type);
    const sorted = [...r.findings].sort((a, b) => order(a) - order(b) || String(a.nn).localeCompare(String(b.nn)));
    // Cap the per-type list per section so one broken chart cannot bury the rest.
    const seen = new Map();
    let hidden = 0;
    for (const f of sorted) {
      const k = `${f.type}|${f.nn}`;
      const n = (seen.get(k) || 0) + 1;
      seen.set(k, n);
      if (n > 8) { hidden++; continue; }
      const px = f.px == null ? '' : ` (${f.px}px)`;
      L.push(`- §${f.nn} ${f.kind}${f.layout ? `/${f.layout}` : ''} — ${f.type}${f.severity === 'warning' ? ' (warn)' : ''} — ${f.desc}${px}`);
    }
    if (hidden) L.push(`- … ${hidden} more (same type and section) in report.json`);
  }
  fs.mkdirSync(opts.out, { recursive: true });
  fs.writeFileSync(path.join(opts.out, 'report.md'), L.join('\n') + '\n');
  fs.writeFileSync(
    path.join(opts.out, 'report.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), base: opts.base, widths: opts.widths, chrome: extra.chromeVersion, thresholds: THRESHOLDS, blockingTypes: BLOCKING, warningTypes: WARNING, totals, blocking, results }, null, 2),
  );
  return { table, totals, blocking };
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Main                                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  /* Taken BEFORE anything renders, so an edit made during the run leaves the
     stamp describing the older tree, and guard-render calls it stale. */
  const startedAt = new Date().toISOString();
  const fingerprint = renderFingerprint(ROOT);
  const chrome = findChrome();
  if (!chrome) die('no Chrome found — set PX_CHROME to the chrome executable');

  let pages;
  if (opts.slugs.length) {
    const pub = new Set(publishedSlugs());
    pages = opts.slugs.map((s) => {
      if (s !== 'home' && !pub.has(s) && !fs.existsSync(path.join(ISSUES_DIR, s))) die(`no issue folder for slug "${s}"`);
      return s;
    });
  } else {
    pages = publishedSlugs();
    if (opts.home) pages.push('home');
  }
  const jobs = [];
  for (const p of pages) for (const w of opts.widths) jobs.push({ page: p, width: w, url: p === 'home' ? `${opts.base}/` : `${opts.base}/issues/${p}/` });

  const server = await ensureServer(opts);
  const cleanup = () => stopServer(server);
  process.on('SIGINT', () => { cleanup(); process.exit(130); });

  /* ONE browser per worker, one page at a time in each. Two pages in one
     browser make one of them a background page, and a background page never
     runs requestAnimationFrame and has its observers and timers throttled.
     Measured on the first trial: three tabs in one browser gave a protocol
     timeout and a failed capture. */
  const launch = () =>
    puppeteer.launch({
      executablePath: chrome,
      headless: true,
      protocolTimeout: 300_000,
      args: ['--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', '--mute-audio',
        '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding'],
    });
  const nWorkers = Math.min(opts.concurrency, jobs.length);
  const browsers = [];
  let chromeVersion = '?';
  const results = new Array(jobs.length);
  let done = 0;
  const report1 = (i, t, retry) => {
    const j = jobs[i];
    const c = countBy(results[i].findings);
    const b = BLOCKING.reduce((s, k) => s + c[k], 0);
    console.error(`  [${String(done).padStart(2)}/${jobs.length}]${retry ? ' retry' : ''} ${j.page} @ ${j.width}: ${b} blocking, ${results[i].findings.length - b} warn (${((Date.now() - t) / 1000).toFixed(1)}s)`);
  };
  try {
    for (let k = 0; k < nWorkers; k++) browsers.push(await launch());
    chromeVersion = (await browsers[0].version()).replace(/^HeadlessChrome\//, '');
    let next = 0;
    const worker = async (browser) => {
      while (next < jobs.length) {
        const i = next++;
        const t = Date.now();
        results[i] = await probe(browser, jobs[i], opts);
        done++;
        report1(i, t, false);
      }
    };
    await Promise.all(browsers.map(worker));
    // A failed load (a dev-server compile stall, a crashed renderer) gets one
    // more try on its own before it is reported as a HARNESS finding.
    for (let i = 0; i < jobs.length; i++) {
      if (!results[i].error) continue;
      const t = Date.now();
      const again = await probe(browsers[0], jobs[i], opts);
      if (!again.error) { results[i] = again; report1(i, t, true); }
    }
  } finally {
    await Promise.all(browsers.map((b) => b.close().catch(() => {})));
    cleanup();
  }

  const { table, totals, blocking } = writeReport(results, opts, { date: today(), chromeVersion });
  console.log('');
  console.log(table);
  console.log('');
  console.log(`${blocking} blocking · ${WARNING.map((t) => `${t.toLowerCase()} ${totals[t]}`).join(' · ')}`);
  console.log(`report: ${path.relative(ROOT, path.join(opts.out, 'report.md')).split(path.sep).join('/')}`);
  const stamp = writeStamp(opts, pages, fingerprint, startedAt, blocking, totals, path.join(opts.out, 'report.md'));
  if (stamp) console.log(`stamp: ${path.relative(ROOT, STAMP).split(path.sep).join('/')} (${stamp.full ? 'full' : 'scoped'} run, fingerprint ${fingerprint.slice(0, 12)})`);
  process.exit(blocking && !opts.report ? 1 : 0);
}

main().catch((e) => die(e && e.stack ? e.stack : String(e)));
