#!/usr/bin/env bun
/**
 * Sync documentation from docs.anthropic.com
 * This script fetches the latest Claude Code documentation
 */

import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { $ } from 'bun';

const SCRIPT_DIR = dirname(new URL(import.meta.url).pathname);
const DOCS_DIR = join(SCRIPT_DIR, '../docs');
const MANIFEST = join(DOCS_DIR, 'docs_manifest.json');

console.log("Claude Code Knowledge - Documentation Sync");
console.log("==========================================");
console.log("");

// Check if docs exist
if (!existsSync(MANIFEST)) {
  console.log("📥 No local documentation found. Fetching for the first time...");
  console.log("This may take a minute...");
  console.log("");

  await $`bun ${join(SCRIPT_DIR, 'fetch_docs.ts')}`;

  console.log("");
  console.log("✅ Documentation fetched successfully!");
  process.exit(0);
}

// Check last update time
const manifestContent = await readFile(MANIFEST, 'utf-8');
const manifest = JSON.parse(manifestContent);
const lastUpdate = manifest.last_updated || "unknown";

console.log(`📋 Last update: ${lastUpdate}`);
console.log("");

// Check if we should update (if last update was more than 3 hours ago)
if (lastUpdate !== "unknown") {
  try {
    const lastUpdateDate = new Date(lastUpdate.slice(0, 19));
    const currentDate = new Date();
    const hoursSinceUpdate = Math.floor((currentDate.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60));

    if (hoursSinceUpdate < 3) {
      console.log(`✅ Documentation is up to date (updated ${hoursSinceUpdate} hour(s) ago)`);
      console.log("Sync runs automatically every 3 hours from docs.anthropic.com");
      process.exit(0);
    }

    console.log(`🔄 Documentation is ${hoursSinceUpdate} hour(s) old. Checking for updates...`);
  } catch (e) {
    console.log("🔄 Checking for updates...");
  }
} else {
  console.log("🔄 Checking for updates...");
}

console.log("");

// Run fetch to update
await $`bun ${join(SCRIPT_DIR, 'fetch_docs.ts')}`;

console.log("");
console.log("✅ Sync complete!");
