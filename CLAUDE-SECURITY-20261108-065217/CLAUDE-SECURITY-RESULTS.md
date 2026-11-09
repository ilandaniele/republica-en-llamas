# Claude Security results

Whole-repository scan of `C:\Users\Ilan\Desktop\Proyectos\republica-en-llamas` (branch `feat/casa-rosada-diorama`, commit `2664bccc72128611bab6ce26f4f83c0586b28583`) at medium effort, started 2026-11-08 06:52 UTC. The repository's working tree held uncommitted changes or untracked files when the scan ran. Four findings survived verification, all LOW: one privacy leak through the public leaderboard, and three abuse-of-limits issues around run tickets and the free-tier daily cap. No finding allows account takeover, code execution, payment bypass or exposure of secrets. The revision stamp is self-reported by the scan helper.

## Coverage

**How the run was sized.** The target held 325 tracked files, so the inventory was asked for about 13 components of roughly 25 files each (cap 24). It produced 10 components, plus a pass over the files outside every component. 32 researchers were dispatched and all 32 returned. Each component was read under three lenses: injection and input handling, authentication and authorization, and cryptography and secrets.

**Components scanned.** `edge-functions` (`supabase/functions`), `supabase-db` (`supabase/migrations`, `supabase/config.toml`), `web-auth-payments` (web auth screens, `apps/web/src/app`, `BuyButton`, `PaywallModal`, `UserMenu`), `web-lib-hooks` (web `lib`, `hooks`, `stores`, `App.tsx`, `main.tsx`, `features/history`, `features/game`), `web-deploy-config` (`index.html`, `nginx.conf`, `package.json`, env example, `public`, `src/test`, `src/assets`), `game-engine-core` (`packages/game-engine/src`), `mobile-app` (`apps/mobile`), `ci-and-scripts` (`.github`, `scripts`, `.husky`), `web-illustrations` (illustrations and casa-rosada components), `ui-package` (`packages/ui`).

**Completeness check.** `checked`: all 9 top-level directories are accounted for, each scanned or explicitly skipped. The verification panel took 1 run. No candidate was lost and none went unverified.

**Deliberately not examined.**
- `art` — raw art inputs, including Chromium profile data and model files; not application code.
- `.claude` — local editor and agent settings, not product code.
- `docs` — documentation only.

**Memory-safety lens not applied.** For these groups none of the researchers was asked about memory-safety bugs: `ui-package`, `mobile-app`, `edge-functions`, `game-engine-core`, `web-auth-payments`, `web-illustrations`, `supabase-db`, `web-lib-hooks`, `ci-and-scripts`. The workflow decided this from the inventory's language alone, before briefing the researchers, because it took the code to be all in managed languages.

**What the researchers say they did not read (their account, not verified fact).**
- Tests (`__tests__` directories and test files in every web and engine component): not reviewed.
- Static art and content: `apps/web/src/components/illustrations` scene, portrait and character components, `casa-rosada` layer files, `packages/game-engine/src/events` card data and `i18n` strings, and most `packages/game-engine/src/*.ts` helpers (`scoring`, `crises`, `inflation`, `shocks`, etc.). These were grep-checked for injection sinks, secrets and risky APIs, not read in full.
- `apps/web/src/features/game` outside the files listed as read: grep-checked for sinks only.
- `apps/web/public` binaries (images, fonts): enumerated, not opened.
- `supabase/functions/_shared/game-engine.js`: a 640KB bundled copy of the engine; only the request-handling and replay functions were read.
- `.github/copilot-instructions.md`, `.github/instructions`, `.github/prompts`: searched for prompt-injection phrases only.
- Generated or build output: `scripts/security/results`, `.husky/_`, `scripts/__pycache__`, `packages/ui/dist`, `packages/ui/.turbo`, `supabase/.temp`.

Checked against the tracked files inside the components: 278 files, 111 read to a conclusion, 167 under a declared not-reached path, 0 unaccounted for. 47 tracked files lie outside every component (the skipped areas above plus root files); the sweep over them returned.

