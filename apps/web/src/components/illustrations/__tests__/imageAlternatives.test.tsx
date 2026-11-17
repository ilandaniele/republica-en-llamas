import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EventIllustration } from '../EventIllustration.js';
import { PixelPortrait } from '../PixelPortrait.js';
import { ScenarioIllustration } from '../ScenarioIllustration.js';

vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));

const imageUrl = vi.hoisted(() => ({ current: null as string | null }));

vi.mock('../../../hooks/useGameImage.js', () => ({
  useGameImage: () => imageUrl.current,
}));

function labelledNodes(container: HTMLElement) {
  return container.querySelectorAll('[aria-label], [role="img"], img[alt]:not([alt=""])');
}

describe('illustration text alternatives', () => {
  beforeEach(() => {
    imageUrl.current = null;
  });

  describe('PixelPortrait', () => {
    it('is decorative by default and never exposes the internal id (svg)', () => {
      const { container } = render(<PixelPortrait id="ingeniero" />);
      expect(labelledNodes(container)).toHaveLength(0);
      expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
      expect(container.innerHTML).not.toContain('Retrato de');
    });

    it('is decorative by default (raster image)', () => {
      imageUrl.current = 'https://example.test/portrait.png';
      const { container } = render(<PixelPortrait id="populista" />);
      expect(container.querySelector('img')?.getAttribute('alt')).toBe('');
      expect(container.innerHTML).not.toContain('Retrato de');
    });

    it('uses the passed label on svg', () => {
      const { getByRole } = render(<PixelPortrait id="ingeniero" label="Javier Milei" />);
      expect(getByRole('img', { name: 'Javier Milei' })).toBeTruthy();
    });

    it('uses the passed label on raster image', () => {
      imageUrl.current = 'https://example.test/portrait.png';
      const { getByRole } = render(<PixelPortrait id="populista" label="Sergio Massa" />);
      expect(getByRole('img', { name: 'Sergio Massa' })).toBeTruthy();
    });
  });

  describe('EventIllustration', () => {
    it('is decorative by default and never exposes the category enum', () => {
      const { container } = render(<EventIllustration eventCategory="political" presidentId="milei" />);
      expect(labelledNodes(container)).toHaveLength(0);
      expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
      expect(container.innerHTML).not.toContain('political');
    });

    it('uses the passed label', () => {
      const { getByRole } = render(
        <EventIllustration eventCategory="political" presidentId="milei" label="Escena política" />,
      );
      expect(getByRole('img', { name: 'Escena política' })).toBeTruthy();
    });
  });

  describe('ScenarioIllustration', () => {
    it('is decorative by default and never exposes the scenario id', () => {
      const { container } = render(<ScenarioIllustration id="hiperinflacion_1989" />);
      expect(labelledNodes(container)).toHaveLength(0);
      expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
      expect(container.innerHTML).not.toContain('Escenario:');
    });

    it('uses the passed label', () => {
      const { getByRole } = render(
        <ScenarioIllustration id="hiperinflacion_1989" label="Hiperinflación de 1989" />,
      );
      expect(getByRole('img', { name: 'Hiperinflación de 1989' })).toBeTruthy();
    });
  });
});
