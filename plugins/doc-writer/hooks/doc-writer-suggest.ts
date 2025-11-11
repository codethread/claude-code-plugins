#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { PostToolUseHookInput, SyncHookJSONOutput } from '@anthropic-ai/claude-agent-sdk';

interface SessionCache {
  doc_writer_suggested: boolean;
  first_triggered: string;
  triggered_by: string;
}

async function main() {
  try {
    // Read input from stdin
    const input = readFileSync(0, 'utf-8');
    const data: PostToolUseHookInput = JSON.parse(input);

    // Check if the tool was Write, Edit, or MultiEdit
    const relevantTools = ['Write', 'Edit', 'MultiEdit'];
    if (!relevantTools.includes(data.tool_name)) {
      process.exit(0);
    }

    // Check if any markdown files were modified
    let isMarkdownFile = false;
    let filePath = '';

    if (data.tool_name === 'Write' || data.tool_name === 'Edit') {
      // Single file operations
      const toolInput = data.tool_input as Record<string, unknown>;
      filePath = toolInput.file_path as string;
      if (filePath?.toLowerCase().endsWith('.md')) {
        isMarkdownFile = true;
      }
    } else if (data.tool_name === 'MultiEdit') {
      // MultiEdit might have multiple files
      const toolInput = data.tool_input as Record<string, unknown>;
      const edits = toolInput.edits as Array<{ file_path: string }>;
      if (edits && Array.isArray(edits)) {
        for (const edit of edits) {
          if (edit.file_path?.toLowerCase().endsWith('.md')) {
            isMarkdownFile = true;
            filePath = edit.file_path;
            break;
          }
        }
      }
    }

    // If a markdown file was modified, suggest the doc-writer skill
    if (isMarkdownFile) {
      // Check session cache - only suggest once per session
      const normalizedCwd = data.cwd.replace(/^\//, '').replace(/\//g, '-');
      const cacheDir = join(
        homedir(),
        '.local/cache/personal-configs-plugins/doc-writer',
        normalizedCwd
      );
      const sessionFile = join(cacheDir, `${data.session_id}.json`);

      // If already suggested this session, exit silently
      if (existsSync(sessionFile)) {
        const session: SessionCache = JSON.parse(readFileSync(sessionFile, 'utf-8'));
        if (session.doc_writer_suggested) {
          process.exit(0);
        }
      }

      let context = '<plugin-doc-writer-suggestion>\n';
      context += `Detected markdown file modification: ${filePath}\n\n`;
      context += 'ESSENTIAL SKILL:\n';
      context += '  → doc-writer:writing-documentation\n\n';
      context += 'RECOMMENDED AGENT:\n';
      context += '  → doc-writer:docs-reviewer\n';
      context += '</plugin-doc-writer-suggestion>';

      // Return JSON with hookSpecificOutput for PostToolUse
      // Note: decision is undefined (no blocking), but additionalContext should still be provided
      const output: SyncHookJSONOutput = {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: context,
        },
      };

      console.log(JSON.stringify(output));

      // Mark as suggested in session cache
      mkdirSync(cacheDir, { recursive: true });
      const sessionCache: SessionCache = {
        doc_writer_suggested: true,
        first_triggered: new Date().toISOString(),
        triggered_by: filePath,
      };
      writeFileSync(sessionFile, JSON.stringify(sessionCache, null, 2));
    }

    // Exit 0 = success, additionalContext is added to context if provided
    process.exit(0);
  } catch (err) {
    console.error('Error in doc-writer-suggest hook:', err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Uncaught error:', err);
  process.exit(1);
});