**Untracked-file limitation.** The 325-file count, the component sizing and the 278-file tree check come from `git ls-files`, so untracked files are not in those tallies. Researchers read the working tree and their accounts show they opened some untracked files, but the completeness check cannot confirm that every untracked source file was read. Treat untracked code as less reliably covered than tracked code. `.env` files and credential stores were not read.

## Findings

### F1 — Email local part becomes the public leaderboard username for OAuth signups (partial email disclosure to anon) (LOW, confidence medium)

**Impact.** Anyone with the public anon key can harvest the email local parts of OAuth users, which for `gmail.com` accounts is effectively the full address, linked to a user id and game history. This enables phishing and spam targeting. The user can rename later, but the default is exposed from their first completed run.

**Where.** `supabase/migrations/009_anonymous_guests.sql:18` in `handle_new_user` — CWE-359

**What.** `handle_new_user` falls back to `split_part(new.email, '@', 1)` as `profiles.username` when signup metadata has no username, which is always the case for Google OAuth; the web app never prompts for one. The anon-readable leaderboard view (`004_security_and_indexes.sql:64-72`, granted to anon at line 72) is owned by the migration role, bypasses `profiles` RLS, and exposes `username` for every user with a completed run.

**Exploit scenario.** A Google-signed-in player finishes a run. Their profile row holds their email local part as username. An unauthenticated caller queries the leaderboard view through PostgREST (`select=username,user_id,avatar_url`) and collects these values in bulk. `username_available('<guess>')` also confirms whether a given local part is registered. The comment in migration 005 and `docs/security/backend-audit.md` state that profiles are private and the view exposes no emails; this path contradicts that.

**Preconditions.**
- The user signed up through Google OAuth (or any path without `raw_user_meta_data.username`) and did not rename.
- The user has at least one completed run, so a leaderboard row exists.
- No credential is needed: the anon key is public.

**Fix.** Do not derive the public username from the email. Generate a neutral handle such as `jugador_` plus a random suffix, or require the user to choose a username before the profile is public. Keep the leaderboard view's `username` limited to values users chose. Backfill existing profiles whose username equals their email local part.

**Verification.** 3/3 lens verifiers confirmed. The panel lowered the severity from MEDIUM to LOW (confirming votes: LOW, LOW, LOW).

### F2 — Daily ticket cap on seed shopping is bypassed by minting tickets on throwaway guest accounts and claiming them (LOW, confidence medium)

**Impact.** Players can choose favourable seeds without bound, which defeats the per-user daily limit added in migration 008. The effect is limited to leaderboard fairness: a bot using the public engine can already play any known seed optimally, and there is no confidentiality or account-level harm.

**Where.** `supabase/functions/claim-run-ticket/index.ts:35` in the `Deno.serve` handler — CWE-799

**What.** `start-run` issues tickets to any anonymous Supabase user, and the web client creates anonymous users at will with `signInAnonymously`. `claim-run-ticket` moves a guest's ticket to the caller's real account, and its only gate is a count of the target's tickets created in the last day. The claim keeps the ticket's original `created_at`, so tickets minted more than 24 hours earlier are not counted and can be claimed without limit.

**Exploit scenario.** The attacker signs in anonymously many times, one guest per session. Each guest calls `start-run` up to 30 times a day and records the server-chosen seeds (0..999999). The attacker finds the best seeds offline with the public engine, then signs into a real account and calls `claim-run-ticket` (10 per minute) with each guest's token. Tickets older than a day add nothing to the target's count, so the cap never triggers. `submit-run` accepts a run for the chosen seed because the ticket now belongs to the real user.

**Preconditions.**
- Supabase anonymous sign-ins are enabled (the web client relies on them).
- The attacker can create multiple guest sessions, limited only by Auth rate limits and the optional IP limiter.
- The attacker holds a real, non-anonymous account to claim into.

**Fix.** Count tickets the target has claimed or been issued over a fixed window, for example with a `claimed_at` column, instead of the original `created_at`. Limit anonymous ticket issuance per IP and in total, and expire unclaimed or unused tickets after a short TTL.

