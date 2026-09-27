# Reputation gate R2 — Midnight onchain-runtime-v3 dedupe package

**Date:** 2026-09-25 PT  
**Examiner:** Cardano Study Partner  
**Package:** `/workspace/midnight-compact-practice/publish/midnight-onchain-runtime-dedupe/`  
**Prior:** `audits/reputation-gate.md` — **CONDITIONAL** (Correctness PASS; Presentation needed four deltas)  
**Ask:** Re-gate Correctness + Presentation after CM Dev applied those deltas.

---

## Overall verdict

**PASS** (with one **non-blocking** checklist polish — see below)

| Axis | Grade | Notes |
|------|-------|-------|
| **Correctness** | **PASS** (unchanged) | No new overclaims; scope / evidence / secrets still honest. |
| **Presentation** | **PASS** | All four required deltas from R1 are landed and clear. |

**Cleared for reputation publish** as a **community gotcha / local undeployed workaround** package, subject to `PUBLISH-CHECKLIST.md` (Booper license, human skim, live link re-check on push day).

**Not cleared:** mainnet / Lace / other create-mn-app versions / non-npm PMs; “official” or “fixed forever.”

---

## Delta checklist (R1 → R2)

| # | Required delta | Status |
|---|----------------|--------|
| 1 | `README.md` front door + read order; quick-start pin/merge | **Done** — verified / not-verified / not-claimed; suggested reading order |
| 2 | RECIPE + snippet: merge `postinstall`, do not replace blindly | **Done** — RECIPE §3 steps 1–4; snippet `_comment` |
| 3 | RECIPE: pin + overrides to **3.0.0** first; never dedupe alone | **Done** — banner under title; §6 restates pin still required |
| 4 | GOTCHA #1052: related class (Vite), not identical npm dual-semver | **Done** — citation table row explicit |
| — | `PUBLISH-CHECKLIST.md` | **Present** — aligns with bar |

Correctness spot-check: anti-claims retained in README; pin rationale unchanged; no seeds in tree; illustrative JSON in RECIPE still shows a bare `postinstall` but surrounding prose forbids blind replace — acceptable.

---

## Non-blocking polish (fix before public push; does **not** reopen CONDITIONAL)

| Item | Note |
|------|------|
| README “Package contents” lists `audits/reputation-self-audit.md` | **File absent** at re-gate. Remove the row or add a short self-audit stub so the TOC matches the tree. |
| PUBLISH-CHECKLIST “Study Partner PASS” box | Check this after accepting R2; leave others for Booper/human. |

---

## Required deltas

**None** for mechanism or the four presentation items.

Optional: sync README contents table with disk (self-audit row) before push.

---

## Clearance

| Question | Answer |
|----------|--------|
| R1 presentation deltas cleared? | **Yes** |
| Ready for reputation publish (workaround docs)? | **Yes** — after checklist + optional TOC fix |
| Product / mainnet claim? | **No** |
| Further Partner gate required? | **No** unless content changes materially |

---

## Examiner one-liner

**PASS.** Presentation deltas landed. Correctness still clean. Optional: drop or add the missing `reputation-self-audit.md` row in README before public push.
