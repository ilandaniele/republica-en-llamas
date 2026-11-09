export function canUseRunModes(config: Record<string, unknown>, entitlements: readonly string[]): boolean {
  if (entitlements.includes('full_access')) return true;
  return (
    (!config.crisisExpress || entitlements.includes('mode_crisis_express')) &&
    (!config.scenarioId || entitlements.includes('mode_historical'))
  );
}

export const PRICE_BY_ENTITLEMENT: Readonly<Record<string, string>> = {
  presidents_pack: 'price_1TAaidPF04vzkOdostTuqofY',
  opposition_pack: 'price_1TAaiePF04vzkOdov9PYjTPH',
  mode_crisis_express: 'price_1TAaifPF04vzkOdobJK1JkzZ',
  mode_historical: 'price_1TAaigPF04vzkOdoScRGh38p',
  remove_ads: 'price_1TAaitPF04vzkOdoRGSvTlO1',
  full_access: 'price_1TAaiuPF04vzkOdowvUxpkCL',
};

export function neutralUsername(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return `jugador_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}
