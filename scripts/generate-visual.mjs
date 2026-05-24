#!/usr/bin/env node
/**
 * Parallax visual generator.
 *
 * Reads the prompt file at src/content/issues/<slug>/og-prompt.txt,
 * calls fal.ai Flux 1.1 Pro exactly once, writes public/og/<slug>.png,
 * and appends an entry to research/_visual/ledger.jsonl.
 *
 * Usage:
 *   node scripts/generate-visual.mjs --slug 2026-05-15-seven-appeals-rupee-pressure
 *   node scripts/generate-visual.mjs --slug <slug> --dry-run
 *   node scripts/generate-visual.mjs --slug <slug> --force
 *
 * Flags:
 *   --slug <slug>   Required. Issue directory name under src/content/issues/.
 *   --dry-run       Write a grey placeholder PNG, no API call. Env
 *                   var FAL_DRY_RUN=1 has the same effect.
 *   --force         Bypass the daily $2.00 ledger cap.
 *   --help          Print usage and exit.
 *
 * Exit codes:
 *   0  success
 *   1  usage error
 *   2  content-policy or moderation rejection (no retry)
 *   3  network / 5xx / timeout (one retry attempted)
 *   4  auth failure
 *   5  ledger cap exceeded
 *
 * Stdout on success: JSON line with { ok, path, cost, mode, durationMs }.
 *
 * This script makes EXACTLY ONE fal.ai API call per invocation. No
 * loops, no batch flag. To generate two images, invoke the script twice.
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

// CRC32 (table-based) — inlined so we don't depend on zlib.crc32, which
// only landed in Node 22.2. Project supports Node >= 20.
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const FLUX_ENDPOINT      = 'fal-ai/flux-pro/v1.1';
const IMAGE_WIDTH        = 1216;   // Flux requires divisible by 16; closest to 1200
const IMAGE_HEIGHT       = 640;    // closest to OG 630
const COST_USD           = 0.04;   // Flux 1.1 Pro fixed price (May 2026)
const DAILY_CAP_USD      = 2.00;   // refuse if today's cumulative > this
const HARD_TIMEOUT_MS    = 90_000; // single-call hard cap
const MIN_VALID_BYTES    = 50_000; // sanity check on downloaded image
const RETRY_DELAY_MS     = 8_000;  // backoff before single 5xx retry

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const REPO_ROOT  = join(__dirname, '..');

// ── Helpers ───────────────────────────────────────────────────────────────────

function usage() {
  console.error(`
parallax generate-visual

  node scripts/generate-visual.mjs --slug <slug> [--dry-run] [--force]

  --slug <slug>   Required. Issue directory under src/content/issues/.
  --dry-run       Write a grey placeholder PNG, no API call.
                  (Or set FAL_DRY_RUN=1 in env.)
  --force         Bypass the daily \$${DAILY_CAP_USD.toFixed(2)} ledger cap.
  --help          Print this message.
`);
}

function parseArgs(argv) {
  const args = { slug: null, dryRun: false, force: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h')  args.help    = true;
    else if (a === '--dry-run')        args.dryRun  = true;
    else if (a === '--force')          args.force   = true;
    else if (a === '--slug')           args.slug    = argv[++i];
    else if (a.startsWith('--slug=')) args.slug    = a.slice('--slug='.length);
  }
  return args;
}

/**
 * Load .env.local entries into process.env without overriding existing vars
 * (we want CLI env to win over file). Mirrors pipeline.ts's loader but
 * defaults to non-override to keep this script standalone.
 */
