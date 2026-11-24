# Security, cost and QA review: consolidated report

- **Date:** 2026-11-17
- **Branch:** `feat/cloudflare-migration`
- **Scope:** local only. The review combined a static review, a local `wrangler dev` pentest (miniflare D1) and a playtest browser run. Nothing remote was verified, including the plan, secrets, headers, D1 billing and logs. The Cloudflare plan (Free or Paid) is unknown. Cost and CPU severities assume Free where noted.
- **Reviewers (13):** security-review (SR), security-auditor (SA-0n, two digits), architect-reviewer (ARCH), code-reviewer (CR), security-engineer (SE), error-detective (ED), vibesec (V), sre-engineer (SRE), database-administrator (DBA), qa-expert (QA), accessibility-tester (A11Y), penetration-tester (PT), security-audit (SA-n, one digit).
- **Excluded as already known or accepted:**
  - SEC-023 (confusable usernames), SEC-024 (sign-up enumeration) and SEC-025 (`tar`).
  - Origin-less requests are allowed.
  - Stripe refunds and async payment events are not handled.
  - The Cache API is a no-op on `workers.dev`.
  - Rate-limit keys use the full IPv6 address, so rotating a /64 gets new buckets.
  - The leaderboard returns `user_id`.
  - The CSP and the username and password rules are each defined twice.

  These are tracked in `docs/security/hardening-2026-11-11.md` and `security_best_practices_report.md`.

## Summary

| Severity | Count |
| --- | --- |
| High | 10 (F-04 is high only on Workers Free) |
| Medium | 25 |
| Low | 32 |
| Info | 9 |
| **Total** | **76** (merged from about 190 source items) |

The main risk is availability and cost on the Free plan, not data exposure. Every `/api` request runs Better Auth schema checks (F-01) and writes a D1 rate-limit row (F-02). Either one can use up a daily D1 quota under modest traffic. After that, auth and the leaderboard return 503. The payment path and Better Auth's Origin check are also untested (F-05, F-06).

Paths are relative to `apps/api/src/` unless they start with `apps/`, `packages/`, `.github/` or `node_modules/`.

## Findings

### High

| ID | Area | file:line | Issue | Evidence | Fix | Sources |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | cost-availability | `index.ts:43`, `auth.ts:18` | Better Auth is built on every request. Each `/api` call runs 12 schema-check statements (`sqlite_master` + 11 `pragma`). | About 120 rows are read per request, so about 41k requests/day use up the Free quota (5M rows read/day). If a secret is missing, public routes and the webhook also return 503. | Cache the auth instance per isolate (module level), or build it lazily, only on the routes that need it. | SRE-01, ARCH-06, ED-09 |
| F-02 | cost-availability | `rateLimit.ts:15-28`, `index.ts:44-46,54` | The IP limiter upserts a D1 row on every request, 429s included. Each distinct `/api/auth/<path>` adds a row keyed on a path the client chooses. | One client at 120/min writes 172,800 rows/day. That exceeds the Free quota of 100k writes/day. After that the limiter fails closed, and the leaderboard and auth return 503. | Use the Workers Rate Limiting binding. Interim: skip the write once over the limit (`where request_count <= ?3 or window_start <> excluded.window_start`). Fail open on GETs. Cap the path key and use one `auth` bucket. | SRE-02, DBA-02, SA-1 |
| F-03 | cost-availability | `routes/leaderboard.ts:19-23`, `apps/api/migrations/0001_init.sql:50` | The predicate `(?1 is null or r.difficulty = ?1)` stops SQLite from using the score index. | Measured `rows_read`: 4,020 instead of 41. | Use two prepared statements. No migration is needed. | DBA-01, SRE-05, ARCH-10 |
| F-04 | cost-availability | `auth.ts:26-31` | scrypt password hashing exceeds the Free CPU limit. **High only on Workers Free.** | 73-105 ms CPU per hash against a 10 ms limit (error 1102). `wrangler dev` does not enforce CPU limits. | Owner chooses: Workers Paid, or PBKDF2 with rehash on login. | SRE-03 |
| F-05 | tests | `node_modules/better-auth/dist/context/create-context.mjs:211`, `__tests__/api.test.ts` | Under Vitest, Better Auth skips its Origin and redirect checks, so the tests never exercise them. | A probe returned 200 for a foreign `redirectTo` and a foreign Origin under test. Production mode returns 403. | Set `advanced.disableOriginCheck: false` explicitly, or unset `TEST`/`NODE_ENV` in the test setup. Add 403 tests. | QA-01, V-1, SR-3 |
| F-06 | tests | `routes/payments.ts:21-93` | No tests cover checkout or the webhook. | No test references these routes. | Add tests with payloads signed by `generateTestHeaderStringAsync`. Cover a bad signature, a grant, a duplicate and an unknown user. | QA-02, SA-11 |
| F-07 | tests | `index.ts:35-40` | No test checks that private routes return 401 without a session. | Router review. | Add a table test over every private route. | QA-03 |
| F-08 | tests | repo | There is no browser E2E test for sign-up, play, submit and purchase. | No Playwright config. | Add a Playwright smoke test. It is a new dependency, so ask first. | QA-04 |
| F-09 | a11y | `apps/web/src/features/game/TurnTransitionScreen.tsx:73-77` | A `window` keydown handler takes over Enter and Space for every focused control. | Keyboard playtest. | Scope the handler to the screen, and ignore events from interactive targets. | A11Y-01 |
| F-10 | a11y | `PaywallModal.tsx:44`, `TutorialOverlay.tsx:53`, `TurnTransitionScreen.tsx:87`, `DecisionDiary.tsx:108-122`, `LogoutModal.tsx:17` | Five overlays are not real dialogs. They have no `role="dialog"`, no `aria-modal`, no focus trap, no Escape handling and no focus restore. | Static review and playtest. | Build one shared `Modal` in `components/` and use it for all five. | A11Y-02 |

