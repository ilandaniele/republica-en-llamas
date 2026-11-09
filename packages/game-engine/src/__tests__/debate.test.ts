import { describe, expect, it } from 'vitest';
import { applyChoice, advanceTurn, drawNextCard, initGame } from '../gameLoop.js';
import { DEBATE_START_TURN, getDebateRound, resolveDebateReply } from '../debate.js';
import { canonicalPresident, PRESIDENT_IDS } from '../presidents.js';
import { calculateScore } from '../scoring.js';
import { calculateElectionResult } from '../congress.js';
import { endTurn, replayRun, resolveTurn, type TurnDecision } from '../run.js';
import { es } from '../i18n/es.js';
import { en } from '../i18n/en.js';
import { drawCard } from '../events/index.js';
import { createRng } from '../utils.js';
import type { GameState } from '../types.js';

function debateState(presidentId = 'milei', seed = 42): GameState {
  const state = initGame('normal', seed, 'es', undefined, presidentId);
  return {
    ...state,
    turn: DEBATE_START_TURN,
    political: { ...state.political, popularity: 60, mediaCredibility: 70, socialStability: 70 },
    economic: {
      ...state.economic,
      inflation: 15,
      publicDeficit: 25,
      marketConfidence: 70,
      foreignReserves: 70,
      currencyStrength: 70,
    },
  };
}

function playDebate(state: GameState, best: boolean): GameState {
  for (let i = 0; i < 3; i++) {
    const round = getDebateRound(state)!;
    const points = round.replies.map((reply) => reply.points);
    const index = points.indexOf(best ? Math.max(...points) : Math.min(...points));
    state = endTurn(
      resolveTurn(state, round.card, { kind: 'choice', cardId: round.card.id, choiceIndex: index }).state,
    );
  }
  return state;
}

