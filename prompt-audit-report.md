# Prompt Audit: agent instruction files

Audit date: 2026-10-14. Branch: `fix/congress-timers` (HEAD `19b2750`).

All changes listed in the diff map below were applied in the same commit as this report.

This report replaces the 2026-10-07 audit. That audit covered `.github/` only. Its fixes have since landed (for example, `viral-share-image.prompt.md` is gone and the portrait canvas now reads `200×240`), and it pointed to a `prompt-audit.diff` that no longer existed.

## Assumptions (Step 0)

- **Scope.** All tracked model-facing markdown:
  - `CLAUDE.md`, read by Claude Code.
  - `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, and `.github/prompts/*.prompt.md`, read by GitHub Copilot.
  - `README.md` and `docs/architecture-plan.md` are human documentation and were not audited as prompts.
- **Excluded.** `.claude/settings*.json`, `.mcp.json`, and `.env*` files were not read.
- **Target model.** Claude Opus 5.5 (`claude-opus-5-5`) for `CLAUDE.md`. Copilot users choose their model, so the `.github` files are audited against the same current frontier model.
- **No LLM request code.** The app makes no Anthropic, OpenAI, or other LLM API calls (a grep for `anthropic|openai` in `apps`, `packages`, and `supabase` returns nothing). Group 4 (request config) does not apply. No tool definitions exist, so Group 3 does not apply.
- **Installed plugin.** This session runs the `caveman` plugin, which injects its own response-style rules at session start. Finding H1 depends on that plugin.

## Provenance

- The project section of `CLAUDE.md` (lines 1–41) and the generic sections appended after it (lines 43–176) were all added in `97e112e` (2026-10-07, "chore: add tooling, perf and security baseline"). The appended text is a generic base template, not something written for this repository.
- The `.github` files date from 2026-04-01 to 2026-04-05 (`9f0ad30`, `cd8fa87`, `ad734e5`, `e8db21b`). They were corrected in `97e112e`.

## Summary

- **`CLAUDE.md` contradicts the active style rules.** Its caveman block tells the model to abbreviate words (`req/res/fn/impl`) and use arrows. The installed caveman plugin forbids both. Two conflicting style specs load into every session.
- **`CLAUDE.md` contradicts itself on comments**, and the generic sections repeat each other three times (DRY and spaghetti, KISS and Simplicity First, UNIX and Clear responsibilities). They also describe a web-API controller layer this repository does not have.
- **Three Copilot prompt files use variables that are never substituted.** `${cardId}` and similar bare names are not Copilot prompt variables. Only `${input:name}` is. The model sees the literal text `${cardId}`.
- **One factual error** in `copilot-instructions.md` about how `@republica/game-engine` resolves.
- **Volatile copies of constants** (crisis thresholds, multipliers, lifeline intervals, prices). All are correct today. Each one goes stale silently on the next balance change.

| Confidence | Count |
|---|---|
| High | 4 |
| Medium | 4 |
| Low or flag only | 2 |

## Findings: high confidence

### H1. Caveman block conflicts with the installed caveman plugin

- **Location:** `CLAUDE.md:43–86`. The specific conflict is at `:62`. Pressure capitals are at `:49`.
- **Evidence:** `:62` says "Abbreviate prose words (DB/auth/config/req/res/fn/impl) … arrows for causality (X → Y)". The plugin's session-start rules say "never invent new abbreviations (cfg/impl/req/res/fn)" and "No causal arrows". `:62` also ends with a stray ` |`, which is left over from a table.
- **Pattern:** Group 2 (contradicting instruction files) and Group 1a (`ACTIVE EVERY RESPONSE` in capitals).
- **Why obsolete:** The plugin is the maintained source of this style. The copy in `CLAUDE.md` is an older version. A personal reply style also does not belong in a checked-in project file, because it applies to every contributor's sessions.
- **Action (proposed only):** Delete the block. If the style should also apply on machines without the plugin, move it to `~/.claude/CLAUDE.md` and update it to match the plugin.

### H2. `CLAUDE.md` gives two opposite rules about comments

- **Location:** `CLAUDE.md:96` ("clear comments where necessary") and `CLAUDE.md:98` ("Avoid comments as much as possible").
- **Pattern:** Group 2 contradiction.
- **Why obsolete:** The model must pick one of the two rules each time. `:98` matches how the codebase is written.
- **Action:** Keep only the `:98` rule (covered by the M1 hunk).

### H3. Copilot prompts reference undefined variables

- **Location:**
  - `.github/prompts/add-event.prompt.md:24–28, 40–43`
  - `.github/prompts/add-historical-scenario.prompt.md:22, 39`
  - `.github/prompts/add-president.prompt.md:21, 33, 37, 43`
- **Evidence:** Copilot prompt files substitute only `${input:name}` (and built-ins such as `${file}`). Each of these files declares `${input:cardId:…}`, `${input:scenarioId:…}`, and so on in its Inputs section, then uses bare `${cardId}` and `${scenarioId}` in the body. `add-ab-test.prompt.md:27, 30` uses the correct `${input:flagName}` form.
- **Pattern:** Group 2 (brittle config: broken template references).
- **Why obsolete:** The model receives literal `${cardId}` and has to infer the value. It can write the placeholder into code.
- **Action:** Replace each bare `${name}` with `${input:name}`.

### H4. Wrong description of how the engine package resolves

- **Location:** `.github/copilot-instructions.md:10`.
- **Evidence:** The line says Vite resolves `@republica/game-engine` "via the `paths` alias". The only alias in `apps/web/vite.config.ts:26` and `apps/web/tsconfig.json:13` is `@engine`, which line 14 of the same file forbids. `@republica/game-engine` resolves as an npm workspace package (`packages/game-engine/package.json` has `main` and `exports` set to `./src/*.ts`).
- **Pattern:** Group 2 (volatile specifics, now wrong).
- **Action:** Correct the sentence.

## Findings: medium confidence

### M1. Generic "Development desired behaviors" and "anti-patterns" sections

- **Location:** `CLAUDE.md:88–118`.
- **Evidence:**
  - Generic virtues that the target model applies by default: DRY, readability, KISS, and UNIX philosophy.
  - Internal repeats:
    - `:93` and `:117–118` (spaghetti code).
    - `:100–101` (KISS) and `:132–142` (Simplicity First).
    - `:103–104` (UNIX) and `:106–107` (Clear responsibilities).
  - `:108` uses a web-API controller with a `utils/` folder as its example, and `:115` says "every API endpoint should make a single query". This repository has no API controllers. Data comes from Supabase queries in `queryOptions` factories and from Deno edge functions.
  - The heading has a typo at `:106` ("responsabilities").
- **Pattern:** Group 1c (padding) and Group 2 (verbose, generic content in an always-loaded file).
- **Action:** Replace the section with four repository-specific bullets. The bullets keep each rule the user cares about (DRY, single responsibility, no comments, no N+1) and remove the repeats. Lines 120–176 ("Best practices for development") stay unchanged.

### M2. Claude Code never sees the domain conventions

- **Location:** `CLAUDE.md` (missing content).
- **Evidence:** The design system, `EventCard` shape, i18n key format, and analytics event list exist only in `.github/`, which Claude Code does not load automatically. The rules that both tools need (engine alias, Zustand slices, analytics wrapper) agree between the two files. That agreement is working redundancy and is not cruft.
- **Action:** Add one line to the Gotchas section that points to the `.github` files.

### M3. Volatile constants copied into instructions

- **Location:**
  - `.github/instructions/game-engine.instructions.md:84–93` (`CRISIS_THRESHOLDS`)
  - `.github/instructions/game-engine.instructions.md:119–123` (difficulty multipliers)
  - `.github/copilot-instructions.md:98` (lifeline intervals)
  - `.github/instructions/analytics.instructions.md:47` (prices)
- **Evidence:** All values match `packages/game-engine/src/constants.ts:83–97` and `entitlements.ts` today. They are tuning values, and nothing keeps the copies in sync.
- **Pattern:** Group 2 (volatile specifics).
- **Action (proposed only):** Point to the source constant instead of copying values. The diff keeps the facts the model needs to write a card: balance for `normal` at 1.0, and the price order.

### M4. Full GSAP manual in the always-loaded Copilot file

- **Location:** `.github/copilot-instructions.md:118–138`.
- **Evidence:** The block repeats rules from `gsap-react.instructions.md`, which already loads for every `*.tsx` file. It also teaches ScrollTrigger registration in every file, but nothing in the repository imports `ScrollTrigger`. GSAP itself is used in six files.
- **Pattern:** Group 2 (verbose content in an always-loaded file).
- **Action:** Reduce the block to one paragraph: which library handles what, and where the detailed rules live.

## Findings: low confidence and flags

- **L1. `gsap-scrolltrigger.instructions.md` never loads.** Its `applyTo: "**/*scroll*"` matches no tracked file except itself. The rules are correct and cost nothing until a scroll file exists. **Action:** keep it; no hunk.
- **L2. `@engine` alias is still configured** (`vite.config.ts:26`, `tsconfig.json:13`) while both instruction files forbid using it. This is code, not prompt text. **Action:** none in this audit. Removing the alias would let the lint rule stop guarding it.

## Keep list (checked, no change)

- `CLAUDE.md:1–41`. Every path, command, and rule was checked against the repository and is correct.
- `CLAUDE.md:120–176` ("Best practices for development"). These are behavioral rules specific to how this user works, not model-default virtues.
- `analytics.instructions.md:12–25`. The function list matches the exports of `apps/web/src/lib/analytics.ts` exactly.
- `game-engine.instructions.md` `EventCard` shape and array table, `pixel-components.instructions.md`, `add-ab-test.prompt.md`, and `gsap-react.instructions.md`. All checked against the current code.

## Diff map

| Hunk | Findings |
|---|---|
| `CLAUDE.md` (Gotchas line) | M2 |
| `CLAUDE.md` (caveman block removed, code style rewritten) | H1, H2, M1 |
| `copilot-instructions.md:10` | H4 |
| `copilot-instructions.md:98`, `game-engine.instructions.md`, `analytics.instructions.md` | M3 |
| `copilot-instructions.md` GSAP block | M4 |
| three `*.prompt.md` files | H3 |
