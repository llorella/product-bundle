import { Persona, Goal, App } from './types';

/**
 * PRIMARY APP ASSIGNMENT MATRIX
 * =============================
 *
 * Status: HYPOTHESIS - To be validated with experiment data
 *
 * This matrix maps (persona, goal) combinations to a single primary app.
 * It is the core of the Treatment variant's single-path routing.
 *
 * RATIONALE FOR ASSIGNMENTS:
 *
 * | Persona   | Goal        | App       | Why                                      |
 * |-----------|-------------|-----------|------------------------------------------|
 * | founder   | productive  | cora      | Founders drowning in email need triage  |
 * | founder   | automate    | cora      | Email workflows are high-leverage        |
 * | founder   | write       | spiral    | Investor updates, blog posts, memos     |
 * | founder   | trends      | monologue | Capture ideas quickly while multitasking|
 * | builder   | productive  | sparkle   | Engineers have messy project folders    |
 * | builder   | automate    | sparkle   | Auto-organize build artifacts, repos    |
 * | builder   | write       | spiral    | Documentation, READMEs, RFCs            |
 * | builder   | trends      | monologue | Voice notes while coding                |
 * | writer    | productive  | monologue | Dictate drafts 3x faster than typing    |
 * | writer    | automate    | spiral    | AI writing workflows                    |
 * | writer    | write       | spiral    | Core use case - AI writing assistant    |
 * | writer    | trends      | spiral    | Stay ahead with AI-assisted writing     |
 * | designer  | productive  | sparkle   | Organize design assets and versions     |
 * | designer  | automate    | sparkle   | Auto-organize project files             |
 * | designer  | write       | spiral    | Case studies, proposals, portfolios     |
 * | designer  | trends      | monologue | Voice memos for design ideas            |
 * | curious   | productive  | monologue | Low barrier - just talk                 |
 * | curious   | automate    | cora      | Email is universal pain point           |
 * | curious   | write       | spiral    | Everyone writes something               |
 * | curious   | trends      | monologue | Easy way to try AI                      |
 *
 * HYPOTHESIS BASIS:
 * 1. Product team intuition about persona-use-case fit
 * 2. Qualitative user research (N=12 interviews)
 * 3. Beta usage patterns showing correlation between persona and app preference
 *
 * VALIDATION PLAN:
 * - This experiment tests: "Does single-path routing beat multi-choice?"
 * - The matrix itself is NOT being A/B tested in this experiment
 * - Future experiment: A/B test different matrix configurations
 * - Success metric: Treatment activation > Control activation
 *
 * TO MODIFY: Change mappings below and document reasoning in the table above
 */
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

export function getSecondaryApp(primaryApp: App): App {
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
  const secondary = getSecondaryApp(primary);
  return [primary, secondary];
}

// Get assignment reason for logging
export function getAssignmentReason(persona: Persona, goal: Goal): string {
  return `${persona}_${goal}`;
}