### Medium

| ID | Area | file:line | Issue | Evidence | Fix | Sources |
| --- | --- | --- | --- | --- | --- | --- |
| F-11 | security | `policy.ts:1-7`, `packages/game-engine/src/constants.ts:237,254,271`, `routes/runs.ts:46-52` | `mode_historical` unlocks scenarios declared `full_access`. Crisis difficulty with a free president needs no entitlement. | Source read. The paywall at `HomeScreen.tsx:554` sells `mode_historical`. | Owner picks the tier. Then add one `canStartRun` in the engine's `entitlements.ts`, used by web and API, plus a 403 test. | ARCH-01, SA-2, PT-09 |
| F-12 | security | `auth.ts:26-31` | There is no email verification. Throwaway accounts multiply the daily ticket cap. Registering someone else's email first blocks that person's Google sign-in. | A probe got 6 tickets from 2 accounts. | Add `emailVerification` with `requireEmailVerification` once F-32 is done. Alternative: Turnstile on sign-up. | SA-01, V-2, V-5, CR-11, ARCH-13, SA-10 |
| F-13 | security | `.github/workflows/deploy.yml:59-62,71-72` | The Cloudflare token and account ID are set as job-level env. Install scripts run by `npm ci` and the Vite build can read them. | Workflow read. | Set them as step-level env on the migrate and deploy steps only. | SE-02, SA-4 |
| F-14 | security | `auth.ts` (Better Auth origin check) | Cookieless POSTs to sign-in, anonymous sign-in and `request-password-reset` accept a foreign `Origin`. | Pentest. The attacker cannot read the response, but can trigger reset emails and guest rows. | Call `assertAllowedOrigin` on non-GET `/api/auth/*` before `auth.handler`. Add a 403 test. | PT-04, V-9, QA-16 |
| F-15 | cost-availability | `auth.ts:46-48`, `cleanup.ts:10-15` | Anonymous sign-in creates a user and a session row on each call. Each guest can also draw 3 tickets. | About 26k guests per IP per day at the default 3 per 10 s. | Add a stricter `customRules` entry for `/sign-in/anonymous`. Shorten guest sessions. | SA-8, SA-09 |
| F-16 | cost-availability | `routes/runs.ts:70-75,104-126` | Saving a run writes about 150 rows. `final_state` and `decisions` are never selected. | Only about 650-750 runs/day fit in the Free write quota. | Owner picks the schema: history from `final_state` via `json_each`, or insert only the 10 events that are read. Needs a new migration. | SRE-06, DBA-03, DBA-09 |
| F-17 | cost-availability | `apps/api/wrangler.jsonc:13` | `run_worker_first` covers `/assets/*`, so every asset is a Worker invocation. | At least 8 invocations per first visit, against a quota of 100k requests/day. | Owner decides whether to drop `/assets/*` and rely on `_headers`. | SRE-04 |
| F-18 | cost-availability | `routes/runs.ts` (submit-run replay) | submit-run replay comes close to the Free CPU limit. Depends on the plan. | Replay takes 4-6 ms against the 10 ms limit, with `MAX_RUN_DECISIONS=200`. | Lower the cap to the real maximum number of turns, then measure. | SRE-07 |
| F-19 | correctness | `routes/payments.ts:11-14,21-41`, `apps/web/src/hooks/useEntitlements.ts:55-60`, `apps/web/src/App.tsx:53-69` | A user can be charged twice for the same entitlement. `GRANT_SQL` overwrites `stripe_session_id`. A failed entitlements GET is cached as `[]` for 5 minutes, so the "No se pudo verificar" branch never runs. After purchase the client refetches once and never polls. | Source read. | Return 409 if the user already owns the entitlement or `full_access`. Use `on conflict do nothing`. Let `queryFn` throw. Poll after the purchase. | CR-01, SA-02, V-4, ED-05, CR-10 |
| F-20 | correctness | `routes/payments.ts:52-65` | When a paid session cannot be granted (unknown user), the webhook returns 200 and logs nothing. A duplicate `stripe_session_id` for another entitlement returns 500. | Source read. | Log `console.error` with the session id. Return non-2xx so Stripe retries. Handle the unique conflict. | ED-01, SRE-11, CR-04, QA-15 |
| F-21 | tests | `__tests__/api.test.ts` | API test gaps: IDOR, password reset, sign-in, submit-run branches and a router table. | QA review. | Add these cases. | QA-05, QA-06, QA-07, QA-08, QA-10 |
| F-22 | tests | `apps/web/src/features/auth/` | `LoginScreen` and `RegisterScreen` have no component tests. | QA review. | Add Testing Library tests. | QA-07 |
| F-23 | tests | `__tests__/d1.ts` | The D1 test double differs from real D1: batch atomicity and `meta.rows_read`. | QA review. | Use `@cloudflare/vitest-pool-workers`. It is a new dependency, so ask first. | QA-09 |
| F-24 | a11y | `apps/web/src/features/auth/register/*` | Register fields have no programmatic labels and no `autocomplete`. | Static review. | Add `label htmlFor` and the `autocomplete` values `username`, `email` and `new-password`. | A11Y-03 |
| F-25 | a11y | auth and game forms | Errors are not announced to screen readers. | Static review. | Use `role="alert"`, or `aria-describedby` with `aria-invalid`. | A11Y-04 |
| F-26 | a11y | `apps/web/src/styles/theme.css` (`smoke-600` `#606060` and others) | Text contrast is below 4.5:1. | Measured. | Lighten the tokens. | A11Y-05 |
| F-27 | a11y | game screens | No live regions announce changes, and focus is lost after each turn. | Playtest. | Add a polite live region and move focus to the new heading. | A11Y-06 |
| F-28 | a11y | `apps/web/src/hooks/useChoiceHotkeys.ts:40-45` | Single-key hotkeys cannot be turned off (WCAG 2.1.4). | Static review. | Add a setting to turn them off, or require a modifier key. | A11Y-07 |
| F-29 | a11y | CSS and Tailwind (249 infinite animations) | No control to pause animations. | Grep. | Honor `prefers-reduced-motion` and add a pause toggle. | A11Y-08 |
| F-30 | a11y | icon-only buttons | Icon-only buttons have no accessible name. | Static review. | Add `aria-label`. | A11Y-09 |
| F-31 | a11y | crisis timer | The 45 s crisis timer cannot be extended (WCAG 2.2.1). | Playtest. | Add a setting to extend the timer or turn it off. | A11Y-10 |
| F-32 | ops | `apps/api/wrangler.jsonc`, `email.ts:4-7` | There is no `send_email` binding, so password reset fails silently. `keep_vars` is unset, so a binding added in the dashboard is removed on the next deploy. | Config read. | Declare `EMAIL` and `RESET_EMAIL_FROM` in `wrangler.jsonc`. Owner chooses the sender. Until then, hide the reset link. | SE-01, ED-13 |
| F-33 | ops | `.github/workflows/deploy.yml:79-83` | Deploy has no rollback, no D1 bookmark, no smoke test and no runbook. | Workflow read. | Record a Time Travel bookmark before migrating. Run a smoke test after deploy. Document `wrangler rollback`. | SRE-08 |
| F-34 | ops | `index.ts` | There is no `/api/health` route. | Router read. | Add a health route that runs a cheap `select 1`. | SRE-09 |
| F-35 | ops | `http.ts:44-50`, `routes/payments.ts:44,67,87-90` | Logs are thin, and every unknown error returns 503. The hardening doc says 500. | Source read. | Use structured `console.error`. Return 500 for bugs and 503 only for D1 or quota errors. | SRE-10, ED-04, ED-10 |

