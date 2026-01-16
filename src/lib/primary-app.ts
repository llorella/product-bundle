import { Persona, Goal, App } from './types';
import { MatrixCell } from './types/matrix';
import {
  getMatrixConfigSync,
  getPrimaryAppFromConfig,
  getSecondaryAppsFromConfig,
  getMatrixVersion,
} from './matrix/config';

/**
 * PRIMARY APP ASSIGNMENT MATRIX
 * =============================
 *
 * Status: HYPOTHESIS - Now dynamically loaded from config
 *
 * This module provides the interface for app assignment based on persona/goal.
 * The actual matrix is loaded from src/config/matrix.default.json with optional
 * runtime API override.
 *
 * HYPOTHESIS BASIS:
 * 1. Product team intuition about persona-use-case fit
 * 2. Qualitative user research (N=12 interviews)
 * 3. Beta usage patterns showing correlation between persona and app preference
 *
 * VALIDATION PLAN:
 * - This experiment tests: "Does single-path routing beat multi-choice?"
 * - Escape hatch rate signals matrix quality
 * - Future: Heuristic optimization based on conversion/retention/escape data
 *
 * TO MODIFY: Edit src/config/matrix.default.json or use API override
 */

/**
 * Get the primary app for a user based on their survey answers.
 * Uses dynamically loaded matrix configuration.
 */
export function getPrimaryApp(persona: Persona, goal: Goal): App {
  const config = getMatrixConfigSync();
  return config.primaryMatrix[persona][goal].app;
}

/**
 * Get the full matrix cell with confidence and metadata.
 */
export function getPrimaryAppCell(persona: Persona, goal: Goal): MatrixCell {
  const config = getMatrixConfigSync();
  return getPrimaryAppFromConfig(config, persona, goal);
}

/**
 * Get the secondary app for cross-activation.
 */
export function getSecondaryApp(primaryApp: App): App {
  const config = getMatrixConfigSync();
  const secondaryApps = getSecondaryAppsFromConfig(config, primaryApp);
  return secondaryApps[0] || getDefaultSecondary(primaryApp);
}

/**
 * Get all secondary apps in preference order.
 */
export function getSecondaryApps(primaryApp: App): App[] {
  const config = getMatrixConfigSync();
  return getSecondaryAppsFromConfig(config, primaryApp);
}

/**
 * Default secondary preferences as fallback.
 */
function getDefaultSecondary(primaryApp: App): App {
  const defaults: Record<App, App> = {
    cora: 'sparkle',
    sparkle: 'cora',
    spiral: 'monologue',
    monologue: 'spiral',
  };
  return defaults[primaryApp];
}

/**
 * Get recommended apps for control variant (2 apps).
 */
export function getRecommendedApps(persona: Persona, goal: Goal): [App, App] {
  const primary = getPrimaryApp(persona, goal);
  const secondary = getSecondaryApp(primary);
  return [primary, secondary];
}

/**
 * Get assignment reason for logging (includes matrix version).
 */
export function getAssignmentReason(persona: Persona, goal: Goal): string {
  return `${persona}_${goal}`;
}

/**
 * Get assignment context for detailed tracking.
 */
export function getAssignmentContext(persona: Persona, goal: Goal): {
  app: App;
  confidence: number;
  reason: string;
  matrixVersion: string;
} {
  const cell = getPrimaryAppCell(persona, goal);
  return {
    app: cell.app,
    confidence: cell.confidence,
    reason: cell.reason,
    matrixVersion: getMatrixVersion(),
  };
}
