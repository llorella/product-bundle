# CLAUDE.md

## Project Overview

A/B experiment demo for Every (every.to) demonstrating **demand-driven bundle discovery**. Built as a growth engineer application showcasing rigorous experiment design.

**Core Thesis**: Users discover bundle value more effectively when adjacent products are surfaced at moments of accomplished value (demand-driven discovery) rather than presented upfront as a menu of options.

## Quick Commands

```bash
npm install    # Install dependencies
npm run dev    # Start dev server at localhost:3000
npm run build  # Production build
```

## Workflow for Contributions

### Testing Changes

1. Run `npm run dev` to start the dev server
2. Clear existing data via `/dashboard` → "Clear All Data"
3. Test both variants:
   - **Control**: `/signup` → select Control → complete survey → see 2 app recommendations
   - **Treatment**: `/signup` → select Treatment → complete survey → see single app + first-win task
4. Verify cross-activation: complete first-win → click secondary app prompt → should show NEW task (not auto-complete)
5. Check `/dashboard` for tracked events and metrics

### Key Design Decisions

**The persona→app matrix is a HYPOTHESIS, not truth.** See `src/lib/primary-app.ts` for full documentation. The experiment tests whether single-path routing beats multi-choice, NOT whether the matrix mappings are optimal.

**No synthetic data.** The dashboard shows real tracked events only. Use the sample size calculator to understand experiment requirements.

**Statistical rigor matters.** Metrics include p-values, confidence intervals, and significance badges. "Insufficient Data" shown when n < 30 per variant.

### Common Gotchas

- **React Router errors**: Never call `router.push()` during render. Wrap in `useEffect`.
- **Cross-activation auto-completing**: Check `completedItems.includes(appName)` for THIS app, not global `firstWinCompletedAt`.
- **Event transformation**: Dashboard uses different field names than event store (`event_id` vs `id`, `user_id` vs `userId`).

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── signup/               # Email + variant selection
│   ├── survey/               # Persona + goal questions
│   ├── recs/                 # Control: 2 app recommendations
│   ├── start/                # Treatment: single app assignment
│   ├── app/[appName]/        # Mock app with first-win task
│   ├── bundle/               # Checklist UI
│   └── dashboard/            # Experiment metrics + stats
└── lib/
    ├── types.ts              # Types + EXPERIMENT_METRICS definitions
    ├── store.ts              # Zustand state (user, survey, completions)
    ├── events.ts             # Event tracking to localStorage
    ├── assignment.ts         # Hash-based variant assignment
    ├── stats.ts              # Statistical utilities (sample size, significance)
    └── primary-app.ts        # Persona×Goal→App matrix (HYPOTHESIS)
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/stats.ts` | Sample size calculator, p-values, confidence intervals |
| `src/lib/types.ts` | `EXPERIMENT_METRICS` with primary/secondary/guardrail definitions |
| `src/lib/primary-app.ts` | Matrix mapping + rationale documentation |
| `src/app/dashboard/page.tsx` | Metrics visualization with statistical analysis |
| `src/app/app/[appName]/page.tsx` | First-win tasks + cross-activation flow |

## The Experiment

**Hypothesis**: Users discover bundle value more effectively when adjacent products are surfaced at moments of accomplished value (demand-driven) rather than presented upfront as a menu.

**Business Impact**: Multi-product users retain 3-4x better. This experiment targets the *mechanism* by which users become multi-product users.

| Variant | Flow |
|---------|------|
| Control (Menu-Driven) | Survey → 2 app recommendations → user chooses → self-directed exploration |
| Treatment (Demand-Driven) | Survey → 1 assigned app → guided first-win → contextual cross-sell tied to accomplishment |

**Cross-Activation Prompts**: Treatment users see contextual prompts that reference their accomplishment:
- After Cora: "You cleared 10 emails. 5 had attachments—organize them in 30 seconds."
- After Sparkle: "You organized 12 files. 4 are unfinished drafts—pick one to complete."
- After Spiral: "You wrote 150 words. Capture more ideas on the go with voice notes."
- After Monologue: "You captured 4 ideas. Turn your best one into a polished draft."

**Metrics**:
- **Primary**: Multi-Product Activation (7d) — % of users who complete core action in 2+ products within 7 days
- **Secondary**: First Product Activation (24h), Time to First Value, Cross-Prompt CTR
- **Guardrails**: Survey completion rate, First product activation rate

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Recharts (charts)
- localStorage (event persistence)
