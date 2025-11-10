#!/usr/bin/env bun
/**
 * Claude Code Documentation Fetcher for claude-code-knowledge skill
 * Adapted from the original fetch_claude_docs.py
 */

import { existsSync } from 'fs';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { XMLParser } from 'fast-xml-parser';
import { createHash } from 'crypto';

// Constants
const SITEMAP_URLS = [
  "https://docs.anthropic.com/sitemap.xml",
  "https://docs.claude.com/sitemap.xml",
];

const MANIFEST_FILE = "docs_manifest.json";

const HEADERS = {
  'User-Agent': 'Claude-Code-Knowledge-Skill/1.0',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // ms
const MAX_RETRY_DELAY = 30000; // ms
const RATE_LIMIT_DELAY = 500; // ms

// Types
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

// Logging utilities
const log = {
  info: (msg: string) => console.log(`[${new Date().toISOString()}] INFO: ${msg}`),
  warning: (msg: string) => console.warn(`[${new Date().toISOString()}] WARNING: ${msg}`),
  error: (msg: string) => console.error(`[${new Date().toISOString()}] ERROR: ${msg}`)
};

// Utility: Sleep function
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Load manifest
async function loadManifest(docsDir: string): Promise<Manifest> {
  const manifestPath = join(docsDir, MANIFEST_FILE);

  if (existsSync(manifestPath)) {
    try {
      const content = await readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(content);

      if (!manifest.files) {
        manifest.files = {};
      }

      return manifest;
    } catch (e) {
      log.warning(`Failed to load manifest: ${e}`);
    }
  }

  return { files: {}, last_updated: undefined };
}

// Save manifest
async function saveManifest(docsDir: string, manifest: Manifest): Promise<void> {
  const manifestPath = join(docsDir, MANIFEST_FILE);
  manifest.last_updated = new Date().toISOString();
  manifest.source = "https://docs.anthropic.com/en/docs/claude-code/";
  manifest.skill = "claude-code-knowledge";

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
}

// Convert URL to safe filename
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

// Discover sitemap and base URL
async function discoverSitemapAndBaseUrl(): Promise<{ sitemapUrl: string; baseUrl: string }> {
  for (const sitemapUrl of SITEMAP_URLS) {
    try {
      log.info(`Trying sitemap: ${sitemapUrl}`);

      const response = await fetch(sitemapUrl, { headers: HEADERS });

      if (response.status === 200) {
        const content = await response.text();
        const parser = new XMLParser();
        const result = parser.parse(content);

        // Try to find first URL in sitemap
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
          log.info(`Found sitemap at ${sitemapUrl}, base URL: ${baseUrl}`);
          return { sitemapUrl, baseUrl };
        }
      }
    } catch (e) {
      log.warning(`Failed to fetch ${sitemapUrl}: ${e}`);
      continue;
    }
  }

  throw new Error("Could not find a valid sitemap");
}

