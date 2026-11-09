import {
  adminClient,
  authenticatedUser,
  corsHeaders,
  isUuid,
  jsonResponder,
  userFromToken,
  requestGuard,
  requestErrorResponse,
} from '../_shared/http.ts';
import { DAILY_TICKET_LIMIT, FREE_DAILY_TICKET_LIMIT } from '../_shared/runTickets.ts';
import { enforceIpRateLimit, enforceUserRateLimit } from '../_shared/rateLimit.ts';
import { isRecord, readJsonBody } from '../_shared/requestPolicy.ts';

Deno.serve(async (req: Request) => {
  const headers = corsHeaders(req);
  const json = jsonResponder(headers);
  const rejected = requestGuard(req, headers, 16384);
  if (rejected) return rejected;
  try {
    await enforceIpRateLimit(req, 'claim-run-ticket');

    const user = await authenticatedUser(req);
    if (!user || user.isAnonymous) return json({ error: 'Unauthorized' }, 401);
    await enforceUserRateLimit(user.id, 'claim-run-ticket');

    const body = await readJsonBody(req, 16384);
    if (!isRecord(body) || typeof body.anonymousToken !== 'string' || !isUuid(body.ticketId)) {
      return json({ error: 'Malformed claim' }, 400);
    }

    const guest = await userFromToken(body.anonymousToken);
    if (!guest?.isAnonymous) return json({ error: 'Invalid guest session' }, 403);

    const { data: claimed, error } = await adminClient().rpc('claim_run_ticket', {
      p_ticket_id: body.ticketId,
      p_from_user: guest.id,
      p_to_user: user.id,
      p_daily_limit: DAILY_TICKET_LIMIT,
      p_free_daily_limit: FREE_DAILY_TICKET_LIMIT,
    });
    if (error) {
      console.error('claim-run-ticket failed to claim a ticket');
      return json({ error: 'Failed to claim run' }, 500);
    }
    if (!claimed) return json({ error: 'Run cannot be claimed' }, 409);

    return json({ claimed: true });
  } catch (error) {
    return requestErrorResponse(error, headers);
  }
});
