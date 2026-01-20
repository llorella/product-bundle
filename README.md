# Every A/B Experiment Demo

A working A/B test for demand-driven bundle discovery at [Every](https://every.to). Built as a growth engineer application demonstrating experiment design, implementation, and statistical analysis.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Testing the Experiment

### Control Flow (Current every.to behavior)
1. Go to `/signup` → enter email → select **Control**
2. Complete survey (persona + goal)
3. See **2 app recommendations** → user must choose
4. Click an app → see handoff interstitial → land on app page
5. No guided task, self-directed exploration

### Treatment Flow (Hypothesis)
1. Go to `/signup` → enter email → select **Treatment**
2. Complete survey (persona + goal)
3. See **1 assigned app** with first-win task preview
4. Click "Get your first win" → complete guided task (30-60s)
5. See contextual cross-activation prompt tied to task output
6. Continue to second app or skip to bundle

### View Results
- `/dashboard` — Metrics, statistical analysis, event log
- `/dashboard/matrix` — Persona×Goal→App assignment analysis
- "Clear All Data" button resets for fresh testing

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page (mirrors every.to) |
| `/signup` | Email + variant selection |
| `/survey` | Persona + goal questions |
| `/recs` | Control: 2 app recommendations |
| `/start` | Treatment: 1 app assignment + escape hatch |
| `/app/[name]` | Mock product with first-win task |
| `/bundle` | Checklist (10 items) |
| `/dashboard` | Experiment metrics + statistics |

## Key Files

| File | What it does |
|------|--------------|
| `src/lib/store.ts` | Zustand state (user, survey, completions) |
| `src/lib/events.ts` | Event tracking to localStorage |
| `src/lib/primary-app.ts` | Persona×Goal→App matrix |
| `src/lib/stats.ts` | Sample size calculator, p-values, CI |
| `src/app/app/[appName]/page.tsx` | First-win tasks + cross-activation |
| `src/app/dashboard/page.tsx` | Metrics visualization |

## Documentation

| File | Content |
|------|---------|
| [EXPERIMENT.md](./EXPERIMENT.md) | Full experiment spec: hypothesis, metrics, statistical analysis, rollout plan |
| [AUDIT.md](./AUDIT.md) | Original funnel audit of every.to |
| [CLAUDE.md](./CLAUDE.md) | Development guidance for AI assistants |

## Tech Stack

Next.js 14 · TypeScript · Tailwind CSS · Zustand · Recharts · localStorage
