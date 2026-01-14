import { Persona, Goal, App } from './types';

// Matrix mapping (persona, goal) → primary app
// This is the core of the single-path routing logic
const PRIMARY_APP_MATRIX: Record<Persona, Record<Goal, App>> = {
  founder: {
    productive: 'cora',      // Founders need email management
    automate: 'cora',        // Automate email workflows
    write: 'spiral',         // Write investor updates, blog posts
    trends: 'monologue',     // Capture ideas on the go
  },
  builder: {
    productive: 'sparkle',   // Organize project files
    automate: 'sparkle',     // Automate file organization
    write: 'spiral',         // Write documentation
    trends: 'monologue',     // Voice notes while coding
  },
  writer: {
    productive: 'monologue', // Dictate drafts quickly
    automate: 'spiral',      // Automate writing workflows
    write: 'spiral',         // AI writing assistant
    trends: 'spiral',        // Stay ahead in writing with AI
  },
  designer: {
    productive: 'sparkle',   // Organize design assets
    automate: 'sparkle',     // Auto-organize project files
    write: 'spiral',         // Write case studies, proposals
    trends: 'monologue',     // Voice memos for design ideas
  },
  curious: {
    productive: 'monologue', // Easy entry point, just talk
    automate: 'cora',        // Email is universal
    write: 'spiral',         // Everyone writes
    trends: 'monologue',     // Low barrier to try AI
  },
};

// Get the primary app for a user based on their survey answers
export function getPrimaryApp(persona: Persona, goal: Goal): App {
  return PRIMARY_APP_MATRIX[persona][goal];
}

// Get the secondary app (for cross-activation)
export function getSecondaryApp(primaryApp: App, persona: Persona, goal: Goal): App {
  const apps: App[] = ['cora', 'sparkle', 'spiral', 'monologue'];

  // Simple logic: return the next best app that isn't the primary
  const secondaryPreferences: Record<App, App[]> = {
    cora: ['sparkle', 'spiral', 'monologue'],
    sparkle: ['cora', 'monologue', 'spiral'],
    spiral: ['monologue', 'cora', 'sparkle'],
    monologue: ['spiral', 'cora', 'sparkle'],
  };

  return secondaryPreferences[primaryApp][0];
}

// Get recommended apps for control variant (2 apps)
export function getRecommendedApps(persona: Persona, goal: Goal): [App, App] {
  const primary = getPrimaryApp(persona, goal);
  const secondary = getSecondaryApp(primary, persona, goal);
  return [primary, secondary];
}

// Get assignment reason for logging
export function getAssignmentReason(persona: Persona, goal: Goal): string {
  return `${persona}_${goal}`;
}
