'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { APPS } from '@/lib/types';
import { getRecommendedApps } from '@/lib/primary-app';
import { trackEvent } from '@/lib/events';
import { useEffect } from 'react';

export default function RecsPage() {
  const router = useRouter();
  const { user, selectedPersona, selectedGoal } = useStore();

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
    }
  }, [user, selectedPersona, selectedGoal, router]);

  if (!user || !selectedPersona || !selectedGoal) {
    return null;
  }

  // Get recommended apps (control shows 2 apps)
  const [primaryApp, secondaryApp] = getRecommendedApps(selectedPersona, selectedGoal);
  const recommendedApps = [APPS[primaryApp], APPS[secondaryApp]];

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
              <Link
                key={app.id}
                href={`/app/${app.id}`}
                className="block p-6 border border-gray-200 rounded-2xl hover:border-gray-400 hover:shadow-md transition-all"
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
              </Link>
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
              <li>• User sees 2 recommended apps</li>
              <li>• User must choose which to try first</li>
              <li>• No guided first-win task</li>
              <li>• Links go directly to app landing pages</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
