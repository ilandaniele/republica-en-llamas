import { adminClient, authenticatedUserId, corsHeaders, jsonResponder } from '../_shared/http.ts';

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

  const { data: ticket, error } = await adminClient()
    .from('run_tickets')
    .insert({ user_id: userId, seed: randomSeed() })
    .select('id, seed')
    .single();
  if (error || !ticket) {
    console.error('start-run failed to issue a ticket', error);
    return json({ error: 'Failed to start run' }, 500);
  }

  return json(ticket);
});