describe('presidential debate', () => {
  it('settles a tie without awarding a win or loss bonus', () => {
    let state = debateState();
    for (let i = 0; i < 2; i++) state = advanceTurn(applyChoice(state, drawNextCard(state).id, 0));
    const debate = state.debate!;
    state = {
      ...state,
      debate: {
        ...debate,
        scores: Object.fromEntries(debate.candidates.map((id) => [id, id === debate.playerId ? 84 : 90])),
      },
    };
    const round = getDebateRound(state)!;
    const reply = round.replies.findIndex((choice) => choice.strategy === 'defend');
    const result = applyChoice(state, round.card.id, reply);
    expect(result.debate?.outcome).toBe('draw');
    expect(result.debate?.scoreBonus).toBe(0);
  });

  it('reports actual popularity after difficulty scaling and indicator limits', () => {
    const state = debateState();
    const high = { ...state, political: { ...state.political, popularity: 99 } };
    const round = getDebateRound(high)!;
    const result = applyChoice(
      high,
      round.card.id,
      round.replies.findIndex((reply) => reply.strategy === 'defend'),
    );
    expect(result.debate?.rounds[0]?.popularityDelta).toBe(1);
    const hard = { ...state, difficulty: 'hard' as const };
    const hardRound = getDebateRound(hard)!;
    const bad = applyChoice(
      hard,
      hardRound.card.id,
      hardRound.replies.findIndex((reply) => reply.strategy === 'propose'),
    );
    expect(bad.debate?.rounds[0]?.popularityDelta).toBeCloseTo(
      bad.political.popularity - hard.political.popularity,
    );
  });
  it.each(PRESIDENT_IDS)('supports %s with three different rivals and complete translations', (id) => {
    const round = getDebateRound(debateState(id))!;
    expect(round.standings.playerId).toBe(id);
    expect(new Set(round.standings.candidates).size).toBe(4);
    expect(round.exchanges.filter((exchange) => exchange.target === id)).toHaveLength(1);
    expect(
      round.exchanges.slice(0, 2).every((exchange) => exchange.target !== id && exchange.speaker !== id),
    ).toBe(true);
    expect(round.card.choices).toHaveLength(4);
    expect(new Set(round.replies.map((reply) => reply.strategy)).size).toBe(4);
    for (const dictionary of [es, en]) {
      for (const exchange of round.exchanges) expect(dictionary[exchange.textKey]).toBeTruthy();
      for (const reply of round.replies) {
        expect(dictionary[reply.textKey]).toBeTruthy();
        expect(dictionary[reply.feedbackKey]).toBeTruthy();
      }
    }
  });

  it('normalizes old character aliases and varies opponents with the seed', () => {
    expect(getDebateRound(debateState('ingeniero'))!.standings.playerId).toBe(
      canonicalPresident('ingeniero'),
    );
    expect(getDebateRound(debateState('milei', 42))).toEqual(getDebateRound(debateState('milei', 42)));
    const opponents = new Set(
      Array.from({ length: 8 }, (_, seed) =>
        getDebateRound(debateState('milei', seed))!.standings.candidates.join(','),
      ),
    );
    expect(opponents.size).toBeGreaterThan(1);
  });

  it('schedules the campaign, three debate rounds and then the election', () => {
    let state = { ...debateState(), turn: 36 };
    expect(drawNextCard(state).id).toBe('pol_election_campaign');
    state = { ...state, turn: 37 };
    for (let i = 1; i <= 3; i++) {
      const card = drawNextCard(state);
      expect(card.id).toBe(`pol_debate_${i}`);
      state = advanceTurn(applyChoice(state, card.id, 0));
    }
    expect(state.turn).toBe(40);
    expect(drawNextCard(state).id).toBe('pol_election_result');
  });

  it('never randomly draws an early election or debate', () => {
    const state = initGame('normal', 42);
    for (let seed = 0; seed < 150; seed++) {
      expect(drawCard(state, createRng(seed)).id).not.toMatch(/^pol_(election_result|debate_)/);
    }
  });

  it('rejects skipped rounds, repeated replies and replies outside the debate', () => {
    const state = debateState();
    expect(() => resolveDebateReply(state, 'pol_debate_2', 0)).toThrow();
    expect(() => resolveDebateReply(state, 'pol_debate_1', 4)).toThrow();
    expect(() => resolveDebateReply(state, 'pol_debate_1', 0.5)).toThrow();
    const answered = applyChoice(state, 'pol_debate_1', 0);
    expect(() => applyChoice(answered, 'pol_debate_1', 0)).toThrow();
    expect(() => applyChoice(initGame('normal', 42), 'pol_debate_1', 0)).toThrow();
  });

  it('makes counterattacks contextual and does not mutate economic indicators directly', () => {
    const personal = getDebateRound(debateState())!;
    expect(personal.replies.find((reply) => reply.strategy === 'counter')!.points).toBeGreaterThan(0);
    let state = advanceTurn(applyChoice(debateState(), personal.card.id, 0));
    const economic = getDebateRound(state)!;
    expect(economic.replies.find((reply) => reply.strategy === 'counter')!.points).toBeLessThan(0);
    const originalEconomy = { ...state.economic };
    state = applyChoice(state, economic.card.id, 0);
    expect(state.economic).toEqual(originalEconomy);
  });

  it('a weak record cannot be defended as successfully as a healthy one', () => {
    const healthy = debateState();
    healthy.turn = 38;
    const first = applyChoice(debateState(), 'pol_debate_1', 0);
    healthy.debate = first.debate!;
    const weak = { ...healthy, economic: { ...healthy.economic, inflation: 80, publicDeficit: 80 } };
    expect(
      getDebateRound(healthy)!.replies.find((reply) => reply.strategy === 'defend')!.points,
    ).toBeGreaterThan(0);
    expect(getDebateRound(weak)!.replies.find((reply) => reply.strategy === 'defend')!.points).toBeLessThan(
      0,
    );
  });

  it('allows a clear win or loss, changes popularity, and preserves a single score bonus', () => {
    const initial = debateState();
    const won = playDebate(initial, true);
    const lost = playDebate(initial, false);
    expect(won.debate?.outcome).toBe('win');
    expect(lost.debate?.outcome).toBe('loss');
    expect(won.political.popularity).toBeGreaterThan(initial.political.popularity);
    expect(lost.political.popularity).toBeLessThan(initial.political.popularity);
    expect(won.debate?.scoreBonus).toBe(60);
    expect(lost.debate?.scoreBonus).toBe(-60);
    expect(calculateScore(won) - calculateScore({ ...won, debate: { ...won.debate!, scoreBonus: 0 } })).toBe(
      60,
    );
    expect(
      calculateScore(lost) - calculateScore({ ...lost, debate: { ...lost.debate!, scoreBonus: 0 } }),
    ).toBe(-60);
    expect(won.debate?.rounds).toHaveLength(3);
    expect(won.score).toBe(calculateScore(won));
  });

  it('resolves the election from actual popularity, never from the requested win choice', () => {
    const state = { ...debateState(), turn: 40 };
    const weak = { ...state, political: { ...state.political, popularity: 30 } };
    const card = drawNextCard(weak);
    const lost = resolveTurn(weak, card, { kind: 'choice', cardId: card.id, choiceIndex: 0 });
    expect(lost.choiceIndex).toBe(1);
    expect(lost.state.lameDuckMode).toBe(true);
    const won = resolveTurn(state, card, { kind: 'choice', cardId: card.id, choiceIndex: 1 });
    expect(won.choiceIndex).toBe(0);
    expect(won.state.gameOverReason).toBe('term_complete');
    expect(won.state.political.popularity).toBeGreaterThan(state.political.popularity);
    expect(
      calculateElectionResult({
        ...weak,
        debate: { ...getDebateRound(debateState())!.standings, outcome: 'win', scoreBonus: 60 },
      }).won,
    ).toBe(false);
    expect(() => applyChoice(initGame('normal', 42), card.id, 0)).toThrow();
  });

  it('replays a complete surviving campaign, debate and election from decisions only', () => {
    let found = false;
    for (let seed = 1; seed <= 60 && !found; seed++) {
      const config = { difficulty: 'easy' as const, seed, presidentId: 'kicillof' };
      let state = initGame(config.difficulty, seed, 'es', undefined, config.presidentId);
      const decisions: TurnDecision[] = [];
      while (!state.isGameOver && state.turn <= 40) {
        const card = drawNextCard(state);
        const values = card.choices.map((choice) => {
          const e = choice.effects;
          return choice.instantGameOver
            ? -10000
            : (e.popularityDelta ?? 0) * 2 +
                (e.stabilityDelta ?? 0) * 2 +
                (e.marketConfidenceDelta ?? 0) +
                (e.foreignReservesDelta ?? 0) -
                (e.inflationDelta ?? 0) * 2 -
                (e.deficitDelta ?? 0) * 2;
        });
        const decision: TurnDecision = card.isLaw
          ? { kind: 'congress', cardId: card.id, decisions: { actions: [], swingChoices: [] } }
          : { kind: 'choice', cardId: card.id, choiceIndex: values.indexOf(Math.max(...values)) };
        decisions.push(decision);
        state = endTurn(resolveTurn(state, card, decision).state);
      }
      if (!state.debate?.outcome) continue;
      found = true;
      expect(decisions.filter((decision) => decision.cardId.startsWith('pol_debate_'))).toHaveLength(3);
      expect(replayRun(config, decisions)).toEqual(state);
      expect(decisions.at(-1)?.cardId).toBe('pol_election_result');
    }
    expect(found).toBe(true);
  });
});
