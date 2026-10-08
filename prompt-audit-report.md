# Prompt Audit — `.github` Copilot instructions and prompts

Audit date: 2026-10-07. Repository HEAD: `7876d4a` on `main`.

The proposed changes are in [`prompt-audit.diff`](prompt-audit.diff). Nothing in `.github/` has been modified. `git apply --check prompt-audit.diff` passes from the repository root.

## Assumptions (Step 0)

- **Scope.** All model-facing instruction text in the repository:
  - `.github/copilot-instructions.md`, which is always loaded.
  - `.github/instructions/*.instructions.md`: `analytics`, `game-engine`, `pixel-components`, `gsap-react`, and `gsap-scrolltrigger`. These are path-scoped through `applyTo`.
  - `.github/prompts/*.prompt.md`: `add-ab-test`, `add-historical-scenario`, `add-president`, and `viral-share-image`.
  - `.github/SKILLS.md`, which was merged into the above in `cd8fa87`.
- **Excluded.** `.claude/settings*.json`, `.mcp.json`, and credential files were not read. The GitHub workflows in `.github/workflows/` are CI, not prompts.
- **Target model.** These files are consumed by GitHub Copilot. Copilot users pick the model, so no single model is pinned. The audit assumes a current frontier model, Claude Opus 5.5 (`claude-opus-5-5`). That model follows plain instructions without emphasis, and it reads the repository directly when pointed at a source of truth.
- **No LLM request code.** The repository makes no Anthropic, OpenAI, or other LLM API calls. Group 4 (request-code patterns) does not apply.
- **Non-Claude prompt surface.** `scripts/generate-images.ts` holds FLUX image-generation prompts (`STYLE_SUFFIX`, `CASA_SUFFIX`). These were recorded and not audited. Image-model prompting conventions differ, and this audit proposes no provider change.
- **Language.** TypeScript monorepo (React 18 + Vite web app, pure-TS game engine).

## Provenance

All `.github` instruction and prompt files were written between 2026-04-01 and 2026-04-05 in bulk commits, not in response to specific incidents:

- `9f0ad30` carried most of the original files.
- `8e418b7` renamed the prompt frontmatter key `mode` to `agent`.
- `cd8fa87` merged `SKILLS.md` and wrote all of `analytics.instructions.md`, `add-ab-test`, `add-historical-scenario`, and `viral-share-image`.
- `ad734e5` and `e8db21b` added the GSAP files.

The code has kept moving since. For example, `9511a89` added `isExogenous` to `EventCard`. As a result, most findings are **stale facts**: the instructions describe the code as planned in April, not as it is now. No finding traces back to an old-model workaround that a past incident justified.

## Summary

The highest-impact problem is that **two prompt files describe work that is already done.**

- `viral-share-image.prompt.md` asks Copilot to build a share-image feature that already exists. `ShareImageCard.tsx` is imported and used in `GameOverScreen` (`handleShareImage`, line 168; rendered at line 461), and `html2canvas` is installed. The file also prescribes a wrong `share_type` union and a non-existent `gameState.postMortem.headline`. Running the prompt would duplicate or overwrite working code.
- `add-historical-scenario.prompt.md` offers six scenarios as candidates to add, but all six are already in `HISTORICAL_SCENARIOS`. It also points to the wrong files: `shocks.ts`, a "DifficultyPreset-style object", and `PresidentSelectScreen`. Scenarios are actually defined in `constants.ts` and listed in `HomeScreen`.

The second problem is **wrong specifics in the pixel-art docs.** These docs load whenever someone edits illustrations, so a wrong fact there leads to wrong code every time:

- The portrait canvas is documented as `120×140`. It is `200×240`.
- `PortraitId` is documented with 6 values. It has 12.
- `PixelPortrait` is documented as a `switch`. It is a base-id mapping plus `base === ... &&` lines.
- The keyframes are documented as defined in `theme.css`. They are in `tailwind.config.ts`.
- `BuenosAiresBackground` is documented as taking an opacity prop or class. It positions itself and takes no props.

`add-president.prompt.md` repeats the canvas and switch errors. It also asks Copilot to edit a `PRESIDENT_NAMES` map in `GameScreen`, but that map exists only in `GameOverScreen`.

The third problem is **one unresolved rule conflict.** The rule "never call `posthog.capture()` directly in components" sits in the same commit as three examples that call `posthog.capture('$experiment_started', …)` directly, and `PaywallModal` follows the examples. Git history cannot say which text is newer, so this needs a human decision. It is flagged below and is not in the diff.

