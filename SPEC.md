# Experiment Spec: Demand-Driven Bundle Discovery

## Executive Summary

**Hypothesis:** Users discover bundle value more effectively when adjacent products are surfaced at moments of accomplished value (demand-driven discovery) rather than presented upfront as a menu of options.

**Business Impact:** Multi-product users retain 3-4x better than single-product users. This experiment targets the *mechanism* by which users become multi-product users, not just top-of-funnel activation.

**Primary Metric:** % of users who activate 2+ products within 7 days of signup

**Expected Lift:** +40-60% relative improvement in multi-product adoption (from ~15% baseline to ~22-24%)

---

## 1. Problem Statement

### The Bundle Paradox

Every offers a bundle of AI-powered tools for knowledge workers:
- **Spiral** — AI writing assistant
- **Sparkle** — Intelligent file organization
- **Cora** — AI email triage
- **Monologue** — Voice note transcription & summarization

The bundle's value proposition is compelling: *one subscription for your entire knowledge workflow*. But there's a fundamental tension in how users discover this value.

### Current State: Menu-Driven Discovery

Today, new users see multiple product recommendations during onboarding. This approach assumes:
- Users can evaluate multiple products simultaneously
- Users know which problems they have before experiencing solutions
- More choice = better matching

In practice, this creates:
- **Cognitive overload** — Users face a decision before they've experienced value
- **Shallow exploration** — Users pick one product and never return to others
- **Perceived complexity** — The bundle feels like "a lot of stuff" rather than "a system"

### Evidence of the Problem

Industry benchmarks for multi-product SaaS bundles show:
- 60-80% of users never try a second product
- Users who *do* try 2+ products retain at 3-4x higher rates
- The gap between "signed up" and "uses the bundle" is where most value leaks

The question isn't whether the bundle is valuable—it's whether users ever *discover* that value.

---

## 2. Proposed Solution: Demand-Driven Discovery

### Core Insight

Bundle value isn't discovered through menus. It's discovered through **experienced friction**.

When a user:
- Finishes triaging email → they have attachments to organize
- Organizes their files → they find drafts that need finishing
- Writes a draft → they want to capture ideas on the go
- Records voice notes → they need to turn them into written content

Each product creates **latent demand** for another product in the bundle. The insight is to surface the next product at the moment this demand is highest—immediately after accomplishing something in the current product.

### The Mechanism

```
Traditional Bundle Discovery:
Signup → See 4 products → Pick 1 → Use it → Maybe remember others exist

Demand-Driven Discovery:
Signup → Assigned 1 product → Accomplish first win →
  → Surface next product tied to what you just did →
  → Accomplish second win → Bundle value clicks
```

This mirrors how successful ecosystems work:
- **AWS:** Sign up for S3 → need compute → discover EC2 → need monitoring → discover CloudWatch
- **Shopify:** Start with storefront → need payments → discover Shopify Payments → need shipping → discover Shopify Shipping
- **Apple:** Buy iPhone → need cloud storage → discover iCloud → need laptop sync → consider MacBook

The bundle sells itself through *workflow continuity*, not marketing.

---

## 3. Experiment Design

### Variants

| Aspect | Control | Treatment |
|--------|---------|-----------|
| **Initial Product Selection** | User sees 2 recommended products, chooses one | User assigned 1 product based on persona×goal |
| **First Session** | Lands on product, explores freely | Guided first-win task (30-90 seconds) |
| **Cross-Product Discovery** | Products visible in nav/bundle page | Contextual prompt after first-win completion |
| **Prompt Framing** | "Check out our other products" | "You just did X. Here's what's next." |

### The Treatment Flow in Detail

**Step 1: Single Product Assignment**

After the onboarding survey (persona + primary goal), users are assigned ONE product based on a hypothesis matrix:

| Persona | Goal | Assigned Product | Rationale |
|---------|------|------------------|-----------|
| Writer | Ship faster | Spiral | Direct match to creation workflow |
| Writer | Stay organized | Sparkle | Writers accumulate research/drafts |
| Writer | Save time | Cora | Email is a major time sink for freelancers |
| Founder | Ship faster | Spiral | Founders write constantly (updates, pitches) |
| Founder | Stay organized | Sparkle | Founders drown in files and docs |
| Founder | Save time | Cora | Email overload is universal for founders |
| Curious | Any | Spiral | Lowest friction entry point |

