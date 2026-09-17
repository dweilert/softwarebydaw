#!/usr/bin/env node

/**
 * Copy the reviewed, public RP knowledge artifacts into this static site.
 *
 * Usage:
 *   node scripts/sync-rp-public-knowledge.mjs --rp-repo /path/to/rp
 *
 * The default is the local split-worktree used by the RP team. CI or another
 * checkout should pass --rp-repo explicitly so the source is never ambiguous.
 */
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argIndex = process.argv.indexOf("--rp-repo");
const rpRoot = resolve(
  argIndex >= 0 ? process.argv[argIndex + 1] : (process.env.RP_REPO ?? "/Users/bob/rp-desktop-product-split"),
);
const outputRoot = join(siteRoot, "src/public-knowledge/data");
const execFileAsync = promisify(execFile);

async function copyRequired(source, destination) {
  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination);
}

await rm(join(outputRoot, "reference-data"), { recursive: true, force: true });
await mkdir(join(outputRoot, "reference-data"), { recursive: true });
const refDir = join(rpRoot, "reference-data");
const refFiles = [
  "manifest.json",
  "sources.json",
  "awiSeries.json",
  "colaCpi.json",
  "costOfLiving.json",
  "historicalEpisodes.json",
  "historicalReturns.json",
  "homeCareWageByState.json",
  "lifeExpectancy.json",
  "ltcByState.json",
  "medicaidStandards.json",
  "modestBudget.json",
  "parameters.json",
  "rmdUniformLifetime.json",
  "ssaPeriodLifeTable.json",
];
for (const file of refFiles) {
  await copyRequired(join(refDir, file), join(outputRoot, "reference-data", file));
}

await copyRequired(
  join(rpRoot, "app/src/engine/validation/publicReportData.json"),
  join(outputRoot, "validation-report.json"),
);
await copyRequired(
  join(rpRoot, "app/src/engine/validation/reports/PUBLIC-VALIDATION-REPORT.md"),
  join(outputRoot, "validation-report.md"),
);
await execFileAsync(
  process.execPath,
  [
    join(rpRoot, "app/scripts/render-validation-report.mjs"),
    join(rpRoot, "app/src/engine/validation/reports/PUBLIC-VALIDATION-REPORT.md"),
    join(siteRoot, "src/math-proof/report.html"),
  ],
  { cwd: rpRoot },
);

const manifest = JSON.parse(await readFile(join(refDir, "manifest.json"), "utf8"));
const report = JSON.parse(await readFile(join(outputRoot, "validation-report.json"), "utf8"));
await writeFile(
  join(outputRoot, "publication.json"),
  JSON.stringify({
    source: "RP shared engine",
    synchronizedAt: new Date().toISOString(),
    referenceData: { bundleVersion: manifest.bundleVersion, taxYear: manifest.taxYear, manifest: "reference-data/manifest.json" },
    validation: { appVersion: report.appVersion, generatedDate: report.generatedDate, report: "validation-report.md" },
  }, null, 2) + "\n",
);

console.log(`Published RP knowledge artifacts from ${rpRoot}`);
