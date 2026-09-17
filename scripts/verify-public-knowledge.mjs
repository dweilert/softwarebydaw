#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const required = [
  "src/reference-data/index.html",
  "src/math-proof/index.html",
  "src/math-proof/report.html",
  "src/methodology/index.html",
  "src/public-knowledge/data/reference-data-manifest.json",
  "src/public-knowledge/data/reference-data-sources.json",
  "src/public-knowledge/data/validation-report.json",
  "src/public-knowledge/data/validation-report.md",
  "src/public-knowledge/data/publication.json",
];

for (const relative of required) await access(join(root, relative));
const manifest = JSON.parse(await readFile(join(root, "src/public-knowledge/data/reference-data-manifest.json"), "utf8"));
const report = JSON.parse(await readFile(join(root, "src/public-knowledge/data/validation-report.json"), "utf8"));
if (!manifest.bundleVersion || !manifest.taxYear) throw new Error("Reference-data manifest is missing its version or tax year");
if (!report.appVersion || !report.generatedDate || !Array.isArray(report.areas)) throw new Error("Validation report is incomplete");
const renderedReport = await readFile(join(root, "src/math-proof/report.html"), "utf8");
if (!renderedReport.startsWith("<!DOCTYPE html>") || !renderedReport.includes("Calculation Validation Report")) {
  throw new Error("Rendered validation report is not a complete HTML document");
}
console.log(`Public knowledge verified: reference data ${manifest.bundleVersion}/${manifest.taxYear}; validation ${report.appVersion}/${report.generatedDate}`);