*Note: This matrix is a hypothesis. The experiment tests whether single-path assignment beats multi-choice, not whether these specific mappings are optimal. Matrix optimization is a follow-up experiment.*

**Step 2: Guided First Win**

Each product has a defined "first win" — a task completable in 30-90 seconds that delivers tangible value:

| Product | First Win Task | Time | Delivered Value |
|---------|---------------|------|-----------------|
| Cora | Triage 10 emails (archive/reply/defer) | 60-90s | Clean inbox, demonstrated AI judgment |
| Sparkle | Auto-organize 10 files into folders | 30-45s | Visible organization, reduced clutter |
| Spiral | Generate first draft from prompt | 45-60s | Tangible output, AI collaboration feel |
| Monologue | Record 30s voice note, get summary | 60-90s | Voice→text magic, idea captured |

The first win accomplishes several things:
- Delivers value before asking for commitment
- Teaches the product's core mechanic
- Creates a **completion moment** (psychological anchor)
- Generates context for the cross-product prompt

**Step 3: Contextual Cross-Product Prompt**

Immediately after first-win completion, users see a contextual prompt connecting their accomplishment to the next product:

| Completed Product | Prompt | Next Product |
|-------------------|--------|--------------|
| Cora | "You cleared 10 emails. 3 had attachments—organize them in 30 seconds." | Sparkle |
| Sparkle | "You organized 12 files. 4 are unfinished drafts—pick one to complete." | Spiral |
| Spiral | "You wrote 400 words. Capture more ideas on the go with voice notes." | Monologue |
| Monologue | "You captured 3 ideas. Turn your best one into a full draft." | Spiral |

Key principles for prompts:
- **Reference specific accomplishment** ("You cleared 10 emails")
- **Connect to latent need** ("3 had attachments")
- **Quantify the ask** ("30 seconds")
- **Frame as continuation**, not new decision

**Step 4: Second Product First Win**

If the user clicks through, they enter the second product's first-win flow. This is critical:
- The second first-win should feel like a *continuation*, not starting over
- Ideally, it uses artifacts from the first product (e.g., the attachments they saved)
- Completion of this second first-win is the **primary success event**

### The Control Flow

Control users experience:
1. Same onboarding survey
2. See 2 recommended products (from same persona×goal matrix)
3. Choose which to explore
4. Land on product page (no guided first-win)
5. Explore freely
6. Can navigate to other products via bundle page

This tests whether guided single-path + contextual cross-sell outperforms user choice + self-directed exploration.

---

## 4. Metrics Framework

### Primary Metric

**Multi-Product Activation Rate (7-day)**
- Definition: % of users who complete a core action in 2+ products within 7 days of signup
- Core action defined per product:
  - Cora: Triage ≥5 emails
  - Sparkle: Organize ≥5 files
  - Spiral: Generate ≥1 draft
  - Monologue: Record and summarize ≥1 note

**Why this metric:**
- Directly measures bundle value discovery
- Correlated with retention (the business outcome we care about)
- 7-day window balances signal strength with experiment velocity

**Baseline estimate:** ~15% (based on industry benchmarks for multi-product SaaS)

**Target:** 22-24% (+40-60% relative lift)

**Minimum Detectable Effect:** 20% relative lift (15% → 18%)

### Secondary Metrics

**1. Time to Second Product Activation (TTSPA)**
- Definition: Median time from signup to second product core action
- Why: Faster discovery = stronger habit formation
- Expected: Treatment reduces TTSPA by 40-60%

**2. First Product Activation Rate (24-hour)**
- Definition: % of users who complete first-win within 24 hours
- Why: Single-path should improve this; validates the mechanism
- Expected: +30-50% relative lift

**3. Cross-Activation Prompt CTR (Treatment only)**
- Definition: % of users shown prompt who click through
- Why: Measures prompt effectiveness; informs iteration
- Target: >40% CTR

