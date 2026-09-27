# PUBLISH-CHECKLIST — gates before Booper Labs / public push

**Do not push to GitHub until every required item is checked.**  
This package is a draft for human / Booper review. No agent should open a PR
or file an upstream issue from this tree without an explicit greenlight.

As-of template date: **2026-09-25 PT**. Re-run dated checks on the actual
publish day.

## Required (block publish)

- [x] **Study Partner or second-reader PASS** on Correctness + Presentation
      — **Done 2026-09-25 PT:** `audits/reputation-gate-r2.md` (**PASS**).
      (Booper waiver path unused.)
- [x] **LICENSE chosen by Booper** (MIT 2026-09-26) (UNLICENSE or MIT) and `LICENSE` file added;
      README license placeholder updated
- [ ] **Human README review** — scope box, no oversell, verified vs not-verified clear
- [ ] **No secrets** — grep for seeds, mnemonics, private keys, `.env`, wallet
      state; logs show only public contract address / tx id / undeployed labels
- [ ] **External URLs live** — re-fetch every link in `GOTCHA.md` on publish day;
      mark Unknown or fix if dead
- [ ] **Versions re-checked on publish day** — at minimum:
      `npm view create-mn-app version`,
      `npm view @midnight-ntwrk/midnight-js-protocol version`,
      `npm view @midnight-ntwrk/onchain-runtime-v3 version` (confirm **3.0.0** still published),
      Compact CLI / compiler still match `VERSIONS.md` *or* docs updated with new pins
- [ ] **Scripts smoke** — `node scripts/check-single-onchain-runtime.mjs --help` and
      `node scripts/dedupe-onchain-runtime.mjs --help` exit 0; check script still
      exits 0 on a known-good tree and 1 on a dual-copy tree (or document why skipped)
- [ ] **No internal desk chatter in public docs** — process notes only in
      `INTERNAL-STATUS.md`; `STATUS.md` remains evidence, public tone
- [ ] **Banned phrasing absent** — no “battle-tested”, “production-ready”, “official”
      as positive quality claims (negation inside disclaimers is OK)
- [ ] **Booper Labs greenlight** — explicit OK to push (org, visibility, whether
      to file upstream issues)

## Strongly recommended

- [ ] Fresh `create-mn-app@0.5.1` (or then-current) scaffold reproduce once more
- [ ] Capture new `e2e-verify.log` / `storemessage-verify.log` if stack or pins changed
- [ ] Decide whether to open / link `midnight-js#1052` and/or a create-mn-app issue
      (filing is separate from publishing this gotcha package)
- [ ] Tag or date stamp the published tree (`VERSIONS.md` date + git tag)

## Explicitly out of scope for this checklist

- Mainnet / Lace verification (still NOT RUN unless someone expands scope)
- Claiming yarn/pnpm/bun parity without separate verification
- Force-pushing or opening PRs “for visibility” without Booper OK

## Sign-off

| Role | Name | Date (PT) | Result |
|------|------|-----------|--------|
| Author / packager | | | |
| Study Partner / second reader | | | |
| Booper Labs publish OK | | | |
