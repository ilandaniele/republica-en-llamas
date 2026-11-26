import { describe, expect, it } from 'vitest';
import { initI18n } from '../i18n.js';
import { shockLabel } from '../shockLabel.js';

describe('shockLabel', () => {
  it('translates historical scenario shocks', async () => {
    localStorage.setItem('language', 'es');
    await initI18n();
    expect(shockLabel('shock.rodrigazo.huelga')).toBe('HUELGA GENERAL');
    expect(shockLabel('shock.campo.paro')).toBe('PARO AGROPECUARIO');
  });

  it('keeps global shock names and falls back for unknown keys', () => {
    expect(shockLabel('shock.pandemic')).toBe('PANDEMIA');
    expect(shockLabel('shock.unknown.key')).toBe('UNKNOWN.KEY');
  });
});
