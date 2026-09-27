# Reputation self-audit — midnight-onchain-runtime-dedupe

**Auditor:** executor (reputation polish pass)  
**Date:** 2026-09-25 PT  
**Package:** `publish/midnight-onchain-runtime-dedupe/`  
**Study Partner:** R1 CONDITIONAL → **R2 PASS** (`audits/reputation-gate.md`, `audits/reputation-gate-r2.md`)

## Grades

| Axis | Grade | Notes |
|------|-------|-------|
| **Correctness** | **PASS** | Core claims match on-disk evidence (`hello-world/package.json` pins, `npm ls`, physical single copy, `docker-compose.yml` images `midnightntwrk/midnight-node:1.0.0` / `indexer-standalone:4.3.3` / `proof-server:8.1.0`, Compact CLI **0.5.2** / compiler **0.31.1**, `e2e-verify.log` + `storemessage-verify.log`). Stress dual-copy narrative consistent with STATUS. External URLs in GOTCHA fetched **Live** 2026-09-25 PT. Study Partner R2 agrees Correctness PASS. |
| **Presentation** | **CONDITIONAL** | Front-door README, scope boxes, public tone, scripts `--help`, checklist, and Study Partner R2 presentation **PASS**. Still needs Booper **LICENSE**, human README skim, and publish-day URL/version re-check before push. |

Overall readiness for **human / Booper review:** yes.  
Overall readiness for **unattended public push:** no (see blockers).

## Evidence checked

| Claim | Evidence | Verdict |
|-------|----------|---------|
| Node **v22.23.3**, npm **10.9.9** | `node -v` / `npm -v` in hello-world | OK |
| create-mn-app **0.5.1** is current latest | `npm view create-mn-app version` → `0.5.1` | OK |
| compact-runtime **0.16.0** → `^3.0.0`; protocol **4.1.1** → exact `3.0.0` | nested `package.json` deps | OK |
| Fixed tree single physical **3.0.0** | `npm ls` + check script exit 0 | OK |
| Docker images node **1.0.0** / indexer **4.3.3** / proof-server **8.1.0** | `hello-world/docker-compose.yml` | OK |
| Compact CLI **0.5.2** / compiler **0.31.1** | `compact --version`; `~/.compact/versions/0.31.1` | OK |
| e2e + storeMessage PASS | `e2e-verify.log`, `storemessage-verify.log` (message `hello-publish-verify-201146`; TX `0017e1493c91cc94d47bd0a03dcb8f523447382257647e5c736e0990fcec2e4b91`; block **782**) | OK |
| GOTCHA URLs | WebFetch all listed URLs | **All Live** |
| Historical TX @ ~height 557 in older STATUS | Full log not in package | Softened to historical / non-artifact |
| Forum / Devpost version numbers (e.g. **3.1.0** vs our stress **3.1.1**) | Citations are same *class*; our stress used **3.1.1** | OK when framed as class-of-bug (done) |
| Cascading-version forum thread | Dual compact-js / module identity, not onchain-runtime specifically | Marked **adjacent** in GOTCHA |
| midnight-js#1052 | Vite dual-tree / bundler class; **related**, not identical to npm dual-semver | Framed correctly in GOTCHA (Study Partner R2) |

## Shaky / overstated (flagged or fixed)

1. **Historical storeMessage TX** in older STATUS — truncated id, no log in package → **toned** (historical, not a package artifact).
2. **“Often still passes”** for e2e while write fails — qualitative; left as typical observation, not a universal law.
3. **Adjacent citations** (dev-status compact-js path; cascading compact-js thread) — kept with explicit “adjacent” labels.
4. **Dusk Devpost** version pairing can read swapped vs our tree — still dual-WASM class; we document *our* tree in VERSIONS/GOTCHA.

No claim of production-ready / battle-tested / official remains as a **positive** claim (disclaimers may negate those phrases).

## Deltas applied this pass

| Path | Change |
|------|--------|
| `README.md` | **Added/polished** — front door, scope box, quick start, limits, license placeholder, how to cite |
| `INTERNAL-STATUS.md` | **Added** — desk / process notes moved out of public STATUS |
| `PUBLISH-CHECKLIST.md` | **Added** — pre-push gates (Study Partner box checked after R2) |
| `audits/reputation-self-audit.md` | **Added** — this file |
| `PLAIN-LANGUAGE.md` | Scope disclaimer; removed “For Braden…”; no positive battle-tested/production-ready phrasing |
| `RECIPE.md` | Scope / verified / not-claimed opener; pin-first banner; postinstall **merge** guidance |
| `GOTCHA.md` | TOC; link-check column; adjacent-citation honesty; #1052 framed as related Vite class |
| `STATUS.md` | Public evidence tone; historical TX softened; artifact table updated; publishing stance |
| `VERSIONS.md` | Scope opener; `npm view` wording; protocol exact dep called out |
| `package-snippet.json` | Clearer `_comment` (scope / not official; merge postinstall) |
| `scripts/check-single-onchain-runtime.mjs` | `--help`; sorted traversal/output for determinism |
| `scripts/dedupe-onchain-runtime.mjs` | `--help`; sorted traversal; header polish |

## Remaining CONDITIONAL / blockers before publish

1. ~~Study Partner or second-reader PASS~~ → **Done (R2 PASS)**
2. **LICENSE** file chosen and added by Booper; README placeholder updated
3. Human README / presentation sign-off
4. Re-check URLs + npm versions **on publish day**
5. Explicit Booper greenlight to push (and whether to file upstream)

## Script smoke (this pass)

```text
node scripts/check-single-onchain-runtime.mjs --help  → exit 0
node scripts/dedupe-onchain-runtime.mjs --help        → exit 0
# against hello-world fixed tree:
check-single-onchain-runtime → OK physical=1 version=3.0.0
```
