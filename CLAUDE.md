# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A/B experiment demo for Every (every.to) demonstrating **demand-driven bundle discovery**. Built as a growth engineer application showcasing rigorous experiment design.

**Core Thesis**: Users discover bundle value more effectively when adjacent products are surfaced at moments of accomplished value (demand-driven discovery) rather than presented upfront as a menu of options.

## Quick Commands

```bash
npm install    # Install dependencies
npm run dev    # Start dev server at localhost:3000
npm run build  # Production build
npm run lint   # Run ESLint
```

## The Products

Every offers four AI tools with different distribution models:

| Product | Type | Distribution |
|---------|------|--------------|
| Cora | Email Assistant | Web app |
| Spiral | AI Writing | Web app |
| Sparkle | File Organizer | Mac app (download required) |
| Monologue | Voice Dictation | Mac app (download required) |

This affects cross-activation: prompts to native apps acknowledge download friction rather than promising instant value.

## Workflow for Contributions

### Testing Changes

1. Run `npm run dev` to start the dev server
2. Clear existing data via `/dashboard` → "Clear All Data"
3. Test both variants:
   - **Control**: `/signup` → select Control → complete survey → see 2 app recommendations → click app → see handoff interstitial → land on app
   - **Treatment**: `/signup` → select Treatment → complete survey → see single app + first-win task → (optionally) test escape hatch to switch apps
4. Verify cross-activation: complete first-win → click secondary app prompt → should show NEW task (not auto-complete)
5. Check `/dashboard` for tracked events (including `escape_hatch_clicked` if tested)

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
    ├── types.ts              # Types, app definitions, cross-activation prompts
    ├── store.ts              # Zustand state (user, survey, completions)
    ├── events.ts             # Event tracking to localStorage
    ├── assignment.ts         # Hash-based variant assignment
    ├── stats.ts              # Statistical utilities (sample size, significance)
    ├── primary-app.ts        # Persona×Goal→App matrix
    └── matrix/               # Matrix config loading + device detection
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/stats.ts` | Sample size calculator, p-values, confidence intervals |
| `src/lib/types.ts` | App definitions (including distribution type), cross-activation prompts |
| `src/lib/primary-app.ts` | Matrix mapping + rationale documentation |
| `src/app/dashboard/page.tsx` | Metrics visualization with statistical analysis |
| `src/app/app/[appName]/page.tsx` | First-win tasks + cross-activation flow |

## The Experiment

**Hypothesis**: Users discover bundle value more effectively when adjacent products are surfaced at moments of accomplished value (demand-driven) rather than presented upfront as a menu.

| Variant | Flow |
|---------|------|
| Control (Menu-Driven) | Survey → 2 app recommendations → user chooses → self-directed exploration |
| Treatment (Demand-Driven) | Survey → 1 assigned app → guided first-win → contextual cross-sell tied to accomplishment |

**Cross-Activation Prompts** (native app targets acknowledge download friction):
- After Cora → Sparkle (native): "You cleared 10 emails. 5 had attachments worth organizing. Download Sparkle to sort them automatically."
- After Sparkle → Spiral (web): "You organized 12 files. 4 are unfinished drafts—pick one to complete."
- After Spiral → Monologue (native): "You wrote 150 words. Capture more ideas on the go with Monologue."
- After Monologue → Spiral (web): "You captured 4 ideas. Turn your best one into a polished draft."

**Metrics**:
- **Primary**: Multi-Product Activation (7d) — % of users who complete core action in 2+ products within 7 days
- **Secondary**: First Product Activation (24h), Time to First Value, Cross-Prompt CTR
- **Guardrails**: Survey completion rate, Escape hatch rate (treatment only, alert if >15%)

### Escape Hatch

Treatment users can switch apps via "Not what you need?" link. This:
1. Reduces ethical risk of trapping users in wrong app
2. Provides diagnostic signal about matrix quality
3. Tracked as `escape_hatch_clicked` event with from/to apps

High escape rate (>15%) suggests matrix needs tuning. Low rate validates single-path approach.

## Architecture

### State Flow

```
User signup → Zustand store (persisted to localStorage)
           → trackEvent() writes to localStorage events array
           → Dashboard reads events and computes metrics
```

### Key Patterns

1. **Variant Assignment**: Hash-based deterministic assignment in `src/lib/assignment.ts`. Can be overridden via UI for testing.

2. **Event Tracking**: All user actions emit typed events via `trackEvent()` in `src/lib/events.ts`. Events stored in localStorage under `every_demo_events` key.

3. **First-Win Tasks**: Each app in `src/app/app/[appName]/page.tsx` has a multi-step mock task. On completion, cross-activation prompts use `TaskArtifacts` from the completed task.

4. **Matrix Config**: Static persona×goal→app mapping in `src/config/matrix.default.json`. Loaded via `src/lib/matrix/config.ts`.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management, persisted to localStorage)
- Recharts (charts)
- localStorage (event + state persistence)

## Production Considerations

### Native App Attribution

For native apps (Sparkle, Monologue), the download funnel has extra steps:
1. `cross_prompt_clicked` — User clicked the prompt
2. `app_store_redirected` — User reached download page
3. `native_app_first_opened` — User launched the app (requires native SDK)
4. `first_win_completed` — User completed the task

This lets you diagnose where the funnel breaks for native vs web cross-activation.

### Cross-Domain Measurement

Production Every involves separate product domains with independent auth. For attribution:
1. Assign `variant`, `user_id`, `primary_app` on every.to at signup
2. Deep-link to product domain with short-lived **signed onboarding token**
3. Product app redeems token server-side, binds to local user, emits events with shared identifier
4. ETL reconciles events into unified experiment table

## Decision Log

1. **Initial hypothesis**: Personalized checklist would increase engagement
2. **Audit finding**: Real friction is *discovery mechanism*, not checklist content
3. **Final design**: Single-path routing + guided first-win + contextual cross-activation
4. **Native app awareness**: Sparkle and Monologue are Mac apps; cross-activation prompts adjusted accordingly
