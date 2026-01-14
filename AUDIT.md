# Every.to Funnel Audit + A/B Demo Plan

**Auditor**: Growth Engineer Candidate
**Date**: January 13, 2026
**Objective**: Identify highest-leverage insertion point for single-path onboarding experiment

---

## Task A — Funnel + Onboarding Audit

### A1) Landing Page + Conversion Pathways

**URL**: `https://every.to`

#### Primary CTAs (Logged-out State)

| CTA | Location | Destination | Purpose |
|-----|----------|-------------|---------|
| **Subscribe** | Top nav, Hero | `/subscribe?source=top_nav` | Primary conversion |
| **Sign in** | Top nav | `/login` | Existing users |
| **Read** | Hero grid | `/newsletter?utm_source=every_website_hero` | Content entry |
| **Email** | Hero grid | `cora.computer?utm_source=every_website_hero` | Cora product |
| **Speak** | Hero grid | `monologue.to?utm_source=every_website_hero` | Monologue product |
| **Listen** | Hero grid | `/podcast?utm_source=every_website_hero` | Podcast content |
| **Write** | Hero grid | `writewithspiral.com?utm_source=every_website_hero` | Spiral product |
| **Organize** | Hero grid | `makeitsparkle.co?utm_source=every_website_hero` | Sparkle product |

#### Secondary CTAs

- **Products section**: "Built by Every" → `/studio`
- **Consulting**: "Stop Planning Your AI Strategy" → `/consulting`
- **Newsletter signup**: Footer email capture
- **Cursor Camp**: Promotional banner → `/courses/cursor-camp`

#### Logged-in State Differences

When authenticated, users see:
- Account dropdown with email
- **"Explore your subscription" checklist widget** (floating bottom-right)
- Progress indicator: "0 of 10 completed"
- "Upgrade to paid (25% off)" CTA in checklist

#### Value Messaging

- Hero: "The Only Subscription You Need to Stay at the Edge of AI"
- Subhead: "Trusted by 100,000 builders"
- Bundle benefits list:
  - Reviews of new AI models on release day
  - Playbooks for integrating AI into your work
  - Insights from top operators and innovators
  - AI productivity apps: Monologue, Sparkle, Spiral, Cora

---

### A2) Signup + Survey + Recommendations

#### Step 1: Account Creation

**URL**: `https://every.to/subscribe`

**Page Content**:
- "Special offer: 30-day free trial for all new subscribers"
- "1. Create your free account"
- Email input + "Sign up" button
- Social proof: "Join 100,000+ founders, operators, and investors"

#### Step 2: Plan Selection

**Confirmation shown**: "✓ 1. Account: [email]" with Edit link

**Plan Toggle**: Free | Paid

**Paid Options**:
| Plan | Price | Details |
|------|-------|---------|
| Annual | $24/mo | $288/year after 30-day trial, "free trial + $72 off" |
| Monthly | $30/mo | After 30-day trial |

**Free Option**:
| Plan | Price | Details |
|------|-------|---------|
| Free | $0 | "Limited access to content and apps" |

**CTA**: "Continue with limited access" (free) or "Continue with a free trial" (paid)

**Note**: "Between jobs? Get 3 months of Every on us and keep learning. Email us at hello@every.to"

#### Step 3: Onboarding Entry

**URL**: `https://every.to/subscribe/onboarding`

**Page Content**:
- "Welcome to the EVERY Universe"
- "Answer a couple of questions to get started with personalized AI productivity apps."
- **Primary CTA**: "Complete your subscription"
- **Skip option**: "Skip and go to homepage"

#### Survey Question 1 of 3: Persona

**Question**: "What describes you best?"
**Instruction**: "Select one role that fits most."
**Required**: No (Skip available)

**Options** (single-select radio):
1. Founder/entrepreneur/investor
2. Builder/engineer
3. Writer/creator
4. Designer
5. Just curious about AI

#### Survey Question 2 of 3: Goal

**Question**: "What is your goal with AI?"
**Instruction**: "Select one goal that is most important to you."
**Required**: No (Skip available)

