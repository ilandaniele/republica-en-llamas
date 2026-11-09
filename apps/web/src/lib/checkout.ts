import type { EntitlementId } from '@republica/game-engine';
import { supabase } from './supabase.js';

export function checkoutUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== 'https:' ||
      url.hostname !== 'checkout.stripe.com' ||
      url.port !== '' ||
      url.username !== '' ||
      url.password !== '' ||
      !url.pathname.startsWith('/c/pay/')
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}

export async function createCheckout(entitlement: EntitlementId): Promise<string> {
  const { data, error } = await supabase.functions.invoke<{ url?: unknown }>('create-checkout', {
    body: { entitlement },
  });
  const url = checkoutUrl(data?.url);
  if (error || !url) throw new Error('No se pudo iniciar el pago. Intentá nuevamente.');
  return url;
}
