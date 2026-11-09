import { describe, expect, it } from 'vitest';
import { PRESIDENT_IDS } from '../presidents.js';
import { canPlayPresident, isFree, entitlementsForFeature, ENTITLEMENT_PRODUCTS } from '../entitlements.js';

describe('presidential access', () => {
  it('offers exactly Milei, Massa and Kicillof for free, including legacy aliases', () => {
    expect(PRESIDENT_IDS.filter((id) => canPlayPresident(id, []))).toEqual(['milei', 'massa', 'kicillof']);
    for (const id of ['ingeniero', 'populista', 'milei', 'massa', 'kicillof']) {
      expect(isFree(id)).toBe(true);
      expect(entitlementsForFeature(id)).toEqual([]);
    }
  });

  it.each(PRESIDENT_IDS)('unlocks %s only through a presidential entitlement when needed', (id) => {
    expect(canPlayPresident(id, ['presidents_pack'])).toBe(true);
    expect(canPlayPresident(id, ['full_access'])).toBe(true);
    expect(canPlayPresident(id, ['opposition_pack', 'mode_historical'])).toBe(isFree(id));
    if (!isFree(id)) expect(entitlementsForFeature(id)).toEqual(['presidents_pack', 'full_access']);
  });

  it('lists exactly the nine paid presidents and resolves old selection IDs', () => {
    const paid = PRESIDENT_IDS.filter((id) => !isFree(id));
    expect(paid).toHaveLength(9);
    expect(ENTITLEMENT_PRODUCTS.presidents_pack.unlocks).toEqual(paid);
    expect(entitlementsForFeature('izquierda')).toEqual(['presidents_pack', 'full_access']);
    expect(canPlayPresident('tecnocrata', [])).toBe(false);
    expect(canPlayPresident('tecnocrata', ['presidents_pack'])).toBe(true);
    expect(canPlayPresident('unknown', ['full_access'])).toBe(false);
    expect(canPlayPresident(undefined, [])).toBe(true);
  });
});