**Options** (single-select radio):
1. Be more productive
2. Automate workflows
3. Write with more confidence
4. Stay ahead of AI trends

#### Survey Question 3 of 3: Recommendations (Output Screen)

**Header**: "Based on your goal with AI"
**Subhead**: "We've selected the best AI tools for you. Get started with a free trial."

**For Builder/engineer + Automate workflows**:
1. **Sparkle** - "Turn messy folders into organization bliss. Sparkle organizes your computer so you don't have to."
   - URL: `https://makeitsparkle.co/?utm_source=everywebsite&utm_campaign=onboarding`
2. **Cora** - "An AI email assistant that gets you to inbox zero on autopilot. Cora is the most human way to manage your email."
   - URL: `https://cora.computer/?utm_source=everywebsite&utm_campaign=onboarding`

**Alternative CTA**: "or Explore the full Every bundle" → `/subscribe/explore`

**KEY FINDING**: Survey recommends **2 apps** (not 1). User must choose which to try first or explore all.

---

### A3) Activation Surfaces and Retention Scaffolding

#### Bundle Exploration Page

**URL**: `https://every.to/subscribe/explore`

**Header**: "Welcome to the EVERY Universe"
**Progress**: "Explore your subscription" — "0 of 10 completed"

#### Checklist Items (10 total)

| # | Category | Item | URL | UTM |
|---|----------|------|-----|-----|
| 1 | Content | Read an article | `/on-every/go-agent-native-with-every` | `utm_source=onboarding_checklist` |
| 2 | Commerce | Buy our exclusive merch | `/store` | `utm_source=onboarding_checklist` |
| 3 | Community | Join our subscriber-only Discord | `/community/join` | `utm_source=onboarding_checklist` |
| 4 | Content | Listen to the 'AI and I' podcast | `/podcast` | `utm_source=onboarding_checklist` |
| 5 | **Product** | Get to inbox zero with Cora | `cora.computer` | `utm_source=onboarding_checklist` |
| 6 | **Product** | Use Sparkle to organize your Mac | `makeitsparkle.co` | `utm_source=onboarding_checklist` |
| 7 | **Product** | Use Spiral to write with AI | `writewithspiral.com` | `utm_source=onboarding_checklist` |
| 8 | **Product** | Use Monologue for voice dictation | `monologue.to` | `utm_source=onboarding_checklist` |
| 9 | Expansion | Create a team | `/teams/new` | `utm_source=onboarding_checklist` |
| 10 | Expansion | Refer a friend and get paid | `every.getrewardful.com/signup` | `utm_source=onboarding_checklist` |

**CTA at bottom**: "Go to homepage"

#### Homepage Checklist Widget (Logged-in)

Floating bottom-right widget showing:
- "Explore your subscription"
- "0 of 10 completed"
- Same 10 items as above
- "Upgrade to paid (25% off)" CTA

#### Guest Checklist Widget

For logged-out visitors:
- Title: "Explore THE EVERY UNIVERSE"
- Same items but with different CTAs for gated content
- "Create your free account" CTA at bottom

#### Retention Mechanics Observed

| Mechanic | Present | Notes |
|----------|---------|-------|
| Progress tracking | ✅ | "0 of 10 completed" |
| Checklist gamification | ✅ | Visual checkmarks |
| Bundle cross-sell | ✅ | Products mixed with content |
| Community hooks | ✅ | Discord, referral |
| Content hooks | ✅ | Article, podcast |
| Habit loops | ❌ | No streaks, reminders |
| In-app first win | ❌ | No guided task |
| Cross-activation prompts | ❌ | No contextual suggestions |

---

### A4) Deep Link Mechanics and Routing

#### URL Patterns

| Page | URL Pattern | Notes |
|------|-------------|-------|
| Landing | `every.to/` | Content hub |
| Subscribe | `every.to/subscribe` | Conversion flow |
| Login | `every.to/login` | Redirects to home (magic link auth) |
| Onboarding | `every.to/subscribe/onboarding` | Survey flow |
| Bundle Explore | `every.to/subscribe/explore` | Checklist page |
| Account | `every.to/account` | User settings |

#### Product Subdomains (External)

