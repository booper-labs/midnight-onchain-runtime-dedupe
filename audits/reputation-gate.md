# Reputation gate — Midnight onchain-runtime-v3 dedupe / storeMessage gotcha

**Date:** 2026-09-25 PT  
**Examiner:** Cardano Study Partner  
**Package:** `/workspace/midnight-compact-practice/publish/midnight-onchain-runtime-dedupe/`  
**Bar:** Braden — publish only if **correct** + **presented properly**  
**Scope:** Correctness + Presentation only. No invented metrics. Not a product roadmap.

**Artifacts present:** `PLAIN-LANGUAGE.md`, `GOTCHA.md`, `RECIPE.md`, `VERSIONS.md`, `STATUS.md`, `package-snippet.json`, `scripts/*`, `e2e-verify.log`, `storemessage-verify.log`  
**Not present (polish mid-flight):** `README.md`, `PUBLISH-CHECKLIST.md`, `audits/reputation-self-audit.md`

---

## Overall verdict

**CONDITIONAL**

| Axis | Grade | Notes |
|------|-------|-------|
| **Correctness** | **PASS** | Root cause, scope, verification, and “what we did not verify” are honest. No battle-tested / production overclaim. |
| **Presentation** | **Needs deltas** | Publish-ready packaging gaps (no package front door; recipe merge / dedupe-alone footguns). |

**Cleared after required deltas:** community gotcha publish as workaround docs (local undeployed, pinned versions).  
**Not cleared:** mainnet / Lace / all create-mn-app versions / non-npm PMs; upstream “fixed forever” claim.

---

## Correctness

### Mechanism and scope — Solid

- Dual physical `@midnight-ntwrk/onchain-runtime-v3` → dual WASM → `instanceof StateValue` failure on write (`storeMessage` / `callTx`) while deploy / read e2e may pass — consistent with wasm-bindgen identity and with community/upstream same-class reports.
- create-mn-app **0.5.1** / midnight-js **4.1.1** constraint split (`compact-runtime` `^3.0.0` vs `midnight-js-protocol` exact `3.0.0`) — clearly scoped; not generalized to all scaffolds.
- Pin choice **3.0.0** (match protocol exact) with explicit “did not verify 3.1.x-everywhere” — Solid discipline.
- Overrides alone ≠ one folder — called out correctly.

### Verification evidence — Solid

- `STATUS.md` matrix: reproduce broken tree, restore pin, check script, e2e, live `storeMessage` with TX/block — matches logs in-folder.
- `e2e-verify.log` / `storemessage-verify.log`: undeployed, contract address, `STORE_OK` / `READ_OK`, no seeds.
- `VERSIONS.md` pins Node/npm/images/network — honest.

### Overclaims — none found

- Explicit anti-claims: not battle-tested, not production-ready, not audited, not mainnet, not Lace, not all create-mn-app, npm-only.
- Label: community gotcha / workaround — matches content.

### Upstream / community citations — Solid (same *class*, not identical repros)

| Cite | Examiner check | Overclaim? |
|------|----------------|------------|
| Forum “100 days” Day 29 StateValue / 3.1.0 vs 3.0.0 pin | Present in thread; same mechanism | No |
| midnight-js#1052 Vite monorepo dual WASM | Open issue; dual tree → `instanceof`; Vite `resolve.dedupe` | No — GOTCHA already scopes Vite monorepo |
| Dev status Aug 15–21 / create-mn-app cascade / Creva / Dusk | Listed as same *class*; not claimed as re-run by this package | Acceptable if links live; do not elevate to “we reproduced their stacks” |

### Secrets — Solid

- No seeds/mnemonics/private keys in package. Logs: public contract address, tx id, undeployed labels, faucet balance text only.
- STATUS secrets section accurate.

### Scripts — Solid with one footgun (presentation, below)

- `check-single-onchain-runtime.mjs`: counts physical (non-symlink) copies — correct guard for WASM identity.
- `dedupe-onchain-runtime.mjs`: collapses to one real + symlinks; documents prefer pin first; warns if version ≠ `3.0.0` but does **not** fail — safe as postinstall *after* pin; unsafe if used alone.

