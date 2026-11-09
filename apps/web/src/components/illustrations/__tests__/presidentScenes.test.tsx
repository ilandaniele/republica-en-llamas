import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import manifest from '../../../assets/image-manifest.json';
import { EventIllustration } from '../EventIllustration.js';
import {
  PRESIDENT_CONTEXTS,
  PRESIDENT_SCENE_IDS,
  selectPresidentScene,
} from '../event-scenes/presidentScenes.js';

vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));

const EVENTS = {
  office: 'party_peronista_obra',
  congress: 'session_law_001',
  press: 'pol_chain_002',
  diplomacy: 'int_001',
  crisis: 'guerra_001',
};

describe('president scene variants', () => {
  it.each(PRESIDENT_SCENE_IDS)('shows %s governing in every context', (presidentId) => {
    const { container, rerender } = render(
      <EventIllustration eventCategory="political" presidentId={presidentId} />,
    );
    for (const context of PRESIDENT_CONTEXTS) {
      const id = `president_${presidentId}_${context}`;
      expect((manifest as Record<string, string>)[id]).toBe(`/illustrations/${id}.webp`);
      rerender(
        <EventIllustration eventCategory="political" eventId={EVENTS[context]} presidentId={presidentId} />,
      );
      expect(container.querySelector('image')).toHaveAttribute('href', `/illustrations/${id}.webp`);
      expect(container.querySelector('.raster-effects [data-effect]')).not.toBeNull();
    }
  });

  it.each([
    ['ingeniero', 'milei'],
    ['populista', 'massa'],
    ['tecnocrata', 'bullrich'],
    ['izquierda', 'bregman'],
    ['federal', 'schiaretti'],
    ['corporativo', 'larreta'],
  ])('resolves the selection id %s', (alias, politician) => {
    expect(selectPresidentScene('pol_veto', '', alias!)).toBe(`president_${politician}_office`);
  });

  it('retains citizens, disaster and historical event illustrations', () => {
    for (const [scene, event] of [
      ['soc_flood', 'new_010'],
      ['event_eco_001', 'eco_001'],
      ['event_con_003', 'con_003'],
      ['event_scn_005', 'scn_005'],
      ['guerra_nuke_explosion', 'guerra_003'],
    ]) {
      expect(selectPresidentScene(scene!, event!, 'cristina')).toBe(scene);
    }
    expect(selectPresidentScene('pol_veto', '', 'unknown')).toBe('pol_veto');
  });

  it('switches president without retaining the previous image', () => {
    const { container, rerender } = render(
      <EventIllustration eventCategory="political" eventId="party_pro_apertura" presidentId="macri" />,
    );
    expect(container.querySelector('image')).toHaveAttribute(
      'href',
      '/illustrations/president_macri_office.webp',
    );
    rerender(
      <EventIllustration eventCategory="political" eventId="party_pro_apertura" presidentId="del_cano" />,
    );
    expect(container.querySelector('image')).toHaveAttribute(
      'href',
      '/illustrations/president_del_cano_office.webp',
    );
  });
});
