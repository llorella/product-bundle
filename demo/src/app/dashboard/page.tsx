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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getAllEvents, clearEvents } from '@/lib/events';

// Simplified Event interface for dashboard display
export interface Event {
  id: string;
  type: string;
  userId: string;
  sessionId: string;
  variant: 'control' | 'treatment';
  timestamp: string;
  payload: Record<string, unknown>;
}
import { useStore } from '@/lib/store';

interface CohortMetrics {
  variant: 'control' | 'treatment';
  totalUsers: number;
  signups: number;
  surveyCompleted: number;
  firstWinStarted: number;
  firstWinCompleted: number;
  avgTimeToValue: number;
  activation24h: number;
  crossActivation: number;
}

function generateSyntheticCohort(
  variant: 'control' | 'treatment',
  size: number
): Event[] {
  const events: Event[] = [];
  const baseTime = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days ago

  // Conversion rates by variant
  const rates = {
    control: {
      signupToSurvey: 0.85,
      surveyToFirstWin: 0.45,
      firstWinComplete: 0.6,
      avgTTFV: 180, // seconds
      crossActivation: 0.15,
    },
    treatment: {
      signupToSurvey: 0.92,
      surveyToFirstWin: 0.78,
      firstWinComplete: 0.85,
      avgTTFV: 65, // seconds
      crossActivation: 0.42,
    },
  };

  const r = rates[variant];

  for (let i = 0; i < size; i++) {
    const userId = `synthetic_${variant}_${i}`;
    const sessionId = `session_${variant}_${i}`;
    const userTime = baseTime + Math.random() * 7 * 24 * 60 * 60 * 1000;

    // Signup event (all users)
    events.push({
      id: `${userId}_signup`,
      type: 'signup_completed',
      userId,
      sessionId,
      variant,
      timestamp: new Date(userTime).toISOString(),
      payload: { entry_point: 'signup_page' },
    });

    // Survey completion
    if (Math.random() < r.signupToSurvey) {
      events.push({
        id: `${userId}_survey`,
        type: 'survey_completed',
        userId,
        sessionId,
        variant,
        timestamp: new Date(userTime + 60000).toISOString(),
        payload: {
          persona: ['founder', 'builder', 'writer'][Math.floor(Math.random() * 3)],
          goal: ['productive', 'automate', 'write'][Math.floor(Math.random() * 3)],
        },
      });

      // First win started
      if (Math.random() < r.surveyToFirstWin) {
        const app = ['cora', 'sparkle', 'spiral', 'monologue'][Math.floor(Math.random() * 4)];
        events.push({
          id: `${userId}_fw_start`,
          type: 'first_win_started',
          userId,
          sessionId,
          variant,
          timestamp: new Date(userTime + 120000).toISOString(),
          payload: { app },
        });

        // First win completed
        if (Math.random() < r.firstWinComplete) {
          const ttfv = r.avgTTFV + (Math.random() - 0.5) * r.avgTTFV * 0.5;
          events.push({
            id: `${userId}_fw_complete`,
            type: 'first_win_completed',
            userId,
            sessionId,
            variant,
            timestamp: new Date(userTime + 120000 + ttfv * 1000).toISOString(),
            payload: { app, time_to_value_seconds: Math.round(ttfv) },
          });

          // Cross activation (treatment only, mostly)
          if (Math.random() < r.crossActivation) {
            events.push({
              id: `${userId}_cross`,
              type: 'cross_activation_prompt_shown',
              userId,
              sessionId,
              variant,
              timestamp: new Date(userTime + 180000).toISOString(),
              payload: { from_app: app, to_app: 'sparkle' },
            });
          }
        }
      }
    }
  }

  return events;
}

