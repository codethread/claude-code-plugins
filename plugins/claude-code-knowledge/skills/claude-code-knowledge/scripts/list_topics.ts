#!/usr/bin/env bun
/**
 * List available documentation topics
 * Reads from docs_manifest.json when available, falls back to directory listing
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const SCRIPT_DIR = dirname(new URL(import.meta.url).pathname);
const DOCS_DIR = join(SCRIPT_DIR, "../docs");
const MANIFEST_PATH = join(DOCS_DIR, "docs_manifest.json");

interface ManifestEntry {
  original_url: string;
  original_md_url: string;
  hash: string;
  last_updated: string;
}

interface Manifest {
  files: Record<string, ManifestEntry>;
  last_sync?: string;
  source?: string;
}

if (!existsSync(DOCS_DIR)) {
  console.error(`Error: Documentation directory not found at ${DOCS_DIR}`);
  console.error("The skill will automatically sync documentation when loaded.");
  process.exit(1);
}

console.log("Available Claude Code documentation topics:");
console.log("");

try {
  let topics: string[] = [];
  let useManifest = false;
  let lastSync: string | undefined;

  // Try to read from manifest first (authoritative source)
  if (existsSync(MANIFEST_PATH)) {
    try {
      const manifestContent = readFileSync(MANIFEST_PATH, "utf-8");
      const manifest: Manifest = JSON.parse(manifestContent);
      topics = Object.keys(manifest.files)
        .map((file) => basename(file, ".md"))
        .sort();
      lastSync = manifest.last_sync;
      useManifest = true;
    } catch (e) {
      console.error(
        "Warning: Could not read manifest, falling back to directory listing",
      );
    }
  }

  // Fallback: list files directly
  if (!useManifest) {
    topics = readdirSync(DOCS_DIR)
      .filter((file) => file.endsWith(".md"))
      .map((file) => basename(file, ".md"))
      .sort();
  }

  for (const topic of topics) {
    console.log(`- [${topic}](docs/${topic}.md)`);
  }

  console.log("");

  if (lastSync) {
    const syncDate = new Date(lastSync);
    console.log(`Last synced: ${syncDate.toLocaleString()}`);
  }

  console.log(
    "Source: Documentation automatically synced from docs.anthropic.com",
  );
} catch (e) {
  console.error(`Error reading documentation: ${e}`);
  process.exit(1);
}
