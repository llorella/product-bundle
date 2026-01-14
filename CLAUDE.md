# CLAUDE.md

## Project Overview

This is an A/B experiment demo for Every (every.to), demonstrating a single-path onboarding hypothesis. Built as part of a growth engineer application.

## Quick Commands

```bash
npm install    # Install dependencies
npm run dev    # Start dev server at localhost:3000
npm run build  # Production build
```

## Project Structure

```
├── src/
│   ├── app/           # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── signup/            # Signup flow
│   │   ├── survey/            # Persona + goal questions
│   │   ├── recs/              # Control variant (2 app recs)
│   │   ├── start/             # Treatment variant (single app)
│   │   ├── app/[appName]/     # Mock app with first-win task
│   │   ├── bundle/            # Checklist UI
│   │   └── dashboard/         # Metrics dashboard
│   └── lib/
│       ├── types.ts           # Type definitions
│       ├── store.ts           # Zustand state
│       ├── events.ts          # Event tracking
│       ├── assignment.ts      # Variant assignment
│       └── primary-app.ts     # Persona→App matrix
├── AUDIT.md                   # Funnel audit documentation
└── README.md                  # Project readme
```

## The Experiment

**Control**: After survey, shows 2 recommended apps. User picks which to try.

**Treatment**: After survey, routes to ONE primary app based on persona+goal matrix, with a guided "first win" task.

**Hypothesis**: Single-path onboarding with guided first-win increases activation and reduces time to first value.

## Key Files

- `src/lib/primary-app.ts` - The persona×goal→app matrix that determines which app to show
- `src/lib/store.ts` - All application state (user, survey answers, first win tracking)
- `src/app/dashboard/page.tsx` - Metrics visualization with synthetic cohort generator

## Testing

1. Go to `/signup`
2. Use variant toggle to force Control or Treatment
3. Complete survey
4. Treatment: see single app + first-win task
5. Check `/dashboard` for metrics

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Recharts (charts)
- localStorage (event persistence)