### Low

| ID | Area | file:line | Issue | Evidence | Fix | Sources |
| --- | --- | --- | --- | --- | --- | --- |
| F-36 | security | `index.ts:35,37,38`, `routes/runs.ts:150-157` | `GET /api/profile`, `/api/runs` and `/api/entitlements` have no IP or user rate limit. `/runs` uses `count(*) over()`. | Pentest. | Wrap them with `ipLimited`. Replace the window function with a scalar subquery. | SA-07, V-3, PT-02, SA-12, DBA-04 |
| F-37 | security | `routes/runs.ts:100-102`, `runValidation.ts:42-60` | Decisions are stored exactly as the client sent them. That allows about 256 KB of padding per run and bypasses dedupe. | Source read. | Add `normalizeDecision` and store only known fields. | ARCH-03, CR-03, SA-3 |
| F-38 | security | `auth.ts:18-33` | Reset tokens live 60 minutes, are stored unhashed and travel in the URL path, so they reach the logs. | Source read and pentest. | Set `resetPasswordTokenExpiresIn: 1800` and `verification.storeIdentifier: 'hashed'`. Review log retention. | SA-03, PT-06, SE-11, SRE-16, SA-14 |
| F-39 | security | `auth.ts:30`, `email.ts:8` | Reset response time reveals whether an email is registered. Sending the email has no timeout or catch. | 424.8 ms for a registered email against 10.8 ms. | Send through `advanced.backgroundTasks.handler` with `ctx.waitUntil`, adding a timeout and a catch. | SA-04, ED-02, SRE-15 |
| F-40 | security | `auth.ts:25-30` | There is no per-account login limit and no per-recipient limit on reset emails. | Source read. | Add a per-email limit, in D1 or in the rate-limit binding. | SA-05, SA-06, PT-05 |
| F-41 | security | `routes/runs.ts:38-44`, `tickets.ts:25-37`, `auth.ts:49-51` | Leaderboard runs can be botted. The seed is known before play, the config is chosen at submit, and guest tickets transfer on sign-in. | Source read. | Bind the config to the ticket, require a minimum elapsed time and keep the best score per user. Owner decides how much risk to accept. | SA-08, ARCH-02, CR-12, V-8, SA-9 |
| F-42 | security | `auth.ts` (`user.name`, `user.image`) | `name` and `image` accept any string through sign-up and `update-user`. | Pentest. | Validate them in a hook or with `additionalFields`. | V-6, PT-08 |
| F-43 | security | `index.ts:61-65`, `http.ts:10-16` | A 404 under `/assets/*` has no security headers. `/api/auth` responses lack `Cache-Control: no-store`. | Pentest. | Wrap the 404 in `withSecurityHeaders`. Add `no-store` on auth. | PT-01, SE-12, SA-13, SR-2 |
| F-44 | security | `package-lock.json` | `better-call` resolves `zod@3.25.76`, which does not satisfy its peer range. `npm audit` reports 65 high advisories, besides the accepted critical. | `npm ls` and `npm audit`. | Add `zod@^4.6.7` (needs approval). Triage the audit. | SE-05, SE-13 |
| F-45 | security | `.claude/settings.local.json` | This file is tracked in git. Its contents were not read. | `git ls-files`. | Owner reviews it, untracks it and rotates anything sensitive. | SE-06 |
| F-46 | security | `auth.ts` (Google account) | OAuth tokens are stored in plaintext. | Source read. | Set `account.encryptOAuthTokens: true`. | SE-07 |
| F-47 | security | deployment | On `*.workers.dev`, other workers count as same-site, so SameSite cookies do not isolate this app from them. | Config read. | Move to a custom domain (owner decision). | SE-08 |
| F-48 | cost-availability | `cleanup.ts:5-17`, `index.ts:74-76` | The cron does not prune `run_tickets`, expired sessions or `verification` rows. Its deletes are unbounded and run in one batch, so one failure rolls back everything. The cron has no log or catch. | Source read. | Use bounded deletes per table, each wrapped in its own try, and add a log. Test with a guest created by Better Auth. | CR-09, ARCH-11, DBA-05, DBA-06, SA-7, SRE-13, SRE-14, CR-13, ED-08, SR-1, QA-13 |
| F-49 | correctness | `routes/runs.ts:77-79,127-135` | Resubmitting a consumed ticket with different decisions returns 200 with `duplicate: true`. | Source read. | Return 409 when the hash differs. | CR-02, QA-08 |
| F-50 | correctness | `apps/web/src/stores/gameStore.ts:256-263`, `apps/web/src/lib/runTicket.ts:18-28`, `apps/web/src/hooks/useEntitlements.ts:14-29`, `apps/web/src/features/game-over/GameOverActions.tsx:19-24`, `tickets.ts:2`, `packages/game-engine/src/entitlements.ts:92` | Ticket and save failures are silent. The free quota is defined in 3 places, and `FREE_PRESIDENTS` contradicts itself. | Source read. | Show the errors to the user. Keep a single quota constant in the engine. | CR-05, CR-06, ARCH-05, ED-07 |
| F-51 | correctness | `apps/web/src/lib/auth.ts:32-62` | Sign-up can lose the username, and the availability check fails open. `translateAuthError` has no message for 429. | Source read. | Fail closed. Surface or retry the profile write. Map 429. | CR-07, ARCH-12, ED-06, ED-11 |
| F-52 | correctness | `http.ts:44-47` | The daily cap response sends `Retry-After: 60`. | Source read. | Send the seconds until UTC midnight. | CR-08 |
| F-53 | correctness | `http.ts:75-79` | A body-less POST is rebuilt with a `text/plain` body. Sign-out then returns 415, and the session stays valid. | Pentest. | Pass body-less requests through unchanged. | PT-03 |
| F-54 | correctness | `auth.ts` (sign-up hook) | The profile is not created atomically with the user. | Source read. | Use a batch, or repair the profile on the next request. | ED-03 |
| F-55 | correctness | `packages/game-engine` (`stripePriceId`), `routes/*`, `http.ts`, `routes/profile.ts:43-46` | Architecture cleanups:<br>- The engine holds `stripePriceId`.<br>- Routes mix concerns.<br>- `maxBytes` comes from 2 sources.<br>- `DIFFICULTIES` is declared in 4 places.<br>- A username conflict is detected by matching `UNIQUE` in the error text. | Source read. | Move prices to the API. Extract route helpers. Keep one constant for each value. Use `insert ... on conflict`. | ARCH-04, ARCH-07, ARCH-08, ARCH-09, ARCH-16, SA-18 |
| F-56 | tests | `routes/leaderboard.ts:25-33`, `routes/runs.ts:38-44`, `routes/profile.ts:14-19` | Untested: the leaderboard's 400 response, filter, limit and cache header, and the per-user limit on start-run. | QA review. | Add these cases. | QA-11, QA-12 |
| F-57 | tests | `apps/api/package.json:11`, `.github/workflows/deploy.yml:38-48` | There is no coverage tooling and no threshold. | QA review. | Add `@vitest/coverage-v8` with thresholds (needs approval). | QA-14 |
| F-58 | ops | `.github/workflows/deploy.yml`, `.gitleaks.toml` | Actions are pinned by tag. `persist-credentials` is left at its default, and the deploy job has no environment reviewers. Gitleaks, `npm audit` and Dependabot never run. | Workflow read. | Pin by SHA. Add gitleaks and audit steps, plus `dependabot.yml`. | SE-03, SA-5, SE-04, SA-6 |
| F-59 | ops | `env.ts` | The Worker does not validate its env. There is no `.dev.vars.example`. | Source read. | Validate the env once. Add an example file with no values. | SE-09 |
| F-60 | ops | `routes/payments.ts` | The Stripe SDK uses its defaults: an 80 s timeout and 2 retries. | Source read. | Set `timeout` to about 10 s and `maxNetworkRetries: 1`. | SRE-12 |
| F-61 | a11y | `LoginScreen.tsx:123,133`, `register/UsernameField.tsx:25`, `register/PasswordField.tsx:13` | `focus:outline-none` hides the focus ring on auth inputs. | Static review. | Remove it. | A11Y-11 |
| F-62 | a11y | `GameHeader.tsx:101-103`, `DecisionDiary.tsx:122`, `LoginScreen.tsx:82` | Some targets are smaller than 24x24 px. | Playtest. | Enlarge the hit area. | A11Y-12 |
| F-63 | a11y | `apps/web/src/components/illustrations/*` | Alt text is built from internal ids. | Static review. | Use translated descriptions, or `alt=""` for decorative images. | A11Y-13 |
| F-64 | a11y | `SceneAnimation.tsx:12`, `HomeScreen.tsx:271-310`, `ScenarioCard.tsx:47-98` | GSAP tweens ignore reduced-motion settings. | Static review. | Add a `matchMedia` guard. | A11Y-14 |
| F-65 | a11y | `apps/web/src/App.tsx:26,94` | There is no per-route title, no focus move on navigation and no skip link. Few screens have a `<main>` landmark. | Static review. | Add a route-change hook and landmarks. | A11Y-15 |
| F-66 | a11y | `apps/web/src/components/UserMenu.tsx:21` | The menu has no `aria-expanded` and does not close on Escape. | Static review. | Add both. | A11Y-16 |
| F-67 | a11y | `AuthScreen.tsx`, the Crisis Express toggle | Toggle buttons do not expose their state with `aria-pressed`. | Static review. | Add `aria-pressed`. | A11Y-17 |

