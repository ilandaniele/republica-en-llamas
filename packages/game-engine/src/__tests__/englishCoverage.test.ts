import { describe, expect, it } from 'vitest';
import { ALL_CARDS } from '../index.js';
import { en } from '../i18n/en.js';

describe('English card text', () => {
  it('translates every card title, body and choice', () => {
    const missing = ALL_CARDS.flatMap((card) => [
      card.titleKey,
      card.bodyKey,
      ...card.choices.map((choice) => choice.textKey),
    ]).filter((key) => !en[key]?.trim());
    expect(missing).toEqual([]);
  });
});
