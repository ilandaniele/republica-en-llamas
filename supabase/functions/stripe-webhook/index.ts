import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { adminClient, isUuid } from '../_shared/http.ts';
import { readLimitedText, RequestError } from '../_shared/requestPolicy.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', { apiVersion: '2024-04-10' });
const supabase = adminClient();

// Must mirror EntitlementId in packages/game-engine/src/entitlements.ts.
const KNOWN_ENTITLEMENTS = new Set([
  'presidents_pack',
  'opposition_pack',
  'mode_crisis_express',
  'mode_historical',
  'remove_ads',
  'full_access',
]);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

async function grantEntitlement(session: Stripe.Checkout.Session): Promise<Response> {
  const userId = session.metadata?.['userId'];
  const entitlement = session.metadata?.['entitlement'];
  if (
    session.payment_status !== 'paid' ||
    !isUuid(userId) ||
    !entitlement ||
    !KNOWN_ENTITLEMENTS.has(entitlement)
  ) {
    return json({ received: true, granted: false });
  }

  const { error } = await supabase.from('user_entitlements').upsert(
    {
      user_id: userId,
      entitlement,
      stripe_session_id: session.id,
      platform: 'web',
      purchased_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,entitlement' },
  );
  // A 5xx makes Stripe retry delivery, so a transient DB failure does not lose a purchase.
  if (error) {
    console.error('grantEntitlement failed');
    return json({ error: 'Database error' }, 500);
  }
  return json({ received: true, granted: true });
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const sig = req.headers.get('stripe-signature') ?? '';
  if (!sig) return json({ error: 'Invalid signature' }, 400);
  let rawBody: string;
  try {
    rawBody = await readLimitedText(req, 262144);
  } catch (error) {
    return json(
      { error: error instanceof RequestError ? error.message : 'Invalid request' },
      error instanceof RequestError ? error.status : 400,
    );
  }
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';
  if (!webhookSecret) return json({ error: 'Webhook unavailable' }, 503);

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, webhookSecret);
  } catch {
    return json({ error: 'Invalid signature' }, 400);
  }

  if (event.type === 'checkout.session.completed') {
    return grantEntitlement(event.data.object as Stripe.Checkout.Session);
  }
  return json({ received: true });
});
