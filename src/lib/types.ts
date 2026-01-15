export type Persona = 'founder' | 'builder' | 'writer' | 'designer' | 'curious';
export type Goal = 'productive' | 'automate' | 'write' | 'trends';

export type App = 'cora' | 'sparkle' | 'spiral' | 'monologue';

export type Variant = 'control' | 'treatment';

// Artifacts generated during first-win tasks (used for contextual cross-activation)
export interface TaskArtifacts {
  // Cora artifacts
  emailsProcessed?: number;
  attachmentsSaved?: number;

  // Sparkle artifacts
  filesOrganized?: number;
  foldersCreated?: number;
  draftsFound?: number;

  // Spiral artifacts
  wordCount?: number;
  draftType?: 'email' | 'blog' | 'social';

  // Monologue artifacts
  ideasCaptured?: number;
  recordingSeconds?: number;
}

// Cross-activation prompt configuration
export interface CrossPromptConfig {
  fromApp: App;
  toApp: App;
  getPrompt: (artifacts: TaskArtifacts) => {
    headline: string;
    subtext: string;
    cta: string;
  };
}

export const CROSS_PROMPT_CONFIGS: CrossPromptConfig[] = [
  {
    fromApp: 'cora',
    toApp: 'sparkle',
    getPrompt: (artifacts) => ({
      headline: `You cleared ${artifacts.emailsProcessed || 10} emails`,
      subtext: artifacts.attachmentsSaved
        ? `${artifacts.attachmentsSaved} had attachments—organize them in 30 seconds`
        : 'Now organize the files piling up on your desktop',
      cta: 'Organize files →',
    }),
  },
  {
    fromApp: 'sparkle',
    toApp: 'spiral',
    getPrompt: (artifacts) => ({
      headline: `You organized ${artifacts.filesOrganized || 12} files`,
      subtext: artifacts.draftsFound
        ? `${artifacts.draftsFound} are unfinished drafts—pick one to complete`
        : 'Found some drafts that need finishing? Polish them with AI',
      cta: 'Finish a draft →',
    }),
  },
  {
    fromApp: 'spiral',
    toApp: 'monologue',
    getPrompt: (artifacts) => ({
      headline: `You wrote ${artifacts.wordCount || 150} words`,
      subtext: 'Capture more ideas on the go—turn voice notes into drafts like this one',
      cta: 'Try voice capture →',
    }),
  },
  {
    fromApp: 'monologue',
    toApp: 'spiral',
    getPrompt: (artifacts) => ({
      headline: `You captured ${artifacts.ideasCaptured || 4} ideas`,
      subtext: 'Turn your best idea into a polished draft in seconds',
      cta: 'Write a draft →',
    }),
  },
];

export interface User {
  id: string;
  email: string;
  variant: Variant;
  persona?: Persona;
  goal?: Goal;
  primaryApp?: App;
  createdAt: string;
}

export interface AppInfo {
  id: App;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  firstWinTask: string;
  firstWinDuration: string;
}

export const APPS: Record<App, AppInfo> = {
  cora: {
    id: 'cora',
    name: 'Cora',
    tagline: 'Email Assistant',
    description: 'An AI assistant that gets you to inbox zero on autopilot.',
    icon: '📧',
    color: 'bg-blue-500',
    firstWinTask: 'Triage your first 10 emails',
    firstWinDuration: '60-90 seconds',
  },
  sparkle: {
    id: 'sparkle',
    name: 'Sparkle',
    tagline: 'File Organizer',
    description: 'Turn messy folders into organization bliss.',
    icon: '✨',
    color: 'bg-purple-500',
    firstWinTask: 'Organize your first folder',
    firstWinDuration: '30-60 seconds',
  },
  spiral: {
    id: 'spiral',
    name: 'Spiral',
    tagline: 'AI Writing Assistant',
    description: 'Your AI writing assistant with taste—publish with confidence.',
    icon: '📝',
    color: 'bg-green-500',
    firstWinTask: 'Generate your first draft',
    firstWinDuration: '60-90 seconds',
  },
  monologue: {
    id: 'monologue',
    name: 'Monologue',
    tagline: 'Voice Dictation',
    description: 'Effortless voice dictation—work 3x faster.',
    icon: '🎤',
    color: 'bg-orange-500',
    firstWinTask: 'Dictate and summarize your first note',
    firstWinDuration: '45-60 seconds',
  },
};

