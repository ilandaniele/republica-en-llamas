import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', { apiVersion: '2024-04-10' });
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

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
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

async function grantEntitlement(session: Stripe.Checkout.Session): Promise<Response> {
  const userId = session.metadata?.['userId'];
  const entitlement = session.metadata?.['entitlement'];
  if (session.payment_status !== 'paid' || !userId || !entitlement || !KNOWN_ENTITLEMENTS.has(entitlement)) {
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
    console.error('grantEntitlement failed', error);
    return json({ error: 'Database error' }, 500);
  }
  return json({ received: true, granted: true });
}

Deno.serve(async (req: Request) => {
  const sig = req.headers.get('stripe-signature') ?? '';
  const rawBody = await req.text();
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

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