**4. Second Product Completion Rate**
- Definition: Of users who click cross-activation prompt, % who complete second first-win
- Why: Measures if second product delivers on promise
- Target: >60% completion

### Guardrail Metrics

**1. Survey Completion Rate**
- Definition: % of signups who complete onboarding survey
- Threshold: Must not decrease by >5% relative
- Why: Survey is required for assignment; if we're losing users here, we have a problem

**2. First Session Duration**
- Definition: Median time spent in first session
- Threshold: Must not decrease by >10% relative
- Why: Ensures we're not rushing users through at the cost of engagement

**3. 7-Day Return Rate**
- Definition: % of users who return at least once in days 2-7
- Threshold: Must not decrease by >5% relative
- Why: Ensures first-session optimization doesn't hurt habit formation

**4. Error Rate**
- Definition: % of sessions with tracked errors
- Threshold: Must not increase by >20% relative
- Why: New flow shouldn't introduce bugs

**5. Escape Hatch Rate (Treatment only)**
- Definition: % of treatment users who switch away from assigned primary app
- Threshold: Alert if >15%
- Why: Signals persona→app matrix quality; high rate means assignments are wrong

### Metric Hierarchy

```
                    ┌─────────────────────────────────────┐
                    │  Multi-Product Activation (7-day)   │  ← Primary
                    │  The thing we're trying to move     │
                    └─────────────────────────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
   │  First Product  │    │ Time to Second  │    │  Cross-Prompt   │
   │   Activation    │    │    Product      │    │      CTR        │  ← Secondary
   │                 │    │                 │    │                 │
   └─────────────────┘    └─────────────────┘    └─────────────────┘
              │                       │                       │
              │            Mechanism diagnostics              │
              │                                               │
              ▼                                               ▼
   ┌─────────────────────────────────────────────────────────────┐
   │  Survey Completion │ Session Duration │ Return Rate │ Errors │  ← Guardrails
   │                    Do no harm checks                        │
   └─────────────────────────────────────────────────────────────┘
```

---

## 5. Statistical Analysis Plan

### Sample Size Calculation

**Parameters:**
- Baseline multi-product activation: 15%
- Minimum detectable effect: 20% relative (15% → 18%)
- Statistical power: 80%
- Significance level: 5% (two-tailed)

**Required sample size:** ~3,200 users per variant (6,400 total)

**At 500 signups/week:** ~13 weeks to full power
**At 1,000 signups/week:** ~6-7 weeks to full power

### Analysis Methods

**Primary analysis:** Two-proportion z-test
- H₀: p_treatment = p_control
- H₁: p_treatment ≠ p_control
- Report: p-value, 95% CI for difference, relative lift

**Secondary (continuous) metrics:** Welch's t-test
- Accounts for potentially unequal variances
- Report: p-value, 95% CI for difference

**Decision framework:**

| Outcome | p-value | CI for lift | Decision |
|---------|---------|-------------|----------|
| Clear win | <0.05 | Lower bound >0 | Ship treatment |
| Clear loss | <0.05 | Upper bound <0 | Keep control |
| Inconclusive | ≥0.05 | Spans 0 | Extend experiment or accept null |

### Guardrail Checks

Before declaring a winner, verify ALL guardrails:
- Survey completion: control rate within [-5%, +∞] of baseline
- Session duration: control median within [-10%, +∞] of baseline
- Return rate: control rate within [-5%, +∞] of baseline
- Error rate: treatment rate within [-∞, +20%] of control

If any guardrail fails, investigate before shipping.

---

## 6. Implementation Details

