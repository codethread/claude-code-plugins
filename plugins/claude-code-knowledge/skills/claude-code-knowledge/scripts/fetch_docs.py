#!/usr/bin/env python3
"""
Claude Code Documentation Fetcher for claude-code-knowledge skill
Adapted from the original fetch_claude_docs.py
"""

import requests
import time
from pathlib import Path
from typing import List, Tuple
import logging
from datetime import datetime
import sys
import xml.etree.ElementTree as ET
from urllib.parse import urlparse
import json
import hashlib
import random

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# Sitemap URLs to try (in order of preference)
SITEMAP_URLS = [
    "https://docs.anthropic.com/sitemap.xml",
    "https://docs.claude.com/sitemap.xml",
]
MANIFEST_FILE = "docs_manifest.json"

# Headers to identify the script
HEADERS = {
    'User-Agent': 'Claude-Code-Knowledge-Skill/1.0',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
}

# Retry configuration
MAX_RETRIES = 3
RETRY_DELAY = 2
MAX_RETRY_DELAY = 30
RATE_LIMIT_DELAY = 0.5


def load_manifest(docs_dir: Path) -> dict:
    """Load the manifest of previously fetched files."""
    manifest_path = docs_dir / MANIFEST_FILE
    if manifest_path.exists():
        try:
            manifest = json.loads(manifest_path.read_text())
            if "files" not in manifest:
                manifest["files"] = {}
            return manifest
        except Exception as e:
            logger.warning(f"Failed to load manifest: {e}")
    return {"files": {}, "last_updated": None}


def save_manifest(docs_dir: Path, manifest: dict) -> None:
    """Save the manifest of fetched files."""
    manifest_path = docs_dir / MANIFEST_FILE
    manifest["last_updated"] = datetime.now().isoformat()
    manifest["source"] = "https://docs.anthropic.com/en/docs/claude-code/"
    manifest["skill"] = "claude-code-knowledge"
    manifest_path.write_text(json.dumps(manifest, indent=2))


def url_to_safe_filename(url_path: str) -> str:
    """Convert a URL path to a safe filename."""
    for prefix in ['/en/docs/claude-code/', '/docs/claude-code/', '/claude-code/']:
        if prefix in url_path:
            path = url_path.split(prefix)[-1]
            break
    else:
        if 'claude-code/' in url_path:
            path = url_path.split('claude-code/')[-1]
        else:
            path = url_path

    if '/' not in path:
        return path + '.md' if not path.endswith('.md') else path

    safe_name = path.replace('/', '__')
    if not safe_name.endswith('.md'):
        safe_name += '.md'
    return safe_name


def discover_sitemap_and_base_url(session: requests.Session) -> Tuple[str, str]:
    """Discover the sitemap URL and extract the base URL."""
    for sitemap_url in SITEMAP_URLS:
        try:
            logger.info(f"Trying sitemap: {sitemap_url}")
            response = session.get(sitemap_url, headers=HEADERS, timeout=30)
            if response.status_code == 200:
                try:
                    parser = ET.XMLParser(forbid_dtd=True, forbid_entities=True, forbid_external=True)
                    root = ET.fromstring(response.content, parser=parser)
                except TypeError:
                    logger.warning("XMLParser security parameters not available")
                    root = ET.fromstring(response.content)

                namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
                first_url = None
                for url_elem in root.findall('.//ns:url', namespace):
                    loc_elem = url_elem.find('ns:loc', namespace)
                    if loc_elem is not None and loc_elem.text:
                        first_url = loc_elem.text
                        break

                if not first_url:
                    for loc_elem in root.findall('.//loc'):
                        if loc_elem.text:
                            first_url = loc_elem.text
                            break

                if first_url:
                    parsed = urlparse(first_url)
                    base_url = f"{parsed.scheme}://{parsed.netloc}"
                    logger.info(f"Found sitemap at {sitemap_url}, base URL: {base_url}")
                    return sitemap_url, base_url
        except Exception as e:
            logger.warning(f"Failed to fetch {sitemap_url}: {e}")
            continue

    raise Exception("Could not find a valid sitemap")


