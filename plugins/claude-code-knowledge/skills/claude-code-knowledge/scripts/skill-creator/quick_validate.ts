#!/usr/bin/env bun
/**
 * Quick validation script for skills - minimal version
 */

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

interface ValidationResult {
  valid: boolean;
  message: string;
}

async function validateSkill(skillPath: string): Promise<ValidationResult> {
  // Check SKILL.md exists
  const skillMd = join(skillPath, 'SKILL.md');

  if (!existsSync(skillMd)) {
    return { valid: false, message: 'SKILL.md not found' };
  }

  // Read and validate frontmatter
  const content = await readFile(skillMd, 'utf-8');

  if (!content.startsWith('---')) {
    return { valid: false, message: 'No YAML frontmatter found' };
  }

  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n(.*?)\n---/s);

  if (!frontmatterMatch) {
    return { valid: false, message: 'Invalid frontmatter format' };
  }

  const frontmatter = frontmatterMatch[1];

  // Check required fields
  if (!frontmatter.includes('name:')) {
    return { valid: false, message: "Missing 'name' in frontmatter" };
  }

  if (!frontmatter.includes('description:')) {
    return { valid: false, message: "Missing 'description' in frontmatter" };
  }

  // Extract name for validation
  const nameMatch = frontmatter.match(/name:\s*(.+)/);

  if (nameMatch) {
    const name = nameMatch[1].trim();

    // Check naming convention (hyphen-case: lowercase with hyphens)
    if (!/^[a-z0-9-]+$/.test(name)) {
      return {
        valid: false,
        message: `Name '${name}' should be hyphen-case (lowercase letters, digits, and hyphens only)`,
      };
    }

    if (name.startsWith('-') || name.endsWith('-') || name.includes('--')) {
      return {
        valid: false,
        message: `Name '${name}' cannot start/end with hyphen or contain consecutive hyphens`,
      };
    }
  }

  // Extract and validate description
  const descMatch = frontmatter.match(/description:\s*(.+)/);

  if (descMatch) {
    const description = descMatch[1].trim();

    // Check for angle brackets
    if (description.includes('<') || description.includes('>')) {
      return { valid: false, message: 'Description cannot contain angle brackets (< or >)' };
    }
  }

  return { valid: true, message: 'Skill is valid!' };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.log('Usage: bun quick_validate.ts <skill_directory>');
    process.exit(1);
  }

  const { valid, message } = await validateSkill(args[0]);
  console.log(message);
  process.exit(valid ? 0 : 1);
}

// Export for use in other scripts
export { validateSkill };

// Only run main if this is the main module
if (import.meta.main) {
  main();
}