### Info

| ID | Area | file:line | Issue | Fix | Sources |
| --- | --- | --- | --- | --- | --- |
| F-68 | security | `routes/payments.ts:49-70` | The webhook trusts the metadata of any signed session. It does not check the price. | Compare the session's price with the price of the entitlement. | ARCH-14 |
| F-69 | security | product | Users cannot delete their account. A cascading delete would be costly. | Owner decides whether to build it. | SA-12, DBA-10 |
| F-70 | security | `apps/web/public/_headers:1-7` | The CSP has no `form-action`. It allows wildcard PostHog hosts and `unsafe-inline` styles. There is no COOP or CORP. | Partly fixed 2026-11-24: `form-action 'self'` added, `unsafe-inline` removed. Wildcard PostHog host, COOP and CORP still open. | V-7, SE-12, SA-15 |
| F-71 | security | `apps/api/wrangler.jsonc` | `preview_urls` is not set explicitly. | Set `preview_urls: false`. | SE-10 |
| F-72 | security | `ShareSection.tsx:31,37`, `gameStore.ts:457-473` | `window.open` is called without `noopener`. Persisted game state survives sign-out. | Pass `noopener,noreferrer`. Clear the stored game state on sign-out. | SA-16, SA-17 |
| F-73 | cost-availability | `routes/runs.ts:81-98`, `auth.ts:64-68` | D1 round trips are sequential, and `session.cookieCache` is off. | Batch the queries and turn on the cookie cache. | ARCH-15, CR-14 |
| F-74 | cost-availability | migrations | Usernames are case-sensitive (see SEC-023). `account` has no `(providerId, accountId)` index. | Add both in a new migration. | DBA-07, DBA-08 |
| F-75 | ops | ops docs | Missing before launch: an OAuth error page, a k6 rerun on Workers and a capacity document. | Write them before launch. | ED-12, QA-17, SRE-17 |
| F-76 | a11y | `theme.css:520-522`, `crimson-200/300/900` (31 uses), `GameScreen.tsx` | The ticker keyframes are missing and the crimson shades used are undefined. On mobile, the ticker partly covers the confirm button. | Define them, and pad the confirm button. | A11Y-18, A11Y-19, A11Y-20 |

