# Every.to Funnel Audit

**Auditor**: Growth Engineer Candidate
**Date**: January 13, 2026
**Last Verified**: January 15, 2026 (flow unchanged)

---

## Landing Page + Conversion Pathways

**URL**: `https://every.to`

### Primary CTAs (Logged-out State)

| CTA | Location | Destination | Purpose |
|-----|----------|-------------|---------|
| **Subscribe** | Top nav, Hero | `/subscribe?source=top_nav` | Primary conversion |
| **Sign in** | Top nav | `/login` | Existing users |
| **Read** | Hero grid | `/newsletter?utm_source=every_website_hero` | Content entry |
| **Email** | Hero grid | `cora.computer?utm_source=every_website_hero` | Cora product |
| **Speak** | Hero grid | `monologue.to?utm_source=every_website_hero` | Monologue product |
| **Listen** | Hero grid | `/podcast?utm_source=every_website_hero` | Podcast content |
| **Write** | Hero grid | `writewithspiral.com?utm_source=every_website_hero` | Spiral product |
| **Organize** | Hero grid | `makeitsparkle.co?utm_source=every_website_hero` | Sparkle product |

### Secondary CTAs

- **Products section**: "Built by Every" → `/studio`
- **Consulting**: "Stop Planning Your AI Strategy" → `/consulting`
- **Newsletter signup**: Footer email capture
- **Cursor Camp**: Promotional banner → `/courses/cursor-camp`

### Logged-in State Differences

When authenticated, users see:
- Account dropdown with email
- **"Explore your subscription" checklist widget** (floating bottom-right)
- Progress indicator: "0 of 10 completed"
- "Upgrade to paid (25% off)" CTA in checklist

### Value Messaging

- Hero: "The Only Subscription You Need to Stay at the Edge of AI"
- Subhead: "Trusted by 100,000 builders"
- Bundle benefits list:
  - Reviews of new AI models on release day
  - Playbooks for integrating AI into your work
  - Insights from top operators and innovators
  - AI productivity apps: Monologue, Sparkle, Spiral, Cora

---

## Signup + Survey + Recommendations

### Step 1: Account Creation

**URL**: `https://every.to/subscribe`

**Page Content**:
- "Special offer: 30-day free trial for all new subscribers"
- "1. Create your free account"
- Email input + "Sign up" button
- Social proof: "Join 100,000+ founders, operators, and investors"

### Step 2: Plan Selection

**Confirmation shown**: "✓ 1. Account: [email]" with Edit link

**Plan Toggle**: Free | Paid

**Paid Options**:
| Plan | Price | Details |
|------|-------|---------|
| Annual | $24/mo | $288/year after 30-day trial, "free trial + $72 off" |
| Monthly | $30/mo | After 30-day trial |

**Free Option**:
| Plan | Price | Details |
|------|-------|---------|
| Free | $0 | "Limited access to content and apps" |

**CTA**: "Continue with limited access" (free) or "Continue with a free trial" (paid)

**Note**: "Between jobs? Get 3 months of Every on us and keep learning. Email us at hello@every.to"

### Step 3: Onboarding Entry

**URL**: `https://every.to/subscribe/onboarding`

**Page Content**:
- "Welcome to the EVERY Universe"
- "Answer a couple of questions to get started with personalized AI productivity apps."
- **Primary CTA**: "Complete your subscription"
- **Skip option**: "Skip and go to homepage"

### Survey Question 1 of 3: Persona

**Question**: "What describes you best?"
**Instruction**: "Select one role that fits most."
**Required**: No (Skip available)

**Options** (single-select radio):
1. Founder/entrepreneur/investor
2. Builder/engineer
3. Writer/creator
4. Designer
5. Just curious about AI

### Survey Question 2 of 3: Goal

**Question**: "What is your goal with AI?"
**Instruction**: "Select one goal that is most important to you."
**Required**: No (Skip available)

**Options** (single-select radio):
1. Be more productive
2. Automate workflows
3. Write with more confidence
4. Stay ahead of AI trends

### Survey Question 3 of 3: Recommendations (Output Screen)

**Header**: "Based on your goal with AI"
**Subhead**: "We've selected the best AI tools for you. Get started with a free trial."

**For Builder/engineer + Automate workflows**:
1. **Sparkle** - "Turn messy folders into organization bliss. Sparkle organizes your computer so you don't have to."
   - URL: `https://makeitsparkle.co/?utm_source=everywebsite&utm_campaign=onboarding`
2. **Cora** - "An AI email assistant that gets you to inbox zero on autopilot. Cora is the most human way to manage your email."
   - URL: `https://cora.computer/?utm_source=everywebsite&utm_campaign=onboarding`

