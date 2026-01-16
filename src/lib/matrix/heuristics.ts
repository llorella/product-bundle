import { Persona, Goal, App } from '../types';
import {
  MatrixConfig,
  MatrixCell,
  HeuristicType,
  HeuristicConfig,
  HEURISTIC_CONFIGS,
  CellAppMetrics,
} from '../types/matrix';
import { getMatrixConfigSync } from './config';

/**
 * Event data structure for heuristic computation
 */
interface EventData {
  type: string;
  userId: string;
  variant: 'control' | 'treatment';
  payload: Record<string, unknown>;
}

/**
 * Aggregated metrics per app within a cell
 */
interface CellAppData {
  assignments: number;
  escapes: number;
  conversions: number;
  retentions: number; // Users who completed 2+ apps
}

/**
 * Compute optimal matrix from historical event data
 */
export function computeOptimizedMatrix(
  events: EventData[],
  heuristicType: HeuristicType = 'escape_minimizing'
): MatrixConfig {
  const config = HEURISTIC_CONFIGS[heuristicType];
  const currentMatrix = getMatrixConfigSync();

  // Aggregate data per cell
  const cellData = aggregateCellData(events);

  // Compute optimal assignment for each cell
  const optimizedMatrix: MatrixConfig['primaryMatrix'] = {} as MatrixConfig['primaryMatrix'];

  const personas: Persona[] = ['founder', 'builder', 'writer', 'designer', 'curious'];
  const goals: Goal[] = ['productive', 'automate', 'write', 'trends'];

  personas.forEach((persona) => {
    optimizedMatrix[persona] = {} as Record<Goal, MatrixCell>;
    goals.forEach((goal) => {
      const key = `${persona}_${goal}`;
      const data = cellData.get(key);

      if (data && hasSufficientData(data, config.minSampleSize)) {
        // Compute optimal app for this cell
        optimizedMatrix[persona][goal] = computeOptimalCell(
          persona,
          goal,
          data,
          config,
          currentMatrix.primaryMatrix[persona][goal]
        );
      } else {
        // Keep current assignment if insufficient data
        optimizedMatrix[persona][goal] = {
          ...currentMatrix.primaryMatrix[persona][goal],
          metadata: {
            ...currentMatrix.primaryMatrix[persona][goal].metadata,
            sampleSize: data ? getTotalAssignments(data) : 0,
            lastUpdated: new Date().toISOString(),
          },
        };
      }
    });
  });

  return {
    version: incrementVersion(currentMatrix.version),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'computed',
    heuristic: heuristicType,
    primaryMatrix: optimizedMatrix,
    secondaryPreferences: currentMatrix.secondaryPreferences,
    featureOverrides: currentMatrix.featureOverrides,
  };
}

/**
 * Aggregate event data into per-cell, per-app metrics
 */
function aggregateCellData(events: EventData[]): Map<string, Map<App, CellAppData>> {
  const cellData = new Map<string, Map<App, CellAppData>>();

  // Track user assignments
  const userAssignments = new Map<string, { persona: Persona; goal: Goal; app: App }>();

  // Process assignment events
  events
    .filter((e) => e.type === 'app_assigned' || e.type === 'primary_app_assigned')
    .forEach((e) => {
      const persona = e.payload.persona as Persona | undefined;
      const goal = e.payload.goal as Goal | undefined;
      const app = (e.payload.app || e.payload.primary_app) as App | undefined;

      if (persona && goal && app) {
        userAssignments.set(e.userId, { persona, goal, app });

        const key = `${persona}_${goal}`;
        if (!cellData.has(key)) {
          cellData.set(key, new Map());
        }
        const appData = cellData.get(key)!;
        if (!appData.has(app)) {
          appData.set(app, { assignments: 0, escapes: 0, conversions: 0, retentions: 0 });
        }
        appData.get(app)!.assignments++;
      }
    });

  // Process escape events - attribute to the app they escaped FROM
  events
    .filter((e) => e.type === 'escape_hatch_clicked')
    .forEach((e) => {
      const persona = e.payload.persona as Persona | undefined;
      const goal = e.payload.goal as Goal | undefined;
      const fromApp = e.payload.from_app as App | undefined;

      if (persona && goal && fromApp) {
        const key = `${persona}_${goal}`;
        const appData = cellData.get(key);
        if (appData?.has(fromApp)) {
          appData.get(fromApp)!.escapes++;
        }
      }
    });

  // Process conversion events (first_win_completed)
  events
    .filter((e) => e.type === 'first_win_completed' && e.variant === 'treatment')
    .forEach((e) => {
      const assignment = userAssignments.get(e.userId);
      if (assignment) {
        const key = `${assignment.persona}_${assignment.goal}`;
        const appData = cellData.get(key);
        if (appData?.has(assignment.app)) {
          appData.get(assignment.app)!.conversions++;
        }
      }
    });

  // Process retention (users with 2+ app completions)
  const userCompletions = new Map<string, Set<string>>();
  events
    .filter((e) => e.type === 'first_win_completed')
    .forEach((e) => {
      const app = e.payload.app as string | undefined;
      if (app) {
        if (!userCompletions.has(e.userId)) {
          userCompletions.set(e.userId, new Set());
        }
        userCompletions.get(e.userId)!.add(app);
      }
    });

  userCompletions.forEach((apps, userId) => {
    if (apps.size >= 2) {
      const assignment = userAssignments.get(userId);
      if (assignment) {
        const key = `${assignment.persona}_${assignment.goal}`;
        const appData = cellData.get(key);
        if (appData?.has(assignment.app)) {
          appData.get(assignment.app)!.retentions++;
        }
      }
    }
  });

  return cellData;
}

