#!/usr/bin/env bun

/**
 * Stop Hook: Documentation Check
 *
 * Blocks the stop event once per session to ensure all relevant documentation
 * has been updated for any modified files.
 *
 * For each changed file, traverses from the file's directory up to the project
 * root, identifying all README.md and CLAUDE.md files that may need updating.
 */

import { execSync } from "child_process";
import { existsSync } from "fs";
import { dirname, join, relative } from "path";

interface HookInput {
  session_id: string;
  transcript_path: string;
  cwd: string;
  permission_mode: string;
  hook_event_name: string;
  stop_hook_active: boolean;
  [key: string]: unknown;
}

interface HookOutput {
  decision?: "block";
  reason?: string;
}

// Read input from stdin
const input = await Bun.stdin.text();
const hookInput: HookInput = JSON.parse(input);

// If hook already ran this session (continuing after previous block), allow stop
if (hookInput.stop_hook_active) {
  process.exit(0);
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
📚 Documentation Check

Before stopping: Review documentation for any files you modified this session.

Files changed in repo (${modifiedFiles.length}):
${modifiedList}

Documentation files (${docFilesToCheck.size}):
${docList}

Action required:
• Identify which files you changed this session (ignore pre-existing changes)
• Update relevant docs above to reflect your changes only
• Once docs match your changes, you may stop
</project-stop-doc-check-suggestion>`;

const output: HookOutput = {
  decision: "block",
  reason: additionalContext.trim(),
};

console.log(JSON.stringify(output, null, 2));
process.exit(0);