### Technical Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                        │
├──────────────────────────────────────────────────────────────────┤
│  Signup → Survey → [Assignment] → Product → [Cross-Prompt]       │
│                         │                        │                │
│              ┌──────────┴──────────┐    ┌───────┴───────┐        │
│              │  Variant Router     │    │ Prompt Engine │        │
│              │  (hash-based)       │    │ (context-aware)│        │
│              └──────────┬──────────┘    └───────┬───────┘        │
│                         │                       │                 │
├─────────────────────────┼───────────────────────┼─────────────────┤
│                    Event Tracking Layer                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ signup_completed | survey_completed | first_win_started |   │ │
│  │ first_win_completed | cross_prompt_shown | cross_prompt_    │ │
│  │ clicked | second_product_activated | core_action            │ │
│  └─────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│                     State Management (Zustand)                    │
│  user { id, variant, persona, goal, primaryApp, completedApps }  │
└──────────────────────────────────────────────────────────────────┘
```

### Variant Assignment

**Method:** Deterministic hash-based assignment
```javascript
function assignVariant(userId: string): 'control' | 'treatment' {
  const hash = hashCode(userId);  // Consistent 32-bit hash
  return hash % 2 === 0 ? 'control' : 'treatment';
}
```

**Properties:**
- Deterministic: Same user always gets same variant
- Balanced: ~50/50 split over large samples
- Reproducible: Can verify assignment from userId alone

### Event Schema

All events include base fields:
```typescript
interface BaseEvent {
  event_id: string;      // Unique event identifier
  timestamp: string;     // ISO 8601
  user_id: string;       // Hashed user identifier
  session_id: string;    // Session identifier
  variant: 'control' | 'treatment';
}
```

Key events for primary metric:

```typescript
interface FirstWinCompleted extends BaseEvent {
  type: 'first_win_completed';
  app: 'cora' | 'sparkle' | 'spiral' | 'monologue';
  time_to_value_seconds: number;
  task_type: string;
}

interface SecondProductActivated extends BaseEvent {
  type: 'second_product_activated';
  app: 'cora' | 'sparkle' | 'spiral' | 'monologue';
  days_since_first_win: number;
  trigger: 'cross_prompt' | 'organic' | 'bundle_page';
}

interface CoreAction extends BaseEvent {
  type: 'core_action';
  app: 'cora' | 'sparkle' | 'spiral' | 'monologue';
  action_type: string;  // e.g., 'email_triaged', 'file_organized'
}
```

### Cross-Activation Prompt Logic

```typescript
interface CrossPromptConfig {
  fromApp: App;
  toApp: App;
  promptTemplate: string;
  contextExtractor: (session: Session) => PromptContext;
}

