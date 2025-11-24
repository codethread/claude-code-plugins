/**
 * Session Cache Utilities
 *
 * Provides consistent session cache management for marketplace plugins.
 * Each plugin gets its own cache directory structure.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import marketplace from '../.claude-plugin/marketplace.json' with { type: 'json' };

/**
 * Base cache directory for all marketplace plugins
 */
const CACHE_BASE = join(homedir(), '.local/cache', marketplace.name);

/**
 * Normalize a directory path for use in cache filenames
 */
function normalizePath(path: string): string {
	return path.replace(/^\//, '').replace(/\//g, '-');
}

/**
 * Get the cache directory path for a specific plugin
 */
export function getPluginCacheDir(pluginName: string, cwd: string): string {
	const normalizedCwd = normalizePath(cwd);
	return join(CACHE_BASE, pluginName, normalizedCwd);
}

/**
 * Get the full cache file path for a session
 */
export function getSessionCachePath(pluginName: string, cwd: string, sessionId: string): string {
	const cacheDir = getPluginCacheDir(pluginName, cwd);
	return join(cacheDir, `${sessionId}.json`);
}

/**
 * Read session cache data
 * Returns null if cache doesn't exist
 */
export function readSessionCache<T>(pluginName: string, cwd: string, sessionId: string): T | null {
	const cachePath = getSessionCachePath(pluginName, cwd, sessionId);
	if (!existsSync(cachePath)) {
		return null;
	}
	try {
		return JSON.parse(readFileSync(cachePath, 'utf-8')) as T;
	} catch {
		return null;
	}
}

/**
 * Write session cache data
 * Creates cache directory if it doesn't exist
 */
export function writeSessionCache<T>(
	pluginName: string,
	cwd: string,
	sessionId: string,
	data: T
): void {
	const cacheDir = getPluginCacheDir(pluginName, cwd);
	mkdirSync(cacheDir, { recursive: true });

	const cachePath = getSessionCachePath(pluginName, cwd, sessionId);
	writeFileSync(cachePath, JSON.stringify(data, null, 2));
}

/**
 * Update session cache by merging new data with existing cache
 */
export function updateSessionCache<T extends Record<string, unknown>>(
	pluginName: string,
	cwd: string,
	sessionId: string,
	updates: Partial<T>
): void {
	const existing = readSessionCache<T>(pluginName, cwd, sessionId) || ({} as T);
	writeSessionCache(pluginName, cwd, sessionId, { ...existing, ...updates });
}

/**
 * Check if enough time has elapsed since the last trigger
 * @param delayMinutes - Minimum minutes that must elapse before triggering again
 * @returns true if should trigger (no previous trigger or delay elapsed)
 */
export function shouldTriggerBasedOnTime(
	pluginName: string,
	cwd: string,
	sessionId: string,
	delayMinutes: number
): boolean {
	const cache = readSessionCache<{ last_triggered?: string }>(pluginName, cwd, sessionId);

	if (!cache || !cache.last_triggered) {
		return true; // No previous trigger
	}

	const lastTriggered = new Date(cache.last_triggered);
	const now = new Date();
	const elapsedMinutes = (now.getTime() - lastTriggered.getTime()) / (1000 * 60);

	return elapsedMinutes >= delayMinutes;
}

/**
 * Mark the current time as the last trigger time
 */
export function markTriggered(
	pluginName: string,
	cwd: string,
	sessionId: string,
	metadata?: Record<string, unknown>
): void {
	const updates = {
		last_triggered: new Date().toISOString(),
		...metadata,
	};
	updateSessionCache(pluginName, cwd, sessionId, updates);
}
