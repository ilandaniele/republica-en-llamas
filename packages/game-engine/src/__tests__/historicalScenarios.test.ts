import { describe, expect, it } from 'vitest';
import { HISTORICAL_SCENARIOS, SCENARIO_ARCS, SCENARIO_CALENDARS, TOTAL_SEATS } from '../constants.js';
import { SCENARIO_OPENING_SHOCKS } from '../scenarioShocks.js';
import { ALL_CARDS } from '../index.js';
import { initGame } from '../gameLoop.js';
import { es } from '../i18n/es.js';
import { en } from '../i18n/en.js';
import type { ScenarioId } from '../types.js';

const scenarioIds = Object.keys(HISTORICAL_SCENARIOS) as ScenarioId[];

describe.each(scenarioIds)('historical scenario %s', (scenarioId) => {
  const config = HISTORICAL_SCENARIOS[scenarioId];

  it('has translated texts, a calendar and a narrative arc', () => {
    for (const key of [config.labelKey, config.periodKey, config.descriptionKey]) {
      expect(es[key]?.trim()).toBeTruthy();
      expect(en[key]?.trim()).toBeTruthy();
    }
    expect(SCENARIO_CALENDARS[scenarioId]).toBeDefined();
    expect(SCENARIO_ARCS[scenarioId]?.at(-1)?.maxTurn).toBe(50);
    expect(config.governmentSeats + config.oppositionSeats).toBeLessThanOrEqual(TOTAL_SEATS);
  });

  it('opens with two translated shocks', () => {
    const shocks = SCENARIO_OPENING_SHOCKS[scenarioId];
    expect(shocks).toHaveLength(2);
    for (const shock of shocks) {
      expect(es[shock.name]?.trim()).toBeTruthy();
      expect(en[shock.name]?.trim()).toBeTruthy();
    }
    const state = initGame('normal', 7, 'es', scenarioId);
    expect(state.activeShocks.map((shock) => shock.id)).toEqual(shocks.map((shock) => shock.id));
  });

  it('owns at least three scenario cards', () => {
    const cards = ALL_CARDS.filter((card) => card.requiredFlags?.includes(`scenario_${scenarioId}`));
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });
});