### Counts per group

| Group | High | Medium | Flag / Low |
|---|---|---|---|
| 1 — Pressure language, scaffolds, over-specification, fossils | 0 | 3 | 0 |
| 2 — Volatile specifics, contradictions, trigger enumeration | 13 | 0 | 2 flags, 1 low |
| 3 — Tool descriptions | — | — | none (no tool definitions; prompt `description` fields are trigger text and are covered in Group 2) |
| 4 — Request code / subagents | — | — | not applicable |

All Group 2 edits are proposals. Each one corrects text that the repository now contradicts.

## Findings — High confidence

High confidence means the repository directly contradicts the text.

### H1. `viral-share-image.prompt.md` is a fossil of a completed task

- **Location:** `.github/prompts/viral-share-image.prompt.md` (whole file). Specific errors are at `:58` and `:126`.
- **Evidence:**
  - The prompt asks Copilot to create `ShareImageCard` and wire it into the game-over screen. `apps/web/src/components/ShareImageCard.tsx` exists. `GameOverScreen.tsx` imports it, defines `handleShareImage` (line 168), and renders it (line 461). `html2canvas ^1.4.1` is in `apps/web/package.json`.
  - Line 126 prescribes `share_type: 'text' | 'screenshot'`. The real signature at `analytics.ts:63` is `share_type: 'game_over' | 'score' | 'image'`.
  - Line 58 references `gameState.postMortem.headline`, which does not exist.
- **Pattern:** 1d fossil / 2 volatile specifics. This is a one-shot build task left behind after the build.
- **Why obsolete:** A capable model follows the prompt literally. It would create a second share card or overwrite the working one, and it would emit analytics calls that fail type-checking.
- **Action:** Remove the file.

### H2. `add-historical-scenario.prompt.md` targets already-built scenarios and the wrong files

- **Location:** `.github/prompts/add-historical-scenario.prompt.md:3`, `:10–11`, `:20–26`, `:28–34`, `:49–51`, `:53–62`.
- **Evidence:**
  - The `description` field and the reference table list Hiperinflación 1989, Corralito 2001, Convertibilidad, Rodrigazo 1975, Malvinas 1982, and Kirchnerismo boom. All six are already keys of `HISTORICAL_SCENARIOS` (`constants.ts:130`): `hiperinflacion_1989`, `corralito_2001`, `convertibilidad`, `rodrigazo_1975`, `malvinas_1982`, `kirchnerismo_boom`. The map also has three more scenarios.
  - Scenarios are `HistoricalScenarioConfig` entries keyed by `ScenarioId` (union in `types.ts:5`), with `SCENARIO_CALENDARS` (`constants.ts:288`) and an optional `SCENARIO_ARCS` (`constants.ts:304`). They are not a "DifficultyPreset-style object".
  - `shocks.ts` has no scenario references.
  - The scenario list is rendered in `HomeScreen.tsx` from `HISTORICAL_SCENARIOS`, through `startHistoricalScenario` at line 178. It is not in `PresidentSelectScreen`. The "create registry if missing" instruction at line 51 is stale.
- **Pattern:** 2 volatile specifics, plus 2 trigger enumeration. The description routes requests for work that is already done to this prompt.
- **Why obsolete:** The prompt was written before the scenario system existed. Following it now would create a parallel registry and misplaced shocks.
- **Action:** Rewrite the prompt around the real extension points:
  1. Add a `ScenarioId` member.
  2. Add a `HISTORICAL_SCENARIOS` entry.
  3. Add `SCENARIO_CALENDARS` and, optionally, `SCENARIO_ARCS` entries.
  4. Add the `scenario.<id>.label|period|description` i18n keys.

  Keep the historical card-design rules and the FT/BBC translation style. Generalize the description so it does not enumerate scenarios. Add a check that the scenario is not already present.

### H3. `PixelPortrait` specifics are wrong

- **Location:** `.github/instructions/pixel-components.instructions.md:79–87`.
- **Evidence:**
  - The documented `PortraitId` has 6 members. The real union at `PixelPortrait.tsx:7` has 12: `milei`, `massa`, `bullrich`, `bregman`, `schiaretti`, `larreta`, `ingeniero`, `populista`, `tecnocrata`, `izquierda`, `federal`, `corporativo`.
  - There is no `switch`. The component maps archetype ids to a base portrait (for example `ingeniero` to `milei`) and renders with `{base === 'milei' && <MileiPortrait mood={mood} />}`.
  - The canvas is `200×240`, not `120×140`.
