# RECIPE — fresh create-mn-app hello-world hit by dual onchain-runtime

Copy-paste path for a scaffold that deploys but fails on `storeMessage` /
`callTx` with `expected instance of StateValue`.

**Required order:** add the **direct dependency + overrides to `3.0.0` first**.
The dedupe script is a **safety net** after that pin — do **not** run
`dedupe-onchain-runtime.mjs` alone without the pin (you can end up with a
single physical **3.1.x** copy and still be broken for protocol’s exact `3.0.0`
expectation).

**Scope:** copy-paste recovery for scaffolds that deploy but fail on
`storeMessage` / `callTx` with `expected instance of StateValue`.
**Verified on:** create-mn-app **0.5.1**, midnight-js **4.1.1**, Node **22**,
**npm**, local **undeployed** (see `VERSIONS.md`).
**Not claimed:** works on every create-mn-app release, every package manager,
or public networks.

## 0. Preconditions

- Node **≥ 22**
- Docker available for local undeployed (or your own node/indexer/proof-server)
- You scaffolded with something like:

```bash
npx create-mn-app@0.5.1 my-app --template hello-world --use-npm --yes
cd my-app
```

## 1. Confirm you have the bug (optional but clarifying)

```bash
npm ls @midnight-ntwrk/onchain-runtime-v3
```

**Broken pattern:** two versions and/or a nested second install, e.g.

```
├─┬ @midnight-ntwrk/compact-runtime@0.16.0
│ └── @midnight-ntwrk/onchain-runtime-v3@3.1.1
└─┬ @midnight-ntwrk/midnight-js-protocol@4.1.1
  └── @midnight-ntwrk/onchain-runtime-v3@3.0.0
```

Or two physical directories even at the same semver.

Symptom at runtime: deploy OK; `storeMessage` / write circuit →
`expected instance of StateValue` (often via ChargedState).

## 2. Copy the helper scripts

From this package, copy into your app:

```bash
mkdir -p scripts
cp /path/to/midnight-onchain-runtime-dedupe/scripts/dedupe-onchain-runtime.mjs scripts/
cp /path/to/midnight-onchain-runtime-dedupe/scripts/check-single-onchain-runtime.mjs scripts/
```

## 3. Merge package.json fragments (do not replace blindly)

Merge from `package-snippet.json`. Keep your existing midnight-js / wallet /
compact-runtime pins from the template.

1. Add **direct dependency** `"@midnight-ntwrk/onchain-runtime-v3": "3.0.0"`.
2. Add **overrides** `"@midnight-ntwrk/onchain-runtime-v3": "3.0.0"`.
3. Add script `"check:onchain-runtime": "node scripts/check-single-onchain-runtime.mjs"`.
4. **`postinstall`:** if the template already has a `postinstall`, **append** the
   dedupe command (for example `…existing… && node scripts/dedupe-onchain-runtime.mjs`).
   Do **not** overwrite an existing `postinstall` with only the dedupe line.
   If there is no `postinstall` yet, you may set it to
   `node scripts/dedupe-onchain-runtime.mjs`.

Example fragment (illustrative — merge, don’t paste over the whole `package.json`):

```json
{
  "dependencies": {
    "@midnight-ntwrk/onchain-runtime-v3": "3.0.0"
  },
  "overrides": {
    "@midnight-ntwrk/onchain-runtime-v3": "3.0.0"
  },
  "scripts": {
    "postinstall": "node scripts/dedupe-onchain-runtime.mjs",
    "check:onchain-runtime": "node scripts/check-single-onchain-runtime.mjs"
  }
}
```

## 4. Clean reinstall

```bash
rm -rf node_modules
npm install
npm run check:onchain-runtime
npm ls @midnight-ntwrk/onchain-runtime-v3
```

**Healthy pattern:** a single **3.0.0** line with `deduped` / `overridden` under
dependents, and **one** physical directory:

```text
node_modules/@midnight-ntwrk/onchain-runtime-v3
```

(`check:onchain-runtime` exits 0; more than one real copy exits 1.)

## 5. Compile, stack, deploy, write

```bash
npm run compile
npm run setup          # or your local Docker / host-net recipe
npm run deploy
npm run test:e2e       # read/smoke if present
# then a write circuit, e.g. CLI storeMessage or a one-shot interact script
```

If write still fails with StateValue after a single physical **3.0.0** copy, the
cause is elsewhere (wallet sync, proof server, wrong contract address, etc.).

## 6. If duplicates return after later installs

```bash
npm run check:onchain-runtime || node scripts/dedupe-onchain-runtime.mjs
npm ls @midnight-ntwrk/onchain-runtime-v3
```

`postinstall` should usually keep the tree collapsed after `npm install`,
**provided** the direct dep + overrides to **3.0.0** are still present.
