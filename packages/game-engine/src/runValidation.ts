import { HISTORICAL_SCENARIOS } from './constants.js';
import { CONGRESS_ACTIONS, CONGRESS_ACTION_POINTS } from './congressSession.js';
import { isPresidentId } from './presidents.js';
import { isCareerStartOffice } from './career.js';
import type { RunConfig, TurnDecision } from './run.js';

export const MAX_RUN_DECISIONS = 200;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validCareerConfig(value: Record<string, unknown>): boolean {
  return (
    value.careerStart === undefined ||
    (isCareerStartOffice(value.careerStart) && !value.crisisExpress && !value.scenarioId)
  );
}

function validScenario(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && Object.hasOwn(HISTORICAL_SCENARIOS, value))
  );
}

export function isRunConfig(value: unknown): value is RunConfig {
  if (!isRecord(value)) return false;
  return (
    Number.isSafeInteger(value.seed) &&
    (value.seed as number) >= 0 &&
    ['easy', 'normal', 'hard', 'crisis'].includes(value.difficulty as string) &&
    validCareerConfig(value) &&
    (value.language === undefined || value.language === 'es' || value.language === 'en') &&
    (value.crisisExpress === undefined || typeof value.crisisExpress === 'boolean') &&
    (value.presidentId === undefined || isPresidentId(value.presidentId)) &&
    validScenario(value.scenarioId)
  );
}

export function isTurnDecision(value: unknown): value is TurnDecision {
  if (!isRecord(value) || typeof value.cardId !== 'string' || value.cardId.length > 160) return false;
  if (value.kind === 'timeout') return true;
  if (value.kind === 'choice')
    return (
      Number.isSafeInteger(value.choiceIndex) &&
      (value.choiceIndex as number) >= 0 &&
      (value.choiceIndex as number) < 4
    );
  if (value.kind !== 'congress' || !isRecord(value.decisions)) return false;
  const { actions, swingChoices } = value.decisions;
  return (
    Array.isArray(actions) &&
    actions.length <= CONGRESS_ACTION_POINTS + 1 &&
    actions.every((action) => typeof action === 'string' && Object.hasOwn(CONGRESS_ACTIONS, action)) &&
    Array.isArray(swingChoices) &&
    swingChoices.length <= 3 &&
    swingChoices.every((choice) => ['accept', 'refuse', 'decide'].includes(choice))
  );
}
