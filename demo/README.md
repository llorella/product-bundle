# Every A/B Demo

A cloneable demo implementing an A/B experiment for single-path onboarding at Every.

## The Experiment

**Hypothesis**: Routing new signups into ONE primary app (based on survey answers) and guiding them to a "first win" will increase activation rates and reduce time to first value.

| Variant | Experience |
|---------|------------|
| Control | Shows 2 recommended apps, user chooses which to try |
| Treatment | Single app assignment + guided first-win task |

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/signup` | Signup flow with variant override toggle |
| `/survey` | Persona + goal questions |
| `/recs` | Control: multi-app recommendations |
| `/start` | Treatment: single-path onboarding |
| `/app/[name]` | Mock app with first-win task |
| `/bundle` | Checklist and app directory |
| `/dashboard` | Metrics and experiment results |

## Key Metrics

- **Activation_24h**: % of users completing first win within 24h
- **TTFV**: Time to first value (seconds)
- **CrossActivation_7d**: % trying a second app within 7 days

## Architecture

```
src/
├── app/                    # Next.js pages
├── lib/
│   ├── types.ts           # Type definitions
│   ├── store.ts           # Zustand state management
│   ├── events.ts          # Event tracking
│   ├── assignment.ts      # Variant assignment
│   └── primary-app.ts     # Persona→App mapping matrix
```

## Primary App Matrix

Survey answers map to a single primary app:

| Persona × Goal | productive | automate | write | trends |
|----------------|------------|----------|-------|--------|
| founder | Cora | Cora | Spiral | Monologue |
| builder | Sparkle | Sparkle | Spiral | Monologue |
| writer | Monologue | Spiral | Spiral | Spiral |
| designer | Sparkle | Sparkle | Spiral | Monologue |
| curious | Monologue | Cora | Spiral | Monologue |

## Testing the Flow

1. Go to `/signup`
2. Enter email, select variant (Treatment recommended)
3. Complete survey
4. Treatment users see single app + first-win task
5. Complete task, see cross-activation prompt
6. View results at `/dashboard`

## Synthetic Data

The dashboard includes a cohort generator that creates synthetic users with realistic conversion rates to demonstrate expected lift.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state)
- Recharts (visualization)
