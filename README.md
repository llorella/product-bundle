# Every A/B Demo

A proof-of-concept A/B experiment for single-path onboarding at Every, demonstrating rigorous experiment design with statistical analysis.

## The Experiment

**Hypothesis**: Routing new signups into ONE primary app (based on survey answers) and guiding them to a "first win" will increase activation rates and reduce time to first value.

| Variant | Experience |
|---------|------------|
| Control | Shows 2 recommended apps, user chooses which to try |
| Treatment | Single app assignment + guided first-win task (30-90s) |

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
| `/dashboard` | Experiment metrics and statistical analysis |

## Metrics

| Type | Metric | Definition |
|------|--------|------------|
| Primary | Activation_24h | % completing first-win within 24h |
| Secondary | TTFV | Time to first value (seconds) |
| Secondary | CrossActivation_7d | % trying second app within 7 days |
| Guardrail | Survey Completion | Should not decrease |
| Guardrail | Error Rate | Should not increase |

## Statistical Analysis

The dashboard includes:
- **Sample size calculator**: Power analysis for experiment planning (80% power, 5% alpha)
- **Significance testing**: p-values and 95% confidence intervals for metric comparisons
- **Status badges**: "Statistically Significant", "Not Yet Significant", or "Insufficient Data" (n < 30)

## Primary App Matrix

Survey answers map to a single primary app. This matrix is a **hypothesis** to be validated, not assumed truth.

| Persona × Goal | productive | automate | write | trends |
|----------------|------------|----------|-------|--------|
| founder | Cora | Cora | Spiral | Monologue |
| builder | Sparkle | Sparkle | Spiral | Monologue |
| writer | Monologue | Spiral | Spiral | Spiral |
| designer | Sparkle | Sparkle | Spiral | Monologue |
| curious | Monologue | Cora | Spiral | Monologue |

See `src/lib/primary-app.ts` for rationale behind each assignment.

## Testing the Flow

1. Go to `/signup`
2. Enter email, select variant (Treatment recommended)
3. Complete survey (persona + goal)
4. Treatment: see single app + first-win task
5. Complete task, see cross-activation prompt
6. Try second app via cross-activation
7. View results at `/dashboard`

## Architecture

```
src/
├── app/                    # Next.js App Router pages
├── lib/
│   ├── types.ts           # Type definitions + metric definitions
│   ├── store.ts           # Zustand state management
│   ├── events.ts          # Event tracking (localStorage)
│   ├── stats.ts           # Statistical utilities
│   ├── assignment.ts      # Variant assignment
│   └── primary-app.ts     # Persona→App matrix (hypothesis)
```

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state)
- Recharts (visualization)