// Get fallback pages
function getFallbackPages(): string[] {
  return [
    "/en/docs/claude-code/overview",
    "/en/docs/claude-code/quickstart",
    "/en/docs/claude-code/setup",
    "/en/docs/claude-code/cli-reference",
    "/en/docs/claude-code/common-workflows",
    "/en/docs/claude-code/interactive-mode",
    "/en/docs/claude-code/settings",
    "/en/docs/claude-code/model-config",
    "/en/docs/claude-code/network-config",
    "/en/docs/claude-code/terminal-config",
    "/en/docs/claude-code/output-styles",
    "/en/docs/claude-code/statusline",
    "/en/docs/claude-code/hooks",
    "/en/docs/claude-code/hooks-guide",
    "/en/docs/claude-code/mcp",
    "/en/docs/claude-code/skills",
    "/en/docs/claude-code/slash-commands",
    "/en/docs/claude-code/plugins",
    "/en/docs/claude-code/plugins-reference",
    "/en/docs/claude-code/plugin-marketplaces",
    "/en/docs/claude-code/sub-agents",
    "/en/docs/claude-code/memory",
    "/en/docs/claude-code/checkpointing",
    "/en/docs/claude-code/analytics",
    "/en/docs/claude-code/monitoring-usage",
    "/en/docs/claude-code/costs",
    "/en/docs/claude-code/github-actions",
    "/en/docs/claude-code/gitlab-ci-cd",
    "/en/docs/claude-code/vs-code",
    "/en/docs/claude-code/jetbrains",
    "/en/docs/claude-code/devcontainer",
    "/en/docs/claude-code/claude-code-on-the-web",
    "/en/docs/claude-code/third-party-integrations",
    "/en/docs/claude-code/amazon-bedrock",
    "/en/docs/claude-code/google-vertex-ai",
    "/en/docs/claude-code/llm-gateway",
    "/en/docs/claude-code/iam",
    "/en/docs/claude-code/security",
    "/en/docs/claude-code/sandboxing",
    "/en/docs/claude-code/data-usage",
    "/en/docs/claude-code/legal-and-compliance",
    "/en/docs/claude-code/headless",
    "/en/docs/claude-code/troubleshooting",
    "/en/docs/claude-code/sdk/migration-guide",
  ];
}

// Discover Claude Code pages from sitemap
async function discoverClaudeCodePages(sitemapUrl: string): Promise<string[]> {
  log.info("Discovering documentation pages from sitemap...");

  try {
    const response = await fetch(sitemapUrl, { headers: HEADERS });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const content = await response.text();
    const parser = new XMLParser();
    const result = parser.parse(content);

    let urls: string[] = [];

    if (result.urlset?.url) {
      const urlEntries = Array.isArray(result.urlset.url) ? result.urlset.url : [result.urlset.url];
      urls = urlEntries.map((entry: any) => entry.loc).filter((loc: any) => loc);
    }

    log.info(`Found ${urls.length} total URLs in sitemap`);

    // Filter for English Claude Code documentation pages
    const claudeCodePages: string[] = [];
    const englishPatterns = ['/en/docs/claude-code/'];

    for (const url of urls) {
      if (englishPatterns.some(pattern => url.includes(pattern))) {
        const urlObj = new URL(url);
        let path = urlObj.pathname;

        if (path.endsWith('.html')) {
          path = path.slice(0, -5);
        } else if (path.endsWith('/')) {
          path = path.slice(0, -1);
        }

        const skipPatterns = ['/tool-use/', '/examples/', '/legacy/', '/api/', '/reference/'];
        if (!skipPatterns.some(skip => path.includes(skip))) {
          claudeCodePages.push(path);
        }
      }
    }

    const uniquePages = [...new Set(claudeCodePages)].sort();
    log.info(`Discovered ${uniquePages.length} Claude Code documentation pages`);

    if (uniquePages.length === 0) {
      log.warning("No pages found in sitemap, using fallback list...");
      return getFallbackPages();
    }

    return uniquePages;
  } catch (e) {
    log.error(`Failed to discover pages from sitemap: ${e}`);
    log.warning("Using fallback essential pages...");
    return getFallbackPages();
  }
}

// Validate markdown content
function validateMarkdownContent(content: string, filename: string): void {
  if (!content || content.startsWith('<!DOCTYPE') || content.slice(0, 100).includes('<html')) {
    throw new Error("Received HTML instead of markdown");
  }

  if (content.trim().length < 50) {
    throw new Error(`Content too short (${content.length} bytes)`);
  }

  const lines = content.split('\n');
  const markdownIndicators = ['# ', '## ', '### ', '```', '- ', '* ', '1. ', '[', '**', '_', '> '];

  const indicatorCount = lines.slice(0, 50).reduce((count, line) => {
    return count + markdownIndicators.filter(indicator =>
      line.trim().startsWith(indicator) || line.includes(indicator)
    ).length;
  }, 0);

  if (indicatorCount < 3) {
    throw new Error(`Content doesn't appear to be markdown (${indicatorCount} indicators found)`);
  }
}

