# Continuación con Claude — 8 de noviembre de 2026

Leer primero `CLAUDE.md`, después este archivo y `security_best_practices_report.md`.

## 2026-11-27 — Scenario achievements

- Branch `feat/scenario-achievements`. Engine `achievements.ts`: `scenarioAchievements(records)` maps per-scenario run stats to a tier (`locked`, `played`, `won`) plus best score for every `HISTORICAL_SCENARIOS` entry; unknown ids are ignored.
- Migration `0005_scenario_achievements.sql`: partial index `game_runs_user_scenario_idx (user_id, scenario_id)`. No new table: achievements are derived from the user's completed, server-validated runs.
- API: `GET /api/achievements` (session required, one grouped query filtered by the session user id).
- Web: `features/history/useAchievements.ts` (`achievementsQuery`) and `ScenarioAchievements.tsx`, shown at the top of the history screen.
- Deployed 2026-11-27: daily challenge (PR #94, migration 0004 applied by CI, prod `/api/leaderboard?daily=1` 200).

## 2026-11-27 — Daily challenge

- Branch `feat/daily-challenge`. Engine `dailyChallenge.ts`: UTC day key, FNV-1a seed per day, `dailyChallengeConfig` (normal, no scenario, no Crisis Express, no career, any president) and `isDailyChallengeConfig`.
- Migration `0004_daily_challenge.sql`: `daily_date` on `run_tickets` and `game_runs`, partial index `game_runs_daily_score_idx`. Must run on remote D1 before the Worker deploy (CI does it).
- API: `POST /api/start-run?daily=1` issues the day's seed (counts against the normal daily cap) and stores `daily_date`; `submit-run` answers 422 when a daily ticket comes with other rules and stores `daily_date`; `GET /api/leaderboard?daily=1` returns each user's best run of today.
- Web: "Desafío diario" button on home, `startNewGame(difficulty, { daily: true })`, leaderboard filter "Desafío de hoy". Offline/playtest uses the local seed and is not ranked.
- Next ideas, in order: persistent achievements, newspaper recap from decisions, counterfactual replay, cabinet advice, timers on crisis cards, sound/haptics wiring (only `playVoteTick` is used today), dedicated art (paid, ask first).

## 2026-11-26 — Four new historical scenarios, shock labels

- Branch `feat/more-historical-scenarios`. New `ScenarioId`s, all `mode_historical`: `primavera_1983` (Alfonsín 1983), `crisis_campo_2008` (Resolución 125), `corrida_2018` (2018 run on the peso), `pandemia_2020` (lockdown). Each has config, calendar, arc, 2 opening shocks, a per-turn mechanic in `gameLoop.ts`, 3 `hist_*` cards, es/en texts, a raster from `SCENARIO_IMAGES` (existing art reused) and an `ERA_ACCENT`.
- Gaps closed: `libertad_avanza_2023` had no cards of its own (added `hist_lla_001..003`); `conflicto_iran_2024` had 2 (added `hist_iran_001`); Ukraine/Iran shocks had no i18n labels; `apps/web/src/lib/shockLabel.ts` showed raw keys for historical shocks (now uses `i18n.t`).
- Tests: `packages/game-engine/src/__tests__/historicalScenarios.test.ts` checks every scenario for texts, calendar, arc end, seats, 2 translated shocks and at least 3 own cards; `apps/web/src/lib/__tests__/shockLabel.test.ts`.
- Pending idea: dedicated art per new scenario and for `hist_*` cards (paid generation, ask first).

## 2026-11-24 — Deps, SEC re-check, strict style CSP, share card

- Merged #76 (global `afterEach(cleanup)` in web test setup), #77 (i18next 27, react-i18next 18, globals 17, lint-staged 17, commitlint 21, actions v7 pinned by SHA, `npm audit fix`), #78 (SEC-009: `.dev.vars*` ignored; inherited-key entitlement test). Dependabot #42-#47 superseded by #77. #48 (eslint 10) superseded by `chore/eslint-10`: eslint 10.15 + `@eslint/js` 10, with npm `overrides` forcing `eslint-plugin-import` and `eslint-plugin-jsx-a11y` (peer `^9` only) onto eslint 10. Probe showed `import/no-restricted-paths` and jsx-a11y rules fire identically; lint 0 problems. Drop the overrides once those plugins declare eslint 10.
- `npm audit` remainder: Expo/React Native tree (mobile, out of scope; `tar` critical = SEC-025) and `@cloudflare/vitest-pool-workers` nested wrangler/miniflare/undici (dev-only; 0.12+ needs vitest 3). Accepted.
- `security_best_practices_report.md`: SEC-001..009 and SEC-013..015 re-verified against the Worker code and local tests. Remote D1 state and `ALLOWED_ORIGINS` are not proven by these tests.
- F7: `_headers` CSP is now `style-src 'self'` plus `form-action 'self'`. Checked on a local preview with that header: full game, game over, share image, login, register, leaderboard, history, reset-password, home and the Accesibilidad toggles report no violation. The only one is html2canvas cloning the share card (one inline `<style>` it uses for pseudo-elements); the PNG renders the same. PostHog runs with `disable_external_dependency_loading`, so no survey or toolbar styles. If a future library injects `<style>` tags, it breaks under this CSP.
- Share card: stats render with `Math.round` (inflation showed `43.77698455116164`). Test `features/game-over/__tests__/ShareImageCard.test.tsx`.
- Share card footer now prints `window.location.host` (was a non-existent `republica.app`). Owner approved dropping `run_events`: migration `0003_drop_run_events.sql` (old rows gone; `GET /api/runs` still returns a `run_events` field built from `final_state`). Test in `api.test.ts` checks the table no longer exists.
- Accesibilidad panel checked on prod in Chrome: "Reducir animaciones" adds `html.reduce-motion` (animations 15.7 s to 0.01 ms) and survives reload; "Atajos de teclado" on, key `2` picks choice 2, off, key `1` does nothing; "Tiempo extendido" shows 90 s instead of 45 s per Crisis Express turn. Preferences restored afterwards.
- Prod checked after deploy: `curl -I` shows the new CSP; in Chrome, home, leaderboard, mode tabs, president pick and 3 played turns render fully with no CSP violation.
- Flaky: `playtestFlow.test.tsx` "corrupt local administration" timed out on the CI runner (5 s wait for "Continuar la carrera"); raised to 10 s like the other waits. It flaked again: the root cause was `document.querySelectorAll('[aria-pressed]')[3]`, which could hit a global toggle (SoundManager etc.) instead of choice D, so nothing was confirmed. The query is now scoped to the card `section`.
- `ip limiter` tests froze `Date` at a window start: the auth-bucket test flaked on main when its 120 requests crossed the fixed 60 s window boundary.
- Secret scan: CI job `Secret scan` downloads gitleaks 8.30.1 (sha256-checked) and scans full history with `.gitleaks.toml`; `verify` and `secrets` both gate deploy. Allowlist adds `apps/api/src/__tests__|__integration__` (dummy fixture secrets); `.gitleaksignore` holds 3 fingerprints for old Supabase `anon` JWTs (public role, Supabase no longer used). Local Windows runs need `GIT_CONFIG_NOSYSTEM=1` (Git for Windows `astextplain` textconv breaks `git log -p` on a `.docx`).
- GitHub environment `production` now requires the owner as reviewer: every main deploy waits for approval in Actions (admins can bypass).
- lint-staged now also runs eslint and prettier on `apps/api/src`; 4 api files that had drifted were formatted. `*.md` stays out on purpose (`.prettierignore`).

## 2026-11-24 — D1 write budget, Origin on cookie writes, username keys

- Product F4 (D1 writes per run): `submitRun` no longer copies `history` into `run_events`; one `game_runs` insert per run. `GET /api/runs` reads the first 10 events from `json_each(final_state, '$.history')`. The `run_events` table stays (unused); dropping it deletes old rows, so that is the owner's call.
- F8: `assertAllowedOrigin` (`http.ts`) rejects writes that carry a `Cookie` but no `Origin`. Cookieless clients (Stripe webhook) are unchanged. Test in `b1-worker.test.ts`.
- SEC-023: migration `0002_username_key.sql` adds `profiles.username_key` (lowercased NFKC) with a unique index. `apps/api/src/username.ts` normalizes with NFKC and rejects names that mix Latin and non-Latin letters. Prod had 2 profiles, no key conflicts (checked before the migration).
- Verification (local): lint 0, type-check api/web/engine, api 97, integration 27, `test:security` 15.


- All 522 legacy card strings that fell back to Spanish now have English (`packages/game-engine/src/i18n/legacyEvents.ts`, spread into `en`). `npm run verify:content` and `englishCoverage.test.ts` now fail on any missing English card text.
- All planned art is imported: every key in `art/*.json` (event scenes, president scenes, extra scenes, plaza pack, candidates) and every historical scenario image exists in `image-manifest.json`. No pending scene generation.
- Claude Security F1-F4 re-verified against the Worker: F1 Google sign-in gets `neutralUsername()` (`auth.ts`); F2/F3 `transferGuestTickets` resets `created_at` and caps at the remaining daily quota (`tickets.ts`); F4 daily cap (3 free / 30 `full_access`) is enforced server-side in `issueRunTicket`. Treat as closed.
- Dependabot ignores `react-native` (0.x minors break the frozen Expo app); group PR #71 failed only on mobile type-check because of it. Major bumps #42-#48 (eslint 10, lint-staged 17, commitlint 21, globals 17, actions v7) left for the owner.
- 2026-11-25 owner decisions: Workers Free kept for now (email auth ~37 ms CPU vs 10 ms nominal, 0 rejections; watch `exceededCpu`, move to Paid if it appears); Crisis difficulty stays free, historical scenarios keep requiring `full_access`; Fly stopped 2026-11-26; Fly app destroyed and Supabase project deleted 2026-11-26 (owner confirmed). No leftovers remain. Deploy of #85 approved and checked: `/` 200, `/api/health` 200, `/api/runs` 401, home renders with no console errors in Chrome.
- Email reset closed as not applicable on 2026-11-24: the owner has no domain, so there is no Email Routing, `EMAIL` binding or `RESET_EMAIL_FROM`. The reset link stays hidden and `email.ts` skips sending. To enable it later, see the re-enable steps under deployment (binding, secret, `LoginScreen.tsx` button). Accesibilidad, `production` reviewers and gitleaks closed on 2026-11-24. No owner items left.

## 2026-11-23 — Stripe secrets set, checkout URL fix, Kicillof blue eyes

- Owner set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` (sandbox) on the Worker; `/api/auth/get-session`
  answers 200 on prod, so the env check passes.
- `/api/create-checkout` with `mode_historical` returns 200 and a `https://checkout.stripe.com/g/pay/…` URL. The web
  client only accepted `/c/pay/`, so the buy button showed a connection error. PR #61 accepts `/c/pay/` and `/g/pay/`.
  Buy button works on prod only after #61 merges and deploys.
- Sandbox payment done by owner with test card 4242 (agents do not type card data): prod redirected to
  `/?purchase_success=1&entitlement=mode_historical` and `/api/entitlements` returns `["mode_historical"]`. Grants only
  happen in `stripeWebhook`, so `we_1UemGdPF04vzkOdoj7DJRZoq` delivered and verified the event. Stray webhooks
  `we_1UemEGPIopTpIk2ciFaZajkm` (empty sandbox) and `we_1T9935PF04vzkOdoruIfKlor` (dead Supabase URL) deleted 2026-11-23.
- Home screen shows the full-width (max-w-2xl) Plaza de Mayo island (`cr_island` via exported `Island`) with 48 walking
  people (`PlazaStrollers`: depth-scaled lanes around the monument) above the title (`components/casa-rosada/CasaRosadaEmblem.tsx`); fire/smoke particles removed. `playtestFlow.test.tsx` is flaky in the full web suite on main too (passes alone); CI is the gate.
- Kicillof has light blue eyes: irises recolored in all 9 Kicillof images (PR #62). This supersedes the "dark eyes"
  note below.

## 2026-11-22 — Kicillof likeness retouch

- Kicillof art looked generic (light-brown hair, blue eyes). Retouched by hand-scripted pixel edits, no paid generation:
  dark wavy hair, sideburns, dark eyes in `portrait_kicillof_{neutral,panic,victory}.webp` (portraits also drop the tie
  for an open collar), `president_kicillof_{office,congress,press,diplomacy,crisis}.webp` and `cr_president_kicillof.webp`
  (scenes and diorama keep tie/sash). Filenames unchanged, so `image-manifest.json` needs no change.
- Re-running `scripts/pixel-art.py import` from new raws would overwrite these edits; any regeneration should prompt
  for dark wavy hair, sideburns, dark eyes, open collar (`art/new-candidates.json`).
- Verified locally: lint, type-check (web + engine), web 694 and engine 257 tests, web build.
- Follow-up: orange rim highlights on the hair in the five `president_kicillof_*` scenes darkened (warm light pixels
  enclosed by hair or outline on 3 of 4 sides); hair ramp top capped at `#5a4032`. Forelock highlights over the
  forehead in `crisis` darkened inside a box that stops above the widow's peak, so the skin is untouched.
- Verified in Claude in Chrome on prod: Kicillof portrait on the president select screen and all five scene files.

## 2026-11-22 — PBKDF2 CPU on the deployed Worker

- Measured in Workers Observability (dashboard, last 7 days): `POST /api/auth/sign-up/email` on 2026-11-20 23:54 UTC
  took 37 ms CPU (1426 ms wall), status 200, outcome ok. No email `sign-in/email` event in the window.
- Worker metrics, last 24 h: CPU P50 11.49 ms, P99 30.73 ms, 0 "Exceeded CPU Time Limits", 0 errors. Plan is
  Workers Free (nominal 10 ms); nothing was rejected so far, but email auth is ~4× the nominal limit. Watch
  `exceededCpu` or move to Workers Paid before sharing email accounts widely.
- Stripe: webhook destination `republica-en-llamas-worker` (`we_1UemGdPF04vzkOdoj7DJRZoq`) created in the sandbox
  "Entorno de prueba de República en Llamas" (`acct_1T95ZbPF04vzkOdo`, the one holding the `PRICE_BY_ENTITLEMENT`
  prices), URL `/api/stripe-webhook`, events `checkout.session.completed` and `charge.refunded`, API
  `2026-02-25.clover`. The old Supabase-era destination and an extra one in the empty sandbox
  `acct_1T95XhPIopTpIk2c` were deleted on 2026-11-23; the Worker destination is the only one left.
- Stripe secrets not set yet (`wrangler secret list` shows only Better Auth and Google). Owner, from `apps/api`, sets
  both together (one alone makes auth routes return 503): `npx wrangler secret put STRIPE_SECRET_KEY` (sandbox
  `sk_test_…`) and `npx wrangler secret put STRIPE_WEBHOOK_SECRET` (`whsec_…` from that destination).
- Email Routing left pending by the owner: the only zone on the account belongs to another site.

## 2026-11-20 — Open findings closed

- Stripe refunds: `charge.refunded` with `refunded: true` (full refund) looks up the checkout session
  by `payment_intent` and deletes the entitlement granted by that session (`payments.ts`, tests in
  `payments.test.ts`). Owner must add `charge.refunded` to the Stripe webhook endpoint events when
  Stripe is configured. Partial refunds keep the entitlement.
- Re-verified against the Worker code, closed: Google sign-up gets `neutralUsername()` (no email
  local part on the leaderboard); guest ticket transfer only moves tickets newer than 24 h and caps
  them at the daily limit (`transferGuestTickets`); the free cap is server-side only.
- Accepted, not changed: requests without `Origin` pass the write-origin check. Browsers always send
  `Origin` on POST, so CSRF is covered; non-browser clients can forge it anyway, and the Stripe
  webhook has no `Origin`.
- CI: two pushes to main deployed out of order (older bundle won). Job `latest` in `deploy.yml`
  now skips the deploy unless the run's commit is still the head of main (PR #54).
- Home: duplicate "Sesión activa" card removed (PR #52); prod serves the new bundle.
- Chrome check of prod after PR #53 deploy (desktop 1366 px): home renders, no app console errors
  (only Chrome-extension "message channel closed" noise). Chrome cannot shrink the window to
  390 px, so phone width was not checked in a real browser.
- Email sign-up CPU (PBKDF2) measured on 2026-11-22 from Observability: 37 ms (see that section).
- Still open: API-level email enumeration on sign-up. Fix needs email verification, which needs the
  `EMAIL` binding and a custom domain (same blocker as password reset).

## 2026-11-19 — Google sign-in setup

- Google Cloud project `republica-en-llamas-515220` created; Google Auth Platform (External) set up
  in the console. OAuth web client: origin `https://republica-en-llamas.ilandaniele.workers.dev`,
  redirect `https://republica-en-llamas.ilandaniele.workers.dev/api/auth/callback/google`.
- Owner set both Worker secrets (2026-11-20; social sign-in returns a Google `url`) from `apps/api`: `npx wrangler secret put GOOGLE_CLIENT_ID` and
  `npx wrangler secret put GOOGLE_CLIENT_SECRET` (one without the other makes the API return 503).
- CI build now sets `VITE_GOOGLE_SIGN_IN: 'true'`; merge only after both secrets are set.
- Static privacy page `apps/web/public/privacidad.html` (served at `/privacidad`) for the consent
  screen privacy link; Google requires it before the app can be published out of Testing.
- PR #50 merged and deployed; consent screen published (In production). Owner signed in with Google
  on 2026-11-20. `wrangler tail` CPU: `sign-in/social` 43 ms, `callback/google` 56 ms, `get-session`
  15 ms, `entitlements` 8 ms; all `outcome: ok`. These exceed the Free plan's nominal 10 ms, so watch
  for `exceededCpu` as traffic grows (Workers Paid lifts the limit). Email signup CPU still unmeasured.
- Old Google Cloud project `republica-en-llamas` (Supabase-era `supabase-auth` client) shut down by
  the owner (scheduled for deletion).
- Check: POST `/api/auth/sign-in/social` with `{"provider":"google"}` returns a `url`, not
  `PROVIDER_NOT_FOUND`.

## 2026-11-18 — PR #41 merged, first CI deploy

- PR #41 merged to main. CI run 44356547274: verify, D1 bookmark and migrations passed.
- `wrangler deploy` uploaded version `af4e8b87` (live, 100%), then failed on the cron schedule:
  "This account has reached the Workers Free limit of 5 cron triggers per account" (code 10072).
- Fixed the same day: removed the `* * * * *` cron from `franja-morada-uns` (its `wrangler.jsonc`
  now has `crons: []`), re-ran the failed job; Deploy and smoke test passed, cron `0 4 * * *` is live.
- Manual smoke on the live URL: `/` 200, `/api/health` 200, `/api/profile` 401.
- Live signup test (2026-11-19) found: Google button did nothing (no `GOOGLE_CLIENT_*` secrets, server
  returns `PROVIDER_NOT_FOUND`), browser autofilled the email into the username field, and the submit
  stayed disabled with only a ✗. Fix: `GoogleSignIn` renders only when `VITE_GOOGLE_SIGN_IN=true`
  (set it in the CI build together with the Google secrets), username uses `autocomplete="nickname"`
  and shows why the name is rejected (`usernameFormatError`).

## 2026-11-17 — Test findings fixed, deploy checklist

- F1: passwords hashed with WebCrypto PBKDF2-SHA256, 50k iterations, ~6 ms CPU in node (`apps/api/src/password.ts`, wired in `auth.ts`). Format `pbkdf2_sha256$<iterations>$<salt>$<hash>`; old Better Auth scrypt hashes still verify. Not yet measured on the deployed Worker.
- F2: `/api/auth/get-session` has its own IP bucket (`auth-session`, 120/min); web `AuthProvider` keeps the last known user while a session check errors.
- F3: one `<main>` in `App.tsx`; inner screen `<main>`s became `<div>`; e2e `test.fail` removed.
- F5: leaderboard `Cache-Control: no-cache`, web fetches it with `cache: 'no-cache'`.
- F6: profile edit button and input have `aria-label`s; sr-only `<h1>`.
- Daily cap: local UTC counter removed (`useEntitlements`); `DailyCapBanner` shows only when the server answers `daily_cap`. Register: a failed username save no longer traps the player; sign-up returns `usernameError` and the form offers "Continuar".
- Deferred: F4 (~134 D1 writes per run; fixed 2026-11-24), F7 (framer-motion inline styles), F8 (fixed 2026-11-24).
- Verification (local only): lint 0; type-check engine/web/api; tests api 90 + integration 27, engine 257, web 690 (one unreproduced flaky failure in 1 of 4 runs), `test:security` 15, e2e 28/28, web build OK.
- Remote state checked 2026-11-17: Worker secret `BETTER_AUTH_SECRET` set; GitHub secret `CLOUDFLARE_ACCOUNT_ID` set, `CLOUDFLARE_API_TOKEN` missing, so the deploy job cannot run yet.
- Deploy checklist (owner):
  1. GitHub secret `CLOUDFLARE_API_TOKEN` (Workers Scripts edit + D1 edit on the account).
  2. Done 2026-11-18: `CLOUDFLARE_API_TOKEN` added. The `send_email` binding was removed from `wrangler.jsonc` (no custom domain, so no Email Routing); password reset mails are skipped until a domain, the binding and `RESET_EMAIL_FROM` are added back. The "Olvidé mi contraseña" button is hidden in `LoginScreen.tsx` (2026-11-18); re-add it (git history of that file) together with the binding. `/reset-password` route and `requestPasswordReset` in `lib/auth.ts` stay.
  3. Stripe and Google secrets are optional, but each pair must be complete or every auth route returns 503.
  4. Merge PR into `main`; CI migrates D1, deploys, and smoke-tests `/api/health`.

## 2026-11-17 — Test phase (crear-app phase 7)

Full results and findings: `docs/test-report.md`.

- New suites: `npm run test:integration --workspace=apps/api` (workerd + real local D1, 27 tests, compat date overridden to `2026-08-22` because of the pool's bundled workerd), `npm run test:e2e --workspace=apps/web` (Playwright on installed Edge, desktop + Pixel 7, 28 tests, starts its own `wrangler dev` on 8788), `npm run test:coverage`, `scripts/security/pentest-local.sh` (loopback only), `run-api-load.mjs` bounded soak (`API_LOAD_SOAK_SECONDS` ≤ 600, `API_LOAD_PER_VU_IP=1`).
- Blocker before sharing email accounts on Workers Free: scrypt ~55 ms CPU per sign-up/sign-in (F1 = F-04). Guest play is fine.
- Open product findings, not fixed: F2 `get-session` shares the auth IP bucket and a 429 downgrades the UI to guest; F3 no `<main>` landmark (e2e `test.fail`); F4 ~134 D1 writes per run; F5 stale leaderboard cache; F6 profile a11y labels.

## 2026-11-17 — Security review fixes (crear-app phase 6)

- Full findings, fix batches and per-finding status: `docs/security-report.md` (76 findings; re-verified: 43 fixed, 12 partial, 2 not fixed, 19 deferred). Regression notes R-01..R-10 are in its "Fix status" section.
- API: Better Auth memoized per env; IP limiter stops writing once over the limit; `/api/auth/*` one `auth` bucket, path cap, Origin check; `/api/health`; structured errors (503 only for D1/misconfig); sign-out without body works; reset token 30 min, mail sent via `waitUntil`.
- `auth.ts` returns 503 when `findEnvProblems` (`apps/api/src/env.ts`) reports anything: secret < 32 chars, non-https `WEB_URL`, or only one of the Stripe / Google secret pairs. Check production secrets before deploying.
- Payments: 409 when already owned, idempotent grants, line-item price check, retryable 500 on ungrantable paid sessions.
- Runs: historical scenarios need `full_access` (`canStartRun` in engine), leaderboard split into two indexed queries, decisions normalized, ticket reuse with different decisions returns 409, ranked runs capped at 58 decisions.
- Cron: per-table bounded deletes (2000 rows each) for rate limits, run tickets > 24 h, expired verification rows, guests without a live session, expired sessions; one failing table does not block others. Test signs in a real Better Auth guest.
- CI: Cloudflare token only on D1 bookmark / migrate / deploy steps, actions pinned by SHA (confirm SHAs), `npm audit`, smoke test on `/api/health`, `.github/dependabot.yml`. `wrangler.jsonc` adds `send_email` binding `EMAIL`.
- Web: run-save errors surfaced, register username retry, shared accessible `Modal`, auth form labels, contrast, live regions, reduced motion, plus an "Accesibilidad" panel on Home (reduce motion, disable 1-4/A-D shortcuts, 90 s Crisis Express) pending owner confirmation.
- Owner before deploy: enable Email Routing and `wrangler secret put RESET_EMAIL_FROM` (the binding may break deploy otherwise), add reviewers to GitHub environment `production`, decide gitleaks, crisis difficulty paywall, F-04 password hash vs Paid plan.
- Verification (local only): lint 0, type-check web/api/engine, tests api 86, engine 257, web 681, `test:security` 14, web build OK.

## 2026-11-17 — Scheduled cleanup

- Daily cron `0 4 * * *` (`apps/api/wrangler.jsonc`) runs `cleanupStaleRows` (`apps/api/src/cleanup.ts`) from the Worker `scheduled` handler, in bounded per-table deletes (see security review section above):
  - `api_rate_limits` rows older than the current 1-minute window.
  - Better Auth `rateLimit` rows idle for over 1 hour.
  - Anonymous users with no unexpired session (cascade removes their sessions, accounts and run tickets). Guests cannot buy or save runs, so no purchases or leaderboard rows are lost.
- No index added for these deletes: they run once a day, and an index on `api_rate_limits.window_start` would add a D1 row write to every rate-limited request.
- Tests: `apps/api/src/__tests__/cleanup.test.ts` (api 30/30). Not yet verified on the deployed Worker: the cron starts after the next deploy (deploy is blocked until GitHub has `CLOUDFLARE_API_TOKEN`).

## 2026-11-17 — Supabase leftovers removed

- No code, config or current doc depends on Supabase. `turbo.json` env now lists `VITE_POSTHOG_KEY`, `VITE_OFFLINE_MODE`, `EXPO_PUBLIC_API_URL`; ESLint engine purity rule blocks `better-auth` instead of `@supabase/*`; `.gitignore` and ESLint ignores drop `supabase/` paths.
- Remaining mentions are dated audit reports (`docs/security/*`, `security_best_practices_report.md`, `docs/architecture-plan.md`, `docs/buenas-practicas-2026-11-08.md`, `prompt-audit-report.md`) and the historical sections of this file. They record past state and were left unchanged.

## 2026-11-11 — Security hardening

Phase notes, checklist coverage and open follow-ups: `docs/security/hardening-2026-11-11.md`.

- `/api/*` responses carry HSTS, CSP, X-Frame-Options, nosniff and Referrer-Policy (`apps/api/src/http.ts`). CSP is enforced in `apps/web/public/_headers`; Google Fonts removed.
- PATCH `/api/profile`: 5/min per user, username pattern `^[\p{L}\p{N}_.-]{3,24}$` (same check in web registration). Public GETs are IP rate limited. Non-GET `/api/auth/*` bodies are size capped. Run tickets expire after 24h.
- k6 API load: `npm run test:load:api` against a local `wrangler dev` only (refuses other hosts). Local dev Worker needs `--var BETTER_AUTH_SECRET:<random>` and `--var WEB_URL:http://localhost:8787`.
- Verification: lint 0 errors; type-check engine, web, api; tests engine 252, web 623, api 27; `npm run test:security` passes. Local only: not proof of remote config.
- Sign-up shows a neutral message for an existing email (UI only; the API still distinguishes).
- 2026-11-17: deleted 2 test guest users from remote D1; removed unused GitHub secrets (FLY_API_TOKEN, VITA_SUPABASE_*); set CLOUDFLARE_ACCOUNT_ID. Still missing: GitHub CLOUDFLARE_API_TOKEN and VITE_POSTHOG_KEY; Worker secrets STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET. `tar` audit warning accepted (SEC-025).
- Open: API-level auth enumeration (needs email verification), Origin-less requests accepted, Stripe refunds not handled.

## 2026-11-09 — Cloudflare migration

Branch `feat/cloudflare-migration`. Supabase and Fly.io were removed entirely. Everything below this section that mentions Supabase, Fly, nginx, Docker, Edge functions or migrations 001-011 is **historical** (state on 2026-11-08) and kept for context only. Do not follow its deployment steps.

### What changed

- Backend is `apps/api/`: one Cloudflare Worker (`apps/api/src/index.ts`) serving `/api/*` (start-run, submit-run, create-checkout, stripe-webhook, leaderboard, username-available, profile GET/PATCH, runs, entitlements) and Better Auth 1.7 at `/api/auth/*` (email + password, anonymous guest plugin, optional Google).
- The web build (`apps/web/dist`) is served by Workers Static Assets with SPA fallback. `/api/*` and `/assets/*` run the Worker first; a missing hashed asset returns 404 instead of SPA HTML.
- Database is Cloudflare D1 `republica-en-llamas`. Migrations are in `apps/api/migrations/` (`0001_init.sql`, applied remotely). It started from zero data: no Supabase data was migrated.
- Live URL: https://republica-en-llamas.ilandaniele.workers.dev
- Web uses `apps/web/src/lib/api.ts` (`apiSend`, `isOfflineMode`) and `apps/web/src/lib/auth.ts` (better-auth/react client). `useAuth` is the Better Auth session; anonymous sessions count as signed out. Security headers are in `apps/web/public/_headers` (CSP enforced since 2026-11-11, HSTS, etc.).
- Mobile leaderboard fetches `${EXPO_PUBLIC_API_URL}/api/leaderboard`. Mobile type-check was not run.
- Only `VITE_POSTHOG_KEY` and `VITE_OFFLINE_MODE` remain as `VITE_*` vars (public, baked at build).
- `scripts/generate-images.ts` writes to `apps/web/public/illustrations/` (served by Workers Static Assets) instead of Supabase Storage (2026-11-17).

### Commands

```sh
npm run dev --workspace=apps/api            # wrangler dev, port 8787; web vite dev proxies /api to it
npm run db:migrate:local --workspace=apps/api
npm run db:migrate                          # remote D1
npm run deploy                              # build web + wrangler deploy
npm run test:security                       # apps/api vitest + load/k6 harness tests
```

Deploy: `.github/workflows/deploy.yml` on push to `main` builds web (`VITE_POSTHOG_KEY`), runs `npm run db:migrate`, then `npm run deploy --workspace=apps/api`.

### Security finding fixed in this branch

With no `BETTER_AUTH_SECRET`, the deployed Worker used Better Auth's public default secret, which allows session forgery. Fix: `createAuth` throws if the secret is shorter than 32 characters and the API answers 503 (fail closed). A random 48-byte secret was set with `wrangler secret put`. Also fixed: a missing `/assets/*.js` returned 200 with SPA HTML. Tests: `apps/api/src/__tests__/api.test.ts` (15 tests). Details in `security_best_practices_report.md`.

### Verification (local, plus live smoke)

- Lint 0 errors. Type-check passes for game-engine, web and api.
- Tests: engine 252/252, web 613/613, api 15/15. `npm run test:security` passes. Web build OK.
- Live smoke on the workers.dev URL: `/` 200, `/api/leaderboard` `[]`, `/api/profile` 401, `/api/auth/get-session` null, `/api/nope` 404, home renders with no console errors.
- Local tests do not prove remote configuration (secrets, Google/Stripe dashboards, email binding, headers behind the real edge). Those need checking on the deployed Worker.

### Owner leftovers (manual)

1. Done 2026-11-26 with the owner's confirmation: Fly app `republica-en-llamas` destroyed (`fly apps destroy`, absent from `fly apps list`) and Supabase project `djlamsrefnyforzhjeip` deleted from the dashboard (absent from the org's project list).
2. Done (checked 2026-11-26): GitHub secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` set, deploy job green. `VITE_POSTHOG_KEY` optional, not set.
3. Done (checked 2026-11-26): Worker secrets `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` set. Email reset closed as not applicable (no domain).
4. Done: Google OAuth redirect `<url>/api/auth/callback/google` and Stripe webhook `<url>/api/stripe-webhook` (events `checkout.session.completed`, `charge.refunded`) configured earlier.
5. Closed 2026-11-25: the two probe guests are gone (scheduled cleanup removed them); remote D1 holds only one guest with a live session and two real accounts.
6. Accepted risk 2026-11-26 (owner keeps `apps/mobile` frozen, app unpublished): `tar` and the other `npm audit` advisories all come from Expo / react-native tooling; web, api and engine pass `npm audit --audit-level=high` in CI.

## Estado del proyecto (histórico, 2026-11-08)

Rama de trabajo: `feat/casa-rosada-diorama`. Motor TypeScript puro, web React 19/Vite 8, Supabase Edge/Postgres. La app móvil se conserva sin cambios funcionales de esta iteración.

Quedaron integrados el diorama animado y sus imágenes, doce personajes, agendas y escenarios, mejoras de fuentes, Congreso, inflación, debate presidencial, escrutinio con mapa real y modo Carrera: intendente → gobernador → ministro nacional → presidente. Carrera permite elegir tres cargos iniciales y guarda progreso local, fuera del ranking competitivo.

Las imágenes necesarias para jugar están en `apps/web/public/illustrations/` y las fuentes locales/licencias en `apps/web/public/fonts/`. Los originales de `art/raw/`, cachés, node_modules, builds y resultados temporales permanecen locales e ignorados; no hacen falta para ejecutar la web. No modificar `art/prompts.json` ni `art/PROMPTS.md` sin un pedido nuevo.

## Preparar y probar

Usar Node de `.nvmrc` y npm workspaces desde la raíz:

```sh
npm ci --legacy-peer-deps
npm run playtest --workspace=apps/web
```

Playtest abre en `http://127.0.0.1:5174/`. Es un modo de desarrollo sin tickets, compras reales, ranking remoto ni analytics. Producción no habilita esas excepciones. Milei, Massa y Kicillof son gratuitos; los demás requieren compra según las reglas compartidas.

Verificaciones:

```sh
npm run lint
npm run type-check --workspace=packages/game-engine
npm run type-check --workspace=packages/ui
npm run type-check --workspace=apps/web
npm test
npm run test:security
npm run verify:content
npm run build
```

Último resultado previo al commit: 252 pruebas del motor, 626 web y 46 de seguridad/SQL/harness, 924 en total. Los tipos de motor/UI/web y el build global pasan. `npm run type-check` global conserva tres errores anteriores en móvil: tipos de propiedades de analytics y referencia inexistente `restoreFromTurn`. No confundir el build global con un build de Expo: móvil no define tarea `build`.

(Histórico: `test:security` ahora ejecuta `apps/api` con vitest más los tests del harness de carga; ya no usa PGlite ni bundle de Edge functions.) `test:security` genera un bundle nuevo del motor antes de ejecutar handlers con servicios externos simulados y SQL real en PGlite. No necesita Docker. Sin k6 se omiten explícitamente tres guard-tests; con k6 también puede correrse `npm run test:load`. Los seis perfiles cortos pasaron con 1.354 solicitudes locales; no prueban capacidad real de Supabase, navegador ni nginx. No se ejecutó soak de dos horas.

## Seguridad y orden de publicación (histórico, superado por la migración a Cloudflare)

> **Superseded 2026-11-09.** Supabase, Fly.io, the 010/011 migrations and the Edge-function deploy order below no longer apply: the backend is now a Cloudflare Worker + D1 (see the Cloudflare migration section at the top). Kept as history.

Estado al 9 de noviembre de 2026: PR #39 mergeado y web desplegada en Fly por GitHub Actions (CI y Deploy en verde). **No se aplicaron migraciones 010/011 ni se desplegaron funciones**: el proyecto Supabase `djlamsrefnyforzhjeip` está INACTIVE (pausado) y debe restaurarlo el dueño. Hasta entonces la web nueva corre contra funciones viejas. Escaneo público Cloudflare Radar `b1210dfb-3147-4c30-ba87-c4c3db8c39b0`: 0 riesgos; 3 violaciones CORS de fuentes Google causadas por la cabecera `signature-input` del propio escáner, no por el sitio.

Antes de publicar el backend:

1. Revisar y aplicar `supabase/migrations/010_api_security.sql` en staging antes de desplegar las funciones que usan sus RPC. Sin esos RPC, los limitadores nuevos fallan cerrado con 503. Aplicar después `011_ticket_caps_and_private_usernames.sql` antes de desplegar `start-run` y `claim-run-ticket`: cambia las firmas de `issue_run_ticket`/`claim_run_ticket` (cupo gratuito de 3, tickets reclamados, usernames neutros).
2. Configurar orígenes exactos, límites de Supabase Auth y cabecera IP saneada por el gateway. No confiar en un `X-Forwarded-For` arbitrario. Programar limpieza administrativa de contadores.
3. Agregar la URL exacta `/reset-password` a la allowlist de Supabase y probar expiración, uso único y revocación de sesiones. La UI no configura el vencimiento del servidor.
4. Desplegar funciones con el bundle actual del motor y verificar JWT del gateway y firma Stripe. Después probar web, dos cuentas, compras en modo test, tickets y replay.

CSP permanece report-only; su enforcement requiere pruebas publicadas. Los tokens de la SPA siguen administrados por Supabase en Web Storage según Recordarme, no son HttpOnly. La dependencia `tar` del toolchain de Expo/cacache conserva un aviso crítico; no se forzaron upgrades mayores de Expo. Quedan cinco avisos en el reporte acotado a web, sin críticos, y 71 en el reporte global de la última auditoría.

## Claude Security oficial (histórico)

> The F1-F4 findings below were raised against the Supabase code. Their fixes (migration 011, `start-run`/`claim-run-ticket`) were removed with Supabase. Server-side daily ticket caps (3 free, 30 with `full_access`) exist in `apps/api/src/tickets.ts`; neutral usernames for Google sign-in and guest ticket claiming were not re-verified against the Worker. Re-verify before treating F1-F4 as closed.

Se ejecutó el pipeline oficial completo con esfuerzo medio tras aceptación expresa del coste. Informe y artefactos en `CLAUDE-SECURITY-20261108-065217/`: Markdown, JSONL, SARIF y sello `2664bccc7212-dirty`. Se incluyen expresamente en el commit para que estén disponibles al abrir el repo en otro entorno; la carpeta mantiene su `.gitignore` original.

El renderer registra `verified`, 32/32 investigadores retornados y cuatro hallazgos bajos. Son tres causas aún pendientes:

- F1: username OAuth derivado del email puede exponer su parte local en el ranking.
- F2/F3: la antigüedad de tickets invitados permite eludir el cupo al reclamarlos; dos ubicaciones de una misma causa.
- F4: el cupo gratuito de tres partidas depende de localStorage y no coincide con el límite general de 30 tickets del servidor.

Ese informe describe el árbol **antes de este commit**, incluyendo cambios locales; el hash antiguo de su sello es evidencia histórica, no una afirmación de haber auditado el commit de entrega. No se aplicaron sus parches. La cobertura no garantiza lectura de todos los archivos nuevos sin seguimiento. Arte, configuración local y docs fueron apartados; varios archivos de contenido/tests/salidas solo se buscaron parcialmente. El escaneo fue estático, sin exploits ni tráfico al backend.

STRIX quedó excluido por el usuario: no ejecutarlo. No repetir el escaneo costoso por rutina; ya hay resultados para trabajar. Si se necesita otra ejecución en esta máquina, el Python real existe, pero sus alias de Windows pueden estar rotos; el último escaneo usó un launcher temporal por proceso, sin cambiar PATH global.

## Documentación de apoyo

- `docs/playtest.md`: recorridos para probar.
- `docs/carrera-politica.md`, `docs/debate-presidencial.md`, `docs/escrutinio-presidencial.md`: reglas y verificación de las funciones nuevas.
- `docs/security/backend-audit.md`, `frontend-audit.md`, `testing-audit.md`: cambios, pruebas y límites.
- `docs/architecture-plan.md`: decisión previa C, híbrida liviana; no migrar toda la arquitectura sin un pedido nuevo.
- `docs/buenas-practicas-2026-11-08.md`: auditoría previa; algunas cifras son antecedentes y quedan superadas por este cierre.

La revisión visual real en navegador y los servicios publicados siguen pendientes (nginx/contenedor ya no existen tras la migración a Cloudflare). No describirlos como probados por los tests jsdom ni por las mediciones de loopback.
