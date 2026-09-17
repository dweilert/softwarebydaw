# SoftwareByDaW
Source code for web site SoftwareByDaW.  

## RP public knowledge publication

The RP public Reference Data, Math Proof, and Methodology pages are static
pages in `src/reference-data/`, `src/math-proof/`, and `src/methodology/`.
Their reviewed data bundle is under `src/public-knowledge/data/`.

To refresh the bundle from the RP split repository:

```sh
node scripts/sync-rp-public-knowledge.mjs --rp-repo /path/to/rp-desktop-product-split
node scripts/verify-public-knowledge.mjs
```

Review the generated changes, commit them to `main`, and the existing Amplify
workflow deploys the site. The workflow also verifies that the three pages and
their data artifacts exist before uploading the site.