// Fetch markdown content with retry logic
async function fetchMarkdownContent(
  path: string,
  baseUrl: string
): Promise<{ filename: string; content: string }> {
  const markdownUrl = `${baseUrl}${path}.md`;
  const filename = urlToSafeFilename(path);

  log.info(`Fetching: ${markdownUrl} -> ${filename}`);

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(markdownUrl, {
        headers: HEADERS,
        redirect: 'follow'
      });

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
        log.warning(`Rate limited. Waiting ${retryAfter} seconds...`);
        await sleep(retryAfter * 1000);
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const content = await response.text();
      validateMarkdownContent(content, filename);

      log.info(`Successfully fetched and validated ${filename} (${content.length} bytes)`);
      return { filename, content };
    } catch (e) {
      log.warning(`Attempt ${attempt + 1}/${MAX_RETRIES} failed for ${filename}: ${e}`);

      if (attempt < MAX_RETRIES - 1) {
        const delay = Math.min(RETRY_DELAY * Math.pow(2, attempt), MAX_RETRY_DELAY);
        const jitteredDelay = delay * (0.5 + Math.random() * 0.5);
        log.info(`Retrying in ${(jitteredDelay / 1000).toFixed(1)} seconds...`);
        await sleep(jitteredDelay);
      } else {
        throw new Error(`Failed to fetch ${filename} after ${MAX_RETRIES} attempts: ${e}`);
      }
    }
  }

  throw new Error(`Failed to fetch ${filename}`);
}

// Fetch changelog from GitHub
async function fetchChangelog(): Promise<{ filename: string; content: string }> {
  const changelogUrl = "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md";
  const filename = "changelog.md";

  log.info(`Fetching Claude Code changelog: ${changelogUrl}`);

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(changelogUrl, {
        headers: HEADERS,
        redirect: 'follow'
      });

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
        log.warning(`Rate limited. Waiting ${retryAfter} seconds...`);
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

      log.info(`Successfully fetched changelog (${fullContent.length} bytes)`);
      return { filename, content: fullContent };
    } catch (e) {
      log.warning(`Attempt ${attempt + 1}/${MAX_RETRIES} failed for changelog: ${e}`);

      if (attempt < MAX_RETRIES - 1) {
        const delay = Math.min(RETRY_DELAY * Math.pow(2, attempt), MAX_RETRY_DELAY);
        const jitteredDelay = delay * (0.5 + Math.random() * 0.5);
        log.info(`Retrying in ${(jitteredDelay / 1000).toFixed(1)} seconds...`);
        await sleep(jitteredDelay);
      } else {
        throw new Error(`Failed to fetch changelog after ${MAX_RETRIES} attempts: ${e}`);
      }
    }
  }

  throw new Error("Failed to fetch changelog");
}

// Save markdown file and return hash
async function saveMarkdownFile(docsDir: string, filename: string, content: string): Promise<string> {
  const filePath = join(docsDir, filename);

  try {
    await writeFile(filePath, content, 'utf-8');
    const contentHash = createHash('sha256').update(content, 'utf-8').digest('hex');
    log.info(`Saved: ${filename}`);
    return contentHash;
  } catch (e) {
    log.error(`Failed to save ${filename}: ${e}`);
    throw e;
  }
}

// Check if content has changed
function contentHasChanged(content: string, oldHash: string): boolean {
  const newHash = createHash('sha256').update(content, 'utf-8').digest('hex');
  return newHash !== oldHash;
}

