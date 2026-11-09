# Security review: `feat/casa-rosada-diorama` working tree

**No confirmed vulnerabilities at High or Medium severity, and none at confidence 8 or above.**

## Scope

- **Changed files:** 133 tracked files (`git diff HEAD`), plus the untracked source files: `supabase/functions/_shared/{requestPolicy,rateLimit}.ts`, `supabase/migrations/010_api_security.sql`, `supabase/config.toml`, `packages/game-engine/src/{runValidation,presidents,career,…}.ts`, `apps/web/src/lib/{authStorage,checkout,browserStorage,playtest}.ts`, `PasswordResetScreen.tsx`, `ErrorBoundary.tsx` and `scripts/security/*`.
- **Not done:** I did not read `.env` files or credential stores, did not contact any backend, and did not run STRIX or the claude-security plugin.
- **Method:** I could not start sub-agents in this environment, so a single pass did both the vulnerability analysis and the false-positive filtering. The review was static (code reading only); I did not run tests.

## What I checked and found safe

**Edge functions (`submit-run`, `start-run`, `claim-run-ticket`, `create-checkout`, `stripe-webhook`):**
- Each one goes through `requestGuard`: an origin allow-list (no wildcard, and no more blanket `localhost` matching), POST only, a body-size cap, `application/json` only, and a strict bearer-token regex.
- `create-checkout`:
  - Now rejects anonymous users.
  - Looks up the price with `Object.hasOwn`, so prototype keys can't be used as entitlements.
  - The Stripe `metadata.userId` comes from the verified token, not from the request body.
- `stripe-webhook`:
  - Requires a signature and a configured webhook secret.
  - Caps the body size.
  - Checks that `userId` is a valid UUID.
- `submit-run`:
  - Validates the config and decisions with `isRunConfig`/`isTurnDecision`, using allow-lists for scenario, president, difficulty and congress actions.
  - Checks the ticket against both user and seed.
  - Checks paid presidents and modes against `user_entitlements` on the server.
  - Rejects career runs.
  - Takes the score from the server-side replay, not from the client.

**Migration `010_api_security.sql`:**
- All three new `security definer` functions set `search_path = ''`.
- `revoke … from public, anon, authenticated` with grants only to `service_role`.
- `api_rate_limits` has RLS on and all grants revoked.
- `save_validated_run` locks the ticket row and scopes the duplicate lookup to `p_user_id`, so it can't return another user's run.

**Rate limiting:** the IP is only used when the `TRUSTED_CLIENT_IP_HEADER` env var is set, and keys are hashed. A client-supplied `X-Forwarded-For` is never trusted.

**`supabase/config.toml`:** `verify_jwt = true` on every user endpoint. Only the webhook sets it to `false`, which is correct because it uses Stripe's signature instead.

**Web client:**
- `checkoutUrl()` only accepts URLs on `https://checkout.stripe.com/c/pay/…`, which closes off redirects to other sites through the checkout response.
- The password reset `redirectTo` is built from `window.location.origin`, so an attacker can't choose where the reset link points.
- The reset form only appears after the Supabase SDK reports a `PASSWORD_RECOVERY` event. After a successful update it signs out all sessions (global scope).
- `translateAuthError` no longer shows raw backend messages to users.
- On user change, private query-cache entries are cleared.
- Server error logs no longer include the full error objects.
- There is no `dangerouslySetInnerHTML`, `innerHTML` or `eval` anywhere in `apps/web/src`.

**nginx:** headers were only added (`limit_except`, `server_tokens off`, `Permissions-Policy`); none were removed.

**Playtest mode:** `isPlaytestMode` requires `import.meta.env.DEV`, so it is compiled out of production builds.

## Lower-confidence items (none confirmed exploitable, all below the reporting bar)

1. **`isAllowedOrigin` accepts requests with no `Origin` header** (`supabase/functions/_shared/requestPolicy.ts:11`). Non-browser clients can therefore call the functions. This is not a real bypass, because every endpoint still needs a valid JWT (or a Stripe signature). Confidence 2/10.
2. **Price lookup depends on the deployed engine bundle** (`submit-run/index.ts:1-8`). The function imports `canPlayPresident`/`isFree` from the generated `_shared/game-engine.js`. If that file is stale when deployed, the import fails and the function stops working (availability, not an access bypass). `deploy:submit-run` already runs `bundle:engine` first. Confidence 2/10.
3. **"Remember me" off still writes a flag to localStorage** (`authStorage.ts:28`). Only the `rel-remember-session` true/false preference goes there. The session tokens themselves go to sessionStorage. No secret is exposed. Confidence 1/10.
4. **CSP is still report-only** (`nginx.conf`). This is a missing hardening step from before this branch, not a new flaw. The CSP still allows `fonts.googleapis.com`/`fonts.gstatic.com` even though fonts are now self-hosted. That is harmless, but those two entries can be removed. Not a vulnerability.
