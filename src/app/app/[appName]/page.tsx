'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { APPS, App } from '@/lib/types';
import { trackEvent } from '@/lib/events';

// Mock task components for each app
function CoraTask({ onComplete }: { onComplete: () => void }) {
  const [processed, setProcessed] = useState(0);
  const emails = [
    { from: 'newsletter@tech.co', subject: 'Weekly AI Roundup', suggestion: 'Archive' },
    { from: 'boss@company.com', subject: 'Q4 Planning Meeting', suggestion: 'Flag' },
    { from: 'support@service.io', subject: 'Your ticket has been resolved', suggestion: 'Archive' },
    { from: 'team@slack.com', subject: 'New messages in #general', suggestion: 'Archive' },
    { from: 'cfo@company.com', subject: 'Budget Review Required', suggestion: 'Flag' },
    { from: 'promo@store.com', subject: '50% off everything!', suggestion: 'Archive' },
    { from: 'client@bigcorp.com', subject: 'Project Update Request', suggestion: 'Reply' },
    { from: 'hr@company.com', subject: 'Benefits Enrollment Reminder', suggestion: 'Flag' },
    { from: 'noreply@github.com', subject: 'PR #423 merged', suggestion: 'Archive' },
    { from: 'partner@agency.co', subject: 'Proposal for Review', suggestion: 'Reply' },
  ];

  const handleAction = (index: number) => {
    if (processed === index) {
      const newProcessed = processed + 1;
      setProcessed(newProcessed);
      if (newProcessed === 10) {
        setTimeout(onComplete, 500);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Inbox ({10 - processed} remaining)</h3>
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${(processed / 10) * 100}%` }}
          />
        </div>
      </div>
      {emails.slice(processed, processed + 3).map((email, i) => (
        <div
          key={processed + i}
          className="p-4 border border-gray-200 rounded-xl hover:border-gray-400 transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-500">{email.from}</div>
              <div className="font-medium">{email.subject}</div>
            </div>
            <button
              onClick={() => handleAction(processed + i)}
              disabled={processed !== processed + i}
              className="px-3 py-1 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400"
            >
              {email.suggestion}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SparkleTask({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const files = [
    'screenshot_2024_01.png', 'report_q3.pdf', 'notes.txt', 'image_final_v2.jpg',
    'presentation.pptx', 'data_export.csv', 'photo_vacation.heic', 'contract_signed.pdf',
    'meeting_recording.mp4', 'design_mockup.fig', 'budget_2024.xlsx', 'readme.md',
  ];
  const organized = {
    'Images': ['screenshot_2024_01.png', 'image_final_v2.jpg', 'photo_vacation.heic'],
    'Documents': ['report_q3.pdf', 'notes.txt', 'contract_signed.pdf', 'readme.md'],
    'Spreadsheets': ['data_export.csv', 'budget_2024.xlsx'],
    'Presentations': ['presentation.pptx', 'design_mockup.fig'],
    'Media': ['meeting_recording.mp4'],
  };

  const handleNextStep = () => {
    const newStep = step + 1;
    setStep(newStep);
    if (newStep === 3) {
      setTimeout(onComplete, 500);
    }
  };

  return (
    <div>
      {step === 0 && (
        <div>
          <h3 className="font-semibold mb-4">Select folder to organize</h3>
          <div className="grid grid-cols-3 gap-4">
            {['Downloads', 'Desktop', 'Documents'].map((folder) => (
              <button
                key={folder}
                onClick={handleNextStep}
                className="p-6 border border-gray-200 rounded-xl hover:border-black transition-all text-center"
              >
                <div className="text-3xl mb-2">📁</div>
                <div className="font-medium">{folder}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="animate-fade-in">
          <h3 className="font-semibold mb-4">Analyzing 12 files...</h3>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {files.map((file) => (
              <div key={file} className="p-2 bg-gray-100 rounded text-xs truncate">
                {file}
              </div>
            ))}
          </div>
          <button
            onClick={handleNextStep}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800"
          >
            Review AI organization →
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="animate-fade-in">
          <h3 className="font-semibold mb-4">Proposed organization</h3>
          <div className="space-y-3 mb-6">
            {Object.entries(organized).map(([folder, contents]) => (
              <div key={folder} className="p-3 border border-gray-200 rounded-xl">
                <div className="font-medium text-sm">📁 {folder}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {contents.length} files
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleNextStep}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800"
          >
            Apply organization ✨
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="text-center py-8 animate-celebrate">
          <div className="text-6xl mb-4">✨</div>
          <div className="text-xl font-bold">12 files organized!</div>
        </div>
      )}
    </div>
  );
}

function SpiralTask({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState('');

  const handleGenerate = () => {
    setStep(1);
    setDraft(`Subject: Q4 Planning Update

Hi Team,

I wanted to share a quick update on our Q4 planning progress. We've made significant strides in aligning our goals with the company's strategic objectives.

Key highlights:
• Finalized roadmap for the next quarter
• Identified 3 key initiatives to drive growth
• Allocated resources across priority projects

Let me know if you have any questions or suggestions.

Best,
[Your name]`);
  };

  const handleSave = () => {
    setStep(2);
    setTimeout(onComplete, 500);
  };

  return (
    <div>
      {step === 0 && (
        <div>
          <h3 className="font-semibold mb-4">What would you like to write?</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { type: 'email', label: 'Work email', desc: 'Professional communication' },
              { type: 'blog', label: 'Blog intro', desc: 'Engaging opening paragraph' },
              { type: 'social', label: 'Social post', desc: 'LinkedIn or Twitter' },
            ].map((option) => (
              <button
                key={option.type}
                onClick={handleGenerate}
                className="p-4 border border-gray-200 rounded-xl hover:border-black transition-all text-left"
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-500">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="animate-fade-in">
          <h3 className="font-semibold mb-4">Your AI-generated draft</h3>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full h-64 p-4 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:outline-none focus:border-black"
          />
          <p className="text-xs text-gray-500 mt-2 mb-4">Edit the draft to make it yours</p>
          <button
            onClick={handleSave}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800"
          >
            Save draft 📝
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="text-center py-8 animate-celebrate">
          <div className="text-6xl mb-4">📝</div>
          <div className="text-xl font-bold">Draft saved!</div>
        </div>
      )}
    </div>
  );
}

function MonologueTask({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleRecord = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setStep(1);
      setTranscript(
        "I just had a great idea for the Q4 campaign. We should focus on user testimonials and case studies. The key message should be about time savings - our users report saving an average of 5 hours per week. We could create a series of short video clips highlighting specific use cases. Maybe partner with some power users for authentic content."
      );
    }, 3000);
  };

  const handleSummarize = () => {
    setStep(2);
    setTimeout(onComplete, 500);
  };

  return (
    <div>
      {step === 0 && (
        <div className="text-center">
          <h3 className="font-semibold mb-6">Record a voice note</h3>
          <button
            onClick={handleRecord}
            disabled={recording}
            className={`w-24 h-24 rounded-full ${
              recording ? 'bg-red-500 animate-pulse' : 'bg-black hover:bg-gray-800'
            } text-white text-4xl transition-all`}
          >
            {recording ? '⏹' : '🎤'}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            {recording ? 'Recording... (simulated)' : 'Click to start recording'}
          </p>
        </div>
      )}
      {step === 1 && (
        <div className="animate-fade-in">
          <h3 className="font-semibold mb-4">Transcription</h3>
          <div className="p-4 bg-gray-50 rounded-xl mb-4">
            <p className="text-sm">{transcript}</p>
          </div>
          <button
            onClick={handleSummarize}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800"
          >
            Generate summary 🎤
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="animate-fade-in">
          <h3 className="font-semibold mb-4">Summary</h3>
          <div className="p-4 bg-gray-50 rounded-xl mb-4">
            <p className="font-medium text-sm">Q4 Campaign Ideas</p>
            <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
              <li>Focus on user testimonials and case studies</li>
              <li>Key message: 5 hours/week time savings</li>
              <li>Short video clips for specific use cases</li>
              <li>Partner with power users for content</li>
            </ul>
          </div>
          <div className="text-center py-4 animate-celebrate">
            <div className="text-4xl mb-2">🎤</div>
            <div className="text-lg font-bold">Note saved!</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppPage() {
  const router = useRouter();
  const params = useParams();
  const appName = params.appName as App;
  const {
    user,
    firstWinStartedAt,
    firstWinCompletedAt,
    completeFirstWin,
    showCrossActivation,
    crossActivationShown,
  } = useStore();

  const [showWinScreen, setShowWinScreen] = useState(false);

  // Validate app name
  if (!APPS[appName]) {
    router.push('/');
    return null;
  }

  const app = APPS[appName];

  const handleComplete = () => {
    completeFirstWin(appName, app.firstWinTask);
    setShowWinScreen(true);
  };

  const handleContinue = () => {
    showCrossActivation();
    router.push('/bundle');
  };

  // Get secondary app for cross-activation
  const secondaryApps: Record<App, App> = {
    cora: 'sparkle',
    sparkle: 'monologue',
    spiral: 'monologue',
    monologue: 'spiral',
  };
  const secondaryApp = APPS[secondaryApps[appName]];

  if (showWinScreen || firstWinCompletedAt) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center animate-celebrate">
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold mb-4">You got your first win!</h1>
          <p className="text-gray-600 mb-8">
            You just completed: <strong>{app.firstWinTask}</strong>
          </p>

          {/* Cross-activation prompt (treatment only) */}
          {user?.variant === 'treatment' && !crossActivationShown && (
            <div className="p-6 border border-gray-200 rounded-2xl mb-6 text-left">
              <div className="text-sm text-gray-500 mb-2">Ready for another win?</div>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{secondaryApp.icon}</div>
                <div>
                  <div className="font-semibold">{secondaryApp.name}</div>
                  <div className="text-sm text-gray-600">{secondaryApp.tagline}</div>
                </div>
              </div>
              <Link
                href={`/app/${secondaryApps[appName]}`}
                className="block mt-4 py-2 text-center text-black border border-black rounded-xl hover:bg-gray-50"
              >
                Try {secondaryApp.name} →
              </Link>
            </div>
          )}

          <button
            onClick={handleContinue}
            className="w-full py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800"
          >
            Continue to bundle →
          </button>
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
          <div className="flex items-center gap-4">
            <div className="text-4xl">{app.icon}</div>
            <div>
              <div className="font-semibold">{app.name}</div>
              <div className="text-sm text-gray-500">{app.tagline}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Task header */}
        <div className="mb-8 p-4 bg-gray-50 rounded-xl">
          <div className="text-sm text-gray-500 mb-1">Your first task</div>
          <div className="font-semibold">{app.firstWinTask}</div>
          <div className="text-xs text-gray-400 mt-1">{app.firstWinDuration}</div>
        </div>

        {/* Task component based on app */}
        {appName === 'cora' && <CoraTask onComplete={handleComplete} />}
        {appName === 'sparkle' && <SparkleTask onComplete={handleComplete} />}
        {appName === 'spiral' && <SpiralTask onComplete={handleComplete} />}
        {appName === 'monologue' && <MonologueTask onComplete={handleComplete} />}

        {/* Skip option */}
        <div className="mt-8 text-center">
          <button
            onClick={handleComplete}
            className="text-sm text-gray-500 hover:text-black"
          >
            Skip and mark as complete
          </button>
        </div>
      </main>
    </div>
  );
}