**Verification.** 3/3 lens verifiers confirmed.

### F3 — Per-user daily ticket cap, meant to stop seed shopping, is bypassed with disposable anonymous accounts and `claim_run_ticket` (LOW, confidence medium)

**Impact.** Leaderboard integrity: the server-issued random seed no longer constrains seed selection, so top scores can be farmed by seed shopping. No data disclosure and no account takeover.

**Where.** `supabase/migrations/009_anonymous_guests.sql:46` in `claim_run_ticket` — CWE-799

**What.** This is the SQL side of the same weakness as F2, reported separately by a second researcher. Migration 008 caps tickets per user per day, but `start-run` also issues tickets to anonymous users, and `claim_run_ticket` reassigns any guest's ticket to a real account (`update public.run_tickets set user_id = p_to_user`). The cap counts only tickets whose original `created_at` is within one day, and tickets never expire, so the bound does not hold across many guest identities.

**Exploit scenario.** The attacker scripts `signInAnonymously` repeatedly, calls `start-run` up to 30 times per guest, replays the public engine offline to find which seeds score best, then claims only the winning ticket into their real account and submits a run for it.

**Preconditions.**
- Anonymous sign-ins are enabled (the web app calls `signInAnonymously`).
- The attacker can create many anonymous sessions, limited only by Supabase's per-IP Auth rate limit.
- Per-IP throttling in the edge functions is off unless `TRUSTED_CLIENT_IP_HEADER` is set.

**Fix.** Do not issue tickets to anonymous users beyond a small global cap, or key the issuance cap on something anonymous sessions cannot multiply. Give tickets an expiry and make `claim_run_ticket` reject tickets older than the window. Count claimed tickets against the target using a `claimed_at` timestamp. Fixing F2 and F3 together addresses one root cause.

**Verification.** 2/3 lens verifiers confirmed.

### F4 — Free-tier daily run cap enforced only from client localStorage; server grants up to 30 tickets/day to everyone (LOW, confidence medium)

**Impact.** A non-paying user can bypass a monetization gate and start unlimited runs per day without `full_access`. No confidentiality loss, and ranked saves stay bounded by the server cap of 30 tickets per day.

**Where.** `apps/web/src/hooks/useEntitlements.ts:24` in `getDailyRunsRemaining` — CWE-602

**What.** The 3-runs-per-day gate, which `HomeScreen` turns into `dailyLimitReached`, is computed from the user-writable localStorage key `rep_daily_runs`, so deleting or editing it (or patching the JS) resets the count. `start-run` and `issue_run_ticket` apply the same `DAILY_TICKET_LIMIT=30` to every user regardless of entitlement, so the server never enforces the free cap.

**Exploit scenario.** A non-paying user clears or rewrites `rep_daily_runs` in DevTools before each launch. The daily-limit paywall never appears, so they start unlimited runs. `start-run` keeps issuing tickets up to 30 per day and `submit-run` saves them.

**Preconditions.**
- The attacker has a browser and can edit localStorage or the client bundle.
- The 3/day cap is meant as a paid-tier restriction.

**Fix.** If the cap is a real entitlement, enforce it in `start-run` and `issue_run_ticket` with a lower daily limit for users without `full_access`, and keep the localStorage counter as a UI hint only.

**Verification.** 2/3 lens verifiers confirmed.

## What was verified

Findings came from 32 researchers over 10 components plus the files outside them, then a three-lens panel (reachability, impact, defenses) with a 2-of-3 rule, in one verification run. F1 survived 3/3 votes, F2 3/3, F3 2/3 and F4 2/3. F1's severity was lowered by the panel from MEDIUM to LOW. All 32 researchers returned, so "verified" covers every reading dispatched; it does not cover what the researchers declared unread (listed under Coverage) or untracked files the completeness check cannot see. Nothing in the scan executed the repository's code: no tests ran, no exploit was fired and no backend was called. Every finding is derived from reading. The renderer's `verification.status` is stated in the delivery message, taken from the vote record.
