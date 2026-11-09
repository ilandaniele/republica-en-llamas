import { describe, expect, it, vi } from 'vitest';
const invoke = vi.hoisted(() => vi.fn());
vi.mock('../supabase.js', () => ({ supabase: { functions: { invoke } } }));
import { checkoutUrl, createCheckout } from '../checkout.js';

describe('checkout boundary', () => {
  it('accepts only a hosted Stripe checkout session', () => {
    expect(checkoutUrl('https://checkout.stripe.com/c/pay/cs_test_example#session')).toBe(
      'https://checkout.stripe.com/c/pay/cs_test_example#session',
    );
  });

  it.each([
    'javascript:alert(1)',
    'http://checkout.stripe.com/c/pay/cs_test_example',
    'https://checkout.stripe.com.attacker.test/c/pay/cs_test_example',
    'https://attacker.test/?next=https://checkout.stripe.com',
    'https://checkout.stripe.com@attacker.test/c/pay/cs_test_example',
    'https://attacker:secret@checkout.stripe.com/c/pay/cs_test_example',
    'https://checkout.stripe.com:8080/c/pay/cs_test_example',
    'https://checkout.stripe.com/other',
    '//checkout.stripe.com/c/pay/cs_test_example',
    null,
  ])('rejects an unsafe checkout target: %s', (target) => {
    expect(checkoutUrl(target)).toBeNull();
  });

  it('uses the configured Supabase client without accepting an API origin from input', async () => {
    invoke.mockResolvedValue({ data: { url: 'https://checkout.stripe.com/c/pay/cs_test' }, error: null });
    expect(await createCheckout('presidents_pack')).toBe('https://checkout.stripe.com/c/pay/cs_test');
    expect(invoke).toHaveBeenCalledWith('create-checkout', { body: { entitlement: 'presidents_pack' } });
  });

  it('does not reflect a backend error or navigate to an arbitrary response URL', async () => {
    invoke.mockResolvedValue({
      data: { url: 'https://attacker.test' },
      error: { message: 'private detail' },
    });
    await expect(createCheckout('presidents_pack')).rejects.toThrow('No se pudo iniciar el pago');
  });
});
