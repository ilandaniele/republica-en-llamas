import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RasterSceneEffects } from '../event-scenes/RasterSceneEffects.js';
import { SCENES } from '../event-scenes/scenes.js';

describe('raster scene effects', () => {
  it.each(Object.keys(SCENES))('provides visible effect geometry for raster scene %s', (scene) => {
    const { container } = render(
      <svg>
        <RasterSceneEffects scene={scene} />
      </svg>,
    );
    expect(container.querySelectorAll('.raster-effect').length).toBeGreaterThan(0);
    expect(container.querySelector('.raster-effects')).toHaveAttribute('aria-hidden', 'true');
  });

  it('replaces celebration effects when the scene changes to unrest', () => {
    const { container, rerender } = render(
      <svg>
        <RasterSceneEffects scene="arg_mundial" />
      </svg>,
    );
    expect(container.querySelector('[data-effect="confetti"]')).not.toBeNull();
    rerender(
      <svg>
        <RasterSceneEffects scene="soc_unrest" />
      </svg>,
    );
    expect(container.querySelector('[data-effect="confetti"]')).toBeNull();
    expect(container.querySelector('[data-effect="smoke"]')).not.toBeNull();
    expect(container.querySelector('[data-effect="embers"]')).not.toBeNull();
  });
});
