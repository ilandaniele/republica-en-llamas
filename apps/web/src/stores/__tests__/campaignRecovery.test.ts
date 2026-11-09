import { beforeAll, describe, expect, it } from 'vitest';
import {
  drawNextCard,
  endTurn,
  getElectionNight,
  initGame,
  resolveTurn,
  type GameState,
  type RunConfig,
  type TurnDecision,
} from '@republica/game-engine';
import { restoreGameStore } from '../restoreGameStore.js';
import { useGameStore } from '../gameStore.js';

interface CampaignCheckpoint {
  config: RunConfig;
  state: GameState;
  decisions: TurnDecision[];
}
const checkpoints: CampaignCheckpoint[] = [];

beforeAll(() => {
  for (let seed = 1; seed <= 60 && checkpoints.length < 2; seed++) {
    const config: RunConfig = { difficulty: 'easy', seed, presidentId: 'massa' };
    let state = initGame(config.difficulty, seed, 'es', undefined, config.presidentId);
    const decisions: TurnDecision[] = [];
    const candidateCheckpoints: CampaignCheckpoint[] = [];
    while (!state.isGameOver && state.turn < 40) {
      const card = drawNextCard(state);
      const values = card.choices.map((choice) => {
        if (choice.instantGameOver) return -Infinity;
        const e = choice.effects;
        return (
          (e.popularityDelta ?? 0) * 2 +
          (e.stabilityDelta ?? 0) * 2 +
          (e.marketConfidenceDelta ?? 0) +
          (e.foreignReservesDelta ?? 0) -
          (e.inflationDelta ?? 0) * 2 -
          (e.deficitDelta ?? 0) * 2
        );
      });
      const decision: TurnDecision = card.isLaw
        ? { kind: 'congress', cardId: card.id, decisions: { actions: [], swingChoices: [] } }
        : { kind: 'choice', cardId: card.id, choiceIndex: values.indexOf(Math.max(...values)) };
      state = endTurn(resolveTurn(state, card, decision).state);
      decisions.push(decision);
      if (!state.isGameOver && (state.turn === 38 || state.turn === 40)) {
        candidateCheckpoints.push({ config, state, decisions: [...decisions] });
      }
    }
    if (candidateCheckpoints.length === 2) checkpoints.push(...candidateCheckpoints);
  }
  expect(checkpoints).toHaveLength(2);
});

describe('campaign recovery', () => {
  it.each([38, 40])('restores turn %i from decisions, preserving debate and electoral geography', (turn) => {
    const checkpoint = checkpoints.find((item) => item.state.turn === turn)!;
    const preferences = { ...useGameStore.getState(), tutorialComplete: true, soundEnabled: false };
    const restored = restoreGameStore(
      {
        runConfig: checkpoint.config,
        decisions: checkpoint.decisions,
        gameState: { turn: 900, score: 999999 },
        currentCard: { id: 'fake-card' },
      },
      preferences,
    );
    expect(restored.gameState).toEqual(checkpoint.state);
    expect(restored.currentCard?.id).toBe(turn === 38 ? 'pol_debate_2' : 'pol_election_result');
    expect(restored.gameState?.debate?.rounds).toHaveLength(turn === 38 ? 1 : 3);
    expect(getElectionNight(restored.gameState!)).toEqual(getElectionNight(checkpoint.state));
    expect(restored.tutorialComplete).toBe(true);
    expect(restored.soundEnabled).toBe(false);
    expect(restored.pendingChoiceIndex).toBeNull();
    expect(restored.saveRecoveryMessage).toBeNull();
  });
});