| Product | Domain | Auth |
|---------|--------|------|
| Cora | `cora.computer` | Separate auth |
| Sparkle | `makeitsparkle.co` | Mac app (downloads .dmg) |
| Spiral | `writewithspiral.com` | Separate auth |
| Monologue | `monologue.to` | Separate auth |

#### UTM Parameters Observed

| Parameter | Values | Usage |
|-----------|--------|-------|
| `utm_source` | `everywebsite`, `every_website_hero`, `onboarding_checklist`, `explore_checklist_guest` | Source tracking |
| `utm_campaign` | `onboarding` | Campaign tracking |
| `utm_content` | `subscribe` | CTA variant |
| `source` | `top_nav` | Internal source |

#### Cross-Domain Considerations

- Products are on separate subdomains with **independent auth systems**
- No visible SSO or session sharing
- Checklist completion likely tracked by cookie/localStorage on every.to
- Product activation must be tracked by each product independently

---

## Task B — Verdict: What Exists vs What's Missing

### Current State

| Feature | Status | Evidence |
|---------|--------|----------|
| Single-path routing into one app | ❌ **Missing** | Survey recommends 2 apps; user must choose |
| Guided "first win" inside chosen app | ❌ **Missing** | Links go to product landing pages, not in-app tasks |
| Contextual cross-activation after first win | ❌ **Missing** | No prompts based on user activity/output |
| Bundle checklist mixing product + content + community | ✅ **Exists** | 10-item checklist with all categories |
| Progress tracking | ✅ **Exists** | "0 of 10 completed" |
| Survey-based personalization | ⚠️ **Partial** | Survey exists but outputs multiple recommendations |

### Opportunity Analysis

| Gap | Impact | Effort | Priority |
|-----|--------|--------|----------|
| **Single-path routing** | High - reduces decision fatigue, increases activation | Medium | **P0** |
| **Guided first win** | High - creates aha moment, reduces TTFV | High | **P0** |
| **Contextual cross-activation** | Medium - increases bundle stickiness | Medium | **P1** |
| **Unified auth/session** | Medium - reduces friction | High | **P2** |

### Recommended Insertion Point

**Immediately after survey completion** (Step 3 of onboarding)

**Justification (Growth Terms)**:

1. **Highest-intent moment**: User just committed to creating account and answering questions
2. **Survey data available**: We know persona + goal → can deterministically assign primary app
3. **Before decision fatigue**: Current flow shows 2+ apps, forcing choice at the worst moment
4. **Measurable impact**: Clear before/after comparison point
5. **Lowest implementation risk**: Changes only the recommendation screen, not the survey itself

**Alternative considered**: Inside bundle checklist
**Rejected because**: Users who reach checklist have already been exposed to multi-app choice; the damage is done

---

## Task C — Clone + A/B Demo Plan

### C1) Route Map

```
/                     Landing page (mirrors every.to hero)
/signup               Email capture + plan selection
/survey               2-question survey (persona + goal)
/recs                 CONTROL: Multi-app recommendations (current behavior)
/start/:appName       TREATMENT: Single-path routing to primary app
/app/:appName         Mock product surfaces (Cora, Sparkle, Spiral, Monologue)
/app/:appName/win     First-win task completion screen
/bundle               Bundle checklist (both variants)
/dashboard            Metrics readout + experiment results
```

### C2) Control vs Treatment Definitions

#### Control (Mirror Current Reality)

```
Survey → Recommends 2 apps based on persona + goal
       → User clicks one OR "Explore the full bundle"
       → If app: Goes to product landing (external)
       → If bundle: Goes to 10-item checklist
       → No guided task, no first-win tracking
```

#### Treatment (Hypothesis)

```
Survey → Assigns ONE primary app deterministically
       → Shows: "Based on your answers, start with [App]"
       → Single CTA: "Get your first win with [App]"
       → Routes to /start/:appName
       → Guided first-win task (30-90 seconds)
       → On completion: Contextual cross-activation prompt
       → Then: Bundle checklist with primary app checked off
```

### C3) Assignment + Persistence

