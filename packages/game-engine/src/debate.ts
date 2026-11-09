import type { ChoiceEffect, EventCard, GameState } from './types.js';
import { PRESIDENTIAL_ELECTION_TURN } from './constants.js';
import { canonicalPresident, PRESIDENT_IDS } from './presidents.js';
import { clamp, createRng } from './utils.js';

export const DEBATE_START_TURN = PRESIDENTIAL_ELECTION_TURN - 3;
export type DebateStrategy = 'defend' | 'counter' | 'challenge' | 'propose';
export type DebateTopic = 'personal' | 'economy' | 'credibility';
export interface DebateExchange {
  speaker: string;
  target: string;
  textKey: string;
}
export interface DebateResult {
  round: number;
  strategy: DebateStrategy;
  feedbackKey: string;
  points: number;
  popularityDelta: number;
  target?: string;
}
export interface DebateState {
  playerId: string;
  candidates: string[];
  scores: Record<string, number>;
  rounds: DebateResult[];
  outcome?: 'win' | 'draw' | 'loss';
  scoreBonus: number;
}
export interface DebateReply {
  strategy: DebateStrategy;
  textKey: string;
  feedbackKey: string;
  points: number;
  target?: string;
}
export interface DebateRound {
  round: number;
  topic: DebateTopic;
  standings: DebateState;
  exchanges: DebateExchange[];
  replies: DebateReply[];
  card: EventCard;
}

const STRATEGIES: DebateStrategy[] = ['defend', 'counter', 'challenge', 'propose'];
const TOPICS: DebateTopic[] = ['personal', 'economy', 'credibility'];

export const DEBATE_CARDS: EventCard[] = TOPICS.map((topic, index) => ({
  id: `pol_debate_${index + 1}`,
  category: 'political',
  titleKey: 'debate.title',
  bodyKey: `debate.topic.${topic}`,
  weight: 1,
  minTurn: DEBATE_START_TURN + index,
  maxTurn: DEBATE_START_TURN + index,
  choices: STRATEGIES.map((strategy) => ({
    id: `pol_debate_${index + 1}_${strategy}`,
    textKey: `debate.reply.${strategy}`,
    effects: {},
  })),
}));

function initialDebate(state: GameState): DebateState {
  const playerId = canonicalPresident(state.presidentId) ?? 'milei';
  const rng = createRng(state.seed + 83017);
  const opponents = PRESIDENT_IDS.filter((id) => id !== playerId);
  for (let i = opponents.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [opponents[i], opponents[j]] = [opponents[j]!, opponents[i]!];
  }
  const candidates = [playerId, ...opponents.slice(0, 3)];
  return {
    playerId,
    candidates,
    scores: Object.fromEntries(candidates.map((id) => [id, 50])),
    rounds: [],
    scoreBonus: 0,
  };
}

export function isDebateCard(id: string): boolean {
  return DEBATE_CARDS.some((card) => card.id === id);
}

function updateScores(debate: DebateState, changes: [string, number][]): DebateState {
  const scores = { ...debate.scores };
  for (const [id, delta] of changes) scores[id] = clamp(scores[id]! + delta, 0, 100);
  return { ...debate, scores };
}

function getReplies(
  state: GameState,
  topic: DebateTopic,
  standings: DebateState,
  attacker: string,
  challengeTarget: string,
): DebateReply[] {
  const defendWorks =
    topic === 'economy'
      ? state.economic.inflation < 30 && state.economic.publicDeficit < 55
      : state.political.mediaCredibility >= (topic === 'personal' ? 45 : 55);
  const points: Record<DebateStrategy, number> = {
    defend: defendWorks ? 9 : -6,
    counter: topic === 'personal' ? 8 : -5,
    challenge: standings.scores[challengeTarget]! > standings.scores[standings.playerId]! ? 7 : -5,
    propose: topic === 'economy' ? 8 : topic === 'credibility' ? 5 : -3,
  };
  return STRATEGIES.map((strategy) => ({
    strategy,
    textKey: `debate.reply.${strategy}`,
    feedbackKey: `debate.feedback.${strategy}.${points[strategy] > 0 ? 'good' : 'bad'}`,
    points: points[strategy],
    ...(strategy === 'counter'
      ? { target: attacker }
      : strategy === 'challenge'
        ? { target: challengeTarget }
        : {}),
  }));
}

