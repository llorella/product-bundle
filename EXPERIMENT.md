# Experiment Spec: Demand-Driven Bundle Discovery

## Executive Summary

**Hypothesis:** Users discover bundle value more effectively when adjacent products are surfaced at moments of accomplished value rather than presented upfront as a menu of options.

**What we're testing:** Whether single-path routing + guided first-win + contextual cross-sell increases multi-product adoption compared to the current multi-choice flow.

**Primary Metric:** % of users who activate 2+ products within 7 days of signup

**Honest expectations:** We don't know the baseline. Industry benchmarks suggest 15-25% of bundle users try a second product, but Every's actual number could be 5% or 40%. The first week of this experiment is calibration.

---

## 1. Problem Statement

Every offers four AI tools: Spiral (writing), Sparkle (files), Cora (email), Monologue (voice). The current onboarding shows users multiple products and asks them to choose.

**Observed behavior on every.to:**
- Survey recommends 2 apps
- User must decide which to try first
- Links go to external product domains with separate auth
- No guided onboarding after landing

**Hypothesized problems:**
- Decision before value delivery
- No structured "aha moment"
- Cross-product connections invisible

---

## 2. The Experiment

### Variants

| Aspect | Control | Treatment |
|--------|---------|-----------|
| Post-survey | 2 app recommendations | 1 assigned app |
| First session | Self-directed | Guided first-win task (30-90s) |
| Cross-product | Visible in nav/checklist | Contextual prompt after task |

### What Treatment Changes

1. **Single-path routing** — Remove the choice. Assign one app based on persona + goal.
2. **Guided first-win** — Walk user through a 30-90 second task that delivers value.
3. **Contextual cross-sell** — After completing the task, prompt for second product using output from first task.

### What We're Bundling (and why)

This experiment tests three interventions at once. That's intentional:
- We want to know if this *direction* works before optimizing individual pieces
- If treatment wins, we decompose in follow-up tests
- If treatment loses, we save time by not A/B testing each piece separately

---

## 3. Metrics

### Primary

**Multi-Product Activation (7d)**
- Definition: % of users who complete a core action in 2+ products within 7 days
- Why: Multi-product usage correlates with retention. We're testing if we can *cause* it.

**Baseline:** Unknown. Using 15% as placeholder, but first week is calibration.

**Target:** Detect a 20% relative lift (e.g., 15% → 18%). If we see 10%+, the direction is validated.

### Secondary

| Metric | What it tells us |
|--------|------------------|
| First Product Activation (24h) | Does guided first-win work? |
| Time to First Value | Are we reducing friction? |
| Cross-Prompt CTR | Do prompts resonate? (treatment only) |
| Second Task Completion | Does second product deliver? |

### Guardrails

| Metric | Threshold | Why |
|--------|-----------|-----|
| Survey completion | No >5% decrease | Can't lose users before assignment |
| First session duration | No >10% decrease | Don't rush at cost of engagement |
| Escape hatch rate | Alert if >15% | Matrix assignments are wrong |

---

## 4. Statistical Plan

**Parameters:**
- Baseline: 15% (assumed, will calibrate)
- MDE: 20% relative lift (15% → 18%)
- Power: 80%
- Alpha: 5% (two-tailed)

**Required:** ~2,400 per variant (4,800 total)

**Timeline depends on Every's signup volume:**
- 500/week → 12 weeks
- 1,000/week → 6 weeks

### Decision Framework

| Outcome | Criteria | Action |
|---------|----------|--------|
| Clear win | p < 0.05, CI lower bound > 0, guardrails pass | Ship treatment |
| Clear loss | p < 0.05, CI upper bound < 0 | Keep control, investigate why |
| Directionally positive | p > 0.05, point estimate positive | Extend or iterate |
| Flat | p > 0.05, point estimate near zero | Kill experiment, revise hypothesis |

---

## 5. The Persona→App Matrix

**This is a hypothesis, not truth.**

| Persona | Productive | Automate | Write | Trends |
|---------|------------|----------|-------|--------|
| Founder | Cora | Cora | Spiral | Monologue |
| Builder | Sparkle | Sparkle | Spiral | Monologue |
| Writer | Monologue | Spiral | Spiral | Spiral |
| Designer | Sparkle | Sparkle | Spiral | Monologue |
| Curious | Monologue | Cora | Spiral | Monologue |

