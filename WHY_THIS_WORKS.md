# Demand-Driven Bundle Discovery: Why This Experiment Matters

## The Problem with Bundle Onboarding

Every offers a bundle of AI tools: Spiral (writing), Sparkle (files), Cora (email), Monologue (voice). The bundle's value proposition is compelling—one subscription for your entire knowledge workflow.

But there's a fundamental tension in how users discover this value.

**The typical approach:**
> "Here's our bundle. Pick what looks interesting."

This creates three problems:

1. **Choice paralysis** — Users face decisions before experiencing value
2. **Shallow exploration** — Users pick one product and forget the rest exist
3. **Invisible connections** — Users never discover how the products work *together*

The result: 60-80% of bundle users never try a second product. They're paying for a system but using a single tool.

---

## The Insight: Demand-Driven Discovery

Bundle value isn't discovered through menus. It's discovered through **experienced friction**.

When a user:
- Finishes triaging email → they have attachments to organize
- Organizes their files → they find drafts that need finishing
- Writes a draft → they want to capture ideas on the go
- Records voice notes → they need to turn them into written content

Each product creates **latent demand** for another product. The insight is to surface the next product at the moment this demand is highest—immediately after accomplishing something.

**This is how successful ecosystems work:**
- **AWS**: Sign up for S3 → need compute → discover EC2 → need monitoring → discover CloudWatch
- **Shopify**: Start with storefront → need payments → discover Shopify Payments
- **Apple**: Buy iPhone → need cloud storage → discover iCloud → consider MacBook

The bundle sells itself through *workflow continuity*, not marketing copy.

---

## What We Built

### The Experiment

| Variant | Flow |
|---------|------|
| **Control (Menu-Driven)** | Survey → See 2 apps → User chooses → Self-directed exploration |
| **Treatment (Demand-Driven)** | Survey → Assigned 1 app → Guided first-win → Contextual cross-sell |

### The Key Innovation: Contextual Prompts

Instead of generic "Try our other products," the treatment shows prompts that reference what the user just accomplished:

| After completing... | Prompt shown |
|---------------------|--------------|
| **Cora** (10 emails triaged) | "You cleared 10 emails. 5 had attachments—organize them in 30 seconds." |
| **Sparkle** (12 files organized) | "You organized 12 files. 4 are unfinished drafts—pick one to complete." |
| **Spiral** (150 words written) | "You wrote 150 words. Capture more ideas on the go with voice notes." |
| **Monologue** (4 ideas captured) | "You captured 4 ideas. Turn your best one into a polished draft." |

This works because:
1. **It references a real accomplishment** — the user just did something
2. **It surfaces latent demand** — "you have attachments" / "you have drafts"
3. **It feels like a service, not a sell** — the prompt is helpful, not promotional
4. **It quantifies the ask** — "30 seconds" reduces friction

### Technical Implementation

**Artifact Tracking**: Each first-win task tracks what the user accomplished:
```javascript
// Cora tracks attachments
{ emailsProcessed: 10, attachmentsSaved: 5 }

// Sparkle tracks drafts found
{ filesOrganized: 12, foldersCreated: 5, draftsFound: 4 }

// Spiral tracks word count
{ wordCount: 150, draftType: 'email' }

// Monologue tracks ideas
{ ideasCaptured: 4, recordingSeconds: 45 }
```

**Contextual Prompt Engine**: Prompts are generated from artifacts:
```javascript
getPrompt: (artifacts) => ({
  headline: `You organized ${artifacts.filesOrganized} files`,
  subtext: `${artifacts.draftsFound} are unfinished drafts—pick one to complete`,
  cta: 'Finish a draft →',
})
```

---

## Why This Metric Structure

### Primary: Multi-Product Activation (7-day)

**Definition**: % of users who complete a core action in 2+ products within 7 days

**Why this over single-product activation:**
- Multi-product users retain 3-4x better than single-product users
- It directly measures whether users discover the *bundle* value, not just one tool
- It's the leading indicator for the business outcome we actually care about (LTV)

### Secondary Metrics

| Metric | Why it matters |
|--------|----------------|
| **First Product Activation (24h)** | Validates the guided first-win doesn't hurt initial activation |
| **Time to First Value** | Measures if treatment reduces friction |
| **Cross-Prompt CTR** | Diagnostic for prompt effectiveness (treatment only) |

### Guardrails

| Metric | Threshold |
|--------|-----------|
| **Survey Completion** | Must not decrease >5% |
| **First Product Activation** | Must not decrease >5% |

---

## The Business Case

### Conservative Estimates

| Metric | Baseline | Target | Impact |
|--------|----------|--------|--------|
| Multi-product activation | 15% | 22% (+47% relative) | +7pp |
| At 10K monthly signups | 1,500 multi-product users | 2,200 multi-product users | +700/month |

### Retention Impact

If multi-product users retain at 3x the rate of single-product users:
- Single-product monthly churn: ~8%
- Multi-product monthly churn: ~2.5%

**700 additional multi-product users/month × 12 months × improved retention = significant LTV impact**

### Why This Beats Other Experiments

| Alternative Experiment | Why This Is Higher Leverage |
|------------------------|----------------------------|
| Paywall optimization | Already converted; this is upstream |
| Email capture improvements | Every's editorial already drives strong organic |
| Onboarding survey optimization | Necessary but not sufficient; doesn't address discovery |
| Feature-level improvements | Product-specific; doesn't address bundle value |

This experiment targets the **mechanism** by which users discover bundle value. Get this right, and every product improvement compounds.

---

## What We Learned Building This

### 1. The Persona→App Matrix is a Hypothesis

The mapping of founder+productive→Cora is a starting hypothesis, not truth. The experiment tests whether **single-path + contextual cross-sell** beats **multi-choice + self-directed**. Matrix optimization is a follow-up experiment.

### 2. Artifacts Enable Personalization

By tracking what users actually accomplish (not just that they completed a task), we can make prompts feel genuinely helpful rather than generic.

### 3. The "Web" Between Products Matters

The cross-activation paths aren't random:
- Cora → Sparkle (attachments need organizing)
- Sparkle → Spiral (drafts need finishing)
- Spiral → Monologue (capture ideas on the go)
- Monologue → Spiral (turn voice into writing)

Each transition follows a natural workflow friction point.

### 4. Statistical Rigor Builds Confidence

The dashboard includes:
- Sample size calculator (so you know when to ship)
- Proper significance tests (z-test for proportions, Welch's t-test for continuous)
- Confidence intervals (not just p-values)
- Guardrail monitoring (do no harm)

---

## Files in This Demo

| File | Purpose |
|------|---------|
| `EXPERIMENT_SPEC.md` | Full specification with rollout plan |
| `src/lib/types.ts` | Artifact types + cross-prompt configs |
| `src/app/app/[appName]/page.tsx` | First-win tasks with artifact tracking |
| `src/app/dashboard/page.tsx` | Metrics dashboard with multi-product tracking |

---

## Summary

**The thesis**: Bundle value is discovered through workflow friction, not menus.

**The mechanism**: Surface adjacent products at moments of accomplished value.

**The metric**: Multi-product activation (because that's what drives retention).

**The implementation**: Artifact-aware contextual prompts that feel like a service, not a sell.

This isn't just "single-path onboarding." It's a fundamentally different model for how users discover that a bundle is a *system*, not a collection of tools.

---

*Built as a growth engineer application for Every (every.to)*
