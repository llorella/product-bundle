'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getAllEvents } from '@/lib/events';
import { PERSONAS, GOALS, APPS, Persona, Goal, App } from '@/lib/types';
import { HeuristicType, MatrixConfig, HEURISTIC_CONFIGS } from '@/lib/types/matrix';
import {
  getMatrixVersion,
  getMatrixSource,
  getMatrixConfigSync,
  computeOptimizedMatrix,
  compareMatrices,
  getMatrixSummary,
  setMatrixConfig,
} from '@/lib/matrix';

interface Event {
  id: string;
  type: string;
  userId: string;
  variant: 'control' | 'treatment';
  timestamp: string;
  payload: Record<string, unknown>;
}

interface CellMetrics {
  assignments: number;
  escapes: number;
  escapeRate: number;
  conversions: number;
  conversionRate: number;
  escapePaths: Map<App, number>;
}

interface EscapePath {
  fromApp: App;
  toApp: App;
  persona: Persona;
  goal: Goal;
  count: number;
}

// Calculate metrics per matrix cell
function calculateCellMetrics(events: Event[]): Map<string, CellMetrics> {
  const cellMetrics = new Map<string, CellMetrics>();

  // Initialize all cells
  PERSONAS.forEach(({ value: persona }) => {
    GOALS.forEach(({ value: goal }) => {
      const key = `${persona}_${goal}`;
      cellMetrics.set(key, {
        assignments: 0,
        escapes: 0,
        escapeRate: 0,
        conversions: 0,
        conversionRate: 0,
        escapePaths: new Map(),
      });
    });
  });

  // Count assignments (from app_assigned or primary_app_assigned events)
  const assignmentEvents = events.filter(
    (e) => e.type === 'app_assigned' || e.type === 'primary_app_assigned'
  );
  assignmentEvents.forEach((e) => {
    const persona = e.payload.persona as Persona | undefined;
    const goal = e.payload.goal as Goal | undefined;
    if (persona && goal) {
      const key = `${persona}_${goal}`;
      const cell = cellMetrics.get(key);
      if (cell) {
        cell.assignments++;
      }
    }
  });

  // Count escapes and track paths
  const escapeEvents = events.filter((e) => e.type === 'escape_hatch_clicked');
  escapeEvents.forEach((e) => {
    const persona = e.payload.persona as Persona | undefined;
    const goal = e.payload.goal as Goal | undefined;
    const fromApp = e.payload.from_app as App | undefined;
    const toApp = e.payload.to_app as App | undefined;

    if (persona && goal) {
      const key = `${persona}_${goal}`;
      const cell = cellMetrics.get(key);
      if (cell) {
        cell.escapes++;
        if (toApp) {
          cell.escapePaths.set(toApp, (cell.escapePaths.get(toApp) || 0) + 1);
        }
      }
    }
  });

  // Count conversions (first_win_completed for treatment users)
  const conversionEvents = events.filter(
    (e) => e.type === 'first_win_completed' && e.variant === 'treatment'
  );

  // Group by user to get their persona/goal from assignment events
  const userAssignments = new Map<string, { persona: Persona; goal: Goal }>();
  assignmentEvents.forEach((e) => {
    const persona = e.payload.persona as Persona | undefined;
    const goal = e.payload.goal as Goal | undefined;
    if (persona && goal) {
      userAssignments.set(e.userId, { persona, goal });
    }
  });

  conversionEvents.forEach((e) => {
    const assignment = userAssignments.get(e.userId);
    if (assignment) {
      const key = `${assignment.persona}_${assignment.goal}`;
      const cell = cellMetrics.get(key);
      if (cell) {
        cell.conversions++;
      }
    }
  });

  // Calculate rates
  cellMetrics.forEach((cell) => {
    cell.escapeRate = cell.assignments > 0 ? cell.escapes / cell.assignments : 0;
    cell.conversionRate = cell.assignments > 0 ? cell.conversions / cell.assignments : 0;
  });

  return cellMetrics;
}

