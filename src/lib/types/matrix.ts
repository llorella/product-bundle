import { Persona, Goal, App } from '../types';

/**
 * A single cell in the assignment matrix
 */
export interface MatrixCell {
  app: App;
  confidence: number;  // 0-1, how confident we are in this assignment
  reason: string;      // Human-readable rationale
}

/**
 * Secondary app preferences for cross-activation
 */
export interface SecondaryPreferences {
  ordered: App[];  // Ordered list of fallback apps
}

/**
 * Complete matrix configuration
 */
export interface MatrixConfig {
  version: string;
  createdAt: string;
  updatedAt: string;
  source: 'default' | 'api' | 'computed';

  // The 5x4 primary assignment matrix
  primaryMatrix: Record<Persona, Record<Goal, MatrixCell>>;

  // Secondary preferences for cross-activation
  secondaryPreferences: Record<App, SecondaryPreferences>;
}