```typescript
// Deterministic assignment
function getVariant(userId: string): 'control' | 'treatment' {
  const hash = hashCode(userId);
  return hash % 2 === 0 ? 'control' : 'treatment';
}

// Simple hash function
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Persistence: localStorage + cookie fallback
function persistVariant(userId: string, variant: string) {
  localStorage.setItem(`variant_${userId}`, variant);
  document.cookie = `variant_${userId}=${variant}; max-age=31536000; path=/`;
}
```

### C4) Primary App Assignment Logic

```typescript
type Persona =
  | 'founder'      // Founder/entrepreneur/investor
  | 'builder'      // Builder/engineer
  | 'writer'       // Writer/creator
  | 'designer'     // Designer
  | 'curious';     // Just curious about AI

type Goal =
  | 'productive'   // Be more productive
  | 'automate'     // Automate workflows
  | 'write'        // Write with more confidence
  | 'trends';      // Stay ahead of AI trends

type App = 'cora' | 'sparkle' | 'spiral' | 'monologue';

const PRIMARY_APP_MATRIX: Record<Persona, Record<Goal, App>> = {
  founder:  { productive: 'cora',     automate: 'cora',     write: 'spiral',    trends: 'monologue' },
  builder:  { productive: 'sparkle',  automate: 'sparkle',  write: 'spiral',    trends: 'monologue' },
  writer:   { productive: 'monologue', automate: 'spiral',  write: 'spiral',    trends: 'spiral' },
  designer: { productive: 'sparkle',  automate: 'sparkle',  write: 'spiral',    trends: 'monologue' },
  curious:  { productive: 'monologue', automate: 'cora',    write: 'spiral',    trends: 'monologue' },
};

function getPrimaryApp(persona: Persona, goal: Goal): App {
  return PRIMARY_APP_MATRIX[persona][goal];
}
```

### C5) Event Schema (JSONL/SQLite)

```typescript
interface BaseEvent {
  event_id: string;          // UUID
  timestamp: string;         // ISO 8601
  user_id: string;           // UUID
  session_id: string;        // UUID
  variant: 'control' | 'treatment';
}

// Funnel events
interface SignupCompleted extends BaseEvent {
  event: 'signup_completed';
  entry_point: string;       // e.g., 'hero', 'nav', 'footer'
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
}

interface SurveyCompleted extends BaseEvent {
  event: 'survey_completed';
  persona: Persona;
  goal: Goal;
  skipped_questions: number;
}

interface PrimaryAppAssigned extends BaseEvent {
  event: 'primary_app_assigned';
  primary_app: App;
  assignment_reason: string; // e.g., 'builder_automate'
}

interface OnboardingViewed extends BaseEvent {
  event: 'onboarding_viewed';
  screen: 'recs' | 'start' | 'bundle' | 'first_win';
}

interface ChecklistItemClicked extends BaseEvent {
  event: 'checklist_item_clicked';
  item_id: string;
  item_category: 'product' | 'content' | 'community' | 'expansion';
}

// Activation events
interface FirstWinStarted extends BaseEvent {
  event: 'first_win_started';
  app: App;
}

interface FirstWinCompleted extends BaseEvent {
  event: 'first_win_completed';
  app: App;
  time_to_value_seconds: number;
  task_type: string;         // e.g., 'triage_emails', 'organize_folder'
}

// Cross-activation events
interface CrossActivationPromptShown extends BaseEvent {
  event: 'cross_activation_prompt_shown';
  from_app: App;
  to_app: App;
  trigger_type: 'content_match' | 'task_complete' | 'time_based';
}

interface CrossActivationClicked extends BaseEvent {
  event: 'cross_activation_clicked';
  from_app: App;
  to_app: App;
}

interface SecondAppActivated extends BaseEvent {
  event: 'second_app_activated';
  app: App;
  days_since_first_win: number;
}

// Retention events
interface ReturnSession extends BaseEvent {
  event: 'return_session';
  day_offset: number;        // D1, D3, D7, etc.
  apps_used: App[];
}

interface CoreAction extends BaseEvent {
  event: 'core_action';
  app: App;
  action_type: string;       // e.g., 'email_triaged', 'file_organized', 'draft_generated'
}

// Error tracking
interface HelpRequested extends BaseEvent {
  event: 'help_requested';
  screen: string;
  help_type: 'tooltip' | 'faq' | 'support';
}

interface ErrorOccurred extends BaseEvent {
  event: 'error_occurred';
  screen: string;
  error_code: string;
  error_message: string;
}
```