/**
 * Check if cell has sufficient data for optimization
 */
function hasSufficientData(
  appData: Map<App, CellAppData>,
  minSampleSize: number
): boolean {
  const total = getTotalAssignments(appData);
  return total >= minSampleSize;
}

function getTotalAssignments(appData: Map<App, CellAppData>): number {
  return Array.from(appData.values()).reduce((sum, d) => sum + d.assignments, 0);
}

/**
 * Compute optimal app for a cell based on heuristic
 */
function computeOptimalCell(
  persona: Persona,
  goal: Goal,
  appData: Map<App, CellAppData>,
  config: HeuristicConfig,
  currentCell: MatrixCell
): MatrixCell {
  const apps: App[] = ['cora', 'sparkle', 'spiral', 'monologue'];

  // Calculate scores for each app
  const scores = apps.map((app) => {
    const data = appData.get(app);
    const metrics = computeAppMetrics(data, config);
    const score = computeScore(metrics, config);

    return { app, score, metrics, data };
  });

  // Sort by score (descending)
  scores.sort((a, b) => b.score - a.score);

  const best = scores[0];
  const totalAssignments = getTotalAssignments(appData);

  // If the best app is different from current but close in score, keep current
  // (stability preference)
  const currentScore = scores.find((s) => s.app === currentCell.app);
  const scoreDiff = best.score - (currentScore?.score || 0);
  const significantImprovement = scoreDiff > 0.1; // 10% improvement threshold

  const chosenApp = significantImprovement ? best.app : currentCell.app;
  const chosenData = scores.find((s) => s.app === chosenApp)!;

  return {
    app: chosenApp,
    confidence: computeConfidence(chosenData.data, totalAssignments, config),
    reason: generateReason(persona, goal, chosenApp, config.type, chosenData.metrics),
    metadata: {
      conversionRate: chosenData.metrics.conversionRate,
      retentionRate: chosenData.metrics.retentionRate,
      escapeRate: chosenData.metrics.escapeRate,
      sampleSize: totalAssignments,
      lastUpdated: new Date().toISOString(),
    },
  };
}

/**
 * Compute normalized metrics for an app
 */
function computeAppMetrics(
  data: CellAppData | undefined,
  config: HeuristicConfig
): CellAppMetrics {
  if (!data || data.assignments === 0) {
    // Return prior (neutral) values for apps with no data
    return {
      conversionRate: 0.5,
      retentionRate: 0.5,
      escapeRate: 0.1,
      sampleSize: 0,
    };
  }

  // Apply Bayesian smoothing
  const smoothing = config.smoothingFactor;

  const conversionRate =
    (data.conversions + smoothing * 0.5) / (data.assignments + smoothing);
  const retentionRate =
    (data.retentions + smoothing * 0.3) / (data.assignments + smoothing);
  const escapeRate =
    (data.escapes + smoothing * 0.1) / (data.assignments + smoothing);

  return {
    conversionRate,
    retentionRate,
    escapeRate,
    sampleSize: data.assignments,
  };
}

