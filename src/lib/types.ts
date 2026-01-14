export type Persona = 'founder' | 'builder' | 'writer' | 'designer' | 'curious';
export type Goal = 'productive' | 'automate' | 'write' | 'trends';

export type App = 'cora' | 'sparkle' | 'spiral' | 'monologue';

export type Variant = 'control' | 'treatment';

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