### C6) Metric Definitions

#### Primary Metrics

```typescript
// Activation_24h_primary
// % of users who complete first_win in primary app within 24h of signup
const activation24h = (users: User[]) => {
  const eligible = users.filter(u =>
    daysSince(u.signup_completed) >= 1
  );
  const activated = eligible.filter(u =>
    u.first_win_completed &&
    u.first_win_completed.app === u.primary_app &&
    hoursBetween(u.signup_completed, u.first_win_completed) <= 24
  );
  return activated.length / eligible.length;
};

// TTFV_primary (Time to First Value)
// Median seconds from signup_completed to first_win_completed in primary app
const ttfvPrimary = (users: User[]) => {
  const times = users
    .filter(u => u.first_win_completed?.app === u.primary_app)
    .map(u => secondsBetween(u.signup_completed, u.first_win_completed));
  return median(times);
};

// CrossActivation_7d
// % of users who activate second app within 7d of first win
const crossActivation7d = (users: User[]) => {
  const eligible = users.filter(u =>
    u.first_win_completed &&
    daysSince(u.first_win_completed) >= 7
  );
  const crossActivated = eligible.filter(u =>
    u.second_app_activated &&
    daysBetween(u.first_win_completed, u.second_app_activated) <= 7
  );
  return crossActivated.length / eligible.length;
};

// EarlyRetention (D1/D3 proxy)
// % of users who perform core_action in a return session
const earlyRetention = (users: User[], dayOffset: number) => {
  const eligible = users.filter(u =>
    daysSince(u.signup_completed) >= dayOffset
  );
  const retained = eligible.filter(u =>
    u.return_sessions.some(s =>
      s.day_offset === dayOffset &&
      s.core_actions.length > 0
    )
  );
  return retained.length / eligible.length;
};
```

#### Guardrail Metrics

```typescript
// Onboarding drop-off rate
// % who start survey but don't reach first_win_started
const onboardingDropoff = (users: User[]) => {
  const startedSurvey = users.filter(u => u.survey_started);
  const reachedFirstWin = startedSurvey.filter(u => u.first_win_started);
  return 1 - (reachedFirstWin.length / startedSurvey.length);
};

// Help/error rate
// % of sessions with help_requested or error_occurred events
const helpErrorRate = (sessions: Session[]) => {
  const problemSessions = sessions.filter(s =>
    s.events.some(e =>
      e.event === 'help_requested' || e.event === 'error_occurred'
    )
  );
  return problemSessions.length / sessions.length;
};
```

### C7) Mock "First Win" Tasks

#### Cora (Email Assistant)

**Task**: "Triage your first 10 emails"
**Duration**: 60-90 seconds
**Steps**:
1. Show mock inbox with 10 sample emails
2. User clicks each email → AI suggests action (Archive, Reply, Follow-up)
3. User confirms or adjusts each suggestion
4. Optional: Create 1 auto-rule (e.g., "Archive all newsletters")
5. **Win screen**: "You just saved 15 minutes! 🎉"

#### Sparkle (File Organizer)

**Task**: "Organize your first folder"
**Duration**: 30-60 seconds
**Steps**:
1. User selects a folder (mock: Downloads with 20 files)
2. Sparkle AI analyzes and proposes folder structure
3. User reviews suggested organization
4. One-click apply
5. **Win screen**: "20 files organized in 30 seconds! ✨"

#### Spiral (AI Writing)

**Task**: "Generate your first draft"
**Duration**: 60-90 seconds
**Steps**:
1. Choose template (email, blog intro, social post)
2. Answer 2-3 prompts about topic/tone
3. AI generates draft
4. User makes one edit (demonstrates control)
5. Save/export
6. **Win screen**: "Your first AI-assisted draft! 📝"