- **Pattern:** 2 volatile specifics. A copied type union drifts from its source.
- **Why obsolete:** The code grew six portraits and a different dispatch mechanism after the doc was written.
- **Action:** Point to the type exports in `PixelPortrait.tsx` instead of copying them. Describe the base mapping and the `base === … &&` render line. Correct the canvas size.

### H4. Portrait viewBox is wrong

- **Location:** `.github/instructions/pixel-components.instructions.md:25`.
- **Evidence:** The table says `0 0 120 140`. The portrait components use `viewBox="0 0 200 240"`.
- **Pattern:** 2 volatile specifics.
- **Why obsolete:** The portraits were redrawn at a larger size.
- **Action:** Change the value to `0 0 200 240`.

### H5. "Alphabetical order" export rule contradicts `index.ts`

- **Location:** `.github/instructions/pixel-components.instructions.md:74`.
- **Evidence:** `illustrations/index.ts` exports `PresidentAvatar`, `PoliticalIllustration`, `EconomicIllustration`, … `PixelColectivo`. The list is grouped by kind, not alphabetical.
- **Pattern:** 1d unenforced instruction / 2 contradiction with the repository.
- **Why obsolete:** Nothing enforces the rule and the file never followed it. A literal-minded model may reorder the file.
- **Action:** Say "add an export line for it to `index.ts`".

### H6. Keyframe location is wrong

- **Location:** `.github/instructions/pixel-components.instructions.md:29`.
- **Evidence:** The doc says the keyframes are "defined in `theme.css`". `theme.css` defines only `@keyframes ripple`. All 11 listed animations are defined under `keyframes:` in `apps/web/tailwind.config.ts` (line 63).
- **Pattern:** 2 volatile specifics.
- **Why obsolete:** A model asked to add an animation would edit the wrong file.
- **Action:** Point to `apps/web/tailwind.config.ts`.

### H7. `BuenosAiresBackground` opacity prop does not exist

- **Location:** `.github/instructions/pixel-components.instructions.md:91`.
- **Evidence:** The doc shows an `opacity={0.15}` prop. The component sets `className="fixed inset-0 pointer-events-none z-0"` and `style={{ opacity: 0.15 }}` on itself and takes no props. `GameScreen.tsx:235` renders `<BuenosAiresBackground />`.
- **Pattern:** 2 volatile specifics.
- **Why obsolete:** The component took over its own styling after the doc was written.
- **Action:** Describe the real styling and say that the component takes no props.

### H8. Component enumeration in always-loaded instructions is incomplete

- **Location:** `.github/copilot-instructions.md:77`.
- **Evidence:** Lists 7 components. `illustrations/index.ts` exports 17, including `PixelCharacter`, `CharacterPortrait`, `PresidentCaricature`, `GameOverNewspaper`, and `ArgentinaMapSVG`.
- **Pattern:** 2 volatile specifics. The copied list duplicates `index.ts`.
- **Why obsolete:** A model may build a component that already exists because the list says it does not.
- **Action:** Replace the list with "check `index.ts` for the current list". (This hunk in the diff also contains H9 because the two lines are adjacent.)

### H9. `opacity-15` class instruction conflicts with the component

- **Location:** `.github/copilot-instructions.md:79`.
- **Evidence:** The doc says the component is `fixed inset-0 z-0 pointer-events-none opacity-15`, which implies callers add those classes. The component applies them itself and takes no props (see H7).
- **Pattern:** 2 volatile specifics.
- **Why obsolete:** Same drift as H7. Callers that add classes would have no effect, and readers are misled.
- **Action:** State that the component positions itself and should be rendered as `<BuenosAiresBackground />` with no props, as the first child.

### H10. `EventCard` shape is missing `isExogenous` and mistypes `characterId`

- **Location:** `.github/instructions/game-engine.instructions.md:7–34`, specifically `:24` and the end of the block after `:32`.
- **Evidence:**
  - `types.ts:167` has `characterId?: string`, not `CharacterId`.
  - `9511a89`, the latest feature commit, added `isExogenous?: boolean`. Exogenous cards (foreign wars, pandemics, IMF pressure) bypass the state-aware category multiplier in the draw weights.
  - The instruction file predates that commit.
