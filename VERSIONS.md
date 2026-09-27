# VERSIONS — what we actually tested

**Scope:** honest pin list for this workaround package only.
**Do not assume** it applies to every create-mn-app release or every Midnight
network. Re-check on the day you publish or file upstream.

| Component | Version / value |
|-----------|-----------------|
| Node.js | **v22.23.3** (`engines`: `>=22.0.0`) |
| npm | **10.9.9** |
| create-mn-app | **0.5.1** (`npm view create-mn-app version` = 0.5.1 as of 2026-09-25 PT) |
| Compact CLI | **0.5.2** |
| Compact compiler | **0.31.1** |
| Template | `hello-world` (local `undeployed` Docker stack) |
| `@midnight-ntwrk/compact-runtime` | **0.16.0** (depends on `onchain-runtime-v3@^3.0.0`) |
| `@midnight-ntwrk/midnight-js-*` (contracts, protocol, types, utils, providers, network-id) | **4.1.1** |
| `@midnight-ntwrk/midnight-js-protocol` → onchain | **exact `3.0.0`** |
| `@midnight-ntwrk/wallet-sdk` | **1.2.0** |
| **Pin:** `@midnight-ntwrk/onchain-runtime-v3` | **3.0.0** (direct dep + `overrides`) |
| Broken tree (before fix) | top-level **3.1.1** via `compact-runtime@^3.0.0` + nested **3.0.0** under `midnight-js-protocol` |
| Midnight node image | `midnightntwrk/midnight-node:1.0.0` |
| Indexer image | `midnightntwrk/indexer-standalone:4.3.3` |
| Proof server image | `midnightntwrk/proof-server:8.1.0` |
| Network | **local undeployed only** (host-network Docker on the practice box) |

## Why pin 3.0.0 (not 3.1.x)

`midnight-js-protocol@4.1.1` depends on `onchain-runtime-v3@3.0.0` **exactly**.
Pinning the whole tree to **3.0.0** matches that package. Forcing **3.1.x** via
overrides can leave version identity aligned while still risking other
protocol mismatches; we did not verify a 3.1.x-everywhere pin on this stack.

## Date of verification

2026-09-25 (America/Los_Angeles).
