# Security hardening — 2026-11-11

Branch `feat/cloudflare-migration`. Stack: Cloudflare Worker (`apps/api`, Better Auth 1.7 + D1) serving the
static SPA (`apps/web`). Every result below comes from local runs (vitest, `wrangler dev` + miniflare D1, k6
against `http://localhost:8787`). Local results do not prove the remote Cloudflare configuration.

## Phase log

| Phase | What ran | Result |
| --- | --- | --- |
| F0 | Claude Security scan (whole repo, medium effort) | 2 findings. F1 fixed. F2 (auth enumeration) mitigated in the UI with a neutral message; API still distinguishes |
| F1 | Security headers on `/api/*` (`withSecurityHeaders`), CSP enforced in `_headers`, Google Fonts removed | Headers present on `/api/leaderboard` and `/api/auth/*`; no CSP violations in the guest flow |
| F1 | Form fixes: reset token stripped from URL, password min 8, PostHog input masking | Tests added (PasswordResetScreen, analytics) |
| F2 | Mapper audit of every Worker route | Gaps listed below |
| F2 | PATCH `/api/profile`: per-user rate limit (5/min) and Unicode username pattern `^[\p{L}\p{N}_.-]{3,24}$` | API tests: 6 invalid names return 400, 6th rename returns 429 |
| F2 | IP rate limit on public GETs (leaderboard, username-available) | Test: 121st read from one IP returns 429 |
| F2 | Body cap on `/api/auth/*`, counted on the stream | Tests: 5000-byte sign-up returns 413, with and without `content-length` |
| F2 | Run tickets expire after 24h | Test: ticket created 2 days ago returns 403 |
| F2 | Web registration validates the same username pattern | `validateRegistration.test.ts` |
| F3 | k6 API load (smoke, load, peak, stress) on local `wrangler dev` | All PASS; p95 18.5–29 ms, 0 5xx; 429s are expected rate limiting |
| F5 | Security review (VibeSec checks) and clean-code review of the diff (subagents) | Fixed: chunked auth body bypass, k6 leaderboard check now accepts 429, web validator trims once. No SQL injection, IDOR, ReDoS or secrets found |

## Checklist coverage

| Item | Status |
| --- | --- |
| CSRF / input validation | Better Auth checks Origin against `trustedOrigins`; Worker routes check Origin on writes and validate bodies with size caps |
| RLS equivalent | Every D1 query binds the session user id from `sessionUser` |
| CORS | No `Access-Control-Allow-Origin` emitted, `OPTIONS` returns 404: same-origin only |
| Env vars | Secrets via `wrangler secret put`; `VITE_*` values are public by design |
| Rate limiting | Better Auth built-in (sign-in 3/10s), per-user D1 limits, per-IP limits on public GETs, daily ticket cap |
| Sanitization / XSS | React escaping, enforced CSP, username charset restricted |
| Auth / authorization | `requireAccount` / `sessionUser` on every private route; anonymous users cannot write profiles |
| Error leaks | `RequestError` returns generic messages; unknown errors return 500 without stack |
| Sessions / tokens | httpOnly, SameSite=Lax, Secure on https; 7-day session; reset token 1h, single use |
| Password hashing | scrypt (Better Auth default) |
| Helmet equivalent | `SECURITY_HEADERS` in `apps/api/src/http.ts` plus `_headers` for assets |
| GET/POST data exposure | Explicit column lists. Leaderboard returns opaque `user_id` (accepted risk, used to highlight the viewer) |
| DNS / nginx / VPS / SSH | Not applicable: Cloudflare Workers has no server, SSH or reverse proxy to manage |

## Open follow-ups

- Auth enumeration on sign-up (Claude Security F2): UI message is neutral, but the API response still differs for an existing email. Email verification would close it.
- Requests without an `Origin` header pass the Origin check (kept for non-browser clients such as mobile).
- ~~`rate_limits` rows and abandoned anonymous users are never cleaned up~~: daily cron added 2026-11-17 (`apps/api/src/cleanup.ts`).
- Stripe refunds and async payment events are not handled.
- Cache API is a no-op on `*.workers.dev`; edge caching of the leaderboard needs a custom domain.
- Usernames differing by case, confusable scripts or fullwidth forms can coexist: NFKC plus a lowercased unique key in a new migration.
- IP rate limit keys use the full IPv6 address (rotating a /64 gets new buckets) and add one D1 write per public GET. Cloudflare's built-in rate limiting would remove both.
- Username pattern and minimum password length are duplicated between `apps/api` and `apps/web`; a small shared package would stop drift.
- CSP is defined twice (`_headers` and `apps/api/src/http.ts`).