**Rationale:** Match task-oriented goals to task-oriented products. Trend-seekers get Monologue (low friction). Writers get Spiral (direct match).

**How we know if it's wrong:** Escape hatch rate. If >15% of treatment users switch apps, the matrix needs tuning.

**What we're NOT testing:** Whether these specific mappings are optimal. We're testing whether single-path beats multi-choice. Matrix optimization comes later.

---

## 6. Native App Considerations

Two products are native Mac apps requiring download:

| Product | Distribution | Implication |
|---------|--------------|-------------|
| Cora | Web | Instant access |
| Spiral | Web | Instant access |
| Sparkle | Mac app | Download required |
| Monologue | Mac app | Download required |

### Impact on Experiment

**Download friction affects both variants equally.** Control users who pick Sparkle face the same download as Treatment users assigned Sparkle. The experiment still tests demand-driven vs menu-driven discovery cleanly.

**Cross-activation paths have different friction:**

| Path | Friction |
|------|----------|
| Cora → Sparkle | Web → Native (download required) |
| Sparkle → Spiral | Native → Web (easy) |
| Spiral → Monologue | Web → Native (download required) |
| Monologue → Spiral | Native → Web (easy) |

### Additional Metrics for Native Apps

For cross-activation to native apps, track the download funnel separately:

1. `cross_prompt_clicked` — User clicked the prompt
2. `app_store_redirected` — User reached download page
3. `native_app_first_opened` — User launched the app (requires native SDK)
4. `first_win_completed` — User completed the task

This lets us diagnose where the funnel breaks. If Treatment shows higher prompt CTR but same ultimate activation, the prompt worked but download friction killed it—still useful signal.

### Cross-Activation Prompt Copy

Prompts for native app targets should acknowledge the commitment rather than promise instant value:

| After | Next App | Prompt |
|-------|----------|--------|
| Cora | Sparkle (native) | "You cleared {n} emails. {m} had attachments worth organizing. Download Sparkle to sort them automatically." |
| Sparkle | Spiral (web) | "You organized {n} files. {m} are unfinished drafts—pick one to complete." |
| Spiral | Monologue (native) | "You wrote {n} words. Capture more ideas on the go with Monologue." |
| Monologue | Spiral (web) | "You captured {n} ideas. Turn your best one into a polished draft." |

---

## 7. Risks

### Matrix Assigns Wrong Product

**Probability:** Medium. We're guessing without Every's data.

**Mitigation:** Escape hatch lets users switch. We track it. High rate = signal, not failure.

### Cross-Prompts Feel Salesy

**Probability:** Low-medium.

**Mitigation:** Prompts appear after accomplishment (positive moment), reference specific output, easy to dismiss.

### We're Solving the Wrong Problem

**Probability:** Unknown. Maybe users don't try second products because the first product isn't good enough.

**Mitigation:** First product activation as secondary metric. If treatment improves multi-product but not first product, the hypothesis is validated. If neither moves, the problem is upstream.

---

## 8. What Success Looks Like

**Strong signal:**
- Primary metric: 15%+ relative lift, p < 0.05
- First product activation: improving
- Cross-prompt CTR: 25%+
- Escape hatch: <10%
- Guardrails: all green

**Weak but positive signal:**
- Primary metric: 10-15% lift, p > 0.05 but trending
- First product activation: flat or improving
- Worth extending or iterating

**Negative signal:**
- Primary metric: flat or negative
- First product activation: worse
- Escape hatch: >20%
- Kill and investigate

---

## 9. What This Doc Doesn't Know

1. **Every's actual baseline metrics.** Everything here is industry benchmarks and guesses.
2. **Whether the products are good enough.** If users try Sparkle and it sucks, no onboarding flow will save it.
3. **Cross-domain auth friction.** Real Every has separate auth per product. Demo sidesteps this.
4. **Native app download completion rates.** We can track intent but may not see actual installs without native SDK integration.
5. **Long-term retention impact.** We're measuring 7-day activation, not 90-day retention.