- **Pattern:** 2 volatile specifics. A copied interface drifts from its source.
- **Why obsolete:** A model writing a card for an external shock would not know that the flag exists.
- **Action:** Add the field and fix the `characterId` type. This is a minimal edit; the inline shape is useful context for card authors. Long term, consider pointing at `types.ts` as the source of truth.

### H11. `add-ab-test` track-call example would not type-check

- **Location:** `.github/prompts/add-ab-test.prompt.md:56–61`.
- **Evidence:**
  - The example `trackPaywallShown({ ab_variant: abVariant })` omits the required `entitlement` and `trigger_point`. The signature is at `analytics.ts:35`: `{ entitlement: string; trigger_point: string; ab_variant?: string }`.
  - The follow-up "check the signature accepts extra properties" is stale, because `ab_variant?` is already there.
- **Pattern:** 2 volatile specifics.
- **Why obsolete:** The signature was updated, but the example was not.
- **Action:** Show the full call. For other track functions, tell the model to add a typed optional property in `analytics.ts`.

### H12. `add-president` portrait instructions are stale

- **Location:** `.github/prompts/add-president.prompt.md:25–26`, `:33`.
- **Evidence:** The prompt specifies a `120×140` canvas and "add a `case` to the switch". It has the same errors as H3 and H4.
- **Pattern:** 2 volatile specifics. The same stale fact is repeated in two files.
- **Why obsolete:** Same drift as H3.
- **Action:** Use the `200×240` canvas and the `{base === '<id>' && <XxxPortrait mood={mood} />}` line.

### H13. `add-president` asks for a non-existent `PRESIDENT_NAMES` in `GameScreen`

- **Location:** `.github/prompts/add-president.prompt.md:3`, `:39–45`, `:56–57`.
- **Evidence:** `PRESIDENT_NAMES` exists only in `GameOverScreen.tsx:112`. `GameScreen.tsx` has no such map.
- **Pattern:** 2 volatile specifics, carried into the trigger description.
- **Why obsolete:** The prompt invites the model to create a duplicate map.
- **Action:** Reference `GameOverScreen` only, in the description, in section 4, and in the checklist.

## Findings — Medium confidence

### M1. Unexplained emphasis: "Follow these rules strictly"

- **Location:** `.github/copilot-instructions.md:32`.
- **Evidence:** `This project uses a **pixel-art aesthetic**. Follow these rules strictly:`
- **Pattern:** 1a pressure language (a booster without a reason).
- **Why obsolete:** Current models follow stated rules without emphasis. Blanket emphasis raises the weight of every rule below it, including ones that are only defaults.
- **Action:** Remove the booster.

### M2. Unexplained emphasis: "Follow these conventions exactly"

- **Location:** `.github/instructions/pixel-components.instructions.md:7`.
- **Evidence:** `… render pixel-art SVG illustrations. Follow these conventions exactly.`
- **Pattern:** 1a pressure language.
- **Why obsolete:** Same as M1. Several of the "exact" conventions below it were wrong (H3–H7), which shows the cost of over-weighting them.
- **Action:** Remove the sentence.

### M3. "Never use `rounded-*`" is a shouted rule for something CSS already enforces

- **Location:** `.github/copilot-instructions.md:67`.
- **Evidence:** `**Never use \`rounded-*\` Tailwind classes**`. `theme.css:32` applies `border-radius: 0 !important` globally. The code base uses `rounded-*` 77 times, and every one of them is already neutralized.
- **Pattern:** 1a pressure language / 1d unenforced instruction.
- **Why obsolete:** The rule is not followed in practice, and violating it has no visible effect. The emphasis spends attention on something the CSS already guarantees.
- **Action:** Rewrite it as a plain fact: `rounded-*` has no effect because of the global rule, so don't add it.

## Flags — need a human decision (not in the diff)

### F1. `posthog.capture()` ban conflicts with `$experiment_started` examples

- **Location:**
  - The rule: `.github/instructions/analytics.instructions.md:7` and `.github/copilot-instructions.md:102`.
  - The conflicting examples: `analytics.instructions.md:36`, `copilot-instructions.md:109`, and `add-ab-test.prompt.md:30`.
