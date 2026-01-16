import { Persona, Goal, App } from '../types';

/**
 * Heuristic types for matrix optimization
 */
export type HeuristicType =
  | 'escape_minimizing'    // Minimize escape hatch rate (primary goal)
  | 'conversion_weighted'  // Maximize first-win completion rate
  | 'retention_weighted'   // Maximize 7-day retention
  | 'balanced';            // Weighted combination of all three

/**
 * A single cell in the assignment matrix
 */
export interface MatrixCell {
  app: App;
  confidence: number;  // 0-1, how confident we are in this assignment
  reason: string;      // Human-readable rationale
  metadata?: {
    conversionRate?: number;  // Historical conversion for this cell
    retentionRate?: number;   // 7-day retention for this cell
    escapeRate?: number;      // Escape hatch rate for this cell
    sampleSize?: number;      // N for this cell
    lastUpdated?: string;     // ISO timestamp
  };
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
  version: string;                              // Semver, e.g., "1.0.0"
  createdAt: string;                            // ISO timestamp
  updatedAt: string;                            // ISO timestamp
  source: 'default' | 'api' | 'computed';       // Where this config came from
  heuristic?: HeuristicType;                    // If computed, which heuristic

  // The 5x4 primary assignment matrix
  primaryMatrix: Record<Persona, Record<Goal, MatrixCell>>;

  // Secondary preferences for cross-activation
  secondaryPreferences: Record<App, SecondaryPreferences>;

  // Optional feature-based overrides
  featureOverrides?: FeatureOverride[];
}

/**
 * A condition that matches user features
 */
export interface FeatureCondition {
  field: string;  // Path to field, e.g., 'device.type' or 'acquisition.source'
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in';
  value: string | number | string[] | number[];
}

/**
 * A rule that overrides the matrix assignment based on features
 */
export interface FeatureOverride {
  id: string;
  name: string;
  description: string;
  priority: number;            // Higher = evaluated first
  enabled: boolean;

  // All conditions must match (AND logic)
  conditions: FeatureCondition[];

  // What to do when matched
  action: {
    type: 'override_primary' | 'reorder_secondary' | 'boost_confidence';
    app?: App;                 // For override_primary
    secondaryOrder?: App[];    // For reorder_secondary
    confidenceBoost?: number;  // For boost_confidence
  };

  // Tracking
  matchCount?: number;
  lastMatchedAt?: string;
}

/**
 * Configuration for the heuristic computation
 */
export interface HeuristicConfig {
  type: HeuristicType;
  weights: {
    conversion: number;   // Weight for conversion rate
    retention: number;    // Weight for retention rate
    escape: number;       // Weight for escape rate (inverted)
  };
  minSampleSize: number;  // Minimum N before considering cell data
  smoothingFactor: number; // Bayesian smoothing for low-data cells
}

/**
 * Predefined heuristic configurations
 */
export const HEURISTIC_CONFIGS: Record<HeuristicType, HeuristicConfig> = {
  escape_minimizing: {
    type: 'escape_minimizing',
    weights: { conversion: 0.2, retention: 0.2, escape: 0.6 },
    minSampleSize: 30,
    smoothingFactor: 10,
  },
  conversion_weighted: {
    type: 'conversion_weighted',
    weights: { conversion: 0.6, retention: 0.2, escape: 0.2 },
    minSampleSize: 30,
    smoothingFactor: 10,
  },
  retention_weighted: {
    type: 'retention_weighted',
    weights: { conversion: 0.2, retention: 0.6, escape: 0.2 },
    minSampleSize: 30,
    smoothingFactor: 10,
  },
  balanced: {
    type: 'balanced',
    weights: { conversion: 0.33, retention: 0.33, escape: 0.34 },
    minSampleSize: 30,
    smoothingFactor: 10,
  },
};

/**
 * Historical metrics for a single app in a cell
 */
export interface CellAppMetrics {
  conversionRate: number;
  retentionRate: number;
  escapeRate: number;
  escapeRateVariance?: number;
  sampleSize: number;
}

/**
 * Historical data for all apps in a cell
 */
export type CellHistoricalData = Record<App, CellAppMetrics>;
