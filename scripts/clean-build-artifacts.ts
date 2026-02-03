#!/usr/bin/env bun

/**
 * Removes bun build artifacts (files matching pattern: .<artifact-id>.bun-build)
 * from all workspace directories defined in package.json
 */

import { readdir, unlink } from "node:fs/promises";
import { join } from "node:path";

const BUILD_ARTIFACT_PATTERN = /^\.[a-f0-9]+-[a-f0-9]+\.bun-build$/;

async function expandWorkspacePattern(pattern: string): Promise<string[]> {
	// Handle simple patterns like "lib", "plugins/*", ".claude/hooks"
	if (!pattern.includes("*")) {
		return [pattern];
	}

	// Handle wildcard patterns like "plugins/*"
	const [baseDir, ...rest] = pattern.split("/");
	if (rest.join("/") === "*") {
		try {
			const entries = await readdir(baseDir, { withFileTypes: true });
			return entries
				.filter((entry) => entry.isDirectory())
				.map((entry) => join(baseDir, entry.name));
		} catch {
			return [];
		}
	}

	// For more complex patterns, fall back to just the pattern
	return [pattern];
}

async function findBuildArtifacts(dir: string): Promise<string[]> {
	try {
		const entries = await readdir(dir);
		return entries
			.filter((entry) => BUILD_ARTIFACT_PATTERN.test(entry))
			.map((entry) => join(dir, entry));
	} catch {
		return [];
	}
}

async function main() {
	// Read root package.json to get workspaces
	const packageJson = await Bun.file("package.json").json();
	const workspaces: string[] = packageJson.workspaces || [];

	if (workspaces.length === 0) {
		console.log("No workspaces found in package.json");
		return;
	}

	// Expand workspace patterns to actual directories concurrently
	const workspaceDirArrays = await Promise.all(
		workspaces.map((pattern) => expandWorkspacePattern(pattern)),
	);
	const workspaceDirs = workspaceDirArrays.flat();

	console.log(
		`Scanning ${workspaceDirs.length} workspace(s) for build artifacts...`,
	);

	// Find all build artifacts concurrently
	const artifactArrays = await Promise.all(
		workspaceDirs.map((dir) => findBuildArtifacts(dir)),
	);
	const artifacts = artifactArrays.flat();

	if (artifacts.length === 0) {
		console.log("No build artifacts found");
		return;
	}

	// Remove artifacts concurrently
	await Promise.all(artifacts.map((artifact) => unlink(artifact)));

	// Report results
	const artifactsByDir = new Map<string, number>();
	for (const artifact of artifacts) {
		const dir = artifact.substring(0, artifact.lastIndexOf("/"));
		artifactsByDir.set(dir, (artifactsByDir.get(dir) || 0) + 1);
	}

	console.log(`\nRemoved ${artifacts.length} build artifact(s):`);
	for (const [dir, count] of artifactsByDir.entries()) {
		console.log(`  ${dir}: ${count} file(s)`);
	}
}

main().catch((error) => {
	console.error("Failed to clean build artifacts:", error);
	process.exit(1);
});
