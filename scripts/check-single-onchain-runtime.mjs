#!/usr/bin/env node
/**
 * check-single-onchain-runtime.mjs
 *
 * Exit 0 if exactly one *physical* (non-symlink) copy of
 * @midnight-ntwrk/onchain-runtime-v3 exists under node_modules.
 * Exit 1 if zero or more than one real copies (or package missing).
 *
 * Symlinks pointing at the single real install are OK — they still load one WASM.
 *
 * Output paths are sorted for deterministic logs (CI-friendly).
 *
 * Usage (from app root):
 *   node scripts/check-single-onchain-runtime.mjs
 *   node scripts/check-single-onchain-runtime.mjs --help
 *   npm ls @midnight-ntwrk/onchain-runtime-v3   # human-readable companion
 *
 * Scope: community workaround helper for create-mn-app 0.5.1 / midnight-js 4.1.1
 * local undeployed trees. Not an official Midnight tool.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = '@midnight-ntwrk/onchain-runtime-v3';

function printHelp() {
  console.log(`Usage: node scripts/check-single-onchain-runtime.mjs [--help|-h]

Exit 0 if exactly one physical (non-symlink) install of ${PKG}
exists under ./node_modules (relative to the app root: parent of scripts/).
Exit 1 if missing, or if more than one real directory is found.

Symlinks to the single real install are allowed.

Options:
  -h, --help    Show this help and exit 0

Companion: npm ls ${PKG}
`);
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  printHelp();
  process.exit(0);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nm = path.join(root, 'node_modules');

function findInstalls(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  const entries = fs.readdirSync(dir, { withFileTypes: true }).slice().sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  for (const ent of entries) {
    if (ent.name === '.bin') continue;
    const full = path.join(dir, ent.name);
    if (!ent.isDirectory() && !ent.isSymbolicLink()) continue;
    if (ent.name.startsWith('@')) {
      findInstalls(full, acc);
      continue;
    }
    if (ent.name === 'onchain-runtime-v3' && dir.endsWith('@midnight-ntwrk')) {
      acc.push(full);
      continue;
    }
    const nested = path.join(full, 'node_modules');
    if (fs.existsSync(nested)) findInstalls(nested, acc);
  }
  return acc;
}

function isSymlink(p) {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

function readVersion(p) {
  try {
    return JSON.parse(fs.readFileSync(path.join(p, 'package.json'), 'utf8')).version ?? '?';
  } catch {
    return '?';
  }
}

const installs = findInstalls(nm).slice().sort((a, b) => a.localeCompare(b));
const reals = installs.filter((p) => !isSymlink(p));
const links = installs.filter((p) => isSymlink(p));

if (installs.length === 0) {
  console.error(`[check-single-onchain-runtime] FAIL: ${PKG} not found under node_modules`);
  process.exit(1);
}

if (reals.length !== 1) {
  console.error(`[check-single-onchain-runtime] FAIL: expected 1 physical copy, found ${reals.length}`);
  for (const p of reals) {
    console.error(`  REAL  ${p}  (v${readVersion(p)})`);
  }
  for (const p of links) {
    let target = '?';
    try {
      target = fs.readlinkSync(p);
    } catch {
      /* ignore */
    }
    console.error(`  LINK  ${p} -> ${target}`);
  }
  console.error('Hint: add direct dep + overrides for 3.0.0, then npm install;');
  console.error('      or run scripts/dedupe-onchain-runtime.mjs as postinstall.');
  process.exit(1);
}

const real = reals[0];
const version = readVersion(real);
console.log(
  `[check-single-onchain-runtime] OK physical=1 version=${version} path=${real}` +
    (links.length ? ` symlinks=${links.length}` : ''),
);
process.exit(0);
