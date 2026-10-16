import { replayRun } from '../_shared/game-engine.js';
import { adminClient, authenticatedUserId, corsHeaders, jsonResponder } from '../_shared/http.ts';

const MAX_DECISIONS = 200;
const UNIQUE_VIOLATION = '23505';
const DIFFICULTIES = new Set(['easy', 'normal', 'hard', 'crisis']);
const LANGUAGES = new Set(['es', 'en']);
const SWING_CHOICES = new Set(['accept', 'refuse', 'decide']);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Json = Record<string, unknown>;

const isObject = (value: unknown): value is Json => typeof value === 'object' && value !== null;
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

function isValidConfig(config: unknown): boolean {
  if (!isObject(config)) return false;
  return (
    Number.isSafeInteger(config.seed) &&
    (config.seed as number) >= 0 &&
    DIFFICULTIES.has(config.difficulty as string) &&
    LANGUAGES.has(config.language as string) &&
    (config.scenarioId === undefined ||
      config.scenarioId === null ||
      typeof config.scenarioId === 'string') &&
    typeof config.crisisExpress === 'boolean'
  );
}

function isValidDecision(decision: unknown): boolean {
  if (!isObject(decision) || typeof decision.cardId !== 'string') return false;
  switch (decision.kind) {
    case 'choice':
      return Number.isSafeInteger(decision.choiceIndex);
    case 'timeout':
      return true;
    case 'congress': {
      const congress = decision.decisions;
      return (
        isObject(congress) &&
        isStringArray(congress.actions) &&
        isStringArray(congress.swingChoices) &&
        congress.swingChoices.every((choice) => SWING_CHOICES.has(choice))
      );
    }
    default:
      return false;
  }
}

function isValidSubmission(body: unknown): body is { ticketId: string; config: Json; decisions: Json[] } {
  return (
    isObject(body) &&
    typeof body.ticketId === 'string' &&
    UUID_PATTERN.test(body.ticketId) &&
    isValidConfig(body.config) &&
    Array.isArray(body.decisions) &&
    body.decisions.length <= MAX_DECISIONS &&
    body.decisions.every(isValidDecision)
  );
}

Deno.serve(async (req: Request) => {
  const headers = corsHeaders(req);
  const json = jsonResponder(headers);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });

  const userId = await authenticatedUserId(req);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const body = await req.json().catch(() => null);
  if (!isValidSubmission(body)) return json({ error: 'Malformed run' }, 400);
  const { ticketId, config, decisions } = body;

  const admin = adminClient();
  const { data: ticket } = await admin
    .from('run_tickets')
    .select('seed')
    .eq('id', ticketId)
    .eq('user_id', userId)
    .maybeSingle();
  if (!ticket || ticket.seed !== config.seed) return json({ error: 'Invalid run ticket' }, 403);

  let finalState;
  try {
    finalState = replayRun(config, decisions);
  } catch (err) {
    console.warn('submit-run rejected an invalid replay', (err as Error).message);
    return json({ error: 'Invalid run' }, 422);
  }
  if (!finalState.isGameOver) return json({ error: 'Run is not finished' }, 422);

  const { data: run, error: runError } = await admin
    .from('game_runs')
    .insert({
      user_id: userId,
      ticket_id: ticketId,
      difficulty: finalState.difficulty,
      seed: finalState.seed,
      score: finalState.score,
      turns_survived: finalState.turn,
      game_over_reason: finalState.gameOverReason,
      is_win: finalState.gameOverReason === 'term_complete',
      final_state: finalState,
      language: finalState.language,
      crisis_express: config.crisisExpress,
      scenario_id: config.scenarioId ?? null,
      decisions,
      completed_at: new Date().toISOString(),
    })
    .select('id, score')
    .single();
  if (runError?.code === UNIQUE_VIOLATION) {
    return json({ id: null, score: finalState.score, duplicate: true });
  }
  if (runError || !run) {
    console.error('submit-run failed to save the run', runError);
    return json({ error: 'Failed to save run' }, 500);
  }

  if (finalState.history.length > 0) {
    const events = finalState.history.map((event: Json) => ({
      run_id: run.id,
      turn_number: event.turn,
      card_id: event.cardId,
      choice_index: event.choiceIndex,
      negotiation: event.negotiationUsed ?? null,
      effects_json: event.effectsApplied,
    }));
    const { error: eventsError } = await admin.from('run_events').insert(events);
    if (eventsError) console.error('submit-run failed to save run events', eventsError);
  }

  return json(run);
});
