'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { APPS, CHECKLIST_ITEMS, App } from '@/lib/types';
import { trackEvent } from '@/lib/events';

export default function BundlePage() {
  const router = useRouter();
  const { user, completedItems, toggleChecklistItem, firstWinCompletedAt, firstWinApp } = useStore();
  const [activeTab, setActiveTab] = useState<'checklist' | 'apps'>('checklist');

  // Redirect if not logged in
  if (!user) {
    router.push('/signup');
    return null;
  }

  const completedCount = completedItems.length;
  const progress = (completedCount / CHECKLIST_ITEMS.length) * 100;

  const handleItemToggle = (itemId: string) => {
    toggleChecklistItem(itemId);
    trackEvent('checklist_item_clicked', user.id, 'session', user.variant, {
      item_id: itemId,
      item_category: 'product',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Every
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-black"
            >
              View Dashboard
            </Link>
            <div className="text-sm text-gray-500">
              {user.email}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* First win celebration banner */}
        {firstWinCompletedAt && firstWinApp && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{APPS[firstWinApp].icon}</div>
              <div>
                <div className="font-medium text-green-800">
                  First win achieved with {APPS[firstWinApp].name}!
                </div>
                <div className="text-sm text-green-600">
                  {APPS[firstWinApp].firstWinTask}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Your Every Bundle</h1>
          <p className="text-gray-600 mb-4">
            Complete the checklist to get the most out of your subscription
          </p>

          {/* Progress bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm font-medium">
              {completedCount}/{CHECKLIST_ITEMS.length}
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'checklist'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Checklist
          </button>
          <button
            onClick={() => setActiveTab('apps')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'apps'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Apps
          </button>
        </div>

        {activeTab === 'checklist' ? (
          /* Checklist view */
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item) => {
              const isCompleted = completedItems.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemToggle(item.id)}
                  className={`w-full p-4 text-left border rounded-xl transition-all ${
                    isCompleted
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {isCompleted && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${isCompleted ? 'text-green-800' : ''}`}>
                        {item.title}
                      </div>
                      <div className={`text-sm mt-1 ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        {item.description}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {item.app}
                        </span>
                        {item.app && APPS[item.app] && (
                          <span className="text-xs text-gray-400">
                            {APPS[item.app].firstWinDuration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Apps view */
          <div className="grid grid-cols-2 gap-4">
            {(Object.values(APPS) as typeof APPS[App][]).map((app) => (
              <Link
                key={app.id}
                href={`/app/${app.id}`}
                className="p-6 border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-3">{app.icon}</div>
                <div className="font-semibold">{app.name}</div>
                <div className="text-sm text-gray-500 mt-1">{app.tagline}</div>
                {firstWinApp === app.id && (
                  <div className="mt-3 text-xs text-green-600 font-medium">
                    First win completed
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Variant indicator for demo */}
        <div className="mt-12 p-4 bg-gray-50 rounded-xl text-center">
          <div className="text-xs text-gray-500 mb-1">Your variant:</div>
          <div className="font-mono text-sm font-bold">
            {user.variant.toUpperCase()}
          </div>
          <Link
            href="/dashboard"
            className="text-xs text-gray-400 hover:text-black mt-2 inline-block"
          >
            View experiment metrics →
          </Link>
        </div>
      </main>
    </div>
  );
}