#### Monologue (Voice Dictation)

**Task**: "Dictate and summarize your first note"
**Duration**: 45-60 seconds
**Steps**:
1. Click record button
2. Speak for 15-30 seconds (or use sample audio)
3. AI transcribes in real-time
4. AI generates summary
5. Save note
6. **Win screen**: "3x faster than typing! 🎤"

### C8) Contextual Cross-Activation Triggers

```typescript
interface CrossActivationRule {
  fromApp: App;
  toApp: App;
  trigger: (context: TaskContext) => boolean;
  message: string;
  ctaText: string;
}

const CROSS_ACTIVATION_RULES: CrossActivationRule[] = [
  // Monologue → Cora (dictation mentions email)
  {
    fromApp: 'monologue',
    toApp: 'cora',
    trigger: (ctx) =>
      ctx.transcription.match(/email|inbox|reply|send|message/i) !== null,
    message: "Sounds like you're thinking about email. Cora can help you reach inbox zero.",
    ctaText: "Try Cora →"
  },

  // Monologue → Spiral (dictation is long-form)
  {
    fromApp: 'monologue',
    toApp: 'spiral',
    trigger: (ctx) =>
      ctx.transcription.length > 500 &&
      ctx.transcription.match(/draft|write|article|post|blog/i) !== null,
    message: "That could make a great article. Spiral can help you polish it.",
    ctaText: "Open in Spiral →"
  },

  // Spiral → Monologue (stuck writing)
  {
    fromApp: 'spiral',
    toApp: 'monologue',
    trigger: (ctx) =>
      ctx.timeOnTaskSeconds > 120 && ctx.wordsWritten < 50,
    message: "Stuck? Try talking it out. Monologue lets you dictate your thoughts.",
    ctaText: "Switch to voice →"
  },

  // Cora → Sparkle (organizing attachments)
  {
    fromApp: 'cora',
    toApp: 'sparkle',
    trigger: (ctx) =>
      ctx.attachmentsSaved > 3,
    message: "Saving lots of attachments? Sparkle can organize them automatically.",
    ctaText: "Try Sparkle →"
  },

  // Any app → complementary (after first win)
  {
    fromApp: 'sparkle',
    toApp: 'monologue',
    trigger: (ctx) => ctx.firstWinCompleted,
    message: "Nice work! Ready for another productivity boost? Try Monologue for voice notes.",
    ctaText: "Try Monologue →"
  }
];

// Constraints
const CROSS_ACTIVATION_CONSTRAINTS = {
  showOnlyAfterFirstWin: true,
  maxPerSession: 1,
  cooldownMinutes: 30,
  deferIfStruggling: true,  // Don't show if help/error events in session
};
```

### C9) Implementation Plan

#### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: SQLite + Prisma (local) or JSONL file
- **State**: Zustand for client state
- **Charts**: Recharts for dashboard

#### File Structure

```
/app
  /page.tsx                 # Landing
  /signup/page.tsx          # Email + plan
  /survey/page.tsx          # 2-question survey
  /recs/page.tsx            # Control: multi-app recs
  /start/[app]/page.tsx     # Treatment: single-path entry
  /app/[app]/page.tsx       # Mock product surface
  /app/[app]/win/page.tsx   # First-win task
  /bundle/page.tsx          # Checklist
  /dashboard/page.tsx       # Metrics readout

/components
  /survey/                  # Survey components
  /apps/                    # Mock app UIs (Cora, Sparkle, etc.)
  /checklist/               # Checklist components
  /dashboard/               # Charts, metric cards

/lib
  /events.ts                # Event tracking
  /assignment.ts            # Variant assignment
  /primary-app.ts           # App selection logic
  /cross-activation.ts      # Cross-activation rules
  /db.ts                    # Database operations

/prisma
  /schema.prisma            # Data model

/data
  /events.jsonl             # Event log (alternative to SQLite)
  /mock-data/               # Sample content for mock apps
```

#### Deliverables

1. **Deployed demo** (Vercel or localhost)
2. **README.md** with:
   - How to run locally
   - How to simulate cohorts
   - Experiment configuration options
