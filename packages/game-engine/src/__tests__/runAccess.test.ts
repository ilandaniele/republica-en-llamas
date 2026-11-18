import { describe, expect, it } from 'vitest';
import { HISTORICAL_SCENARIOS } from '../constants.js';
import { canStartRun } from '../entitlements.js';
import { MAX_RANKED_RUN_DECISIONS, MAX_RUN_DECISIONS, normalizeDecision } from '../runValidation.js';
import type { TurnDecision } from '../run.js';
import type { ScenarioId } from '../types.js';

const scenarioIds = Object.keys(HISTORICAL_SCENARIOS) as ScenarioId[];
const fullAccessScenarios = scenarioIds.filter(
  (id) => HISTORICAL_SCENARIOS[id].entitlementRequired === 'full_access',
);
const historicalScenarios = scenarioIds.filter(
  (id) => HISTORICAL_SCENARIOS[id].entitlementRequired === 'mode_historical',
);

describe('canStartRun', () => {
  it('lets anyone start a free configuration', () => {
    expect(canStartRun({ presidentId: 'milei' }, [])).toBe(true);
    expect(canStartRun({}, [])).toBe(true);
  });

  it('requires the matching entitlement for presidents and crisis express', () => {
    expect(canStartRun({ presidentId: 'bullrich' }, [])).toBe(false);
    expect(canStartRun({ presidentId: 'bullrich' }, ['presidents_pack'])).toBe(true);
    expect(canStartRun({ crisisExpress: true }, ['mode_historical'])).toBe(false);
    expect(canStartRun({ crisisExpress: true }, ['mode_crisis_express'])).toBe(true);
  });

  it('keeps the three full_access scenarios out of mode_historical', () => {
    expect(fullAccessScenarios).toHaveLength(3);
    for (const scenarioId of fullAccessScenarios) {
      expect(canStartRun({ scenarioId }, ['mode_historical'])).toBe(false);
      expect(canStartRun({ scenarioId }, ['full_access'])).toBe(true);
    }
    for (const scenarioId of historicalScenarios) {
      expect(canStartRun({ scenarioId }, [])).toBe(false);
      expect(canStartRun({ scenarioId }, ['mode_historical'])).toBe(true);
    }
  });
});

describe('normalizeDecision', () => {
  it('keeps only known fields', () => {
    const padded = (decision: TurnDecision) =>
      ({ ...decision, padding: 'x'.repeat(1000) }) as unknown as TurnDecision;
    expect(normalizeDecision(padded({ kind: 'choice', cardId: 'pol_001', choiceIndex: 2 }))).toEqual({
      kind: 'choice',
      cardId: 'pol_001',
      choiceIndex: 2,
    });
    expect(normalizeDecision(padded({ kind: 'timeout', cardId: 'pol_001' }))).toEqual({
      kind: 'timeout',
      cardId: 'pol_001',
    });
    const congress = {
      kind: 'congress',
      cardId: 'law_001',
      decisions: { actions: ['cadena'], swingChoices: ['accept'], extra: 1 },
    } as unknown as TurnDecision;
    expect(normalizeDecision(padded(congress))).toEqual({
      kind: 'congress',
      cardId: 'law_001',
      decisions: { actions: ['cadena'], swingChoices: ['accept'] },
    });
  });
});

describe('ranked run length', () => {
  it('fits a full term plus lame duck and stays below the local replay cap', () => {
    expect(MAX_RANKED_RUN_DECISIONS).toBe(58);
    expect(MAX_RANKED_RUN_DECISIONS).toBeLessThan(MAX_RUN_DECISIONS);
  });
});