export const PERSONAS: { value: Persona; label: string }[] = [
  { value: 'founder', label: 'Founder/entrepreneur/investor' },
  { value: 'builder', label: 'Builder/engineer' },
  { value: 'writer', label: 'Writer/creator' },
  { value: 'designer', label: 'Designer' },
  { value: 'curious', label: 'Just curious about AI' },
];

export const GOALS: { value: Goal; label: string }[] = [
  { value: 'productive', label: 'Be more productive' },
  { value: 'automate', label: 'Automate workflows' },
  { value: 'write', label: 'Write with more confidence' },
  { value: 'trends', label: 'Stay ahead of AI trends' },
];

export interface ChecklistItem {
  id: string;
  category: 'product' | 'content' | 'community' | 'expansion';
  title: string;
  description: string;
  icon: string;
  app?: App;
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'article', category: 'content', title: 'Read an article', description: 'Explore AI insights', icon: '📖' },
  { id: 'merch', category: 'expansion', title: 'Buy exclusive merch', description: 'Show your support', icon: '👕' },
  { id: 'discord', category: 'community', title: 'Join Discord', description: 'Connect with the community', icon: '💬' },
  { id: 'podcast', category: 'content', title: 'Listen to AI & I podcast', description: 'Learn from experts', icon: '🎧' },
  { id: 'cora', category: 'product', title: 'Get to inbox zero with Cora', description: 'Master your email', icon: '📧', app: 'cora' },
  { id: 'sparkle', category: 'product', title: 'Organize your Mac with Sparkle', description: 'Declutter your files', icon: '✨', app: 'sparkle' },
  { id: 'spiral', category: 'product', title: 'Write with Spiral', description: 'AI-powered writing', icon: '📝', app: 'spiral' },
  { id: 'monologue', category: 'product', title: 'Dictate with Monologue', description: 'Voice to text', icon: '🎤', app: 'monologue' },
  { id: 'team', category: 'expansion', title: 'Create a team', description: 'Collaborate together', icon: '👥' },
  { id: 'referral', category: 'expansion', title: 'Refer a friend', description: 'Share and earn', icon: '🎁' },
];

// Experiment metric definitions
export interface MetricDefinition {
  id: string;
  name: string;
  type: 'primary' | 'secondary' | 'guardrail';
  definition: string;
  formula: string;
  direction: 'higher_is_better' | 'lower_is_better';
}

export const EXPERIMENT_METRICS: MetricDefinition[] = [
  {
    id: 'multi_product_activation_7d',
    name: 'Multi-Product Activation (7d)',
    type: 'primary',
    definition: 'Percentage of users who complete a core action in 2+ products within 7 days of signup',
    formula: 'COUNT(users WITH 2+ first_win_completed WHERE timestamp < signup + 7d) / COUNT(signup_completed)',
    direction: 'higher_is_better',
  },
  {
    id: 'first_product_activation_24h',
    name: 'First Product Activation (24h)',
    type: 'secondary',
    definition: 'Percentage of users who complete their first-win task within 24 hours of signup',
    formula: 'COUNT(first_win_completed WHERE timestamp < signup_timestamp + 24h) / COUNT(signup_completed)',
    direction: 'higher_is_better',
  },
  {
    id: 'ttfv',
    name: 'Time to First Value',
    type: 'secondary',
    definition: 'Median time in seconds from signup to first-win completion',
    formula: 'MEDIAN(first_win_completed.timestamp - signup_completed.timestamp)',
    direction: 'lower_is_better',
  },
  {
    id: 'cross_prompt_ctr',
    name: 'Cross-Activation Prompt CTR',
    type: 'secondary',
    definition: 'Percentage of users shown cross-activation prompt who clicked through (treatment only)',
    formula: 'COUNT(cross_activation_clicked) / COUNT(cross_activation_prompt_shown)',
    direction: 'higher_is_better',
  },
  {
    id: 'survey_completion',
    name: 'Survey Completion',
    type: 'guardrail',
    definition: 'Percentage of signups who complete the onboarding survey (should not decrease)',
    formula: 'COUNT(survey_completed) / COUNT(signup_completed)',
    direction: 'higher_is_better',
  },
  {
    id: 'first_product_activation_rate',
    name: 'First Product Activation',
    type: 'guardrail',
    definition: 'Percentage of users who complete first product activation (should not decrease)',
    formula: 'COUNT(first_win_completed) / COUNT(signup_completed)',
    direction: 'higher_is_better',
  },
];
