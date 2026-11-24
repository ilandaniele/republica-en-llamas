# Test report — Phase 7 (2026-11-17)

Branch `feat/cloudflare-migration`. All results are **local**: `wrangler dev` / workerd with local D1 (miniflare), node 24, Windows. They do not prove remote configuration, Workers CPU accounting or edge behaviour.

## Summary

| Layer | Command | Result |
|---|---|---|
| Engine unit | `npm test --workspace=packages/game-engine` | 257 pass |
| Web unit | `npm test --workspace=apps/web` | 681 pass |
| API unit (node:sqlite D1 fake) | `npm test --workspace=apps/api` | 86 pass |
| API integration (workerd + real D1 migrations) | `npm run test:integration --workspace=apps/api` | 27 pass, 3/3 runs green |
| E2E Playwright (Edge desktop + Pixel 7 emulation) | `npm run test:e2e --workspace=apps/web` | 28 pass (8 are expected failures, B1), 3/3 runs green |
| Coverage (v8) | `npm run test:coverage` | lines: engine 91.1%, api 93.8%, web 69.5% |
| Pen test (curl, loopback only) | `BASE=http://localhost:8789 bash scripts/security/pentest-local.sh` | 93 pass, 0 fail |
| k6 spike / soak (local API) | `node scripts/security/run-api-load.mjs spike\|soak` | all thresholds pass, 0 errors |

## Integration tests (`apps/api/src/__integration__/`)

Run in workerd through `SELF.fetch` with `applyD1Migrations`. Global `fetch` is a throwing spy, so Stripe/network is never reached. Covered: health, guest sign-in, email sign-up/sign-in/sign-out, profile and username, valid replay accepted and idempotent, tampered replays rejected, daily cap, cross-user ticket and runs isolation, leaderboard, origin checks, body limits, IP rate limit, checkout without Stripe, webhook signatures, scheduled cleanup.

Note: the workerd bundled with `@cloudflare/vitest-pool-workers@0.23.0` supports compat dates up to `2026-08-22`, so the integration config overrides `compatibilityDate` (production uses `2026-11-09`). The package is deprecated in favour of `@cloudflare/vitest-plugin`; migrating is a dependency change, not done.

## E2E (`apps/web/e2e/`)

`webServer` (`e2e/server.ts`) builds web if needed, wipes and migrates a local D1, starts `wrangler dev` on 8788 with test-only vars. Flows: landing without console errors, a11y smoke, guest plays a full run, register from game over and save (submit-run 2xx, leaderboard contains user), register/logout/login, profile rename, wrong password, navigation and back button on mobile.

Not covered: Google OAuth, password reset email, Safari/WebKit, real devices, CI.

## Coverage gaps (lines)

`ProfileScreen`, `ProfileHeader`, `HistoryScreen` 0%; engine `anibal.ts`, `postMortem.ts` 0%; `ScenarioCard` 5%; `GameOverScreen` 9%; `useUsernameAvailability` 13%; `LoginScreen` 28%; `payments.ts` 82%. No thresholds set.

## Pen test

Security headers, CORS/origin, 401 on protected routes, IDOR between two users, 413 limits, bad JSON, 404/405, auth path guard, SQL-injection strings, tampered and replayed runs, 429 (IP, sign-in, start-run, daily cap), webhook signatures, open redirect (`callbackURL` 403), cookie flags (`HttpOnly; SameSite=Lax`; `Secure` only verifiable over https). Valid-signature checkout grant not exercised.

## Load (k6, local)

| Run | Duration / VUs | Requests | p50 | p95 | p99 | Failed | 429 share |
|---|---|---|---|---|---|---|---|
| spike, per-VU IP | 150 s / 24 | 1546 | 8.5 ms | 19.2 ms | 44.1 ms | 0% | 15.5% |
| soak, per-VU IP | 600 s / 4 | 2373 | 8.9 ms | 25.4 ms | 48.0 ms | 0% | 19.6% |

