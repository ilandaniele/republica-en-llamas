import {
  canPlayPresident,
  isFree,
  isRunConfig,
  isTurnDecision,
  MAX_RUN_DECISIONS,
  replayRun,
} from '@republica/game-engine';
import type { RunConfig, TurnDecision } from '@republica/game-engine';
import { requireAccount, requireUser, userEntitlements } from '../context.js';
import type { RouteContext } from '../context.js';
import { isRecord, isUuid, json, readJsonBody, RequestError, sha256Hex } from '../http.js';
import { canUseRunModes } from '../policy.js';
import { enforceUserRateLimit } from '../rateLimit.js';
import { issueRunTicket } from '../tickets.js';

const SUBMIT_MAX_BYTES = 262_144;
const HISTORY_LIMIT = 20;
const HISTORY_EVENTS_LIMIT = 10;

interface Submission {
  ticketId: string;
  config: RunConfig;
  decisions: TurnDecision[];
}

function isSubmission(body: unknown): body is Submission {
  return (
    isRecord(body) &&
    isUuid(body.ticketId) &&
    isRunConfig(body.config) &&
    Array.isArray(body.decisions) &&
    body.decisions.length <= MAX_RUN_DECISIONS &&
    body.decisions.every(isTurnDecision)
  );
}

export async function startRun(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  await enforceUserRateLimit(ctx.env.DB, user.id, 'start-run');
  const ticket = await issueRunTicket(ctx.env.DB, user.id);
  if (!ticket) throw new RequestError(429, 'Daily run limit reached');
  return json({ ticketId: ticket.id, seed: ticket.seed });
}

async function assertRunAccess(db: D1Database, userId: string, config: Record<string, unknown>): Promise<void> {
  const presidentId = typeof config.presidentId === 'string' ? config.presidentId : undefined;
  if (!(presidentId && !isFree(presidentId)) && !config.crisisExpress && !config.scenarioId) return;
  const entitlements = await userEntitlements(db, userId);
  if (!canPlayPresident(presidentId, entitlements) || !canUseRunModes(config, entitlements))
    throw new RequestError(403, 'Run requires purchased access');
}

function replayFinished(config: RunConfig, decisions: TurnDecision[]) {
  let finalState;
  try {
    finalState = replayRun(config, decisions);
  } catch {
    throw new RequestError(422, 'Invalid run');
  }
  if (!finalState.isGameOver) throw new RequestError(422, 'Run is not finished');
  return finalState;
}

const INSERT_RUN_SQL = `insert into game_runs (id, user_id, ticket_id, difficulty, seed, score, turns_survived,
    game_over_reason, is_win, final_state, language, crisis_express, scenario_id, decisions, decisions_hash, completed_at)
  values (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)
  on conflict do nothing returning id, score`;

const INSERT_EVENTS_SQL = `insert into run_events (id, run_id, turn_number, card_id, choice_index, negotiation, effects_json)
  select lower(hex(randomblob(16))), ?1, event.value ->> '$.turn', event.value ->> '$.cardId',
    event.value ->> '$.choiceIndex', event.value ->> '$.negotiationUsed',
    coalesce(event.value -> '$.effectsApplied', '{}')
  from json_each(?2, '$.history') as event
  where exists (select 1 from game_runs where id = ?1)`;

const EXISTING_RUN_SQL = `select id, score from game_runs
  where user_id = ?1 and (ticket_id = ?2 or (seed = ?3 and decisions_hash = ?4))
  order by created_at limit 1`;

export async function submitRun(ctx: RouteContext): Promise<Response> {
  const db = ctx.env.DB;
  const user = await requireAccount(ctx, 'Sign in to save runs');
  await enforceUserRateLimit(db, user.id, 'submit-run');
  const body = await readJsonBody(ctx.request, SUBMIT_MAX_BYTES);
  if (!isSubmission(body)) throw new RequestError(400, 'Malformed run');
  const { ticketId, config, decisions } = body;
  const options = config as unknown as Record<string, unknown>;
  if (options.careerStart) throw new RequestError(400, 'Career runs use local progress, outside competitive rankings');

  const ticket = await db
    .prepare('select seed from run_tickets where id = ?1 and user_id = ?2')
    .bind(ticketId, user.id)
    .first<{ seed: number }>();
  if (!ticket || ticket.seed !== config.seed) throw new RequestError(403, 'Invalid run ticket');

  await assertRunAccess(db, user.id, options);
  const state = replayFinished(config, decisions);

  const stateJson = JSON.stringify(state);
  const decisionsJson = JSON.stringify(decisions);
  const decisionsHash = await sha256Hex(decisionsJson);
  const runId = crypto.randomUUID();
  const [inserted] = await db.batch<{ id: string; score: number }>([
    db
      .prepare(INSERT_RUN_SQL)
      .bind(
        runId,
        user.id,
        ticketId,
        state.difficulty,
        state.seed,
        state.score,
        state.turn,
        state.gameOverReason ?? null,
        state.gameOverReason === 'term_complete' ? 1 : 0,
        stateJson,
        state.language,
        options.crisisExpress ? 1 : 0,
        typeof options.scenarioId === 'string' ? options.scenarioId : null,
        decisionsJson,
        decisionsHash,
        new Date().toISOString(),
      ),
    db.prepare(INSERT_EVENTS_SQL).bind(runId, stateJson),
  ]);
  const run = inserted?.results[0];
  if (run) return json({ id: run.id, score: run.score });

  const existing = await db
    .prepare(EXISTING_RUN_SQL)
    .bind(user.id, ticketId, ticket.seed, decisionsHash)
    .first<{ id: string; score: number }>();
  if (!existing) throw new RequestError(409, 'Run conflict');
  return json({ id: existing.id, score: existing.score, duplicate: true });
}

interface HistoryRow {
  id: string;
  difficulty: string;
  turns_survived: number;
  created_at: string;
  game_over_reason: string | null;
  score: number;
  is_win: number;
  run_events: string;
  total: number;
}

const HISTORY_SQL = `select r.id, r.difficulty, r.turns_survived, r.created_at, r.game_over_reason, r.score, r.is_win,
    (select json_group_array(json_object('turn_number', e.turn_number, 'card_id', e.card_id,
        'choice_index', e.choice_index))
      from (select turn_number, card_id, choice_index from run_events
            where run_id = r.id order by turn_number limit ?3) as e) as run_events,
    count(*) over () as total
  from game_runs r where r.user_id = ?1
  order by r.created_at desc limit ?2`;

export async function listRuns(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const { results } = await ctx.env.DB.prepare(HISTORY_SQL)
    .bind(user.id, HISTORY_LIMIT, HISTORY_EVENTS_LIMIT)
    .all<HistoryRow>();
  const runs = results.map((row) => ({
    id: row.id,
    difficulty: row.difficulty,
    turns_survived: row.turns_survived,
    created_at: row.created_at,
    game_over_reason: row.game_over_reason,
    score: row.score,
    is_win: row.is_win === 1,
    run_events: JSON.parse(row.run_events) as unknown[],
  }));
  return json({ runs, total: results[0]?.total ?? 0 });
}
