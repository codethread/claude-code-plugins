#!/usr/bin/env bun
import { readFileSync } from "fs";

interface HookInput {
  session_id: string;
  transcript_path: string;
  cwd: string;
  permission_mode: string;
  prompt: string;
}

async function main() {
  try {
    // Read input from stdin
    const input = readFileSync(0, "utf-8");
    const data: HookInput = JSON.parse(input);
    const prompt = data.prompt.toLowerCase();

    // Check for Claude Code related keywords (case insensitive)
    const claudeCodeKeywords = ["claude code", "claudecode", "claude-code"];

    // Check for standalone "claude" but be more selective to avoid false positives
    const standaloneClaudePatterns = [
      /\bclaude\b(?!\s+sonnet|\s+opus|\s+haiku)/i, // "claude" not followed by model names
      /how\s+(?:do|does|can)\s+claude/i, // "how do/does/can claude..."
      /can\s+claude/i, // "can claude..."
      /does\s+claude/i, // "does claude..."
      /is\s+claude/i, // "is claude..."
      /tell\s+claude/i, // "tell claude..."
      /ask\s+claude/i, // "ask claude..."
    ];

    // Additional Claude Code related patterns
    const claudeCodePatterns = [
      /\bhook/i,
      /\bmcp\s+server/i,
      /\bskill/i,
      /slash\s+command/i,
      /claude.*setting/i,
      /claude.*config/i,
      /claude.*feature/i,
      /claude.*capability/i,
      /how\s+(?:do|does)\s+(?:i|claude).*(hook|mcp|skill|command)/i,
    ];

    let isMatch = false;
    let matchReason = "";

    // Check for exact keyword matches
    for (const keyword of claudeCodeKeywords) {
      if (prompt.includes(keyword)) {
        isMatch = true;
        matchReason = `Detected "${keyword}"`;
        break;
      }
    }

    // Check for standalone Claude mentions
    if (!isMatch) {
      for (const pattern of standaloneClaudePatterns) {
        if (pattern.test(prompt)) {
          isMatch = true;
          matchReason = "Detected Claude Code question";
          break;
        }
      }
    }

    // Check for Claude Code feature patterns
    if (!isMatch) {
      for (const pattern of claudeCodePatterns) {
        if (pattern.test(prompt)) {
          isMatch = true;
          matchReason = "Detected Claude Code feature mention";
          break;
        }
      }
    }

    // Generate context injection if match found
    if (isMatch) {
      // Use JSON output method for explicit control
      let context = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
      context += "📚 CLAUDE CODE DOCUMENTATION CONTEXT\n";
      context += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
      context += `💡 Detection: ${matchReason}\n\n`;
      context += "📖 RECOMMENDED SKILL:\n";
      context += "  → claude-code-knowledge:claude-code-knowledge\n\n";
      context += "This skill provides:\n";
      context += "  • Official Claude Code documentation\n";
      context += "  • 45+ topics covering all features\n";
      context += "  • Hooks, MCP, skills, settings, CLI\n";
      context += "  • Auto-synced from docs.anthropic.com\n\n";
      context +=
        "IMPORTANT: Use the Skill tool to load claude-code-knowledge\n";
      context += "before answering questions about Claude Code features.\n";
      context += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

      // Return JSON with hookSpecificOutput for UserPromptSubmit
      const output = {
        hookSpecificOutput: {
          hookEventName: "UserPromptSubmit",
          additionalContext: context,
        },
      };

      console.log(JSON.stringify(output));
    }

    // Exit 0 = success, additionalContext is added to context
    process.exit(0);
  } catch (err) {
    console.error("Error in claude-code-prompt hook:", err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Uncaught error:", err);
  process.exit(1);
});