const CROSS_PROMPT_CONFIG: CrossPromptConfig[] = [
  {
    fromApp: 'cora',
    toApp: 'sparkle',
    promptTemplate: "You cleared {emailCount} emails. {attachmentCount} had attachments—organize them in 30 seconds.",
    contextExtractor: (session) => ({
      emailCount: session.emailsTriaged,
      attachmentCount: session.attachmentsSaved,
    }),
  },
  {
    fromApp: 'sparkle',
    toApp: 'spiral',
    promptTemplate: "You organized {fileCount} files. {draftCount} are unfinished drafts—pick one to complete.",
    contextExtractor: (session) => ({
      fileCount: session.filesOrganized,
      draftCount: session.draftsFound,
    }),
  },
  // ... etc
];
```

---

## 7. Rollout Plan

### Phase 1: Instrumentation (Week 1)

**Objective:** Ensure all metrics can be measured accurately

**Tasks:**
- [ ] Implement event tracking for all required events
- [ ] Verify events fire correctly in both variants
- [ ] Build dashboard for real-time metric monitoring
- [ ] Validate sample size calculator against requirements
- [ ] Test variant assignment determinism

**Exit criteria:** All events tracked, dashboard functional, QA sign-off

### Phase 2: Soft Launch (Week 2)

**Objective:** Validate technical implementation with small traffic

**Tasks:**
- [ ] Enable experiment for 10% of new signups
- [ ] Monitor error rates and guardrail metrics
- [ ] Verify event data quality in analytics
- [ ] Check for variant assignment balance
- [ ] Fix any bugs discovered

**Exit criteria:** No errors, balanced assignment, clean data

### Phase 3: Full Experiment (Weeks 3-8+)

**Objective:** Run experiment to statistical significance

**Tasks:**
- [ ] Ramp to 100% of new signups
- [ ] Monitor metrics weekly
- [ ] Document any anomalies or external factors
- [ ] Prepare for early stopping if clear winner/loser

**Exit criteria:** Reach required sample size OR early stopping criteria met

### Phase 4: Analysis & Decision (Week 9)

**Objective:** Make ship/no-ship decision

**Tasks:**
- [ ] Run final statistical analysis
- [ ] Verify all guardrails pass
- [ ] Document learnings regardless of outcome
- [ ] If shipping: plan 100% rollout
- [ ] If not shipping: document next experiments to run

**Exit criteria:** Decision made, learnings documented

### Phase 5: Ship or Iterate (Week 10+)

**If treatment wins:**
- Remove control code path
- Optimize cross-prompt copy (follow-up experiment)
- Test matrix variations (which product for which persona)

**If control wins:**
- Analyze where treatment failed (prompt CTR? second product completion?)
- Hypothesize fixes
- Design follow-up experiment

**If inconclusive:**
- Extend experiment if trending positive
- Kill experiment if flat/negative
- Consider whether MDE was too aggressive

---

## 8. Risks & Mitigations

### Risk 1: Matrix Assignment Mismatch

**Risk:** Persona×goal matrix assigns "wrong" product, users bounce

**Mitigation:**
- Matrix is hypothesis, not truth (documented)
- First-win tasks are universally appealing (not persona-specific)
- Monitor first-win completion rate as leading indicator
- Can iterate on matrix without changing experiment mechanism

### Risk 2: Prompt Fatigue

**Risk:** Users feel "sold to" by cross-activation prompt

**Mitigation:**
- Prompt appears only after accomplishment (positive moment)
- Prompt references specific context (feels helpful, not generic)
- Single prompt, not a cascade
- Easy to dismiss (not modal/blocking)

### Risk 3: Cannibalization of Organic Discovery

**Risk:** Guided flow prevents users from finding their own path

**Mitigation:**
- Guardrail: 7-day return rate
- Secondary: Track "organic" second product activation in control
- Treatment still allows free exploration after first-win
- Bundle page always accessible

### Risk 4: Technical Complexity

**Risk:** New flow introduces bugs, degrades experience

**Mitigation:**
- Soft launch at 10% first
- Guardrail: Error rate monitoring
- Feature flags for instant rollback
- Comprehensive QA before launch

### Risk 5: Insufficient Sample Size

**Risk:** Experiment runs too long, opportunity cost

**Mitigation:**
- Calculate required sample size upfront (done: ~6,400 users)
- Set calendar reminder for power check at 50% enrollment
- Pre-commit to decision timeline
- Consider Bayesian early stopping if needed

---

## 9. Future Experiments (Backlog)

If this experiment succeeds, the following experiments become possible:

### 9.1 Matrix Optimization

**Hypothesis:** Specific persona×goal→product mappings outperform others

**Design:** Multi-arm bandit across matrix cells

**Primary metric:** First-win completion rate per assignment

### 9.2 Prompt Copy Optimization

**Hypothesis:** Specific prompt framings increase cross-prompt CTR

**Design:** A/B/C/D test on prompt templates

**Primary metric:** Cross-prompt CTR

### 9.3 Second First-Win Design

**Hypothesis:** Second product first-win that uses artifacts from first product increases completion

**Design:** A/B test connected vs standalone second first-win

**Primary metric:** Second product first-win completion rate

### 9.4 Third Product Discovery

**Hypothesis:** Users who activate 3 products retain dramatically better

**Design:** Test third cross-prompt after second product activation

**Primary metric:** 3+ product activation rate

### 9.5 Re-Engagement Prompts

**Hypothesis:** Dormant users can be reactivated with contextual product prompts

**Design:** Email/push experiment with demand-driven framing

**Primary metric:** 7-day return rate for dormant users

---

## 10. Appendix

### A. Persona×Goal Matrix (Full)

| Persona | Goal | Primary App | Secondary App | Rationale |
|---------|------|-------------|---------------|-----------|
| Writer | Ship faster | Spiral | Monologue | Writers need drafts; voice capture feeds writing |
| Writer | Stay organized | Sparkle | Spiral | Organization enables focused writing |
| Writer | Save time | Cora | Spiral | Less email = more writing time |
| Founder | Ship faster | Spiral | Cora | Founders write updates, pitches; email is overhead |
| Founder | Stay organized | Sparkle | Cora | File chaos + email chaos are related |
| Founder | Save time | Cora | Sparkle | Email triage → attachment organization |
| Operator | Ship faster | Spiral | Sparkle | SOPs need writing; files need organizing |
| Operator | Stay organized | Sparkle | Cora | Files and email are both inbox problems |
| Operator | Save time | Cora | Sparkle | Same as founder pattern |
| Curious | Ship faster | Spiral | Monologue | Easiest entry; voice capture is novel |
| Curious | Stay organized | Sparkle | Spiral | Visual organization → try writing next |
| Curious | Save time | Spiral | Cora | Start with magic (AI writing); email is universal pain |

### B. First-Win Task Specifications

**Cora (Email Triage)**
```
Task: Process 10 emails using AI-suggested actions
Duration: 60-90 seconds
Steps:
1. See email subject + AI recommendation (Archive/Reply/Defer)
2. Accept or override recommendation
3. Repeat for 10 emails
4. See summary: "You processed 10 emails in X seconds"
Artifacts generated: List of attachments saved (for Sparkle prompt)
```

**Sparkle (File Organization)**
```
Task: Auto-organize 10 files into smart folders
Duration: 30-45 seconds
Steps:
1. See 10 unsorted files with AI-suggested folders
2. Confirm or adjust each suggestion
3. See organized folder view
4. See summary: "You organized 10 files into X folders"
Artifacts generated: Count of draft files found (for Spiral prompt)
```

**Spiral (AI Writing)**
```
Task: Generate a first draft from a prompt
Duration: 45-60 seconds
Steps:
1. Choose a writing type (email, blog post, tweet thread)
2. Enter a 1-sentence topic
3. Watch AI generate draft (streaming)
4. Make one edit
5. See summary: "You created a X-word draft"
Artifacts generated: Draft topic (for Monologue prompt)
```

**Monologue (Voice Notes)**
```
Task: Record a voice note and get AI summary
Duration: 60-90 seconds
Steps:
1. Tap to record
2. Speak for 15-30 seconds (prompt: "What's on your mind?")
3. See transcription appear
4. See AI summary/action items
5. See summary: "You captured X ideas in Y seconds"
Artifacts generated: Idea count (for Spiral prompt)
```

### C. Sample Size Calculation

Using two-proportion z-test formula:

```
n = 2 * ((z_α/2 + z_β)² * p̄(1-p̄)) / (p1 - p0)²

