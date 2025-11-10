#!/usr/bin/env bun
import { readFileSync } from "fs";

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
    const input = readFileSync(0, "utf-8");
    const data: HookInput = JSON.parse(input);

    // Check if the tool was Write, Edit, or MultiEdit
    const relevantTools = ["Write", "Edit", "MultiEdit"];
    if (!relevantTools.includes(data.tool_name)) {
      process.exit(0);
    }

    // Check if any markdown files were modified
    let isMarkdownFile = false;
    let filePath = "";

    if (data.tool_name === "Write" || data.tool_name === "Edit") {
      // Single file operations
      filePath = data.tool_input.file_path as string;
      if (filePath && filePath.toLowerCase().endsWith(".md")) {
        isMarkdownFile = true;
      }
    } else if (data.tool_name === "MultiEdit") {
      // MultiEdit might have multiple files
      const edits = data.tool_input.edits as Array<{ file_path: string }>;
      if (edits && Array.isArray(edits)) {
        for (const edit of edits) {
          if (edit.file_path && edit.file_path.toLowerCase().endsWith(".md")) {
            isMarkdownFile = true;
            filePath = edit.file_path;
            break;
          }
        }
      }
    }

    // If a markdown file was modified, suggest the doc-writer skill
    if (isMarkdownFile) {
      let context = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
      context += "📝 DOCUMENTATION QUALITY SUGGESTION\n";
      context += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
      context += `💡 Detected markdown file modification: ${filePath}\n\n`;
      context += "📖 RECOMMENDED SKILL:\n";
      context += "  → doc-writer:writing-documentation\n\n";
      context += "This skill provides:\n";
      context += "  • Industry best practices from React, Stripe, etc.\n";
      context += "  • API verification workflow (researcher + Context7)\n";
      context += "  • Production-ready code examples\n";
      context += "  • Security verification patterns\n\n";
      context += "📋 RECOMMENDED AGENT:\n";
      context += "  → doc-writer:docs-reviewer\n\n";
      context += "IMPORTANT: Use the Skill tool to load writing-documentation\n";
      context += "before writing documentation. This provides essential patterns\n";
      context += "for API verification, security checks, and production-ready\n";
      context += "examples. For existing docs, use docs-reviewer agent to\n";
      context += "ruthlessly simplify and improve.\n";
      context += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

      // Return JSON with hookSpecificOutput for PostToolUse
      // Note: decision is undefined (no blocking), but additionalContext should still be provided
      const output = {
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext: context,
        },
      };

      console.log(JSON.stringify(output));
    }

    // Exit 0 = success, additionalContext is added to context if provided
    process.exit(0);
  } catch (err) {
    console.error("Error in doc-writer-suggest hook:", err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Uncaught error:", err);
  process.exit(1);
});
