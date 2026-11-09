import { describe, expect, it } from 'vitest';
import { ALL_CARDS, PRESIDENT_EXPANSION_ART } from '@republica/game-engine';
import { PRESIDENT_STORY_ART } from '../event-scenes/presidentStoryArt.js';
import { selectPresidentScene } from '../event-scenes/presidentScenes.js';

describe('personal presidential story artwork', () => {
  it('illustrates every new story with its own president in the appropriate setting', () => {
    const cards = ALL_CARDS.filter((c) => c.id.startsWith('pres_'));
    expect(cards).toHaveLength(100);
    expect(Object.keys(PRESIDENT_STORY_ART)).toHaveLength(100);
    for (const card of cards) {
      const context = PRESIDENT_STORY_ART[card.id];
      expect(context).toBeTruthy();
      expect(selectPresidentScene('eco_inflation', card.id, card.requiredPresident!)).toBe(
        `president_${card.requiredPresident}_${context}`,
      );
    }
    expect(selectPresidentScene('eco_inflation', 'pres_bregman_derechos', 'izquierda')).toBe(
      'president_bregman_press',
    );
  });

  it('maps all 1,200 expansion cards to existing artwork for the selected president', () => {
    const cards = ALL_CARDS.filter((card) => card.id.startsWith('exp_'));
    expect(cards).toHaveLength(1200);
    expect(Object.keys(PRESIDENT_EXPANSION_ART)).toHaveLength(1200);
    for (const card of cards) {
      const context = PRESIDENT_EXPANSION_ART[card.id];
      expect(context).toBeTruthy();
      expect(selectPresidentScene('eco_inflation', card.id, card.requiredPresident!)).toBe(
        `president_${card.requiredPresident}_${context}`,
      );
    }
    expect(selectPresidentScene('eco_inflation', 'exp_bregman_datos_personales', 'izquierda')).toBe(
      'president_bregman_congress',
    );
  });
});