def discover_claude_code_pages(session: requests.Session, sitemap_url: str) -> List[str]:
    """Dynamically discover all Claude Code documentation pages from the sitemap."""
    logger.info("Discovering documentation pages from sitemap...")

    try:
        response = session.get(sitemap_url, headers=HEADERS, timeout=30)
        response.raise_for_status()

        try:
            parser = ET.XMLParser(forbid_dtd=True, forbid_entities=True, forbid_external=True)
            root = ET.fromstring(response.content, parser=parser)
        except TypeError:
            logger.warning("XMLParser security parameters not available")
            root = ET.fromstring(response.content)

        urls = []
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        for url_elem in root.findall('.//ns:url', namespace):
            loc_elem = url_elem.find('ns:loc', namespace)
            if loc_elem is not None and loc_elem.text:
                urls.append(loc_elem.text)

        if not urls:
            for loc_elem in root.findall('.//loc'):
                if loc_elem.text:
                    urls.append(loc_elem.text)

        logger.info(f"Found {len(urls)} total URLs in sitemap")

        # Filter for English Claude Code documentation pages
        claude_code_pages = []
        english_patterns = ['/en/docs/claude-code/']

        for url in urls:
            if any(pattern in url for pattern in english_patterns):
                parsed = urlparse(url)
                path = parsed.path

                if path.endswith('.html'):
                    path = path[:-5]
                elif path.endswith('/'):
                    path = path[:-1]

                skip_patterns = ['/tool-use/', '/examples/', '/legacy/', '/api/', '/reference/']
                if not any(skip in path for skip in skip_patterns):
                    claude_code_pages.append(path)

        claude_code_pages = sorted(list(set(claude_code_pages)))
        logger.info(f"Discovered {len(claude_code_pages)} Claude Code documentation pages")

        # If no pages found, use fallback
        if not claude_code_pages:
            logger.warning("No pages found in sitemap, using fallback list...")
            return get_fallback_pages()

        return claude_code_pages

    except Exception as e:
        logger.error(f"Failed to discover pages from sitemap: {e}")
        logger.warning("Using fallback essential pages...")
        return get_fallback_pages()


def get_fallback_pages() -> List[str]:
    """Return comprehensive fallback list of all known Claude Code documentation pages."""
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
    ]


def validate_markdown_content(content: str, filename: str) -> None:
    """Validate that content is proper markdown."""
    if not content or content.startswith('<!DOCTYPE') or '<html' in content[:100]:
        raise ValueError("Received HTML instead of markdown")

    if len(content.strip()) < 50:
        raise ValueError(f"Content too short ({len(content)} bytes)")

    lines = content.split('\n')
    markdown_indicators = ['# ', '## ', '### ', '```', '- ', '* ', '1. ', '[', '**', '_', '> ']

    indicator_count = sum(1 for line in lines[:50] for indicator in markdown_indicators
                          if line.strip().startswith(indicator) or indicator in line)

    if indicator_count < 3:
        raise ValueError(f"Content doesn't appear to be markdown ({indicator_count} indicators found)")


