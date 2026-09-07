#!/usr/bin/env node
/**
 * twa-assetlinks — write public/.well-known/assetlinks.json for the Android
 * Trusted Web Activity.
 *
 *   node scripts/twa-assetlinks.mjs <package.name> <SHA256> [SHA256...]
 *
 * WHAT THIS FILE DOES. A TWA is Chrome rendering parallaxlens.com inside an
 * Android app. Android only drops the browser URL bar if the SITE vouches for
 * the APP — that is this file — and the app vouches for the site (the intent
 * filter in AndroidManifest.xml). Both directions, or it stays a browser tab
 * with a URL bar across the top.
 *
 * WHY IT IS SCRIPTED RATHER THAN HAND-WRITTEN. Every way of getting this wrong
 * fails SILENTLY. There is no error, no console, no log: the app simply opens
 * with a URL bar, and the reason is a fingerprint that is one character off, or
 * lowercase, or the wrong key entirely. So the arguments are validated here
 * rather than discovered a week later.
 *
 * WHICH FINGERPRINT. This is the trap. With Play App Signing — on by default
 * for new apps — Google re-signs the app with a key you never hold, so the
 * fingerprint that matters is NOT your upload key:
 *
 *   Play Console → your app → Test and release → Setup → App integrity
 *     → App signing key certificate → SHA-256 certificate fingerprint
 *
 * Pass the UPLOAD key fingerprint as well (same page, lower down). It costs
 * nothing, and it makes locally-signed builds verify too — otherwise every
 * pre-Play test build shows the URL bar and looks broken.
 *
 * A locally-signed keystore, if you are not on Play App Signing:
 *
 *   keytool -list -v -keystore my.keystore -alias my-alias
 *
 * AFTER RUNNING: commit, push, and confirm the deployed file is reachable and
 * served as JSON:
 *
 *   curl -si https://parallaxlens.com/.well-known/assetlinks.json | head -20
 *
 * Google's checker (paste the site + package) is the other half:
 *   https://developers.google.com/digital-asset-links/tools/generator
 *
 * Android caches this file, so a fix is not always instant on a device that
 * already failed — reinstall the app to force a re-check.
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT_DIR = 'public/.well-known';
const OUT = `${OUT_DIR}/assetlinks.json`;

/** 32 uppercase hex bytes, colon-separated: AA:BB:…:FF (95 chars). */
const FINGERPRINT = /^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/;

/** Reverse-DNS Android application id, e.g. com.parallaxlens.twa */
const PACKAGE = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+){1,}$/;

const [pkg, ...fingerprints] = process.argv.slice(2);

const die = (msg) => {
  console.error(`twa-assetlinks: ${msg}\n\nUsage:\n  node scripts/twa-assetlinks.mjs <package.name> <SHA256> [SHA256...]`);
  process.exit(1);
};

if (!pkg || fingerprints.length === 0) die('needs a package name and at least one SHA-256 fingerprint');

if (!PACKAGE.test(pkg)) {
  die(`"${pkg}" is not a valid Android application id (expected reverse-DNS, lowercase, e.g. com.parallaxlens.twa)`);
}

const normalised = fingerprints.map((raw) => {
  const f = raw.trim().toUpperCase();
  if (!FINGERPRINT.test(f)) {
    die(
      `"${raw}" is not a SHA-256 certificate fingerprint.\n` +
        '  Expected 32 colon-separated hex bytes, e.g.\n' +
        '  1A:2B:3C:...:FF  (95 characters)\n' +
        '  A SHA-1 fingerprint (20 bytes) will NOT work — Digital Asset Links needs SHA-256.',
    );
  }
  return f;
});

const unique = [...new Set(normalised)];
if (unique.length !== normalised.length) {
  console.warn(`twa-assetlinks: dropped ${normalised.length - unique.length} duplicate fingerprint(s)`);
}

/* The relation is fixed by the spec: this exact string is what lets the app
   handle our links without the URL bar. */
const statements = [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: pkg,
      sha256_cert_fingerprints: unique,
    },
  },
];

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, `${JSON.stringify(statements, null, 2)}\n`);

console.log(`twa-assetlinks: wrote ${OUT}`);
console.log(`  package      ${pkg}`);
for (const f of unique) console.log(`  fingerprint  ${f}`);
console.log('\nNext: commit, push, then verify the deployed file:');
console.log('  curl -si https://parallaxlens.com/.well-known/assetlinks.json | head -20');
