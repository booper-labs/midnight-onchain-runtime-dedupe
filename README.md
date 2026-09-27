# midnight-onchain-runtime-dedupe

**Community packaging gotcha + local workaround** for Midnight
`create-mn-app` hello-world scaffolds where **deploy succeeds** but write
circuits (`storeMessage` / `callTx`) fail with `expected instance of StateValue`.

npm can install **two physical copies** of `@midnight-ntwrk/onchain-runtime-v3`.
Each copy loads its own WASM instance; wasm-bindgen class identity
(`instanceof StateValue`) is per instance. Matching semver strings are not
enough if two folders remain.

**Who this is for:** builders hitting that symptom on a local undeployed
(devnet) hello-world at the versions below; maintainers packaging a clear
workaround for Booper Labs / upstream review later.

> **Not official Midnight docs.** Not an SDK fix. Not filed upstream from this
> package. Suitable for human / Booper review before any public push.

## Verified scope (2026-09-25 PT)

| | |
|---|---|
| **Verified** | create-mn-app **0.5.1**, midnight-js **4.1.1**, Compact CLI **0.5.2** / compiler **0.31.1**, Node **22**, **npm**, local **undeployed** Docker stack; pin + dedupe → single physical `onchain-runtime-v3@3.0.0`; `storeMessage` + `test:e2e` PASS (see `STATUS.md`, logs) |
| **Not verified** | mainnet / preview / preprod; Lace or other browser wallet UI; create-mn-app ≠ 0.5.1; yarn / pnpm / bun; a global `3.1.x` pin |
| **Not claimed** | production-ready, battle-tested, audited, official |

Exact pins: [`VERSIONS.md`](VERSIONS.md). Evidence matrix: [`STATUS.md`](STATUS.md).


## Install / clone

```bash
git clone https://github.com/booper-labs/midnight-onchain-runtime-dedupe.git
cd midnight-onchain-runtime-dedupe
```

Then follow [`RECIPE.md`](RECIPE.md) (copy `scripts/` and merge [`package-snippet.json`](package-snippet.json) into your app).

## Quick start

If deploy works but write fails with `expected instance of StateValue`:

1. Read the plain explanation: [`PLAIN-LANGUAGE.md`](PLAIN-LANGUAGE.md)
2. Follow the copy-paste recovery: [`RECIPE.md`](RECIPE.md)
3. Merge [`package-snippet.json`](package-snippet.json) and copy `scripts/`
   (pin **3.0.0** + overrides first; **merge** `postinstall` with any existing
   hook — do not replace blindly; never run dedupe alone without the pin)

Technical writeup + citations: [`GOTCHA.md`](GOTCHA.md).

## Package contents

| Path | Role |
|------|------|
| `README.md` | This front door |
| `PLAIN-LANGUAGE.md` | Non-expert explanation |
| `GOTCHA.md` | Technical gotcha + community / upstream links |
| `RECIPE.md` | Copy-paste recovery |
| `VERSIONS.md` | Exact tested versions |
| `STATUS.md` | Verification matrix + artifact pointers |
| `package-snippet.json` | `package.json` merge fragment |
| `scripts/dedupe-onchain-runtime.mjs` | Optional postinstall collapse (idempotent) |
| `scripts/check-single-onchain-runtime.mjs` | Single-physical-copy guard (CI-friendly) |
| `e2e-verify.log` / `storemessage-verify.log` | Captured local verify runs |
| `PUBLISH-CHECKLIST.md` | Gates before Booper Labs / public push |
| `INTERNAL-STATUS.md` | Desk notes (not required for end users) |
| `audits/reputation-gate.md` / `reputation-gate-r2.md` | Study Partner reputation gates (R1 CONDITIONAL → R2 PASS) |
| `audits/reputation-self-audit.md` | Desk correctness / presentation self-audit |

## Honesty about limits

This documents a **workaround** verified on one practice app at one version
set. Upstream may later align caret/exact constraints or fail fast on dual WASM
loads. Until then: **one physical install** of `onchain-runtime-v3` (prefer pin
**3.0.0** to match `midnight-js-protocol@4.1.1`).

## License

**MIT** — see [`LICENSE`](LICENSE). Copyright (c) 2026 Booper Labs / Brady Sheldon.


## How to cite versions

When reporting this gotcha or the workaround, cite:

- Package folder: `midnight-onchain-runtime-dedupe`
- Verification date: **2026-09-25** (America/Los_Angeles)
- create-mn-app **0.5.1** · midnight-js **4.1.1** · `onchain-runtime-v3` pin **3.0.0**
- Network: **local undeployed** only

Do not cite as “works for all Midnight versions” without re-checking
`VERSIONS.md` against a fresh scaffold.

## Suggested reading order

1. This README (scope)
2. `PLAIN-LANGUAGE.md` (why)
3. `RECIPE.md` (fix)
4. `GOTCHA.md` (depth + links)
5. `STATUS.md` / logs (evidence)