---

## Presentation

### Strengths

- PLAIN-LANGUAGE leads with symptom → cause → check → fix → verified / not verified.
- GOTCHA has evidence table, healthy/broken `npm ls`, honest limits, citation table.
- RECIPE is ordered for a fresh scaffold user.
- package-snippet is clearly a merge fragment, not a full package.

### Gaps that block “presented properly” for publish

1. **No package front door.** Peer files with no `README.md` index — a cold reader does not know read order (PLAIN-LANGUAGE → RECIPE → GOTCHA → VERSIONS/STATUS).
2. **RECIPE postinstall merge.** Snippet shows `"postinstall": "node scripts/dedupe-…"` without saying **merge** with any existing `postinstall` (naive replace drops scaffolding hooks).
3. **Dedupe-alone footgun.** Script can leave a single physical **3.1.x** if run without direct dep + overrides. RECIPE should state in one sentence: pin + overrides first; postinstall is a safety net, not a substitute.
4. **#1052 framing (polish).** Already mostly correct; one explicit phrase “related class (bundler dual-tree), not the create-mn-app npm dual-semver repro” reduces miscitation risk.

### Non-blocking watches

| Watch | Note |
|-------|------|
| `/path/to/…` copy instructions | Fine for package handoff; replace with publish URL when filed |
| `npm run setup` | Hedged with “or your local Docker recipe” — OK |
| Missing PUBLISH-CHECKLIST / self-audit | Optional polish; README + three recipe deltas are the required bar |
| Forum “3.1.0” vs local “3.1.1” | Both caret resolutions — no fix needed |

---

## Required deltas (before publish)

1. Add **`README.md`** as package entry: one-paragraph what/who/scope + links to PLAIN-LANGUAGE → RECIPE → GOTCHA → VERSIONS → STATUS → scripts; restate “local undeployed workaround, not production.”
2. In **`RECIPE.md`** (and one line in `package-snippet.json` `_comment` or GOTCHA Fix): **merge** `postinstall` with any existing postinstall; do not replace blindly.
3. In **`RECIPE.md`** §3 or §4: **do not** rely on `dedupe-onchain-runtime.mjs` alone — always add direct dep + overrides to **3.0.0** first (otherwise a single physical 3.1.x can remain).
4. In **`GOTCHA.md`** citation row for #1052: add “related class (Vite monorepo dual-tree), not identical to npm dual-semver create-mn-app case.”

**No correctness rewrites required** if the above land without inventing broader verification.

---

## Clearance

| Question | Answer |
|----------|--------|
| Correct as local undeployed workaround docs? | **Yes** (after presentation deltas) |
| Ready to publish *as-is*? | **No** — CONDITIONAL |
| Invented metrics / production claim? | **No** |
| Secrets leakage? | **No** |

---

## Examiner one-liner

**CONDITIONAL.** Correctness PASS (honest scope, verified storeMessage, no overclaims). Presentation needs README + postinstall-merge + no-dedupe-alone warnings (+ #1052 class note) before reputation publish.

---

## CM Dev delta application (2026-09-25 ~20:22 PT)

Applied Study Partner required deltas:

1. `README.md` — present (front door + read order); quick-start notes merge/pin order.
2. `RECIPE.md` + `package-snippet.json` — merge `postinstall`; never replace blindly.
3. `RECIPE.md` — pin + overrides to 3.0.0 first; dedupe is not a substitute.
4. `GOTCHA.md` #1052 — related class (Vite dual-tree), not identical npm dual-semver case.

Also added `PUBLISH-CHECKLIST.md`. Awaiting Study Partner **re-gate** for clean PASS.


---

## Re-gate R2 (2026-09-25 PT)

Study Partner re-gate: **PASS**. See `audits/reputation-gate-r2.md`. Four presentation deltas cleared. Optional: README TOC lists missing `audits/reputation-self-audit.md` — fix before public push (non-blocking).
