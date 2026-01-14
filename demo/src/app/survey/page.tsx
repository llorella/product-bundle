'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { PERSONAS, GOALS, Persona, Goal } from '@/lib/types';

export default function SurveyPage() {
  const router = useRouter();
  const {
    user,
    surveyStep,
    selectedPersona,
    selectedGoal,
    setPersona,
    setGoal,
    completeSurvey,
  } = useStore();

  // Redirect if not logged in
  if (!user) {
    router.push('/signup');
    return null;
  }

  const handleContinue = () => {
    if (surveyStep === 1 && selectedPersona) {
      // Move to step 2 already handled by setPersona
    } else if (surveyStep === 2 && selectedGoal) {
      completeSurvey();
      // Route based on variant
      if (user.variant === 'treatment') {
        router.push('/start');
      } else {
        router.push('/recs');
      }
    }
  };

  const handleSkip = () => {
    if (surveyStep === 1) {
      setPersona('curious');
    } else {
      setGoal('productive');
      completeSurvey();
      if (user.variant === 'treatment') {
        router.push('/start');
      } else {
        router.push('/recs');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Every
          </Link>
          <div className="text-sm text-gray-500">
            Step {surveyStep} of 3
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        {surveyStep === 1 ? (
          /* Step 1: Persona */
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">What describes you best?</h1>
            <p className="text-gray-600 mb-8">Select one role that fits most.</p>

            <div className="space-y-3">
              {PERSONAS.map((persona) => (
                <button
                  key={persona.value}
                  onClick={() => setPersona(persona.value)}
                  className={`w-full p-4 text-left border rounded-xl transition-all ${
                    selectedPersona === persona.value
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{persona.label}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        selectedPersona === persona.value
                          ? 'border-black bg-black'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedPersona === persona.value && (
                        <svg
                          className="w-full h-full text-white"
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
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSkip}
                className="flex-1 py-3 text-gray-600 hover:text-black transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleContinue}
                disabled={!selectedPersona}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  selectedPersona
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </div>
          </div>
        ) : surveyStep === 2 ? (
          /* Step 2: Goal */
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">What is your goal with AI?</h1>
            <p className="text-gray-600 mb-8">Select one goal that is most important to you.</p>

            <div className="space-y-3">
              {GOALS.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => setGoal(goal.value)}
                  className={`w-full p-4 text-left border rounded-xl transition-all ${
                    selectedGoal === goal.value
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{goal.label}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        selectedGoal === goal.value
                          ? 'border-black bg-black'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedGoal === goal.value && (
                        <svg
                          className="w-full h-full text-white"
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
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSkip}
                className="flex-1 py-3 text-gray-600 hover:text-black transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleContinue}
                disabled={!selectedGoal}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  selectedGoal
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </div>
          </div>
        ) : null}

        {/* Variant indicator */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl text-center">
          <div className="text-xs text-gray-500 mb-1">Your assigned variant:</div>
          <div className="font-mono text-sm font-bold">
            {user.variant.toUpperCase()}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {user.variant === 'treatment'
              ? 'You will see single-path onboarding'
              : 'You will see multi-app recommendations'}
          </div>
        </div>
      </main>
    </div>
  );
}
