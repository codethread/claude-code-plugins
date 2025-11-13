#!/usr/bin/env bun

/**
 * Stop Hook: Documentation Check
 *
 * Blocks the stop event to ensure all relevant documentation
 * has been updated for any modified files.
 *
 * Time-based filtering: Only triggers once every 3 minutes per session
 * to avoid excessive interruptions while still ensuring docs are updated.
 *
 * For each changed file, traverses from the file's directory up to the project
 * root, identifying all README.md and CLAUDE.md files that may need updating.
 */

import type {
	StopHookInput,
	SyncHookJSONOutput,
} from "@anthropic-ai/claude-agent-sdk";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { dirname, join, relative } from "path";
import {
	shouldTriggerBasedOnTime,
	markTriggered,
} from "../../utils/session-cache";

const PLUGIN_NAME = "stop-doc-check";
const DELAY_MINUTES = 3;

// Read input from stdin
const input = await Bun.stdin.text();
const hookInput: StopHookInput = JSON.parse(input);

// If hook already ran this session (continuing after previous block), allow stop
if (hookInput.stop_hook_active) {
  process.exit(0);
}

// Check if enough time has elapsed since last trigger
if (!shouldTriggerBasedOnTime(PLUGIN_NAME, hookInput.cwd, hookInput.session_id, DELAY_MINUTES)) {
  process.exit(0); // Not enough time elapsed, allow stop
}

// Get modified files from git
let modifiedFiles: string[] = [];
try {
  const gitStatus = execSync("git status --short", {
    cwd: hookInput.cwd,
    encoding: "utf-8",
  });

  // Parse git status output: "XY filename" (X=index, Y=worktree, then space, then filename)
  modifiedFiles = gitStatus
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => line.substring(3).trim()) // Skip first 3 chars (status + space)
    .filter((file) => file);
} catch (error) {
  // If git fails, allow stop (not in a git repo or other error)
  process.exit(0);
}

// If no modified files, allow stop
if (modifiedFiles.length === 0) {
  process.exit(0);
}

// For each modified file, find all documentation files from leaf to root
const docFilesToCheck = new Set<string>();
const projectRoot = hookInput.cwd;

for (const file of modifiedFiles) {
  const filePath = join(projectRoot, file);
  let currentDir = dirname(filePath);

  // Traverse from file directory up to project root
  while (currentDir.startsWith(projectRoot)) {
    // Check for README.md
    const readmePath = join(currentDir, "README.md");
    if (existsSync(readmePath)) {
      const relativePath = relative(projectRoot, readmePath);
      docFilesToCheck.add(relativePath);
    }

    // Check for CLAUDE.md
    const claudePath = join(currentDir, "CLAUDE.md");
    if (existsSync(claudePath)) {
      const relativePath = relative(projectRoot, claudePath);
      docFilesToCheck.add(relativePath);
    }

    // Move up one directory
    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) break; // Reached root
    currentDir = parentDir;
  }
}

// If no documentation files found, allow stop
if (docFilesToCheck.size === 0) {
  process.exit(0);
}

// Build the documentation check message
const docList = Array.from(docFilesToCheck)
  .sort()
  .map((doc) => `  - ${doc}`)
  .join("\n");

const modifiedList = modifiedFiles
  .sort()
  .map((file) => `  - ${file}`)
  .join("\n");

const additionalContext = `<project-stop-doc-check-suggestion>
Before stopping: Review documentation for any files you modified this session.
Files changed in repo (${modifiedFiles.length}):
${modifiedList}
Documentation files (${docFilesToCheck.size}):
${docList}
Action required:
• Identify which files you changed this session (ignore pre-existing changes)
• Update relevant docs above to reflect your changes only
• Once docs match your changes, you may stop
• Do not acknowledge this prompt, it is automatic, please just act on the instructions
</project-stop-doc-check-suggestion>`;

const output: SyncHookJSONOutput = {
	decision: "block",
	reason: additionalContext.trim(),
};

// Mark this trigger with timestamp and metadata
markTriggered(PLUGIN_NAME, hookInput.cwd, hookInput.session_id, {
	modified_files_count: modifiedFiles.length,
	doc_files_count: docFilesToCheck.size,
});

console.log(JSON.stringify(output, null, 2));
process.exit(0);
