import { drawNextCard, endTurn, initGame, resolveTurn } from '../../packages/game-engine/src/index.js';
import type { Difficulty, GameState, RunConfig, TurnDecision } from '../../packages/game-engine/src/index.js';

const CONGRESS_DECISIONS = { actions: [], swingChoices: [] };

function candidateDecisions(card: ReturnType<typeof drawNextCard>): TurnDecision[] {
  if (card.isLaw) return [{ kind: 'congress', cardId: card.id, decisions: CONGRESS_DECISIONS }];
  return card.choices.map((_, choiceIndex) => ({ kind: 'choice', cardId: card.id, choiceIndex }));
}

function health(state: GameState): number {
  if (state.isGameOver && state.gameOverReason !== 'term_complete') return -Infinity;
  return state.political.popularity + state.political.socialStability + state.economic.marketConfidence;
}

export function playLongRun(config: RunConfig): { decisions: TurnDecision[]; state: GameState } {
  const crisisExpress = config.crisisExpress ?? false;
  let state = initGame(config.difficulty, config.seed, config.language, config.scenarioId ?? undefined);
  const decisions: TurnDecision[] = [];
  while (!state.isGameOver) {
    const card = drawNextCard(state);
    let best: { decision: TurnDecision; next: GameState } | null = null;
    for (const decision of candidateDecisions(card)) {
      const next = endTurn(resolveTurn(state, card, decision, crisisExpress).state, crisisExpress);
      if (!best || health(next) > health(best.next)) best = { decision, next };
    }
    if (!best) throw new Error(`No playable decision for ${card.id}`);
    decisions.push(best.decision);
    state = best.next;
  }
  return { decisions, state };
}

const isMain = process.argv[1]?.replaceAll('\\', '/').endsWith('scripts/security/play-run.ts');
if (isMain) {
  const seed = Number(process.argv[2] ?? 1);
  const difficulty = (process.argv[3] ?? 'easy') as Difficulty;
  const config: RunConfig = { seed, difficulty };
  const { decisions } = playLongRun(config);
  process.stdout.write(JSON.stringify({ config, decisions }));
}
