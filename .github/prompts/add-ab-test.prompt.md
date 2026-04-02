---
agent: ask
description: "Add a PostHog A/B test to the web app. Use when: testing paywall copy, timing, layout, pricing order, button CTAs, or any UI experiment gated by a feature flag."
---

Add a PostHog A/B test to República en Llamas.

## Inputs

- **Feature flag name** (snake_case): ${input:flagName:e.g. paywall_cta_copy, paywall_timing, share_button_color}
- **What is being tested**: ${input:description:e.g. "Show paywall after turn 5 vs turn 10"}
- **Variant A name**: ${input:variantA:e.g. control}
- **Variant B name**: ${input:variantB:e.g. treatment}
- **Success metric** (which existing trackX call proves the test won): ${input:successMetric:e.g. trackPurchaseCompleted, trackShareClicked}
- **Component file** to modify: ${input:componentFile:Absolute path to the component that will branch on the flag}

## What to generate

### 1. Read the component file first

Understand its current render logic before adding any branching.

### 2. Feature flag read + $experiment_started capture

Inside the component, after existing hooks, add:
```ts
const abVariant = posthog.getFeatureFlag('${input:flagName}') ?? '${input:variantA}';

useEffect(() => {
  posthog.capture('$experiment_started', {
    experiment: '${input:flagName}',
    variant: abVariant,
  });
}, [abVariant]);
```

Never branch on `Math.random()` — always use `getFeatureFlag`.

### 3. Conditional JSX

Replace the target UI section with a variant switch:
```tsx
{abVariant === '${input:variantB}' ? (
  /* VARIANT B — new experience */
  <TreatmentComponent />
) : (
  /* VARIANT A — control (existing behavior) */
  <ControlComponent />
)}
```

Keep the control branch identical to the pre-test code — no refactoring.

### 4. Update the relevant track call

If the test is paywall-related, update `trackPaywallShown` to include the variant:
```ts
trackPaywallShown({ ab_variant: abVariant });
```

Check `apps/web/src/lib/analytics.ts` to confirm the function signature accepts extra properties before adding them.

### 5. PostHog dashboard reminder (output as a comment in the PR)

> **PostHog setup required:**
> 1. Create feature flag `${input:flagName}` in PostHog → multi-variate, variants: `${input:variantA}` / `${input:variantB}`
> 2. Rollout: 50% / 50% — **never test 100% of users**
> 3. Goal metric: `${input:successMetric}` event count, min 100 users per variant before reading results
> 4. Secondary guardrail: make sure `turn_completed` rate doesn't drop in treatment — a win that hurts retention is not a win

## Rules

- Test **one variable** at a time. If the description mentions multiple changes, split into separate tests.
- Do NOT read `localStorage` or `Math.random()` for bucketing.
- Do NOT hardcode variant strings more than once; assign `abVariant` once and reuse.
- Imports needed: `import posthog from 'posthog-js'` and `import { useEffect } from 'react'` (check if already present).
