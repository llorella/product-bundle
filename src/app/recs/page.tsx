'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { APPS, App, AppInfo } from '@/lib/types';
import { getRecommendedApps, getPrimaryAppCell } from '@/lib/primary-app';
import { trackEvent } from '@/lib/events';
import { getMatrixVersion } from '@/lib/matrix';
import { useEffect, useState, useRef } from 'react';

export default function RecsPage() {
  const router = useRouter();
  const { user, selectedPersona, selectedGoal, startFirstWin } = useStore();
  const [handoffApp, setHandoffApp] = useState<AppInfo | null>(null);
  const pageLoadTime = useRef<number>(Date.now());
  const suggestionsTracked = useRef<boolean>(false);

  // Get recommended apps (control shows 2 apps)
  const [primaryAppId, secondaryAppId] = selectedPersona && selectedGoal
    ? getRecommendedApps(selectedPersona, selectedGoal)
    : [null, null];
  const recommendedApps = primaryAppId && secondaryAppId
    ? [APPS[primaryAppId], APPS[secondaryAppId]]
    : [];

  // Redirect if not logged in or survey not completed
  useEffect(() => {
    if (!user) {
      router.push('/signup');
    } else if (!selectedPersona || !selectedGoal) {
      router.push('/survey');
    } else {
      // Track view
      trackEvent('onboarding_viewed', user.id, 'session', user.variant, {
        screen: 'recs',
      });

      // Track app suggestions (only once)
      if (!suggestionsTracked.current && primaryAppId && secondaryAppId) {
        suggestionsTracked.current = true;
        const matrixVersion = getMatrixVersion();

        // Track primary suggestion
        const primaryCell = getPrimaryAppCell(selectedPersona, selectedGoal);
        trackEvent('app_suggested', user.id, 'session', user.variant, {
          app: primaryAppId,
          position: 1,
          persona: selectedPersona,
          goal: selectedGoal,
          matrix_version: matrixVersion,
          cell_confidence: primaryCell.confidence,
        });

        // Track secondary suggestion (confidence is inherited from primary's secondary prefs)
        trackEvent('app_suggested', user.id, 'session', user.variant, {
          app: secondaryAppId,
          position: 2,
          persona: selectedPersona,
          goal: selectedGoal,
          matrix_version: matrixVersion,
          cell_confidence: 0.5, // Secondary has lower implicit confidence
        });
      }
    }
  }, [user, selectedPersona, selectedGoal, router, primaryAppId, secondaryAppId]);

  if (!user || !selectedPersona || !selectedGoal || !primaryAppId) {
    return null;
  }

  // Handle handoff interstitial timing
  useEffect(() => {
    if (handoffApp) {
      const timer = setTimeout(() => {
        startFirstWin(handoffApp.id);
        router.push(`/app/${handoffApp.id}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [handoffApp, router, startFirstWin]);

  const handleAppClick = (app: AppInfo) => {
    // Track app picked with timing
    const timeToPickMs = Date.now() - pageLoadTime.current;
    const pickPosition = app.id === primaryAppId ? 1 : 2;

    trackEvent('app_picked', user.id, 'session', user.variant, {
      suggested_apps: [primaryAppId, secondaryAppId],
      picked_app: app.id,
      pick_position: pickPosition,
      time_to_pick_ms: timeToPickMs,
    });

    setHandoffApp(app);
  };

  // Show handoff interstitial
  if (handoffApp) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <div className="text-3xl">{handoffApp.icon}</div>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Opening {handoffApp.name}...</h2>
          <p className="text-gray-500 text-sm mb-6">You'll complete setup in a new tab</p>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
          <div className="mt-8 text-xs text-gray-400">
            <span className="font-mono">→ {handoffApp.id}.every.to</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Every
          </Link>
          <div className="text-sm text-gray-500">Step 3 of 3</div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        <div className="animate-fade-in">
          {/* Control variant badge */}
          <div className="mb-6 inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
            CONTROL VARIANT
          </div>

          <h1 className="text-2xl font-bold mb-2">
            Based on <span className="text-gray-400">your goal</span> with AI
          </h1>
          <p className="text-gray-600 mb-8">
            We've selected the best AI tools for you. Get started with a free trial.
          </p>

          {/* Recommended Apps (2 apps for control) */}
          <div className="space-y-4 mb-8">
            {recommendedApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app)}
                className="block w-full text-left p-6 border border-gray-200 rounded-2xl hover:border-gray-400 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{app.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{app.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{app.description}</p>
                    <div className="mt-3 text-sm text-black font-medium flex items-center gap-1">
                      Try it now <span>→</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Alternative: Explore full bundle */}
          <div className="text-center">
            <span className="text-gray-400">or</span>
            <Link
              href="/bundle"
              className="block mt-2 text-black font-medium hover:underline"
            >
              Explore the full Every bundle
            </Link>
          </div>

          {/* Explanation of control flow */}
          <div className="mt-12 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-medium mb-2 text-sm">Control Flow (Current State)</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• User sees 2 recommended apps (choice paralysis)</li>
              <li>• User must choose which to try first</li>
              <li>• Handoff interstitial mimics cross-domain friction</li>
              <li>• No guided first-win task after landing</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
