'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Variant } from '@/lib/types';

export default function SignupPage() {
  const router = useRouter();
  const { initUser, user } = useStore();
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<'free' | 'paid'>('paid');
  const [step, setStep] = useState(1);
  const [forcedVariant, setForcedVariant] = useState<Variant | null>(null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep(2);
    }
  };

  const handlePlanSelect = () => {
    initUser(email, forcedVariant ?? undefined);
    router.push('/survey');
  };

  // If already logged in, redirect to survey
  if (user) {
    router.push('/survey');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/" className="text-2xl font-bold">
          Every
        </Link>
      </header>

      <main className="max-w-md mx-auto px-4 py-12">
        {/* Special Offer Banner */}
        <div className="bg-black text-white rounded-2xl p-4 mb-8 text-center">
          <div className="text-sm font-medium">Special offer</div>
          <div className="text-lg">30-day free trial for all new subscribers</div>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1 ? 'bg-black text-white' : 'bg-gray-200'
              }`}
            >
              {step > 1 ? '✓' : '1'}
            </div>
            <div className="flex-1 h-1 bg-gray-200">
              <div
                className={`h-full bg-black transition-all ${step > 1 ? 'w-full' : 'w-0'}`}
              />
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2 ? 'bg-black text-white' : 'bg-gray-200'
              }`}
            >
              2
            </div>
          </div>
        </div>

        {step === 1 ? (
          /* Step 1: Email */
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">1. Create your free account</h1>
            <p className="text-gray-600 mb-6">Join 100,000+ founders, operators, and investors</p>

            <form onSubmit={handleEmailSubmit}>
              <label className="block text-sm text-gray-600 mb-2">Email address</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Sign up
                </button>
              </div>
            </form>

            <p className="text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <Link href="/signup" className="text-black underline">
                Sign in
              </Link>
            </p>
          </div>
        ) : (
          /* Step 2: Plan Selection */
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-sm text-gray-600">1. Account: {email}</span>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-sm text-gray-500 hover:text-black"
              >
                Edit
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-6">2. Choose your plan</h2>

            {/* Plan Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setPlan('free')}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                  plan === 'free'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setPlan('paid')}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                  plan === 'paid'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Paid
              </button>
            </div>

            {/* Variant Override (for demo) */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="text-sm font-medium text-yellow-800 mb-2">
                Demo: Force variant assignment
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setForcedVariant(null)}
                  className={`flex-1 py-2 px-3 text-xs rounded-lg transition-colors ${
                    forcedVariant === null
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  Auto (hash-based)
                </button>
                <button
                  onClick={() => setForcedVariant('control')}
                  className={`flex-1 py-2 px-3 text-xs rounded-lg transition-colors ${
                    forcedVariant === 'control'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  Control
                </button>
                <button
                  onClick={() => setForcedVariant('treatment')}
                  className={`flex-1 py-2 px-3 text-xs rounded-lg transition-colors ${
                    forcedVariant === 'treatment'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  Treatment
                </button>
              </div>
            </div>

            {plan === 'paid' ? (
              /* Paid Plans */
              <div className="space-y-4">
                <div className="p-4 border-2 border-black rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">Annual</div>
                      <div className="text-sm text-gray-600">
                        Billed at $288 after a 30-day free trial
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">$24</div>
                      <div className="text-sm text-gray-500">/mo</div>
                    </div>
                  </div>
                  <div className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    free trial + $72 off
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Monthly</div>
                      <div className="text-sm text-gray-600">
                        Billed at $30 after a 30-day free trial
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">$30</div>
                      <div className="text-sm text-gray-500">/mo</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlanSelect}
                  className="w-full py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  Continue with a free trial
                </button>
              </div>
            ) : (
              /* Free Plan */
              <div className="space-y-4">
                <div className="p-4 border-2 border-black rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Free</div>
                      <div className="text-sm text-gray-600">
                        Limited access to content and apps
                      </div>
                    </div>
                    <div className="text-2xl font-bold">$0</div>
                  </div>
                </div>

                <button
                  onClick={handlePlanSelect}
                  className="w-full py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  Continue with limited access
                </button>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-6 text-center">
              Between jobs? Get 3 months of Every on us.{' '}
              <a href="mailto:hello@every.to" className="text-black underline">
                Email us
              </a>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
