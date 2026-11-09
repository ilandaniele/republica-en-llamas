import { describe, expect, it } from 'vitest';
import { drawNextCard, initGame } from '../gameLoop.js';
import { endTurn, replayRun, resolveTurn, type TurnDecision } from '../run.js';
import { PRESIDENT_IDS } from '../presidents.js';
import { HISTORICAL_SCENARIOS } from '../constants.js';
import type { Difficulty, ScenarioId } from '../types.js';

describe('complete release runs', () => {
  it.each(PRESIDENT_IDS)('handles all difficulties, historical scenarios and modes for %s', (presidentId) => {
    const scenarios: (ScenarioId | undefined)[] = [
      undefined,
      ...(Object.keys(HISTORICAL_SCENARIOS) as ScenarioId[]),
    ];
    for (const difficulty of ['easy', 'normal', 'hard', 'crisis'] as Difficulty[]) {
      for (const scenarioId of scenarios) {
        for (const crisisExpress of [false, true]) {
          const config = {
            difficulty,
            seed: 1234,
            presidentId,
            crisisExpress,
            ...(scenarioId ? { scenarioId } : {}),
          };
          let state = initGame(difficulty, config.seed, 'es', scenarioId, presidentId);
          const decisions: TurnDecision[] = [];
          while (!state.isGameOver && decisions.length < 60) {
            const card = drawNextCard(state);
            expect(!card.requiredPresident || card.requiredPresident === presidentId).toBe(true);
            const decision: TurnDecision = card.isLaw
              ? { kind: 'congress', cardId: card.id, decisions: { actions: [], swingChoices: [] } }
              : { kind: 'choice', cardId: card.id, choiceIndex: state.turn % card.choices.length };
            decisions.push(decision);
            state = endTurn(resolveTurn(state, card, decision, crisisExpress).state, crisisExpress);
          }
          expect(state.isGameOver).toBe(true);
          expect(Number.isFinite(state.score)).toBe(true);
          expect(replayRun(config, decisions)).toEqual(state);
          for (const value of [
            state.political.popularity,
            state.political.socialStability,
            state.economic.marketConfidence,
            state.economic.foreignReserves,
          ]) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(100);
          }
        }
      }
    }
  });
  it.each(PRESIDENT_IDS)('finishes and replays normal and express runs for %s', (presidentId) => {
    for (const crisisExpress of [false, true]) {
      for (const seed of [42, 117]) {
        const config = { difficulty: 'normal' as const, seed, presidentId, crisisExpress };
        let state = initGame(config.difficulty, seed, 'es', undefined, presidentId);
        const decisions: TurnDecision[] = [];
        while (!state.isGameOver && decisions.length < 60) {
          const card = drawNextCard(state);
          const decision: TurnDecision = card.isLaw
            ? {
                kind: 'congress',
                cardId: card.id,
                decisions: { actions: ['gobernadores'], swingChoices: [] },
              }
            : { kind: 'choice', cardId: card.id, choiceIndex: state.turn % card.choices.length };
          decisions.push(decision);
          state = endTurn(resolveTurn(state, card, decision, crisisExpress).state, crisisExpress);
        }
        expect(state.isGameOver).toBe(true);
        expect(Number.isFinite(state.score)).toBe(true);
        expect(replayRun(config, decisions)).toEqual(state);
        expect(state.presidentId).toBe(presidentId);
      }
    }
  });
});