Where:
- p0 = 0.15 (baseline)
- p1 = 0.18 (target = 20% relative lift)
- p̄ = (p0 + p1) / 2 = 0.165
- z_α/2 = 1.96 (95% confidence)
- z_β = 0.84 (80% power)

n = 2 * ((1.96 + 0.84)² * 0.165 * 0.835) / (0.03)²
n = 2 * (7.84 * 0.138) / 0.0009
n = 2 * 1.08 / 0.0009
n ≈ 2,400 per variant

With 20% buffer for attrition: ~3,200 per variant
Total: ~6,400 users
```

### D. Dashboard Metrics Display

| Metric | Display | Calculation |
|--------|---------|-------------|
| Multi-Product Activation | X.X% (control) vs Y.Y% (treatment) | Users with 2+ core_actions / total users |
| Relative Lift | +Z.Z% | (treatment - control) / control |
| P-Value | 0.XXX | Two-proportion z-test |
| 95% CI | [A.A%, B.B%] | Unpooled SE × 1.96 |
| Significance | Badge | Green if p<0.05, Yellow otherwise |
| Sample Size Progress | X,XXX / 6,400 | Current enrollment vs target |

---

## 11. Decision Log

*To be filled during experiment*

| Date | Decision | Rationale | Owner |
|------|----------|-----------|-------|
| | | | |

---

## 12. Sign-Off

| Role | Name | Date | Approval |
|------|------|------|----------|
| Growth Lead | | | ☐ |
| Product Manager | | | ☐ |
| Engineering Lead | | | ☐ |
| Data Science | | | ☐ |

---

*Document version: 1.0*
*Last updated: 2025-01*
*Author: [Your name]*
