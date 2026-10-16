import { adminClient, authenticatedUserId, corsHeaders, jsonResponder } from '../_shared/http.ts';
import { DAILY_TICKET_LIMIT } from '../_shared/runTickets.ts';

const SEED_RANGE = 1_000_000;

function randomSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] % SEED_RANGE;
}

Deno.serve(async (req: Request) => {
  const headers = corsHeaders(req);
  const json = jsonResponder(headers);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });

  const userId = await authenticatedUserId(req);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const { data: tickets, error } = await adminClient().rpc('issue_run_ticket', {
    p_user_id: userId,
    p_seed: randomSeed(),
    p_daily_limit: DAILY_TICKET_LIMIT,
  });
  if (error) {
    console.error('start-run failed to issue a ticket', error);
    return json({ error: 'Failed to start run' }, 500);
  }
  const ticket = tickets?.[0];
  if (!ticket) return json({ error: 'Daily run limit reached' }, 429);

  return json(ticket);
});
