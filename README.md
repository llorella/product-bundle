# Every A/B Experiment Demo

Demand-driven bundle discovery experiment for [Every](https://every.to).

## Quick Start

```bash
npm install
npm run dev    # http://localhost:3000
```

## What This Is

A working A/B test comparing two onboarding approaches:

| Variant | Flow |
|---------|------|
| **Control** | Survey → 2 app recommendations → user chooses → handoff interstitial → self-directed |
| **Treatment** | Survey → 1 assigned app → escape hatch available → guided first-win → contextual cross-sell |

## Testing

1. `/signup` → enter email, select variant (or Auto)
2. Complete survey (persona + goal)
3. Observe variant-specific flow
4. `/dashboard` → view tracked events and metrics

## Routes

| Route | Purpose |
|-------|---------|
| `/signup` | Email + variant selection |
| `/survey` | Persona + goal questions |
| `/recs` | Control: 2 apps + handoff interstitial |
| `/start` | Treatment: 1 app + escape hatch |
| `/app/[name]` | First-win task |
| `/bundle` | Checklist |
| `/dashboard` | Metrics + statistics |

## Documentation

- **[EXPERIMENT.md](./EXPERIMENT.md)** — Hypothesis, business case, design rationale
- **[SPEC.md](./SPEC.md)** — Technical specification, metrics, rollout plan
- **[AUDIT.md](./AUDIT.md)** — Original funnel audit

## Tech Stack

Next.js 14 / TypeScript / Tailwind / Zustand / Recharts / localStorage
