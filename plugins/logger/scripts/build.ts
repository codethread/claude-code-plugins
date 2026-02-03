#!/usr/bin/env bun

import {chmod} from "node:fs/promises";
import {join} from "node:path";
import {parseArgs} from "node:util";

const PLUGIN_ROOT = join(import.meta.dir, "..");
const SRC_FILE = join(PLUGIN_ROOT, "src", "session-logger.ts");
const DEST_FILE = join(PLUGIN_ROOT, "bin", "session-logger");

async function buildExecutable(verbose = false) {
	if (verbose) {
		console.log("Building session-logger executable...");
	}

	try {
		const result = await Bun.build({
			entrypoints: [SRC_FILE],
			compile: {
				target:
					process.platform === "darwin"
						? process.arch === "arm64"
							? "bun-darwin-arm64"
							: "bun-darwin-x64"
						: process.platform === "linux"
							? "bun-linux-x64"
							: "bun-linux-x64",
				outfile: DEST_FILE,
			},
			minify: true,
			bytecode: true,
			sourcemap: "inline",
		});

		if (!result.success) {
			const errors = result.logs.map((msg) => `  ${msg}`).join("\n");
			console.error(`❌ Build failed:\n${errors}`);
			process.exit(1);
		}

		await chmod(DEST_FILE, 0o755);

		if (verbose) {
			console.log("✅ Successfully built session-logger");
		}
	} catch (error) {
		console.error(`❌ Build failed: ${error}`);
		process.exit(1);
	}
}

if (import.meta.main) {
	const {values} = parseArgs({
		args: Bun.argv.slice(2),
		options: {
			verbose: {type: "boolean", short: "v"},
		},
	});

	await buildExecutable(values.verbose);
}
