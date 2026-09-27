#!/usr/bin/env node
/**
 * dedupe-onchain-runtime.mjs
 *
 * Why this exists
 * ---------------
 * create-mn-app 0.5.1 / midnight-js 4.1.1 can install TWO physical copies of
 * @midnight-ntwrk/onchain-runtime-v3:
 *   - compact-runtime@0.16.0 depends on ^3.0.0  → npm may pick 3.1.x
 *   - midnight-js-protocol@4.1.1 depends on 3.0.0 exactly → nested 3.0.0
 *
 * That package loads a WASM module. Classes like StateValue / ChargedState use
 * instanceof tied to the WASM instance. Two directories = two WASM loads =
 * two incompatible classes. Deploy often still works; callTx (e.g. storeMessage)
 * fails with: "expected instance of StateValue".
 *
 * Prefer fixing the tree first:
 *   1. Add a direct dependency: "@midnight-ntwrk/onchain-runtime-v3": "3.0.0"
 *   2. Add overrides: { "@midnight-ntwrk/onchain-runtime-v3": "3.0.0" }
 *   3. rm -rf node_modules && npm install
 *
 * This script is a safety net for postinstall: if nested real directories
 * reappear (same or different semver), collapse them to one real top-level
 * install and symlink the rest at it. Idempotent — safe to re-run.
 *
 * Exit codes: 0 = ok / nothing to do; 1 = could not leave exactly one real install.
 *
 * Usage:
 *   node scripts/dedupe-onchain-runtime.mjs
 *   node scripts/dedupe-onchain-runtime.mjs --help
 *
 * Verified on: Node 22 + create-mn-app 0.5.1 + midnight-js 4.1.1 + local undeployed.
 * Community workaround — not an upstream SDK fix.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = '@midnight-ntwrk/onchain-runtime-v3';
const TARGET_VERSION = '3.0.0'; // documented pin for midnight-js-protocol@4.1.1

function printHelp() {
  console.log(`Usage: node scripts/dedupe-onchain-runtime.mjs [--help|-h]

Idempotent postinstall helper: ensure exactly one physical install of
${PKG} under ./node_modules (app root = parent of scripts/).
Extra real copies are removed and replaced with symlinks to the top-level
canonical path. Prefer fixing package.json (direct dep + overrides) first.

Options:
  -h, --help    Show this help and exit 0 (no filesystem changes)

Exit 0 on success / skip; exit 1 if more than one real install remains.
Documented pin for midnight-js-protocol@4.1.1: ${TARGET_VERSION}
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
    const pkg = JSON.parse(fs.readFileSync(path.join(p, 'package.json'), 'utf8'));
    return pkg.version ?? '?';
  } catch {
    return '?';
  }
}

const installs = findInstalls(nm).slice().sort((a, b) => a.localeCompare(b));
if (installs.length === 0) {
  console.warn(`[dedupe-onchain-runtime] no ${PKG} installs under node_modules; skip`);
  process.exit(0);
}

const canonical = path.join(nm, PKG);
const realSrc =
  installs.find((p) => {
    try {
      return path.resolve(p) === path.resolve(canonical) && !isSymlink(p);
    } catch {
      return false;
    }
  }) ||
  installs.find((p) => !isSymlink(p)) ||
  installs[0];

fs.mkdirSync(path.dirname(canonical), { recursive: true });
if (path.resolve(realSrc) !== path.resolve(canonical)) {
  if (fs.existsSync(canonical)) fs.rmSync(canonical, { recursive: true, force: true });
  fs.cpSync(realSrc, canonical, { recursive: true });
}

let linked = 0;
for (const p of installs) {
  if (path.resolve(p) === path.resolve(canonical)) continue;
  if (isSymlink(p)) {
    try {
      if (fs.realpathSync(p) === fs.realpathSync(canonical)) continue;
    } catch {
      /* recreate */
    }
  }
  fs.rmSync(p, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.symlinkSync(path.relative(path.dirname(p), canonical), p, 'dir');
  linked += 1;
}

const after = findInstalls(nm).slice().sort((a, b) => a.localeCompare(b));
const reals = after.filter((p) => !isSymlink(p));
const links = after.filter((p) => isSymlink(p));
const version = readVersion(reals[0] ?? canonical);

if (reals.length !== 1) {
  console.error('[dedupe-onchain-runtime] expected exactly one real install, got:', reals);
  process.exit(1);
}

console.log(
  `[dedupe-onchain-runtime] ok real=1 symlinks=${links.length} linked_now=${linked} version=${version}` +
    (version !== TARGET_VERSION
      ? ` (note: documented pin for midnight-js@4.1.1 is ${TARGET_VERSION})`
      : ''),
);
