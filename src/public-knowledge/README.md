# RP public knowledge bundle

This directory is generated from the shared RP repository. It is deliberately
the public, reviewable subset of the RP evidence rather than a copy of the app
source or client data.

Refresh it with:

```sh
node scripts/sync-rp-public-knowledge.mjs --rp-repo /path/to/rp-desktop-product-split
node scripts/verify-public-knowledge.mjs
```

The three public pages consume this bundle:

- `/reference-data/` — current data vintage, categories, and citations.
- `/math-proof/` — generated calculation-validation results and limitations.
- `/methodology/` — the plain-language explanation of the shared planning model.