function calculateMetrics(events: Event[]): { control: CohortMetrics; treatment: CohortMetrics } {
  const byVariant = {
    control: events.filter((e) => e.variant === 'control'),
    treatment: events.filter((e) => e.variant === 'treatment'),
  };

  const calculate = (variantEvents: Event[], variant: 'control' | 'treatment'): CohortMetrics => {
    const signups = variantEvents.filter((e) => e.type === 'signup_completed');
    const surveys = variantEvents.filter((e) => e.type === 'survey_completed');
    const fwStarted = variantEvents.filter((e) => e.type === 'first_win_started');
    const fwCompleted = variantEvents.filter((e) => e.type === 'first_win_completed');
    const crossAct = variantEvents.filter((e) => e.type === 'cross_activation_prompt_shown');

    const uniqueUsers = new Set(variantEvents.map((e) => e.userId)).size;
    const ttfvValues = fwCompleted
      .map((e) => (e.payload as { time_to_value_seconds?: number }).time_to_value_seconds)
      .filter((v): v is number => typeof v === 'number');

    return {
      variant,
      totalUsers: uniqueUsers,
      signups: signups.length,
      surveyCompleted: surveys.length,
      firstWinStarted: fwStarted.length,
      firstWinCompleted: fwCompleted.length,
      avgTimeToValue: ttfvValues.length > 0
        ? Math.round(ttfvValues.reduce((a, b) => a + b, 0) / ttfvValues.length)
        : 0,
      activation24h: uniqueUsers > 0 ? Math.round((fwCompleted.length / uniqueUsers) * 100) : 0,
      crossActivation: fwCompleted.length > 0
        ? Math.round((crossAct.length / fwCompleted.length) * 100)
        : 0,
    };
  };

  return {
    control: calculate(byVariant.control, 'control'),
    treatment: calculate(byVariant.treatment, 'treatment'),
  };
}