function loadEnvLocal() {
  const file = join(REPO_ROOT, '.env.local');
  if (!existsSync(file)) return;
  for (const raw of readFileSync(file, 'utf-8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim();
    if (key && !process.env[key]) process.env[key] = val;
  }
}

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

function ledgerPath() {
  return join(REPO_ROOT, 'research', '_visual', 'ledger.jsonl');
}

/** Sum costs in the ledger for today (UTC). Returns 0 if file missing. */
function todaySpendUSD() {
  const path = ledgerPath();
  if (!existsSync(path)) return 0;
  const today = todayUTC();
  let sum = 0;
  for (const raw of readFileSync(path, 'utf-8').split('\n')) {
    if (!raw.trim()) continue;
    try {
      const entry = JSON.parse(raw);
      if (entry.date === today && typeof entry.cost === 'number') {
        sum += entry.cost;
      }
    } catch { /* skip malformed lines */ }
  }
  return sum;
}

function appendLedger(entry) {
  const dir = dirname(ledgerPath());
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  appendFileSync(ledgerPath(), JSON.stringify(entry) + '\n', 'utf-8');
}

/** Parse a simple KEY: value lines header from the prompt file. */
function parsePromptFile(text) {
  const lines = text.split('\n');
  const headers = {};
  let promptStart = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') { promptStart = i + 1; break; }
    const m = line.match(/^([A-Z_]+):\s*(.+)$/);
    if (m) headers[m[1]] = m[2].trim();
    else { promptStart = i; break; }
  }
  const prompt = lines.slice(promptStart).join('\n').trim();
  return { headers, prompt };
}

// ── Grey placeholder PNG (dry-run) ────────────────────────────────────────────

/**
 * Build a flat-colour PNG entirely with built-in modules. No native deps.
 * Returns a Buffer.
 *
 * Encodes one IHDR + one IDAT (zlib-deflated) + IEND.
 */