/**
 * Compute weighted score based on heuristic config
 */
function computeScore(metrics: CellAppMetrics, config: HeuristicConfig): number {
  const { weights } = config;

  // Escape rate is inverted (lower is better)
  const escapeScore = 1 - metrics.escapeRate;

  return (
    weights.conversion * metrics.conversionRate +
    weights.retention * metrics.retentionRate +
    weights.escape * escapeScore
  );
}

/**
 * Compute confidence based on sample size
 */
function computeConfidence(
  data: CellAppData | undefined,
  totalAssignments: number,
  config: HeuristicConfig
): number {
  if (!data || totalAssignments < config.minSampleSize) {
    return 0.3; // Low confidence
  }

  // Scale confidence from 0.5 to 0.9 based on sample size
  const sampleFactor = Math.min(totalAssignments / (config.minSampleSize * 3), 1);
  return 0.5 + sampleFactor * 0.4;
}

/**
 * Generate human-readable reason for assignment
 */
function generateReason(
  persona: Persona,
  goal: Goal,
  app: App,
  heuristic: HeuristicType,
  metrics: CellAppMetrics
): string {
  const heuristicLabels: Record<HeuristicType, string> = {
    escape_minimizing: 'lowest escape rate',
    conversion_weighted: 'highest conversion',
    retention_weighted: 'best retention',
    balanced: 'balanced score',
  };

  if (metrics.sampleSize === 0) {
    return `Default assignment (no data yet)`;
  }

  return `${heuristicLabels[heuristic]} for ${persona}/${goal} (n=${metrics.sampleSize})`;
}

/**
 * Increment semantic version
 */
function incrementVersion(version: string): string {
  const parts = version.split('.').map(Number);
  parts[2]++; // Increment patch version
  return parts.join('.');
}

/**
 * Compare two matrices and return differences
 */
export function compareMatrices(
  current: MatrixConfig,
  proposed: MatrixConfig
): Array<{
  persona: Persona;
  goal: Goal;
  currentApp: App;
  proposedApp: App;
  currentConfidence: number;
  proposedConfidence: number;
  reason: string;
}> {
  const differences: Array<{
    persona: Persona;
    goal: Goal;
    currentApp: App;
    proposedApp: App;
    currentConfidence: number;
    proposedConfidence: number;
    reason: string;
  }> = [];

  const personas: Persona[] = ['founder', 'builder', 'writer', 'designer', 'curious'];
  const goals: Goal[] = ['productive', 'automate', 'write', 'trends'];

  personas.forEach((persona) => {
    goals.forEach((goal) => {
      const currentCell = current.primaryMatrix[persona][goal];
      const proposedCell = proposed.primaryMatrix[persona][goal];

      if (currentCell.app !== proposedCell.app) {
        differences.push({
          persona,
          goal,
          currentApp: currentCell.app,
          proposedApp: proposedCell.app,
          currentConfidence: currentCell.confidence,
          proposedConfidence: proposedCell.confidence,
          reason: proposedCell.reason,
        });
      }
    });
  });

  return differences;
}

/**
 * Get summary statistics for a proposed matrix
 */
export function getMatrixSummary(matrix: MatrixConfig): {
  totalCells: number;
  cellsWithData: number;
  avgConfidence: number;
  avgEscapeRate: number;
} {
  let cellsWithData = 0;
  let totalConfidence = 0;
  let totalEscapeRate = 0;
  let cellsWithEscapeData = 0;

  const personas: Persona[] = ['founder', 'builder', 'writer', 'designer', 'curious'];
  const goals: Goal[] = ['productive', 'automate', 'write', 'trends'];

  personas.forEach((persona) => {
    goals.forEach((goal) => {
      const cell = matrix.primaryMatrix[persona][goal];
      totalConfidence += cell.confidence;

      if (cell.metadata?.sampleSize && cell.metadata.sampleSize > 0) {
        cellsWithData++;
      }

      if (cell.metadata?.escapeRate !== undefined) {
        totalEscapeRate += cell.metadata.escapeRate;
        cellsWithEscapeData++;
      }
    });
  });

  return {
    totalCells: 20,
    cellsWithData,
    avgConfidence: totalConfidence / 20,
    avgEscapeRate: cellsWithEscapeData > 0 ? totalEscapeRate / cellsWithEscapeData : 0,
  };
}
