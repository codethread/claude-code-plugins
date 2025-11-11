#!/usr/bin/env bun
/**
 * PreToolUse Hook: Auto-sync claude-code-knowledge documentation when skill loads
 *
 * This hook combines all documentation fetching and syncing logic in one place.
 * It runs transparently before the Skill tool executes, checking if docs need
 * updating and fetching from docs.anthropic.com if necessary.
 *
 * Features:
 * - Smart caching (3-hour threshold)
 * - Automatic sitemap discovery
 * - Retry logic with exponential backoff
 * - Silent failures (never blocks skill loading)
 * - Complete manifest tracking
 */

import { existsSync } from 'fs';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { XMLParser } from 'fast-xml-parser';
import { createHash } from 'crypto';

// ============================================================================
// Constants
// ============================================================================

const SITEMAP_URLS = [
  'https://docs.anthropic.com/sitemap.xml',
  'https://docs.claude.com/sitemap.xml',
];

const MANIFEST_FILE = 'docs_manifest.json';

const HEADERS = {
  'User-Agent': 'Claude-Code-Knowledge-Skill/1.0',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // ms
const MAX_RETRY_DELAY = 30000; // ms
const RATE_LIMIT_DELAY = 500; // ms

// ============================================================================
// Types
// ============================================================================

interface HookInput {
  session_id: string;
  transcript_path: string;
  cwd: string;
  permission_mode: string;
  hook_event_name: string;
  tool_name: string;
  tool_input: {
    skill?: string;
    [key: string]: any;
  };
}

interface ManifestFile {
  original_url?: string;
  original_md_url?: string;
  original_raw_url?: string;
  hash: string;
  last_updated: string;
  source?: string;
}

interface Manifest {
  files: Record<string, ManifestFile>;
  last_updated?: string;
  source?: string;
  skill?: string;
  fetch_metadata?: {
    last_fetch_completed: string;
    fetch_duration_seconds: number;
    total_pages_discovered: number;
    pages_fetched_successfully: number;
    pages_failed: number;
    failed_pages: string[];
    sitemap_url: string;
    base_url: string;
    total_files: number;
  };
}

// ============================================================================
// Path Resolution
// ============================================================================

const SCRIPT_DIR = dirname(new URL(import.meta.url).pathname);
const PLUGIN_ROOT = join(SCRIPT_DIR, '..');
const DOCS_DIR = join(PLUGIN_ROOT, 'skills/claude-code-knowledge/docs');
const MANIFEST_PATH = join(DOCS_DIR, MANIFEST_FILE);

// ============================================================================
// Hook Input Handling
// ============================================================================

async function readHookInput(): Promise<HookInput | null> {
  try {
    const input = await Bun.stdin.text();
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function shouldSync(hookInput: HookInput | null): boolean {
  if (!hookInput) return false;
  if (hookInput.tool_name !== 'Skill') return false;

  const skillName = hookInput.tool_input.skill || '';
  return (
    skillName === 'claude-code-knowledge' ||
    skillName === 'claude-code-knowledge:claude-code-knowledge'
  );
}

// ============================================================================
// Sync Need Detection
// ============================================================================

async function checkIfSyncNeeded(): Promise<boolean> {
  if (!existsSync(MANIFEST_PATH)) {
    return true; // First time, need to fetch
  }

  try {
    const manifestContent = await readFile(MANIFEST_PATH, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    const lastUpdate = manifest.last_updated || 'unknown';

    if (lastUpdate === 'unknown') return true;

    const lastUpdateDate = new Date(lastUpdate.slice(0, 19));
    const currentDate = new Date();
    const hoursSinceUpdate = Math.floor(
      (currentDate.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60)
    );

    return hoursSinceUpdate >= 3;
  } catch {
    return true; // Error reading manifest, re-fetch
  }
}

// ============================================================================
// Manifest Management
// ============================================================================

async function loadManifest(): Promise<Manifest> {
  if (existsSync(MANIFEST_PATH)) {
    try {
      const content = await readFile(MANIFEST_PATH, 'utf-8');
      const manifest = JSON.parse(content);
      if (!manifest.files) manifest.files = {};
      return manifest;
    } catch {
      // Ignore error, return empty manifest
    }
  }
  return { files: {}, last_updated: undefined };
}

async function saveManifest(manifest: Manifest): Promise<void> {
  manifest.last_updated = new Date().toISOString();
  manifest.source = 'https://docs.anthropic.com/en/docs/claude-code/';
  manifest.skill = 'claude-code-knowledge';
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

// ============================================================================
// Utility Functions
// ============================================================================

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function urlToSafeFilename(urlPath: string): string {
  const prefixes = ['/en/docs/claude-code/', '/docs/claude-code/', '/claude-code/'];

  let path = urlPath;
  for (const prefix of prefixes) {
    if (urlPath.includes(prefix)) {
      path = urlPath.split(prefix).pop() || urlPath;
      break;
    }
  }

  if (path === urlPath && urlPath.includes('claude-code/')) {
    path = urlPath.split('claude-code/').pop() || urlPath;
  }

  if (!path.includes('/')) {
    return path.endsWith('.md') ? path : `${path}.md`;
  }

  let safeName = path.replace(/\//g, '__');
  if (!safeName.endsWith('.md')) {
    safeName += '.md';
  }

  return safeName;
}

function contentHasChanged(content: string, oldHash: string): boolean {
  const newHash = createHash('sha256').update(content, 'utf-8').digest('hex');
  return newHash !== oldHash;
}

// ============================================================================
// Sitemap and Page Discovery
// ============================================================================

async function discoverSitemapAndBaseUrl(): Promise<{ sitemapUrl: string; baseUrl: string }> {
  for (const sitemapUrl of SITEMAP_URLS) {
    try {
      const response = await fetch(sitemapUrl, { headers: HEADERS });

      if (response.status === 200) {
        const content = await response.text();
        const parser = new XMLParser();
        const result = parser.parse(content);

        let firstUrl: string | null = null;
        if (result.urlset?.url) {
          const urls = Array.isArray(result.urlset.url) ? result.urlset.url : [result.urlset.url];
          if (urls[0]?.loc) {
            firstUrl = urls[0].loc;
          }
        }

        if (firstUrl) {
          const url = new URL(firstUrl);
          const baseUrl = `${url.protocol}//${url.hostname}`;
          return { sitemapUrl, baseUrl };
        }
      }
    } catch {
      continue;
    }
  }

  throw new Error('Could not find a valid sitemap');
}

function getFallbackPages(): string[] {
  return [
    '/en/docs/claude-code/overview',
    '/en/docs/claude-code/quickstart',
    '/en/docs/claude-code/setup',
    '/en/docs/claude-code/cli-reference',
    '/en/docs/claude-code/common-workflows',
    '/en/docs/claude-code/interactive-mode',
    '/en/docs/claude-code/settings',
    '/en/docs/claude-code/model-config',
    '/en/docs/claude-code/network-config',
    '/en/docs/claude-code/terminal-config',
    '/en/docs/claude-code/output-styles',
    '/en/docs/claude-code/statusline',
    '/en/docs/claude-code/hooks',
    '/en/docs/claude-code/hooks-guide',
    '/en/docs/claude-code/mcp',
    '/en/docs/claude-code/skills',
    '/en/docs/claude-code/slash-commands',
    '/en/docs/claude-code/plugins',
    '/en/docs/claude-code/plugins-reference',
    '/en/docs/claude-code/plugin-marketplaces',
    '/en/docs/claude-code/sub-agents',
    '/en/docs/claude-code/memory',
    '/en/docs/claude-code/checkpointing',
    '/en/docs/claude-code/analytics',
    '/en/docs/claude-code/monitoring-usage',
    '/en/docs/claude-code/costs',
    '/en/docs/claude-code/github-actions',
    '/en/docs/claude-code/gitlab-ci-cd',
    '/en/docs/claude-code/vs-code',
    '/en/docs/claude-code/jetbrains',
    '/en/docs/claude-code/devcontainer',
    '/en/docs/claude-code/claude-code-on-the-web',
    '/en/docs/claude-code/third-party-integrations',
    '/en/docs/claude-code/amazon-bedrock',
    '/en/docs/claude-code/google-vertex-ai',
    '/en/docs/claude-code/llm-gateway',
    '/en/docs/claude-code/iam',
    '/en/docs/claude-code/security',
    '/en/docs/claude-code/sandboxing',
    '/en/docs/claude-code/data-usage',
    '/en/docs/claude-code/legal-and-compliance',
    '/en/docs/claude-code/headless',
    '/en/docs/claude-code/troubleshooting',
    '/en/docs/claude-code/sdk/migration-guide',
  ];
}

async function discoverClaudeCodePages(sitemapUrl: string): Promise<string[]> {
  try {
    const response = await fetch(sitemapUrl, { headers: HEADERS });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const content = await response.text();
    const parser = new XMLParser();
    const result = parser.parse(content);

    let urls: string[] = [];
    if (result.urlset?.url) {
      const urlEntries = Array.isArray(result.urlset.url) ? result.urlset.url : [result.urlset.url];
      urls = urlEntries.map((entry: any) => entry.loc).filter((loc: any) => loc);
    }

    const claudeCodePages: string[] = [];
    const englishPatterns = ['/en/docs/claude-code/'];

    for (const url of urls) {
      if (englishPatterns.some((pattern) => url.includes(pattern))) {
        const urlObj = new URL(url);
        let path = urlObj.pathname;

        if (path.endsWith('.html')) {
          path = path.slice(0, -5);
        } else if (path.endsWith('/')) {
          path = path.slice(0, -1);
        }

        const skipPatterns = ['/tool-use/', '/examples/', '/legacy/', '/api/', '/reference/'];
        if (!skipPatterns.some((skip) => path.includes(skip))) {
          claudeCodePages.push(path);
        }
      }
    }

    const uniquePages = [...new Set(claudeCodePages)].sort();

    if (uniquePages.length === 0) {
      return getFallbackPages();
    }

    return uniquePages;
  } catch {
    return getFallbackPages();
  }
}

// ============================================================================
// Content Fetching
// ============================================================================

function validateMarkdownContent(content: string, _filename: string): void {
  if (!content || content.startsWith('<!DOCTYPE') || content.slice(0, 100).includes('<html')) {
    throw new Error('Received HTML instead of markdown');
  }

  if (content.trim().length < 50) {
    throw new Error(`Content too short (${content.length} bytes)`);
  }

  const lines = content.split('\n');
  const markdownIndicators = ['# ', '## ', '### ', '```', '- ', '* ', '1. ', '[', '**', '_', '> '];

  const indicatorCount = lines.slice(0, 50).reduce((count, line) => {
    return (
      count +
      markdownIndicators.filter(
        (indicator) => line.trim().startsWith(indicator) || line.includes(indicator)
      ).length
    );
  }, 0);

  if (indicatorCount < 3) {
    throw new Error(`Content doesn't appear to be markdown (${indicatorCount} indicators found)`);
  }
}

async function fetchMarkdownContent(
  path: string,
  baseUrl: string
): Promise<{ filename: string; content: string }> {
  const markdownUrl = `${baseUrl}${path}.md`;
  const filename = urlToSafeFilename(path);

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(markdownUrl, {
        headers: HEADERS,
        redirect: 'follow',
      });

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
        await sleep(retryAfter * 1000);
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const content = await response.text();
      validateMarkdownContent(content, filename);

      return { filename, content };
    } catch (e) {
      if (attempt < MAX_RETRIES - 1) {
        const delay = Math.min(RETRY_DELAY * Math.pow(2, attempt), MAX_RETRY_DELAY);
        const jitteredDelay = delay * (0.5 + Math.random() * 0.5);
        await sleep(jitteredDelay);
      } else {
        throw new Error(`Failed to fetch ${filename} after ${MAX_RETRIES} attempts: ${e}`);
      }
    }
  }

  throw new Error(`Failed to fetch ${path}`);
}

async function fetchChangelog(): Promise<{ filename: string; content: string }> {
  const changelogUrl = 'https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md';
  const filename = 'changelog.md';

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(changelogUrl, {
        headers: HEADERS,
        redirect: 'follow',
      });

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
        await sleep(retryAfter * 1000);
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const content = await response.text();

      const header = `# Claude Code Changelog

> **Source**: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
>
> This is the official Claude Code release changelog from the Claude Code repository.

---

`;
      const fullContent = header + content;

      if (fullContent.trim().length < 100) {
        throw new Error(`Changelog content too short (${fullContent.length} bytes)`);
      }

      return { filename, content: fullContent };
    } catch (e) {
      if (attempt < MAX_RETRIES - 1) {
        const delay = Math.min(RETRY_DELAY * Math.pow(2, attempt), MAX_RETRY_DELAY);
        const jitteredDelay = delay * (0.5 + Math.random() * 0.5);
        await sleep(jitteredDelay);
      } else {
        throw new Error(`Failed to fetch changelog after ${MAX_RETRIES} attempts: ${e}`);
      }
    }
  }

  throw new Error('Failed to fetch changelog');
}

async function saveMarkdownFile(filename: string, content: string): Promise<string> {
  const filePath = join(DOCS_DIR, filename);
  await writeFile(filePath, content, 'utf-8');
  const contentHash = createHash('sha256').update(content, 'utf-8').digest('hex');
  return contentHash;
}

// ============================================================================
// Main Fetch Logic
// ============================================================================

async function runFetch(): Promise<void> {
  const startTime = Date.now();

  // Create docs directory if needed
  if (!existsSync(DOCS_DIR)) {
    await mkdir(DOCS_DIR, { recursive: true });
  }

  // Load existing manifest
  const manifest = await loadManifest();

  // Statistics
  let successful = 0;
  let failed = 0;
  const failedPages: string[] = [];
  const newManifest: Manifest = { files: {} };

  // Discover sitemap and base URL
  let sitemapUrl: string;
  let baseUrl: string;

  try {
    const result = await discoverSitemapAndBaseUrl();
    sitemapUrl = result.sitemapUrl;
    baseUrl = result.baseUrl;
  } catch (e) {
    throw new Error(`Failed to discover sitemap: ${e}`);
  }

  // Discover documentation pages
  const documentationPages = await discoverClaudeCodePages(sitemapUrl);

  if (documentationPages.length === 0) {
    throw new Error('No documentation pages discovered!');
  }

  // Fetch each page
  for (let i = 0; i < documentationPages.length; i++) {
    const pagePath = documentationPages[i];

    try {
      const { filename, content } = await fetchMarkdownContent(pagePath, baseUrl);

      const oldHash = manifest.files[filename]?.hash || '';
      const oldEntry = manifest.files[filename] || {};
      const filePath = join(DOCS_DIR, filename);
      const fileExists = existsSync(filePath);

      let contentHash: string;
      let lastUpdated: string;

      if (!fileExists || contentHasChanged(content, oldHash)) {
        contentHash = await saveMarkdownFile(filename, content);
        lastUpdated = new Date().toISOString();
      } else {
        contentHash = oldHash;
        lastUpdated = oldEntry.last_updated || new Date().toISOString();
      }

      newManifest.files[filename] = {
        original_url: `${baseUrl}${pagePath}`,
        original_md_url: `${baseUrl}${pagePath}.md`,
        hash: contentHash,
        last_updated: lastUpdated,
      };

      successful++;

      if (i < documentationPages.length - 1) {
        await sleep(RATE_LIMIT_DELAY);
      }
    } catch (e) {
      failed++;
      failedPages.push(pagePath);
    }
  }

  // Fetch changelog
  try {
    const { filename, content } = await fetchChangelog();

    const oldHash = manifest.files[filename]?.hash || '';
    const oldEntry = manifest.files[filename] || {};
    const filePath = join(DOCS_DIR, filename);
    const fileExists = existsSync(filePath);

    let contentHash: string;
    let lastUpdated: string;

    if (!fileExists || contentHasChanged(content, oldHash)) {
      contentHash = await saveMarkdownFile(filename, content);
      lastUpdated = new Date().toISOString();
    } else {
      contentHash = oldHash;
      lastUpdated = oldEntry.last_updated || new Date().toISOString();
    }

    newManifest.files[filename] = {
      original_url: 'https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md',
      original_raw_url:
        'https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md',
      hash: contentHash,
      last_updated: lastUpdated,
      source: 'claude-code-repository',
    };

    successful++;
  } catch (e) {
    failed++;
    failedPages.push('changelog');
  }

  // Add metadata
  const duration = (Date.now() - startTime) / 1000;
  newManifest.fetch_metadata = {
    last_fetch_completed: new Date().toISOString(),
    fetch_duration_seconds: duration,
    total_pages_discovered: documentationPages.length,
    pages_fetched_successfully: successful,
    pages_failed: failed,
    failed_pages: failedPages,
    sitemap_url: sitemapUrl,
    base_url: baseUrl,
    total_files: successful,
  };

  // Save manifest
  await saveManifest(newManifest);

  // If no pages were fetched successfully, throw error
  if (successful === 0) {
    throw new Error('No pages were fetched successfully!');
  }
}

// ============================================================================
// Main Hook Logic
// ============================================================================

async function main() {
  // Read hook input
  const hookInput = await readHookInput();

  // Check if we should sync
  if (!shouldSync(hookInput)) {
    process.exit(0);
  }

  // Check if sync is needed
  const syncNeeded = await checkIfSyncNeeded();

  if (!syncNeeded) {
    process.exit(0);
  }

  // Run fetch (blocks, but with timeout handled by hook system)
  try {
    await runFetch();
  } catch {
    // Silent failure - don't block skill loading
  }

  // Always exit 0 (non-blocking, silent)
  process.exit(0);
}

// Run main function
main().catch(() => {
  // Silent failure - always exit 0
  process.exit(0);
});
