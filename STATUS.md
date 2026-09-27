# STATUS — verification log (publish package)

**As-of:** 2026-09-25 20:12 PT (logs); docs polished later same evening  
**Label:** community gotcha / workaround — verified on local undeployed + pinned versions  
**Not claimed:** battle-tested, production-ready, audited, mainnet, official

## Matrix

| Check | Result | Notes |
|-------|--------|-------|
| Baseline `npm ls` single 3.0.0 (before stress) | **PASS** | deduped + overridden |
| `check-single-onchain-runtime.mjs` on fixed tree | **PASS** (exit 0) | physical=1 |
| Stress: remove pin/overrides, delete lockfile, `npm install` | **PASS (reproduced bug)** | top **3.1.1** + nested **3.0.0**; check exit **1** |
| Re-apply direct dep + overrides + postinstall, clean install | **PASS** | physical=1 @ 3.0.0; check exit 0 |
| Fresh `npm ci` after lock regenerate | **PASS** | postinstall ok; check exit 0 |
| Live Docker stack (node / indexer / proof-server) | **UP** | host-net; proof HTTP 200; RPC healthy |
| `npm run test:e2e` | **PASS** | log: `e2e-verify.log` |
| Live `storeMessage` | **PASS** | message `hello-publish-verify-201146`; TX `0017e1493c91cc94d47bd0a03dcb8f523447382257647e5c736e0990fcec2e4b91`; block **782**; READ_OK; log: `storemessage-verify.log` |
| Earlier same-day storeMessage (practice stack) | **PASS** (historical; log **not** in this package) | Do not treat truncated TX ids as package artifacts |
| Mainnet / preview / preprod | **NOT RUN** | |
| Lace / browser wallet UI | **NOT RUN** | |
| create-mn-app versions other than 0.5.1 | **NOT RUN** | |
| yarn / pnpm / bun override syntax | **NOT RUN** | npm only |

## Commands that produced the stress evidence

```bash
# Broken (no pin, no lockfile):
# npm ls → compact-runtime → 3.1.1 ; protocol → nested 3.0.0
# check-single-onchain-runtime → FAIL physical=2

# Fixed:
# dependencies + overrides pin 3.0.0 ; postinstall dedupe
# npm ls → single 3.0.0 deduped/overridden
# check-single-onchain-runtime → OK physical=1
```

## Artifacts in this folder

| Path | Role |
|------|------|
| `README.md` | Front door / scope |
| `PLAIN-LANGUAGE.md` | Non-expert explanation |
| `GOTCHA.md` | Technical publishable writeup + citations |
| `RECIPE.md` | Copy-paste recovery |
| `VERSIONS.md` | Exact tested versions |
| `package-snippet.json` | Merge fragment |
| `scripts/dedupe-onchain-runtime.mjs` | Idempotent postinstall collapse |
| `scripts/check-single-onchain-runtime.mjs` | CI-friendly single-copy guard |
| `e2e-verify.log` | 2026-09-25 ~20:11 PT e2e pass |
| `storemessage-verify.log` | 2026-09-25 ~20:11 PT storeMessage pass |
| `PUBLISH-CHECKLIST.md` | Pre-push gates |
| `INTERNAL-STATUS.md` | Maintainer desk notes |
| `audits/reputation-gate.md` | Study Partner R1 (CONDITIONAL) |
| `audits/reputation-gate-r2.md` | Study Partner R2 (**PASS**) |
| `audits/reputation-self-audit.md` | Desk correctness / presentation self-audit |
| `audits/once-over-2026-09-26.md` | Pre-publish structure + bug once-over (this memo) |

## Secrets

No wallet seeds, mnemonics, or private keys in this folder. Verify logs contain
only public contract address, tx id, and local undeployed network labels.

## Publishing stance

This tree is a **draft package for human / Booper Labs review**. It does not
file GitHub issues or open PRs by itself. Suggested upstream targets (for later
filing only) are listed at the end of `GOTCHA.md`. Process gates:
`PUBLISH-CHECKLIST.md`.
