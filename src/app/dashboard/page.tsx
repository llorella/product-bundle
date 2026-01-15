'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getAllEvents, clearEvents } from '@/lib/events';
import { useStore } from '@/lib/store';
import { EXPERIMENT_METRICS } from '@/lib/types';
import {
  requiredSampleSize,
  experimentDuration,
  proportionSignificance,
  continuousSignificance,
} from '@/lib/stats';

interface Event {
  id: string;
  type: string;
  userId: string;
  sessionId: string;
  variant: 'control' | 'treatment';
  timestamp: string;
  payload: Record<string, unknown>;
}

interface VariantMetrics {
  totalUsers: number;
  signups: number;
  surveyCompleted: number;
  firstWinStarted: number;
  firstWinCompleted: number;
  multiProductUsers: number; // Users with 2+ app completions
  ttfvValues: number[];
  crossActivationShown: number;
  crossActivationClicked: number;
  escapeHatchClicked: number;
  primaryAppAssigned: number;
}

function calculateVariantMetrics(events: Event[]): {
  control: VariantMetrics;
  treatment: VariantMetrics;
} {
  const byVariant = {
    control: events.filter((e) => e.variant === 'control'),
    treatment: events.filter((e) => e.variant === 'treatment'),
  };

  const calculate = (variantEvents: Event[]): VariantMetrics => {
    const signups = variantEvents.filter((e) => e.type === 'signup_completed');
    const surveys = variantEvents.filter((e) => e.type === 'survey_completed');
    const fwStarted = variantEvents.filter((e) => e.type === 'first_win_started');
    const fwCompleted = variantEvents.filter((e) => e.type === 'first_win_completed');
    const crossActShown = variantEvents.filter(
      (e) => e.type === 'cross_activation_prompt_shown'
    );
    const crossActClicked = variantEvents.filter(
      (e) => e.type === 'cross_activation_clicked'
    );
    const escapeHatch = variantEvents.filter((e) => e.type === 'escape_hatch_clicked');
    const primaryAssigned = variantEvents.filter((e) => e.type === 'primary_app_assigned');

    const uniqueUsers = new Set(signups.map((e) => e.userId)).size;
    const ttfvValues = fwCompleted
      .map((e) => (e.payload as { time_to_value_seconds?: number }).time_to_value_seconds)
      .filter((v): v is number => typeof v === 'number');

    // Count users with 2+ app completions (multi-product users)
    const completionsByUser = new Map<string, Set<string>>();
    fwCompleted.forEach((e) => {
      const app = (e.payload as { app?: string }).app;
      if (!completionsByUser.has(e.userId)) {
        completionsByUser.set(e.userId, new Set());
      }
      if (app) {
        completionsByUser.get(e.userId)!.add(app);
      }
    });
    const multiProductUsers = Array.from(completionsByUser.values()).filter(
      (apps) => apps.size >= 2
    ).length;

    return {
      totalUsers: uniqueUsers,
      signups: signups.length,
      surveyCompleted: surveys.length,
      firstWinStarted: fwStarted.length,
      firstWinCompleted: fwCompleted.length,
      multiProductUsers,
      ttfvValues,
      crossActivationShown: crossActShown.length,
      crossActivationClicked: crossActClicked.length,
      escapeHatchClicked: escapeHatch.length,
      primaryAppAssigned: primaryAssigned.length,
    };
  };

  return {
    control: calculate(byVariant.control),
    treatment: calculate(byVariant.treatment),
  };
}

