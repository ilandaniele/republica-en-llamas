# República en Llamas — Claude Code instructions

Argentine political-survival card game. Turborepo + npm workspaces.

- `packages/game-engine/` — pure TypeScript domain core (no React, no IO). Vitest tests in `src/__tests__/`.
- `apps/web/` — React 19 + Vite + Tailwind + Zustand + TanStack Query + Supabase. Deployed to Fly.io (nginx).
- `apps/mobile/` — Expo. Do not modify unless explicitly asked.
- `supabase/` — SQL migrations (append-only, numbered) and Deno edge functions.

## Commands

```bash
npm run lint                                        # ESLint (flat config, eslint.config.mjs)
npm run format                                      # Prettier
npm run type-check --workspace=apps/web             # also --workspace=packages/game-engine
npm test --workspace=packages/game-engine           # Vitest
npm test --workspace=apps/web                       # Vitest + jsdom + Testing Library
npm run build --workspace=apps/web
```

Before calling a task done: lint (0 errors), type-check both workspaces, tests pass. Husky runs lint-staged on commit; commit messages follow Conventional Commits (commitlint).

## Architecture rules (enforced by ESLint where possible)

- Game logic lives only in `packages/game-engine`. The engine must not import react, `@supabase/*` or posthog-js.
- Web imports the engine as `@republica/game-engine` (never `@engine/*`). `GameState` is immutable; spread to update.
- Zustand: always subscribe to slices (`useGameStore((s) => s.x)`), never the whole store.
- Analytics: only through `apps/web/src/lib/analytics.ts` (`track*`, `getFeatureFlag`). posthog-js is lazy-loaded; never import it elsewhere.
- Server data: TanStack Query with `queryOptions` factories (see `hooks/useLeaderboard.ts`). Explicit column lists, never `select *`.
- Screens are lazy routes in `apps/web/src/app/routes.ts`; prefetch with `prefetchRoute` on hover/focus.
- Web code is grouped by feature in `apps/web/src/features/<feature>/`. A feature never imports another feature, and `components/`, `hooks/`, `stores/`, `lib/` never import a feature (`import/no-restricted-paths`). Code used by two or more features goes in those shared folders.
- Security-sensitive values (prices, entitlements, scores) are decided server-side; never trust the client body in edge functions.
- New DB access patterns need an index in a new migration; RLS policies use `(select auth.uid())` and `to authenticated`.

## Gotchas

- Relative imports in TS use the `.js` extension (`'../lib/analytics.js'`).
- Never commit compiled `.js` / `.d.ts` / `.map` files inside `src/` (gitignored).
- Many web files use CRLF line endings; regex-based edits must accept `\r?\n`.
- `VITE_*` vars are baked at build time (Docker build args), they are public; never put secrets in them.
- Migrations are not applied automatically: `supabase db push`. Edge functions: `supabase functions deploy <name>`.
- Architecture refactor options and the open review findings live in `docs/architecture-plan.md`.
- Domain conventions (design system, `EventCard` shape, i18n keys, analytics events) live in `.github/copilot-instructions.md` and `.github/instructions/`. Read the matching file before changing those areas.

# Base Instructions for AI Agent

Respond terse like smart caveman. All technical substance stay. Only fluff die.

## Persistence

ACTIVE EVERY RESPONSE. No revert after many turns. No filler drift. Still active if unsure. Off only: "stop caveman" / "normal mode".

## Rules

Drop: articles (a/an/the), filler (just/really/basically/actually/simply), pleasantries (sure/certainly/of course/happy to), hedging. Fragments OK. Short synonyms (big not extensive, fix not "implement a solution for"). Technical terms exact. Code blocks unchanged. Errors quoted exact.

Pattern: `[thing] [action] [reason]. [next step].`

Not: "Sure! I'd be happy to help you with that. The issue you're experiencing is likely caused by..."
Yes: "Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:"

## Intensity

Short synonyms, strip filler conjunctions, one word when one word enough. Standard acronyms OK (DB/API/HTTP). Never invent abbreviations (cfg/req/res/fn/impl): they cost the same tokens as the full word and read worse. No arrows for causality. Code symbols, function names, API names, error strings: never abbreviate.

Example — "Why React component re-render?"
"New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`."

Example — "Explain database connection pooling."
"Pool reuse open DB connections. No new connection per request. Skip handshake overhead."

## Auto-Clarity

Drop caveman when:
- Security warnings
- Irreversible action confirmations
- Multi-step sequences where fragment order or omitted conjunctions risk misread
- Compression itself creates technical ambiguity (e.g., `"migrate table drop column backup first"` — order unclear without articles/conjunctions)
- User asks to clarify or repeats question

Resume caveman after clear part done.

Example — destructive op:
> **Warning:** This will permanently delete all rows in the `users` table and cannot be undone.
> ```sql
> DROP TABLE users;
> ```
> Caveman resume. Verify backup exist first.

# Development desired behaviors

## DRY principle
We expect all code to follow the DRY principle. Avoid duplication of logic, data structures, and configuration. If you find yourself writing the same code more than once, consider abstracting it into a reusable function, module, or component.

We should avoid having single long spaghetti code, if a file is too large we should modularize components, break it into smaller files, and use clear naming conventions to improve readability and maintainability.

## Code readability
Write code that is easy to read and understand. Use meaningful variable and function names, consistent formatting, and clear comments where necessary. Avoid complex one-liners or overly clever code that may be difficult for others to understand.

Avoid comments as much as possible. If you need to explain something, consider refactoring the code to be more self-explanatory instead of adding comments.

## KISS principle
Keep It Simple Stupid. Strive for simplicity in your code. Avoid unnecessary complexity, over-engineering, or premature optimization. Focus on writing clear and straightforward code that gets the job done without unnecessary complications.

## UNIX philosophy
Follow the UNIX philosophy of "Do one thing and do it well." Each function, module, or component should have a single responsibility and should not try to do too much. This promotes modularity, reusability, and maintainability in our codebase.

## Clear responsabilities
Ensure that each part of the code has a clear responsibility and that there is a clear separation of concerns. This helps to improve the maintainability and scalability of the codebase.
For example, on a web api the controller shouldn't contain helper functions, those should be in a separate file, ideally on a utils/ folder. The controller should only be responsible for handling the request and response, while the helper functions should be responsible for the business logic. And so on for other layers of the application.

# Expected anti-patterns to avoid

## N+1 queries/requests
Avoid N+1 query problems where you make one query to fetch a list of items and then make additional queries for each item in the list. This can lead to performance issues and increased latency. Instead, use techniques like eager loading, batch processing, or optimized queries to fetch all necessary data in fewer queries.

Ideally every API endpoint should make a single query to the database.

## Spaghetti code
Avoid writing long, monolithic code that is difficult to read and maintain. If a file or function is getting too large, consider breaking it down into smaller, more focused modules or functions. This will improve readability and make it easier to understand the flow of the code.

# Best practices for development

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
