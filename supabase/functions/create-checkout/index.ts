import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { authenticatedUserId, corsHeaders, jsonResponder, WEB_URL } from '../_shared/http.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', { apiVersion: '2024-04-10' });

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

Deno.serve(async (req: Request) => {
  const headers = corsHeaders(req);
  const json = jsonResponder(headers);
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