## Needs owner decision

1. **Workers plan, Free or Paid.** This sets the severity of F-04 (scrypt) and F-18. On Free, F-01, F-02 and F-16 become urgent.
2. **Which entitlement unlocks the three `full_access` scenarios, and whether crisis difficulty is free** (F-11).
3. **Email sending.** Choose a `send_email` binding or Email Routing, and a sender address (F-32). Then decide between email verification and Turnstile (F-12).
4. **New dependencies:**
   - Playwright (F-08)
   - `@cloudflare/vitest-pool-workers` (F-23)
   - `@vitest/coverage-v8` (F-57)
   - `zod@^4.6.7` (F-44)
   - An optional HaveIBeenPwned check, which makes an outbound call (F-40)
5. **Custom domain** (F-47). It also enables edge caching.
6. **Whether to keep `/assets/*` in `run_worker_first`** (F-17).
7. **Run-history schema:** `final_state` with `json_each`, or a reduced `run_events` (F-16).
8. **Leaderboard rules** (F-03 note, F-41):
   - Keep only the best score per user?
   - Rank Crisis Express and scenario runs together, or separately?
   - How much botting risk to accept?
9. **Account deletion** (F-69).
10. **Review the tracked `.claude/settings.local.json`** and rotate anything sensitive (F-45).
11. **Cloudflare dashboard:** usage notifications for the D1 and Workers quotas, and log retention (F-38).

## Proposed fix batches

The batches touch disjoint files, with one exception. B1 and B4 both touch `index.ts`, so run B4 after B1, or fold B4's `scheduled` change into B1.

| Batch | Owner decision needed? | Files | Findings | Test that proves it |
| --- | --- | --- | --- | --- |
| **B1 Worker core and limiter** | No | `index.ts`, `http.ts`, `rateLimit.ts`, `auth.ts`, `__tests__/api.test.ts` | F-01, F-02, F-05, F-07, F-14, F-15, F-34, F-35, F-36, F-38 (config), F-39, F-43, F-52, F-53 | <ul><li>A statement-count test: the second request issues no `sqlite_master` query.</li><li>The limiter does not write once over the limit.</li><li>A GET fails open when D1 errors.</li><li>A 401 table test over private routes.</li><li>403 for a foreign Origin and for a foreign `redirectTo`.</li><li>Sign-out without a body returns 200.</li></ul> |
| **B2 Payments** | No | `routes/payments.ts`, `apps/web/src/hooks/useEntitlements.ts`, `apps/web/src/App.tsx`, new `__tests__/payments.test.ts` | F-06, F-19, F-20, F-60, F-68 | <ul><li>Signed-webhook tests: bad signature, grant, duplicate and unknown user.</li><li>Checkout returns 409 when the user already owns the entitlement.</li><li>A web hook test: a failed GET surfaces an error.</li></ul> |
| **B3 Runs, leaderboard and DB** | Partly (F-11 tier, F-16 schema) | `routes/runs.ts`, `routes/leaderboard.ts`, `runValidation.ts`, `policy.ts`, `packages/game-engine/src/entitlements.ts`, new migration `0002_*.sql` | F-03, F-11, F-16, F-18, F-37, F-49, F-56 | <ul><li>A `meta.rows_read` or EXPLAIN test on the filtered leaderboard.</li><li>Reusing a ticket with a different hash returns 409.</li><li>A locked scenario returns 403.</li><li>Leaderboard filter, limit and header tests.</li></ul> |
| **B4 Cleanup cron** | No | `cleanup.ts`, `__tests__/cleanup.test.ts`, plus the `scheduled` handler in `index.ts` (after B1) | F-48 | <ul><li>One prune test per table.</li><li>A guest created by Better Auth is purged by `scheduled`.</li><li>One failing delete does not block the others.</li></ul> |
| **B5 Web error surfacing** | No | `apps/web/src/lib/auth.ts`, `apps/web/src/lib/runTicket.ts`, `apps/web/src/stores/gameStore.ts`, `apps/web/src/features/game-over/GameOverActions.tsx`, `apps/web/src/features/game-over/ShareSection.tsx` | F-50, F-51, F-72 | <ul><li>Web Vitest: ticket and save failures show an error.</li><li>The availability check fails closed.</li><li>A 429 response is translated.</li></ul> |
| **B6 CI and config** | Partly (F-32 sender, F-17) | `.github/workflows/deploy.yml`, `apps/api/wrangler.jsonc`, `env.ts`, new `.github/dependabot.yml` | F-13, F-17, F-32, F-33, F-58, F-59, F-71 | <ul><li>`actionlint` passes.</li><li>`wrangler deploy --dry-run` succeeds.</li><li>A bad-env test fails fast.</li></ul> |
| **B7 Accessibility** | No | new `apps/web/src/components/Modal.tsx`, the five overlays, `TurnTransitionScreen.tsx`, `register/*`, `LoginScreen.tsx`, `theme.css`, `useChoiceHotkeys.ts`, `UserMenu.tsx`, `App.tsx` | F-09, F-10, F-24 to F-31, F-61 to F-67, F-76 | <ul><li>Component tests for the focus trap, Escape and focus restore.</li><li>Pressing Enter on a button is not hijacked.</li><li>Optional axe run (needs approval).</li></ul> |

