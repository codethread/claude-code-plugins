#!/usr/bin/env bun
/**
 * List available documentation topics
 * This script lists all .md files in the docs directory
 */

import { existsSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const SCRIPT_DIR = dirname(new URL(import.meta.url).pathname);
const DOCS_DIR = join(SCRIPT_DIR, '../docs');

if (!existsSync(DOCS_DIR)) {
	console.error(`Error: Documentation directory not found at ${DOCS_DIR}`);
	console.error('Run sync_docs.ts first to fetch documentation.');
	process.exit(1);
}

console.log('Available Claude Code documentation topics:');
console.log('');

try {
	// List all .md files, remove extension, sort
	const files = readdirSync(DOCS_DIR)
		.filter((file) => file.endsWith('.md'))
		.map((file) => basename(file, '.md'))
		.sort();

	for (const topic of files) {
		console.log(`  • ${topic}`);
	}

	console.log('');
	console.log(`Total: ${files.length} topics`);
	console.log('');
	console.log('Usage: cat docs/<topic>.md');
	console.log('Example: cat docs/hooks.md');
} catch (e) {
	console.error(`Error reading docs directory: ${e}`);
	process.exit(1);
}
