# Plain language — dual onchain-runtime / StateValue gotcha

**Scope:** community gotcha explanation for the versions in `VERSIONS.md`.
**Not claimed:** production-ready, battle-tested, official, or verified beyond
local undeployed hello-world at create-mn-app **0.5.1** / midnight-js **4.1.1**.

For anyone who does not live in npm trees all day.

## What breaks

You scaffold a Midnight **hello-world** app. **Deploy** works (the contract lands
on your local chain). Then you try to **write** a message with `storeMessage`
(or another “call the circuit / build a call transaction” path) and Node throws
something like:

> expected instance of StateValue

Reads / e2e smoke that only *look* at the contract may still pass. That is
confusing on purpose: the failure is not “your Compact file is wrong.”

## Why two copies matter

Midnight’s JS stack loads a small **WASM** runtime package named
`@midnight-ntwrk/onchain-runtime-v3`. That package defines classes such as
`StateValue`. JavaScript’s `instanceof` asks: “was this object made by *this*
class constructor?”

If npm installs **two separate folders** of that package, Node loads the WASM
**twice**. You get two different `StateValue` classes that look the same on
paper. An object from copy A is **not** an instance of copy B’s class. The SDK
then rejects the object while building the write transaction.

Matching version numbers is not enough if there are still two folders.
**One physical install** (one folder, one WASM load) is what matters.

## How you get two copies (on the versions we used)

With **create-mn-app 0.5.1** and **midnight-js 4.1.1**:

- `compact-runtime` asks for onchain-runtime **^3.0.0** → npm may pick **3.1.1**
- `midnight-js-protocol` asks for **exactly 3.0.0** → a second, nested copy

Same family of bug shows up in community writeups (Creva-ZK, Dusk, “100 days of
midnight”) and in related upstream WASM dual-instantiation discussions.

## How to check

From the app folder:

```bash
npm ls @midnight-ntwrk/onchain-runtime-v3
node scripts/check-single-onchain-runtime.mjs   # after you copy the script
```

Healthy: one **3.0.0**, one physical folder. Unhealthy: two versions and/or
two real directories.

## How to fix (workaround)

1. Add a **direct** dependency on `@midnight-ntwrk/onchain-runtime-v3@3.0.0`
2. Add npm **overrides** forcing that same **3.0.0** everywhere
3. Clean reinstall (`rm -rf node_modules && npm install`)
4. Keep the optional **postinstall** script that collapses nested duplicates
   if they reappear

Details and copy-paste steps: **RECIPE.md**. Fragment to merge:
**package-snippet.json**.

## What we verified

On **2026-09-25 PT**, local **undeployed** Docker stack, create-mn-app **0.5.1**,
Compact **0.5.2** / compiler **0.31.1**, Node **22**, midnight-js **4.1.1**:

- Before fix: two physical installs; `storeMessage` failed with StateValue
- After pin + dedupe: one physical **3.0.0**; `storeMessage` succeeded; e2e read passed
- Stress: removing the override brought duplicates back (check script failed);
  re-applying the fix restored a single copy (check script passed)

See **STATUS.md** and **VERSIONS.md**.

## What we did NOT verify

- Midnight **mainnet** or public preview/preprod
- Lace (or other) **browser wallet UI** paths
- Every **create-mn-app** version beyond **0.5.1**
- Every package manager (we used **npm**; yarn/pnpm/bun may need different
  override/dedupe syntax)
- Any claim beyond a **community gotcha** with a **workaround verified on a
  local undeployed** practice app at the versions above

## One sentence for stakeholders

The Compact contract was fine; npm installed the WASM runtime twice, so
`instanceof` failed on write — pin and hoist one copy of
`onchain-runtime-v3@3.0.0`.
