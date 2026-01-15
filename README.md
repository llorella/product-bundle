# Every A/B Demo: Demand-Driven Bundle Discovery

A proof-of-concept A/B experiment demonstrating **demand-driven bundle discovery** for Every (every.to). Built as a growth engineer application showcasing rigorous experiment design with statistical analysis.

## The Thesis

Users discover bundle value more effectively when adjacent products are surfaced at moments of accomplished value (demand-driven) rather than presented upfront as a menu.

**Business Impact**: Multi-product users retain 3-4x better. This experiment targets the *mechanism* by which users become multi-product users.

## The Experiment

| Variant | Flow |
|---------|------|
| **Control (Menu-Driven)** | Survey → See 2 apps → User chooses → Self-directed exploration |
| **Treatment (Demand-Driven)** | Survey → Assigned 1 app → Guided first-win → Contextual cross-sell |

### Contextual Cross-Activation

Treatment users see prompts that reference their accomplishments:

| After completing... | Prompt shown |
|---------------------|--------------|
| Cora (email) | "You cleared 10 emails. 5 had attachments—organize them in 30 seconds." |
| Sparkle (files) | "You organized 12 files. 4 are unfinished drafts—pick one to complete." |
| Spiral (writing) | "You wrote 150 words. Capture more ideas on the go with voice notes." |
| Monologue (voice) | "You captured 4 ideas. Turn your best one into a polished draft." |

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Testing the Flow

1. Go to `/signup`
2. Enter email (variant auto-assigned, or use override buttons)
3. Complete survey (persona + goal)
4. **Treatment**: See single app + complete first-win task
5. See contextual cross-activation prompt referencing your accomplishment
6. Try second app via cross-activation
7. View results at `/dashboard`

## Routes

| Route | Purpose |
|-------|---------|
| `/signup` | Signup flow with variant override |
| `/survey` | Persona + goal questions |
| `/recs` | Control: multi-app recommendations |
| `/start` | Treatment: single-path onboarding |
| `/app/[name]` | Mock app with first-win task |
| `/bundle` | Checklist and app directory |
| `/dashboard` | Experiment metrics and statistical analysis |

## Metrics

| Type | Metric | Definition |
|------|--------|------------|
| **Primary** | Multi-Product Activation (7d) | % completing core action in 2+ products within 7 days |
| Secondary | First Product Activation (24h) | % completing first-win within 24h |
| Secondary | Time to First Value | Median seconds from signup to first-win |
| Secondary | Cross-Prompt CTR | % clicking cross-activation prompt (treatment only) |
| Guardrail | Survey Completion | Should not decrease |
| Guardrail | First Product Activation | Should not decrease |

## Statistical Analysis

The dashboard includes:
- **Sample size calculator**: Power analysis (80% power, 5% alpha)
- **Significance testing**: p-values and 95% confidence intervals
- **Status badges**: "Significant", "Not Yet Significant", or "Insufficient Data" (n < 30)

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── signup/             # Email + variant selection
│   ├── survey/             # Persona + goal questions
│   ├── recs/               # Control: 2 app recommendations
│   ├── start/              # Treatment: single app assignment
│   ├── app/[appName]/      # First-win tasks with artifact tracking
│   ├── bundle/             # Checklist UI
│   └── dashboard/          # Experiment metrics + stats
└── lib/
    ├── types.ts            # Types, metrics, cross-prompt configs
    ├── store.ts            # Zustand state (user, survey, artifacts)
    ├── events.ts           # Event tracking (localStorage)
    ├── stats.ts            # Statistical utilities
    ├── assignment.ts       # Variant assignment
    └── primary-app.ts      # Persona→App matrix (hypothesis)
```

## Key Files

| File | Purpose |
|------|---------|
| `EXPERIMENT_SPEC.md` | Full experiment specification with rollout plan |
| `WHY_THIS_WORKS.md` | Business case and thesis explanation |
| `src/lib/types.ts` | `TaskArtifacts`, `CROSS_PROMPT_CONFIGS`, metrics |
| `src/app/app/[appName]/page.tsx` | First-win tasks + contextual prompts |
| `src/app/dashboard/page.tsx` | Multi-product metrics visualization |

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state)
- Recharts (visualization)
- localStorage (event persistence)

## Documentation

- **[EXPERIMENT_SPEC.md](./EXPERIMENT_SPEC.md)** — Full technical specification
- **[WHY_THIS_WORKS.md](./WHY_THIS_WORKS.md)** — Business case and thesis
- **[CLAUDE.md](./CLAUDE.md)** — Development guide
