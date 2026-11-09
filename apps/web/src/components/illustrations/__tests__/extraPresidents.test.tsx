import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PixelPortrait } from '../PixelPortrait.js';
import type { PortraitId, PortraitMood } from '../PixelPortrait.js';

vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));

describe('additional presidents', () => {
  it.each<PortraitId>(['nestor', 'cristina', 'macri', 'del_cano', 'kicillof', 'grabois'])(
    'renders the three animated moods of %s',
    (id) => {
      const { container, rerender } = render(<PixelPortrait id={id} />);
      for (const mood of ['neutral', 'panic', 'victory'] as PortraitMood[]) {
        rerender(<PixelPortrait id={id} mood={mood} />);
        expect(container.querySelector('img')).toHaveAttribute(
          'src',
          `/illustrations/portrait_${id}_${mood}.webp`,
        );
        expect(container.querySelector('img')).toHaveClass(
          'pixel-portrait-image',
          `pixel-portrait-image--${mood}`,
        );
      }
    },
  );
});
