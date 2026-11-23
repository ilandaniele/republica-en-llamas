import { describe, expect, it, vi } from 'vitest';
const apiSend = vi.hoisted(() => vi.fn());
vi.mock('../api.js', () => ({ apiSend }));
import { checkoutUrl, createCheckout } from '../checkout.js';

describe('checkout boundary', () => {
  it.each(['c', 'g'])('accepts a hosted Stripe checkout session under /%s/pay/', (prefix) => {
    const target = `https://checkout.stripe.com/${prefix}/pay/cs_test_example#session`;
    expect(checkoutUrl(target)).toBe(target);
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
    'https://checkout.stripe.com/x/pay/cs_test_example',
    '//checkout.stripe.com/c/pay/cs_test_example',
    null,
  ])('rejects an unsafe checkout target: %s', (target) => {
    expect(checkoutUrl(target)).toBeNull();
  });

  it('posts to the same-origin API without accepting an API origin from input', async () => {
    apiSend.mockResolvedValue({ url: 'https://checkout.stripe.com/c/pay/cs_test' });
    expect(await createCheckout('presidents_pack')).toBe('https://checkout.stripe.com/c/pay/cs_test');
    expect(apiSend).toHaveBeenCalledWith('create-checkout', { entitlement: 'presidents_pack' });
  });

  it('does not reflect a backend error or navigate to an arbitrary response URL', async () => {
    apiSend.mockResolvedValueOnce({ url: 'https://attacker.test' });
    await expect(createCheckout('presidents_pack')).rejects.toThrow('No se pudo iniciar el pago');
    apiSend.mockRejectedValueOnce(new Error('private detail'));
    await expect(createCheckout('presidents_pack')).rejects.toThrow('No se pudo iniciar el pago');
  });
});
