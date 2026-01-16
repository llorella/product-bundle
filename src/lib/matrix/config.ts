import { MatrixConfig, MatrixCell } from '../types/matrix';
import { Persona, Goal, App } from '../types';
import defaultMatrix from '../../config/matrix.default.json';

// Cache for the loaded matrix config
let cachedConfig: MatrixConfig | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// API endpoint for runtime override (optional)
const MATRIX_API_ENDPOINT = process.env.NEXT_PUBLIC_MATRIX_API_ENDPOINT;

/**
 * Load matrix configuration with layered sources:
 * 1. Check for API override (if endpoint configured)
 * 2. Fall back to default JSON config
 */
export async function loadMatrixConfig(): Promise<MatrixConfig> {
  // Return cached config if still valid
  if (cachedConfig && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedConfig;
  }

  // Try API override first (if configured)
  if (MATRIX_API_ENDPOINT) {
    try {
      const apiConfig = await fetchMatrixFromAPI();
      if (apiConfig) {
        cachedConfig = apiConfig;
        cacheTimestamp = Date.now();
        return apiConfig;
      }
    } catch (error) {
      console.warn('Failed to fetch matrix from API, falling back to default:', error);
    }
  }

  // Fall back to default config
  cachedConfig = defaultMatrix as MatrixConfig;
  cacheTimestamp = Date.now();
  return cachedConfig;
}

/**
 * Synchronous version for contexts where async isn't available.
 * Uses cached config or falls back to default.
 */
export function getMatrixConfigSync(): MatrixConfig {
  if (cachedConfig) {
    return cachedConfig;
  }
  // Initialize with default if no cache
  cachedConfig = defaultMatrix as MatrixConfig;
  cacheTimestamp = Date.now();
  return cachedConfig;
}

/**
 * Fetch matrix configuration from API endpoint
 */
async function fetchMatrixFromAPI(): Promise<MatrixConfig | null> {
  if (!MATRIX_API_ENDPOINT) return null;

  const response = await fetch(MATRIX_API_ENDPOINT, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // Short timeout to avoid blocking UX
    signal: AbortSignal.timeout(2000),
  });

  if (!response.ok) {
    throw new Error(`Matrix API returned ${response.status}`);
  }

  const config = await response.json();
  return validateMatrixConfig(config);
}

/**
 * Validate that a config object has the required structure
 */
function validateMatrixConfig(config: unknown): MatrixConfig | null {
  if (!config || typeof config !== 'object') return null;

  const c = config as Record<string, unknown>;
  if (!c.version || !c.primaryMatrix || !c.secondaryPreferences) {
    console.warn('Invalid matrix config: missing required fields');
    return null;
  }

  return config as MatrixConfig;
}

/**
 * Get primary app assignment for a persona/goal combination
 */
export function getPrimaryAppFromConfig(
  config: MatrixConfig,
  persona: Persona,
  goal: Goal
): MatrixCell {
  return config.primaryMatrix[persona][goal];
}

/**
 * Get secondary app preferences for cross-activation
 */
export function getSecondaryAppsFromConfig(
  config: MatrixConfig,
  primaryApp: App
): App[] {
  return config.secondaryPreferences[primaryApp]?.ordered || [];
}

/**
 * Force refresh the cached config (useful after updates)
 */
export function invalidateMatrixCache(): void {
  cachedConfig = null;
  cacheTimestamp = 0;
}

/**
 * Override the cached config (for testing or runtime updates)
 */
export function setMatrixConfig(config: MatrixConfig): void {
  cachedConfig = config;
  cacheTimestamp = Date.now();
}

/**
 * Get current matrix version
 */
export function getMatrixVersion(): string {
  const config = getMatrixConfigSync();
  return config.version;
}

/**
 * Get current matrix source
 */
export function getMatrixSource(): MatrixConfig['source'] {
  const config = getMatrixConfigSync();
  return config.source;
}
