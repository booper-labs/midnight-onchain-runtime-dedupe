# GOTCHA — duplicate `@midnight-ntwrk/onchain-runtime-v3` breaks `instanceof StateValue`

**Type:** community packaging gotcha / local workaround  
**Scope verified:** create-mn-app **0.5.1**, midnight-js **4.1.1**, Compact **0.5.2** /
compiler **0.31.1**, Node **22**, **npm**, local **undeployed** only  
**Not claimed:** production audit, mainnet, Lace UI, all scaffold versions,
official Midnight guidance

## Contents

1. [Symptoms](#symptoms)
2. [Root cause](#root-cause)
3. [`npm ls` evidence pattern](#npm-ls-evidence-pattern)
4. [Fix](#fix)
5. [Verify steps](#verify-steps)
6. [Related reports](#related-upstream--community-reports-fetched-links-only)
7. [Honest limits](#honest-limits)

## Symptoms

| Observation | Typical |
|-------------|---------|
| `npm run deploy` | Succeeds |
| `npm run test:e2e` (read / findDeployedContract) | Often still passes |
| `callTx` / `storeMessage` / write circuits | Fails with `expected instance of StateValue` (often via `ChargedState` / compact-runtime) |

Stack traces point at runtime type checks, not at your `.compact` source.

## Root cause

1. Two **physical** installs of `@midnight-ntwrk/onchain-runtime-v3` under `node_modules`.
2. Each install loads its own WASM module instance.
3. wasm-bindgen class identity is per WASM instance. Cross-copy `instanceof`
   returns `false` even when semver strings match.
4. Deploy paths may not cross the failing boundary; call-tx state merge does.

### Why create-mn-app 0.5.1 / midnight-js 4.1.1 produces it

| Dependent | Constraint | Result without pin |
|-----------|------------|--------------------|
| `@midnight-ntwrk/compact-runtime@0.16.0` | `onchain-runtime-v3@^3.0.0` | May resolve **3.1.1** at top level |
| `@midnight-ntwrk/midnight-js-protocol@4.1.1` | `onchain-runtime-v3@3.0.0` (exact) | Nested **3.0.0** under protocol |

**Note:** `overrides` alone can equalize semver to `3.0.0` while still leaving
**two directories**. Direct dependency + overrides (hoist) + optional postinstall
collapse is what we verified.

## `npm ls` evidence pattern

**Broken (example from our stress run):**

```text
hello-world@1.0.0
├─┬ @midnight-ntwrk/compact-runtime@0.16.0
│ └── @midnight-ntwrk/onchain-runtime-v3@3.1.1
└─┬ @midnight-ntwrk/midnight-js-protocol@4.1.1
  └── @midnight-ntwrk/onchain-runtime-v3@3.0.0
```

**Also broken:** two real directories both labeled `3.0.0` (same version, two WASM loads).

**Healthy (example after fix):**

```text
hello-world@1.0.0
├─┬ @midnight-ntwrk/compact-runtime@0.16.0
│ └── @midnight-ntwrk/onchain-runtime-v3@3.0.0 deduped
├─┬ @midnight-ntwrk/midnight-js-protocol@4.1.1
│ └── @midnight-ntwrk/onchain-runtime-v3@3.0.0 deduped
└── @midnight-ntwrk/onchain-runtime-v3@3.0.0 overridden
```

Filesystem check: exactly one non-symlink directory
`node_modules/@midnight-ntwrk/onchain-runtime-v3`.
Use `scripts/check-single-onchain-runtime.mjs` (exits non-zero if >1 real copy).

## Fix

1. **Direct dependency** `"@midnight-ntwrk/onchain-runtime-v3": "3.0.0"`
2. **overrides** `"@midnight-ntwrk/onchain-runtime-v3": "3.0.0"`
3. `rm -rf node_modules && npm install`
4. Optional **postinstall:** `node scripts/dedupe-onchain-runtime.mjs` (idempotent;
   collapses nested reals to one top-level + symlinks)

See `package-snippet.json` and `RECIPE.md`. Pin choice: match
`midnight-js-protocol@4.1.1`’s exact `3.0.0` (we did not verify a global `3.1.x` pin).

## Verify steps

```bash
npm ls @midnight-ntwrk/onchain-runtime-v3
node scripts/check-single-onchain-runtime.mjs   # expect exit 0
npm run compile
# local stack up
npm run deploy                                  # if needed
npm run test:e2e                                # if present
# exercise a write circuit (storeMessage / callTx)
```

Stress check: temporarily remove overrides + direct dep, reinstall, confirm
check script fails with >1 physical copy; restore fix and confirm pass.

## Related upstream / community reports (fetched links only)

Same *class* of failure (dual WASM / dual module → `instanceof` / StateValue).
Citations describe related trees; version numbers in those posts may differ
slightly from our stress run (e.g. **3.1.0** vs our **3.1.1** under a caret).

| Source | URL | Relevance | Link check (2026-09-25 PT) |
|--------|-----|-----------|----------------------------|
| Forum — “100 days of midnight” (Day 29: StateValue instanceof on submit) | https://forum.midnight.network/t/100-days-of-midnight/1316 | compact-runtime pulled 3.1.0 vs protocol 3.0.0; pin + clean reinstall | **Live** |
| Forum — Dev status update Aug 15–21 | https://forum.midnight.network/t/dev-status-update-aug-15-21/1319 | StateValue / duplicate class; second onchain-runtime-v3 if compact-js below 2.5.3 (adjacent trigger) | **Live** |
| Forum — create-mn-app cascading version / dual module discussion | https://forum.midnight.network/t/create-mn-app-hello-world-scaffold-cascading-version-errors-on-local-devnet-deploy-compact-js-ledger-v9/1335 | Module identity / prefer protocol subpath exports; caution on overrides stomping ledger lines (adjacent, not the same package) | **Live** |
| midnight-js#1052 — WASM dual-instantiation (Vite monorepo) | https://github.com/midnightntwrk/midnight-js/issues/1052 | Related class (Vite dual-tree / bundler), **not** identical to the npm dual-semver create-mn-app case; still useful for `instanceof` across two WASM loads | **Live** |
| Creva-ZK (Devpost) | https://devpost.com/software/creva-zk | Deploy OK; circuit calls `expected instance of StateValue`; two onchain-runtime-v3 copies; overrides + dedupe | **Live** |
| Dusk (Devpost) | https://devpost.com/software/dusk-u1l8is | After deploy fix, `/store` → StateValue; dual WASM copies; overrides + symlink collapse | **Live** |

Upstream package / docs targets (**for later filing only** — not filed by this package):

- https://github.com/midnightntwrk/create-mn-app — **Live**
- https://github.com/midnightntwrk/midnight-js/issues/1052 — **Live**
- https://docs.midnight.network/getting-started/quickstart — **Live**
- https://forum.midnight.network/ — **Live**

## Honest limits

This package documents a **workaround** verified on a **local undeployed**
practice app at the versions in `VERSIONS.md`. It does not replace an upstream
fix to align caret/exact constraints or to fail fast when two WASM instances load.
