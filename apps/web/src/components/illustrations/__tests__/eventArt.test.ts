import { describe, expect, it } from 'vitest';
import { EVENT_ART } from '../event-scenes/eventArt.js';
import { selectScene } from '../event-scenes/selectScene.js';
import manifest from '../../../assets/image-manifest.json';
import { CARD_REGISTRY } from '@republica/game-engine';

describe('dedicated event illustrations', () => {
  it('plans 100 distinct scenes for 100 existing cards', () => {
    expect(Object.keys(EVENT_ART)).toHaveLength(100);
    expect(new Set(Object.values(EVENT_ART).map(({ scene }) => scene)).size).toBe(100);
    for (const id of Object.keys(EVENT_ART)) expect(CARD_REGISTRY.has(id)).toBe(true);
  });

  it.each(Object.entries(EVENT_ART))('selects the dedicated artwork for %s once imported', (id, art) => {
    const url = (manifest as Record<string, string>)[art.scene];
    if (url) {
      expect(selectScene(art.category, id, null)).toBe(art.scene);
      expect(url).toBe(`/illustrations/${art.scene}.webp`);
    } else {
      expect(selectScene(art.category, id, null)).not.toBe(art.scene);
    }
  });
});