export function getDebateRound(state: GameState): DebateRound | null {
  const index = state.turn - DEBATE_START_TURN;
  if (state.isGameOver || index < 0 || index >= TOPICS.length) return null;
  const previous = state.debate ?? initialDebate(state);
  if (previous.rounds.length !== index || previous.outcome) return null;
  const rivals = previous.candidates.filter((id) => id !== previous.playerId);
  const attacker = rivals[index]!;
  const other = rivals[(index + 1) % rivals.length]!;
  const third = rivals[(index + 2) % rivals.length]!;
  const topic = TOPICS[index]!;
  const rng = createRng(state.seed + state.turn * 917);
  const crossWinner = rng() < 0.5 ? other : third;
  const standings = updateScores(previous, [
    [crossWinner, 3],
    [crossWinner === other ? third : other, -2],
  ]);
  const leader = [...rivals].sort((a, b) => standings.scores[b]! - standings.scores[a]!)[0]!;
  const challengeTarget = leader === attacker ? other : leader;
  const replies = getReplies(state, topic, standings, attacker, challengeTarget);
  const offset = Math.floor(rng() * replies.length);
  const ordered = [...replies.slice(offset), ...replies.slice(0, offset)];
  const card: EventCard = {
    ...DEBATE_CARDS[index]!,
    choices: ordered.map((reply) => ({
      id: `pol_debate_${index + 1}_${reply.strategy}`,
      textKey: reply.textKey,
      effects: {
        popularityDelta: Math.round(reply.points / 2),
        mediaCredibilityDelta: reply.points > 0 ? 2 : -3,
      },
    })),
  };
  return {
    round: index + 1,
    topic,
    standings,
    exchanges: [
      { speaker: other, target: third, textKey: `debate.cross.${topic}` },
      { speaker: third, target: other, textKey: `debate.retort.${topic}` },
      {
        speaker: attacker,
        target: previous.playerId,
        textKey: `debate.attack.${topic}.${previous.playerId}`,
      },
    ],
    replies: ordered,
    card,
  };
}

function finishDebate(debate: DebateState): DebateState {
  const playerScore = debate.scores[debate.playerId]!;
  const rivalScore = Math.max(
    ...debate.candidates.filter((id) => id !== debate.playerId).map((id) => debate.scores[id]!),
  );
  const outcome = playerScore > rivalScore ? 'win' : playerScore === rivalScore ? 'draw' : 'loss';
  return { ...debate, outcome, scoreBonus: outcome === 'win' ? 60 : outcome === 'loss' ? -60 : 0 };
}

function getReplyScoreChanges(round: DebateRound, reply: DebateReply): [string, number][] {
  return [
    [round.standings.playerId, reply.points],
    [round.exchanges[2]!.speaker, reply.points < 0 ? 4 : -1],
    ...(reply.target && reply.points > 0 ? [[reply.target, -4] as [string, number]] : []),
  ];
}

export function resolveDebateReply(
  state: GameState,
  cardId: string,
  choiceIndex: number,
): {
  debate: DebateState;
  effects: ChoiceEffect;
} {
  const round = getDebateRound(state);
  const reply = round?.replies[choiceIndex];
  if (!round || round.card.id !== cardId || !Number.isInteger(choiceIndex) || !reply) {
    throw new Error('Invalid debate round or reply');
  }
  let debate = updateScores(round.standings, getReplyScoreChanges(round, reply));
  let popularityDelta = Math.round(reply.points / 2);
  if (round.round === TOPICS.length) {
    debate = finishDebate(debate);
    popularityDelta += debate.scoreBonus / 10;
  }
  return {
    debate: {
      ...debate,
      rounds: [
        ...debate.rounds,
        {
          round: round.round,
          strategy: reply.strategy,
          feedbackKey: reply.feedbackKey,
          points: reply.points,
          popularityDelta,
          ...(reply.target ? { target: reply.target } : {}),
        },
      ],
    },
    effects: { popularityDelta, mediaCredibilityDelta: reply.points > 0 ? 2 : -3 },
  };
}
