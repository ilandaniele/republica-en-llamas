import {
  adminClient,
  authenticatedUserId,
  corsHeaders,
  jsonResponder,
  requestGuard,
  requestErrorResponse,
} from '../_shared/http.ts';
import { enforceIpRateLimit, enforceUserRateLimit } from '../_shared/rateLimit.ts';
import { DAILY_TICKET_LIMIT } from '../_shared/runTickets.ts';

const SEED_RANGE = 1_000_000;

function randomSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] % SEED_RANGE;
}

Deno.serve(async (req: Request) => {
  const headers = corsHeaders(req);
  const json = jsonResponder(headers);
  const rejected = requestGuard(req, headers);
  if (rejected) return rejected;
  try {
    await enforceIpRateLimit(req, 'start-run');

    const userId = await authenticatedUserId(req);
    if (!userId) return json({ error: 'Unauthorized' }, 401);
    await enforceUserRateLimit(userId, 'start-run');

    const { data: tickets, error } = await adminClient().rpc('issue_run_ticket', {
      p_user_id: userId,
      p_seed: randomSeed(),
      p_daily_limit: DAILY_TICKET_LIMIT,
    });
    if (error) {
      console.error('start-run failed to issue a ticket');
      return json({ error: 'Failed to start run' }, 500);
    }
    const ticket = tickets?.[0];
    if (!ticket) return json({ error: 'Daily run limit reached' }, 429);

    return json(ticket);
  } catch (error) {
    return requestErrorResponse(error, headers);
  }
});
