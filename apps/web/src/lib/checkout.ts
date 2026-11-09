import type { EntitlementId } from '@republica/game-engine';
import { apiSend } from './api.js';

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
  const data = await apiSend<{ url?: unknown }>('create-checkout', { entitlement }).catch(() => null);
  const url = checkoutUrl(data?.url);
  if (!url) throw new Error('No se pudo iniciar el pago. Intentá nuevamente.');
  return url;
}
