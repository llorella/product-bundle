'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { APPS, App } from '@/lib/types';
import { trackEvent } from '@/lib/events';
import { useEffect, useState } from 'react';

export default function StartPage() {
  const router = useRouter();
  const { user, selectedPersona, selectedGoal, primaryApp, startFirstWin, switchPrimaryApp } = useStore();
  const [showOtherApps, setShowOtherApps] = useState(false);

  // Redirect if not logged in or survey not completed
  useEffect(() => {
    if (!user) {
      router.push('/signup');
    } else if (!selectedPersona || !selectedGoal) {
      router.push('/survey');
    } else {
      // Track view
      trackEvent('onboarding_viewed', user.id, 'session', user.variant, {
        screen: 'start',
      });
    }
  }, [user, selectedPersona, selectedGoal, router]);

  if (!user || !selectedPersona || !selectedGoal || !primaryApp) {
    return null;
  }

  const app = APPS[primaryApp];

  const handleStartFirstWin = () => {
    startFirstWin(primaryApp);
    router.push(`/app/${primaryApp}`);
  };

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
          {/* Treatment variant badge */}
          <div className="mb-6 inline-block px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
            TREATMENT VARIANT
          </div>

          <h1 className="text-2xl font-bold mb-2">
            Based on your answers, start with
          </h1>

          {/* Single App Card */}
          <div className="mt-8 p-8 border-2 border-black rounded-2xl bg-gray-50">
            <div className="text-center">
              <div className="text-6xl mb-4">{app.icon}</div>
              <h2 className="text-2xl font-bold">{app.name}</h2>
              <p className="text-gray-600 mt-2">{app.tagline}</p>
              <p className="text-gray-500 text-sm mt-4">{app.description}</p>
            </div>

            <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Your first task</div>
                <div className="font-semibold">{app.firstWinTask}</div>
                <div className="text-xs text-gray-400 mt-1">{app.firstWinDuration}</div>
              </div>
            </div>

            <button
              onClick={handleStartFirstWin}
              className="w-full mt-6 py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Get your first win with {app.name}
              <span>→</span>
            </button>
          </div>

          {/* Why this app */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Selected because you're a <strong>{selectedPersona}</strong> who wants to{' '}
              <strong>{selectedGoal?.replace('_', ' ')}</strong>
            </p>
          </div>

          {/* Escape hatch */}
          <div className="mt-8">
            <button
              onClick={() => setShowOtherApps(!showOtherApps)}
              className="w-full text-sm text-gray-500 hover:text-black transition-colors flex items-center justify-center gap-1"
            >
              Not what you need? Try a different app
              <span className={`transition-transform ${showOtherApps ? 'rotate-180' : ''}`}>↓</span>
            </button>

            {showOtherApps && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-2">
                <p className="text-xs text-gray-500 mb-3 text-center">Choose a different starting point:</p>
                {(Object.keys(APPS) as App[])
                  .filter(appId => appId !== primaryApp)
                  .map(appId => {
                    const otherApp = APPS[appId];
                    return (
                      <button
                        key={appId}
                        onClick={() => {
                          switchPrimaryApp(appId, 'start');
                          setShowOtherApps(false);
                        }}
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-400 transition-colors text-left flex items-center gap-3"
                      >
                        <span className="text-2xl">{otherApp.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{otherApp.name}</div>
                          <div className="text-xs text-gray-500">{otherApp.tagline}</div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Explanation of treatment flow */}
          <div className="mt-12 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-medium mb-2 text-sm">Treatment Flow (Hypothesis)</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>✅ User sees ONE primary app (no choice paralysis)</li>
              <li>✅ Clear first-win task with time estimate</li>
              <li>✅ Single CTA guides to app experience</li>
              <li>✅ Assignment based on persona + goal</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
