import { describe, expect, it } from 'vitest';
import { HISTORICAL_ART } from '../event-scenes/dedicatedArt.js';
import { SCENARIO_IMAGES, scenarioImage } from '../event-scenes/scenarioImages.js';
import { selectScene } from '../event-scenes/selectScene.js';
import manifest from '../../../assets/image-manifest.json';
import pack from '../../../../../../art/historical-art-pack.json';

const imported = (scene: string) => scene in manifest;

describe('historical scenario art', () => {
  it('has a generation spec for every historical card', () => {
    const scenes = Object.values(HISTORICAL_ART).map(({ scene }) => scene);
    expect(scenes).toHaveLength(34);
    for (const scene of scenes) expect(pack).toHaveProperty(scene);
  });

  it.each(Object.entries(HISTORICAL_ART))('uses the dedicated scene for %s only once imported', (id, art) => {
    const selected = selectScene(art.category, id, null);
    if (imported(art.scene)) expect(selected).toBe(art.scene);
    else expect(selected).not.toBe(art.scene);
  });

  it.each(['primavera_1983', 'crisis_campo_2008', 'corrida_2018', 'pandemia_2020'] as const)(
    'plans a cover for %s and keeps the shared scene until it is imported',
    (id) => {
      const cover = `scenario_${id}`;
      expect(pack).toHaveProperty(cover);
      expect(scenarioImage(id)).toBe(imported(cover) ? cover : SCENARIO_IMAGES[id]);
    },
  );
});