Not batched, because each needs an owner decision or a new dependency: F-04, F-08, F-12, F-23, F-40, F-41, F-42, F-44, F-45, F-46, F-47, F-54, F-55, F-57, F-69, F-70, F-73, F-74, F-75.

## Checked and clean

- SQL is parameterized.
- The pentest found no IDOR.
- The ticket cap is atomic: 10 parallel requests produced exactly 3 tickets.
- Scores are replayed on the server, and mass-assigned fields are ignored.
- Cookies are `HttpOnly`, `Secure`, `SameSite=Lax` and use the `__Secure-` prefix.
- Errors leak no stack traces and no SQL.
- The webhook verifies the Stripe signature, and the checkout redirect is allowlisted.
- Body caps hold, including chunked bodies. Exceptions: F-53 and PT-07 (start-run).
- Path traversal is blocked, and no CORS headers are emitted.
- Deploy runs migrations before the Worker deploy.
- A regex pass over git history found no secrets.
- Reset tokens are single-use, and sessions are revoked after a reset.
- ISO and UTC date handling is correct today.
- There is no `dangerouslySetInnerHTML`.
- Tests pass: api 30/30, engine 252/252, web 623/623.

## Not covered

- Anything remote: the plan, secrets, live headers, `CF-Connecting-IP`, D1 billing and logs.
- The Google OAuth state and callback.
- Better Auth default endpoints beyond those probed.
- Engine modules under adversarial replay.
- How the web app renders data from other users.
- Real screen readers, and a11y of authenticated screens.
- `apps/mobile`.
- Coverage percentage, because no coverage tool runs.
- k6 was not rerun, and gitleaks was not run.

## Fix status

Independent re-verification of the uncommitted working tree on `feat/cloudflare-migration`, 2026-11-17. Local test runs: `apps/api` 86 passed, `packages/game-engine` 257 passed, `apps/web` 681 passed. Nothing here proves remote configuration (Cloudflare dashboard, secrets, Email Routing, GitHub environment reviewers).

Status values: **Fixed** (verified in code and covered by a test, or config-only where noted), **Partial** (what is missing is stated), **Not fixed**, **Deferred** (not batched, or owner decision).

Totals: 43 Fixed, 12 Partial, 2 Not fixed, 19 Deferred.