**Alternative CTA**: "or Explore the full Every bundle" → `/subscribe/explore`

**Observation**: Survey recommends 2 apps. User must choose which to try first or explore all.

---

## Activation Surfaces and Retention Scaffolding

### Bundle Exploration Page

**URL**: `https://every.to/subscribe/explore`

**Header**: "Welcome to the EVERY Universe"
**Progress**: "Explore your subscription" — "0 of 10 completed"

### Checklist Items (10 total)

| # | Category | Item | URL | UTM |
|---|----------|------|-----|-----|
| 1 | Content | Read an article | `/p/[recent-article]` (dynamic) | `utm_source=onboarding_checklist` |
| 2 | Commerce | Buy our exclusive merch | `/store` | `utm_source=onboarding_checklist` |
| 3 | Community | Join our subscriber-only Discord | `/community/join` | `utm_source=onboarding_checklist` |
| 4 | Content | Listen to the 'AI and I' podcast | `/podcast` | `utm_source=onboarding_checklist` |
| 5 | **Product** | Get to inbox zero with Cora | `cora.computer` | `utm_source=onboarding_checklist` |
| 6 | **Product** | Use Sparkle to organize your Mac | `makeitsparkle.co` | `utm_source=onboarding_checklist` |
| 7 | **Product** | Use Spiral to write with AI | `writewithspiral.com` | `utm_source=onboarding_checklist` |
| 8 | **Product** | Use Monologue for voice dictation | `monologue.to` | `utm_source=onboarding_checklist` |
| 9 | Expansion | Create a team | `/teams/new` | `utm_source=onboarding_checklist` |
| 10 | Expansion | Refer a friend and get paid | `every.getrewardful.com/signup` | `utm_source=onboarding_checklist` |

**CTA at bottom**: "Go to homepage"

### Homepage Checklist Widget (Logged-in)

Floating bottom-right widget showing:
- "Explore your subscription"
- "0 of 10 completed"
- Same 10 items as above
- "Upgrade to paid (25% off)" CTA

### Guest Checklist Widget

For logged-out visitors:
- Title: "Explore THE EVERY UNIVERSE"
- Same items but with different CTAs for gated content
- "Create your free account" CTA at bottom

### Retention Mechanics Observed

| Mechanic | Present | Notes |
|----------|---------|-------|
| Progress tracking | Yes | "0 of 10 completed" |
| Checklist gamification | Yes | Visual checkmarks |
| Bundle cross-sell | Yes | Products mixed with content |
| Community hooks | Yes | Discord, referral |
| Content hooks | Yes | Article, podcast |
| Habit loops | No | No streaks, reminders |
| In-app first win | No | No guided task |
| Cross-activation prompts | No | No contextual suggestions |

---

## Deep Link Mechanics and Routing

### URL Patterns

| Page | URL Pattern | Notes |
|------|-------------|-------|
| Landing | `every.to/` | Content hub |
| Subscribe | `every.to/subscribe` | Conversion flow |
| Login | `every.to/login` | Redirects to home (magic link auth) |
| Onboarding | `every.to/subscribe/onboarding` | Survey flow |
| Bundle Explore | `every.to/subscribe/explore` | Checklist page |
| Account | `every.to/account` | User settings |

### Product Domains

| Product | Domain | Distribution |
|---------|--------|--------------|
| Cora | `cora.computer` | Web app |
| Sparkle | `makeitsparkle.co` | Mac app (downloads .dmg) |
| Spiral | `writewithspiral.com` | Web app |
| Monologue | `monologue.to` | Mac app |

### UTM Parameters Observed

| Parameter | Values | Usage |
|-----------|--------|-------|
| `utm_source` | `everywebsite`, `every_website_hero`, `onboarding_checklist`, `explore_checklist_guest` | Source tracking |
| `utm_campaign` | `onboarding` | Campaign tracking |
| `utm_content` | `subscribe` | CTA variant |
| `source` | `top_nav` | Internal source |

### Cross-Domain Considerations

- Products are on separate domains with independent auth systems
- No visible SSO or session sharing
- Checklist completion likely tracked by cookie/localStorage on every.to
- Product activation must be tracked by each product independently

---

## Verification Log

| Date | Verified By | Notes |
|------|-------------|-------|
| Jan 15, 2026 | Automated audit | Full flow tested: signup → free plan → survey (Builder + Automate workflows) → recommendations (Sparkle + Cora confirmed) → bundle checklist. All URLs, UTMs, and UI copy match documentation. Article URL in checklist is dynamic (serves recent content). |