// Get top escape paths
function getTopEscapePaths(events: Event[]): EscapePath[] {
  const pathCounts = new Map<string, EscapePath>();

  events
    .filter((e) => e.type === 'escape_hatch_clicked')
    .forEach((e) => {
      const fromApp = e.payload.from_app as App | undefined;
      const toApp = e.payload.to_app as App | undefined;
      const persona = e.payload.persona as Persona | undefined;
      const goal = e.payload.goal as Goal | undefined;

      if (fromApp && toApp && persona && goal) {
        const key = `${fromApp}_${toApp}_${persona}_${goal}`;
        const existing = pathCounts.get(key);
        if (existing) {
          existing.count++;
        } else {
          pathCounts.set(key, { fromApp, toApp, persona, goal, count: 1 });
        }
      }
    });

  return Array.from(pathCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

// Get color for escape rate
function getEscapeRateColor(rate: number, hasData: boolean): string {
  if (!hasData) return 'bg-gray-100';
  if (rate === 0) return 'bg-green-100';
  if (rate < 0.1) return 'bg-green-200';
  if (rate < 0.15) return 'bg-yellow-200';
  if (rate < 0.25) return 'bg-orange-200';
  return 'bg-red-200';
}

export default function MatrixDashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [selectedHeuristic, setSelectedHeuristic] = useState<HeuristicType>('escape_minimizing');
  const [proposedMatrix, setProposedMatrix] = useState<MatrixConfig | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [matrixVersion, setMatrixVersion] = useState(getMatrixVersion());

  useEffect(() => {
    const rawEvents = getAllEvents();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformed: Event[] = rawEvents.map((e: any) => ({
      id: e.event_id || e.id || '',
      type: e.event || e.type || '',
      userId: e.user_id || e.userId || '',
      variant: e.variant || 'control',
      timestamp: e.timestamp || '',
      payload: e.payload || {},
    }));
    setEvents(transformed);
  }, []);

  const cellMetrics = useMemo(() => calculateCellMetrics(events), [events]);
  const escapePaths = useMemo(() => getTopEscapePaths(events), [events]);
  const matrixConfig = getMatrixConfigSync();

  // Overall stats
  const totalAssignments = useMemo(
    () => Array.from(cellMetrics.values()).reduce((sum, c) => sum + c.assignments, 0),
    [cellMetrics]
  );
  const totalEscapes = useMemo(
    () => Array.from(cellMetrics.values()).reduce((sum, c) => sum + c.escapes, 0),
    [cellMetrics]
  );
  const overallEscapeRate = totalAssignments > 0 ? totalEscapes / totalAssignments : 0;

  const selectedCellData = selectedCell ? cellMetrics.get(selectedCell) : null;
  const [selectedPersona, selectedGoal] = selectedCell?.split('_') as [Persona, Goal] || [null, null];
  const selectedCellConfig = selectedPersona && selectedGoal
    ? matrixConfig.primaryMatrix[selectedPersona]?.[selectedGoal]
    : null;

  // Compute proposed matrix differences
  const matrixDifferences = useMemo(() => {
    if (!proposedMatrix) return [];
    return compareMatrices(matrixConfig, proposedMatrix);
  }, [matrixConfig, proposedMatrix]);

  const proposedSummary = useMemo(() => {
    if (!proposedMatrix) return null;
    return getMatrixSummary(proposedMatrix);
  }, [proposedMatrix]);

  // Handlers
  const handleComputeOptimized = () => {
    setIsComputing(true);
    // Simulate async computation
    setTimeout(() => {
      const eventData = events.map((e) => ({
        type: e.type,
        userId: e.userId,
        variant: e.variant,
        payload: e.payload,
      }));
      const optimized = computeOptimizedMatrix(eventData, selectedHeuristic);
      setProposedMatrix(optimized);
      setIsComputing(false);
    }, 500);
  };

  const handleApplyMatrix = async () => {
    if (!proposedMatrix) return;

    try {
      // Update local state
      setMatrixConfig(proposedMatrix);
      setMatrixVersion(proposedMatrix.version);

      // Optionally persist to API
      await fetch('/api/matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposedMatrix),
      });

      // Clear proposed matrix
      setProposedMatrix(null);
      alert('Matrix updated successfully!');
    } catch (error) {
      console.error('Failed to apply matrix:', error);
      alert('Failed to apply matrix. Changes saved locally only.');
    }
  };

  const handleResetMatrix = async () => {
    if (!confirm('Reset matrix to default configuration?')) return;

    try {
      await fetch('/api/matrix', { method: 'DELETE' });
      // Reload to get fresh default config
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset matrix:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold">
              Every
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/dashboard" className="text-gray-600 hover:text-black">
              Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Matrix Analysis</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              Matrix v{matrixVersion} ({getMatrixSource()})
            </span>
            <button
              onClick={handleResetMatrix}
              className="text-xs text-gray-400 hover:text-red-600"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Overall Metrics */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Matrix Performance Overview</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Total Assignments</div>
              <div className="text-2xl font-bold">{totalAssignments}</div>
              <div className="text-xs text-gray-400">Treatment users assigned via matrix</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Total Escapes</div>
              <div className="text-2xl font-bold">{totalEscapes}</div>
              <div className="text-xs text-gray-400">Users who switched apps</div>
            </div>
            <div className={`p-4 rounded-lg ${overallEscapeRate > 0.15 ? 'bg-red-50' : 'bg-green-50'}`}>
              <div className="text-sm text-gray-500">Overall Escape Rate</div>
              <div className="text-2xl font-bold">
                {(overallEscapeRate * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400">
                Target: &lt; 15%
                {overallEscapeRate > 0.15 && (
                  <span className="text-red-600 ml-1">⚠️ Above threshold</span>
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Cells with Data</div>
              <div className="text-2xl font-bold">
                {Array.from(cellMetrics.values()).filter((c) => c.assignments > 0).length} / 20
              </div>
              <div className="text-xs text-gray-400">Persona × Goal combinations</div>
            </div>
          </div>
        </section>

        {/* Matrix Optimization */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Matrix Optimization</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optimization Heuristic
              </label>
              <select
                value={selectedHeuristic}
                onChange={(e) => setSelectedHeuristic(e.target.value as HeuristicType)}
                className="w-full p-2 border border-gray-200 rounded-lg mb-4"
              >
                <option value="escape_minimizing">Escape Minimizing (60% escape, 20% conv, 20% ret)</option>
                <option value="conversion_weighted">Conversion Weighted (20% escape, 60% conv, 20% ret)</option>
                <option value="retention_weighted">Retention Weighted (20% escape, 20% conv, 60% ret)</option>
                <option value="balanced">Balanced (33% each)</option>
              </select>

              <div className="text-sm text-gray-600 mb-4">
                <strong>Weights:</strong>{' '}
                Conversion {(HEURISTIC_CONFIGS[selectedHeuristic].weights.conversion * 100).toFixed(0)}% |{' '}
                Retention {(HEURISTIC_CONFIGS[selectedHeuristic].weights.retention * 100).toFixed(0)}% |{' '}
                Escape {(HEURISTIC_CONFIGS[selectedHeuristic].weights.escape * 100).toFixed(0)}%
              </div>

              <button
                onClick={handleComputeOptimized}
                disabled={isComputing || totalAssignments < 10}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isComputing ? 'Computing...' : 'Compute Optimized Matrix'}
              </button>
              {totalAssignments < 10 && (
                <p className="text-xs text-gray-500 mt-2">
                  Need at least 10 assignments to compute (currently {totalAssignments})
                </p>
              )}
            </div>

            {/* Preview */}
            <div>
              {proposedMatrix ? (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Proposed Changes</h3>
                    <span className="text-xs text-gray-500">v{proposedMatrix.version}</span>
                  </div>

                  {matrixDifferences.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No changes recommended. Current matrix is optimal for this heuristic.
                    </p>
                  ) : (
                    <>
                      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                        {matrixDifferences.map((diff, i) => (
                          <div key={i} className="p-2 bg-white rounded border border-gray-200 text-sm">
                            <div className="font-medium">
                              {diff.persona} × {diff.goal}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <span>{APPS[diff.currentApp].icon} {diff.currentApp}</span>
                              <span>→</span>
                              <span className="text-green-600 font-medium">
                                {APPS[diff.proposedApp].icon} {diff.proposedApp}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400">{diff.reason}</div>
                          </div>
                        ))}
                      </div>

                      {proposedSummary && (
                        <div className="text-xs text-gray-500 mb-4">
                          Avg confidence: {(proposedSummary.avgConfidence * 100).toFixed(0)}% |{' '}
                          Cells with data: {proposedSummary.cellsWithData}/20
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={handleApplyMatrix}
                          className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Apply Changes
                        </button>
                        <button
                          onClick={() => setProposedMatrix(null)}
                          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg h-full flex items-center justify-center text-gray-400 text-sm">
                  Click "Compute Optimized Matrix" to see proposed changes
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Matrix Heatmap */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-2">Escape Rate Heatmap</h2>
          <p className="text-sm text-gray-600 mb-4">
            Click a cell to see detailed metrics. Color indicates escape rate (green = low, red = high).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-sm font-medium text-gray-500 w-32">
                    Persona / Goal
                  </th>
                  {GOALS.map(({ value, label }) => (
                    <th key={value} className="p-2 text-center text-sm font-medium text-gray-500">
                      {label.replace('Be more ', '').replace('Stay ahead of ', '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERSONAS.map(({ value: persona, label: personaLabel }) => (
                  <tr key={persona}>
                    <td className="p-2 text-sm font-medium text-gray-700 border-t">
                      {personaLabel.split('/')[0]}
                    </td>
                    {GOALS.map(({ value: goal }) => {
                      const key = `${persona}_${goal}`;
                      const cell = cellMetrics.get(key);
                      const hasData = cell && cell.assignments > 0;
                      const escapeRate = cell?.escapeRate || 0;
                      const configCell = matrixConfig.primaryMatrix[persona]?.[goal];
                      const isSelected = selectedCell === key;

                      return (
                        <td key={goal} className="p-1 border-t">
                          <button
                            onClick={() => setSelectedCell(isSelected ? null : key)}
                            className={`w-full p-3 rounded-lg transition-all ${getEscapeRateColor(
                              escapeRate,
                              !!hasData
                            )} ${isSelected ? 'ring-2 ring-black' : 'hover:ring-2 hover:ring-gray-300'}`}
                          >
                            <div className="text-lg font-bold">
                              {configCell ? APPS[configCell.app].icon : '?'}
                            </div>
                            <div className="text-xs font-medium">
                              {configCell?.app || '—'}
                            </div>
                            {hasData ? (
                              <>
                                <div className="text-sm font-bold mt-1">
                                  {(escapeRate * 100).toFixed(0)}%
                                </div>
                                <div className="text-xs text-gray-500">
                                  {cell.escapes}/{cell.assignments}
                                </div>
                              </>
                            ) : (
                              <div className="text-xs text-gray-400 mt-1">No data</div>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs">
            <span className="text-gray-500">Escape Rate:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-100 rounded" />
              <span>0%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-200 rounded" />
              <span>&lt;10%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-200 rounded" />
              <span>&lt;15%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-orange-200 rounded" />
              <span>&lt;25%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-200 rounded" />
              <span>≥25%</span>
            </div>
            <div className="flex items-center gap-1 ml-4">
              <div className="w-4 h-4 bg-gray-100 rounded" />
              <span>No data</span>
            </div>
          </div>
        </section>

        {/* Cell Detail Panel */}
        {selectedCell && selectedCellData && selectedCellConfig && (
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                Cell Detail: {selectedPersona} × {selectedGoal}
              </h2>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-gray-400 hover:text-black"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Assignment Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Current Assignment</h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{APPS[selectedCellConfig.app].icon}</span>
                  <div>
                    <div className="font-bold">{APPS[selectedCellConfig.app].name}</div>
                    <div className="text-sm text-gray-500">{APPS[selectedCellConfig.app].tagline}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Reason:</strong> {selectedCellConfig.reason}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <strong>Confidence:</strong> {(selectedCellConfig.confidence * 100).toFixed(0)}%
                </div>
              </div>

              {/* Metrics */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Performance Metrics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assignments</span>
                    <span className="font-medium">{selectedCellData.assignments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Escapes</span>
                    <span className="font-medium">{selectedCellData.escapes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Escape Rate</span>
                    <span className={`font-medium ${selectedCellData.escapeRate > 0.15 ? 'text-red-600' : 'text-green-600'}`}>
                      {(selectedCellData.escapeRate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Conversions</span>
                    <span className="font-medium">{selectedCellData.conversions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Conversion Rate</span>
                    <span className="font-medium">
                      {(selectedCellData.conversionRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Escape Destinations */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Escape Destinations</h3>
                {selectedCellData.escapePaths.size > 0 ? (
                  <div className="space-y-2">
                    {Array.from(selectedCellData.escapePaths.entries())
                      .sort((a, b) => b[1] - a[1])
                      .map(([app, count]) => (
                        <div key={app} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span>{APPS[app].icon}</span>
                            <span>{APPS[app].name}</span>
                          </div>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">No escapes recorded</div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Top Escape Paths */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Top Escape Paths</h2>
          {escapePaths.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3">From App</th>
                    <th className="text-left py-2 px-3">To App</th>
                    <th className="text-left py-2 px-3">Persona</th>
                    <th className="text-left py-2 px-3">Goal</th>
                    <th className="text-right py-2 px-3">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {escapePaths.map((path, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <span>{APPS[path.fromApp].icon}</span>
                          <span>{APPS[path.fromApp].name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <span>→</span>
                          <span>{APPS[path.toApp].icon}</span>
                          <span>{APPS[path.toApp].name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 capitalize">{path.persona}</td>
                      <td className="py-2 px-3 capitalize">{path.goal}</td>
                      <td className="py-2 px-3 text-right font-medium">{path.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No escape events recorded yet.</p>
              <p className="text-sm mt-1">
                Test the{' '}
                <Link href="/signup" className="text-blue-600 underline">
                  treatment flow
                </Link>{' '}
                and use the escape hatch to generate data.
              </p>
            </div>
          )}
        </section>

        {/* Recommendations */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Optimization Recommendations</h2>
          <div className="space-y-3">
            {Array.from(cellMetrics.entries())
              .filter(([_, cell]) => cell.assignments >= 5 && cell.escapeRate > 0.15)
              .sort((a, b) => b[1].escapeRate - a[1].escapeRate)
              .slice(0, 5)
              .map(([key, cell]) => {
                const [persona, goal] = key.split('_') as [Persona, Goal];
                const configCell = matrixConfig.primaryMatrix[persona]?.[goal];
                const topEscape = Array.from(cell.escapePaths.entries())
                  .sort((a, b) => b[1] - a[1])[0];

                return (
                  <div key={key} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{persona}</span>
                        <span className="text-gray-400 mx-2">×</span>
                        <span className="font-medium">{goal}</span>
                      </div>
                      <span className="text-orange-700 font-medium">
                        {(cell.escapeRate * 100).toFixed(0)}% escape rate
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Currently assigns <strong>{configCell?.app}</strong>
                      {topEscape && (
                        <span>
                          , but users often switch to <strong>{topEscape[0]}</strong> ({topEscape[1]} times)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-orange-600 mt-1">
                      Consider: Review if {topEscape?.[0] || 'alternative'} is a better fit for this segment
                    </div>
                  </div>
                );
              })}
            {Array.from(cellMetrics.entries()).filter(
              ([_, cell]) => cell.assignments >= 5 && cell.escapeRate > 0.15
            ).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                {totalAssignments < 20
                  ? 'Need more data to generate recommendations (min 5 assignments per cell)'
                  : '✅ All cells with sufficient data are below 15% escape rate'}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