def fetch_markdown_content(path: str, session: requests.Session, base_url: str) -> Tuple[str, str]:
    """Fetch markdown content with error handling and validation."""
    markdown_url = f"{base_url}{path}.md"
    filename = url_to_safe_filename(path)

    logger.info(f"Fetching: {markdown_url} -> {filename}")

    for attempt in range(MAX_RETRIES):
        try:
            response = session.get(markdown_url, headers=HEADERS, timeout=30, allow_redirects=True)

            if response.status_code == 429:
                wait_time = int(response.headers.get('Retry-After', 60))
                logger.warning(f"Rate limited. Waiting {wait_time} seconds...")
                time.sleep(wait_time)
                continue

            response.raise_for_status()
            content = response.text
            validate_markdown_content(content, filename)

            logger.info(f"Successfully fetched and validated {filename} ({len(content)} bytes)")
            return filename, content

        except requests.exceptions.RequestException as e:
            logger.warning(f"Attempt {attempt + 1}/{MAX_RETRIES} failed for {filename}: {e}")
            if attempt < MAX_RETRIES - 1:
                delay = min(RETRY_DELAY * (2 ** attempt), MAX_RETRY_DELAY)
                jittered_delay = delay * random.uniform(0.5, 1.0)
                logger.info(f"Retrying in {jittered_delay:.1f} seconds...")
                time.sleep(jittered_delay)
            else:
                raise Exception(f"Failed to fetch {filename} after {MAX_RETRIES} attempts: {e}")

        except ValueError as e:
            logger.error(f"Content validation failed for {filename}: {e}")
            raise


def fetch_changelog(session: requests.Session) -> Tuple[str, str]:
    """Fetch Claude Code changelog from GitHub repository."""
    changelog_url = "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md"
    filename = "changelog.md"

    logger.info(f"Fetching Claude Code changelog: {changelog_url}")

    for attempt in range(MAX_RETRIES):
        try:
            response = session.get(changelog_url, headers=HEADERS, timeout=30, allow_redirects=True)

            if response.status_code == 429:
                wait_time = int(response.headers.get('Retry-After', 60))
                logger.warning(f"Rate limited. Waiting {wait_time} seconds...")
                time.sleep(wait_time)
                continue

            response.raise_for_status()
            content = response.text

            header = """# Claude Code Changelog

> **Source**: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
>
> This is the official Claude Code release changelog from the Claude Code repository.

---

"""
            content = header + content

            if len(content.strip()) < 100:
                raise ValueError(f"Changelog content too short ({len(content)} bytes)")

            logger.info(f"Successfully fetched changelog ({len(content)} bytes)")
            return filename, content

        except requests.exceptions.RequestException as e:
            logger.warning(f"Attempt {attempt + 1}/{MAX_RETRIES} failed for changelog: {e}")
            if attempt < MAX_RETRIES - 1:
                delay = min(RETRY_DELAY * (2 ** attempt), MAX_RETRY_DELAY)
                jittered_delay = delay * random.uniform(0.5, 1.0)
                logger.info(f"Retrying in {jittered_delay:.1f} seconds...")
                time.sleep(jittered_delay)
            else:
                raise Exception(f"Failed to fetch changelog after {MAX_RETRIES} attempts: {e}")


def save_markdown_file(docs_dir: Path, filename: str, content: str) -> str:
    """Save markdown content and return its hash."""
    file_path = docs_dir / filename

    try:
        file_path.write_text(content, encoding='utf-8')
        content_hash = hashlib.sha256(content.encode('utf-8')).hexdigest()
        logger.info(f"Saved: {filename}")
        return content_hash
    except Exception as e:
        logger.error(f"Failed to save {filename}: {e}")
        raise


def content_has_changed(content: str, old_hash: str) -> bool:
    """Check if content has changed based on hash."""
    new_hash = hashlib.sha256(content.encode('utf-8')).hexdigest()
    return new_hash != old_hash


