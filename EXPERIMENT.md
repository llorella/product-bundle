# Demand-Driven Bundle Discovery

## The Problem

Every offers a bundle of AI tools (Spiral, Sparkle, Cora, Monologue). The typical onboarding shows users multiple products and asks them to choose.

This creates:
1. **Choice paralysis** — decisions before experiencing value
2. **Shallow exploration** — pick one, forget the rest
3. **Invisible connections** — never discover how products work together

Result: 60-80% of bundle users never try a second product.

## The Hypothesis

Bundle value isn't discovered through menus. It's discovered through **experienced friction**.

When a user finishes triaging email, they have attachments to organize. When they organize files, they find drafts to finish. Each product creates latent demand for another.

**The insight**: Surface the next product at the moment demand is highest—immediately after accomplishing something.

## The Experiment

| Variant | Flow |
|---------|------|
| **Control** | Survey → 2 app recommendations → handoff interstitial → self-directed |
| **Treatment** | Survey → 1 assigned app → guided first-win → contextual cross-sell |

### Key Mechanisms

**1. Single-Path Routing (Treatment)**
- Persona + goal → one primary app (no choice paralysis)
- "Based on your answers, start with Sparkle"

**2. Escape Hatch (Treatment)**
- Users can switch via "Not what you need?" link
- Tracks `escape_hatch_clicked` event
- High rate (>15%) signals matrix needs tuning

**3. Handoff Interstitial (Control)**
- Shows "Opening Sparkle... You'll complete setup in a new tab"
- Simulates cross-domain friction that exists in production
- Makes control more realistic

**4. Contextual Cross-Activation (Treatment)**
- Prompts reference actual accomplishments:

| After completing | Prompt |
|------------------|--------|
| Cora (email) | "You cleared 10 emails. 5 had attachments—organize them in 30 seconds." |
| Sparkle (files) | "You organized 12 files. 4 are unfinished drafts—pick one to complete." |
| Spiral (writing) | "You wrote 150 words. Capture more ideas on the go with voice notes." |
| Monologue (voice) | "You captured 4 ideas. Turn your best one into a polished draft." |

## Metrics

| Type | Metric | Why |
|------|--------|-----|
| **Primary** | Multi-Product Activation (7d) | Multi-product users retain 3-4x better |
| Secondary | First Product Activation (24h) | Validates guided first-win |
| Secondary | Time to First Value | Measures friction reduction |
| Secondary | Cross-Prompt CTR | Prompt effectiveness (treatment only) |
| Guardrail | Survey Completion | Must not decrease |
| Guardrail | First Product Activation | Must not decrease |
| Guardrail | Escape Hatch Rate | Signals misrouting (treatment only) |

## Causal Design Note

This experiment bundles three interventions:
1. Single-path routing (removes choice)
2. Guided first-win (activation scaffolding)
3. Contextual cross-activation (prompt engine)

This is intentional—validate direction quickly. If Treatment wins, follow-up tests decompose:
- **Test A**: Single-path + first-win only (no cross-prompt)
- **Test B**: Current routing + cross-prompt only
- **Test C**: Single-path only (no guided first-win)

## Why This Matters

Multi-product users retain at 3-4x the rate of single-product users. This experiment targets the *mechanism* by which users become multi-product users.

The bundle sells itself through workflow continuity, not marketing:
- **AWS**: S3 → EC2 → CloudWatch
- **Shopify**: Storefront → Payments → Shipping
- **Apple**: iPhone → iCloud → MacBook

## The Persona→App Matrix

The mapping is a **hypothesis**, not truth. The experiment tests whether single-path beats multi-choice, not whether these specific mappings are optimal.

| Persona | Productive | Automate | Write | Trends |
|---------|------------|----------|-------|--------|
| Founder | Cora | Cora | Spiral | Monologue |
| Builder | Sparkle | Sparkle | Spiral | Monologue |
| Writer | Monologue | Spiral | Spiral | Spiral |
| Designer | Sparkle | Sparkle | Spiral | Monologue |
| Curious | Monologue | Cora | Spiral | Monologue |

Matrix optimization is a follow-up experiment.
