import { MatrixConfig, MatrixCell } from '../types/matrix';
import { Persona, Goal, App } from '../types';
import defaultMatrix from '../../config/matrix.default.json';

// Cached config
let cachedConfig: MatrixConfig | null = null;

/**
 * Load matrix configuration from static JSON
 */
export async function loadMatrixConfig(): Promise<MatrixConfig> {
  if (!cachedConfig) {
    cachedConfig = defaultMatrix as MatrixConfig;
  }
  return cachedConfig;
}

/**
 * Synchronous version for contexts where async isn't available
 */
export function getMatrixConfigSync(): MatrixConfig {
  if (!cachedConfig) {
    cachedConfig = defaultMatrix as MatrixConfig;
  }
  return cachedConfig;
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
 * Clear cached config (for testing)
 */
export function invalidateMatrixCache(): void {
  cachedConfig = null;
}

/**
 * Override cached config (for testing)
 */
export function setMatrixConfig(config: MatrixConfig): void {
  cachedConfig = config;
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