def main():
    """Main function to fetch documentation."""
    start_time = datetime.now()
    logger.info("Starting Claude Code documentation fetch for skill")

    # Determine docs directory
    script_dir = Path(__file__).parent
    docs_dir = script_dir.parent / 'docs'
    docs_dir.mkdir(exist_ok=True)
    logger.info(f"Output directory: {docs_dir}")

    # Load manifest
    manifest = load_manifest(docs_dir)

    # Statistics
    successful = 0
    failed = 0
    failed_pages = []
    new_manifest = {"files": {}}

    with requests.Session() as session:
        # Discover sitemap and base URL
        try:
            sitemap_url, base_url = discover_sitemap_and_base_url(session)
        except Exception as e:
            logger.error(f"Failed to discover sitemap: {e}")
            sys.exit(1)

        # Discover documentation pages
        documentation_pages = discover_claude_code_pages(session, sitemap_url)

        if not documentation_pages:
            logger.error("No documentation pages discovered!")
            sys.exit(1)

        # Fetch each page
        for i, page_path in enumerate(documentation_pages, 1):
            logger.info(f"Processing {i}/{len(documentation_pages)}: {page_path}")

            try:
                filename, content = fetch_markdown_content(page_path, session, base_url)

                old_hash = manifest.get("files", {}).get(filename, {}).get("hash", "")
                old_entry = manifest.get("files", {}).get(filename, {})

                if content_has_changed(content, old_hash):
                    content_hash = save_markdown_file(docs_dir, filename, content)
                    logger.info(f"Updated: {filename}")
                    last_updated = datetime.now().isoformat()
                else:
                    content_hash = old_hash
                    logger.info(f"Unchanged: {filename}")
                    last_updated = old_entry.get("last_updated", datetime.now().isoformat())

                new_manifest["files"][filename] = {
                    "original_url": f"{base_url}{page_path}",
                    "original_md_url": f"{base_url}{page_path}.md",
                    "hash": content_hash,
                    "last_updated": last_updated
                }

                successful += 1

                if i < len(documentation_pages):
                    time.sleep(RATE_LIMIT_DELAY)

            except Exception as e:
                logger.error(f"Failed to process {page_path}: {e}")
                failed += 1
                failed_pages.append(page_path)

        # Fetch changelog
        logger.info("Fetching Claude Code changelog...")
        try:
            filename, content = fetch_changelog(session)

            old_hash = manifest.get("files", {}).get(filename, {}).get("hash", "")
            old_entry = manifest.get("files", {}).get(filename, {})

            if content_has_changed(content, old_hash):
                content_hash = save_markdown_file(docs_dir, filename, content)
                logger.info(f"Updated: {filename}")
                last_updated = datetime.now().isoformat()
            else:
                content_hash = old_hash
                logger.info(f"Unchanged: {filename}")
                last_updated = old_entry.get("last_updated", datetime.now().isoformat())

            new_manifest["files"][filename] = {
                "original_url": "https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md",
                "original_raw_url": "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md",
                "hash": content_hash,
                "last_updated": last_updated,
                "source": "claude-code-repository"
            }

            successful += 1

        except Exception as e:
            logger.error(f"Failed to fetch changelog: {e}")
            failed += 1
            failed_pages.append("changelog")

    # Add metadata
    new_manifest["fetch_metadata"] = {
        "last_fetch_completed": datetime.now().isoformat(),
        "fetch_duration_seconds": (datetime.now() - start_time).total_seconds(),
        "total_pages_discovered": len(documentation_pages),
        "pages_fetched_successfully": successful,
        "pages_failed": failed,
        "failed_pages": failed_pages,
        "sitemap_url": sitemap_url,
        "base_url": base_url,
        "total_files": successful
    }

    # Save manifest
    save_manifest(docs_dir, new_manifest)

    # Summary
    duration = datetime.now() - start_time
    logger.info("\n" + "="*50)
    logger.info(f"Fetch completed in {duration}")
    logger.info(f"Discovered pages: {len(documentation_pages)}")
    logger.info(f"Successful: {successful}/{len(documentation_pages) + 1}")
    logger.info(f"Failed: {failed}")

    if failed_pages:
        logger.warning("\nFailed pages:")
        for page in failed_pages:
            logger.warning(f"  - {page}")
        if successful == 0:
            logger.error("No pages were fetched successfully!")
            sys.exit(1)
    else:
        logger.info("\nAll pages fetched successfully!")


if __name__ == "__main__":
    main()