| ID | Status | Evidence |
|---|---|---|
| F-01 | Fixed | `apps/api/src/auth.ts:85` caches the instance in a `WeakMap<Env, Auth>`; `index.ts` builds auth lazily. Test: `b1-worker.test.ts` (schema check runs once). Assumes the `env` object is stable per isolate. |
| F-02 | Fixed | `rateLimit.ts:25` conditional upsert stops writing over the limit; one `auth` bucket. Tests: `b1-worker.test.ts` (stops writing at 121, single auth bucket, fail open on GET, fail closed on POST). |
| F-03 | Fixed | `routes/leaderboard.ts` uses two statements. Test: `b3-runs-leaderboard.test.ts:147` asserts index use with `EXPLAIN QUERY PLAN`. |
| F-04 | Deferred | Not batched. Depends on the Workers plan. |
| F-05 | Fixed | `auth.ts` sets `disableOriginCheck: false`. Tests: `b1-worker.test.ts` (foreign `Origin` 403, foreign `redirectTo` 403). |
| F-06 | Fixed | `__tests__/payments.test.ts` covers checkout 409, bad signature, grant, replay, other session, unknown user, price mismatch and Stripe retry. |
| F-07 | Fixed | `b1-worker.test.ts` 401 table over the 7 private routes. |
| F-08 | Deferred | Not batched. No browser E2E test. |
| F-09 | Fixed | The `window` keydown handler is removed from `TurnTransitionScreen.tsx`; CONTINUAR gets initial focus. Test: `gameA11y.test.tsx:33`. |
| F-10 | Fixed | `apps/web/src/components/Modal.tsx` is used by all five overlays. Tests: `Modal.test.tsx` (semantics, Tab trap, Escape, focus restore), `gameA11y.test.tsx:27,47`. See R-09 for a focus-restore gap. |
| F-11 | Partial | `packages/game-engine/src/entitlements.ts` `canStartRun` enforces the scenario tier; tests `runAccess.test.ts`, `b3-runs-leaderboard.test.ts`. Missing: crisis difficulty with a free president still needs no entitlement (owner decision), and the web does not call `canStartRun`. |
| F-12 | Deferred | Not batched. No email verification. |
| F-13 | Fixed | `.github/workflows/deploy.yml`: Cloudflare secrets are step-level only. Config only, no test. |
| F-14 | Fixed | `index.ts:49-57` checks the write origin before Better Auth. Test: `b1-worker.test.ts` (foreign `Origin` 403 on cookieless POSTs). |
| F-15 | Fixed | `auth.ts:44` caps `/sign-in/anonymous` at 10 per hour per IP; `cleanup.ts` purges guests. Tests: `b1-worker.test.ts` (anonymous cap), `cleanup.test.ts`. Guest session TTL is unchanged. See R-03. |
| F-16 | Not fixed | `routes/runs.ts` still stores `final_state`, `decisions` and one event row per turn. No new migration. |
| F-17 | Not fixed | `apps/api/wrangler.jsonc:15` still lists `/assets/*` in `run_worker_first`. |
| F-18 | Fixed | `runValidation.ts:8` caps ranked runs at 58 decisions (`MAX_TURNS` + `LAME_DUCK_TURNS`). A legal run cannot exceed it: the election is at turn 40, lame duck adds 8 turns, and career runs are not submitted. Tests: `runAccess.test.ts:70`, `b3-runs-leaderboard.test.ts:225`. CPU time was not measured. |
| F-19 | Partial | `payments.ts:13` `on conflict do nothing`; checkout returns 409 when owned; `App.tsx` reports a failed entitlement fetch. Tests: `payments.test.ts`, `purchaseStatus.test.tsx`. Missing: no polling after purchase, so a slow webhook still shows "pending" after one refetch. |
| F-20 | Fixed | `payments.ts` returns a non-2xx and logs for an unknown user; a duplicate grant keeps the first session id. Tests: `payments.test.ts`. |
| F-21 | Partial | Added: 401 table, foreign ticket, 409 conflict, reset TTL, sign-out. Missing: email sign-in and sign-up flow tests, and an IDOR test for `GET /api/runs`. |
| F-22 | Partial | `AuthScreensA11y.test.tsx` and `register/__tests__/fields.test.tsx` cover labels, alerts and focus rings. Missing: submit, error and navigation behaviour tests for `LoginScreen` and `RegisterScreen`. |
| F-23 | Deferred | Not batched. |
| F-24 | Fixed | `register/UsernameField.tsx`, `register/PasswordField.tsx`, `RegisterScreen.tsx`. Tests: `fields.test.tsx:14,56`, `AuthScreensA11y.test.tsx:44`. |
| F-25 | Fixed | `role="alert"`, `aria-invalid` and `aria-describedby` on auth forms; crisis alerts in game. Tests: `AuthScreensA11y.test.tsx:51`, `fields.test.tsx:28,60`, `gameA11y.test.tsx:60`. |
| F-26 | Fixed | `apps/web/tailwind.config.ts` `smoke-600` is now `#8c8c8c`; dim text classes were raised. Test: `AuthScreensA11y.test.tsx:97`. Contrast was not re-measured on every screen. |
| F-27 | Partial | `GameScreen.tsx` has a polite `role="status"` region for the turn and card. Missing: focus is not moved to the new card after the turn transition closes (see R-09). |
| F-28 | Fixed | `stores/preferencesStore.ts` `hotkeysEnabled`, read in `useChoiceHotkeys.ts`. Test: `gameA11y.test.tsx:74`. |
| F-29 | Fixed | `AccessibilitySettings.tsx` toggle, `html.reduce-motion` rules in `theme.css`, `UserMotionConfig.tsx`. Test: `a11yControls.test.tsx:17`. The toggle is only on the home screen. |
| F-30 | Fixed | `DecisionDiary.tsx:128` `aria-label`; decorative glyphs are `aria-hidden`. Test: `gameA11y.test.tsx:47`. |
| F-31 | Fixed | `lib/crisisExpress.ts` gives 90 s with `extendedTime`. Test: `gameA11y.test.tsx:85`. The timer cannot be turned off. |
| F-32 | Partial | `wrangler.jsonc:25` declares `send_email` `EMAIL`. Missing: `RESET_EMAIL_FROM`, `keep_vars`, and the reset link is still shown (`LoginScreen.tsx:173`). See R-02. |
| F-33 | Fixed | `deploy.yml` records a D1 Time Travel bookmark and smoke-tests `/` and `/api/health`. Config only. Rollback is manual. |
| F-34 | Fixed | `index.ts` `GET /api/health`. Test: `b1-worker.test.ts` (health). |
| F-35 | Partial | `http.ts:57-66` logs `request_failed` and returns 500, or 503 for D1 errors. Test: `b1-worker.test.ts` (500 vs 503). Missing: payments logs are unstructured and drop the error detail (`payments.ts:97`); D1 constraint errors are reported as 503. |
| F-36 | Partial | All private routes are now `ipLimited` in `index.ts`. Missing: `routes/runs.ts:153` still uses `count(*) over ()`. |
| F-37 | Fixed | `normalizeDecision` plus `SUBMIT_MAX_BYTES = 65_536` in `routes/runs.ts:16`. Tests: `runAccess.test.ts`, `b3-runs-leaderboard.test.ts` (normalized decisions). |
| F-38 | Partial | `auth.ts:50` sets a 30 minute TTL; test in `b1-worker.test.ts:220`. Missing: the identifier is stored unhashed and the token still travels in the URL path. |
| F-39 | Fixed | `auth.ts:58` runs the email in `waitUntil` with a 10 s timeout. Test: `b1-worker.test.ts` (reset email via `waitUntil`). |
| F-40 | Deferred | Not batched. |
| F-41 | Deferred | Not batched. Owner decision. |
| F-42 | Deferred | Not batched. |
| F-43 | Fixed | `http.ts` `Cache-Control: no-store`; hashed-asset 404 is wrapped in security headers. Tests: `api.test.ts:297,319`. |
| F-44 | Deferred | Not batched. `npm audit` now runs in CI but does not block. |
| F-45 | Deferred | Not batched. File not read. |
| F-46 | Deferred | Not batched. |
| F-47 | Deferred | Not batched. `workers_dev: true` is now explicit. |
| F-48 | Fixed | `cleanup.ts` has six bounded tasks, each isolated. Tests: `cleanup.test.ts` (per table, batch cap, failing delete isolation). See R-04. |
| F-49 | Fixed | `routes/runs.ts:132` returns 409. Test: `b3-runs-leaderboard.test.ts` (409 on different decisions). |
| F-50 | Partial | `lib/runTicket.ts`, `gameStore.ts` `runTicketError`, `GameOverActions.tsx`. Tests: `GameOverActions.test.tsx`, `runTicket.test.ts`. Missing: the free quota is still duplicated (literal `3` in `hooks/useEntitlements.ts`, and `tickets.ts`). |
| F-51 | Fixed | `apps/web/src/lib/auth.ts`: username-save error is returned, availability check fails closed, 429 is mapped. Test: `lib/__tests__/auth.test.ts`. See R-06. |
| F-52 | Fixed | `http.ts` `secondsUntilUtcMidnight`. Test: `b1-worker.test.ts` (Retry-After midnight). |
| F-53 | Fixed | `http.ts` `withLimitedBody` leaves a body-less request unchanged. Test: `b1-worker.test.ts` (body-less sign-out 200). |
| F-54 | Deferred | Not batched. |
| F-55 | Deferred | Not batched. `submit-run` now has two limits (`index.ts:30` 262 144 and `runs.ts:16` 65 536). |
| F-56 | Fixed | `b3-runs-leaderboard.test.ts` (400, filter, limit, cache header, start-run user limit). |
| F-57 | Deferred | Not batched. |
| F-58 | Partial | Actions are SHA-pinned, `persist-credentials: false`, `environment: production`, `.github/dependabot.yml`. Missing: no gitleaks step, `npm audit` is `continue-on-error`, environment reviewers must be set in GitHub. |
| F-59 | Fixed | `env.ts` `findEnvProblems`, `apps/api/.dev.vars.example`. Tests: `env.test.ts`, `api.test.ts:312`. See R-01. |
| F-60 | Fixed | `payments.ts:22` 10 s timeout and 1 retry. Test: `payments.test.ts` (Stripe retry). |
| F-61 | Fixed | `focus:outline-none` removed. Tests: `AuthScreensA11y.test.tsx:61,71`, `fields.test.tsx:45,74`. |
| F-62 | Fixed | 44 px hit areas in `GameHeader.tsx`, `DecisionDiary.tsx`, `LoginScreen.tsx`. Test: `AuthScreensA11y.test.tsx:61,77`. |
| F-63 | Fixed | `components/illustrations/imageA11yProps.ts`. Test: `imageAlternatives.test.tsx`. |
| F-64 | Fixed | `lib/reducedMotion.ts` guards in `SceneAnimation.tsx:13`, `HomeScreen.tsx:275,297`, `ScenarioCard.tsx:51`. Indirect test: `a11yControls.test.tsx:17`. |
| F-65 | Partial | `components/RouteFocus.tsx` sets the title and moves focus. Test: `a11yControls.test.tsx:51`. Missing: skip link, and `<main>` on most screens. |
| F-66 | Fixed | `components/UserMenu.tsx`. Test: `UserMenu.test.tsx:13`. |
| F-67 | Fixed | `AuthScreen.tsx:75`, `PresidentSelectScreen.tsx:351`. Tests: `AuthScreensA11y.test.tsx:86`, `a11yControls.test.tsx:32`. |
| F-68 | Fixed | `payments.ts:60` checks the line-item price. Test: `payments.test.ts` (price mismatch). |
| F-69 | Deferred | Not batched. Owner decision. |
| F-70 | Deferred | Not batched. |
| F-71 | Fixed | `wrangler.jsonc:8` `preview_urls: false`. Config only. |
| F-72 | Fixed | `ShareSection.tsx` `noopener,noreferrer`; `lib/auth.ts:69-74` resets the game store on sign-out. Tests: `ShareSection.test.tsx`, `auth.test.ts`. See R-05. |
| F-73 | Deferred | Not batched. |
| F-74 | Deferred | Not batched. |
| F-75 | Deferred | Not batched. |
| F-76 | Fixed | `theme.css` `ticker-scroll` keyframes, `tailwind.config.ts` crimson 200/300/900, `GameScreen.tsx` `pb-12`. No test; verified by reading. |

