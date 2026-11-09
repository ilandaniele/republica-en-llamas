# Intermediate review during changes

Native /security-review ran on 2026-11-08 in read-only mode. Files were being edited at that time; controls not wired yet were checked later with real-handler tests. This is not the final report or the claude-security plugin pipeline.

# Security review: `feat/casa-rosada-diorama` working tree

**No vulnerabilities found at confidence ≥ 8.**

## What I checked
- **Edge functions:** `_shared/http.ts`, `_shared/requestPolicy.ts`, `_shared/rateLimit.ts`, `submit-run`, `start-run`, `claim-run-ticket`, `create-checkout` and `stripe-webhook`.
- **Engine logic used by the server:** `entitlements.ts`, `runValidation.ts`, `run.ts` and `presidents.ts`.
- **Web client:** `AuthProvider.tsx`, `supabase.ts`, `authStorage.ts`, `checkout.ts`, `BuyButton.tsx`, `runTicket.ts`, `playtest.ts`, `useEntitlements.ts`, `LoginScreen.tsx`, `ShareSection.tsx` and `useSaveRun.ts`.
- **Config and tooling:** `nginx.conf`, `index.html`, `deploy.yml` and `scripts/security/static-server.mjs`.
- I also searched `apps/web/src` for `dangerouslySetInnerHTML`, `innerHTML`, `eval` and `new Function`. There were no matches.

I did not read `.env` files or credential stores, did not contact any backend, and edited nothing. The required sub-agent tool was not available, so I did the review and false-positive filtering in one pass.

## Confirmed findings
None.

## Speculative items (below the reporting bar or outside the scope)
1. **Unused mode-entitlement check:** `supabase/functions/_shared/requestPolicy.ts:68` defines `canUseRunModes`, but nothing calls it.
   - As a result, `submit-run/index.ts:41-77` accepts `crisisExpress` and `scenarioId` without checking that the user owns those modes.
   - The old code did not check this either, so the change did not introduce it. It is not reported.
   - If paid-mode leaderboard scores matter, call it after the ticket lookup, using the same `user_entitlements` query.
2. **`submit-run` skips the new protections:** it does not use the new `requestGuard`, rate limit or `readJsonBody` (`submit-run/index.ts:32-39`). This falls under the rate-limit/DoS exclusion, so it is not reported.
3. **Requests with no `Origin` header pass `requestGuard`:** see `requestPolicy.ts:8`. This is not a CSRF risk, because auth is a bearer token, not a cookie, and the CORS header is only sent back for allowed origins.

## New controls that work correctly
- **President purchase check:** `submit-run/index.ts:53-68` checks `user_entitlements` on the server. `isRunConfig` rejects unknown president IDs, and aliases resolve through `canonicalPresident` (`presidents.ts:10-11`, `:45-47`).
- **CORS:** the server no longer falls back to `WEB_URL` or allows any `localhost:` origin. Only listed origins are echoed back (`http.ts:16-26`).
- **Anonymous checkout blocked:** `create-checkout` now rejects anonymous users, and `Object.hasOwn` stops lookups of inherited object keys.
- **Stripe webhook:** it now requires a signature header, a configured secret, a UUID `userId`, and a body under a size limit.
- **Checkout redirect:** the client only redirects to URLs on `https://checkout.stripe.com/c/pay/` (`checkout.ts:4-20`).
- **Playtest mode:** it only turns on in dev builds (`playtest.ts:1`), so the paywall bypass it gives does not ship to production.
- **Logs:** error objects are no longer logged in the changed functions, which reduces data in logs.
- **Local file server:** `static-server.mjs` rejects paths outside its folder (`insideRoot`) and listens on `127.0.0.1` only.
