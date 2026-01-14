'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { APPS } from '@/lib/types';

export default function Home() {
  const { user, completedItems, reset } = useStore();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">Every</div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-500">{user.email}</span>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  {user.variant}
                </span>
                <button
                  onClick={reset}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  Reset
                </button>
              </>
            ) : (
              <>
                <Link href="/signup" className="text-sm text-gray-600 hover:text-black">
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800"
                >
                  Subscribe
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          The Only Subscription You Need<br />
          to Stay at the Edge of AI
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Trusted by 100,000 builders
        </p>
        <Link
          href="/signup"
          className="inline-block px-8 py-4 bg-black text-white text-lg rounded-full hover:bg-gray-800 transition-colors"
        >
          Subscribe
        </Link>

        {/* App Icons Grid */}
        <div className="mt-16 grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
          {[
            { icon: '📖', label: 'Read', href: '/bundle' },
            { icon: '📧', label: 'Email', href: '/app/cora' },
            { icon: '🎤', label: 'Speak', href: '/app/monologue' },
            { icon: '🎧', label: 'Listen', href: '/bundle' },
            { icon: '📝', label: 'Write', href: '/app/spiral' },
            { icon: '✨', label: 'Organize', href: '/app/sparkle' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center p-4 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <span className="text-4xl mb-2">{item.icon}</span>
              <span className="text-sm text-gray-600">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Built by Every</h2>
              <p className="text-gray-600">Try out our AI-powered products.</p>
            </div>
            <Link href="/bundle" className="text-sm text-gray-600 hover:text-black">
              View all →
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {Object.values(APPS).map((app) => (
              <Link
                key={app.id}
                href={`/app/${app.id}`}
                className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-4">{app.icon}</div>
                <h3 className="font-semibold text-lg">{app.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{app.description}</p>
                <div className="mt-4 text-sm text-gray-500 flex items-center gap-1">
                  Try it <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ideas and Apps to Thrive in the AI Age
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="p-6 border border-gray-200 rounded-2xl">
              <div className="text-2xl mb-3">✅</div>
              <h3 className="font-semibold mb-2">Reviews of new AI models on release day</h3>
              <p className="text-gray-600 text-sm">Stay ahead with expert analysis</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-2xl">
              <div className="text-2xl mb-3">📚</div>
              <h3 className="font-semibold mb-2">Playbooks for integrating AI into your work</h3>
              <p className="text-gray-600 text-sm">Practical guides you can use today</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-2xl">
              <div className="text-2xl mb-3">💡</div>
              <h3 className="font-semibold mb-2">Insights from top operators and innovators</h3>
              <p className="text-gray-600 text-sm">Learn from the best</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-2xl">
              <div className="text-2xl mb-3">🚀</div>
              <h3 className="font-semibold mb-2">AI productivity apps: Monologue, Sparkle, Spiral, Cora</h3>
              <p className="text-gray-600 text-sm">Tools built by Every</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Link */}
      <section className="bg-black text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">A/B Experiment Dashboard</h2>
          <p className="text-gray-400 mb-6">View metrics, events, and experiment results</p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors"
          >
            Open Dashboard
          </Link>
        </div>
      </section>

      {/* Floating Checklist Widget (if logged in) */}
      {user && (
        <Link
          href="/bundle"
          className="fixed bottom-6 right-6 bg-white shadow-lg rounded-2xl p-4 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
              {completedItems.length}
            </div>
            <div>
              <div className="text-sm font-medium">Explore your subscription</div>
              <div className="text-xs text-gray-500">
                {completedItems.length} of 10 completed
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Every A/B Demo — Growth Engineer Application</p>
          <p className="mt-2">
            This is a demo clone of every.to for experiment testing purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}
