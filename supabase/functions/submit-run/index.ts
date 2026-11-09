import {
  replayRun,
  isRunConfig,
  isTurnDecision,
  MAX_RUN_DECISIONS,
  canPlayPresident,
  isFree,
} from '../_shared/game-engine.js';
import {
  adminClient,
  authenticatedUser,
  corsHeaders,
  isUuid,
  jsonResponder,
  requestGuard,
  requestErrorResponse,
} from '../_shared/http.ts';
import { enforceIpRateLimit, enforceUserRateLimit } from '../_shared/rateLimit.ts';
import { readJsonBody, canUseRunModes, isRecord } from '../_shared/requestPolicy.ts';

type Json = Record<string, unknown>;

function isValidSubmission(body: unknown): body is { ticketId: string; config: Json; decisions: Json[] } {
  return (
    isRecord(body) &&
    isUuid(body.ticketId) &&
    isRunConfig(body.config) &&
    Array.isArray(body.decisions) &&
    body.decisions.length <= MAX_RUN_DECISIONS &&
    body.decisions.every(isTurnDecision)
  );
}

Deno.serve(async (req: Request) => {
  const headers = corsHeaders(req);
  const json = jsonResponder(headers);
  const rejected = requestGuard(req, headers, 262144);
  if (rejected) return rejected;
  try {
    await enforceIpRateLimit(req, 'submit-run');

    const user = await authenticatedUser(req);
    if (!user) return json({ error: 'Unauthorized' }, 401);
    if (user.isAnonymous) return json({ error: 'Sign in to save runs' }, 403);
    const userId = user.id;
    await enforceUserRateLimit(userId, 'submit-run');

    const body = await readJsonBody(req, 262144);
    if (!isValidSubmission(body)) return json({ error: 'Malformed run' }, 400);
    const { ticketId, config, decisions } = body;
    if (config.careerStart)
      return json({ error: 'Career runs use local progress, outside competitive rankings' }, 400);

    const admin = adminClient();
    const { data: ticket, error: ticketError } = await admin
      .from('run_tickets')
      .select('seed')
      .eq('id', ticketId)
      .eq('user_id', userId)
      .maybeSingle();
    if (ticketError) return json({ error: 'Could not verify run ticket' }, 503);
    if (!ticket || ticket.seed !== config.seed) return json({ error: 'Invalid run ticket' }, 403);

    const presidentId = typeof config.presidentId === 'string' ? config.presidentId : undefined;
    if ((presidentId && !isFree(presidentId)) || config.crisisExpress || config.scenarioId) {
      const { data: purchases, error } = await admin
        .from('user_entitlements')
        .select('entitlement')
        .eq('user_id', userId);
      if (error) return json({ error: 'Could not verify president access' }, 500);
      const entitlements = (purchases ?? []).map((p: { entitlement: string }) => p.entitlement);
      if (!canPlayPresident(presidentId, entitlements) || !canUseRunModes(config, entitlements)) {
        return json({ error: 'Run requires purchased access' }, 403);
      }
    }

    let finalState;
    try {
      finalState = replayRun(config, decisions);
    } catch {
      console.warn('submit-run rejected an invalid replay');
      return json({ error: 'Invalid run' }, 422);
    }
    if (!finalState.isGameOver) return json({ error: 'Run is not finished' }, 422);

    const { data: run, error: runError } = await admin.rpc('save_validated_run', {
      p_user_id: userId,
      p_ticket_id: ticketId,
      p_config: config,
      p_state: finalState,
      p_decisions: decisions,
    });
    if (runError || !run) {
      console.error('submit-run failed to save the run');
      return json({ error: 'Failed to save run' }, 500);
    }

    return json(run);
  } catch (error) {
    return requestErrorResponse(error, headers);
  }
});