// Main function
async function main() {
  const startTime = Date.now();
  log.info("Starting Claude Code documentation fetch for skill");

  // Determine docs directory
  const scriptDir = dirname(new URL(import.meta.url).pathname);
  const docsDir = join(scriptDir, '../docs');

  if (!existsSync(docsDir)) {
    await mkdir(docsDir, { recursive: true });
  }

  log.info(`Output directory: ${docsDir}`);

  // Load manifest
  const manifest = await loadManifest(docsDir);

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
    log.error(`Failed to discover sitemap: ${e}`);
    process.exit(1);
  }

  // Discover documentation pages
  const documentationPages = await discoverClaudeCodePages(sitemapUrl);

  if (documentationPages.length === 0) {
    log.error("No documentation pages discovered!");
    process.exit(1);
  }

  // Fetch each page
  for (let i = 0; i < documentationPages.length; i++) {
    const pagePath = documentationPages[i];
    log.info(`Processing ${i + 1}/${documentationPages.length}: ${pagePath}`);

    try {
      const { filename, content } = await fetchMarkdownContent(pagePath, baseUrl);

      const oldHash = manifest.files[filename]?.hash || "";
      const oldEntry = manifest.files[filename] || {};
      const filePath = join(docsDir, filename);
      const fileExists = existsSync(filePath);

      let contentHash: string;
      let lastUpdated: string;

      if (!fileExists || contentHasChanged(content, oldHash)) {
        contentHash = await saveMarkdownFile(docsDir, filename, content);
        if (!fileExists) {
          log.info(`Created: ${filename}`);
        } else {
          log.info(`Updated: ${filename}`);
        }
        lastUpdated = new Date().toISOString();
      } else {
        contentHash = oldHash;
        log.info(`Unchanged: ${filename}`);
        lastUpdated = oldEntry.last_updated || new Date().toISOString();
      }

      newManifest.files[filename] = {
        original_url: `${baseUrl}${pagePath}`,
        original_md_url: `${baseUrl}${pagePath}.md`,
        hash: contentHash,
        last_updated: lastUpdated
      };

      successful++;

      if (i < documentationPages.length - 1) {
        await sleep(RATE_LIMIT_DELAY);
      }
    } catch (e) {
      log.error(`Failed to process ${pagePath}: ${e}`);
      failed++;
      failedPages.push(pagePath);
    }
  }

  // Fetch changelog
  log.info("Fetching Claude Code changelog...");
  try {
    const { filename, content } = await fetchChangelog();

    const oldHash = manifest.files[filename]?.hash || "";
    const oldEntry = manifest.files[filename] || {};
    const filePath = join(docsDir, filename);
    const fileExists = existsSync(filePath);

    let contentHash: string;
    let lastUpdated: string;

    if (!fileExists || contentHasChanged(content, oldHash)) {
      contentHash = await saveMarkdownFile(docsDir, filename, content);
      if (!fileExists) {
        log.info(`Created: ${filename}`);
      } else {
        log.info(`Updated: ${filename}`);
      }
      lastUpdated = new Date().toISOString();
    } else {
      contentHash = oldHash;
      log.info(`Unchanged: ${filename}`);
      lastUpdated = oldEntry.last_updated || new Date().toISOString();
    }

    newManifest.files[filename] = {
      original_url: "https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md",
      original_raw_url: "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md",
      hash: contentHash,
      last_updated: lastUpdated,
      source: "claude-code-repository"
    };

    successful++;
  } catch (e) {
    log.error(`Failed to fetch changelog: ${e}`);
    failed++;
    failedPages.push("changelog");
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
    total_files: successful
  };

  // Save manifest
  await saveManifest(docsDir, newManifest);

  // Summary
  log.info("\n" + "=".repeat(50));
  log.info(`Fetch completed in ${duration.toFixed(2)}s`);
  log.info(`Discovered pages: ${documentationPages.length}`);
  log.info(`Successful: ${successful}/${documentationPages.length + 1}`);
  log.info(`Failed: ${failed}`);

  if (failedPages.length > 0) {
    log.warning("\nFailed pages:");
    failedPages.forEach(page => log.warning(`  - ${page}`));

    if (successful === 0) {
      log.error("No pages were fetched successfully!");
      process.exit(1);
    }
  } else {
    log.info("\nAll pages fetched successfully!");
  }
}

// Run main function
main().catch(error => {
  log.error(`Unhandled error: ${error}`);
  process.exit(1);
});