429s are the guest daily ticket cap. No latency drift over 10 min. Local `CF-Connecting-IP` is client-settable; Cloudflare overwrites it in production.

**D1 writes (code/schema estimate):** ~134 rows per played run (40 `run_events` × table + 2 indexes, plus limiter upserts). Free plan 100k writes/day ≈ 740 runs/day. Every IP-limited GET costs 1 write.

## Performance

- Server replay of a 40-decision run: p50 2.2 ms, cold 5.1 ms CPU (node). Fits Workers Free 10 ms. ~55% of it is `ALL_CARDS.filter` per draw (`packages/game-engine/src/events/index.ts:199`).
- Better Auth scrypt: hash 54 ms, verify 52 ms CPU (node). See F1.
- Web initial JS 680 kB raw / 189 kB gzip. Largest initial chunks: vendor-react 258 kB, card data `events` 156 kB + `presidentExpansion` 72 kB. posthog (344 kB) and html2canvas (199 kB) are lazy.

## Findings

| ID | Severity | Location | Issue | Suggested fix |
|---|---|---|---|---|
| F1 | High | `apps/api/src/auth.ts:46` | Email sign-up/sign-in/reset use scrypt (~55 ms CPU). Workers Free limit is 10 ms, so they likely fail in production on Free (same as F-04 in `docs/security-report.md`). Guest play is unaffected. | Workers Paid, or WebCrypto PBKDF2 `password.hash/verify`. Confirm on a staging Worker. |
| F2 | Medium | `apps/api/src/index.ts:57`, `apps/web/src/app/AuthProvider.tsx:16` | All `/api/auth/*` share one 120/min IP bucket, including `get-session`. A 429 on `get-session` makes the UI treat a signed-in user as guest; the run cannot be saved until reload. Likely behind CGNAT. | Exempt or separate `get-session`; keep previous auth state or retry on session error. |
| F3 | Medium | `apps/web/src/` screens | No `<main>` landmark on Home, Leaderboard, Login, Register. | Wrap route outlet in `<main>`; drop `test.fail` in `e2e/home.spec.ts`. |
| F4 | Medium (cost) | `apps/api/src/routes/runs.ts:67`, `rateLimit.ts:20` | ~134 D1 writes per run; IP limiter writes on every GET. | Store decisions as one JSON column; rate limit cheap GETs outside D1. |
| F5 | Low | `apps/api/src/routes/leaderboard.ts:39` | `Cache-Control: public, max-age=30` plus persisted query keeps leaderboard stale 30–90 s after saving. | `no-cache` / `s-maxage` only; refetch after save. |
| F6 | Low | `ProfileHeader.tsx:46,98` | Edit button named only "✎"; username input unlabeled; profile has no h1. | Add `aria-label`s and an h1. |
| F7 | Low | `apps/web/public/_headers:7` | CSP `style-src 'unsafe-inline'`. | Fixed 2026-11-24: `style-src 'self'` (see handoff). |
| F8 | Info | `apps/api/src/http.ts:83` | Writes without `Origin` header accepted (mitigated by `SameSite=Lax`). | Optionally require `Origin` on cookie-authenticated writes. |

No product code was changed in this phase.

## Fix status (2026-11-17, after this report)

| ID | Status |
|---|---|
| F1 | Fixed: PBKDF2-SHA256 50k iterations (~6 ms CPU, node), legacy scrypt still verifies. Confirm on the deployed Worker. |
| F2 | Fixed: separate `auth-session` bucket; web keeps last known user on session errors. |
| F3 | Fixed: single `<main>` in `App.tsx`; e2e 28/28 without expected failures. |
| F4 | Deferred: acceptable for a small test group on Free. |
| F5 | Fixed: `no-cache` on the server and in the web fetch. |
| F6 | Fixed: `aria-label`s and sr-only h1. |
| F7, F8 | Deferred. |