function SignificanceBadge({
  status,
}: {
  status: 'significant' | 'not_significant' | 'insufficient_data';
}) {
  const styles = {
    significant: 'bg-green-100 text-green-800',
    not_significant: 'bg-yellow-100 text-yellow-800',
    insufficient_data: 'bg-gray-100 text-gray-600',
  };
  const labels = {
    significant: 'Statistically Significant',
    not_significant: 'Not Yet Significant',
    insufficient_data: 'Insufficient Data (n < 30)',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function DashboardPage() {
  const { user, reset } = useStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [showRawEvents, setShowRawEvents] = useState(false);

  // Sample size calculator inputs
  const [baselineRate, setBaselineRate] = useState(0.24);
  const [mde, setMde] = useState(0.20);
  const [dailySignups, setDailySignups] = useState(100);

  useEffect(() => {
    const rawEvents = getAllEvents();
    // Transform from library Event type to dashboard Event type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformed: Event[] = rawEvents.map((e: any) => ({
      id: e.event_id || e.id || '',
      type: e.event || e.type || '',
      userId: e.user_id || e.userId || '',
      sessionId: e.session_id || e.sessionId || '',
      variant: e.variant || 'control',
      timestamp: e.timestamp || '',
      payload: e.payload || {},
    }));
    setEvents(transformed);
  }, []);

  const metrics = useMemo(() => calculateVariantMetrics(events), [events]);

  // Statistical calculations

  // PRIMARY: Multi-product activation (2+ apps)
  const multiProductStats = useMemo(
    () =>
      proportionSignificance(
        metrics.control.totalUsers,
        metrics.control.multiProductUsers,
        metrics.treatment.totalUsers,
        metrics.treatment.multiProductUsers
      ),
    [metrics]
  );

  // SECONDARY: First product activation
  const firstProductStats = useMemo(
    () =>
      proportionSignificance(
        metrics.control.totalUsers,
        metrics.control.firstWinCompleted,
        metrics.treatment.totalUsers,
        metrics.treatment.firstWinCompleted
      ),
    [metrics]
  );

  // SECONDARY: Time to first value
  const ttfvStats = useMemo(
    () =>
      continuousSignificance(
        metrics.control.ttfvValues,
        metrics.treatment.ttfvValues
      ),
    [metrics]
  );

  // SECONDARY: Cross-activation prompt CTR (treatment only)
  const crossPromptCTR = useMemo(() => {
    if (metrics.treatment.crossActivationShown === 0) return null;
    return metrics.treatment.crossActivationClicked / metrics.treatment.crossActivationShown;
  }, [metrics]);

  // GUARDRAIL: Survey completion
  const surveyStats = useMemo(
    () =>
      proportionSignificance(
        metrics.control.totalUsers,
        metrics.control.surveyCompleted,
        metrics.treatment.totalUsers,
        metrics.treatment.surveyCompleted
      ),
    [metrics]
  );

  // GUARDRAIL: Escape hatch rate (treatment only - signals misrouting)
  const escapeHatchRate = useMemo(() => {
    if (metrics.treatment.primaryAppAssigned === 0) return null;
    return metrics.treatment.escapeHatchClicked / metrics.treatment.primaryAppAssigned;
  }, [metrics]);

  // Sample size calculation
  const sampleSize = useMemo(() => {
    try {
      return requiredSampleSize(baselineRate, mde);
    } catch {
      return null;
    }
  }, [baselineRate, mde]);

  const expDuration = useMemo(() => {
    if (!sampleSize) return null;
    return experimentDuration(sampleSize, dailySignups);
  }, [sampleSize, dailySignups]);

  const handleClearData = () => {
    clearEvents();
    reset();
    setEvents([]);
  };

  const funnelData = [
    {
      stage: 'Signups',
      control: metrics.control.signups,
      treatment: metrics.treatment.signups,
    },
    {
      stage: 'Survey Done',
      control: metrics.control.surveyCompleted,
      treatment: metrics.treatment.surveyCompleted,
    },
    {
      stage: '1st Product',
      control: metrics.control.firstWinCompleted,
      treatment: metrics.treatment.firstWinCompleted,
    },
    {
      stage: '2+ Products',
      control: metrics.control.multiProductUsers,
      treatment: metrics.treatment.multiProductUsers,
    },
  ];

  const formatPercent = (n: number) => `${(n * 100).toFixed(1)}%`;
  const formatPValue = (p: number) =>
    isNaN(p) ? 'N/A' : p < 0.001 ? '< 0.001' : p.toFixed(3);

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
            <span className="text-gray-600">Experiment Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-500">
                Logged in as {user.email}
              </span>
            )}
            <Link href="/bundle" className="text-sm text-gray-600 hover:text-black">
              Back to Bundle
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Experiment Design */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-2">Demand-Driven Bundle Discovery</h2>
          <p className="text-gray-600 mb-6">
            <strong>Hypothesis:</strong> Users discover bundle value more effectively when adjacent products are surfaced at moments of accomplished value (demand-driven discovery) rather than presented upfront as a menu of options.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            <strong>Business Impact:</strong> Multi-product users retain 3-4x better than single-product users. This experiment targets the <em>mechanism</em> by which users become multi-product users.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Variants */}
            <div>
              <h3 className="font-semibold mb-3">Variants</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="font-medium text-blue-800">Control (Menu-Driven)</div>
                  <div className="text-sm text-blue-600">
                    Shows 2 recommended apps; user chooses → self-directed exploration
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="font-medium text-green-800">Treatment (Demand-Driven)</div>
                  <div className="text-sm text-green-600">
                    Single app → guided first-win → contextual cross-sell tied to accomplishment
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div>
              <h3 className="font-semibold mb-3">Metric Definitions</h3>
              <div className="space-y-2">
                {EXPERIMENT_METRICS.map((metric) => (
                  <div
                    key={metric.id}
                    className="p-2 bg-gray-50 rounded border border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                          metric.type === 'primary'
                            ? 'bg-purple-100 text-purple-700'
                            : metric.type === 'secondary'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {metric.type}
                      </span>
                      <span className="font-medium text-sm">{metric.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{metric.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sample Size Calculator */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-2">Sample Size Planning</h2>
          <p className="text-sm text-gray-600 mb-4">
            Calculate required sample size to detect a statistically significant
            difference (80% power, 5% significance level, two-tailed).
          </p>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Baseline activation rate
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={(baselineRate * 100).toFixed(0)}
                  onChange={(e) =>
                    setBaselineRate(Math.max(1, Math.min(99, parseInt(e.target.value) || 0)) / 100)
                  }
                  className="w-20 px-3 py-2 border border-gray-200 rounded-lg"
                  min="1"
                  max="99"
                />
                <span className="text-gray-500">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Minimum detectable effect
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={(mde * 100).toFixed(0)}
                  onChange={(e) =>
                    setMde(Math.max(1, Math.min(200, parseInt(e.target.value) || 0)) / 100)
                  }
                  className="w-20 px-3 py-2 border border-gray-200 rounded-lg"
                  min="1"
                  max="200"
                />
                <span className="text-gray-500">% relative lift</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Daily signups
              </label>
              <input
                type="number"
                value={dailySignups}
                onChange={(e) =>
                  setDailySignups(Math.max(1, parseInt(e.target.value) || 0))
                }
                className="w-24 px-3 py-2 border border-gray-200 rounded-lg"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fixed parameters</label>
              <div className="text-sm text-gray-500">
                Power: 80% | Alpha: 5%
              </div>
            </div>
          </div>

          {sampleSize && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {sampleSize.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">users per variant</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {(sampleSize * 2).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">total users needed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {expDuration} days
                  </div>
                  <div className="text-sm text-gray-500">
                    at {dailySignups}/day
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                To detect a {(mde * 100).toFixed(0)}% relative lift from{' '}
                {(baselineRate * 100).toFixed(0)}% to{' '}
                {(baselineRate * (1 + mde) * 100).toFixed(1)}% activation
              </p>
            </div>
          )}
        </section>

        {/* Current Results */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Current Results</h2>
            <button
              onClick={handleClearData}
              className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
            >
              Clear All Data
            </button>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-2">No events tracked yet.</p>
              <p className="text-sm">
                Go through the{' '}
                <Link href="/signup" className="text-blue-600 underline">
                  signup flow
                </Link>{' '}
                to generate data.
              </p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Total Users</div>
                  <div className="text-2xl font-bold">
                    {metrics.control.totalUsers + metrics.treatment.totalUsers}
                  </div>
                  <div className="text-xs text-gray-400">
                    {metrics.control.totalUsers} ctrl / {metrics.treatment.totalUsers} treat
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-sm text-purple-700 mb-1 flex items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-purple-100 rounded text-xs font-medium">PRIMARY</span>
                    Multi-Product (2+)
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {formatPercent(multiProductStats.treatmentRate)}
                    </span>
                    <span className="text-sm text-gray-400">
                      vs {formatPercent(multiProductStats.controlRate)}
                    </span>
                  </div>
                  <SignificanceBadge status={multiProductStats.status} />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">1st Product Activation</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {formatPercent(firstProductStats.treatmentRate)}
                    </span>
                    <span className="text-sm text-gray-400">
                      vs {formatPercent(firstProductStats.controlRate)}
                    </span>
                  </div>
                  <SignificanceBadge status={firstProductStats.status} />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Cross-Prompt CTR</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {crossPromptCTR !== null ? formatPercent(crossPromptCTR) : 'N/A'}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({metrics.treatment.crossActivationClicked}/{metrics.treatment.crossActivationShown})
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                    Treatment only
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Time to Value</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {ttfvStats.treatmentMean.toFixed(0)}s
                    </span>
                    <span className="text-sm text-gray-400">
                      vs {ttfvStats.controlMean.toFixed(0)}s
                    </span>
                  </div>
                  <SignificanceBadge status={ttfvStats.status} />
                </div>
              </div>

              {/* Statistical Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3">Statistical Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2">Metric</th>
                        <th className="text-right py-2 px-2">Control</th>
                        <th className="text-right py-2 px-2">Treatment</th>
                        <th className="text-right py-2 px-2">Difference</th>
                        <th className="text-right py-2 px-2">95% CI</th>
                        <th className="text-right py-2 px-2">p-value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 bg-purple-50">
                        <td className="py-2 px-2 font-medium">
                          <span className="px-1.5 py-0.5 bg-purple-100 rounded text-xs font-medium text-purple-700 mr-1">P</span>
                          Multi-Product (2+)
                        </td>
                        <td className="py-2 px-2 text-right">
                          {formatPercent(multiProductStats.controlRate)}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {formatPercent(multiProductStats.treatmentRate)}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {multiProductStats.absoluteDiff >= 0 ? '+' : ''}
                          {formatPercent(multiProductStats.absoluteDiff)}
                        </td>
                        <td className="py-2 px-2 text-right text-gray-500">
                          {isNaN(multiProductStats.confidenceInterval.lower)
                            ? 'N/A'
                            : `[${formatPercent(
                                multiProductStats.confidenceInterval.lower
                              )}, ${formatPercent(
                                multiProductStats.confidenceInterval.upper
                              )}]`}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {formatPValue(multiProductStats.pValue)}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-2 font-medium">
                          <span className="px-1.5 py-0.5 bg-blue-100 rounded text-xs font-medium text-blue-700 mr-1">S</span>
                          1st Product Activation
                        </td>
                        <td className="py-2 px-2 text-right">
                          {formatPercent(firstProductStats.controlRate)}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {formatPercent(firstProductStats.treatmentRate)}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {firstProductStats.absoluteDiff >= 0 ? '+' : ''}
                          {formatPercent(firstProductStats.absoluteDiff)}
                        </td>
                        <td className="py-2 px-2 text-right text-gray-500">
                          {isNaN(firstProductStats.confidenceInterval.lower)
                            ? 'N/A'
                            : `[${formatPercent(
                                firstProductStats.confidenceInterval.lower
                              )}, ${formatPercent(
                                firstProductStats.confidenceInterval.upper
                              )}]`}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {formatPValue(firstProductStats.pValue)}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-2 font-medium">
                          <span className="px-1.5 py-0.5 bg-blue-100 rounded text-xs font-medium text-blue-700 mr-1">S</span>
                          Time to Value (s)
                        </td>
                        <td className="py-2 px-2 text-right">
                          {ttfvStats.controlMean.toFixed(1)}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {ttfvStats.treatmentMean.toFixed(1)}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {ttfvStats.absoluteDiff >= 0 ? '+' : ''}
                          {ttfvStats.absoluteDiff.toFixed(1)}s
                        </td>
                        <td className="py-2 px-2 text-right text-gray-500">
                          {isNaN(ttfvStats.confidenceInterval.lower)
                            ? 'N/A'
                            : `[${ttfvStats.confidenceInterval.lower.toFixed(
                                1
                              )}, ${ttfvStats.confidenceInterval.upper.toFixed(1)}]`}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {formatPValue(ttfvStats.pValue)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-medium">
                          <span className="px-1.5 py-0.5 bg-orange-100 rounded text-xs font-medium text-orange-700 mr-1">G</span>
                          Survey Completion
                        </td>
                        <td className="py-2 px-2 text-right">
                          {formatPercent(surveyStats.controlRate)}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {formatPercent(surveyStats.treatmentRate)}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {surveyStats.absoluteDiff >= 0 ? '+' : ''}
                          {formatPercent(surveyStats.absoluteDiff)}
                        </td>
                        <td className="py-2 px-2 text-right text-gray-500">
                          {isNaN(surveyStats.confidenceInterval.lower)
                            ? 'N/A'
                            : `[${formatPercent(
                                surveyStats.confidenceInterval.lower
                              )}, ${formatPercent(
                                surveyStats.confidenceInterval.upper
                              )}]`}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {formatPValue(surveyStats.pValue)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-medium">
                          <span className="px-1.5 py-0.5 bg-orange-100 rounded text-xs font-medium text-orange-700 mr-1">G</span>
                          Escape Hatch Rate
                        </td>
                        <td className="py-2 px-2 text-right text-gray-400">N/A</td>
                        <td className="py-2 px-2 text-right">
                          {escapeHatchRate !== null ? formatPercent(escapeHatchRate) : 'N/A'}
                        </td>
                        <td className="py-2 px-2 text-right text-gray-400" colSpan={3}>
                          <span className="text-xs">
                            Treatment only ({metrics.treatment.escapeHatchClicked}/{metrics.treatment.primaryAppAssigned} switched)
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Funnel Chart */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Conversion Funnel</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={funnelData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="stage" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="control" fill="#3B82F6" name="Control" />
                        <Bar dataKey="treatment" fill="#10B981" name="Treatment" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded" />
                      <span>Control</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded" />
                      <span>Treatment</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Interpretation Guide</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">
                        Statistically Significant
                      </div>
                      <div className="text-green-700">
                        p-value &lt; 0.05. The observed difference is unlikely due
                        to chance. Consider shipping if guardrails are healthy.
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-yellow-800">
                        Not Yet Significant
                      </div>
                      <div className="text-yellow-700">
                        p-value &gt;= 0.05. Cannot rule out chance. Continue
                        running the experiment to collect more data.
                      </div>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <div className="font-medium text-gray-700">
                        Insufficient Data
                      </div>
                      <div className="text-gray-600">
                        Fewer than 30 users per variant. Statistical tests are
                        unreliable at small sample sizes.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Raw Events */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Event Log ({events.length} events)</h3>
            <button
              onClick={() => setShowRawEvents(!showRawEvents)}
              className="text-sm text-gray-500 hover:text-black"
            >
              {showRawEvents ? 'Hide' : 'Show'}
            </button>
          </div>
          {showRawEvents && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Time</th>
                    <th className="text-left py-2 px-2">Type</th>
                    <th className="text-left py-2 px-2">Variant</th>
                    <th className="text-left py-2 px-2">User</th>
                    <th className="text-left py-2 px-2">Payload</th>
                  </tr>
                </thead>
                <tbody>
                  {events
                    .slice(-50)
                    .reverse()
                    .map((event) => (
                      <tr key={event.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2 text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </td>
                        <td className="py-2 px-2 font-mono text-xs">
                          {event.type}
                        </td>
                        <td className="py-2 px-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              event.variant === 'treatment'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {event.variant}
                          </span>
                        </td>
                        <td className="py-2 px-2 font-mono text-xs truncate max-w-32">
                          {event.userId.slice(0, 12)}...
                        </td>
                        <td className="py-2 px-2 font-mono text-xs text-gray-500 truncate max-w-48">
                          {JSON.stringify(event.payload)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {events.length > 50 && (
                <div className="text-center text-sm text-gray-500 mt-4">
                  Showing last 50 events of {events.length} total
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