3. **3-5 minute walkthrough video** (optional)

### C10) Demo Readout Strategy

#### Option 1: Synthetic Cohort Generator

```typescript
// Generate N users per variant with realistic distributions
function generateSyntheticCohort(n: number, variant: 'control' | 'treatment') {
  const users = [];

  for (let i = 0; i < n; i++) {
    const user = {
      id: generateUUID(),
      variant,
      persona: randomChoice(['founder', 'builder', 'writer', 'designer', 'curious']),
      goal: randomChoice(['productive', 'automate', 'write', 'trends']),
    };

    // Simulate behavior based on variant
    if (variant === 'treatment') {
      // Treatment users have higher activation (hypothesis)
      user.activated24h = Math.random() < 0.65;  // 65% activation
      user.ttfvSeconds = normalRandom(180, 60);  // Mean 3min, SD 1min
      user.crossActivated7d = Math.random() < 0.35;  // 35% cross-activation
    } else {
      // Control users have lower activation (current state)
      user.activated24h = Math.random() < 0.40;  // 40% activation
      user.ttfvSeconds = normalRandom(420, 120); // Mean 7min, SD 2min
      user.crossActivated7d = Math.random() < 0.15;  // 15% cross-activation
    }

    users.push(user);
  }

  return users;
}
```

#### Option 2: Manual Multi-User Simulation

Dashboard includes:
- **"Create new user"** button → randomizes user_id, starts fresh session
- **Variant toggle** → manually set control/treatment for testing
- **Fast-forward** → skip to first-win completion
- **Event log viewer** → real-time event stream

Quick workflow:
1. Create 10 control users, complete various paths
2. Create 10 treatment users, complete various paths
3. View dashboard with aggregated metrics
4. Export data as JSONL for analysis

---

## Task D — Risks + Mitigations

### Activation Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Single app choice feels limiting | Medium | Users may feel they're missing out on other apps | Clear messaging: "Start here, explore more later" + visible bundle access |
| First-win task too long/complex | Medium | Drop-off during task | Keep tasks under 90 seconds; add progress indicator |
| Wrong app assigned by survey | Low | Poor first experience | Allow "This isn't for me" escape hatch → try different app |
| Technical issues with mock tasks | Medium | Frustration, abandonment | Thorough testing; graceful error handling |

### Retention Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Cross-activation feels spammy | Medium | User annoyance, opt-out | Strict constraints: 1/session, only after win, defer if struggling |
| Users don't return after first win | Medium | Single-session activation only | Email follow-up (out of scope for demo); checklist as return hook |
| Bundle value not clear after single app | Low | Churn before exploring others | Checklist shows full bundle; celebration of first win → "9 more to explore" |

### Measurement Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Sample size too small for significance | High (demo) | Can't draw conclusions | Use synthetic data with realistic effect sizes; note this is proof-of-concept |
| Tracking gaps between every.to and products | High (production) | Incomplete funnel data | Demo uses unified tracking; production would need cross-domain events |
| Selection bias in demo simulation | Medium | Misleading results | Document assumptions; show sensitivity analysis |

---

## Summary

### Key Findings

1. **Current flow offers too many choices** at the recommendation stage (2 apps + "explore bundle")
2. **No guided first-win experience** — users click through to product landing pages with no structured task
3. **No contextual cross-activation** — checklist treats all items equally regardless of user context
4. **Strong retention scaffolding exists** (10-item checklist with progress) but lacks activation focus

### Recommended Experiment

**Treatment**: After survey, assign ONE primary app deterministically → guide to 30-90 second first-win task → show contextual cross-activation prompt → then full bundle checklist

**Insertion point**: Immediately after survey completion (`/subscribe/onboarding` step 3)

**Primary metrics**:
- Activation_24h_primary (target: +25% relative lift)
- TTFV_primary (target: -40% reduction)
- CrossActivation_7d (target: +20% relative lift)

### Next Steps

1. Build demo (Next.js + Tailwind + SQLite)
2. Implement control and treatment flows
3. Create mock first-win tasks for each app
4. Build metrics dashboard
5. Generate synthetic cohorts for demonstration
6. Record walkthrough video
