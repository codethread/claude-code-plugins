#!/usr/bin/env bun
import { existsSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

interface HookInput {
  session_id: string;
  transcript_path: string;
  cwd: string;
  permission_mode: string;
  hook_event_name: string;
  tool_name: string;
  tool_input: Record<string, unknown>;
  tool_response: unknown;
}

async function main() {
  try {
    // Read input from stdin
    const input = readFileSync(0, 'utf-8');
    const data: HookInput = JSON.parse(input);

    // Check if the tool was Read
    if (data.tool_name !== 'Read') {
      process.exit(0);
    }

    // Get the file path from tool input
    const filePath = data.tool_input.file_path as string;
    if (!filePath) {
      process.exit(0);
    }

    // Check if it's a TypeScript file (but not already a test file)
    const isTypeScriptFile =
      (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) &&
      !filePath.endsWith('.test.ts') &&
      !filePath.endsWith('.test.tsx') &&
      !filePath.endsWith('.spec.ts') &&
      !filePath.endsWith('.spec.tsx');

    if (!isTypeScriptFile) {
      process.exit(0);
    }

    // Look for corresponding test files
    const dir = dirname(filePath);
    const file = basename(filePath);
    const nameWithoutExt = file.replace(/\.tsx?$/, '');

    const testPatterns = [
      `${nameWithoutExt}.test.ts`,
      `${nameWithoutExt}.test.tsx`,
      `${nameWithoutExt}.spec.ts`,
      `${nameWithoutExt}.spec.tsx`,
    ];

    const foundTestFiles: string[] = [];
    for (const pattern of testPatterns) {
      const testPath = join(dir, pattern);
      if (existsSync(testPath)) {
        foundTestFiles.push(testPath);
      }
    }

    // If test files were found, suggest them
    if (foundTestFiles.length > 0) {
      let context = '<plugin-langs-suggestion>\n';
      context += `Source file: ${filePath}\n\n`;
      context += 'Related test file(s):\n';
      for (const testFile of foundTestFiles) {
        context += `  → ${testFile}\n`;
      }
      context += '</plugin-langs-suggestion>';

      // Return JSON with hookSpecificOutput for PostToolUse
      const output = {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: context,
        },
      };

      console.log(JSON.stringify(output));
    }

    // Exit 0 = success
    process.exit(0);
  } catch (err) {
    console.error('Error in test-file-suggest hook:', err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Uncaught error:', err);
  process.exit(1);
});
