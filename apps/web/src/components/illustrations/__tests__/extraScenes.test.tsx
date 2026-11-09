import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { selectScene } from '../event-scenes/selectScene.js';
import { ScenarioIllustration } from '../ScenarioIllustration.js';
import { SCENARIO_IMAGES } from '../event-scenes/scenarioImages.js';
import manifest from '../../../assets/image-manifest.json';

vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));

describe('expanded scene coverage', () => {
  it.each([
    ['new_001', 'eco_drought'],
    ['new_002', 'eco_corte_luz'],
    ['new_003', 'eco_cyberattack'],
    ['new_005', 'eco_lithium'],
    ['new_008', 'soc_housing'],
    ['new_009', 'eco_automation'],
    ['new_010', 'soc_flood'],
  ])('uses the actual subject for event %s', (eventId, expected) => {
    expect(selectScene('economic', eventId!, null)).toBe(expected);
  });

  it.each(Object.keys(SCENARIO_IMAGES) as (keyof typeof SCENARIO_IMAGES)[])(
    'shows imported artwork and animation effects in the scenario card %s',
    (id) => {
      const sceneId = SCENARIO_IMAGES[id]!;
      const { container } = render(<ScenarioIllustration id={id} />);
      expect(container.querySelector('image')).toHaveAttribute(
        'href',
        (manifest as Record<string, string>)[sceneId],
      );
      expect(container.querySelector('.raster-effects')).not.toBeNull();
    },
  );
});
