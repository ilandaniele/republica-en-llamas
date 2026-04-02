---
applyTo: "apps/web/src/lib/analytics.ts, apps/web/src/components/PaywallModal.tsx, apps/web/src/components/BuyButton.tsx, apps/web/src/hooks/useEntitlements.ts, apps/web/src/screens/GameOverScreen.tsx"
---

# Analytics & Monetization — Contributor Instructions

## Rule: Never call `posthog.capture()` directly in components

All tracking goes through typed wrapper functions in `apps/web/src/lib/analytics.ts`. If the event you need doesn't exist, add a new typed function there first.

## Existing Track Functions

```ts
trackGameStarted({ difficulty, president, mode })
trackTurnCompleted({ turn_number, event_category, choice_index })
trackGameOver({ turns_survived, reason, score, difficulty, president })
trackPaywallShown({ entitlement, trigger_point })
trackPurchaseStarted({ entitlement, price })
trackPurchaseCompleted({ entitlement, price, platform })
trackShareClicked({ share_type })   // 'score' | 'game_over' | 'image'
trackAdShown({ placement })
trackAdRewarded({ placement })
trackCongressSession({ law, turn })
trackCrisisTriggered({ crisis_type, turn })
```

## A/B Tests with PostHog Feature Flags

```ts
// ✅ correct
const variant = posthog.getFeatureFlag('paywall_timing');
// variant is 'early' | 'late' | 'gameover_only' | undefined

useEffect(() => {
  if (variant) {
    posthog.capture('$experiment_started', {
      experiment: 'paywall_timing',
      variant,
    });
  }
}, [variant]);

// ❌ wrong — never branch UX on Math.random()
if (Math.random() > 0.5) { ... }
```

Always fire `$experiment_started` on component mount when a flag is read. Test one variable per flag. Minimum 100 users per variant before declaring a winner.

## Paywall UI Rules

- Always show `full_access` product first and visually largest — anchoring effect
- Pricing order guideline: `full_access ($5.99)` → `presidents_pack ($2.99)` → individual packs ($1.99)
- The `ENTITLEMENT_PRODUCTS` record in `packages/game-engine/src/entitlements.ts` is the source of truth for prices and `stripePriceId`

## KPIs to Keep Instrumented

| Metric | How it's tracked |
|---|---|
| D1/D7 retention | PostHog session → `game_started` events by cohort |
| Paywall conversion | `paywall_shown` → `purchase_completed` funnel |
| Share rate | `game_over` → `share_clicked` funnel |
| Ad fill / reward | `ad_shown` / `ad_rewarded` events |
| Crisis encounter rate | `crisis_triggered` events |

## Share Viral Text Format

Used in `GameOverScreen.tsx`. The canonical viral copy is:

```
Bajo el gobierno de {presidentName}, Argentina sobrevivió {turn} turnos
antes de colapsar por {reasonLabel}. La inflación llegó al {inflation}%.
{anibalLine ? `El Gordo Aníbal lo resumió mejor: "{anibalLine}"` : ''}
Puntaje: {score} | Dificultad: {difficulty}
¡Jugá República en Llamas!
```

When adding a new share channel, append to the existing share buttons block in `GameOverScreen.tsx` and call `trackShareClicked({ share_type: '<channel>' })`.