export default function DashboardPage() {
  const { user, reset } = useStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [cohortSize, setCohortSize] = useState(100);
  const [showRawEvents, setShowRawEvents] = useState(false);

  useEffect(() => {
    // Transform events from storage format to dashboard format
    const rawEvents = getAllEvents();
    const transformed: Event[] = rawEvents.map((e: Record<string, unknown>) => ({
      id: (e.id || e.event_id || '') as string,
      type: (e.type || e.event || '') as string,
      userId: (e.userId || e.user_id || '') as string,
      sessionId: (e.sessionId || e.session_id || '') as string,
      variant: (e.variant || 'control') as 'control' | 'treatment',
      timestamp: (e.timestamp || '') as string,
      payload: (e.payload || {}) as Record<string, unknown>,
    }));
    setEvents(transformed);
  }, []);

  const metrics = useMemo(() => calculateMetrics(events), [events]);

  const handleGenerateCohort = () => {
    const controlEvents = generateSyntheticCohort('control', cohortSize);
    const treatmentEvents = generateSyntheticCohort('treatment', cohortSize);
    const newEvents = [...events, ...controlEvents, ...treatmentEvents];

    // Store in localStorage
    localStorage.setItem('every_demo_events', JSON.stringify(newEvents));
    setEvents(newEvents);
  };

  const refreshEvents = () => {
    const rawEvents = getAllEvents();
    const transformed: Event[] = rawEvents.map((e: Record<string, unknown>) => ({
      id: (e.id || e.event_id || '') as string,
      type: (e.type || e.event || '') as string,
      userId: (e.userId || e.user_id || '') as string,
      sessionId: (e.sessionId || e.session_id || '') as string,
      variant: (e.variant || 'control') as 'control' | 'treatment',
      timestamp: (e.timestamp || '') as string,
      payload: (e.payload || {}) as Record<string, unknown>,
    }));
    setEvents(transformed);
  };

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
      stage: 'First Win Started',
      control: metrics.control.firstWinStarted,
      treatment: metrics.treatment.firstWinStarted,
    },
    {
      stage: 'First Win Complete',
      control: metrics.control.firstWinCompleted,
      treatment: metrics.treatment.firstWinCompleted,
    },
  ];

  const ttfvData = [
    { name: 'Control', value: metrics.control.avgTimeToValue, fill: '#3B82F6' },
    { name: 'Treatment', value: metrics.treatment.avgTimeToValue, fill: '#10B981' },
  ];

  const activationData = [
    { name: 'Control', value: metrics.control.activation24h, fill: '#3B82F6' },
    { name: 'Treatment', value: metrics.treatment.activation24h, fill: '#10B981' },
  ];

  const lift = (control: number, treatment: number) => {
    if (control === 0) return treatment > 0 ? '+∞' : '0%';
    const pct = ((treatment - control) / control) * 100;
    return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
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
            <span className="text-gray-600">Experiment Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-500">
                Logged in as {user.email}
              </span>
            )}
            <Link
              href="/bundle"
              className="text-sm text-gray-600 hover:text-black"
            >
              Back to Bundle →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Experiment Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Experiment: Single-Path Onboarding</h2>
          <p className="text-gray-600 mb-4">
            Testing whether routing new signups into ONE primary app and guiding them to a
            &quot;first win&quot; increases activation rates and reduces time to first value.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-800">Control</div>
              <div className="text-blue-600">
                Shows 2 recommended apps, user chooses which to try first
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="font-medium text-green-800">Treatment</div>
              <div className="text-green-600">
                Single app assignment based on persona + goal, guided first-win task
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Total Users</div>
            <div className="text-3xl font-bold">
              {metrics.control.totalUsers + metrics.treatment.totalUsers}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {metrics.control.totalUsers} control / {metrics.treatment.totalUsers} treatment
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Activation Rate</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">
                {metrics.treatment.activation24h}%
              </span>
              <span className="text-sm text-gray-400">
                vs {metrics.control.activation24h}%
              </span>
            </div>
            <div className="text-xs text-green-600 mt-1">
              {lift(metrics.control.activation24h, metrics.treatment.activation24h)} lift
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Avg Time to Value</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">
                {metrics.treatment.avgTimeToValue}s
              </span>
              <span className="text-sm text-gray-400">
                vs {metrics.control.avgTimeToValue}s
              </span>
            </div>
            <div className="text-xs text-green-600 mt-1">
              {metrics.control.avgTimeToValue > 0
                ? `${Math.round(((metrics.control.avgTimeToValue - metrics.treatment.avgTimeToValue) / metrics.control.avgTimeToValue) * 100)}% faster`
                : 'N/A'}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Cross Activation</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">
                {metrics.treatment.crossActivation}%
              </span>
              <span className="text-sm text-gray-400">
                vs {metrics.control.crossActivation}%
              </span>
            </div>
            <div className="text-xs text-green-600 mt-1">
              {lift(metrics.control.crossActivation, metrics.treatment.crossActivation)} lift
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Funnel Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Conversion Funnel</h3>
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
            <div className="flex justify-center gap-4 mt-4 text-sm">
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

          {/* Metrics Comparison */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Key Metrics Comparison</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      metric: 'Activation %',
                      control: metrics.control.activation24h,
                      treatment: metrics.treatment.activation24h,
                    },
                    {
                      metric: 'Cross-Act %',
                      control: metrics.control.crossActivation,
                      treatment: metrics.treatment.crossActivation,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="control" fill="#3B82F6" name="Control" />
                  <Bar dataKey="treatment" fill="#10B981" name="Treatment" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4 text-sm">
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
        </div>

        {/* Synthetic Cohort Generator */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold mb-4">Synthetic Cohort Generator</h3>
          <p className="text-sm text-gray-600 mb-4">
            Generate synthetic user cohorts to simulate experiment results. The treatment
            variant has improved conversion rates built in to demonstrate the expected lift.
          </p>
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm text-gray-500">Users per variant</label>
              <input
                type="number"
                value={cohortSize}
                onChange={(e) => setCohortSize(Math.max(1, parseInt(e.target.value) || 0))}
                className="ml-2 w-24 px-3 py-2 border border-gray-200 rounded-lg"
                min="1"
                max="1000"
              />
            </div>
            <button
              onClick={handleGenerateCohort}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Generate Cohort
            </button>
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
              Clear All Data
            </button>
          </div>
        </div>

        {/* Raw Events Toggle */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Raw Events ({events.length})</h3>
            <button
              onClick={() => setShowRawEvents(!showRawEvents)}
              className="text-sm text-gray-500 hover:text-black"
            >
              {showRawEvents ? 'Hide' : 'Show'} events
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
                  {events.slice(-50).reverse().map((event) => (
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
        </div>

        {/* Statistical Significance Note */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <h4 className="font-medium text-yellow-800 mb-2">Note on Statistical Significance</h4>
          <p className="text-sm text-yellow-700">
            This is a demo with synthetic data. In a real experiment, you would need sufficient
            sample size and run time to achieve statistical significance. Typical A/B tests require
            at least 1,000 users per variant and 95% confidence intervals before making decisions.
          </p>
        </div>
      </main>
    </div>
  );
}