function buildSolidPng(width, height, rgb) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const chunk = (type, data) => {
    const len  = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf  = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])) >>> 0, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  };

  // IHDR — 8-bit RGB
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8]  = 8;    // bit depth
  ihdr[9]  = 2;    // colour type RGB
  ihdr[10] = 0;    // compression
  ihdr[11] = 0;    // filter
  ihdr[12] = 0;    // interlace

  // IDAT — one filter byte (0 = None) per row, then 3 bytes per pixel
  const rowBytes = 1 + width * 3;
  const raw = Buffer.alloc(rowBytes * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowBytes;
    raw[rowStart] = 0;
    for (let x = 0; x < width; x++) {
      const p = rowStart + 1 + x * 3;
      raw[p]     = rgb[0];
      raw[p + 1] = rgb[1];
      raw[p + 2] = rgb[2];
    }
  }
  const idat = deflateSync(raw);

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  loadEnvLocal();

  const args = parseArgs(process.argv.slice(2));
  if (args.help)            { usage(); process.exit(0); }
  if (!args.slug)           { usage(); process.exit(1); }
  const dryRun = args.dryRun || process.env.FAL_DRY_RUN === '1';

  const slug = args.slug;
  const promptPath = join(REPO_ROOT, 'src', 'content', 'issues', slug, 'og-prompt.txt');
  if (!existsSync(promptPath)) {
    console.error(`Error: prompt file not found at src/content/issues/${slug}/og-prompt.txt`);
    process.exit(1);
  }

  const promptText = readFileSync(promptPath, 'utf-8');
  const { headers, prompt } = parsePromptFile(promptText);
  if (!prompt) {
    console.error('Error: prompt file has no prompt body.');
    process.exit(1);
  }
  const mode = headers.MODE || 'UNSPECIFIED';

  // Ensure output dir.
  const outDir = join(REPO_ROOT, 'public', 'og');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${slug}.png`);

  const startedAt = Date.now();

  // ── Dry-run branch ─────────────────────────────────────────────────────────
  if (dryRun) {
    // Mid-grey 18% reflectance, neutral — recognisable as placeholder.
    const png = buildSolidPng(IMAGE_WIDTH, IMAGE_HEIGHT, [128, 128, 128]);
    writeFileSync(outPath, png);
    appendLedger({
      date:     todayUTC(),
      slug,
      mode,
      cost:     0,
      dryRun:   true,
      bytes:    png.length,
      durationMs: Date.now() - startedAt,
    });
    console.log(JSON.stringify({
      ok:         true,
      dryRun:     true,
      path:       `/og/${slug}.png`,
      cost:       0,
      mode,
      bytes:      png.length,
      durationMs: Date.now() - startedAt,
    }));
    process.exit(0);
  }

  // ── Live branch — guardrails first ─────────────────────────────────────────
  if (!process.env.FAL_KEY) {
    console.error('Error: FAL_KEY is not set. Add it to .env.local or export it.');
    process.exit(4);
  }

  const todaySpend = todaySpendUSD();
  if (!args.force && todaySpend + COST_USD > DAILY_CAP_USD) {
    console.error(
      `Error: daily cap $${DAILY_CAP_USD.toFixed(2)} would be exceeded ` +
      `(today already spent $${todaySpend.toFixed(2)}, this call would add $${COST_USD.toFixed(2)}). ` +
      `Pass --force to override.`,
    );
    process.exit(5);
  }

  // Import the fal.ai client lazily so the dry-run path doesn't require it.
  let fal;
  try {
    ({ fal } = await import('@fal-ai/client'));
  } catch (err) {
    console.error('Error: @fal-ai/client is not installed. Run: npm install @fal-ai/client');
    process.exit(1);
  }
  fal.config({ credentials: process.env.FAL_KEY });

  // Single fal.ai call with hard timeout. One retry on 5xx / timeout.
  const callOnce = async () => {
    const ctl     = new AbortController();
    const timer   = setTimeout(() => ctl.abort(), HARD_TIMEOUT_MS);
    try {
      const result = await fal.subscribe(FLUX_ENDPOINT, {
        input: {
          prompt,
          image_size:           { width: IMAGE_WIDTH, height: IMAGE_HEIGHT },
          num_inference_steps:  28,
          guidance_scale:       3.5,
          num_images:           1,
          enable_safety_checker: true,
          output_format:        'png',
        },
        logs: false,
      });
      clearTimeout(timer);
      return result;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  };

  let result;
  try {
    result = await callOnce();
  } catch (err) {
    // Distinguish failure modes.
    const msg = String(err?.message || err);
    if (/401|403|invalid.+credentials|unauthor/i.test(msg)) {
      console.error('Error: fal.ai auth failed. Check FAL_KEY.');
      process.exit(4);
    }
    if (/content.+policy|moderation|safety|nsfw|420|422/i.test(msg)) {
      console.error(`Error: fal.ai content-policy rejection. Rewrite the prompt and retry. (${msg})`);
      process.exit(2);
    }
    // Network / 5xx / timeout — single retry.
    console.error(`Warning: first call failed (${msg}); retrying once in ${RETRY_DELAY_MS}ms.`);
    await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
    try {
      result = await callOnce();
    } catch (err2) {
      console.error(`Error: retry also failed (${String(err2?.message || err2)}).`);
      process.exit(3);
    }
  }

  const imageUrl = result?.data?.images?.[0]?.url;
  if (!imageUrl) {
    console.error('Error: fal.ai returned no image URL. Response shape:', JSON.stringify(result?.data || result));
    process.exit(3);
  }

  // Download CDN URL → outPath.
  let bytes;
  try {
    const dlCtl   = new AbortController();
    const dlTimer = setTimeout(() => dlCtl.abort(), 30_000);
    const res = await fetch(imageUrl, { signal: dlCtl.signal });
    clearTimeout(dlTimer);
    if (!res.ok) throw new Error(`download HTTP ${res.status}`);
    bytes = Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.error(`Error: image download failed (${String(err?.message || err)}).`);
    process.exit(3);
  }
  if (bytes.length < MIN_VALID_BYTES) {
    console.error(`Error: downloaded image is suspiciously small (${bytes.length} bytes < ${MIN_VALID_BYTES}).`);
    process.exit(3);
  }
  writeFileSync(outPath, bytes);

  appendLedger({
    date:       todayUTC(),
    slug,
    mode,
    cost:       COST_USD,
    dryRun:     false,
    bytes:      bytes.length,
    durationMs: Date.now() - startedAt,
  });

  console.log(JSON.stringify({
    ok:         true,
    dryRun:     false,
    path:       `/og/${slug}.png`,
    cost:       COST_USD,
    mode,
    bytes:      bytes.length,
    durationMs: Date.now() - startedAt,
  }));
}

main().catch(err => {
  console.error('Fatal:', err?.stack || err?.message || err);
  process.exit(3);
});
