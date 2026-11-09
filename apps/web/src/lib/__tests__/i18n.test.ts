import { describe, expect, it } from 'vitest';
import { initI18n, i18n } from '../i18n.js';
import { es } from '@republica/game-engine/i18n/es';

describe('translation availability', () => {
  it('loads Spanish text for every default event option', async () => {
    localStorage.setItem('language', 'es');
    await initI18n();
    expect(i18n.t('event.geo_002.choice_c')).toBe(es['event.geo_002.choice_c']);
    expect(i18n.t('app.title')).toBe('República en Llamas');
  });

  it('keeps untranslated legacy English options readable through Spanish fallback', async () => {
    localStorage.setItem('language', 'en');
    await initI18n();
    expect(i18n.t('app.title')).toBe('Republic in Flames');
    expect(i18n.t('event.pol_001.choice_d')).toBe(es['event.pol_001.choice_d']);
    expect(i18n.t('event.geo_002.choice_c')).toBe('Fund integration with provinces and civil organizations');
  });
});
