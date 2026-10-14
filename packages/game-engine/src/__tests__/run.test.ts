import { describe, expect, it } from 'vitest';
import { drawNextCard, initGame } from '../gameLoop.js';
import { CRISIS_EXPRESS_TURNS, endTurn, replayRun, resolveTurn } from '../run.js';
import type { RunConfig, TurnDecision } from '../run.js';
import type { EventCard } from '../types.js';

function firstChoiceDecision(card: EventCard): TurnDecision {
  return card.isLaw
    ? { kind: 'congress', cardId: card.id, decisions: { actions: [], swingChoices: [] } }
    : { kind: 'choice', cardId: card.id, choiceIndex: 0 };
}

function playUntilOver(config: RunConfig, maxTurns = 100): TurnDecision[] {
  const crisisExpress = config.crisisExpress ?? false;
  let state = initGame(config.difficulty, config.seed, config.language, config.scenarioId ?? undefined);
  const decisions: TurnDecision[] = [];
  while (!state.isGameOver && decisions.length < maxTurns) {
    const card = drawNextCard(state);
    const decision = firstChoiceDecision(card);
    decisions.push(decision);
    state = endTurn(resolveTurn(state, card, decision, crisisExpress).state, crisisExpress);
  }
  return decisions;
}

describe('replayRun', () => {
  const config: RunConfig = { seed: 1234, difficulty: 'normal' };

  it('reproduces the same final state from the same seed and decisions', () => {
    const decisions = playUntilOver(config);
    expect(replayRun(config, decisions)).toEqual(replayRun(config, decisions));
    expect(replayRun(config, decisions).isGameOver).toBe(true);
  });

  it('rejects a decision for a card that was not drawn', () => {
    expect(() => replayRun(config, [{ kind: 'choice', cardId: 'not_a_card', choiceIndex: 0 }])).toThrow();
  });

  it('rejects an out-of-range choice', () => {
    const card = drawNextCard(initGame(config.difficulty, config.seed));
    expect(() => replayRun(config, [{ kind: 'choice', cardId: card.id, choiceIndex: 99 }])).toThrow();
  });

  it('rejects decisions after the game is over', () => {
    const decisions = playUntilOver(config);
    expect(() => replayRun(config, [...decisions, decisions[0]!])).toThrow();
  });

  it('ends Crisis Express runs after the turn limit', () => {
    const expressConfig = { ...config, crisisExpress: true };
    const decisions = playUntilOver(expressConfig);
    expect(decisions.length).toBeLessThanOrEqual(CRISIS_EXPRESS_TURNS);
    expect(replayRun(expressConfig, decisions).isGameOver).toBe(true);
  });

  it('applies the timeout penalty before the worst choice', () => {
    const state = initGame(config.difficulty, config.seed);
    const card = drawNextCard(state);
    const timedOut = resolveTurn(state, card, { kind: 'timeout', cardId: card.id }).state;
    expect(timedOut.turn).toBe(state.turn);
    expect(timedOut.political.popularity).toBeLessThan(state.political.popularity);
  });
});
