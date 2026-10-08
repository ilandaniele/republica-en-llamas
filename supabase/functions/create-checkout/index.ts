import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', { apiVersion: '2024-04-10' });
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const WEB_URL = Deno.env.get('WEB_URL') ?? 'https://republica-en-llamas.fly.dev';

// Server-side price allowlist. Must mirror ENTITLEMENT_PRODUCTS[*].stripePriceId in
// packages/game-engine/src/entitlements.ts. The client never chooses the price.
const PRICE_BY_ENTITLEMENT: Record<string, string> = {
  presidents_pack: 'price_1TAaidPF04vzkOdostTuqofY',
  opposition_pack: 'price_1TAaiePF04vzkOdov9PYjTPH',
  mode_crisis_express: 'price_1TAaifPF04vzkOdobJK1JkzZ',
  mode_historical: 'price_1TAaigPF04vzkOdoScRGh38p',
  remove_ads: 'price_1TAaitPF04vzkOdoRGSvTlO1',
  full_access: 'price_1TAaiuPF04vzkOdowvUxpkCL',
};

function corsHeaders(req: Request) {
  const origin = req.headers.get('Origin') ?? '';
  const allowed = origin === WEB_URL || origin.startsWith('http://localhost:');
  return {
    'Access-Control-Allow-Origin': allowed ? origin : WEB_URL,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    Vary: 'Origin',
  };
}

async function authenticatedUserId(req: Request): Promise<string | null> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data } = await supabase.auth.getUser(token);
  return data.user?.id ?? null;
}

Deno.serve(async (req: Request) => {
  const headers = corsHeaders(req);
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
  if (req.method === 'OPTIONS') return new Response('ok', { headers });

  const userId = await authenticatedUserId(req);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const { entitlement } = (await req.json().catch(() => ({}))) as { entitlement?: string };
  const priceId = entitlement ? PRICE_BY_ENTITLEMENT[entitlement] : undefined;
  if (!entitlement || !priceId) return json({ error: 'Unknown entitlement' }, 400);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${WEB_URL}/?purchase_success=1&entitlement=${encodeURIComponent(entitlement)}`,
      cancel_url: `${WEB_URL}/?purchase_cancel=1`,
      metadata: { userId, entitlement },
    });
    return json({ url: session.url });
  } catch (err) {
    console.error('create-checkout failed', err);
    return json({ error: 'Checkout unavailable' }, 502);
  }
});
