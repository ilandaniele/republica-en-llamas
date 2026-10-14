# República en Llamas — Claude Code instructions

Argentine political-survival card game. Turborepo + npm workspaces.

- `packages/game-engine/` — pure TypeScript domain core (no React, no IO). Vitest tests in `src/__tests__/`.
- `apps/web/` — React 18 + Vite + Tailwind + Zustand + TanStack Query + Supabase. Deployed to Fly.io (nginx).
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

# Code style

- DRY: no duplicated logic, types or config. Extract shared code into a module or component.
- One responsibility per function, module and component. Split files that grow large.
- Write self-explanatory code instead of comments. Avoid clever one-liners.
- Avoid N+1 requests: one Supabase query per `queryOptions` factory or edge function where possible. Batch with `.in()` or a join, never a query per list item.

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