### New issues found during re-verification

No High regression found. Full rows are in the session scratchpad file `findings/reverify.md`.

| ID | Severity | Where | Issue |
|---|---|---|---|
| R-01 | Medium | `apps/api/src/auth.ts:29` | Any `findEnvProblems` entry (for example a lone Stripe or Google setting, or a secret shorter than 32 characters) returns 503 for login and every private route. |
| R-02 | Medium | `apps/api/wrangler.jsonc:25` | The new `send_email` binding can fail the deploy if Email Routing is not enabled. Not verified remotely. |
| R-03 | Low | `apps/api/src/auth.ts:44` | The anonymous sign-in cap of 10 per hour per IP hits shared networks; the web reports it as a network error. |
| R-04 | Low | `apps/api/src/cleanup.ts:5` | One pass of 2000 rows per table per day; a larger daily volume builds a backlog. |
| R-05 | Low | `apps/web/src/lib/auth.ts:69-74` | `signOut` clears local state even when the request failed. |
| R-06 | Low | `apps/web/src/features/auth/RegisterScreen.tsx:33-38` | A failed username save leaves a signed-in user on the form; resubmitting fails with "User already exists". |
| R-07 | Low | `apps/api/src/http.ts:57` | `isD1Error` misses D1 failures without the `D1_` prefix and reports constraint errors as 503. |
| R-08 | Low | `apps/api/src/routes/payments.ts:60,97` | The webhook depends on an outbound Stripe call and logs no error detail on failure. |
| R-09 | Low | `apps/web/src/components/Modal.tsx:30` | Focus falls to `body` when the trigger is unmounted, which happens after every turn transition. |
| R-10 | Info | `apps/api/src/index.ts:30`, `apps/api/src/routes/runs.ts:16` | `submit-run` has two different body limits. |
