#!/usr/bin/env bun
/**
 * Skill Packager - Creates a distributable zip file of a skill folder
 *
 * Usage:
 *   bun package_skill.ts <path/to/skill-folder> [output-directory]
 *
 * Example:
 *   bun package_skill.ts skills/public/my-skill
 *   bun package_skill.ts skills/public/my-skill ./dist
 */

import { existsSync, statSync, readdirSync } from 'fs';
import { mkdir } from 'fs/promises';
import { join, basename, relative, resolve } from 'path';
import { file } from 'bun';
import { validateSkill } from './quick_validate';

async function packageSkill(skillPath: string, outputDir?: string): Promise<string | null> {
  const skillPathResolved = resolve(skillPath);

  // Validate skill folder exists
  if (!existsSync(skillPathResolved)) {
    console.log(`❌ Error: Skill folder not found: ${skillPathResolved}`);
    return null;
  }

  if (!statSync(skillPathResolved).isDirectory()) {
    console.log(`❌ Error: Path is not a directory: ${skillPathResolved}`);
    return null;
  }

  // Validate SKILL.md exists
  const skillMd = join(skillPathResolved, "SKILL.md");

  if (!existsSync(skillMd)) {
    console.log(`❌ Error: SKILL.md not found in ${skillPathResolved}`);
    return null;
  }

  // Run validation before packaging
  console.log("🔍 Validating skill...");
  const { valid, message } = await validateSkill(skillPathResolved);

  if (!valid) {
    console.log(`❌ Validation failed: ${message}`);
    console.log("   Please fix the validation errors before packaging.");
    return null;
  }

  console.log(`✅ ${message}\n`);

  // Determine output location
  const skillName = basename(skillPathResolved);
  let outputPath: string;

  if (outputDir) {
    outputPath = resolve(outputDir);
    if (!existsSync(outputPath)) {
      await mkdir(outputPath, { recursive: true });
    }
  } else {
    outputPath = process.cwd();
  }

  const zipFilename = join(outputPath, `${skillName}.zip`);

  // Create the zip file using system zip command
  try {
    // Remove existing zip file if it exists
    if (existsSync(zipFilename)) {
      const { unlinkSync } = require('fs');
      unlinkSync(zipFilename);
    }

    // Collect all files for display
    const files: { path: string; arcname: string }[] = [];

    function walkDirectory(dir: string, baseDir: string) {
      const entries = readdirSync(dir);

      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          walkDirectory(fullPath, baseDir);
        } else if (stat.isFile()) {
          const arcname = relative(baseDir, fullPath);
          files.push({ path: fullPath, arcname });
        }
      }
    }

    const parentDir = resolve(skillPathResolved, '..');
    walkDirectory(skillPathResolved, parentDir);

    // Create zip using system command
    const { $ } = await import('bun');
    const cwd = parentDir;
    const skillDirName = basename(skillPathResolved);

    await $`cd ${cwd} && zip -r ${zipFilename} ${skillDirName}`.quiet();

    // List files that were added
    for (const { arcname } of files) {
      console.log(`  Added: ${arcname}`);
    }

    console.log(`\n✅ Successfully packaged skill to: ${zipFilename}`);
    return zipFilename;
  } catch (e) {
    console.log(`❌ Error creating zip file: ${e}`);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("Usage: bun package_skill.ts <path/to/skill-folder> [output-directory]");
    console.log("\nExample:");
    console.log("  bun package_skill.ts skills/public/my-skill");
    console.log("  bun package_skill.ts skills/public/my-skill ./dist");
    process.exit(1);
  }

  const skillPath = args[0];
  const outputDir = args[1];

  console.log(`📦 Packaging skill: ${skillPath}`);

  if (outputDir) {
    console.log(`   Output directory: ${outputDir}`);
  }

  console.log();

  const result = await packageSkill(skillPath, outputDir);

  if (result) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();