- **Evidence:** The rule says never call `posthog.capture()` directly in components. The examples call `posthog.capture('$experiment_started', …)` inside a component. `PaywallModal.tsx:18–30` follows the examples. All five passages come from the same commit (`cd8fa87`), so blame cannot order them.
- **Options:**
  - (a) Add a `trackExperimentStarted(flag, variant)` wrapper to `analytics.ts` and update the examples and `PaywallModal`.
  - (b) Add an explicit exemption to the rule: "except `$experiment_started`, which PostHog requires by name".

### F2. Experiment exposure: guarded vs. unconditional

- **Location:** `.github/instructions/analytics.instructions.md:34–41` vs. `.github/prompts/add-ab-test.prompt.md:27–34`.
- **Evidence:** `analytics.instructions` fires `$experiment_started` only `if (variant)`. `add-ab-test` defaults to variant A with `?? variantA` and fires unconditionally, so users with no flag value get logged as control. Both come from the same commit. `PaywallModal` follows `add-ab-test`.
- **Decision needed:** Should users without a flag assignment count as exposed to control? The two files should agree whichever way that goes.

### F3 (low). Narrative-arc table is duplicated and overlaps at turn 20

- **Location:** `.github/copilot-instructions.md:87–98` and `.github/instructions/game-engine.instructions.md:94–105`.
- **Evidence:** The wording differs, but the two tables agree in substance. Under keep-list item 8 (duplicates that agree), they are working redundancy and left alone. Both tables, however, put turn 20 in two phases: `13–20` and `20+`.
- **Action:** Optional. Decide whether turn 20 is Crisis or Survival, for example by changing the last phase to `21+`, and fix both tables.

## Kept on purpose

- The GSAP section in the always-loaded `copilot-instructions.md` duplicates the path-scoped GSAP files. They agree, so this is working redundancy and is kept.
- Verified accurate and kept:
  - Color tokens, font mapping, CSS class list, and `image-rendering` rule.
  - `CRISIS_THRESHOLDS`.
  - `DIFFICULTY_MODIFIERS`: 0.5 / 1.0 / 1.3 / 1.6, and `lifelineGuaranteeEvery` 3 / 6 / 10 / 99.
  - `CARD_WEIGHT_DECAY_WINDOW`.
  - The `drawCard(state, rng, forceLifeline)` lifeline behaviour.
  - The events array table.
  - The `es` / `en` exports, `React.lazy` in `App.tsx`, and the workspace test command.
- The historical card-design rules, the FT/BBC translation style, and the A/B "one variable at a time" and "never 100%" rules all carry reasons and are kept.

## Out of scope, noted

- Compiled `.js` / `.d.ts` files are committed alongside sources in `apps/web/src`. That is not a prompt issue, but it adds noise to searches that Copilot runs over the tree.

## Verification (Step 7)

- Each high-confidence claim was checked against the current source files at HEAD; the file and line references are in the Evidence fields above.
- The diff was generated from scratch copies and checked with `git apply --check` from the repository root. It applies cleanly.
- Every hunk maps to one finding. The exceptions are the adjacent H8/H9 lines, which share one hunk, and H2, which spans several hunks of the same rewrite.
- Flags F1–F3 are not in the diff.

## Resolution (applied 2026-10-07)

All high- and medium-confidence findings (H1–H13, M1–M3) were applied to `.github/` as proposed. The flags were resolved in the documentation to match the current code:

- **F1:** Option (a) was applied. `apps/web/src/lib/analytics.ts` now exports `trackExperimentStarted({ experiment, variant })`, and `PaywallModal.tsx` and `GameScreen.tsx` call it instead of `posthog.capture('$experiment_started', …)`. The same changes were mirrored into the committed compiled `analytics.js`, `PaywallModal.js`, and `GameScreen.js`, so behaviour is the same whichever file Vite loads. The "never call `posthog.capture()` directly" rule now holds without exceptions, and `analytics.instructions.md`, `copilot-instructions.md`, and `add-ab-test.prompt.md` show the wrapper. Verified with `npm run type-check --workspace=apps/web` and `npm run build --workspace=apps/web`; both pass.
- **F2:** `analytics.instructions.md` now matches `add-ab-test` and the code: unassigned users fall back to the control variant and are logged as control. The example's default `'after_game_over'` matches `GameScreen.tsx:68`.
- **F3:** The Survival phase now starts at turn 21 in both narrative-arc tables.
- Also corrected: the `trackPaywallShown` listing in `analytics.instructions.md` now shows the optional `ab_variant`.
